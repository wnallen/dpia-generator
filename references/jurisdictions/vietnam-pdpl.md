# Vietnam — PDP Law impact dossiers (filed with the MPS)

**Regime code:** `vn-pdpl` (standalone module — Model B). Vietnam is the most
filing-intensive regime in this skill: the assessment is not an internal accountability
record but a **dossier prepared for and submitted to the Ministry of Public Security**.
Nothing drafted for the Vietnam limb should assume it stays inside the controller.

> **Sourcing status (updated 2026-08-11):** primary sources not fetched (403 to the fetch
> tool). The 2026-08-04 pass confirmed the **PDP Law No. 91/2025/QH15** (passed 2025-06-26,
> **effective 2026-01-01**, replacing **Decree 13/2023/ND-CP**) and the 60-day MPS
> submission posture. A further pass on **2026-08-11** confirmed the implementing decree has
> landed: **Decree No. 356/2025/ND-CP, effective 2026-01-01, replaces Decree 13/2023/ND-CP**
> — including its dossier forms — and adds an appraisal mechanism (see §1). All
> `[web search — verify]`; the decree's issuance date and annex/form numbering still need a
> primary-source read. **Re-verify on every Vietnam-scope run.**

## 1. Instrument and framework

- **Law No. 91/2025/QH15 on Personal Data Protection** (effective 2026-01-01), implemented
  by **Decree No. 356/2025/ND-CP** (effective 2026-01-01), which replaces Decree
  13/2023/ND-CP. `[web search — verify]` (corroborated 2026-08-11)
- Two dossier obligations (confirm the Law's and Decree 356's article numbers on first fetch):
  1. **Processing impact assessment dossier** — prepared from the start of processing,
     kept available for MPS inspection, and submitted (one original) to the MPS within
     **60 days** of the start of processing. `[web search — verify]`
  2. **Cross-border transfer impact assessment dossier** — prepared and **submitted to the
     MPS within 60 days of the transfer's start**; the MPS may inspect and can order a
     halt to transfers. `[web search — verify]`
- **New under Decree 356 (corroborated 2026-08-11):** a two-way **appraisal mechanism** —
  the authority must issue a compliance decision within **15 days** of a valid dossier, and
  submitters get up to **30 days** to cure deficiencies; dossiers are made on **Decree 356's
  own form templates**, superseding Decree 13's Forms 01–04 (fetch the current form numbers
  before any real filing). Small enterprises and household businesses may **defer the DPIA
  dossier up to 5 years from 2026-01-01**, unless processing is large-scale (reported
  cutoff: ≥100,000 data subjects) or the business is a data-processing-service /
  sensitive-data processor. `[web search — verify]`
- Regulator: **Ministry of Public Security (A05)**.

## 2. Trigger and conclusion

The dossier obligations attach to processing and to cross-border transfer **as such** —
not to a high-risk subset. If Vietnam-resident data subjects' personal data is processed
or exported at scale, the practical screen is "does the Vietnam limb exist at all," then
scope thresholds and sector exemptions under the new Law (verify — the 2025 Law
introduced calibrations for small businesses and specific sectors that this module has
not read). `[model knowledge — verify]`

Screen conclusion: `regulatorConclusions["vn-pdpl"].dossierRequired`.

## 3. Content and method

The Decree 13-era dossier forms map onto the GDPR spine (controller/processor details,
purposes, data types, recipients, transfer details, measures, risk assessment); the
register and matrix over-satisfy the risk element. Vietnam-specific items the spine does
not carry: the prescribed dossier **forms** (issued by MPS regulation — fetch the current
form numbers before a real filing), sensitive-data category flags under the Law's
definitions, and the transfer dossier's counterparty commitments.

## 4. Regulator engagement and the filing gate

**Filing is the default posture, not the exception.** The regulator-engagement row reads:
*"Processing and transfer impact dossiers submitted to the MPS (A05) within 60 days;
producible in inspections; MPS may order transfer suspension."* Producing a
"ready-to-file" dossier is a consequential step under the regulator filing gate in
SKILL.md — confirm before finalizing, and do not file on the user's behalf.

## 5. Privilege posture

Vietnam recognizes no common-law-style legal professional privilege; the dossier is
submitted to a security ministry by design. Treat the Vietnam record like the China
record: **factual only, candid analysis stays outside**, Vietnamese-language filing
requirements verified before submission.

## 6. Source notes

- Law No. 91/2025/QH15 — Official Gazette / MPS. `[web search — verify]`; capture article numbers for both dossiers on first fetch.
- Decree 13/2023/ND-CP (replaced; structure persists) — Arts. 24–25. `[model knowledge — verify]`.
- MPS dossier forms and implementing decrees under the 2025 Law — pending/rolling; verify per run.
