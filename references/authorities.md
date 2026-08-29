# Recurring Authorities — Citation Register

Read this in Step 1 alongside `published-dpias.md`, and again when assembling Appendix A.

Almost every DPIA this skill produces cites the same fifteen-odd sources. Re-deriving them from memory each run is how fabricated pinpoints get into a filed document, and it is why a no-network run ends up tagging *everything* `[model knowledge — verify]` — which is honest but useless, because it gives the reviewing attorney no way to tell the settled citations from the risky ones.

This file separates them.

## How to use it

- **Tier A** entries are statutory and treaty-level instruments with stable public identifiers. Cite them as `[official publication]` using the identifiers below. The article and recital *text* for the GDPR provisions this skill relies on is reproduced in `references/legal-framework.md`; quote from there rather than from recall.
- **Tier B** entries are guidance, opinions, decisions and case law. They ship **UNVERIFIED**. Cite them as `[model knowledge — verify]` until a run actually fetches the source, and only then upgrade the tag on that citation.
- **Three tags, three levels of confidence — do not conflate the middle one with the top one.** `[model knowledge — verify]` is pure recall (highest fabrication risk). `[web search — verify]` means the identifier or pinpoint was **corroborated by independent web search but the primary source was not fetched and read** — better than recall, still not authority. `[official publication]` / a fully verified Tier B tag means **the document was fetched, the pinpoint was read, and the exact reference captured**. Moving a citation from recall to `[web search — verify]` is a real improvement and is allowed; moving it to `[official publication]` from a search snippet is **not** — that step requires the fetch.
- **On 2026-08-04 a corroboration pass ran** with web search available but primary-source fetches blocked (all official portals returned 403 to the fetch tool). It moved the non-EU statutory identifiers below from recall to `[web search — verify]`, filled the DUAA chapter number, and corrected one Brazilian resolution attribution. Every one of those still needs a primary-source fetch to reach `[official publication]`; the tags say so.
- **On 2026-08-11 a currency-review pass ran** (web search only; primary fetches still blocked). Headline corrections applied across the modules: the EU AI Act's Annex III / Art. 27 FRIA date moved to 2027-12-02 (Reg. (EU) 2026/1744); the DUAA "Senior Responsible Individual" claim was **deleted as an error** (DUAA retained the DPO — SRI was the failed DPDI Bill); DUAA main provisions commenced 2026-02-05 (SI 2026/82); the Brazilian transfer resolution is confirmed as **Resolução CD/ANPD nº 19/2024**; Malaysia's final DPIA Guideline issued (Apr/May 2026); Vietnam's Decree 13 was replaced by **Decree 356/2025/ND-CP**; India's Rule 13 SDF duty commences **2027-05-13**; Maryland MODPA added to the US-state roster; the Colorado AI Act was repealed May 2026 before taking effect; EU–Brazil mutual adequacy adopted 2026-01-27; EDPB adopted a harmonised DPIA template (Mar/Apr 2026). Details live in the affected module files.
- When a run does verify an entry, update it here — status, exact pinpoint, date checked — the same way `published-dpias.md` grows. That is the whole point of the file: the verification burden should fall once, not once per DPIA.

**Pinpoints below are descriptive, not exact.** They tell you which part of the source to cite for which proposition. Capture the precise section, paragraph or page number when you verify, and record it here. Do not invent a section number to make a citation look precise — an approximate pinpoint honestly labelled is defensible; a precise one that is wrong is not.

---

## Tier A — statutory instruments, citable as `[official publication]`

### Regulation (EU) 2016/679 (GDPR)

CELEX `32016R0679`; OJ L 119, 4 May 2016. EUR-Lex: `https://eur-lex.europa.eu/eli/reg/2016/679/oj`

The provisions this skill relies on, and what each is cited for:

| Provision | Cited for |
|---|---|
| Art. 35(1) | The "likely to result in a high risk" threshold — the general DPIA obligation |
| Art. 35(3)(a)–(c) | The three statutory triggers; mandatory DPIA regardless of the nine criteria |
| Art. 35(4) | Supervisory authorities' published mandatory-DPIA lists |
| Art. 35(7)(a)–(d) | The required content — and therefore the structure of Sections 1, 2, 4 and 5 |
| Art. 35(2) | The obligation to seek the DPO's advice |
| Art. 35(9) | Views of data subjects where appropriate |
| Art. 36(1) | Prior consultation on residual high risk — the flag |
| Recitals 84, 90, 91 | Mitigation measures; nature/scope/context/purposes; large-scale processing |
| Art. 5(1)(b)–(e) | Purpose limitation, minimisation, accuracy, storage limitation — Section 2 |
| Art. 6(1)(a)–(f) | Lawful basis; the closing paragraph excluding (f) for public authorities |
| Art. 9(1), 9(2)(a)–(j) | Special-category prohibition and conditions |
| Art. 10 | Criminal convictions and offences data |
| Art. 22(1)–(3) | Automated decision-making; the "meaningful information about the logic" standard |
| Arts. 12–22 | Data subject rights feasibility — §2.7 |
| Art. 28(2), 28(3) | Processor and sub-processor obligations |

### UK GDPR and the Data Protection Act 2018

The UK GDPR as it forms part of retained EU law, read with the DPA 2018 (c. 12). Cite the UK provision by its UK GDPR article number and note where it departs from the EU text.

### Data (Use and Access) Act 2025

`[web search — verify]` **Chapter 18** — Data (Use and Access) Act 2025 (c. 18), Royal Assent **19 June 2025**. Official text: `https://www.legislation.gov.uk/ukpga/2025/18` (the "bare year path" problem is resolved — the chapter number is 18). Main data-protection provisions commenced **2026-02-05** via the Commencement No. 6 Regulations, **SI 2026/82** (corroborated 2026-08-11). Cite the specific amending section, not the Act as a whole; not yet fetched and read. Substantive analysis is in `references/jurisdictions/uk-gdpr.md`.

### US state statutes and rules (Phase 1 modules)

The **section identifiers** below were corroborated by independent web search on 2026-08-04 (`[web search — verify]`); the LII / Justia / official-portal texts were **not fetched**, so a primary-source read is still required to reach `[official publication]` and to capture sub-paragraph enumerations verbatim.

- **Colorado:** C.R.S. § 6-1-1309 (data protection assessments); Colorado Privacy Act Rules, 4 CCR 904-3 — **Rule 8.02 SCOPE, Rule 8.04 DATA PROTECTION ASSESSMENT CONTENT, Rule 9.06 assessments for profiling** (`[web search — verify]`, section titles confirmed; the enumerated 8.04 element list still to be read verbatim). Official rules PDF: coag.gov.
- **California:** Cal. Civ. Code § 1798.185(a)(15); CPPA regulations, **11 CCR Article 10 — § 7150 (when a risk assessment is required), § 7152 (risk assessment requirements)** (`[web search — verify]`), OAL-approved 2025-09-23, effective 2026-01-01, first filing due 2028-04-01, review at least every three years. Official statute PDF: `cppa.ca.gov/regulations/pdf/`.
- **Virginia pattern:** Va. Code § 59.1-580 and state analogs (CT, TX, OR, MT, DE, NH, NJ, MN, TN, IN, KY, NE, RI, and — with stricter, per-algorithm assessment duties — **MD** (MODPA, eff. 2025-10-01)). Enacted 2026 with future effective dates: OK, LA (2027-01-01), AL (2027-05-01, reportedly no DPA duty), VT (2028-01-01). Verify per state actually relied on; the list rolls forward session to session (roster notes in `us-other-states.md`, updated 2026-08-11).

### Canada / Quebec (Phase 1 module)

- **Quebec:** CQLR c. P-39.1 as amended by Law 25 (S.Q. 2021, c. 25). `[web search — verify]` **s. 3.3** (PIA for any project of acquisition/development/redesign of an information system or electronic service delivery) and **s. 17** (PIA before any communication of PI outside Quebec) — **both section numbers confirmed by web search on 2026-08-04**; capture the CAI guide pinpoint on first fetch.
- **Federal:** PIPEDA, S.C. 2000, c. 5 (no PIA obligation — cite only for the accountability principle); TBS Directive on Privacy Impact Assessment (federal institutions only).

### Brazil (Phase 2 module)

- **Lei nº 13.709/2018 (LGPD)** — `[web search — verify]` RIPD at **Arts. 5(XVII) and 38**; Art. 38 sole paragraph prescribes the minimum content (types of data, collection/security methodology, risk-mitigation analysis). Confirmed by web search on 2026-08-04; official text: planalto.gov.br `/ccivil_03/_ato2015-2018/2018/lei/l13709.htm`.
- **ANPD resolutions** — **correction from verification (2026-08-04):** Resolução CD/ANPD **nº 2, de 27 de janeiro de 2022** is the **small-agents** regulation ("agentes de tratamento de pequeno porte"), **not** a high-risk-criteria instrument — an earlier recall mis-attributed the high-risk criteria to it. The ANPD's high-risk **indicators are expressly non-exhaustive** (guidance-level), so do not cite a numbered high-risk list as if it were binding. **Resolved (2026-08-11):** the international-transfer regulation and Brazilian SCCs are **Resolução CD/ANPD nº 19, de 23 de agosto de 2024** (`[web search — verify]` — number/date confirmed against the gov.br listing surfaced by search; SCC grace period ended 2025-08-23). RIPD regulation still pending as of 2026-08-11; see the module's volatility banner. **EU–Brazil mutual adequacy adopted 2026-01-27** — see the module's transfer notes.

### China (Phase 2 module)

- **PIPL (2021)** — `[web search — verify]` **Art. 55** (the six enumerated PIPIA triggers plus the material-impact catch-all), **Art. 56** (content: lawful/legitimate/necessary; impact and risk; measures lawful/effective/commensurate), **28** (sensitive PI), **38–40** (export routes); the **≥3-year retention** of the PIPIA report is confirmed. All corroborated by web search on 2026-08-04; authoritative text is Chinese — record which translation was relied on.
- **GB/T 39335-2020** (PI security impact assessment methodology) — `[web search — verify]` national standard confirmed; record how the text was obtained.
- **CAC cross-border rules** — 2022 security-assessment measures, 2023 SCC measures, March 2024 relaxation provisions. Thresholds move; re-verify per run, not per session.

### Asia-Pacific and Switzerland (Phase 3 modules)

- **India:** `[web search — verify]` DPDP Act, 2023 **s. 10** (SDF designation) and DPDP Rules, 2025 **Rule 13** (SDF additional obligations: DPIA **and** independent audit **once every twelve months**, with significant observations reported to the **Data Protection Board**); Rules notified 2025-11-13. **Rule 13 confirmed by web search on 2026-08-04**; phase-in corroborated 2026-08-11 — **Rule 13 commences 2027-05-13** (Phase III), so the SDF DPIA duty is not yet live; no SDF designations issued. Check designation notifications and the pending MeitY timeline-acceleration proposal every India-scope run.
- **Switzerland:** `[web search — verify]` revFADP, **SR 235.1**, in force 2023-09-01 — **Art. 22** (DPIA on likely high risk to personality/fundamental rights; Ordinance Art. 14), **Art. 23** (FDPIC consultation on residual high risk), **Art. 23(4)** (the data-protection-adviser alternative that lets a controller refrain from consulting the FDPIC — the reason the builder treats this regime as non-derivable). All corroborated by web search on 2026-08-04. FDPIC guidance at edoeb.admin.ch.
- **Singapore:** PDPA 2012 as amended; PDPC Guide to DPIAs (2021 — still current edition as of 2026-08-11) — PDF URL recorded in the module `[web search — verify]`.
- **Malaysia:** PDPA 2010 + Amendment Act 2024 (fully in force 2025-06-01); **final JPDP DPIA Guideline issued Apr/May 2026** (with DPbD and ADM/Profiling guidelines) — `[web search — verify]` (corroborated 2026-08-11); module still carries a volatility banner pending a read of the guideline text.
- **Australia:** Privacy Act 1988 + POLA Act 2024 (tort in force 2025-06-10, first applied in *Kurraba Group v Williams* [2025] NSWDC 396; APP 1.7 ADM transparency 2026-12-10); OAIC PIA guide; agencies APP Code.
- **South Korea:** PIPA Art. 33 + Enforcement Decree thresholds (public-institution PIA through PIPC-designated agencies, submitted to the PIPC); PIPA amendment promulgated 2026-03-10, effective 2026-09-11 (fines to 10% of turnover) — `[web search — verify]` (corroborated 2026-08-11).

### Africa and Southeast Asia (Phase 4+ modules)

All corroborated by web search on 2026-08-04 (`[web search — verify]`); primary texts not fetched.

- **Kenya:** Data Protection Act, 2019 (No. 24 of 2019), s. 31 — DPIA duty, s. 31(4) definition, and the Data Commissioner prior-consultation duty on high risk (the third derivable regime in the builder). Official text at kenyalaw.org. **Resolved 2026-08-11:** the 60-day consultation machinery (incl. deemed approval after 60 days' silence) sits in the **Data Protection (General) Regulations, 2021 (LN 263/2021)** plus the ODPC Guidance Note — not in the Act; cite the Regulations for the timeline.
- **Vietnam:** PDP Law No. 91/2025/QH15 (passed 2025-06-26, effective 2026-01-01), implemented by **Decree 356/2025/ND-CP** (effective 2026-01-01, replacing Decree 13/2023/ND-CP and its dossier forms; 15-day appraisal / 30-day cure mechanics) — corroborated 2026-08-11; transfer impact dossier submitted to the MPS within 60 days of transfer start. Capture the Law's and Decree 356's article numbers for both dossiers on first fetch.
- **Indonesia:** Law No. 27/2022 (UU PDP), Art. 34 — DPIA for high-potential-risk processing with an enumerated high-risk list; implementing regulation pending (module carries a volatility banner).

### Regulation (EU) 2024/1689 (EU AI Act), as amended by Regulation (EU) 2026/1744

Cited for: Art. 6 and Annex III high-risk classification (employment, biometrics, education, credit, law enforcement); Art. 27 deployer Fundamental Rights Impact Assessment, which is additional to and not satisfied by a DPIA. **Timing (corroborated 2026-08-11):** the "Digital Omnibus on AI" — **Regulation (EU) 2026/1744**, OJ 24 July 2026, in force 27 July 2026 — postponed the Annex III high-risk obligations (incl. Art. 27) to **2027-12-02** and Annex I embedded high-risk to 2028-08-02, as fixed dates; Art. 50 transparency duties applied from 2026-08-02 as originally scheduled. `[web search — verify]` — the amending regulation's text has not been fetched. **Verify the CELEX identifiers and the Annex III sub-paragraph before citing** — this instrument pair is newer than the rest of this register and its numbering is the one most often misremembered.

---

## Tier B — guidance, opinions and case law. All UNVERIFIED.

Each entry: what it is, what it is cited for, where to verify, and what to capture when you do.

### WP248rev01 — WP29 Guidelines on DPIA

Article 29 Working Party, "Guidelines on Data Protection Impact Assessment (DPIA) and determining whether processing is 'likely to result in a high risk' for the purposes of Regulation 2016/679". Adopted 4 October 2017; endorsed by the EDPB 25 May 2018.

- **Cited for:** the nine criteria; the "two or more indicates high risk" rule of thumb; employees as vulnerable data subjects; the acceptance criteria a regulator checks a DPIA against.
- **Verify at:** `https://ec.europa.eu/newsroom/article29/items/611236`
- **Capture:** the section number for the nine criteria, and the annex number for the acceptance criteria. This skill cites both in most DPIAs and currently cites neither by number.
- **Status:** UNVERIFIED.

### WP251rev01 — WP29 Guidelines on Automated Decision-Making and Profiling

- **Cited for:** what makes human review meaningful rather than nominal; the Art. 22 analysis in §2.7.
- **Capture:** the passage on human review having authority and competence to change the decision. This is the single most load-bearing citation in any AI-in-HR DPIA and it should never go out unpinpointed.
- **Status:** UNVERIFIED.

### EDPB Recommendations 01/2020 — supplementary measures for transfers

- **Cited for:** the six-step transfer methodology; supplementary measures; whether SCCs suffice for a given transfer.
- **Capture:** the step numbering, and the paragraph on encryption with keys held outside the importer's jurisdiction.
- **Status:** UNVERIFIED. Confirm the current version — these Recommendations were revised after adoption.

### CNIL PIA guides (Methodology / Templates / Knowledge bases)

- **Cited for:** the severity and likelihood scales this skill's 3×3 matrix collapses; the three baseline feared events; the control catalogue. URLs are in `published-dpias.md`.
- **Capture:** the edition date, and the section defining the four severity levels — `risk-matrix.md` maps them to three and should cite the mapping's source precisely.
- **Status:** UNVERIFIED.

### CJEU, Schrems II — Case C-311/18

Data Protection Commissioner v Facebook Ireland and Maximillian Schrems, judgment of 16 July 2020.

- **Cited for:** invalidation of Privacy Shield; FISA 702 and EO 12333 as the identified deficiencies; the assessment obligation on the exporter.
- **Verify at:** the CJEU case register (curia.europa.eu) or EUR-Lex.
- **Capture:** the paragraph numbers for the FISA 702 / EO 12333 findings.
- **Status:** UNVERIFIED.

### EU–US Data Privacy Framework

Commission implementing decision on the adequate level of protection under the EU–US DPF, 10 July 2023; EDPB Opinion 5/2023.

- **Cited for:** whether a US importer's transfer needs SCCs and a TIA; the Schrems III monitoring point.
- **Litigation posture (corroborated 2026-08-11):** General Court dismissed the first annulment challenge (T-553/23 *Latombe v Commission*, 3 September 2025); **appeal pending before the CJEU, C-703/25 P**; the adequacy decision has not been suspended; US oversight (PCLOB quorum) concerns persist. `[web search — verify]`
- **Verify at:** the DPF Active list, `https://www.dataprivacyframework.gov/list`
- **Standing rule:** a vendor's certification is verified against the live list **at the time the DPIA is written**, never against the vendor's representation, and never against this file. This entry records where to look; it is not itself evidence of anyone's certification.
- **Status:** UNVERIFIED (and inherently time-sensitive — the underlying adequacy decision is subject to challenge).

### European Commission adequacy decisions — the live list

- **Cited for:** whether a destination country is adequacy-covered, which decides the entire shape of the transfer analysis (adequacy vs. SCC + TIA) per regime touched.
- **Verify at:** the Commission's adequacy page, `https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en` (UK addendum: the UK keeps its own adequacy regulations post-DUAA — check the ICO's international-transfers page for UK-side divergence).
- **Standing rule (same as the DPF list):** adequacy status is checked against the live list **at the time the DPIA is written** — never cited from this file, never from a vendor's representation, and never from model recall; adequacy decisions are adopted, amended, sunset and challenged. Cite the specific decision for the destination, with its date.
- **Status:** live register — the entry records where to look; only the fetched decision is citable.

### EDPB Register of final one-stop-shop decisions (Art. 60)

- **Cited for:** finding national DPA enforcement decisions on a processing type — the primary index for Step 1 analogs and for grounding a risk rating in what a DPA actually sanctioned.
- **Verify at:** `https://www.edpb.europa.eu/our-work-tools/consistency-findings/register-for-article-60-final-decisions_en`
- **Standing rule:** the register's summaries are EDPB-Secretariat-authored and expressly non-authoritative — cite the **underlying national decision** (fetched), never the summary. A summary read without the decision is `[web search — verify]` at best.
- **Status:** live register — surfaced by web search 2026-08-29; consult live, cite the fetched decision.

### EDPB Art. 65 binding decisions

- **Cited for:** the Board's binding resolution of DPA disputes — the strongest available signal of the harmonised EU position on a contested processing question (lawful basis for behavioural ads, children's data, transfer suspensions).
- **Verify at:** `https://www.edpb.europa.eu/our-work-tools/consistency-findings/binding-decisions_en`
- **Capture:** the decision number, adoption date, and paragraph relied on.
- **Status:** live register — consult live; cite the fetched decision with pinpoints.

### EDPB BCR approvals (Art. 64 opinions) and the BCR register

- **Cited for:** whether a named importer group holds approved Binding Corporate Rules — a transfer mechanism the analysis must verify, not assume. Shared ingestion surface with the sibling `bcr-registry` work: this skill carries the consumption rule, not the data.
- **Verify at:** edpb.europa.eu (Art. 64 opinions listing; the register of approved BCRs).
- **Standing rule (as for the DPF list):** a vendor's claim of approved BCRs is verified against the register **at the time the DPIA is written**, and the approving lead SA and approval date are captured.
- **Status:** live register — the entry records where to look.

**GDPRhub rule.** GDPRhub (gdprhub.eu) is a wiki-sourced index into DPA decisions and is often the fastest way to *find* one — but it is community-authored and may be used to find, **never to cite**. The citation is always to the primary decision, fetched; until fetched, a GDPRhub-surfaced finding is `[web search — verify]`, and wiki content never upgrades a tag.

### EDPB harmonised DPIA template (v1.0, 2026)

Adopted 10 March 2026, published 14 April 2026 with an Explainer; consultation closed 9 June 2026.

- **Cited for:** the standardised DPIA documentation structure SAs are expected to adopt or align with; complements (does not supersede) WP248rev01.
- **Verify at:** edpb.europa.eu (news and public-consultation pages).
- **Capture:** the template's section headings and the Explainer's guidance on mapping existing DPIA formats, so this skill's output template can carry an explicit crosswalk.
- **Status:** `[web search — verify]` (existence and dates corroborated 2026-08-11; document not fetched).

### ICO — DPIA guidance and the Art. 35(4) list

- **Cited for:** UK triggering analysis; the ICO's own mandatory-DPIA categories; ICO expectations on AI in HR. URLs in `published-dpias.md`.
- **Capture:** the ICO list entries actually relied on, individually — "the ICO list" is not a pinpoint.
- **Status:** UNVERIFIED. ICO guidance is being revised following the DUAA; check the page date.

### ICO enforcement — Serco Leisure (February 2024)

- **Cited for:** the UK position on workplace biometric time-and-attendance; the Art. 5(1)(a)/6/9 findings.
- **Capture:** the enforcement notice reference and date.
- **Status:** UNVERIFIED. Detail in `published-dpias.md`.

### CAI (Quebec) — companion guide on PIAs

- **Cited for:** Quebec Law 25 PIA methodology and the CAI's expectations; the outside-Quebec adequacy analysis.
- **Verify at:** cai.gouv.qc.ca (published September 2023; French — record translation status when citing to an anglophone reviewer).
- **Capture:** the guide's title, edition date, and the section on the outside-Quebec communication analysis.
- **Status:** UNVERIFIED.

### CPPA — final CCPA regulations and filing mechanics

- **Cited for:** California risk-assessment triggers, content, and the attestation/filing calendar (first filing 2028-04-01 covering 2026–2027).
- **Verify at:** cppa.ca.gov (regulations page and the 2025-09-23 approval announcement).
- **Capture:** the section numbers for the trigger list, content list, and submission requirements.
- **Status:** UNVERIFIED (build-time fetches returned 403; dates corroborated by secondary sources only).

### Colorado AG — CPA rules guidance and enforcement

- **Cited for:** Rule 8.04 content expectations; profiling assessment additions (Part 9); AG production mechanics.
- **Verify at:** coag.gov and the Colorado Secretary of State rules register.
- **Capture:** the Rule 8.04 sub-paragraph enumeration; the non-waiver provision's exact statutory cite.
- **Status:** UNVERIFIED.

### EDPB Guidelines 05/2020 on consent

- **Cited for:** consent is generally not freely given in employment and other power-imbalanced contexts — the §2.2 lawful-basis analysis.
- **Capture:** the paragraph on imbalance of power.
- **Status:** UNVERIFIED.

### Poplavska et al., "From Prescription to Description: Mapping the GDPR to a Privacy Policy Corpus Annotation Scheme" (JURIX 2020)

- **Cited for:** the category-level mapping between the OPP-115 privacy-policy annotation scheme (Wilson et al., ACL 2016) and GDPR principles/articles — the source informing the commitment-type crosswalk table in `references/notice-profile.md`. A method source, not legal authority: it grounds the *structure* of the notice-profile vocabulary, never a legal conclusion in a DPIA.
- **Verify at:** `https://usableprivacy.org/static/files/poplavska_jurix_2020.pdf` (mirror: NSF PAR, `https://par.nsf.gov/biblio/10257054`). The usableprivacy.org host was egress-blocked from the environment that added this entry.
- **Capture:** the paper's own category → article mapping tables, and reconcile the notice-profile crosswalk's GDPR column against them — the column ships `[web search — verify]` until that reconciliation has run.
- **Status:** `[web search — verify]` (existence, venue and authorship corroborated 2026-08-29; paper not fetched).

---

## Vendor terms — cite by version (Open Terms Archive)

Vendor privacy policies, DPAs and ToS are **vendor representations**, not authorities — the
Untrusted-Content Rule governs their weight. This section governs their *checkability*: a vendor
commitment quoted without a version anchor is a citation to a moving target, because vendors
revise terms silently and a DPIA's quote must remain verifiable at review time.

- **Rule:** where a DPIA relies on a vendor's published terms, quote verbatim and cite **as of a
  named version date** — the vendor's own "last updated" date, or, where the vendor is tracked by
  an Open Terms Archive collection (opentermsarchive.org; per-collection version repositories with
  dated permalinks), the OTA version date with the permalink recorded alongside the vendor's live
  URL. OTA changes the checkability of the citation, not its evidentiary weight.
- **Refresh diff:** on a Step 0.5 refresh of a prior DPIA that cited a vendor-terms version, diff
  the vendor's terms between that version date and today (OTA history where tracked; re-fetch and
  compare otherwise) — a material change feeds the cover-note reconciliation and the
  severity-floor analysis.
- **Coverage caveat:** OTA tracks a finite service list. Absence from OTA is absence of tracking,
  never evidence the terms are unchanged — the same "could not check ≠ checked and found nothing"
  rule Steps 0.5 and 1 already enforce.
- Indexed vendor commitments (a `role: vendor` profile entry per `references/notice-profile.md`)
  carry `version_date` for exactly this rule.

---

## Standing rules

1. **A citation with no pinpoint is not a citation.** "GDPR generally", "ICO guidance", "the CNIL methodology" — none of these survive review. If you cannot pinpoint it, say what you are relying on and mark it unverified.
2. **Tier B never goes out untagged.** The absence of network access is not a reason to drop the tag; it is the reason the tag exists.
3. **A DPIA that cites nothing is more defensible than one that cites something that does not exist.** If a proposition cannot be sourced, state it as counsel's reasoning and own it as such.
