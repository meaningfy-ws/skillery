## MODIFIED Requirements

### Requirement: External dependencies are recorded once, in a structured register

Every external plugin, skill, CLI tool, MCP server, service or framework the catalogue relies on SHALL
have one entry in the root `dependencies.yaml` with its `name`, `kind`, `source`, `pin` (or the reason
it is unpinned), `provenance`, `used_by`, and per-CLI `status` and `install`; a source of external
skills SHALL instead have one entry per fork and bundle (design D-2). Validation SHALL fail for an
unknown key, an unknown `kind` or `status`, or a missing `pin`.

#### Scenario: A dependency without a pin

- **WHEN** an entry has no `pin` and no `unpinned: <reason>`
- **THEN** validation fails, naming the dependency

## ADDED Requirements

### Requirement: A skill source is registered per fork and bundle
A source of external skills SHALL be registered as one entry per fork and bundle, named
`<fork>/<bundle>`, with a `bundle` key (design D-2, proposal DEC-13). When an entry has a `bundle`
key, validation SHALL fail unless the key names a bundle of `bundles.yaml`, the entry's `kind` is
`skill`, and its `skills` list is a non-empty inline list (D-8). The existing checks SHALL still
apply: a skill name is listed once in the whole register and never shadows a `skills/` folder.

#### Scenario: A bundle that does not exist
- **WHEN** an entry has `bundle: meaningfy-unknown`
- **THEN** validation fails and names the entry and the bundle

#### Scenario: A bundle on a non-skill entry
- **WHEN** an entry of `kind: cli-tool` has a `bundle` key
- **THEN** validation fails and names the entry

#### Scenario: An empty skills list
- **WHEN** an entry with a `bundle` key has no skill in its `skills` list
- **THEN** validation fails and names the entry

### Requirement: An external skill is registered only after it is read in full
An external skill SHALL be registered only after a reader has read its `SKILL.md` and every other
file of its folder in the fork, and a reading record for it exists. The record SHALL list every file
of the folder, paraphrase rather than copy, and list each conflict with a Meaningfy rule (D-5).
Every conflict not already named in the proposal SHALL be taken to the owner before the skill is
registered; a skill the owner drops SHALL NOT be registered (D-6).

#### Scenario: A file of the folder was skipped
- **WHEN** a reading record's file table does not match the files of the skill's folder in the fork
- **THEN** the skill is not registered until the missing files are read and the record is complete

#### Scenario: A new conflict
- **WHEN** a reading record marks a conflict as not named in the proposal
- **THEN** the conflict goes to the owner with a recommendation, and the lead does not decide it alone

### Requirement: The pin is the commit that was read
For a skill source, `pin` SHALL be the full 40-character fork commit its skills were read at, and
the install command SHALL carry that commit, so that what installs is what was read. Only if the
installer rejects the full commit SHALL `pin` state that the entry is unpinned and why (D-4). The pin
SHALL move only after every changed file of the registered skills is read again and its record
updated.

#### Scenario: The installer accepts a commit
- **WHEN** the install check shows the installer accepts `owner/repo#<commit>`
- **THEN** the entry's `pin` and both install commands carry the commit that was read

#### Scenario: The installer accepts no ref
- **WHEN** the install check shows the installer ignores or rejects a ref
- **THEN** the entry's `pin` reads `unpinned:` with the reason

### Requirement: The per-bundle install table is generated from the register
A table of external skills per bundle, with their install commands for Claude Code and opencode,
SHALL be generated from the register entries that have a `bundle` key, between generated-section
markers, in both `setup-claude.md` and `setup-opencode.md`. Drift between the register and either
document SHALL fail validation. Nothing SHALL install these skills automatically (D-7).

#### Scenario: A register edit without regeneration
- **WHEN** a contributor adds a skill to a `bundle` entry and does not run `make skill-inventory`
- **THEN** validation fails and names the regeneration command

#### Scenario: A reader sets up a bundle
- **WHEN** a reader follows the setup document of either CLI for a bundle with external skills
- **THEN** the document lists those skills and the command that installs them
