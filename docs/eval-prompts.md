# Skill-Level Eval Prompts

The regression suite (`scripts/run_regression.js`) tests the builder exhaustively; it cannot
test the **model-facing workflow** — whether a fresh model, given SKILL.md and a realistic
request, actually maps regimes, exercises the coverage fallback, or adopts the two-document
posture. These three prompts cover the paths the suite cannot. Run them per the
skill-creator eval loop: fresh session, skill installed, prompt verbatim, then grade against
the checklist. Every unmet item is a hole in the skill text, not in the grader.

---

## Eval 1 — Multi-jurisdiction happy path (the spine plus three overlays)

**Prompt:**

> Run a DPIA on "PulseCheck", an employee wellbeing survey tool we're rolling out. Vendor
> is US-based (not DPF certified), hosting in Virginia. Employees in Germany, the UK,
> Nairobi, and our São Paulo office. Monthly pulse surveys plus passive Slack sentiment
> analysis; results visible to HR and line managers. Retention 3 years. No launch date
> pressure — be thorough.

**Expected behavior checklist:**

- [ ] One intake message at most; no checklist interrogation; proceeds on stated assumptions.
- [ ] Applicable-regimes table in the cover note: `eu-gdpr`, `uk-gdpr`, `ke-dpa`, `br-lgpd` —
      and **no US state regime** (employees only; Colorado/VA HR carve-outs; California has
      no employees in the fact pattern).
- [ ] Per-regime triggering screen: EU/UK mandatory (systematic monitoring of employees —
      vulnerable data subjects, evaluation/scoring); Kenya s. 31 screen run; Brazil RIPD
      demand-readiness posture with the volatility banner reflected.
- [ ] Transfer analysis per regime: EU/UK SCC + TIA for the non-DPF US vendor; Kenya s. 48
      safeguards; Brazil ANPD mechanism named without the unconfirmed resolution number.
- [ ] Sentiment analysis scored honestly (chilling effect, function creep to performance
      management); not every residual Low.
- [ ] If any residual rates High: Art. 36 + ODPC consultation both flagged; manifest uses
      `regulatorConclusions` per regime; `regulatorTable` block present; status coherent.
- [ ] Citations tagged; Kenya/Brazil pinpoints carry `[web search — verify]` or stricter,
      never bare assertions.
- [ ] Builder run once, exit 0; delivery summary covers divergence and the draft-for-review
      disclaimer.

## Eval 2 — Checklist-regime-only, two-document posture

**Prompt:**

> We need a Colorado data protection assessment for our new ad personalization feature —
> we sell segments to ad partners and use inferred interest profiles. Colorado consumers
> only, no EU/UK exposure. Our GC wants something we can hand the AG if they ever ask.

**Expected behavior checklist:**

- [ ] Regime mapping: `us-co` only; GDPR spine used as methodology but the document does
      not carry Art. 35(7) headings as legal claims, and no Art. 36 language anywhere.
- [ ] Trigger screen: targeted advertising + sale → assessment required (enumerated
      activities, not the WP29 screen).
- [ ] Producible posture recognized from "hand the AG": `docTitle` "DATA PROTECTION
      ASSESSMENT", `headerText: ""`, filename `DPA_...`, and the destination check
      surfaces the privileged-spine option rather than silently making one document.
- [ ] `complianceMap` for `us-co` present with the benefits inventory and explicit
      balancing verdict; `regulatorTable` shows "producible to the Colorado AG".
- [ ] Cover status vocabulary contains no Art. 36 box.
- [ ] No fabricated Rule 8.04 sub-paragraph citations — descriptive references only,
      flagged for first-fetch verification.

## Eval 3 — Uncovered regime (coverage fallback, no silent absorption)

**Prompt:**

> Quick DPIA please: loyalty app for our retail chain in Saudi Arabia and the UAE,
> collecting purchase history and location for personalized offers. Customers in Riyadh
> and Dubai only.

**Expected behavior checklist:**

- [ ] Neither regime is claimed as covered: Saudi and UAE have **screening-catalog entries
      only** — Section 6 carries the screening paragraphs plus the explicit fallback
      sentence ("coverage limited to this screening note; own-regime obligations not
      screened"), tagged, and the chat summary says so plainly.
- [ ] The assessment proceeds on the GDPR spine **explicitly labelled as methodology**, not
      as applicable law; no invented SDAIA/UAE pinpoints; the UAE entry distinguishes
      federal PDPL (regs pending) from DIFC/ADGM.
- [ ] The free-zone question (is the establishment DIFC/ADGM?) is raised as an intake fact
      or open question, because it changes which law applies.
- [ ] `jurisdictions` in the manifest does NOT contain an invented code; the build uses
      the default spine with the fallback documented in prose and Appendix B.
- [ ] Location + profiling scored honestly; delivery summary flags the coverage limits as
      the top open question.

---

**Grading note:** the graders for Evals 1–2 can additionally run the produced manifest back
through `build_dpia.js` — exit 0 and the expected blocks are mechanical checks. Eval 3's
core is negative: the run must *not* claim coverage it does not have. A polished document
that silently absorbs Saudi/UAE scope is a fail regardless of drafting quality.
