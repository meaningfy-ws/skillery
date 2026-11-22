## ADDED Requirements

### Requirement: Rules reach a subagent through its brief
`rulebook` SHALL offer `load --brief --activity <a>`, which prints the `R-` and `P-` rule lines in force
for the activity and context without the playbook text. The lead SHALL run it and paste its output
into each subagent's brief under a `Rules` heading. A subagent SHALL NOT run `load` and its agent
body SHALL NOT say "load the rulebook"; the rules it follows are those in its brief. The
session-start rules block SHALL keep running for sessions and SHALL NOT be relied on for subagents
(D-14, DEC-13).

#### Scenario: The lead briefs a builder
- **WHEN** the lead runs `rules.py load --brief --activity coding` and spawns an `implementer`
- **THEN** the brief's `Rules` section holds the printed `R-`/`P-` lines, and the implementer's transcript shows no `load` call

#### Scenario: Brief mode prints no playbook
- **WHEN** `load --brief --activity code-review` runs in a repository with 4 rules and 1 playbook for the activity
- **THEN** the output is 4 rule lines, one per rule with its id and text, and no playbook paragraph

#### Scenario: A session still gets its block
- **WHEN** a person starts a Claude Code session with `meaningfy-core` installed
- **THEN** the session-start block appears as before, and `load` stays per activity for that session

#### Scenario: An agent body that still loads
- **WHEN** an agent under `agents/` tells its subagent to load the rulebook
- **THEN** the pre-PR review of this change lists it as a finding, and the line is replaced by "follow the rules in the brief"
