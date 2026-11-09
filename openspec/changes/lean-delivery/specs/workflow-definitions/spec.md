## MODIFIED Requirements

### Requirement: Default workflow files live in their host skills
The eight default workflow files SHALL live in one host skill each: epic-shaping in
`epic-planning`, epic-delivery (with the brownfield variant) in `epic-delivery`, architecting in `architecture`, modelling in
`conceptual-modelling`, release in `meaningfy-release`, DevOps (with interactive intervention,
incident, check-up and unattended variants) in `infrastructure-operations`, sales in
`sales-operations`, and documentation in `technical-writing` (DEC-13, DEC-8; lean-delivery DEC-9).
Each host skill SHALL point to its file.

#### Scenario: Looking up the DevOps workflow
- **WHEN** a contributor looks for the DevOps phases the band uses
- **THEN** `infrastructure-operations` points to its workflow file, which names `service-reliability` for incidents and unattended operations

#### Scenario: Looking up the shaping workflow
- **WHEN** a contributor looks for the shaping phases the band uses
- **THEN** `epic-planning` points to its workflow file, and `epic-delivery`'s file no longer holds them

#### Scenario: Looking up the modelling workflow
- **WHEN** a contributor looks for the modelling phases the band uses
- **THEN** `conceptual-modelling` points to its workflow file, and `architecture`'s file no longer holds them

#### Scenario: Looking up the documentation workflow
- **WHEN** a contributor looks for the docs-stage phases the band uses
- **THEN** `technical-writing` points to its workflow file, whose phases are inventory, write, verify, cold-read and publish

### Requirement: Work shaping, architecture, modelling and release have workflows
Each process SHALL have a default workflow file in its owning skill, with the phases the owner named
(DEC-1..DEC-5): `epic-shaping` (explore, variants, decide, propose, design, revise) in
`epic-planning`; `epic-delivery` (ready, apply, accept, archive) in
`epic-delivery`; architecting (drivers, use cases, C4, decide, domain) in
`architecture`; modelling (elicit, model, generate, validate) in `conceptual-modelling`; release
(branch, bump, validate, merge, publish, back-merge) in
`meaningfy-release`. Architecting's `domain` phase SHALL be owned by `conceptual-modelling`, so
**Next step** hands the session over to modelling (DEC-3). `verify` is replaced by `accept`
(lean-delivery DEC-13).

#### Scenario: A shaping session sees only shaping
- **WHEN** a session loads `epic-planning` and the change has no tasks yet
- **THEN** the band shows the six epic-shaping phases and none of ready, apply, accept or archive

#### Scenario: A delivery session on an unstarted PLAN keeps the clarity check
- **WHEN** a fresh session opens on a change with a PLAN and no task ticked, and loads `epic-delivery`
- **THEN** the band is placed in `ready`, then enters `apply` and warns while the clarity gate has not passed

#### Scenario: Architecture hands over to modelling
- **WHEN** an architecture session reaches the `domain` phase and the person presses **Next step**
- **THEN** `conceptual-modelling` runs, and the band shows the modelling workflow from `elicit`

#### Scenario: Ordinary work does not start a release
- **WHEN** a session tags a commit or pushes a `release/` branch without loading `meaningfy-release`
- **THEN** the release workflow does not activate
