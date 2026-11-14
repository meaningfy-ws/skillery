## ADDED Requirements

### Requirement: Verification and validation are defined in test-strategy
`epic-delivery` SHALL NOT define verification and validation nor hold the V-model table; it SHALL
point to `test-strategy` for both and keep the acceptance demo, the validation review, the evidence
folder and the provisional steps (test-strategy DEC-4, design D-4).

#### Scenario: Looking up verification versus validation during a delivery
- **WHEN** a lead looks up what "validation" means in `epic-delivery`
- **THEN** a pointer leads to `test-strategy`, and the acceptance demo procedure is still in `epic-delivery`
