# Generation, custom templates and automation

The LLM authors the source (YAML); a fixed `make` toolchain renders the targets, outside the LLM
path. Never hand-edit a generated file: a needed change goes to the schema or the template. CI
regenerates and fails on drift (`quality-gates.md`).

## The `make generate-models` bridge

One target regenerates everything. Fail loudly: write to a temp file and `mv` it into place only on
success, so a failed run leaves no partial output.

```makefile
generate-models:                ## Regenerate all model targets from the LinkML source
	gen-pydantic --meta None --template-dir $(TEMPLATES)/ $(SCHEMA) > $(GEN_PY).tmp && mv $(GEN_PY).tmp $(GEN_PY)
	gen-json-schema $(SCHEMA) > $(GEN_JSON)
	gen-owl   $(SCHEMA) > $(GEN_OWL)
	gen-shacl $(SCHEMA) > $(GEN_SHACL)
	ruff check --select F401 --select I --fix $(GEN_PY) && ruff format $(GEN_PY)   # house style
```

Pin the LinkML version deliberately (a codegen dependency, not a runtime one) and note why:
generators change output between minor versions, and an unrelated bump must not silently regenerate
different code. Bump, regenerate, diff, then accept.

## Custom generator templates

The highest-leverage customisation: `gen-pydantic --template-dir` with a Jinja override makes every
generated model inherit the project's own strict base instead of LinkML's `ConfiguredBaseModel`, so
the generated set obeys house conventions defined once in hand-written code (from
`mapping-suite-sdk`):

```jinja
{# templates/class.py.jinja #}
{% if bases == "ConfiguredBaseModel" %}
class {{ name }}(PydanticModel):        {# the project's strict base #}
{% else %}
class {{ name }}({{ bases }}):
{% endif %}
```

```python
class PydanticModel(BaseModel):
    model_config = ConfigDict(
        extra="forbid", validate_assignment=True, validate_default=True,
        use_enum_values=True, populate_by_name=True,
    )
```

Keep override templates minimal: swap the base, strip LinkML meta noise. The same technique gives a
custom generator for any language: subclass LinkML's `Generator` (or walk the schema with
`SchemaView`) so the generator is a pure function of the schema, and add it to `make generate-models`
and the freshness check.

## Automation, diagrams included

Every transformation is a `make` target, never an ad hoc command: models, secondary artefacts and
diagrams (`generate-model-view`: `gen-plantuml` to `diagrams/`, `gen-json-schema` to `schemas/`).
Generate only what something consumes.

## Per-module artefacts, not one merged output

A multi-module project generates one artefact per schema, mirroring its path: walk the schema tree
and run the generator per file, same temp-file-then-`mv` rule.

```makefile
generate-models-recursive:
	find $(SCHEMA_PATH) -name '*.yaml' | while read -r f; do \
	  rel=$${f#$(SCHEMA_PATH)/}; out=$(PKG)/$${rel%.yaml}.py; \
	  mkdir -p "$$(dirname "$$out")"; \
	  gen-pydantic --meta None --template-dir $(TEMPLATES)/ "$$f" > "$$out.tmp" && mv "$$out.tmp" "$$out"; \
	done
```

`schema/<domain>/<name>.yaml` → `<pkg>/<domain>/<name>.py`. One schema file per aggregate, split by
bounded concept. Scaffolding this layout into a repo is `project-setup`'s job.

## Enable-on-demand targets

First-class, wired and tested: Pydantic, JSON Schema, OWL, SHACL. The rest only when a project
consumes them: TypeScript (`gen-typescript`), SQL DDL or SQLAlchemy (`gen-sqlddl`/`gen-sqla`; the
repository around the ORM stays hand-written in `adapters/`), docs (`gen-doc`), JSON-LD context
(`gen-jsonld-context`), Neo4j (below), and further custom generators.

### Neo4j constraints and neomodel OGM

Two custom generators ship with this skill in `scripts/linkml_neo4j/`, tested by
`tests/test_linkml_neo4j_generators.py`. Enable them when a project targets Neo4j.

- `gen_neo4j_constraints.py` emits Cypher DDL: uniqueness, existence and property-type constraints,
  and `CREATE INDEX` for a slot annotated `neo4j_index: true`. It targets Neo4j Community Edition:
  `--profile community` emits only uniqueness and indexes, the subset proven to run there; `--profile
  full` (the default) adds existence and type constraints, not yet re-verified on Community (the
  module docstring holds the current state). It emits no relationship constraints and no
  application-layer validation: that is `gen-neomodel`'s job, in Python.
- `gen_neomodel.py` emits neomodel `StructuredNode` classes mirroring the `is_a` hierarchy as Python
  inheritance (abstract classes become `__abstract_node__ = True` bases, so a relationship whose range
  is abstract resolves). An `any_of` range is a trailing comment, not enforced. neomodel reserves
  `id`, `deleted` and `element_id`: an `id` slot becomes `id_` with `db_property` keeping the Neo4j key.

```bash
pip install linkml click jinja2 neomodel   # generator dependencies, not runtime ones
python scripts/gen_neo4j_constraints.py model/schema.yaml --profile community > model/generated/neo4j/constraints.cypher
python scripts/gen_neomodel.py model/schema.yaml > model/generated/neomodel/ogm.py
```

Wire both into `make generate-models` like the other generators. A consuming repo gets a pinned copy
from `project-setup` (`--neo4j`); the copy is a snapshot, refreshed by re-running `project-setup`
with `--force` and reviewing the diff, never silently overwritten. Inside skillery, run them from
this skill's `scripts/linkml_neo4j/`.

## Generated modules stay in the architecture

Generated `models` must not import `services`, `adapters` or `entrypoints` (`cosmic-python`).
Parallel versioned or variant model packages (v1/v2, per tenant) are kept independent with
`import-linter`, like hand-written code: codegen is no exemption.
