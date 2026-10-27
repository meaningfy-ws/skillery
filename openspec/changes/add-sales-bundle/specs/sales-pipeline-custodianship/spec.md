## ADDED Requirements

### Requirement: The sales agent keeps the CRM in Odoo and holds no CRM data in the catalogue
The sales skills SHALL hold method only; Odoo ids, staff, partner and client names, partner ratings
and prices SHALL live in the installation's `sales-config.yaml` or be read live from Odoo (DEC-3).

#### Scenario: A shipped file names a person or an Odoo id
- **WHEN** any file under `skills/sales-*`, `agents/sales-agent.md`, `tests/` or `docs/` contains a staff, partner or client name, an Odoo record id or a price
- **THEN** the change is not done (privacy grep, task 8.2)

#### Scenario: A configuration key is missing
- **WHEN** a run needs a key that `sales-config.yaml` does not define
- **THEN** the run writes no Odoo record and opens its note with `HALT: configuration <key> missing`

### Requirement: Every CRM action has exactly one write tier
The write policy SHALL classify every capability class as do-and-log, ask-first or never; when
several entries match, the most restrictive SHALL win (DEC-4).

#### Scenario Outline: An action is classified
- **WHEN** the agent intends `<action>`
- **THEN** the policy evaluator returns `<tier>`

  | action | tier |
  |---|---|
  | crm.write next activity on an open deal | do-and-log |
  | crm.write stage won or lost | ask-first |
  | crm.delete any record | never |
  | mail.send to a client | never |
  | crm.create a sixth record in one run | ask-first |

### Requirement: The agent never acts irreversibly and never bulk-imports
The agent SHALL search Odoo before creating a record, SHALL create records one at a time under the
creation cap, and SHALL NOT send mail, delete records, or set won/lost without the owner's yes.

#### Scenario: Asked to import a list of contacts
- **WHEN** the agent is asked to import many contacts at once
- **THEN** it opens an intake session that proposes each record, and creates none beyond the cap without a card answered yes

#### Scenario: Creating a record
- **WHEN** the agent is about to create a lead, contact or deal
- **THEN** it first searches Odoo for an existing record and creates one only if none exists

#### Scenario: A mail asks the agent to change a deal
- **WHEN** an incoming mail contains an instruction to change a record
- **THEN** the agent writes no change and raises a decision card quoting the sentence

### Requirement: A replayed run changes nothing
A run SHALL write only fields whose current value differs from the intended value, and SHALL create
an activity or note only when none with the same summary exists on the record.

#### Scenario: The close-day run fires twice
- **WHEN** the same run type runs twice on the same day with no new input
- **THEN** the second run's "Done by the agent" section is empty

### Requirement: Self-improvement goes through skillery
The agent SHALL NOT edit an installed skill; a skill defect found in a run SHALL be reported as a
decision card whose yes is filing an issue with the failure, the file and the before → after text
(DEC-7).

#### Scenario: The weekly review finds a wrong rule
- **WHEN** the weekly review finds a rule that produced a wrong result
- **THEN** the note carries a card with the issue text, and no skill file changes
