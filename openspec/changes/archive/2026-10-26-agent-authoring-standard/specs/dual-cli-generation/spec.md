## ADDED Requirements

### Requirement: Agent type is rendered per CLI
The opencode agent renderer SHALL render an agent's `type` as the opencode `mode` through the
`agentModes` table of the single mapping file (`delegated` as `subagent`, `lead` as `primary`,
`scheduled` as `subagent`), SHALL record a gap for every `scheduled` agent stating that opencode has no
scheduler and the trigger is external, and SHALL NOT emit `type` into the opencode agent file. When
`type` is missing or unknown, the installer SHALL abort before writing any file and name the agent.

#### Scenario: A delegated agent becomes an opencode subagent
- **WHEN** the renderer renders an agent with `type: delegated`
- **THEN** the opencode agent declares `mode: subagent` and no gap is recorded for its type

#### Scenario: A lead agent becomes an opencode primary agent
- **WHEN** the renderer renders an agent with `type: lead`
- **THEN** the opencode agent declares `mode: primary`

#### Scenario: A scheduled agent is rendered with a recorded gap
- **WHEN** the renderer renders an agent with `type: scheduled`
- **THEN** the opencode agent declares `mode: subagent` AND a gap is recorded for that agent naming the
  external trigger

#### Scenario: A missing type aborts the install
- **WHEN** the installer renders an agent with no `type` or an unknown one
- **THEN** it aborts before writing any file and the error names the agent
