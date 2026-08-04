# DPIA Generator

A Claude Skill that drafts a Data Protection Impact Assessment under Article 35 GDPR — and its analogs in other covered jurisdictions — as attorney-work-product for a client's privacy register. It gathers a workable processing description, maps the applicable regimes (EU/UK GDPR plus per-jurisdiction modules for the US states, Quebec, Brazil, China, India, Switzerland, Singapore, Malaysia, Australia and South Korea), screens each regime's own trigger, anchors its analysis in real published DPIAs and regulator guidance (ICO, CNIL, EDPB, WP29, CPPA, CAI, ANPD, PDPC, OAIC and peers), scores risks on a 3×3 likelihood × severity matrix, and produces a reasoned Word deliverable — cover page, executive summary, necessity/proportionality analysis, controls inventory, residual ratings, mitigations, and per-regime regulator-engagement flags (Article 36 prior consultation and its analogs) — with a Jurisdictional Divergence section wherever a covered regime changes the answer. Regimes without a module are named as not covered rather than silently absorbed.

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
node scripts/run_regression.js          # 27 cases; exit 0 if all pass, --keep to inspect the .docx files
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

- **v3.6** — Reviewer title simplified to a uniform "DPO", and a citation-verification pass.

  The cover-status review state now reads "Under DPO Review" for every regime — the review officer's exact statutory title (SRI, Encarregado, Person in Charge of PI Protection, and so on) varies, but the checkbox does not need that specificity; the per-regime **blocking** states (Article 36, FDPIC consultation, PIPC agency assessment) are unchanged. Separately, a verification pass ran against the citations the earlier evaluation had flagged as UNVERIFIED. Primary-source fetches are still blocked (every official portal returns 403 to the fetch tool), so nothing reached `[official publication]` — but web search is available, and it corroborated the non-EU statutory identifiers, moving them off pure recall (`[model knowledge — verify]`) onto the corroborated middle tier (`[web search — verify]`): Colorado Rules 8.02/8.04/9.06, California's 11 CCR Article 10 §§ 7150 and 7152, Quebec ss. 3.3 and 17, LGPD Articles 5(XVII) and 38, PIPL Articles 55–56 with the three-year retention, GB/T 39335-2020, India's DPDP Rule 13, and Switzerland's revFADP SR 235.1 Articles 22/23/23(4). The pass also filled the long-recorded gap in the Data (Use and Access) Act 2025 citation — it is **chapter 18** (Royal Assent 19 June 2025) — and corrected a Brazilian resolution mis-attribution the verification surfaced: Resolução CD/ANPD nº 2/2022 is the small-agents regulation, not a binding high-risk-criteria list. `authorities.md` now spells out the three-tier tag semantics so the corroborated tier is never mistaken for a fetch. No behavior change; the regression suite is unchanged at twenty-seven cases.

- **v3.5** — Per-regime cover-status vocabulary, closing the last GDPR hard-coding the two-test evaluation reported.

  The cover page's status checkboxes were a fixed GDPR list — a Colorado-only data protection assessment offered a "Requires Art. 36 Prior Consultation" box it could never lawfully check. The vocabulary is now derived from the manifest's `jurisdictions`: the review state names the primary regime's reviewer title (Under DPO Review, Under DPO / SRI Review, Under Privacy Counsel Review, Under Data Protection Advisor Review, Under Person in Charge of PI Protection Review, and so on through the registry), and each declared regime with a genuine consultation-style blocking state contributes its own checkbox — Article 36 for EU/UK scope, FDPIC consultation for Switzerland, the PIPC designated-agency assessment for Korean public-sector scope. Checklist regimes contribute none. A `statusOptions` manifest array overrides the derived list; a declared `status` outside the vocabulary renders as an additional checked box with a stderr note, so the cover always reflects the declared state rather than silently unchecking every option. Three new regression cases pin the Swiss vocabulary, the out-of-vocabulary path, and the absence of the Art. 36 box on checklist-regime covers (suite: twenty-seven cases).

- **v3.4.1** — Hardening found by a two-test global evaluation (a four-regime quality run and an adversarial security run). Manifest-supplied lookup keys could resolve through the JavaScript prototype chain: `"__proto__"` as a jurisdiction code slipped past the unknown-code check and produced a garbled gate diagnosis, and `"constructor"` as a matrix `source` crashed the builder with a stack trace — a latent defect dating to v1.1, exposed only once the registry pattern multiplied manifest-keyed lookups. All such lookups now go through own-property checks and null-prototype maps, failing cleanly with exit 1 and a correct message; two fixtures pin the behavior (suite: twenty-five cases). Also corrects the multi-regime Article 36 footnote to agree in number ("are engaged … those consultations have concluded") when both EU and UK authorities are named.

- **v3.4** — Phase 4 close-out: the screening catalog and the global triggering contract.

  `references/jurisdictions/screening-catalog.md` adds Tier-3 screening entries — Saudi Arabia, UAE, South Africa (whose prior-authorisation regime under POPIA ss. 57–58 is closer to Article 36 than most), Nigeria, Kenya, Japan, Thailand — which upgrade the coverage fallback: instead of a bare "not covered", Section 6 may carry the one-paragraph screening note plus the explicit statement that coverage is limited to it. Promotion to a full module goes through the standard build (fetch, crosswalk, privilege posture, registry code), never by patching catalog prose. The skill description is rewritten for global triggering within the 1024-character packaging cap with every sibling routing clause intact, and the phase closes with an end-to-end smoke test: a four-regime biometric time-and-attendance manifest (EU, UK, Colorado, Brazil) through intake logic, per-regime conclusions, the regulator-engagement table and the builder's gates, with OOXML validation passing.

- **v3.3** — Phase 3 jurisdictions: Switzerland, India, Singapore, Malaysia, Australia, South Korea.

  **Switzerland** (`ch-fadp`) is the cleanest overlay in the skill and carries its most instructive gate decision: revFADP Article 23 is a true Article 36 analog, but Article 23(4) lets a controller that consulted its data protection advisor lawfully skip the FDPIC on a High residual — a fact the builder cannot see. The regime is therefore deliberately non-derivable: the consultation conclusion is declared and reviewed, with the module spelling out the three lawful configurations. **India** (`in-dpdp`) models the entity-designation pattern — the DPIA duty attaches to designated Significant Data Fiduciaries annually with findings reported to the Data Protection Board, and a clean "no duty attaches" is treated as a first-class output. **Singapore** (`sg-pdpa`) captures the two statutory assessments gating deemed consent and the legitimate-interests exception; **Malaysia** (`my-pdpa`) ships on watch status with a volatility banner while the JPDP's DPIA guideline is in consultation; **Australia** (`au-privacy`) carries the agency-only PIA mandate plus the reform overlay already changing answers (statutory privacy tort since June 2025, ADM transparency from December 2026, employee-records and small-business exemptions reversing EU conclusions); **South Korea** (`kr-pipa`) documents the mandatory public-institution PIA run through PIPC-designated agencies — which the skill's output supports and pre-drafts but cannot substitute for, and says so. Korea joins China in the strictest privilege posture: the record is submitted or compellable by design, so candid analysis stays out.

- **v3.2** — Phase 2 jurisdictions: Brazil and China.

  **Brazil** (`br-lgpd`) lands as a GDPR-family overlay: the LGPD's RIPD is satisfied by the Article 35 spine, with module coverage of the ten-basis lawful-basis mapping, the ANPD's high-risk criteria and demand power, and Brazilian transfer mechanics. The module opens with a volatility banner — the ANPD's dedicated RIPD regulation is still pending, and the module must be rebuilt from it when it lands rather than patched.

  **China** (`cn-pipl`) is a standalone module: enumerated Article 55 triggers (sensitive PI is harm-defined and much broader than Article 9 — financial accounts, location, under-14s), short statutory content under Article 56 that the spine over-satisfies, a three-year retention rule, and the skill's second production-by-design regime — on the SCC export route the PIPIA report is filed with the provincial CAC. The privilege posture is the bluntest in the skill: China recognizes no legal professional privilege in the common-law sense, so counsel's candid analysis never enters the China record, without exception.

- **v3.1** — Phase 1 jurisdictions: the United States and Canada.

  Four regime modules land in `references/jurisdictions/`: **Colorado** (`us-co` — the most prescriptive US content list, Rule 8.04, producible to the AG within 30 days), **California** (`us-ca` — CPPA risk assessments with the only scheduled filing obligation in the skill: first attestation due 2028-04-01 covering 2026–2027), the **harmonized US-state pattern** (`us-state` — Virginia CDPA archetype, one module rather than fifteen), and **Quebec Law 25** (`ca-qc` — project-based PIA trigger plus the outside-Quebec transfer PIA, the closest non-European analog to Article 35). The builder's registry gains all four as non-derivable checklist regimes: their conclusions are declared answers to their own trigger screens, gated on existence rather than derived from the register.

  The plan's open privilege question is resolved: each module carries a **privilege posture** section, and the destination check now enforces a two-document default for regimes whose assessment is producible or filed by design — the producible record (no privileged header, regime-correct title) and counsel's candid analysis in the privileged GDPR-spine document. Build-time fetches of the primary sources returned 403 through the environment proxy; per the house rule every new citation ships UNVERIFIED with descriptive pinpoints, and each module says so at the top rather than presenting recall as verification. Suite grows to twenty-three cases.

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
