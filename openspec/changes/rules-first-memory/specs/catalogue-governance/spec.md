## MODIFIED Requirements

### Requirement: Skills are organised into role bundles with single ownership

The catalogue SHALL group skills, agents and mods into **bundles** declared in `bundles.yaml`: the
role bundles (today `meaningfy-core`, `meaningfy-consulting`, `meaningfy-architecture`,
`meaningfy-building`), the workflow bundle (`vault-assistant`), which only people who keep a
personal vault install, and the Claude Code-only bundle `meaningfy-navigator`. Every skill SHALL
belong to **exactly one** bundle, every agent SHALL belong to **exactly one** bundle, and every mod
SHALL belong to **exactly one** bundle, several plain mods and at most one modules mod per bundle (DEC-3). The disk layout SHALL be flat
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
- **THEN** a mod listed in two bundles or a mod listed without a `mods/<mod>/` folder holding the files its kind requires (a plain mod: `hooks.json`; a modules mod: `hooks.json`, `types.d.ts`, `config.json` and `register.tsx`) is reported as a placement error

#### Scenario: A flat skill directory is discovered

- **WHEN** the validator enumerates `skills/`
- **THEN** each `skills/<skill>/SKILL.md` is discovered and keyed by its directory name

#### Scenario: A new bundle needs no validator change

- **WHEN** a change adds a bundle entry (e.g. `meaningfy-devops`) to `bundles.yaml`
- **THEN** the validator accepts the bundle name and checks its skills and agents like any other bundle's, with no edit to validator code

#### Scenario: A bundle lists several mods
- **WHEN** a bundle lists two plain mods
- **THEN** `make bundles` renders both hooks files in its `plugin.json`
- **AND** a bundle listing two modules mods fails `make bundles`
