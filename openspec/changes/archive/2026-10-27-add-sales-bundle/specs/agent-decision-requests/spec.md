## ADDED Requirements

### Requirement: Every request for the owner's decision is a self-contained card
An agent asking the owner to decide SHALL use the decision card owned by `executive-communication`
(`references/decision-request.md`): the decision as a question and its deadline with the reason;
a recommendation; up to three options each with its consequence, one being "do nothing"; the two or
three facts needed, each marked confirmed (source, date), assumed or unknown; what "yes" will write;
the reply form. The card SHALL be at most 150 words and SHALL NOT consist of a record id, a link or a
pointer to another note (DEC-5).

#### Scenario Outline: A card is checked
- **WHEN** a run note contains a decision request `<case>`
- **THEN** it `<verdict>`

  | case | verdict |
  |---|---|
  | with all fields and 120 words | passes |
  | whose facts are only an id and a link | fails |
  | without a "do nothing" option | fails |
  | of 180 words | fails |

#### Scenario: A sales run note is opened
- **WHEN** the owner opens any sales run note
- **THEN** the first section is "Decisions needed", cards ordered by deadline, and every other item needing attention follows in a list ranked P1–P3 before the collapsed log

### Requirement: An asynchronous approval request carries its context and its options
`writing-antipatterns` SHALL mark, for an approval request read later, assumed shared context (A13)
as harmful and shown options (A12) as required, while keeping the live Decision genre unchanged.

#### Scenario: A reviewer applies the Decision genre to a run-note card
- **WHEN** a card relies on context the reader must look up
- **THEN** the review flags A13 as a defect

#### Scenario: A reviewer sees options on a run-note card
- **WHEN** a card shows three options with their consequences
- **THEN** the review does not flag A12
