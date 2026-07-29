# Output Template — Exact Structure of the DPIA .docx

Read this before authoring the manifest in Step 5. The structure below is the constant across all DPIAs produced by this skill; only the narrative content changes per processing activity. The document is assembled by `scripts/build_dpia.js` from a JSON manifest — **do not hand-write a per-run generator**; the block-by-block mapping from this template to manifest blocks is at the end of this file.

## File and Header

**Filename:** `DPIA_[SystemName]_[YYYY-MM-DD].docx`, saved to `/mnt/user-data/outputs/`.

**Every page should carry a header (top-right) reading:**
> PRIVILEGED & CONFIDENTIAL — ATTORNEY WORK PRODUCT

**Every page should carry a footer with:**
- Page X of Y
- DPIA reference number (placeholder: `[DPIA-YYYY-NNN]`)
- "Prepared by Counsel"

## Cover Page

Single page, centered content:

```
DATA PROTECTION IMPACT ASSESSMENT

[System / Processing Activity Name]
Version 1.0 — DRAFT FOR DPO REVIEW

[Date]

Controller: [Controller name — placeholder if unknown]
Data Protection Officer: [DPO name — placeholder]
Counsel of Record: [Counsel name — placeholder]
DPIA Reference: [DPIA-YYYY-NNN]

Status: ☐ Draft  ☐ Under DPO Review  ☐ Approved  ☐ Requires Art. 36 Prior Consultation
```

Use a horizontal rule above and below the central block. Leave generous white space.

## Executive Summary (1 page)

Concise, prose, in counsel's voice. Structure:

1. **Processing in one sentence.** "This DPIA assesses [system] which [purpose] by processing [data categories] of [data subject categories]."
2. **Article 35 triggering conclusion.** "A DPIA is [mandatory / prudential] because [reasoning, with specific Art. 35(3) or WP29 criteria citations]."
3. **Top residual risks (3–5 bullets).** Each one named with its residual rating.
4. **Article 36 prior consultation flag.** "This DPIA [does / does not] require Article 36 prior consultation with the [ICO / CNIL / [DPA]] before processing commences, because [residual risk findings]."
5. **Counsel's bottom-line recommendation.** "We recommend the controller [proceed / proceed conditionally on the mitigations identified in Section 5 / do not proceed pending [specific changes]]."

## Section 1 — Description of the Processing (Art. 35(7)(a))

Sub-sections:

- **1.1 Nature of the processing** — what the system does, what processing operations are performed (collection, structuring, retrieval, AI inference, transmission, erasure).
- **1.2 Scope** — volume, number of data subjects affected, geographic reach, frequency.
- **1.3 Context** — the business or operational context, the relationship between controller and data subject, the data subject's reasonable expectations.
- **1.4 Purposes** — the business outcomes the processing serves; map each purpose to the Art. 6 lawful basis identified in Section 2.
- **1.5 Categories of personal data** — table format. Columns: Data category | Examples | Special category (Y/N) | Source.
- **1.6 Categories of data subjects** — list, flag vulnerable populations.
- **1.7 Recipients and processors** — table. Columns: Recipient | Role (controller/joint controller/processor/sub-processor) | Location | Lawful basis for sharing.
- **1.8 Retention** — period and justification per data category.
- **1.9 Cross-border transfers** — destination(s), legal mechanism, link to TIA appendix if relevant.
- **1.10 Privacy policy consistency check** — see below.

### Section 1.10 — Privacy Policy Consistency Check

Drift between the controller's published privacy policy and a newly-proposed processing is one of the most common (and most overlooked) failure modes in DPIA practice. The new feature is approved; the policy is not updated; the controller is now operating outside its own representations to data subjects and to regulators. A DPIA that does not surface this drift is incomplete.

Include this section as a short table cross-checking each material commitment in the controller's published privacy policy against the proposed processing. Common drift patterns to test for:

| Policy commitment | New processing reality | Consistent? |
|---|---|---|
| "We collect [X, Y, Z]" | New feature also collects [W] | 🟢 / 🟡 / 🔴 |
| "We don't sell personal data" | New feature shares with [advertising partner] — may be a "sale" under CCPA/CPRA | 🟢 / 🟡 / 🔴 |
| "We retain data for the lifetime of your account" | New feature retains derived inferences for [longer period] | 🟢 / 🟡 / 🔴 |
| "We don't use AI to make decisions about you" | New feature uses ML scoring with human review | 🟢 / 🟡 / 🔴 |
| "We don't transfer data outside [region]" | New sub-processor in [non-listed jurisdiction] | 🟢 / 🟡 / 🔴 |

Resolution rule: any amber or red entry must be addressed before deployment — either by amending the privacy policy (the usual answer) or by changing the processing to come back into line with the existing policy. Flag this in the executive summary if any drift is identified, and add the policy-update action to Section 5's mitigations table with the policy owner named.

If the controller's privacy policy is not available to counsel at the time of the DPIA, note this as an open question in Appendix B and recommend the check be completed before sign-off.

## Section 2 — Necessity and Proportionality (Art. 35(7)(b))

Reasoned legal analysis, not a checklist. Sub-sections:

- **2.1 Necessity** — is the processing necessary to achieve the purpose? Discussion of less-intrusive alternatives considered and rejected, with reasoning.
- **2.2 Lawful basis** — identify Art. 6(1) basis with full reasoning; Art. 9(2)/Art. 10 if applicable; LIA in narrative form if relying on legitimate interests; consent freely-given analysis if relying on consent in a power-imbalance context.
- **2.3 Data minimization** — Art. 5(1)(c) analysis of each data field.
- **2.4 Accuracy** — Art. 5(1)(d) analysis, particularly for AI/ML where model outputs become personal data.
- **2.5 Storage limitation** — Art. 5(1)(e) analysis tied to the retention periods in §1.8.
- **2.6 Purpose limitation** — Art. 5(1)(b) analysis, including function-creep risk.
- **2.7 Data subject rights** — feasibility of each Art. 12–22 right in the proposed system, with particular focus on Art. 21 (right to object), Art. 17 (erasure), Art. 22 (ADM).
- **2.8 Proportionality conclusion** — explicit statement: "The processing as designed is / is not / is conditionally proportionate to its purpose, because…"

## Section 3 — Consultation of Stakeholders (Art. 35(2), (9))

- **3.1 DPO consultation** — date(s) and substance of DPO consultation; if not yet conducted, flag as pending.
- **3.2 Data subject consultation** — if appropriate (e.g., employee representatives for workplace monitoring), describe; if not conducted, justify.
- **3.3 Other stakeholders** — CISO, business owner, ethics committee, ML governance forum.

## Section 4 — Risk Assessment (Art. 35(7)(c))

Sub-sections:

- **4.1 Risk identification methodology** — short paragraph stating that risks are assessed per the CNIL methodology aligned with WP29 guidance, using a 3×3 likelihood × severity matrix. Reference `risk-matrix.md` is the source of the rubric.
- **4.2 Risk register** — the master table. See format below.
- **4.3 Risk-by-risk narrative** — for each Medium or High residual risk, a paragraph of analysis explaining the threat scenario, the data subject impact, the controls relied on, and why the residual rating is what it is.
- **4.4 Risk matrix visualization** — a 3×3 grid table showing the distribution of inherent risks (one matrix) and residual risks (second matrix), with risk reference numbers placed in the relevant cells.

### Risk Register Table Format

The register is rendered by the `riskRegister` block; its columns are fixed by the builder and are, in order:

1. **ID** (R1, R2, R3, …) — manifest `id`
2. **Risk to data subjects** — the feared event, named concretely — manifest `risk`
3. **Inherent (L × S)** — manifest `likelihood` × `severity`
4. **Inherent** rating — *derived*, colour-coded
5. **Existing / planned controls** — manifest `controls`
6. **Residual (L × S)** — manifest `residualLikelihood` × `residualSeverity`
7. **Residual** rating — *derived*, colour-coded, with `*` on any High rating (Art. 36)

The ratings columns are **not** manifest inputs: the builder derives them from `risk-matrix.md`'s mapping. Stating `inherentRating` / `residualRating` in the manifest is optional and is treated as an assertion to be checked — a disagreement stops the build with exit 3. See the risk-rating gate in SKILL.md Step 5.

**Threat scenario and data subjects affected do not get register columns.** An eleven-column table is unreadable on A4 portrait, and both fields need prose rather than a cell. They belong in §4.3's risk-by-risk narrative, which must, for every Medium or High residual risk, name the threat actor and route, the categories of data subjects affected, the controls relied on, and why the residual rating lands where it does.

Colour coding per `risk-matrix.md`: Low = green (#C6EFCE), Medium = amber (#FFEB9C), High = red (#FFC7CE). The builder applies it; do not restate hex values in the manifest.

### 3×3 Matrix Visualization

Two stacked tables (Inherent, then Residual), emitted by two `matrix` blocks pointing at the same register. The builder plots the register's risk IDs into the cells and colours them from the same mapping that produced the ratings, so the register and the matrices cannot disagree. Each renders as:

```
              | Severity: Low | Severity: Medium | Severity: High |
Lik: High     |    [R#, R#]   |    [R#]          |    [R#, R#]    |
Lik: Medium   |               |    [R#]          |                |
Lik: Low      |    [R#]       |                  |                |
```

Color the cells per the matrix in `risk-matrix.md` (Low cells green, Medium cells amber, High cells red).

## Section 5 — Measures to Address Risks (Art. 35(7)(d))

For each Medium or High residual risk identified in Section 4, list:

- **Recommended additional mitigation** (specific, actionable)
- **Type** (Technical / Organizational / Contractual / Transparency)
- **Owner** (function or role, with placeholder for name)
- **Target implementation date** (placeholder for the controller to complete)
- **Effect on residual rating** (e.g., "expected to reduce R3 from Medium to Low likelihood")

End the section with the **Article 36 flag**:

> **Article 36 Prior Consultation:** Based on the residual risk assessment in Section 4, this DPIA [does / does not] require prior consultation with the [competent supervisory authority] under Article 36 GDPR. [Reasoning.]

The trigger is **any residual rating of High**, not only High likelihood × High severity — a Medium × High residual rates High and engages Art. 36 the same way. Where the register carries a starred row, this statement must say "does", the executive summary must carry the flag, and the cover-page `status` should normally be `Requires Art. 36 Prior Consultation`; the builder warns on stderr when a starred row is present and the status says otherwise.

## Section 6 — UK / EU Divergence Notes (where applicable)

Only include this section where the processing has UK scope. Use the analysis framework in `references/uk-divergence.md`. Address:

- Whether the analysis above applies equally to EU and UK GDPR scope.
- Where the UK position would permit a different conclusion (and whether the controller is taking advantage of it).
- For dual-jurisdiction deployments, an explicit statement that the higher standard applies unless carved out.

If the processing has only EU scope, omit Section 6 and renumber.

## Section 7 — Conclusion and Approval

- **7.1 Counsel's conclusion** — restating the bottom-line recommendation from the executive summary.
- **7.2 Open items requiring resolution before sign-off** — itemized list.
- **7.3 Review cadence** — when the DPIA must be revisited (default: annually, plus material change triggers: new sub-processor, model change >X%, change in applicable law, security incident).
- **7.4 Sign-off block** — signature lines for Controller, DPO/SRI, Counsel.

## Appendix A — Reference DPIAs and Authorities Cited

Bulleted list of:
- Statutes and recitals cited
- Supervisory authority guidance cited
- Published DPIA(s) used as analog, with URL and what they were used for
- Standards (ISO 31000, ISO 27701, NIST Privacy Framework) cited

Every entry carries its source-attribution tag; see `references/authorities.md` for which of the recurring authorities may go out as `[official publication]` and which ship UNVERIFIED. Where a run could not fetch anything, say so here in terms that distinguish it from having searched and found nothing.

## Appendix B — Open Questions and Follow-Up Items

Anything the user could not answer in intake, anything that materially affected the analysis, anything that requires further investigation before the DPIA is finalized.

## Appendix C — Revision History

Table: Version | Date | Author | Summary of changes. For the initial draft: "v1.0 — [date] — Counsel — Initial draft."

---

## Template → Manifest Mapping

The document is built by `scripts/build_dpia.js`, which owns everything on this list so that no run has to re-derive it: A4 portrait with 1100-twip margins, Calibri 11pt body, navy headings, the running "PRIVILEGED & CONFIDENTIAL" header, the "Page X of Y | reference | Prepared by Counsel" footer, the cover page and its status checkboxes, the register and matrix colour fills, and the likelihood × severity → rating mapping. None of that belongs in the manifest, and none of it should be reimplemented per run.

Author the manifest against this table, then run the builder:

| Template section | Manifest blocks |
|---|---|
| Cover page | Top-level fields — `systemName`, `date`, `version`, `controller`, `dpo`, `counsel`, `reference`, `status`. Emitted automatically; no block needed. |
| Article 36 conclusion | Top-level `art36` — `true` or `false`. **Required** wherever a `riskRegister` block exists. Checked against the register; exit 3 on disagreement. |
| Executive summary | `heading` (level 1) + `para` for the five numbered elements; `bullets` for the top residual risks |
| §1 Description, incl. §1.10 policy check | `heading` per sub-section + `para`; `table` for §1.5 data categories, §1.7 recipients, and the §1.10 consistency check |
| §2 Necessity and proportionality | `heading` + `para` throughout — prose, not tables |
| §3 Stakeholder consultation | `heading` + `para` |
| §4.2 Risk register | one `riskRegister` block (give it an `id` if the DPIA needs more than one) |
| §4.3 Risk-by-risk narrative | `heading` + `para` per Medium/High residual risk |
| §4.4 Matrix visualisation | two `matrix` blocks — `{"stage":"inherent"}` and `{"stage":"residual"}`, both with `source` set to the register's `id` |
| §5 Measures | `table` with the mitigation / type / owner / target date / effect columns |
| §6 UK–EU divergence | `heading` + `para`; omit the block entirely where the processing has no UK scope |
| §7 Conclusion and approval | `heading` + `para` + one `signature` block |
| Appendices A–C | `pagebreak`, then `heading` + `bullets` (A, B) and `table` (C) |

Run it, and read the exit code before delivering anything:

```bash
node scripts/build_dpia.js /home/claude/dpia_manifest.json
```

`0` built and validated; `1` manifest error; `2` validation did not pass; `3` risk-rating gate failure — the stated rating disagrees with the derived one, which is a scoring error to re-examine, never a number to overwrite. Deliver only on `0`. On exit 2, read `/mnt/skills/public/docx/SKILL.md` for the unpack-fix-repack procedure and re-run.
