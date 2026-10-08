# DPIA Generator

[![tests](https://github.com/wnallen/dpia-generator/actions/workflows/test.yml/badge.svg)](https://github.com/wnallen/dpia-generator/actions/workflows/test.yml)

A Claude Skill that drafts a Data Protection Impact Assessment under Article 35 GDPR (and its analogs in other covered jurisdictions) for a client's privacy register.

Given a description of a new or modified processing activity, the Skill gathers what is missing, maps the applicable regimes, and screens each regime's own trigger. Coverage is EU/UK GDPR plus one module per further jurisdiction in `references/jurisdictions/` — currently the US states, Quebec, Brazil, China, India, Switzerland, Singapore, Malaysia, Indonesia, Vietnam, Australia, South Korea, and Kenya; that directory is the authoritative list. The analysis is anchored in real published DPIAs and regulator guidance (ICO — now the Information Commission — CNIL, EDPB, CPPA, ANPD, and peers), and risks are scored on a 3×3 likelihood × severity matrix. The deliverable is a reasoned Word document: cover page, executive summary, necessity/proportionality analysis, controls inventory, residual ratings, mitigations, per-regime regulator-engagement flags (Article 36 prior consultation and its analogs), and a Jurisdictional Divergence section wherever a covered regime changes the answer. Regimes without a module are named as not covered rather than silently absorbed.

# Important

Every output from this Skill is a draft for human review — by counsel where one is in the loop, by the Data Protection Officer otherwise — not legal advice, not a legal conclusion, not a substitute for a lawyer. This Skill may make review faster; it does not replace it.

This Skill does not represent the creator's legal positions: it is a tool. Where a Skill includes a checklist item, a suggested framework, a risk flag, or a characterization of case law or regulatory guidance, that is an aid to the reviewing attorney's own analysis, not a statement of the author's view of the law. The law in many of these areas is unsettled and evolving. The attorney using the Skill — not the Skill, and not the author — is responsible for the legal positions taken in their work product.

## What it does

- **Intake first (Article 35(7)).** The Skill does not draft until it has a workable processing description — system and purpose, categories of personal data and data subjects, recipients and sub-processors, retention, cross-border transfers, automated decision-making, AI/ML involvement (including vendor-side training), and jurisdictional scope. Missing material facts are named as open questions rather than invented.
- **Triggering screen (Article 35(1)/(3)).** A fast screen against the statutory triggers and the WP29 nine-criteria framework states explicitly whether the DPIA is mandatory or a voluntary accountability artifact.
- **Reconciles with prior work.** Before writing, it checks for a prior DPIA on the same processing, vendor, or data flow and reconciles conclusions in the cover note — with a severity-floor rule so a prior High residual rating cannot silently drop to Low without a documented reason.
- **Notice profile — provide once, reuse every run.** "Index our privacy notice" extracts the controller's published notice into a portable YAML profile the user keeps (verbatim commitments with pinpoints, provenance, a check-by date) — indexed category-complete against a fixed commitment-type vocabulary aligned with the OPP-115 annotation scheme, with silence recorded as data so re-indexing an unchanged notice reproduces the profile; a load-bearing vendor's DPA or policy can be indexed the same way, pinned to a version date. Later DPIA runs load the profile to pre-fill intake, ground the Art. 13/14 transparency analysis, and drive the §1.10 policy-drift check — rendered by the builder with colour-coded verdicts, where a drift or conflict row with no committed resolution fails the build rather than shipping as a bare red cell.
- **Anchors in a real analog.** It pulls a published DPIA or DPA decision close to the functional classification of the processing and weaves its reasoning in, marking any departures — a defensibility step, not optional.
- **Sources are tagged.** Every citation carries a source-attribution tag (e.g., `[regulator site]` vs. `verify`) so the reviewing attorney can check the higher-fabrication-risk citations first.
- **Risk analysis.** Inherent and residual risk are scored on a 3×3 likelihood × severity matrix (severity from the data subject's perspective, likelihood from threat-actor capability and asset vulnerability), with a controls inventory and the inherent → residual transition shown.
- **The matrix is computed, not asserted.** The bundled builder derives every rating from the published matrix and plots both grids from the same source, so the register table, the matrices, and the Article 36 flag cannot disagree. Where a stated rating contradicts the derived one, the build hard-fails rather than emitting a document — a mis-stated residual rating is the defect most likely to survive review into a filed DPIA.
- **Consequential-step gates.** The Skill flags Article 36 prior consultation when residual risk warrants it, checks whether the document is leaving the privilege circle (offering privileged and sanitized versions), and confirms before producing a "ready-to-file" version — but does not file with any authority on the user's behalf.
- **Consultation duties are noted, not simulated.** Article 35(2) DPO advice and the Article 35(9) data-subject consultation are flagged where they apply, with a note wherever the Skill has substituted its own analysis and a recommendation to confirm.

## Requirements

- Runs inside the Claude Skills environment with `conversation_search`, `web_search`, and `web_fetch` available (prior-work reconciliation and live citation verification).
- `node` with the `docx` npm package for the Word deliverable; OOXML validation via the public `docx` skill where installed (see Testing).

## Usage

Invoke the Skill with any new-processing privacy question:

- "Run a DPIA on [system/vendor/feature]."
- "We're launching [X] — is this Article 35 / high risk?"
- "Assess the privacy risk of this data flow / cross-border transfer."
- "Index our privacy notice" — builds the reusable notice profile (no DPIA); attach the profile on later runs.

The Skill asks (in one message) only for the intake details it's missing, runs the screen and the prior-work check, pulls a reference analog, and returns the DPIA `.docx` with a chat summary covering the triggering conclusion, the analog used, the top residual risks, whether Article 36 consultation is recommended, open questions to resolve before finalizing, and any UK/EU divergence that changes the result.

## Outputs

- **`DPIA_<SystemName>_<date>.docx`** — the full DPIA draft: cover page (with triggering conclusion and any documented assumptions), executive summary, necessity/proportionality analysis, risk matrix, controls inventory, residual ratings and mitigations, Article 36 flag (required / not required / conditional on the Section 5 mitigations), and a defined review cadence. Produced with a posture-derived header — "PRIVILEGED & CONFIDENTIAL — ATTORNEY WORK PRODUCT" where a counsel is named as being in the review loop, "CONFIDENTIAL — DRAFT FOR DPO REVIEW" on DPO-led runs; a sanitized version is offered when the document is going outside the privilege circle. **Every output self-identifies as an AI-generated draft of this skill** — cover notice, footer, and file metadata, none of it removable by manifest — authored for human review and adoption, never presented as counsel's own work. The footer names the reviewing role from the document's posture: "for attorney review" where a counsel is named and the work-product header is on, "for DPO review" otherwise.

## Project structure

```
dpia-generator/
├── SKILL.md                          # Skill instructions and workflow
├── README.md
├── CHANGELOG.md                      # Long-form release record (SKILL.md ## Version is canonical)
├── LICENSE
├── package.json                      # Pinned docx dependency; `npm test` runs the suite
├── package-lock.json
├── .gitignore
├── .github/
│   └── workflows/
│       └── test.yml                  # CI: runs the regression suite on every push and PR
├── docs/
│   ├── eval-prompts.md               # Graded skill-level eval prompts (workflow behaviors
│   │                                 #   the regression suite cannot test)
│   └── open-datasets-integration-plan.md   # Design record for the open-dataset workstreams
│                                     #   (1–3 executed as v4.3; 4–6 proposed)
├── references/
│   ├── legal-framework.md            # Art. 35/36 text, recitals, WP248rev01 nine criteria, mandatory lists
│   ├── risk-matrix.md                # 3×3 matrix, scoring rubrics, inherent → residual transition
│   ├── authorities.md                # Citation register: settled statutory cites vs. unverified guidance
│   ├── currency-log.md               # Dated corroboration/currency passes (maintenance reading only)
│   ├── notice-profile.md             # Privacy-notice profile: portable YAML schema, indexing mode,
│   │                                 #   staleness rules, and what the profile feeds on DPIA runs
│   ├── published-dpias.md            # Curated catalog of real DPIAs, DPA decisions and regulator guides
│   ├── jurisdictions/                # One module per non-EU regime (trigger test, Art. 35(7)
│   │   │                             #   crosswalk, regulator engagement, privilege posture)
│   │   ├── uk-gdpr.md                # UK GDPR / DUAA divergence overlay
│   │   ├── us-colorado.md, us-california.md, us-other-states.md
│   │   ├── canada-quebec.md, brazil-lgpd.md, china-pipl.md, india-dpdp.md
│   │   ├── switzerland-fadp.md, singapore-pdpa.md, malaysia-pdpa.md, australia-privacy.md
│   │   ├── south-korea-pipa.md, kenya-dpa.md, vietnam-pdpl.md, indonesia-pdp.md
│   │   └── screening-catalog.md      # One-paragraph screening notes for regimes without a module
│   └── output-template.md            # Section structure, table layouts, template → manifest mapping
├── scripts/
│   ├── build_dpia.js                 # Manifest-driven .docx assembler; owns the jurisdiction registry,
│   │                                 #   the matrix mapping, the high-residual mark, and the exit-3 gates
│   ├── check_ooxml.py                # Stdlib well-formedness check of every XML part; the builder's
│   │                                 #   fallback wherever the full OOXML validator is absent (CI)
│   └── run_regression.js             # Regression suite over the builder
└── tests/fixtures/                   # One manifest per regression case
```

## Testing

```bash
npm install                             # installs the pinned docx package
node scripts/run_regression.js          # exit 0 if all pass; --keep to inspect the .docx files
```

Each case is a defect that shipped or a gate that exists to stop one, and each carries a one-line note saying which; the runner fails on a fixture with no case, so the fixture directory cannot silently drift from the suite. Run it after any change to the builder, to `references/risk-matrix.md`, or to the manifest schema — the matrix mapping and the Article 36 flag are the two things in this skill a reader cannot check by eye. The suite is mutation-tested: reintroducing the v1.1 Article 36 bug, or corrupting a single matrix cell, turns it red.

The builder validates its own OOXML output via the public docx skill's `validate.py` where that skill is installed (`/mnt/skills/public/docx`). The validator is a Python script requiring the `defusedxml` and `lxml` packages. Where it is absent, or cannot start because a Python module is missing, the builder runs the bundled `scripts/check_ooxml.py` instead — a stdlib check that every XML part is well-formed (which is what catches the control-character class of defect) and that relationship targets exist — and says so in a stderr note; validation is never skipped, and a file that fails either check is removed with exit 2. `pip install defusedxml lxml` upgrades the fallback to the full validator. `--no-validate` disables the validation step entirely. CI runs on Node 22 (`.nvmrc`); the pinned `docx` tree needs Node ≥ 20.

## Maintenance — keeping the regime modules honest

The skill's coverage is only as good as its most stale module. Four standing rules:

1. **Volatility banners are contracts.** Modules carrying an explicit banner — Brazil
   (ANPD RIPD regulation pending), Malaysia (JPDP DPIA guideline issued 2026-04-30; rebuild
   from its text pending), Indonesia (implementing regulation GR 33/2026 enacted 2026-07-16;
   the supervisory authority's establishment still pending) — must be **re-searched on every
   run that touches them**, and rebuilt from the final instrument when it lands, never
   patched by prose. Vietnam's module carries a re-verify-every-run sourcing note (Decree
   356/2025 landed; its dossier forms not yet read), and Australia's tranche-two reforms are
   the same class. The UAE's executive regulations were issued in 2026 (decision number
   still unverified), tracked in the screening catalog.
2. **Dates are check-by dates.** Every sourcing banner records when its corroboration pass
   ran (latest pass: 2026-09-23, per `references/currency-log.md`). A banner more than ~6 months old should be treated as a
   prompt to re-verify before reliance, not as a fact.
3. **`tech-law-radar` feeds the queue.** The sibling skill's periodic sweeps are the
   designed intake for new instruments (the Malaysian guideline's text and effective date, an SDF designation
   wave in India, a CPPA enforcement action interpreting § 7152). Radar findings that touch
   a covered regime become module updates; findings that touch a screening-catalog regime
   are promotion candidates.
4. **Promotion has one path.** Screening entry → full module via the standard build: fetch
   (or search-corroborate, honestly tagged) the primary sources, write the module skeleton,
   add the registry code, add a fixture if the regime introduces new gate behavior, bump
   the version. Kenya (v3.8) is the worked example.

The first session run from an environment whose fetch tool can reach official portals
should also execute the `[official publication]` upgrade pass recorded in
`references/authorities.md` — the corroborated middle tier is deliberate, not final.

Skill-level eval prompts (the workflow behaviors the regression suite cannot test) live in
`docs/eval-prompts.md`.

## Changelog

See `CHANGELOG.md` — the long-form record of every release since v1.0. The `## Version` section of `SKILL.md` is canonical and summarizes the current release.

## License

MIT — see [LICENSE](LICENSE).
