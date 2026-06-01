# dpia-generator

A Claude skill that produces Data Protection Impact Assessments (DPIAs) under GDPR Article 35, anchored in supervisory authority guidance and structured to withstand DPO, regulator, and litigation review.

# Important

Every output from this Skill is a draft for attorney review — not legal advice, not a legal conclusion, not a substitute for a lawyer. This Skill may make review faster; it does not replace it.

This Skill does not represent the creator's legal positions: it is a tool. Where a Skill includes a checklist item, a suggested framework, a risk flag, or a characterization of case law or regulatory guidance, that is an aid to the reviewing attorney's own analysis, not a statement of the author's view of the law. The law in many of these areas is unsettled and evolving. The attorney using the Skill — not the Skill, and not the author — is responsible for the legal positions taken in their work product.

-----

## What It Does

Given a description of a new or modified personal data processing activity, this skill:

1. Screens whether a DPIA is **legally mandatory** (Art. 35(1)/(3)) or prudential (Art. 24 accountability)
2. Checks for **prior work** on the same processing to detect contradictions and enforce a severity floor
3. Pulls a **real published DPIA or DPA decision** as a reference analog (ICO, CNIL, EDPB, AEPD, Garante)
4. Assesses **necessity and proportionality** under Art. 35(7)(b), including lawful basis, LIA where required, and data subject rights
5. Identifies and scores risks using a **3×3 likelihood × severity matrix** (inherent → residual, post-controls)
6. Recommends **technical, organizational, contractual, and transparency mitigations** for Medium/High residual risks
7. Flags **Article 36 prior consultation** where any residual risk remains High
8. Notes **UK/EU GDPR divergence** (DUAA 2025, ICO mandatory DPIA list, UK transfer mechanisms)
9. Produces a formatted **Word .docx** with cover page, executive summary, seven sections, and three appendices

-----

## Trigger Phrases

The skill activates on any of the following (non-exhaustive):

- `"run a DPIA on [X]"`
- `"do a data protection impact assessment for [X]"`
- `"assess privacy risk for [X]"`
- `"we're launching [X] — is a DPIA required?"`
- `"is this Article 35 / high risk?"`
- A description of a new processing (tool, vendor, AI feature, monitoring system, data flow, cross-border transfer) paired with a privacy-risk or GDPR compliance question
- A vendor URL or system spec accompanied by a question about GDPR, ICO/CNIL/EDPB expectations, or DPO obligations

> **Note:** The skill also triggers when the user does *not* say “DPIA” but the context clearly involves a high-risk processing requiring one.

-----

## Intake: What the Skill Needs

The skill collects the following before drafting. Provide what you have; it will ask only for what is missing.

|#|Item                                                                           |Why It Matters                                                             |
|-|-------------------------------------------------------------------------------|---------------------------------------------------------------------------|
|1|System / activity name and purpose                                             |Frames the Art. 35 screen and proportionality analysis                     |
|2|Categories of personal data (incl. Art. 9/10 special-category, children’s data)|Drives severity scoring and lawful-basis selection                         |
|3|Categories of data subjects (incl. vulnerable populations)                     |Affects severity ceiling and data subject rights analysis                  |
|4|Recipients, processors, sub-processors                                         |Required for transfer and contractual controls analysis                    |
|5|Retention period and justification                                             |Art. 5(1)(e) storage limitation                                            |
|6|Cross-border transfers and adequacy / DPF status                               |Triggers SCCs / TIA analysis                                               |
|7|Automated decision-making or profiling (Art. 22)                               |Mandatory DPIA trigger                                                     |
|8|AI/ML involvement; vendor-side training on customer data                       |Bespoke risk identification for AI processing                              |
|9|Jurisdictional scope (EU GDPR, UK GDPR, or both)                               |Determines which DPA guidance controls and whether UK divergence is flagged|

If the user declines to provide a detail, the skill proceeds on stated assumptions and flags all gaps as open questions in Appendix B.

-----

## Output Document Structure

```
COVER PAGE
  — "DATA PROTECTION IMPACT ASSESSMENT"
  — System name, version, date
  — PRIVILEGED & CONFIDENTIAL — ATTORNEY WORK PRODUCT
  — Controller / DPO / counsel of record
  — Status: Draft / Under DPO Review / Approved

EXECUTIVE SUMMARY (1 page)
  — Processing in one sentence
  — Art. 35 triggering conclusion (mandatory / prudential)
  — Top 3–5 residual risks
  — DPO / supervisory authority consultation flag
  — Counsel's bottom-line recommendation

SECTION 1  — Description of Processing (Art. 35(7)(a))
             incl. §1.10 Privacy Policy Consistency Check
SECTION 2  — Necessity and Proportionality (Art. 35(7)(b))
SECTION 3  — Consultation of Stakeholders (Art. 35(2), (9))
SECTION 4  — Risk Assessment (Art. 35(7)(c))
             Risk register table + per-risk narrative + 3×3 matrix
SECTION 5  — Measures to Address Risks (Art. 35(7)(d))
SECTION 6  — UK / EU Divergence Notes (where applicable)
SECTION 7  — Conclusion and Approval

APPENDIX A — Reference DPIAs and authorities cited
APPENDIX B — Open questions and follow-up items
APPENDIX C — Revision history
```

**File naming:** `DPIA_[SystemName]_[YYYY-MM-DD].docx`  
**Output path:** `/mnt/user-data/outputs/`

-----

## Risk Matrix

The skill uses a **3×3 likelihood × severity matrix** aligned with the CNIL PIA methodology and WP29 guidance.

- **Likelihood** is scored from the attacker’s perspective: capability, motivation, and opportunity given the processing environment
- **Severity** is scored from the **data subject’s perspective**: CNIL’s Negligible / Limited / Significant / Maximum scale maps to Low / Medium / High
- Each risk is scored **inherent** (before controls) and **residual** (after controls)
- A prior High residual rating cannot regress to Low in a refresh without documented justification

|Residual Rating|Required Action                                                                                       |
|---------------|------------------------------------------------------------------------------------------------------|
|**High**       |Art. 36 prior consultation flag — processing cannot proceed without supervisory authority consultation|
|**Medium**     |Internal DPO consultation + defined review cadence                                                    |
|**Low**        |Proceed; document in privacy register                                                                 |

-----

## Reference Analog Requirement

Every DPIA produced by this skill is anchored in a **real published DPIA or DPA decision** for a comparable processing type. The skill consults a curated catalog first, then web-searches if no catalog match exists. Acceptable analogs, in order of preference:

1. DPA-published sample DPIAs (ICO, CNIL, EDPB)
1. DPA enforcement decisions and opinions on the processing type
1. Published DPIAs from regulated entities (police, NHS, government departments)
1. EDPB guidelines and opinions

Analogs are cited in Appendix A. Every departure from the analog’s reasoning is flagged and explained.

-----

## Citation Tagging

All citations carry source attribution tags to indicate reliability level:

|Tag                         |Source                                                   |
|----------------------------|---------------------------------------------------------|
|`[regulator site]`          |Fetched directly from ico.org.uk, cnil.fr, edpb.europa.eu|
|`[official publication]`    |EUR-Lex, national gazettes, court registries             |
|`[web search — verify]`     |Surfaced via web search; needs primary-source check      |
|`[model knowledge — verify]`|Recalled from training data; highest fabrication risk    |
|`[user provided]`           |Supplied by the user (URL, internal document, prior DPIA)|

-----

## Privilege and Distribution

The DPIA is produced as **attorney-work-product** by default and carries a `PRIVILEGED & CONFIDENTIAL` header. Before delivering a final document, the skill checks distribution intent:

- **Inside the privilege circle** (DPO, in-house legal, outside counsel): full privileged version with counsel’s reasoning exposed
- **Outside the privilege circle** (board pack, customer trust page, supervisory authority filing): the skill will offer both a privileged version and a sanitized version and explain the distinction

The skill will not silently apply a privilege header to a document headed for public distribution.

-----

## Article 36 Filing Gate

If residual risk findings trigger an Art. 36 prior consultation, the skill will confirm before producing a “ready-to-file” version — filing makes the DPIA part of the supervisory record. The skill does not submit to supervisory authorities on the user’s behalf.

-----

## Reference Files

The skill reads these supporting files as needed:

|File                           |Contents                                                                                                       |
|-------------------------------|---------------------------------------------------------------------------------------------------------------|
|`references/legal-framework.md`|Art. 35/36 text, Recital 84/90/91, WP248rev01 nine criteria, EDPB Recommendations 01/2020, mandatory DPIA lists|
|`references/risk-matrix.md`    |3×3 matrix rubrics, CNIL severity scale, inherent → residual transition, Risk Quality Standards                |
|`references/published-dpias.md`|Curated catalog of real-world DPIAs and DPA decisions with URLs                                                |
|`references/uk-divergence.md`  |DUAA 2025 changes, UK GDPR / EU GDPR divergences material to DPIAs                                             |
|`references/output-template.md`|Exact .docx section structure, table layouts, cover-page boilerplate                                           |

-----

## Constraints and Design Principles

- **Never invent facts** about the processing — gaps are documented as open questions, not guessed
- **Never invent citations** — every DPA decision cited must exist; the skill web-fetches to verify before citing
- **Honest scoring** — a DPIA where every residual risk is Low is a marketing document; the skill will not produce one
- **Specific risks, not categories** — “data breach” is not a DPIA risk; the skill identifies concrete feared events tied to the specific processing design
- **Living document** — every DPIA concludes with a defined review cadence and conditions that trigger an off-cycle review

-----

## Example Invocations

```
Run a DPIA on our new AI-powered HR screening tool — vendors are Workday and HireVue.

We're launching a biometric time-and-attendance system in our Lyon warehouse. Is a DPIA required?

https://vendor.com/terms — we're considering this SaaS tool for processing employee health data. Do we need a DPIA?

Assess privacy risk for a real-time facial recognition system at our London office entrance.

We're transferring EU customer data to a US sub-processor. I need a DPIA before we go live.
```

-----

*Skill location:* `/mnt/skills/user/dpia-generator/SKILL.md`
