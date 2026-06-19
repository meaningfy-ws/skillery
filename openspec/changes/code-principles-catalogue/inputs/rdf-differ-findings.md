# rdf-differ (+ mssdk, entity-resolution-service) review findings (SECONDARY input)

Second tranche of review findings folded into the catalogue (DEC-3: the catalogue is the landing place
for review findings). Grounded by reading `rdf-differ/rdf_differ/`.

## What the code showed

- **Half-migrated layout** — a correct component-first `rdf_differ/loader/{adapters,domain,services,
  entrypoints}` and `rdf_differ/core/{adapters,domain}` **coexist** with old top-level layer-first dirs
  (`rdf_differ/{adapters,domain,services,entrypoints}/`). "Too many modules / unclear why" = two parallel
  layouts + an over-fragmented `loader/adapters/` (7 tiny files: `port.py` 45, `factory.py` 21,
  `settings.py` 51, `in_memory` 169, `remote_store` 138, `queries` 196, `skolemizer` 67).
- **Generic names** — `port.py` (holds `GraphStorePort`), `factory.py` (one `build_graph_store()`).
- **Exceptions embedded** — `LoadingError`/`GraphStoreError` defined inside `domain/model.py` and
  `adapters/port.py`; **no `exceptions.py`** anywhere.
- **Settings** — `loader/adapters/settings.py` uses pydantic `BaseSettings`; the org-standard is the
  `env_property` + `ConfigResolverABC` resolver (from entity-resolution-service / mssdk).
- **ns bindings** — a prefix→IRI `ns_binding` dict embedded in `core/adapters/filesystem.py`.
- **dict returns** — `handlers.py:181 return {"uid": task.id, "dataset_name": …}, 200`; `report_handling.py:282`.

## Decisions (confirmed with the user)

- **Component-first organisation for larger projects** is the standard: `<root>/<component>/{layers}` +
  a `core`/`commons` imported by all. import-linter enforces per-component layers + tier hierarchy +
  commons-isolation (already in `project-setup/references/architecture-guardrails.md`), and is **groomed**
  (revised on refactor/new component; the agent asks the developer periodically). User: (a) confirmed.
- **Settings pattern** — the `PR-CONFIG-DECOUPLED` principle is **mandated** when a project has settings
  (skip when none); the `env_property`/`ConfigResolverABC` impl is a **reference** (better may exist) —
  essential is *config consumption without code knowing the source, easy to maintain*. User: (b) confirmed.
- **Naming** — domain-revealing module/class/fn names; no `port.py`/`factory.py`/`utils.py`.
- **Exceptions** — always `exceptions.py` (never `errors.py`/embedded); per-layer by kind; reuse `core` first.
- **Constants** — small reusable ones may live in `__init__.py`; no needless `constants.py`; shared domain
  vocab (ns bindings) is a maintained reusable `core` resource.
- **Return models, not dicts**, at entrypoints/services (already `AP-DICT-AS-MODEL`).

## Where it landed

Catalogue: `PR-COMPONENT-FIRST`, `PR-CONFIG-DECOUPLED`, `BP-DOMAIN-REVEALING-NAMES`, `BP-EXCEPTIONS-MODULE`,
`BP-CONSTANTS-HOME`, `AP-GENERIC-MODULE-NAMES`, `AP-OVER-FRAGMENTATION`, `AP-PARALLEL-LAYOUTS`,
`AP-EXCEPTIONS-EMBEDDED`, and the entrypoint example on `AP-DICT-AS-MODEL`. cosmic-python SKILL.md gains a
"Scaling up: component organization" section. project-setup gains the import-linter grooming cadence and a
new `references/settings-pattern.md`. **eds4jinja2/rdf-differ code itself is not changed** (no-go).
