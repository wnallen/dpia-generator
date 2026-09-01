# US State Comprehensive Privacy Laws — Harmonized Assessment Pattern

**Regime code:** `us-state` (standalone assessment module — Model B; thin). Covers the
Virginia-pattern **data protection assessment** obligation that most post-2021 state
comprehensive privacy laws share: Virginia (CDPA), Connecticut (CTDPA), Texas (TDPSA), Oregon,
Montana, Delaware, New Hampshire, New Jersey, Minnesota, Tennessee, Indiana, Kentucky,
Nebraska, Rhode Island, **Maryland** and successors. Colorado and California are carried by
their own modules (`us-co`, `us-ca`) because their regulators have issued prescriptive content
rules; the states here have statutes but (as of build) no equivalent rulemaking.

> **Sourcing status (2026-08-04; roster updated 2026-08-11):** statutes not fetched; the
> pattern below is `[model knowledge — verify]` and the state list changes session to session.
> Roster notes from the 2026-08-11 web-search pass (`[web search — verify]`):
>
> - **Maryland (MODPA, effective 2025-10-01)** was missing from earlier versions of this
>   roster and is **not** a clean Virginia-pattern member: assessments are required **per
>   processing activity, including for each algorithm used**, with stricter sensitive-data
>   and profiling rules and data-minimization duties beyond the pattern. Treat Maryland as
>   Colorado-grade prescriptive until its text is read; do not rely on the harmonized screen
>   alone.
> - **Kentucky:** the KCDPA's assessment obligations apply to processing occurring **on or
>   after 2026-06-01** (amended pre-effectiveness).
> - **Connecticut:** SB 1295 (2025) materially amends the CTDPA — most changes effective
>   2026-07-01, with **impact-assessment provisions applying to processing created or
>   generated on or after 2026-08-01**, an expanded sensitive-data list (incl. neural data)
>   and lower thresholds. Re-screen Connecticut against the amended text.
> - **Enacted 2026, not yet effective:** Oklahoma (SB 546, eff. 2027-01-01, requires DPAs);
>   Louisiana (SB 386, eff. 2027-01-01, requires DPAs); Vermont (S.71/Act 145, eff.
>   2028-01-01, requires DPAs **plus** a content-prescribed profiling impact assessment);
>   Alabama (HB 351, eff. 2027-05-01, **reportedly no formal DPA duty — verify against the
>   text before relying on the outlier**).
> - **2026-08-31 cross-check pass** (`[web search — verify]`): two roster questions were
>   resolved against search — **Idaho has no comprehensive privacy law** (breach-notification
>   and sectoral statutes only; it appears in some third-party trackers regardless, so treat
>   third-party state rosters as leads, never as sources), and **Nebraska's assessment duty
>   is confirmed** (**Neb. Rev. Stat. § 87-1116**, the NDPA's data-protection-assessment
>   section — Nebraska stays in the roster; some trackers wrongly report no duty). Same
>   pass: **Montana's threshold was lowered** to 25k consumers (15k + >25% sale revenue on
>   the alternative prong) effective 2025-10-01.
>
> Verify the specific state's statute and effective date before declaring the regime
> applicable.

## 1a. Applicability thresholds — screen these before the trigger test

An assessment duty attaches only where the state's law applies to the controller at all, and
the thresholds vary enough to change the answer (a 7× spread on the consumer-count prong).
Compact screen for the roster states; every row `[model knowledge — verify]` except where
tagged `[web search — verify]` from the 2026-08-31 pass. Verify the statute before declaring
a close-call state applicable — and treat near-threshold counts (within ~5%) as
applicability-likely, since compliance lead time runs ahead of the count.

| State | Main prong (consumers/yr) | Alternative prong |
|---|---|---|
| Virginia | 100k | 25k + >50% gross revenue from sale of PD |
| Connecticut | 100k (excl. payment-transaction data) | 25k + >25% revenue from sale — **thresholds lowered by SB 1295 from 2026-07-01; re-screen** |
| Texas | **No numeric threshold** — conducts business in TX or targets TX residents, processes or sells PD, and is not an SBA small business (small businesses still need consent to sell sensitive data) `[web search — verify]` | — |
| Oregon | 100k (excl. payment-transaction data) | 25k + ≥25% revenue from sale |
| Montana | 25k (lowered from 50k, eff. 2025-10-01) `[web search — verify]` | 15k + >25% revenue from sale `[web search — verify]` |
| Delaware | 35k | 10k + >20% revenue from sale |
| New Hampshire | 35k | 10k + >25% revenue from sale |
| New Jersey | 100k | 25k + **any** revenue from sale |
| Minnesota | 100k | 25k + >25% revenue from sale |
| Tennessee | >$25M revenue **and** 175k `[web search — verify]` | >$25M revenue **and** 25k + >50% revenue from sale |
| Indiana | 100k `[web search — verify]` | 25k + >50% revenue from sale `[web search — verify]` |
| Kentucky | 100k `[web search — verify]` | 25k + >50% revenue from sale `[web search — verify]` |
| Nebraska | **No numeric threshold** — Texas model, SBA small-business exemption `[web search — verify]` | — |
| Rhode Island | 35k | 10k + >20% revenue from sale |
| Maryland | 35k | 10k + ≥20% revenue from sale |

**No-assessment outliers (in effect, deliberately outside this module):** Utah (UCPA) and
Iowa impose **no** data-protection-assessment duty `[model knowledge — verify]` — a
processing whose only US-state footprint is Utah/Iowa residents raises no `us-state` limb
however large the scale, and the applicable-regimes table should say so rather than leave
the states unmentioned. (Alabama, not yet effective, reportedly joins them — see the roster
note above.)

**Exemption screen (all roster states):** employment-context data is exempt (contrast
California); non-profit, HIPAA and GLBA exemptions vary between entity-level and data-level
by state. Check the specific state's exemption architecture before declaring it applicable.

## 1. The shared pattern (Virginia CDPA as archetype)

- **Statute:** Va. Code § 59.1-580 (data protection assessments) and its analogs. UNVERIFIED.
- **Trigger (enumerated):** targeted advertising; sale of personal data; profiling with
  reasonably foreseeable risk of the enumerated harms; sensitive data; and a catch-all for
  processing presenting a heightened risk of harm.
- **Content:** identify and weigh benefits (controller, consumer, stakeholders, public)
  against potential risks to consumer rights, as mitigated by safeguards. No prescriptive
  element list — the Colorado Rule 8.04 structure over-satisfies every state in this group.
- **Engagement:** production to the state AG pursuant to a **civil investigative demand**;
  the assessment is exempt from public-records disclosure, and most statutes state that
  production does not waive privilege or work-product protection. UNVERIFIED per state.
- **Interoperability:** every statute in this group provides that a single assessment
  prepared for another law with reasonably comparable scope satisfies it.
- **HR carve-out:** all states in this group exempt employment-context data (contrast
  California).

## 2. How to run it

Do not produce fifty state limbs. Method:

1. Identify which states' thresholds the controller actually meets — run the §1a threshold
   screen (Texas and Nebraska apply with no numeric threshold at all; the consumer-count
   prong elsewhere spans 25k–175k), and name the no-assessment outliers (Utah, Iowa) in the
   applicable-regimes table where their residents are in scope.
2. Run the trigger screen once on the enumerated-activity pattern; note any state-specific
   deviation only if it changes the answer.
3. Satisfy the content with the GDPR-spine DPIA plus the Colorado-style benefits inventory
   and balancing verdict; one `complianceMap` (`"regime": "us-state"`) mapping the
   Virginia-pattern elements.
4. One row in the regulator-engagement table: *produced on AG demand; no filing; no
   consultation.*

Manifest conclusion key: `regulatorConclusions["us-state"].assessmentRequired`.

## 3. Privilege posture

Same as Colorado: drafted expecting production under a CID, with statutory non-waiver
language in most states (UNVERIFIED per state); keep candid strategic analysis in the
privileged spine document.
