# Complete and correct OWL and SHACL

What MUST be present in the generated OWL and SHACL for them to be usable. Author for it even when the
project only ships JSON, Python or a database, so the semantic option stays open. Verify against the
[model2owl checkers](https://docs.ted.europa.eu/M2O/latest/checkers/model2owl-checkers.html) and the
`gen-owl`/`gen-shacl` output.

## OWL

- An `owl:Ontology` with a stable IRI from the minted namespace, with label, description and
  `owl:versionIRI`.
- An `owl:Class` per class, with its resolved IRI.
- Per slot an `owl:ObjectProperty` (class range) or `owl:DatatypeProperty` (literal range).
  `uriorcurie` slots are object properties: this is why the URI-as-datatype artifice matters.
- `rdfs:domain` and `rdfs:range` on every property; a property with no range is incomplete.
- `rdfs:subClassOf` from every `is_a`; `owl:equivalentClass`/`owl:disjointWith` only where the model
  states them.
- `rdfs:label` and `rdfs:comment`/`skos:definition` from each `description:`; an empty description
  gives empty semantics.
- Enumerations in the chosen pattern (individuals with `owl:oneOf`, or a SKOS concept scheme), each
  value with its `meaning:` IRI where one exists.
- `owl:equivalentClass`/`owl:equivalentProperty` (or `skos:exactMatch`) from every
  `mappings:`/`exact_mappings:`, so reuse of published terms survives.

## SHACL

- A `sh:NodeShape` per class, `sh:targetClass` on the class IRI.
- A `sh:property` per slot with an explicit `sh:path`; a shape without a path validates nothing.
- `sh:minCount` from `required: true`; `sh:maxCount 1` for single-valued slots. Missing cardinality is
  the most common silent gap.
- `sh:datatype` for literal ranges, `sh:class` for object ranges, `sh:nodeKind sh:IRI` for URI-valued
  slots.
- `sh:pattern`, `sh:minInclusive`/`sh:maxInclusive`, and `sh:in` for enum ranges.
- The shapes realising `unique_keys`/`identifier` where the target store must enforce them.
- An explicit `sh:severity` policy (default `sh:Violation`).

## Rule of thumb

A class or property with no URI, no range or no description gives incomplete OWL/SHACL. That is a
schema defect to fix in the YAML, not a generator limitation.
