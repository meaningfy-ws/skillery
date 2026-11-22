# test-strategy Specification

## Purpose
The catalogue holds one discipline for knowing how any work succeeds and how it fails, before the
work starts: the `test-strategy` skill. This capability covers what that skill owns (the loop, the
definition of a test, the six questions, the five stances), the matrix that maps each activity
family and question to the check that answers it, the inventory behind the matrix, and the proofs
that keep them honest (inventory coverage, one home per fact, the trigger probes).
## Requirements
### Requirement: One discipline, stated once
The catalogue SHALL hold one skill, `test-strategy` in `meaningfy-core`, that owns the loop every
activity follows (state how the work succeeds and how it fails before doing it, do it, challenge it
against those criteria, decide, revise), the definition of a test (a criterion agreed before the
work, a pass or fail result, and its evidence), the six questions (`VAL`, `VER`, `ADQ`, `ROB`, `CLR`,
`RSK`) and the five stances (verifier, validator, adversary, cold reader, checker) (EPIC DEC-1..DEC-4,
DEC-7). Other skills SHALL cite these, not restate them.

#### Scenario: Looking up what a test is
- **WHEN** a contributor asks what counts as a test for a contract review
- **THEN** `test-strategy` defines it, and `contract-practice` states no competing definition

#### Scenario: A review finding without a criterion
- **WHEN** a reviewer reports "this section feels weak" with no criterion
- **THEN** the skill's rule turns it into a criterion or records it as an opinion, not as a failed test

### Requirement: Every activity family has a matrix
`test-strategy` SHALL have one reference per activity family (software, documentation, DevOps, UI,
shaping, modelling, architecture, generic writing), each a table of question, check with its id,
technique owner, tool, moment, decided by (a person for every `VAL` row) and status `exists`, `gap`
or `accepted`, with at least one row for each of the six questions; a `gap` row SHALL name the EPIC
expected to fill it or "none yet", and an `accepted` row SHALL state why the gap is left open. A `cross-cutting` reference with the same columns MAY hold checks that
apply to every family; it is exempt from the six-question rule (DEC-6, design D-2).

#### Scenario: A family with no checks today
- **WHEN** the UI family is read
- **THEN** its file lists the six questions, each with a check or a `gap` row naming its EPIC

### Requirement: The matrix covers every check the catalogue has
Every check found in the catalogue SHALL appear in `references/inventory.md` with an id `CHK-<n>`
(an unpadded number), and every id SHALL be cited by at least one family file or the
`cross-cutting` reference; `make validate` SHALL fail on an uncited or an undefined id, and on a
family file without a row for one of the six questions (DEC-12, design D-7).

#### Scenario: A check left out of the matrix
- **WHEN** `inventory.md` defines `CHK-7` and no family file nor `cross-cutting.md` cites it
- **THEN** `make validate` fails, naming `CHK-7`

#### Scenario: A family without a robustness row
- **WHEN** `devops.md` has no row for `ROB`
- **THEN** `make validate` fails, naming `devops.md` and `ROB`

#### Scenario: A family file cites an unknown check
- **WHEN** `software.md` cites `CHK-99` and the inventory has no such id
- **THEN** `make validate` fails, naming `software.md` and `CHK-99`

### Requirement: Techniques stay with their owners
A family file SHALL name the owning skill of each technique and SHALL NOT restate its steps; each
owning skill SHALL carry one line naming the questions it answers in the matrix (DEC-5, DEC-8,
design D-8).

#### Scenario: The Python testing checklist
- **WHEN** a contributor looks for how to write a property test
- **THEN** `software.md` points to `cosmic-python`'s testing checklist, which holds the rule

### Requirement: A non-code activity uses the skill
The skill's Quick Start SHALL take a non-code activity (a LinkedIn post) through the loop: its
success and failure stated first, then the checks taken from the `generic-writing` matrix, each
citing its row (DEC-12).

#### Scenario: Writing a post
- **WHEN** an agent is asked to write a LinkedIn post and loads `test-strategy`
- **THEN** it states how the post succeeds and fails before drafting, and runs the checks the `generic-writing` rows name

### Requirement: The skill's trigger is proven against its neighbours
`tests/trigger_probes.yaml` SHALL hold two positive probes for `test-strategy` and near-miss probes
against `clarity-gate`, `bdd-gherkin`, `technical-writing` and `meaningfy-code-review` (DEC-12).

#### Scenario: A Gherkin request
- **WHEN** the probe "write Gherkin scenarios for this acceptance criterion" is evaluated
- **THEN** it expects `bdd-gherkin`, as a near-miss of `test-strategy`

### Requirement: The matrix names the audit of a test suite
The software matrix SHALL hold an `ADQ` row for the test suite audit, owned
by `test-suite-care` (the UI matrix row is deferred with stage 2, design D-43). The rows of the
testing checklist SHALL name the developer's lanes among their moments.
The matrix's questions, stances and columns SHALL NOT change (test-suite-care
DEC-9; design D-13).

#### Scenario: Which check says a suite is worth its cost
- **WHEN** someone reads the software matrix for the adequacy of the tests
- **THEN** a row names the test suite audit, its owner `test-suite-care` and "the developer" as the one who decides

### Requirement: The UI matrix has no open gap
The UI family file SHALL name `ui-testing` as the technique owner of its `VER`, `ROB`, `ADQ` and
`RSK` rows, with `ADQ` held by the broken-screen check and `RSK` by the browser and device matrix,
each with its own check id in the inventory; `CHK-58` SHALL point to `ui-testing` (DEC-3, DEC-4,
design D-7).

#### Scenario: Who checks that UI scenarios catch a broken screen
- **WHEN** someone reads the `ADQ` row of the UI matrix
- **THEN** it names the broken-screen check, its id, the owner `ui-testing` and status `exists`

