## ADDED Requirements

### Requirement: A contract is drafted against confirmed criteria and read by opposing counsel
`contract-practice` SHALL hold the contract profile in a `## Test profile` section: what makes a
contract or a revision succeed and fail, the reader's role (opposing counsel) and what that reader
attacks. The criteria SHALL be proposed in the intake round and confirmed by the owner before
drafting. Before the draft is reported ready for the owner, the opposing-counsel reader SHALL read
it by the brief of `guardrails`. Each of its fails SHALL become an open point or a point for a
qualified lawyer. The reader's report SHALL NOT approve a contract, SHALL NOT be presented as legal
advice, and SHALL NOT replace the owner's or the lawyer worker's decision. The contract workflow's
phases SHALL stay as they are (generic-task-test-profiles DEC-1, DEC-5).

#### Scenario: Criteria in the intake round
- **WHEN** the owner asks Tolic to draft a freelance mission contract
- **THEN** Tolic proposes the success and failure criteria in the same round as his intake questions, and drafts after the owner confirms them

#### Scenario: A one-sided term
- **WHEN** the draft lets one party end the contract without cause and the other not, and a criterion says no right is given to one side only
- **THEN** the reader marks that criterion failed and quotes the term, and Tolic records it as an open point for the owner without changing the term himself

#### Scenario: The reader finds nothing
- **WHEN** the reader reports every criterion passed
- **THEN** Tolic reports the read as done, and the lawyer-review list and the owner's approval of the PR are still required
