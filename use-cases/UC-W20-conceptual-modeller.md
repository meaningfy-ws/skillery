---
id: UC-W20
title: Conceptual modeller and ontology engineer
primary_actor: a Meaningfy modeller
trigger: a domain is to be modelled or a model to be evolved
success_guarantee: the domain has a model-driven, data-centric conceptual model, built with LLM assistance
area: coding
served_by:
  agents:
  - conceptual-modeller
  skills:
  - conceptual-modelling
  - modelling-conventions
  - linkml-engineering
status: covered
---

# UC-W20 Conceptual modeller and ontology engineer

## Brief Description

Conceptual modeller and ontology engineer, LLM-assisted, model-driven, data-centric; the owner has new ideas from recent talks. Served by the `conceptual-modeller` agent.

## Stakeholders and Interests

- **The modeller:** a semantically sound model.
- **The developers:** a model they can generate from.
- **The domain experts:** their own terms kept.

## Preconditions

The domain and at least one source of its terms are available.

## Minimal Guarantees

The existing model is never left half-edited; every term change is agreed first.

## Main Success Scenario

1. The user names the domain to model.
2. The agent states its view and plan.
3. **[human]** The agent and the user choose the model source (LinkML or model2owl-first).
4. **[human]** The agent proposes concepts and relationships in rounds; the user agrees each round.
5. The agent applies the modelling conventions.
6. The agent writes and renders the model.

## Extensions

- 1a. No source of the domain's terms is available: the agent asks for one (a glossary, a
  standard, sample data, an expert), and the use case restarts at 1.
- 1b. A model already exists: the agent reads it at 2 and proposes the change it needs, not a new
  model.
- 3a. The user is unsure of the source: the agent returns the trade-off between LinkML directly and
  model2owl-first, and the user decides.
- 4a. The user rejects a proposed term or structure: the model stays whole as it was, and the agent
  proposes again or asks.
- 4b. Two sources name one concept differently: the agent records both terms and the user decides
  which is preferred.
- 6a. The user asks for system architecture or application code: the agent refuses and names the
  `system-architect` (UC-W19) or the `implementer` (UC-W18).

## Out of Scope

System architecture and its decisions (UC-W19), application code and the build loop (UC-W18), and
the LinkML generator wiring beyond the model itself (owned by `linkml-engineering` in the build).

## Artefacts

- The conceptual model in its agreed source (a LinkML schema, or a UML model for model2owl), in the
  project's `model/` directory by default; read by the developers, who generate from it, and by the
  domain experts.
- The glossary of terms and definitions, read by the domain experts and the team.
- The rendered views (diagrams, OWL, SHACL, HTML) produced from the source, read by the developers
  and the client.

## Evidence

- `tests/features/agents/conceptual-modeller.feature`: the model built step by step with the
  user's agreement; a rejected term change leaves the model whole; work outside the model refused.
- The model validates in its toolchain (the gates `linkml-engineering` names).
- Planned: an outcome suite for the `meaningfy-architecture` bundle (`evaluate-catalogue`).

## Feedback Loop

A term the experts rejected, or a convention the model broke, becomes a Defect issue
(`.github/ISSUE_TEMPLATE/defect.yml`); it ends as a fix in `modelling-conventions` or
`conceptual-modelling`, or a scenario row in `conceptual-modeller.feature`. The owner's new ideas
from recent talks come in as Request issues and are shaped as an EPIC.

## Slices

1. Model a domain with the user, choose the source, apply the conventions: released
   (`conceptual-modeller`, `conceptual-modelling`, `modelling-conventions`, `linkml-engineering`
   in `meaningfy-architecture`).
2. The owner's new LLM-assisted, model-driven ideas: not yet a change; to be shaped.

## Open Points

**Confidence:** high. The owner approved the first four sections on 2026-10-26, and the agent and
its feature file exist.

- Which of the new ideas from the recent talks should change this use case, and which belong in a
  new one?
- When the source is model2owl-first, who renders the UML model: the agent, or the modeller in
  their own tool?
