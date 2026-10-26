## MODIFIED Requirements

### Requirement: Permission settings are written per CLI

`vault-setup` SHALL write the vault's tool-permission settings for the CLI in use, following that CLI's
reference file: deny mail writes other than drafts, calendar and chat writes, the Drive connector, the
memory server's `remember` and `forget`, web tools, the shell except the `obsidian` command (allowed)
and `mv` and `rm` (ask), and edits to the agent instruction and permission files. For Claude Code it
SHALL also write the instruction file that imports `AGENTS.md`. Where a CLI cannot express a deny or an
ask, the gap SHALL be stated to the owner. The scheduled command lines in `references/scheduler.md`
SHALL deny `mv` and `rm` explicitly for the scheduled run.

#### Scenario: A denied tool is refused

- **WHEN** a session at the vault root calls the mail send tool
- **THEN** the CLI refuses the call

#### Scenario: A move asks in an interactive session

- **WHEN** an interactive session at the vault root runs `mv` on a note
- **THEN** the CLI asks the owner before running it

#### Scenario: A scheduled run cannot move or delete

- **WHEN** the scheduled `vault-daily` command, run exactly as `references/scheduler.md` writes it,
  tries `mv` or `rm`
- **THEN** the call is denied, whatever the permission mode of that run

## ADDED Requirements

### Requirement: The vault ships a human pointer page and answers from itself

`vault-setup` SHALL ship a root `README.md` asset holding a pointer table (the vault's `AGENTS.md`,
`vault-conventions`, the `vault-assistant` guide, `vault-setup`, `obsidian@obsidian-skills`), a copy of
the `vault-conventions` Layout table under the line "the skill wins", and blanks for machine-specific
facts. The final check SHALL compare the README's folder table with the Layout in `vault-conventions`
and name every difference. The shipped `AGENTS.md` SHALL state that questions about the owner's
projects, tasks and decisions are answered from the vault, not from the assistant's own memory or chat
history, and SHALL allow the folder changes the owner asks for in the session (`vault-conventions`,
Moving and deleting). The shipped `skill-change` template SHALL carry the fields of the repo's defect
issue form.

#### Scenario: The README drifts from the skill

- **WHEN** the final check runs on a vault whose README lists a folder that `vault-conventions` does
  not
- **THEN** the check names that folder as a difference

#### Scenario: A question about the owner's projects

- **WHEN** the owner asks the assistant where their projects live
- **THEN** the answer is read from the vault's project homes, not from chat memory
