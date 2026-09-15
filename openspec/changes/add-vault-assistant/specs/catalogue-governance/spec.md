## MODIFIED Requirements

### Requirement: Skills are organised into role bundles with single ownership

The catalogue SHALL group skills into **bundles**: four **role bundles** (`meaningfy-core`,
`meaningfy-consulting`, `meaningfy-architecture`, `meaningfy-building`) and one **workflow bundle**
(`vault-assistant`), which only people who keep a personal vault install. Every skill SHALL belong to
**exactly one** bundle. The disk layout SHALL be flat (`skills/<skill>/`); bundle grouping lives only in
`marketplace.json`.

#### Scenario: A skill registered in two bundles is rejected

- **WHEN** the validator runs over `.claude-plugin/marketplace.json`
- **THEN** any skill listed under more than one bundle, or under a bundle that is not its expected
  owner, is reported as a placement error

#### Scenario: A flat skill directory is discovered

- **WHEN** the validator enumerates `skills/`
- **THEN** each `skills/<skill>/SKILL.md` is discovered and keyed by its directory name

#### Scenario: The workflow bundle is a valid bundle name

- **WHEN** the validator reads the `vault-assistant` plugin entry
- **THEN** it accepts the bundle name and checks its skills like any role bundle's
