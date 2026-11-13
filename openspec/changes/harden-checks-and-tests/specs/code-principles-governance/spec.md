## ADDED Requirements

### Requirement: Every catalogued rule names its checker
The `cosmic-python` skill SHALL record how each of its rules is checked, for every entry of its
catalogue, every rule of its clean-code and SOLID sections and every item of its testing
checklist: one or more of Ruff (with the
rule code), import-linter, a Meaningfy Semgrep rule (with its id) or ls-lint, or "review only,
because" followed by the reason. A named Semgrep rule SHALL exist under `quality/`, and a rule
under `quality/` SHALL be named by at least one entry (harden-checks-and-tests DEC-2, DEC-3,
DEC-15).

#### Scenario: A catalogue entry without a checker
- **WHEN** a catalogue entry has no "Checked by" value
- **THEN** `make validate` fails, naming the entry

#### Scenario: A review-only entry without a reason
- **WHEN** the "Checked by" value of `AP-DUP-VALIDATION` is "review only" with nothing after it
- **THEN** `make validate` fails, naming the entry

#### Scenario: A checker that does not exist
- **WHEN** an entry names the Semgrep rule `mfy-dict-as-model` and no rule file under `quality/` defines that id
- **THEN** `make validate` fails, naming the entry and the rule id

#### Scenario: A rule nothing cites
- **WHEN** `quality/semgrep/rules/` holds a rule id that no catalogue entry or checklist item names
- **THEN** `make validate` fails, naming the rule id

### Requirement: SPARQL is not built from strings
The catalogue SHALL hold one anti-pattern entry for a SPARQL query built by formatting or
concatenating strings, checked by a Meaningfy Semgrep rule; it is the one entry this change adds
(harden-checks-and-tests DEC-3).

#### Scenario: A query built with an f-string
- **WHEN** a module holds `f"SELECT ?s WHERE {{ ?s rdfs:label '{name}' }}"`
- **THEN** the Semgrep rule reports it, citing the catalogue entry id

#### Scenario: A constant query
- **WHEN** a module holds a SPARQL query as a plain string constant with no interpolation
- **THEN** the rule stays silent

### Requirement: Import contracts are checked on every pull request
A project scaffolded by `project-setup` SHALL fail its architecture check when a top-level
subpackage of the root package is named by no import-linter contract, or when an `ignore_imports`
entry has no comment line directly above it that names a recorded decision (an id of the form
`DEC-<n>`, `D-<n>` or `ADR-<n>`) (harden-checks-and-tests DEC-11).

#### Scenario: A new component outside every contract
- **WHEN** a pull request adds the subpackage `billing` and no contract in `.importlinter` names it
- **THEN** `make check-architecture` fails, naming `billing`

#### Scenario: An ignored import without a decision
- **WHEN** a pull request adds `loader.services -> api.adapters` to `ignore_imports` with no decision comment above it
- **THEN** `make check-architecture` fails, naming the entry

#### Scenario: An ignored import with a decision
- **WHEN** the line above the entry is `; ADR-7 legacy bridge, removed with the loader rewrite`
- **THEN** the check passes
