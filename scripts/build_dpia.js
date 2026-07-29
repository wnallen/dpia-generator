#!/usr/bin/env node
/**
 * build_dpia.js — dpia-generator document assembler (v2.0)
 *
 * Renders the DPIA .docx from a JSON content manifest. The structure defined in
 * references/output-template.md is the constant; the manifest supplies only the
 * bespoke narrative. Do NOT hand-write a per-run generator — author the manifest
 * and run this script.
 *
 * Usage:
 *   node build_dpia.js manifest.json [--no-validate]
 *
 * Exit codes:
 *   0  success (built, and validated unless --no-validate)
 *   1  manifest / build failure
 *   2  OOXML validation failure
 *   3  risk-rating gate failure (see below) — HARD STOP
 *
 * RISK-RATING GATE (why this script owns the matrix)
 * The likelihood x severity -> rating mapping in references/risk-matrix.md is
 * deterministic and severity-weighted: no cell in which either dimension is
 * High rates Low. A model scoring it inline gets it wrong silently, and a
 * mis-stated residual rating is the single defect most likely to survive review
 * into a filed DPIA. So: the manifest states likelihood and severity; this
 * script derives the rating. If the manifest also states a rating and it
 * disagrees with the derived value, the build stops with exit 3 and names the
 * row. Never "fix" a disagreement by editing the stated rating to match —
 * re-examine the likelihood and severity scores.
 *
 * ARTICLE 36 FLAG
 * Art. 36(1) GDPR engages on residual high risk, however that rating is
 * reached. Any row whose *derived residual rating* is High is marked, not only
 * High likelihood x High severity — a Medium x High residual rates High and
 * engages prior consultation just the same.
 *
 * ARTICLE 36 CONCLUSION GATE (v2.0, exit 3)
 * The rating gate stops the register from contradicting the matrix. It does
 * not stop the *prose* from contradicting the register — a DPIA whose table
 * carries a High residual while its executive summary says prior consultation
 * is not required is the same class of defect, in the sentence a regulator
 * actually reads. So the manifest must now declare its conclusion:
 *
 *   "art36": true | false     // REQUIRED whenever a riskRegister block exists
 *
 * The script derives the answer from the register and stops with exit 3 if the
 * declaration disagrees. As with the rating gate, do not resolve a failure by
 * flipping the declaration to match: decide which is wrong, the conclusion or
 * the scores, and fix that. The script also scans narrative blocks for a
 * sentence asserting the opposite of the derived answer and warns on stderr —
 * a warning, not a stop, because phrasing is too varied to gate on.
 *
 * MANIFEST SCHEMA
 * {
 *   "systemName": "Vendor Sentiment Engine",   // required
 *   "date": "2026-07-25",                      // required, YYYY-MM-DD
 *   "version": "1.0 - DRAFT FOR DPO REVIEW",   // optional
 *   "controller": "Acme Ltd",                  // optional; placeholder if omitted
 *   "dpo": "...", "counsel": "...",            // optional
 *   "reference": "[DPIA-2026-001]",            // optional
 *   "status": "Draft",                         // Draft|Under DPO Review|Approved|Requires Art. 36 Prior Consultation
 *   "art36": false,                            // REQUIRED if any riskRegister block; see conclusion gate
 *   "outputDir": "/mnt/user-data/outputs",     // default shown
 *   "outputFilename": null,                    // default DPIA_<System>_<date>.docx
 *   "blocks": [ ... ]                          // required, ordered content
 * }
 *
 * BLOCK TYPES
 *   {"type":"pagebreak"}
 *   {"type":"heading","level":1|2|3,"text":"SECTION 1 - ..."}
 *   {"type":"para","text":"...","italic":false}
 *   {"type":"bullets","items":["...","..."]}
 *   {"type":"table","columns":["A","B"],"rows":[["1","2"]],"widths":[40,60]}
 *   {"type":"riskRegister","id":"main",                     // id optional (default "default");
 *    "rows":[                                              //   referenced by a matrix block's "source"
 *       {"id":"R1","risk":"...","likelihood":"High","severity":"Medium",
 *        "controls":"...","residualLikelihood":"Low","residualSeverity":"Medium",
 *        "inherentRating":"High","residualRating":"Low"}   // ratings optional; checked if present
 *   ]}
 *   {"type":"matrix","title":"Inherent risk","stage":"inherent"|"residual","source":"<riskRegister id>"}
 *      -- plots the register's risk IDs onto the coloured 3x3 grid.
 *   {"type":"signature","rows":[["Data Protection Officer","______","Date"]]}
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// Resolve docx from the global prefix; it is installed globally in this image.
function loadDocx() {
  try { return require('docx'); } catch (e) { /* fall through */ }
  let prefix;
  try { prefix = execFileSync('npm', ['prefix', '-g'], { encoding: 'utf8' }).trim(); }
  catch (e) { fail(1, 'cannot locate npm global prefix: ' + e.message); }
  const p = path.join(prefix, 'lib', 'node_modules', 'docx');
  if (!fs.existsSync(p)) fail(1, 'docx package not found; run: npm install -g docx');
  return require(p);
}

function fail(code, msg) {
  process.stderr.write('build_dpia: ' + msg + '\n');
  process.exit(code);
}

const D = loadDocx();
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType,
  Header, Footer, PageNumber, VerticalAlign,
} = D;

// ---------------------------------------------------------------- risk matrix
const LEVELS = ['Low', 'Medium', 'High'];
// MATRIX[likelihood][severity] -> rating. Mirrors references/risk-matrix.md exactly.
const MATRIX = {
  High:   { Low: 'Medium', Medium: 'High',   High: 'High' },
  Medium: { Low: 'Low',    Medium: 'Medium', High: 'High' },
  Low:    { Low: 'Low',    Medium: 'Low',    High: 'Medium' },
};
const RATING_STYLE = {
  Low:    { fill: 'C6EFCE', color: '006100' },
  Medium: { fill: 'FFEB9C', color: '9C5700' },
  High:   { fill: 'FFC7CE', color: '9C0006' },
};

function norm(v, field, ctx) {
  if (v === undefined || v === null) fail(1, `${ctx}: missing "${field}"`);
  const s = String(v).trim();
  const hit = LEVELS.find(l => l.toLowerCase() === s.toLowerCase());
  if (!hit) fail(1, `${ctx}: "${field}" must be Low|Medium|High, got "${s}"`);
  return hit;
}

function rate(likelihood, severity) { return MATRIX[likelihood][severity]; }

// Narrative contradiction scan. Deliberately loose on the Art. 36 reference and
// tight on the assertion, so it catches the sentence a reviewer would read
// without firing on every mention of the Article.
const ART36_REF = /\b(article|art\.?)\s*36\b/i;
const SAYS_NO = /\b(does not|doesn't|not)\s+(require|engage|trigger)|\bno\s+(prior\s+)?consultation|\bis not (required|engaged|triggered)\b/i;
const SAYS_YES = /\b(does|is|must|shall)\s+(require|engaged?|triggered?|consult)|\bis (required|engaged|triggered)\b|\brequires prior consultation\b/i;

function scanNarrative(blocks) {
  const hits = { asserts: [], denies: [] };
  // Sentence-level, not block-level. A paragraph that correctly asserts the
  // obligation often also contains a negation about something else — "engaged by
  // the rating itself; it does not require that both dimensions be High" — and
  // matching across the whole block reads that as a denial. The Article 36
  // reference and the assertion have to sit in the same sentence to count.
  const visit = (text, where) => {
    if (!ART36_REF.test(text)) return;
    String(text).split(/(?<=[.;:!?])\s+/).forEach(s => {
      if (!ART36_REF.test(s)) return;
      if (SAYS_NO.test(s)) hits.denies.push(where);
      else if (SAYS_YES.test(s)) hits.asserts.push(where);
    });
  };
  (blocks || []).forEach((b, i) => {
    if (b.type === 'para' && b.text) visit(String(b.text), `block ${i + 1} (para)`);
    if (b.type === 'bullets') (b.items || []).forEach((it, j) => visit(String(it), `block ${i + 1} bullet ${j + 1}`));
    if (b.type === 'table') (b.rows || []).forEach((r, j) =>
      (r || []).forEach(c => visit(String(c == null ? '' : c), `block ${i + 1} table row ${j + 1}`)));
  });
  return hits;
}
// Art. 36(1) engages on residual HIGH RISK, however the rating is reached —
// not only on High x High. Keep this keyed to the derived rating.
function isArt36(likelihood, severity) { return rate(likelihood, severity) === 'High'; }

/** Derives ratings and enforces the rating gate. Returns enriched rows. */
function resolveRegister(rows) {
  const violations = [];
  const out = rows.map((r, i) => {
    const ctx = `riskRegister row ${i + 1} (${r.id || 'no id'})`;
    const iL = norm(r.likelihood, 'likelihood', ctx);
    const iS = norm(r.severity, 'severity', ctx);
    const rL = norm(r.residualLikelihood !== undefined ? r.residualLikelihood : r.likelihood, 'residualLikelihood', ctx);
    const rS = norm(r.residualSeverity !== undefined ? r.residualSeverity : r.severity, 'residualSeverity', ctx);
    const inherent = rate(iL, iS);
    const residual = rate(rL, rS);
    if (r.inherentRating && String(r.inherentRating).trim() !== inherent) {
      violations.push(`${ctx}: stated inherentRating "${r.inherentRating}" != derived "${inherent}" from (${iL} x ${iS})`);
    }
    if (r.residualRating && String(r.residualRating).trim() !== residual) {
      violations.push(`${ctx}: stated residualRating "${r.residualRating}" != derived "${residual}" from (${rL} x ${rS})`);
    }
    return {
      id: r.id || `R${i + 1}`, risk: r.risk || '', controls: r.controls || '',
      iL, iS, inherent, rL, rS, residual,
      art36: isArt36(rL, rS),
    };
  });
  if (violations.length) {
    fail(3, 'RISK-RATING GATE FAILED (exit 3) — do not deliver:\n  ' + violations.join('\n  '));
  }
  return out;
}

// ---------------------------------------------------------------- primitives
const FONT = 'Calibri';

function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align,
    spacing: { after: opts.after === undefined ? 140 : opts.after, line: 276 },
    children: [new TextRun({
      text: String(text),
      font: FONT, size: opts.size || 22,
      bold: !!opts.bold, italics: !!opts.italic, color: opts.color,
    })],
  });
}

function heading(text, level) {
  const map = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3 };
  return new Paragraph({
    heading: map[level] || HeadingLevel.HEADING_2,
    spacing: { before: level === 1 ? 320 : 240, after: 140 },
    children: [new TextRun({ text: String(text), font: FONT, bold: true, size: level === 1 ? 28 : 24, color: '1F3864' })],
  });
}

function cell(text, opts = {}) {
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill, color: 'auto' } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 110, right: 110 },
    children: (Array.isArray(text) ? text : [text]).map(t =>
      new Paragraph({
        alignment: opts.align,
        spacing: { after: 0 },
        children: [new TextRun({
          text: String(t), font: FONT, size: opts.size || 20,
          bold: !!opts.bold, color: opts.color,
        })],
      })),
  });
}

function table(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: ['top', 'bottom', 'left', 'right', 'insideHorizontal', 'insideVertical']
      .reduce((a, k) => (a[k] = { style: BorderStyle.SINGLE, size: 2, color: 'BFBFBF' }, a), {}),
    rows,
  });
}

function dataTable(columns, bodyRows, widths) {
  const w = widths && widths.length === columns.length
    ? widths : columns.map(() => Math.floor(100 / columns.length));
  const head = new TableRow({
    tableHeader: true,
    children: columns.map((c, i) => cell(c, { bold: true, fill: 'D9E2F3', width: w[i] })),
  });
  const body = bodyRows.map(r => new TableRow({
    children: r.map((v, i) => cell(v === null || v === undefined ? '' : v, { width: w[i] })),
  }));
  return table([head, ...body]);
}

// ---------------------------------------------------------------- composites
function registerTable(rows) {
  const cols = ['ID', 'Risk to data subjects', 'Inherent (L x S)', 'Inherent', 'Controls', 'Residual (L x S)', 'Residual'];
  const w = [5, 30, 11, 9, 24, 11, 10];
  const head = new TableRow({
    tableHeader: true,
    children: cols.map((c, i) => cell(c, { bold: true, fill: 'D9E2F3', width: w[i] })),
  });
  const body = rows.map(r => new TableRow({
    children: [
      cell(r.id, { width: w[0], bold: true }),
      cell(r.risk, { width: w[1] }),
      cell(`${r.iL} x ${r.iS}`, { width: w[2], align: AlignmentType.CENTER }),
      cell(r.inherent, { width: w[3], align: AlignmentType.CENTER, bold: true, ...RATING_STYLE[r.inherent] }),
      cell(r.controls, { width: w[4] }),
      cell(`${r.rL} x ${r.rS}`, { width: w[5], align: AlignmentType.CENTER }),
      cell(r.residual + (r.art36 ? ' *' : ''), { width: w[6], align: AlignmentType.CENTER, bold: true, ...RATING_STYLE[r.residual] }),
    ],
  }));
  return table([head, ...body]);
}

function matrixTable(rows, stage) {
  const plot = {};
  LEVELS.forEach(l => { plot[l] = {}; LEVELS.forEach(s => { plot[l][s] = []; }); });
  rows.forEach(r => {
    const L = stage === 'inherent' ? r.iL : r.rL;
    const S = stage === 'inherent' ? r.iS : r.rS;
    plot[L][S].push(r.id);
  });
  const sev = ['Low', 'Medium', 'High'];
  const lik = ['High', 'Medium', 'Low'];
  const w = [22, 26, 26, 26];
  const head = new TableRow({
    tableHeader: true,
    children: [cell('Likelihood / Severity', { bold: true, fill: 'D9E2F3', width: w[0], size: 18 })]
      .concat(sev.map((s, i) => cell(s, { bold: true, fill: 'D9E2F3', width: w[i + 1], align: AlignmentType.CENTER, size: 18 }))),
  });
  const body = lik.map(L => new TableRow({
    children: [cell(L, { bold: true, fill: 'D9E2F3', width: w[0], size: 18 })]
      .concat(sev.map((S, i) => {
        const r = rate(L, S);
        const ids = plot[L][S];
        return cell([r, ids.length ? ids.join(', ') : '\u2014'], {
          width: w[i + 1], align: AlignmentType.CENTER, bold: true, size: 18, ...RATING_STYLE[r],
        });
      })),
  }));
  return table([head, ...body]);
}

function coverPage(m) {
  const rule = new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '1F3864' } },
    spacing: { before: 200, after: 300 },
    children: [new TextRun({ text: '', font: FONT })],
  });
  const line = (label, value) => p(`${label}: ${value || '[to be completed]'}`, { align: AlignmentType.CENTER });
  const statuses = ['Draft', 'Under DPO Review', 'Approved', 'Requires Art. 36 Prior Consultation'];
  const chosen = (m.status || 'Draft').trim();
  const statusLine = statuses.map(s => (s.toLowerCase() === chosen.toLowerCase() ? '\u2612 ' : '\u2610 ') + s).join('   ');
  return [
    p('', { after: 900 }),
    p('DATA PROTECTION IMPACT ASSESSMENT', { align: AlignmentType.CENTER, bold: true, size: 36 }),
    rule,
    p(m.systemName, { align: AlignmentType.CENTER, bold: true, size: 28 }),
    p(m.version || 'Version 1.0 \u2014 DRAFT FOR DPO REVIEW', { align: AlignmentType.CENTER, italic: true }),
    p(m.date, { align: AlignmentType.CENTER, after: 500 }),
    line('Controller', m.controller),
    line('Data Protection Officer', m.dpo),
    line('Counsel of Record', m.counsel),
    line('DPIA Reference', m.reference || '[DPIA-YYYY-NNN]'),
    p('', { after: 400 }),
    p(statusLine, { align: AlignmentType.CENTER, size: 20 }),
    rule,
    p('PRIVILEGED & CONFIDENTIAL \u2014 ATTORNEY WORK PRODUCT', { align: AlignmentType.CENTER, bold: true, size: 20, color: '9C0006' }),
    new Paragraph({ children: [new (D.PageBreak)()] }),
  ];
}

// ---------------------------------------------------------------- build
function build(manifest, state) {
  const registers = {};
  const children = coverPage(manifest);

  (manifest.blocks || []).forEach((b, i) => {
    const ctx = `block ${i + 1} (${b.type})`;
    switch (b.type) {
      case 'pagebreak':
        children.push(new Paragraph({ children: [new (D.PageBreak)()] })); break;
      case 'heading':
        children.push(heading(b.text, b.level || 2)); break;
      case 'para':
        children.push(p(b.text, { italic: b.italic })); break;
      case 'bullets':
        (b.items || []).forEach(it => children.push(new Paragraph({
          bullet: { level: 0 }, spacing: { after: 80, line: 276 },
          children: [new TextRun({ text: String(it), font: FONT, size: 22 })],
        }))); break;
      case 'table':
        if (!b.columns || !b.rows) fail(1, `${ctx}: needs "columns" and "rows"`);
        children.push(dataTable(b.columns, b.rows, b.widths));
        children.push(p('', { after: 120 })); break;
      case 'riskRegister': {
        if (!Array.isArray(b.rows) || !b.rows.length) fail(1, `${ctx}: needs non-empty "rows"`);
        const resolved = resolveRegister(b.rows);
        registers[b.id || 'default'] = resolved;
        children.push(registerTable(resolved));
        if (resolved.some(r => r.art36)) {
          state.art36 = true;
          children.push(p('* Residual risk rated High \u2014 Article 36 prior consultation with the competent supervisory authority is engaged for this risk, and the processing may not commence until that consultation has concluded.',
            { italic: true, size: 18 }));
        }
        children.push(p('', { after: 120 }));
        break;
      }
      case 'matrix': {
        const src = registers[b.source || 'default'];
        if (!src) fail(1, `${ctx}: no riskRegister named "${b.source || 'default'}" appears before this block`);
        const stage = (b.stage || 'residual').toLowerCase();
        if (stage !== 'inherent' && stage !== 'residual') fail(1, `${ctx}: "stage" must be inherent|residual`);
        children.push(p(b.title || (stage === 'inherent' ? 'Inherent risk' : 'Residual risk'), { bold: true, after: 100 }));
        children.push(matrixTable(src, stage));
        children.push(p('', { after: 120 }));
        break;
      }
      case 'signature': {
        const rows = (b.rows || []).map(r => r.map(v => String(v)));
        children.push(dataTable(['Role', 'Signature', 'Date'], rows, [34, 40, 26]));
        children.push(p('', { after: 120 }));
        break;
      }
      default:
        fail(1, `${ctx}: unknown block type "${b.type}"`);
    }
  });

  return new Document({
    creator: manifest.counsel || 'Counsel',
    title: `DPIA \u2014 ${manifest.systemName}`,
    description: 'Privileged & Confidential \u2014 Attorney Work Product',
    styles: { default: { document: { run: { font: FONT, size: 22 } } } },
    sections: [{
      properties: {
        page: {
          // A4 portrait — the DPIA's audience is EU/UK (DPO, ICO, CNIL, lead authority).
          size: { width: 11906, height: 16838 },
          margin: { top: 1100, bottom: 1100, left: 1100, right: 1100 },
        },
      },
      headers: {
        default: new Header({
          children: [p('PRIVILEGED & CONFIDENTIAL \u2014 ATTORNEY WORK PRODUCT',
            { align: AlignmentType.RIGHT, bold: true, size: 16, color: '9C0006', after: 0 })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({
              children: ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES,
                `   |   ${manifest.reference || '[DPIA-YYYY-NNN]'}   |   Prepared by Counsel`],
              font: FONT, size: 16, color: '595959',
            })],
          })],
        }),
      },
      children,
    }],
  });
}

// ---------------------------------------------------------------- main
function main() {
  const args = process.argv.slice(2);
  const manifestPath = args.find(a => !a.startsWith('--'));
  const noValidate = args.includes('--no-validate');
  if (!manifestPath) fail(1, 'usage: node build_dpia.js manifest.json [--no-validate]');
  if (!fs.existsSync(manifestPath)) fail(1, `manifest not found: ${manifestPath}`);

  let m;
  try { m = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); }
  catch (e) { fail(1, 'manifest is not valid JSON: ' + e.message); }
  ['systemName', 'date'].forEach(k => { if (!m[k]) fail(1, `manifest: missing required "${k}"`); });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(m.date)) fail(1, 'manifest: "date" must be YYYY-MM-DD');

  const outDir = m.outputDir || '/mnt/user-data/outputs';
  fs.mkdirSync(outDir, { recursive: true });
  const safe = String(m.systemName).replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
  // basename() so a manifest "outputFilename" cannot write outside outputDir via "../".
  const named = m.outputFilename ? path.basename(String(m.outputFilename)) : '';
  if (m.outputFilename && named !== String(m.outputFilename)) {
    process.stderr.write(`build_dpia: note — "outputFilename" was reduced to "${named}"; it may not contain a path.\n`);
  }
  const outPath = path.join(outDir, named || `DPIA_${safe}_${m.date}.docx`);

  const state = { art36: false };
  const doc = build(m, state);

  const hasRegister = (m.blocks || []).some(b => b && b.type === 'riskRegister');

  // ---- Article 36 conclusion gate (exit 3) ----------------------------------
  if (hasRegister) {
    if (m.art36 === undefined || m.art36 === null) {
      fail(1, 'manifest: "art36" is required when the DPIA contains a riskRegister. Declare the ' +
              'Article 36 conclusion as true or false; the script checks it against the register.');
    }
    if (typeof m.art36 !== 'boolean') {
      fail(1, `manifest: "art36" must be a boolean, got ${JSON.stringify(m.art36)}`);
    }
    if (m.art36 !== state.art36) {
      const derivedWhy = state.art36
        ? 'at least one residual risk rates High'
        : 'no residual risk rates High';
      fail(3, 'ARTICLE 36 CONCLUSION GATE FAILED (exit 3) — do not deliver:\n  ' +
        `manifest declares art36=${m.art36}, but the register derives ${state.art36} (${derivedWhy}).\n  ` +
        'Do not flip the declaration to silence this. Either the conclusion is wrong, or a ' +
        'likelihood/severity score is — decide which, and fix that.');
    }
  }

  // ---- Narrative contradiction scan (warning) -------------------------------
  const hits = scanNarrative(m.blocks);
  const contradictions = state.art36 ? hits.denies : hits.asserts;
  if (hasRegister && contradictions.length) {
    process.stderr.write(
      `build_dpia: WARNING — the register derives Art. 36 = ${state.art36}, but narrative text appears to ` +
      `assert the opposite at: ${contradictions.join('; ')}. Read those passages before delivering; the ` +
      'executive summary is the part a supervisory authority reads first.\n');
  }

  // ---- Cover-status coherence (warning) ------------------------------------
  const art36Status = 'requires art. 36 prior consultation';
  if (state.art36 && String(m.status || 'Draft').trim().toLowerCase() !== art36Status) {
    process.stderr.write(
      'build_dpia: WARNING — a residual risk rates High (Art. 36 prior consultation engaged) but manifest ' +
      `"status" is "${m.status || 'Draft'}". Confirm the cover page and executive summary carry the Art. 36 flag.\n`);
  }

  Packer.toBuffer(doc).then(buf => {
    fs.writeFileSync(outPath, buf);
    if (!noValidate) {
      const v = '/mnt/skills/public/docx/scripts/office/validate.py';
      if (fs.existsSync(v)) {
        try { execFileSync('python3', [v, outPath], { stdio: 'inherit' }); }
        catch (e) {
          fail(2, 'validation did not pass for ' + outPath +
            ' — if the output above is a Python traceback the validator itself failed to run ' +
            '(missing dependency), which is not a defect in the document; otherwise the OOXML is invalid.');
        }
      } else {
        process.stderr.write('build_dpia: validate.py not found; skipped validation\n');
      }
    }
    process.stdout.write(outPath + '\n');
  }).catch(e => fail(1, 'packing failed: ' + (e && e.stack ? e.stack : e)));
}

main();
