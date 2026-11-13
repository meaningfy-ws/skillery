<!-- Shaping-level delta: the EPIC's headline requirement. The PLAN adds the rest when it is
     derived. The `test-strategy` capability is created by the EPIC of that name. -->

## ADDED Requirements

### Requirement: A family's gaps are filled from recorded failures or accepted
For the documentation, shaping, DevOps, architecture, modelling and UI families, a check SHALL be
added only where a recorded failure exists that it would have caught, one technique or tool per gap,
in the skill that owns the activity. After a family's stage, each of its matrix rows SHALL have the
status `exists` or `accepted`, and an `accepted` row SHALL state why (activity-test-profiles DEC-2,
DEC-6, DEC-7).

#### Scenario: A gap with a recorded failure
- **WHEN** the documentation stage's survey records a how-to page whose broken structure a lint would have caught
- **THEN** the stage adds that check to the skill that owns documentation, with an example showing it catching the failure, and the row becomes `exists`

#### Scenario: A gap without a failure
- **WHEN** the UI stage's survey finds no failure for a question
- **THEN** no check is added, and the row becomes `accepted` with the reason
