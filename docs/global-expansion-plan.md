# Global Expansion Plan — Multi-Jurisdiction DPIA Coverage

**Status:** EXECUTED — Phases 0–4 shipped as v3.0–v3.4 (see `SKILL.md ## Version` and the
README changelog). Retained as the design record. The privilege question in §7(1) was resolved
as proposed (per-regime privilege postures + parameterized header + two-document rule);
Switzerland shipped non-derivable rather than derivable because of revFADP Art. 23(4) — see
`references/jurisdictions/switzerland-fadp.md` §2 for the reasoning, which supersedes §2's
"derivable where prior-consultation" assumption for that regime. Build-time fetches of primary
sources returned 403 through the environment proxy, so all new jurisdiction citations ship
UNVERIFIED per the house rule, recorded in each module's sourcing banner.
**Target skill version:** v3.0 (manifest schema change → major bump per house convention).
**Date:** 2026-08-04.

This plan reviews where `dpia-generator` stands today, identifies the jurisdictions beyond the EU/UK
that impose a DPIA or DPIA-equivalent obligation, and lays out how to extend the skill to cover them
with guidance anchored in each regulator's own published material — under the same verification
discipline (Tier A/B citations, No Silent Supplement, gates not prose) that governs the current skill.

Regulatory-status statements in this plan were checked by web search on 2026-08-04 against secondary
sources (law-firm alerts, regulator announcements). Per the house rule, **every statement here ships
UNVERIFIED for citation purposes** — each jurisdiction module must be built by fetching the primary
regulator sources live, not by transcribing this plan.

---

## 1. Where the Skill Stands Today

The skill is a deep single-regime tool with one worked expansion precedent:

- **The spine is EU GDPR.** Article 35/36 structure, WP29 nine-criteria triggering, CNIL 3×3
  methodology, EDPB transfer guidance. Every section heading in the output cites an Art. 35(7) limb.
- **The UK is handled as a divergence overlay.** `references/uk-divergence.md` + a conditional
  Section 6 in the .docx + intake question 9 (jurisdictional scope). The overlay states a default —
  *apply the higher standard, carve out deliberate divergence explicitly* — that generalizes well.
- **Other jurisdictions appear only incidentally.** A CCPA "sale" row in the §1.10 privacy-policy
  consistency table; a Step 0 intake question asking whether US state law also applies, with nothing
  downstream to receive the answer.
- **The builder is regime-agnostic in mechanics but GDPR-branded in labels.** The rating matrix, the
  register, and the exit-3 gate architecture carry over to any regime; the `art36` manifest field,
  the flag column, and the section headings do not.

So the expansion question is not "bolt on new content" — it is: which regimes fit the existing
**overlay** pattern, which need a genuinely different **module**, and what small generalizations to
the intake, the flag architecture, and the builder let both coexist without forking the skill.

---

## 2. Two Integration Models

### Model A — Divergence overlay (the UK pattern)

For regimes whose assessment instrument is materially an Article 35-style DPIA: same trigger logic
(high risk to individuals), same required content (description / necessity / risks / measures), same
internal audience. The DPIA remains one document; the regime gets a `references/jurisdictions/`
file and a subsection in a generalized "Jurisdictional Divergence" section, plus rows in the
regulator-engagement flag table.

**Candidates:** Brazil (LGPD RIPD), Switzerland (revFADP), Quebec (Law 25 PIA), Saudi Arabia (PDPL),
Singapore/Malaysia (voluntary-but-expected or incoming), Kenya, Nigeria, South Africa.

### Model B — Standalone assessment module

For regimes whose instrument differs in trigger, mandatory content, audience, or filing posture —
where pretending it is "a DPIA with notes" would produce a defective document:

- **US state data protection assessments** (Colorado, California CPPA, and the VA/CT/TX pattern).
  Trigger is an enumerated activity list ("heightened risk" processing: targeted advertising, sale,
  sensitive data, profiling), not a risk-likelihood screen. Colorado Rule 8.04 (4 CCR 904-3)
  prescribes a **statutory content checklist**, not a risk matrix. Critically, the document is
  **producible to the Attorney General on 30 days' notice** (Colorado) or summarized/attested to the
  CPPA on a filing schedule (California: regs effective 2026-01-01; first attestation filing due
  2028-04-01). That changes the drafting posture — see §7 on privilege.
- **China PIPL PIPIA** (Arts. 55–56). Enumerated triggers (sensitive PI, automated decision-making,
  entrusted processing, provision to other handlers, public disclosure, cross-border transfer),
  a national methodology standard (GB/T 39335-2020), a three-year report retention rule, and
  interaction with the separate CAC security assessment / SCC filing regime for transfers.
- **India DPDP** (Act 2023 + Rules notified 2025-11-13). DPIA obligation attaches only to designated
  **Significant Data Fiduciaries**, runs annually alongside an independent audit, and key findings
  are **reported to the Data Protection Board** — a periodic compliance instrument, not a
  per-processing gate.

**Rule of thumb for classifying a new regime:** if its mandatory content maps ~80%+ onto
Art. 35(7)(a)–(d) and its method is risk-based, it is an overlay; if its trigger is an enumerated
activity list, its content is a statutory checklist, or its audience includes the regulator by
default, it is a module.

---

## 3. Jurisdiction Tiers

Status notes as verified by search on 2026-08-04; all subject to live re-verification at build time.

### Tier 1 — build first (demand × guidance maturity)

| Regime | Instrument | Trigger | Regulator guidance to anchor on | Model |
|---|---|---|---|---|
| **US — Colorado CPA** (proxy for VA/CT/TX/OR/MT pattern) | Data protection assessment, C.R.S. § 6-1-1309 + 4 CCR 904-3 Part 8 (content: Rule 8.04; profiling: Part 9) | Enumerated "heightened risk" activities | AG rules text itself — the most prescriptive content list of any regime here | B |
| **US — California CCPA/CPRA** | Risk assessment + ADMT obligations, CPPA regs (approved 2025-09-23, effective 2026-01-01, first filing 2028-04-01) | Enumerated "significant risk" activities incl. ADMT "significant decisions" | CPPA final regulations + agency materials | B |
| **Canada — Quebec Law 25** | PIA ("évaluation des facteurs relatifs à la vie privée"), mandatory for information-system projects and pre-condition for transfers outside Quebec | Project-based + transfer-based | CAI Companion Guide on PIAs (2023); federal side: OPC guidance + TBS Directive for public sector | A (close to GDPR) |
| **Brazil — LGPD** | RIPD (Relatório de Impacto), Art. 5(XVII), Art. 38 | High-risk processing; ANPD may demand the report | ANPD FAQ/webpage guidance (2023) — **preliminary; full regulation still pending. Ship flagged volatile.** | A |
| **China — PIPL** | PIPIA, Arts. 55–56 | Enumerated list (sensitive PI, ADM, entrustment, sharing, disclosure, export) | GB/T 39335-2020 standard; CAC measures for the transfer-assessment interaction | B |

### Tier 2 — second wave

| Regime | Instrument | Notes | Model |
|---|---|---|---|
| **India — DPDP Act + Rules 2025** | Annual DPIA + audit, SDFs only, findings reported to the Data Protection Board | Rules notified 2025-11-13; SDF designations and Board practice still forming | B |
| **Switzerland — revFADP** | DPIA, Arts. 22–23; FDPIC consultation where high residual risk (a true Art. 36 analog) | Cleanest overlay of the set | A |
| **Singapore — PDPA** | DPIA not generally mandatory; PDPC Guide to DPIAs (2021); effectively required to rely on legitimate-interests / deemed-consent exceptions | Regulator-published methodology to cite | A |
| **Malaysia — PDPA (amended)** | JPDP ran a DPIA public consultation (2025) — mandatory DPIA guideline expected | Track; build when the guideline lands | A |
| **Australia — Privacy Act** | No general private-sector PIA mandate; mandatory for agencies (Privacy (Australian Government Agencies — Governance) APP Code); OAIC PIA Guide; POLA reforms add ADM transparency (in force 2026-12-10) and a statutory serious-invasion-of-privacy tort (2025-06-10) | A (prudential posture) |
| **South Korea — PIPA** | PIA mandatory for public institutions (PIPC-designated assessors); recommended for private sector | A, with a public-sector note | 

### Tier 3 — catalog entries only, until demand

Saudi Arabia (PDPL — SDAIA regs; GDPR-like but thin guidance), UAE (federal PDPL Art. 21 — executive
regulations still pending), South Africa (POPIA — no express DPIA duty; Information Regulator
guidance + prior-authorization regime under s. 57–58), Nigeria (NDPA 2023 + NDPC GAID), Kenya (DPA
2019 s. 31 — express DPIA duty, ODPC guidance), Japan (APPI — no DPIA duty; PPC encourages PIAs),
Thailand (PDPA — PDPC guidance emerging). Each gets a one-paragraph entry in a screening table (see
§4, fallback rule) rather than a full module, so the skill can *say something accurate* about the
regime without pretending to full coverage.

---

## 4. Concrete Changes, File by File

### `SKILL.md`

1. **Step 0, intake item 9 → jurisdiction mapping.** Replace the binary "EU / UK / also US state
   law?" question with: controller establishments, data subject locations, and sector → an
   **applicable-regimes table** recorded in the cover note. One intake message, unchanged fast-path.
2. **Triggering screen generalizes.** Today's screen is Art. 35(3) → DPA lists → WP29 criteria. It
   becomes a per-regime screen driven by each jurisdiction file's trigger test, producing one line
   per applicable regime: *mandatory / prudential / not required / regime not covered — see fallback*.
3. **Fallback rule (new, hard).** If the user's processing touches a regime with no module or
   overlay file, the skill must say so in the cover note and chat summary and proceed on the GDPR
   spine explicitly labelled as such — never silently pretend coverage. "Not covered" is a finding,
   exactly like "could not fetch" vs "does not exist" in the current Step 1.
4. **Step 1 analogs.** The published-analog step already works for any regime; the catalog gains
   per-regime sections (see below). The search recipe gains regulator names (ANPD, CAI, PDPC, CPPA,
   OAG Colorado, PIPC, MeitY/DPB, CAC).
5. **Step 4 flag generalizes.** "Article 36 flag" becomes the **regulator-engagement table**: one row
   per applicable regime stating what the findings oblige — EU/UK prior consultation (Art. 36); CH
   FDPIC consultation; Colorado "producible to AG on request — drafted for production"; California
   attestation/filing timeline; Brazil "ANPD may compel production of the RIPD"; India "findings
   reportable to the DPB"; China "report retained 3 years"; Quebec "CAI may review". The gate
   philosophy is unchanged — the conclusion must be declared and must match the register.
6. **Section 6 → "Jurisdictional Divergence"** (UK/EU remains the first subsection; one subsection
   per additional applicable regime, only where the answer differs from the spine).
7. **Description field.** Add trigger phrases ("RIPD", "PIPIA", "Law 25 PIA", "data protection
   assessment", "Colorado/CPPA risk assessment", "DPDP impact assessment") — under the 1024-char
   packaging cap, which the current description already presses against. Budget: compress the
   existing trigger list to fund the new phrases; verify with the `.strip()`-mirrored length check
   before packaging. Routing clauses against siblings are unchanged.

### `references/jurisdictions/` (new directory)

One file per regime, replacing the special-cased `uk-divergence.md` (which moves here unchanged as
the template). **Fixed skeleton, enforced by review:**

1. Instrument name + statute cite (Tier A identifier).
2. Trigger test (statutory text + regulator interpretation).
3. Required content, as a crosswalk table against Art. 35(7)(a)–(d) — what maps, what is extra,
   what is absent.
4. Risk method (matrix-compatible? statutory checklist? both?).
5. Regulator engagement: consultation / filing / production / retention obligations.
6. Divergence-that-changes-the-answer table (the `uk-divergence.md` §"Where the conclusion could
   materially differ" pattern — conclusions, not terminology).
7. Privilege posture note (see §7).
8. Source notes: Tier A / Tier B split, all Tier B shipping UNVERIFIED, language of the primary
   source recorded (see §6).

### `references/authorities.md`

Extend the register: Tier A gains the statutes (LGPD Lei 13.709/2018; PIPL; DPDP Act 2023 + Rules
2025; C.R.S. § 6-1-1309; 4 CCR 904-3; Cal. Civ. Code §§ 1798.185 regs; Quebec RLRQ c. P-39.1 as
amended by Law 25; revFADP; PDPA (SG); Kenya DPA 2019). Tier B gains the guidance (ANPD FAQ, CAI
Companion Guide, PDPC DPIA Guide 2021, GB/T 39335-2020, OAIC PIA Guide, CPPA regulatory materials,
NDPC GAID) — all UNVERIFIED until fetched, same upgrade protocol. The register's premise ("the
verification burden should fall once") is exactly why expansion should go through this file.

### `references/published-dpias.md`

Add per-regime sections. Honest expectation to record in the file: outside the EU/UK, **published
completed assessments are scarce** — the anchors are regulator *templates and guides* (CAI, PDPC,
OAIC, CNIL-equivalents) and *enforcement decisions* (PIPC, ANPD, state AG actions), not published
DPIAs. The "how to add" protocol already handles growth.

### `references/risk-matrix.md`

Keep the 3×3 as the analytical spine for every regime (it satisfies or over-satisfies each regime's
risk-analysis expectation). Add a **content-completeness crosswalk** section: for checklist regimes
(Colorado Rule 8.04, CPPA), the matrix is necessary but not sufficient — the module supplies the
statutory element list and the DPIA must show each element addressed. The matrix stays the source of
truth for ratings; the checklist becomes a per-regime completeness gate.

### `references/output-template.md` + `scripts/build_dpia.js`

Manifest schema changes (the reason this is v3.0):

1. `jurisdictions: ["eu-gdpr", "uk-gdpr", "us-co", ...]` (top-level, required; single-regime
   manifests stay one-element).
2. `art36: true|false` generalizes to `regulatorConclusions: {"eu-gdpr": {"priorConsultation":
   true}, "us-co": {"agProducible": true}, ...}`. **Back-compat:** `art36` remains accepted as an
   alias for the EU entry so existing fixtures and muscle memory survive; the builder normalizes.
3. The exit-3 gate extends: every declared jurisdiction must carry a declared engagement conclusion,
   checked against the register where derivable (EU/UK/CH from High residuals, as today) and against
   the module's rules otherwise. Missing conclusion = exit 1; contradiction = exit 3. Same "never
   resolve a gate by flipping the declaration" rule.
4. New `complianceMap` block: renders a regime → required-element → DPIA-section cross-reference
   table for checklist regimes, so completeness is visible to a reviewer rather than asserted.
5. Section labels parameterized: a document scoped `["us-co"]` must not carry Art. 35(7) headings or
   a "PRIVILEGED — ATTORNEY WORK PRODUCT" header it can't sustain (see §7); a multi-regime document
   keeps GDPR headings with the divergence section carrying the rest.

Everything else the builder owns (geometry, fonts, colors, matrix mapping) is untouched.

### `tests/fixtures/`

New cases per gate: multi-jurisdiction manifest with a missing regime conclusion (exit 1);
declared conclusion contradicting the register for a derivable regime (exit 3); `art36` legacy alias
still passing (back-compat); `complianceMap` referencing a section that doesn't exist (exit 1);
single-regime non-GDPR document not emitting GDPR headings. Mutation test: corrupting the alias
normalization or one crosswalk row turns the suite red.

---

## 5. What Stays Constant

- **GDPR as the spine, higher-standard default.** The `uk-divergence.md` rule — apply the higher
  standard across applicable regimes, carve out deliberate divergence explicitly — extends to N
  regimes and keeps multi-jurisdiction output a single defensible document.
- **One document by default.** Per-regime standalone documents only where the audience genuinely
  differs (a Colorado assessment drafted for AG production; a CPPA filing summary) — offered at the
  destination check, not produced unasked.
- **The verification discipline, with more force, not less.** Non-EU guidance is thinner, newer, and
  more often non-English; the No Silent Supplement rule and the Tier B UNVERIFIED default are what
  keep the expansion from becoming a fabrication surface. A jurisdiction module is *built by
  fetching* — a module written from model recall is a bug shipped to every future run.
- **Gates, not prose.** Every new correctness obligation lands in the builder as an exit code, not
  as an adverb in SKILL.md.
- **Fast-path, one intake message, no per-jurisdiction interrogation.**

---

## 6. Research & Verification Protocol per Module

For each jurisdiction, in order, before its module ships:

1. Fetch the statute from the official source (Tier A identifier captured).
2. Fetch the regulator's DPIA guidance/template; record language and translation status — where the
   primary source is Portuguese/Chinese/Korean/French, the citation records the original title and
   the fact that analysis relied on translation, so the reviewing attorney knows to check.
3. Build the Art. 35(7) crosswalk from the fetched text, not from secondary summaries.
4. Find 1–3 analogs (regulator template, worked example, or enforcement decision) for
   `published-dpias.md`.
5. Smoke-test end to end: one realistic multi-jurisdiction prompt (e.g., "biometric time-and-
   attendance, employees in France, Colorado, and São Paulo"), manifest through the builder, exit 0,
   validate.py pass.
6. Regression suite green, version bumped, description re-measured against the 1024 cap.

---

## 7. Open Questions and Risks (decide before Phase 0)

1. **Privilege posture is jurisdiction-dependent, and the current skill hard-codes the US answer.**
   The attorney-work-product framing is load-bearing today — and wrong or unavailable in several
   target regimes: Colorado assessments are producible to the AG (the statute limits waiver, but the
   document must be *drafted expecting production*); CPPA summaries are filed; India DPIA findings
   go to the Board; in-house counsel privilege is not recognized in several EU member states and
   effectively absent in China. **Proposal:** the destination check gains a per-regime privilege
   note sourced from each jurisdiction file, and the builder's header becomes
   jurisdiction-parameterized rather than constant. This is the single most substantive design
   change in the plan and should be reviewed by the user before implementation.
2. **Description budget.** The current description is near the 1024-char packaging cap; adding ten
   regimes' trigger phrases means rewriting, not appending. Draft early, measure with the stripped
   length check, keep every sibling routing clause intact.
3. **Brazil volatility.** ANPD's RIPD regulation is pending; the module ships with an explicit
   "regulation pending — re-verify before relying" banner and a review trigger when the regulation
   lands.
4. **India timing.** SDF designations under the 2025 Rules are new; whether users of this skill are
   SDFs is an intake fact, and the module is a no-op for non-SDFs (worth saying explicitly — a
   correct "DPDP imposes no DPIA duty on you" is a valuable output).
5. **Scope discipline / sibling routing.** This stays one skill: the trigger context ("assess this
   processing") is identical across regimes; splitting per-jurisdiction would fragment triggering.
   No new routing collisions expected — `product-regulatory-scan` and `tech-law-radar` boundaries
   are regime-independent. Flag in the delivery summary if any sibling description needs a
   reciprocal edit.
6. **Malaysia and other in-flight regimes.** JPDP's DPIA guideline is in consultation; Australia's
   next reform tranche may add a PIA duty. The tier table is a snapshot — each phase re-verifies
   before building, and `tech-law-radar` findings can feed the tier queue.

---

## 8. Phasing

| Phase | Content | Version | Exit criteria |
|---|---|---|---|
| **0** | Architecture only, no new regimes: `jurisdictions` + `regulatorConclusions` manifest schema (with `art36` alias), generalized flag table, Section 6 rename, `references/jurisdictions/` with the UK file moved in, fallback rule, new fixtures | v3.0 | Regression suite green; EU/UK-only output byte-comparable to v2.0.2 except renamed section |
| **1** | US states (Colorado module + CPPA module + harmonized-states note) and Canada/Quebec | v3.1 | Smoke test: tri-jurisdiction prompt end to end; privilege-posture design (Q1 above) resolved |
| **2** | Brazil + China modules | v3.2 | Modules built from fetched primary sources; Brazil volatility banner in place |
| **3** | India, Switzerland, Singapore/Malaysia, Australia, South Korea | v3.3 | Same bar |
| **4** | Tier 3 screening catalog + description rewrite finalized | v3.4 | Fallback rule exercised in a fixture; description ≤ 1024 |

Phase 0 is deliberately behavior-preserving: it proves the generalization is safe before any new
law enters the repo. Each subsequent phase is independently shippable and independently testable.
