# UK GDPR / EU GDPR Divergence — DPIA-Relevant Notes

**Regime code:** `uk-gdpr` (divergence overlay on the EU GDPR spine — Model A).

Consult this whenever the user's processing has UK or dual UK/EU scope; its analysis feeds the Jurisdictional Divergence section (Section 6 of the .docx). The two regimes remain materially aligned but have diverged in specific places that change DPIA conclusions.

**Privilege posture:** same as the EU spine — the DPIA is internal counsel's work product; the ICO does not collect it absent an Art. 36 consultation or an investigation. The default privileged header stands. Note that UK litigation privilege is narrower than US work-product doctrine; legal-advice privilege covers lawyer-client communications, and a DPIA authored by non-lawyers without counsel's direction may fall outside it — which is an argument for keeping counsel in the drafting loop, recorded here rather than asserted in the document.

## The Data (Use and Access) Act 2025 (DUAA)

The DUAA came into force in stages from 2025. It amended the UK GDPR and the Data Protection Act 2018. The amendments most relevant to DPIA work:

### Lawful basis changes — recognized legitimate interests

DUAA introduces a list of "recognised legitimate interests" in a new UK GDPR Annex (national security, public security, defence, emergencies, crime prevention, safeguarding vulnerable individuals, democratic engagement) for which controllers can rely on Art. 6(1)(f) without a balancing test. For processing falling within these categories, the LIA section of the DPIA can be shorter, but should still explain the necessity step.

### Article 22 — automated decision-making

DUAA loosened the UK Art. 22. Under EU GDPR, Art. 22(1) creates a default right not to be subject to a solely automated decision producing legal or similarly significant effects, with three narrow exceptions. The UK position now permits more solely-automated decision-making provided the controller implements safeguards (notification, human review on request, ability to contest) — except where special-category data is processed, where the EU-style default still applies.

**Practical DPIA effect:**
- A solely automated decision touching only non-special-category data may be permissible under UK GDPR where it would not be under EU GDPR.
- A dual-jurisdiction deployment must comply with the stricter EU position.
- For processing in scope of UK GDPR only, the DPIA's Art. 22 section can rely on the safeguards model; for processing in scope of EU GDPR, the DPIA must still establish that the processing falls into one of the Art. 22(2) exceptions.
- For high-risk AI in employment / hiring contexts, the EU AI Act (which applies extraterritorially to any deployer placing outputs on the EU market) and EDPB guidance still create strong de facto pressure to retain meaningful human review even for UK-only deployments.

### International transfers

DUAA recasts the UK approach to international transfers around a "data protection test" — broadly equivalent to adequacy but framed more flexibly. The UK government has greater discretion to recognize a third country as providing adequate protection. **Practical effect:** the UK's adequacy list and the EU's adequacy list will diverge over time, and a transfer that is permissible under UK GDPR may still require SCCs and a TIA under EU GDPR.

For UK transfers: use the UK International Data Transfer Agreement (IDTA) or the UK Addendum to the EU SCCs, plus a Transfer Risk Assessment (TRA) — the ICO's UK equivalent of the EDPB Recommendations 01/2020 TIA.

For EU transfers: use the EU SCCs (2021 modular version) plus an EDPB-style TIA.

### Cookies and electronic communications (PECR-equivalent)

DUAA narrowed the consent requirements for certain low-risk cookie purposes (statistical analytics, performance measurement). Not typically core to DPIA work, but relevant when the processing under assessment involves website analytics or session tracking.

### DPO and DPIA process

DUAA replaced the EU GDPR's DPO role with a "Senior Responsible Individual" (SRI) concept for UK GDPR purposes, with a slightly modified set of responsibilities. The Art. 35(2) requirement to seek the DPO/SRI's advice on a DPIA still applies, but the title and the precise statutory duties differ.

For dual-jurisdiction controllers, the practical answer is to retain a DPO meeting the EU GDPR criteria; that person can also fulfil the UK SRI role.

## Where the DPIA's Conclusion Could Materially Differ

When writing Section 6 of the DPIA, focus on the places where UK and EU positions would actually drive a different *conclusion*, not just different terminology:

| Area | EU GDPR position | UK GDPR position | DPIA effect |
|---|---|---|---|
| Solely automated decisions (non-special-category) | Default prohibited (Art. 22(1)), narrow exceptions | Permitted with safeguards under DUAA | UK-only deployment can permit ADM that EU deployment cannot |
| Legitimate interests for recognised categories | Three-part LIA required | LIA balancing step not required for recognised interests | Shorter LIA permissible for UK-scope recognised interests |
| Transfers to a "non-adequate" third country | EU SCCs + TIA + supplementary measures | UK IDTA / UK Addendum + TRA + supplementary measures (UK position on specific countries may differ) | Watch for cases where UK has recognized adequacy but EU has not (or vice versa) |
| Workplace biometric processing | EU-wide pattern of restrictive enforcement (CNIL, AEPD, GPDP, APDD) | ICO has signaled equivalent restrictiveness (Serco 2024 enforcement) | Effectively aligned — both jurisdictions hostile to workplace biometric T&A |
| DPO consultation | Required where DPO designated (Art. 35(2)) | Required for SRI under DUAA | Substantively similar; document under whichever applies |

## Default Position for Dual-Jurisdiction DPIAs

When the processing has both UK and EU scope, apply the **higher** standard from each regime. State this explicitly in Section 6: "Where UK GDPR permits a less restrictive approach than EU GDPR, this DPIA applies the EU GDPR standard to maintain a single defensible compliance posture." This is what most cross-jurisdictional controllers do, and it removes the need to maintain two versions of the same DPIA.

State the exception clearly: where the controller wants the benefit of UK divergence (e.g., to deploy an ADM feature in the UK that would not pass Art. 22(1) in the EU), the DPIA must explicitly carve out the UK-only deployment and analyze it on its own.

## Source Notes

- Data (Use and Access) Act 2025 — UK Parliament. `[web search — verify]` **Chapter 18** — the Act is Data (Use and Access) Act 2025 (c. 18), Royal Assent 19 June 2025; cite `https://www.legislation.gov.uk/ukpga/2025/18` (the bare-year-path problem is resolved). Chapter number corroborated by web search on 2026-08-04 against the ICO's DUAA page and the legislation.gov.uk listing, not yet fetched and read; cite the specific amending section rather than the Act as a whole.
- ICO published guidance on DUAA changes — refresh from https://ico.org.uk before each material DPIA touching UK scope, as ICO's interpretation continues to evolve
- ICO's "When do we need to do a DPIA?" page — the UK-specific Art. 35(4) list of mandatory DPIA triggers
- ICO Transfer Risk Assessment Tool — the UK equivalent of the EDPB TIA methodology
