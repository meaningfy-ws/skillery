---
name: linkml-engineering
description: The operational LinkML craft, downstream of an existing model or spec — never greenfield. Use to derive a LinkML schema from a UML model, a text spec, a model2owl output, or another existing model; to author/refine it (reusable slots, the URI-as-datatype artifice, implicit class_uri/slot_uri, enums, schema-level constraints); to generate the full target set (Pydantic/JSON Schema/OWL/SHACL/TS/SQL) with custom templates and make-target automation including diagrams; and to establish LinkML quality gates. Trigger on "write/derive a LinkML schema", "generate models/OWL/SHACL from LinkML", "custom Pydantic template", "LinkML quality gates", "per-module generation", "make generate-models". Reuses modelling-conventions for generic craft; defers the model concept to conceptual-modelling. Not an ontology-authoring skill.
license: Apache 2.0
metadata:
  purpose: modelling
  area: coding
  subject: semantic-data
  posture: precise
  stage: design
  maturity: stable
---

# LinkML Engineering

LinkML is the pivot from which a deterministic toolchain renders Pydantic, JSON Schema, OWL, SHACL,
docs and diagrams. Left alone, an agent authors a schema from nothing, hand-writes URIs, edits
generated files and mutes the linter; this skill derives the schema from an existing model and keeps
generation outside the LLM path. With no model yet, `conceptual-modelling` comes first.

## Quick Start

**Input:** a UML model where `Invoice` and `CreditNote` both carry an `issueDate`, and `status` is a
free string with values DRAFT and ISSUED.

1. Derive: model2owl's LinkML output is the draft. Ask the user for the `default_prefix` (`dom:`).
2. Refine: one top-level slot `issued_at` (`range: datetime`, `required: true`, a conceptual
   `description`) referenced by both classes; an enum `DocumentStatus` with a description on each
   value; no `class_uri` written by hand.
3. Generate: `make generate-models`; the diff touches only the invoice modules.
4. Guard: `make check-models` passes; `linkml-lint` reports nothing.

**Output:** the YAML and the regenerated artefacts in one commit, and OWL in which `dom:issued_at` is
one property with domain, range and definition.

## Workflow

1. **Derive** the draft from the upstream source. Read `references/deriving-linkml.md` when you start
   from a UML model, a text spec, a model2owl output or another schema: it gives the entry point and
   the mapping for each.
2. **Author and refine** with LinkML's own constructs. Read `references/authoring-mechanics.md`
   before writing or reviewing any schema element: it holds the mandatory header, reusable slots and
   `slot_usage`, implicit URIs, the URI-as-datatype artifice, the slot contract, enums as SKOS and the
   class-design rules.
3. **Author for complete OWL/SHACL**, even when the project ships only JSON, Python or a database.
   Read `references/owl-shacl-completeness.md` when checking a schema or its generated semantics: it
   holds what MUST be present in the OWL and in the SHACL.
4. **Generate** through `make` only. Read `references/generation-and-templates.md` when wiring or
   changing generation: it holds the `make generate-models` bridge, the strict-base Pydantic template,
   per-module output, the enable-on-demand targets and the Neo4j generators in `scripts/linkml_neo4j/`.
5. **Guard** with gates chosen with the user, not imposed. Read `references/quality-gates.md` when
   setting up or reviewing a project's gates: it gives the candidate table, the lint rules and the
   freshness check.

The working loop, for every change: find the schemas folder and its `make` target; edit the YAML
only; lint (warnings not muted) and fix; regenerate; review the generated diff (only what you
expected); validate the inline examples and run the tests; commit the YAML and the regenerated
artefacts together, never separately.

## Rules

### Common mistakes

| Mistake | Why it fails | Do instead |
|---|---|---|
| Editing a generated file | the next regeneration wipes it; the freshness gate fails | change the YAML or the template |
| Running a generator ad hoc | output is not reproducible | add or use a `make` target |
| A validation in Python that the schema can state | the contract drifts from the model | `pattern`, bounds, `required`, `unique_keys` in the YAML |
| A bare `string` where a closed set fits | the set lives in code, spellings diverge | an `enum` with described values |
| Muting the linter | every convention it enforces is lost | fix what it reports |
| Committing model changes without regenerating | the code no longer matches the YAML | regenerate and commit both together |
| Hand-written `class_uri` everywhere | identity stops being systematic | implicit URIs; explicit only for a reused term |

## Before you hand over

| Question | If not | Action |
|---|---|---|
| Does every class, slot and enum value have a conceptual `description`? | OWL/SHACL ship empty semantics | write them |
| Is `default_prefix` set, and was the user asked for it? | implicit URIs are wrong or missing | ask, then set it |
| Does `make check-models` pass after `make generate-models`? | generated code drifted | regenerate, commit both |
| Does `linkml-lint` pass without muting? | conventions are unenforced | fix the findings |
| Was the gate set chosen with the user and recorded? | gates are folklore | run the selection |

## Boundary & Related Skills

**Owns:** deriving LinkML from an existing source; the LinkML authoring mechanics; complete and
correct OWL/SHACL generation; custom generator templates and `make` automation, diagrams included;
per-module generation; the guided quality-gate process.

**Reuses:** the generic modelling craft (reusable-property and URI-everywhere principles,
anti-patterns, naming, guardrails) from `modelling-conventions`; this skill states the LinkML
mechanism, not the principle.

**Delegates:**
- the representation-agnostic model, UML modelling, terminology and the LinkML-vs-model2owl source
  decision → `conceptual-modelling`;
- competency-question tests over fixture facts (reasoning, not a LinkML gate) → `formal-reasoning`.

Where the generated contract is consumed (a service's `entrypoints/api`) is the related skill
`cosmic-python`; scaffolding the gates, automation and per-module layout into a repo is the related
skill `project-setup`'s.

**Conditional:** product projects that use LinkML; a project modelling only in OWL or UML does not
need it.

**Related:** `modelling-conventions`, `conceptual-modelling`, `architecture`, `cosmic-python`,
`project-setup`, `formal-reasoning`.

Answers `VER` in `test-strategy`'s matrix (`references/modelling.md`).
