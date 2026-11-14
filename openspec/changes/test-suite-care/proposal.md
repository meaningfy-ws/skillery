<!-- STATUS: EPIC shaped 2026-11-14 from the owner's conversation (inputs/seed.md, inputs/qa.md).
     EPIC E, added to the four of the test strategy work (A test-strategy, B
     harden-checks-and-tests, C activity-test-profiles, D generic-task-test-profiles). PLAN not
     derived; it is derived when its epic session starts, after A is delivered.
     Readiness-checked 2026-11-14 by a fresh reader; its eight findings are folded in. -->

# EPIC: test suite care

**Parents:** EPIC A [`test-strategy`](../test-strategy/proposal.md) (the loop and the software rows
this EPIC adds to); the owner's request of 2026-11-14 and the measurements of `rdf-persistence`
(`inputs/seed.md`, `inputs/qa.md`).

## Appetite

**LARGE.** One new skill with its tests and docs, one new rule in the stage loop of
`epic-delivery`, rules added to three existing skills, and a proof carried out in another
repository. If the work starts building a tool that rewrites tests on its own, or a dashboard of
test timings, it has overrun.

## Why

Adding tests is easy; keeping a suite small and quick is not, and nothing in the catalogue does it.
EPICs A to D add checks and strengthen the adversary. None asks what a test costs to run or whether
it still earns its place.

The recorded failure is `rdf-persistence` (`inputs/seed.md`). Its unit and feature run has 4,524
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

Two things stop the growth at its source. When a stage ends, its adversarial tests are distilled
instead of kept as written. And the lanes that `rdf-persistence` already has (a `slow` marker, a
fast lane, a changed-files lane, a profiling target) become the catalogue's pattern for every
project.

## Key decisions

- **DEC-1**: A new EPIC with one skill, `test-suite-care`, that owns the audit-and-reduce procedure
  (Q-1). The rules it relies on stay with their owners, as A decided: test-writing rules in
  `cosmic-python`'s testing checklist, the split between pull-request and scheduled runs in
  `ci-cd-delivery`, the scaffold in `project-setup` — rejected: a fourth stage of B; checklist
  rules only.
- **DEC-2**: The audit builds the map from tests to spec scenarios and stores it as a file in the
  audited repository. A test is merged or dropped only if its scenario stays covered. A test that
  serves no scenario is listed for the owner's judgement, never dropped by default (Q-2). Feature
  tests already name their scenario (testing checklist rule 15, checked by `bdd-gherkin`'s
  traceability check); the map reads those names and adds the tests that carry none —
  rejected: tagging every test by hand; coverage and mutation score only.
- **DEC-3**: A stage's adversarial tests are distilled before the stage merges. The tester's
  report names the scenario each new test attacks. In step 4 of the stage loop of `epic-delivery`
  (Decide and fix), where the lead already decides each tester finding, the lead keeps the tests
  that found a defect, the ones that alone cover a scenario, and the properties that state an
  invariant of the PLAN (B's DEC-9); they go into files named by feature. The rest are dropped,
  each with a recorded reason (Q-3) — rejected: keep all and run them nightly; leave as is.
- **DEC-4**: There is no time target. Each audit ends with a report and a discussion; the owner
  decides each proposal, and "no reduction is worth it here" is a valid outcome. The owner: "this
  will require a judgement every time, maybe it will not be possible to cut time" (Q-4) —
  rejected: under three minutes; half the run time; a report with no discussion.
- **DEC-5** *(proposed)*: The skill proposes and never deletes on its own. An approved reduction
  lands as a small pull request with the timings before and after, and the coverage floor of the
  repository still holds.
- **DEC-6** *(proposed)*: The lanes of `rdf-persistence` become the catalogue's pattern: a `slow`
  marker set from a measured threshold, a fast lane, a changed-files lane and a profiling target.
  `project-setup` already describes a fast CI lane that leaves out the container tests; this
  extends it. The marker rule goes into the testing checklist, the targets into the scaffold, the
  pull-request and scheduled split into `ci-cd-delivery`.
- **DEC-7** *(proposed)*: The first version covers Python suites run by pytest, all tiers (unit,
  feature, integration, end to end). The name `test-suite-care` and the bundle `meaningfy-building`
  are the shaper's.
- **DEC-8** *(proposed)*: E proves three things on `rdf-persistence`. The audit produces the map and the
  report. The owner discusses the report and decides each proposal. At least one approved
  reduction, if the owner approves any, lands there as a pull request with timings before and
  after and every mapped scenario still covered. In skillery: the skill has its trigger probes,
  and the distilling rule has a Gherkin scenario for the agent whose behaviour changes.
- **DEC-9** *(proposed)*: Depends on A: its software matrix gains one row for the audit
  (question `ADQ`, technique owner `test-suite-care`), and the lanes are named as moments in the
  existing rows. The matrix shape does not change. Independent of C and D. E and B stage 2 both
  edit the tester's brief and the testing checklist: whichever lands second keeps the other's
  change, and the PLAN states the order. Mutation results from B stage 3 are an optional input.
- **DEC-10** *(proposed)*: The owner's "adhere to best practices of test creation" means the
  testing checklist. The audit reports a broken checklist rule as a finding (rule 6 and rule 13 on
  fixture scope are the cost rules), and a reduction never leaves a test that breaks one.

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

## Rabbit-holes

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
- No automatic deletion or rewriting of tests; no reduction without the owner's decision.
- No new agent, and no scheduled audit.
- No front-end suites, and none of the non-code checks of C and D.
- No hand-tagging of existing tests with their scenario.
- No change to `test-strategy`'s questions, stances or matrix shape (A); only its rows.
- No fix of production code found slow.

---

## What Changes

- New skill `test-suite-care` in `meaningfy-building`: the audit procedure, the map format, the
  report format, the kinds of waste and their evidence.
- `epic-delivery`: the stage loop gains the distilling of adversarial tests (DEC-3).
- `cosmic-python` (testing checklist): the `slow` marker rule and "name adversarial files by
  feature, not by stage".
- `project-setup`: the lane targets in the scaffold. `ci-cd-delivery`: which lane runs on a pull
  request and which on a schedule.
- `test-strategy`: one software row for the audit; the lanes named as moments.
- In `rdf-persistence`: the map, the report and the approved reductions, as its own changes.

## Capabilities

### New Capabilities
- `test-suite-care`: auditing a test suite and proposing reductions that keep every specified
  scenario covered.

### Modified Capabilities
- `epic-delivery`: the distilling of adversarial tests in step 4 of the stage loop.
- `test-strategy`: the software rows.
- `code-principles-governance`: the testing checklist's marker and file-naming rules.
- The PLAN places the lane requirements of the scaffold and of delivery when it is derived.

## Impact

- Skills: `test-suite-care` (new), `epic-delivery`, `cosmic-python`, `project-setup`,
  `ci-cd-delivery`, `test-strategy`. Bundle file, skill inventory and facets for the new skill.
- Agents: `team-lead` and `implementer` follow the distilling rule through `epic-delivery`; no
  agent file changes.
- Another repository: `rdf-persistence` receives the proof.
- Order: after A. Independent of C and D; ordered against B stage 2 by the PLAN (DEC-9).
