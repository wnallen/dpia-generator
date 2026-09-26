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
    name: 'manifest-not-object',
    why: 'v4.3.3: a manifest file whose JSON is null (or a string, or an array) parsed fine and then crashed the required-field check with a TypeError stack trace — the fail-cleanly contract applies to the manifest root too.',
    exit: 1,
    keepDir: true,
    stderr: /manifest must be a JSON object, got null/,
  },
  {
    name: 'blocks-not-array',
    why: 'v4.3.3: "blocks" as a string crashed .forEach with a TypeError; the schema says required-and-array, so the builder must enforce it with a named error.',
    exit: 1,
    stderr: /"blocks" is required and must be an array of block objects, got string/,
  },
  {
    name: 'block-null-entry',
    why: 'v4.3.3: a null entry in "blocks" crashed reading .type — the v4.1.1 fail-cleanly contract, latent on the blocks array itself since v1.1.',
    exit: 1,
    stderr: /block 2: each entry in "blocks" must be a block object, got null/,
  },
  {
    name: 'para-missing-text',
    why: 'v4.3.3: a para or heading block with no "text" rendered the literal word "undefined" into the shipped document — the v4.2.1 "null"-header defect class on the two commonest blocks.',
    exit: 1,
    stderr: /block 1 \(para\): needs "text"/,
  },
  {
    name: 'bullet-null-item',
    why: 'v4.3.3: a null bullet item rendered the literal word "null" as a bullet (a null signature cell did the same; it now renders empty, matching dataTable).',
    exit: 1,
    stderr: /block 1 \(bullets\) item 2: bullet items must be text, got null/,
  },
  {
    name: 'block-shape-not-array',
    why: 'v4.4.1: a string "items" on a bullets block (or string "columns" on a table) crashed with a TypeError stack trace instead of a clean exit 1 naming the block.',
    exit: 1,
    stderr: /block 1 \(bullets\): "items" must be an array of text/,
  },
  {
    name: 'status-non-string',
    why: 'v4.4.1: a numeric "status" crashed the cover page with ".trim is not a function"; it now renders as an out-of-vocabulary status with a note.',
    exit: 0,
    stderr: /"status" \("5"\) is outside the derived status vocabulary/,
  },
  {
    name: 'conclusions-proto-entry',
    why: 'v4.4.1: a JSON "__proto__" key inside a regulatorConclusions entry became the entry\'s prototype and supplied the conclusion by inheritance, satisfying the gate with no own declaration.',
    exit: 1,
    stderr: /regulatorConclusions\["us-co"\]\.assessmentRequired is required/,
  },
  {
    name: 'symlink-output-file',
    why: 'v4.4.1: a symlink planted at the predictable output filename in the shared temp dir redirected the write to its target, outside the permitted roots.',
    exit: 1,
    stderr: /not a regular file/,
    setup: (tmp) => {
      fs.writeFileSync(path.join(tmp, 'victim.txt'), 'orig');
      fs.symlinkSync(path.join(tmp, 'victim.txt'), path.join(tmp, 'DPIA_Symlink_Probe_2026-09-01.docx'));
    },
    checkFs: (tmp) => [
      [fs.readFileSync(path.join(tmp, 'victim.txt'), 'utf8') === 'orig', 'symlink target left untouched'],
    ],
  },
  {
    name: 'symlink-output-dir',
    why: 'v4.4.1: an outputDir under an allowed root that passes through a symlink to a disallowed location was accepted by the lexical check, and mkdir created directories at the symlink target.',
    exit: 1,
    stderr: /resolves through a symlink/,
    setup: (tmp, m) => {
      fs.symlinkSync(path.join(ROOT, 'tests'), path.join(tmp, 'escape-link'));
      m.outputDir = path.join(tmp, 'escape-link', 'dpia-symlink-probe');
    },
    checkFs: () => [
      [!fs.existsSync(path.join(ROOT, 'tests', 'dpia-symlink-probe')), 'no directory created through the symlink'],
    ],
  },
  {
    name: 'xml-control-chars',
    why: 'v4.4.3: C0 control characters and U+FFFE in any text field (common in text pasted from PDFs) were written through to the XML verbatim, so the docx would not open — exit 0 wherever validate.py was absent or skipped.',
    exit: 0,
    noWarn: true,
    checkXml: (x) => [
      [!/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/.test(x), 'no XML-forbidden characters in document.xml'],
      [x.includes('OVERVIEW'), 'heading text kept with the control character stripped'],
      [x.includes('pastedfroma pdf'), 'paragraph text kept with \\v and \\f stripped'],
    ],
    checkFooter: (f) => [
      [f.includes('DPIA--001'), 'footer reference stripped of the form feed'],
    ],
  },
  {
    name: 'text-not-scalar',
    why: 'v4.4.3: an object where text was expected rendered as "[object Object]", or threw "Cannot convert object to primitive value" when its toString was not callable.',
    exit: 1,
    stderr: /block 1 \(para\): expected text, got an object/,
  },
  {
    name: 'outputdir-not-string',
    why: 'v4.4.3: a non-string "outputDir" reached path.resolve and crashed with a TypeError stack trace.',
    exit: 1,
    stderr: /"outputDir" must be a string/,
    keepDir: true,
  },
  {
    name: 'regulator-table-string-conclusion',
    why: 'v4.4.3: without a riskRegister the conclusion type gate never ran, so a string "false" (truthy) rendered "Prior consultation required".',
    exit: 1,
    stderr: /priorConsultation must be true, false or "conditional", got "false"/,
  },
  {
    name: 'compliancemap-empty-section',
    why: 'v4.4.3: a bare "§" section stripped to an empty probe that matched every heading, so the dangling-reference gate could be bypassed.',
    exit: 1,
    stderr: /names no section/,
  },
  {
    name: 'jurisdictions-duplicate',
    why: 'v4.4.3: a repeated regime code rendered duplicate regulator-table rows and a footnote naming the same Article twice.',
    exit: 1,
    stderr: /listed more than once/,
  },
  {
    name: 'table-widths-invalid',
    why: 'v4.4.3: non-numeric "widths" produced an invalid tcW element and an OOXML failure after the file was written.',
    exit: 1,
    stderr: /"widths" must be an array of percentages/,
  },
  {
    name: 'outputfilename-not-docx',
    why: 'v4.4.3: an "outputFilename" carrying a bidi override (or any non-.docx name) was written as given; the record must ship under a plain .docx name.',
    exit: 0,
    stderr: /not a usable filename/,
    checkPath: (out) => [
      [path.basename(out) === 'DPIA_Probe_2026-07-29.docx', 'fell back to the default name'],
    ],
  },
  {
    name: 'hardlink-output-file',
    why: 'v4.4.3: a hardlink planted at the predictable output filename is a regular file, so lstat passed and O_TRUNC overwrote the linked file outside the permitted roots.',
    exit: 1,
    stderr: /has 2 links/,
    setup: (tmp) => {
      fs.writeFileSync(path.join(tmp, 'linked.txt'), 'orig');
      fs.linkSync(path.join(tmp, 'linked.txt'), path.join(tmp, 'DPIA_Hardlink_Probe_2026-09-01.docx'));
    },
    checkFs: (tmp) => [
      [fs.readFileSync(path.join(tmp, 'linked.txt'), 'utf8') === 'orig', 'hardlink target left untouched'],
    ],
  },
  {
    name: 'regulator-table-malaysia',
    why: 'v4.4.2: the my-pdpa engagement text still told every Malaysian regulator table the DPIA guideline was "in consultation (watch status)" four months after the JPDP issued it (2026-04-30) — the module knew, the builder did not. The UK row must also carry the Information Commission successor name (from 2026-09-30).',
    exit: 0,
    noWarn: true,
    check: (t) => [
      [/JPDP DPIA Guideline \(issued 2026-04-30\)/.test(t), 'Malaysia row names the issued guideline'],
      [!/in consultation \(watch status\)/.test(t), 'stale watch-status wording gone'],
      [/Information Commission from 2026-09-30/.test(t), 'UK row names the Information Commission successor'],
    ],
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
  {
    name: 'scalar-fields-not-scalar',
    why: 'v4.4.4: cover fields ("controller", "dpo", "counsel", "reference", "docTitle", "headerText", "version", "status") were String()-coerced before the txt() guard, so an object shipped as "[object Object]" with exit 0 — and an object docTitle corrupted the filename prefix.',
    exit: 1,
    stderr: /"controller" must be a string, got an object/,
  },
  {
    name: 'outputdir-root-not-yet-created',
    why: 'v4.4.4: allowed roots that did not exist yet were dropped from the realpath check, so on a fresh image with no /mnt/user-data/outputs the default outputDir was refused with a misleading "resolves through a symlink" error.',
    exit: 0,
    keepDir: true,
    noWarn: true,
    env: (tmp) => ({ DPIA_OUTPUT_ROOTS: path.join(tmp, 'fresh-root') }),
    setup: (tmp, m) => { m.outputDir = path.join(tmp, 'fresh-root', 'outputs'); },
    checkPath: (out, tmp) => [
      [out.startsWith(path.join(tmp, 'fresh-root', 'outputs') + path.sep), 'written under the not-yet-created root'],
    ],
  },
];

// The bundled well-formedness check must reject a docx whose XML carries a
// character XML 1.0 forbids — it is the floor that runs wherever validate.py
// is absent (CI), so a checker that passes everything would turn "never skip"
// back into "always pass". Returns a [ok, label] list.
function checkBundledValidator(goodDocx, tmp) {
  const CHECK = path.join(ROOT, 'scripts', 'check_ooxml.py');
  const broken = path.join(tmp, 'broken-control-char.docx');
  const py = `
import sys, zipfile
src, dst = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(src) as z, zipfile.ZipFile(dst, 'w') as out:
    for item in z.infolist():
        data = z.read(item.filename)
        if item.filename == 'word/document.xml':
            data = data.replace(b'</w:body>', b'<w:p><w:r><w:t>\\x0b</w:t></w:r></w:p></w:body>')
        out.writestr(item, data)`;
  execFileSync('python3', ['-c', py, goodDocx, broken]);
  const good = spawnSync('python3', [CHECK, goodDocx], { encoding: 'utf8' });
  const bad = spawnSync('python3', [CHECK, broken], { encoding: 'utf8' });
  return [
    [good.status === 0, 'bundled check accepts a built document'],
    [bad.status === 1 && /not well-formed/.test(bad.stderr || ''), 'bundled check rejects a control character'],
  ];
}

function run() {
  const keep = process.argv.includes('--keep');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dpia-regression-'));
  let failed = 0;
  let lastGoodDocx = null;

  for (const c of CASES) {
    const src = path.join(FIXTURES, c.name + '.json');
    if (!fs.existsSync(src)) { console.log(`FAIL  ${c.name} — fixture missing`); failed++; continue; }
    const m = JSON.parse(fs.readFileSync(src, 'utf8'));
    // Most cases write into the throwaway tmp dir; a case testing the outputDir
    // allowlist itself keeps the outputDir declared in its fixture.
    if (!c.keepDir) m.outputDir = tmp;
    // A case may stage the filesystem (e.g. plant a symlink) or adjust the manifest first.
    if (c.setup) c.setup(tmp, m);
    const mp = path.join(tmp, c.name + '.manifest.json');
    fs.writeFileSync(mp, JSON.stringify(m));

    // A case may extend the builder's environment (e.g. an extra output root).
    const env = Object.assign({}, process.env, c.env ? c.env(tmp) : {});
    const r = spawnSync('node', [BUILDER, mp], { encoding: 'utf8', env });
    const err = r.stderr || '';
    const problems = [];

    if (r.status !== c.exit) problems.push(`exit ${r.status}, expected ${c.exit}`);
    if (c.stderr && !c.stderr.test(err)) problems.push(`stderr did not match ${c.stderr}`);
    if (c.noWarn && /WARNING/.test(err)) problems.push('unexpected WARNING on a clean case');
    // v4.4.4: validation is never skipped — the full validator or the bundled
    // well-formedness check must have run on every built file.
    if (r.status === 0 && /skipped validation|validation skipped/.test(err)) {
      problems.push('OOXML validation was skipped');
    }

    if (r.status === 0 && (c.check || c.checkXml || c.checkPath)) {
      const outPath = (r.stdout || '').trim().split('\n').pop();
      if (!outPath || !fs.existsSync(outPath)) {
        problems.push('builder reported success but no output file');
      } else {
        if (!lastGoodDocx) lastGoodDocx = outPath;
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

  // Harness-level check (not a fixture): the bundled OOXML checker itself.
  let extra = 1;
  const bundled = lastGoodDocx ? checkBundledValidator(lastGoodDocx, tmp)
    : [[false, 'no built document available to probe the bundled check']];
  const bundledProblems = bundled.filter(([ok]) => !ok).map(([, label]) => label);
  if (bundledProblems.length) {
    failed++;
    console.log('FAIL  bundled-ooxml-check');
    bundledProblems.forEach(p => console.log(`      - ${p}`));
  } else {
    console.log('ok    bundled-ooxml-check');
  }

  const total = CASES.length + extra;
  console.log(`\n${total - failed}/${total} passed. Artifacts: ${tmp}`);
  if (!keep) fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(failed ? 1 : 0);
}

run();
