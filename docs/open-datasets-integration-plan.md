# Open-Datasets Integration Plan

Status: **proposed** — nothing in this document is implemented yet. Like the executed
`global-expansion-plan.md` before it (removed at v4.0.2 once its rules had moved into maintained
files), this file is a design record: it should be deleted once each workstream lands and its
surviving rules live in the maintained references.

Scope: six open datasets / vocabularies were reviewed for integration value. The governing
question for each is not "is this good data" but **"does it make a DPIA this skill produces more
defensible, more repeatable, or more checkable"** — and, per the house philosophy, whether the
integration can be done without bundling content the skill would then have to keep current by hand.

A structural point that shapes every decision below: this skill is consumed by a language model,
not by a training pipeline. The annotated corpora in these collections were built to train and
evaluate NLP extractors; the skill needs their **schemas, vocabularies, crosswalks, and register
locations** — the parts that make extraction and citation repeatable — not their example data.
Where a dataset's value is its schema, the plan takes the schema and cites the dataset. Where a
dataset's value is live lookup (registers, versioned terms), the plan writes consumption rules and
bundles nothing. No workstream below bundles a corpus.

Verification posture of this plan itself: dataset facts (licences, versions, hosting) were
corroborated by web search on 2026-08-29; `usableprivacy.org` — host of the OPP-115 family and the
privacy-law corpus — is egress-blocked from this build environment, so its licence terms are
recorded from search results and must be re-read from the site before any content from those
datasets (as opposed to their schemas) is relied on. That is the same `[web search — verify]`
discipline `references/authorities.md` applies to legal citations, applied to dataset metadata.

---

## Summary and sequencing

| # | Dataset | Verdict | What is taken | Effort | Builder change |
|---|---|---|---|---|---|
| 1 | EDPB registers + DPA decision registers | **Integrate now** | Register locations + live-check consumption rules | Low | None |
| 2 | OPP-115 schema + JURIX 2020 GDPR crosswalk | **Integrate now** | Category taxonomy + attribute discipline + Article crosswalk into the notice profile | Low–medium | None |
| 3 | Open Terms Archive | **Integrate** | Vendor-terms citation/diff rules; small profile-schema extension | Medium | None |
| 4 | DPV (W3C Data Privacy Vocabulary) — phase 1 | **Integrate** | Curated term subset as reference; optional profile/manifest keys | Medium | None |
| 5 | DPV — phase 2 (machine-readable sidecar) | **Integrate later** | Builder-emitted DPV sidecar for the `ropa-builder` handoff | High | Yes (+fixtures) |
| 6 | Privacy Law Corpus (GPI Corpus) | **Maintenance tool, not a skill input** | Named verification source in the maintenance loop | Low | None |

Suggested landing order: 1 and 2 together (references-only, one minor version, "no behavior
change" entries); then 3; then 4; 5 only once `ropa-builder`'s intake format is agreed; 6 is not a
release at all — it is a standing instruction in the maintenance loop, executable only from an
environment that can reach `usableprivacy.org`.

---

## 1. EDPB registers and DPA decision registers — integrate now

**What it is.** The EDPB's official registers: the Article 60 final one-stop-shop decisions
register, the Article 65 binding decisions, BCR approvals (Art. 64 opinions), and the European
Commission's adequacy-decision list. Official, citable, continuously updated. GDPRhub is a
wiki-sourced index into the same material.

**Why it earns its place.** Step 1 (pull a real analog) and the transfer analysis are the two
places this skill leans hardest on regulator-published material, and the registers are the primary
index the catalog in `published-dpias.md` currently reaches only piecemeal. An Art. 36 flag or a
transfer conclusion grounded in a register entry the reviewer can open beats one grounded in
recall. The registers are also the shared ingestion surface for the sibling `bcr-registry` work —
one set of consumption rules serves both, and this repo should carry the rules, not the data.

**Integration.**

- `references/published-dpias.md` — the existing **Discovery Corpora** section gains the EDPB
  registers as standing collections, each with its URL, what it is good for, and the per-entry
  verification convention the catalog header already states:
  - Register of final one-stop-shop decisions (Art. 60):
    `https://www.edpb.europa.eu/our-work-tools/consistency-findings/register-for-article-60-final-decisions_en`
    — the search surface for enforcement analogs on a processing type; note that the register's
    summaries are Secretariat-authored and non-authoritative — cite the underlying national
    decision, not the summary.
  - Art. 65 binding decisions:
    `https://www.edpb.europa.eu/our-work-tools/consistency-findings/binding-decisions_en`
  - BCR approvals / Art. 64 opinions and the Commission adequacy list, each with the same
    treatment.
- `references/authorities.md` — Tier B gains one entry per register with the **live-check standing
  rule** the DPF entry already models: a register is checked *at the time the DPIA is written*,
  never cited from this file, never from a vendor's representation. The adequacy-list entry
  absorbs the transfer-analysis lookup that today lives implicitly in Step 0 intake question 6.
- **GDPRhub rule** (one paragraph in `published-dpias.md`): GDPRhub may be used to *find* a
  decision, never to *cite* one — the citation is to the primary decision, fetched, and until
  fetched the finding carries `[web search — verify]`. Wiki content never upgrades a tag.

**Licence/bundling.** Nothing is bundled; these are live official sources. No licence issue.

**Version note.** References-only; lands as a "no behavior change" line in `SKILL.md ## Version`.

---

## 2. OPP-115 annotation schema + the JURIX 2020 GDPR crosswalk — integrate now

**What it is.** OPP-115 (Wilson et al., ACL 2016) annotated 115 privacy policies under a
ten-category data-practice scheme (First Party Collection/Use; Third Party Sharing/Collection;
User Choice/Control; User Access, Edit and Deletion; Data Retention; Data Security; Policy Change;
Do Not Track; International and Specific Audiences; Other), each category carrying typed
attributes (what/why/how, opt-in/opt-out, identifiability). APP-350, PolicyQA, PrivacyQA,
PolicyIE, and PI-Extract are downstream corpora on the same or related schemes. Poplavska et al.,
*From Prescription to Description: Mapping the GDPR to a Privacy Policy Corpus Annotation Scheme*
(JURIX 2020) maps the OPP-115 categories to GDPR principles and articles.

**Why it earns its place.** Notice-Profile Mode's extraction rules
(`references/notice-profile.md`) currently say *what a commitment is* but leave *coverage* to
judgement: "one entry per commitment a data subject could rely on." Two runs over the same notice
can legitimately index different sets, which is exactly the instability the §1.10 drift check
cannot afford — a commitment absent from the profile is invisible to the drift table. The OPP-115
scheme is a decade-tested, annotator-validated answer to "what are all the things a privacy notice
says," and adopting it as a **coverage checklist** turns indexing from freeform capture into
structured, repeatable field capture. The JURIX crosswalk is the bridge that lets each captured
category speak Article-language in Step 2 without this skill inventing its own mapping.

**What is *not* taken.** The corpora themselves. They are NLP training/evaluation data under
research-only terms (OPP-115 ships "for research, teaching, and scholarship purposes only, in the
spirit of CC BY-NC," with commercial licensing separate), and a skill run needs zero of their
annotations — the model reads the actual notice. Bundling them would add licence risk and no
capability. The scheme (a taxonomy — facts and method) is adopted with citation.

**Integration** — all in `references/notice-profile.md`; the profile schema stays `v1`-compatible.

1. **Category-complete indexing rule.** Indexing Mode gains a pass over a fixed category list:
   for every category, the profile records either the commitments found or an explicit
   *notice-is-silent* entry. Silence becomes data — on a later run, "the notice was checked for a
   retention statement and had none" is a different §1.10 fact from "retention was not checked,"
   exactly parallel to the existing "checked, no intersection vs. not checked" rule at the bottom
   of the file. This is the stable comparison surface across runs: two indexings of the same
   notice now differ only where the notice differs.
2. **Vocabulary crosswalk, not vocabulary replacement.** The house commitment types
   (`collection | purpose | sale-sharing | retention | adm-ai | transfers | recipients | rights |
   security`) stay — existing profiles must keep validating. A crosswalk table maps each house
   type to its OPP-115 category, and the gap analysis the crosswalk exposes fills the vocabulary:
   - add **`policy-change`** (OPP-115 "Policy Change") — a notice's own promise about how changes
     are notified is the meta-commitment the drift check itself relies on, and the house scheme
     cannot currently hold it;
   - add **`choice-control`** (OPP-115 "User Choice/Control") — opt-outs beyond sale/sharing
     (marketing, profiling, cookies) currently have no home; `sale-sharing` keeps the US-state
     sale/share opt-out specifically;
   - add **`specific-audiences`** (OPP-115 "International and Specific Audiences") — children's
     sections and region-specific carve-outs inside a single notice, complementing the existing
     per-audience `notices[]` keying, which handles separate documents but not sections.
   "Do Not Track" folds into `choice-control`; "Other" is deliberately not adopted — marketing
   prose stays unindexed per the existing rule.
3. **Attribute discipline.** Per-type extraction prompts borrowed from the OPP-115 attribute
   sets: `collection` entries capture what/how (declared vs. tracked vs. inferred); `sale-sharing`
   and `choice-control` capture opt-in vs. opt-out; `retention` captures period vs. criterion.
   These are indexing instructions, not schema fields — the `quote` stays verbatim and remains
   the record; the attributes tell the indexer what a complete quote set looks like.
4. **GDPR crosswalk column** (the JURIX 2020 mapping). The crosswalk table's third column carries
   each category's GDPR hooks — e.g. retention ↔ Art. 13(2)(a) / 5(1)(e); collection ↔ Art.
   13(1)(c) / 5(1)(c); choice/control ↔ Art. 21; access/deletion ↔ Arts. 15/16/17 — so Step 2's
   Art. 13/14 transparency analysis and §1.10 rows can cite the Article each commitment type
   answers to without per-run derivation. Source the table to the paper; the mapping ships
   `[web search — verify]` until the paper is fetched and read (the usableprivacy.org PDF is
   egress-blocked from this environment; the NSF PAR mirror is the fallback), and
   `references/authorities.md` gains a Tier B entry for it so the verification burden falls once.
5. **Eval, not gate.** The builder is untouched (`noticeCheck` consumes whatever rows the
   manifest states). Repeatability is a workflow behavior, so it is pinned where those live:
   `docs/eval-prompts.md` gains a graded indexing-mode prompt — index a fixed sample notice
   twice; grade category coverage and the silence entries.

**Version note.** One minor version; "no builder behavior change." Existing profiles remain valid;
new types are additive.

---

## 3. Open Terms Archive — integrate (vendor-terms citation and the drift trigger)

**What it is.** A decentralised system tracking versioned terms (privacy policies, DPAs, ToS) of
named services, publishing every version as a dated, diffable document; datasets under ODbL, plus
a public API and per-collection GitHub version repositories.

**Why it earns its place.** Two of this skill's weakest evidentiary moments involve vendor terms:

- Intake and Step 1 routinely rest on "the vendor's privacy policy says X" with no version
  anchor — the citation is to a moving target.
- SKILL.md's living-document constraint lists off-cycle review triggers (new sub-processor,
  material model change, law change, incident) but the most common real trigger — *the vendor
  changed its terms* — is currently detectable only by someone re-reading the terms. OTA makes it
  a lookup: what changed between the prior DPIA's date and today.

This is deliberately parallel to what the notice profile did for the *controller's* notice; OTA
does it for the *vendor's* documents, with the versioning already done by someone else.

**Integration.**

1. **Citation rule** (in `references/authorities.md` standing rules, cross-referenced from Step
   1): where a DPIA relies on a vendor's published terms and the vendor is tracked by an OTA
   collection, cite the terms **as of a named version date**, quote verbatim, and link the OTA
   version permalink alongside the vendor's live URL. The tag stays what it is — a vendor
   representation to be weighed, per the Untrusted-Content Rule; OTA changes the *checkability*
   of the citation, not its evidentiary weight. Where the vendor is not tracked, nothing changes.
   **Coverage caveat, stated where the rule lives:** OTA tracks a finite service list; absence
   from OTA is absence of tracking, never evidence the terms are unchanged — the same
   "could not check ≠ checked and found nothing" rule Steps 0.5 and 1 already enforce.
2. **Refresh diff** (Step 0.5): on a refresh/supersede run where the prior DPIA cited a
   vendor-terms version, diff the vendor's OTA history between the prior version date and now;
   material changes feed the cover-note reconciliation ("conclusions revised because the vendor's
   DPA dropped the audit-rights clause") and the severity-floor analysis.
3. **Review-cadence trigger** (SKILL.md Important Constraints): the off-cycle review-trigger list
   gains "material change to a relied-on vendor's terms (detectable via Open Terms Archive
   tracking where the vendor is covered)."
4. **Profile schema extension** (`references/notice-profile.md`, schema bumps to a
   backward-compatible `v1.1`): `notices[]` entries gain an optional `role: controller | vendor`
   (default `controller`, so every existing profile keeps its meaning) and, for vendor entries,
   `vendor: <name>` and an optional `ota_collection` locator. This lets a user index the
   commitments of their two or three load-bearing processors once — "AWS DPA says X, §Y, as of
   date Z" — and have later DPIAs on those vendors pre-fill and drift-check against them with the
   machinery §1.10 already has. The existing verbatim-quote, provenance, and staleness rules
   apply unchanged; the `sha256`/`fetched` change-detection pattern was built for exactly this.

**What is *not* taken.** No OTA data is bundled (ODbL share-alike sits badly inside an
MIT-licensed repo, and bundled versions would be stale on arrival). Consumption is at run time,
from the live archive, cited with version dates.

**Version note.** References + SKILL.md prose; no builder change (`noticeCheck` rows are
role-agnostic). One minor version.

---

## 4. DPV — W3C Data Privacy Vocabulary — integrate in two phases

**What it is.** The W3C DPVCG's controlled vocabulary (v2.x current; W3C Software and Document
License — bundleable with attribution) for purposes, processing operations, personal-data
categories, legal bases (including GDPR-specific Art. 6/9 concepts), technical/organisational
measures, and risk concepts, each with a stable IRI.

**Why it earns its place.** Today the skill's outputs name purposes, data categories, legal bases,
and controls in per-run prose. That is right for the narrative sections — but it means two DPIAs
on similar processing are comparable only by reading, and the planned `dpia-generator →
ropa-builder` handoff (a DPIA's Section 1 facts are most of a ROPA row) has no stable field
vocabulary to hand over. DPV is the fix that does not invent anything: necessity/proportionality
keeps its reasoned prose, but the facts underneath get fixed terms.

**Phase 1 — vocabulary reference + optional keys (no builder change).**

- New `references/dpv-mapping.md`: a **curated subset** of DPV pinned to a named DPV version —
  the few dozen terms this skill's outputs actually classify against: top-level purposes,
  processing operations, personal-data categories (including special-category), the GDPR legal
  bases, TOM concepts for Step 4's four control classes (technical / organisational /
  contractual / transparency), and transfer-relevant concepts. Each term: IRI, one-line
  definition, and where it maps in the manifest/output. The full DPV is thousands of concepts;
  bundling it whole would be dead weight and a currency liability. The file records the pinned
  version and the upgrade rule (re-pin deliberately, never silently).
- `references/notice-profile.md`: commitment types in the §2 crosswalk gain a DPV column
  (e.g. `retention` ↔ `dpv:StorageDuration`-family), and profile entries may carry an optional
  `dpv:` key. Optional means optional: profiles without it stay valid, and indexing does not
  slow down to classify.
- Step 0's applicable-regimes/intake notes point necessity/proportionality drafting at the fixed
  purpose vocabulary — "state the purpose in DPV terms once, then argue it in prose" — which is
  what makes two runs' §2 comparable.

**Phase 2 — machine-readable sidecar (builder change; the real `ropa-builder` payoff).**

- The manifest gains an optional `dpv` block (purposes, legal basis per regime, data categories,
  processing operations, recipients/transfers, measures — IRIs from the pinned subset). The
  builder validates every IRI against the bundled subset (own-property / null-prototype lookups
  per the v3.4.1 hardening; unknown term → exit 1 naming it, since a dangling IRI is the
  machine-readable version of a fabricated citation) and emits, next to the `.docx`, a sidecar
  `DPIA_<SystemName>_<date>.dpv.yaml` carrying the classification plus provenance (skill
  version, DPV version, manifest date). The sidecar — not the docx — is the `ropa-builder`
  handoff artifact.
- Optionally the docx gains an Appendix D rendering the same table for human readers; the sidecar
  and appendix come from the same manifest block, so they cannot disagree (the house
  computed-not-asserted rule).
- Fixtures: valid sidecar emission, unknown-IRI rejection, prototype-chain probe on the term
  lookup, sidecar/appendix agreement.
- **Gate on coordination:** do not build phase 2 until `ropa-builder`'s expected intake format is
  agreed — a sidecar nobody consumes is speculative surface area. Phase 1 has standalone value
  and no such dependency.

**Version note.** Phase 1 is a minor version, references-only. Phase 2 is a minor version with
builder + fixtures, and its changelog entry names the DPV version pinned.

---

## 5. Privacy Law Corpus (GPI Corpus) — a maintenance tool, not a skill input

**What it is.** *Creation and Analysis of an International Corpus of Privacy Laws* (arXiv
2206.14169; LREC): 1,043 privacy laws, regulations, and guidelines across 182 jurisdictions, PDF +
TXT, some with English translations, hosted by the Usable Privacy Policy Project.

**The honest assessment.** This is the one dataset where the obvious integration — feed the
jurisdictional-divergence section from primary text — collides with the skill's own maintenance
philosophy, and the philosophy wins:

- **The corpus is a snapshot; the modules are volatility-managed.** Its collection predates most
  of what makes the current modules hard: Vietnam's Law 91/2025 and Decree 356/2025, India's DPDP
  Rules 2025, the DUAA, the ANPD's pending RIPD regulation, Malaysia's 2026 guideline. Exactly
  the regimes where the skill most needs primary text are the ones a 2022-era corpus cannot
  serve, and the volatility-banner contract ("re-search on every run that touches them") cannot
  be discharged against a static snapshot. Bundling it, or citing it as if current, would
  institutionalise staleness.
- **A corpus copy is not the official source.** The house three-tier tag semantics are strict:
  `[official publication]` requires fetching the primary source. A corpus TXT is a third-party
  mirror — reading it is materially better than recall (verbatim pinpoints become capturable,
  which search snippets never allow), but it does not establish currency or amendment state.

**Where the real value is.** The maintenance loop, not the DPIA run:

1. **Pinpoint capture for the `[official publication]` upgrade pass.** `authorities.md` records a
   standing backlog: a dozen non-EU statutory identifiers corroborated by search but never read
   ("the enumerated 8.04 element list still to be read verbatim," "capture the Law's and Decree
   356's article numbers on first fetch"). For the *stable, older* instruments in that backlog
   (LGPD articles, PIPL articles, Kenya DPA s. 31, Quebec ss. 3.3/17), the corpus lets a
   maintenance session read the text and capture exact sub-paragraph pinpoints where official
   portals 403 the fetch tool. Rule: a corpus read upgrades a citation from
   `[model knowledge — verify]` to `[web search — verify]` **with verbatim pinpoints captured
   and the corpus version/date recorded**; only an official-source fetch confirming currency
   reaches `[official publication]`. No fourth tag — the corpus strengthens the middle tier, it
   does not sit above it.
2. **Screening-catalog expansion intake.** 182 jurisdictions dwarf the current 17 modules + 7
   screening entries. When a run hits the coverage fallback on an uncovered regime, the corpus is
   the designed starting point for drafting that regime's one-paragraph screening note — a
   bounded statement beats silence, and the promotion path (screening entry → module) already
   exists. This slots into README Maintenance alongside the `tech-law-radar` intake.

**Integration artifact.** No data in the repo. One entry in `references/authorities.md` ("How to
use it" / maintenance notes) naming the corpus, its access point, its collection-date limitation,
and the two uses above with the tag rule; one bullet in README Maintenance adding it to the
upkeep toolchain. Licence note: hosted by the same project as OPP-115 and presumed under similar
research-oriented terms — **read the actual terms from usableprivacy.org before the first
maintenance session uses it** (the site is egress-blocked from this build environment; terms
could not be read while preparing this plan, and that is recorded here rather than guessed).

---

## What this plan deliberately does not do

- **No corpus bundling, anywhere.** Every dataset whose value is data (OPP-115 annotations, OTA
  versions, GPI texts) is consumed at run time or maintenance time, cited with provenance.
  The repo bundles only the DPV curated subset (W3C-licensed, version-pinned) and
  schema/crosswalk tables (method, with citation).
- **No new manifest gates in the first three landings.** Items 1–3 and DPV phase 1 change
  references and workflow prose only; the regression suite is untouched until DPV phase 2, which
  arrives with its own fixtures.
- **No claim of verification this environment cannot perform.** The JURIX crosswalk, the OPP-115
  licence terms, and the GPI corpus terms all ship `[web search — verify]` until a fetch-capable
  session reads them — the same rule the skill applies to a DPA decision it could not reach.
