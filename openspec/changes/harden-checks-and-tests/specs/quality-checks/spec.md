<!-- Shaping-level delta: the EPIC's headline requirements. The PLAN adds the rest when it is
     derived. -->

## ADDED Requirements

### Requirement: Every catalogued rule names its checker
Every entry of the `cosmic-python` catalogue and of its testing checklist SHALL record how it is
checked: Ruff, import-linter, a Meaningfy Semgrep rule, or "review only" with the reason. A
Meaningfy Semgrep rule SHALL ship with a fixture test that shows it flagging a bad case and passing
a good one (harden-checks-and-tests DEC-2, DEC-15).

#### Scenario: A catalogue entry without a checker
- **WHEN** a catalogue entry has no "Checked by" value
- **THEN** `make validate` fails, naming the entry

#### Scenario: A Semgrep rule without a fixture
- **WHEN** a rule file under `quality/` has no fixture test
- **THEN** the local `make validate` fails, naming the rule

### Requirement: Mutation results arrive weekly and never fail a build
A project scaffolded by `project-setup` SHALL run mutation testing weekly on `develop` and deliver
the surviving mutants as one bot pull request that adds `tests/mutmut-results/`; the run SHALL NOT
fail a build (harden-checks-and-tests DEC-10).

#### Scenario: Survivors are found
- **WHEN** the weekly run finds surviving mutants
- **THEN** one pull request adds or updates `tests/mutmut-results/`, and no build fails because of it
