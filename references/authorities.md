# Recurring Authorities — Citation Register

Read this in Step 1 alongside `published-dpias.md`, and again when assembling Appendix A.

Almost every DPIA this skill produces cites the same fifteen-odd sources. Re-deriving them from memory each run is how fabricated pinpoints get into a filed document, and it is why a no-network run ends up tagging *everything* `[model knowledge — verify]` — which is honest but useless, because it gives the reviewing attorney no way to tell the settled citations from the risky ones.

This file separates them.

## How to use it

- **Tier A** entries are statutory and treaty-level instruments with stable public identifiers. Cite them as `[official publication]` using the identifiers below. The article and recital *text* for the GDPR provisions this skill relies on is reproduced in `references/legal-framework.md`; quote from there rather than from recall.
- **Tier B** entries are guidance, opinions, decisions and case law. They ship **UNVERIFIED**. Cite them as `[model knowledge — verify]` until a run actually fetches the source, and only then upgrade the tag on that citation.
- **Three tags, three levels of confidence — do not conflate the middle one with the top one.** `[model knowledge — verify]` is pure recall (highest fabrication risk). `[web search — verify]` means the identifier or pinpoint was **corroborated by independent web search but the primary source was not fetched and read** — better than recall, still not authority. `[official publication]` / a fully verified Tier B tag means **the document was fetched, the pinpoint was read, and the exact reference captured**. Moving a citation from recall to `[web search — verify]` is a real improvement and is allowed; moving it to `[official publication]` from a search snippet is **not** — that step requires the fetch.
- **On 2026-08-04 a corroboration pass ran** with web search available but primary-source fetches blocked (all official portals returned 403 to the fetch tool). It moved the non-EU statutory identifiers below from recall to `[web search — verify]`, filled the DUAA chapter number, and corrected one Brazilian resolution attribution. Every one of those still needs a primary-source fetch to reach `[official publication]`; the tags say so.
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

`[web search — verify]` **Chapter 18** — Data (Use and Access) Act 2025 (c. 18), Royal Assent **19 June 2025**. Official text: `https://www.legislation.gov.uk/ukpga/2025/18` (the "bare year path" problem is resolved — the chapter number is 18). Cite the specific amending section, not the Act as a whole; corroborated across the ICO's DUAA page and the legislation.gov.uk listing by web search on 2026-08-04, not yet fetched and read. Substantive analysis is in `references/jurisdictions/uk-gdpr.md`.

### US state statutes and rules (Phase 1 modules)

The **section identifiers** below were corroborated by independent web search on 2026-08-04 (`[web search — verify]`); the LII / Justia / official-portal texts were **not fetched**, so a primary-source read is still required to reach `[official publication]` and to capture sub-paragraph enumerations verbatim.

- **Colorado:** C.R.S. § 6-1-1309 (data protection assessments); Colorado Privacy Act Rules, 4 CCR 904-3 — **Rule 8.02 SCOPE, Rule 8.04 DATA PROTECTION ASSESSMENT CONTENT, Rule 9.06 assessments for profiling** (`[web search — verify]`, section titles confirmed; the enumerated 8.04 element list still to be read verbatim). Official rules PDF: coag.gov.
- **California:** Cal. Civ. Code § 1798.185(a)(15); CPPA regulations, **11 CCR Article 10 — § 7150 (when a risk assessment is required), § 7152 (risk assessment requirements)** (`[web search — verify]`), OAL-approved 2025-09-23, effective 2026-01-01, first filing due 2028-04-01, review at least every three years. Official statute PDF: `cppa.ca.gov/regulations/pdf/`.
- **Virginia pattern:** Va. Code § 59.1-580 and state analogs (CT, TX, OR, MT, DE, NH, NJ, MN, TN, IN, KY, NE, RI). Verify per state actually relied on; the list itself rolls forward session to session.

### Canada / Quebec (Phase 1 module)

- **Quebec:** CQLR c. P-39.1 as amended by Law 25 (S.Q. 2021, c. 25). `[web search — verify]` **s. 3.3** (PIA for any project of acquisition/development/redesign of an information system or electronic service delivery) and **s. 17** (PIA before any communication of PI outside Quebec) — **both section numbers confirmed by web search on 2026-08-04**; capture the CAI guide pinpoint on first fetch.
- **Federal:** PIPEDA, S.C. 2000, c. 5 (no PIA obligation — cite only for the accountability principle); TBS Directive on Privacy Impact Assessment (federal institutions only).

### Brazil (Phase 2 module)

- **Lei nº 13.709/2018 (LGPD)** — `[web search — verify]` RIPD at **Arts. 5(XVII) and 38**; Art. 38 sole paragraph prescribes the minimum content (types of data, collection/security methodology, risk-mitigation analysis). Confirmed by web search on 2026-08-04; official text: planalto.gov.br `/ccivil_03/_ato2015-2018/2018/lei/l13709.htm`.
- **ANPD resolutions** — **correction from verification (2026-08-04):** Resolução CD/ANPD **nº 2, de 27 de janeiro de 2022** is the **small-agents** regulation ("agentes de tratamento de pequeno porte"), **not** a high-risk-criteria instrument — an earlier recall mis-attributed the high-risk criteria to it. The ANPD's high-risk **indicators are expressly non-exhaustive** (guidance-level), so do not cite a numbered high-risk list as if it were binding. The international-transfer resolution number (recalled "19/2024") is **still unconfirmed** — a 2024 ANPD resolution search surfaced nº 15/2024 (incident communication), a different instrument; do not cite the transfer-resolution number until fetched. RIPD regulation still pending; see the module's volatility banner.

### China (Phase 2 module)

- **PIPL (2021)** — `[web search — verify]` **Art. 55** (the six enumerated PIPIA triggers plus the material-impact catch-all), **Art. 56** (content: lawful/legitimate/necessary; impact and risk; measures lawful/effective/commensurate), **28** (sensitive PI), **38–40** (export routes); the **≥3-year retention** of the PIPIA report is confirmed. All corroborated by web search on 2026-08-04; authoritative text is Chinese — record which translation was relied on.
- **GB/T 39335-2020** (PI security impact assessment methodology) — `[web search — verify]` national standard confirmed; record how the text was obtained.
- **CAC cross-border rules** — 2022 security-assessment measures, 2023 SCC measures, March 2024 relaxation provisions. Thresholds move; re-verify per run, not per session.

### Asia-Pacific and Switzerland (Phase 3 modules)

- **India:** `[web search — verify]` DPDP Act, 2023 **s. 10** (SDF designation) and DPDP Rules, 2025 **Rule 13** (SDF additional obligations: DPIA **and** independent audit **once every twelve months**, with significant observations reported to the **Data Protection Board**); Rules notified 2025-11-13. **Rule 13 confirmed by web search on 2026-08-04** (the module previously carried it as recalled). Check SDF designation notifications every India-scope run.
- **Switzerland:** `[web search — verify]` revFADP, **SR 235.1**, in force 2023-09-01 — **Art. 22** (DPIA on likely high risk to personality/fundamental rights; Ordinance Art. 14), **Art. 23** (FDPIC consultation on residual high risk), **Art. 23(4)** (the data-protection-adviser alternative that lets a controller refrain from consulting the FDPIC — the reason the builder treats this regime as non-derivable). All corroborated by web search on 2026-08-04. FDPIC guidance at edoeb.admin.ch.
- **Singapore:** PDPA 2012 as amended; PDPC Guide to DPIAs (2021) — PDF URL recorded in the module `[web search — verify]`.
- **Malaysia:** PDPA 2010 + Amendment Act 2024; JPDP DPIA consultation paper (2025) — watch status, module carries a volatility banner.
- **Australia:** Privacy Act 1988 + POLA Act 2024 (tort in force 2025-06-10; APP 1.7 ADM transparency 2026-12-10); OAIC PIA guide; agencies APP Code.
- **South Korea:** PIPA Art. 33 + Enforcement Decree thresholds (public-institution PIA through PIPC-designated agencies, submitted to the PIPC).

### Africa and Southeast Asia (Phase 4+ modules)

All corroborated by web search on 2026-08-04 (`[web search — verify]`); primary texts not fetched.

- **Kenya:** Data Protection Act, 2019 (No. 24 of 2019), s. 31 — DPIA duty, s. 31(4) definition, and the Data Commissioner prior-consultation duty on high risk (the third derivable regime in the builder). Official text at kenyalaw.org; capture the consultation subsection and confirm whether the reported 60-days-prior submission timeline is statutory or ODPC guidance.
- **Vietnam:** PDP Law No. 91/2025/QH15 (passed 2025-06-26, effective 2026-01-01), replacing Decree 13/2023/ND-CP; transfer impact dossier submitted to the MPS within 60 days of transfer start. Capture the Law's article numbers for both dossiers; the Decree 13 Arts. 24–25 structure is recall-level until then.
- **Indonesia:** Law No. 27/2022 (UU PDP), Art. 34 — DPIA for high-potential-risk processing with an enumerated high-risk list; implementing regulation pending (module carries a volatility banner).

### Regulation (EU) 2024/1689 (EU AI Act)

Cited for: Art. 6 and Annex III high-risk classification (employment, biometrics, education, credit, law enforcement); Art. 27 deployer Fundamental Rights Impact Assessment, which is additional to and not satisfied by a DPIA. **Verify the CELEX identifier and the Annex III sub-paragraph before citing** — this instrument is newer than the rest of this register and its numbering is the one most often misremembered.

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
- **Verify at:** the DPF Active list, `https://www.dataprivacyframework.gov/list`
- **Standing rule:** a vendor's certification is verified against the live list **at the time the DPIA is written**, never against the vendor's representation, and never against this file. This entry records where to look; it is not itself evidence of anyone's certification.
- **Status:** UNVERIFIED (and inherently time-sensitive — the underlying adequacy decision is subject to challenge).

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

---

## Standing rules

1. **A citation with no pinpoint is not a citation.** "GDPR generally", "ICO guidance", "the CNIL methodology" — none of these survive review. If you cannot pinpoint it, say what you are relying on and mark it unverified.
2. **Tier B never goes out untagged.** The absence of network access is not a reason to drop the tag; it is the reason the tag exists.
3. **A DPIA that cites nothing is more defensible than one that cites something that does not exist.** If a proposition cannot be sourced, state it as counsel's reasoning and own it as such.
