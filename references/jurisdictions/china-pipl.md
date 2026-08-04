# China PIPL — Personal Information Protection Impact Assessment (PIPIA)

**Regime code:** `cn-pipl` (standalone assessment module — Model B). The instrument is the
**PIPIA** under Articles 55–56 of the Personal Information Protection Law (2021). The trigger
is an enumerated activity list, the content requirement is short and statutory, the report has
a **three-year retention rule**, and — uniquely in this skill — a PIPIA report is **filed with
the regulator as part of the SCC route for cross-border transfers**. The authoritative text is
Chinese; treat every English rendering, including this module, as a working translation.

> **Sourcing status (2026-08-04):** primary sources not fetched at build time (403 via proxy);
> the enumerations below are `[model knowledge — verify]`, corroborated in outline by
> secondary sources via search. The CAC's cross-border rules were materially relaxed in March
> 2024 and continue to move — re-verify thresholds on every China-scope run.

## 1. Instrument and statute

- **PIPL (2021), Art. 55:** PIPIA required **in advance** for: (1) processing **sensitive
  personal information**; (2) using personal information for **automated decision-making**;
  (3) **entrusting** processing to another party; (4) **providing** personal information to
  another handler; (5) **publicly disclosing** personal information; (6) **transferring
  personal information abroad**; and (7) other processing with a **major impact on
  individuals' rights and interests**. UNVERIFIED.
- **Art. 56 — required content:** (1) whether the purpose and method are lawful, legitimate
  and **necessary**; (2) the **impact on individuals' rights and interests** and the security
  risks; (3) whether the protective measures are lawful, effective and **commensurate with
  the degree of risk**. The report and processing records must be **retained at least three
  years**. UNVERIFIED.
- **Methodology standard:** GB/T 39335-2020, *Guidance for personal information security
  impact assessment* — the national standard operationalizing the assessment; a severity ×
  likelihood method compatible with this skill's 3×3 matrix. Note also the 2025 national
  standard on sensitive-PI security requirements. Both UNVERIFIED.
- Regulator: the **Cyberspace Administration of China (CAC)**, with sectoral regulators.

## 2. Trigger test

Run the Art. 55 list as a category screen. Practical notes:

- **"Sensitive personal information"** (Art. 28) is broader than Art. 9 GDPR: it is any PI
  which, if leaked or misused, could easily harm dignity or personal/property safety —
  expressly including biometrics, religion, specific identity, medical/health, **financial
  accounts**, **location tracking**, and any PI of **minors under 14**. Much ordinary
  commercial data (payment data, precise location) is sensitive in China while ordinary under
  GDPR.
- Almost any vendor relationship (entrustment) or intra-group sharing (provision to another
  handler) triggers a PIPIA on its face — scope the assessment to the processing under
  review, not the entire vendor estate.
- Separate consent requirements attach to several of the same triggers (sensitive PI,
  provision, disclosure, export); note them in §2.2 but do not conflate consent with the
  assessment obligation.

Screen conclusion: `regulatorConclusions["cn-pipl"].pipiaRequired`.

## 3. Content — crosswalk

| Art. 56 element | Art. 35(7) analog | Delta |
|---|---|---|
| Lawfulness, legitimacy, **necessity** of purpose and method | (b) | Necessity is expressly statutory; the §2 analysis carries it |
| Impact on individuals' rights/interests; security risks | (c) | The register + matrix satisfy it; GB/T 39335 supplies the native method |
| Measures lawful, effective, **commensurate with risk** | (d) | Proportionality-of-controls statement — add one sentence per High/Medium residual |

The GDPR spine over-satisfies Art. 56. What the spine does **not** carry:

- **Cross-border mechanism analysis (Art. 38–40):** the export trigger requires one of the
  CAC routes — **CAC security assessment** (mandatory above volume thresholds or for
  important data / CIIOs), **Chinese SCCs with filing** (PIPIA report filed with the
  provincial CAC as part of the filing package), or **certification**. Thresholds were
  relaxed by the March 2024 cross-border flow provisions and free-trade-zone negative lists;
  re-verify current numbers every run. UNVERIFIED.
- **Separate-consent inventory** where consent is the basis for a triggering activity.
- **Localization check:** CIIOs and above-threshold handlers must store domestically absent
  a passed security assessment.

## 4. Regulator engagement

- **No prior-consultation mechanism** for the PIPIA itself; but on the **SCC export route the
  PIPIA report is part of the CAC filing** — a production-by-design posture.
- **Retention:** report + records ≥ 3 years (gate this into §7.3's review cadence).
- Regulator-engagement row: *"PIPIA retained ≥3 years; report filed with provincial CAC where
  the SCC export route is used; producible in CAC supervision."*

## 5. Where the conclusion could materially differ

| Area | GDPR position | PIPL position | Effect |
|---|---|---|---|
| Sensitive data | Art. 9 closed list | Harm-based open definition incl. financial accounts, location, under-14s | Data ordinary in the EU limb can be sensitive in the China limb — score severity per regime |
| Transfers | SCC + TIA self-assessment | State-gated routes; possible mandatory CAC security assessment | The China leg can be a hard blocker where the EU leg is a paperwork exercise |
| ADM | Art. 22 rights | Art. 24: transparency, no unreasonable differential treatment (price discrimination), opt-out of personalized push | Algorithmic pricing risks are China-specific register entries |
| Government access | Schrems II analysis of the destination | The assessment is of processing *in* China; PRC data-security and state-access law is context, not a "transfer risk" | Frame carefully — this document may itself be read in China |

## 6. Privilege posture

**China does not recognize legal professional privilege in the common-law sense.** Lawyers
owe confidentiality duties, but state organs can compel disclosure, and in-house communications
have no privileged status. Assume anything written for the China limb is **compellable and, on
the SCC route, filed**. Hard rules:

- Never place counsel's candid weakness analysis, litigation-exposure discussion, or
  negotiating posture in the PIPIA record. Two documents, always: the PIPIA record
  (`"headerText": ""`), and the privileged analysis held outside China scope.
- Assume the record may be reviewed by the CAC in Chinese; record translation status.

## 7. Source notes

- PIPL (2021) — npc.gov.cn (Chinese authoritative text; unofficial translations vary on Art. 55–56 wording). UNVERIFIED.
- GB/T 39335-2020 — SAC national standard. UNVERIFIED; paywalled distribution is common — record how the text was obtained.
- CAC: Measures on Security Assessment (2022); SCC Measures (2023); Provisions on Promoting and Regulating Cross-Border Data Flows (March 2024). UNVERIFIED; thresholds move — re-verify per run.
