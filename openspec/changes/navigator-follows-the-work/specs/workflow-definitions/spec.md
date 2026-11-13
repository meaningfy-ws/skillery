## ADDED Requirements

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

## MODIFIED Requirements

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
