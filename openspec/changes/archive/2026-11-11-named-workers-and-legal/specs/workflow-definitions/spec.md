## MODIFIED Requirements

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

## ADDED Requirements

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
