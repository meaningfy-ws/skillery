# session-retrospective Specification

## Purpose
How a person reviews where agent-session time and cost went: the `session-retrospective` skill's
two scripts read the local Claude Code transcripts, take phase and stage from the lead's mark lines
and round outcomes from result lines, keep private text out of repositories, and warn when the
transcript format drifts. Created by the change `delivery-retrospective` (archived 2026-11-16).

## Requirements

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

### Requirement: A Langfuse usage report is reproducible
The skill `session-retrospective` SHALL hold `references/langfuse-report.md`, a procedure with the
eight queries of the window report: totals; usage by observation type; usage by model with p50 and
p90 context; usage per day with cost; top sessions; tool invocations; latency per observation
name; tags to skills loaded. Each query SHALL give its `queryMetrics` arguments and how to read the
result, and SHALL pin the fields it depends on. When a pinned field is missing from the project,
the report SHALL be marked "not comparable" and the owner told. The Langfuse project SHALL have a
price set for every model id of the window, so the per-day query shows a non-zero cost. The
procedure SHALL be read-only on the traces (D-11, DEC-6).

#### Scenario: The report is re-run on the same window
- **WHEN** a second person runs the eight queries over 2026-11-08 to 2026-11-22 from the reference
- **THEN** the totals, the per-model table and the top sessions equal the baseline page's numbers

#### Scenario: A pinned field disappears
- **WHEN** the usage-by-type query returns no `observation.type` field
- **THEN** the page is headed "not comparable", names the field, and RISK-1 is raised to the owner

#### Scenario: Cost shows after prices are set
- **WHEN** the four model ids of the window have a price in the Langfuse project
- **THEN** the per-day query returns a cost greater than 0 for each day with traffic

### Requirement: Usage reports form a comparable series
Every usage report SHALL be a dated page `docs/practice/ai-coding/usage-reports/<date>.md`, produced
by the reference procedure, with a `README.md` in the folder that names the series and how to add a
page. The first two pages SHALL be `2026-11-22.md` from this change's seed and `2026-11-09.md`
linking the `lean-delivery` evidence, not copying it. A page SHALL state its window and work mix
(sessions, repositories, appetites) and SHALL hold numbers only, never prompts, reports or
commands. For stages 2 to 5 of this change, a page taken within seven days of the stage's release,
over the traces tagged `skillery:<version>` with that release's version, SHALL carry a `§Stage n`
section comparing the stage's proxy (D-17) and the gates passed with the baseline; only the stage-6
page SHALL be taken after fourteen days and SHALL carry the four numbers of DEC-2 and the gates
passed (D-11, D-17, DEC-2, DEC-6, DEC-7).

#### Scenario: The series starts
- **WHEN** stage 1 is merged
- **THEN** `usage-reports/` holds `README.md`, `2026-11-09.md` and `2026-11-22.md`, and the 2026-11-09 page links the archived evidence file

#### Scenario: A stage is measured
- **WHEN** stage 2 has been released as version `v` and seven days or fewer have passed since that release
- **THEN** a new dated page carries `§Stage 2` with the median main-thread context over the traces tagged `skillery:v` and the gates passed, next to the baseline's 199 k

#### Scenario: The stage-6 page
- **WHEN** fourteen days have passed since the stage-5 release
- **THEN** a new dated page carries `§Stage 6` with the four numbers of DEC-2 and the gates passed, next to the baseline

#### Scenario: Gates passed drop
- **WHEN** a stage page shows fewer gates passed than the baseline
- **THEN** the stage's PR is reverted and the stage re-planned with one question round

#### Scenario: A page with a prompt in it
- **WHEN** a draft page quotes a prompt or a subagent report
- **THEN** the pre-PR review rejects it until only numbers remain

### Requirement: An inventory separates used from unused
`references/langfuse-report.md` SHALL hold a `§Inventory` procedure, not a tool: list the installed
plugins and skills (`claude plugin list`, the `SKILL.md` count) and the MCP servers of the user
config; compare them with the `skill:` and `subagent-skill:` tags of the window and the tool names
called; write `usage-reports/inventory-<host>-<date>.md` with three lists: used, unused, undecided.
The owner SHALL approve the disable list before anything is disabled, and disabling SHALL use the
CLI's plugin and MCP commands. The procedure SHALL run per machine (D-12, DEC-17).

#### Scenario: The inventory of one machine
- **WHEN** the procedure runs on a machine with about 370 skills installed and 36 seen in the window's tags
- **THEN** `inventory-<host>-2026-11.md` lists the 36 as used, the rest as unused or undecided, and nothing is disabled yet

#### Scenario: The owner approves
- **WHEN** the owner marks a subset of the unused list for disabling
- **THEN** only that subset is disabled, with the CLI's commands, and the page records what was disabled

#### Scenario: A second machine
- **WHEN** the procedure runs on a second host
- **THEN** it writes its own `inventory-<host>-<date>.md` and does not edit the first machine's page
