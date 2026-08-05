# Singapore PDPA — DPIAs (PDPC Guide)

**Regime code:** `sg-pdpa` (overlay — Model A, thin). Singapore has no general DPIA mandate,
but the PDPA makes an assessment a **statutory precondition** for two consent workarounds,
and the PDPC has published a full DPIA methodology it expects organisations to follow for
high-risk projects.

> **Sourcing status (2026-08-04):** the PDPC's *Guide to Data Protection Impact Assessments*
> (14 September 2021) URL was surfaced by search (`pdpc.gov.sg/-/media/Files/PDPC/PDF-Files/
> Other-Guides/DPIA/Guide-to-Data-Protection-Impact-Assessments-14-Sep-2021.pdf`)
> `[web search — verify]` — fetch before citing. Statutory provisions below are
> `[model knowledge — verify]`.

## 1. When an assessment is legally required (narrow) vs. expected (broad)

**Required** — the PDPA conditions these on a prior assessment of adverse effect:

1. **Deemed consent by notification** (recalled s. 15A): the organisation must first assess
   that the processing is not likely to have an adverse effect on the individual.
2. **Legitimate interests exception** (First Schedule, Part 3): requires an assessment that
   the legitimate interest outweighs any adverse effect, plus disclosure of reliance on the
   exception.

**Expected** — the PDPC's 2021 Guide recommends DPIAs for any project likely to pose high
risk; accountability-obligation enforcement has cited absent risk assessment as an
aggravating factor. UNVERIFIED.

Screen conclusion: `regulatorConclusions["sg-pdpa"].assessmentRequired` — true where either
statutory hook applies; where only the prudential expectation applies, declare false and say
so in Section 6 (the assessment is then the accountability record the PDPC would ask for).

## 2. Content and method

The PDPC Guide's methodology (identify personal data flows → identify risks → assess →
mitigate → review) is a subset of the GDPR spine; the 3×3 matrix is compatible. Deltas:

- Consent-centric statute with a deemed-consent architecture; no special-category regime —
  sensitivity goes to the reasonableness and protection standard, not to a separate basis.
- **Transfers:** the transfer limitation obligation requires comparable protection abroad
  (contractual clauses, BCRs, certification — APEC CBPR recognized). One §1.9 row.
- **Do Not Call** and NRIC-number guidance are Singapore-specific compliance flags where
  marketing or national ID numbers appear.

## 3. Regulator engagement and privilege

No consultation or filing; the PDPC can require production in an investigation, and the two
statutory assessments are effectively producible-by-design (they are the legal basis for the
processing). Singapore recognizes legal professional privilege including, by statute, for
in-house legal counsel (Evidence Act amendments) — the standard two-document practice still
applies for the statutory assessments. UNVERIFIED.

## 4. Source notes

- PDPA 2012 (as amended 2020) — sso.agc.gov.sg. UNVERIFIED.
- PDPC, Guide to DPIAs (2021) — URL above. `[web search — verify]`.
- PDPC advisory guidelines on the legitimate interests exception and deemed consent. UNVERIFIED.
