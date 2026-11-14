## ADDED Requirements

<!-- Shaping-level delta for the new capability only. The deltas of the modified capabilities
     (epic-delivery, epic-shape, subagent-dispatch, workflow-definitions) are written with the PLAN. -->

### Requirement: One table recommends the tools for each activity
The catalogue SHALL hold one table, in `guardrails`, that names the recommended tools for each
activity and a fallback for each. It SHALL name a tool only by a name the CLI exposes to the agent.
Agents, delivery briefs and the instruction template SHALL point to the table and SHALL NOT carry
their own tool rules (proposal DEC-8).

#### Scenario: An agent looks up the tools for code work
- **WHEN** an agent starts a task that reads or changes code
- **THEN** the table gives it the recommended tools for that activity under names it can call, and the fallback when one is absent

#### Scenario: The table names a tool an agent cannot call
- **WHEN** the table names a tool for an activity and the agent that performs the activity does not carry it in its tool list
- **THEN** the catalogue's check fails and names the row

### Requirement: Serena is encouraged for everything it supports
The table SHALL recommend Serena for every code operation it supports (symbol and reference search,
file overviews, symbol-level edits, rename, safe delete, diagnostics) and SHALL say how to reach
those operations on each CLI (proposal DEC-9).

#### Scenario: Finding the callers of a function
- **WHEN** an agent needs the references to a symbol in a repository where Serena is connected
- **THEN** the guidance leads it to Serena's reference search, not to a text search over the files
