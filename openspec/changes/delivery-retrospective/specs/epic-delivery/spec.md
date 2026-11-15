## ADDED Requirements

### Requirement: The lead marks phase and stage
`epic-delivery` SHALL define the mark line once, in the form
`mark: change=<id> phase=<shape|plan|deliver> stage=<n|->`, beside the result line. The lead SHALL
write it in its own message at the start of each delivery stage, and a session that carries on from
a hand-over note SHALL write it before its first brief (proposal DEC-2, DEC-3).

#### Scenario: A stage starts
- **WHEN** the lead starts stage 2 of change `x`
- **THEN** it writes `mark: change=x phase=deliver stage=2` before it briefs a worker

#### Scenario: A session resumes from a hand-over note
- **WHEN** a new session picks up a change from its hand-over note
- **THEN** the lead writes the mark line for the current stage before its first brief
