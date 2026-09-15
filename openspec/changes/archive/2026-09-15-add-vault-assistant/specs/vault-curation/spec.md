## ADDED Requirements

### Requirement: Promotion checks the kind before a note leaves staging

The `vault-promote` skill SHALL move a note from `00 Inbox/proposed/` into `01 Projects/` or
`03 Resources/` only after checking that the note carries `kind` and every property
`vault-conventions` requires for that kind. It SHALL name each missing field and move nothing when
one is missing. It SHALL move through the external Obsidian CLI, and SHALL NOT set `memory` or remove
`private: true`.

#### Scenario: A note without a kind stays staged

- **WHEN** `vault-promote` is asked to move a proposed note that has no `kind`
- **THEN** nothing moves, and the missing field is named

#### Scenario: A complete note is promoted

- **WHEN** a proposed `assessment` note carries every required property
- **THEN** it moves to the destination the owner confirms, and every wikilink to it still resolves

### Requirement: Tidying waits for an explicit yes

The `vault-tidy` skill SHALL first present a plan listing every move, merge and rename, and every
wikilink the plan affects, and SHALL apply the plan only after the owner's explicit yes. It SHALL
perform moves and renames through the external Obsidian CLI. A merge SHALL keep all content of the
merged notes in the surviving note. The plan SHALL flag every move out of `01 Projects/` or
`03 Resources/`, because such a note leaves the company memory at the next ingestion run.

#### Scenario: The owner declines the plan

- **WHEN** the owner runs `vault-tidy` and declines its plan
- **THEN** no note is moved, merged or renamed

#### Scenario: A move leaves the shared scope

- **WHEN** the plan moves a note from `03 Resources/` to `06 Archive/`
- **THEN** the plan says, before the yes, that the note leaves the company memory at the next run
