## ADDED Requirements

### Requirement: A skill holds the review scripts
The skill `session-retrospective` SHALL hold `session_digest.py` and `epic_report.py` in its
`scripts/` folder and SHALL say how to run a review over the local Claude Code transcripts and how
to read the result. The scripts SHALL NOT read Langfuse (proposal DEC-1, DEC-6).

#### Scenario: A person runs a review
- **WHEN** a person follows the skill to review the sessions of a period
- **THEN** the two scripts read the local transcripts and print a report by EPIC, phase and stage

### Requirement: Phase and stage come from the latest mark
The report SHALL take the phase and stage of each event from the latest mark line before it in the
session. Events with no earlier mark SHALL keep the skill-based guess, each such row SHALL be
labelled `guessed`, and the report SHALL print the share of cost that is guessed. A mark SHALL NOT
be applied to events before it, and its span SHALL end when the lead loads an archive or release
skill (proposal DEC-4, DEC-5). A subagent SHALL take the mark in force when it was spawned, and keep
its own guess when none was (design D-15).

#### Scenario: A subagent spans a new mark
- **WHEN** a subagent spawned under `stage=1` is still running when the lead writes `stage=2`
- **THEN** its cost stays under stage 1

#### Scenario: Archive after the last stage
- **WHEN** the lead loads the archive skill after `mark: change=x phase=deliver stage=3`
- **THEN** the events from there on are guessed, not filed under stage 3

#### Scenario: A session with marks
- **WHEN** every event of a session follows a mark line
- **THEN** the report shows its phase and stage from the marks and no `guessed` row

#### Scenario: A mark written late
- **WHEN** a session's first mark comes after some events
- **THEN** the events before it are guessed and labelled `guessed`, and the guessed share includes them

### Requirement: Round outcomes come from result lines, counted once
The report SHALL take the outcome of each round from its result line. When the worker's line with
`accepted=-` and the lead's line for the same round both appear, the report SHALL count the round
once (proposal DEC-5).

#### Scenario: Worker and lead both write the line
- **WHEN** a round has the worker's result line and the lead's result line with the count
- **THEN** the report counts one round, with the lead's count

#### Scenario: A lead quotes a worker's line
- **WHEN** the lead repeats a worker's line with `accepted=-` in its own text
- **THEN** the report adds no round, because a lead line counts only with a number

#### Scenario: A re-review after the fix pass
- **WHEN** a second reviewer line of the same stage, role and lens follows in the session
- **THEN** the report counts it as a second round

#### Scenario: A pull request body is edited
- **WHEN** the lead's line appears again, unchanged, in an edited pull request body
- **THEN** the report adds no round (design D-17, D-20 F1)

### Requirement: Private text stays out of repositories
The digest script SHALL write to `~/.cache/session-retrospective/<date>` by default and SHALL refuse
an output folder inside a git working tree or a `.git` folder, the default included, with no
override (design D-5, D-20 F4). Test fixtures SHALL be
synthetic. The evidence of a real run SHALL hold numbers only, never prompts, reports or commands
(proposal DEC-7).

#### Scenario: Output asked inside a repository
- **WHEN** a person gives an output folder inside a git working tree
- **THEN** the script stops with an error and writes nothing

### Requirement: Unknown record types are counted and warned about
The digest SHALL count every transcript record type it does not know and SHALL warn when that count
passes a threshold of 1% of the lines read (proposal DEC-8, design D-6). A record of the wrong shape
SHALL be counted as `(malformed)` and skipped, never stop the run (design D-20 F5).

#### Scenario: The transcript format changes
- **WHEN** the unknown records of a run pass the threshold
- **THEN** the digest prints a warning with their count and types

#### Scenario: A malformed record
- **WHEN** a record has the wrong shape or no timestamp
- **THEN** the digest counts it as `(malformed)`, skips it and finishes the run

### Requirement: The repository is the git root
The scripts SHALL take a session's repository from the git root of its working directory, and the
main repository for a worktree (proposal DEC-9).

#### Scenario: A session in a worktree
- **WHEN** a session ran in a worktree of a repository
- **THEN** the report files it under the main repository
