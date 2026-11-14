<!-- The `test-strategy` capability is created by the EPIC of that name; this delta adds to it.
     The shaping-level headline requirement that stood here ("What leaves the company is drafted
     against confirmed criteria and read by an adversary") moved to `subagent-dispatch`, where the
     rule has its one home (design D-1); `test-strategy` gains rows only. -->

## ADDED Requirements

### Requirement: The generic-writing matrix holds the profiles as rows
`test-strategy`'s `references/generic-writing.md` SHALL hold, for each of the five profiles (offer,
contract, public post, message, sales message), one `VAL` row for the criteria stated before
drafting, decided by the owner, and one `ROB` row for the adversarial reader, each with status
`exists`, the profile's check id defined in `references/inventory.md`, and the owning skill as
technique owner (`proposal-writing`, `contract-practice`, `meaningfy-voice`,
`executive-communication`, `sales-conversations`, in that order). Every `ROB` row SHALL name, as
its tool, a fresh subagent briefed per `guardrails`. No row SHALL name a reader's role. This change
SHALL edit those two references and, in the skill's SKILL.md, only a status quoted from a changed
row; it SHALL add no question, stance or column (generic-task-test-profiles DEC-5, DEC-6;
test-strategy DEC-5, DEC-8).

#### Scenario: Looking up the check for a contract
- **WHEN** a contributor reads the `ROB` rows of `generic-writing.md`
- **THEN** one row names `contract-practice` as technique owner and a subagent briefed per `guardrails` as the tool, with status `exists`

#### Scenario: A row whose owning skill holds no profile
- **WHEN** a `ROB` row of `generic-writing.md` names `sales-conversations` and that skill has no `## Test profile` section
- **THEN** `make validate` fails, naming the skill

#### Scenario: An owning skill without its rows
- **WHEN** `generic-writing.md` has no `ROB` row with status `exists` that names `meaningfy-voice`
- **THEN** `make validate` fails, naming `meaningfy-voice` and `ROB`

#### Scenario: A role written into test-strategy
- **WHEN** a file under `skills/test-strategy/` names a reader's role ("sceptical buyer", "opposing counsel", "stranger scrolling", "busy recipient")
- **THEN** `make validate` fails, naming the file
