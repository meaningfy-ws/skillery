## ADDED Requirements

### Requirement: The lead marks phase and stage
`epic-delivery` SHALL define the mark line once, in the form
`mark: change=<id> phase=<shape|plan|deliver> stage=<n|->`, beside the result line. The lead SHALL
write it in its own message at the start of each delivery stage, and a session that carries on from
a hand-over note SHALL write it before its first brief (proposal DEC-2, DEC-3). The mark SHALL stand
as a whole line, not inside a code block or a tool input, and a turn that dispatches a worker SHALL
repeat it in its last message (design D-22).

#### Scenario: A stage starts
- **WHEN** the lead starts stage 2 of change `x`
- **THEN** it writes `mark: change=x phase=deliver stage=2` before it briefs a worker

#### Scenario: A session resumes from a hand-over note
- **WHEN** a new session picks up a change from its hand-over note
- **THEN** the lead writes the mark line for the current stage before its first brief

#### Scenario: The turn that briefs a worker ends
- **WHEN** the lead's turn dispatches a worker
- **THEN** the turn's last message holds the mark line again, as a whole line
