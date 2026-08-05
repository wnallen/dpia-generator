# US State Comprehensive Privacy Laws — Harmonized Assessment Pattern

**Regime code:** `us-state` (standalone assessment module — Model B; thin). Covers the
Virginia-pattern **data protection assessment** obligation that most post-2021 state
comprehensive privacy laws share: Virginia (CDPA), Connecticut (CTDPA), Texas (TDPSA), Oregon,
Montana, Delaware, New Hampshire, New Jersey, Minnesota, Tennessee, Indiana, Kentucky,
Nebraska, Rhode Island and successors. Colorado and California are carried by their own
modules (`us-co`, `us-ca`) because their regulators have issued prescriptive content rules;
the states here have statutes but (as of build) no equivalent rulemaking.

> **Sourcing status (2026-08-04):** statutes not fetched at build time; the pattern below is
> `[model knowledge — verify]` and the state list changes session to session — new states'
> laws take effect on a rolling calendar. Verify the specific state's statute and effective
> date before declaring the regime applicable.

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

1. Identify which states' thresholds the controller actually meets (residents processed;
   revenue tests vary; Texas notably applies to any non-small-business processing residents'
   data).
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
