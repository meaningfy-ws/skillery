## ADDED Requirements

### Requirement: The shaping interview asks for invariants
`epic-planning`'s test-scenario interview SHALL ask which invariants must hold, each stated so that
a property test could check it and each with an example; "none" SHALL be a valid answer recorded
with its reason (activity-test-profiles DEC-5; design D-4).

#### Scenario: An EPIC that keeps one fact in two places
- **WHEN** the developer says a label is held in two stores
- **THEN** the interview records the invariant "the label is the same in both stores" with an example that holds and one that would break it

#### Scenario: An EPIC with no invariant
- **WHEN** the developer answers that a wording-only change has no invariant
- **THEN** the answer is recorded as "None" with that reason

### Requirement: The PLAN records invariants
A PLAN's `design.md` SHALL hold an `## Invariants` section directly before `## Error matrix`: a
table with an id `INV-<n>`, the invariant, an example, every write path that can break it and the
test that proves it on each path, or one line "None" with the reason. The section SHALL NOT be
empty. PLANs derived before this requirement SHALL NOT be migrated (activity-test-profiles DEC-5;
design D-1, D-3).

#### Scenario: A write path left out
- **WHEN** `epic-planning` derives the PLAN of an EPIC that keeps one label in two stores and offers create, rename and replace
- **THEN** the invariant's row lists create among its write paths, because the column asks for create, update, replace, delete, bulk or import and internal paths

#### Scenario: A PLAN with no invariant
- **WHEN** `epic-planning` derives the PLAN of a change for which the interview recorded "None"
- **THEN** the section holds the one line "None" with the reason, not an empty heading

### Requirement: Invariants reach the tester
The adversarial tester's properties SHALL be traceable to the PLAN's invariants: for a PLAN with an
`## Invariants` table, every invariant whose *Test* cell starts with `tester` SHALL appear among the
properties the tester's report states. This EPIC SHALL NOT change the tester's brief; the PLAN's
error matrix SHALL be named in the template as the tester's target list
(activity-test-profiles DEC-5, DEC-7; design D-2, D-18).

#### Scenario: Tracing one PLAN
- **WHEN** the tester is dispatched on a PLAN that changes code and whose table holds `INV-1` with a *Test* cell starting with `tester`
- **THEN** its report states a property for `INV-1`, and the comparison is recorded in `evidence/invariants-trace.md`

#### Scenario: A PLAN that leaves nothing to the tester
- **WHEN** a PLAN's table has no *Test* cell starting with `tester`
- **THEN** it does not count as the trace, and another PLAN is used

## MODIFIED Requirements

### Requirement: The EPIC and PLAN templates speak plain language
The `meaningfy` schema's instructions and its `proposal`, `design` and `tasks` templates SHALL state
their guidance in common, precise words, without method jargon such as "golden thread", "spine",
"altitude", "bet", "Shape-Up" or lists of acronyms; their files and headings SHALL stay as they are (DEC-12),
except that the `design` template gains the one heading `## Invariants` (activity-test-profiles DEC-5).
`epic-planning` SHALL have no second EPIC template (DEC-13).

#### Scenario: The parent citation is asked for in plain words
- **WHEN** a reader opens the `design` or `tasks` template
- **THEN** it asks them to name the EPIC the plan derives from, without the term "golden thread"

#### Scenario: Headings are unchanged
- **WHEN** the rewritten proposal template is compared with the previous one
- **THEN** its `##` headings are identical

#### Scenario: The design template's one new heading
- **WHEN** the design template is compared with the one before activity-test-profiles
- **THEN** its `##` headings are identical except for `## Invariants`, placed before `## Error matrix`
