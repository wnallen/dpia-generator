# Output Template — Exact Structure of the DPIA .docx

Read this before writing the Node.js script in Step 5. The structure below is the constant across all DPIAs produced by this skill; only the narrative content changes per processing activity.

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

Columns (in this order):
1. **Ref** (R1, R2, R3, …)
2. **Feared event** (short)
3. **Threat scenario** (brief)
4. **Data subjects affected**
5. **Inherent likelihood** (L/M/H)
6. **Inherent severity** (L/M/H)
7. **Inherent rating** (L/M/H, color-coded)
8. **Existing / planned controls** (brief)
9. **Residual likelihood** (L/M/H)
10. **Residual severity** (L/M/H)
11. **Residual rating** (L/M/H, color-coded)

Color coding per `risk-matrix.md`: Low = green (#C6EFCE), Medium = amber (#FFEB9C), High = red (#FFC7CE).

### 3×3 Matrix Visualization

Two side-by-side or stacked tables (Inherent | Residual), each formatted as:

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

## Appendix B — Open Questions and Follow-Up Items

Anything the user could not answer in intake, anything that materially affected the analysis, anything that requires further investigation before the DPIA is finalized.

## Appendix C — Revision History

Table: Version | Date | Author | Summary of changes. For the initial draft: "v1.0 — [date] — Counsel — Initial draft."

---

## docx-js Implementation Notes

Per `/mnt/skills/public/docx/SKILL.md`:

- US Letter page size: `width: 12240, height: 15840`, 1-inch margins (1440 DXA).
- Default font: Arial, 12pt (size 24 in docx-js units).
- Override Heading 1, Heading 2, Heading 3 styles with explicit IDs.
- Tables: use `WidthType.DXA`, set `columnWidths` array and individual cell `width`. Use `ShadingType.CLEAR` (never SOLID).
- Risk matrix cells: use the hex fills from `risk-matrix.md`.
- Header on every page: define `Header` object in section properties.
- Footer with page number: use `PageNumber.CURRENT` and `PageNumber.TOTAL_PAGES` in the footer paragraph.
- After creating, validate with `/mnt/skills/public/docx/scripts/office/validate.py`.

Save the script as `create_dpia.js` in `/home/claude/` (it does not need to persist between conversations). Per-DPIA scripts are cheaper to write than to maintain a parameterized generator — the narrative is bespoke per DPIA anyway.
