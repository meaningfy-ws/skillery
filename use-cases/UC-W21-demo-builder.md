---
id: UC-W21
title: Demo builder
primary_actor: a Meaningfy pre-sales consultant
trigger: a prospect needs a demo
success_guarantee: a working demo exists on a demo domain with synthetic data, showing the interaction through the chosen tools
area: sales
served_by:
  agents: []
  skills: []
status: missing
change: add-demo-builder
---

# UC-W21 Demo builder

## Brief Description

Demo builder: quick demos in Neo4j, GraphWise or others, synthetic data on a demo domain, interaction shown through metaphacts, Linkurious and AI agents.

## Stakeholders and Interests

- **The pre-sales consultant:** a convincing demo, built fast.
- **The prospect:** to see a problem like theirs solved on data that looks like theirs.
- **The owner:** demos that can be reused, and no client data in any demo.

## Preconditions

The prospect's domain and question are known from qualification (UC-W10). The consultant has access
to a demo environment for the chosen stack (Neo4j, GraphWise or another store; metaphacts,
Linkurious or an AI agent for the interaction).

## Minimal Guarantees

Only synthetic data is used. No environment is changed outside the demo's own space. Nothing is shown
to the prospect without the consultant.

## Main Success Scenario

1. The consultant names the prospect's domain, the question the demo must answer and the stack.
2. The agent proposes a demo story: the question, a small model, the data and the moments to show.
3. **[human]** The consultant approves the story.
4. The agent builds a small conceptual model of the demo domain.
5. The agent generates synthetic data that fits the model and the story.
6. The agent loads the model and data into the chosen store and wires the interaction layer.
7. The agent runs the demo script end to end and returns the steps and what each one shows.
8. **[human]** The consultant rehearses and presents the demo.

## Extensions

- 1a. A demo for the domain already exists: the agent adapts it instead of starting again.
- 6a. The agent has no access to the environment: it returns the model, the data and the load
  scripts for the consultant to load.
- 7a. A step fails: the agent fixes it or removes it from the script, and says which.

## Out of Scope

Qualifying the prospect (UC-W10), the offer (UC-W8), the production conceptual model (UC-W20) and
building the client's real solution (UC-W18).

## Artefacts

- Planned: the demo package (model, synthetic data, load scripts, demo script); where it is kept is
  open. Read by the consultant and reused for later demos.
- Planned: the running demo on a demo instance of the chosen stack.
- Planned: the `demo-builder` agent and the demo-scaffolding skill (`add-demo-builder`).

## Evidence

- Planned: Gherkin scenarios and an outcome suite (`add-demo-builder`).
- The demo script runs end to end on a fresh environment, and the data holds no real names (checked
  on the artefact).

## Feedback Loop

A demo that failed in front of a prospect, or a question it could not answer, becomes a Defect issue;
it ends as a change to the scaffolding or the story template. Demos that worked are kept as examples.

## Slices

1. A graph demo with synthetic data on one store: planned (`add-demo-builder`). The modelling step can
   lean on the released `conceptual-modelling` skill.
2. Interaction through metaphacts, Linkurious or an AI agent: planned (`add-demo-builder`).

## Open Points

**Confidence:** low. The owner named the stacks and the synthetic-data rule; the steps, the slices and
the artefact are a first guess.

- Which stack and which demo domain come first, and who hosts the demo environments?
- Where are demos kept so they can be reused: a demo repository, or elsewhere?
