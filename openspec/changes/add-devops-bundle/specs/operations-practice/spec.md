## ADDED Requirements

### Requirement: The devops skills own operations, not delivery, and hold no secrets
The devops skills SHALL own how environments exist and stay healthy, and `ci-cd-delivery` SHALL keep
how a change reaches an environment; an overlap SHALL be resolved by moving text, never by
restating it (DEC-2). Infrastructure secrets, hosts and credentials SHALL NOT enter a skill or agent
body (DEC-4).

#### Scenario: A package skill restates the deploy trigger
- **WHEN** a devops skill describes how a change reaches an environment
- **THEN** the text moves to `ci-cd-delivery` or is removed, and the devops skill names it

#### Scenario: A skill names a production host
- **WHEN** a skill or agent body contains a host, credential or secret
- **THEN** it is removed; the inventory stays in the infra repository
