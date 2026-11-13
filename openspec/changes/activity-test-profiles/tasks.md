<!-- PLAN (tasks half), derived 2026-11-13. Delivery does not start before A is delivered and each
     stage's preflight passes. -->

> Derives from: EPIC `activity-test-profiles` ([`proposal.md`](proposal.md)); design in [`design.md`](design.md).

Every stage follows the stage loop of design § Algorithm. A stage whose decision table has no
`fill` line skips its fill tasks (marked *fill only*) and ships as D-15 says.

## 0. Before any stage

- [ ] 0.1 The developer signs off the spec scenarios of this change (the PLAN gate), recorded in
  `evidence/acceptance.md`.
- [ ] 0.2 Run re-checks R-A1, R-A2, R-A3 and R-S2; record the result in `evidence/preflight.md`.
  A failed re-check stops delivery and goes to the developer (RISK-1).
- [ ] 0.3 Add `CLOSED_FAMILIES` (empty) and the closed-family test to
  `tests/test_test_strategy.py`, with a fixture case for a `gap` row and for an `accepted` row
  without a reason (D-14; spec *A closed family stays closed*).

## 1. Stage 1: documentation

- [ ] 1.1 Preflight: R-A4, R-A5, R-B1, R-B2, R-B3, R-B5, R-S1, appended to `evidence/preflight.md`.
- [ ] 1.2 Copy `documentation.md`'s gap rows into `evidence/survey-documentation.md` and run the
  survey searches (design § Algorithm, step 3; D-5).
- [ ] 1.3 Tool run: Vale with the four candidate packages, and a docs ls-lint draft, on skillery's
  `docs/`, from the scratch folder; write `evidence/toolrun-vale.md` and
  `evidence/toolrun-ls-lint-docs.md` (D-8, D-9, D-10; spec *Each tool runs once on a real tree*).
- [ ] 1.4 Owner round: failures seen, findings marked "would fix" or "noise", packages and rules
  picked, the decision table confirmed; answers to `inputs/qa.md` (D-7, D-9).
- [ ] 1.5 *Fill only.* Fixture pairs under `quality/tests/`, red first, then `quality/vale/` and
  `quality/ls-lint/docs.yml` as decided, and INV-3's test (D-11, D-12; spec *Vale's styles are
  pinned, never copied*; *Docs and stacks configurations*).
- [ ] 1.6 *Fill only.* `technical-writing`: the adopted checks in the documentation workflow's
  `verify` row and a short section naming when each runs, whether it blocks and its cost; the
  pointer line (D-6, D-13; spec *Documentation checks run in the verify phase*).
- [ ] 1.7 Close: matrix edits in `documentation.md` and `inventory.md`; `documentation` joins
  `CLOSED_FAMILIES`; keep or delete the conditional requirements; `evidence/catch-documentation.md`;
  CHANGELOG line; `make bundles`, `make skill-inventory`, `make validate`,
  `openspec validate activity-test-profiles --strict` (D-13..D-16; spec *A family's gaps are filled
  from recorded failures or accepted*).
- [ ] 1.8 Stage checker: the decision table against the diff (INV-2), the evidence scrub (INV-4);
  then one PR into `develop`.

## 2. Stage 2: shaping

- [ ] 2.1 Preflight: R-A4, R-A5, R-S1.
- [ ] 2.2 Copy `shaping.md`'s gap rows into `evidence/survey-shaping.md`; record #143 as
  `F-shaping-1`; run the survey searches for further failures.
- [ ] 2.3 Owner round: failures seen, the decision table confirmed.
- [ ] 2.4 Write `skills/epic-planning/references/invariants.md`: what an invariant is and is not,
  the write-path list, the #143 case replayed as in design § Algorithm (D-4, D-12).
- [ ] 2.5 `epic-planning` SKILL.md: the invariants question in step 2 and the table in step 6, at
  most four added lines, linking 2.4 (D-3, D-4; spec *The shaping interview asks for invariants*).
- [ ] 2.6 Template: `## Invariants` and the error-matrix comment in
  `skills/project-setup/assets/openspec-schema/meaningfy/templates/design.md`; the bullet in
  `schema.yaml`; `make bundles`; `tests/test_bundle_gen.py` green (D-1, D-2; spec *The PLAN records
  invariants*; *The EPIC and PLAN templates speak plain language*).
- [ ] 2.7 Comment on #143: the columns delivered here, the `clarity-gate` item still open (D-3).
- [ ] 2.8 The invariants trace, if R-B4 holds: dispatch the tester on this PLAN with B's brief and
  write `evidence/invariants-trace.md`. If R-B4 does not hold yet, leave unchecked; task 6.1 picks
  it up (D-18; spec *Invariants reach the tester*).
- [ ] 2.9 Close as 1.7, for `shaping.md` and `evidence/catch-shaping.md`; then the stage checker
  and one PR as 1.8.

## 3. Stage 3: DevOps

- [ ] 3.1 Preflight: R-A4, R-A5, R-B1, R-B2, R-B3, R-B5, R-S1; a read-only checkout of
  `infrastructure-stacks` is available.
- [ ] 3.2 Copy `devops.md`'s gap rows into `evidence/survey-devops.md`; run the survey searches,
  including both infra repositories' issues and review comments and the runbook question.
- [ ] 3.3 Tool run: an ls-lint draft and checkmake on the checkout, fix modes off; confirm the
  checkout is unchanged; write `evidence/toolrun-ls-lint-stacks.md` and
  `evidence/toolrun-checkmake.md`, scrubbed (D-8, D-10).
- [ ] 3.4 Owner round: failures seen (the runbook question included), findings marked, the decision
  table confirmed.
- [ ] 3.5 *Fill only.* Fixture pairs, red first, then `quality/ls-lint/stacks.yml` and
  `quality/checkmake/stacks.ini` as decided (D-11, D-12).
- [ ] 3.6 *Fill only.* `stack-operations` (`references/stack-standard.md`) and
  `infrastructure-operations` (`references/repo-checks.md`): the adopted checks with their three
  facts; a runbook check only if a runbook failure was recorded (D-6; spec *Layout and Makefile
  checks for stacks*).
- [ ] 3.7 Comment on #216 with the scrubbed findings and what `quality/` now offers.
- [ ] 3.8 Close as 1.7, for `devops.md` and `evidence/catch-devops.md`; then the stage checker and
  one PR as 1.8.

## 4. Stage 4: architecture and modelling

- [ ] 4.1 Preflight: R-A4.
- [ ] 4.2 Copy the gap rows of `architecture.md` and `modelling.md` into
  `evidence/survey-architecture-modelling.md`; run the survey searches.
- [ ] 4.3 Owner round: failures seen, the decision table confirmed; for a `fill`, the capability
  and the scenarios of its new delta are signed off here (D-16).
- [ ] 4.4 *Fill only.* Write the spec delta, then the worked example, then the check in a reference
  file of the owning skill (D-12, D-16, D-17).
- [ ] 4.5 Close as 1.7, for both family files and `evidence/catch-architecture-modelling.md`; then
  the stage checker and one PR as 1.8.

## 5. Stage 5: UI

- [ ] 5.1 Preflight: R-A4.
- [ ] 5.2 Copy `ui.md`'s gap rows into `evidence/survey-ui.md`; run the survey searches.
- [ ] 5.3 Owner round: failures seen, the decision table confirmed. Each `accepted` reason names
  the external design plugin skill that covers the question, where one does.
- [ ] 5.4 *Fill only.* As 4.4.
- [ ] 5.5 Close as 1.7, for `ui.md`; then the stage checker and one PR as 1.8.

## 6. Closing the EPIC

- [ ] 6.1 Any proof left open: the invariants trace (2.8), run once R-B4 holds.
- [ ] 6.2 Check DEC-7's four proofs against the evidence folder and list them in
  `evidence/acceptance.md`: catch files per stage, `CLOSED_FAMILIES` holding all six families, the
  trace, the tool-run summaries.
- [ ] 6.3 Acceptance with the developer: one survey file read end to end and the invariants path
  shown on a real PLAN; the verdict recorded in `evidence/acceptance.md`.

## Roadmap

- [ ] 0.1 · [ ] 0.2 · [ ] 0.3
- [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [ ] 1.7 · [ ] 1.8
- [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6 · [ ] 2.7 · [ ] 2.8 · [ ] 2.9
- [ ] 3.1 · [ ] 3.2 · [ ] 3.3 · [ ] 3.4 · [ ] 3.5 · [ ] 3.6 · [ ] 3.7 · [ ] 3.8
- [ ] 4.1 · [ ] 4.2 · [ ] 4.3 · [ ] 4.4 · [ ] 4.5
- [ ] 5.1 · [ ] 5.2 · [ ] 5.3 · [ ] 5.4 · [ ] 5.5
- [ ] 6.1 · [ ] 6.2 · [ ] 6.3

A stage blocked at its preflight may be overtaken by a later one whose preflight passes (D-20).

## Verification

Per stage: `make validate` green (it includes the closed-family test and, locally, `quality/`'s
fixture tests), `openspec validate activity-test-profiles --strict`, and the stage checker's
verdict on INV-2 and INV-4. For the EPIC: the four proofs listed in `evidence/acceptance.md` with
the developer's verdict.
