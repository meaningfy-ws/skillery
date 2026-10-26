## MODIFIED Requirements

### Requirement: Skills and agents are installed from their single source
Skills SHALL be installed on both CLIs from `skills/` and agents from `agents/`; the repository SHALL NOT contain a committed per-CLI copy of any skill or agent file. Claude Code bundles SHALL reach their skills and agents through relative symlinks under `bundles/<bundle>/`, which `make bundles` generates and the repository SHALL NOT commit on `develop`; the generated tree SHALL be published for installs on the `dist` branch. The opencode installer SHALL copy skills from `skills/` and render agents at install time from the agent bodies in `agents/` and the parsed frontmatter in the generated `tools/opencode-catalogue.json`.

#### Scenario: No committed copy exists
- **WHEN** the `develop` branch is inspected
- **THEN** no `.opencode/` tree and no `bundles/` tree is tracked, and `tools/opencode-catalogue.json` holds no skill or agent body

#### Scenario: The published tree holds only links
- **WHEN** the `dist` branch is inspected
- **THEN** every entry under `bundles/` is a symlink into `skills/` or `agents/`, never a regular file or directory copy

#### Scenario: A content edit needs no regeneration
- **WHEN** a contributor edits the body of an existing `skills/<name>/SKILL.md`
- **THEN** no generated file changes and `make validate` passes without running any generator

### Requirement: External-dependency and baseline-pack compatibility matrix
The change SHALL provide a committed compatibility matrix recording, for each external plugin, skill, and MCP server the catalogue references, its opencode support status (native, `.claude/`-compatible, unsupported or unverified) and a per-CLI install path or a gap entry. The dependency tables of the matrix SHALL be rendered from the external dependency register `dependencies.yaml`. The matrix SHALL also identify each CLI's baseline pack (e.g. Claude Code's default/marketplace skills; an opencode community pack such as opencode-power-pack) and, where the catalogue or workflow assumes a baseline capability, name the equivalent per CLI or record a gap. The external dependencies and baseline packs themselves SHALL NOT be generated.

#### Scenario: Every external reference is classified
- **WHEN** the catalogue references an external plugin, skill, or MCP server
- **THEN** the register has its entry and the rendered matrix records its opencode support status and a per-CLI install path or gap

#### Scenario: Baseline packs are identified per CLI
- **WHEN** the catalogue or its workflow assumes a capability provided by a CLI's baseline pack
- **THEN** the matrix names the equivalent baseline capability on each CLI or records a gap
