#!/usr/bin/env node
/**
 * run_regression.js — regression suite for build_dpia.js (v1.1)
 *
 * Every case below is a defect that was actually shipped, or a gate that exists
 * to stop one. Run this after any change to build_dpia.js, references/risk-matrix.md,
 * or the manifest schema — the matrix mapping and the Article 36 flag are the two
 * things in this skill a reader cannot check by eye.
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

const STAR = /‖\s*High \*\s*‖/;          // a starred rating cell in the register
const FOOTNOTE = /Article 36 prior consultation .* is engaged/;

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
    ],
    noWarn: true,
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
  { name: 'bad-date', why: 'Date format is validated before anything is written.', exit: 1, stderr: /must be YYYY-MM-DD/ },
  { name: 'matrix-no-source', why: 'A matrix pointing at no register fails rather than rendering empty.', exit: 1, stderr: /no riskRegister named/ },
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

  console.log(`\n${CASES.length - failed}/${CASES.length} passed. Artifacts: ${tmp}`);
  if (!keep) fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(failed ? 1 : 0);
}

run();
