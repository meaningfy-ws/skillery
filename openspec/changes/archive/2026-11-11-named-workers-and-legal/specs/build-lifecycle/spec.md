## MODIFIED Requirements

### Requirement: The diagram and responsibility table reflect the current artifact vocabulary and agents
The Mermaid lifecycle diagram and the developer-vs-agent responsibility table SHALL represent EPIC as
`proposal.md`, PLAN as `design.md` + `tasks.md`, and the build-loop agents as `epic-planner` (the
shaping lead), `team-lead` (the delivery lead), `implementer`, `code-reviewer` and `release-manager`
(named-workers-and-legal DEC-11). Neither artifact SHALL reference a single-file `EPIC.md`, a
retired agent (`gherkin-writer`, `documenter`), `.claude/memory/epics/`, or `MEMORY.md`-as-truth.

#### Scenario: Diagram uses current artifact vocabulary
- **WHEN** a reader inspects the lifecycle diagram
- **THEN** its EPIC node is labelled `proposal.md` and its PLAN node is labelled `design.md` +
  `tasks.md`, with no node referencing a single-file `EPIC.md`

#### Scenario: Responsibility table names no retired agent
- **WHEN** a reader inspects the responsibility table
- **THEN** no agent other than `epic-planner`, `team-lead`, `implementer`, `code-reviewer` and
  `release-manager` is named, and neither `gherkin-writer` nor `documenter` appears
