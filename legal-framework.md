# Legal Framework Reference

Read this before completing the Article 35(1)/(3) triggering screen in Step 0, before scoping the necessity/proportionality assessment in Step 2, and before deciding whether Article 36 prior consultation is required in Step 4.

## GDPR Article 35 — The Statutory Hook

**Art. 35(1):** Where a type of processing, in particular using new technologies, and taking into account the nature, scope, context and purposes of the processing, is likely to result in a high risk to the rights and freedoms of natural persons, the controller shall, prior to the processing, carry out a DPIA.

**Art. 35(3) — three statutory triggers where a DPIA is always required:**
- (a) systematic and extensive evaluation of personal aspects based on automated processing, including profiling, on which decisions are based that produce legal or similarly significant effects;
- (b) processing on a large scale of special categories of data (Art. 9) or data on criminal convictions and offences (Art. 10);
- (c) systematic monitoring of publicly accessible areas on a large scale.

**Art. 35(4):** Supervisory authorities publish lists of processing operations subject to mandatory DPIA. The ICO list, the CNIL list, and the EDPB opinions on the 22 Member State lists are the authoritative reference points beyond the Art. 35(3) statutory list.

**Art. 35(7) — required content (this is the structure of your DPIA):**
- (a) a systematic description of the envisaged processing operations and the purposes;
- (b) an assessment of the necessity and proportionality of the processing operations in relation to the purposes;
- (c) an assessment of the risks to the rights and freedoms of data subjects;
- (d) the measures envisaged to address the risks, including safeguards, security measures and mechanisms to ensure the protection of personal data and to demonstrate compliance.

**Art. 35(2):** Controller shall seek the advice of the DPO, where designated, when carrying out a DPIA.

**Art. 35(9):** Where appropriate, the controller shall seek the views of data subjects or their representatives on the intended processing, without prejudice to the protection of commercial or public interests or the security of processing operations.

**Recital 84:** A DPIA should include the measures, safeguards and mechanisms envisaged for mitigating the risk, ensuring the protection of personal data and demonstrating compliance.

**Recital 90:** "Nature, scope, context and purposes" plus the origin, nature, particularity and severity of the risks are the substantive content of the assessment.

**Recital 91:** Large-scale processing operations which aim to process a considerable amount of personal data at regional, national, or supranational level and which could affect a large number of data subjects and which are likely to result in a high risk should be subject to a DPIA.

## GDPR Article 36 — Prior Consultation

**Art. 36(1):** The controller shall consult the supervisory authority prior to processing where a DPIA indicates that the processing would result in a high risk in the absence of measures taken by the controller to mitigate the risk.

The practical reading post-EDPB guidance: if your DPIA shows **residual** (post-control) risk that is still High, you must consult the supervisory authority *before* starting the processing. This is not a notification; it is a stop-the-line obligation. Build your DPIA's executive summary so this flag is unmissable.

## WP29 Nine Criteria (WP248rev01, October 2017)

The Article 29 Working Party identified nine criteria. WP29's rule: meeting two or more criteria generally indicates the processing is likely to result in high risk and a DPIA should be conducted. Meeting one criterion may also trigger the requirement depending on context.

1. **Evaluation or scoring**, including profiling and predicting (e.g., aspects concerning performance at work, economic situation, health, personal preferences or interests, reliability or behavior, location or movements).
2. **Automated decision-making with legal or similar significant effect** (Art. 22(1)).
3. **Systematic monitoring** — observing, monitoring or controlling data subjects, including data collected through "a systematic and routine observation, sometimes in public spaces."
4. **Sensitive data or data of a highly personal nature** — Art. 9 special category data, Art. 10 criminal data, and data of a highly personal nature (financial data, location data, electronic communications).
5. **Data processed on a large scale** — judged by number of data subjects, volume of data, duration of processing activity, and geographical extent.
6. **Matching or combining datasets** from different sources where the combination would exceed the reasonable expectations of the data subject.
7. **Data concerning vulnerable data subjects** — employees (because of the power imbalance), children, patients, asylum seekers, the elderly, mentally ill, those experiencing financial difficulty.
8. **Innovative use or applying new technological or organizational solutions** — IoT, AI/ML, biometrics, combined fingerprint and facial recognition for improved physical access control.
9. **Processing that prevents data subjects from exercising a right or using a service or a contract** — including processing to allow, modify, or refuse data subjects access to a service or entry into a contract.

Source: Article 29 Working Party, "Guidelines on Data Protection Impact Assessment (DPIA) and determining whether processing is 'likely to result in a high risk' for the purposes of Regulation 2016/679," wp248rev.01, adopted 4 October 2017. Endorsed by the EDPB on 25 May 2018.

## Triggering Logic to Apply in Step 0

Document your triggering analysis in this exact form in the DPIA cover note:

1. Does the processing fall within Art. 35(3)(a), (b), or (c)? If yes → mandatory DPIA, stop here.
2. Is the processing on the ICO/CNIL/other applicable DPA's published "DPIA always required" list? If yes → mandatory DPIA, stop here.
3. How many WP29 nine criteria does the processing meet? If two or more → mandatory DPIA, in line with WP29 guidance. If one → mandatory DPIA likely; explain the reasoning.
4. If zero criteria met → DPIA is prudential, not mandatory. Conduct it as a voluntary Art. 24 accountability exercise.

## Lawful Basis Drill-Down for Step 2

Identify the Art. 6(1) basis explicitly. For special-category data, identify the Art. 9(2) condition in addition.

- **(a) consent** — must be freely given, specific, informed, unambiguous; in employment, government, and similarly power-imbalanced contexts, consent is **generally not freely given** (EDPB Guidelines 05/2020 on consent; CNIL position; ICO position).
- **(b) contract** — necessity test is strict: would the contract still function without this processing?
- **(c) legal obligation** — must be a specific legal obligation under EU or Member State law, not a vague best-practice expectation.
- **(d) vital interests** — narrow; effectively limited to life-and-death scenarios.
- **(e) public task** — for public authorities or processing carried out under a specific public-interest mandate.
- **(f) legitimate interests** — requires a three-part LIA: purpose (is the interest legitimate?), necessity (is processing necessary to achieve it?), balancing (does the controller's interest outweigh the data subject's rights and reasonable expectations?). Not available to public authorities in performance of their tasks (Art. 6(1) closing paragraph).

For Art. 9 special-category data, identify which of (a)–(j) applies. For Art. 9(2)(b) (employment/social-security context), check the Member State's national derogation under Art. 9(2)(b).

For Art. 10 criminal data, processing must be authorized by EU or Member State law providing appropriate safeguards.

## EDPB Recommendations 01/2020 — Transfers (Schrems II)

For any DPIA touching cross-border transfers to a non-adequacy jurisdiction:

A separate Transfer Impact Assessment (TIA) is required alongside the DPIA, following the EDPB's six-step methodology (know your transfer; identify the transfer tool; assess third-country law; identify supplementary measures; take procedural steps; re-evaluate periodically). The CNIL's published TIA guide operationalizes this for French-led assessments.

For transfers to the United States:
- If the importer is **EU-US Data Privacy Framework certified**, the DPF provides adequacy and a separate TIA is not strictly required — but document that the certification was verified on the DPF list, and note the Schrems III litigation risk.
- If the importer is **not DPF certified**, SCCs plus a TIA are required, with supplementary measures (most commonly customer-managed encryption keys) addressing FISA 702 and EO 12333 risks identified in Schrems II.

The TIA can live as an appendix to the DPIA where the transfer is one component of a broader processing assessment, or as a standalone document. Either way, the DPIA must reference it.

## EU AI Act Intersection

For DPIAs covering high-risk AI systems (Annex III categories include employment/HR, biometric identification, education, credit scoring, law enforcement, critical infrastructure), the AI Act imposes a separate Fundamental Rights Impact Assessment (FRIA) obligation on deployers (Art. 27 EU AI Act). The DPIA and FRIA cover overlapping but distinct ground:

- **DPIA**: GDPR-driven, focused on personal data processing risks to data subjects.
- **FRIA**: AI Act-driven, broader fundamental rights scope, including non-personal-data harms (discrimination, dignity, freedom of expression).

A well-scoped DPIA for a high-risk AI system can satisfy substantial portions of the FRIA, but they are not identical. Flag in the DPIA cover note where a separate FRIA is also required and whether the controller intends to produce one or merge it with the DPIA.
