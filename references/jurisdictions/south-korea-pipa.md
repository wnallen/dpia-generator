# South Korea PIPA — Privacy Impact Assessment

**Regime code:** `kr-pipa` (module — Model B, thin). Korea's PIA is **mandatory for public
institutions** operating qualifying personal-information files, performed through
**PIPC-designated assessment agencies** with results submitted to the PIPC — the most
institutionalized assessment regime in Asia. For the private sector it is recommended, not
required, but PIPA's other obligations bite hard and belong in Section 6.

> **Sourcing status (2026-08-04; supplemented 2026-08-11):** pipc.go.kr / law.go.kr not
> fetched at build time; provisions below are `[model knowledge — verify]` unless tagged
> otherwise. Korean authoritative text; record translation reliance. A 2026-08-11 web-search
> pass found **no change to the Art. 33 public-institution PIA regime**, but surfaced a
> **major PIPA amendment promulgated 2026-03-10, effective 2026-09-11** — fines up to 10% of
> total turnover, personal supervisory liability for the representative director, earlier
> breach notification, and mandatory ISMS-P certification for large controllers from
> 2027-07-01. `[web search — verify]` Re-check before any Korea-scope run after September 2026.

## 1. Instrument and statute

- **PIPA Art. 33 (Privacy Impact Assessment):** heads of **public institutions** must conduct
  a PIA where operating personal information files meeting Enforcement-Decree thresholds
  (recalled patterns: files with sensitive/unique-identifier data above volume floors; files
  above large volume floors; linkage of files), **through an assessment agency designated by
  the PIPC**, and submit the result to the PIPC. Private-sector controllers are encouraged
  ("shall endeavour") to conduct PIAs. UNVERIFIED — verify the thresholds before declaring
  the duty.
- Regulator: **Personal Information Protection Commission (PIPC)**.

## 2. Trigger and conclusion

Screen: public institution (or systems built for one — vendors building government systems
inherit the requirement contractually) + qualifying file thresholds →
`regulatorConclusions["kr-pipa"].piaRequired: true`; private-sector processing → `false`
with a Section 6 note recording the recommendation posture and any procurement-driven PIA
condition.

## 3. Method and divergence

The Korean PIA methodology (PIPC assessment criteria used by the designated agencies) is a
control-checklist-plus-risk-rating method; the GDPR spine plus the register satisfies its
analytical core, but a formal Korean PIA must be **performed by a designated agency** — this
skill's output supports and pre-drafts that exercise; it cannot substitute for it. Say so
in the cover note where the duty applies.

Section 6 deltas for private-sector scope: **resident registration numbers** are prohibited
absent specific legal basis; **unique identifiers** and sensitive information need separate
consent; cross-border transfer requires consent or listed exceptions with disclosure, and
the PIPC has used **corrective-order powers over transfers**; data-breach and CPO
(Chief Privacy Officer) requirements are stricter than GDPR analogs; Korea holds an EU
adequacy decision (2021) — relevant to the EU limb's §1.9. UNVERIFIED.

ADM and AI deltas (corroborated 2026-08-11, `[web search — verify]`): **Art. 37-2** (in
force 2024-03-15) gives data subjects rights to refuse, or demand an explanation of, fully
automated decisions materially affecting rights — Korea's Art. 22 analog, with PIPC
subordinate guidance including AI-recruitment examples; the PIPC's **Guidelines on
Processing Personal Information for the Development and Use of Generative AI (2025-08-06)**
recommend a PIA for large-scale or sensitive processing — cite them for any Korea-scope AI
DPIA alongside the PIPC's AI Privacy Risk Assessment & Management Model (2024-12-19).

## 4. Privilege posture

Korea recognizes attorney confidentiality but **no general evidentiary privilege shielding
in-house or even external counsel work product from seizure** — prosecutors' office and PIPC
document demands reach broadly, and the mandatory PIA is submitted to the PIPC by design.
Treat the Korea record like the China record: factual only; candid analysis stays outside.

## 5. Source notes

- PIPA (as amended 2023) + Enforcement Decree — law.go.kr (Korean authoritative; English via KLRI translation). UNVERIFIED.
- PIPC PIA program pages and designated-agency list — pipc.go.kr. UNVERIFIED.
