# China PIPL — Personal Information Protection Impact Assessment (PIPIA)

**Regime code:** `cn-pipl` (standalone assessment module — Model B). The instrument is the
**PIPIA** under Articles 55–56 of the Personal Information Protection Law (2021). The trigger
is an enumerated activity list, the content requirement is short and statutory, the report has
a **three-year retention rule**, and — uniquely in this skill — a PIPIA report is **filed with
the regulator as part of the SCC route for cross-border transfers**. The authoritative text is
Chinese; treat every English rendering, including this module, as a working translation.

> **Sourcing status (2026-08-04; supplemented 2026-08-11):** primary sources return HTTP 403
> to the fetch tool. A web-search corroboration pass on 2026-08-04 **confirmed Arts. 55 and 56
> (verbatim structure), the ≥3-year report retention, and GB/T 39335-2020**; those carry
> `[web search — verify]`. The CAC's cross-border rules were materially relaxed in March 2024
> and continue to move — those thresholds stay `[model knowledge — verify]` and must be
> re-verified on every China-scope run. A 2026-08-11 pass added the 2025–2026 instruments in
> §7a below — notably the **compliance-audit Measures (effective 2025-05-01)** and the
> **cross-border certification Measures (effective 2026-01-01)**.

## 1. Instrument and statute

- **PIPL (2021), Art. 55:** PIPIA required **in advance** for: (1) processing **sensitive
  personal information**; (2) using personal information for **automated decision-making**;
  (3) **entrusting** processing to another party; (4) **providing** personal information to
  another handler; (5) **publicly disclosing** personal information; (6) **transferring
  personal information abroad**; and (7) other processing with a **major impact on
  individuals' rights and interests**. `[web search — verify]` (Art. 55 trigger list confirmed 2026-08-04.)
- **Art. 56 — required content:** (1) whether the purpose and method are lawful, legitimate
  and **necessary**; (2) the **impact on individuals' rights and interests** and the security
  risks; (3) whether the protective measures are lawful, effective and **commensurate with
  the degree of risk**. The report and processing records must be **retained at least three
  years**. `[web search — verify]` (Art. 56 content and the ≥3-year retention confirmed 2026-08-04.)
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

## 7a. 2025–2026 instruments (corroborated by web search 2026-08-11 — all `[web search — verify]`)

- **Compliance-audit Measures:** CAC Measures for the Administration of Personal Information
  Protection Compliance Audits (promulgated 2025-02-14, **effective 2025-05-01**, with an
  audit-guidelines annex): handlers processing PI of **>10 million individuals** must audit
  at least every two years; regulator-ordered audits on significant risk or breaches
  affecting >1M individuals (>100k for sensitive PI). Audit findings interact with the
  PIPIA record — note the cadence in §7.3-style review planning.
- **Certification export route completed:** CAC + SAMR Measures for Certification of
  Cross-Border Personal Information Transfer, issued 2025-10-14, **effective 2026-01-01** —
  the third PIPL transfer pathway is now operational; detailed technical specs still pending.
- **GB/T 45574-2025** — Security Requirements for Processing of Sensitive Personal
  Information (recommended standard, **effective 2025-11-01**); narrows the working sensitive
  list vs. GB/T 35273-2020 (removes ID-card number per se, marital status,
  deposit/transaction records). Use alongside Art. 28's harm-based definition in §2.
- **Cybersecurity Law amendment** adopted 2025-10-28, **effective 2026-01-01** — AI
  provisions, higher penalties, express alignment with PIPL. Context for the security limb.
- **FTZ negative lists are proliferating, not consolidating** (Shanghai/Lin-gang Feb 2025,
  Beijing May 2025, Jiangsu, Guangxi, ~7 provinces by Aug 2025); CAC published cross-border
  FAQs (2025-04-09 and mid-2025) encouraging more. Check the applicable FTZ list per run.

## 7. Source notes

- PIPL (2021) — npc.gov.cn (Chinese authoritative text; unofficial translations vary on Art. 55–56 wording). `[web search — verify]` (Arts. 55–56 and 3-year retention confirmed 2026-08-04; fetch the authoritative text for verbatim wording).
- GB/T 39335-2020 — SAC national standard. `[web search — verify]` (existence/number confirmed 2026-08-04); paywalled distribution is common — record how the text was obtained.
- CAC: Measures on Security Assessment (2022); SCC Measures (2023); Provisions on Promoting and Regulating Cross-Border Data Flows (March 2024). UNVERIFIED; thresholds move — re-verify per run.
- 2025–2026 instruments listed in §7a — all `[web search — verify]` (corroborated 2026-08-11); fetch each before citing a pinpoint.
