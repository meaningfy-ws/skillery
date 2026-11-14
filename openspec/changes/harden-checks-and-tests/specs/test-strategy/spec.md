<!-- Re-checked on 2026-11-14 against A as delivered (skills/test-strategy/, live spec
     openspec/specs/test-strategy/spec.md); see design.md, Delivery decisions D-15 and D-20. -->

## ADDED Requirements

### Requirement: The software rows name the static, mutation and import-contract checks
The inventory of `test-strategy` SHALL hold one `CHK-<n>` for each of: the wider Ruff selection,
the Meaningfy Semgrep rules, the ls-lint and checkmake checks, the weekly mutation report, the
import-contract check and the tester's stateful and contract-driven methods. The software family
file SHALL cite each with status `exists`, and SHALL hold no row with status `gap → B`. A row
SHALL point to the "Checked by" column of the `cosmic-python` catalogue for the per-rule detail
and SHALL NOT list rules (harden-checks-and-tests DEC-2, DEC-14).

#### Scenario: Do the tests bite
- **WHEN** a contributor looks up `ADQ` in the software family file
- **THEN** a row with status `exists` names the weekly mutation report, with `cosmic-python` as technique owner and the `project-setup` workflow as its tool

#### Scenario: A gap left behind
- **WHEN** the software family file holds a row with status `gap → B`
- **THEN** `make validate` fails, naming the row

#### Scenario: Which rule does Semgrep check
- **WHEN** a contributor looks up the static rules in the software family file
- **THEN** the row points to the catalogue's "Checked by" column and holds no rule list
