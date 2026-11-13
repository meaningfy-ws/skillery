<!-- PLAN (tasks half), derived 2026-11-13; attack folded in; clarity gate 9.1/10 PASS (run 3). -->

> Derives from: EPIC `test-strategy` ([`proposal.md`](proposal.md)); design in [`design.md`](design.md).

## 1. Stage 1: the skill, the matrix and the moves

- [x] 1.0 The developer signs off the spec scenarios of this change (the PLAN gate), recorded in
  `evidence/acceptance.md` (D-11).
- [x] 1.1 Confirm the branch is on current `develop`; re-read each spec delta against the live
  specs and fix any conflict (RISK-1).
- [ ] 1.2 Write `skills/test-strategy/references/inventory.md`: every check in the catalogue with
  its `CHK-<n>`, what it checks, owner file and moment (design § Algorithm; spec *The matrix covers
  every check the catalogue has*).
- [ ] 1.3 Write the eight family files and `cross-cutting.md` with the D-2 table, moving the V-model
  rows per D-10 (D-1, D-2, D-4; spec *Every activity family has a matrix*).
- [ ] 1.4 Write `skills/test-strategy/SKILL.md`: the D-6 facets, the loop, the test definition, the
  questions and stances (D-3), reading the matrix, the LinkedIn Quick Start, Gotchas, Boundary (spec
  *One discipline, stated once*; *A non-code activity uses the skill*).
- [ ] 1.5 Add `purpose: quality` to `facets.yaml`; add `test-strategy` to `meaningfy-core` in
  `bundles.yaml` (D-6, DEC-7).
- [ ] 1.6 `epic-delivery`: replace with pointers the definition in SKILL.md § *Verification and
  validation*, the intro of `references/verification-validation.md` and the V-model table; update
  its description and Boundary *Owns* (D-4; spec *Verification and validation are defined in
  test-strategy*).
- [x] 1.7 Test data: state the polyfactory rule in checklist item 6; cut `testing-setup.md`'s
  fixture prose and TDD/BDD loop to wiring plus pointers; fix the two D-7 `tdd-loop` hits that name
  no owner (`testing-setup.md:102`, `CONTRIBUTING.md.tmpl:39`) so each names
  `test-driven-development` or drops the phrase (DEC-9; spec *The test-data rule has one home*).
- [ ] 1.8 Add the D-8 pointer line to each technique owner the inventory names.
- [ ] 1.9 Add `test-strategy` to the `served_by` of UC-W18, UC-W19, UC-W20, UC-W6, UC-W17, UC-W24,
  UC-W8 and UC-W16 (D-11 table).
- [x] 1.10 Write `tests/test_test_strategy.py` (D-7: ids, six questions per family, one-home
  patterns with allow-lists), test-first: red before 1.2–1.8, green after. Add the `ownership.yaml`
  entries.
- [ ] 1.11 Triggers: the static probes in `tests/trigger_probes.yaml` (including the `epic-delivery`
  pair) and one behavioural run with `skill-creator` (20 queries × 3 runs, the D-7 pass bar),
  recorded in `evidence/triggers.md` (D-7;
  spec *The skill's trigger is proven against its neighbours*).
- [ ] 1.12 Evidence: `evidence/failure-case.md`; `evidence/baseline.md` from the three baseline
  tasks (a Python module change, a LinkedIn post, a contract clause) with and without the skill
  (D-11).
- [ ] 1.13 User-facing docs: the README entry-point row and a CHANGELOG line naming the EPIC.
  Repoint the three docs that link the old V&V home: `docs/development/README.md` (line 93),
  `docs/practice/ai-coding/dod-quality-gates.md` (line 35) and
  `docs/practice/ai-coding/working-with-agents.md` (line 75). Then run `make bundles` and
  `make skill-inventory` (D-11).

## 2. Stage 2: criteria in every workflow

- [ ] 2.1 Navigator: accept and validate the optional `criteria` phase key in `phaseError`
  (`mods/navigator/lib/workflow.ts:129`) and the `Phase` type in `mods/navigator/types.d.ts:34`.
  Work test-first in `workflow.test.ts`, then run `make mods` (tests and `tsc`). Finish with
  `make bundles`, which copies the mod into `bundles/meaningfy-navigator/`. Done before 2.3
  (D-5; spec *Every workflow phase declares how it succeeds and fails*, scenarios *A repository file
  without criteria*, *Malformed criteria in a repository file*).
- [ ] 2.2 Repo lint `workflow_criteria` in `ALL_CHECKS`, modelled on `workflow_lead`
  (`tools/repo_lint/lint.py:1249`). Tests: a positive one in `tests/test_repo_lint.py` once 2.3 is
  done, and negative ones in `tests/test_repo_lint_negative.py` (a phase without criteria, an empty
  string, and the wrong-shape file that must not crash) (D-5; scenario *A default phase without
  criteria*).
- [ ] 2.3 Write the criteria of all 50 phases in the nine default workflow files (D-5, RISK-3).
- [ ] 2.4 Bindings: the principle and the route to `test-strategy` in `AGENTS.md` and in
  `project-setup`'s `assets/templates/agentic/AGENTS.md.tmpl` (DEC-2; spec *The bindings mandate the
  founding principle*).
- [ ] 2.5 Document the `criteria` key in `docs/development/mods.md` § *Workflow files*,
  `docs/development/workflows.md` § *Workflow files* and `docs/development/creating-skills.md`
  (D-11).
- [ ] 2.6 `make bundles`, `make validate`, `openspec validate test-strategy --strict`.
- [ ] 2.7 Acceptance demo with the developer, using the Quick Start script and a workflow phase's
  criteria, recorded in `evidence/acceptance.md` (D-11; LARGE makes it mandatory).

## Roadmap

- [x] 1.0 · [x] 1.1 · [x] 1.10 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [x] 1.7 · [ ] 1.8 · [ ] 1.9
  · [ ] 1.11 · [ ] 1.12 · [ ] 1.13 · [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6 · [ ] 2.7

## Verification

`make validate` green, which includes the inventory and one-home test, the workflow-criteria lint,
use-case coverage, bundles and the static probes. Also required: the navigator mod tests green,
`openspec validate test-strategy --strict`, the behavioural trigger run recorded, and the
developer's verdict in `evidence/acceptance.md`.
