## ADDED Requirements

### Requirement: The instruction template carries the habits and a size budget
The agentic `AGENTS.md` template of `project-setup` SHALL carry a habits block of four lines under
Working conventions (never poll, edit files with the edit tool and not a shell or script, read a
range when it is known, read several known files in one call) and one line pointing to the tool
table in `guardrails`. It SHALL NOT carry its own tool rules or the word "mandatory" for code
tools. The template SHALL state a size budget for `AGENTS.md` once, in a comment on its first line
(`<!-- size budget: 12000 characters -->`), and a lint check SHALL fail when this repository's
`AGENTS.md` or the template, measured without that comment, is larger. `CLAUDE.md` SHALL keep
only what is Claude-only and point to the table (DEC-8, DEC-12, D-13, D-14).

#### Scenario: A project is scaffolded
- **WHEN** a project is scaffolded from the template
- **THEN** its `AGENTS.md` holds the four habit lines, the table pointer and the budget comment

#### Scenario: A binding over budget
- **WHEN** `AGENTS.md` is larger than the budget
- **THEN** the lint check fails and the fix is to cut prose, not to raise the figure in the same change

#### Scenario: The template and the table
- **WHEN** a contributor looks for the tools to use for an activity in the template
- **THEN** it holds a pointer to the table in `guardrails` and no tool list of its own

### Requirement: Code checks run once per task
The instruction template and this repository's `AGENTS.md` SHALL say, the latter in its GitNexus
block between its markers, that the impact check runs once per task, before the brief, on the task's
symbols, and the change check once before the task's commit, both by the lead, and SHALL NOT say
"before every edit" or "before every commit". The implementer SHALL run neither; a HIGH or
CRITICAL impact result SHALL reach the developer through the lead before the brief. The
repository SHALL re-index with `--skip-agents-md` so that the edited block stays (DEC-11, D-15).

#### Scenario: A task is briefed
- **WHEN** the lead briefs a builder for a task
- **THEN** the impact check has run once on the task's symbols and the builder runs none

#### Scenario: A HIGH impact result
- **WHEN** the impact check on a task's symbols returns HIGH or CRITICAL
- **THEN** the lead brings it to the developer before the brief

#### Scenario: The lead can run the checks
- **WHEN** the `team-lead` agent is read
- **THEN** its `tools:` list carries `mcp__gitnexus__*` and `ToolSearch`, so the lead can run the per-task checks, and its description is unchanged

#### Scenario: A re-index
- **WHEN** the repository is re-indexed with `--skip-agents-md`
- **THEN** the GitNexus block still says once per task
