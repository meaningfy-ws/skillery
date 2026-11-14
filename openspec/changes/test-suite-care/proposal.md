<!-- STATUS: EPIC shaped 2026-11-14 from the owner's conversation (inputs/seed.md, inputs/qa.md).
     EPIC E, added to the four of the test strategy work (A test-strategy, B
     harden-checks-and-tests, C activity-test-profiles, D generic-task-test-profiles). PLAN
     derived, attacked and gated 2026-11-14 (design.md, tasks.md; 9.05 on the fourth gate run;
     A is delivered).
     Readiness-checked 2026-11-14 by a fresh reader; its eight findings are folded in.
     Round 2 with the owner the same day (Q-5..Q-10) widened the scope and the appetite.
     Reconciled with the PLAN and with EPICs B, C and D on 2026-11-14: the sentences the PLAN's
     "Deviations from the EPIC" had made false are corrected below, each a logged change, not
     a new decision. -->

# EPIC: test suite care

**Parents:** EPIC A [`test-strategy`](../archive/2026-11-14-test-strategy/proposal.md) (the loop and the software rows
this EPIC adds to); the owner's request of 2026-11-14 and the measurements of `rdf-persistence`
(`inputs/seed.md`, `inputs/qa.md`).

## Appetite

**VERY LARGE**, in three stages. It was LARGE until the owner widened the scope (Q-6).

1. The audit skill for Python suites of every tier (unit, Gherkin feature, integration, end to
   end), the catalogue of test rules, the distilling rule and the lanes.
2. UI suites (Cypress and the like).
3. The assessment of checks that are not code.

Each stage ends usable on its own. If the work starts building a tool that rewrites tests on its
own, or a dashboard of test timings, it has overrun.

## Why

Adding tests is easy; keeping a suite small and quick is not, and nothing in the catalogue does it.
EPICs A to D add checks and strengthen the adversary. None asks what a test costs to run or whether
it still earns its place.

The owner meets this in several repositories. The one measured, as the recorded failure and the
trial ground, is `rdf-persistence` (`inputs/seed.md`). Its unit and feature run has 4,524
tests and takes 8.5 minutes in parallel. The slowest 10 % of the tests take 70 % of the time. The
adversarial tests are 16 % of the tests and 33 % of the time, and they are filed by the delivery
stage that wrote them. The repository already has a fast lane, a changed-files lane and a
profiling target, and the owner still reports: "development becomes slow, too slow".

One more fact blocks any safe reduction: the repository specifies 200 scenarios, and no test names
the scenario it serves. Nobody can say which tests may be merged or dropped without losing a
specified feature.

## Solution outline

A new skill, `test-suite-care`, owns one procedure: audit an existing test suite and propose how to
make it smaller and quicker without losing a specified feature.

1. **Measure.** Time per test with set-up and call apart, the scope of each fixture, and the code
   each test covers. Outcome: the cost of the suite is known per test and per file.
2. **Map tests to features.** Each test is assigned to the spec scenario it serves, or to "serves
   none". The map is a file in the audited repository. Outcome: every later proposal can be checked
   against the specified features.
3. **Find waste.** Set-up repeated for every test, parametrised cases that cover the same code,
   several tests serving one scenario in the same way, adversarial tests that never found a defect,
   and tests in a tier their cost does not fit. Where mutation results exist (EPIC B), a test that
   kills no mutant of its own is a candidate.
4. **Propose.** A report lists each proposal with its evidence, its saving and the scenario it
   touches: share a fixture, merge cases, move a test to a slower lane, drop a test.
5. **Discuss and decide.** The owner goes through the report and decides each proposal. Approved
   ones land as small pull requests, each with the timings before and after.

The same question is asked of checks that are not code (a cold reader, an adversarial reader, a
checklist a person or an agent walks): is this check good and reliable for this project and this
task? The assessment plants a known flaw to see whether the check catches it, runs the check three
times on a seeded and on a clean copy to see whether it gives the same verdict, and sets what it costs against what it has found.

Two things stop the growth at its source. When a stage ends, its adversarial tests are distilled
instead of kept as written. And the lanes that `rdf-persistence` already has (a `slow` marker, a
fast lane, a changed-files lane, a profiling target) become the catalogue's pattern for every
project.

## Key decisions

- **DEC-1**: A new EPIC with one skill, `test-suite-care`, that owns the audit-and-reduce procedure
  (Q-1). The rules it relies on stay with their owners, as A decided: test-writing rules in
  `cosmic-python`'s testing checklist, the scaffold and its lanes in `project-setup` — rejected: a fourth stage of B; checklist
  rules only.
- **DEC-2**: The audit builds the map from tests to spec scenarios and stores it as a file in the
  audited repository. A test is merged or dropped only if its scenario stays covered. A test that
  serves no scenario is listed for the owner's judgement, never dropped by default (Q-2); the one
  exception the PLAN adds is a test that runs no measured line. Feature
  tests already name their scenario (testing checklist rule 15, checked by `bdd-gherkin`'s
  traceability check); the map reads those names and adds the tests that carry none —
  rejected: tagging every test by hand; coverage and mutation score only.
- **DEC-3**: A stage's adversarial tests are distilled before the stage merges. The tester's
  report names the scenario each new test attacks. In step 4 of the stage loop of `epic-delivery`
  (Decide and fix), where the lead already decides each tester finding, the lead keeps the tests
  that found a defect, the ones that alone cover a scenario, and one property per invariant the
  PLAN names (B's DEC-9); they go into files named by feature. The rest are deleted and listed
  in the stage's pull request, each with its reason (Q-3) — rejected: keep all and run them nightly; leave as is.
- **DEC-4**: There is no time target. Each audit ends with a report and a discussion; the owner
  decides each proposal, and "no reduction is worth it here" is a valid outcome. The owner: "this
  will require a judgement every time, maybe it will not be possible to cut time" (Q-4) —
  rejected: under three minutes; half the run time; a report with no discussion.
- **DEC-5** (confirmed, Q-7): The skill proposes and never deletes on its own. An approved reduction
  lands as a small pull request with the timings before and after, and the coverage floor of the
  repository still holds.
- **DEC-6** *(proposed)*: The lanes of `rdf-persistence` become the catalogue's pattern: a `slow`
  marker set from a measured threshold, a fast lane, a changed-files lane and a profiling target.
  `project-setup` already describes a fast CI lane that leaves out the container tests; this
  extends it. The marker rule goes into the testing checklist and the targets into the scaffold.
  No scheduled run is added and `ci-cd-delivery`, which owns deployment only, is not touched
  (corrected by the PLAN).
- **DEC-7** (Q-5, Q-6): The skill is named `test-suite-care` and lives in `meaningfy-building`. It
  covers every kind of test: unit, Gherkin feature, integration, end to end, and UI suites such as
  Cypress. The procedure is the same for all; what differs per kind (how cost is measured, how a
  test names its scenario) is a short section each. UI suites are stage 2.
- **DEC-11** (Q-6): A check that is not code is assessed for how good and reliable it is for the
  project and the task: does it catch a planted flaw, does it give the same verdict on each of three runs, what
  does it cost against what it has found. The outcome is a judgement the owner discusses, as for
  code tests (DEC-4). It applies to the checks of C and D and to A's inventory. Stage 3.
- **DEC-12** (Q-8): The skill lives in skillery and carries nothing specific to one repository: no
  repository name, path, threshold or tool version in its text. `rdf-persistence` is the trial
  ground where the skill is tried and judged, and the source of the recorded failure.
- **DEC-8** (Q-8): The skill is tried on `rdf-persistence`. The audit produces the map and the
  report; the owner discusses the report and decides each proposal; an approved reduction lands
  there as a pull request with timings before and after and every mapped scenario still covered.
  The trial is how the owner judges the skill; what it teaches goes back into the skill in general
  words. Stage 2 is tried on a repository with a UI suite, which the owner names at sign-off, and
  stage 3 on the cold reader of `technical-writing`. In skillery: the skill has its trigger probes,
  and the distilling rule has a Gherkin scenario for the agent whose behaviour changes.
- **DEC-9** (confirmed, Q-10): Depends on A: its software matrix gains one row for the audit
  (question `ADQ`, technique owner `test-suite-care`), and the lanes are named as moments in the
  existing rows; the wider scope of Q-6 adds the same row to the UI matrix and one row, with a
  second id, to the cross-cutting matrix. The matrix shape does not change. No stage waits for
  C or D. E and B both edit the tester's brief (B stage 2) and the testing checklist (B stage
  1): whichever lands second keeps the other's change, and the PLAN states the order. Mutation
  results are an optional input, when a local run supplies them per test.
- **DEC-10** (Q-9): "Best practices of test creation" means the testing checklist and more. The
  EPIC surveys the published test smells and test design patterns, and writes the ones that are
  missing as rules, each with the smell it prevents and its source. The rules live with their
  owners (A's rule): Python test rules in `cosmic-python`'s testing checklist, one Gherkin rule
  in `bdd-gherkin`, and the new UI test rules in `test-suite-care` until a UI skill exists,
  because no skill owns them today. The audit reports a broken rule as a finding, and a
  reduction never leaves a test that breaks one.

## Risks

- **RISK-1**: The map is wrong, and a test is dropped as redundant when it was the only guard of a
  behaviour. Likely for some tests, serious. Mitigation: the map records its evidence per test (the
  code covered, the scenario's words); the owner samples it before any proposal is discussed;
  reductions are small pull requests; the coverage floor holds.
- **RISK-2**: The audit costs more than it saves: per-test coverage on a suite that already takes
  88 minutes of processor time. Mitigation: it runs once per audit, not in any lane; the PLAN sets
  how it is run.
- **RISK-3**: Distilling at stage end removes an attack test that would have caught a later
  regression. Accepted: the test that found a defect is always kept, and each drop has a recorded
  reason.
- **RISK-4**: The pattern of one repository does not fit the others. Mitigation: the proof names
  what was specific to `rdf-persistence`; the checklist rule states the threshold as measured per
  project.

- **RISK-5**: Assessing a non-code check costs several runs of an agent reader, and its verdicts
  vary by nature. Mitigation: a small number of runs set by the PLAN; the outcome is a judgement,
  not a score.

## Rabbit-holes

- **A catalogue that grows without end.** The survey of test rules takes one named source per
  kind of test and stops; a rule enters only with the smell it prevents.

- **Per-test coverage tooling.** Coverage contexts and changed-files selection behave differently
  with pytest-bdd, async tests and containers. The PLAN starts with a spike on `rdf-persistence`.
- **Speed that is not the tests' fault.** A slow import, a generation step or coverage itself may
  dominate. The audit reports it; fixing production code is another change.
- **Rewriting while reducing.** A reduction moves, merges or drops tests. Changing what a test
  asserts is a different change with its own review.
- **Scenarios with no test.** The map will show them. They are reported to the owner; writing the
  missing tests is not this EPIC.

## No-gos

- No time target and no pass mark for a suite.
- No automatic deletion or rewriting of tests by the audit; no reduction of an existing suite
  without the owner's decision. (Distilling a stage's own adversarial tests is DEC-3.)
- No new agent, and no scheduled audit.
- Nothing specific to one repository in the skill's text.
- No scoring of a non-code check by a number, and no automatic retirement of one.
- No hand-tagging of existing tests with their scenario.
- No change to `test-strategy`'s questions, stances or matrix shape (A); only its rows.
- No fix of production code found slow.

---

## What Changes

- New skill `test-suite-care` in `meaningfy-building`: the audit procedure, the map format, the
  report format, the kinds of waste and their evidence, a section per kind of test, and the
  assessment of a check that is not code.
- `epic-delivery`: the stage loop gains the distilling of adversarial tests (DEC-3).
- `cosmic-python` (testing checklist): the rules the survey adds, the `slow` marker rule and "name
  adversarial files by feature, not by stage" (rules 17 to 21; rules 6 and 14 amended).
  `bdd-gherkin`: one check box.
- `project-setup`: the `slow` marker, the lane targets and the changed-files script in the
  scaffold.
- `test-strategy`: a row for the audit in the software and UI matrices, a row for the
  assessment in the cross-cutting matrix, two inventory ids; the lanes named as moments.
- In the trial repositories (`rdf-persistence` first): the map, the report and the approved
  reductions, as their own changes.

## Capabilities

### New Capabilities
- `test-suite-care`: auditing a test suite of any kind and proposing reductions that keep every
  specified scenario covered; assessing a check that is not code.

### Modified Capabilities
- `epic-delivery`: the distilling of adversarial tests in step 4 of the stage loop.
- `test-strategy`: rows in the software, UI and cross-cutting matrices.
- `code-principles-governance`: testing checklist rules 17 to 21, and rules 6 and 14 amended.
- The lane requirement of the scaffold sits in the `test-suite-care` capability, because no
  capability exists for `project-setup`.

## Impact

- Skills: `test-suite-care` (new), `epic-delivery`, `cosmic-python`, `bdd-gherkin`,
  `project-setup`, `test-strategy`. Bundle file, skill inventory and facets for the new skill.
- Agents: `team-lead` and `implementer` follow the distilling rule through `epic-delivery`; no
  agent file changes.
- Other repositories: the trials (DEC-8).
- Order: after A; stage 1 ordered against B stages 1 and 2 by the PLAN; stages 2 and 3
  independent of B, C and D.
