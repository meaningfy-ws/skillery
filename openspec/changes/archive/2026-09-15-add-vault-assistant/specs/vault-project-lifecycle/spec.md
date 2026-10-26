## ADDED Requirements

### Requirement: A project starts only with a falsifiable done

The `vault-project` skill SHALL, on `new`, confirm the project name, ask the five charter questions
(what it is in one sentence, why it matters, what done looks like, which objective it advances, what
would make the owner stop), and create `01 Projects/YYYY-MM-DD Name/` with the five standing files
`vault-conventions` defines. It SHALL NOT create the folder when the owner cannot state a done that a
third person could check; it SHALL offer a note in `02 Ideas/` instead. It SHALL NOT create any other
folder, and SHALL create `vault-files/<project folder>/` only when the first binary arrives.

#### Scenario: A new project is complete

- **WHEN** the owner answers all five charter questions and confirms the name
- **THEN** the project folder holds the five standing files and `index.md` answers all five questions

#### Scenario: No project without a falsifiable done

- **WHEN** the owner cannot say what done looks like
- **THEN** no project folder exists afterwards, and a note in `02 Ideas/` is offered

### Requirement: Closing a project archives it only after a yes

The `vault-project` skill SHALL, on `close`, append a final dated entry to `sessions.md`, set `status`
to `done` or `dropped` as the owner states, and propose moving the project folder to `06 Archive/`.
It SHALL move the folder only after the owner's explicit yes, and only through the external Obsidian
CLI so that every wikilink follows the move. It SHALL warn, before asking, that archiving takes the
project's notes out of the company memory at the next ingestion run.

#### Scenario: The owner declines the archive move

- **WHEN** the owner closes a project and answers no to the move
- **THEN** `status` and the final entry are written, and the folder stays in `01 Projects/`

### Requirement: Resuming a project reads one project only

The `vault-resume` skill SHALL take a project name and read that project's `index.md`, the most recent
entries of `sessions.md`, `decisions.md` and `tasks.md`, then make at most one memory recall whose
query holds only the project name. It SHALL read no other project, and SHALL summarise status, open
tasks, recent decisions and the next step recorded in the last session.

#### Scenario: Context for one project

- **WHEN** the owner runs `vault-resume` for a project
- **THEN** the summary covers only that project's status, open tasks and recent decisions

#### Scenario: An ambiguous project name

- **WHEN** the name matches more than one project folder
- **THEN** the skill lists the matches with their status and last session date, asks, and reads
  nothing else until the owner chooses

### Requirement: Capture files signal and never invents it

The `vault-capture` skill SHALL take a project name and a source (raw notes the owner pastes, or the
current session) and file their signal into that project's files: one dated entry in `sessions.md`
(extending today's entry when one exists), `tasks.md`, `decisions.md` only for points actually
decided, `index.md` for status and people, and `resources.md` for new files. It SHALL keep the
owner's hedges (an undecided point is filed as undecided), turn relative dates into concrete dates,
and ask for a summary of anything done outside the session. It SHALL NOT invent substance, create a
project as a side effect, restructure a file, or call `remember`. For the notes of a single meeting it
SHALL also write a `kind: meeting` note in the project folder and link it from the session entry.

#### Scenario: An open decision stays open

- **WHEN** the notes say a decision is still open
- **THEN** `decisions.md` gains no row, and `sessions.md` records the point as open

#### Scenario: A session decided one option and rejected another

- **WHEN** a session decided X and rejected Y
- **THEN** `decisions.md` records both with their rationale, and `sessions.md` has one new dated entry

#### Scenario: No project matches

- **WHEN** the named project does not exist
- **THEN** nothing is written, and `vault-project new` is offered
