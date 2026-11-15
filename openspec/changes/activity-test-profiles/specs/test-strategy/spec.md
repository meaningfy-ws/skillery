## ADDED Requirements

### Requirement: A family's gaps are filled from recorded failures or accepted
For the documentation, shaping, DevOps, architecture, modelling and UI families, a check SHALL be
added only where a recorded failure exists that it would have caught, one technique or tool per gap,
in the skill that owns the activity. Once a family is closed, each of its matrix rows SHALL have
the status `exists` or `accepted`, and an `accepted` row SHALL state why (activity-test-profiles
DEC-2, DEC-6, DEC-7).

#### Scenario: A gap with a recorded failure
- **WHEN** the shaping stage's survey records a PLAN whose invariant missed a write path, found only by the tester after the stage was built
- **THEN** the stage adds the invariants technique to `epic-planning`, with a worked example showing it catching that failure, and the row becomes `exists`

#### Scenario: A gap without a failure
- **WHEN** the UI stage's survey finds no failure for a question
- **THEN** no check is added, and the row becomes `accepted` with the reason

#### Scenario: A stage with no failure at all
- **WHEN** a stage's survey records no failure for any gap row of its family
- **THEN** the stage ships only the survey record and the `accepted` rows, and edits no skill other than the family's rows in `test-strategy`

### Requirement: A family's failures come from a recorded survey
A change that fills or accepts a family's `gap` rows SHALL keep a survey in its `evidence/` folder
that lists those rows, the failures found with their sources, the sources searched, and one
decision per gap row and per candidate check, `fill` or `accept`; the developer SHALL confirm the
decisions before a check is written. A tool's findings SHALL count as a failure only for a rule the
developer marks as worth fixing (activity-test-profiles DEC-3, DEC-7; design D-5, D-6).

#### Scenario: A candidate tool with only noise
- **WHEN** a tool's run on a real docs tree produces findings and the developer marks none of its rules as worth fixing
- **THEN** the tool is not adopted, its `gap` row becomes `accepted`, and the run's summary stays in `evidence/`

#### Scenario: A check proposed without a failure
- **WHEN** a diff adds a check whose decision line names no failure id
- **THEN** the checker reports it and the check is removed before the PR

### Requirement: A closed family stays closed
`make validate` SHALL fail when a closed family's file holds a row whose status is not exactly
`exists` or `accepted`, or an `accepted` row without a reason. A family is closed when its file is
in the list of closed families that the tests of `test-strategy` hold (design D-11).

#### Scenario: A gap row added later
- **WHEN** a later change adds a `gap → D` row to `documentation.md`, which is a closed family
- **THEN** `make validate` fails, naming `documentation.md` and the row

### Requirement: A tool is adopted only after a run on a real tree
A tool SHALL be adopted as a check of a family only after one recorded run on a real tree of the
kind it will check. The run SHALL be read-only, and its summary, kept in the change's `evidence/`
folder, SHALL name no host, address, client, person or secret path. A tool that found nothing to
read SHALL be recorded as not run and SHALL NOT be adopted (activity-test-profiles DEC-7; design
D-7, D-17).

#### Scenario: checkmake on the stacks checkout
- **WHEN** checkmake is run on a checkout of a stacks repository that holds Makefiles
- **THEN** the checkout is unchanged afterwards, and `evidence/toolrun-checkmake.md` holds the version, the command, counts per rule and examples with paths reduced to their shape

#### Scenario: A checkout without a Makefile
- **WHEN** the checkout holds no Makefile and the developer chooses to record that
- **THEN** `evidence/toolrun-checkmake.md` holds the version and "no Makefile in the checkout", and checkmake is not adopted

## MODIFIED Requirements

### Requirement: Every activity family has a matrix
`test-strategy` SHALL have one reference per activity family (software, documentation, DevOps, UI,
shaping, modelling, architecture, generic writing), each a table of question, check with its id,
technique owner, tool, moment, decided by (a person for every `VAL` row) and status `exists`, `gap`
or `accepted`, with at least one row for each of the six questions; a `gap` row SHALL name the EPIC
expected to fill it or "none yet", and an `accepted` row SHALL state why the gap is left open. A
closed family (requirement *A closed family stays closed*) SHALL hold no `gap` row. A
`cross-cutting` reference with the same columns MAY hold checks that apply to every family; it is
exempt from the six-question rule (DEC-6, design D-2; activity-test-profiles DEC-2).

#### Scenario: A family that is not closed
- **WHEN** a family file that is not in the list of closed families is read
- **THEN** it lists the six questions, each with a check or a `gap` row naming its EPIC or "none yet"

#### Scenario: A closed family with few checks
- **WHEN** the UI family is read after it was closed
- **THEN** its file lists the six questions, each with a check or an `accepted` row stating why the gap is left open
