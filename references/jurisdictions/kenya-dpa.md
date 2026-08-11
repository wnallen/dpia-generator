# Kenya — Data Protection Act 2019, s. 31 DPIA

**Regime code:** `ke-dpa` (divergence overlay — Model A; **derivable**). Kenya has the
clearest GDPR-family DPIA duty in Africa, and — unusually — a true Article 36 analog: where
the DPIA indicates high residual risk, the controller **must consult the Data Commissioner
before processing**. The builder therefore treats `ke-dpa` as a prior-consultation regime
and derives its conclusion from the register, exactly as for EU/UK GDPR.

> **Sourcing status (2026-08-04):** a web-search corroboration pass confirmed **s. 31**
> (DPIA where processing is likely to result in high risk; s. 31(4) definition), the
> **prior-consultation duty** where the DPIA indicates high risk, the existence of the
> **ODPC Guidance Note on DPIAs**, and a **60-days-prior submission** timeline reported by
> secondary sources; all `[web search — verify]`. The official text is on kenyalaw.org
> (403 to the fetch tool at build); fetch for verbatim subsection numbers — in particular
> **which subsection carries the consultation duty and the submission timeline** before
> citing either with a pinpoint.

## 1. Instrument and statute

- **Data Protection Act, 2019 (No. 24 of 2019), s. 31:** DPIA required where processing is
  likely to result in high risk to the rights and freedoms of a data subject, by virtue of
  its nature, scope, context and purposes. `[web search — verify]`
- **Prior consultation:** where the DPIA indicates the processing would result in high
  risk, the controller/processor consults the **Data Commissioner** prior to the
  processing. **The 60-day machinery is subsidiary legislation, not the Act** (resolved
  2026-08-11): the **Data Protection (General) Regulations, 2021** provide that
  consultation is completed within 60 days of the Commissioner's receipt of the impact
  report, with **deemed approval if the Commissioner does not communicate within 60 days
  of submission**; the "submit at least 60 days before processing" framing appears in the
  ODPC **Guidance Note on DPIAs**. Cite the Regulations (LN 263/2021) for the timeline,
  never s. 31 itself. `[web search — verify]` (corroborated 2026-08-11; fetch
  `new.kenyalaw.org/akn/ke/act/ln/2021/263/eng` for the regulation number of the
  consultation provision).
- Regulator: **Office of the Data Protection Commissioner (ODPC)**; registration regime
  for controllers/processors runs alongside.

## 2. Trigger, derivation, and conclusion

Run the s. 31 screen with the WP29 nine criteria — the Kenyan high-risk examples
(large-scale sensitive data, systematic monitoring of public areas, automated
decision-making including profiling) track them closely. **Derivable:** any High residual
in the register engages Data Commissioner consultation, so
`regulatorConclusions["ke-dpa"].priorConsultation` is checked against the register by the
builder (exit 3 on contradiction), and the legacy `art36` alias fills it. The cover offers
a `Requires ODPC Consultation` status box when `ke-dpa` is declared.

## 3. Content and divergence notes

The GDPR spine satisfies s. 31's content expectations (the Act's DPIA definition mirrors
Art. 35(7)). Section 6 deltas worth a paragraph where they change the answer:

- **Registration:** controllers/processors above thresholds must be ODPC-registered —
  an intake fact; an unregistered controller has a problem upstream of the DPIA.
- **Transfers (ss. 48–49):** out-of-Kenya transfers need proof of appropriate safeguards
  or data-subject consent, and **sensitive-data transfers face stricter conditions**;
  certain processing may be subject to Kenya-server/localization requirements under
  ministerial regulations. `[model knowledge — verify]`
- **Civil registration and public-sector data** carry their own restrictions.

## 4. Privilege posture

Kenyan advocate-client privilege follows the common-law model; in-house counsel privilege
is narrower. The DPIA is **submitted to the ODPC by design where the duty fires** — the
two-document rule applies: the submitted record stays factual; counsel's candid analysis
lives in the privileged spine.

## 5. Source notes

- Data Protection Act, 2019, s. 31 — kenyalaw.org (`new.kenyalaw.org/akn/ke/act/2019/24/eng`). `[web search — verify]`; fetch for verbatim subsection numbering.
- **Data Protection (General) Regulations, 2021 (LN 263/2021)** — the 60-day consultation/deemed-approval machinery. `[web search — verify]` (corroborated 2026-08-11).
- ODPC Guidance Note on DPIAs — odpc.go.ke. `[web search — verify]`; capture edition and the submission-timeline provision.
- Watch items (2026-08-11): a **Data Protection (Amendment) Bill, 2025** is pending (expanded sensitive-data categories, accountability duties) — bill only, not law; **EU adequacy talks are advanced** (press reporting targets a possible decision in late 2026) but no decision has been adopted — do not cite Kenya as EU-adequate. `[web search — verify]`
