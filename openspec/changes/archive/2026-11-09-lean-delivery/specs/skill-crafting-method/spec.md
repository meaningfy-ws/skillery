## MODIFIED Requirements

### Requirement: Third-party content is read, pinned and recorded

Every file of an external skill, and every URL it tells the agent to read, SHALL be read before the
skill is declared or vendored. It SHALL be pinned to a commit or content hash, and a provenance note
(source, commit, licence, date, reviewer) SHALL be recorded. A skill body SHALL NOT tell the agent to
fetch and follow live remote instructions. An agent SHALL get the fewest tools its job needs, and a
tool denial SHALL survive rendering to every CLI or be recorded as a gap. An agent whose job needs
the project's code-intelligence tools MAY omit its tool list and inherit the session's tools, only
when it denies `Agent` and its body limits it to those tools (lean-delivery DEC-11). The method
SHALL cite OWASP AST01, AST02, AST03, AST05, AST07 and AST10 for these rules.

#### Scenario: A skill tells the agent to read a live URL

- **WHEN** a skill body instructs the agent to fetch a remote page and follow it
- **THEN** review asks for a snapshot in `references/` instead

#### Scenario: An agent inherits the session's tools

- **WHEN** an agent declares no tool list
- **THEN** the catalogue's lint accepts it only if its `disallowedTools` names `Agent`
