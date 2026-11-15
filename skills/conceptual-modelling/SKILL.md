---
name: conceptual-modelling
description: "Build and evolve a living, representation-agnostic conceptual model for a product (programming) project — the domain's entities, attributes, relationships, and meaning — and choose how it is rendered. Use to model the domain, do conceptual data modelling in UML, run ontology-engineering at the concept level (stable-IRI policy, vocabulary reuse), decide the model *source* (LinkML directly vs model2owl-first), set up a conceptual model, or run terminology/definitions/glossary management. Trigger on \"model the domain\", \"conceptual/UML data model\", \"set up conceptual model\", \"which model source\", \"ontology/terminology management\", \"ubiquitous language glossary\". For the LinkML craft itself (authoring, generation, gates) see linkml-engineering; for generic modelling conventions see modelling-conventions. Conditional: applies to product-development repos that build software; a doc-only/non-product repo does not need it."
license: Apache 2.0
metadata:
  purpose: modelling
  area: coding
  subject: modelling
  posture: precise
  stage: design
  maturity: stable
---

# Conceptual Modelling

> **Provisional pending the first-engagement gate.** This skill's consulting-facing depth will be refined
> after the first real engagement that builds a domain model; treat the wiring here as the floor.

The conceptual model is the single, living definition of the domain: entities, attributes,
relationships and their meaning. Left alone, an agent writes the domain straight into code, contracts
and docs in parallel, and they drift; here the model is the source, and every artefact is generated
from it deterministically, outside the LLM path. Only product (programming) projects need it; a
documentation-only repo does not scaffold one.

## Quick Start

**Input:** "model the tendering domain for the new procurement service".

1. Elicit `Tender`, `Lot` and `Bid` with the developer, each with a definition a domain reader
   understands; `Lot` is part of a `Tender`.
2. Decide the source with the team: they model in UML, so model2owl first, then the LinkML
   generators; record the decision.
3. Put the model in `model/` and run `make generate-models`.
4. Validate: example instances from two real tenders, the competency question "which lots belong to
   tender t1?" with its agreed answer, and a domain expert's review recorded in `evidence/`.

**Output:** a model in `model/` with defined terms, a recorded source decision, generated contracts,
and validation kept as tests.

## Workflow

The navigator mod tracks these phases from
[`assets/workflows/modelling.workflow.json`](assets/workflows/modelling.workflow.json).

1. **Elicit** each concept with a definition for a domain reader; the developer confirms it.
2. **Model** in the chosen source, applying `modelling-conventions`; the source decision is recorded.
3. **Generate** through `make generate-models` (the craft is `linkml-engineering`'s).
4. **Validate**, as below.

### Model validation

Validation checks that the model means what the domain means. The modeller prepares it; the domain
expert and the developer decide. It runs when the model changes, while shaping; when it runs in a
delivery is `epic-delivery`'s.

1. **Example instances.** For each aggregate, instances taken from real cases (anonymised where
   needed), written as data of the model's classes.
2. **Competency questions.** The domain questions the model must answer, each written as a query
   over the example instances with its expected answer. How to run them as exact tests is
   `formal-reasoning`'s.
3. **Domain-expert review.** A person who knows the domain reads the diagrams and the examples, and
   confirms that each class and property means what the domain means.

Once validated, the instances and the questions are kept as tests, so they go on verifying the
model. The review's record goes to `evidence/` in the change.

## Rules

**Where the model lives: pick the mode explicitly.**
- In-project `model/` (the default `project-setup` scaffolds), for a model one product owns;
  generated artefacts land in the package (`models/`, see `cosmic-python`) through
  `make generate-models`.
- Its own repository, imported as a dependency (a published LinkML package or a versioned library of
  generated artefacts), for a model shared across repos; each consumer regenerates from the pinned
  version, and downstream code and specs cite the model's entity IDs across repos (the cross-repo rung
  of the golden thread, owned by `epic-planning`; convention only for now).

**The source is an explicit decision, never silently defaulted.** LinkML is the wired default;
model2owl first when the team models in UML (it generates the LinkML that drives the other
generators, a prerequisite stage, not an alternative); other OWL-first tooling as a documented named
pattern. No source-adapter abstraction (YAGNI). Read `references/ontology-practices.md` when
deciding the source, the namespace, the modules or the vocabularies a model aligns to: it holds the
source-decision table and the concept-level ontology policy.

**Generation is deterministic.** This skill owns that the model becomes artefacts by a reproducible,
diffable, CI-checked toolchain; the LinkML authoring, generator wiring, templates and gates are
`linkml-engineering`'s. The model owns the contract: the generated Pydantic and JSON Schema are the
contract, and a service's `entrypoints/api` consumes it, never redefines the domain.

**Diagrams beside the model.** Generate or keep Mermaid (and other) diagrams from or beside the model,
so the human and formal views stay in step; architecture's C4 and UML diagrams consume the same
concepts, but the model is the source of truth.

**The model is the glossary.** Every class is a term with a definition, and OpenSpec specs reference
model classes as ubiquitous language. Read `references/terminology-management.md` when defining,
disambiguating or renaming a term, or when a spec uses an unmodelled term: it holds the definition,
disambiguation and ubiquitous-language rules.

## Before you hand over

| Question | If not | Action |
|---|---|---|
| Does every class and property have a definition the developer confirmed? | the elicit phase is not done | confirm with the developer |
| Is the source decision recorded? | the source was defaulted | decide with the team, record it |
| Does `make generate-models` exit cleanly, the diff only where expected? | the model does not generate | fix the model, not the output |
| Do example instances and competency questions with agreed answers exist? | the model is unvalidated | write them |
| Is the domain expert's review in `evidence/`? | meaning is unconfirmed | get the review |

## Boundary & Related Skills

**Owns:** the living conceptual model; conceptual data modelling in UML; the concept-level ontology
policy (stable-IRI policy, modularity, which vocabularies to reuse); the model-source decision
(LinkML-direct or model2owl-first); terminology, definitions and glossary management; model
validation.

**Reuses:** the representation-agnostic craft (reusable-property and URI-everywhere principles,
naming, anti-patterns, guardrails) from `modelling-conventions`; this skill applies it, never
restates it.

**Delegates:**
- the LinkML craft (authoring, generation, templates, quality gates, per-module output) →
  `linkml-engineering`;
- system and solution architecture (C4, ADRs, which contracts exist) → `architecture`;
- competency-question tests and exact reasoning over the model's facts → `formal-reasoning`;
- normative requirements → the OpenSpec specs (`openspec/specs/`): model classes are the ubiquitous
  language specs reference, specs state the rules.

Code layering and the consumption of the generated contract belong to the related skill
`cosmic-python`.

**Related:** `modelling-conventions`, `linkml-engineering`, `architecture`, `cosmic-python`,
`formal-reasoning`, `epic-delivery` (when model validation runs in a delivery).

Answers `VAL, ADQ` in `test-strategy`'s matrix (`references/modelling.md`).
