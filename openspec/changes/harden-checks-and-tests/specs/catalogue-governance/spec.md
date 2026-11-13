## MODIFIED Requirements

### Requirement: Only the agreed top-level folders exist
The repository's top level SHALL hold only the folders `skills/`, `agents/`, `mods/`, `quality/`,
`use-cases/`, `openspec/`, `docs/`, `tools/`, `tests/`, `.github/` and `.claude-plugin/`, besides
root files, hidden tool folders and the generated, committed `bundles/`. Validation SHALL fail
otherwise (harden-checks-and-tests DEC-4).

#### Scenario: A new top-level folder appears
- **WHEN** a change adds a top-level folder outside that list
- **THEN** `make validate` fails, naming the folder and the allowed list

#### Scenario: The mods folder
- **WHEN** the repository holds `mods/navigator/`
- **THEN** the top-level folder check passes

#### Scenario: The quality folder
- **WHEN** the repository holds `quality/semgrep/`
- **THEN** the top-level folder check passes

## ADDED Requirements

### Requirement: A check is an executable rule and carries no rule text
The catalogue SHALL have a sixth artifact type, **Check**, home `quality/`: an executable rule file
or a tool configuration that projects fetch and run. A check SHALL carry no rule text of its own:
what it enforces and why SHALL stay with the skill that owns the rule, and the check SHALL name
that owner entry by id. `docs/development/governance.md` and the `AGENTS.md` type table SHALL list
the type and its rule (harden-checks-and-tests DEC-4).

#### Scenario: A Semgrep rule that explains its own standard
- **WHEN** a review finds a rule file under `quality/` whose message restates a catalogue entry's text instead of citing its id
- **THEN** it is a finding, and the message is cut to the entry id and a one-line pointer

#### Scenario: A file that is not a check
- **WHEN** a change adds a how-to page under `quality/` other than a `README.md`
- **THEN** `make validate` fails, naming the file
