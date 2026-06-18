# Multi-target generation from the conceptual model

Generation is **deterministic and outside the LLM path**. The LLM authors the *source* (a LinkML
schema); a fixed toolchain renders the *targets*. Treat it exactly like other schema-based codegen:
regenerate in CI and fail the build on drift.

## The `make generate-models` bridge

A single make target regenerates everything from the source. It is the seam between the model and
the code: nothing downstream edits generated files by hand.

```makefile
SCHEMA      := model/schema.yaml
GEN_PY      := <package>/models/generated.py
GEN_JSON    := model/generated/schema.json
GEN_OWL     := model/generated/ontology.owl.ttl
GEN_SHACL   := model/generated/shapes.shacl.ttl

.PHONY: generate-models check-models

generate-models:                ## Regenerate all model targets from the LinkML source
	gen-pydantic   $(SCHEMA) > $(GEN_PY)
	gen-json-schema $(SCHEMA) > $(GEN_JSON)
	gen-owl        $(SCHEMA) > $(GEN_OWL)
	gen-shacl      $(SCHEMA) > $(GEN_SHACL)

check-models: generate-models   ## CI guard: fail if generated artefacts are stale
	git diff --exit-code -- $(GEN_PY) $(GEN_JSON) $(GEN_OWL) $(GEN_SHACL)
```

`gen-pydantic`, `gen-json-schema`, `gen-owl`, `gen-shacl` are LinkML's own generators. Pin the
LinkML version (it is a code-generation dependency, not a runtime one) so output is reproducible.

CI wiring: run `make check-models` in the pipeline; a non-empty diff means someone edited a
generated file or forgot to regenerate after a schema change.

## Wired and tested — first-class targets

These four are the semantic core and ship wired-and-tested:

| Target | Generator | Consumed by |
|--------|-----------|-------------|
| **Python (Pydantic)** | `gen-pydantic` | the application code; `cosmic-python`'s `models/` |
| **JSON Schema** | `gen-json-schema` | validation, interchange, `entrypoints/api` contract |
| **OWL** | `gen-owl` | formal ontology — semantics, reasoning, linked-data publication |
| **SHACL** | `gen-shacl` | shape constraints validating RDF instance data |

The Pydantic + JSON Schema pair *is* the contract that `entrypoints/api` consumes (see
[`../../cosmic-python/SKILL.md`](../../cosmic-python/SKILL.md)). The OWL + SHACL pair is the semantic
asset Meaningfy sells.

## Documented as patterns — enable on demand

Do not gold-plate all of these by default. Add the generator and a `generate-models` line only when a
project needs the target:

- **TypeScript types** — `gen-typescript` for a TS frontend/client consuming the same contract.
- **SQL DDL / SQLAlchemy ORM** — `gen-sqlddl` / `gen-sqla` when the model backs a relational store.
  Keep persistence concerns in `adapters/` (see `cosmic-python`); the ORM is generated, the
  repository around it is hand-written.
- **Markdown / HTML docs** — `gen-doc` (LinkML) or model2owl's HTML generator for a browsable model
  reference published alongside the code docs.

## Authoring a custom generator

When no built-in target fits (a bespoke config format, a domain-specific artefact), write a custom
generator rather than hand-maintaining the artefact:

1. Load the schema with LinkML's `SchemaView` (the introspection API over a LinkML schema).
2. Walk classes / slots / enums and emit your target format from a template.
3. Subclass LinkML's `Generator` base (or call `SchemaView` directly from a script) so the generator
   is a pure function of the schema — deterministic, no side inputs.
4. Add it to `make generate-models` and to `check-models` so its output is drift-checked like the
   rest.

Keep custom generators in the model repo/dir next to the schema; they are part of the source of
truth, not application code.

## model2owl as a prerequisite step

Some projects model the domain in **UML** and run **model2owl**, which has strong **OWL, SHACL, and
HTML** generators. In that setup model2owl can *produce LinkML artefacts*, which then feed the
LinkML generators above. So the order becomes:

```
UML model ──model2owl──▶ LinkML schema ──LinkML generators──▶ Pydantic / JSON Schema / OWL / SHACL
                          (+ model2owl's own OWL / SHACL / HTML where preferred)
```

In this flow **model2owl runs first** — it is a prerequisite stage of `generate-models`, not a
competing path. When a project models in UML, surface this ordering explicitly and wire model2owl as
the first recipe step. When a project authors LinkML directly, model2owl is not in the path at all.
Choosing LinkML-direct vs. model2owl-first is the explicit source decision (see
[`ontology-practices.md`](ontology-practices.md)).
