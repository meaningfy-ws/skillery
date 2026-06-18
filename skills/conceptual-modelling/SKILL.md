---
name: conceptual-modelling
description: Build and evolve a living, representation-agnostic conceptual model for a product (programming) project, and generate code/contracts from it deterministically. Use to model the domain, write a LinkML schema, set up a conceptual model, generate Pydantic/JSON Schema/OWL/SHACL from the model (`make generate-models`), manage ontology URIs/IRIs and vocabulary reuse, or run terminology/definitions management. Trigger on "model the domain", "write a LinkML schema", "generate models", "generate Pydantic/OWL/SHACL from the model", "set up conceptual model", "ontology / terminology management", "ubiquitous language glossary". Conditional: applies to product-development repos that build software; a doc-only/non-product repo does not need it.
license: Apache 2.0
metadata:
  category: engineering
---

# Conceptual Modelling

> **Provisional pending the first-engagement gate.** This skill's consulting-facing depth will be refined
> after the first real engagement that builds a domain model; treat the wiring here as the floor.

## Overview

The **conceptual model** is the single, living, representation-agnostic definition of the domain:
entities, attributes, relationships, and their meaning. It is *generative* — code, contracts, and
documentation are derived **deterministically** from it, never hand-maintained in parallel. The
generation layer is a `make generate-models`-style bridge that stays **outside the LLM path** (the
principled answer to spec-drift and failed model-driven development): the LLM authors the *source*,
a deterministic toolchain renders the *targets*.

**Conditional.** This skill applies only to **product-development (programming) projects** — repos
that build software with a domain to model. A documentation-only or non-product repo does not need a
conceptual model and should not scaffold one.

This skill **owns the model**; it does not own system topology, code layering, or normative
requirements — see [Boundary & Related Skills](#boundary--related-skills).

## Where the model lives (two modes)

The model is a first-class asset with a home of its own. Pick the mode explicitly:

- **In-project `model/` directory (default).** This is what `project-setup` scaffolds by default
  (EPIC-09): the model lives beside the code it generates, versioned with the repo. Generated
  artefacts land under the relevant package (e.g. `models/`, see `cosmic-python`) via
  `make generate-models`. Use this for a model owned by one product.
- **Own repo / imported library.** For a model shared across repos, give it its **own repository**
  and import it as a dependency (LinkML schema published as a package, or generated artefacts
  released as a versioned library). Each consuming repo regenerates from the pinned version.

**Golden-thread implication.** Model entities carry stable IDs (see ontology practices). When the
model lives in its own repo, downstream code and specs **cite those entity IDs across repos** — the
cross-repo rung of the golden thread (see [`../../spine/golden-thread.md`](../../spine/golden-thread.md),
which notes cross-repo IDs are convention-only for now).

## The source: LinkML by default, not by default-only

**LinkML is the wired default source** for the model. It is declarative, generates many targets, and
is the canonical domain-definition format the `architecture` skill already references for contracts.

Choosing the source is an **explicit decision point — never silently defaulted**:

- **LinkML (default)** — author the schema directly; drives all generators below.
- **model2owl** — a UML-driven ontology-engineering path with strong **OWL, SHACL, and HTML**
  generators. In some projects model2owl is used to *generate LinkML artefacts*, which then drive
  the other generators — so **model2owl can be a prerequisite step *before* the LinkML generators**,
  not an alternative to them. Surface this ordering when a project models in UML.
- **Other ontology-engineering tooling** exists (Protégé/OWL-first, SHACL-first, etc.); document the
  chosen one as a named pattern.

We deliberately do **not** build a source-adapter abstraction (YAGNI) — alternatives are documented
as named patterns, not wired behind an interface. See
[`references/generators.md`](references/generators.md) and
[`references/ontology-practices.md`](references/ontology-practices.md).

## Deterministic multi-target generation

From the (LinkML) source, generate multiple targets deterministically through `make generate-models`.
Generation is **outside the LLM path** — reproducible, diffable, CI-checkable (regenerate and fail on
drift, exactly like other schema-based codegen).

**Wired and tested — first-class (the semantic core Meaningfy sells):**

| Target | What it is |
|--------|-----------|
| **Python (Pydantic)** | Typed domain classes consumed by the code |
| **JSON Schema** | Validation / interchange contract |
| **OWL** | Formal ontology (semantics, reasoning) |
| **SHACL** | Shape constraints for RDF data validation |

**Documented as patterns — enable on demand (do not gold-plate all of these):** TypeScript types,
SQL DDL / SQLAlchemy ORM, Markdown/HTML docs, and authoring a **custom generator**. See
[`references/generators.md`](references/generators.md) for the `make generate-models` wiring, the
model2owl-as-prerequisite flow, and the custom-generator recipe.

**The seam to `cosmic-python`.** The model **owns the contract**; the generated Pydantic/JSON Schema
*is* the contract. A service's `entrypoints/api` **consumes** the generated contract — it does not
redefine the domain. This is the same `make generate-models` bridge `cosmic-python` and `architecture`
already name; this skill owns what sits on the source side of it.

## The craft around the model

A model is more than a schema. Two adjacent practices are part of the discipline:

- **Diagrams alongside the formal model.** Generate/maintain **Mermaid** (and other) diagrams from
  or beside the model so the human view and the formal view stay in step. Architecture's C4/UML
  class diagrams are a *consumer* of the same domain concepts — keep them coherent, but the formal
  source of truth is the model.
- **Terminology, disambiguation, and definitions management.** The glossary / ubiquitous-language
  layer: every model class is a term with a definition, and OpenSpec specs reference those classes
  as **ubiquitous language**. See [`references/terminology-management.md`](references/terminology-management.md).

## Boundary & Related Skills

**This skill OWNS:** the living conceptual model (representation-agnostic source of domain truth);
deterministic multi-target generation from it (`make generate-models`); ontology engineering
(stable URIs/IRIs, naming, modularity, vocabulary reuse); and terminology / definitions / glossary
management (ubiquitous language).

**This skill DELEGATES:**
- System/solution architecture — C4 levels, ADRs, the contract-first *order of artifacts* →
  [`../architecture/SKILL.md`](../architecture/SKILL.md). Architecture authors *which* contracts
  exist; this skill owns the domain model that backs them.
- Code layering and what consumes the generated contract →
  [`../cosmic-python/SKILL.md`](../cosmic-python/SKILL.md). `entrypoints/api` *consumes* the
  generated contract; this skill owns the model that produces it.
- Normative requirements and the spec spine → the spine specs (see
  [`../../spine/README.md`](../../spine/README.md)). Model classes are *ubiquitous language*
  that specs reference; specs state the *rules*.

**Conditional:** product-development (programming) projects only — see the Overview.

**Related:** `architecture`, `cosmic-python`.
