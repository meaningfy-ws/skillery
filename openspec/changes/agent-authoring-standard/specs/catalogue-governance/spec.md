## ADDED Requirements

### Requirement: Agents conform to the agent authoring standard
Every `agents/<name>.md` SHALL conform to the agent standard in `spec/agent-template.md` — its closed
frontmatter contract (including a declared `type` of `delegated`, `lead` or `scheduled`), its body cap,
its `## Dispatch contract` section with the labels **Input**, **Output**, **Side effects** and
**Refuses**, and CLI-agnostic body text — and the validator SHALL reject any agent that does not. The
bundle that lists an agent (per "Skills are organised into role bundles with single ownership") SHALL
also list the agent's primary skill, the first non-namespaced, non-external entry of its `skills:`
list. Each agent SHALL have `tests/features/agents/<name>.feature` containing a Scenario Outline with
Examples and a Background that names every entry of the agent's `skills:` list.

#### Scenario: An agent without a declared type is rejected
- **WHEN** the validator reads an agent whose frontmatter has no `type` field
- **THEN** it reports `missing required frontmatter field 'type'` for that agent

#### Scenario: A bundle field in agent frontmatter is rejected
- **WHEN** an agent's frontmatter carries `bundle: meaningfy-building`
- **THEN** the validator reports that `bundle` is not in the agent contract

#### Scenario: An unknown type or a pinned model name is rejected
- **WHEN** an agent declares `type: worker` or `model: claude-opus-4-8`
- **THEN** the validator reports the type as not a known agent type, or the model as not a family alias

#### Scenario: A description that does not say when to use the agent is rejected
- **WHEN** an agent's description lacks "Use when" or contains an `<example>` block
- **THEN** the validator reports the description defect for that agent

#### Scenario: A lead or scheduled agent that invites delegation is rejected
- **WHEN** an agent of type `lead` or `scheduled` has a description without "Not for delegation"
- **THEN** the validator reports the missing phrase for that agent

#### Scenario: A body over the cap is rejected
- **WHEN** an agent body is one line longer than the validator's agent body cap
- **THEN** the validator reports the body as over the cap, and a body exactly at the cap passes

#### Scenario: A missing dispatch-contract part is rejected
- **WHEN** an agent has no `## Dispatch contract` section, or the section lacks `**Refuses:**`
- **THEN** the validator names the missing section or label

#### Scenario: A CLI-specific path in an agent body is rejected
- **WHEN** an agent body contains `.claude/memory/`
- **THEN** the validator reports the CLI-specific reference for that agent

#### Scenario: An agent in a bundle without its primary skill is rejected
- **WHEN** `code-reviewer` (primary skill `meaningfy-code-review`) is listed in a bundle that does not
  list `meaningfy-code-review`
- **THEN** the validator reports the bundle and the primary skill it lacks

#### Scenario: An agent without its Gherkin scenarios is rejected
- **WHEN** an agent has no feature file, or its feature file has no Scenario Outline with Examples, or
  its Background omits one of the agent's skills
- **THEN** the validator names the agent and the missing element

#### Scenario: The catalogue's own agents conform
- **WHEN** the validator runs over the repository
- **THEN** `code-reviewer`, `epic-planner` and `implementer` produce no agent-standard errors
