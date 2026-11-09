# workflow-definitions Specification

## Purpose
How the workflows navigator follows are defined: data files that name phases, owning skills, expected skills, gates and variants, shipped by the skill that owns each process and overridable per repository. Archived from the `navigator` change (2026-11-09).
## Requirements
### Requirement: Workflows are data that cite their owning skills
A workflow file SHALL list phases, the owning skill of each phase, the skills expected to run, the
gates and, where it applies, the review set per appetite, naming skills and agents only by name; it
SHALL NOT restate rule text a skill owns (DEC-1); the review set of the build-tier file is owned by
that file itself. Every skill or agent a default workflow file names SHALL exist in
the catalogue or appear in the `skills:` list of a `dependencies.yaml` entry, checked by
`make validate` (DEC-14).

#### Scenario: A default file names a skill that does not exist
- **WHEN** a default workflow file names `epic-deliverie`
- **THEN** `make validate` fails, naming the file and the unknown name

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

### Requirement: Repo workflow files override
A repository SHALL be able to add or override workflows with files in its own docs. A repo file with
a default's name SHALL replace that default; a repo file that extends a default SHALL replace only
the fields it gives; a malformed repo file SHALL be reported with its path and first error, never
silently ignored, and the default SHALL stay in force.

#### Scenario: A repo override
- **WHEN** a repo has its own `build-tier` workflow file
- **THEN** navigator uses it instead of the default

#### Scenario: A malformed repo file
- **WHEN** a repo workflow file is not valid
- **THEN** the band shows a warning naming the file and the error, and the default of that name is used

### Requirement: A repo opts into strict mode in its workflow file
A repository SHALL be strict when one of its own workflow files declares mode strict; a default
workflow file SHALL NOT declare a mode (DEC-5).

#### Scenario: A default file declares a mode
- **WHEN** a default workflow file declares mode strict
- **THEN** `make validate` fails, naming the file

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

