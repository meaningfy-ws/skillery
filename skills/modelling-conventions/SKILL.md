---
name: modelling-conventions
description: The shared, representation-agnostic modelling craft reused across the modelling skills — naming discipline, modelling anti-patterns, and the guardrails a modeller follows while working, plus the two load-bearing principles (decouple attributes into reusable first-class properties; identify everything by a stable URI, implicit by default). Use when authoring or reviewing ANY model regardless of representation (conceptual, UML, LinkML, ontology). Trigger on "modelling conventions", "naming conventions for a model", "modelling anti-patterns", "reusable properties/slots", "should this attribute be shared", "URI/identity discipline", "review this model for smells". This is the cosmic-python-style reuse layer for modelling — cited by conceptual-modelling and linkml-engineering, never restated by them.
license: Apache 2.0
metadata:
  purpose: modelling
  area: coding
  subject: modelling
  posture: reusable
  stage: design
  maturity: stable
---

# Modelling Conventions

A model drifts when attributes are copied per class, identity is added late and meaning leaks into
strings and code. This skill holds the conventions true of a good model in any representation
(conceptual, UML, LinkML, OWL), stated once for every modelling skill to cite. It carries principles;
the syntax that realises them belongs to the skill that owns the representation.

## Quick Start

**Input:** review a draft where `Invoice.issueDate` and `CreditNote.issue_date` are both strings,
`status` is a free string ("draft", "Issued") and `Invoice` also carries street, city and postcode.

**Output, as findings:**
- one reusable property `issued_at` (a moment in time, defined once, referenced by both classes);
- `status` becomes an enumeration with a definition per value;
- street, city and postcode become an `Address` value object, referenced;
- every class and property gets a conceptual definition and an implicit URI from the model's
  namespace.

## Rules

**1. Decouple attributes from classes.** An attribute is a concept in its own right, with its own
meaning, definition and identity, that classes reference. Define it once; the moment the same
meaning appears on a second class, an inline copy is duplication that will drift. Reuse is by
meaning, not by spelling. This is what lets an OWL/SHACL target treat properties as first-class.

**2. Identify everything by a stable URI, implicit by default.** Every class, property and
enumeration value has a URI minted once at authoring time and kept when the element is renamed or
moved. It derives from the model's namespace plus the element's name; write it explicitly only when
a specific value is required, chiefly when reusing a published vocabulary term. A model identified
this way renders to OWL and SHACL completely, with no identity retrofitted; identity is a modelling
decision, not a serialisation detail.

Read `references/naming-and-identity.md` when naming an element, writing a definition or minting
identity: it holds the property rules, the naming discipline, the conceptual-definition rule and the
identity rules (opaque, permanent, reuse before minting).

Read `references/anti-patterns.md` when reviewing a model for smells: it holds each modelling
anti-pattern (free strings for closed sets, god-class, validation in code, redefined attributes,
late identity, missing definitions, flattened value objects) with its fix.

## Before you hand over

Read `references/editor-guardrails.md` while adding or changing any modelled element: it holds the
per-edit checklist and how each check graduates into a linter, a review finding or a CI gate.

| Question | If not | Action |
|---|---|---|
| Is every recurring attribute one reusable property? | meaning drifts between copies | promote it now |
| Does every element resolve to a stable URI, explicit only for a reused term? | semantic targets cannot be generated cleanly | mint the namespace; derive identity |
| Is every closed set an enumeration? | the set lives in code | model the set |
| Does every class and property have a conceptual definition? | the model is no ubiquitous language | write it |
| Is every constraint declared in the model? | the contract scatters into code | move it into the model |

## Boundary & Related Skills

**Owns:** the representation-agnostic modelling conventions, the modelling anti-patterns, the editor
guardrails, and the two principles above stated as principles.

**Delegates:**
- the living conceptual model, UML conceptual modelling, terminology and the model-source decision
  → `conceptual-modelling`;
- the LinkML mechanics that realise these principles (top-level `slots:`, the URI-as-datatype
  artifice, generation) → `linkml-engineering`;
- any other representation-specific mechanics (UML profiles, OWL axioms) → the skill owning that
  representation.

See also `architecture` for the system notations above a domain model, and `cosmic-python` for the
same reuse-layer pattern applied to code.

**Related:** `conceptual-modelling`, `linkml-engineering`.

Answers `VER` in `test-strategy`'s matrix (`references/modelling.md`).
