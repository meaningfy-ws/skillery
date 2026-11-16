# activity-tools Specification

## Purpose
Give every agent one table that names, per activity, the tools to use and a fallback, by names the
CLI actually exposes to that agent, so that agents reach for the right tool without each skill or
agent restating it. A lint check (`activity_tools_table`) keeps the table honest.
## Requirements
### Requirement: One table recommends the tools for each activity
The catalogue SHALL hold one table, in `guardrails`, that names the recommended tools for each
activity and a fallback for each. It SHALL name a tool only by a name the CLI exposes to the agent.
Agents, delivery briefs and the instruction template SHALL point to the table and SHALL NOT carry
their own tool rules (proposal DEC-8). A worker's side-effect limit, such as the reviewer's
read-only use of a code tool, is not a tool rule and stays in the agent (D-29).

#### Scenario: An agent looks up the tools for code work
- **WHEN** an agent starts a task that reads or changes code
- **THEN** the table gives it the recommended tools for that activity under names it can call, and the fallback when one is absent

#### Scenario: The table names a tool an agent cannot call
- **WHEN** a row's Claude Code cell names a tool that an agent named in that row's Agents cell does not carry in its `tools:` list, globs included
- **THEN** the lint check `activity_tools_table` fails and names the row and the agent

#### Scenario: The lead row
- **WHEN** a row's Agents cell says `lead`
- **THEN** the check maps it to the agent `team-lead` and compares that agent's `tools:` list

#### Scenario: The opencode column is not checked
- **WHEN** a row's opencode cell names a tool
- **THEN** the check does not compare it with any agent's tool list, because there the list does not restrict (gap G-6 in `docs/environment/dual-cli/mapping.md`)

### Requirement: Serena is encouraged for everything it supports
The table SHALL recommend Serena for every code operation it supports (symbol and reference search,
file overviews, symbol-level edits, rename, safe delete, diagnostics) and SHALL say how to reach
those operations on each CLI (proposal DEC-9).

#### Scenario: Finding the callers of a function
- **WHEN** an agent needs the references to a symbol in a repository where Serena is connected
- **THEN** the guidance leads it to Serena's reference search, not to a text search over the files

