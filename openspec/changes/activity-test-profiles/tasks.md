<!-- PLAN (tasks half), derived 2026-11-13; attack folded in 2026-11-14. Delivery does not start
     before A's stage 1 is merged and each stage's preflight passes (design D-20). -->

> Derives from: EPIC `activity-test-profiles` ([`proposal.md`](proposal.md)); design in [`design.md`](design.md).

Every stage follows the stage loop of design § Algorithm. A stage whose decision table has no
`fill` line skips its tasks marked *fill only* and ships as D-15 says. Section 0 rides in the PR
of the first stage delivered (D-14).

## 0. Before any stage

- [ ] 0.1 The developer signs off the spec scenarios of this change (the PLAN gate), recorded in
  `evidence/acceptance.md`.
- [ ] 0.2 Run re-checks R-A1, R-A2, R-A3 and R-S2; record the result in `evidence/preflight.md`.
  A failed re-check stops delivery and goes to the developer (RISK-1).
- [ ] 0.3 Add `CLOSED_FAMILIES` (empty) and the closed-family test to
  `tests/test_test_strategy.py`, with fixture cases for a `gap` row and for an `accepted` row
  without a reason (D-14; spec *A closed family stays closed*).

## 1. Stage 1: documentation

- [ ] 1.1 Preflight: R-A4, R-A5, R-B1, R-B2, R-B3, R-B5, R-B6, R-S1, appended to
  `evidence/preflight.md`.
- [ ] 1.2 Copy every gap row of `documentation.md` into `evidence/survey-documentation.md` and run
  the survey searches (design § Algorithm, steps 2 and 3; D-5; spec *Each stage's failures come
  from a recorded survey*).
- [ ] 1.3 Tool run: install Vale and ls-lint pinned into scratch; run Vale with the four candidate
  packages, and a docs ls-lint draft, on skillery's `docs/`; write `evidence/toolrun-vale.md` and
  `evidence/toolrun-ls-lint-docs.md` (D-8, D-9, D-10; spec *Each tool runs once on a real tree*).
- [ ] 1.4 Owner round: failures seen, findings marked "would fix" or "noise", packages and rules
  picked, any gap row naming B or D decided, the decision table confirmed; answers to
  `inputs/qa.md` (D-7, D-9).
- [ ] 1.5 *Fill only.* Add `documentation` to `CLOSED_FAMILIES` (red). Fixture pairs under
  `quality/tests/`, red first; extend the meta-test to configurations and manifest entries; then
  `quality/vale/` and `quality/ls-lint/docs.yml` as decided, and INV-3's test (D-11, D-12; spec
  *Vale's styles are pinned, never copied*; *Docs and stacks configurations*).
- [ ] 1.6 *Fill only.* `technical-writing` SKILL.md: the adopted checks as a step of the
  documentation workflow's `verify` row, and a short section naming for each the command against
  the fetched `quality/`, when it runs, whether it blocks and its cost; the pointer line. Add each
  adopted tool to `dependencies.yaml` unless B did (D-6, D-13, D-21; spec *Documentation checks
  run in the verify phase*).
- [ ] 1.7 Close: matrix edits in `documentation.md` and `inventory.md`; `documentation` in
  `CLOSED_FAMILIES`, green; keep or delete the conditional requirements; for each fill a line in
  `evidence/catch-documentation.md`; CHANGELOG line; `make bundles`, `make skill-inventory`,
  `make validate`, `openspec validate activity-test-profiles --strict` (D-12..D-16, D-21; spec *A
  family's gaps are filled from recorded failures or accepted*).
- [ ] 1.8 Stage checker (a subagent that built nothing of the stage): the decision table against
  the diff (INV-2), the evidence scrub (INV-4), the D-21 items; then one PR into `develop` naming
  #212.

## 2. Stage 2: shaping

- [ ] 2.1 Preflight: R-A4, R-A5, R-B4, R-S1. If R-B4 fails, stop and ask the developer (error
  matrix).
- [ ] 2.2 Copy every gap row of `shaping.md` into `evidence/survey-shaping.md`; record #143 as
  `F-shaping-1`; run the survey searches for further failures.
- [ ] 2.3 Owner round: failures seen, the decision table confirmed.
- [ ] 2.4 Baseline, before any skill edit: the sample two-store EPIC planned by a fresh subagent
  with today's `epic-planning`; record in `evidence/baseline-shaping.md` whether the create path is
  named (D-21).
- [ ] 2.5 Write `skills/epic-planning/references/invariants.md`: what an invariant is and is not,
  the write-path list, the #143 case replayed as in design § Algorithm (D-4, D-12).
- [ ] 2.6 `epic-planning` SKILL.md: the invariants question in step 2 and the table in step 6, at
  most four added lines, linking 2.5; the `plan-invariants` entry in `tests/ownership.yaml` (D-3,
  D-4, D-21; spec *The shaping interview asks for invariants*).
- [ ] 2.7 Template: `## Invariants` and the error-matrix comment in
  `skills/project-setup/assets/openspec-schema/meaningfy/templates/design.md`; the bullet in
  `schema.yaml`; `make bundles`; `tests/test_bundle_gen.py` green (D-1, D-2; spec *The PLAN records
  invariants*; *The EPIC and PLAN templates speak plain language*). Comment on #143: the columns
  delivered here, the `clarity-gate` item still open (D-3).
- [ ] 2.8 Baseline, after: the same sample EPIC with the changed skill, a fresh subagent; add the
  result to `evidence/baseline-shaping.md`. If the create path is still not named, revise 2.5 and
  2.6 and re-run (D-21).
- [ ] 2.9 Close as 1.7, for `shaping.md` and `evidence/catch-shaping.md`; then the stage checker
  and one PR as 1.8, naming #143.

## 3. Stage 3: DevOps

- [ ] 3.1 Preflight: R-A4, R-A5, R-B1, R-B2, R-B3, R-B5, R-S1; a read-only checkout of
  `infrastructure-stacks` is available; list its Makefiles, and `cloud-infrastructure`'s if it has
  none (D-8).
- [ ] 3.2 Copy every gap row of `devops.md` into `evidence/survey-devops.md`; run the survey
  searches, including both infra repositories' issues and review comments and the runbook question.
- [ ] 3.3 Tool run: install ls-lint and checkmake pinned into scratch; run an ls-lint draft and
  checkmake on the checkout, fix modes off; confirm with `git status` that the checkout is
  unchanged; write `evidence/toolrun-ls-lint-stacks.md` and `evidence/toolrun-checkmake.md`,
  scrubbed (D-8, D-10).
- [ ] 3.4 Owner round: failures seen (the runbook question included), findings marked, the decision
  table confirmed.
- [ ] 3.5 *Fill only.* Add `devops` to `CLOSED_FAMILIES` (red). Fixture pairs, red first, covered by
  the meta-test; then `quality/ls-lint/stacks.yml` and `quality/checkmake/stacks.ini` as decided
  (D-11, D-12).
- [ ] 3.6 *Fill only.* For each adopted check, first the rule it encodes and why, then the check
  with its three facts, under a subsection *Recommended checks*: the layout rule and ls-lint in
  `stack-operations`' `references/stack-standard.md`; the Makefile rule and checkmake in
  `infrastructure-operations`' `references/repo-checks.md`, outside its MUST. A runbook check only
  if a runbook failure was recorded. Add each adopted tool to `dependencies.yaml` unless B did
  (D-6, D-21; spec *Layout and Makefile checks for stacks*).
- [ ] 3.7 Comment on #216 with the scrubbed findings and what `quality/` now offers.
- [ ] 3.8 Close as 1.7, for `devops.md` and `evidence/catch-devops.md`; then the stage checker and
  one PR as 1.8, naming #216.

## 4. Stage 4: architecture and modelling

- [ ] 4.1 Preflight: R-A4.
- [ ] 4.2 Copy every gap row of `architecture.md` and `modelling.md` into
  `evidence/survey-architecture-modelling.md`; run the survey searches.
- [ ] 4.3 Owner round: failures seen, the decision table confirmed; for a `fill`, the capability
  and the scenarios of its new delta are signed off here (D-16).
- [ ] 4.4 *Fill only.* Add the families to `CLOSED_FAMILIES` (red). Write the spec delta, then the
  worked example, then the check in a reference file of the owning skill (D-12, D-16, D-17).
- [ ] 4.5 Close as 1.7, for both family files and `evidence/catch-architecture-modelling.md`; then
  the stage checker and one PR as 1.8, naming the EPIC.

## 5. Stage 5: UI

- [ ] 5.1 Preflight: R-A4.
- [ ] 5.2 Copy every gap row of `ui.md` into `evidence/survey-ui.md`; run the survey searches.
- [ ] 5.3 Owner round: failures seen, the decision table confirmed. Each `accepted` reason names
  the external design plugin skill that covers the question, where one does.
- [ ] 5.4 *Fill only.* As 4.4.
- [ ] 5.5 Close as 1.7, for `ui.md`; then the stage checker and one PR as 1.8, naming the EPIC.

## 6. Closing the EPIC

- [ ] 6.1 The invariants trace: on the first PLAN that qualifies (D-18), dispatch the tester with
  B's brief and write `evidence/invariants-trace.md`. If none has appeared when stages 1 to 5 are
  closed, ask the developer: wait, or a sample PLAN (spec *Invariants reach the tester*).
- [ ] 6.2 Check DEC-7's four proofs against the evidence folder and list them in
  `evidence/acceptance.md`: a catch file for each stage that filled, `CLOSED_FAMILIES` holding all
  six families, the trace, the four tool-run summaries.
- [ ] 6.3 Acceptance with the developer: one survey file read end to end and the invariants path
  shown on a real PLAN; the verdict recorded in `evidence/acceptance.md`.
- [ ] 6.4 Archive only after A and B are archived (D-23).

## Roadmap

- [ ] 0.1 · [ ] 0.2 · [ ] 0.3
- [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [ ] 1.7 · [ ] 1.8
- [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6 · [ ] 2.7 · [ ] 2.8 · [ ] 2.9
- [ ] 3.1 · [ ] 3.2 · [ ] 3.3 · [ ] 3.4 · [ ] 3.5 · [ ] 3.6 · [ ] 3.7 · [ ] 3.8
- [ ] 4.1 · [ ] 4.2 · [ ] 4.3 · [ ] 4.4 · [ ] 4.5
- [ ] 5.1 · [ ] 5.2 · [ ] 5.3 · [ ] 5.4 · [ ] 5.5
- [ ] 6.1 · [ ] 6.2 · [ ] 6.3 · [ ] 6.4

This is DEC-1's order. A later stage goes first only under D-20's rule, with the developer's
agreement recorded.

## Verification

Per stage: `make validate` green (it includes the closed-family test and, locally, `quality/`'s
fixture tests), `openspec validate activity-test-profiles --strict`, and the stage checker's
verdict on INV-2, INV-4 and the D-21 items. For the EPIC: the four proofs listed in
`evidence/acceptance.md` with the developer's verdict.
