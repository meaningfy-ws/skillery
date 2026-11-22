# LinkML authoring mechanics

How LinkML's constructs realise the principles `modelling-conventions` owns (reusable properties,
URI-everywhere, conceptual definitions); the principles are not restated here. Cited authority: the
LinkML metamodel ([specification 1.11.x](https://linkml.io/linkml-model/1.11.x/docs/specification/03schemas/))
for the metaslots, and the model2owl
[conventions](https://docs.ted.europa.eu/M2O/latest/uml/conceptual-model-conventions.html) and
[checkers](https://docs.ted.europa.eu/M2O/latest/checkers/model2owl-checkers.html) with the SEMIC
styleguide for the URI, naming and datatype slice.

## Schema header: always complete

Without it, implicit URIs and OWL/SHACL generation are not possible.

```yaml
id: https://data.meaningfy.ws/<domain>/schema   # close to the default-prefix namespace, with a suffix
name: <domain>_model
description: |
  ...
version: 0.1.0
prefixes:
  linkml: https://w3id.org/linkml/
  dom: https://data.meaningfy.ws/<domain>/      # the model's own minted namespace
default_prefix: dom                             # ALWAYS set; ask the user
default_range: string                           # ALWAYS set explicitly, then audit every bare string
imports:
  - linkml:types
```

- `default_prefix` is mandatory and is a decision: ask the user for the prefix and its namespace;
  it drives every implicit `class_uri`/`slot_uri`.
- The schema `id` sits near the `default_prefix` namespace but stays distinct (a `/schema` suffix),
  so the schema IRI and the instance namespace never collide.
- `name`, `description` and `version` on every schema: they flow into the ontology metadata and docs.

## Reusable slots

Define each attribute once in the top-level `slots:` block and reference it by name from every
class; never redefine a same-meaning attribute under a class's `attributes:`. A class that needs a
refinement (tighter range, required here only) uses `slot_usage:` in that class; it never forks the
slot.

## Identity: implicit URIs by default

With `default_prefix: dom`, class `Invoice` and slot `issued_at` resolve to `dom:Invoice` and
`dom:issued_at`. Do not hand-write `class_uri`/`slot_uri` on every element; write them explicitly
wherever they are not default-generatable, chiefly when the element reuses a published term
(`slot_uri: dcterms:title`). Use `subproperty_of` (`rdfs:subPropertyOf`) sparingly, for elegant
hierarchies.

`default_range: string` is a smell magnet: audit every string slot. Identifiers and URIs →
`uriorcurie`; timestamps → `datetime`; a closed set → an `enum`. A bare `string` stays only for
genuinely opaque free text.

## The URI-as-datatype artifice

When a slot's values are URIs (a link, a reference, an external identifier; not the element's own
identity), type them `uriorcurie` or `uri`, never `string`. A project-specific URI notion is a `type`
deriving from `uriorcurie`, named once. The generated OWL then treats the value as a resource
reference, and JSON-LD contexts stay correct.

## Every element defined and annotated

- `description` on every class, slot, enum and permissible value: it is the definition, conceptual
  not technical (the rule is `modelling-conventions`').
- `title` (label) and `aliases` (synonyms) where they aid understanding.
- `examples:` on slots with non-obvious values, as much as possible: the round-trip gate validates
  them.

## The slot contract: unambiguous

For every slot, or its use on a class:

- `range` always clear (a class, a built-in type or an enum); an unranged slot is incomplete.
- Cardinality at minimum `required: true/false`; `recommended: true` for should-be-present;
  `multivalued` for collections.
- Inlining explicit: `inlined: true`, or `multivalued` + `inlined_as_list: true`.
- `identifier: true` (or `key: true`) on the aggregate's identifying slot, at most one per class.
- Validation wherever expressible (very important): `pattern`/`structured_pattern`,
  `minimum_value`/`maximum_value`, `equals_string`/`equals_number`, class-level `unique_keys`. A
  constraint that lives only in code drifts.
- `designates_type: true` on a base slot for self-identifying polymorphic JSON.

## Enums are SKOS concept schemes

An `enum` becomes a `skos:ConceptScheme`, its values `skos:Concept`s. Every enum and every value
carries a `description`; give a value a `meaning:` IRI wherever a published vocabulary has the
concept.

## Class design

- `abstract: true` on any class not instantiated directly; confirm the intent, then mark it.
- `is_a` for genuine taxonomy (one primary parent).
- `mixins` for cross-cutting slot bundles across unrelated hierarchies, especially technical concepts
  (timestamped, identifiable, versioned); never overload `abstract` to fake a mixin.
- `tree_root: true` on exactly one class per model: the root of the generated JSON Schema for JSON
  and REST APIs, and the linter's `tree_root_class` rule expects one.

## Modularity is not profiling

- `imports:` splits a large model into modules (mirror the bounded contexts, one concern per file).
- `subsets:` + `in_subset` carve profiles or views (a "minimal" slice, like LinkML's BasicSubset)
  out of one model; they never split it into modules.
