<!-- The `test-strategy` capability is created by the EPIC of that name; this delta adds to it. -->

## ADDED Requirements

### Requirement: What leaves the company is drafted against confirmed criteria and read by an adversary
For an offer, a contract, a public post or a client message, the agent SHALL state how the piece
succeeds and how it fails before drafting, and the owner SHALL confirm those criteria. Before the
piece is sent, a fresh adversarial reader with the role its owning skill names SHALL report against
those criteria, quoting the text. A draft made by an unattended run SHALL get both steps when the
owner picks it up to send (generic-task-test-profiles DEC-2, DEC-3, DEC-4).

#### Scenario: An offer
- **WHEN** an agent is asked to write an offer for a client
- **THEN** it proposes the success and failure criteria, drafts only after the owner confirms them, and a sceptical-buyer reader reports against them before the offer is handed over

#### Scenario: A draft from a scheduled run
- **WHEN** the owner picks up a client message drafted by an unattended run
- **THEN** the criteria are stated and confirmed and the reader runs before the message is sent

#### Scenario: An internal message
- **WHEN** an agent drafts an internal status message
- **THEN** it states the criteria, and the reader runs only if the owner asks

### Requirement: The generic-writing matrix holds the profiles as rows
`test-strategy`'s `references/generic-writing.md` SHALL hold, for each of the five profiles (offer,
contract, public post, message, sales message), one `VAL` row for the criteria stated before
drafting, decided by the owner, and one `ROB` row for the adversarial reader, each with status
`exists`, a check id defined in `references/inventory.md`, and the owning skill as technique owner
(`proposal-writing`, `contract-practice`, `meaningfy-voice`, `executive-communication`,
`sales-conversations`, in that order). Every `ROB` row SHALL name `guardrails` as the owner of the
brief. This change SHALL edit those two references and, in the skill's SKILL.md, only a status
quoted from a changed row; it SHALL add no question, stance or column (DEC-5, DEC-6; test-strategy
DEC-5, DEC-8).

#### Scenario: Looking up the check for a contract
- **WHEN** a contributor reads the `ROB` rows of `generic-writing.md`
- **THEN** one row names the opposing-counsel reader, `contract-practice` as technique owner and `guardrails` for the brief, with status `exists`

#### Scenario: A row whose owning skill holds no profile
- **WHEN** a `ROB` row of `generic-writing.md` names `sales-conversations` and that skill has no `## Test profile` section
- **THEN** `make validate` fails, naming the skill

#### Scenario: A technique written into test-strategy
- **WHEN** a file under `skills/test-strategy/` states a reader's role by name ("sceptical buyer", "opposing counsel", "stranger scrolling", "busy recipient") outside a row of `generic-writing.md`
- **THEN** `make validate` fails, naming the file and the line
