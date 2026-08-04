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
│   ├── authorities.md                # Citation register: settled statutory cites vs. unverified guidance
│   ├── published-dpias.md            # Curated catalog of real DPIAs, DPA decisions and regulator guides
│   ├── jurisdictions/                # One module per non-EU regime (trigger test, Art. 35(7)
│   │   └── uk-gdpr.md                #   crosswalk, regulator engagement, privilege posture)
│   └── output-template.md            # Section structure, table layouts, template → manifest mapping
├── scripts/
│   ├── build_dpia.js                 # Manifest-driven .docx assembler; owns the jurisdiction registry,
│   │                                 #   the matrix mapping, the high-residual mark, and the exit-3 gates
│   └── run_regression.js             # Regression suite over the builder
└── tests/fixtures/                   # One manifest per regression case
```

## Testing

```bash
npm install                             # installs the pinned docx package
node scripts/run_regression.js          # 21 cases; exit 0 if all pass, --keep to inspect the .docx files
```

Each case is a defect that shipped or a gate that exists to stop one, and each carries a one-line note saying which. Run it after any change to the builder, to `references/risk-matrix.md`, or to the manifest schema — the matrix mapping and the Article 36 flag are the two things in this skill a reader cannot check by eye. The suite is mutation-tested: reintroducing the v1.1 Article 36 bug, or corrupting a single matrix cell, turns it red.

The builder validates its own OOXML output via the public docx skill's `validate.py` where that skill is installed (`/mnt/skills/public/docx`). The validator is a Python script requiring the `defusedxml` and `lxml` packages; if it is absent or cannot run, the builder skips validation with a warning on stderr rather than failing the build. `--no-validate` disables the validation step entirely.

## Notes and limitations

- **Never invents facts or citations.** Unknown processing details become open questions; every cited DPA decision must exist and is verified by web-fetch before it is cited.
- **Attorney-work-product depends on staying inside the privilege circle.** The Skill flags when a DPIA is heading to a board pack, a vendor, a public page, or a regulator, and offers privileged vs. sanitized versions rather than silently applying the header.
- **The DPO is not a rubber stamp.** Article 35(2) DPO advice and the Article 35(9) data-subject consultation are noted where they apply and where the Skill has substituted its own analysis, with a recommendation to confirm.
- A DPIA is a living document: the output ends with a review cadence and the conditions (new sub-processor, material model change, change in law, security incident) that trigger an off-cycle review.

## Changelog

The `## Version` section of `SKILL.md` is canonical; this is the long-form record and does not contradict it.

- **v3.0** — Multi-jurisdiction architecture, deliberately behavior-preserving for EU/UK work.

  **Jurisdictions and per-regime conclusions.** The manifest gains a `jurisdictions` array (default `["eu-gdpr"]`, so every existing manifest keeps its meaning) and a `regulatorConclusions` object requiring one declared engagement conclusion per regime wherever a risk register exists. The v2.0 `art36` field survives as an alias that fills the prior-consultation answer for GDPR-family regimes. The Article 36 conclusion gate becomes the general regulator conclusion gate: for prior-consultation regimes the declaration is checked against the register (exit 3 on contradiction, as before); for statutory-checklist regimes added by later phases the gate enforces that a conclusion exists at all (exit 1 on silence) — an assessment that has not formed a view on its regulator obligations is not finished, in any jurisdiction.

  **Checklist regimes get a machine-checked map.** A new `complianceMap` block renders a regime's required-element → DPIA-section cross-reference; a `section` reference matching no heading in the manifest fails the build, because a dangling cross-reference is the checklist version of a fabricated citation.

  **Privilege posture is now a parameter, not a constant.** `docTitle` and `headerText` override the cover title and the privileged header; `headerText: ""` deliberately omits the header for documents drafted for regulator production (a Colorado assessment producible to the AG cannot carry a header the disclosure itself would falsify). The default — full privileged header — is unchanged.

  **Layout.** `references/uk-divergence.md` moved to `references/jurisdictions/uk-gdpr.md`, becoming the first module in the per-regime layout every subsequent jurisdiction follows; Section 6 generalized from "UK/EU Divergence" to "Jurisdictional Divergence"; intake question 9 became an applicable-regimes mapping with a hard coverage-fallback rule (a regime with no module is reported as not covered — never silently absorbed). Regression suite grows from fifteen to twenty-one cases.

- **v2.0.2** — Repo hygiene for public release. The builder's exit 2 previously conflated two different events: the validator ran and rejected the document, and the validator itself crashed before validating anything (a Python traceback from a missing `defusedxml` or `lxml` in the environment). The second is not a defect in the document, and the suite would go red on healthy code wherever the docx skill was present but its Python dependencies were not. The builder now captures the validator's output, detects a crash, and skips validation with a warning; exit 2 is reserved for a document the validator actually rejected. Also commits `package-lock.json` (previously gitignored) for reproducible installs, removes the README's reference to a packaged zip deleted from the repo, documents the validator's Python dependencies and `--no-validate`, and states the MIT license explicitly. Aligns the skill text with the README's not-legal-advice disclaimer: the work-product style note now reads "counsel's advice to the client" rather than "legal advice" (identical doctrine, no longer quotable out of context), and the delivery summary now restates on every run that the DPIA is a draft for attorney review — not legal advice until counsel has reviewed and adopted it.
- **v2.0.1** — Security hardening of the output path. The manifest is authored from instructions that can include untrusted ingested content (vendor pages, pasted specs), which makes its path fields semi-trusted. `outputDir` was unrestricted, so a manifest could direct the write to any location the process could reach — the same escape the `outputFilename` basename guard next to it was meant to prevent. `outputDir` is now confined to an allowlist (the default outputs directory and the OS temp dir, extendable via the `DPIA_OUTPUT_ROOTS` environment variable), and the residual `outputFilename` gap where `..`/`.` survive `basename()` and climb one level out of `outputDir` is closed, with the fully-resolved path re-checked against `outputDir`. Adds a pinned `package.json` (`npm test` runs the suite), a `.gitignore`, and two regression fixtures — `outputdir-escape` and `traversal-dotdot` — taking the suite to fifteen cases.

- **v2.0** — Extends the gate philosophy from the ratings to the conclusion, and adds the means to keep it honest.

  **Article 36 conclusion gate.** The v1.1 rating gate stopped the register contradicting the matrix. It did nothing about the prose: a DPIA could carry a High residual in its table and a sentence in its executive summary saying prior consultation was not required, and nothing would object. A manifest with a risk register must now declare `"art36": true|false`, checked against the register, exit 3 on disagreement, exit 1 if undeclared — a DPIA that has not formed a view on prior consultation is not finished. A narrative scan additionally warns where the text appears to assert the opposite of the derived answer. This breaks existing manifests, hence the major version.

  **Regression suite.** `scripts/run_regression.js` with thirteen fixtures covering both gates, the Article 36 positive and negative paths, XML escaping of untrusted vendor text, path traversal, and the manifest error cases. Mutation-tested: reverting the v1.1 Article 36 bug turns it red, as does corrupting a single cell of the matrix. Previously every change to this skill was verified by hand.

  **Citation register.** `references/authorities.md` separates the recurring authorities that can be cited from stable identifiers from the guidance and case law that must be fetched first. It ships with the second category marked UNVERIFIED, and says what to capture on verification rather than inventing pinpoints — a precise citation that is wrong is worse than an approximate one honestly labelled.

  **Tool-unavailable fallbacks.** Steps 0.5 and 1 now distinguish "checked and found nothing" from "could not check." The prior-work reconciliation no longer records a cold start when `conversation_search` was simply unavailable, and a run with no web access says in Appendix A that nothing was fetched rather than presenting an unreachable analog as an absent one.

- **v1.2.1** — Two items found by running the skill end to end against a full DPIA. A manifest `outputFilename` containing a path could write outside `outputDir`; it is now reduced to a basename, with a note on stderr when that happens. Step 5 now cites the script header's line range so the manifest schema can be read without loading the whole builder.

- **v1.2** — Corrected the Article 36 prior-consultation flag. It previously fired only on a High likelihood × High severity residual, so a Medium × High residual — which rates High on the published matrix, and which Art. 36(1) engages on identically — was rendered without the flag. The flag now keys to the derived residual rating wherever it appears: the register table, `risk-matrix.md`, and Step 4. The builder additionally warns when a High residual is present but the cover-page status does not say `Requires Art. 36 Prior Consultation`.

  Also removed the v1.1 contradiction in `output-template.md`, which still told the model to hand-write a per-run `create_dpia.js` and specified a US-Letter/Arial layout and an eleven-column register that the bundled builder does not produce; it now carries a template → manifest mapping table matching the builder's actual output. Added a Fast-Path Default section to `SKILL.md`, made the A4 page geometry explicit in the builder, and narrowed Step 5's mandatory read of the public docx skill to the exit-2 repair path.

- **v1.1** — Step 5 moved from an unbundled per-run generator to the bundled, tested `scripts/build_dpia.js`. The matrix mapping and the Article 36 flag became script-computed under a hard gate (exit 3) rather than model-asserted. The description gained routing clauses against `product-regulatory-scan`, `tech-law-radar`, and `b2b-supplier-redline`.

- **v1.0** — Baseline: Article 35 framework, published-DPIA analogs, 3×3 matrix, UK/EU divergence notes.

## License

MIT — see [LICENSE](LICENSE).
