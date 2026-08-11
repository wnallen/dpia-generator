# Australia Privacy Act — Privacy Impact Assessments

**Regime code:** `au-privacy` (overlay — Model A, thin). Australia has **no general
private-sector PIA mandate**; the mandatory instrument exists for Commonwealth agencies, and
the private-sector expectation is OAIC guidance plus an accelerating reform program that has
already changed the ADM and litigation landscape.

> **Sourcing status (2026-08-04):** oaic.gov.au and legislation.gov.au not fetched at build
> time; reform dates below corroborated by search `[web search — verify]`.

## 1. Where a PIA is actually required

- **Commonwealth agencies:** the Privacy (Australian Government Agencies — Governance) APP
  Code 2017 (recalled s. 12) requires a written PIA for all **high privacy risk projects**,
  with a published PIA register. Mandatory, but only for agencies. UNVERIFIED.
- **Private sector (APP entities):** no PIA obligation; the OAIC's **Guide to undertaking
  privacy impact assessments** is the methodology the regulator expects to see for
  high-risk projects, and APP 1's open-and-transparent-management obligation is the hook
  enforcement uses. UNVERIFIED.

Screen conclusion: `regulatorConclusions["au-privacy"].piaRequired` — true for agency /
agency-contractor projects that are high privacy risk; otherwise false with a Section 6 note
that the PIA is the prudential accountability record.

## 2. Reform overlay that changes DPIA answers now

- **Statutory tort for serious invasions of privacy** — in force from **2025-06-10**; a
  litigation-exposure line in the executive summary for intrusive processing. First judicial
  application: *Kurraba Group Pty Ltd v Williams* [2025] NSWDC 396 (7 October 2025,
  interlocutory injunction) — the tort is live, not theoretical. `[web search — verify]`
  (corroborated 2026-08-11)
- **APP 1.7 ADM transparency** — from **2026-12-10**, privacy policies must disclose
  computer programs used to make (or substantially and directly assist in making) decisions
  significantly affecting individuals — feed §1.10's policy consistency check. `[web search — verify]`
- **Children's Online Privacy Code** — OAIC must register by **2026-12-10**; the OAIC's
  **exposure draft** was consulted on to 2026-06-05 (on track); child-directed services get a
  placeholder row until the code is registered. `[web search — verify]` (corroborated 2026-08-11)
- Tranche-two reforms (a "fair and reasonable" test, possible direct PIA duties) remain
  pending — still no bill introduced as of 2026-08-11; check status; do not assert them.

## 3. Method and divergence

GDPR spine over-satisfies OAIC's ten-step guide. Deltas for Section 6: no special-category
consent regime (sensitive information has its own consent rules under APP 3); APP 8
accountability model for overseas disclosure (the discloser stays liable — different shape
from adequacy/SCCs, one §1.9 row); small-business exemption (under AUD 3M turnover) may take
the client out of the Act entirely — check scope first; employee-records exemption for
private employers (workplace monitoring may be outside the Act — the reverse of the EU
answer).

## 4. Privilege posture

Australian legal professional privilege covers in-house counsel acting in a legal capacity
with sufficient independence. Agency PIAs are register-listed (title, at minimum) and
FOI-exposed; private PIAs are OAIC-producible in an investigation. Standard two-document
practice for candid analysis.

## 5. Source notes

- Privacy Act 1988 + POLA Act 2024 — legislation.gov.au. UNVERIFIED.
- OAIC, Guide to undertaking privacy impact assessments; agency APP Code — oaic.gov.au. UNVERIFIED.
