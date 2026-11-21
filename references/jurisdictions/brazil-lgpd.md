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
> it. Primary-source fetches of gov.br/planalto return HTTP 403 to the fetch tool. A web-search
> corroboration pass on 2026-08-04 **confirmed Arts. 5(XVII) and 38 and the Art. 38 minimum
> content** (now `[web search — verify]`) and **corrected a resolution attribution** — see §2.
> Remaining pinpoints stay descriptive until fetched.

## 1. Instrument and statute

- **Lei nº 13.709/2018 (LGPD).** RIPD defined at Art. 5(XVII): documentation from the
  controller describing processing that can generate risks to civil liberties and fundamental
  rights, with measures and safeguards to mitigate risk. `[web search — verify]`
- **Art. 38:** the ANPD **may determine** that the controller prepare an RIPD (including for
  legitimate-interests processing, cf. Art. 10 §3); the sole paragraph sketches minimum
  content — description of the types of data collected, the methodology used for collection
  and for ensuring the security of the information, and the controller's analysis of measures,
  safeguards and risk-mitigation mechanisms. `[web search — verify]` (Art. 38 and its sole-paragraph
  content confirmed by web search 2026-08-04.)
- **Art. 32:** the ANPD may request RIPDs from public-sector bodies.
- Regulator: **Autoridade Nacional de Proteção de Dados (ANPD)**.

## 2. Trigger test

The LGPD does not contain an Art. 35(1)-style self-executing obligation with a defined
threshold; the operative reality is twofold:

1. **High-risk processing should have an RIPD ready** — the ANPD's preliminary guidance takes
   the position that high-risk processing calls for one. **Correction from the 2026-08-04
   verification pass, refined 2026-11-21:** Resolução CD/ANPD **nº 2, de 27 de janeiro de
   2022** is the **small-agents** regulation (agentes de tratamento de pequeno porte) — an
   earlier draft of this module cited it as a binding general high-risk list, which it is
   not. Its **Art. 4 does define "tratamento de alto risco"** — a "large-scale" factor
   combined with a "significant-harm" factor (emerging technologies; surveillance of publicly
   accessible areas; decisions affecting rights; sensitive data; vulnerable subjects including
   children and the elderly) — but **for the purposes of that regime** (a small agent carrying
   out high-risk processing loses the simplified treatment). The ANPD reuses the same criteria
   as **expressly non-exhaustive guidance** generally, so cite Res. 2/2022 Art. 4 as the source
   of the criteria and the FAQ as the guidance applying them, never as a closed statutory list.
   The board **rejected the draft orientation guide on high-risk processing (~2026-09-24,
   Voto nº 11/2025/DIR-MW/CD)** as over-complex and routed the high-risk analysis into the
   pending RIPD regulation. `[web search — verify]`
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
- **Transfers (Arts. 33–36):** the ANPD's international-transfer regulation (with Brazilian
  SCCs) governs — **Resolução CD/ANPD nº 19, de 23 de agosto de 2024** (number and date
  confirmed by web search 2026-08-11; the SCC-incorporation grace period for pre-existing
  contracts ended 2025-08-23). `[web search — verify]` A transfer limb in §1.9 should
  identify the mechanism. **EU–Brazil mutual adequacy adopted 2026-01-26** (announced
  2026-01-27; coordinated unilateral decisions — the Brazilian leg is **Resolução CD/ANPD
  nº 32, de 26 de janeiro de 2026**, the ANPD's first adequacy decision, recognizing the
  EU; the EU leg is **Commission Implementing Decision (EU) 2026/179**, C(2026) 373, in
  force 2026-01-28, reviewed within four years): the EU limb's transfer to Brazil no longer
  needs SCCs + TIA, and the Brazil→EU leg has an adequacy route — check each direction's
  instrument before citing. `[web search — verify]` (corroborated 2026-09-12; decision
  number 2026-11-21)
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
- ANPD RIPD FAQ page (April 2023) — gov.br/anpd. UNVERIFIED; preliminary, superseded when the RIPD regulation lands. **Status re-checked 2026-11-21: the RIPD regulation is still on the ANPD's regulatory agenda, unfinalized — the volatility banner stands.** The "high risk and large scale" guide once reported pending board approval was rejected by the board in September 2026 (see the 2026-11-21 note below).
- Resolução CD/ANPD nº 2, de 27 de janeiro de 2022 — **small agents (agentes de pequeno porte)**; its Art. 4 high-risk definition is reused by the ANPD as guidance, `[web search — verify]` (confirmed 2026-08-04; characterisation refined 2026-11-21 — see §2).
- **Resolução CD/ANPD nº 19, de 23 de agosto de 2024** — the international-transfer regulation and Brazilian SCCs. `[web search — verify]` (number/date confirmed 2026-08-11 against the gov.br listing surfaced by search; the earlier "unconfirmed" flag is resolved). Official page: `gov.br/anpd/.../resolucao-cd-anpd-no-19-de-23-de-agosto-de-2024`.
- 2025–2026 watch items (`[web search — verify]`, corroborated 2026-08-11): Resoluções CD/ANPD nº 30 e 31/2025 (December 2025 — regulatory-agenda update and the 2026–2027 inspection priority themes: data-subject rights incl. biometrics, children/ECA Digital, public sector, AI); the **ECA Digital** children's statute with an ANPD enforcement role and the ANPD's preliminary guide on age-assurance mechanisms (2026-03-20). Flag on any Brazil-scope DPIA touching children or AI.
- 2026-09-12 additions, resolved 2026-11-21 (`[web search — verify]`): the high-risk orientation guide the 2026-09-12 pass expected **will not issue** — the Conselho Diretor declined to approve the draft (~2026-09-24, Voto nº 11/2025/DIR-MW/CD) and folded high-risk criteria into the pending **RIPD regulation (Tema 2 of the 2025–2026 Regulatory Agenda), still in elaboration; no RIPD resolution published**. The tomada de subsídios recorded on 2026-09-12 could not be re-found; what did run was **Tomada de Subsídios 04/2026 on the 2027–2028 Regulatory Agenda** (2026-09-01 → 2026-10-16). Resolutions since: **nº 33 (2026-04-06)** — staffing/structure alongside Decreto 12.881/2026 completing the ANPD's conversion into an agência reguladora; **nº 34 (2026-11-16, DOU 2026-11-17)** — internal rules for distributing cases when only one director is qualified (a board-quorum signal; no substantive change). Nothing new on transfers (Res. 19/2024), DPOs, incidents or AI. **PL 2338/2023** (the AI bill): Senate-passed 2024-12-10; the Chamber special committee was still **awaiting the rapporteur's parecer as of 2026-11-07**, with the government seeking a vote by December 2026 and no date set. A bill, not law; a one-line watch item for AI-scope DPIAs, never a citation.
