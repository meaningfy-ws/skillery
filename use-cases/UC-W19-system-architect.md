---
id: UC-W19
title: System architect
primary_actor: a Meaningfy architect
trigger: a new system is to be designed
success_guarantee: the system has its use cases, architectural decisions and system diagrams before code is written
area: coding
served_by:
  agents:
  - system-architect
  skills:
  - architecture
status: covered
---

# UC-W19 System architect

## Brief Description

System architect: design a new system first; use cases, architectural decisions, system diagrams. Served by the `system-architect` agent.

## Stakeholders and Interests

- **The architect:** decisions they can defend.
- **The developers:** a design they can build from.
- **The client:** a system that fits their landscape.

## Preconditions

The system's goal and its main actors are known.

## Minimal Guarantees

Nothing is written that the user has not agreed; the decisions already agreed stay recorded.

## Main Success Scenario

1. The user describes the system to design.
2. The agent states its view and plan.
3. **[human]** The agent drafts the system's use cases; the user agrees.
4. **[human]** The agent drafts the architectural decisions as ADRs; the user agrees.
5. **[human]** The agent draws the context and container diagrams; the user agrees.
6. The agent hands the design over to the implementer.

## Extensions

- 1a. The system's goal or main actors are unclear: the agent asks for them before planning, and
  the use case restarts at 1.
- 3a. The user does not agree a draft (use cases, decisions or diagrams): the agent revises it, or
  asks what is missing; nothing is written until the user agrees.
- 4a. A decision needs an option the user has not chosen: the agent returns the options and their
  trade-offs, and asks.
- 4b. The decision depends on the detailed domain model: the agent names the
  `conceptual-modeller` (UC-W20) and keeps the model at sketch depth.
- 6a. The user asks the agent to write the code: it refuses and returns the work to the
  `implementer` (UC-W18).
- 6b. Existing architecture artefacts are to be reshaped: the agent reads them at 2 and keeps the
  agreed decisions that still hold.

## Out of Scope

Writing code and the build loop (UC-W18), the detailed conceptual model (UC-W20), code structure
inside a service (`cosmic-python`), and the infrastructure the system runs on (UC-W6).

## Artefacts

- The system's use cases, written to the Cockburn convention the `architecture` skill teaches, in
  the project's architecture documentation; read by the developers and by `bdd-gherkin` when it
  derives scenarios.
- The architectural decisions as ADRs on the template the `architecture` skill owns, read by the
  architect, the developers and later reviewers.
- The context and container diagrams (C4 levels 1 and 2), referenced from the documentation;
  read by the developers and the client.

## Evidence

- `tests/features/agents/system-architect.feature`: each step announced, agreed and then produced;
  nothing unagreed written; the design handed over, not implemented; work outside the
  architecture refused.
- The artefacts exist and each ADR follows the `architecture` template (checked by reading).
- Planned: an outcome suite for the `meaningfy-architecture` bundle (`evaluate-catalogue`).

## Feedback Loop

A design the architect rewrote, or a decision the agent should have asked about, becomes a Defect
issue (`.github/ISSUE_TEMPLATE/defect.yml`); it ends as a fix in `architecture` or
`modelling-conventions`, or a scenario row in `system-architect.feature`. A decision that proved
wrong in the build comes back through the lessons loop (`docs/development/lessons-loop.md`).

## Slices

1. Use cases, ADRs, context and container diagrams with the user: released (`system-architect`,
   `architecture`, `modelling-conventions`, `conceptual-modelling` in `meaningfy-architecture`).
2. Component and code levels, contracts (OpenAPI, AsyncAPI, LinkML): released as method in
   `architecture`; the agent's steps stop at the container level.

## Open Points

**Confidence:** high. The owner approved the first four sections on 2026-10-26, and the agent and
its feature file exist.

- Where do the architecture artefacts live in a project (`docs/architecture/`, Antora, Enterprise
  Architect), and does `project-setup` scaffold that place?
- What does the hand-over at step 6 consist of: an EPIC seed for `epic-planner`, or the artefacts
  alone?
