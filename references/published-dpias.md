# Published DPIAs and DPA Decisions — Reference Catalog

Consult this catalog in Step 1 before web-searching for analogs. Entries are useful for DPIA work and verified as live except where an entry carries its own `[web search — verify]` or UNVERIFIED flag — those were surfaced by search from an environment that could not fetch them, and must be fetched (and the flag removed) before being cited in a DPIA. Where the analog fits the processing under assessment, prefer the analog to a fresh web search; where it does not, web-search for closer fits and add good finds back to this file over time.

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

### EDPB Harmonised DPIA Template (v1.0, 2026) `[web search — verify]`

Adopted 10 March 2026, published 14 April 2026 with an Explainer (consultation closed 9 June 2026); surfaced by web search 2026-08-11, not fetched. Standardises DPIA documentation structure across SAs (methodology stays free choice); national templates are expected to converge on it.

Best for: checking whether the competent SA has adopted the template before finalising an EU-scope DPIA, and mapping this skill's output sections to the harmonised structure in the cover note. Entry point: edpb.europa.eu.

### ICO DPIA Guidance and Sample Template

ICO's hub: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/

ICO sample DPIA template (the 7-step ICO format used by many UK controllers). Third-party write-ups (iubenda, Practical-GDPR) reproduce the format and are sometimes easier to reach than ICO's own page, but they are secondary sources: use them to orient, cite ICO. If the ICO page will not resolve, say so under the No Silent Supplement rule rather than citing the reproduction as if it were the ICO's.

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

**Fisher Phillips, "AI and Employee Data Protection in the EU" (2026)** `[model knowledge — verify]` — practitioner-level summary of how Member State DPAs are converging on the view that DPIAs for AI-in-HR are mandatory. No URL has been captured for this entry and it has not been verified live. It is a secondary source in any event: do not cite it in a DPIA without first locating it and, better, the DPA guidance it summarizes. Every other entry in this catalog carries a URL; this one is the exception, and it is flagged rather than quietly relied on.

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

### Enterprise SaaS / Cloud Vendor Adoption (the most common real-world DPIA scenario)

The Dutch government (SLM Rijk, the central vendor-management office in the Ministry of Justice and Security) and SURF (the Dutch research-and-education ICT cooperative) commission full professional DPIAs from Privacy Company on the major SaaS/cloud vendors, negotiate remediations with the vendor, and **publish the complete DPIAs in English**. This is the closest thing that exists to a public corpus of "controller adopts Vendor X" DPIAs — the scenario most user requests to this skill will resemble. Entries below were surfaced by web search 2026-08-10; the build environment could not fetch them directly (egress proxy), so treat each as `[web search — verify]` until fetched on a live run.

**SURF / Privacy Company DPIA on Microsoft 365 Copilot (December 2024)**
URL: https://www.surf.nl/files/2024-12/20241218-dpia-microsoft-365-copilot.pdf
A full DPIA on a generative-AI assistant embedded in a productivity suite — the single best analog for any "we want to roll out an AI copilot/assistant" DPIA. SURF's accompanying position (risks remained "orange" despite Microsoft improvements) models honest residual-risk scoring: https://www.surf.nl/en/news/privacy-risks-microsoft-365-copilot-remain-orange-despite-improvements

**SURF / Privacy Company DPIA on Zoom (public versions: Feb 2022, updated April 2024)**
URLs: https://www.surf.nl/files/2022-03/dpia-zoom-25-february-2022_0.pdf and https://www.surf.nl/files/2024-04/20240403-final-public-version-updated-zoom-dpia.pdf
The pair is more valuable than either alone: the 2020/2021 assessment found 9 high risks; the 2022 and 2024 updates show the risks being negotiated down to zero through contractual and technical measures. A worked example of the inherent → residual → post-mitigation arc this skill's Step 3 item 9 encodes.

**SLM Rijk DPIAs on Microsoft Office 365 / Teams / OneDrive / SharePoint** — published via open.overheid.nl and the Privacy Company blog (index of public DPIAs and follow-ups): https://www.privacycompany.eu/blog/new-dpia-for-the-dutch-government-and-universities-on-microsoft-teams-onedrive-and-sharepoint-online ; example full text: https://open.overheid.nl/documenten/ronl-aba85735-5a7a-4a8c-9c7a-7755d6bef118/pdf
The Google Workspace and Google Cloud DPIAs/DTIAs followed the same publish-and-remediate pattern (announcements: https://workspace.google.com/blog/identity-and-security/eu-public-sector-dutch-approval-and-new-capabilities).

Best for: any SaaS, cloud, videoconferencing, productivity-suite, or embedded-AI-assistant adoption DPIA; diagnostic-telemetry risk analysis; vendor-negotiation mitigations (contractual controls with named vendor commitments); the DTIA (transfer) companion pattern.

### Health / Public-Health Technology

All UK entries are Crown-copyright publications on government domains; surfaced by web search 2026-08-10, `[web search — verify]` until fetched.

**NHS COVID-19 App DPIA (full text, versioned)** — one of the most scrutinized DPIAs ever published, revised across releases. URL (Oct 2021 release): https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/1028998/NHS_COVID_19_App_DPIA.pdf (the gov.uk publication page is marked withdrawn since the app closed in April 2023 — the document remains a first-rate structural model). Best for: consumer health apps, proximity/location processing, large-scale voluntary public-health processing.

**NHS England — Overarching DPIA for the Federated Data Platform (live programme)** — https://www.england.nhs.uk/long-read/overarching-data-protection-impact-assessment-dpia-for-the-federated-data-platform-fdp/ plus per-product DPIAs at https://www.england.nhs.uk/digitaltechnology/nhs-federated-data-platform/security-privacy/nhs-fdp-information-governance-framework/national-fdp-products/ — a current, maintained example of a layered DPIA architecture (overarching + product-level) for a national data platform with a controversial commercial processor. Best for: platform/programme DPIAs, layered DPIA structure, health data at national scale.

**NHS England — COVID-19 Data Store DPIA** (https://www.england.nhs.uk/publication/data-protection-impact-assessment-nhs-covid-19-data-store/) and **NHS England Digital — GPES Data for Pandemic Planning and Research DPIA** (https://digital.nhs.uk/coronavirus/gpes-data-for-pandemic-planning-and-research/data-protection-impact-assessment). Best for: secondary use of health data, research/planning reuse, emergency-powers processing.

**Ireland — HSE COVID Tracker App DPIA** — published in full with the app's source code (announcement: https://www.gov.ie/en/press-release/bb5d9-department-of-health-and-the-hse-today-announce-the-publication-of-the-covid-tracker-app-data-protection-impact-assessment-and-source-code/ ; documents on hse.ie). Best for: an Irish-DPC-supervised analog; transparency-by-publication posture.

### Public-Sector / Government Processing of Sensitive Data

**UK Home Office "Migrant Help" DPIA (partial, FOI-released)** — a real DPIA for asylum-seeker support processing, useful as a structural model for public-sector DPIAs touching vulnerable populations. URL: https://privacyinternational.org/sites/default/files/2022-02/FOI%2067544%20Annex%202%20-%20Redacted%20Migrant%20Help%20v0.3.pdf

Best for: public-sector DPIAs, processing of vulnerable populations, processing where the data subject cannot meaningfully consent.

**UK police published DPIAs beyond the Met RFR** `[web search — verify]` — **NPCC Police National Database DPIA v8** (https://www.npcc.police.uk/SysSiteAssets/media/downloads/publications/publications-log/national-crime-coordination-committee/2025/dpia-pnd-v8.pdf), the **Met Violence Harm Assessment DPIA** (https://www.met.police.uk/SysSiteAssets/media/downloads/met/about-us/violence-harm-index/violence-harm-assessment-data-protection-impact-assessment.pdf), the **Scottish Police Authority DESC (Digital Evidence Sharing Capability) DPIA, FOI-released** (https://www.spa.police.uk/publication-library/foi-2023-015-desc-dpia-and-supporting-information/), and force publication schemes that list DPIAs as a class (e.g. Dyfed-Powys: https://www.dyfed-powys.police.uk/foi-ai/dyfed-powys-police/publication-scheme/data-protection-impact-assessments/). Best for: national database processing, algorithmic risk-scoring of individuals, evidence-sharing platforms, LED-context structure.

**Scottish Government published DPIAs (gov.scot)** `[web search — verify]` — the Scottish Government routinely publishes full DPIAs for bills, regulations, and programmes (e.g. https://www.gov.scot/publications/data-protection-impact-assessment-dpia-scotlands-proof-concept-fund/). Searchable via gov.scot publications with type "impact assessment". Best for: legislative/policy-driven processing; a steady supply of ordinary, non-exotic DPIAs — useful precisely because most catalog entries are high-drama.

### Children's Online Services / Information Society Services

**ICO Sample DPIA — Online Retail Service for Children (Age-Appropriate Design Code)** — the ICO published a worked sample DPIA for a fictional SME online retailer aimed at meeting Standard 2 of the Children's Code. Adapted from the ICO's general DPIA template. URL: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/dpia-tools/online-retail/

Best for: any ISS likely to be accessed by under-18s in the UK; useful as a structural model even for non-UK child-directed services.

**ICO Sample DPIA — Mobile Gaming App** `[web search — verify]` — same series, Standard 2. URL: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/dpia-tools/mobile-gaming-app/

Best for: games, in-app purchases/engagement mechanics aimed at children, age assurance.

**ICO Sample DPIA — Connected Toy** `[web search — verify]` — same series, Standards 2 and 14. URL: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/dpia-tools/connected-toy/

Best for: IoT/connected devices for children, voice capture in the home, device + app + cloud processing chains.

---

## Non-EU Regulator Guidance and Templates (per-jurisdiction anchors)

Outside the EU/UK, published *completed* assessments are scarce — controllers do not publish
US state data protection assessments or Chinese PIPIAs. The anchors for Step 1 in these
regimes are the regulators' own **guides, rules and enforcement decisions**. Entries below are
UNVERIFIED until fetched (build-time fetches of several of these hosts returned 403; that is
a proxy condition, not evidence about the source).

### Quebec — CAI companion guide on PIAs (2023)

cai.gouv.qc.ca. The CAI's own methodology for Law 25 PIAs, in French. The closest thing to a
CNIL-guide analog in North America. Best for: structuring a `ca-qc` PIA; the outside-Quebec
communication analysis.

### Colorado — CPA Rules, Part 8 and 9 (4 CCR 904-3)

The most prescriptive assessment content list of any US regulator; functions as a de facto
template. Best for: the `complianceMap` element list for `us-co` and, by over-satisfaction,
every `us-state` jurisdiction.

### California — CPPA final regulations and supporting materials (2025)

cppa.ca.gov. The regulations themselves plus the CPPA's announcements and any published
practical guidance. Best for: `us-ca` trigger and content mapping; the ADMT
notice/opt-out/access architecture; filing mechanics and deadlines.

### Federal Canada — OPC PIA guidance; TBS Directive on PIA

priv.gc.ca / tbs-sct.canada.ca. Best for: public-sector-adjacent processing and
accountability framing where PIPEDA applies; the TBS directive is a full PIA methodology for
federal institutions.

### Brazil — ANPD RIPD FAQ and resolutions

gov.br/anpd. The April 2023 FAQ page is preliminary (the RIPD regulation is still pending as
of 2026-08-11 — see the volatility banner in the `br-lgpd` module). **Correction (aligned
2026-08-11):** the small-agents resolution (CD/ANPD nº 2/2022) does **not** carry the high-risk
criteria — the ANPD's high-risk indicators are non-exhaustive guidance, not a numbered list;
the transfer regulation and Brazilian SCCs are Resolução CD/ANPD nº 19/2024. Best for: the
`br-lgpd` trigger screen and demand-readiness posture.

### China — GB/T 39335-2020 and CAC cross-border materials

The national methodology standard for PI impact assessment, plus the CAC's security-assessment
and SCC-filing measures (the PIPIA report is part of the SCC filing package). Best for:
`cn-pipl` method alignment and the export-route analysis; re-verify thresholds every run.

### Singapore — PDPC Guide to Data Protection Impact Assessments (2021)

pdpc.gov.sg (PDF URL recorded in the `sg-pdpa` module). A complete regulator-authored DPIA
methodology with worked structure — the best APAC analog anchor. Best for: `sg-pdpa` runs and
as a structural model for any consent-centric regime.

### Australia — OAIC Guide to undertaking privacy impact assessments

oaic.gov.au. Ten-step regulator methodology; the agencies' published PIA registers
occasionally surface full public-sector PIAs — the APAC analog of the FOI-released UK
examples. Best for: `au-privacy` runs; public-sector analogs.

### South Korea — PIPC PIA program materials

pipc.go.kr. The designated-agency assessment criteria are the operative methodology for the
mandatory public-institution PIA. Best for: `kr-pipa` scoping; understanding what the formal
agency-run PIA will test.

### Kenya — ODPC Guidance Note on DPIAs

odpc.go.ke. The Data Commissioner's own DPIA methodology, plus a registration regime that
frames the compliance posture. Best for: `ke-dpa` runs; the reported 60-days-prior
submission timeline should be pinned to its source here on first fetch.

### Vietnam — MPS dossier forms

The prescribed impact-dossier forms issued under the PDP Law's implementing instruments
are the operative "template" — a Vietnam filing is made on the ministry's forms, not in
free prose. Best for: `vn-pdpl` runs; verify current form numbers before any real filing.

### Switzerland — FDPIC DPIA guidance

edoeb.admin.ch. Best for: `ch-fadp` runs and the Art. 23 consultation mechanics, including
the Art. 23(4) advisor alternative.

---

## Discovery Corpora — Where to Hunt When the Catalog Has No Fit

These are not single analogs but standing collections of published assessments, useful in Step 1 when nothing above matches the processing. Surfaced by web search 2026-08-10; verify on use.

- **WhatDoTheyKnow (UK FOI archive)** — https://www.whatdotheyknow.com — searchable archive of FOI requests and responses; searching "data protection impact assessment" plus the processing type surfaces FOI-released DPIAs from UK police forces, councils, NHS bodies, and departments (e.g. the Home Office View & Prove / Person Centric Data Platform DPIA thread: https://www.whatdotheyknow.com/request/data_protection_impact_assessmen_91). Quality varies; redactions common; provenance is excellent because the releasing authority is on the page.
- **Canada — federal PIA summaries (mandatory publication)** — the TBS Directive on PIA requires institutions to publish at least PIA summaries. Entry points: the Open Government Portal (e.g. https://open.canada.ca/data/en/dataset/2bd435b1-304c-418e-910c-5592754280ce for Shared Services Canada) and per-department pages (IRCC, Statistics Canada, Public Safety, Justice). Summaries, not full PIAs — best for scoping how a Canadian federal analog framed purposes and flows, and as the public-sector anchor for `ca-qc`-adjacent runs.
- **Australia — agency PIA registers (mandatory under the Privacy Code)** — since 1 July 2018, s. 15.1 of the Privacy (Australian Government Agencies – Governance) APP Code 2017 requires every agency to publish a register of its PIAs; some agencies publish full PIAs. Entry points: the OAIC's own register (https://www.oaic.gov.au/about-the-OAIC/access-our-information/our-privacy-impact-assessment-register) and any agency site + "privacy impact assessment register". The APAC public-sector analog supply for `au-privacy` runs.
- **New Zealand — Ministry of Health per-release PIAs for NZ COVID Tracer** — a PIA was published for every major app release and reviewed by the Privacy Commissioner; search health.govt.nz for "COVID Tracer privacy impact assessment". Best for: iterative PIA-per-release cadence as a living-document model.

## How to Add to This Catalog

When you find a useful published DPIA or DPA decision during a Step 1 web search, add it here in the same format: what it is, URL, what it's good for, what it isn't. Over time this becomes a powerful institutional resource and reduces the per-DPIA research burden.

A useful addition is one where you would actually re-read the source the next time a similar DPIA comes up. If it's just one more generic vendor blog post about DPIAs, leave it out — the catalog's value is in its curation, not its completeness.
