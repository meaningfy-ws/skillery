## ADDED Requirements

### Requirement: A skill's prose stays within the budget
A skill's prose (its `SKILL.md` body and its reference files, example code included) SHALL stay
within the budget of DEC-2. Templates, assets and scripts SHALL NOT count. A skill over the budget
SHALL carry a recorded, justified exception, and the catalogue check SHALL fail for a skill over
the budget without one.

#### Scenario: A skill grows past the budget
- **WHEN** a change brings a skill's prose over the budget and records no exception
- **THEN** `make validate` fails and names the skill and its size

#### Scenario: A skill with a recorded exception
- **WHEN** a skill is over the budget and records why it must be
- **THEN** the check passes and reports the exception

### Requirement: A skill holds only what is Meaningfy's own
A skill SHALL keep Meaningfy-specific rules, house conventions and preferences distilled from
reviews or from the owner. It SHALL NOT restate general knowledge that a registered dependency
states, nor a fact another skill owns; it SHALL name the dependency or cite the owner instead.
Example code copied from another project SHALL NOT live in a skill; a page for people links to the
source.

#### Scenario: Generic knowledge held by a dependency
- **WHEN** a skill's passage restates a principle that a registered book rule set states
- **THEN** the passage is removed and the skill names that rule set for it

#### Scenario: A rule that came from a review
- **WHEN** a skill is rewritten to the lean shape
- **THEN** every catalogue entry and every rule that came from a review or from the owner is still present, under the same id where it had one

#### Scenario: An example of a house convention
- **WHEN** an example shows a convention a model cannot infer from general knowledge
- **THEN** a short form of it stays in the skill as reference material

### Requirement: A reader who did not make the cuts confirms nothing of ours was lost
Each rewritten skill SHALL be compared, before against after, by a reader who took no part in the
rewrite. The rewrite SHALL NOT be accepted while that reader finds a Meaningfy-specific rule or
distilled preference missing.

#### Scenario: The second reader finds a lost rule
- **WHEN** the second reader reports a Meaningfy-specific rule present before and absent after
- **THEN** the rule is restored before the skill's rewrite is accepted
