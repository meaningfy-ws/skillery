<!-- STATUS: PLAN derived 2026-11-14 from proposal.md and inputs/spike.md; attacked the same day
     by a fresh reader, whose findings are folded in (Attack record). Clarity gate, first run:
     8.6, fail; second run: 8.6, fail on other gaps; third run: 8.8, fail on ten small gaps; fourth run: 9.05, PASS. The fourth run's nine gaps
     are folded in and not scored again (Gate record). Revised 2026-11-15 against the three
     refactoring EPICs (D-37 to D-42, under Delivery decisions); not gated again. Revised
     2026-11-15 again by owner agreement (D-43 to D-46): stage 2 deferred, stage 3 after the
     retrospective tooling EPIC, closing check handed over, OQ-4 and OQ-5 answered. Revised
     2026-11-16 against the lean skills on develop (D-47 to D-52); not gated again. -->

# PLAN (design): test suite care

**Derives from:** [`proposal.md`](proposal.md) (EPIC E, DEC-1..DEC-12). Evidence:
[`inputs/spike.md`](inputs/spike.md).

## Context

The EPIC asks for a skill that audits an existing test suite and proposes how to make it smaller
and quicker without losing a specified feature. The spike changed two assumptions of the EPIC:

- **Most of the time is set-up, not tests.** On the measured subset 89 % of the time was spent in
  function-scoped fixtures. Making set-up cheaper removes no test, so it comes before any merging
  or dropping. It is not free: a shared fixture can let one test pass on another's work (D-6).
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
- No mutation testing here (stage 3 of `openspec/changes/harden-checks-and-tests/` supplies
  mutants when it exists); branch data is
  used only for the lines it names.
- No executable step definitions for the catalogue's own Gherkin features.

## Decisions

- **D-1 Files of the skill.** `skills/test-suite-care/`:

  | File | Holds |
  |---|---|
  | `SKILL.md` | Quick Start with one worked example, the five steps, the three classes of proposal, Gotchas, Boundary & Related Skills. Body near 6 KB (D-40; was a target of 150 lines). *Revised 2026-11-16 (D-48):* the sections of the lean body; Gotchas become a Common mistakes table under Rules. |
  | `references/measuring.md` | The commands of step 1, per kind of test; what to do when a tool is missing. |
  | `references/scenario-map.md` | The map's format, levels, confidence and how it is built and sampled. |
  | `references/waste.md` | The kinds of waste (D-4), each with its evidence and class. |
  | `assets/report-template.md` | The report's sections and the decision record, as a template to fill in (D-40; was `references/report.md`). |
  | `references/non-code-checks.md` | Stage 3: the assessment (D-11). (`references/ui-suites.md`, stage 2, is deferred: D-43.) |
  | `scripts/phase_times.py` | A pytest plugin: one JSON line per test phase and per fixture set-up. |
  | `scripts/overlap.py` | Reads a coverage data file with contexts; prints contained tests and identical parametrised cases. |

  Description (frontmatter): "Use this skill when a test suite has grown slow or large and must
  be made smaller or quicker without losing a specified feature, or when a check that is not
  code (a reader, a checklist) must be judged for whether it earns its place: 'our tests take too
  long', 'which tests can we drop', 'is our cold reader any good'. It audits the suite, maps tests to the scenarios they serve and proposes reductions
  the owner decides. Not for writing tests (cosmic-python) or choosing an activity's checks
  (test-strategy)." Each later stage links its new reference file from `SKILL.md`, in a line
  that says when to open it and what it adds (D-40).

  Frontmatter: `license: Apache 2.0`; facets `purpose: quality`, `area: coding`,
  `subject: generic`, `posture: reusable`, `stage: verify`, `maturity: experimental`. Bundle
  `meaningfy-building`. Use case: added to `served_by.skills` of `UC-W18` (programming team lead).

- **D-2 Step 1, measure.** Two runs of the project's own test command (often a `make` target),
  with the added flags passed in the `PYTEST_ADDOPTS` environment variable so the command itself
  is not edited. Output goes to a directory outside the repository; no file of the repository is
  edited. Each tier the project has (unit, feature, integration, end to end) is run in both.

  ```
  # run A: time per phase and per fixture, without coverage
  PYTHONPATH=<skill>/scripts PYTEST_ADDOPTS="-p phase_times --phase-times-out=<out>/phases.jsonl --no-cov" <test command>
  # run B: the lines each test covers
  COVERAGE_FILE=<out>/.coverage PYTEST_ADDOPTS="--cov-context=test" <test command>
  python <skill>/scripts/overlap.py <out>/.coverage --phases <out>/phases.jsonl > <out>/overlap.json
  ```

  - `--no-cov` is passed only when the project has pytest-cov; run B adds `--cov=<package>` only
    when the command does not already measure coverage.
  - Run B uses pytest-cov's `--cov-context=test`, never `dynamic_context` in the coverage config
    (it fails under xdist and merges parametrised cases; `inputs/spike.md`).
  - Without pytest-cov, run B is skipped and the report says which kinds of waste were not looked
    for (Error matrix).
  - Run B may end with a failure when the command carries a coverage floor (flags on the
    command line win over `PYTEST_ADDOPTS`); the data file is complete and is used all the same.
  - Timings come from run A only: coverage slows a run by about 2.3 times (`inputs/spike.md`).

- **D-3 The scripts.** Both use the standard library only (and pytest's hooks), are read-only on
  the audited repository and need no install.
  - `phase_times.py` implements `pytest_addoption` (`--phase-times-out`). The controller process
    (the only process without xdist) writes the phase lines from `pytest_runtest_logreport`:
    `{"test": nodeid, "phase": "setup"|"call"|"teardown", "outcome": ..., "seconds": float}`. The
    process that runs the test (a worker under xdist) writes the fixture lines from a
    `pytest_fixture_setup` hook wrapper, one line each time a fixture is built:
    `{"fixture": name, "scope": scope, "test": nodeid, "seconds": float}`; a worker writes to
    `<out>.<worker id>` and the controller's file is `<out>`.
  - `overlap.py` reads the coverage SQLite file. When `meta.has_arcs` is 1 (branch coverage, the
    scaffold's and the trial's setting) the lines of a context are the positive `fromno` and
    `tono` of its rows in `arc`; otherwise they are decoded from `line_bits.numbits` (bit *j* of
    byte *i* set means line *8i + j*). It keeps the contexts ending in `|run` and prints JSON with
    three lists: `contained` (test, the test that contains it, number of lines; when several
    tests contain it, the one with the fewest lines, then the first by node id; two tests with
    equal lines are listed once, the first by node id as the container),
    `identical_cases` (test function, the groups of parametrised ids with the same lines) and
    `no_lines` (tests that passed their call in `--phases` and have no `|run` context: coverage
    stores no context for a test that executes no measured line).
  - `overlap.py <after> --compare <before>` prints instead the list `changed`: each test whose
    `|run` lines differ between the two coverage files, with the lines only in one and only in
    the other. This is the tool of D-6's check.
  - The fixture lines of all workers are read together: `measuring.md` tells the agent to read
    `<out>` and every `<out>.*`.

- **D-4 Step 3, the kinds of waste.** `references/waste.md` holds this table. The class says how
  much a proposal can lose (D-6). Rules are cited by number, never restated.

  | Id | Waste | Evidence, all of it required | Class |
  |---|---|---|---|
  | W-1 | Set-up repeated for every test | A fixture among the ten with the largest summed set-up time; and a reading of the fixture and of every test using it that sorts what it builds into "no test changes it" and "tests change it" | 1 |
  | W-2 | A test in a lane its cost does not fit | Set-up plus call over the project's `slow` threshold with no `slow` marker (checklist rule 20) | 1 |
  | W-3 | Parametrised cases that test the same thing | `identical_cases`; the cases expect the same outcome and differ only by values of one equivalence class; none is a case that checklist rule 8 or a Scenario Outline's boundary rows require | 2 |
  | W-4 | A test contained in another | `contained`; both tests at `high` for the same scenario in the map; every assertion of the test is also made by the survivor | 3 |
  | W-5 | The same behaviour proven at two tiers | A higher-tier test at `high` for a scenario that a lower-tier test serves at `high`; and the higher test runs nothing real that the lower one replaces with a fake (a test against a real adapter, store or service is never W-5) | 3 |
  | W-6 | A test that runs nothing | Listed in `no_lines`, and the code it calls is not left out by the `omit` setting of the project's coverage configuration (`.coveragerc`, `pyproject.toml` or `setup.cfg`), which the agent reads | 3 |
  | W-7 | An adversarial test that never found a defect | The file is named by stage, and no fix commit, delivery log or decision names the test | 3 |
  | W-8 | A test that kills no mutant of its own | A local mutation run's results, when the repository has them (EPIC B no longer produces any: its D-35 of 2026-11-15) | 3 |

  A broken checklist rule is not a kind of waste: it is listed under *Broken rules* by its number
  (D-7). Overlap of covered lines is a hint, never proof (Shi et al., FSE 2014), which is why W-3
  and W-4 need every piece of evidence in their row.

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
    implements it; a feature file or a spec id names it. `medium` has one of the three; `none`
    has none and goes with level `none`.
  - A feature test takes its scenario from its `.feature` file (testing checklist rule 15): level
    `scenario`, confidence `high`.
  - The agent builds the map file by file, reading the test, its module docstring, the files it
    covers (run B) and the specs. A repository without a spec spine is mapped to its `.feature`
    scenarios, or all rows are `none` and the report says the proposals are limited to class 1,
    class 2 and W-6, which need no map.
  - Before any proposal is discussed, the owner checks a sample: ten rows of each confidence,
    chosen at random. One wrong `high` row sends the rows of that test file back to be mapped
    again, and a new sample of `high` rows is drawn.
  - Size: the trial has about 2,500 test functions in 179 files. The map is built by one fresh
    subagent per test folder, in parallel, each returning its rows; the lead merges them.
  - A later audit re-reads only the tests added or changed since the map's commit.

- **D-6 Step 4, three classes of proposal.** The report lists class 1 first.

  | Class | What changes | What it can lose | Needs |
  |---|---|---|---|
  | 1 | A fixture is split or shared, a marker or a lane changes; no test is removed or merged | Isolation: a test may pass on what another test left behind | For a fixture: the reading of W-1; then the check below |
  | 2 | Parametrised cases are merged | A case that mattered | All the evidence of W-3 |
  | 3 | A test is dropped | The only guard of a behaviour | All the evidence of its row, and a survivor (below) |

  Rules for every class:
  - **A fixture is shared only in its unchanging part.** What tests change (a store they write to,
    a mock whose calls they assert) keeps function scope; what no test changes (the built
    application, loaded read-only data) may move to a wider scope, with a cheap reset per test
    where needed. A mock or a spy is never shared. An async fixture is widened only to a scope
    the project's event-loop setting allows.
  - **The check of a class 1 fixture change:** run B is made before and after the change, and
    `overlap.py <after> --compare <before>` (D-3) lists no test that uses the fixture. The suite
    also passes twice, the second time with the test files given to pytest in reverse order.
  - **Every class 2 proposal and every class 3 proposal under W-4, W-5, W-7 and W-8 names its
    survivor.** For class 2 it is the case that stays. For class 3 it is another test mapped at
    `high` to the same scenario as the dropped test, which is itself at `high`: under W-4 the
    containing test, under W-5 the lower-tier test, under W-7 and W-8 any such test. A survivor
    takes part in no other class 2 or class 3 proposal of the same audit, so two tests that
    contain each other cannot both go.
  - **W-6 is the one exception:** a test that runs no line of the package needs no map row and
    no survivor, because it guards nothing.
  - Any other test at level `none`, or below `high`, is never proposed for class 3; it is listed
    under "Tests that serve no scenario" for the owner, with the waste row it matches.
  - No proposal leaves a test that breaks a checklist rule it did not break before (DEC-10).

- **D-7 Step 4 and 5, the report and the decisions.** `tests/audit/report-<yyyy-mm-dd>.md` with
  these sections, in order: *Numbers* (tests, wall time, summed time, share of set-up, the commands
  run); *Where the time goes* (ten costliest files, ten costliest fixtures); *Proposals* (table:
  `P-<n>`, class, what, evidence, estimated saving, scenarios touched, survivor); *Scenarios with no test*;
  *Tests that serve no scenario*; *Broken rules*; *Not measured*; *Decisions* (per proposal:
  approved, rejected or later, with the owner's reason, filled in during the discussion).
  The map and the report go to the audited repository in one pull request. Each approved proposal,
  or group of the same class, lands as its own pull request whose body gives the wall time of the
  same command before and after, each run twice on the same machine, the map rows it touches, the
  check of D-6 for a fixture change, and the result of the repository's coverage floor (DEC-5).
  "No proposal approved" completes the audit.

- **D-8 The test rules.** In `cosmic-python`'s testing checklist, two rules are amended in place
  and five are added in a new section, "Suite size and cost", placed after "Traceability and
  validated examples" and before "The report". A "Sources" list at the end of the checklist gives,
  by rule number, the smell each one prevents and its source; `test-suite-care` cites the numbers.

  | Rule | Text | Smell it prevents; source |
  |---|---|---|
  | 6 (one sentence added) | Set-up that costs is shared at the widest scope whose tests do not change what it builds; a mock is never shared. | General Fixture; Meszaros, and the spike |
  | 14 (one sentence added) | A `skip` or `xfail` that is not a quarantine carries an issue link, unless it skips for a tool the machine lacks. | Ignored Test; Fowler, Eradicating Non-Determinism in Tests |
  | 17 | Every test asserts something. | Empty Test; testsmells.org |
  | 18 | No two parametrised cases fall in the same equivalence class, beyond the cases rule 8 requires. | Lazy Test; testsmells.org, and the spike |
  | 19 | A behaviour proven at a lower tier is not proven again at a higher one, unless the higher test runs something real that the lower one fakes. | Duplication across tiers; Vocke, The Practical Test Pyramid |
  | 20 | A test whose set-up and call take longer than the project's threshold carries the `slow` marker; the threshold is written in the marker's description. | Slow Tests; *Software Engineering at Google*, ch. 11 |
  | 21 | A file of adversarial tests is named by the feature it attacks, never by the stage that wrote it. | Tests filed by history; the recorded failure |

  `skills/bdd-gherkin/SKILL.md`, section "Quality checks (before finishing)", gains one check
  box from Cucumber's anti-patterns: "No step joins two actions with 'and'."
  The words "rules 1-16" in `skills/test-strategy/references/software.md` and
  `inventory.md` become "rules 1-21".

  Order against EPIC B's "Checked by" (its D-3, task 1.12). If B's stage 1 has landed, rules 17 to
  21 each end with `*Checked by:* review only, because the audit of test-suite-care reads it`,
  which is B's grammar. If it has not, task 1.6 adds one line to task 1.12 of
  `openspec/changes/harden-checks-and-tests/tasks.md`: "the checklist has 21 items; 17 to 21 take
  the value above".

- **D-9 UI suites (stage 2).** *Deferred 2026-11-15 (D-43): not delivered with this EPIC. The
  text below is kept as the starting point for when the stage resumes.* `references/ui-suites.md`:
  - *Measure:* the runner's own JSON report (Cypress: the mocha JSON reporter; Playwright:
    `--reporter=json`) gives time per test and retries. Coverage per test is not assumed.
  - *Map:* a spec file's `describe` and `it` titles, or its `.feature` file, give the scenario.
  - *Waste:* logging in through the screen in every test (class 1); two specs walking the same
    journey (class 3, with the map's evidence). Fixed waits, tests retried to pass and selectors
    by CSS class or XPath are broken rules.
  - *Rules:* six UI test rules, each with its source in the file: set state through the API, not
    the screen (Cypress best practices, "Organizing tests, logging in, controlling state");
    select by role, label or `data-*` (Cypress, "Selecting elements"; Playwright best practices,
    "Use locators"); assertions that retry, no fixed wait (Cypress, "Unnecessary waiting";
    Playwright, "Use web first assertions"); never visit a site you do not control (Cypress,
    "Visiting external sites"); reset state before a test, not after (Cypress, "Using after or
    afterEach hooks"); one journey groups its assertions (Cypress, "Creating tiny tests with a
    single assertion"). They live in this file because no skill owns UI test rules today; the
    file says so and names the trigger to move them (a UI skill appears). The last rule and
    checklist rule 11 (one assert per idea) do not conflict: rule 11 is scoped to unit and feature
    tests, and the stage adds those words to it.
  - The stage starts with a spike on the trial repository, as stage 1 did.

- **D-10 Lanes in scaffolded projects.** The home is `project-setup`, which owns every test run in
  CI; this corrects the EPIC's DEC-6, which named `ci-cd-delivery`. A second deviation from
  DEC-6: no scheduled run is added. Slow tests leave the developer's lanes only and still run in
  CI on every pull request (OQ-3 asks the owner to confirm).
  - `assets/templates/root/pytest.ini`: a `slow` marker ("set-up plus call of 2 s or more alone;
    left out of `make test-fast`").
  - `assets/templates/root/Makefile.tmpl`: `test-fast` (unit and feature, not `slow`, no
    coverage), `test-changed` (the tests of the files changed against `BASE`, default `develop`;
    falls back to `test-fast`), `profile-tests` (`-m "unit or feature" --durations=15 -vv`). No parallel run: the
    scaffold has no pytest-xdist and gains none here.
  - `assets/templates/tests/changed.py`, rendered by `scripts/scaffold.sh` beside
    `tests/conftest.py` (its section 4) with the package name in place of `<<PACKAGE>>`. Its
    contract, complete here:
    - *Run:* `python -m tests.changed` from the repository root; the base branch comes from the
      environment variable `BASE`, default `develop`.
    - *Input:* the files of `git diff --name-only --no-renames <merge base of HEAD and BASE>`
      plus the untracked files of `git ls-files --others --exclude-standard`.
    - *Rules,* the first that matches a path:

      | Path | Result |
      |---|---|
      | `pytest.ini`, `pyproject.toml`, a lock file, `Makefile`, `.coveragerc` at the root | fall back |
      | `tests/unit/<folder>/…` | `tests/unit/<folder>/` |
      | `tests/unit/test_*.py` | that file |
      | `tests/feature/…` | `tests/feature/` |
      | `tests/integration/…`, `tests/e2e/…` | no test; a hint on standard error names `make test-integration` or `make test-e2e` |
      | any other file under `tests/` (`tests/conftest.py`, `tests/unit/conftest.py`, `tests/test_data/…`, `tests/changed.py`, a helper) | fall back |
      | `<<PACKAGE>>/<layer>/…` | `tests/unit/<layer>/` when that folder exists, else fall back |
      | any other file under `<<PACKAGE>>/` | fall back |
      | anything else (docs, specs, CI files) | no test |

    - A deleted file is matched by the same rules as a changed one; a resulting path that no
      longer exists is left out of the output.
    - *Output:* the pytest paths on standard output, one per line, sorted, each once; nothing
      when no test is to run, and nothing on a fallback. The reason for each fallback goes to
      standard error.
    - *The target:* `test-changed` runs pytest on the printed paths with `-m "unit or feature"`,
      slow tests included; on empty output it prints "no test to run" and succeeds.
    - *Exit codes:* 0; 3 when any path fell back (the `test-changed` target then runs
      `make test-fast`); 2 when git fails or `BASE` does not exist.
    - The 2 s of the `slow` marker is the scaffold's starting value, taken from the trial
      repository; a project changes it in its own `pytest.ini`.
  - `references/testing-setup.md`: a "Developer lanes" section. `ci-quick` and `ci-full` are
    unchanged. *Revised 2026-11-16 (D-49):* no new section; the existing **Lanes** bullet names
    the two targets, and the contract above lives in the template's docstring.

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
     the owner judges false; the cost of one run. There is no pass mark.
  6. The owner reads the same seeded copy for ten minutes first, so the report can say what the
     check found that the owner did not, and the reverse.
  7. The owner decides: keep, change the brief, narrow where it is mandatory, or drop.

  The trial uses a check that exists today, the cold reader of `technical-writing`, so the stage
  does not wait for EPICs C or D (this narrows the EPIC's DEC-9).

- **D-12 The distilling rule in `epic-delivery`.**
  - `references/team-and-briefs.md`, tester brief, **Report:** each test added carries the
    scenario or error-matrix row it attacks ("none" with a reason is allowed) and whether it
    failed on its first run.
  - `SKILL.md`, step 4 of "The loop of a stage" (not the Quick Start), gains the sentence "The
    lead also sorts the tester's tests into kept and deleted (`references/stage-loop.md`,
    step 4)." `references/stage-loop.md` step 4 gains the detail. After deciding the findings,
    the lead sorts the tester's tests:
    - **kept:** a test that failed on its first run and whose finding the lead accepted; a test
      that alone covers a scenario or an error-matrix row; one property per invariant that the
      PLAN's design names;
    - **deleted:** every other one, including a test whose finding the lead rejected.
    A builder moves the kept tests into files named by feature (checklist rule 21) and deletes the
    rest in the stage's one fix pass, before the gate run that checks the pass
    (`delivery-process-and-tools` DEC-4; D-38), so the coverage floor is
    checked on what remains. The stage PR lists each deleted test with its reason.
  - In the check ledger of `stage-loop.md`, the last cell of the "Adversarial tester" row
    changes from "—" to "Distilled in step 4".
  - Gherkin. `tests/features/agents/team-lead.feature`, outline "The lead delivers, delegates or
    refuses", gains the Examples row: request "decide the tester's forty tests of the stage",
    does "keeps the ones that failed first and were accepted, the sole covers and one property
    per invariant, has a builder delete the rest and lists each in the PR".
    `tests/features/epic-delivery.feature` gains, after "Each check runs once in a stage":

    ```gherkin
    Scenario: A stage's adversarial tests are distilled
      Given the tester reported forty tests, each with what it attacks and whether it failed on its first run
      And three failed on their first run and the lead accepted their findings
      When the lead decides the findings in step 4
      Then the three, any test that alone covers a scenario and one property per PLAN invariant are kept in files named by feature
      And a builder deletes the rest in the stage's one fix pass, before the gate run that checks it
      And the stage PR lists each deleted test with its reason
    ```
  - Order against EPIC B, whose task 2.4 replaces the tester brief and the ledger row. If B's
    stage 2 has landed, these edits go into B's text. If it has not, they go into today's text,
    and task 1.9 adds one line to task 2.4 of
    `openspec/changes/harden-checks-and-tests/tasks.md`: "keep the two report fields and the
    words 'Distilled in step 4'".

- **D-13 `test-strategy` rows.** All under `skills/test-strategy/references/`. A new id is the
  next free one at delivery (`CHK-145` if none was taken). Owners are in backticks, as the test's
  pattern requires.

  | Stage | File | Edit |
  |---|---|---|
  | 1 | `inventory.md` | New row: `CHK-<n>`; "Test suite audit"; "whether the suite's tests earn their cost"; owner `` `skills/test-suite-care/SKILL.md` (The five steps) ``; moment "on request" |
  | 1 | `software.md` | New row: ``\| ADQ \| CHK-<n> Test suite audit \| `test-suite-care` \| `phase_times.py`, `overlap.py` \| on request \| the developer \| exists \|`` |
  | 1 | `software.md` | Both rows of `CHK-2` (the `VER` row and the `ADQ` row): the Moment cell changes from "writing and reviewing tests" to "writing and reviewing tests; the developer's lanes (`make test-fast`, `make test-changed`)" (DEC-9) |
  | 1 | the new `SKILL.md` | Pointer line: "Answers `ADQ` in `test-strategy`'s matrix (`references/software.md`)." |
  | 2 | `ui.md` | *Deferred (D-43).* The same `ADQ` row as in `software.md`, with the tool "the runner's JSON report"; the pointer line lists both files |
  | 3 | `inventory.md` | New row: `CHK-<m>`; "Assessment of a check that is not code"; "whether a reader or a checklist catches what it claims, the same way each time"; owner `` `skills/test-suite-care/references/non-code-checks.md` ``; moment "on request" |
  | 3 | `cross-cutting.md` | New row: ``\| ADQ \| CHK-<m> Assessment of a check that is not code \| `test-suite-care` \| five planted flaws, three runs \| on request \| the owner \| exists \|``; the pointer line lists the three files |

- **D-14 The trial.** Stage 1 is tried on `rdf-persistence`: both runs on an idle machine for its
  unit, feature and integration lanes, the
  map, the report, the discussion with the owner (the acceptance demo), then the approved pull
  requests under that repository's own rules. What the trial teaches goes back into the skill in
  general words; a lint-like test (D-15) keeps the repository's name out of the skill.

- **D-15 Tests in skillery.** `tests/test_test_suite_care.py`, written first and red.

  | Id | Stage | Test |
  |---|---|---|
  | T-1 | 1 | `phase_times.py` under pytest's `pytester`: a module with one slow function-scoped fixture and two tests yields two fixture lines and six phase lines with the right names |
  | T-2 | 1 | The same module under `-n 2` yields the same lines once across `<out>` and `<out>.*` (skipped when xdist is not installed) |
  | T-3 | 1 | `overlap.py` on a SQLite file the test builds with `line_bits`: one contained test, one group of identical cases; a test in the phases file with no context is in `no_lines` |
  | T-4 | 1 | The same on a file with `has_arcs = 1` and rows in `arc` |
  | T-5 | 1 | A file with no `\|run` context: exit 2 and the message of the error matrix |
  | T-6 | 1 | `--compare` on two built files that differ in one test's lines lists that test only |
  | T-7 | 1 | Skipped when `coverage` is not importable (CI has only pytest and pyyaml): a real `--cov-context=test` run with branch coverage on, fed to `overlap.py` |
  | T-8 | 1 | The `changed.py` template on a temporary git repository: each row of D-10's rule table, and the three exit codes |
  | T-9 | 1 | `scaffold.sh` into a temporary directory produces `tests/changed.py`, the `slow` marker and the three targets |
  | T-10 | 1 | No file under `skills/test-suite-care/` contains `rdf-persistence` or a path starting with `/home`, and no `.md` file there matches a pinned version (`[\w.-]+==\d`). Thresholds cannot be tested for: the stage's reviewers read for them (DEC-12) |
  | T-11 | 1 | `references/waste.md` has eight `W-` rows, each with a class; the checklist has rules 1 to 21 in order and a Sources entry for 6, 14 and 17 to 21; every rule number cited under `skills/test-suite-care/` exists |
  | T-12 | 1 | The tester brief names the two report fields; the ledger row reads "Distilled in step 4"; `epic-delivery.feature` has the scenario of D-12 |
  | T-13 | 2, deferred (D-43) | `references/ui-suites.md` has the four sections of D-9 and six rules, each with a source; checklist rule 11 names its scope |
  | T-15 | 1 | `software.md` has an `ADQ` row whose owner is `test-suite-care`; both `CHK-2` rows name the lanes in their Moment cell; "rules 1-21" stands in `software.md` (twice) and `inventory.md`, and "rules 1-16" nowhere under `skills/`; the "Quality checks" of `bdd-gherkin` hold the new box |
  | T-14 | 3 | `references/non-code-checks.md` has the seven steps of D-11 and the words "no pass mark"; `cross-cutting.md` cites the second id |

- **D-16 Registration and triggers.** The new skill is registered as the repository requires for
  any skill: its entry in `bundles.yaml` under `meaningfy-building`; `test-suite-care` in
  `served_by.skills` of `use-cases/UC-W18-programming-team-lead.md`; the bundle's cell in the
  README table "What's inside" and one row "I want to… make a slow test suite quicker"; a line
  under `## [Unreleased]` / `### Added` in `CHANGELOG.md` naming the EPIC and the bundle; then
  `make bundles` and `make skill-inventory`. Trigger probes go to `tests/trigger_probes.yaml`,
  one positive and two near-misses in stage 1 and one positive in stage 3 (tasks 1.5, 3.3; task
  2.4 is deferred, D-43). The probe check is advisory, so each probe is also asked three times, each time as
  the first message of a new Claude Code session in this repository with the bundles installed
  from the branch, and the skill that loaded is recorded.
  *Revised 2026-11-15 (D-41):* once the orchestrator of `orchestrate-external-skills` exists,
  the probes also hold one near-miss against it, and the orchestrator holds a row for this skill.

## Algorithm / approach

The audit, as the skill's Quick Start will show it on a small project:

1. Run A and run B (D-2). Read `phases.jsonl`: total 310 s, set-up 240 s.
2. Build the map (D-5). The owner samples thirty rows.
3. Read the evidence against `waste.md`. Example finding: fixture `service` has function scope,
   costs 2.1 s and is used by 90 tests; it builds an application (no test changes it) and an
   empty store (every test writes to it) (W-1).
4. Write the report. Example proposal: "P-1, class 1: split `service` in
   `tests/unit/api/conftest.py` into a module-scoped application and a function-scoped store
   reset; evidence: 189 s of set-up over 90 tests, 1.9 s of each in building the application;
   saving about 170 s; scenarios touched: none; survivor: not applicable."
5. Discuss. The owner approves P-1 and rejects P-4 ("these cases document the format"). P-1 lands
   as a pull request: 310 s before, 140 s after, the same covered lines for all 90 tests.

### Anti-patterns

| Don't | Do | Why |
|---|---|---|
| Propose dropping tests first | List class 1 first | Set-up was 89 % of the time in the spike, and class 1 removes no test |
| Widen the scope of a whole fixture | Share only the part no test changes; never a mock | A test can pass on a call another test made |
| Let two overlapping tests both be dropped | Name the survivor of every proposal | Each contains the other |
| Drop the integration test because a unit test serves the scenario | Keep a test that runs the real adapter | The unit test runs a fake |
| Drop a test because its lines are covered elsewhere | Require the second evidence of W-4 and W-5 | Covered lines are a hint, never proof |
| Assign every test to some scenario | Record `none` | A forced assignment makes a drop look safe |
| Take timings from the coverage run | Take them from run A, with `--no-cov` | Coverage slows a run by about 2.3 times |
| Append flags to a `make` target | Pass them in `PYTEST_ADDOPTS` | The target takes no flags |
| Put `dynamic_context` in the coverage config | Pass `--cov-context=test` | The config way fails under xdist |
| Write the audited repository's name or thresholds into the skill | State them in the report | DEC-12 |
| Keep a stage's adversarial tests as written | Distil them in step 4 | DEC-3 |

## Error matrix

| Condition | Behaviour |
|---|---|
| The project has no `slow` marker | W-2 is not looked for; the report proposes, as class 1, adding the marker with a threshold read from the measured times |
| The project has no pytest-cov | Run A only; the report says the audit is limited to W-1, W-2 and the broken rules |
| The project measures branches | `overlap.py` reads `arc` (D-3) |
| A test's code is under the coverage `omit` setting | It is not reported as W-6; the report names the setting |
| Tests change what a costly fixture builds | The proposal splits the fixture; if nothing unchanging is left, no proposal is made and the report says why |
| Covered lines differ before and after a fixture change | The pull request is not merged; the proposal returns to the report as rejected with the evidence |
| The coverage file has no context ending in `\|run` | `overlap.py` exits 2: "no per-test contexts: run with --cov-context=test" |
| A test fails or is flaky during a run | The run continues; the test is listed under *Not measured* and takes part in no proposal |
| The machine is loaded during run A | The report gives shares, not seconds; the before and after of a pull request are measured again |
| The repository has no specs and no feature files | Every map row is `none`; proposals are limited to class 1, class 2 and W-6 |
| A spec scenario belongs to a change not yet archived | The map uses the change's delta spec and marks the row `evidence: open change` |
| A test in the map no longer exists | The row is removed at the next audit; a renamed test is mapped again |
| The owner's sample finds a wrong `high` row | The rows of that test file are mapped again and a new sample is drawn, before any class 3 proposal |
| A proposal would remove the last `high` test of a scenario | It is not made; the test may get a class 1 proposal |
| The suite is not pytest (stage 1) | The skill says which kinds it covers and stops |
| A non-code check reports different planted flaws in each of three runs | The report says "unstable" with the three lists; the owner decides |
| EPIC B's stage 1 or 2 lands while stage 1 is open | The order rules of D-8 and D-12: the edits are redone on B's text before merge |

## Risks / Trade-offs

- **RISK-1** (map wrong; likely, serious): D-5's two-evidence rule for `high`, the owner's sample,
  D-6's rule that class 3 needs two `high` tests. Residual: accepted.
- **RISK-2** (audit costs more than it saves; possible, moderate): two runs, once per audit, about
  3.3 times one normal run in total. Accepted.
- **RISK-3** (distilling drops a useful attack test; possible, moderate): accepted in the EPIC; the
  dropped tests stay in the branch history and are listed in the stage PR.
- **RISK-4** (one repository's pattern does not fit others; possible, moderate): test T-10 keeps
  the name out; thresholds live in the project's marker text.
- **RISK-5** (assessing a non-code check is costly and noisy; likely, minor): six runs, fixed by D-11.
- **RISK-6** (a shared fixture lets a test pass on another's work; likely where tried carelessly,
  serious): only the unchanging part is shared and a mock never is (D-6); the pull request shows
  the same covered lines per test before and after. Residual: a false pass that changes no covered
  line; accepted, and named in the skill's Gotchas.
- **RISK-7** (lines attributed to the wrong test in async code; unknown): not checked by the
  spike; W-4 and W-5 never rest on coverage alone.

## Deviations from the EPIC

The EPIC is frozen; these are the places where the PLAN departs from its words, each for a
recorded reason.

| EPIC | PLAN | Reason |
|---|---|---|
| DEC-6: the pull-request and scheduled split goes into `ci-cd-delivery` | The lanes go into `project-setup`; no scheduled run (D-10) | `ci-cd-delivery` owns deployment only; the lanes speed the developer's loop, and CI keeps running everything |
| DEC-9: stage 3 needs the checks of C or D | Tried on the cold reader, which exists (D-11) | No reason to wait |
| DEC-3: "the properties that state an invariant" are kept | One property per invariant the PLAN's design names (D-12) | Under EPIC B's brief every tester test is such a property, so the rule would keep everything (A-6) |
| DEC-3: dropped "with a recorded reason" | Listed in the stage PR, each with its reason (D-12) | Names the place |
| DEC-11: "the same verdict twice" | Three runs on each copy (D-11) | Two runs cannot tell "sometimes" from "never" |
| Modified capabilities: lanes placed "when the PLAN is derived" | The lane requirement sits in the `test-suite-care` spec | No capability exists for `project-setup` |
| DEC-8: the PLAN names the trial repositories of stages 2 and 3 | Stage 3 is named (this repository's cold reader); stage 2 is deferred until a repository is named (OQ-2, D-43) | Only the owner knows which repository has a UI suite worth auditing |
| DEC-2: a test that serves no scenario is listed for the owner, never proposed for dropping | One exception: a test that runs no measured line may be proposed under W-6 (D-6) | It guards nothing; the owner still decides |
| DEC-9: one row in the software matrix | Also a second inventory id and a row in the cross-cutting matrix (D-13); the UI matrix row is deferred with stage 2 (D-43) | The scope was widened after DEC-9 (Q-6): checks that are not code need their own rows |
| Impact: `bdd-gherkin` not listed | It gains one check box (D-8) | DEC-10's survey found the rule in Cucumber's anti-patterns, and Gherkin rules belong to that skill |

## Attack record

A fresh reader attacked the PLAN on 2026-11-14 with small experiments (coverage 7.17, pytest-cov
7.1, pytest 9.2, xdist). Confirmed as planned: the `|run` suffix, the bit order, parametrised ids,
xdist with `--cov-context=test`. Folded in:

| # | Finding | Where it went |
|---|---|---|
| A-1 | With branch coverage `line_bits` is empty | D-3 reads `arc`; D-15 |
| A-2 | Coverage stores no context for a test that runs no line | D-3 `no_lines` from the phases file; W-6 |
| A-3 | "Class 1 loses nothing" is false: a shared mock gave a false pass; async scope; the trial's fixtures hold a store tests write to | D-6 class 1 and its check; RISK-6; error matrix |
| A-4 | A `make` target takes no flags and carries its own coverage flags | D-2 `PYTEST_ADDOPTS`, `--no-cov` |
| A-5 | Drops that remove the only guard: the real-adapter test; required parametrised cases; two tests containing each other; a lax sample | W-3, W-5, the survivor rule, the sample rule |
| A-6 | Conflicts with EPIC B: the "Checked by" grammar, the order, the brief's task number, properties all kept, a rejected finding, who deletes and when | D-8, D-12 |
| A-7 | The matrix row would fail A's test; the stage 3 row had no id | D-13 |
| A-8 | `scaffold.sh` renders a fixed list; the scaffold has no xdist | D-10, D-15 |
| A-9 | Rules restating rules 6 and 14; a step-definition rule in a skill that writes none; sources in two places | D-8 amends 6 and 14, drops that Gherkin rule, one Sources list; D-4 cites numbers |
| A-10 | Undeclared deviations: coverage floor, lanes as moments, scheduled runs, DEC-10, a reason per deleted test, integration tests in the trial | D-7, D-13, D-10, D-6, D-12, D-14 |
| A-11 | Tasks that could not fail | tasks.md |

## Gate record

First run, independent scorer, 2026-11-14: 8.6, fail. Its gaps and where they were closed: the
contract of `changed.py` (D-10); the order of task 1.4 (tasks.md); the tool of D-6's check (D-3,
T-6); D-15 as a table and D-16 for registration and triggers; the Gherkin text (D-12); the matrix
cells (D-13); the undeclared deviations (the section above, and a `test-strategy` spec delta);
stale status lines; the ledger cell, the `SKILL.md` sentence, the checklist section and the
workers' files (D-12, D-8, D-3); the `omit` setting, which coverage's data file does not hold (W-6).

Second run, another independent scorer, the same day: 8.6, fail, all thirteen checklist items
passing. Its gaps and where they were closed: registration moved before the tasks whose lint needs
it (Roadmap); the survivor defined for every waste row (D-6); test ids per task (tasks.md); T-15
for the matrix cells and the rule count; the Gherkin task wording; three more rows and the
target's behaviour in the `changed.py` contract (D-10); the place of the Gherkin check box (D-8);
the spec delta's wording on properties; two more rows under Deviations; T-10 and the sources of
the UI rules (D-9).

Third run, a third independent scorer: 8.8, fail, all thirteen items passing. Closed: the
`changed.py` table against the scaffold's real folders, and its fallback output (D-10); the W-6
exception in the spec delta and under Deviations; the reach of T-15 in tasks 1.7 and 1.10; T-10's
pattern; run B under a coverage floor (D-2); which container `contained` prints (D-3); a project
without a `slow` marker (Error matrix); the second inventory id in task 3.2; D-13 as a table.

Fourth run, a fourth independent scorer: 9.05, PASS, all thirteen items passing, "with no
margin". Its nine gaps were folded in afterwards and not scored again: the skill's description
and the links from `SKILL.md` in stages 2 and 3 (D-1); the survivor column (D-7); the count check
of task 1.11; what a repository without specs is limited to (D-5); how a probe is asked (D-16);
`medium` defined (D-5); one more row under Deviations; the shared file of tasks 1.6 and 1.9; three
wording mismatches.

Revised after the gate, not gated again (2026-11-14): D-35 and D-36, under Delivery decisions,
were added by owner decision after the fourth run. No clarity-gate run followed: the owner wants
at most two gate runs on any re-gate
([`cross-check-test-epics.md`](../archive/2026-11-16-delivery-retrospective/inputs/cross-check-test-epics.md),
decisions 4, 5 and 7).

Revised after the gate, not gated again (2026-11-15): D-37 to D-42, under Delivery decisions,
were added after the owner settled how the open EPICs fit the three refactoring EPICs
([`reassessment-2026-11-15.md`](../archive/2026-11-16-delivery-process-and-tools/inputs/reassessment-2026-11-15.md),
S-2, S-6, S-8, S-9 and the order). No clarity-gate run followed, by S-10 of that record.

Revised after the gate, not gated again (2026-11-16): D-47 to D-52, under Delivery decisions,
check every open skill-editing task against the lean skills now on `develop`
([`lean-skills` archive](../archive/2026-11-16-lean-skills/)). No clarity-gate run followed (S-10).

## Delivery decisions

Recorded 2026-11-14, after the five changes of the test strategy work were read against each
other (A delivered; B, C, D and E planned in separate sessions). These override the decisions
above where they differ.

- **D-17 Order of the five.** B stage 1 → B stage 2 → C and E stage 1 in either order → B
  stage 3; D at any time after A; E stages 2 and 3 after E stage 1. E stage 1 may also land
  before B: D-8 and D-12 give the rule for each order, and B's tasks 1.12 and 2.4 now carry the
  matching lines. *Revised 2026-11-15:* D-37 sets this EPIC's place against the three
  refactoring EPICs; the order among the test EPICs stands, except that stage 2 is deferred and
  stage 3 follows the retrospective tooling EPIC (D-43, D-44).
- **D-18 The tester's ledger row and brief (corrects D-12).** If B stage 2 has landed, the last
  cell of the tester's row is no longer "—": the row gains the words "Distilled in step 4", and
  the two report fields are added to B's brief. The property kept is one per invariant in the
  PLAN's `## Invariants` section where the PLAN has one (the template gains it in C stage 2),
  else one per row of its error matrix.
- **D-19 The checklist (adds to D-8).** The "Sources" list is a table under its own heading
  after "The report", so that neither B's "Checked by" lint nor T-11 reads its rows as rules.
  A sentence added to rule 6, 14 or 11 goes before B's `*Checked by:*` suffix where that exists,
  and rule 11 keeps its value.
- **D-20 W-8 (corrects D-4).** B commits the surviving mutants, not which test killed which, and
  its `mutants/` folder is not in git. W-8 is looked for only when a local mutmut run's per-test
  results are at hand; otherwise the report lists it under *Not measured*.
- **D-21 The scaffold's own gates (adds to D-10).** If B stage 1 has landed, the scaffold with
  the lane files passes `make check-quality` (Ruff on `tests/changed.py`, checkmake on the new
  targets); T-9 runs it when the target exists.
- **D-22 Adequacy of a check that is not code (adds to D-13).** D sets the `ADQ` row of
  `generic-writing.md` to `accepted`, and C fills or accepts the `ADQ` gaps of
  `documentation.md`, `devops.md` and `ui.md`. Stage 3 changes none of those statuses: each such
  row gains the words "assessed on request by `CHK-<m>`".
- **D-23 UI test rules (corrects D-9; deferred with stage 2, D-43).** One UI rule has an owner already: testing checklist
  rule 2 (front-end tests beside their layer, an accessibility check per page). It stays there;
  `ui-suites.md` cites it by number and holds only the six new rules. OQ-1 asks the owner about
  this split.
- **D-24 Ids.** B, C, D and E each take "the next free" `CHK-` id at their own delivery; no PLAN
  owns a number. `CHK-145` in D-13 is an example.

- **D-25 The whole programme, recorded 2026-11-14 after four audits** (the spec layer; A as
  delivered; a merge simulation; coherence against the owner's words). D-25 to D-34 come from
  them. The clarity gate was not run again on these entries.
- **D-26 `changed.py` takes the base as an argument (corrects D-10).** B's Ruff selection bans
  reading the environment outside the configuration module (its D-2, `TID251`), and `make lint`
  covers `tests/`. The script is run as `python -m tests.changed <base>`; the `test-changed`
  target passes `$(BASE)`, whose default `develop` is set in the Makefile.
- **D-27 T-9 stays pure Python (corrects D-21).** `make check-quality` needs poetry, Ruff and,
  after B stage 1, the `quality/` folder at a release tag, none of which CI has. T-9 checks that
  the scaffold has `tests/changed.py`, the `slow` marker and the three targets, each in
  `.PHONY`. Running `make check-quality` on the scaffold is a manual step of task 1.8, with
  `QUALITY_VERSION` set to the branch commit as B's task 1.15 does, and only if B stage 1 has
  landed.
- **D-28 Tests that would never run.** T-2 and T-7 need pytest-xdist, coverage and pytest-cov,
  which are in no requirements file. If B stage 1 has landed, task 1.2 adds the three to B's
  `requirements-quality.txt`; if not, they are run once by hand as task 1.2 says, and B's task
  1.4 keeps them (a line there says so).
- **D-29 Which rows D-22 touches.** `generic-writing.md` (D's row), `documentation.md`,
  `devops.md` and `ui.md` (C's rows), and only a row that is no longer `gap` when stage 3 lands.
  The words go at the end of the row's Check cell. D's task 3.1 and C's close steps keep them.
  In `ui.md`, E stage 2 (deferred, D-43) would add its own `ADQ` row beside the existing one and not edit it.
- **D-30 The gap nobody owns.** After B, C, D and E the software matrix still has one gap:
  `CLR`, "gap → none yet" (`skills/test-strategy/references/software.md`, line 46). No EPIC of
  the programme takes it. The programme's closing task (D-33) lists it for the owner.
- **D-31 Distilling is not the audit.** The No-go "no reduction without the owner's decision"
  is about the audit's proposals on an existing suite. Distilling a stage's adversarial tests is
  the lead's decision by DEC-3, which the owner approved (Q-3); the deleted tests are listed in
  the stage PR, which the owner merges. One home for the rule on properties: the tester's brief
  in `skills/epic-delivery/references/team-and-briefs.md`; B, C and E point to it.
- **D-32 Releases, rebases and names.** No PLAN assumes a version number. A release follows B
  stage 1 and C stages 1 and 3, because projects fetch `quality/` at a release tag; E needs none
  of its own. C, D and E stage 1 may be on branches at the same time: after each rebase the lead
  reruns `make bundles` and `make skill-inventory` and takes fresh `CHK-` ids. E's record of the
  first `make validate` is `evidence/validate-baseline.md`, because D uses `evidence/baseline.md`
  for its runs with and without the profile. In this design "lanes" are the developer's make
  targets and "tiers" are unit, feature, integration and end to end.
- **D-33 A closing check of the programme** *(proposed, the owner confirms at scenario
  sign-off; handed over to the last stage of `harden-checks-and-tests` on 2026-11-15, D-45)*. Each EPIC ends in its own demo and only E changes a real repository, so nothing
  shows the five together did what the owner asked. Proposal: whichever of B stage 3 and E
  stage 1 lands last runs task 3.7: adopt `make check-quality` in the trial repository and
  record its wall time and the test time before and after E's reductions; list every row of the
  nine matrix files that is still `gap`; walk one SMALL EPIC and one offer through the
  catalogue and count the steps that need the owner. The result goes to the owner as one page.
- **D-34 Follow-ups.** The fixture sentence added to checklist rule 6 (D-8) overlaps issue #210
  (DDD, TDD and fixture rules); task 1.6 comments there. The home of UI test rules (D-23, OQ-1)
  is issue #230.

Revised 2026-11-14 by owner decision, after the gate. The session measurements were compared with
this EPIC and the owner decided on the result
([`cross-check-test-epics.md`](../archive/2026-11-16-delivery-retrospective/inputs/cross-check-test-epics.md),
decisions 4, 5 and 7). The clarity gate was not run again on these entries.

- **D-35 The builder sorts and the lead confirms (corrects D-12; bears on D-31; proposal DEC-3
  as revised).** Reason: the lead's session is about half of all cost, and that cost grows with
  what the lead reads (findings F-2, F-3, R-3); sorting forty tests is reading work.
  - *Who does what.* The rule of D-12 (what is kept, what is deleted) is unchanged. After the
    lead has decided the findings, the builder of the stage's one fix pass
    (`delivery-process-and-tools` DEC-4; D-38) sorts the tester's tests by
    that rule, moves the kept ones into files named by feature, deletes the rest, and returns
    two lists: kept and deleted, each test with its reason. The lead reads the lists and
    confirms them before the gate run that checks the pass; a deletion it does not confirm is
    restored from the branch inside the same pass. The decision stays the lead's (D-31): it confirms a list and no
    longer reads forty tests.
  - *Refactoring opportunities.* While sorting, the builder also notes what it sees that could
    be refactored, in the tests or in the code they exercise (a repeated set-up, a helper
    written twice, a test that needs a seam the code lacks). It returns them as a third list,
    under *Recommendations* of its report. That is a report: the builder refactors nothing
    beyond moving the kept tests, and the stage's scope does not grow. The lead copies the list
    into the stage's pull request and may open an issue for an item.
  - *The texts of D-12 read:* the `SKILL.md` sentence, "In the fix pass a builder sorts the
    tester's tests into kept and deleted, and the lead confirms the lists before the gate run
    that checks the pass (`references/stage-loop.md`, step 4)."; the
    Examples row of `team-lead.feature`, does "has a builder sort them by the rule, confirms
    the kept and the deleted list, and lists each deleted test in the PR"; and the scenario:

    ```gherkin
    Scenario: A stage's adversarial tests are distilled
      Given the tester reported forty tests, each with what it attacks and whether it failed on its first run
      And three failed on their first run and the lead accepted their findings
      When the builder of the stage's one fix pass sorts the tests by the rule
      Then it keeps the three, any test that alone covers a scenario and one property per PLAN invariant, in files named by feature
      And it deletes the rest and returns the kept list, the deleted list and the refactoring opportunities it saw
      And the lead confirms the lists before the gate run that checks the pass
      And no second fix pass follows
      And the stage PR lists each deleted test with its reason
    ```
  - *The tester's result line* (owner decision 4) is defined once, in
    `delivery-process-and-tools` DEC-18 (moved there from `harden-checks-and-tests` D-29;
    D-39). This change defines no line. The two report
    fields of D-12 stay: they are per test, and the line's `failed-first` number is their count.
- **D-36 Where the cost numbers of D-11 come from (adds to D-11, step 4).** "Its cost (tokens
  and minutes)" is read from the session transcripts with the two scripts kept in
  [`scripts/`](../../../skills/session-retrospective/scripts/) of the `session-retrospective` skill:
  `session_digest.py` writes one row per subagent with its tokens and its duration, and
  `epic_report.py` groups them. The procedure cites the scripts by that path until they have a
  durable home (finding R-11); it then cites the new one (D-42 says who gives them that home). Tokens and minutes are recorded;
  an amount of money is not, since a cost per subagent is an estimate.

Revised 2026-11-15, after the gate. The owner settled how every open EPIC fits the three
refactoring EPICs: `lean-skills` (R1), `orchestrate-external-skills` (R2) and
`delivery-process-and-tools` (R3). The record is
[`reassessment-2026-11-15.md`](../archive/2026-11-16-delivery-process-and-tools/inputs/reassessment-2026-11-15.md);
its points are cited as S-n. The clarity gate was not run again on these entries (S-10).

- **D-37 Order against the refactoring EPICs (replaces D-17 for this EPIC's own place).** Stage 1
  is delivered in wave 3 of the reassessment, after R3 and stage 1 of R1 (the lean standard and
  its lint) have merged. *Revised 2026-11-15 (D-43, D-44):* stage 2 is deferred and stage 3
  follows the retrospective tooling EPIC, no earlier than wave 4. Among the test EPICs the order
  of D-17 stands: B stage 1, B stage 2, then C and E stage 1, then B stage 3; the rules of D-8,
  D-12 and D-18 for either order against B still apply. Two consequences:
  - R1's pilot on `cosmic-python` is in wave 2, so task 1.6 adds its rules to the checklist as
    the pilot left it, one line per rule.
  - B stage 3 is in wave 5 and lands after this EPIC's stage 3, so the closing check of D-33
    falls to B; task 3.7 stays as the pointer to it (handed over, D-45).
- **D-38 The sort is part of the stage's one fix pass (corrects D-12 and D-35; S-2, S-6).** R3
  owns the stage loop of `epic-delivery`, and its DEC-4 gives a stage one fix pass, checked by the
  stage's gate. The rule of D-12 as corrected by D-35 stays this EPIC's: the builder sorts the
  tester's tests, the lead confirms the lists. It happens inside that one pass, before the gate
  run that checks the pass; it is not a second pass and no gate run is added for it. The words
  "the fix round" and "the second run of the full gates" are replaced in D-12, D-35, the spec
  delta and the Gherkin scenario. What this EPIC still edits in `epic-delivery`, each checked
  against R3 DEC-3, DEC-4, DEC-5 and DEC-7:

  | Edit | Kept or dropped | Why it is not R3's |
  |---|---|---|
  | The sentence in `SKILL.md` step 4 and the detail in `stage-loop.md` step 4 | Kept, as an addition | R3 rewrites step 4 (the severity floor, the one pass). Task 1.9 adds the sentence of D-35 to R3's text and changes no other word of the step. This EPIC no longer rewrites step 4. |
  | The two report fields per test in the tester's brief | Kept | DEC-3 sets when a tester runs and DEC-18 the result line; neither names what a test attacks. The sort cannot work without the fields. |
  | "Distilled in step 4" in the tester's row of the check ledger | Kept | A pointer to this EPIC's rule. It is added to the row as R3 and B leave it, and changes no condition in it. |
  | The scenario in `epic-delivery.feature` and the Examples row in `team-lead.feature` | Kept, reworded | They prove this EPIC's rule. The lead confirms and has a builder sort, which agrees with DEC-7 (the lead does not build). |
  | The lead copies the *Recommendations* list into the stage's pull request (D-35) | Kept | Copying a list is not building (DEC-7), and the list is one the builder returns, so the lead reads nothing more. |
  | The spec delta `specs/epic-delivery` | Kept, reworded | It adds one requirement of its own and modifies none of the requirements R3 changes. |

  Nothing of this EPIC touches the tester condition (DEC-3), the review set at MEDIUM (DEC-5) or
  the stage boundary (DEC-1). Task 1.9 starts only when R3 has merged (D-37).
- **D-39 The result line is R3's (corrects D-35, last point; S-6).** The one definition of the
  line is `delivery-process-and-tools` DEC-18, moved there word for word from
  `harden-checks-and-tests` D-29. Every place in this PLAN that named B's D-29 as the definition
  now names DEC-18. This EPIC still defines no line.
- **D-40 The skill is born lean (corrects D-1; S-9).** `test-suite-care` holds at most 24 KB of
  prose (the `SKILL.md` body plus `references/`), with a body near 6 KB. Every pointer to a
  reference says when to open it and what it adds. No example code is copied in. Scripts and
  templates are outside the budget. The planned content, sorted by the lean rule:

  | Part | Sort | What happens to it | At most |
  |---|---|---|---|
  | `SKILL.md`: the five steps, the three classes, the survivor rule, the owner decides, Boundary | House rule | Stays, short. One worked example (the one under "Algorithm / approach"), with no code. Gotchas keep only what a model cannot guess: never share a mock, name the survivor, keep the test against the real adapter, flags through `PYTEST_ADDOPTS`, `--cov-context=test`. | 6 KB |
  | `phase_times.py`, `overlap.py` | Check (tool) | As planned. What a script does on bad input lives in the script, not in prose. | no context |
  | The report's sections and the decision record (was `references/report.md`) | Check (template) | Becomes `assets/report-template.md`. | no context |
  | `measuring.md` | House rule, part general knowledge | Keeps the two runs and what the spike found. Ordinary pytest and coverage usage is cut. | 2 KB |
  | `scenario-map.md` | House rule | Stays: the format, the levels, the confidence, the sample. | 3 KB |
  | `waste.md` | House rule, part general knowledge | Keeps the table of D-4 (the evidence required and the class). The description of each smell and its source are cut: the sources stand once, in the checklist's Sources table (D-8, D-19). | 3 KB |
  | `ui-suites.md` (stage 2) | *Deferred (D-43), not delivered.* | No budget is spent on it now. When the stage resumes, it is sized again against the lean standard then in force. | 0 |
  | `non-code-checks.md` (stage 3) | House rule | Stays: the seven steps and "no pass mark". | 2.5 KB |
  | The anti-patterns table and the error matrix of this design | Mixed | Not copied into the skill as tables. A row is a line in the file it applies to, a behaviour of a script, or left out. | 0 |

  An earlier reading put the skill at 24 to 30 KB
  ([touch map](../archive/2026-11-16-delivery-process-and-tools/inputs/touchmaps/touchmap-harden-suitecare.md)).
  The sizes above add to 16.5 KB, which leaves room for what the trials teach (D-14); that
  text enters within the budget too. To fit, the plan sheds: the 150-line target of the body;
  `report.md` as prose; the smell descriptions and sources in `waste.md`; any restated tool
  documentation in `measuring.md`; and the two design tables as copies.
  The sizes are counted with `wc -c` and given in each stage's pull request, and R1's budget
  check passes with no recorded exception. The rules this EPIC adds to other skills (D-8, D-10,
  D-12, D-13) are written into the lean text those skills have by then, one line per rule.
- **D-41 The orchestrator (adds to D-16).** R2 gives every Meaningfy skill a row in its
  orchestrator, so `test-suite-care` gets one, and the probes of this skill include a near-miss
  against the orchestrator: a prompt that asks which skill serves a goal ("which skill do I use
  to speed up our tests") expects the orchestrator, not `test-suite-care`. Whichever of R2 and
  stage 1 lands second adds the row and the probe. No task of this PLAN waits for R2.
- **D-42 The two scripts stay where they are (adds to D-36; S-8).** `session_digest.py` and
  `epic_report.py` stay in `openspec/changes/delivery-retrospective/inputs/scripts/` of the
  skillery repository until the retrospective tooling EPIC gives them a home. This PLAN assumes
  no skill and no other home for them, and moves and changes neither script. *Revised
  2026-11-15 (D-44):* stage 3 now waits for that EPIC to be delivered. `non-code-checks.md` may
  cite the scripts' present path until it lands (D-46); the EPIC that moves the scripts corrects
  that one line. *Revised 2026-11-16 (D-52):* that EPIC has landed; the scripts are in
  `skills/session-retrospective/scripts/`.

Revised 2026-11-15, after the gate, agreed by the owner on 2026-11-15 (the sections "Order",
"Candidate drops" and "Questions the revisions left open" of
[`reassessment-2026-11-15.md`](../archive/2026-11-16-delivery-process-and-tools/inputs/reassessment-2026-11-15.md)).
The clarity gate was not run again on these entries.

- **D-43 Stage 2 (UI suites) is deferred.** It is not delivered with this EPIC. It waits until a
  trial repository is named and the UI rules have an owner (issue #230). Tasks 2.1 to 2.6 keep
  their ids and have no checkboxes. Out of the deliverable scope: `references/ui-suites.md`, its
  3 KB cap (D-40), test T-13, the `ui.md` row of D-13, the UI trigger probe, the UI requirement of
  the `test-suite-care` spec delta, and the "UI matrix" wording of the `test-strategy` delta.
  D-9 and D-23 stay as the record to resume from; OQ-1 and OQ-2 wait with them. Stage 3 does not
  depend on stage 2.
- **D-44 Stage 3 follows the retrospective tooling EPIC (replaces D-37 and D-42 on stage 3).**
  Its cost numbers (D-36) need the scripts to have a home, so stage 3 is delivered after
  `openspec/changes/delivery-retrospective`, still to be shaped, is delivered: no earlier than
  wave 4. Stage 1 stays in wave 3.
- **D-45 The closing check is handed over (replaces D-33's "whichever lands last").** B stage 3
  lands last, so the check of task 3.7 belongs to the last stage of `harden-checks-and-tests`. This
  EPIC runs none; task 3.7 is marked handed over.
- **D-46 Answers.** OQ-4: when a stage has no finding above the floor, the sort is the whole fix
  pass. OQ-5: a deletion the lead does not confirm is restored by the builder in the same pass. The
  severity floor of `delivery-process-and-tools` DEC-4 applies to the tester's findings: a
  first-run-failing test whose finding is under the floor is deleted with the reason "under the
  floor". `non-code-checks.md` may cite the scripts' present path until the tooling EPIC lands.
  Everything else in the reassessment's "Candidate drops" table for this EPIC (the sources table
  and rules 17 to 21 of task 1.6) is kept.

Revised 2026-11-16, after the gate. EPIC `lean-skills` rewrote every skill to the lean standard
and was archived on 2026-11-16 ([archive](../archive/2026-11-16-lean-skills/); the standard is
"The lean standard" in `docs/development/creating-skills.md`). Each open task that edits a skill
was read against the files on `develop` (7d85edd) and their `prose_budget` sizes. The clarity
gate was not run again on these entries (S-10). Sizes are bytes; the budget is 24,576.

- **D-47 What holds unchanged.** Task 1.7: `CHK-144` is the last id, so `CHK-145` is still the
  next; both `CHK-2` rows and the `ADQ` rows of `software.md` and `cross-cutting.md` stand as D-13
  names them. `test-strategy` is listed `over_budget` in `skill-budget.yaml`, so its rows add no
  budget breach. Task 1.13 already writes within D-40. The `bdd-gherkin` box of task 1.6 goes into
  "Quality checks (before finishing)", which stands (body 4,157). The `pending` key of
  `skill-budget.yaml` is gone: the new skill meets the standard on arrival and is never listed.
- **D-48 The body's shape (corrects D-1; task 1.3).** The lean standard fixes the body's
  sections: `## Quick Start`, `## Workflow` (the five steps), `## Rules` (the three classes, the
  survivor rule, the owner decides), `## Before you hand over` if needed, `## Boundary & Related
  Skills`. There is no Gotchas section: the Gotchas of D-40 become a **Common mistakes** table
  under `## Rules` (Mistake | Why it fails | Do instead). The caps of D-40 stand: 16.5 KB planned,
  24 KB failing, body near 6 KB.
- **D-49 Lanes go into the templates (corrects D-10 and task 1.8; S-9).** `project-setup` is at
  24,497 bytes (body 8,315, references 16,182), 79 under the budget. `references/layout.md` was
  deleted, and `references/config-files.md` no longer holds a target list or a template table
  (the Makefile template is their source). So:
  - The contract of `changed.py` (D-10, D-26) is the module docstring of
    `assets/templates/tests/changed.py`; each target's text is its `##` help comment in
    `Makefile.tmpl`; the threshold is the `slow` marker's description in `pytest.ini`. These are
    material, outside the budget.
  - `references/testing-setup.md` gains no section. Its existing **Lanes** bullet names
    `make test-fast` and `make test-changed` and says slow tests still run in CI, with a cut in
    the same file if needed, so that `project-setup` stays within 24,576 bytes. `config-files.md`
    and `layout.md` are not edited.
  - If it cannot fit, the builder stops and the owner decides; no `over_budget` entry is added
    without the owner.
- **D-50 The checklist additions are sized (adds to D-8; task 1.6).** `cosmic-python` is at
  20,676 bytes; `testing-checklist.md` is 3,157. Rules 17 to 21, the sentences added to rules 6
  and 14 and the Sources table add at most 2.5 KB, one line per rule and one table row per source,
  so the skill stays under 24 KB.
- **D-51 `epic-delivery` takes a clause, not a sentence (corrects D-35's `SKILL.md` text; task
  1.9).** `epic-delivery` is `over_budget` (body 9,852, references 23,150), and its body is well
  past 6 KB. "The loop of a stage" is now one paragraph that lists the six steps. The `SKILL.md`
  edit is a clause in its **Decide and fix** item: "the pass's builder sorts the tester's tests
  and the lead confirms the lists". The detail goes into step 4 of `references/stage-loop.md`,
  beside the floor bullet, which already deletes a test under the floor: task 1.9 cites that
  bullet and does not restate it. The tester brief (`team-and-briefs.md`, "Adversarial tester"),
  the ledger row (last cell "—") and the scenario "Each check runs once in a stage" stand as D-12
  names them.
- **D-52 The scripts have their home (corrects D-42, D-44 and D-46; task 3.2).** The
  retrospective tooling EPIC was delivered and archived on 2026-11-16
  (`archive/2026-11-16-delivery-retrospective`). `session_digest.py` and `epic_report.py` are in
  `skills/session-retrospective/scripts/`, as D-36 already says. `non-code-checks.md` cites them
  there, and the condition of D-44 is met: stage 3 waits only for its wave. The 2.5 KB of D-40
  for the file stands.
- **D-53 A skill with no room (owner, 2026-11-16).** Standing rule, asked in one question round:
  a planned addition to a skill at or near 24 KB is paid for in the same pull request by an equal
  cut from that skill, or the prose moves to a tool or a template (S-9). Only when neither works
  does the builder ask the owner for an `over_budget` entry. It governs D-49 (`project-setup`)
  and D-50 (`cosmic-python`).
- **D-54 B stage 1's tool side has landed.** PR #246 merged it on 2026-11-15 (the Makefile
  template already has `check-quality` and `check-semgrep`), so the "if B stage 1 has landed"
  branches of D-21, D-27 and D-28 apply.

Recorded 2026-11-16 by the lead while delivering stage 1 (owner's standing rule: the delivery
decisions are taken, recorded here and shown for validation at the end).

- **D-55 Run B sets `COVERAGE_CORE=ctrace` (adds to D-2).** T-7's first real run failed: on Python
  3.14 coverage 7.17 defaults to the `sysmon` core, which records a line once, under the first test
  that runs it, so a later test silently loses lines and nothing looks contained. With `ctrace`
  the per-test lines are complete (checked on 3.13 and 3.14; `evidence/scripts.md`). The command
  in `measuring.md` sets it and says why; T-7 sets it.
- **D-56 The order against B, as found.** B's tasks 1.12 ("Checked by") and 2.4 (tester brief)
  have not landed, and both already carry the matching lines (D-17), so tasks 1.6 and 1.9 add no
  line to B's tasks. Rules 17 to 21 carry no `*Checked by:*` suffix; B's 1.12 adds it. This EPIC
  lands first, so it writes the properties rule into the tester's brief (D-31): one property per
  invariant of the PLAN's `## Invariants`, else per error-matrix row (D-18).
- **D-57 The orchestrator has not landed (D-41).** No orchestrator skill is on `develop`, so the
  orchestrator near-miss probe and the orchestrator's row are left to `orchestrate-external-skills`.
- **D-58 Where the lanes' words were paid for (D-49, D-53).** The **Lanes** bullet of
  `testing-setup.md` names `make test-fast` and `test-changed` and that CI still runs slow tests;
  it drops the parenthesised contents of `ci-quick` and `ci-full`, which their `##` help comments
  in the Makefile template state. `project-setup` is 24,537 bytes, no `skill-budget.yaml` entry.
  The `changed.py` exception is `FallbackError` (the scaffold's Ruff, N818); T-8's temporary
  repository has a `.gitignore` for `__pycache__`, as a scaffolded one does.
- **D-59 Small wording choices.** Rule 6 keeps its sentence and gains D-8's after it. The
  inventory owner cell names `SKILL.md (Workflow)`, the heading D-48 gives the five steps. The
  checklist ends with a one-line pointer to `test-suite-care` under the new section. The Gherkin
  check box reads "No step joins two actions with 'and'." as D-8 gives it.
- **D-60 The three test packages (D-28).** `coverage`, `pytest-cov` and `pytest-xdist` are pinned
  in `requirements-quality.txt` (read by `make install`); CI still installs only pyyaml and
  pytest, so T-2 and T-7 skip there and run locally.

## Open Questions

None blocks stage 1. To confirm with the owner at scenario sign-off (task 1.0):

- **OQ-1** *(deferred with stage 2, D-43)* The UI test rules live in `test-suite-care` until a UI
  skill exists (D-9).
- **OQ-2** *(deferred with stage 2, D-43)* Which repository with a Cypress or Playwright suite is
  the trial ground of stage 2.
- **OQ-3** The developer lanes change no CI run and no scheduled run is added; slow tests still
  run on every pull request (D-10, a deviation from DEC-6).
- **OQ-4** *(added 2026-11-15; answered 2026-11-15, D-46)* A stage whose findings all fall under
  the severity floor of R3 DEC-4 has nothing to fix, yet its tester's tests still need sorting.
  Answer: the sort is then the whole of the fix pass, and the gate run checks it.
- **OQ-5** *(added 2026-11-15; answered 2026-11-15, D-46)* A deletion the lead does not confirm is
  restored inside the same pass (D-35, D-38). Answer: the builder restores it, in the same pass,
  since the lead does not build (R3 DEC-7).

Task 1.0 now asks the owner OQ-3 only; OQ-1 and OQ-2 wait with stage 2, OQ-4 and OQ-5 are answered.
