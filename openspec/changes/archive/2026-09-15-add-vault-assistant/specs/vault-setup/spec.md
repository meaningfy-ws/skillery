## ADDED Requirements

### Requirement: vault-setup bootstraps a vault and its tooling

The `vault-setup` skill SHALL, for a named owner, create the vault layout `vault-conventions` defines,
its `vault-files/` sibling, one template per kind from the skill's assets, and the vault's agent
instructions (`AGENTS.md`) holding the owner profile (mail and calendar connectors, time zone), the
write rules, and one line pointing to `vault-conventions`. It SHALL NOT overwrite an existing file;
on an existing vault it SHALL report what is missing and add only that.

#### Scenario: A new vault is complete

- **WHEN** the owner runs `vault-setup` in an empty folder and answers its questions
- **THEN** the layout, templates and `AGENTS.md` with a complete owner profile exist

#### Scenario: An existing vault is only completed

- **WHEN** `vault-setup` runs, from `obsidian/<person>/`, for a vault that already has `AGENTS.md`
- **THEN** the file is left unchanged, and only missing folders or templates are added and listed

### Requirement: Permission settings are written per CLI

`vault-setup` SHALL write the vault's tool-permission settings for the CLI in use, following that CLI's
reference file: deny mail writes other than drafts, calendar and chat writes, the Drive connector, the
memory server's `remember` and `forget`, web tools, the shell except the `obsidian` command, and edits
to the agent instruction and permission files. For Claude Code it SHALL also write the instruction file
that imports `AGENTS.md`. Where a CLI cannot express a deny, the gap SHALL be stated to the owner.

#### Scenario: A denied tool is refused

- **WHEN** a session at the vault root calls the mail send tool
- **THEN** the CLI refuses the call

### Requirement: What cannot be automated is guided and checked

`vault-setup` SHALL guide the owner, step by step and per operating system (Windows or Linux),
through installing Obsidian 1.12.7 or later with its CLI enabled and link updating on, installing the
external plugin `obsidian@obsidian-skills` for the user, syncing the vault with Google Drive or
OneDrive, connecting the company memory's MCP server at user scope, authorising the mail and calendar
connectors, optionally opting in to the ingestion pipeline, and optionally scheduling `vault-daily`. It
SHALL end with a check that names every prerequisite still missing. It SHALL NOT write any host name,
account name, folder ID or personal path into skillery or into a template.

#### Scenario: The final check finds a gap

- **WHEN** Obsidian's CLI is not reachable at the end of setup
- **THEN** the check names it as missing, and names `vault-promote`, `vault-tidy` and
  `vault-project close` as unavailable until it is fixed
