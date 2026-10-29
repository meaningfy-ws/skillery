## ADDED Requirements

### Requirement: Commercial packages live in one portfolio, read by the skills
Meaningfy's commercial packages SHALL be kept in one portfolio, one file per package, each following
one shared structure that a check enforces. The skills that coach, frame or produce a sale
(`semantic-consulting-coach`, `proposal-writing`, `decision-package`) SHALL read the package chosen
for a client from the portfolio and SHALL NOT carry any one package's commercial facts in their own
text.

#### Scenario: A proposal for a client in a different segment
- **WHEN** the agent writes a proposal for a client to whom the Luxembourg SME package applies
- **THEN** the offer, stages, durations and terms in the proposal come from that package's file, and none come from another package

#### Scenario: A package that breaks the structure
- **WHEN** a package file lacks a field the shared structure requires
- **THEN** the portfolio check fails and names the package and the missing field

#### Scenario: No package found
- **WHEN** a session cannot reach the portfolio, or no package applies to the client
- **THEN** the agent says so and asks which package applies, and invents no commercial terms
