<!-- STATUS: PLAN derived 2026-11-14 from proposal.md and inputs/spike.md. -->

# PLAN (design): test suite care

**Derives from:** [`proposal.md`](proposal.md) (EPIC E, DEC-1..DEC-12). Evidence:
[`inputs/spike.md`](inputs/spike.md).

## Context

The EPIC asks for a skill that audits an existing test suite and proposes how to make it smaller
and quicker without losing a specified feature. The spike changed two assumptions of the EPIC:

- **Most of the time is set-up, not tests.** On the measured subset 89 % of the time was spent in
  function-scoped fixtures. Sharing a fixture removes no test and loses no coverage, so it comes
  before any merging or dropping.
- **Half of the unit tests cannot be assigned to a scenario** from their name and docstring. The
  map therefore records a level (scenario, requirement, capability or none) and a confidence, and
  a drop is proposed only on a confident assignment.

## Goals / Non-Goals

**Goals**

- One skill, `test-suite-care`, with a procedure any agent can follow in any repository.
- Two small scripts that produce the evidence, with no dependency beyond pytest and the standard
  library.
- The distilling of adversarial tests in the stage loop.
- The test rules the survey adds, in their owning skills.
- Developer lanes in every scaffolded project.
- A trial on `rdf-persistence` that the owner judges.

**Non-Goals** (the EPIC's No-gos, plus)

- No time target, no automatic deletion, no score for a check.
- No scheduled CI run and no `pytest-testmon` (the changed-files lane works by folder rules).
- No branch coverage and no mutation testing here (EPIC B, stage 3, supplies mutants when it exists).
- No executable step definitions for the catalogue's own Gherkin features.

## Decisions

- **D-1 Files of the skill.** `skills/test-suite-care/`:

  | File | Holds |
  |---|---|
  | `SKILL.md` | Quick Start with one worked example, the five steps, the three classes of proposal, Gotchas, Boundary & Related Skills. Target 150 lines. |
  | `references/measuring.md` | The commands of step 1, per kind of test; what to do when a tool is missing. |
  | `references/scenario-map.md` | The map's format, levels, confidence and how it is built and sampled. |
  | `references/waste.md` | The kinds of waste (D-4), each with its evidence, class and source. |
  | `references/report.md` | The report's format and the decision record. |
  | `references/ui-suites.md` | Stage 2: measuring and waste for UI suites, and the UI test rules (D-9). |
  | `references/non-code-checks.md` | Stage 3: the assessment (D-11). |
  | `scripts/phase_times.py` | A pytest plugin: one JSON line per test phase and per fixture set-up. |
  | `scripts/overlap.py` | Reads a coverage data file with contexts; prints contained tests and identical parametrised cases. |

  Frontmatter: `license: Apache 2.0`; facets `purpose: quality`, `area: coding`,
  `subject: generic`, `posture: reusable`, `stage: verify`, `maturity: experimental`. Bundle
  `meaningfy-building`. Use case: added to `served_by.skills` of `UC-W18` (programming team lead).

- **D-2 Step 1, measure.** Two runs of the suite's own test command, changed only by added flags.
  Output goes to a directory outside the repository or one git ignores; the repository's files are
  not edited.

  ```
  # run A: time per phase and per fixture
  PYTHONPATH=<skill>/scripts <test command> -p phase_times --phase-times-out=<out>/phases.jsonl
  # run B: the lines each test covers
  COVERAGE_FILE=<out>/.coverage <test command> --cov=<package> --cov-context=test --cov-report=
  python <skill>/scripts/overlap.py <out>/.coverage > <out>/overlap.json
  ```

  Run B uses pytest-cov's `--cov-context=test`, never `dynamic_context` in the coverage config
  (it fails under xdist and merges parametrised cases; spike). Run B is skipped, and the report
  says so, when the project has no pytest-cov. Timings are taken from run A only, because coverage
  slows a run by about 2.3 times.

- **D-3 The scripts.**
  - `phase_times.py` implements `pytest_addoption` (`--phase-times-out`),
    `pytest_runtest_logreport` (writes `{"test": nodeid, "phase": "setup"|"call"|"teardown",
    "seconds": float}`) and `pytest_fixture_setup` as a hook wrapper (writes `{"fixture": name,
    "scope": scope, "test": nodeid, "seconds": float}`). Under xdist each worker appends to
    `<out>.<worker id>`; the controller writes nothing.
  - `overlap.py` uses only `sqlite3` and `json`. It reads `context`, `file` and `line_bits`,
    decodes each `numbits` blob (bit *j* of byte *i* set means line *8i + j*), keeps the contexts
    ending in `|run`, and prints JSON with three lists: `contained` (test, the test that contains
    it, number of lines), `identical_cases` (test function, the groups of parametrised ids with the
    same lines) and `empty` (tests that execute no line of the package in their call).
  - Both are read-only on the audited repository and need no install.

- **D-4 Step 3, the kinds of waste.** `references/waste.md` holds this table. The class says how
  much a proposal can lose (D-6).

  | Id | Waste | Evidence | Class |
  |---|---|---|---|
  | W-1 | Set-up repeated for every test | A fixture whose summed set-up time is in the ten largest, with function scope, and whose tests do not change what it builds | 1 |
  | W-2 | A test in a tier its cost does not fit | Set-up plus call over the project's `slow` threshold with no `slow` marker; a unit test that opens a socket or a file outside `tmp_path` | 1 |
  | W-3 | A dead test | `skip` or `xfail` with no issue link | 1 |
  | W-4 | Parametrised cases that test the same thing | `identical_cases` from `overlap.py`, and the cases fall in one equivalence class when read | 2 |
  | W-5 | A test contained in another | `contained` from `overlap.py`, the same scenario in the map at high confidence, and assertions that the containing test also makes | 3 |
  | W-6 | The same behaviour proven at two tiers | An end-to-end or integration test whose scenario a unit or feature test serves at high confidence | 3 |
  | W-7 | A test that proves nothing | No `assert` and no `pytest.raises`, or listed in `empty` | 3 |
  | W-8 | An adversarial test that never found a defect | The file is named by stage, and no fix commit, delivery log or decision names the test | 3 |
  | W-9 | A test that kills no mutant of its own | The mutation results of EPIC B, when the repository has them | 3 |
  | W-10 | A broken test rule | The rule's number in its checklist | by rule |

  Overlap of covered lines is a hint, never proof (Shi et al., FSE 2014): W-4 and W-5 need the
  second piece of evidence in their row.

- **D-5 Step 2, the map.** One file in the audited repository, `tests/audit/scenario-map.csv`,
  one row per test function (not per parametrised case):

  ```
  test,level,capability,requirement,scenario,confidence,evidence
  tests/unit/session/test_loaded_graphs.py::test_remove_unregisters,scenario,rp-aggregate-store,Removing an aggregate,the aggregate was removed,high,name+covered code
  tests/unit/services/test_dump.py::test_dump_deterministic,requirement,rp-tenancy,A tenant can be dumped,,medium,module docstring
  tests/unit/adapters/test_mapper.py::test_generated_context,none,,,,none,
  ```

  - `level` is `scenario`, `requirement`, `capability` or `none`; `confidence` is `high`, `medium`
    or `none`. `high` needs two of: the test's name or docstring says it; the code it covers
    implements it; a feature file or a spec id names it.
  - A feature test takes its scenario from its `.feature` file (testing checklist rule 15): level
    `scenario`, confidence `high`.
  - The agent builds the map file by file, reading the test, its module docstring, the files it
    covers (run B) and the specs. A repository without a spec spine is mapped to its `.feature`
    scenarios, or all rows are `none` and the report says reductions are limited to class 1.
  - Before any proposal is discussed, the owner checks a sample: ten rows of each confidence,
    chosen at random. More than two wrong `high` rows in ten sends the map back.
  - A later audit re-reads only the tests added or changed since the map's commit.

- **D-6 Step 4, three classes of proposal.** The report lists class 1 first.

  | Class | What changes | What it can lose | Needs |
  |---|---|---|---|
  | 1 | A fixture's scope, a marker, a lane; no test is removed or merged | Nothing | Evidence from run A |
  | 2 | Parametrised cases are merged | A case that mattered | Evidence from run B and a reading of the cases |
  | 3 | A test is dropped | The only guard of a behaviour | A `high` map row for the test, and another `high` test for the same scenario; never the last test of a scenario |

  A test at level `none` or confidence below `high` is never proposed for class 3; it is listed
  under "serves no scenario" for the owner.

- **D-7 Step 4 and 5, the report and the decisions.** `tests/audit/report-<yyyy-mm-dd>.md` with
  these sections, in order: *Numbers* (tests, wall time, summed time, share of set-up, the commands
  run); *Where the time goes* (ten costliest files, ten costliest fixtures); *Proposals* (table:
  `P-<n>`, class, what, evidence, estimated saving, scenarios touched); *Scenarios with no test*;
  *Tests that serve no scenario*; *Broken rules*; *Not measured*; *Decisions* (per proposal:
  approved, rejected or later, with the owner's reason, filled in during the discussion).
  The map and the report go to the audited repository in one pull request. Each approved proposal,
  or group of the same class, lands as its own pull request whose body gives the wall time of the
  same command before and after, each run twice on the same machine, and the map rows it touches.
  "No proposal approved" completes the audit.

- **D-8 The test rules.** Added to `cosmic-python`'s testing checklist as rules 17 to 23, each
  with its source in `references/waste.md`:

  | Rule | Text | Source |
  |---|---|---|
  | 17 | Every test asserts something. | testsmells.org, Empty Test |
  | 18 | A fixture builds only what every test using it needs, and set-up that costs is shared at the widest scope whose tests do not change it. | Meszaros, General Fixture; spike |
  | 19 | No two parametrised cases fall in the same equivalence class. | testsmells.org, Lazy Test; spike |
  | 20 | A behaviour proven at a lower tier is not proven again at a higher one. | Vocke, The Practical Test Pyramid |
  | 21 | A test whose set-up and call take longer than the project's threshold carries the `slow` marker; the threshold is written in the marker's description. | *Software Engineering at Google*, ch. 11 |
  | 22 | Every `skip` and `xfail` carries an issue link. | Fowler, Eradicating Non-Determinism in Tests |
  | 23 | A file of adversarial tests is named by the feature it attacks, never by the stage that wrote it. | The recorded failure |

  `bdd-gherkin` gains two rules from Cucumber's anti-patterns: no step joins two actions with
  "and", and step definitions are written to be reused across features. If EPIC B stage 1 has
  landed, each new checklist rule ends with B's `*Checked by:*` value (`test-suite-care` audit, or
  the tool that checks it). The words "rules 1-16" in `skills/test-strategy/references/software.md`
  and `inventory.md` become "rules 1-23".

- **D-9 UI suites (stage 2).** `references/ui-suites.md`:
  - *Measure:* the runner's own JSON report (Cypress: the mocha JSON reporter; Playwright:
    `--reporter=json`) gives time per test and retries. Coverage per test is not assumed.
  - *Map:* a spec file's `describe` and `it` titles, or its `.feature` file, give the scenario.
  - *Waste:* logging in through the screen in every test; fixed waits; two specs walking the same
    journey; tests retried to pass; a selector by CSS class or XPath.
  - *Rules:* six UI test rules from the Cypress and Playwright best practices (set state through
    the API, not the screen; select by role, label or `data-*`; assertions that retry, no fixed
    wait; never visit a site you do not control; reset state before a test, not after; one journey
    groups its assertions). They live in this file because no skill owns UI test rules today; the
    file says so and names the trigger to move them (a UI skill appears). The last rule and
    checklist rule 11 (one assert per idea) do not conflict: rule 11 is scoped to unit and feature
    tests, and the stage adds those words to it.
  - The stage starts with a spike on the trial repository, as stage 1 did.

- **D-10 Lanes in scaffolded projects.** The home is `project-setup`, which owns every test run in
  CI; this corrects the EPIC's DEC-6, which named `ci-cd-delivery`.
  - `assets/templates/root/pytest.ini`: a `slow` marker ("set-up plus call of 2 s or more alone;
    left out of `make test-fast`").
  - `assets/templates/root/Makefile.tmpl`: `test-fast` (unit and feature, not `slow`, parallel, no
    coverage), `test-changed` (the tests of the files changed against `BASE`, default `develop`;
    falls back to `test-fast`), `profile-tests` (`--durations=15 -vv`).
  - `assets/templates/tests/changed.py`: the mechanism of `rdf-persistence`'s script with one rule
    table for the scaffold's layers (`<package>/<layer>/` to `tests/unit/<layer>/`); shared files
    (`pytest.ini`, the lock file, `tests/fixtures/`) fall back.
  - `references/testing-setup.md`: a "Developer lanes" section. CI is unchanged: `ci-quick` and
    `ci-full` run every test of their tier, `slow` included.

- **D-11 Checks that are not code (stage 3).** `references/non-code-checks.md`:
  1. Name the check, the project and the kind of task, and take one real past item the check
     would have read (a document, a draft, a diff).
  2. Plant five flaws of the kind the check claims to catch, each modelled on a recorded failure;
     keep a clean copy.
  3. Run the check three times on the seeded copy and three times on the clean copy, each run a
     fresh subagent with the check's own brief.
  4. Record per run: which planted flaws it reported, what it reported on the clean copy, and its
     cost (tokens and minutes).
  5. Report: planted flaws found in all three runs, in some, in none; findings on the clean copy
     the owner judges false; the cost of one run. No number is turned into a pass mark.
  6. The owner reads the same seeded copy for ten minutes first, so the report can say what the
     check found that the owner did not, and the reverse.
  7. The owner decides: keep, change the brief, narrow where it is mandatory, or drop.

  The trial uses a check that exists today, the cold reader of `technical-writing`, so the stage
  does not wait for EPICs C or D (this narrows the EPIC's DEC-9).

- **D-12 The distilling rule in `epic-delivery`.**
  - `references/team-and-briefs.md`, tester brief, **Report:** each test added carries the
    scenario or error-matrix row it attacks ("none" with a reason is allowed) and whether it
    failed on its first run.
  - `SKILL.md` step 4 gains one sentence, and `references/stage-loop.md` step 4 the detail: the
    lead keeps a tester's test that failed on its first run, one that alone covers a scenario or
    an error-matrix row, and a property that states an invariant of the PLAN; kept tests go into
    files named by feature (checklist rule 23); the rest are deleted, and the stage PR lists them
    with one reason per group.
  - The ledger row of the tester in `stage-loop.md` gains "distilled in step 4".
  - Order against EPIC B: if B's stage 2 has landed, these edits go into B's version of the brief
    and the ledger row. If it has not, they go into today's text, and task 1.9 adds one line to
    B's `tasks.md` (task 2.2) saying the two report fields are kept.

- **D-13 `test-strategy` rows.** `inventory.md` gains the next free id (`CHK-145` today): "Test
  suite audit; whether the suite's tests earn their cost; owner `test-suite-care`; moment: on
  request, at an EPIC boundary". `references/software.md` gains
  `| ADQ | CHK-<n> Test suite audit | test-suite-care | phase_times.py, overlap.py | on request | the developer | exists |`,
  and `SKILL.md` of the new skill carries the pointer line
  "Answers `ADQ` in `test-strategy`'s matrix (`references/software.md`)." Stage 2 adds the same
  row to `references/ui.md`, stage 3 a row to `references/cross-cutting.md`; the pointer line is
  extended each time.

- **D-14 The trial.** Stage 1 is tried on `rdf-persistence`: both runs on an idle machine, the
  map, the report, the discussion with the owner (the acceptance demo), then the approved pull
  requests under that repository's own rules. What the trial teaches goes back into the skill in
  general words; a lint-like test (D-15) keeps the repository's name out of the skill.

- **D-15 Tests in skillery.** `tests/test_test_suite_care.py`, written first and red:
  - `phase_times.py` under pytest's `pytester`: a module with one slow fixture and two tests
    yields one fixture line and six phase lines with the right names.
  - `overlap.py` on a SQLite file the test builds with the three tables: one contained test, one
    group of identical cases, one empty test are reported; a file with no `|run` context exits 2
    with the message of the error matrix.
  - A second test, skipped when `coverage` is not importable (CI has only pytest and pyyaml), runs
    a real `--cov-context=test` and feeds the result to `overlap.py`.
  - The skill's text names no repository: no `rdf-persistence`, no path starting with `/home`.
  - `references/waste.md` has ten `W-` rows, each with a class; the checklist has rules 1 to 23 in
    order; every rule number cited in `waste.md` exists.

## Algorithm / approach

The audit, as the skill's Quick Start will show it on a small project:

1. Run A and run B (D-2). Read `phases.jsonl`: total 310 s, set-up 240 s.
2. Build the map (D-5). The owner samples thirty rows.
3. Read the evidence against `waste.md`. Example finding: fixture `client` has function scope,
   costs 2.1 s, is used by 90 tests, and no test changes the service it builds (W-1).
4. Write the report. Example proposal: "P-1, class 1: make `client` module-scoped in
   `tests/unit/api/conftest.py`; evidence: 189 s of set-up over 90 tests; saving about 185 s;
   scenarios touched: none."
5. Discuss. The owner approves P-1 and rejects P-4 ("these cases document the format"). P-1 lands
   as a pull request: 310 s before, 128 s after.

### Anti-patterns

| Don't | Do | Why |
|---|---|---|
| Propose dropping tests first | List class 1 first | Set-up was 89 % of the time in the spike, and class 1 loses nothing |
| Drop a test because its lines are covered elsewhere | Require the second evidence of W-4 and W-5 | Covered lines are a hint, never proof |
| Assign every test to some scenario | Record `none` | A forced assignment makes a drop look safe |
| Take timings from the coverage run | Take them from run A | Coverage slows a run by about 2.3 times |
| Put `dynamic_context` in the coverage config | Pass `--cov-context=test` | The config way fails under xdist |
| Write the audited repository's name or thresholds into the skill | State them in the report | DEC-12 |
| Keep a stage's adversarial tests as written | Distil them in step 4 | DEC-3 |

## Error matrix

| Condition | Behaviour |
|---|---|
| The project has no pytest-cov | Run A only; the report says the audit is limited to W-1, W-2, W-3, W-7 (no assert) and W-10 |
| The coverage file has no context ending in `\|run` | `overlap.py` exits 2: "no per-test contexts: run with --cov-context=test" |
| A test fails or is flaky during a run | The run continues; the test is listed under *Not measured* and takes part in no proposal |
| The machine is loaded during run A | The report gives shares, not seconds; the before and after of a pull request are measured again |
| The repository has no specs and no feature files | Every map row is `none`; proposals are limited to class 1 |
| A spec scenario belongs to a change not yet archived | The map uses the change's delta spec and marks the row `evidence: open change` |
| A test in the map no longer exists | The row is removed at the next audit; a renamed test is mapped again |
| The owner's sample finds more than two wrong `high` rows in ten | The map is rebuilt for the files concerned before any class 3 proposal |
| A proposal would remove the last `high` test of a scenario | It is not made; the test may get a class 1 proposal |
| The suite is not pytest (stage 1) | The skill says which kinds it covers and stops |
| A non-code check reports different planted flaws in each of three runs | The report says "unstable" with the three lists; the owner decides |
| EPIC B's stage 2 lands while stage 1 is open | D-12's order rule: the edits are redone on B's text before merge |

## Risks / Trade-offs

- **RISK-1** (map wrong; likely, serious): D-5's two-evidence rule for `high`, the owner's sample,
  D-6's rule that class 3 needs two `high` tests. Residual: accepted.
- **RISK-2** (audit costs more than it saves; possible, moderate): two runs, once per audit, about
  3.3 times one normal run in total. Accepted.
- **RISK-3** (distilling drops a useful attack test; possible, moderate): accepted in the EPIC; the
  dropped tests stay in the branch history and are listed in the stage PR.
- **RISK-4** (one repository's pattern does not fit others; possible, moderate): D-15's test keeps
  the name out; thresholds live in the project's marker text.
- **RISK-5** (assessing a non-code check is costly and noisy; likely, minor): six runs, fixed by D-11.
- **RISK-6** (a shared fixture leaks state between tests; possible, serious): W-1 requires that no
  test changes what the fixture builds; the pull request runs the suite in random order twice
  where the project has `pytest-randomly`, and says so where it has not.
- **RISK-7** (lines attributed to the wrong test in async code; unknown): not checked by the
  spike; W-4 and W-5 never rest on coverage alone.

## Open Questions

None blocks stage 1. To confirm with the owner at scenario sign-off (task 1.0):

- **OQ-1** The UI test rules live in `test-suite-care` until a UI skill exists (D-9).
- **OQ-2** Which repository with a Cypress or Playwright suite is the trial ground of stage 2.
- **OQ-3** The developer lanes change no CI run; slow tests still run on every pull request (D-10).
