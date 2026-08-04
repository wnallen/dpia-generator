# Canada — Quebec Law 25 PIA (with a federal PIPEDA note)

**Regime code:** `ca-qc` (divergence overlay on the GDPR spine — Model A, close fit). The
instrument is the **privacy impact assessment** — "évaluation des facteurs relatifs à la vie
privée" (EFVP) — under Quebec's private-sector privacy act as amended by **Law 25** (2021,
fully in force since September 2024). It is the closest non-European analog to an Article 35
DPIA, with two structural differences: the trigger is **project-based**, and a PIA is a
**precondition to communicating personal information outside Quebec**.

> **Sourcing status (2026-08-04):** primary sources (legisquebec.gouv.qc.ca, cai.gouv.qc.ca)
> not fetched at build time. Section numbers are descriptive `[model knowledge — verify]`;
> the CAI guide's existence and date were corroborated by search `[web search — verify]`.

## 1. Instrument and statute

- Act respecting the protection of personal information in the private sector, **CQLR c.
  P-39.1**, as amended by Law 25 (An Act to modernize legislative provisions as regards the
  protection of personal information, S.Q. 2021, c. 25). UNVERIFIED.
- Regulator: **Commission d'accès à l'information du Québec (CAI)**.
- Guidance: CAI **companion guide on conducting PIAs** (published September 2023, French;
  check for an English version before citing to an anglophone reviewer). UNVERIFIED.

## 2. Trigger test — project-based plus transfer-based

Two independent triggers (descriptive):

1. **Information-system projects** (recalled s. 3.3): a PIA is required for any project of
   **acquisition, development or redesign of an information system or electronic service
   delivery** involving the collection, use, communication, keeping or destruction of
   personal information. Proportionality applies — the PIA's depth scales with the
   sensitivity of the information, the purposes, the quantity, distribution and medium.
2. **Communication outside Quebec** (recalled s. 17): before communicating personal
   information outside Quebec (including to the rest of Canada), the enterprise must conduct
   a PIA establishing that the information would receive **adequate protection** in light of
   generally accepted data-protection principles, and the communication must be subject to a
   written agreement addressing the PIA's findings. This is a TIA-shaped obligation — reuse
   the EDPB six-step structure, swapping the Charter/GDPR benchmark for the "generally
   accepted principles" standard.

The **person in charge of the protection of personal information** (Quebec's DPO analog —
by default the CEO, delegable) must be consulted from the project's outset; privacy by
default settings are a statutory requirement for products offered to the public.

Screen conclusion: `regulatorConclusions["ca-qc"].piaRequired`.

## 3. Content and method

Law 25 does not enumerate content the way Colorado does; the CAI guide fills that role. The
GDPR spine satisfies it comfortably: description, necessity/proportionality, risks from the
data subject's perspective, safeguards, and the consultation record (the person in charge).
The 3×3 matrix is compatible with the CAI's methodology. Additions the spine does not carry:

- The **outside-Quebec adequacy analysis** and the written-agreement condition, where the
  processing communicates PI outside the province (a §1.9/TIA-appendix item).
- **Privacy by default** confirmation for public-facing products.
- French-language delivery consideration: the PIA itself may need to exist in French for CAI
  review and for the enterprise's Quebec-facing accountability record.

## 4. Regulator engagement

No consultation or filing obligation. The CAI can **request PIAs in an investigation**, and
Law 25 carries administrative monetary penalties up to the greater of **CAD 10M or 2% of
worldwide turnover**, and penal fines up to the greater of **CAD 25M or 4%** — the figures
most often quoted for Law 25's teeth. UNVERIFIED — verify which tier attaches to PIA
failures before quoting either number in a deliverable.

## 5. Federal note — PIPEDA and the public sector

- **PIPEDA** (private sector, rest of Canada) imposes **no PIA obligation**; the OPC treats
  PIAs as accountability best practice. If the processing is federal-works-scope or
  multi-province, note PIPEDA's accountability principle and move on — there is no separate
  instrument to produce. Bill C-27 (CPPA), which would have modernized this, **died on the
  order paper** with the January 2025 prorogation; check status before asserting anything
  about a successor. `[model knowledge — verify]`
- **Federal public sector:** the Treasury Board **Directive on Privacy Impact Assessment**
  makes PIAs mandatory for government institutions; relevant only when the client is or
  serves a federal institution.

## 6. Where the conclusion could materially differ

| Area | GDPR position | Quebec position | Effect |
|---|---|---|---|
| Trigger | Likely-high-risk screen | Any qualifying system project, regardless of risk level | A low-risk system rebuild can require a Quebec PIA while being GDPR-prudential only |
| Transfers | Art. 44+ mechanisms; TIA for non-adequate destinations | PIA + adequacy finding + written agreement for ANY communication outside Quebec, including intra-Canada | The Quebec transfer limb triggers where GDPR sees nothing (e.g., Quebec → Ontario) |
| High residual | Art. 36 consultation | No consultation mechanism | Controller proceeds on its own recorded decision |
| Consent | One of six bases | Consent-centric statute; new purposes generally need consent | §2.2 needs a Quebec paragraph where the lawful-basis story is legitimate-interests-shaped |

## 7. Privilege posture

Canadian solicitor-client privilege is robust and extends to in-house counsel acting qua
legal adviser; litigation privilege is narrower. A PIA drafted under counsel's direction can
sustain the privileged header for the internal record, but the CAI can compel production in
an investigation and the outside-Quebec PIA underpins contractual representations to
counterparties — keep the producible factual record separable from counsel's strategic
analysis, per the destination check.

## 8. Source notes

- CQLR c. P-39.1 (as amended) — legisquebec.gouv.qc.ca. UNVERIFIED; capture the true section
  numbers for the two triggers on first fetch (the "3.3"/"17" recall above is the most
  commonly cited pair and must be confirmed).
- CAI, companion guide on PIAs (Sept 2023) — cai.gouv.qc.ca. UNVERIFIED.
- OPC PIA guidance; TBS Directive on Privacy Impact Assessment — priv.gc.ca / tbs-sct.canada.ca. UNVERIFIED.
