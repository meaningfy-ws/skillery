## ADDED Requirements

### Requirement: The DevOps workflow is data
`infrastructure-operations` SHALL host the DevOps workflow file with four variants — interactive
intervention, incident, check-up, unattended operation — whose phases follow the safe-change
protocol and cite `service-reliability` for incidents and unattended operations; its consent gate
SHALL require the consent card answered before an apply command (DEC-13).

#### Scenario: An apply before consent
- **WHEN** a DevOps intervention reaches an apply command with no consent card answered
- **THEN** navigator shows a process-drift warning citing the consent gate of the DevOps workflow
