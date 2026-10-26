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
3. The agent and the user choose the model source (LinkML or model2owl-first).
4. The agent proposes concepts and relationships in rounds; the user agrees each round.
5. The agent applies the modelling conventions.
6. The agent writes and renders the model.
