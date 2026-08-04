# Colorado Privacy Act — Data Protection Assessment

**Regime code:** `us-co` (standalone assessment module — Model B). The instrument is a **data
protection assessment** ("DPA" in Colorado usage — do not confuse with an EU data processing
agreement), not an Article 35 DPIA. Also read `us-other-states.md`: Colorado is the most
prescriptive instance of the harmonized US-state pattern, and an assessment built to Colorado's
content list generally over-satisfies the sibling states.

> **Sourcing status (2026-08-04):** primary-source fetches (law.cornell.edu, justia.com,
> coag.gov) failed at build time (HTTP 403 via proxy). Every pinpoint below is **descriptive
> and UNVERIFIED** — it tells you which part of the source carries which proposition. Fetch the
> statute and rules before citing a sub-paragraph, and record verified pinpoints in
> `references/authorities.md`. Do not invent an enumeration to make a citation look precise.

## 1. Instrument and statute

- Colorado Privacy Act, **C.R.S. § 6-1-1309** (data protection assessments). `[model knowledge — verify]`
- Colorado Privacy Act Rules, **4 CCR 904-3, Part 8** (assessment scope, stakeholders, content,
  timing, retention) and **Part 9** (additional requirements for profiling assessments).
  `[model knowledge — verify]`
- Regulator: the **Colorado Attorney General** (Consumer Protection Section). There is no
  supervisory-authority consultation mechanism; engagement is by **production on request**.

## 2. Trigger test — enumerated activities, not a risk screen

A data protection assessment is required before processing that presents a **heightened risk of
harm to a consumer**, which the statute enumerates (C.R.S. § 6-1-1309(2), descriptive):

1. Processing for **targeted advertising**;
2. **Sale** of personal data;
3. **Profiling** where it presents a reasonably foreseeable risk of: unfair or deceptive
   treatment or unlawful disparate impact; financial or physical injury; a physical or other
   intrusion upon solitude or seclusion that would be offensive to a reasonable person; or
   other substantial injury;
4. Processing of **sensitive data** (race/ethnicity, religion, health, sexuality, citizenship
   status, genetic or biometric data, children's data).

Screen conclusion for the cover note: *"A Colorado data protection assessment [is / is not]
required because the processing [does / does not] involve [enumerated activity]."* This is a
category test — the WP29 nine-criteria reasoning does not substitute for it, though it usually
reaches the same answer on the same facts.

Note the CPA applies to controllers meeting its thresholds (Colorado residents' data volumes;
no revenue floor) and **exempts data processed in an employment context** — a workplace
monitoring DPIA that is squarely in GDPR scope may be entirely outside the CPA. Check scope
before declaring the regime applicable at all. `[model knowledge — verify]`

## 3. Required content — Rule 8.04 crosswalk against Art. 35(7)

Rule 8.04 prescribes an enumerated content list. Descriptive summary of the elements, mapped to
the GDPR spine (verify the exact sub-paragraph enumeration before citing it):

| Rule 8.04 element (descriptive) | Art. 35(7) analog | Delta vs. GDPR DPIA |
|---|---|---|
| Summary of the processing activity | (a) description | — |
| Categories of personal data and whether sensitive | (a) | — |
| Context of the processing; consumer relationship | (a) | — |
| Nature and operational elements (sources, tech used, names or categories of recipients/affiliates/processors) | (a) | More granular on operational detail |
| Core purposes and **benefits** of the processing to the controller, consumer, other stakeholders and the public | (b) necessity/proportionality | **Explicit benefits inventory — GDPR DPIAs rarely tabulate benefits; Colorado requires it** |
| Sources and nature of **risks of harm to consumers** | (c) risks | Harm taxonomy is consumer-protection framed |
| Measures and safeguards to reduce identified risks | (d) measures | — |
| Whether, weighing benefits against risks as mitigated, the risks are outweighed | (b)+(c) | **An explicit balancing verdict — state it in one sentence, like the §2.8 proportionality conclusion** |
| Relevant internal and external **stakeholders involved** and their contribution | Art. 35(2)/(9) analog | Documented contributor list, not consultation narrative |
| Approver, review dates, version | accountability | — |

Part 9 adds profiling-specific content (training data, logic, outputs, human involvement,
fairness/disparate-impact evaluation) for assessments triggered by profiling. `[model knowledge — verify]`

**Rendering:** produce the register and 3×3 matrix as usual — they satisfy the risk element —
and add a `complianceMap` block (`"regime": "us-co"`) mapping each Rule 8.04 element to the
DPIA section that carries it. The two elements GDPR practice under-produces (benefits
inventory; explicit balancing verdict) usually need their own short subsections.

## 4. Regulator engagement, timing, retention

- **Production:** the controller must make the assessment available to the AG **within 30 days
  of request**. There is no filing, no consultation, no approval. `[model knowledge — verify]`
- **Timing:** conducted **before** initiating the heightened-risk processing; reviewed and
  updated through the activity's lifecycle.
- **Retention:** for the duration of the processing plus at least **three years** after it
  concludes, in electronic transferable form. `[model knowledge — verify]`
- **Interoperability:** an assessment conducted for another jurisdiction's law (an Article 35
  DPIA) satisfies the CPA if **reasonably similar in scope and effect**; in practice, a GDPR
  DPIA plus the Colorado compliance map and the two delta subsections above. `[model knowledge — verify]`

Manifest conclusion key: `regulatorConclusions["us-co"].assessmentRequired` — the declared
answer to the §2 trigger screen.

## 5. Where the conclusion could materially differ from the GDPR spine

| Area | GDPR position | Colorado position | Effect |
|---|---|---|---|
| Trigger | Likely-high-risk screen + lists | Enumerated activities | Processing can require a Colorado assessment while failing the GDPR high-risk screen (routine targeted advertising), and vice versa (large-scale monitoring outside the enumerated list) |
| Employment data | Fully in scope; employees are a vulnerable category | Exempt (HR-context carve-out) | Workplace DPIAs may have no Colorado limb at all |
| High residual risk | Art. 36 stop-the-line consultation | No consultation mechanism; proceed at controller's risk, document the balancing verdict | The Art. 36 flag has no Colorado analog — never imply the AG "approves" |
| Consumer consent | Opt-in for special categories | Opt-in consent required for sensitive data; universal opt-out for sale/targeted ads | Different consent architecture; §2.2 needs a Colorado paragraph where sensitive data is processed |

## 6. Privilege posture

The assessment is **drafted expecting production**. The statute provides that disclosure to the
AG does not constitute a waiver of attorney-client privilege or work-product protection
`[model knowledge — verify]`, but a document written candidly for the privilege circle and a
document written for a regulator's file are different documents. Default posture for a
Colorado-triggered assessment:

- Produce the **producible record** without the privileged header (`"headerText": ""`,
  `"docTitle": "DATA PROTECTION ASSESSMENT"`): factual description, risks, safeguards,
  balancing verdict, compliance map.
- Where counsel's candid strategic analysis is needed (weaknesses, litigation exposure,
  positions considered and rejected), put it in the **separate privileged DPIA** on the GDPR
  spine, not in the producible record.
- The destination check in SKILL.md governs which version goes where; offer both when the
  processing has dual GDPR + Colorado scope.

## 7. Source notes

- C.R.S. § 6-1-1309 — Colorado General Assembly / official statute publisher. UNVERIFIED; capture URL and subsection enumeration on first fetch.
- 4 CCR 904-3 Rules, Parts 8–9 — Colorado Secretary of State / AG. UNVERIFIED; the Rule 8.04 element list above must be checked against the adopted text before any sub-paragraph is cited.
- Colorado AG shopping-list guidance and enforcement announcements — coag.gov. UNVERIFIED.
