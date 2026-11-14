<!-- PLAN (tasks half). Type: Implementation. Rewritten 2026-11-14 against A as delivered and B's
     gated PLAN. Five stages, each its own PR into develop; section 0 rides in stage 1's PR.
     Delivery starts when B's stages 1 and 2 are merged (design D-16). -->

> Derives from: EPIC `activity-test-profiles` ([`proposal.md`](proposal.md)); design in [`design.md`](design.md).

Every stage follows the stage loop of design § Algorithm. A stage whose decision table has no
`fill` line skips its tasks marked *fill only* and ships as D-14 says. "The stage checker" is a
subagent that built nothing of the stage.

## 0. Before stage 1

- [ ] 0.1 The owner signs off the spec scenarios of this change (the PLAN gate) and confirms the
  start condition of D-16 and the stated limit of D-13's proof, all recorded in
  `evidence/acceptance.md` (D-13, D-15, D-16).
- [ ] 0.2 Confirm B's stages 1 and 2 are merged and the branch is on current `develop`; walk the
  two Context tables of the design against the repository (the ten gap rows; B's facts) and record
  each difference in `evidence/preflight.md`, handled as D-16 says. For B, read in particular:
  the ls-lint and checkmake pins and where `make quality-tools` puts the binaries; whether
  `quality_files` reads the disk or tracked files; which manifest files B's manifest test covers;
  the Method and Read lines of the tester's brief (D-7, D-8, D-9, D-12, D-13, D-16; RISK-1).
- [ ] 0.3 Add `CLOSED_FAMILIES` (empty), `closed_family_errors` and its test to
  `tests/test_test_strategy.py`, test-first, with the cases TC-1 to TC-8 (D-11; design § Tests
  and proofs; spec *A closed family stays closed*).

## 1. Stage 1: documentation

- [ ] 1.1 Preflight, step 1 of the stage loop, for `documentation.md` and the
  `documentation-workflow` and `quality-checks` deltas; append to `evidence/preflight.md` (design
  § Algorithm).
- [ ] 1.2 Copy the four gap rows into `evidence/survey-documentation.md`; run the survey searches
  (design § Algorithm, steps 2 and 3; D-5; spec *Each stage's failures come from a recorded
  survey*).
- [ ] 1.3 Tool runs: install Vale and ls-lint into scratch; confirm Vale's five facts of D-8
  first; run the Vale and docs ls-lint drafts of D-7 on skillery's `docs/`; write
  `evidence/toolrun-vale.md` and `evidence/toolrun-ls-lint-docs.md` (D-7, D-8, D-17; spec *Each
  tool runs once on a real tree*).
- [ ] 1.4 Owner round, the three kinds of call of D-6; answers to `inputs/qa.md` (D-6, D-14).
- [ ] 1.5 *Fill only.* With the tools on `PATH` and network for Vale's sync, so no tool test skips:
  the fixture pairs and the tests TC-9 to TC-12, IT-1 and IT-2 in `tests/test_quality.py`,
  red first; then `quality/vale/vale.ini`, the manifest and `quality/ls-lint/docs.yml` as decided;
  the rows in `quality/README.md`; Vale in `docs/development/quality.md` and its install note in
  `CONTRIBUTING.md`; keep each test's red and passed output (D-9, D-18; design § Tests and
  proofs; spec *Vale's styles are pinned, never copied*; *A docs naming configuration*).
- [ ] 1.6 *Fill only.* `technical-writing` SKILL.md: the adopted checks as a step of the `verify`
  row, and a short section with, for each, the rule it encodes first, then the command, when it
  runs, whether it blocks, its cost, how to install the tool where `make quality-tools` does not,
  and the skip note; the pointer line if A's test asks for a change; the Vale entry in
  `dependencies.yaml`
  (D-12, D-15; spec *Vale runs in the verify phase and does not block*; *Docs names are checked
  in the verify phase*).
- [ ] 1.7 *Fill only, for a gap row outside the candidates* (`ADQ`, `ROB` or `RSK` with a
  failure): commit its signed-off requirement in the `documentation-workflow` delta, then the
  worked example, then the check in `skills/technical-writing/references/` (D-14, D-18).
- [ ] 1.8 Close, step 6 of the stage loop, for `documentation.md`: `CLOSED_FAMILIES` red then
  green, the matrix edits, the conditional requirements kept, rewritten or deleted,
  `evidence/catch-documentation.md`, the CHANGELOG line, the four commands (D-10, D-11, D-14, D-15,
  D-18; spec *A family's gaps are filled from recorded failures or accepted*).
- [ ] 1.9 The invariants trace, on the stage's regular tester dispatch: brief read from the working
  tree, the error matrix's path named in it; its property test goes in the file D-11 names; from
  its report write `evidence/invariants-trace.md`; if the report lacks the property D-13 asks
  for, return it once; then run `make validate` again (IT-9; D-11, D-13; spec *Invariants reach
  the tester*).
- [ ] 1.10 Stage checker, with the list of step 6 of the stage loop, CK-3 included; the PR body is
  written to `evidence/pr-documentation.md` first. Then one PR into `develop` naming #212, and the
  second reading if review adds commits (design § Algorithm, step 6; § Tests and proofs; D-17).

## 2. Stage 2: shaping

- [ ] 2.1 Preflight, step 1 of the stage loop, for `shaping.md` and the `epic-shape` delta (design
  § Algorithm).
- [ ] 2.2 Copy the gap row into `evidence/survey-shaping.md`; record #143 as `F-shaping-1`; run the
  survey searches for further failures (design § Algorithm, steps 2 and 3; D-5).
- [ ] 2.3 Owner round, kinds 1 and 3; kind 1 asks only for failures beyond `F-shaping-1` (D-6).
- [ ] 2.4 Baseline, before any skill edit: write the two sample EPICs and the two sample
  `inputs/qa.md` files to `evidence/baseline/`; run IT-5 and record its result in
  `evidence/baseline-shaping.md` (D-15; design § Tests and proofs).
- [ ] 2.5 Write `skills/epic-planning/references/invariants.md`, with the #143 case replayed as in
  design § Algorithm (D-4, D-18).
- [ ] 2.6 `epic-planning` SKILL.md: the question in step 2 and the three rules in step 6, within
  D-4's line budget, linking 2.5; the `plan-invariants` entry in `tests/ownership.yaml` (D-1, D-4,
  D-15; spec *The shaping interview asks for invariants*, whose two scenarios CK-2 proves; *The
  PLAN records invariants*; *Invariants reach the tester*).
- [ ] 2.7 The template: the three edits of D-2, then `make bundles`; `tests/test_bundle_gen.py`
  green. Comment on #143, written to `evidence/comment-143.md` first: the columns delivered, the
  `clarity-gate` item still open (D-2, D-3, D-17; spec
  *The PLAN records invariants*; *Invariants reach the tester*; *The EPIC and PLAN templates
  speak plain language*, whose scenario *The design template's one new heading* CK-1 proves).
- [ ] 2.8 Baseline, after: run IT-6, IT-7 and IT-8 at the stage's head commit and record each
  result; on a miss, revise the texts of 2.5, 2.6 and 2.7 and repeat that run, at most twice
  (D-15; design § Tests and proofs). IT-6 proves the scenarios *A write path left out* and *A PLAN
  whose interview had no invariants answer*; IT-7 proves *Deriving a PLAN with an invariant left
  to the tester*; IT-8 proves *A PLAN with no invariant*.
- [ ] 2.9 Close as 1.8, for `shaping.md` and `evidence/catch-shaping.md` (the worked example of 2.5
  is the catch); then the stage checker and one PR as 1.10, with CK-1 and CK-2, naming #143 (D-10,
  D-11, D-15, D-18; design § Tests and proofs).

## 3. Stage 3: DevOps

- [ ] 3.1 Preflight, step 1 of the stage loop, for `devops.md` and the `operations-practice`
  delta; a read-only checkout of `infrastructure-stacks` is available; list its Makefiles; if it
  has none, ask the owner the one question of D-7 (design § Algorithm; D-7).
- [ ] 3.2 Copy the gap row into `evidence/survey-devops.md`; run the survey searches, including the
  checkout's issues and review comments (design § Algorithm, steps 2 and 3; D-5).
- [ ] 3.3 Tool runs: install ls-lint and checkmake into scratch; run the stacks ls-lint draft and
  checkmake of D-7 on the checkout; confirm with `git status` that the
  checkout is unchanged; write `evidence/toolrun-ls-lint-stacks.md` and
  `evidence/toolrun-checkmake.md`, scrubbed (D-7, D-17; spec *Each tool runs once on a real tree*).
- [ ] 3.4 Owner round, the three kinds of call of D-6, the runbook question in kind 1 (D-6, D-14;
  design § Algorithm, step 3).
- [ ] 3.5 *Fill only.* With the tools on `PATH`, so no tool test skips: the fixture pairs and
  the tests TC-9, IT-3 and IT-4, red first (design § Tests and proofs); then `quality/ls-lint/stacks.yml` and `quality/checkmake/stacks.ini` as
  decided; the rows in `quality/README.md` (D-9, D-18; spec *A stacks naming
  configuration*; *A stacks Makefile configuration*).
- [ ] 3.6 *Fill only.* For each adopted check, first the rule it encodes and why, then the check
  with its three facts and a pointer to #216, under a new subsection *Recommended checks*: ls-lint
  in `stack-operations`' `references/stack-standard.md`; checkmake in `infrastructure-operations`'
  `references/repo-checks.md`, outside its MUST (D-12; spec *A naming check for stacks
  repositories*; *A Makefile check for infrastructure repositories*).
- [ ] 3.7 *Fill only, for the `ADQ` row* (a recorded failure the existing checks missed): commit
  its signed-off requirement in the `operations-practice` delta, then the worked example, then the
  check in a reference file of the owner D-14 names (D-14, D-18).
- [ ] 3.8 Comment on #216 with the scrubbed findings and what `quality/` now offers, written to
  `evidence/comment-216.md` first and posted as the checker read it (D-15, D-17).
- [ ] 3.9 Close as 1.8, for `devops.md` and `evidence/catch-devops.md`; then the stage checker and
  one PR as 1.10, with CK-3, naming #216 (D-10, D-11, D-15, D-18).

## 4. Stage 4: architecture and modelling

- [ ] 4.1 Preflight, step 1 of the stage loop, for `architecture.md` and `modelling.md` (design
  § Algorithm).
- [ ] 4.2 Copy the two gap rows into `evidence/survey-architecture-modelling.md`; run the survey
  searches (design § Algorithm, steps 2 and 3; D-5).
- [ ] 4.3 Owner round, kinds 1 and 3; for a `fill`, kind 3 also signs off what D-14's table names
  for the family (D-6, D-14).
- [ ] 4.4 *Fill only.* The worked example, then the check in a reference file of the owner D-14
  names; a delta only in the case D-14's table gives one (D-14, D-18).
- [ ] 4.5 Close as 1.8, for both family files and `evidence/catch-architecture-modelling.md`; then
  the stage checker and one PR as 1.10, naming the EPIC (D-10, D-11, D-14, D-15).

## 5. Stage 5: UI

- [ ] 5.1 Preflight, step 1 of the stage loop, for `ui.md` (design § Algorithm).
- [ ] 5.2 Copy the two gap rows into `evidence/survey-ui.md`; run the survey searches; record in
  the survey file the external design skills installed in the session (design § Algorithm, steps 2
  and 3 and the accept example; D-5).
- [ ] 5.3 Owner round, kinds 1 and 3. A failure that would need a check becomes a skillery issue
  and its row is `accepted` with the issue number (D-6, D-14).
- [ ] 5.4 Close as 1.8, for `ui.md`; then the stage checker and one PR as 1.10, naming the EPIC
  (D-10, D-11, D-14, D-15).

## 6. Closing the EPIC

- [ ] 6.1 Check DEC-7's four proofs against the evidence folder and list them in
  `evidence/acceptance.md`: a catch file for each stage that filled; `CLOSED_FAMILIES` holding the
  six families; `evidence/invariants-trace.md`; the four tool-run summaries, with checkmake's listed as "not
  met, accepted by the owner" if the checkout had no Makefile (DEC-7, D-7, D-13, D-18).
- [ ] 6.2 Acceptance with the owner: one survey file read end to end and the invariants path shown
  on this PLAN, from the `## Invariants` row to the tester's property; the verdict recorded in
  `evidence/acceptance.md` (D-15).
- [ ] 6.3 Archive only after B is archived, unless no `quality-checks` requirement is left in this
  change (D-14, D-16).

## Roadmap

- [ ] 0.1 · [ ] 0.2 · [ ] 0.3
- [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [ ] 1.7 · [ ] 1.8 · [ ] 1.9 · [ ] 1.10
- [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6 · [ ] 2.7 · [ ] 2.8 · [ ] 2.9
- [ ] 3.1 · [ ] 3.2 · [ ] 3.3 · [ ] 3.4 · [ ] 3.5 · [ ] 3.6 · [ ] 3.7 · [ ] 3.8 · [ ] 3.9
- [ ] 4.1 · [ ] 4.2 · [ ] 4.3 · [ ] 4.4 · [ ] 4.5
- [ ] 5.1 · [ ] 5.2 · [ ] 5.3 · [ ] 5.4
- [ ] 6.1 · [ ] 6.2 · [ ] 6.3

This is DEC-1's order. Stages 4 and 5 go before stage 3 only under D-16's rule.

## Verification

Per stage: `make validate` green (it includes the closed-family test and, locally with the tools
installed, the tool tests of `tests/test_quality.py`), `openspec validate activity-test-profiles
--strict`, and the stage checker's verdict on the list of step 6 of the stage loop. For the EPIC: the
four proofs listed in `evidence/acceptance.md` with the owner's verdict.
