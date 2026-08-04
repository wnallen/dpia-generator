# Brazil LGPD — Relatório de Impacto à Proteção de Dados (RIPD)

**Regime code:** `br-lgpd` (divergence overlay on the GDPR spine — Model A). The instrument is
the **RIPD** (data protection impact report), LGPD's DPIA analog. The LGPD was drafted in the
GDPR's image and the Article 35 structure satisfies the RIPD's statutory content with room to
spare — the differences are in the trigger's looseness, the regulator's demand power, and the
fact that the detailed regulation is **still pending**.

> **VOLATILITY BANNER — re-verify before relying.** As of build (2026-08-04) the ANPD's
> guidance on RIPDs is a preliminary FAQ webpage (April 2023) and the dedicated RIPD
> regulation remains on the ANPD's regulatory agenda, unfinalized. `[web search — verify]`
> When the regulation lands, this module's trigger and content sections must be rebuilt from
> it. Build-time fetches of gov.br returned HTTP 403 via proxy; every pinpoint below is
> descriptive and UNVERIFIED.

## 1. Instrument and statute

- **Lei nº 13.709/2018 (LGPD).** RIPD defined at Art. 5(XVII): documentation from the
  controller describing processing that can generate risks to civil liberties and fundamental
  rights, with measures and safeguards to mitigate risk. UNVERIFIED.
- **Art. 38:** the ANPD **may determine** that the controller prepare an RIPD (including for
  legitimate-interests processing, cf. Art. 10 §3); the sole paragraph sketches minimum
  content — description of the types of data collected, the methodology used for collection
  and for ensuring the security of the information, and the controller's analysis of measures,
  safeguards and risk-mitigation mechanisms. UNVERIFIED.
- **Art. 32:** the ANPD may request RIPDs from public-sector bodies.
- Regulator: **Autoridade Nacional de Proteção de Dados (ANPD)**.

## 2. Trigger test

The LGPD does not contain an Art. 35(1)-style self-executing obligation with a defined
threshold; the operative reality is twofold:

1. **High-risk processing should have an RIPD ready** — the ANPD's preliminary guidance takes
   the position that high-risk processing calls for one, and the ANPD's small-agents
   resolution (recalled: Resolução CD/ANPD nº 2/2022) supplies the closest thing to a
   high-risk definition: processing is high-risk when it meets **at least one "large-scale"
   criterion and at least one "significant-harm" criterion** (emerging technologies;
   surveillance/control of publicly accessible areas; decisions affecting rights; sensitive
   data; vulnerable subjects including children and the elderly). UNVERIFIED — verify the
   resolution number and the criteria before citing.
2. **The ANPD can demand it** — the RIPD is producible on regulatory order regardless of any
   self-assessment.

Screen conclusion: `regulatorConclusions["br-lgpd"].ripdRequired` — treat "high-risk under the
ANPD criteria" as the mandatory branch and record demand-readiness either way. Where the WP29
nine-criteria screen says high risk, the ANPD criteria will almost always agree.

## 3. Content — crosswalk

Art. 38's content sketch maps onto Art. 35(7) (a), (c) and (d) directly; it does not expressly
demand the necessity/proportionality limb, but ANPD guidance and Art. 6's principles
(necessity, adequacy, purpose limitation) import the same analysis. **Produce the full GDPR
spine**; nothing in it is surplus for Brazil. Additions:

- **Legal bases differ:** LGPD Art. 7 has ten bases (not six) — including credit protection
  and health protection; legitimate interests exists (Art. 10) with an LIA-like balancing and
  is the basis most likely to draw an ANPD RIPD demand. §2.2 needs an LGPD paragraph mapping
  the chosen Art. 6 GDPR basis to its Art. 7/11 LGPD analog — they do not map one-to-one.
- **Sensitive data (Art. 11)** roughly tracks Art. 9 but includes no employment-context
  derogation regime; verify the applicable Art. 11 hypothesis.
- **Transfers (Arts. 33–36):** the ANPD's international-transfer regulation (recalled:
  Resolução CD/ANPD nº 19/2024, with Brazilian SCCs) governs; a transfer limb in §1.9 should
  identify the mechanism. Brazil recognizes no adequacy list equivalent to the EU's as of
  recall — verify current state. UNVERIFIED.
- **Children (Art. 14):** best-interests standard; processing of children's data was loosened
  from consent-only by later amendment/interpretation — verify before relying.

## 4. Regulator engagement

- **No prior-consultation mechanism.** No Art. 36 analog; do not imply ANPD pre-approval.
- **Production on demand:** the ANPD may order the RIPD's preparation or production; the
  regulator-engagement row reads *"RIPD maintained; producible to the ANPD on demand
  (Art. 38); no filing, no consultation."*
- **Sanctions context:** LGPD fines reach 2% of Brazil-sourced revenue capped at R$50M per
  infraction, plus publicization and processing bans. UNVERIFIED.

## 5. Where the conclusion could materially differ

| Area | GDPR position | LGPD position | Effect |
|---|---|---|---|
| Trigger precision | Statutory triggers + DPA lists | Open-textured; ANPD criteria + demand power | Default to preparing the RIPD whenever the GDPR screen says mandatory; cheap insurance against a demand |
| Lawful bases | Six | Ten, incl. credit protection; LI available to public bodies in some postures | Basis mapping paragraph required; do not transplant the Art. 6 conclusion unexamined |
| ADM | Art. 22 prohibition-with-exceptions | Art. 20: right to review of automated decisions — review need not be human (post-2019 veto history) | A solely-automated flow may stand in Brazil where EU scope forces human intervention — apply the higher standard unless carved out |
| Transfers | Adequacy / SCC / TIA | ANPD mechanisms (Brazilian SCCs etc.), no mirror of the EU adequacy list | Separate §1.9 sub-row for the Brazil leg |

## 6. Privilege posture

Brazilian professional secrecy (sigilo profissional) protects lawyer-client communications,
including OAB-enrolled in-house counsel, but the RIPD is **producible to the regulator by
design** — the two-document rule from the destination check applies: factual RIPD record
producible; counsel's candid analysis in the privileged spine document. Portuguese-language
delivery may be expected on an ANPD demand; record translation status.

## 7. Source notes

- Lei nº 13.709/2018 — planalto.gov.br. UNVERIFIED; stable statutory identifier, capture URL on first fetch.
- ANPD RIPD FAQ page (April 2023) — gov.br/anpd. UNVERIFIED; preliminary, superseded when the RIPD regulation lands.
- Resolução CD/ANPD nº 2/2022 (small agents; high-risk criteria) and nº 19/2024 (international transfers) — gov.br/anpd. UNVERIFIED; verify both resolution numbers.
