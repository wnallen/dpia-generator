#!/usr/bin/env node
/**
 * run_regression.js — regression suite for build_dpia.js
 * (versioned with the skill; SKILL.md's ## Version section is canonical)
 *
 * Every case below is a defect that was actually shipped, or a gate that exists
 * to stop one. Run this after any change to build_dpia.js, references/risk-matrix.md,
 * or the manifest schema — the matrix mapping and the Article 36 flag are the two
 * things in this skill a reader cannot check by eye. The suite and the fixture
 * directory are kept in step mechanically: a case without a fixture fails, and
 * so does a fixture without a case.
 *
 *   node scripts/run_regression.js [--keep]
 *
 * Exit 0 if every case passes, 1 otherwise. --keep leaves the built .docx files
 * in the temp directory for inspection; the path is printed either way.
 *
 * Requires the `docx` package resolvable by build_dpia.js (globally installed in
 * the skills image; NODE_PATH works elsewhere). OOXML validation is left on:
 * a case that builds invalid XML should fail the suite, not pass quietly.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync, execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BUILDER = path.join(ROOT, 'scripts', 'build_dpia.js');
const FIXTURES = path.join(ROOT, 'tests', 'fixtures');

// text(doc) -> the document's visible runs, joined. Used for the content assertions.
function docText(docxPath) {
  const py = `
import sys, zipfile, re
x = zipfile.ZipFile(sys.argv[1]).read('word/document.xml').decode()
runs = [re.sub(r'<[^>]+>', '', s) for s in re.findall(r'<w:t[^>]*>(.*?)</w:t>', x, re.S)]
sys.stdout.write(' \\u2016 '.join(r.strip() for r in runs if r.strip()))`;
  return execFileSync('python3', ['-c', py, docxPath], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
}

function rawXml(docxPath) {
  const py = `
import sys, zipfile
sys.stdout.write(zipfile.ZipFile(sys.argv[1]).read('word/document.xml').decode())`;
  return execFileSync('python3', ['-c', py, docxPath], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
}

// footerText(doc) -> visible runs of every footer part, joined. The reviewer
// phrase lives in word/footer*.xml, which docText/rawXml never see.
function footerText(docxPath) {
  const py = `
import sys, zipfile, re
z = zipfile.ZipFile(sys.argv[1])
out = []
for n in z.namelist():
    if re.match(r'word/footer\\d*\\.xml$', n):
        x = z.read(n).decode()
        out += [re.sub(r'<[^>]+>', '', s) for s in re.findall(r'<w:t[^>]*>(.*?)</w:t>', x, re.S)]
sys.stdout.write(' \\u2016 '.join(r.strip() for r in out if r.strip()))`;
  return execFileSync('python3', ['-c', py, docxPath], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
}

const STAR = /‖\s*High \*\s*‖/;          // a starred rating cell in the register
const FOOTNOTE = /Article 36 prior consultation .* (is|are) engaged/;

const CASES = [
  {
    name: 'art36-positive',
    why: 'A Medium x High residual rates High and engages Art. 36. Shipped unflagged before v1.2.',
    exit: 0,
    check: (t) => [
      [STAR.test(t), 'register row is starred'],
      [FOOTNOTE.test(t), 'Art. 36 footnote rendered'],
      [/‖ R1 ‖/.test(t), 'R1 present in register'],
    ],
    noWarn: true,
  },
  {
    name: 'art36-negative',
    why: 'The flag must not leak into a DPIA with no High residual.',
    exit: 0,
    check: (t) => [
      [!STAR.test(t), 'no starred rating cell'],
      [!FOOTNOTE.test(t), 'no Art. 36 footnote'],
      [/AI-GENERATED DRAFT/.test(t), 'generation notice on the cover'],
    ],
    noWarn: true,
  },
  {
    name: 'art36-conditional',
    why: 'v4.0: a High residual whose post-mitigation score falls below High engages consultation only if the mitigations are not implemented; the conclusion is "conditional", not an unconditional required.',
    exit: 0,
    noWarn: true,
    check: (t) => [
      [STAR.test(t), 'High-residual row still starred'],
      [/engaged unless the Section 5 mitigations are implemented/.test(t), 'conditional footnote'],
      [/Post-mitigation/.test(t), 'post-mitigation register column present'],
      [/Low x High = Medium/.test(t), 'derived mitigated rating rendered'],
      [/Post-mitigation residual risk/.test(t), 'mitigated matrix rendered'],
      [/Prior consultation required unless the Section 5 mitigations are implemented/.test(t), 'conditional label in the engagement table'],
    ],
  },
  {
    name: 'art36-conditional-mismatch',
    why: 'v4.0: declaring an unconditional "required" when every High residual is mitigable below High overstates the obligation; the gate forces the honest conditional answer.',
    exit: 3,
    stderr: /derives "conditional"[\s\S]*consultation is avoidable/,
  },
  {
    name: 'rating-gate',
    why: 'A stated rating that contradicts the derived one is a scoring error, not a typo.',
    exit: 3,
    stderr: /RISK-RATING GATE FAILED/,
  },
  {
    name: 'conclusion-gate',
    why: 'The register may not contradict the declared Art. 36 conclusion.',
    exit: 3,
    stderr: /ARTICLE 36 CONCLUSION GATE FAILED/,
  },
  {
    name: 'art36-missing',
    why: 'A DPIA with a register must state its Art. 36 conclusion; silence is not an answer.',
    exit: 1,
    stderr: /"art36" is required/,
  },
  {
    name: 'narrative-contradiction',
    why: 'Prose asserting the opposite of the register is the defect a regulator reads first.',
    exit: 0,
    stderr: /narrative text appears to assert the opposite/,
  },
  {
    name: 'narrative-no-false-positive',
    why: 'A correct Art. 36 assertion often also contains an unrelated negation; block-level matching flagged it.',
    exit: 0,
    noWarn: true,
  },
  {
    name: 'status-mismatch',
    why: 'An engaged Art. 36 with a cover status that does not say so.',
    exit: 0,
    stderr: /"status" is "Draft"/,
  },
  {
    name: 'escaping',
    why: 'Vendor text reaches narrative fields; angle brackets must not break the OOXML.',
    exit: 0,
    checkXml: (x) => [
      [!x.includes('<script>'), 'no raw <script> in document.xml'],
      [x.includes('&lt;script&gt;'), 'escaped form present'],
      [x.includes('IGNORE PREVIOUS INSTRUCTIONS'), 'embedded instruction reported verbatim, not obeyed'],
    ],
  },
  {
    name: 'traversal',
    why: 'outputFilename must not write outside outputDir.',
    exit: 0,
    checkPath: (outPath, tmp) => [
      [path.dirname(path.resolve(outPath)) === path.resolve(tmp), 'output landed inside outputDir'],
      [!fs.existsSync(path.join(tmp, '..', 'ESCAPED.docx')), 'nothing written to the parent directory'],
    ],
  },
  {
    name: 'traversal-dotdot',
    why: 'outputFilename ".." survives basename() unchanged; it must fall back to the default name, not climb out of outputDir.',
    exit: 0,
    stderr: /is not a usable filename/,
    checkPath: (outPath, tmp) => [
      [path.dirname(path.resolve(outPath)) === path.resolve(tmp), 'output landed inside outputDir, not the parent'],
    ],
  },
  {
    name: 'outputdir-escape',
    why: 'A manifest outputDir outside the permitted roots must be refused before any write.',
    exit: 1,
    keepDir: true,
    stderr: /outside the permitted output roots/,
    checkFs: () => [
      [!fs.existsSync('/etc/dpia-escape-test-DEMO'), 'nothing written to the disallowed outputDir'],
    ],
  },
  { name: 'unknown-block', why: 'Unknown block types fail loudly.', exit: 1, stderr: /unknown block type/ },
  { name: 'bad-date', why: 'Date format is validated before anything is written.', exit: 1, stderr: /must be a real YYYY-MM-DD calendar date/ },
  {
    name: 'bad-calendar-date',
    why: 'v4.2.1: a regex-valid but non-calendar manifest "date" ("2026-02-31" rolls over to March 3rd in V8) shipped on the cover and turned the notice-staleness arithmetic into a silent NaN no-op — the defect class v4.1.1 fixed for notice.date, latent on manifest.date.',
    exit: 1,
    stderr: /"date" must be a real YYYY-MM-DD calendar date, got "2026-02-31"/,
  },
  { name: 'matrix-no-source', why: 'A matrix pointing at no register fails rather than rendering empty.', exit: 1, stderr: /no riskRegister named/ },
  {
    name: 'jurisdictions-unknown',
    why: 'An invented regime code must fail, not silently produce a document claiming coverage.',
    exit: 1,
    stderr: /unknown jurisdiction code "atlantis-dpa"/,
  },
  {
    name: 'jurisdictions-proto',
    why: 'v3.4.1: "__proto__" as a regime code resolved through the prototype chain, bypassing the unknown-code check and garbling the gate diagnosis.',
    exit: 1,
    stderr: /unknown jurisdiction code "__proto__"/,
  },
  {
    name: 'matrix-proto-source',
    why: 'v3.4.1: a matrix source of "constructor" resolved to Function via the prototype chain and crashed the builder with a stack trace instead of exit 1 (latent since v1.1).',
    exit: 1,
    stderr: /no riskRegister named "constructor"/,
  },
  {
    name: 'conclusions-missing-regime',
    why: 'v3.0: every declared jurisdiction needs a conclusion; declaring the EU one does not answer for the UK.',
    exit: 1,
    stderr: /regulatorConclusions\["uk-gdpr"\]/,
  },
  {
    name: 'conclusions-contradiction-regime',
    why: 'v3.0: a per-regime conclusion contradicting the register is the same defect the art36 gate stops, per regime.',
    exit: 3,
    stderr: /ARTICLE 36 CONCLUSION GATE FAILED[\s\S]*\[uk-gdpr\]/,
  },
  {
    name: 'regulator-conclusions-explicit',
    why: 'v3.0 schema without the legacy art36 alias must work end to end, including the complianceMap block.',
    exit: 0,
    noWarn: true,
    check: (t) => [
      [STAR.test(t), 'register row is starred'],
      [FOOTNOTE.test(t), 'Art. 36 footnote rendered'],
      [/prior consultation with the ICO/.test(t), 'multi-regime footnote names the UK authority'],
      [/Content compliance map — UK GDPR/.test(t), 'compliance map rendered with regime label'],
      [/Where addressed/.test(t), 'compliance map table present'],
      [/Engagement mechanism/.test(t), 'regulator-engagement table rendered'],
      [/Prior consultation required — R1 residual High/.test(t), 'computed conclusion with per-regime note'],
    ],
  },
  {
    name: 'regulator-table-missing-conclusion',
    why: 'v3.7: the engagement table is computed from declared conclusions; a declared regime with no conclusion cannot render a row.',
    exit: 1,
    stderr: /regulatorConclusions\["uk-gdpr"\]\.priorConsultation is required to render/,
  },
  {
    name: 'compliancemap-bad-section',
    why: 'A compliance map pointing at a section that does not exist is the checklist version of a fabricated citation.',
    exit: 1,
    stderr: /match no heading/,
  },
  {
    name: 'non-gdpr-regime',
    why: 'v3.1: a checklist-regime-only document must not speak GDPR — no Art. 36 footnote, no status warning, generic high-residual marker instead.',
    exit: 0,
    noWarn: true,
    check: (t) => [
      [STAR.test(t), 'high residual row is still starred'],
      [!FOOTNOTE.test(t), 'Art. 36 footnote absent'],
      [/regulator-engagement analysis/.test(t), 'generic high-residual footnote present'],
      [/Content compliance map — Colorado CPA/.test(t), 'Colorado compliance map rendered'],
      [/DATA PROTECTION ASSESSMENT/.test(t), 'regime-correct document title'],
      [!/Art\. 36 Prior Consultation/.test(t), 'no Art. 36 status box on a checklist-regime cover'],
      [/Under DPO Review/.test(t), 'uniform DPO reviewer in status vocabulary'],
      [/producible to the Colorado AG/.test(t), 'engagement table row from the registry'],
      [/‖\s*Assessment required/.test(t), 'computed conclusion label rendered'],
    ],
    checkXml: (x) => [
      [!x.includes('PRIVILEGED &amp; CONFIDENTIAL'), 'privilege header suppressed for production posture'],
    ],
  },
  {
    name: 'nonderivable-missing-conclusion',
    why: 'v3.1: a declared checklist regime with no conclusion is unfinished; the legacy art36 alias cannot answer for it.',
    exit: 1,
    stderr: /regulatorConclusions\["us-co"\]\.assessmentRequired is required/,
  },
  {
    name: 'footnote-three-regimes',
    why: 'v3.9.1: three consultation regimes produced an "and ... and" run-on in the register footnote; the list join is now Oxford-style, and the art36 alias must fill all three derivable conclusions.',
    exit: 0,
    noWarn: true,
    check: (t) => [
      [/supervisory authority, UK GDPR Article 36 prior consultation with the ICO, and prior consultation with the Kenyan Data Commissioner/.test(t), 'Oxford-style three-item list'],
      [!/ and UK GDPR Article 36 prior consultation with the ICO and /.test(t), 'no "and ... and" run-on'],
      [/are engaged/.test(t), 'plural agreement holds'],
    ],
  },
  {
    name: 'kenya-derivable',
    why: 'v3.8: Kenya is the third derivable regime (s. 31 consultation); its footnote, conclusion derivation and ODPC cover status must all work without the Art. 36 machinery firing spuriously.',
    exit: 0,
    noWarn: true,
    check: (t) => [
      [STAR.test(t), 'high residual row starred'],
      [/Kenyan Data Commissioner/.test(t), 'Kenya consultation footnote from the registry'],
      [/☒ Requires ODPC Consultation/.test(t), 'ODPC blocking status present, checked, and coherent (no warning)'],
      [!/Art\. 36 Prior Consultation/.test(t), 'no Art. 36 status box on a Kenya-only cover'],
      [/‖\s*Prior consultation required/.test(t), 'computed conclusion in the engagement table'],
    ],
  },
  {
    name: 'status-vocabulary',
    why: 'v3.5: the cover status boxes were hard-coded GDPR vocabulary; a Swiss document must offer the FDPIC box, not the Art. 36 box.',
    exit: 0,
    noWarn: true,
    check: (t) => [
      [/☒ Requires FDPIC Consultation/.test(t), 'FDPIC blocking state present and checked'],
      [!/Art\. 36 Prior Consultation/.test(t), 'no Art. 36 status box on a Swiss-only cover'],
      [/Under DPO Review/.test(t), 'uniform DPO reviewer in the vocabulary'],
    ],
  },
  {
    name: 'status-custom',
    why: 'v3.5: a status outside the derived vocabulary must render as an extra checked box with a note, not silently uncheck every option.',
    exit: 0,
    stderr: /outside the derived status vocabulary/,
    check: (t) => [
      [/☒ Submitted to Attorney General/.test(t), 'out-of-vocabulary status rendered checked'],
      [/☐ Draft/.test(t), 'base vocabulary still present'],
    ],
  },
  {
    name: 'notice-check',
    why: 'v4.1: §1.10 was a hand-authored table a manifest could omit or contradict; the computed noticeCheck block renders the drift table from per-commitment verdicts with the notice provenance stated.',
    exit: 0,
    noWarn: true,
    check: (t) => [
      [/Privacy policy consistency check/.test(t), 'section title rendered'],
      [/Checked against: https:\/\/acme.example\/privacy — customers notice — indexed 2026-06-01 — profile: acme-notice-profile.yaml/.test(t), 'notice provenance line rendered'],
      [/‖\s*Drift\s*‖/.test(t), 'drift verdict cell rendered'],
      [/‖\s*Conflict\s*‖/.test(t), 'conflict verdict cell rendered'],
      [/‖\s*Consistent\s*‖/.test(t), 'consistent verdict cell rendered'],
      [/\(s\. 3\.1\)/.test(t), 'notice pinpoint carried into the commitment cell'],
      [/owner: Privacy PM/.test(t), 'committed resolution rendered'],
      [/must not deploy until each is resolved/.test(t), 'builder-owned resolution footnote present on drift'],
    ],
  },
  {
    name: 'notice-check-missing-action',
    why: 'v4.1: the §1.10 resolution rule (drift must be addressed before deployment) was prose; a drift/conflict row with no committed resolution is now a manifest error, not advice.',
    exit: 1,
    stderr: /verdict requires an "action"/,
  },
  {
    name: 'notice-check-bad-verdict',
    why: 'v4.1: the verdict vocabulary is closed, and a manifest-supplied verdict must not resolve through the prototype chain ("constructor") — same class as the v3.4.1 hardening.',
    exit: 1,
    stderr: /"verdict" must be consistent\|drift\|conflict, got "constructor"/,
  },
  {
    name: 'notice-check-stale',
    why: 'v4.1: a notice profile indexed more than six months before the assessment can pass the check against commitments the published notice no longer makes; the builder warns.',
    exit: 0,
    stderr: /indexed 2025-10-01,\s*more than six months before this assessment \(2026-08-10\)/,
    check: (t) => [
      [/Privacy policy consistency check/.test(t), 'check still renders — staleness is a warning, not a stop'],
      [!/must not deploy/.test(t), 'no resolution footnote on an all-consistent table'],
    ],
  },
  {
    name: 'register-null-row',
    why: 'v4.1.1: a null riskRegister row crashed the builder with a TypeError stack trace instead of a clean exit 1 — the v3.4.1 fail-cleanly contract, latent on every rows-consuming block.',
    exit: 1,
    stderr: /riskRegister row 1: each row must be an object, got null/,
  },
  {
    name: 'table-null-row',
    why: 'v4.1.1: same class as register-null-row on the generic table block — a null cell row must name the row, not throw from inside the docx renderer.',
    exit: 1,
    stderr: /row 2: each row must be an array of cells, got null/,
  },
  {
    name: 'notice-check-null-row',
    why: 'v4.1.1: the new noticeCheck block inherited the null-row crash from the pattern it copied; pinned so the guard travels with the block.',
    exit: 1,
    stderr: /noticeCheck\) row 1: each row must be an object, got null/,
  },
  {
    name: 'header-suppressed',
    why: 'A document drafted for regulator production must be able to shed the privilege header deliberately.',
    exit: 0,
    noWarn: true,
    checkXml: (x) => [
      [!x.includes('PRIVILEGED &amp; CONFIDENTIAL'), 'privilege header absent from body'],
      [x.includes('DATA PROTECTION ASSESSMENT'), 'overridden document title present'],
      [x.includes('AI-GENERATED DRAFT'), 'generation notice survives privilege-header suppression'],
    ],
    checkFooter: (f) => [
      [f.includes('for DPO review') && !f.includes('for attorney review'),
        'producible record footer does not claim attorney review even with counsel named'],
    ],
  },
  {
    name: 'headertext-null',
    why: 'v4.2.1: "headerText": null — the schema\'s documented default, copied literally by a manifest author — rendered a page header (and cover banner) reading "null" instead of falling through to the posture-derived default.',
    exit: 0,
    noWarn: true,
    checkXml: (x) => [
      [!/>null</.test(x), 'no literal "null" text run in the document'],
      [x.includes('CONFIDENTIAL — DRAFT FOR DPO REVIEW'), 'posture-derived default header applies'],
    ],
  },
  {
    name: 'mitigated-rating-orphan',
    why: 'v4.2.1: a stated mitigatedRating with no mitigatedLikelihood/Severity failed the rating gate (exit 3) with "derived \\"null\\" from (null x null)", telling the user to re-examine scores that were never stated; it is a manifest error (exit 1) naming the missing fields.',
    exit: 1,
    stderr: /"mitigatedRating" requires "mitigatedLikelihood" and "mitigatedSeverity"/,
  },
  {
    name: 'reviewer-posture-dpo',
    why: 'v4.1.2: on a DPO-led run with no counsel named, every page footer claimed the draft awaited attorney review, and the cover rendered a "Counsel of Record: [to be completed]" line for a role the controller does not staff. v4.2: the same run also carried a work-product header no attorney would ever stand behind.',
    exit: 0,
    noWarn: true,
    checkXml: (x) => [
      [!x.includes('Counsel of Record'), 'no Counsel of Record line when no counsel is named'],
      [!x.includes('PRIVILEGED &amp; CONFIDENTIAL'), 'no work-product header without counsel'],
      [x.includes('CONFIDENTIAL — DRAFT FOR DPO REVIEW'), 'neutral confidentiality header instead'],
    ],
    checkFooter: (f) => [
      [f.includes('for DPO review'), 'footer reads "for DPO review"'],
      [!f.includes('for attorney review'), 'footer does not claim attorney review'],
      [f.includes('AI-generated draft (dpia-generator)'), 'generation-transparency half of the footer intact'],
    ],
  },
  {
    name: 'reviewer-posture-attorney',
    why: 'v4.1.2: with counsel named and the work-product header on, the attorney posture must survive the reviewer-phrase derivation unchanged. v4.2: naming counsel is now what turns the work-product header on.',
    exit: 0,
    noWarn: true,
    checkXml: (x) => [
      [x.includes('Counsel of Record'), 'Counsel of Record line renders when counsel is named'],
      [x.includes('PRIVILEGED &amp; CONFIDENTIAL'), 'work-product header on when counsel is named'],
    ],
    checkFooter: (f) => [
      [f.includes('for attorney review'), 'footer reads "for attorney review"'],
    ],
  },
];

function run() {
  const keep = process.argv.includes('--keep');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dpia-regression-'));
  let failed = 0;

  for (const c of CASES) {
    const src = path.join(FIXTURES, c.name + '.json');
    if (!fs.existsSync(src)) { console.log(`FAIL  ${c.name} — fixture missing`); failed++; continue; }
    const m = JSON.parse(fs.readFileSync(src, 'utf8'));
    // Most cases write into the throwaway tmp dir; a case testing the outputDir
    // allowlist itself keeps the outputDir declared in its fixture.
    if (!c.keepDir) m.outputDir = tmp;
    const mp = path.join(tmp, c.name + '.manifest.json');
    fs.writeFileSync(mp, JSON.stringify(m));

    const r = spawnSync('node', [BUILDER, mp], { encoding: 'utf8' });
    const err = r.stderr || '';
    const problems = [];

    if (r.status !== c.exit) problems.push(`exit ${r.status}, expected ${c.exit}`);
    if (c.stderr && !c.stderr.test(err)) problems.push(`stderr did not match ${c.stderr}`);
    if (c.noWarn && /WARNING/.test(err)) problems.push('unexpected WARNING on a clean case');

    if (r.status === 0 && (c.check || c.checkXml || c.checkPath)) {
      const outPath = (r.stdout || '').trim().split('\n').pop();
      if (!outPath || !fs.existsSync(outPath)) {
        problems.push('builder reported success but no output file');
      } else {
        const asserts = []
          .concat(c.check ? c.check(docText(outPath)) : [])
          .concat(c.checkXml ? c.checkXml(rawXml(outPath)) : [])
          .concat(c.checkFooter ? c.checkFooter(footerText(outPath)) : [])
          .concat(c.checkPath ? c.checkPath(outPath, tmp) : []);
        asserts.forEach(([ok, label]) => { if (!ok) problems.push(label); });
      }
    }

    // Filesystem assertions that must hold regardless of exit code (e.g. a
    // rejected outputDir must have written nothing).
    if (c.checkFs) c.checkFs(tmp).forEach(([ok, label]) => { if (!ok) problems.push(label); });

    if (problems.length) {
      failed++;
      console.log(`FAIL  ${c.name}`);
      console.log(`      why: ${c.why}`);
      problems.forEach(p => console.log(`      - ${p}`));
      if (err.trim()) console.log(`      stderr: ${err.trim().split('\n')[0]}`);
    } else {
      console.log(`ok    ${c.name}`);
    }
  }

  // A fixture with no case is dead weight that reads as coverage; fail loudly.
  const orphans = fs.readdirSync(FIXTURES)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace(/\.json$/, ''))
    .filter(n => !CASES.some(c => c.name === n));
  if (orphans.length) {
    failed++;
    console.log(`FAIL  orphaned fixture(s) with no case: ${orphans.join(', ')}`);
  }

  console.log(`\n${CASES.length - failed}/${CASES.length} passed. Artifacts: ${tmp}`);
  if (!keep) fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(failed ? 1 : 0);
}

run();
