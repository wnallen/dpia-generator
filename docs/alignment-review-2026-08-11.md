# Alignment Review — current repo vs. `claude/dpia-generator-comparison-pk3b65`

Date: 2026-08-11. Prepared on branch `claude/dpia-repo-alignment-test-atrbhc` (head `f6ab44a`, the PR #9 lineage).

## Verdict

**Yes — the two lines can be aligned, at low cost.** A real merge attempt produces exactly one
conflict hunk in each of two files (`README.md`, `SKILL.md`), both being the two branches'
changelog/Version entries inserted at the same position. Everything else — including
`package.json`/`package-lock.json`, which both branches bumped identically to `4.2.0` — merges
automatically. There are no code conflicts: the comparison branch changes no builder or test
files ("no builder change; suite unchanged" is its own stated contract), while this branch's
builder and fixture changes touch files the comparison branch never edits.

## What each line contains

Both branches fork from the same base, `bdd4f29` (PR #8, v4.1.1). Note that `main` itself is
stale at `5426e34` (PR #2, v2.0.x era); the live lineage has advanced through PRs #3–#9.

| | Current repo (this branch / PR #9 lineage) | `claude/dpia-generator-comparison-pk3b65` |
|---|---|---|
| Self-declared version | **v4.2 — posture derivation** (via v4.1.2) | **v4.2 — house-style profile + role-aware filing gate** |
| Builder (`scripts/build_dpia.js`) | Changed: header/footer/cover derive from whether the manifest names a `counsel` | Untouched |
| Regression suite | 41 cases (posture cases added/extended) | 39 cases (unchanged from base) |
| New reference files | — | `references/house-style.md` |
| Workflow (`SKILL.md`) | Cover-page-roles intake rule; posture-derived destination check; Step 6 posture assumption | House-Style Mode; Step 0.7; role-aware regulator filing gate; no-counsel header posture |
| Docs | — | `docs/eval-prompts.md` additions |

## Merge mechanics

- `git merge origin/claude/dpia-generator-comparison-pk3b65` from this branch: **2 files
  conflicted, 1 hunk each**, both in the version-history sections (each branch's own "v4.2"
  entry). Resolution is concatenation plus renumbering — no prose interleaving required.
- The two features are architecturally complementary: this branch moved the no-counsel posture
  *into the builder*; the comparison branch adds a *profile and workflow* layer (house style,
  filing gate) that consumes builder knobs without touching them.

## Semantic reconciliation required (beyond the two textual hunks)

1. **Version collision.** Both lines call themselves v4.2 and bump `package.json` to 4.2.0.
   Renumber the incoming house-style work to **v4.3** (bump to 4.3.0) rather than folding two
   unrelated feature sets into one changelog entry.
2. **Duplicate no-counsel header rule — the one real overlap.** The comparison branch's SKILL
   "Role posture (no-counsel controllers)" paragraph instructs manually defaulting `headerText`
   to `"CONFIDENTIAL — INTERNAL DRAFT"` where no lawyer is involved. This branch's builder now
   derives `"CONFIDENTIAL — DRAFT FOR DPO REVIEW"` automatically from the absent `counsel`
   field, and two regression cases pin that behavior. After a naive merge both rules coexist
   (two different header texts for the same posture, one manual and one automatic). Resolution:
   rewrite that paragraph to defer to the builder derivation — the manual instruction is
   superseded, and `organization.counsel: none` in a house-style profile should simply mean
   "do not set `counsel` in the manifest".
3. **`titles.headerText` precedence note.** `references/house-style.md` maps the profile's
   `titles.headerText` onto the manifest `headerText` default. With the posture-derived default
   now in the builder, the consumption table should state the full precedence (explicit
   `headerText` — including a profile-supplied one — overrides the posture-derived default,
   which the builder already supports) and that a profile must not restore an attorney-work-product
   header on a `counsel: none` organization — that is a privilege-posture rule, not presentation,
   and sits on the wrong side of the profile's own presentation-only boundary.
4. **No contradiction in the counsel questions.** This branch says "never ask whether the user
   has a lawyer" (intake); the comparison branch's filing gate asks "has an attorney reviewed
   this?" (only when producing a ready-to-file version). Different moments, compatible rules —
   worth one cross-reference sentence so a future editor doesn't "fix" one against the other.

Recommended sequence: merge the comparison branch into this lineage, resolve the two changelog
hunks, apply items 1–3 above, re-run `node scripts/run_regression.js` (expected 41/41 — the
incoming branch does not touch the builder or fixtures).

## Behavior test of the current repo (same date)

- `npm install`: clean, 0 vulnerabilities. Regression suite: **41/41 passed**.
- Sample use case: a common DPIA scenario — an AI customer-support chatbot ("HelpDesk AI
  Assistant") with EU + UK scope, a US LLM processor, incidental special-category data in free
  text, DPO-led (no counsel). The one-off test manifest was not kept in the repo.
- Build: exit 0; OOXML validation **passed** (363 paragraphs). Output
  `DPIA_HelpDesk_AI_Assistant_2026-08-11.docx`.
- Verified in the output: posture-derived header `CONFIDENTIAL — DRAFT FOR DPO REVIEW` and
  footer `AI-generated draft (dpia-generator) — for DPO review`; no Counsel of Record line;
  derived ratings and starred High residual (R2); conditional Article 36 register footnote and
  computed regulator-engagement table (EU lead authority + ICO); Art. 36 status checkbox;
  §1.10 notice-check drift rows with committed actions and the builder's resolution footnote;
  inherent/residual/mitigated matrices from one register.
- Gates (negative tests): a mis-stated `residualRating` → exit 3 naming the row;
  `priorConsultation: false` against a register deriving "conditional" → exit 3 with the
  do-not-flip instruction. Both correct.

**Conclusion: the current repo behaves as documented**, and the comparison branch can be
aligned with one merge commit plus the three reconciliation edits above.
