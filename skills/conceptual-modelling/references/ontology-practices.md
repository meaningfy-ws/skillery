# Ontology-engineering practices (concept level)

The decisions made once, at the model level. The principles (reusable properties, stable URIs
implicit by default, opaque and permanent identifiers, reuse before minting) are
`modelling-conventions`'; the LinkML mechanics that realise them are `linkml-engineering`'s.

## Stable-IRI policy

- **Mint a base namespace per model** you own (for example `https://data.meaningfy.ws/<domain>/`)
  and declare it once. Choosing it is a model-level decision, not a per-element one.
- **IDs read like the golden-thread IDs** (`EPIC-`, `ADR-`, `R<n>`; the golden thread is
  `epic-planning`'s): minted at authoring time, human-readable.
- **Cross-repo citation.** When the model lives in its own repo, downstream code and specs cite these
  IRIs.

## Modularity

One concern per schema or module; the core domain separate from project-specific extensions, so a
shared model stays clean and consumers extend it without forking. Mirror the bounded contexts the
architecture defines. (LinkML `imports:` and per-module output are `linkml-engineering`'s.)

## Vocabulary reuse

The decision owned here is **which** vocabularies a model aligns to (schema.org, Dublin Core, SKOS,
FOAF, an EU reference ontology, a domain standard), and recording that alignment so it survives into
the generated OWL.

## The source decision: LinkML or model2owl

An explicit decision point, never silently defaulted, made once per project:

| Use | When |
|------|------|
| **LinkML directly** (default) | The team authors the schema in LinkML; the fastest path to the wired targets. |
| **model2owl first** | The team models the domain in UML. model2owl generates LinkML artefacts (and has strong OWL/SHACL/HTML generators of its own), which then drive the LinkML generators: a prerequisite stage of generation. |
| **Other OWL-first tooling** (Protégé, SHACL-first) | An ontology asset already lives in OWL; document the tool as a named pattern and bridge to LinkML if Pydantic or JSON Schema targets are needed. |

No source-adapter interface (YAGNI). Once chosen, deriving, authoring and generating LinkML are
`linkml-engineering`'s; configuring model2owl itself is a future dedicated skill.
