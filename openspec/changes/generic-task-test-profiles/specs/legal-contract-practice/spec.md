## ADDED Requirements

### Requirement: A contract is drafted against confirmed criteria and read by opposing counsel
`contract-practice` SHALL hold the contract profile in a `## Test profile` section: what makes a
contract or a revision succeed and fail, the reader's role (opposing counsel) and what that reader
attacks. The criteria SHALL be proposed in the intake round and confirmed by the owner before
drafting. Before the draft is reported ready for the owner, the opposing-counsel reader SHALL read
it by the brief of `guardrails` and return an assessment: findings with quotations, for the owner
and Tolic to judge. A finding on a number, or on a term that changes what a party can claim or
must do, SHALL become an open point or a point for a qualified lawyer, with the reader's
quotation, and Tolic SHALL change neither; on any other finding he revises or says why not. The
reader's report SHALL NOT pass, fail or approve a contract, SHALL NOT be presented as legal
advice, and SHALL NOT replace the owner's or the lawyer worker's decision. Skillery SHALL hold no
contract test case or fixture for it. The contract workflow's phases SHALL stay as they are
(generic-task-test-profiles DEC-1, DEC-5, DEC-11).

#### Scenario: Criteria in the intake round
- **WHEN** the owner asks Tolic to draft a freelance mission contract
- **THEN** Tolic proposes the success and failure criteria in the same round as his intake questions, and drafts after the owner confirms them

#### Scenario: A one-sided term
- **WHEN** the draft lets one party end the contract without cause and the other not, and a criterion says no right is given to one side only
- **THEN** the reader raises a finding on that criterion and quotes the term, and Tolic records it as an open point for the owner without changing the term himself

#### Scenario: An undefined term
- **WHEN** the reader raises a finding on the criterion "every defined term is defined once" and quotes a term used without a definition
- **THEN** Tolic adds the definition from the library and has the draft read once more

#### Scenario: The reader finds nothing
- **WHEN** the reader reports no finding
- **THEN** Tolic reports the read as done, and the lawyer-review list and the owner's approval of the PR are still required
