## MODIFIED Requirements

### Requirement: Promotion checks the kind before a note leaves staging

The `vault-promote` skill SHALL move a note from `00 Inbox/proposed/` into a project's `artefacts/`
(in either project home that `vault-conventions` defines) or into `03 Resources/`, only after checking
that the note carries `kind`, every property and every section `vault-conventions` requires for that
kind. It SHALL name each missing field or section and move nothing when one is missing. It SHALL move
by the procedure in `vault-conventions` (Moving and deleting), and SHALL NOT set `memory` or remove
`private: true`.

#### Scenario: A note without a kind stays staged

- **WHEN** `vault-promote` is asked to move a proposed note that has no `kind`
- **THEN** nothing moves, and the missing field is named

#### Scenario: A complete note is promoted

- **WHEN** a proposed `assessment` note carries every required property
- **THEN** it moves to the destination the owner confirms, and every wikilink to it still resolves

#### Scenario: A work shape lacks a required section

- **WHEN** a proposed `work-shape` note has no Risks section
- **THEN** nothing moves, and the missing section is named

### Requirement: Tidying waits for an explicit yes

The `vault-tidy` skill SHALL first present a plan listing every move, merge, rename and delete, and
every wikilink the plan affects, and SHALL apply the plan only after the owner's explicit yes. It SHALL
perform moves, renames and deletes by the procedure in `vault-conventions` (Moving and deleting). A
merge SHALL keep all content of the merged notes in the surviving note. The plan SHALL flag every move
out of `01 Projects/` or `03 Resources/`, because such a note leaves the company memory at the next
ingestion run. The plan SHALL propose moving a non-standing note at a project root into that project's
`artefacts/`, and a personal project found in `01 Projects/` into `07 Perso/`.

#### Scenario: The owner declines the plan

- **WHEN** the owner runs `vault-tidy` and declines its plan
- **THEN** no note is moved, merged or renamed

#### Scenario: A move leaves the shared scope

- **WHEN** the plan moves a note from `03 Resources/` to `06 Archive/`
- **THEN** the plan says, before the yes, that the note leaves the company memory at the next run

#### Scenario: A loose artefact at a project root

- **WHEN** a project root holds a memo beside its standing files
- **THEN** the plan proposes moving the memo into that project's `artefacts/`
