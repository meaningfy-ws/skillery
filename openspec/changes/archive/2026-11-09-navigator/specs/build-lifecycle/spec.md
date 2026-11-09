## MODIFIED Requirements

### Requirement: EPIC-tier steps each name exactly one owner
Every EPIC-tier step (shape the EPIC, derive the PLAN, clarity-gate the PLAN, BDD, TDD, review, archive) SHALL cite exactly one owning skill per step. The archive step SHALL state that a change is archived only with no open plan drift, or with each deviation recorded in the change, as `spec-stewardship` requires.

#### Scenario: Clarity-gate step names its owner
- **WHEN** a reader reads the "clarity-gate the PLAN" EPIC-tier step
- **THEN** the step names `clarity-gate` as the sole owner of the ≥9/10 scoring gate

#### Scenario: Archive with open plan drift
- **WHEN** a reader reads the archive step
- **THEN** it names `spec-stewardship` as owner and says an open plan drift is reconciled or recorded as a deviation before archive
