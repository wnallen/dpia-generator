# Published DPIAs and DPA Decisions — Reference Catalog

Consult this catalog in Step 1 before web-searching for analogs. These entries have been verified as live and useful for DPIA work. Where the analog fits the processing under assessment, prefer the analog to a fresh web search; where it does not, web-search for closer fits and add good finds back to this file over time.

For each entry: what it is, where it lives, what it's good for, and what it's not good for.

---

## Cross-Cutting Primary Sources (always-on)

### CNIL PIA Methodology, Templates, and Knowledge Bases (three guides)

The CNIL methodology is the most operationally detailed DPIA guide published by any EU supervisory authority. Three PDFs:

1. **Methodology** — the process. https://www.cnil.fr/sites/cnil/files/atoms/files/cnil-pia-1-en-methodology.pdf
2. **Templates** — the forms and worked examples. https://www.cnil.fr/sites/cnil/files/atoms/files/cnil-pia-2-en-templates.pdf
3. **Knowledge bases** — the catalog of controls and reference scoring. https://www.cnil.fr/sites/default/files/atoms/files/cnil-pia-3-en-knowledgebases.pdf

Best for: structuring the DPIA narrative, defining severity and likelihood scales, and selecting controls. The methodology is aligned with WP248rev01 — Annex of guide 1 maps each section to the WP29 criteria.

### Article 29 Working Party Guidelines on DPIA (WP248rev01)

Adopted 4 October 2017, endorsed by the EDPB. The authoritative source for the nine-criteria framework and the "two or more = mandatory DPIA" rule of thumb.

URL: https://ec.europa.eu/newsroom/article29/items/611236

Best for: triggering analysis (Step 0), criteria for an acceptable DPIA (the WP29 Annex 2 acceptance criteria are what a regulator will check against), and the discussion of vulnerable data subjects (employees as a vulnerable category).

### ICO DPIA Guidance and Sample Template

ICO's hub: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/

ICO sample DPIA template (the 7-step ICO format used by many UK controllers): typically referenced in the iubenda and Practical-GDPR write-ups when ICO's own page is unreachable.

ICO's "when do we need to do a DPIA" page, which restates the WP248rev01 nine criteria and ICO's own additional list under Art. 35(4): https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/when-do-we-need-to-do-a-dpia/

Best for: UK GDPR triggering analysis, the ICO's published list under Art. 35(4) (mandatory DPIA categories specific to the UK).

### EDPB Recommendations 01/2020 on Supplementary Measures for Transfers (Schrems II)

The six-step TIA methodology. Reference for any DPIA touching non-adequacy cross-border transfers.

Best for: structuring the TIA section/appendix; identifying supplementary measures (technical, contractual, organizational); evaluating whether SCCs are sufficient for the specific transfer.

### CNIL Transfer Impact Assessment Guide (2024)

CNIL's operationalization of EDPB Recommendations 01/2020 with tables and step-by-step process. Available in English. The cleanest published walkthrough for a real TIA.

Best for: TIA appendix to a DPIA where the transfer is one component of a larger processing assessment.

---

## Sector / Activity-Specific Analogs

### Live Facial Recognition / Biometric Identification by Private or Public Actor

**Metropolitan Police Service Retrospective Facial Recognition (RFR) DPIA — published**
URL: https://www.met.police.uk/SysSiteAssets/media/downloads/force-content/met/advice/lfr/new/mps-rfr-dpia-v1-web.pdf

A real, full-text published DPIA by a major controller for a high-risk biometric processing activity. Even though it covers law enforcement processing (Law Enforcement Directive context, not pure GDPR), the structure, the necessity/proportionality reasoning, the risk articulation, and the control narrative are directly transferable. The Met explicitly addresses bias and accuracy concerns and incorporates the NPL accuracy testing.

Best for: live facial recognition, biometric matching, watchlist-based identification, retrospective image search across populations.

**ICO published case studies on Live Facial Recognition (LFR)**
ICO case studies hub: https://ico.org.uk/for-organisations/law-enforcement/case-studies/

Best for: shorter, didactic worked examples of LFR DPIA reasoning, useful for adapting the reasoning down to a smaller/private-sector deployment.

**ICO opinion on use of LFR by law enforcement (2021)** — establishes ICO's expectations on necessity, proportionality, and watchlist design. Useful even for private-sector facial recognition because ICO has signaled it expects equivalent rigor.

### Workplace Biometric Time-and-Attendance / Access Control

**CNIL Model Regulation on Biometric Workplace Access Control (2019)**
The CNIL's binding rules under French law on employee biometric data for access control. The Model Regulation: (1) lists the exhaustive types of biometric data that can be collected; (2) defines retention periods; (3) specifies mandatory technical and organizational measures; and (4) requires a DPIA, updated at least every three years.

Why it matters even for non-French controllers: the CNIL was the first DPA to articulate the now-prevailing EU view that employee consent for workplace biometrics is generally not freely given, and that justification must rest on a specific high-security context with demonstrated inadequacy of less intrusive means. The CNIL methodology has been followed (more restrictively) by AEPD (Spain), GPDP (Italy), APDD (Belgium), and now the ICO.

Best for: any workplace biometric DPIA — fingerprint, finger-vein, hand geometry, facial recognition for access control or time-and-attendance.

**ICO Enforcement Action against Serco (February 2024)**
ICO issued enforcement notices requiring Serco Leisure to (a) stop processing biometric data for monitoring employee attendance, and (b) destroy all biometric data not legally required to be retained within three months. Serco was found in contravention of Articles 5(1)(a), 6, and 9 UK GDPR for failing to establish an appropriate lawful basis for processing special category personal data.

Significance: this is the ICO's clearest signal that workplace biometric T&A faces a very steep justification burden in the UK. A DPIA for any UK-deployed biometric T&A system that does not directly address the Serco enforcement is incomplete. ICO accompanied the action with updated guidance on biometric recognition.

Best for: UK-deployed biometric T&A, biometric employee monitoring; the case is a near-template for the "this won't fly" residual risk conclusion.

**Spanish AEPD restrictive guidance on biometric workplace processing (2023)** — for multi-jurisdiction deployments, demonstrates the prevailing EU trend; Italian GPDP and Belgian APDD positions are similar.

### AI-Powered HR / Recruitment / Employee Screening

There is no single canonical published DPIA for AI hiring (most are confidential), but the regulatory landscape is well-documented:

**ICO guidance on AI and HR processing** — ICO has stated that employers were either not completing DPIAs before deploying AI hiring tools, or producing DPIAs that did not cover minimum requirements. Treat this as the ICO's stated expectation: AI in hiring requires a complete DPIA addressing automated decision-making, bias, transparency, and human review.

**Fisher Phillips, "AI and Employee Data Protection in the EU" (2026)** — practitioner-level summary of how Member State DPAs are converging on the view that DPIAs for AI-in-HR are mandatory.

**EU AI Act (Annex III, employment category)** — AI systems used in recruitment, evaluation, promotion, termination, task allocation, and worker monitoring are *high-risk* AI systems under Art. 6 and Annex III, triggering Art. 27 Fundamental Rights Impact Assessment in addition to GDPR DPIA. Reference both in the DPIA.

**WP29 / EDPB Guidelines on Automated Decision-Making and Profiling (WP251rev.01)** — required reading for any DPIA where the processing produces automated decisions with legal or similarly significant effect on data subjects.

Best for: AI in hiring, AI in performance evaluation, AI in promotion/termination decisions, AI-driven workforce management.

### EU-to-US Cross-Border Transfer with US Sub-processor

**EDPB Recommendations 01/2020 (above)** — the methodology.

**CNIL TIA Guide (above)** — the operational walk-through.

**Schrems II (CJEU C-311/18)** — the underlying case. FISA 702 and EO 12333 are the specific US laws the CJEU identified as failing the necessity-and-proportionality test.

**EU-US Data Privacy Framework (DPF)** — Commission adequacy decision of 10 July 2023. If the US importer is on the DPF Active list (https://www.dataprivacyframework.gov/list), DPF adequacy applies and the TIA is materially simplified. **Always verify DPF status against the live list at the time the DPIA is written, not against representations made by the vendor.**

**EDPB Opinion on the DPF (Opinion 5/2023)** — flags ongoing concerns even with DPF in place; useful for documenting the Schrems III monitoring obligation in the DPIA.

Best for: any DPIA involving a non-EU SaaS vendor, cloud provider, or sub-processor; transfers to non-adequacy jurisdictions.

### Public-Sector / Government Processing of Sensitive Data

**UK Home Office "Migrant Help" DPIA (partial, FOI-released)** — a real DPIA for asylum-seeker support processing, useful as a structural model for public-sector DPIAs touching vulnerable populations. URL: https://privacyinternational.org/sites/default/files/2022-02/FOI%2067544%20Annex%202%20-%20Redacted%20Migrant%20Help%20v0.3.pdf

Best for: public-sector DPIAs, processing of vulnerable populations, processing where the data subject cannot meaningfully consent.

### Children's Online Services / Information Society Services

**ICO Sample DPIA — Online Retail Service for Children (Age-Appropriate Design Code)** — the ICO published a worked sample DPIA for a fictional SME online retailer aimed at meeting Standard 2 of the Children's Code. Adapted from the ICO's general DPIA template. URL: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/dpia-tools/online-retail/

Best for: any ISS likely to be accessed by under-18s in the UK; useful as a structural model even for non-UK child-directed services.

---

## How to Add to This Catalog

When you find a useful published DPIA or DPA decision during a Step 1 web search, add it here in the same format: what it is, URL, what it's good for, what it isn't. Over time this becomes a powerful institutional resource and reduces the per-DPIA research burden.

A useful addition is one where you would actually re-read the source the next time a similar DPIA comes up. If it's just one more generic vendor blog post about DPIAs, leave it out — the catalog's value is in its curation, not its completeness.
