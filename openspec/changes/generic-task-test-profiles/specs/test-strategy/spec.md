<!-- This delta adds to the live `test-strategy` capability (`openspec/specs/test-strategy`).
     The shaping-level headline requirement that stood here ("What leaves the company is drafted
     against confirmed criteria and read by an adversary") moved to `subagent-dispatch`, where the
     rule has its one home (design D-1); `test-strategy` gains rows only. Which files the
     delivery edits is in tasks.md (3.1) and design D-17, not here: a spec holds standing rules. -->

## ADDED Requirements

### Requirement: The generic-writing matrix holds the profiles as rows
`test-strategy`'s `references/generic-writing.md` SHALL hold, for each of the four profiles (offer,
contract, public post, and message, which covers sales messages), one `VAL` row for the criteria stated before
drafting, decided by the owner, and one `ROB` row for the adversarial reader, each with status
`exists`, the profile's check id defined in `references/inventory.md`, and the owning skill as
technique owner (`proposal-writing`, `contract-practice`, `meaningfy-voice`,
`executive-communication`, in that order; design D-38). Every `ROB` row SHALL name, as
its tool, a fresh subagent briefed per `guardrails`. The `ADQ` row of that file on whether the
writing checks would catch a bad piece SHALL have status `accepted`, with the reason that this
work is assessed and reviewed, not tested (DEC-11), and no row of the file SHALL have a `gap`
status that names `generic-task-test-profiles`. No row SHALL name a reader's role. Where
`test-strategy`'s SKILL.md or the head of `generic-writing.md` quotes one of these rows or its
status, the quotation SHALL agree with the row. The profiles SHALL add no question, stance or
column to the matrix (generic-task-test-profiles DEC-5, DEC-6; test-strategy DEC-5, DEC-8).

#### Scenario: Looking up the check for a contract
- **WHEN** a contributor reads the `ROB` rows of `generic-writing.md`
- **THEN** one row names `contract-practice` as technique owner and a subagent briefed per `guardrails` as the tool, with status `exists`

#### Scenario: A row whose owning skill holds no profile
- **WHEN** a `ROB` row of `generic-writing.md` names `executive-communication` and that skill has no `## Review profile` section
- **THEN** `make validate` fails, naming the skill

#### Scenario: An owning skill without its rows
- **WHEN** `generic-writing.md` has no `ROB` row with status `exists` that names `meaningfy-voice`
- **THEN** `make validate` fails, naming `meaningfy-voice` and `ROB`

#### Scenario: The skill's example for a post
- **WHEN** a contributor reads the six questions in `test-strategy`'s SKILL.md, column *Example in a post*
- **THEN** the `ROB` example is the adversarial reader's read and the `ADQ` example says the gap is `accepted`, as the rows of `generic-writing.md` do

#### Scenario: A role written into test-strategy
- **WHEN** a file under `skills/test-strategy/` names a reader's role ("sceptical buyer", "opposing counsel", "stranger scrolling", "busy recipient")
- **THEN** `make validate` fails, naming the file
