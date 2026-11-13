<!-- PLAN (tasks half), derived 2026-11-13; attack and two gate runs folded in 2026-11-14.
     Delivery does not start before A's stage 1 is merged and each stage's preflight passes
     (design D-20). -->

> Derives from: EPIC `activity-test-profiles` ([`proposal.md`](proposal.md)); design in [`design.md`](design.md).

Every stage follows the stage loop of design § Algorithm. A stage whose decision table has no
`fill` line skips its tasks marked *fill only* and ships as D-15 says. Section 0 rides in the PR
of the first stage delivered (D-14). "The stage checker" is a subagent that built nothing of the
stage.

## 0. Before any stage

- [ ] 0.1 The developer signs off the spec scenarios of this change (the PLAN gate), recorded in
  `evidence/acceptance.md` (D-21).
- [ ] 0.2 Run re-checks R-A1, R-A2, R-A3 and R-S2; record the result in `evidence/preflight.md`.
  A failed re-check stops delivery and goes to the developer (RISK-1).
- [ ] 0.3 Add `CLOSED_FAMILIES` (empty) and the closed-family test to
  `tests/test_test_strategy.py`, with fixture cases for a `gap` row and for an `accepted` row
  without a reason (D-14; spec *A closed family stays closed*).

## 1. Stage 1: documentation

- [ ] 1.1 Preflight: R-A1 for `documentation.md`, R-A4, R-A5, R-B1, R-B2, R-B3, R-B5, R-B6, R-S1,
  appended to `evidence/preflight.md` (§ Re-check).
- [ ] 1.2 Copy every gap row of `documentation.md` into `evidence/survey-documentation.md` and run
  the survey searches (design § Algorithm, steps 2 and 3; D-5; spec *Each stage's failures come
  from a recorded survey*).
- [ ] 1.3 Tool run: install Vale and ls-lint into scratch; first confirm Vale's three layout facts
  of D-9 (a difference is a PLAN revision before 1.5); run the Vale and docs ls-lint drafts of D-8
  on skillery's `docs/`; write `evidence/toolrun-vale.md` and `evidence/toolrun-ls-lint-docs.md`
  (D-8, D-9, D-10; spec *Each tool runs once on a real tree*).
- [ ] 1.4 Owner round, three calls (D-7): failures seen and any gap row naming B or D; the rules
  of each tool marked, at most eight per tool, which picks the packages and rules (D-9); the
  decision table confirmed and any conditional scenario that no longer fits rewritten and signed
  off (D-16). Answers to `inputs/qa.md`.
- [ ] 1.5 *Fill only.* With the pinned tools on `PATH` and the styles synced, so no test skips:
  fixture pairs under `quality/tests/`, one bad case per enabled rule, red first; the meta-test
  for configurations and manifest entries (extended from B's, or written here, R-B2); then
  `quality/vale/`, its ignore entry and `quality/ls-lint/docs.yml` as decided, and INV-3's test;
  keep each test's red and passed output for the catch file (D-11, D-12; spec *Vale's styles are
  pinned, never copied*; *Docs and stacks configurations*).
- [ ] 1.6 *Fill only.* `technical-writing` SKILL.md: the adopted checks as a step of the
  documentation workflow's `verify` row, and a short section naming for each the command against
  the fetched `quality/`, when it runs, whether it blocks, its cost, and the one-line skip note for
  a project that has not fetched `quality/`; the pointer line. Add each adopted tool to
  `dependencies.yaml` unless B did (D-6, D-13, D-21; spec *Documentation checks run in the verify
  phase*).
- [ ] 1.7 Close: add `documentation` to `CLOSED_FAMILIES` (red); matrix edits in
  `documentation.md` and `inventory.md` until it is green, with no duplicate `CHK-<n>` after the
  rebase; keep, rewrite or delete the conditional requirements; for each fill a line in
  `evidence/catch-documentation.md` with its red and passed test results; re-run R-A5 if it was
  "not yet applicable"; CHANGELOG line; `make bundles`, `make skill-inventory`, `make validate`,
  `openspec validate activity-test-profiles --strict` (D-12..D-16, D-21; spec *A family's gaps are
  filled from recorded failures or accepted*).
- [ ] 1.8 Stage checker: the decision table against the diff (INV-2), the evidence scrub (INV-4),
  no skipped test behind a catch line (D-12), the D-21 items; then one PR into `develop` naming
  #212. If review adds commits, the checker reads INV-2 and INV-4 again on the final diff before
  the merge (design § Algorithm, step 6).

## 2. Stage 2: shaping

- [ ] 2.1 Preflight: R-A1 for `shaping.md`, R-A4, R-A5, R-B4, R-S1. If R-B4 fails, stop and ask
  the developer (§ Re-check; error matrix).
- [ ] 2.2 Copy every gap row of `shaping.md` into `evidence/survey-shaping.md`; record #143 as
  `F-shaping-1`; run the survey searches for further failures (design § Algorithm, steps 2 and 3;
  D-5).
- [ ] 2.3 Owner round, calls 1 and 3 (D-7): failures seen; the decision table confirmed.
- [ ] 2.4 Baseline, before any skill edit: write the sample two-store EPIC to
  `evidence/baseline-shaping-epic.md`; a fresh subagent derives its PLAN with today's
  `epic-planning`; record in `evidence/baseline-shaping.md` whether the create path is named
  (D-21).
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
- [ ] 2.8 Baseline, after: the same file with the changed skill, a fresh subagent; add the
  result to `evidence/baseline-shaping.md`. If the create path is still not named, revise 2.5 and
  2.6 and re-run (D-21).
- [ ] 2.9 Close as 1.7, for `shaping.md` and `evidence/catch-shaping.md` (the worked example of
  2.5 is the catch); then the stage checker and one PR as 1.8, naming #143 (D-12..D-15, D-21).

## 3. Stage 3: DevOps

- [ ] 3.1 Preflight: R-A1 for `devops.md`, R-A4, R-A5, R-B1, R-B2, R-B3, R-B5, R-S1; a read-only
  checkout of `infrastructure-stacks` is available; list its Makefiles; if it has none, ask the
  developer the one question of D-8 (§ Re-check; D-8).
- [ ] 3.2 Copy every gap row of `devops.md` into `evidence/survey-devops.md`; run the survey
  searches, including both infra repositories' issues and review comments and the runbook question
  (design § Algorithm, steps 2 and 3; D-5).
- [ ] 3.3 Tool run: install ls-lint and checkmake into scratch; run the stacks ls-lint draft and
  the checkmake draft of D-8 on the checkout, fix modes off; confirm with `git status` that the
  checkout is unchanged; write `evidence/toolrun-ls-lint-stacks.md` and
  `evidence/toolrun-checkmake.md`, scrubbed (D-8, D-10; spec *Each tool runs once on a real tree*).
- [ ] 3.4 Owner round, three calls (D-7): failures seen (the runbook question included); the rules
  of each tool marked, at most eight per tool; the decision table confirmed and any conditional
  scenario that no longer fits, or that the tool cannot express, rewritten and signed off (D-16).
- [ ] 3.5 *Fill only.* With the pinned tools on `PATH`, so no test skips: fixture pairs, one bad
  case per enabled rule, red first, covered by the meta-test; then `quality/ls-lint/stacks.yml`
  and `quality/checkmake/stacks.ini` as decided (D-11, D-12; spec *Docs and stacks
  configurations*).
- [ ] 3.6 *Fill only.* For each adopted check, first the rule it encodes and why, then the check
  with its three facts and a pointer to #216, under a subsection *Recommended checks*: the layout
  rule and ls-lint in `stack-operations`' `references/stack-standard.md`; the Makefile rule and
  checkmake in `infrastructure-operations`' `references/repo-checks.md`, outside its MUST. A
  runbook check only if a runbook failure was recorded. Add each adopted tool to
  `dependencies.yaml` unless B did (D-6, D-21; spec *Layout and Makefile checks for stacks*).
- [ ] 3.7 Comment on #216 with the scrubbed findings and what `quality/` now offers (D-21).
- [ ] 3.8 Close as 1.7, for `devops.md` and `evidence/catch-devops.md`; then the stage checker and
  one PR as 1.8, naming #216 (D-12..D-15, D-21).

## 4. Stage 4: architecture and modelling

- [ ] 4.1 Preflight: R-A1 for `architecture.md` and `modelling.md`, R-A4 (§ Re-check).
- [ ] 4.2 Copy every gap row of `architecture.md` and `modelling.md` into
  `evidence/survey-architecture-modelling.md`; run the survey searches (design § Algorithm, steps
  2 and 3; D-5).
- [ ] 4.3 Owner round, calls 1 and 3 (D-7): failures seen; then the decision table confirmed and,
  for a `fill`, the lead's draft of the new delta's scenarios signed off, or the worked example's
  outline where the skill has no capability (D-16).
- [ ] 4.4 *Fill only.* Commit the signed-off delta if there is one, then the worked example, then
  the check in a reference file of the owning skill (D-12, D-16, D-17).
- [ ] 4.5 Close as 1.7, for both family files and `evidence/catch-architecture-modelling.md`; then
  the stage checker and one PR as 1.8, naming the EPIC (D-12..D-15, D-21).

## 5. Stage 5: UI

- [ ] 5.1 Preflight: R-A1 for `ui.md` (§ Re-check).
- [ ] 5.2 Copy every gap row of `ui.md` into `evidence/survey-ui.md`; run the survey searches;
  record in the survey file the external design plugin skills installed in the session (design
  § Algorithm, steps 2 and 3 and the accept example; D-5).
- [ ] 5.3 Owner round, calls 1 and 3 (D-7): failures seen; the decision table confirmed. Each
  `accepted` reason names the external design plugin skill that covers the question, where the 5.2
  record has one. A failure that would need a check has no owning skill here: it becomes a
  skillery issue and its row is `accepted` with the issue number (error matrix).
- [ ] 5.4 Close as 1.7, for `ui.md`; then the stage checker and one PR as 1.8, naming the EPIC
  (D-13..D-15, D-21).

## 6. Closing the EPIC

- [ ] 6.1 The invariants trace: re-run R-B4; on the first PLAN that qualifies (D-18), read the
  tester's report from that EPIC's own delivery and write the comparison to
  `evidence/invariants-trace.md`. If none has appeared when stages 1 to 5 are closed, ask the
  developer: wait, or a sample PLAN (D-18; spec *Invariants reach the tester*).
- [ ] 6.2 Check DEC-7's four proofs against the evidence folder and list them in
  `evidence/acceptance.md`: a catch file for each stage that filled, `CLOSED_FAMILIES` holding all
  six families, the trace, the four tool-run summaries (DEC-7, D-21).
- [ ] 6.3 Acceptance with the developer: one survey file read end to end and the invariants path
  shown on a real PLAN; the verdict recorded in `evidence/acceptance.md` (D-21).
- [ ] 6.4 Archive only after A and B are archived (D-23).

## Roadmap

- [ ] 0.1 · [ ] 0.2 · [ ] 0.3
- [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [ ] 1.7 · [ ] 1.8
- [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6 · [ ] 2.7 · [ ] 2.8 · [ ] 2.9
- [ ] 3.1 · [ ] 3.2 · [ ] 3.3 · [ ] 3.4 · [ ] 3.5 · [ ] 3.6 · [ ] 3.7 · [ ] 3.8
- [ ] 4.1 · [ ] 4.2 · [ ] 4.3 · [ ] 4.4 · [ ] 4.5
- [ ] 5.1 · [ ] 5.2 · [ ] 5.3 · [ ] 5.4
- [ ] 6.1 · [ ] 6.2 · [ ] 6.3 · [ ] 6.4

This is DEC-1's order. A later stage goes first only under D-20's rule, with the developer's
agreement recorded.

## Verification

Per stage: `make validate` green (it includes the closed-family test and, locally, `quality/`'s
fixture tests), `openspec validate activity-test-profiles --strict`, and the stage checker's
verdict on INV-2, INV-4 and the D-21 items. For the EPIC: the four proofs listed in
`evidence/acceptance.md` with the developer's verdict.
