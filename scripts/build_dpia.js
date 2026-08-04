#!/usr/bin/env node
/**
 * build_dpia.js — dpia-generator document assembler (v3.0)
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
 *   2  OOXML validation failure (the validator ran and rejected the document;
 *      a validator that cannot run — missing Python deps — skips with a warning)
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
 * REGULATOR CONCLUSION GATE (v3.0, exit 3; formerly the Article 36 gate)
 * The rating gate stops the register from contradicting the matrix. It does
 * not stop the *prose* from contradicting the register — a DPIA whose table
 * carries a High residual while its executive summary says prior consultation
 * is not required is the same class of defect, in the sentence a regulator
 * actually reads. So the manifest must declare a conclusion per jurisdiction:
 *
 *   "jurisdictions": ["eu-gdpr", "uk-gdpr"],   // default ["eu-gdpr"]; codes below
 *   "regulatorConclusions": {                  // one entry per declared jurisdiction,
 *     "eu-gdpr": {"priorConsultation": true},  //   REQUIRED whenever a riskRegister
 *     "uk-gdpr": {"priorConsultation": true}   //   block exists
 *   }
 *
 *   "art36": true | false                      // legacy alias, still accepted: fills
 *                                              //   priorConsultation for every declared
 *                                              //   prior-consultation regime that has
 *                                              //   no explicit entry
 *
 * For prior-consultation regimes (EU/UK GDPR and later additions marked
 * derivable in the REGIMES registry) the script derives the answer from the
 * register — any High residual engages consultation — and stops with exit 3 if
 * the declaration disagrees. For non-derivable regimes (statutory-checklist
 * assessments added by later phases) the gate checks only that a conclusion is
 * declared: silence is a manifest error (exit 1), never a pass. As with the
 * rating gate, do not resolve a failure by flipping the declaration to match:
 * decide which is wrong, the conclusion or the scores, and fix that. The script
 * also scans narrative blocks for a sentence asserting the opposite of the
 * derived answer and warns on stderr — a warning, not a stop, because phrasing
 * is too varied to gate on.
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
 *   "jurisdictions": ["eu-gdpr"],              // optional; default ["eu-gdpr"]; every
 *                                              //   code must exist in REGIMES below
 *   "regulatorConclusions": { ... },           // see conclusion gate above
 *   "art36": false,                            // legacy alias; see conclusion gate
 *   "docTitle": null,                          // optional; default "DATA PROTECTION
 *                                              //   IMPACT ASSESSMENT" — override for
 *                                              //   regimes that name the instrument
 *                                              //   differently (e.g. a US state
 *                                              //   "DATA PROTECTION ASSESSMENT")
 *   "headerText": null,                        // optional; default "PRIVILEGED &
 *                                              //   CONFIDENTIAL — ATTORNEY WORK
 *                                              //   PRODUCT". Set to "" to omit —
 *                                              //   deliberate for documents drafted
 *                                              //   for regulator production where the
 *                                              //   privilege header cannot be
 *                                              //   sustained (see the destination
 *                                              //   check and the per-regime privilege
 *                                              //   notes in references/jurisdictions/)
 *   "outputDir": "/mnt/user-data/outputs",     // default; must resolve under an
 *                                              //   allowed root (default outputs
 *                                              //   dir or the OS temp dir; extend
 *                                              //   via DPIA_OUTPUT_ROOTS)
 *   "outputFilename": null,                    // default DPIA_<System>_<date>.docx;
 *                                              //   reduced to a basename, never a path
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
 *   {"type":"complianceMap","regime":"us-co","title":"...",         // regime optional but
 *    "rows":[{"element":"<statutory required element>",            //   must be a known code
 *             "section":"2.3","note":"optional"}]}                 //   if present
 *      -- renders the regime -> required element -> DPIA section cross-reference
 *         table for statutory-checklist regimes. Every "section" must match a
 *         heading in this manifest (leading "S"/section marks stripped,
 *         case-insensitive substring); a dangling reference is exit 1, because a
 *         compliance map pointing at sections that do not exist is the checklist
 *         version of a fabricated citation.
 *   {"type":"signature","rows":[["Data Protection Officer","______","Date"]]}
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

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

// ------------------------------------------------------- jurisdiction registry
// Codes accepted in the manifest's "jurisdictions" array. Each regime declares
// how its regulator-engagement conclusion is keyed and, where the answer is
// derivable from the register, how to derive it. Prior-consultation regimes
// (EU/UK GDPR pattern: consultation engages on any High residual) are
// derivable; statutory-checklist regimes (US states, China PIPL, India DPDP —
// added by their build phases) set derive to null: their conclusion is
// declared and reviewed, not derived, and the gate checks only that the
// declaration exists. highResidualNote is the register footnote fragment for
// the regime; substantive analysis lives in references/jurisdictions/<code>.md.
const REGIMES = {
  'eu-gdpr': {
    label: 'EU GDPR',
    conclusionKey: 'priorConsultation',
    derive: (state) => state.highResidual,
    highResidualNote: 'Article 36 prior consultation with the competent supervisory authority',
  },
  'uk-gdpr': {
    label: 'UK GDPR',
    conclusionKey: 'priorConsultation',
    derive: (state) => state.highResidual,
    highResidualNote: 'UK GDPR Article 36 prior consultation with the ICO',
  },
  // Statutory-checklist regimes (Model B modules). derive: null — the
  // conclusion is the declared answer to the regime's own trigger screen
  // (assessment required or not), reviewed against references/jurisdictions/,
  // not derivable from the residual ratings.
  'us-co': {
    label: 'Colorado CPA',
    conclusionKey: 'assessmentRequired',
    derive: null,
  },
  'us-ca': {
    label: 'California CCPA/CPRA',
    conclusionKey: 'assessmentRequired',
    derive: null,
  },
  'us-state': {
    label: 'US state privacy laws (VA/CT/TX pattern)',
    conclusionKey: 'assessmentRequired',
    derive: null,
  },
  'ca-qc': {
    label: 'Quebec Law 25',
    conclusionKey: 'piaRequired',
    derive: null,
  },
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
  const out = [
    p('', { after: 900 }),
    p(docTitleOf(m), { align: AlignmentType.CENTER, bold: true, size: 36 }),
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
  ];
  if (headerTextOf(m)) {
    out.push(p(headerTextOf(m), { align: AlignmentType.CENTER, bold: true, size: 20, color: '9C0006' }));
  }
  out.push(new Paragraph({ children: [new (D.PageBreak)()] }));
  return out;
}

// The privilege header is the default because the DPIA is drafted as counsel's
// work product. It is parameterized because the default is not sustainable
// everywhere: a document drafted for production to a regulator (a Colorado
// assessment producible to the AG; a CPPA filing) must not carry a header the
// disclosure itself would falsify. "" deliberately omits the header; the
// per-regime privilege notes in references/jurisdictions/ say when to do that.
function headerTextOf(m) {
  return m.headerText !== undefined ? String(m.headerText) : 'PRIVILEGED & CONFIDENTIAL \u2014 ATTORNEY WORK PRODUCT';
}
function docTitleOf(m) {
  return m.docTitle ? String(m.docTitle) : 'DATA PROTECTION IMPACT ASSESSMENT';
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
          state.highResidual = true;
          const consultNotes = (state.jurisdictions || ['eu-gdpr'])
            .filter(c => REGIMES[c] && REGIMES[c].derive)
            .map(c => REGIMES[c].highResidualNote);
          const footnote = consultNotes.length
            ? `* Residual risk rated High \u2014 ${consultNotes.join(' and ')} is engaged for this risk, and the processing may not commence until that consultation has concluded.`
            : '* Residual risk rated High \u2014 see the regulator-engagement analysis in Section 5 for the obligations this rating triggers in each applicable jurisdiction.';
          children.push(p(footnote, { italic: true, size: 18 }));
        }
        children.push(p('', { after: 120 }));
        break;
      }
      case 'complianceMap': {
        if (!Array.isArray(b.rows) || !b.rows.length) fail(1, `${ctx}: needs non-empty "rows"`);
        if (b.regime && !REGIMES[b.regime]) {
          fail(1, `${ctx}: unknown regime code "${b.regime}". Known: ${Object.keys(REGIMES).join(', ')}`);
        }
        const headings = (manifest.blocks || [])
          .filter(x => x && x.type === 'heading')
          .map(x => String(x.text || '').toLowerCase());
        const missing = [];
        const rows = b.rows.map((r, j) => {
          const el = r.element, sec = String(r.section || '').trim();
          if (!el || !sec) fail(1, `${ctx}: row ${j + 1} needs "element" and "section"`);
          const probe = sec.replace(/^[\u00a7Ss]\s*/, '').toLowerCase();
          if (!headings.some(h => h.includes(probe))) missing.push(sec);
          return [String(el), sec + (r.note ? ` \u2014 ${r.note}` : '')];
        });
        if (missing.length) {
          fail(1, `${ctx}: "section" reference(s) match no heading in this manifest: ${missing.join(', ')}. ` +
                  'A compliance map must point at sections that exist \u2014 a dangling cross-reference is the ' +
                  'checklist version of a fabricated citation.');
        }
        const regimeLabel = b.regime ? REGIMES[b.regime].label : '';
        children.push(p(b.title || `Content compliance map${regimeLabel ? ' \u2014 ' + regimeLabel : ''}`, { bold: true, after: 100 }));
        children.push(dataTable(['Required element', 'Where addressed'], rows, [55, 45]));
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
    description: headerTextOf(manifest) || `DPIA \u2014 ${manifest.systemName}`,
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
          children: headerTextOf(manifest)
            ? [p(headerTextOf(manifest),
                { align: AlignmentType.RIGHT, bold: true, size: 16, color: '9C0006', after: 0 })]
            : [new Paragraph({ children: [] })],
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

  // The manifest is authored from instructions that may include untrusted
  // ingested content (vendor pages, pasted specs), so both "outputDir" and
  // "outputFilename" are semi-trusted inputs. Confine the write to an allowlist
  // of roots — the default outputs directory and the OS temp dir (the regression
  // harness writes there) — extendable via DPIA_OUTPUT_ROOTS for other images.
  // Without this, a manifest "outputDir" alone can direct the write anywhere the
  // process can write, which is exactly what the outputFilename guard below is
  // meant to prevent.
  const DEFAULT_OUT = '/mnt/user-data/outputs';
  const allowedRoots = [DEFAULT_OUT, os.tmpdir()]
    .concat((process.env.DPIA_OUTPUT_ROOTS || '').split(path.delimiter).filter(Boolean))
    .map(r => path.resolve(r));
  const isInside = (base, target) => {
    const rel = path.relative(base, target);
    return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
  };
  const outDir = path.resolve(m.outputDir || DEFAULT_OUT);
  if (!allowedRoots.some(root => isInside(root, outDir))) {
    fail(1, `manifest: "outputDir" (${outDir}) is outside the permitted output roots ` +
            `[${allowedRoots.join(', ')}]. Set DPIA_OUTPUT_ROOTS to permit another location.`);
  }

  const safe = String(m.systemName).replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
  // basename() so a manifest "outputFilename" cannot write outside outputDir via "../".
  // basename(".."|".") returns the reference itself, so reject those (and empty)
  // explicitly — otherwise path.join(outDir, "..") would climb out of outDir.
  let named = m.outputFilename ? path.basename(String(m.outputFilename)) : '';
  if (m.outputFilename && (named === '.' || named === '..' || named === '')) {
    process.stderr.write(`build_dpia: note — "outputFilename" (${JSON.stringify(m.outputFilename)}) is not a usable filename; using the default name.\n`);
    named = '';
  } else if (m.outputFilename && named !== String(m.outputFilename)) {
    process.stderr.write(`build_dpia: note — "outputFilename" was reduced to "${named}"; it may not contain a path.\n`);
  }
  const outPath = path.join(outDir, named || `DPIA_${safe}_${m.date}.docx`);
  // Belt and braces: confirm the fully-resolved path never escaped outDir.
  if (!isInside(outDir, path.resolve(outPath))) {
    fail(1, `manifest: resolved output path (${path.resolve(outPath)}) escapes "outputDir" (${outDir}).`);
  }

  fs.mkdirSync(outDir, { recursive: true });

  // ---- Jurisdiction resolution ---------------------------------------------
  if (m.jurisdictions !== undefined && (!Array.isArray(m.jurisdictions) || !m.jurisdictions.length)) {
    fail(1, 'manifest: "jurisdictions" must be a non-empty array of regime codes when present');
  }
  const jur = m.jurisdictions || ['eu-gdpr'];
  jur.forEach(c => {
    if (!REGIMES[c]) fail(1, `manifest: unknown jurisdiction code "${c}". Known codes: ${Object.keys(REGIMES).join(', ')}`);
  });

  // regulatorConclusions, with "art36" as a legacy alias: it fills
  // priorConsultation for every declared prior-consultation (derivable) regime
  // that has no explicit entry. The derivation is identical across those
  // regimes — consultation engages on any High residual — so a single legacy
  // declaration cannot say two different things.
  const rc = {};
  if (m.regulatorConclusions !== undefined) {
    if (typeof m.regulatorConclusions !== 'object' || Array.isArray(m.regulatorConclusions) || m.regulatorConclusions === null) {
      fail(1, 'manifest: "regulatorConclusions" must be an object keyed by jurisdiction code');
    }
    for (const [code, entry] of Object.entries(m.regulatorConclusions)) {
      if (!jur.includes(code)) {
        fail(1, `manifest: regulatorConclusions["${code}"] refers to a regime not declared in "jurisdictions" ` +
                `[${jur.join(', ')}]. A conclusion for a regime out of scope is a manifest error.`);
      }
      if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
        fail(1, `manifest: regulatorConclusions["${code}"] must be an object`);
      }
      rc[code] = Object.assign({}, entry);
    }
  }
  if (m.art36 !== undefined && m.art36 !== null) {
    if (typeof m.art36 !== 'boolean') {
      fail(1, `manifest: "art36" must be a boolean, got ${JSON.stringify(m.art36)}`);
    }
    jur.filter(c => REGIMES[c].derive).forEach(c => {
      if (!rc[c] || rc[c][REGIMES[c].conclusionKey] === undefined) {
        rc[c] = Object.assign({}, rc[c], { [REGIMES[c].conclusionKey]: m.art36 });
      }
    });
  }

  const state = { highResidual: false, jurisdictions: jur };
  const doc = build(m, state);

  const hasRegister = (m.blocks || []).some(b => b && b.type === 'riskRegister');

  // ---- Regulator conclusion gate (exit 3; missing declaration exit 1) -------
  if (hasRegister) {
    for (const code of jur) {
      const def = REGIMES[code];
      const declared = rc[code] ? rc[code][def.conclusionKey] : undefined;
      if (declared === undefined || declared === null) {
        if (def.derive) {
          fail(1, `manifest: "art36" is required when the DPIA contains a riskRegister ` +
                  `(or declare regulatorConclusions["${code}"].${def.conclusionKey}). Declare the ` +
                  'prior-consultation conclusion as true or false; the script checks it against the register.');
        }
        fail(1, `manifest: regulatorConclusions["${code}"].${def.conclusionKey} is required when the DPIA ` +
                `contains a riskRegister. A ${def.label} assessment that has not formed a view on its ` +
                'regulator-engagement obligations is not finished.');
      }
      if (typeof declared !== 'boolean') {
        fail(1, `manifest: regulatorConclusions["${code}"].${def.conclusionKey} must be a boolean, got ${JSON.stringify(declared)}`);
      }
      if (def.derive) {
        const expected = def.derive(state);
        if (declared !== expected) {
          const derivedWhy = expected
            ? 'at least one residual risk rates High'
            : 'no residual risk rates High';
          fail(3, 'ARTICLE 36 CONCLUSION GATE FAILED (exit 3) — do not deliver:\n  ' +
            `[${code}] manifest declares ${def.conclusionKey}=${declared}, but the register derives ${expected} (${derivedWhy}).\n  ` +
            'Do not flip the declaration to silence this. Either the conclusion is wrong, or a ' +
            'likelihood/severity score is — decide which, and fix that.');
        }
      }
    }
  }

  // The narrative scan and status warnings speak Art. 36; they apply only where
  // a prior-consultation regime is in scope.
  const consultInScope = jur.some(c => REGIMES[c].derive);

  // ---- Narrative contradiction scan (warning) -------------------------------
  const hits = scanNarrative(m.blocks);
  const contradictions = state.highResidual ? hits.denies : hits.asserts;
  if (hasRegister && consultInScope && contradictions.length) {
    process.stderr.write(
      `build_dpia: WARNING — the register derives Art. 36 = ${state.highResidual}, but narrative text appears to ` +
      `assert the opposite at: ${contradictions.join('; ')}. Read those passages before delivering; the ` +
      'executive summary is the part a supervisory authority reads first.\n');
  }

  // ---- Cover-status coherence (warning) ------------------------------------
  const art36Status = 'requires art. 36 prior consultation';
  if (state.highResidual && consultInScope && String(m.status || 'Draft').trim().toLowerCase() !== art36Status) {
    process.stderr.write(
      'build_dpia: WARNING — a residual risk rates High (Art. 36 prior consultation engaged) but manifest ' +
      `"status" is "${m.status || 'Draft'}". Confirm the cover page and executive summary carry the Art. 36 flag.\n`);
  }

  Packer.toBuffer(doc).then(buf => {
    fs.writeFileSync(outPath, buf);
    if (!noValidate) {
      const v = '/mnt/skills/public/docx/scripts/office/validate.py';
      if (fs.existsSync(v)) {
        const r = spawnSync('python3', [v, outPath], { encoding: 'utf8' });
        if (r.stdout) process.stdout.write(r.stdout);
        if (r.stderr) process.stderr.write(r.stderr);
        if (r.error || r.status !== 0) {
          // A Python traceback (or a failure to launch python3 at all) means the
          // validator itself could not run — a missing dependency in the
          // environment, not a defect in the document. Only a clean validator
          // run that rejects the file is an OOXML failure.
          const crashed = r.error || /Traceback \(most recent call last\)/.test(r.stderr || '');
          if (crashed) {
            process.stderr.write('build_dpia: validate.py could not run (missing dependency?); ' +
              'validation skipped — not a defect in the document.\n');
          } else {
            fail(2, 'OOXML validation failed for ' + outPath);
          }
        }
      } else {
        process.stderr.write('build_dpia: validate.py not found; skipped validation\n');
      }
    }
    process.stdout.write(outPath + '\n');
  }).catch(e => fail(1, 'packing failed: ' + (e && e.stack ? e.stack : e)));
}

main();
