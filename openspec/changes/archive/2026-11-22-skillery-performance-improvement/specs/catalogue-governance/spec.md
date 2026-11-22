## MODIFIED Requirements

### Requirement: Code checks run once per task
The instruction template and this repository's `AGENTS.md` SHALL say, the latter in its GitNexus
block between its markers, that the code index and the impact check run once at the start of a
piece of work (a stage, or a task worked alone), the impact on each task's symbols before its
brief, and the change check once before that piece's last commit, both by the lead; that a session
without a lead runs the impact check once before its first edit and the change check once before
its commit, and brings a HIGH or CRITICAL result to the developer; and SHALL NOT say "before every
edit", "before every commit" or "per lens". The implementer and the reviewer SHALL run neither and
SHALL take the impact result from the brief; a HIGH or CRITICAL impact result SHALL reach the
developer through the lead before the brief. The repository SHALL re-index with
`npx gitnexus analyze --skip-agents-md` so that the edited block stays, and the template's re-index
line SHALL name that full command (DEC-11, D-7).

#### Scenario: A session without a lead
- **WHEN** a single session makes a direct-PR fix with no lead
- **THEN** it runs the impact check once before its first edit and the change check once before its commit, and brings a HIGH or CRITICAL result to the developer

#### Scenario: A task is briefed
- **WHEN** the lead briefs a builder for a task
- **THEN** the impact check has run once on the task's symbols at the stage's start, at most ten lines of its result are in the brief, and the builder runs none

#### Scenario: A HIGH impact result
- **WHEN** the impact check on a task's symbols returns HIGH or CRITICAL
- **THEN** the lead brings it to the developer before the brief

#### Scenario: The lead can run the checks
- **WHEN** the `team-lead` agent is read
- **THEN** its `tools:` list carries `mcp__gitnexus__*` and `ToolSearch`, so the lead can run the checks at the two points, and its description is unchanged

#### Scenario: A re-index
- **WHEN** the repository is re-indexed with `--skip-agents-md`
- **THEN** the GitNexus block still says the two points of a piece of work

#### Scenario: A stage ends
- **WHEN** the lead prepares the stage's last commit before its pull request
- **THEN** the index, the change check and the impact check have run once since the stage's tasks were built, and no reviewer ran an impact check of its own
