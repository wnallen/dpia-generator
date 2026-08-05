# Switzerland revFADP — Data Protection Impact Assessment

**Regime code:** `ch-fadp` (divergence overlay — Model A; the cleanest fit of any non-EU
regime). The revised Federal Act on Data Protection (in force 2023-09-01) mirrors the Article
35/36 structure closely enough that the GDPR spine needs only a Swiss overlay — with one gate
nuance that keeps this regime **non-derivable** in the builder despite having a true
prior-consultation mechanism.

> **Sourcing status (2026-08-04):** fedlex.admin.ch returns HTTP 403 to the fetch tool. A
> web-search corroboration pass on 2026-08-04 **confirmed SR 235.1, Art. 22 (DPIA), Art. 23
> (FDPIC consultation) and Art. 23(4) (the data-protection-adviser alternative)**, and the
> 2023-09-01 in-force date; those carry `[web search — verify]`. Article pinpoints still require
> a fetch to reach `[official publication]`.

## 1. Instrument and statute

- **revFADP Art. 22:** DPIA required where the intended processing is likely to result in a
  **high risk to the data subject's personality or fundamental rights**; risk driven by the
  nature, scope, circumstances and purposes — expressly including extensive processing of
  sensitive data and systematic monitoring of extensive public areas. `[web search — verify]`
- **Art. 23:** where the DPIA shows a **high residual risk** despite the measures envisaged,
  the controller must obtain the **FDPIC's opinion** in advance — a genuine Art. 36 analog.
  **Art. 23(4) (the gate nuance):** a controller that has appointed a **data protection
  advisor** under Art. 10 and consulted that advisor **may refrain from consulting the
  FDPIC**. `[web search — verify]` (Arts. 22, 23 and 23(4) confirmed 2026-08-04.)
- Regulator: **Federal Data Protection and Information Commissioner (FDPIC)**.

## 2. Why this regime is non-derivable in the builder

For EU/UK GDPR the builder derives `priorConsultation` from the register: any High residual
⇒ consultation, no exceptions. Swiss law has the Art. 23(4) advisor alternative: a High
residual with a consulted data protection advisor lawfully concludes
`fdpicConsultation: false`. Deriving would force the wrong answer, so the conclusion is
**declared** (`regulatorConclusions["ch-fadp"].fdpicConsultation`) and the DPIA must state
which route was taken:

- High residual + no advisor consulted → `true`, and the Art. 36-style stop-the-line language
  applies to the Swiss limb.
- High residual + Art. 10 advisor consulted (document the consultation: date, advisor,
  substance) → `false` is lawful; say expressly in Section 5 that the Art. 23(4) alternative
  was used.
- No High residual → `false`.

A declared `false` in the presence of a High residual **without** a documented advisor
consultation is a scoring or process error — the same class of defect the EU gate stops; the
builder cannot see the advisor fact, so the reviewing attorney must.

## 3. Content and divergence notes

The GDPR spine satisfies Art. 22's content expectations. Swiss deltas worth a Section 6
paragraph where they change the answer:

- **Sensitive data** includes trade-union views, administrative/criminal proceedings and
  sanctions, and social-assistance measures — slightly different list from Art. 9.
- **No Art. 22 GDPR-style ADM prohibition:** Art. 21 revFADP gives a right to be informed of,
  and to state a position on, automated individual decisions — an information/objection
  model, not a default prohibition.
- **Transfers:** Federal Council adequacy list (not the EU's); EU SCCs usable with Swiss
  amendments recognized by the FDPIC. The EU limb's TIA needs a Swiss-law paragraph, not a
  separate document.
- **Sanctions are personal:** fines (up to CHF 250,000) target the responsible **individual**,
  not the undertaking — worth a line in the executive summary; it changes who cares.
- **Exemption:** a DPIA can be waived where a certified system/product is used or a code of
  conduct approved by the FDPIC applies. UNVERIFIED.

## 4. Regulator engagement

Row: *"FDPIC opinion required before processing on high residual risk (Art. 23), unless the
Art. 23(4) data-protection-advisor consultation route is taken and documented; FDPIC may
propose measures within two months."*

## 5. Privilege posture

Swiss attorney-client privilege protects communications with **registered external counsel
only — there is no in-house counsel privilege in Switzerland**, and Swiss courts and
authorities can compel in-house work product. A DPIA authored purely in-house has no
privilege shield; route counsel's candid analysis through external Swiss counsel where it
matters, and keep the DPIA record itself factual. The FDPIC consultation route places the
DPIA before the regulator by design on that branch.

## 6. Source notes

- revFADP (2020, in force 2023-09-01) — fedlex.admin.ch (DE/FR/IT authentic; EN courtesy translation). `[web search — verify]`; **SR 235.1 and Arts. 22/23/23(4) confirmed 2026-08-04**; fetch for verbatim article text.
- FDPIC DPIA guidance — edoeb.admin.ch. UNVERIFIED.
