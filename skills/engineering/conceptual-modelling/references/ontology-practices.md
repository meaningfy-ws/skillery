# Ontology-engineering practices

The conceptual model is an ontology in the engineering sense: identified concepts with stable
meaning. These practices keep it citable, reusable, and durable.

## Stable URIs / IRIs

Every entity, attribute, and enumeration value gets a **stable identifier** — an IRI (or a CURIE
expanding to one) that does not change when the artefact is renamed, moved, or refactored.

- **Mint a base namespace per model** and declare it once (LinkML `prefixes` + `default_prefix`).
  Example: `https://data.meaningfy.ws/<domain>/` with a short prefix (e.g. `dom:`).
- **Identifiers are opaque and permanent.** Do not encode mutable facts (version, owner, location)
  into the local name. The label can change; the IRI must not.
- **Mint at authoring time**, human-readable, like the other golden-thread IDs (`EPIC-`, `ADR-`,
  `R<n>` — see [`../../../spine/golden-thread.md`](../../../../spine/golden-thread.md)). No
  auto-minting from content hashes or file paths (those break on moves and across repos).
- **Cross-repo citation.** When the model lives in its own repo, downstream code and specs cite
  these IRIs — this is the cross-repo rung of the golden thread.

## Naming conventions

- **Classes**: `UpperCamelCase` singular nouns (`InvoiceLine`, not `invoice_lines`).
- **Slots / attributes**: `snake_case` (LinkML convention) — `issued_at`, `total_amount`.
- **Enumerations**: `UpperCamelCase` type, stable permissible-value keys (never free strings — give
  each value a `meaning:` IRI where one exists in a published vocabulary).
- **Be consistent and intention-revealing** — the same Clean Code naming discipline as the code
  (see `cosmic-python`). The model's names become the **ubiquitous language** (see
  [`terminology-management.md`](terminology-management.md)).

## Modularity

- **One concern per schema file**; import smaller schemas into a top-level one (`imports:` in
  LinkML). Avoid one monolithic file as the model grows.
- **Separate the core domain from project-specific extensions** so a shared model (own-repo mode)
  stays clean and consumers extend it without forking it.
- **Mirror the bounded contexts** the architecture defines — do not let the model sprawl across
  unrelated subdomains.

## Vocabulary reuse

Prefer **reusing existing, published vocabularies** over inventing terms:

- Map slots and classes onto well-known vocabularies where they fit — `schema.org`, Dublin Core
  (`dcterms:`), SKOS, FOAF, domain standards (e.g. an EU reference ontology). Use LinkML `slot_uri`
  / `class_uri` / `mappings` to record the equivalence.
- Reuse signals interoperability and reduces semantic drift; only mint a new term when no suitable
  published one exists.
- Record the reuse explicitly so the generated OWL carries the mappings (reasoners and consumers can
  then align data across systems).

## LinkML vs model2owl — the source decision

This is an **explicit decision point, never silently defaulted**:

| Use… | When |
|------|------|
| **LinkML directly** (default) | The team authors the schema in LinkML; fastest path to the four wired targets. |
| **model2owl first** | The team models the domain in **UML**. model2owl generates LinkML artefacts (and has strong OWL/SHACL/HTML generators of its own), which then drive the LinkML generators. model2owl becomes a **prerequisite stage** of `make generate-models`. |
| **Other OWL-first tooling** (Protégé, SHACL-first) | An existing ontology asset or a reasoning-heavy domain already lives in OWL; document the chosen tool as a named pattern and bridge to LinkML if Pydantic/JSON Schema targets are also needed. |

We do **not** abstract these behind a source-adapter interface (YAGNI). Each is a documented,
named pattern; pick one consciously per project and wire only that one. See the
model2owl-as-prerequisite flow in [`generators.md`](generators.md).
