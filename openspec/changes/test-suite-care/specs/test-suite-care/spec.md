<!-- Shaping-level delta: the EPIC's headline requirement. The PLAN adds the rest when it is
     derived. -->

## ADDED Requirements

### Requirement: A test suite is reduced only against the features it serves, by the owner's decision
An audit of a test suite SHALL measure the cost of each test, SHALL map each test to the spec
scenario it serves or to "serves none", and SHALL report each proposed reduction with its evidence,
its saving and the scenario it touches. A test SHALL be merged or dropped only when its scenario
stays covered and the owner has approved the proposal. The audit SHALL NOT set a time target
(test-suite-care DEC-2, DEC-4, DEC-5).

#### Scenario: A redundant test
- **WHEN** the audit finds two tests that serve the same scenario and cover the same code
- **THEN** it proposes merging or dropping one, names the scenario and the saving, and changes nothing until the owner approves

#### Scenario: The only test of a scenario
- **WHEN** a slow test is the only one that serves a spec scenario
- **THEN** the audit may propose a slower lane or a cheaper set-up for it, and does not propose dropping it

#### Scenario: Nothing worth reducing
- **WHEN** the owner discusses the report and approves no proposal
- **THEN** the audit is complete, and the report records the decision
