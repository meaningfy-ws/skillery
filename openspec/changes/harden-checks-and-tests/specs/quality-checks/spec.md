<!-- Full delta, derived with the PLAN on 2026-11-14. The shaping-level requirement "Every catalogued
     rule names its checker" was split: its catalogue half moved to the code-principles-governance
     delta, its fixture half is the second requirement below. -->

## ADDED Requirements

### Requirement: The quality folder holds the shared checks
The repository SHALL hold its executable checks under `quality/`: the Meaningfy Semgrep rules with
their fixtures, the manifest of external Semgrep sources and the ls-lint and checkmake
configurations, with one `README.md` that lists them. `quality/` SHALL hold no other prose and no
script; the scripts a project's checks need SHALL be `project-setup` templates
(harden-checks-and-tests DEC-4, design D-1).

#### Scenario: Looking for a check
- **WHEN** a contributor opens `quality/README.md`
- **THEN** it lists every check with its tool, its file and the catalogue entry or skill that owns its rule

#### Scenario: A file type that is not a check
- **WHEN** a change adds `quality/semgrep/notes.md`
- **THEN** `make validate` fails, naming the file

#### Scenario: A script under quality
- **WHEN** a change adds `quality/import-contracts/check_contracts.py`, a Python file that is no rule's fixture
- **THEN** `make validate` fails, naming the file

### Requirement: Every Meaningfy Semgrep rule has a fixture test
A Meaningfy Semgrep rule SHALL have the id prefix `mfy-`, SHALL cite in its message the owner of
what it checks (a catalogue entry id, a testing checklist item, or for the suppression rule the
suppression convention of `project-setup`), and SHALL ship with a fixture file beside it that marks
at least one bad case (`ruleid:`) and one good case (`ok:`). The fixture check SHALL need no
Semgrep installation (harden-checks-and-tests DEC-15, design D-3, D-8).

#### Scenario: A Semgrep rule without a fixture
- **WHEN** a rule file under `quality/semgrep/` has no fixture file beside it
- **THEN** `make validate` fails, locally and in CI, naming the rule

#### Scenario: A fixture with no good case
- **WHEN** a rule's fixture has a `ruleid:` line and no `ok:` line
- **THEN** `make validate` fails, naming the fixture

#### Scenario: A rule that stops matching
- **WHEN** a rule is edited so that it no longer flags its `ruleid:` line, and Semgrep is installed
- **THEN** the local `make validate` fails, naming the rule

### Requirement: The quality folder's tool tests run locally and skip in CI
Tests of `quality/` that need Semgrep, ls-lint or checkmake SHALL run in the local `make validate`
when the tool is installed and SHALL skip with a message naming the missing tool otherwise;
skillery's CI SHALL install none of them, and skillery SHALL NOT run the checks on its own code
(harden-checks-and-tests DEC-12).

#### Scenario: CI without Semgrep
- **WHEN** the CI job runs the test suite without Semgrep installed
- **THEN** the Semgrep rule tests are reported as skipped with "semgrep not on PATH", and the job is green

### Requirement: External rule sources are recorded, pinned and never copied
Every external Semgrep source SHALL be one entry of `quality/semgrep/external.json` with its id,
repository, commit, rule paths, licence, the reason it was picked and its mode; a new entry SHALL
start in mode `report-only`. No external rule text SHALL be stored in the repository. Each entry
SHALL be approved by the owner in the pull request that adds it or changes its commit
(harden-checks-and-tests DEC-6, DEC-13).

#### Scenario: A source without a licence
- **WHEN** an entry of `external.json` has an empty `licence`
- **THEN** `make validate` fails, naming the entry

#### Scenario: A source pinned to a branch
- **WHEN** an entry's `commit` is `main`
- **THEN** `make validate` fails, naming the entry and asking for a 40-character commit id

#### Scenario: A new source gates at once
- **WHEN** a pull request adds an entry with mode `gate` that the base branch does not have
- **THEN** it is a review finding, and the entry is set to `report-only`

### Requirement: Projects fetch the checks at one pin
A project scaffolded by `project-setup` SHALL fetch `quality/` from the skillery release named by
one variable in its Makefile into a git-ignored folder, through one `make` target. The target SHALL
do nothing when the folder already holds that version, and SHALL leave no partial folder when the
download fails (harden-checks-and-tests DEC-5, design D-4).

#### Scenario: First fetch
- **WHEN** `make quality-fetch` runs in a fresh clone with the pin `v3.15.0`
- **THEN** `.quality/` holds the `quality/` tree of that release and `.quality/.version` reads `v3.15.0`

#### Scenario: Already fetched, no network
- **WHEN** `make quality-fetch` runs offline and `.quality/.version` equals the pin
- **THEN** it exits 0 without a download

#### Scenario: A pin that does not exist
- **WHEN** the pin names a release that has no tag
- **THEN** the target exits non-zero, names the pin, and `.quality/` is absent

### Requirement: Projects run the shared checks through make
A scaffolded project's `make check-quality` SHALL run, besides Ruff, mypy and import-linter, the
Meaningfy Semgrep rules, ls-lint and checkmake from the fetched folder, and its CI SHALL run the
same targets. A finding of a gating rule SHALL fail the target; a finding of a report-only rule
SHALL be printed and SHALL NOT fail it. A suppression comment without a reason SHALL fail the
target. The layout check SHALL fail on a banned module file name and on a missing required file
(harden-checks-and-tests DEC-2, DEC-8 as narrowed by design D-5, DEC-13).

#### Scenario: A gating rule fires
- **WHEN** the package builds a SPARQL query with an f-string
- **THEN** `make check-quality` fails, naming the rule and the catalogue entry

#### Scenario: A report-only rule fires
- **WHEN** only a report-only rule has findings
- **THEN** `make check-quality` prints them and exits 0

#### Scenario: A generic module name
- **WHEN** the package holds a file named `utils.py`
- **THEN** `make check-quality` fails in the ls-lint step, naming the file

#### Scenario: A required file is missing
- **WHEN** the project has no `ruff.toml`
- **THEN** `make check-layout` fails, naming `ruff.toml`

#### Scenario: A kebab-case folder
- **WHEN** the project holds `openspec/changes/add-billing-component/` and `tests/mutmut-results/`
- **THEN** `make check-layout` passes

#### Scenario: A required Makefile target is removed
- **WHEN** the project's Makefile loses its `test` target
- **THEN** `make check-quality` fails in the checkmake step, naming the target

#### Scenario: A suppression without a reason
- **WHEN** a line carries `# nosemgrep: mfy-dict-as-model` with no reason after it
- **THEN** `make check-quality` fails, naming the line

#### Scenario: A bare suppression
- **WHEN** a line carries `# nosemgrep` with no rule id and no reason
- **THEN** `make check-quality` fails, naming the line

### Requirement: The Ruff selection flags the hygiene cases
A scaffolded project's Ruff selection SHALL flag a `requests` call without a timeout, a naive
`datetime`, a bare `except` and a blind `except Exception`, and SHALL hold every Ruff code that a
catalogue entry names as its checker. `project-setup` SHALL state how an existing project adopts
the wider selection (harden-checks-and-tests DEC-2, DEC-3, issue #215).

#### Scenario: A request without a timeout
- **WHEN** a module calls `requests.get(url)` with no `timeout`
- **THEN** `make lint` fails with `S113`

#### Scenario: A naive datetime
- **WHEN** a module calls `datetime.datetime.now()` with no `tz`
- **THEN** `make lint` fails with `DTZ005`

#### Scenario: A code the catalogue names is not selected
- **WHEN** a catalogue entry names `Ruff PLR2004` and the template's selection does not include it
- **THEN** `make validate` fails in skillery, naming the entry and the code

### Requirement: Mutation results arrive weekly and never fail a build
A project scaffolded by `project-setup` SHALL run mutation testing weekly on `develop`, on the
package and not on the tests, within a stated time budget, and deliver the surviving mutants as one
bot pull request that adds or updates `tests/mutmut-results/`; the run SHALL NOT fail a build, and
a run that finds the same survivors as `develop` already holds SHALL open nothing
(harden-checks-and-tests DEC-10).

#### Scenario: Survivors are found
- **WHEN** the weekly run finds surviving mutants
- **THEN** one pull request adds or updates `tests/mutmut-results/`, and no build fails because of it

#### Scenario: The budget runs out
- **WHEN** the run reaches its time budget before every mutant is tested
- **THEN** the results are delivered with a line saying the run is incomplete, and the workflow ends green

#### Scenario: Nothing new
- **WHEN** `develop` has moved since last week and the run finds the same survivors that `develop` already holds
- **THEN** no pull request is opened or updated

#### Scenario: The same survivors as the open pull request
- **WHEN** last week's bot pull request is still open and this week's run finds the same survivors
- **THEN** the pull request's branch is not pushed again

#### Scenario: An open bot pull request exists
- **WHEN** last week's bot pull request is still open and this week's results differ
- **THEN** that pull request is updated, and no second one is opened
