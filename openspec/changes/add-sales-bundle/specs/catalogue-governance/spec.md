## ADDED Requirements

### Requirement: A scheduled agent runs from its primary skill where agents cannot load
A scheduled task SHALL invoke the agent's primary skill with a run type where a runtime loads
skills but not agent files (Claude Desktop scheduled tasks, gap G-4); the agent file SHALL remain the
CLI entry point, and both paths SHALL produce the same run note.

#### Scenario: A Desktop scheduled task runs the sales close day
- **WHEN** the Desktop task prompt says "run sales-operations, run type close day"
- **THEN** the run follows the same contract as `sales-agent` started from the CLI with "close day"
