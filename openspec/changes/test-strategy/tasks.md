<!-- PLAN (tasks half), derived 2026-11-13; attack folded in. Not yet gated. -->

> Derives from: EPIC `test-strategy` ([`proposal.md`](proposal.md)); design in [`design.md`](design.md).

## 1. Stage 1: the skill, the matrix and the moves

- [ ] 1.1 Confirm the branch is on current `develop`; re-read each spec delta against the live
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
- [ ] 1.6 `epic-delivery`: replace the definition paragraph and the V-model table with pointers;
  update its description and Boundary *Owns* (D-4; spec *Verification and validation are defined in
  test-strategy*).
- [ ] 1.7 Test data: state the polyfactory rule in checklist item 6; cut `testing-setup.md`'s
  fixture prose and TDD/BDD loop to wiring plus pointers; make the other `red.?green.?refactor`
  lines in `skills/` name `test-driven-development` or point to it (DEC-9; spec *The test-data rule
  has one home*).
- [ ] 1.8 Add the D-8 pointer line to each technique owner the inventory names.
- [ ] 1.9 Add `test-strategy` to the `served_by` of each use case whose activity has a family file
  (D-11).
- [ ] 1.10 Write `tests/test_test_strategy.py` (D-7: ids, six questions per family, one-home
  patterns with allow-lists), test-first: red before 1.2–1.8, green after. Add the `ownership.yaml`
  entries.
- [ ] 1.11 Triggers: the static probes in `tests/trigger_probes.yaml` (including the `epic-delivery`
  pair) and one behavioural run with `skill-creator`, recorded in `evidence/triggers.md` (D-7;
  spec *The skill's trigger is proven against its neighbours*).
- [ ] 1.12 Evidence: `evidence/failure-case.md` and `evidence/baseline.md` (D-11).
- [ ] 1.13 User-facing docs: the README entry-point row and a CHANGELOG line. Repoint
  `docs/development/README.md` and `docs/practice/ai-coding/dod-quality-gates.md`, and add a pointer
  from `working-with-agents.md`. Then run `make bundles` and `make skill-inventory` (D-11).

## 2. Stage 2: criteria in every workflow

- [ ] 2.1 Navigator: accept and validate the optional `criteria` phase key in `phaseError` and the
  `Phase` type in `mods/navigator/types.d.ts`. Work test-first in `workflow.test.ts`, then run the
  full mod test suite and update any fixture that compares whole phases. Finish with `make bundles`
  (D-5; spec *Every workflow phase declares how it succeeds and fails*, scenarios *A repository file
  without criteria*, *Malformed criteria in a repository file*).
- [ ] 2.2 Repo lint `workflow_criteria` in `ALL_CHECKS`, with a negative test in
  `tests/test_repo_lint_negative.py` (D-5; scenario *A default phase without criteria*).
- [ ] 2.3 Write the criteria of all 50 phases in the nine default workflow files (D-5, RISK-3).
- [ ] 2.4 Bindings: the principle and the route to `test-strategy` in `AGENTS.md` and in
  `project-setup`'s `assets/templates/agentic/AGENTS.md.tmpl` (DEC-2; spec *The bindings mandate the
  founding principle*).
- [ ] 2.5 Document the `criteria` key for override authors in `docs/environment/navigator.md` and
  `docs/development/workflows.md` (D-11).
- [ ] 2.6 `make bundles`, `make validate`, `openspec validate test-strategy --strict`.
- [ ] 2.7 Acceptance demo with the developer, using the Quick Start script and a workflow phase's
  criteria, recorded in `evidence/acceptance.md` (D-11; LARGE makes it mandatory).

## Roadmap

- [ ] 1.1 · [ ] 1.10 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [ ] 1.7 · [ ] 1.8 · [ ] 1.9
  · [ ] 1.11 · [ ] 1.12 · [ ] 1.13 · [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6 · [ ] 2.7

## Verification

`make validate` green, which includes the inventory and one-home test, the workflow-criteria lint,
use-case coverage, bundles and the static probes. Also required: the navigator mod tests green,
`openspec validate test-strategy --strict`, the behavioural trigger run recorded, and the
developer's verdict in `evidence/acceptance.md`.
