## MODIFIED Requirements

### Requirement: The method states what it owns and what it adopts by reference

`docs/development/README.md` SHALL keep as its own text only what no published method covers: the
three readers, the principles of ownership and installability, the change path, the posture rule,
the agent lifecycle, the issue loop, and the Definition of Done. For writing and testing a single
skill, it SHALL cite the adopted methods instead of restating them: superpowers `writing-skills`,
the agentskills.io specification and its guides, the Claude Code skill and eval docs, and OWASP
Agentic Skills Top 10. Each adopted method SHALL be declared as a dependency in
`docs/environment/setup.md` with the version or date it was read. The size of a skill is
skillery's own rule, the lean standard (`lean-skill-standard`): the method SHALL link to it, and
the agentskills.io limits SHALL be cited only as the specification's outer limit.

#### Scenario: An adopted rule is cited, not restated

- **WHEN** the method needs the description limits of a skill
- **THEN** it cites the agentskills.io specification and its guide

#### Scenario: The size budget is skillery's own

- **WHEN** the method needs the size budget of a skill
- **THEN** it links to the lean standard in `creating-skills.md`, which states 24 KB of prose and a
  6 KB body target

#### Scenario: An adopted method is declared

- **WHEN** a reader looks up `skill-creator` in `docs/environment/setup.md`
- **THEN** its source and the date or version it was read are listed
