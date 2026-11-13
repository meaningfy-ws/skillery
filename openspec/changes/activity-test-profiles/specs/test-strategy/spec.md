<!-- The `test-strategy` capability is created by the EPIC of that name; these requirements are
     added to it. -->

## ADDED Requirements

### Requirement: A family's gaps are filled from recorded failures or accepted
For the documentation, shaping, DevOps, architecture, modelling and UI families, a check SHALL be
added only where a recorded failure exists that it would have caught, one technique or tool per gap,
in the skill that owns the activity. After a family's stage, each of its matrix rows SHALL have the
status `exists` or `accepted`, and an `accepted` row SHALL state why (activity-test-profiles DEC-2,
DEC-6, DEC-7).

#### Scenario: A gap with a recorded failure
- **WHEN** the shaping stage's survey records a PLAN whose invariant missed a write path, found only by the tester after the stage was built
- **THEN** the stage adds the invariants technique to `epic-planning`, with a worked example showing it catching that failure, and the row becomes `exists`

#### Scenario: A gap without a failure
- **WHEN** the UI stage's survey finds no failure for a question
- **THEN** no check is added, and the row becomes `accepted` with the reason

#### Scenario: A stage with no failure at all
- **WHEN** a stage's survey records no failure for any gap row of its family
- **THEN** the stage ships only the survey record and the `accepted` rows, and edits no skill other than the family's rows in `test-strategy`

### Requirement: Each stage's failures come from a recorded survey
Each stage SHALL start with a survey kept in the change's `evidence/` folder that lists the
family's gap rows, the failures found with their sources, the sources searched, and one decision
per gap row, `fill` or `accept`; the developer SHALL confirm the decisions before a check is
written. A tool's findings SHALL count as a failure only for a rule the developer marks as worth
fixing (activity-test-profiles DEC-3, DEC-7; design D-5, D-7).

#### Scenario: A candidate tool with only noise
- **WHEN** Vale's run on a real docs tree produces findings and the developer marks none of its rules as worth fixing
- **THEN** Vale is not adopted, and the run's summary stays in `evidence/`

#### Scenario: A check proposed without a failure
- **WHEN** a stage's diff adds a check whose decision line names no failure id
- **THEN** the stage checker reports it and the check is removed before the PR

### Requirement: A closed family stays closed
`make validate` SHALL fail when a family file whose stage has closed holds a row with the status
`gap`, or an `accepted` row without a reason (design D-14).

#### Scenario: A gap row added later
- **WHEN** a later change adds a `gap` row to `documentation.md` after the documentation stage closed it
- **THEN** `make validate` fails, naming `documentation.md` and the row

### Requirement: Each tool runs once on a real tree
Vale and ls-lint SHALL each be run once on a real docs tree, and ls-lint and checkmake once on a
real stacks repository, read-only, with a summary of the findings recorded in `evidence/` that
names no host, address, client or person (activity-test-profiles DEC-7; design D-8, D-10).

#### Scenario: checkmake on the stacks repository
- **WHEN** stage 3 runs checkmake on a checkout of `infrastructure-stacks`
- **THEN** the checkout is unchanged afterwards, and `evidence/toolrun-checkmake.md` holds the version, the command, counts per rule and examples with paths reduced to their shape
