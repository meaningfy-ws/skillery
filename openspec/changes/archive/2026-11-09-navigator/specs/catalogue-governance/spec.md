## ADDED Requirements

### Requirement: A mod observes, displays and calls commands
The catalogue SHALL have a fifth artifact type, **Mod**, home `mods/<name>/`: a Claude Code hooks
module that observes session events, displays state and runs commands a person could type. A mod
SHALL carry no method: no rule text, threshold or phase list that a skill owns; it SHALL read such
facts from skill assets (DEC-2, DEC-6). `docs/development/governance.md` and the `AGENTS.md` type
table SHALL list the type and its rule.

#### Scenario: A threshold written into a mod
- **WHEN** a review finds a context-use percentage written as a literal in `mods/navigator/`
- **THEN** it is a finding, and the number moves to the `guardrails` data file the mod reads

## MODIFIED Requirements

### Requirement: Skills are organised into role bundles with single ownership

The catalogue SHALL group skills, agents and mods into **bundles** declared in `bundles.yaml`: the
role bundles (today `meaningfy-core`, `meaningfy-consulting`, `meaningfy-architecture`,
`meaningfy-building`), the workflow bundle (`vault-assistant`), which only people who keep a
personal vault install, and the Claude Code-only bundle `meaningfy-navigator`. Every skill SHALL
belong to **exactly one** bundle, every agent SHALL belong to **exactly one** bundle, and every mod
SHALL belong to **exactly one** bundle, at most one mod per bundle. The disk layout SHALL be flat
(`skills/<skill>/`, `agents/<agent>.md`, `mods/<mod>/`); bundle grouping lives only in
`bundles.yaml`, and the set of valid bundle names is whatever `bundles.yaml` declares — the
validator SHALL NOT pin a second list of names.

#### Scenario: A skill registered in two bundles is rejected

- **WHEN** the validator runs over `bundles.yaml`
- **THEN** any skill listed under more than one bundle is reported as a placement error

#### Scenario: An agent outside exactly one bundle is rejected

- **WHEN** the validator runs over `bundles.yaml` and `agents/`
- **THEN** an agent listed in no bundle, in two bundles, or listed without an `agents/<agent>.md` file is reported as a placement error

#### Scenario: A mod outside exactly one bundle is rejected

- **WHEN** the validator runs over `bundles.yaml` and `mods/`
- **THEN** a mod listed in two bundles, a bundle listing two mods, or a mod listed without a `mods/<mod>/` folder holding `hooks.json`, `types.d.ts`, `config.json` and `register.tsx` is reported as a placement error

#### Scenario: A flat skill directory is discovered

- **WHEN** the validator enumerates `skills/`
- **THEN** each `skills/<skill>/SKILL.md` is discovered and keyed by its directory name

#### Scenario: A new bundle needs no validator change

- **WHEN** a change adds a bundle entry (e.g. `meaningfy-devops`) to `bundles.yaml`
- **THEN** the validator accepts the bundle name and checks its skills and agents like any other bundle's, with no edit to validator code

### Requirement: Only the agreed top-level folders exist
The repository's top level SHALL hold only the folders `skills/`, `agents/`, `mods/`, `use-cases/`,
`openspec/`, `docs/`, `tools/`, `tests/`, `.github/` and `.claude-plugin/`, besides root files, hidden
tool folders and the generated, committed `bundles/`. Validation SHALL fail otherwise.

#### Scenario: A new top-level folder appears
- **WHEN** a change adds a top-level folder outside that list
- **THEN** `make validate` fails, naming the folder and the allowed list

#### Scenario: The mods folder
- **WHEN** the repository holds `mods/navigator/`
- **THEN** the top-level folder check passes
