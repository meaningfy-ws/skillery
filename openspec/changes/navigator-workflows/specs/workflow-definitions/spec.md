## ADDED Requirements

### Requirement: Work shaping, architecture, modelling and release have workflows
Each process SHALL have a default workflow file in its owning skill, with the phases the owner named
(DEC-1..DEC-5): build-tier's `work-shaping` variant (explore, variants, decide, propose, design,
revise) in `epic-delivery`; architecting (drivers, use cases, C4, decide, domain) in
`architecture`; modelling (elicit, model, generate, validate) in `conceptual-modelling`; release
(branch, bump, validate, merge, publish, back-merge) in
`meaningfy-release`. Architecting's `domain` phase SHALL be owned by `conceptual-modelling`, so
**Next step** hands the session over to modelling (DEC-3).

#### Scenario: A shaping session sees only shaping
- **WHEN** a session loads `epic-planning` and the change has no tasks yet
- **THEN** the band shows the six work-shaping phases and none of apply, verify or archive

#### Scenario: Architecture hands over to modelling
- **WHEN** an architecture session reaches the `domain` phase and the person presses **Next step**
- **THEN** `conceptual-modelling` runs, and the band shows the modelling workflow from `elicit`

#### Scenario: Ordinary work does not start a release
- **WHEN** a session tags a commit or pushes a `release/` branch without loading `meaningfy-release`
- **THEN** the release workflow does not activate

### Requirement: A passed file gate advances the phase
A file gate that a written file matches SHALL advance the phase the way a passed command gate does:
into the phase after the gate's phase, when that phase has no `enter`, never backwards, and never
selecting a workflow or ending a variant (DEC-6). No other engine change SHALL be needed for these
workflows.

#### Scenario: Writing the first ADR
- **WHEN** an architecture session in the `c4` phase writes `docs/adr/ADR-0001-storage.md`
- **THEN** the band moves to `decide`, with the `adr` gate passed

#### Scenario: Editing an old use case
- **WHEN** an architecture session in `decide` edits `docs/use-cases/use-case-catalogue.adoc`
- **THEN** the band stays in `decide`
