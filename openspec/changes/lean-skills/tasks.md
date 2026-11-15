# PLAN (tasks): Lean skills

> Derives from: the EPIC [`proposal.md`](proposal.md) (`lean-skills`); the design is
> [`design.md`](design.md). Stage 1 is detailed; stages 2 to 5 are detailed at the start of their
> own sessions (design § *Stages 2 to 5, outline*).

## 1. Stage 1: the standard, its lint, the five practices (wave 1)

Appetite of the stage: MEDIUM. Requirements: `lean-skill-standard` (budget, pointers, transition
list, shape, practices) and the modified `skill-crafting-method`.

- [x] 1.1 Failing tests first, in `tests/test_repo_lint_negative.py` on synthetic roots: one test
  per check outcome of the design's error matrix (over budget unlisted; stale `over_budget`; empty
  reason; stale per-check `pending` exemption; unknown name; budget-pending and `over_budget` both;
  malformed file gives one error only; an empty exemption list; a check named twice; pointer not
  in the sentence form, as a link, a code span, a bold file name and a table cell; closing heading
  "References"; a skill pending for `pointers` only that is over 24,576 bytes fails on the
  budget), asserting the exact messages of D-4, and passing tests on a bare root
  without `skill-budget.yaml`: a pointer in the sentence form wrapped over two list lines, one
  whose sentence holds "e.g." and "3.12", one in a blockquote, two pointers in one sentence, a
  heading "Quick reference", a link into another skill's `references/`, a link inside fenced
  code, keys set to `{}`. Failing cases also include a code span holding only an own file name, a
  folder path, and a topic mention in its own sentence. All fail
  before 1.2. (D-3, D-4, D-5)
- [x] 1.2 In `tools/repo_lint/lint.py`: `_skill_budget`, `_pointer_errors`, `prose_budget`,
  `reference_pointers` (D-3, D-4, D-5); both in `ALL_CHECKS` and `METHOD_CHECKS`. Run impact analysis on
  `skill_size_report` first. The tests of 1.1 pass.
- [x] 1.3 Change `skill_size_report` to the 6 KB body target and its label in
  `_print_trigger_notes` to "lean body target"; remove `ADVISORY_SKILL_LINES` and
  `ADVISORY_SKILL_TOKENS` (D-3). Message: `<skill>: SKILL.md body is <n> bytes (lean body target
  6144)`. Test first: a body of 6,145 bytes gives a note, one of 6,144 none. `skill_too_long` is
  unchanged.
- [x] 1.4 Run both checks on the real tree with no list; write `skill-budget.yaml` with every
  failing skill under `pending`, sorted, each with the checks it fails, and `over_budget: {}`;
  header comment as in D-4. Record the list and its count in the PR description. Repeat after the
  last rebase, right before merge.
- [x] 1.5 In `tests/test_repo_lint.py`: both checks return `[]` on the real tree.
- [x] 1.6 Write `docs/development/creating-skills.md` § *The lean standard*, replacing § *Body*:
  tiers and budget, `skill-budget.yaml`, the shape, the sorting classes, the five practices, the
  good and bad pointer example (D-1, D-2, D-4, D-6, D-7, D-8). Under 8 KB. Move the agentskills.io
  numbers into the "What we adopt" row as the specification's outer limit.
- [x] 1.7 `docs/development/skill-template.md` takes the shape of D-2, with the two table forms and
  a pointer that says when and what.
- [x] 1.8 `docs/development/README.md` principle 7: one sentence on the three tiers, linking to
  § *The lean standard*, with no number of its own.
- [x] 1.9 CHANGELOG `[Unreleased]` › Added: the lean standard and its two checks, written for
  someone authoring a skill. In `skills/test-strategy/references/inventory.md`, add
  `prose_budget` and `reference_pointers` to the check cell of CHK-125 and change "skill size" to
  "lean body target" in CHK-130; no new CHK id (RISK-8).
- [x] 1.10 `make lint`, `make validate`, `make validate-spine` green; `detect_changes` against
  `develop` shows only the lint symbols named above. Pull request into `develop`.

## 2. Stage 2: the pilot on `cosmic-python` (wave 2, after R2 stage 1)

- [x] 2.1 Detail this stage in the PLAN (after-gate revision, S-10), including the
  `code-principles-governance` delta: ids survive; the ten clean-code and SOLID entries short and
  tied to their checks (DEC-12). Done as design D-9 to D-15 and the spec delta.
- [x] 2.2 Assess, rewrite, second reader, docs page for `mapping-suite-sdk`, extraction-threshold
  defect, remove from `pending` (design § outline). Detailed (D-9 to D-15):
  - [x] 2.2.1 Assessment record `evidence/assessment-cosmic-python.md` (D-7 format): every passage
    of the body and of the nine references, its class and where it went.
  - [x] 2.2.2 Catalogue: the `## Clean code and SOLID` table with the ten `CC-` ids (D-10), the two
    numbers of D-11, any passage sorted keep from the example files (D-12).
  - [x] 2.2.3 Body rewritten to D-9; the seven example files deleted; pointers in the sentence
    form; `cosmic-python` removed from `skill-budget.yaml`.
  - [x] 2.2.4 `docs/practice/engineering-standards/worked-examples.md` (D-12); the citers of D-14.
  - [x] 2.2.5 Second reader (D-15); lost rules restored; verdict in the assessment record (D-16).
  - [x] 2.2.6 `make bundles`, `make skill-inventory`, `make validate`, `make validate-spine`,
    `openspec validate lean-skills --strict`; CHANGELOG `[Unreleased]` line; pull request.
- [x] 2.3 Owner checkpoint: the owner reviews the rewritten skill and its assessment before stage 3.
  Decided by the lead on the owner's instruction (design D-17).

## 3. Stage 3: the other engineering skills (wave 5)

- [ ] 3.1 Detail the stage and its skill order; then the per-skill loop for each skill of
  `meaningfy-building` and `meaningfy-architecture`. Detailed as design D-17 to D-21:
  - [x] 3.1.1 Stages 3 to 5 detailed (D-17 to D-21); start conditions waived (D-18).
  - [ ] 3.1.2 Builders, one per batch (D-19): the twelve skills of D-21, each with its assessment
    record, its rewrite, its pointers in the form and its citers.
  - [ ] 3.1.3 Second readers (D-15, D-19); lost rules restored; verdicts in the records.
  - [ ] 3.1.4 The twelve skills off `pending`, or an `over_budget` reason (D-20); `make bundles`,
    `make skill-inventory`, `make validate`, `make validate-spine`, `openspec validate lean-skills
    --strict`; CHANGELOG line; pull request.

## 4. Stage 4: sales (wave 5)

- [ ] 4.1 Detail the stage; the per-skill loop for each skill of `meaningfy-sales`.

## 5. Stage 5: devops and the rest (wave 5)

- [ ] 5.1 Detail the stage; the per-skill loop for every remaining skill.
- [ ] 5.2 `pending` empty and removed; measure total prose of `skills/` (D-1 measure) and record it
  against 1 MB (DEC-9) in `evidence/`.

## Roadmap

- [x] 1.1 · [x] 1.2 · [x] 1.3 · [x] 1.4 · [x] 1.5 · [x] 1.6 · [x] 1.7 · [x] 1.8 · [x] 1.9 · [x] 1.10
- [x] 2.1 · [x] 2.2 · [ ] 2.3 · [ ] 3.1 · [ ] 4.1 · [ ] 5.1 · [ ] 5.2

## Verification

Stage 1: the negative tests bite, `make validate` and `make validate-spine` are green, and the
standard is under 8 KB. The EPIC: the four checks of DEC-9.
