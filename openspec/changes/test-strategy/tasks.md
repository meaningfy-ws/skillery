<!-- PLAN (tasks half), derived 2026-11-13. Not yet attacked or gated. -->

> Derives from: EPIC `test-strategy` ([`proposal.md`](proposal.md)); design in [`design.md`](design.md).

## 1. Stage 1: the skill, the matrix and the moves

- [ ] 1.1 Write `skills/test-strategy/references/inventory.md`: every check in `skills/` with its
  `CHK-nn`, what it checks, owner file and moment (design § Algorithm; spec *The matrix covers every
  check the catalogue has*).
- [ ] 1.2 Write the eight `references/<family>.md` files with the D-2 table, moving the V-model rows
  from `epic-delivery/references/verification-validation.md` into their families (D-1, D-4; spec
  *Every activity family has a matrix*).
- [ ] 1.3 Write `skills/test-strategy/SKILL.md`: frontmatter with the D-6 facets, the loop, the test
  definition, the questions and stances (D-3), reading the matrix, the LinkedIn Quick Start, Gotchas,
  Boundary (spec *One discipline, stated once*; *A non-code activity uses the skill*).
- [ ] 1.4 Add `purpose: quality` to `facets.yaml`; add `test-strategy` to `meaningfy-core` in
  `bundles.yaml` (D-6, DEC-7).
- [ ] 1.5 Move verification and validation: replace the definition paragraph in `epic-delivery`
  SKILL.md and the V-model table in its reference with one pointer each (D-4; spec *Verification and
  validation are defined in test-strategy*).
- [ ] 1.6 Test data: state the polyfactory rule in checklist item 6; cut `testing-setup.md`'s
  fixture prose and TDD/BDD loop to wiring plus pointers (DEC-9; spec *The test-data rule has one
  home*).
- [ ] 1.7 Add the D-8 pointer line to each technique owner the inventory names.
- [ ] 1.8 Write `tests/test_test_strategy.py`: the inventory-coverage and one-home checks (D-7).
  Test-first: it fails before 1.1–1.6 are complete.
- [ ] 1.9 Add the trigger probes (D-7) to `tests/trigger_probes.yaml`.
- [ ] 1.10 User-facing docs: README entry-point row, CHANGELOG line, a pointer from
  `docs/practice/ai-coding/working-with-agents.md`; run `make bundles` and `make skill-inventory`.

## 2. Stage 2: criteria in every workflow

- [ ] 2.1 Rebase onto `navigator-follows-the-work` if it has landed; otherwise note the overlap in
  the PR (D-9, RISK-1).
- [ ] 2.2 Navigator: accept and validate the optional `criteria` phase key in `phaseError` and the
  `Phase` type, test-first in `workflow.test.ts` (D-5; spec *Every workflow phase declares how it
  succeeds and fails*, scenario *A repository file without criteria*).
- [ ] 2.3 Repo lint `workflow_criteria`: every phase of every default file has both strings, with a
  negative test in `tests/test_repo_lint_negative.py` (D-5; scenario *A default phase without
  criteria*).
- [ ] 2.4 Write the criteria of every phase in the nine default workflow files (D-5, RISK-3).
- [ ] 2.5 Bindings: the principle and the route to `test-strategy` in `AGENTS.md` and in
  `project-setup`'s `assets/templates/agentic/AGENTS.md.tmpl` (DEC-2; spec *The bindings mandate
  the founding principle*).
- [ ] 2.6 `make bundles`, `make validate`, `openspec validate test-strategy --strict`.

## Roadmap

- [ ] 1.8 · [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [ ] 1.7 · [ ] 1.9 · [ ] 1.10
  · [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6

## Verification

`make validate` green (inventory and one-home test, workflow-criteria lint, probes, bundles),
navigator mod tests green, `openspec validate test-strategy --strict`, and the stage checker's
verdict on the Quick Start.
