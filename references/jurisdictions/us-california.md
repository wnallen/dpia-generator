# California CCPA/CPRA — Risk Assessments (CPPA Regulations)

**Regime code:** `us-ca` (standalone assessment module — Model B). The instrument is a **risk
assessment** under the CCPA as amended by the CPRA, governed by the California Privacy
Protection Agency's regulations approved by the Office of Administrative Law on
**2025-09-23** and effective **2026-01-01**. This is the only regime in this skill with a
**scheduled filing obligation** — the regulator does not merely demand on request; summaries
and attestations are submitted on a calendar.

> **Sourcing status (2026-08-04; re-corroborated 2026-08-11):** cppa.ca.gov returns HTTP 403
> to the fetch tool. Web-search corroboration passes **confirmed the risk-assessment article
> structure** — 11 CCR **Article 10, §§ 7150–7157 (§ 7150 when a risk assessment is required;
> § 7152 risk-assessment requirements)** — plus the OAL approval (2025-09-23), effective date
> (2026-01-01), first filing deadline (2028-04-01), and the three-year review cycle; those
> carry `[web search — verify]`. Additional mechanics corroborated 2026-08-11: **pre-existing
> significant-risk activities must be assessed by 2027-12-31**, and **ADMT substantive
> compliance begins 2027-01-01**. No litigation or injunction affecting the risk-assessment /
> ADMT regulations was found as of 2026-08-11 — the regs are operative as written. The
> **enumerated content list below is still descriptive**: corroborated in outline, not read
> verbatim. Fetch the regulations before citing a sub-paragraph.

## 1. Instrument and statute

- Cal. Civ. Code § 1798.185(a)(15) (CPRA rulemaking mandate for risk assessments and
  cybersecurity audits). `[model knowledge — verify]`
- CPPA regulations, risk-assessment article — **11 CCR Article 10, §§ 7150 (trigger) and 7152
  (content)**, plus the ADMT article; finalized September 2025. `[web search — verify]`
- Regulator: the **California Privacy Protection Agency**; the California AG retains parallel
  enforcement of the CCPA.

## 2. Trigger test — enumerated "significant risk" activities

A risk assessment is required before processing that presents **significant risk to consumers'
privacy**, enumerated in the regulations (descriptive):

1. **Selling or sharing** personal information;
2. Processing **sensitive personal information** (with limited employment-administration
   carve-outs);
3. Using **ADMT for a significant decision** concerning a consumer (financial/lending,
   housing, education, employment or independent-contracting opportunities or compensation,
   healthcare services) — note the final regulations narrowed earlier drafts of
   behavioral-advertising and "extensive profiling" triggers;
4. Certain **training** of ADMT / facial-recognition / identity-verification technology on
   personal information. `[model knowledge — verify]`

Note "consumer" includes employees and job applicants in California — the CCPA has **no**
HR carve-out (unlike Colorado and the other states). A workplace ADMT deployment can be
squarely in scope.

## 3. Required content — crosswalk against Art. 35(7)

Descriptive summary of the required elements (verify enumeration before citing):

| CCPA regs element (descriptive) | Art. 35(7) analog | Delta vs. GDPR DPIA |
|---|---|---|
| Purpose of the processing (specific, not generic) | (b) | — |
| Categories of PI/SPI; operational elements (collection method, sources, retention, recipients, number of consumers, technology used) | (a) | Operational detail is enumerated |
| **Benefits** to the business, the consumer, other stakeholders, the public | (b) | Explicit benefits inventory (as Colorado) |
| **Negative impacts** to consumers' privacy, with sources of those impacts | (c) | Impact taxonomy is enumerated in the regs |
| **Safeguards** planned to address the negative impacts | (d) | — |
| Whether the business will **initiate the processing** given the balance | (b)+(c) | Explicit go/no-go statement by the business |
| Contributors, reviewer/approver (highest-ranking responsible executive), dates | Art. 35(2) analog | Named executive approval |
| ADMT-triggered assessments: logic, outputs, human involvement, accuracy/nondiscrimination evaluation | Art. 35(7)(c)+(d) | Overlaps WP251/AI-Act ground |

**Rendering:** GDPR register + matrices carry the risk analysis; add a `complianceMap`
(`"regime": "us-ca"`) plus, where missing from the spine, the benefits inventory, the
negative-impacts framing, and the executive go/no-go statement.

## 4. Regulator engagement, timing, retention

- **Filing:** the first submission to the CPPA is due **2028-04-01**, covering assessments
  conducted in 2026–2027; annually thereafter. What is filed is an **attestation plus summary
  information**, not the full assessment; the full assessment must be produced to the CPPA or
  AG **on request**. `[web search — verify]`
- **Timing:** assessment before initiating the triggering processing; **review and update at
  least every three years** or upon material change. `[web search — verify]`
- **Retention:** as long as the processing continues plus a prescribed tail (recalled five
  years — verify).
- **Interoperability:** an assessment prepared for another law (a GDPR DPIA, a Colorado DPA)
  may satisfy the CCPA requirement if it meets the regs' content requirements — in practice,
  add the compliance map and the California-specific elements. `[model knowledge — verify]`

Manifest conclusion key: `regulatorConclusions["us-ca"].assessmentRequired`.

## 5. Where the conclusion could materially differ

| Area | GDPR position | California position | Effect |
|---|---|---|---|
| Employees | In scope; DPIA common for monitoring | In scope (no HR exemption) | Unlike Colorado, a workplace tool needs the California limb |
| ADMT for significant decisions | Art. 22 default prohibition with exceptions | Permitted with pre-use notice, opt-out and access rights (regime of rights, not prohibition) | A solely-automated decision lawful in California may still fail Art. 22 for EU scope — apply the higher standard unless carved out |
| High residual risk | Art. 36 consultation | No consultation; the business states go/no-go and files attestation | Never imply CPPA pre-approval; the go/no-go is the controller's own recorded decision |
| Filing | None (internal document) | Scheduled attestation + summary; full assessment on demand | Drafting posture: the summary will be regulator-read by default |

## 6. Privilege posture

The regulations' submission design (attestation + summary filed; full assessment on demand)
means the assessment must be **drafted expecting regulator eyes**. California does not have a
statutory non-waiver clause equivalent to Colorado's recalled provision — treat the producible
record and counsel's candid analysis as separate documents, per the destination check:
producible record with `"headerText": ""`; privileged strategic analysis in the GDPR-spine
DPIA or a separate memo. `[model knowledge — verify]`

## 7. Source notes

- CPPA final regulations text and OAL approval — cppa.ca.gov. UNVERIFIED; capture the article
  and section numbers on first fetch (risk assessments; ADMT; cybersecurity audits are a
  separate article with separate phase-in).
- CPPA announcement of 2025-09-23 approval — cppa.ca.gov/announcements. `[web search — verify]`
- Cal. Civ. Code §§ 1798.100 et seq. — leginfo.legislature.ca.gov. UNVERIFIED.
