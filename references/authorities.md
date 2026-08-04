# Recurring Authorities — Citation Register

Read this in Step 1 alongside `published-dpias.md`, and again when assembling Appendix A.

Almost every DPIA this skill produces cites the same fifteen-odd sources. Re-deriving them from memory each run is how fabricated pinpoints get into a filed document, and it is why a no-network run ends up tagging *everything* `[model knowledge — verify]` — which is honest but useless, because it gives the reviewing attorney no way to tell the settled citations from the risky ones.

This file separates them.

## How to use it

- **Tier A** entries are statutory and treaty-level instruments with stable public identifiers. Cite them as `[official publication]` using the identifiers below. The article and recital *text* for the GDPR provisions this skill relies on is reproduced in `references/legal-framework.md`; quote from there rather than from recall.
- **Tier B** entries are guidance, opinions, decisions and case law. They ship **UNVERIFIED**. Cite them as `[model knowledge — verify]` until a run actually fetches the source, and only then upgrade the tag on that citation.
- **Never upgrade a tag in this file from a search-result snippet.** Upgrading means: the document was fetched, the pinpoint was read, and the exact section reference was captured. Anything less stays UNVERIFIED.
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

**Chapter number not captured — do not cite without it.** `legislation.gov.uk` URLs take the form `/ukpga/{year}/{chapter}`; a bare `/ukpga/2025` identifies nothing. Look the Act up, record the chapter number here, and cite the specific amending section rather than the Act as a whole. Substantive analysis is in `references/jurisdictions/uk-gdpr.md`.

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

### EDPB Guidelines 05/2020 on consent

- **Cited for:** consent is generally not freely given in employment and other power-imbalanced contexts — the §2.2 lawful-basis analysis.
- **Capture:** the paragraph on imbalance of power.
- **Status:** UNVERIFIED.

---

## Standing rules

1. **A citation with no pinpoint is not a citation.** "GDPR generally", "ICO guidance", "the CNIL methodology" — none of these survive review. If you cannot pinpoint it, say what you are relying on and mark it unverified.
2. **Tier B never goes out untagged.** The absence of network access is not a reason to drop the tag; it is the reason the tag exists.
3. **A DPIA that cites nothing is more defensible than one that cites something that does not exist.** If a proposition cannot be sourced, state it as counsel's reasoning and own it as such.
