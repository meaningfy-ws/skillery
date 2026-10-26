## ADDED Requirements

### Requirement: Project homes are defined once

`vault-conventions` SHALL define the project homes once: `01 Projects/YYYY-MM-DD Name/` for company
work, and `07 Perso/YYYY-MM-DD Name/` for personal projects, where every note carries `private: true`
and `memory` is never set. It SHALL define one project-folder shape for both homes: the five standing
files at the folder root; every other note in an `artefacts/` subfolder, created when the first
artefact is filed; binaries in `vault-files/<project folder>/`, never in `artefacts/`. It SHALL define
one resolution rule: a project name is matched against both homes; one match is used; several matches
or a vague name are listed and the owner chooses; no match writes nothing and offers
`vault-project new`. Every other `vault-*` skill SHALL cite these rules and SHALL NOT name a project
home path on its own. A deployed agent's run notes SHALL go in `04 Daily/<agent>/`, never in the
project that builds the agent.

#### Scenario: A personal project is resolved

- **WHEN** a skill is asked to work on a project that exists only in `07 Perso/`
- **THEN** it resolves that project by the rule in `vault-conventions` and does not report "no project"

#### Scenario: An artefact is filed into a project

- **WHEN** a meeting note is filed into a project whose folder has no `artefacts/` yet
- **THEN** `artefacts/` is created and the note goes there, and the project root keeps only its
  standing files

#### Scenario: A home path is restated

- **WHEN** a `vault-*` skill other than `vault-conventions` is checked for the literal `01 Projects/`
  or `07 Perso/` in a rule that locates projects
- **THEN** none is found, and the skill cites `vault-conventions` instead

### Requirement: Moving and deleting at the owner's request follow one procedure

`vault-conventions` SHALL own the one procedure for moving, renaming and deleting notes and folders,
cited by every skill that moves or deletes. An agent SHALL act only when the owner asks in the session
and names the notes or identifies them unambiguously, or when an invoking skill's written plan was
approved. It SHALL never act on its own initiative. Before acting, it SHALL list every path with the
destination of each move, report the inbound wikilinks of every note it will delete, and say when a
`memory: common` note leaves a shared folder. A move SHALL use the Obsidian CLI when it answers;
otherwise it SHALL be a file move, made only after checking that no other note in the vault has the
same name. A delete SHALL move the note to the vault's `.trash/`. A permanent delete SHALL happen only
when the owner asks for it explicitly. `vault-files/_shared/` SHALL change only by a person. When the
session's tools cannot act, the agent SHALL say so in one line and list the exact paths.

#### Scenario: The owner asks to delete two named notes

- **WHEN** the owner asks in the session to delete two named notes, one of which has inbound links
- **THEN** the agent lists both paths and the linking notes, moves both notes to `.trash/`, and
  deletes nothing permanently

#### Scenario: A move without the Obsidian CLI

- **WHEN** the owner asks for a move while the Obsidian CLI does not answer, and the note's name is
  unique in the vault
- **THEN** the agent moves the file and the note's wikilinks still resolve by name

#### Scenario: A name collision blocks the fallback

- **WHEN** the Obsidian CLI does not answer and another note in the vault has the same name
- **THEN** the agent moves nothing and names the colliding note

#### Scenario: No owner request

- **WHEN** an agent finds a note it judges to be a duplicate, and the owner has not asked
- **THEN** it moves and deletes nothing, and proposes the change through `vault-tidy` or a staged note

### Requirement: Structured kinds declare their required sections

`references/kinds.md` SHALL list, for each kind with a fixed body, its required sections beside its
required properties, and the list SHALL include `impact-filter` (sections: Purpose, Importance, Best
result, Worst result, Success criteria; properties: `date`, `project`) and `work-shape` (sections:
Boundaries, Gherkin features, Elements, Risks; properties: `date`, `project`, `appetite`). The usual
folder of every kind filed into a project, other than the five standing files, SHALL be the
project's `artefacts/`.

#### Scenario: A work shape is written

- **WHEN** an agent writes a Shape Up work shape for a team project
- **THEN** the note carries `kind: work-shape`, the three required properties and the four required
  sections, and it sits in the project's `artefacts/`

### Requirement: Tables are checked before a note is saved

`vault-conventions` SHALL require that, before saving a note that contains a table, the writer checks
three things: a blank line precedes and follows every table; every row has the header's cell count;
and every literal `|` inside a cell, including in a wikilink alias, is escaped. The table syntax itself
stays with `obsidian@obsidian-skills`.

#### Scenario: A label sits directly above a table

- **WHEN** a note has a bold label on the line directly before a table's header row
- **THEN** the writer inserts a blank line between them before saving
