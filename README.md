# DPIA Generator

A Claude Skill that drafts a Data Protection Impact Assessment under Article 35 GDPR as attorney-work-product for a client's privacy register. It gathers a workable processing description, screens whether a DPIA is legally mandatory or prudential, anchors its analysis in real published DPIAs and supervisory-authority guidance (ICO, CNIL, EDPB, WP29), scores risks on a 3×3 likelihood × severity matrix, and produces a reasoned Word deliverable — cover page, executive summary, necessity/proportionality analysis, controls inventory, residual ratings, mitigations, and an Article 36 prior-consultation flag — that flags UK/EU GDPR divergence where it changes the answer.

# Important

Every output from this Skill is a draft for attorney review — not legal advice, not a legal conclusion, not a substitute for a lawyer. This Skill may make review faster; it does not replace it.

This Skill does not represent the creator's legal positions: it is a tool. Where a Skill includes a checklist item, a suggested framework, a risk flag, or a characterization of case law or regulatory guidance, that is an aid to the reviewing attorney's own analysis, not a statement of the author's view of the law. The law in many of these areas is unsettled and evolving. The attorney using the Skill — not the Skill, and not the author — is responsible for the legal positions taken in their work product.

## What it does

- **Intake first (Article 35(7)).** The Skill does not draft until it has a workable processing description — system and purpose, categories of personal data and data subjects, recipients and sub-processors, retention, cross-border transfers, automated decision-making, AI/ML involvement (including vendor-side training), and jurisdictional scope. Missing material facts are named as open questions rather than invented.
- **Triggering screen (Article 35(1)/(3)).** A fast screen against the statutory triggers and the WP29 nine-criteria framework states explicitly whether the DPIA is mandatory or a voluntary accountability artifact.
- **Reconciles with prior work.** Before writing, it checks for a prior DPIA on the same processing, vendor, or data flow and reconciles conclusions in the cover note — with a severity-floor rule so a prior High residual rating cannot silently drop to Low without a documented reason.
- **Anchors in a real analog.** It pulls a published DPIA or DPA decision close to the functional classification of the processing and weaves its reasoning in, marking any departures — a defensibility step, not optional.
- **Sources are tagged.** Every citation carries a source-attribution tag (e.g., `[regulator site]` vs. `verify`) so the reviewing attorney can check the higher-fabrication-risk citations first.
- **Risk analysis.** Inherent and residual risk are scored on a 3×3 likelihood × severity matrix (severity from the data subject's perspective, likelihood from threat-actor capability and asset vulnerability), with a controls inventory and the inherent → residual transition shown.
- **The matrix is computed, not asserted.** The bundled builder derives every rating from the published matrix and plots both grids from the same source, so the register table, the matrices, and the Article 36 flag cannot disagree. Where a stated rating contradicts the derived one, the build hard-fails rather than emitting a document — a mis-stated residual rating is the defect most likely to survive review into a filed DPIA.
- **Consequential-step gates.** The Skill flags Article 36 prior consultation when residual risk warrants it, checks whether the document is leaving the privilege circle (offering privileged and sanitized versions), and confirms before producing a "ready-to-file" version — but does not file with any authority on the user's behalf.

## Requirements

- Runs inside the Claude Skills environment with `conversation_search`, `web_search`, and `web_fetch` available (prior-work reconciliation and live citation verification).
- `node` with the `docx` npm package for the Word deliverable; the public `docx` skill for OOXML validation, which the builder invokes on its own output.

## Usage

Invoke the Skill with any new-processing privacy question:

- "Run a DPIA on [system/vendor/feature]."
- "We're launching [X] — is this Article 35 / high risk?"
- "Assess the privacy risk of this data flow / cross-border transfer."

The Skill asks (in one message) only for the intake details it's missing, runs the screen and the prior-work check, pulls a reference analog, and returns the DPIA `.docx` with a chat summary covering the triggering conclusion, the analog used, the top residual risks, whether Article 36 consultation is recommended, open questions to resolve before finalizing, and any UK/EU divergence that changes the result.

## Outputs

- **`DPIA_<SystemName>_<date>.docx`** — the full attorney-work-product DPIA: cover page (with triggering conclusion and any documented assumptions), executive summary, necessity/proportionality analysis, risk matrix, controls inventory, residual ratings and mitigations, Article 36 flag, and a defined review cadence. Produced by default with a "PRIVILEGED & CONFIDENTIAL — ATTORNEY WORK PRODUCT" header; a sanitized version is offered when the document is going outside the privilege circle.

## Project structure

```
dpia-generator/
├── SKILL.md                          # Skill instructions and workflow
├── README.md
├── LICENSE
├── references/
│   ├── legal-framework.md            # Art. 35/36 text, recitals, WP248rev01 nine criteria, mandatory lists
│   ├── risk-matrix.md                # 3×3 matrix, scoring rubrics, inherent → residual transition
│   ├── published-dpias.md            # Curated catalog of real DPIAs and DPA decisions with URLs
│   ├── uk-divergence.md              # Where UK GDPR diverges from EU GDPR (incl. DUAA 2025)
│   └── output-template.md            # Section structure, table layouts, template → manifest mapping
└── scripts/
    └── build_dpia.js                 # Manifest-driven .docx assembler; owns the matrix mapping,
                                      #   the Article 36 mark, and the risk-rating gate
```

`dpia-generator.skill.zip` at the repo root is the packaged build of the above, regenerated whenever the skill changes.

## Notes and limitations

- **Never invents facts or citations.** Unknown processing details become open questions; every cited DPA decision must exist and is verified by web-fetch before it is cited.
- **Attorney-work-product depends on staying inside the privilege circle.** The Skill flags when a DPIA is heading to a board pack, a vendor, a public page, or a regulator, and offers privileged vs. sanitized versions rather than silently applying the header.
- **The DPO is not a rubber stamp.** Article 35(2) DPO advice and the Article 35(9) data-subject consultation are noted where they apply and where the Skill has substituted its own analysis, with a recommendation to confirm.
- A DPIA is a living document: the output ends with a review cadence and the conditions (new sub-processor, material model change, change in law, security incident) that trigger an off-cycle review.

## Changelog

The `## Version` section of `SKILL.md` is canonical; this is the long-form record and does not contradict it.

- **v1.2.1** — Two items found by running the skill end to end against a full DPIA. A manifest `outputFilename` containing a path could write outside `outputDir`; it is now reduced to a basename, with a note on stderr when that happens. Step 5 now cites the script header's line range so the manifest schema can be read without loading the whole builder.

- **v1.2** — Corrected the Article 36 prior-consultation flag. It previously fired only on a High likelihood × High severity residual, so a Medium × High residual — which rates High on the published matrix, and which Art. 36(1) engages on identically — was rendered without the flag. The flag now keys to the derived residual rating wherever it appears: the register table, `risk-matrix.md`, and Step 4. The builder additionally warns when a High residual is present but the cover-page status does not say `Requires Art. 36 Prior Consultation`.

  Also removed the v1.1 contradiction in `output-template.md`, which still told the model to hand-write a per-run `create_dpia.js` and specified a US-Letter/Arial layout and an eleven-column register that the bundled builder does not produce; it now carries a template → manifest mapping table matching the builder's actual output. Added a Fast-Path Default section to `SKILL.md`, made the A4 page geometry explicit in the builder, and narrowed Step 5's mandatory read of the public docx skill to the exit-2 repair path.

- **v1.1** — Step 5 moved from an unbundled per-run generator to the bundled, tested `scripts/build_dpia.js`. The matrix mapping and the Article 36 flag became script-computed under a hard gate (exit 3) rather than model-asserted. The description gained routing clauses against `product-regulatory-scan`, `tech-law-radar`, and `b2b-supplier-redline`.

- **v1.0** — Baseline: Article 35 framework, published-DPIA analogs, 3×3 matrix, UK/EU divergence notes.

## License

Review License file.
