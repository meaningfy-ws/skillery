## ADDED Requirements

### Requirement: A stage boundary is a fresh session
At a stage boundary of a long epic session the coordinator SHALL end the session from a hand-over
note and the developer SHALL start the next stage in a fresh session; the coordinator SHALL NOT
compact between stages. `guardrails` session hygiene SHALL point to the note's template in
`epic-delivery` and SHALL NOT restate it (DEC-1, D-1).

#### Scenario: A stage is merged
- **WHEN** a stage of an epic session is merged
- **THEN** the guidance is a hand-over note and a fresh session, not a compaction

#### Scenario: A question between stages
- **WHEN** the coordinator is asked whether to compact between stages
- **THEN** it answers by pointing to the hand-over note and the fresh session

### Requirement: The coordinator batches its reads
The coordinator SHALL read several known files in one call, and reading that would cross more than
a few files SHALL go to an exploring subagent. `guardrails` SHALL state this once, as "batch the
reads", and `epic-delivery` SHALL cite it (DEC-7, D-8).

#### Scenario: Several known files
- **WHEN** the coordinator needs five files it already knows
- **THEN** it reads them in one call

#### Scenario: Wide reading
- **WHEN** an answer needs reading across many unknown files
- **THEN** the coordinator dispatches an exploring subagent and takes the conclusion back
