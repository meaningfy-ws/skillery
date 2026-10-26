## ADDED Requirements

### Requirement: Single-home dual-CLI authoring rule
The repository SHALL document, in exactly one canonical location (the root `AGENTS.md`), the rule that
any added or updated skill, agent, command, or spec must work on both CLIs — covering opencode-tree
regeneration, CLI-agnostic bodies, and per-CLI command registration. Other documents SHALL link this
rule rather than restate it. Installation documentation SHALL form a single hierarchy — `README.md`
(front door) → `docs/environment-setup.md` (canon) → the per-CLI runbooks — with `docs/dual-cli/` as a
reference annex, not a competing install hub.

#### Scenario: Authoring rule has one home
- **WHEN** a contributor looks up how to keep a change working on both CLIs
- **THEN** the canonical rule is in `AGENTS.md`, and other docs (`CREATING_SKILLS.md`,
  `environment-setup.md`, `README.md`) link to it without restating it

#### Scenario: Install entry is the canon, the dual-CLI folder is the annex
- **WHEN** a reader sets out to install the catalogue on either CLI
- **THEN** the documented install path starts at `docs/environment-setup.md` (front door `README.md`),
  and `docs/dual-cli/` is presented as the reference annex rather than a parallel install entry
