## ADDED Requirements

### Requirement: The weekly review includes rule stewardship
The weekly review SHALL include one rules step that runs rule-steward. The step covers the rule candidates waiting in
`00 Inbox/proposed/`, the usage flags, the lint findings and the failing golden examples. The owner's
decisions SHALL be applied in the same session. The general sweep of `00 Inbox/proposed/` SHALL leave `kind: rule` notes to this step.

#### Scenario: Weekly review with pending rule candidates
- **WHEN** the weekly review runs and two rule candidates wait in `00 Inbox/proposed/`
- **THEN** the rules step presents them with the steward's report, and each is approved, edited, rejected or left for next week
