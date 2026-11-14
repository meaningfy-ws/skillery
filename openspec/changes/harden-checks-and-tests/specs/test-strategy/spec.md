<!-- Written against EPIC A's delta (openspec/changes/test-strategy/specs/test-strategy/spec.md),
     which is not archived yet. Re-check against the live spec once A is archived (design D-12). -->

## ADDED Requirements

### Requirement: The software rows name the checks that harden-checks-and-tests adds
The inventory of `test-strategy` SHALL hold one `CHK-<n>` for each check this change adds: the
wider Ruff selection, the Meaningfy Semgrep rules, the ls-lint and checkmake checks, the weekly
mutation report and the import-contract check. The software family file SHALL cite each, and
every software row whose gap named this EPIC SHALL have status `exists`; a row SHALL point to the
"Checked by" column of the `cosmic-python` catalogue for the per-rule detail and SHALL NOT list
rules (harden-checks-and-tests DEC-2, DEC-14).

#### Scenario: Do the tests bite
- **WHEN** a contributor looks up `ADQ` in the software family file
- **THEN** a row with status `exists` names the weekly mutation report and its owner `project-setup`

#### Scenario: A gap left behind
- **WHEN** the software family file still has a `gap` row that names this EPIC after its last stage
- **THEN** `make validate` fails, naming the row

#### Scenario: Which rule does Semgrep check
- **WHEN** a contributor looks up the static rules in the software family file
- **THEN** the row points to the catalogue's "Checked by" column and holds no rule list
