## ADDED Requirements

### Requirement: The navigator warns of a worker without a mark
On Claude Code, the navigator SHALL warn, once per session and at the end of the turn, when the lead
has dispatched a worker (an `implementer` or `code-reviewer` it spawned itself) in a session that
has an open change and has shown no mark line. The warning SHALL NOT block the dispatch. On
opencode there is no warning; the `guessed` label is the only signal, recorded as a parity gap
(proposal DEC-10).

#### Scenario: First worker without a mark
- **WHEN** the lead dispatches the first worker of a session with an open change and no mark line
- **THEN** the navigator shows a warning and the worker still starts

#### Scenario: First worker after a mark
- **WHEN** the lead writes a mark line and dispatches its first worker in the same turn
- **THEN** the navigator shows no warning

#### Scenario: A reader is not a worker
- **WHEN** the lead dispatches an `Explore` reader in a session with no mark line
- **THEN** the navigator shows no warning
