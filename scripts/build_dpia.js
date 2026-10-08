#!/usr/bin/env node
/**
 * build_dpia.js — dpia-generator document assembler
 * (versioned with the skill; SKILL.md's ## Version section is canonical)
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
 *   2  OOXML validation failure (the full validator where present, otherwise the
 *      bundled scripts/check_ooxml.py well-formedness check — never skipped)
 *   3  rating gate or regulator-conclusion gate failure — HARD STOP. Never resolve
 *      by editing the stated rating or flipping the declaration: re-examine the
 *      scores (the DESIGN NOTES comment below the schema says why).
 *
 * This comment is the manifest author's read; the design notes after it are
 * background.
 *
 * MANIFEST SCHEMA
 * {
 *   "systemName": "Vendor Sentiment Engine",   // required
 *   "date": "2026-07-25",                      // required, YYYY-MM-DD
 *   "version": "1.0 - DRAFT FOR DPO REVIEW",   // optional
 *   "controller": "Acme Ltd",                  // optional; placeholder if omitted
 *   "dpo": "...", "counsel": "...",            // optional; "counsel" also gates the
 *                                              //   cover's Counsel of Record line and
 *                                              //   the footer's reviewer phrase
 *   "reference": "[DPIA-2026-001]",            // optional
 *   "status": "Draft",                         // cover checkbox vocabulary is DERIVED
 *                                              //   from "jurisdictions": Draft | Under
 *                                              //   DPO Review | Approved, plus each declared
 *                                              //   regime's blocking state (e.g. the
 *                                              //   Art. 36 box for EU/UK, the FDPIC
 *                                              //   box for ch-fadp). A status outside
 *                                              //   the vocabulary renders as an extra
 *                                              //   checked box with a stderr note.
 *   "statusOptions": null,                     // optional array; overrides the derived
 *                                              //   vocabulary entirely
 *   "jurisdictions": ["eu-gdpr"],              // optional; default ["eu-gdpr"]; every
 *                                              //   code must exist in REGIMES below
 *   "regulatorConclusions": {                  // REQUIRED whenever a riskRegister block
 *     "eu-gdpr": {"priorConsultation": true},  //   exists: one entry per declared
 *     "uk-gdpr": {"priorConsultation": true}   //   jurisdiction, keyed by the regime's
 *   },                                         //   conclusionKey (REGIMES registry below)
 *   "art36": false,                            // legacy alias: true | false | "conditional";
 *                                              //   fills priorConsultation for every declared
 *                                              //   prior-consultation regime with no entry
 *   "docTitle": null,                          // optional; default "DATA PROTECTION
 *                                              //   IMPACT ASSESSMENT" — override for
 *                                              //   regimes that name the instrument
 *                                              //   differently (e.g. a US state
 *                                              //   "DATA PROTECTION ASSESSMENT")
 *   "headerText": null,                        // optional; default is posture-derived:
 *                                              //   "PRIVILEGED & CONFIDENTIAL — ATTORNEY
 *                                              //   WORK PRODUCT" where "counsel" is
 *                                              //   named, "CONFIDENTIAL — DRAFT FOR
 *                                              //   DPO REVIEW" otherwise. Set to "" to
 *                                              //   omit — deliberate for documents drafted
 *                                              //   for regulator production where the
 *                                              //   privilege header cannot be
 *                                              //   sustained (see the destination
 *                                              //   check and the per-regime privilege
 *                                              //   notes in references/jurisdictions/)
 *   "outputDir": "/mnt/user-data/outputs",     // default; must resolve under an
 *                                              //   allowed root (default outputs
 *                                              //   dir or the OS temp dir; extend
 *                                              //   via DPIA_OUTPUT_ROOTS)
 *   "outputFilename": null,                    // default <prefix>_<System>_<date>.docx,
 *                                              //   where <prefix> is the docTitle's
 *                                              //   initials (default title -> "DPIA",
 *                                              //   "DATA PROTECTION ASSESSMENT" ->
 *                                              //   "DPA"); reduced to a basename,
 *                                              //   never a path
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
 *        "inherentRating":"High","residualRating":"Low",   // ratings optional; checked if present
 *        "mitigatedLikelihood":"Low","mitigatedSeverity":"High",  // optional post-mitigation scores,
 *        "mitigatedRating":"Medium"}                        //   together or not at all (design notes)
 *   ]}
 *   {"type":"matrix","title":"Inherent risk","stage":"inherent"|"residual"|"mitigated","source":"<riskRegister id>"}
 *      -- plots the register's risk IDs onto the coloured 3x3 grid.
 *   {"type":"complianceMap","regime":"us-co","title":"...",         // regime optional but
 *    "rows":[{"element":"<statutory required element>",            //   must be a known code
 *             "section":"2.3","note":"optional"}]}                 //   if present
 *      -- renders the regime -> required element -> DPIA section cross-reference
 *         table for statutory-checklist regimes. Every "section" must match a
 *         heading in this manifest: a numbered reference ("SECTION 4", "\u00a74",
 *         "4.2") by the heading's section number, any other by the heading's
 *         whole text, label or title (case-insensitive, never a substring);
 *         a dangling reference is exit 1, because a
 *         compliance map pointing at sections that do not exist is the checklist
 *         version of a fabricated citation.
 *   {"type":"regulatorTable","title":"...",                         // all fields optional
 *    "notes":{"eu-gdpr":"R1 residual High"}}
 *      -- renders the Regime | Engagement mechanism | Conclusion table for every
 *         declared jurisdiction, COMPUTED from regulatorConclusions + the REGIMES
 *         registry (never hand-authored — same rule as the matrix). A declared
 *         jurisdiction with no conclusion is exit 1. "notes" appends per-regime
 *         reasoning to the conclusion cell.
 *   {"type":"noticeCheck","title":"...",                            // title optional
 *    "notice":{"source":"https://acme.example/privacy",            // required: the notice URL or
 *              "audience":"customers",                             //   document the commitments
 *              "date":"2026-03-01",                                //   were read from; "date" =
 *              "profile":"acme-notice-profile.yaml"},              //   when it was indexed
 *    "rows":[{"commitment":"We collect only X and Y",              // verbatim from the notice
 *             "section":"s. 4.2",                                  // optional pinpoint
 *             "processing":"New feature also collects W",          // the new processing reality
 *             "verdict":"consistent"|"drift"|"conflict",
 *             "action":"Amend s. 4.2 - owner: Privacy PM"}]}       // REQUIRED on drift|conflict
 *      -- renders the Section 1.10 privacy-notice consistency table, computed
 *         per row: verdict cells are colour-coded from the same palette as the
 *         ratings, a drift/conflict row with no "action" is exit 1 (the
 *         resolution rule — inconsistency must be resolved before deployment —
 *         is a gate, not advice), any drift/conflict appends the builder-owned
 *         resolution footnote, and a notice indexed more than six months before
 *         the assessment date warns on stderr. Rows come from the controller's
 *         notice profile (references/notice-profile.md) where one exists.
 *   {"type":"signature","rows":[["Data Protection Officer","______","Date"]]}
 */

/**
 * DESIGN NOTES (background; not needed to author a manifest)
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
 * actually reads. So the manifest declares a conclusion per jurisdiction
 * (regulatorConclusions, or the legacy art36 alias). For prior-consultation
 * regimes (EU/UK GDPR, Kenya — marked derivable in the REGIMES registry) the
 * script derives the answer from the register and stops with exit 3 if the
 * declaration disagrees. For non-derivable regimes (statutory-checklist
 * assessments) the gate checks only that a conclusion is declared: silence is a
 * manifest error (exit 1), never a pass. Do not resolve a failure by flipping
 * the declaration to match: decide which is wrong, the conclusion or the
 * scores, and fix that. The script also scans narrative blocks for a sentence
 * asserting the opposite of the derived answer and warns on stderr — a
 * warning, not a stop, because phrasing is too varied to gate on. A register
 * authored as a plain "table" (v4.4.5) is refused outright: the gates never
 * see it.
 *
 * CONDITIONAL CONSULTATION (v4.0)
 * Art. 36(1) keys to high risk "in the absence of measures taken by the
 * controller to mitigate the risk". Register rows may therefore carry optional
 * post-mitigation scores (mitigatedLikelihood / mitigatedSeverity) — the
 * residual expected once Section 5's recommended mitigations are implemented.
 * The derived consultation conclusion is then tri-state: false (no High
 * residual); "conditional" (every High residual falls below High
 * post-mitigation — consultation is required only if the controller proceeds
 * WITHOUT implementing the mitigations); true (at least one High residual has
 * no such pathway). "art36" and priorConsultation accept true|false|
 * "conditional" accordingly, the register footnote states the conditional
 * pathway, and the register gains a Post-mitigation column when any row scores
 * one. A "mitigated" matrix stage plots the post-mitigation grid.
 *
 * GENERATION TRANSPARENCY (v4.0, no manifest knob)
 * Every document self-identifies as an AI-generated draft of the dpia-generator
 * skill — cover notice, footer line, and file metadata — for human review and
 * adoption. This is builder-owned text and deliberately not overridable. The
 * footer's reviewer phrase is posture-derived, not a knob (v4.1.2): "for
 * attorney review" only where counsel is named AND the work-product header is
 * on; "for DPO review" otherwise — a DPO-led run has no attorney to review it,
 * and a producible record must not tell a regulator it is an attorney draft.
 */

const crypto = require('crypto');
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

// Own-property lookup for objects keyed by manifest-supplied strings. A plain
// obj[key] lets "__proto__" or "constructor" resolve through the prototype
// chain — a manifest-controlled key must never do that: it bypasses the
// unknown-code check and crashes downstream instead of failing cleanly.
function own(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
}

// Text sink guard. Every string that reaches a TextRun, the core properties
// or the footer passes through here. Two things it stops: an object where a
// scalar was expected (which String() would render as "[object Object]", or
// throw on for a non-callable toString), and characters XML 1.0 forbids —
// the docx library escapes <>& but writes C0 controls and U+FFFE/FFFF through
// verbatim, and Word then refuses the file. \v and \f are common in text
// pasted from PDFs, so they are stripped rather than rejected.
const XML_FORBIDDEN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g;
function txt(v, ctx) {
  if (typeof v === 'object' && v !== null) {
    fail(1, `${ctx || 'manifest'}: expected text, got ${Array.isArray(v) ? 'an array' : 'an object'}`);
  }
  const s = String(v);
  return (s.toWellFormed ? s.toWellFormed() : s).replace(XML_FORBIDDEN, '');
}

// Row-shape guards for manifest-supplied "rows" arrays. A null or mis-typed
// entry must fail with a clean exit 1 and a named row, never a TypeError stack
// trace from the first member access — same contract as the v3.4.1 hardening.
function rowObject(r, ctx) {
  if (typeof r !== 'object' || r === null || Array.isArray(r)) {
    fail(1, `${ctx}: each row must be an object, got ${r === null ? 'null' : Array.isArray(r) ? 'an array' : typeof r}`);
  }
  return r;
}
function rowArray(r, ctx) {
  if (!Array.isArray(r)) {
    fail(1, `${ctx}: each row must be an array of cells, got ${r === null ? 'null' : typeof r}`);
  }
  return r;
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

// noticeCheck verdict vocabulary. Colour-coded from the same palette as the
// ratings so a reviewer reads drift severity the way they read risk severity.
const VERDICTS = {
  consistent: { label: 'Consistent', style: RATING_STYLE.Low },
  drift:      { label: 'Drift',      style: RATING_STYLE.Medium },
  conflict:   { label: 'Conflict',   style: RATING_STYLE.High },
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
// the regime; substantive analysis lives in the regime's module in
// references/jurisdictions/ (named descriptively, not by code: uk-gdpr.md,
// brazil-lgpd.md, us-colorado.md, ...). highResidualNote and engagement may be
// functions of the assessment date, for a regime whose authority changes
// name on a fixed date (regimeText() below resolves them).
// Cover-page vocabulary: the review status is uniformly "Under DPO Review"
// (the review officer's exact statutory title varies by regime but the cover
// checkbox does not need that detail); "statusOption" is a blocking lifecycle
// state the regime contributes to the cover checkboxes when declared. Regimes
// with no consultation-style stop contribute none — a Colorado-only assessment
// must not offer an Art. 36 box.
const UK_IC_FROM = '2026-09-30'; // YYYY-MM-DD strings compare chronologically
const REGIMES = {
  'eu-gdpr': {
    label: 'EU GDPR',
    conclusionKey: 'priorConsultation',
    derive: (state) => state.consult,
    highResidualNote: 'Article 36 prior consultation with the competent supervisory authority',
    statusOption: 'Requires Art. 36 Prior Consultation',
    engagement: "Art. 36 prior consultation with the competent supervisory authority on residual high risk",
    conclusionLabels: ["Prior consultation required", "Prior consultation not required", "Prior consultation required unless the Section 5 mitigations are implemented"],
  },
  'uk-gdpr': {
    label: 'UK GDPR',
    conclusionKey: 'priorConsultation',
    derive: (state) => state.consult,
    // The Information Commission replaced the ICO on 2026-09-30. A document
    // dated before then names the ICO; one dated on or after it names the
    // successor — a filed record must not direct consultation to a body that
    // no longer exists.
    highResidualNote: (date) => date < UK_IC_FROM
      ? 'UK GDPR Article 36 prior consultation with the ICO'
      : 'UK GDPR Article 36 prior consultation with the Information Commission (the ICO before 2026-09-30)',
    statusOption: 'Requires Art. 36 Prior Consultation',
    engagement: (date) => date < UK_IC_FROM
      ? "UK GDPR Art. 36 prior consultation with the ICO (the Information Commission from 2026-09-30) on residual high risk"
      : "UK GDPR Art. 36 prior consultation with the Information Commission (the ICO before 2026-09-30) on residual high risk",
    conclusionLabels: ["Prior consultation required", "Prior consultation not required", "Prior consultation required unless the Section 5 mitigations are implemented"],
  },
  // Statutory-checklist regimes (Model B modules). derive: null — the
  // conclusion is the declared answer to the regime's own trigger screen
  // (assessment required or not), reviewed against references/jurisdictions/,
  // not derivable from the residual ratings.
  'us-co': {
    label: 'Colorado CPA',
    conclusionKey: 'assessmentRequired',
    derive: null,
    engagement: "Data protection assessment producible to the Colorado AG within 30 days of request; no filing, no consultation",
    conclusionLabels: ["Assessment required", "Assessment not required"],
  },
  'us-ca': {
    label: 'California CCPA/CPRA',
    conclusionKey: 'assessmentRequired',
    derive: null,
    engagement: "Risk assessment; attestation and summary filed with the CPPA on schedule; full assessment producible on request",
    conclusionLabels: ["Assessment required", "Assessment not required"],
  },
  'us-state': {
    label: 'US state privacy laws (VA/CT/TX pattern)',
    conclusionKey: 'assessmentRequired',
    derive: null,
    engagement: "Assessment producible to the state AG on civil investigative demand; no filing, no consultation",
    conclusionLabels: ["Assessment required", "Assessment not required"],
  },
  'ca-qc': {
    label: 'Quebec Law 25',
    conclusionKey: 'piaRequired',
    derive: null,
    engagement: "PIA maintained; CAI may require production in an investigation; PIA is a precondition to communication outside Quebec",
    conclusionLabels: ["PIA required", "PIA not required"],
  },
  'br-lgpd': {
    label: 'Brazil LGPD',
    conclusionKey: 'ripdRequired',
    derive: null,
    engagement: "RIPD maintained; producible to the ANPD on demand (Art. 38); no filing, no consultation",
    conclusionLabels: ["RIPD required", "RIPD not required"],
  },
  'cn-pipl': {
    label: 'China PIPL',
    conclusionKey: 'pipiaRequired',
    derive: null,
    engagement: "PIPIA report retained at least three years; filed with the provincial CAC where the SCC export route is used",
    conclusionLabels: ["PIPIA required", "PIPIA not required"],
  },
  // Switzerland has a true prior-consultation mechanism (revFADP Art. 23) but
  // is deliberately NON-derivable: Art. 23(4) lets a controller that consulted
  // its data protection advisor lawfully skip the FDPIC on a High residual, a
  // fact the builder cannot see. The declaration is reviewed, not derived —
  // see references/jurisdictions/switzerland-fadp.md §2.
  'ch-fadp': {
    label: 'Switzerland revFADP',
    conclusionKey: 'fdpicConsultation',
    derive: null,
    statusOption: 'Requires FDPIC Consultation',
    engagement: "FDPIC opinion before processing on residual high risk (Art. 23), unless the Art. 23(4) advisor route is taken and documented",
    conclusionLabels: ["FDPIC consultation required", "FDPIC consultation not required"],
  },
  'in-dpdp': {
    label: 'India DPDP',
    conclusionKey: 'dpiaRequired',
    derive: null,
    engagement: "Annual SDF DPIA and independent audit; significant observations reported to the Data Protection Board",
    conclusionLabels: ["DPIA required (SDF)", "No DPIA duty (not a designated SDF)"],
  },
  'sg-pdpa': {
    label: 'Singapore PDPA',
    conclusionKey: 'assessmentRequired',
    derive: null,
    engagement: "Assessment producible to the PDPC in an investigation; statutory precondition for deemed consent by notification and the legitimate interests exception",
    conclusionLabels: ["Assessment required", "Assessment not required"],
  },
  'my-pdpa': {
    label: 'Malaysia PDPA',
    conclusionKey: 'assessmentRequired',
    derive: null,
    engagement: "DPIA under the JPDP DPIA Guideline (issued 2026-04-30) where its mandatory thresholds are met; retained and producible to the Commissioner on request \u2014 verify thresholds and effective date against the guideline text",
    conclusionLabels: ["Assessment required", "Assessment not required"],
  },
  'au-privacy': {
    label: 'Australia Privacy Act',
    conclusionKey: 'piaRequired',
    derive: null,
    engagement: "Agency PIAs registered under the APP Code; OAIC may require production in an investigation",
    conclusionLabels: ["PIA required", "PIA not required"],
  },
  'kr-pipa': {
    label: 'South Korea PIPA',
    conclusionKey: 'piaRequired',
    derive: null,
    statusOption: 'Requires PIPC-Designated Agency Assessment',
    engagement: "Public-institution PIA performed by a PIPC-designated agency and submitted to the PIPC",
    conclusionLabels: ["PIA required", "PIA not required"],
  },
  // Kenya is derivable: s. 31 DPA 2019 requires Data Commissioner consultation
  // where the DPIA indicates high risk — a true Art. 36 analog with no advisor
  // alternative (unlike ch-fadp). See references/jurisdictions/kenya-dpa.md.
  'ke-dpa': {
    label: 'Kenya DPA 2019',
    conclusionKey: 'priorConsultation',
    derive: (state) => state.consult,
    highResidualNote: 'prior consultation with the Kenyan Data Commissioner under s. 31 DPA 2019',
    statusOption: 'Requires ODPC Consultation',
    engagement: "DPIA for high-risk processing (s. 31); Data Commissioner consultation on residual high risk; submission timeline per the Data Protection (General) Regulations 2021 (LN 263/2021)",
    conclusionLabels: ["Prior consultation required", "Prior consultation not required", "Prior consultation required unless the Section 5 mitigations are implemented"],
  },
  'vn-pdpl': {
    label: 'Vietnam PDP Law',
    conclusionKey: 'dossierRequired',
    derive: null,
    engagement: "Processing and transfer impact dossiers submitted to the MPS (A05) within 60 days; producible in inspections; MPS may order transfer suspension",
    conclusionLabels: ["Dossier required", "Dossier not required"],
  },
  'id-pdp': {
    label: 'Indonesia PDP Law',
    conclusionKey: 'dpiaRequired',
    derive: null,
    engagement: "DPIA maintained for high-risk processing (Art. 34; GR 33/2026); production expectations pending the supervisory authority's establishment",
    conclusionLabels: ["DPIA required", "DPIA not required"],
  },
};

// A registry text field that may depend on the assessment date (see UK_IC_FROM).
function regimeText(def, key, date) {
  const v = def[key];
  return typeof v === 'function' ? v(date) : v;
}

// Calendar-date check for manifest-supplied YYYY-MM-DD fields. The regex alone
// is not enough ("2026-13-99" passes it), and neither is isNaN(new Date(...)):
// V8 rolls an out-of-range day over into the next month ("2026-02-31" parses as
// March 3rd), so the parsed date must round-trip to the exact input string. A
// date that fails either way would put nonsense on the cover and silently
// disable the NaN-vulnerable staleness arithmetic downstream.
function isRealDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !isNaN(d) && d.toISOString().slice(0, 10) === s;
}

function norm(v, field, ctx) {
  if (v === undefined || v === null) fail(1, `${ctx}: missing "${field}"`);
  const s = txt(v, `${ctx} "${field}"`).trim();
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
  // Every manifest-authored text field a reader sees: headings, para and
  // bullet text, table cells, and the free-text fields of the computed blocks
  // (regulatorTable notes, complianceMap rows, noticeCheck rows) — a denial
  // in a regulator-table note reads exactly like one in the summary.
  const str = (v) => (v === undefined || v === null || typeof v === 'object') ? '' : String(v);
  const rowsOf = (b) => (Array.isArray(b.rows) ? b.rows : []).filter(r => r && typeof r === 'object');
  (blocks || []).forEach((b, i) => {
    if (!b || typeof b !== 'object') return;
    const at = `block ${i + 1}`;
    if (b.type === 'heading' && b.text) visit(str(b.text), `${at} (heading)`);
    if (b.type === 'para' && b.text) visit(str(b.text), `${at} (para)`);
    if (b.type === 'bullets') (b.items || []).forEach((it, j) => visit(str(it), `${at} bullet ${j + 1}`));
    if (b.type === 'table') rowsOf(b).filter(Array.isArray).forEach((r, j) =>
      r.forEach(c => visit(str(c), `${at} table row ${j + 1}`)));
    if (b.type === 'regulatorTable' && b.notes && typeof b.notes === 'object') {
      Object.keys(b.notes).forEach(k => visit(str(b.notes[k]), `${at} (regulatorTable) note ${k}`));
    }
    if (b.type === 'complianceMap') rowsOf(b).forEach((r, j) =>
      ['element', 'note'].forEach(k => visit(str(r[k]), `${at} (complianceMap) row ${j + 1}`)));
    if (b.type === 'noticeCheck') rowsOf(b).forEach((r, j) =>
      ['commitment', 'processing', 'action'].forEach(k => visit(str(r[k]), `${at} (noticeCheck) row ${j + 1}`)));
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
    rowObject(r, `riskRegister row ${i + 1}`);
    const ctx = `riskRegister row ${i + 1} (${r.id || 'no id'})`;
    const iL = norm(r.likelihood, 'likelihood', ctx);
    const iS = norm(r.severity, 'severity', ctx);
    const rL = norm(r.residualLikelihood !== undefined ? r.residualLikelihood : r.likelihood, 'residualLikelihood', ctx);
    const rS = norm(r.residualSeverity !== undefined ? r.residualSeverity : r.severity, 'residualSeverity', ctx);
    const inherent = rate(iL, iS);
    const residual = rate(rL, rS);
    // Optional post-mitigation scoring: the residual expected once Section 5's
    // recommended mitigations are implemented. This is what makes a
    // "conditional" prior-consultation conclusion derivable — Art. 36(1) keys
    // to high risk in the absence of mitigating measures, so a High residual
    // whose mitigated rating falls below High engages consultation only if the
    // controller proceeds without the mitigations.
    const hasML = r.mitigatedLikelihood !== undefined && r.mitigatedLikelihood !== null;
    const hasMS = r.mitigatedSeverity !== undefined && r.mitigatedSeverity !== null;
    if (hasML !== hasMS) fail(1, `${ctx}: "mitigatedLikelihood" and "mitigatedSeverity" must be stated together or not at all`);
    const mL = hasML ? norm(r.mitigatedLikelihood, 'mitigatedLikelihood', ctx) : null;
    const mS = hasMS ? norm(r.mitigatedSeverity, 'mitigatedSeverity', ctx) : null;
    const mitigated = mL ? rate(mL, mS) : null;
    // A stated mitigatedRating with no scores to derive from is a manifest
    // error (exit 1), not a rating-gate contradiction: comparing it against a
    // null derivation produced an exit 3 telling the user to re-examine
    // likelihood/severity scores that were never stated.
    if (r.mitigatedRating && !mitigated) {
      fail(1, `${ctx}: "mitigatedRating" requires "mitigatedLikelihood" and "mitigatedSeverity" — the rating is derived from those scores, never stated alone`);
    }
    // A stated rating is compared on the same vocabulary norm() accepts for the
    // scores: "LOW" against a derived "Low" is not a scoring error to
    // re-examine. An object here is a manifest error (exit 1), as elsewhere.
    const stated = (v, field) => {
      const t = txt(v, `${ctx} "${field}"`).trim();
      return LEVELS.find(l => l.toLowerCase() === t.toLowerCase()) || t;
    };
    if (r.inherentRating && stated(r.inherentRating, 'inherentRating') !== inherent) {
      violations.push(`${ctx}: stated inherentRating "${r.inherentRating}" != derived "${inherent}" from (${iL} x ${iS})`);
    }
    if (r.residualRating && stated(r.residualRating, 'residualRating') !== residual) {
      violations.push(`${ctx}: stated residualRating "${r.residualRating}" != derived "${residual}" from (${rL} x ${rS})`);
    }
    if (r.mitigatedRating && stated(r.mitigatedRating, 'mitigatedRating') !== mitigated) {
      violations.push(`${ctx}: stated mitigatedRating "${r.mitigatedRating}" != derived "${mitigated}" from (${mL} x ${mS})`);
    }
    return {
      id: r.id ? txt(r.id, `${ctx} "id"`) : `R${i + 1}`, risk: r.risk || '', controls: r.controls || '',
      iL, iS, inherent, rL, rS, residual, mL, mS, mitigated,
      art36: isArt36(rL, rS),
    };
  });
  // Row ids are what the matrix plots and the prose cites; two rows sharing
  // one make "R1" in the grid ambiguous. Checked on the final id, so an
  // explicit "R2" colliding with the second row's default is caught too.
  const seen = new Set();
  out.forEach((r, i) => {
    if (seen.has(r.id)) fail(1, `riskRegister row ${i + 1}: risk id "${r.id}" is used by an earlier row in this register — each row needs a unique "id"`);
    seen.add(r.id);
  });
  if (violations.length) {
    fail(3, 'RISK-RATING GATE FAILED (exit 3) — do not deliver:\n  ' + violations.join('\n  '));
  }
  return out;
}

// complianceMap section references. A substring match let "e" (or "1")
// match any heading containing that letter (or "SECTION 10"), so the
// dangling-reference gate passed references that pointed nowhere. A reference
// now resolves only by section number ("SECTION 4", "Section 4", "\u00a74",
// "s. 4.2", "4.2", "4(a)" -> 4) against a heading's own number — the number
// itself or a subsection of it — or, for a non-numeric reference, by the
// heading's full text, its label ("APPENDIX A") or its title
// ("RISK ASSESSMENT"), compared whole and case-insensitively.
const SECTION_PREFIX = /^(?:section|sect\.?|sec\.?|\u00a7+|s\.)?\s*/i;
const SECTION_NUMBER = /^(?:section|sect\.?|sec\.?|\u00a7+|s\.?)?\s*(\d+(?:\.\d+)*)(?:\s*\([^)]*\)|[a-z])?\.?$/i;
const squash = (t) => t.toLowerCase().replace(/\s+/g, ' ').trim();
function headingRef(text) {
  const t = squash(text);
  const num = t.replace(SECTION_PREFIX, '').match(/^(\d+(?:\.\d+)*)(?![\d])/);
  const parts = t.split(/\s+[\u2014\u2013:-]\s+|\s*:\s+/);
  return { full: t, num: num ? num[1] : null, label: parts[0], title: parts.length > 1 ? parts.slice(1).join(' ') : null };
}
function sectionMatches(sec, h) {
  const n = sec.trim().match(SECTION_NUMBER);
  if (n) return h.num !== null && (h.num === n[1] || h.num.startsWith(n[1] + '.'));
  const probe = squash(sec.replace(/^\u00a7+\s*/, ''));
  return probe === h.full || probe === h.label || probe === h.title;
}

// ---------------------------------------------------------------- primitives
const FONT = 'Calibri';

function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align,
    spacing: { after: opts.after === undefined ? 140 : opts.after, line: 276 },
    children: [new TextRun({
      text: txt(text, opts.ctx),
      font: FONT, size: opts.size || 22,
      bold: !!opts.bold, italics: !!opts.italic, color: opts.color,
    })],
  });
}

function heading(text, level) {
  const map = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3 };
  return new Paragraph({
    heading: own(map, level) || HeadingLevel.HEADING_2, // own(): a "__proto__" level must not resolve to a style id
    spacing: { before: level === 1 ? 320 : 240, after: 140 },
    children: [new TextRun({ text: txt(text, 'heading'), font: FONT, bold: true, size: level === 1 ? 28 : 24, color: '1F3864' })],
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
          text: txt(t, opts.ctx || 'table cell'), font: FONT, size: opts.size || 20,
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
  // Widths reach the table grid unescaped as numbers; anything else (a string
  // payload, a negative or absurd value) produced an invalid tcW element.
  if (widths !== undefined && (!Array.isArray(widths) ||
      !widths.every(x => typeof x === 'number' && Number.isFinite(x) && x >= 1 && x <= 100))) {
    fail(1, 'table "widths" must be an array of percentages between 1 and 100');
  }
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
  // The post-mitigation column appears only when at least one row scores it —
  // it is the register-level record of the conditional consultation pathway.
  const hasMit = rows.some(r => r.mitigated);
  const cols = ['ID', 'Risk to data subjects', 'Inherent (L x S)', 'Inherent', 'Controls', 'Residual (L x S)', 'Residual'];
  const w = hasMit ? [5, 25, 10, 8, 20, 10, 9] : [5, 30, 11, 9, 24, 11, 10];
  if (hasMit) { cols.push('Post-mitigation'); w.push(13); }
  const head = new TableRow({
    tableHeader: true,
    children: cols.map((c, i) => cell(c, { bold: true, fill: 'D9E2F3', width: w[i] })),
  });
  const body = rows.map(r => {
    const cells = [
      cell(r.id, { width: w[0], bold: true }),
      cell(r.risk, { width: w[1] }),
      cell(`${r.iL} x ${r.iS}`, { width: w[2], align: AlignmentType.CENTER }),
      cell(r.inherent, { width: w[3], align: AlignmentType.CENTER, bold: true, ...RATING_STYLE[r.inherent] }),
      cell(r.controls, { width: w[4] }),
      cell(`${r.rL} x ${r.rS}`, { width: w[5], align: AlignmentType.CENTER }),
      cell(r.residual + (r.art36 ? ' *' : ''), { width: w[6], align: AlignmentType.CENTER, bold: true, ...RATING_STYLE[r.residual] }),
    ];
    if (hasMit) {
      cells.push(r.mitigated
        ? cell(`${r.mL} x ${r.mS} = ${r.mitigated}`, { width: w[7], align: AlignmentType.CENTER, bold: true, ...RATING_STYLE[r.mitigated] })
        : cell('—', { width: w[7], align: AlignmentType.CENTER }));
    }
    return new TableRow({ children: cells });
  });
  return table([head, ...body]);
}

function matrixTable(rows, stage) {
  const plot = {};
  LEVELS.forEach(l => { plot[l] = {}; LEVELS.forEach(s => { plot[l][s] = []; }); });
  rows.forEach(r => {
    // 'mitigated' plots post-mitigation scores, falling back to the residual
    // where a row has none — the grid shows the world after Section 5.
    const L = stage === 'inherent' ? r.iL : (stage === 'mitigated' ? (r.mL || r.rL) : r.rL);
    const S = stage === 'inherent' ? r.iS : (stage === 'mitigated' ? (r.mS || r.rS) : r.rS);
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

// Cover-page status vocabulary, derived from the declared jurisdictions: the
// base lifecycle states name the primary regime's reviewer, and each declared
// regime with a consultation-style blocking state contributes its own checkbox
// (deduplicated — EU and UK share the Art. 36 label). A manifest may override
// the whole list with "statusOptions". A "status" outside the vocabulary is
// rendered as an additional checked option with a note on stderr — the cover
// must reflect the declared status, but an unrecognized one deserves a look.
function statusLineOf(m, jur) {
  let options;
  if (Array.isArray(m.statusOptions) && m.statusOptions.length) {
    options = m.statusOptions.map(String);
  } else {
    // Reviewer title is uniformly "DPO" — the review officer's exact statutory
    // name varies by regime, but the cover checkbox does not need that detail.
    options = ['Draft', 'Under DPO Review', 'Approved'];
    jur.forEach(c => {
      const def = own(REGIMES, c);
      if (def && def.statusOption && !options.includes(def.statusOption)) options.push(def.statusOption);
    });
  }
  const chosen = String(m.status || 'Draft').trim();
  if (!options.some(s => s.toLowerCase() === chosen.toLowerCase())) {
    options.push(chosen);
    process.stderr.write(`build_dpia: note — "status" (${JSON.stringify(chosen)}) is outside the derived status ` +
      `vocabulary for [${jur.join(', ')}]; rendered as an additional checked option.\n`);
  }
  return options.map(s => (s.toLowerCase() === chosen.toLowerCase() ? '☒ ' : '☐ ') + s).join('   ');
}

function coverPage(m, jur) {
  const rule = new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '1F3864' } },
    spacing: { before: 200, after: 300 },
    children: [new TextRun({ text: '', font: FONT })],
  });
  const line = (label, value) => p(`${label}: ${value || '[to be completed]'}`, { align: AlignmentType.CENTER });
  const statusLine = statusLineOf(m, jur);
  const out = [
    p('', { after: 900 }),
    p(docTitleOf(m), { align: AlignmentType.CENTER, bold: true, size: 36 }),
    rule,
    p(m.systemName, { align: AlignmentType.CENTER, bold: true, size: 28 }),
    p(m.version || 'Version 1.0 \u2014 DRAFT FOR DPO REVIEW', { align: AlignmentType.CENTER, italic: true }),
    p(m.date, { align: AlignmentType.CENTER, after: 500 }),
    line('Controller', m.controller),
    line('Data Protection Officer', m.dpo),
    // Counsel of Record renders only where counsel exists: an unconditional
    // "[to be completed]" implies a role many controllers do not staff and
    // invites attributing the draft to a person before adoption.
    ...(m.counsel ? [line('Counsel of Record', m.counsel)] : []),
    line('DPIA Reference', m.reference || '[DPIA-YYYY-NNN]'),
    p('', { after: 400 }),
    p(statusLine, { align: AlignmentType.CENTER, size: 20 }),
    rule,
  ];
  if (headerTextOf(m)) {
    out.push(p(headerTextOf(m), { align: AlignmentType.CENTER, bold: true, size: 20, color: '9C0006' }));
  }
  // Generation transparency is builder-owned and has no manifest knob: every
  // document must say what produced it. It renders even on producible records
  // that suppress the privilege header — transparency matters most there.
  out.push(p(GENERATION_NOTICE, { align: AlignmentType.CENTER, italic: true, size: 18, color: '595959' }));
  out.push(new Paragraph({ children: [new (D.PageBreak)()] }));
  return out;
}

const GENERATION_NOTICE = 'AI-GENERATED DRAFT — produced by the dpia-generator skill.';

// The header default is posture-derived (v4.2), like the footer's reviewer
// phrase: the work-product header renders only where the manifest names a
// counsel \u2014 a label no attorney will ever stand behind cannot create
// protection and reads as contrived if a regulator sees it. A DPO-led run
// (no counsel) gets a plain confidentiality marking instead; the adopting
// counsel can always add the work-product framing, which is the recoverable
// direction. An explicit "headerText" still overrides either default, and ""
// deliberately omits the header entirely \u2014 for documents drafted for
// regulator production where any confidentiality banner would be falsified
// by the disclosure itself; the per-regime privilege notes in
// references/jurisdictions/ say when to do that.
const WORK_PRODUCT_HEADER = 'PRIVILEGED & CONFIDENTIAL \u2014 ATTORNEY WORK PRODUCT';
function headerTextOf(m) {
  // null means "no override, use the derived default" — the schema documents
  // null as the field's default, so a manifest carrying it literally must not
  // render a page header reading "null". Only "" suppresses the header.
  if (m.headerText !== undefined && m.headerText !== null) return String(m.headerText);
  return m.counsel ? WORK_PRODUCT_HEADER : 'CONFIDENTIAL \u2014 DRAFT FOR DPO REVIEW';
}
function docTitleOf(m) {
  return m.docTitle ? String(m.docTitle) : 'DATA PROTECTION IMPACT ASSESSMENT';
}

// The footer's reviewer phrase follows the document's posture rather than a
// manifest knob. "for attorney review" is only honest where the run actually
// has counsel in the loop and the document keeps the work-product header; a
// DPO-led run (no counsel named) or a producible record (header suppressed)
// gets "for DPO review" — the reviewing officer the cover already names
// uniformly across regimes. The "AI-generated draft" half never varies.
// "Keeps the work-product header" means the derived default (counsel named,
// no override) or an explicit headerText that is itself a privilege marking;
// a custom non-privilege header ("PREPARED FOR PRODUCTION TO THE REGULATOR")
// is a producible-record posture, and its footer must not claim an attorney
// draft any more than a suppressed header's may.
const PRIVILEGE_MARKING = /\b(work[- ]product|privileged)\b/i;
const PRIVILEGE_NEGATED = /\b(not|non)[- ]privileged\b/i;
function reviewerTextOf(m) {
  const h = headerTextOf(m);
  const workProduct = h === WORK_PRODUCT_HEADER || (PRIVILEGE_MARKING.test(h) && !PRIVILEGE_NEGATED.test(h));
  return m.counsel && workProduct ? 'for attorney review' : 'for DPO review';
}

// ---------------------------------------------------------------- build
function build(manifest, state) {
  const registers = Object.create(null); // null-proto: register ids come from the manifest
  const footnotes = []; // register footnote slots, worded after every register is resolved
  const children = coverPage(manifest, state.jurisdictions || ['eu-gdpr']);

  (manifest.blocks || []).forEach((b, i) => {
    // Same fail-cleanly contract as the row guards: a null (or mis-typed) entry
    // in "blocks" must name the block, never throw from the first .type access.
    if (typeof b !== 'object' || b === null || Array.isArray(b)) {
      fail(1, `block ${i + 1}: each entry in "blocks" must be a block object, got ${b === null ? 'null' : Array.isArray(b) ? 'an array' : typeof b}`);
    }
    const ctx = `block ${i + 1} (${b.type})`;
    switch (b.type) {
      case 'pagebreak':
        children.push(new Paragraph({ children: [new (D.PageBreak)()] })); break;
      case 'heading':
        // A missing "text" would String(undefined) into a literal "undefined"
        // heading — the v4.2.1 "null" header defect class. "" stays legal.
        if (b.text === undefined || b.text === null) fail(1, `${ctx}: needs "text"`);
        // Only the three heading styles exist; any other level (7, "__proto__")
        // silently fell back to level 2 and misplaced the section in the outline.
        if (b.level !== undefined && b.level !== null && ![1, 2, 3].includes(b.level)) {
          fail(1, `${ctx}: "level" must be 1, 2 or 3, got ${JSON.stringify(b.level)}`);
        }
        children.push(heading(b.text, b.level || 2)); break;
      case 'para':
        if (b.text === undefined || b.text === null) fail(1, `${ctx}: needs "text"`);
        children.push(p(b.text, { italic: b.italic, ctx })); break;
      case 'bullets':
        if (b.items !== undefined && !Array.isArray(b.items)) fail(1, `${ctx}: "items" must be an array of text`);
        (b.items || []).forEach((it, j) => {
          if (it === undefined || it === null) fail(1, `${ctx} item ${j + 1}: bullet items must be text, got ${it === null ? 'null' : 'undefined'}`);
          children.push(new Paragraph({
            bullet: { level: 0 }, spacing: { after: 80, line: 276 },
            children: [new TextRun({ text: txt(it, `${ctx} item ${j + 1}`), font: FONT, size: 22 })],
          }));
        }); break;
      case 'table':
        if (!Array.isArray(b.columns) || !Array.isArray(b.rows)) fail(1, `${ctx}: needs "columns" and "rows" arrays`);
        // An empty "columns" divides the widths by zero, and a row with no
        // cells (or a ragged one) writes a w:tr the schema rejects or a grid
        // Word re-flows unpredictably — fail with the row named instead.
        if (!b.columns.length) fail(1, `${ctx}: "columns" must name at least one column`);
        b.rows.forEach((r, j) => {
          rowArray(r, `${ctx} row ${j + 1}`);
          if (r.length !== b.columns.length) {
            fail(1, `${ctx} row ${j + 1}: has ${r.length} cell(s) but the table has ${b.columns.length} column(s)`);
          }
        });
        children.push(dataTable(b.columns, b.rows, b.widths));
        children.push(p('', { after: 120 })); break;
      case 'riskRegister': {
        if (!Array.isArray(b.rows) || !b.rows.length) fail(1, `${ctx}: needs non-empty "rows"`);
        const regId = b.id === undefined || b.id === null || b.id === '' ? 'default' : txt(b.id, `${ctx} "id"`);
        // A repeated register id silently replaced the earlier register, so a
        // matrix "source" plotted whichever was authored last.
        if (own(registers, regId)) fail(1, `${ctx}: riskRegister id "${regId}" is used by an earlier register — each register needs a unique "id"`);
        const resolved = resolveRegister(b.rows);
        registers[regId] = resolved;
        children.push(registerTable(resolved));
        if (resolved.some(r => r.art36)) {
          state.highResidual = true;
          // A High-residual row with no post-mitigation score, or one still High
          // after mitigation, keeps consultation unconditional. Only when every
          // High row falls below High post-mitigation is the conditional
          // pathway available.
          const unmitigatedHigh = resolved.some(r => r.art36 && (!r.mitigated || r.mitigated === 'High'));
          if (unmitigatedHigh) state.highMitigated = true;
          // The footnote is worded once every register is resolved (below the
          // loop): whether consultation is avoidable is a document-wide fact,
          // and one register must not say "not required once mitigated" while
          // another's unmitigable High residual requires it.
          footnotes.push({ at: children.length, unmitigatedHigh });
          children.push(null);
        }
        children.push(p('', { after: 120 }));
        break;
      }
      case 'complianceMap': {
        if (!Array.isArray(b.rows) || !b.rows.length) fail(1, `${ctx}: needs non-empty "rows"`);
        if (b.regime && !own(REGIMES, b.regime)) {
          fail(1, `${ctx}: unknown regime code "${b.regime}". Known: ${Object.keys(REGIMES).join(', ')}`);
        }
        const headings = (manifest.blocks || [])
          .filter(x => x && x.type === 'heading')
          .map(x => headingRef(String(x.text || '')));
        const missing = [];
        const rows = b.rows.map((r, j) => {
          rowObject(r, `${ctx} row ${j + 1}`);
          // Through txt(): an object "element", "section" or "note" shipped as
          // "[object Object]" with exit 0 (the v4.4.4 cover-field class).
          const el = (r.element === undefined || r.element === null) ? '' : txt(r.element, `${ctx} row ${j + 1} "element"`);
          const sec = (r.section === undefined || r.section === null) ? '' : txt(r.section, `${ctx} row ${j + 1} "section"`).trim();
          const note = (r.note === undefined || r.note === null) ? '' : txt(r.note, `${ctx} row ${j + 1} "note"`);
          if (!el || !sec) fail(1, `${ctx}: row ${j + 1} needs "element" and "section"`);
          // A bare "\u00a7" names nothing; it must not reach the matcher.
          if (!sec.replace(/^\u00a7+\s*/, '')) fail(1, `${ctx}: row ${j + 1} "section" (${JSON.stringify(sec)}) names no section`);
          if (!headings.some(h => sectionMatches(sec, h))) missing.push(sec);
          return [el, sec + (note ? ` \u2014 ${note}` : '')];
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
        const src = own(registers, b.source || 'default');
        if (!src) fail(1, `${ctx}: no riskRegister named "${b.source || 'default'}" appears before this block`);
        const stage = String(b.stage || 'residual').toLowerCase();
        if (stage !== 'inherent' && stage !== 'residual' && stage !== 'mitigated') {
          fail(1, `${ctx}: "stage" must be inherent|residual|mitigated`);
        }
        children.push(p(b.title || (stage === 'inherent' ? 'Inherent risk'
          : stage === 'mitigated' ? 'Post-mitigation residual risk' : 'Residual risk'), { bold: true, after: 100 }));
        children.push(matrixTable(src, stage));
        children.push(p('', { after: 120 }));
        break;
      }
      case 'regulatorTable': {
        // Rendered from the resolved regulatorConclusions + the registry, never
        // hand-authored — the same computed-not-asserted rule as the matrix: the
        // engagement table a regulator reads cannot disagree with the declared
        // conclusions the gate checks.
        const jurs = state.jurisdictions || ['eu-gdpr'];
        const rc = state.conclusions || {};
        const rows = jurs.map(code => {
          const def = own(REGIMES, code);
          const entry = own(rc, code);
          const declared = entry ? entry[def.conclusionKey] : undefined;
          if (declared === undefined || declared === null) {
            fail(1, `${ctx}: regulatorConclusions["${code}"].${def.conclusionKey} is required to render ` +
                    'the regulator-engagement table — a table row without a declared conclusion is an ' +
                    'assessment that has not finished.');
          }
          // The type gate below main() only runs when a riskRegister exists;
          // without one, a string "false" is truthy and rendered "required".
          const validType = def.derive
            ? (typeof declared === 'boolean' || declared === 'conditional')
            : typeof declared === 'boolean';
          if (!validType) {
            fail(1, `${ctx}: regulatorConclusions["${code}"].${def.conclusionKey} must be ` +
                    `${def.derive ? 'true, false or "conditional"' : 'a boolean'}, got ${JSON.stringify(declared)}`);
          }
          const label = declared === 'conditional'
            ? (def.conclusionLabels[2] || 'Conditional — see the Section 5 mitigations')
            : def.conclusionLabels[declared ? 0 : 1];
          const rawNote = b.notes ? own(b.notes, code) : undefined;
          const note = (rawNote === undefined || rawNote === null) ? '' : txt(rawNote, `${ctx} notes["${code}"]`);
          return [def.label, regimeText(def, 'engagement', manifest.date), label + (note ? ` — ${note}` : '')];
        });
        children.push(p(b.title || 'Regulator engagement — conclusions by jurisdiction', { bold: true, after: 100 }));
        children.push(dataTable(['Regime', 'Engagement mechanism', 'Conclusion'], rows, [18, 46, 36]));
        children.push(p('', { after: 120 }));
        break;
      }
      case 'noticeCheck': {
        // Section 1.10 privacy-notice consistency check, computed per row — the
        // drift table a DPO reads must carry the resolution the manifest
        // committed to, never a bare red cell. Rows come from the controller's
        // notice profile (references/notice-profile.md) where one exists;
        // "notice" records the provenance that makes each commitment quotable.
        if (!b.notice || typeof b.notice !== 'object' || Array.isArray(b.notice) ||
            b.notice.source === undefined || b.notice.source === null ||
            !txt(b.notice.source, `${ctx} "notice.source"`).trim()) {
          fail(1, `${ctx}: needs "notice.source" — the published notice (URL or document) the commitments ` +
                  'were read from. A consistency check with no stated notice is not checkable.');
        }
        // Provenance fields through txt(): an object audience/profile rendered
        // as "[object Object] notice" with exit 0.
        const noticeField = (k) => (b.notice[k] === undefined || b.notice[k] === null) ? '' : txt(b.notice[k], `${ctx} "notice.${k}"`);
        const nSource = noticeField('source'), nAudience = noticeField('audience'), nProfile = noticeField('profile');
        if (!Array.isArray(b.rows) || !b.rows.length) fail(1, `${ctx}: needs non-empty "rows"`);
        if (b.notice.date !== undefined && b.notice.date !== null) {
          if (typeof b.notice.date !== 'string' || !isRealDate(b.notice.date)) {
            fail(1, `${ctx}: "notice.date" must be a real YYYY-MM-DD calendar date, got ${JSON.stringify(b.notice.date)} — ` +
                    'a date that does not parse silently disables the staleness check.');
          }
          // Staleness is a check-by date, not a hard stop: the check still
          // renders, but a profile older than ~6 months may pass against
          // commitments the published notice no longer makes.
          const ageDays = (new Date(manifest.date) - new Date(b.notice.date)) / 86400000;
          if (ageDays > 183) {
            process.stderr.write(`build_dpia: WARNING — the notice behind ${ctx} was indexed ${b.notice.date}, ` +
              `more than six months before this assessment (${manifest.date}). Re-fetch the published notice and ` +
              're-verify the profile before relying on the consistency check.\n');
          }
        }
        let unresolved = false;
        const rows = b.rows.map((r, j) => {
          const rctx = `${ctx} row ${j + 1}`;
          rowObject(r, rctx);
          const field = (k) => (r[k] === undefined || r[k] === null) ? '' : txt(r[k], `${rctx} "${k}"`);
          const commitment = field('commitment'), processing = field('processing');
          const section = field('section'), action = field('action');
          if (!commitment.trim() || !processing.trim()) {
            fail(1, `${rctx}: needs "commitment" (verbatim from the notice) and "processing" (the new reality it is checked against)`);
          }
          const v = own(VERDICTS, String(r.verdict === undefined || r.verdict === null ? '' : r.verdict).toLowerCase());
          if (!v) fail(1, `${rctx}: "verdict" must be consistent|drift|conflict, got ${JSON.stringify(r.verdict)}`);
          const inconsistent = v !== VERDICTS.consistent;
          if (inconsistent && !action.trim()) {
            fail(1, `${rctx}: a ${JSON.stringify(String(r.verdict).toLowerCase())} verdict requires an "action" — ` +
                    'the resolution rule (amend the notice or change the processing before deployment, with a named ' +
                    'owner) is a gate, not advice. An inconsistency with no committed resolution is an unfinished check.');
          }
          if (inconsistent) unresolved = true;
          return {
            commitment: commitment + (section ? ` (${section})` : ''),
            processing,
            label: v.label, style: v.style,
            // A consistent row needs no resolution, but one the manifest states
            // anyway (e.g. "monitor at next notice refresh") is kept, not dropped.
            action: action.trim() ? action : '—',
          };
        });
        const prov = [nSource];
        if (nAudience) prov.push(`${nAudience} notice`);
        if (b.notice.date) prov.push(`indexed ${b.notice.date}`);
        if (nProfile) prov.push(`profile: ${nProfile}`);
        children.push(p(b.title || 'Privacy policy consistency check', { bold: true, after: 100 }));
        children.push(p('Checked against: ' + prov.join(' — '), { italic: true, size: 18 }));
        const w = [30, 30, 12, 28];
        const head = new TableRow({
          tableHeader: true,
          children: ['Policy commitment', 'New processing reality', 'Verdict', 'Resolution']
            .map((c, i) => cell(c, { bold: true, fill: 'D9E2F3', width: w[i] })),
        });
        const body = rows.map(r => new TableRow({
          children: [
            cell(r.commitment, { width: w[0] }),
            cell(r.processing, { width: w[1] }),
            cell(r.label, { width: w[2], align: AlignmentType.CENTER, bold: true, ...r.style }),
            cell(r.action, { width: w[3] }),
          ],
        }));
        children.push(table([head, ...body]));
        if (unresolved) {
          children.push(p('* One or more published-notice commitments are inconsistent with the proposed processing. ' +
            'The processing must not deploy until each is resolved — by amending the notice or changing the ' +
            'processing — and each resolution above must appear in Section 5’s mitigations with a named ' +
            'owner and target date. Flag the drift in the executive summary.', { italic: true, size: 18 }));
        }
        children.push(p('', { after: 120 }));
        break;
      }
      case 'signature': {
        // A null cell renders empty, matching dataTable's contract — never the
        // literal word "null" in a signature line.
        if (b.rows !== undefined && !Array.isArray(b.rows)) fail(1, `${ctx}: "rows" must be an array of rows`);
        const rows = (b.rows || []).map((r, j) => rowArray(r, `${ctx} row ${j + 1}`)
          .map((v, k) => (v === undefined || v === null) ? '' : txt(v, `${ctx} row ${j + 1} cell ${k + 1}`)));
        children.push(dataTable(['Role', 'Signature', 'Date'], rows, [34, 40, 26]));
        children.push(p('', { after: 120 }));
        break;
      }
      default:
        fail(1, `${ctx}: unknown block type "${b.type}"`);
    }
  });

  // Register footnotes, worded on the document-wide consultation state.
  const consultNotes = (state.jurisdictions || ['eu-gdpr'])
    .filter(c => REGIMES[c] && REGIMES[c].derive)
    .map(c => regimeText(REGIMES[c], 'highResidualNote', manifest.date));
  // Prose list join: "a" / "a and b" / "a, b, and c" \u2014 three consultation
  // regimes must not produce an "and ... and" run-on in the sentence a
  // regulator reads first.
  const joined = consultNotes.length <= 2
    ? consultNotes.join(' and ')
    : consultNotes.slice(0, -1).join(', ') + ', and ' + consultNotes[consultNotes.length - 1];
  const verb = consultNotes.length > 1 ? 'are' : 'is';
  const concluded = consultNotes.length > 1 ? 'those consultations have' : 'that consultation has';
  const conditionalDoc = !state.highMitigated; // every High residual in every register is mitigable
  footnotes.forEach(({ at, unmitigatedHigh }) => {
    let footnote;
    if (!consultNotes.length) {
      footnote = '* Residual risk rated High \u2014 see the regulator-engagement analysis in Section 5 for the obligations this rating triggers in each applicable jurisdiction.';
    } else if (conditionalDoc) {
      footnote = `* Residual risk rated High on existing and planned controls \u2014 ${joined} ${verb} engaged unless the Section 5 mitigations are implemented before processing commences; with those mitigations implemented, every High-rated residual falls below High and prior consultation is not required.`;
    } else if (!unmitigatedHigh) {
      // Mitigable here, but another register keeps consultation unconditional.
      footnote = `* Residual risk rated High \u2014 ${joined} ${verb} engaged. The Section 5 mitigations bring every High-rated residual in this register below High, but a High residual elsewhere in this assessment has no such pathway, so the processing may not commence until ${concluded} concluded.`;
    } else {
      footnote = `* Residual risk rated High \u2014 ${joined} ${verb} engaged for this risk, and the processing may not commence until ${concluded} concluded.`;
    }
    children[at] = p(footnote, { italic: true, size: 18 });
  });

  return new Document({
    creator: 'dpia-generator (AI-generated draft)',
    title: txt(`DPIA \u2014 ${manifest.systemName}`),
    description: txt((headerTextOf(manifest) ? headerTextOf(manifest) + ' | ' : '') + GENERATION_NOTICE),
    styles: { default: { document: { run: { font: FONT, size: 22 } } } },
    sections: [{
      properties: {
        page: {
          // A4 portrait — the DPIA's audience is EU/UK (DPO, Information Commission, CNIL, lead authority).
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
                txt(`   |   ${manifest.reference || '[DPIA-YYYY-NNN]'}   |   AI-generated draft (dpia-generator) — ${reviewerTextOf(manifest)}`, 'reference')],
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

  // Size cap before parse: the XML serializer is linear but slow (an 800 KB
  // manifest of paragraphs packs for over a minute), and no genuine DPIA
  // manifest approaches this.
  const MAX_MANIFEST_BYTES = 5 * 1024 * 1024;
  if (fs.statSync(manifestPath).size > MAX_MANIFEST_BYTES) {
    fail(1, `manifest exceeds ${MAX_MANIFEST_BYTES} bytes — refusing to parse`);
  }
  let m;
  try { m = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); }
  catch (e) { fail(1, 'manifest is not valid JSON: ' + e.message); }
  // Valid JSON is not necessarily a manifest: "null", a string, or an array all
  // parse, and each crashed the required-field check with a TypeError instead
  // of the clean exit 1 the fail-cleanly contract requires.
  if (typeof m !== 'object' || m === null || Array.isArray(m)) {
    fail(1, `manifest must be a JSON object, got ${m === null ? 'null' : Array.isArray(m) ? 'an array' : typeof m}`);
  }
  ['systemName', 'date'].forEach(k => {
    if (!m[k]) fail(1, `manifest: missing required "${k}"`);
    if (typeof m[k] !== 'string') fail(1, `manifest: "${k}" must be a string, got ${typeof m[k]}`);
  });
  if (!isRealDate(m.date)) fail(1, `manifest: "date" must be a real YYYY-MM-DD calendar date, got ${JSON.stringify(m.date)}`);
  if (m.outputDir !== undefined && (typeof m.outputDir !== 'string' || m.outputDir.includes('\0'))) {
    fail(1, 'manifest: "outputDir" must be a string path without NUL characters');
  }
  // Cover and metadata fields are String()-coerced or template-interpolated on
  // their way to the text sinks, so an object here would ship as
  // "[object Object]" (and, for docTitle, corrupt the filename prefix) before
  // txt() could refuse it. Type-check them once, up front. null means "use
  // the default" for each of them.
  ['version', 'controller', 'dpo', 'counsel', 'reference', 'status', 'docTitle', 'headerText']
    .forEach(k => {
      const v = m[k];
      if (v !== undefined && v !== null && typeof v !== 'string' && typeof v !== 'number') {
        fail(1, `manifest: "${k}" must be a string, got ${Array.isArray(v) ? 'an array' : typeof v === 'object' ? 'an object' : typeof v}`);
      }
    });
  if (m.statusOptions !== undefined && m.statusOptions !== null &&
      (!Array.isArray(m.statusOptions) || m.statusOptions.some(s => typeof s !== 'string'))) {
    fail(1, 'manifest: "statusOptions" must be an array of strings');
  }
  if (!Array.isArray(m.blocks)) {
    fail(1, `manifest: "blocks" is required and must be an array of block objects, got ${m.blocks === undefined ? 'nothing' : m.blocks === null ? 'null' : typeof m.blocks}`);
  }

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
    // "..sep" not "..": a directory legitimately named "..reports" is inside.
    return rel === '' || (rel !== '..' && !rel.startsWith('..' + path.sep) && !path.isAbsolute(rel));
  };
  const outDir = path.resolve(m.outputDir || DEFAULT_OUT);
  if (!allowedRoots.some(root => isInside(root, outDir))) {
    fail(1, `manifest: "outputDir" (${outDir}) is outside the permitted output roots ` +
            `[${allowedRoots.join(', ')}]. Set DPIA_OUTPUT_ROOTS to permit another location.`);
  }

  // Capped: a long systemName must not pack the whole document and then fail
  // at open with ENAMETOOLONG.
  const safe = String(m.systemName).replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 80);
  // Filename prefix follows the document title's initials, so the default title
  // yields the historical "DPIA_" and a Colorado "DATA PROTECTION ASSESSMENT"
  // yields "DPA_" — a producible record must not ship under a DPIA filename.
  const prefix = ((docTitleOf(m).match(/[A-Za-z]+/g) || [])
    .map(w => w[0].toUpperCase()).join('').slice(0, 8)) || 'DPIA';
  // basename() so a manifest "outputFilename" cannot write outside outputDir via "../".
  // basename(".."|".") returns the reference itself, so reject those (and empty)
  // explicitly — otherwise path.join(outDir, "..") would climb out of outDir.
  if (m.outputFilename !== undefined && m.outputFilename !== null && typeof m.outputFilename !== 'string') {
    fail(1, `manifest: "outputFilename" must be a string, got ${typeof m.outputFilename}`);
  }
  let named = m.outputFilename ? path.basename(m.outputFilename) : '';
  // The record must ship as a .docx with a plain name: no control characters
  // (a bidi override can disguise the extension) and no dotfile.
  if (m.outputFilename && !/^[^\x00-\x1f‎‏‪-‮⁦-⁩.][^\x00-\x1f‎‏‪-‮⁦-⁩]*\.docx$/i.test(named)) {
    process.stderr.write(`build_dpia: note — "outputFilename" (${JSON.stringify(m.outputFilename)}) is not a usable filename (must be a plain .docx name); using the default name.\n`);
    named = '';
  } else if (m.outputFilename && named !== String(m.outputFilename)) {
    process.stderr.write(`build_dpia: note — "outputFilename" was reduced to "${named}"; it may not contain a path.\n`);
  }
  const outPath = path.join(outDir, named || `${prefix}_${safe}_${m.date}.docx`);
  // Belt and braces: confirm the fully-resolved path never escaped outDir.
  if (!isInside(outDir, path.resolve(outPath))) {
    fail(1, `manifest: resolved output path (${path.resolve(outPath)}) escapes "outputDir" (${outDir}).`);
  }

  // The checks above are lexical. The OS temp dir is shared and world-writable,
  // so a symlinked directory component or a symlink planted at the predictable
  // output filename could still redirect the write anywhere the process can
  // write. Check the real path of the nearest existing ancestor BEFORE mkdir
  // (so no directory is created through a symlink), again after it, and refuse
  // to follow a symlink at the file itself.
  // Real path of a directory that may not exist yet: resolve its nearest
  // existing ancestor and re-append the rest. Used for the roots as well as
  // the target — a root that does not exist yet (a fresh image where
  // /mnt/user-data/outputs has not been created) is still a root; filtering
  // it out refused the default outputDir with a misleading symlink message.
  const realOfNearest = (dir) => {
    let probe = dir;
    while (!fs.existsSync(probe) && path.dirname(probe) !== probe) probe = path.dirname(probe);
    return path.join(fs.realpathSync(probe), path.relative(probe, dir));
  };
  const realRoots = allowedRoots.map(realOfNearest);
  const checkReal = (dir) => {
    const real = realOfNearest(dir);
    if (!realRoots.some(root => isInside(root, real))) {
      fail(1, `manifest: "outputDir" (${outDir}) resolves through a symlink to ${real}, outside the permitted output roots.`);
    }
  };
  checkReal(outDir);
  // A dangling symlink at outputDir is neither a directory to use nor one to
  // create: mkdir would fail deep inside with a bare ENOENT.
  try {
    if (fs.lstatSync(outDir).isSymbolicLink() && !fs.existsSync(outDir)) {
      fail(1, `manifest: "outputDir" (${outDir}) is a dangling symlink.`);
    }
  } catch (e) { /* absent: fine, created below */ }
  const checkTarget = () => {
    let existing = null;
    try { existing = fs.lstatSync(outPath); } catch (e) { /* absent: fine */ }
    if (existing && !existing.isFile()) {
      fail(1, `refusing to write ${outPath}: it exists and is not a regular file (symlink or other).`);
    }
    // A hardlink planted at the output name is a regular file whose data
    // lives outside the roots; truncating it overwrites the linked file.
    if (existing && existing.nlink > 1) {
      fail(1, `refusing to write ${outPath}: it exists and has ${existing.nlink} links.`);
    }
  };
  checkTarget();

  // ---- Jurisdiction resolution ---------------------------------------------
  if (m.jurisdictions !== undefined && (!Array.isArray(m.jurisdictions) || !m.jurisdictions.length)) {
    fail(1, 'manifest: "jurisdictions" must be a non-empty array of regime codes when present');
  }
  const jur = m.jurisdictions || ['eu-gdpr'];
  jur.forEach((c, i) => {
    if (typeof c !== 'string') fail(1, `manifest: jurisdictions[${i}] must be a regime code string`);
    if (!own(REGIMES, c)) fail(1, `manifest: unknown jurisdiction code "${c}". Known codes: ${Object.keys(REGIMES).join(', ')}`);
    // A repeated code renders duplicate regulator rows and a footnote that
    // names the same Article twice.
    if (jur.indexOf(c) !== i) fail(1, `manifest: jurisdiction code "${c}" is listed more than once`);
  });

  // regulatorConclusions, with "art36" as a legacy alias: it fills
  // priorConsultation for every declared prior-consultation (derivable) regime
  // that has no explicit entry. The derivation is identical across those
  // regimes — consultation engages on any High residual — so a single legacy
  // declaration cannot say two different things.
  const rc = Object.create(null); // null-proto: keys come from the manifest
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
      // Null-proto copy: a JSON "__proto__" key must stay an inert own property,
      // not become the entry's prototype and supply the conclusion by inheritance.
      rc[code] = Object.assign(Object.create(null), entry);
    }
  }
  if (m.art36 !== undefined && m.art36 !== null) {
    if (typeof m.art36 !== 'boolean' && m.art36 !== 'conditional') {
      fail(1, `manifest: "art36" must be true, false or "conditional", got ${JSON.stringify(m.art36)}`);
    }
    const consultRegimes = jur.filter(c => REGIMES[c].derive);
    if (!consultRegimes.length) {
      fail(1, `manifest: "art36" declares a prior-consultation conclusion, but none of the declared jurisdictions ` +
              `[${jur.join(', ')}] engages prior consultation, so the declaration would be silently dropped. ` +
              'Declare regulatorConclusions["<code>"] for each regime instead.');
    }
    consultRegimes.forEach(c => {
      if (!rc[c] || rc[c][REGIMES[c].conclusionKey] === undefined) {
        rc[c] = Object.assign(Object.create(null), rc[c], { [REGIMES[c].conclusionKey]: m.art36 });
      }
    });
  }

  // ---- Register-shape gate (exit 1) ----------------------------------------
  // Every gate below keys off a riskRegister block. A risk register authored
  // as a plain "table" (the shape SKILL.md forbids) carries likelihood /
  // severity / rating columns the gates never read, so a High residual, an
  // "Approved" status and a paragraph denying consultation shipped with exit 0
  // and no warning. A table that looks like a register is refused unless the
  // manifest also carries the real one.
  const blocksIn = Array.isArray(m.blocks) ? m.blocks : [];
  const isBlock = (b) => b && typeof b === 'object' && !Array.isArray(b);
  if (!blocksIn.some(b => isBlock(b) && b.type === 'riskRegister')) {
    const REGISTER_COLUMN = /\b(likelihood|severity|residual|inherent|rating)\b/i;
    blocksIn.forEach((b, i) => {
      if (!isBlock(b) || b.type !== 'table' || !Array.isArray(b.columns)) return;
      const hits = b.columns.filter(c => typeof c === 'string' && REGISTER_COLUMN.test(c));
      if (hits.length) {
        fail(1, `block ${i + 1} (table): column(s) ${hits.map(h => JSON.stringify(h)).join(', ')} describe a risk register, ` +
                'but the manifest has no riskRegister block. The rating gate, the matrices and the Article 36 mark never ' +
                'see a plain table, so its ratings would ship unchecked. Author the register as a "riskRegister" block ' +
                '(manifest schema in this script\'s header), never as a "table".');
      }
    });
  }

  const state = { highResidual: false, highMitigated: false, jurisdictions: jur, conclusions: rc };
  const doc = build(m, state);

  // Tri-state consultation conclusion (see the conditional-consultation note in
  // the header): false — no High residual; 'conditional' — every High residual
  // falls below High once the Section 5 mitigations are implemented, so
  // consultation is required only if the controller proceeds without them;
  // true — at least one High residual has no such pathway.
  state.consult = !state.highResidual ? false : (state.highMitigated ? true : 'conditional');

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
      const validDeclared = def.derive
        ? (typeof declared === 'boolean' || declared === 'conditional')
        : typeof declared === 'boolean';
      if (!validDeclared) {
        fail(1, `manifest: regulatorConclusions["${code}"].${def.conclusionKey} must be ` +
                `${def.derive ? 'true, false or "conditional"' : 'a boolean'}, got ${JSON.stringify(declared)}`);
      }
      if (def.derive) {
        const expected = def.derive(state);
        if (declared !== expected) {
          const derivedWhy = expected === true
            ? 'at least one High residual has no post-mitigation score below High'
            : expected === 'conditional'
              ? 'every High residual falls below High once the Section 5 mitigations are implemented — consultation is avoidable, so declare "conditional"'
              : 'no residual risk rates High';
          fail(3, 'ARTICLE 36 CONCLUSION GATE FAILED (exit 3) — do not deliver:\n  ' +
            `[${code}] manifest declares ${def.conclusionKey}=${JSON.stringify(declared)}, but the register derives ${JSON.stringify(expected)} (${derivedWhy}).\n  ` +
            'Do not flip the declaration to silence this. Either the conclusion is wrong, or a ' +
            'likelihood/severity/mitigated score is — decide which, and fix that.');
        }
      }
    }
  }

  // The narrative scan and status warnings speak Art. 36; they apply only where
  // a prior-consultation regime is in scope.
  const consultInScope = jur.some(c => REGIMES[c].derive);

  // ---- Narrative contradiction scan (warning) -------------------------------
  const hits = scanNarrative(m.blocks);
  // On a 'conditional' conclusion the prose legitimately both asserts and
  // negates ("required unless the mitigations are implemented") — no scan.
  const contradictions = state.consult === true ? hits.denies
    : state.consult === false ? hits.asserts : [];
  if (hasRegister && consultInScope && contradictions.length) {
    process.stderr.write(
      `build_dpia: WARNING — the register derives Art. 36 = ${state.consult}, but narrative text appears to ` +
      `assert the opposite at: ${contradictions.join('; ')}. Read those passages before delivering; the ` +
      'executive summary is the part a supervisory authority reads first.\n');
  }

  // ---- Cover-status coherence (warning) ------------------------------------
  // Any derivable regime in scope contributes its blocking-status label as a
  // coherent cover status for an engaged consultation — hard-coding the Art. 36
  // string here would warn spuriously on a Kenya-only document whose cover
  // correctly says "Requires ODPC Consultation".
  const coherentStatuses = jur
    .filter(c => REGIMES[c].derive && REGIMES[c].statusOption)
    .map(c => REGIMES[c].statusOption.toLowerCase());
  if (state.consult === true && consultInScope &&
      !coherentStatuses.includes(String(m.status || 'Draft').trim().toLowerCase())) {
    process.stderr.write(
      'build_dpia: WARNING — a residual risk rates High (prior consultation engaged) but manifest ' +
      `"status" is "${m.status || 'Draft'}". Confirm the cover page and executive summary carry the ` +
      'consultation flag for every prior-consultation regime in scope.\n');
  }
  // The reverse: a cover claiming a consultation the register does not derive
  // overstates the obligation on the page a regulator reads first. Only a
  // false derivation warns — on "conditional" the consultation status is one
  // of the controller's two documented options.
  const claimed = String(m.status || 'Draft').trim().toLowerCase();
  if (state.consult === false && consultInScope && coherentStatuses.includes(claimed)) {
    process.stderr.write(
      `build_dpia: WARNING — manifest "status" is "${m.status}", but no register derives a prior-consultation ` +
      'requirement (no residual risk rates High). Confirm the cover page and executive summary do not claim a ' +
      'consultation the assessment does not support.\n');
  }

  // Where an open descriptor's file actually lives, from the kernel's own
  // record (/proc/self/fd, Linux). readlink, not realpath: the link text is
  // already the canonical path of the file's directory entry, and re-walking
  // it component by component would reopen the very race being checked.
  // null where /proc is unavailable (the lexical/lstat checks still run).
  const HAS_PROC_FD = fs.existsSync('/proc/self/fd');
  const fdLocation = (fd) => {
    if (!HAS_PROC_FD) return null;
    try {
      const where = fs.readlinkSync(`/proc/self/fd/${fd}`);
      return where.startsWith('/') && !where.endsWith(' (deleted)') ? where : '';
    } catch (e) { return ''; } // '' = unresolvable: treated as an escape
  };
  const inRoots = (real) => realRoots.some(root => isInside(root, real));

  // Write-then-rename. The document is written to a fresh temp file in
  // outDir created with O_EXCL|O_NOFOLLOW (so it cannot be a pre-planted file,
  // symlink or hardlink) and mode 0600, then renamed over the final name —
  // rename replaces a directory entry planted there rather than writing
  // through it. The directory itself can still be swapped for a symlink
  // between any two path-based calls (outDir lives in the shared temp dir),
  // so the descriptor is checked where the kernel says it is: before the
  // rename (the temp file is inside the roots), and after it (still inside,
  // and the final name is this inode). Any failure removes the file wherever
  // it actually landed — but only while that entry is still this inode, and
  // retried, because the directory may be swapped again mid-cleanup. The
  // OOXML check (validate) runs on the temp file before the rename, so a
  // rejected document never appears under the deliverable's name.
  const writeOutput = (buf, validate) => {
    // Ends in .docx: the full validator infers the file type from the suffix.
    const tmpPath = path.join(outDir, `.${path.basename(outPath, '.docx')}.${process.pid}.${crypto.randomBytes(6).toString('hex')}.tmp.docx`);
    const flags = fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | (fs.constants.O_NOFOLLOW || 0);
    let fd;
    try { fd = fs.openSync(tmpPath, flags, 0o600); }
    catch (e) { fail(1, `cannot write ${outPath}: ${e.message}`); }
    let st = null;
    let renamed = false;
    const abort = (msg, code = 1) => {
      for (let tries = 0; tries < 50 && st; tries++) {
        const at = fdLocation(fd);
        if (at === null ? false : !at) break; // unlinked already (" (deleted)")
        [at, renamed ? outPath : tmpPath].filter(Boolean).forEach(c => {
          try {
            const l = fs.lstatSync(c);
            if (l.ino === st.ino && l.dev === st.dev) fs.unlinkSync(c);
          } catch (e) { /* best effort */ }
        });
        try { if (fs.fstatSync(fd).nlink === 0) break; } catch (e) { break; }
      }
      try { fs.closeSync(fd); } catch (e) { /* best effort */ }
      fail(code, msg);
    };
    const moved = (detail) => `refusing to write ${outPath}: the output directory changed underneath the build ` +
      `(${detail}); the written file was removed.`;
    // Every step after the open runs under one catch, so no exception path
    // can leave the temp file (or a renamed output) behind.
    try {
      st = fs.fstatSync(fd);
      fs.fchmodSync(fd, 0o600); // the umask can only narrow the open mode; make it exact
      fs.writeFileSync(fd, buf); // loops until the whole buffer is written
      fs.fsyncSync(fd);
      let at = fdLocation(fd);
      if (at !== null && !(at && inRoots(at))) abort(moved(`the file was created at ${at || 'an unresolvable location'}`));
      if (validate) validateOutput(tmpPath, outPath, (msg) => abort(msg, 2));
      try { fs.renameSync(tmpPath, outPath); renamed = true; }
      catch (e) { abort(moved(`rename failed: ${e.message}`)); }
      let seen = null, real = null;
      try { seen = fs.lstatSync(outPath); real = fs.realpathSync(outPath); } catch (e) { /* checked below */ }
      if (!seen || !seen.isFile() || seen.ino !== st.ino || seen.dev !== st.dev) abort(moved('the output name is not the written file'));
      if (!real || !inRoots(real)) abort(moved(`the output resolves to ${real || 'an unresolvable location'}`));
      at = fdLocation(fd);
      if (at !== null && !(at && inRoots(at))) abort(moved(`the file is at ${at || 'an unresolvable location'}`));
      if (fs.fstatSync(fd).nlink !== 1) abort(moved('the written file gained a link'));
    } catch (e) { abort(`cannot write ${outPath}: ${e.message}`); }
    fs.closeSync(fd);
  };

  Packer.toBuffer(doc).then(buf => {
    // The directory is created only now, after every manifest gate has passed
    // and the document has packed — a failed manifest leaves no directory
    // behind. The lexical and realpath checks above ran before packing, which
    // can take seconds on a large manifest — long enough for a directory
    // component in the shared temp dir to be swapped for a symlink. Re-check
    // before mkdir and immediately before the write; writeOutput() then
    // proves the result through the descriptor itself.
    checkReal(outDir);
    fs.mkdirSync(outDir, { recursive: true });
    checkReal(outDir);
    checkTarget();
    writeOutput(buf, !noValidate);
    process.stdout.write(outPath + '\n');
  }).catch(e => fail(1, 'build failed: ' + (e && e.message ? e.message : e)));
}

// OOXML check, never skipped. The full validator (the public docx skill's
// validate.py) runs where it is installed; where it is absent or cannot start
// for an environment reason (python module missing), the bundled stdlib
// well-formedness check in scripts/check_ooxml.py runs instead — a document
// with a stray control character shipped with exit 0 in CI for exactly as long
// as "validator absent" meant "pass". Any other validator failure is the
// document's, and the file is removed (reject: writeOutput's cleanup, then
// exit 2) rather than left where a deliverable belongs. --no-validate is the
// only way to skip. Either success is stated on stderr, so a caller (the
// regression suite) can tell a validated build from one that skipped.
function validateOutput(file, outPath, reject) {
  const full = '/mnt/skills/public/docx/scripts/office/validate.py';
  const bundled = path.join(__dirname, 'check_ooxml.py');
  const rejected = (r, label) => {
    process.stderr.write((r.stdout || '') + (r.stderr || ''));
    reject(`OOXML validation failed (${label}) for ${outPath} (file removed)`);
  };
  let fallbackReason = null;
  if (fs.existsSync(full)) {
    const r = spawnSync('python3', [full, file], { encoding: 'utf8' });
    if (!r.error && r.status === 0) {
      process.stderr.write('build_dpia: note — the full OOXML validator (validate.py) passed.\n');
      return;
    }
    // Only an environment failure falls back: python3 not launchable, or a
    // module the validator imports (lxml, defusedxml) missing. Any other
    // non-zero exit — including a traceback raised while reading the file —
    // is the validator rejecting the document.
    // Anchored to the traceback's final (non-empty) line, where Python puts
    // the exception that ended the run, so document text echoed earlier in a
    // validator message cannot be mistaken for an environment failure.
    const lastLine = (r.stderr || '').split('\n').map(l => l.trim()).filter(Boolean).pop() || '';
    const envFailure = r.error || /^(ModuleNotFoundError|ImportError): /.test(lastLine);
    if (!envFailure) rejected(r, 'validate.py');
    fallbackReason = r.error ? `python3: ${r.error.message}` : 'validate.py is missing a Python dependency';
  } else {
    fallbackReason = 'validate.py not present in this environment';
  }
  const r = spawnSync('python3', [bundled, file], { encoding: 'utf8' });
  if (r.error) {
    reject(`no OOXML check could run (${fallbackReason}; python3: ${r.error.message}) — the document ` +
           'was not validated and has been removed; install python3 or pass --no-validate to accept an unchecked file');
  }
  if (r.status !== 0) rejected(r, 'bundled well-formedness check');
  process.stderr.write(`build_dpia: note — ${fallbackReason}; the bundled well-formedness check ` +
    '(scripts/check_ooxml.py) passed instead of the full OOXML validator.\n');
}

// Last line of the fail-cleanly contract: whatever shape of manifest slips
// past the field guards (a non-callable toString, a cell nested thousands of
// levels deep) exits 1 with one line, never a stack trace.
try { main(); }
catch (e) { fail(1, 'manifest could not be processed: ' + (e && e.message ? e.message : e)); }
