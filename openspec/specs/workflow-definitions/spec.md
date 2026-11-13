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
The nine default workflow files SHALL live in one host skill each: epic-shaping in
`epic-planning`, epic-delivery (with the brownfield variant) in `epic-delivery`, architecting in `architecture`, modelling in
`conceptual-modelling`, release in `meaningfy-release`, DevOps (with interactive intervention,
incident, check-up and unattended variants) in `infrastructure-operations`, sales in
`sales-operations`, documentation in `technical-writing` (DEC-13, DEC-8; lean-delivery DEC-9), and
contract in `contract-practice` (named-workers-and-legal D-10). Each host skill SHALL point to its
file. A skill that hosts a workflow is an activity skill; any other skill is a know-how skill
(named-workers-and-legal DEC-3).

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

#### Scenario: Looking up the contract workflow
- **WHEN** a contributor looks for the contract phases the band uses
- **THEN** `contract-practice` points to its workflow file, whose phases are intake, draft, align,
  review, negotiate, sign and harvest, and which declares no gates

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
(lean-delivery DEC-13). Release work SHALL always run the release workflow: the release commands
its workflow file lists (creating a `release/` or `hotfix/` branch, `gh release create`, pushing a
version tag) SHALL activate it whether or not `meaningfy-release` was loaded, and the band SHALL ask
for the skill while it is not (navigator-follows-the-work DEC-5, Q-19).

#### Scenario: A shaping session sees only shaping
- **WHEN** a session loads `epic-planning` and the change has no tasks yet
- **THEN** the band shows the six epic-shaping phases and none of ready, apply, accept or archive

#### Scenario: A delivery session on an unstarted PLAN keeps the clarity check
- **WHEN** a fresh session opens on a change with a PLAN and no task ticked, and loads `epic-delivery`
- **THEN** the band is placed in `ready`, then enters `apply` and warns while the clarity gate has not passed

#### Scenario: Architecture hands over to modelling
- **WHEN** an architecture session reaches the `domain` phase and the person presses **Next step**
- **THEN** `conceptual-modelling` runs, and the band shows the modelling workflow from `elicit`

#### Scenario: Release commands start a release
- **WHEN** a session creates a `release/1.0.0` branch, runs `gh release create v1.0.0` or pushes a `v1.0.0` tag without loading `meaningfy-release`
- **THEN** the release workflow activates and the band warns that `meaningfy-release` is not loaded

#### Scenario: A local tag is not a release
- **WHEN** a session runs `git tag v1.0.0` without pushing it, or deletes a tag
- **THEN** the release workflow does not activate

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

### Requirement: Every default workflow has one lead worker
Each default workflow file SHALL have exactly one lead worker: an agent whose primary skill is the
workflow's `owner` and whose type is `lead`, or `scheduled` with a human session among its inputs.
The lead worker SHALL be named in the workflow's `activate.agents`. A `lead` agent's primary skill
SHALL host a default workflow. `make validate` SHALL check both and name the file and the agents
on failure (named-workers-and-legal DEC-11, D-3, D-4).

#### Scenario: The release workflow and its lead
- **WHEN** the validator reads `release.workflow.json` (owner `meaningfy-release`)
- **THEN** it finds exactly one lead worker, `release-manager`, named in `activate.agents`

#### Scenario: A workflow with no lead worker
- **WHEN** a default workflow's owner is the primary skill of no `lead` agent and of no `scheduled`
  agent that offers a human session
- **THEN** `make validate` fails, naming the workflow file

#### Scenario: Two lead workers
- **WHEN** two `lead` agents have the same workflow-hosting primary skill
- **THEN** `make validate` fails, naming the file and both agents

#### Scenario: A scheduled agent leads sales
- **WHEN** the validator reads `sales.workflow.json`
- **THEN** `sales-agent` (scheduled, offers a human session, primary `sales-operations`) is its lead
  worker and no error is reported

#### Scenario: A lead with a know-how primary skill
- **WHEN** a `lead` agent's primary skill hosts no workflow
- **THEN** `make validate` fails, naming the agent

### Requirement: Repository events move the epic-delivery phase
The epic-delivery phase SHALL move on what happens to the followed change: all tasks ticked enters
`accept`; the followed branch's pull request merged, or the change folder moved into `archive/`,
enters `archive`. When the followed change becomes another change, the phase SHALL be placed from
the new change's files, with no leave or enter warnings, and the old change's gates and warnings
SHALL leave the view (navigator-follows-the-work DEC-5, DEC-6).

#### Scenario: A merged pull request
- **WHEN** the session runs `gh pr merge` and the followed branch's pull request is then merged
- **THEN** the phase is `archive`

#### Scenario: An archived change
- **WHEN** the followed change's folder is moved into `openspec/changes/archive/` on the followed branch
- **THEN** the navigator still follows that change and the phase is `archive`

#### Scenario: Moving to the next change
- **WHEN** the lead moves from a merged change to a worktree whose branch names `release-pipeline`, with 2 of 5 tasks ticked
- **THEN** the band follows `release-pipeline` in `apply`, shows none of the previous change's gates or warnings, and raises no leave or enter warning

### Requirement: A lead session shows its workflow
Every default workflow that names a lead worker SHALL activate when a session's first act is
loading that lead's primary skill (named-workers D-15; navigator-follows-the-work DEC-14, #188).

#### Scenario: A lead session
- **WHEN** a session runs a lead worker that owns a default workflow and the lead loads its primary skill
- **THEN** the band shows that workflow and a phase of it (the phase the workflow opens in, D-27)

