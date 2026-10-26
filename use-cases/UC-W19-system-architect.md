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
3. The agent drafts the system's use cases; the user agrees.
4. The agent drafts the architectural decisions as ADRs; the user agrees.
5. The agent draws the context and container diagrams; the user agrees.
6. The agent hands the design over to the implementer.
