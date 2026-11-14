## ADDED Requirements

### Requirement: A message is written against stated criteria and read by a busy recipient
`executive-communication` SHALL hold the message profile in a `## Test profile` section, for
decision requests, client messages that are not sales emails, and internal messages: what makes
the message succeed and fail, the reader's role (a busy recipient) and what that reader attacks.
The criteria SHALL be stated after the diagnosis and before drafting. When the recipient is outside
Meaningfy, the owner SHALL confirm them and the reader SHALL run by the brief of `guardrails`
before the message is handed over. For an internal message the criteria SHALL be stated without
waiting for confirmation and the reader SHALL run only on request. A message that states scope or
price is an offer and takes the profile of `proposal-writing`; sales emails and follow-ups in a
deal's thread take that of `sales-conversations` (generic-task-test-profiles DEC-1, DEC-3, DEC-5).

#### Scenario: A recommendation for a client
- **WHEN** the user asks for a recommendation email to a client's head of data
- **THEN** the skill states the criteria after the diagnosis, drafts after the owner confirms them, and a busy-recipient reader reports against them before the message is handed over

#### Scenario: A proposal email
- **WHEN** the user asks for an email that states the price and the scope of an engagement
- **THEN** the offer profile of `proposal-writing` applies, with its sceptical-buyer reader, and no second reader runs

#### Scenario: An internal status note
- **WHEN** the user asks for a status note to the team
- **THEN** the skill states the criteria in one or two lines, drafts without waiting, and starts no reader

#### Scenario: An internal note the owner wants read
- **WHEN** the user asks for an internal decision request and says "have it read"
- **THEN** the busy-recipient reader runs and reports against the stated criteria
