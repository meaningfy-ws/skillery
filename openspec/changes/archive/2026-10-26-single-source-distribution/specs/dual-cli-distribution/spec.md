## ADDED Requirements

### Requirement: One neutral bundle manifest
The repository SHALL define every bundle once, in the root `bundles.yaml`, as an ordered list of bundles each carrying exactly `name`, `description`, `skills` (names of `skills/` directories) and `agents` (stems of `agents/*.md` files), plus top-level `name`, `owner` and `description`; no other file SHALL define bundle membership. Every CLI's bundle list SHALL be rendered from or read from `bundles.yaml`, and an unknown or missing key SHALL fail validation.

#### Scenario: A bundle is declared once
- **WHEN** a contributor adds, moves or removes a skill or agent from a bundle
- **THEN** the only hand-edited file is `bundles.yaml`, and `make bundles` renders every derived bundle file

#### Scenario: A malformed manifest is rejected
- **WHEN** `bundles.yaml` carries an unknown key, lacks a bundle `description`, or repeats a bundle name
- **THEN** `make validate` fails and names the key or bundle

### Requirement: Skills and agents are installed from their single source
Skills SHALL be installed on both CLIs from `skills/` and agents from `agents/`; the repository SHALL NOT contain a committed per-CLI copy of any skill or agent file. Claude Code bundles SHALL reach their skills and agents through relative symlinks under `bundles/<bundle>/`, and the opencode installer SHALL copy skills from `skills/` and render agents at install time from the agent bodies in `agents/` and the parsed frontmatter in the generated `tools/opencode-catalogue.json`.

#### Scenario: No committed copy exists
- **WHEN** the repository is inspected
- **THEN** no `.opencode/` tree is tracked, every entry under `bundles/` is a symlink into `skills/` or `agents/` (never a regular file or directory copy), and `tools/opencode-catalogue.json` holds no skill or agent body

#### Scenario: A content edit needs no regeneration
- **WHEN** a contributor edits the body of an existing `skills/<name>/SKILL.md`
- **THEN** no generated file changes and `make validate` passes without running any generator

### Requirement: Installing a bundle loads exactly that bundle
Installing one bundle on either CLI SHALL yield exactly the skills and agents `bundles.yaml` lists for it, and no skill or agent of another bundle.

#### Scenario: Claude install is scoped
- **WHEN** a user on a fresh Claude Code configuration installs one bundle from the marketplace
- **THEN** `claude plugin details <bundle>` lists exactly the skills and agents `bundles.yaml` lists for that bundle

#### Scenario: Agents arrive only with their bundle
- **WHEN** a user installs every bundle on Claude Code
- **THEN** each agent is registered once, under the one bundle `bundles.yaml` assigns it to

#### Scenario: opencode install is scoped and includes agents
- **WHEN** a user runs the opencode installer for one bundle with `--global` or `--project`
- **THEN** exactly that bundle's skills land in the opencode skills directory and its rendered agents in the opencode agents directory, and nothing else is written besides the install manifest

#### Scenario: A custom skills target gets no agents
- **WHEN** a user runs the opencode installer with `--target <dir>`
- **THEN** the bundle's skills land in `<dir>`, no agent file is written anywhere, and the installer prints that agents need `--global` or `--project`

### Requirement: Skill and agent frontmatter is strict YAML
Every `skills/*/SKILL.md` and `agents/*.md` frontmatter block SHALL parse as a YAML mapping under a strict parser, because opencode and `npx skills` read `skills/` directly and skip a skill whose frontmatter does not parse.

#### Scenario: An unquoted colon is rejected
- **WHEN** a skill's `description` contains an unquoted `: `
- **THEN** `make validate` fails and names the file

#### Scenario: Every skill is loadable by a strict loader
- **WHEN** a strict YAML loader (e.g. `npx skills add <repo> --list`) reads `skills/`
- **THEN** no skill is skipped for a frontmatter parse error

## MODIFIED Requirements

### Requirement: Single version source
The repository SHALL contain a root `VERSION` file as the only source of version truth; the Claude `marketplace.json` `metadata.version`, the opencode catalogue `tools/opencode-catalogue.json` `version` and the npm `package.json` `version` SHALL all be derived from it, and the opencode installer SHALL report the catalogue version. (Enforcement of agreement is the version-sync gate owned by `dual-cli-generation`.)

#### Scenario: Versions derive from VERSION
- **WHEN** `VERSION` is set to a value
- **THEN** `marketplace.json` `metadata.version`, `tools/opencode-catalogue.json` `version`, `package.json` `version` and the opencode installer's reported catalogue version are all expected to equal that value

### Requirement: Single-home dual-CLI authoring rule
The repository SHALL document, in exactly one canonical location (the root `AGENTS.md`), the rule that
any added or updated skill, agent, command, or spec must work on both CLIs — covering bundle
declaration in `bundles.yaml` with `make bundles` after a membership change, CLI-agnostic bodies, and
per-CLI command registration. Other documents SHALL link this rule rather than restate it.
Installation documentation SHALL form a single hierarchy — `README.md` (front door) →
`docs/environment/setup.md` (canon) → the per-CLI runbooks — with `docs/environment/dual-cli/` as a
reference annex, not a competing install hub.

#### Scenario: Authoring rule has one home
- **WHEN** a contributor looks up how to keep a change working on both CLIs
- **THEN** the canonical rule is in `AGENTS.md`, and other docs (`CREATING_SKILLS.md`,
  `CONTRIBUTING.md`, `docs/environment/setup.md`, `README.md`) link to it without restating it

#### Scenario: No opencode regeneration step remains
- **WHEN** a contributor follows the authoring rule for a skill content change
- **THEN** no step asks them to regenerate or commit an opencode tree

#### Scenario: Install entry is the canon, the dual-CLI folder is the annex
- **WHEN** a reader sets out to install the catalogue on either CLI
- **THEN** the documented install path starts at `docs/environment/setup.md` (front door `README.md`),
  and `docs/environment/dual-cli/` is presented as the reference annex rather than a parallel install entry
