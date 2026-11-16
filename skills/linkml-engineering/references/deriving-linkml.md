# Deriving LinkML from an existing source

Each input kind has its own entry point. The output is always a draft: derivation gives the
structure, the refinement in `authoring-mechanics.md` gives the quality. With no upstream source,
stop: the model comes first, through `conceptual-modelling`.

## From a UML model

Run model2owl first, as a prerequisite stage of generation, not a competing path:

```
UML model ──model2owl──▶ LinkML schema ──LinkML generators──▶ Pydantic / JSON Schema / OWL / SHACL / …
```

Configuring model2owl and wiring it into a repo is not this skill's job; treat its LinkML output as the
derivation input. UML classes → classes, attributes and associations → reusable top-level slots,
enumerations → `enums`. Carry the UML element identities into the minted URIs, so nothing loses
identity in the crossing.

## From a text specification

1. Entities → candidate classes, attributes → candidate shared slots, closed value sets → `enums`.
2. Where the spec mirrors a published standard (an error shape, a bibliographic record), map onto that
   vocabulary instead of inventing terms, and record the mapping.
3. The spec's own wording seeds each `description:`; definitions are not optional.

## From a model2owl output

Its LinkML output is the derivation input: never re-derive from the UML by hand. Refine the generated
schema (reusable slots, implicit URIs, constraints); if the generated shape is wrong, fix it upstream
in the UML or the model2owl configuration, not in the LinkML.

## From another existing model

A JSON Schema, an ORM, a protobuf or XSD, an older LinkML: translate into classes, reusable slots and
enums, then refine. Regenerate the old form from the new LinkML instead of maintaining both; the point
of the pivot is one source of truth.

## Done when

The draft clears the per-edit checklist of `modelling-conventions` and the mechanics: reusable slots,
implicit URIs, enums for closed sets, constraints in the schema, a description on every element.
