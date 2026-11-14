# PLAN (tasks): Lean skills

> Derives from: the EPIC [`proposal.md`](proposal.md) (`lean-skills`); the design is
> [`design.md`](design.md). Stage 1 is detailed; stages 2 to 5 are detailed at the start of their
> own sessions (design § *Stages 2 to 5, outline*).

## 1. Stage 1: the standard, its lint, the five practices (wave 1)

Appetite of the stage: MEDIUM. Requirements: `lean-skill-standard` (budget, pointers, transition
list, shape, practices) and the modified `skill-crafting-method`.

- [ ] 1.1 Failing tests first, in `tests/test_repo_lint_negative.py` on synthetic roots: one test
  per check outcome of the design's error matrix (over budget unlisted; stale `over_budget`; empty
  reason; stale per-check `pending` exemption; unknown name; budget-pending and `over_budget` both;
  malformed file gives one error only; pointer not in the sentence form, as a link, a code span, a
  bold file name and a table cell; closing heading containing "reference"), and passing tests on a
  bare root without `skill-budget.yaml`: a pointer in the sentence form, a link into another
  skill's `references/`, a link inside fenced code. All fail before 1.2. (D-3, D-4, D-5)
- [ ] 1.2 In `tools/repo_lint/lint.py`: `_skill_budget`, `prose_budget`, `reference_pointers`
  (D-3, D-4, D-5); both in `ALL_CHECKS` and `METHOD_CHECKS`. Run impact analysis on
  `skill_size_report` first. The tests of 1.1 pass.
- [ ] 1.3 Change `skill_size_report` to the 6 KB body target and its label in
  `_print_trigger_notes` to "lean body target"; remove `ADVISORY_SKILL_LINES` and
  `ADVISORY_SKILL_TOKENS` (D-3). `skill_too_long` is unchanged.
- [ ] 1.4 Run both checks on the real tree with no list; write `skill-budget.yaml` with every
  failing skill under `pending`, sorted, each with the checks it fails, and `over_budget: {}`;
  header comment as in D-4. Record the list and its count in the PR description. Repeat after the
  last rebase, right before merge.
- [ ] 1.5 In `tests/test_repo_lint.py`: both checks return `[]` on the real tree.
- [ ] 1.6 Write `docs/development/creating-skills.md` § *The lean standard*, replacing § *Body*:
  tiers and budget, `skill-budget.yaml`, the shape, the sorting classes, the five practices, the
  good and bad pointer example (D-1, D-2, D-4, D-6, D-7, D-8). Under 8 KB. Move the agentskills.io
  numbers into the "What we adopt" row as the specification's outer limit.
- [ ] 1.7 `docs/development/skill-template.md` takes the shape of D-2, with the two table forms and
  a pointer that says when and what.
- [ ] 1.8 `docs/development/README.md` principle 7: one sentence on the three tiers, linking to
  § *The lean standard*, with no number of its own.
- [ ] 1.9 CHANGELOG `[Unreleased]` › Added: the lean standard and its two checks, written for
  someone authoring a skill. Add the two checks as rows to
  `skills/test-strategy/references/inventory.md` beside CHK-125 and CHK-130 (RISK-8).
- [ ] 1.10 `make lint`, `make validate`, `make validate-spine` green; `detect_changes` against
  `develop` shows only the lint symbols named above. Pull request into `develop`.

## 2. Stage 2: the pilot on `cosmic-python` (wave 2, after R2 stage 1)

- [ ] 2.1 Detail this stage in the PLAN (after-gate revision, S-10), including the
  `code-principles-governance` delta: ids survive; the ten clean-code and SOLID entries short and
  tied to their checks (DEC-12).
- [ ] 2.2 Assess, rewrite, second reader, docs page for `mapping-suite-sdk`, extraction-threshold
  defect, remove from `pending` (design § outline).
- [ ] 2.3 Owner checkpoint: the owner reviews the rewritten skill and its assessment before stage 3.

## 3. Stage 3: the other engineering skills (wave 5)

- [ ] 3.1 Detail the stage and its skill order; then the per-skill loop for each skill of
  `meaningfy-building` and `meaningfy-architecture`.

## 4. Stage 4: sales (wave 5)

- [ ] 4.1 Detail the stage; the per-skill loop for each skill of `meaningfy-sales`.

## 5. Stage 5: devops and the rest (wave 5)

- [ ] 5.1 Detail the stage; the per-skill loop for every remaining skill.
- [ ] 5.2 `pending` empty and removed; measure total prose of `skills/` (D-1 measure) and record it
  against 1 MB (DEC-9) in `evidence/`.

## Roadmap

- [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [ ] 1.7 · [ ] 1.8 · [ ] 1.9 · [ ] 1.10
- [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 3.1 · [ ] 4.1 · [ ] 5.1 · [ ] 5.2

## Verification

Stage 1: the negative tests bite, `make validate` and `make validate-spine` are green, and the
standard is under 8 KB. The EPIC: the four checks of DEC-9.
