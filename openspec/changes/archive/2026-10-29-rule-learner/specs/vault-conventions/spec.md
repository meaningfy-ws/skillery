## ADDED Requirements

### Requirement: Rules and playbooks have a home under 08 How to
The vault conventions SHALL list the kinds `rule` (folder `08 How to/Rules/`) and `playbook` (folder
`08 How to/Playbooks/`), with their required properties listed in vault-conventions like every other kind, and their meaning defined by the rulebook skill. Rule lifecycle stages use the existing `status` vocabulary (`idea`, `active`, `dropped`). Rule notes SHALL be
written only through the rulebook script. A rule candidate an agent drafts and the owner has not yet
approved SHALL be staged in `00 Inbox/proposed/` like any other unasked claim. Moving an approved candidate
into `08 How to/Rules/` SHALL be done by the rulebook script, following the vault's move procedure, not by vault-promote.

#### Scenario: Where a rule note goes
- **WHEN** an agent asks where an approved rule belongs in the vault
- **THEN** vault-conventions answers `08 How to/Rules/`, kind `rule`, written through the rulebook script

#### Scenario: A deferred candidate
- **WHEN** the owner defers a rule candidate at the end of a session
- **THEN** it is staged in `00 Inbox/proposed/` with `status: idea` and waits for the weekly review
