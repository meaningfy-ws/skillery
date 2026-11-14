## ADDED Requirements

### Requirement: The offer profile has one owner
`proposal-writing` SHALL own the offer profile in a `## Test profile` section: what makes a
proposal and its statement of work succeed and fail, the reader's role (a sceptical buyer) and what
that reader attacks. The criteria SHALL be confirmed by the owner before the offer is framed, and
the sceptical-buyer reader SHALL read the finished draft by the brief of `guardrails` before it is
handed over. The `proposal-writer` agent, which cannot ask mid-run, SHALL return its proposed
criteria as an open question with a recommended answer when the caller passed none confirmed, and
SHALL draft only once they are passed back; it SHALL start the reader itself and return the
reader's report with the draft (generic-task-test-profiles DEC-1, DEC-5, DEC-9).

#### Scenario: Dispatched without confirmed criteria
- **WHEN** a caller dispatches `proposal-writer` with complete requirements and no confirmed criteria
- **THEN** it returns the proposed criteria as an open question with a recommended answer, and no draft

#### Scenario: Dispatched with confirmed criteria
- **WHEN** a caller dispatches `proposal-writer` with the requirements and the criteria the owner confirmed
- **THEN** it drafts, has a sceptical-buyer reader read the draft, revises on a failed criterion, and returns the draft with the reader's last report

#### Scenario: Scope and price disagree
- **WHEN** the statement of work lists a deliverable that the price excludes, and a criterion says scope and price name the same deliverables
- **THEN** the reader marks that criterion failed and quotes both passages

### Requirement: The sales-message profile has one owner
`sales-conversations` SHALL own the profile of sales emails and follow-ups to clients and partners
in a `## Test profile` section: the reader's role (a busy recipient) and what that reader attacks,
with the criteria of a piece proposed from the skill's acceptance criteria. In an attended session
the owner SHALL confirm the criteria and the reader SHALL run by the brief of `guardrails` before a
draft is presented as ready to send; this applies to a draft the owner picks up from a scheduled
run. A scheduled run SHALL ask for no confirmation of criteria and SHALL start no adversarial
reader; it MAY start the reviewers `sales-operations` names, the `recipient-reader` among them,
which stay as they are. Sending SHALL stay the owner's act (DEC-3, DEC-4, DEC-5, DEC-9, DEC-10).

#### Scenario: A follow-up picked up from a scheduled run
- **WHEN** the owner opens a working session and asks the sales agent to finish the follow-up that yesterday's close-day run drafted
- **THEN** the agent proposes the criteria, waits for the owner's confirmation, has a busy-recipient reader read the draft, and presents it with the reader's report; nothing is sent

#### Scenario: A scheduled run
- **WHEN** the close-day run drafts a follow-up
- **THEN** the run note holds no criteria confirmation and no adversarial reader's report, and its *Verification* holds the output of the reviewers of `sales-operations`, or "unverified"

#### Scenario: Several drafts picked up together
- **WHEN** the owner picks up three drafts in one working session
- **THEN** the agent proposes the criteria of all three in one message, and the owner confirms or corrects each in one line
