## ADDED Requirements

<!-- Shaping-level delta for the new capability only. The deltas of the modified capabilities
     (external-dependency-register, sales-method-ownership) are written with the PLAN. -->

### Requirement: One skill routes a goal to the skills that serve it
The catalogue SHALL hold one orchestrator skill that, for a goal, names the Meaningfy skill that
owns the work, any external skill that helps, when and how to use it, and the Meaningfy preference
that overrides it. It SHALL cover every Meaningfy skill and every registered external skill
(proposal DEC-2, DEC-3).

#### Scenario: A goal served by an external skill
- **WHEN** the owner asks to prepare a negotiation with a client
- **THEN** the agent reaches the external negotiation skill through the orchestrator, together with the Meaningfy sales skill that owns the conversation

#### Scenario: A goal served by a Meaningfy skill alone
- **WHEN** the goal has no external skill registered for it
- **THEN** the orchestrator names the Meaningfy skill and no external one

### Requirement: A Meaningfy preference overrides an external skill
Where a registered external skill conflicts with a Meaningfy rule, the orchestrator SHALL state
which Meaningfy rule wins, and the agent SHALL follow it with the external skill loaded
(proposal DEC-7).

#### Scenario: The external skill advises a discount
- **WHEN** the external negotiation skill is loaded and its method leads to a price concession
- **THEN** the agent offers no discount and says the Meaningfy rule forbids it

### Requirement: A missing external skill is named, not ignored
When the orchestrator routes to an external skill that is not installed, the agent SHALL say so,
offer the install command, and, if the owner declines, say that it continues without it
(proposal DEC-12).

#### Scenario: The external skill is not installed
- **WHEN** a goal routes to an external skill the session does not have
- **THEN** the agent names the skill and its install command before it continues
