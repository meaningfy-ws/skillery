## MODIFIED Requirements

### Requirement: The analysis is decomposed into a fixed set of lenses, one per subagent run

`meaningfy-code-review` SHALL define a fixed set of **five lenses** — **L1 Security & safety**,
**L2 Spec correctness & tests**, **L3 Architecture conformance**, **L4 Principles & clean code**,
**L5 Fit, elegance & refactoring** — and SHALL execute **each lens as its own subagent run**. Each
lens SHALL bundle its aspects and anchor them to existing `cosmic-python` catalogue ids; the skill
SHALL NOT mint new catalogue entries for the lenses (DEC-6, DEC-7). A run MAY carry several lenses
only when the review set authorises it: for TINY and SMALL by the epic-delivery workflow file's own
lenses, named by the brief's appetite; for a small stage by a decision the brief cites and the
change's `design.md` records under `## Delivery decisions`. The `code-reviewer` agent SHALL refuse
any other several-lens brief (navigator-follows-the-work DEC-12, DEC-13, #148).

#### Scenario: A full standalone review

- **WHEN** a full standalone review runs
- **THEN** each of the five lenses is executed as a separate subagent pass and their findings are merged into one prioritised report

#### Scenario: A single-lens review

- **WHEN** the reviewer is asked to apply one specific lens (e.g. L1 Security)
- **THEN** exactly that lens runs as a subagent and reports only its lens's findings

#### Scenario: Merged lenses with a recorded decision

- **WHEN** the `code-reviewer` agent is briefed with lenses L3, L4 and L5 and cites `D-7`, which the change's `design.md` records under `## Delivery decisions` as merging those lenses for this stage
- **THEN** it reviews through the three lenses and reports their findings

#### Scenario: Merged lenses without a decision

- **WHEN** the `code-reviewer` agent is briefed with two lenses for a stage of a LARGE EPIC and no recorded decision
- **THEN** it refuses with "one lens required (L1–L5), or cite the recorded decision that merges them"

#### Scenario: Merged lenses for a SMALL EPIC

- **WHEN** the `code-reviewer` agent is briefed with lenses L2 and L3 for a SMALL EPIC
- **THEN** it reviews through both lenses, as the SMALL review set states

#### Scenario: Spec-correctness lens checks requirements, not the plan

- **WHEN** the L2 lens evaluates correctness
- **THEN** it checks conformance to the EPIC's requirements/specs and their acceptance criteria, not the implementation plan
