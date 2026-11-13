## ADDED Requirements

### Requirement: The test-data rule has one home
The rule for building model objects in tests SHALL be stated once, in `cosmic-python`'s testing
checklist: polyfactory factories, with a small builder only where a factory cannot express the
object. `project-setup`'s testing setup SHALL keep only the install and wiring and point to the
checklist; it SHALL NOT restate the TDD/BDD loop (test-strategy DEC-9).

#### Scenario: Looking up how to build a test object
- **WHEN** a builder reads `project-setup`'s testing setup for fixture advice
- **THEN** it finds the polyfactory install line and a pointer to the checklist item, and no second rule
