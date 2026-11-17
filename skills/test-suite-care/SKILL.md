---
name: test-suite-care
description: "Use this skill when a test suite has grown slow or large and must be made smaller or quicker without losing a specified feature, or when a check that is not code (a reader, a checklist) must be judged for whether it earns its place: 'our tests take too long', 'which tests can we drop', 'is our cold reader any good'. It audits the suite, maps tests to the scenarios they serve and proposes reductions the owner decides. Not for writing tests (cosmic-python) or choosing an activity's checks (test-strategy)."
license: Apache 2.0
metadata:
  purpose: quality
  area: coding
  subject: generic
  posture: reusable
  stage: verify
  maturity: experimental
---

# Test suite care

Asked to shrink a slow suite, an agent drops tests whose covered lines another test also covers.
Wrong first move: most of the time is set-up, and shared lines are a
hint, never proof that a behaviour keeps a guard. This skill measures first, cheapens set-up
before removing anything, and proposes; the owner decides.

## Quick Start

A project's `make test` takes 310 s.

1. Run A says 240 s of it is set-up. Fixture `service` has function scope, costs 2.1 s and is used
   by 90 tests.
2. The map ties each test to the scenario it serves; the owner checks a sample of thirty rows.
3. Reading the fixture: it builds an application (no test changes it) and an empty store (every
   test writes to it). That is waste W-1, class 1.
4. The report proposes "P-1, class 1: split `service` into a module-scoped application and a
   function-scoped store reset; saving about 170 s; scenarios touched: none; survivor: not
   applicable", and a class 2 merge of cases as P-4.
5. The owner approves P-1 and rejects P-4 ("these cases document the format"). P-1 lands as its
   own pull request: 310 s before, 140 s after, the same covered lines for all 90 tests.

## Workflow

The audit covers pytest suites; for any other runner, say so and stop. Output goes outside the
repository, except the map and the report, which go in one pull request.

1. **Measure.** Two runs of the project's own test command for each lane its `make` targets and
   CI run: run A for time
   per phase and per fixture, run B for the lines each test covers. Read `references/measuring.md`
   before the first run: it gives both commands and the settings that silently spoil the data.
2. **Map.** One row per test function: the scenario, requirement or capability it serves, with a
   confidence. Read `references/scenario-map.md` when you build or update the map: it holds the
   format, the levels, the evidence each confidence needs, the owner's sample check and how to
   split the mapping among subagents.
3. **Find the waste.** Read `references/waste.md` when you read the evidence for proposals: it
   holds the eight kinds of waste, the evidence each requires and its class.
4. **Report.** Fill `assets/report-template.md` as `tests/audit/report-<yyyy-mm-dd>.md`, class 1
   first.
5. **Decide and land.** The owner decides each proposal: approved, rejected or later, with a
   reason, in the report. Each approved proposal, or group of one class, lands as its own
   pull request with the wall time of the same command before and after (each run twice on one
   machine), the map rows it touches, the check of a fixture change, and the coverage floor's
   result. "No proposal approved" completes the audit.

## Rules

| Class | What changes | What it can lose | Needs |
|---|---|---|---|
| 1 | A fixture is split or shared, a marker or a lane changes; no test is removed | Isolation | For a fixture, the reading of W-1 and the check below |
| 2 | Parametrised cases are merged | A case that mattered | All the evidence of W-3 |
| 3 | A test is dropped | The only guard of a behaviour | All the evidence of its row, and a survivor |

- **Share what no test changes.** What a test changes (a store it writes to, a mock whose calls
  it asserts) keeps function scope; what none changes may widen, with a cheap reset. Never share a
  mock. Widen an async fixture only as far as the event-loop
  setting allows.
- **Check a fixture change:** run B before and after; `overlap.py <after> --compare <before>` lists
  no test that uses the fixture; the suite passes twice, the second time with the test files in
  reverse order.
- **Name the survivor** of every class 2 proposal and every class 3 one except W-6: the case that
  stays, or another test at `high` for the same scenario as the dropped test, itself at `high`; under W-4 it is
  the containing test, under W-5 the lower-tier test. A survivor is in no other class 2 or 3
  proposal, so two tests that contain each other cannot both go.
- A test below `high`, or at level `none`, is never proposed for class 3; it is listed under
  "Tests that serve no scenario". W-6, a test that runs no measured line, is the one exception.
- No proposal removes the last `high` test of a scenario, and none leaves a test breaking a rule
  of `cosmic-python`'s testing checklist it did not break before.
- **The owner decides.** Nothing is deleted, merged or re-scoped without the owner's decision.

**Common mistakes**

| Mistake | Why it fails | Do instead |
|---|---|---|
| Propose drops first | Set-up is usually most of the time, and class 1 removes no test | List class 1 first |
| Drop a test because its lines are covered elsewhere | Shared lines are a hint, never proof | Require all the evidence of W-4 or W-5 |
| Drop the test that runs the real adapter, store or service | The lower-tier test runs a fake | Keep it; it is never W-5 |
| Force every test onto a scenario | A forced row makes a drop look safe | Record `none` |
| Append flags to a `make` target | The target takes none and carries its own coverage flags | Pass them in `PYTEST_ADDOPTS` |
| Take timings from run B | Coverage slows a run about 2.3 times | Time from run A only || Write the audited project's name or thresholds into this skill | They fit one project | State them in the report |

Residual risk: a shared fixture can let a test pass on another's work without changing any covered
line. Say so in the pull request of every class 1 fixture change.

## Boundary & Related Skills

**Owns:** the audit of an existing suite (measure, map, waste, report, decision), its three scripts
and the report template.

**Does not own:** the rules every test follows, cited by number (`cosmic-python`'s testing
checklist, rules 17 to 21 among them); writing tests (`cosmic-python`); the developer's lanes
(`project-setup`); distilling a stage's adversarial tests (`epic-delivery`); which checks an
activity needs (`test-strategy`).

**Related:** `cosmic-python`, `test-strategy`, `project-setup`, `epic-delivery`, `bdd-gherkin`.

Answers `ADQ` in `test-strategy`'s matrix (`references/software.md`).
