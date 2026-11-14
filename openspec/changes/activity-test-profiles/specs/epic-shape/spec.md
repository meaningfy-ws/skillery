## ADDED Requirements

### Requirement: The shaping interview asks for invariants
`epic-planning`'s test-scenario interview SHALL ask which invariants must hold, each stated so that
a property test could check it and each with an example; "none" SHALL be a valid answer recorded
with its reason. The answers SHALL be recorded with the interview, in the change's `inputs/qa.md`,
where PLAN derivation reads them (activity-test-profiles DEC-5; design D-4).

#### Scenario: An EPIC that keeps one fact in two places
- **WHEN** the developer says a label is held in two stores
- **THEN** `inputs/qa.md` records the invariant "the label is the same in both stores" with an example that holds and one that would break it

#### Scenario: An EPIC with no invariant
- **WHEN** the developer answers that a wording-only change has no invariant
- **THEN** the answer is recorded as "None" with that reason

### Requirement: The PLAN records invariants
A PLAN's `design.md` SHALL hold an `## Invariants` section directly before `## Error matrix`: a
table with an id `INV-<n>`, the invariant, an example, every write path that can break it and the
test that proves it on each path, or one line "None" with the reason. The section SHALL NOT be
empty. Where the interview holds no answer to the invariants question, PLAN derivation SHALL
propose invariants from the EPIC, mark each "proposed, not confirmed" and put them to the developer
before the gate, and SHALL NOT write "None". A PLAN derived before the template held the section
need not gain it (activity-test-profiles DEC-5; design D-1, D-2, D-3).

#### Scenario: A write path left out
- **WHEN** `epic-planning` derives the PLAN of an EPIC that keeps one label in two stores and offers create, rename and replace
- **THEN** the PLAN ties create to both stores, because the write-path column asks for create, update, replace, delete, bulk or import and internal paths

#### Scenario: A PLAN whose interview had no invariants answer
- **WHEN** `epic-planning` derives the PLAN of an EPIC shaped before the invariants question existed, which keeps one label in two stores
- **THEN** the section holds the one-label invariant marked "proposed, not confirmed", and it is put to the developer before the gate

#### Scenario: A PLAN with no invariant
- **WHEN** `epic-planning` derives the PLAN of a change for which the interview recorded "None"
- **THEN** the section holds the one line "None" with the reason, not an empty heading

### Requirement: Invariants reach the tester
An invariant left to the adversarial tester SHALL have a *Test* cell that starts with `tester` and
a row in the PLAN's error matrix that names the breach and cites the invariant's id, so that the
tester states a property for it. The template SHALL name the error matrix as the tester's target
list. Which properties the tester takes is the rule of the tester's brief in `epic-delivery`;
`epic-planning` SHALL point to it and SHALL NOT restate it. Where the appetite's review set names
no tester, the *Test* cell SHALL NOT start with `tester`: it SHALL name the builder's test or
scenario that proves the invariant on each write path (activity-test-profiles DEC-5, DEC-7; design
D-1, D-2, D-13).

#### Scenario: A tester dispatched on an invariant left to it
- **WHEN** the tester is dispatched on a stage whose PLAN holds `INV-1` with a *Test* cell starting with `tester` and an error-matrix row citing `INV-1`
- **THEN** the tester's table of properties has a row for the property of that invariant, with a test and a result

#### Scenario: An appetite without a tester
- **WHEN** `epic-planning` derives the PLAN of a SMALL EPIC, whose review set names no tester, and the PLAN holds an invariant
- **THEN** the invariant's *Test* cell names the builder's test for each write path and does not start with `tester`

#### Scenario: Deriving a PLAN with an invariant left to the tester
- **WHEN** `epic-planning` derives a PLAN whose invariant's *Test* cell starts with `tester`
- **THEN** the PLAN's error matrix holds a row that names the breach and cites that invariant's id

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
