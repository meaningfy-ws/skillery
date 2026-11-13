<!-- Shaping-level delta: the EPIC's headline requirement. The PLAN adds the rest when it is
     derived. The `test-strategy` capability is created by the EPIC of that name. -->

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
