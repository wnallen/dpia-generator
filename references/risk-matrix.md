# Risk Matrix Reference

Read this before scoring risks in Step 3. The matrix is consistent with CNIL's PIA methodology and WP29 guidance. ENISA's breach severity methodology is a useful supplementary scoring tool for the severity dimension but is post-breach in orientation; this matrix is prospective.

## The 3×3 Matrix

| Likelihood ↓ / Severity → | **Low (Negligible / Limited)** | **Medium (Significant)** | **High (Maximum)** |
|---|---|---|---|
| **High** (will likely occur) | Medium | **High — Art. 36 flag** | **High — Art. 36 flag** |
| **Medium** (could occur) | Low | Medium | **High — Art. 36 flag** |
| **Low** (unlikely) | Low | Low | Medium |

Use this exact mapping to convert paired (likelihood, severity) scores into a single residual risk rating. The mapping is not a naive product of the two scores: no cell in which either dimension scores High is allowed to rate Low, because a Maximum-severity outcome for the data subject is the controlling consideration even where the controller considers it unlikely. `scripts/build_dpia.js` implements this table and derives every rating in the .docx from it — the script, not the drafter, owns the mapping.

**Article 36 applies to any High residual rating.** Art. 36(1) engages on residual high risk however that rating is reached, so a Medium likelihood × High severity residual triggers prior consultation exactly as High × High does. Do not treat the top-right corner cell as the only trigger; the builder marks every High-rated residual row.

**Color coding for the .docx output:**
- Low → green (`#C6EFCE` fill, `#006100` text)
- Medium → amber (`#FFEB9C` fill, `#9C5700` text)
- High → red (`#FFC7CE` fill, `#9C0006` text)

## Severity Scoring — Judged from the Data Subject's Perspective

Severity measures the magnitude of impact *on the data subject*, not the inconvenience or reputational impact to the controller. The CNIL methodology defines four severity levels; this skill collapses them to three for the 3×3 matrix:

| CNIL 4-level | This skill's 3-level | What it looks like for the data subject |
|---|---|---|
| Negligible | **Low** | Data subject experiences no or minor inconvenience, easily overcome (e.g., re-entering data; a minor account reset). |
| Limited | **Low–Medium** boundary; default to Low unless aggravating factors | Significant inconvenience that the data subject can resolve with effort (re-entering credentials, dealing with annoying targeted advertising, minor administrative tasks). |
| Significant | **Medium** | Material consequences the data subject can overcome with serious difficulty — financial loss recoverable through dispute, identity theft requiring credit monitoring, reputational harm in a local context, defamation, blackmail risk, denial of a non-essential service. |
| Maximum | **High** | Significant or irreversible consequences the data subject cannot overcome — long-term financial harm, employment loss, loss of housing, physical or psychological harm, identity-document compromise, exposure of sex life or political/religious views in hostile contexts, loss of life or liberty. |

**Aggravators to bump severity up:**
- Special category data (Art. 9) or criminal data (Art. 10) involved.
- Vulnerable data subjects involved (children, employees in power-imbalance situations, asylum-seekers, patients, the financially distressed).
- Cross-border exposure to jurisdictions with hostile surveillance regimes.
- Irrevocability of the data (biometric templates cannot be reissued like a password).
- Automated decision-making with significant effect.
- Large scale of affected data subjects (impact amplification, not per-individual severity, but relevant where regulators have signaled it).

**Mitigators to bump severity down:**
- Pseudonymization or aggregation that meaningfully reduces re-identification risk.
- Genuinely de-identified data (rare in practice; the burden of proof is high).
- Narrow categorical scope (only one data field, only one data subject category).

## Likelihood Scoring — Threat-Actor Capability × Asset Vulnerability

Likelihood estimates the probability the feared event will materialize before the controller detects and remediates it. Per the CNIL methodology, it is driven by:

1. **Risk source capability** — Who would cause this? A sophisticated nation-state actor? A motivated insider? An opportunistic criminal? A negligent employee? An accidental misconfiguration?
2. **Supporting asset vulnerability** — How exposed is the underlying system to the threat? Is it patched, segmented, access-controlled, logged? Is the relevant data flow visible to monitoring tools?
3. **Existing control strength** — How likely is the existing control set to detect and respond before the feared event causes impact?

| Level | Threshold |
|---|---|
| **Low** | Would require unusual coincidence of factors; mature controls in place; threat actor capability and motivation low; no historical occurrence of this pattern in comparable controllers. |
| **Medium** | Plausible scenario; standard controls in place but with known gaps; threat actor capability and motivation moderate; some industry-wide history of this pattern. |
| **High** | Realistic and probably inevitable absent intervention; controls weak or absent; threat actor capability and motivation high; this pattern has materialized at comparable controllers. |

## Inherent vs. Residual

For every risk, score it twice:

- **Inherent** — likelihood and severity *before* any controls are applied. This is the "raw" risk of the processing as designed.
- **Residual** — likelihood and severity *after* the existing and planned controls are accounted for. Severity rarely changes between inherent and residual (the impact on the data subject if the breach occurs is largely independent of controls, with exceptions like pseudonymization that genuinely reduce identifiability). Likelihood is where controls do most of their work.

Show both ratings in the DPIA risk register table. A controller whose residual risks are uniformly Low has either an excellent control environment or a self-serving assessment; the document should make clear which.

## The Three CNIL Feared Events — Always Assess These

The CNIL methodology requires assessment of three baseline feared events, derived from the CIA triad applied to personal data:

1. **Illegitimate access** to personal data — breach of confidentiality. Who could see the data who should not?
2. **Unwanted modification** of personal data — breach of integrity. What changes to the data could harm the data subject?
3. **Disappearance / loss** of personal data — breach of availability. What does the data subject lose if the data is unrecoverable?

Address each explicitly, even briefly, for every DPIA. Then add bespoke risks driven by the processing type.

## Bespoke Risk Categories by Processing Type

Add these on top of the three baseline events when relevant:

**AI / ML processing:**
- Discriminatory or biased automated decision-making affecting protected characteristics.
- Training data leakage / model memorization of personal data.
- Vendor-side use of customer data to train or improve models without authorization.
- Model opacity preventing meaningful Art. 22 explanation rights.
- Model drift causing degraded accuracy over time without detection.
- Adversarial inputs causing erroneous outputs that harm data subjects.

**Biometric processing:**
- Irrevocability of biometric templates if compromised (cannot be reissued).
- Function creep — biometric data collected for one purpose used for another.
- Coerced consent in employer/employee contexts.
- Disparate accuracy across demographic groups.
- Special-category status of biometric data when used for unique identification (Art. 9(1)).

**Cross-border transfers:**
- Foreign government access requests bypassing EU data subject rights.
- Inadequate redress mechanisms in the importer's jurisdiction.
- Onward transfer to additional jurisdictions without controller visibility.
- Encryption keys held in the importer's jurisdiction defeating supplementary measures.

**Employee monitoring:**
- Chilling effect on legitimate employee activity (concerted action, whistleblowing, union organization).
- Function creep from operational monitoring to performance management.
- Power-imbalance invalidating consent as a lawful basis.

**Children's data:**
- Inadequate age verification leading to processing without parental consent where required.
- Profile-building creating long-term records the data subject cannot meaningfully consent to later in life.
- Persuasive design / nudging exploiting developmental vulnerability.

**Large-scale public-area monitoring:**
- Chilling effect on freedom of assembly and expression.
- Bystander capture (data subjects not the intended targets).
- Watchlist false positives leading to wrongful detention or denial of service.

## Risk Quality Standards

Risks in a DPIA should be **specific and tied to the design** — concrete enough that a reviewing attorney or DPO can imagine the actual scenario and a reasonable mitigation. Generic risks pad the document, train readers to skim, and signal that the analysis was performed at a checkbox level. Aim for a relatively small number of well-articulated risks rather than a long list of platitudes.

| Avoid (generic) | Why generic risks fail | Prefer (specific) |
|---|---|---|
| "Data breach" | Applies to every processing activity; says nothing about this one; offers no anchor for a mitigation | "Inferred trait scores accessible by hiring managers via the recruiter dashboard without role-based access control or audit logging — a curious manager could pull profiles on candidates outside their requisitions, and a malicious manager could pull profiles on internal employees the controller did not intend to surface." |
| "Non-compliance with GDPR" | Circular — the DPIA's job is to *assess* compliance, not flag it as a future possibility | "Vendor-side use of customer data for model improvement is not contractually prohibited and likely exceeds the Art. 6(1)(f) legitimate-interest basis the controller intends to rely on, because data subjects' reasonable expectations do not extend to model training." |
| "Users might not like it" | Vague; conflates regulatory and reputational risk | "Employees who declined the optional 'engagement insights' feature in 2024 will still be scored by the new model because the opt-out flag from the prior system was not migrated to the new vendor." |
| "Security risk" | Could mean anything from a misconfigured S3 bucket to a nation-state APT; no actionable mitigation follows | "Biometric template database is hosted on a single Lyon server with vendor-supplied default credentials documented in the vendor's public knowledge base; physical access controls at the Lyon facility have not been independently audited." |
| "Data subject rights might be impacted" | Restates that Art. 12–22 exist | "The vendor's Art. 15 access workflow returns only the inputs, not the model's per-feature contribution to the output; the controller cannot satisfy the Art. 22(3) 'meaningful information about the logic' standard without an explainability commitment the vendor has not made." |

A useful self-test: can the risk be mitigated by a specific control naming a specific owner and a specific deadline? If yes, the risk is specific enough. If the only available mitigation is "improve security" or "consult counsel," the risk is too generic — keep refining until the mitigation writes itself.

Bespoke is better than comprehensive. Five risks tied to the design, scored honestly, beat fifteen padded risks every time.

## Reference Cross-Walk

- CNIL, "PIA, Methodology" (February 2018 edition), §3: risk components and severity/likelihood definitions. https://www.cnil.fr/sites/cnil/files/atoms/files/cnil-pia-1-en-methodology.pdf
- WP29 Guidelines on DPIAs (wp248rev.01), §III.B: "Risks to the rights and freedoms" and the likelihood/severity framing.
- ENISA, "Recommendations for a methodology of the assessment of severity of personal data breaches" (December 2013). Useful for post-breach severity scoring; the formula SE = DPC × EI + CB can be adapted as a sanity-check on the severity score for a confidentiality breach. https://www.enisa.europa.eu/publications/dbn-severity
