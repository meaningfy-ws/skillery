## ADDED Requirements

### Requirement: A skill's prose stays within the budget
A skill's prose (its `SKILL.md` body and its reference files, example code included) SHALL stay
within the budget of DEC-2. Files outside `SKILL.md` and `references/` SHALL NOT count; every
file under `references/` counts, whatever its kind. A skill over the budget
SHALL carry a recorded, justified exception, and the catalogue check SHALL fail for a skill over
the budget without one.

#### Scenario: A skill grows past the budget
- **WHEN** a change brings a skill's prose over the budget and records no exception
- **THEN** `make validate` fails and names the skill and its size

#### Scenario: A skill with a recorded exception
- **WHEN** a skill is over the budget and records why it must be in `skill-budget.yaml`
- **THEN** the check passes

#### Scenario: An exception that is no longer needed
- **WHEN** a skill with a recorded exception is at or under the budget
- **THEN** `make validate` fails and asks for the exception to be removed

### Requirement: Skills waiting for their rewrite are listed, and the list cannot rot
Until every skill is rewritten, a skill that existed when the standard was introduced MAY be
listed as pending in `skill-budget.yaml`, with the checks it is exempt from. A skill added later
SHALL NOT be listed (enforced by review; the lint does not know when a skill was added). The check SHALL fail for an exemption no longer needed, a name that is not a
skill, or a malformed file. A missing file SHALL mean no skill is listed.

#### Scenario: A rewritten skill left on the list
- **WHEN** a skill pending for its pointers now passes the pointer check
- **THEN** `make validate` fails and asks for the exemption to be removed

#### Scenario: A skill pending for its pointers only grows past the budget
- **WHEN** a skill exempt only from the pointer check goes over 24 KB of prose
- **THEN** `make validate` fails on the budget

#### Scenario: A catalogue with no list
- **WHEN** the method checks run on a root holding only `skills/foo/SKILL.md`, within budget and
  without `skill-budget.yaml`
- **THEN** they report no error

### Requirement: A pointer to a reference says when to open it
Every mention in a `SKILL.md` body of a file in the skill's own `references/` SHALL be one
sentence that opens with Read or Open, names the situation with when, if, before, after, while,
once, whenever, until or unless, and ends with ": it adds|gives|holds <what>." (the exact grammar
is in design D-5), at the point of need. No
heading that names references, resources, further reading, see also or supporting material SHALL
close the body with a list. The catalogue check SHALL fail for a pointer in another form and for
such a heading. A path into another skill's `references/` and text inside fenced code SHALL NOT
count as pointers.

#### Scenario: A bare reference link
- **WHEN** a skill body holds a list item that is only a link to `references/patterns.md` and a
  topic list
- **THEN** `make validate` fails and names the skill, the file line and the target

#### Scenario: A pointer at its point of need
- **WHEN** a list item reads "Read `references/alerting.md` when writing an alert rule: it adds the
  severity table."
- **THEN** the check passes

#### Scenario: A citation of another skill's reference
- **WHEN** a skill body cites "`test-strategy`'s matrix (`references/software.md`)"
- **THEN** the pointer check ignores it

### Requirement: The lean standard is written once
The shape of a skill (its three tiers, the body sections, the sorting of content and the five
practices of DEC-11) SHALL be stated in `docs/development/creating-skills.md` only; the method,
the template and any skill SHALL link to it.

#### Scenario: Looking up the budget
- **WHEN** a skill author looks for how large a skill may be
- **THEN** `creating-skills.md` gives the tiers, 24 KB and 6 KB, and the method's principle 7 links
  there and states no number of its own

#### Scenario: A skill names an external dependency
- **WHEN** a skill body tells the agent to use an external skill
- **THEN** it says in one sentence what to do when that skill is not installed: offer the install
  command, and if declined, work without it and say what is lost

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
