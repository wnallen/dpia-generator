# India DPDP — Significant Data Fiduciary DPIA

**Regime code:** `in-dpdp` (standalone module — Model B). The DPDP regime's DPIA is unlike
every other instrument in this skill: it attaches to a **designated entity**, not to a
processing activity, and it runs on a **calendar**, not a launch gate. If the client is not a
Significant Data Fiduciary, the correct output is a clean "no DPDP DPIA duty attaches" — which
is itself a valuable conclusion to record.

> **Sourcing status (2026-08-04):** Digital Personal Data Protection Act, 2023 and the DPDP
> Rules, 2025 (notified 2025-11-13, gazetted 2025-11-14 `[web search — verify]`) not fetched
> at build time. SDF designations and Data Protection Board practice are new and forming;
> re-verify the client's designation status and the Rules' phase-in dates every run.

## 1. Instrument and statute

- **DPDP Act, 2023, s. 10:** the Central Government may designate a data fiduciary or class
  of fiduciaries as **Significant Data Fiduciaries** based on volume and sensitivity of data,
  risk to electoral democracy, security of the State, public order, and related factors. SDFs
  must appoint an India-based DPO, appoint an **independent data auditor**, and undertake
  **periodic DPIA and periodic audit**. UNVERIFIED.
- **DPDP Rules, 2025:** operationalize s. 10 — recalled: DPIA **and** audit at least **once
  every twelve months**, with the person carrying them out reporting **key findings to the
  Data Protection Board**. UNVERIFIED — verify the exact rule number and whether the report
  goes via the auditor or the SDF.
- Regulator: **Data Protection Board of India** (adjudicatory); rulemaking with **MeitY**.

## 2. Trigger test — entity designation, then calendar

1. **Is the client an SDF?** Designation is by government notification — this is an intake
   fact, not an analysis. If not designated (and not plausibly in a designated class), record:
   *"No DPDP DPIA obligation attaches; general Act obligations (notice, consent, security,
   breach notification, data-principal rights) apply and are noted in Section 6."*
2. **If SDF:** the DPIA is an annual compliance instrument assessing the fiduciary's
   observance of the Act and Rules, alongside the independent audit. A new high-risk
   processing launch belongs *inside* the next periodic DPIA — and prudently gets assessed at
   launch on this skill's spine anyway.

Screen conclusion: `regulatorConclusions["in-dpdp"].dpiaRequired` — true only where the
client is (or must be assumed to be) an SDF.

## 3. Content — crosswalk

The Act does not enumerate DPIA content the way Art. 35(7) does; the working standard is
observance of the Act's obligations. The GDPR spine over-satisfies, with these India-specific
substitutions:

- **Lawful basis:** consent or enumerated "legitimate uses" (s. 7) — there is **no
  legitimate-interests basis**. A processing resting on Art. 6(1)(f) in the EU limb needs a
  consent or legitimate-use story for India; §2.2 must say so expressly.
- **Children (s. 9):** verifiable parental consent under 18 (not 13/16); prohibitions on
  tracking, behavioural monitoring and targeted advertising directed at children, subject to
  exemptions in the Rules. Stricter than both GDPR and COPPA on age.
- **Cross-border (s. 16):** transfers allowed except to countries on a government
  **negative list** (none confirmed at recall) — plus sectoral localization (RBI payments
  data) that survives the Act. Verify current notifications.
- **SDF extras:** annual audit, India-based DPO, and any algorithmic-software due-diligence
  obligations attaching to SDFs under the Rules. UNVERIFIED.

## 4. Regulator engagement

**Reporting by design:** key DPIA and audit findings are reported to the Data Protection
Board. The regulator-engagement row reads: *"Annual DPIA + audit; key findings reported to
the DPB; not a launch-gate consultation."* Do not imply Board pre-approval of processing.

## 5. Where the conclusion could materially differ

| Area | GDPR position | DPDP position | Effect |
|---|---|---|---|
| Who owes the duty | Every controller, per processing | Designated SDFs, annually | A processing needing a mandatory EU DPIA may carry no India assessment duty at all |
| Lawful basis | Six bases incl. LI | Consent + enumerated legitimate uses; no LI | LI-based EU processing needs a different India story or fails |
| Children | Under-16/13 consent; risk-based | Under-18 verifiable parental consent; ad-targeting bans | The India limb can prohibit what the EU limb permits with safeguards |
| Audience | Internal document | Findings to the DPB | Production-by-design posture for the findings layer |

## 6. Privilege posture

Indian privilege (now under the Bharatiya Sakshya Adhiniyam, replacing the Evidence Act)
protects legal-adviser communications, but Indian courts have treated **salaried in-house
counsel as employees outside full privilege**. The DPIA findings layer is reported to the
Board by design. Two-document rule applies: the reportable DPIA/audit record kept clean of
strategic analysis; counsel's candid assessment held in the privileged spine document,
preferably with outside counsel in the loop for the India limb.

## 7. Source notes

- DPDP Act, 2023 — indiacode.nic.in / MeitY. UNVERIFIED.
- DPDP Rules, 2025 — Gazette notification of 2025-11-13/14; PIB summary. `[web search — verify]`; capture rule numbers for the SDF DPIA/audit and the phase-in schedule on first fetch.
- SDF designation notifications — none confirmed at build; check before every India-scope run.
