# Code Principles, Best-Practices & Anti-Patterns Catalogue

> **Single source of authority** (per [`spec/skill-repo-governance.md`](../../../spec/skill-repo-governance.md)).
> `cosmic-python` owns this catalogue. Every other skill, agent, or binding **cites an entry by its id**
> and never restates the rule text. Append-friendly: new code-review findings land here.

Each entry has a stable slug id. Cite as e.g. `cosmic-python:AP-DICT-AS-MODEL`.

---

## Principles (the named "why")

| id | Principle | Statement |
|----|-----------|-----------|
| `PR-SURVEY-FIRST` | read-neighbours-before-implementing | Before writing a new file/class/function, read the sibling files in the target package and search for existing constants, enums, models, helpers. Decide **reuse / extend / refactor-to-fit** *before* writing. New code must fit the existing code, not sit beside a near-duplicate. |
| `PR-SSOT-DRY` | single-source-of-truth-&-DRY | Any fact, constant, mapping, or rule has exactly one home; everything else reads/derives/cites it. Applies to code (shared constants in one module), config (one version source), and docs (cite, don't restate). |
| `PR-MODELS-OVER-DICTS` | prefer-models-over-dicts | A structured payload that crosses a function/file boundary or is returned to a caller is a **Pydantic model**, not a raw dict. Raw-dict handling stays at the I/O edge of an adapter and is converted promptly. |
| `PR-REUSE-COMPACT` | design-for-reuse-and-compactness | Prefer the smallest correct, reusable shape. Lift shared logic to a common home; collapse near-duplicate code into one parameterised form. Compactness is explicit — not merely implied by reuse. A small enabling refactor for clean integration is part of the task, not scope creep. |
| `PR-COMPONENT-FIRST` | organise-by-component-for-larger-projects | A larger project is organised **component-first**: `<root>/<component>/{models,adapters,services,entrypoints}`, plus one **`core`/`commons`** component that every other component may import (and which imports none of them). Layers live *inside* each component — never the reverse (no top-level `services/<component>/`). A small single service may stay one-level (just the four layers). Pick ONE layout per package; never run component-first and layer-first in parallel. Component + tier boundaries are enforced by import-linter — see [`project-setup`](../../project-setup/references/architecture-guardrails.md). |
| `PR-CONFIG-DECOUPLED` | config-consumption-decoupled-from-source | Code consumes configuration **without knowing where the value comes from**: typed config classes whose fields resolve through an injected resolver (env, default, …), keyed by the field name. Maintainable and testable (swap the resolver). **Mandated when a project has settings**; skip entirely when it has none. The reference implementation (`env_property` + `ConfigResolverABC`) lives in [`project-setup`](../../project-setup/references/settings-pattern.md) — the *principle* is mandatory, the *impl* is a starting point. |

## Best-practices (the "do")

| id | Practice |
|----|----------|
| `BP-CONSTANTS-ENUMS` | Define every symbolic identifier (structural keys, status values, media types, method names) as a constant or enum **in one shared module** — in **any** layer. |
| `BP-VALIDATE-AT-BOUNDARY` | Validate input **once** at the trust boundary (entrypoint/service entry); rely on typed contracts internally. Do not re-validate everywhere (re-validate only for an explicit security reason). |
| `BP-COVERAGE-PER-LAYER` | Target **≥80% coverage, measured per layer** (not only overall) — a repo can pass overall while `models/` is under-tested. Test the decisions/branches, not the steps. |
| `BP-IDIOMATIC-SMALL` | Prefer idiomatic small snippets over large blocks; respect licences (see `AP-VERBATIM-EXTERNAL`). |
| `BP-DOMAIN-REVEALING-NAMES` | Name modules/classes/functions for the **domain/product thing** they hold, self-explanatory at a glance. Pattern *allusions* are fine (`graph_store` as a repository, `…_unit_of_work`), but never bare abstractions you must open to understand (`port.py`, `factory.py`, `utils.py`, `helpers.py`). A bit longer is fine; cryptic is not. |
| `BP-EXCEPTIONS-MODULE` | Exceptions live in a module named **`exceptions.py`** (never `errors.py`, never buried inside a logic module — they must stay maintainable). Place per layer by *kind*: domain/invariant errors in the models layer, I/O/operational in adapters, use-case/business in services; or one shared module for a small component. **Check `core`/`commons` first** — reuse an existing exception before minting a local one. |
| `BP-CONSTANTS-HOME` | A couple of small reusable constants can live in the package `__init__.py` — don't manufacture a `constants.py` for them. Shared **domain vocabulary** (e.g. namespace prefix→IRI bindings) is a *maintained, reusable resource* in `core`/`commons`, not an inline dict embedded in an adapter (KISS, but one home — `PR-SSOT-DRY`). |

## Anti-patterns (the ❌ "don't" — smell → fix)

| id | ❌ Smell | ✅ Fix | Why |
|----|---------|--------|-----|
| `AP-DUP-CONST` | The same structural constants defined in more than one sibling module (e.g. SPARQL-JSON keys `HEAD/VARS/...` in three adapters) | Lift to one shared module and import everywhere | Refactoring is fragile; the copies drift |
| `AP-DICT-AS-MODEL` | A raw dict literal that *is* a structured contract crossing a boundary — `{"head": {"vars": []}, ...}`, or an entrypoint return `return {"uid": id, "dataset_name": n}, 200` | Define a Pydantic model; build it from named fields; return the model | Hidden schema, magic keys, no validation |
| `AP-FREESTR-ANYLAYER` | Free/magic strings **anywhere** — dict keys, `hasattr(o,"name")`, `if kind == "resource"` — including in `adapters/` and `entrypoints/` | Constants/enums/model fields in one home | Intent hidden, refactor-fragile (the rule is all layers, not only models/services) |
| `AP-MISPLACED-SHARED-INFRA` | Reusable infrastructure (a connection pool, a client cache) buried inside one adapter | Place it where it can be reused; import it back | New consumers re-implement or import sideways |
| `AP-VERBATIM-EXTERNAL` | Large, verbatim chunks of external-library code pasted in | Prefer idiomatic small snippets; respect the source licence | Licensing risk; opaque maintenance |
| `AP-DUP-VALIDATION` | The same validation duplicated across many call sites | Validate once at the boundary (`BP-VALIDATE-AT-BOUNDARY`) | Drift; rules diverge silently |
| `AP-IO-IN-MODELS` | I/O or framework imports in `models/` (e.g. `import requests`) | Move to `adapters/`, inject via DIP | Models can't be tested in isolation |
| `AP-LOGIC-IN-EDGES` | Business rules in `adapters/`/`entrypoints/` | Move to `services/`/`models/` | Logic scattered, untestable |
| `AP-CROSS-VARIANT-IMPORT` | Parallel variants importing each other; `core` importing outward; DAG/tools→main reversed | Share via `core`; keep `core` inward-looking; DAG/tools→main one-way only | Cycles, tangled deployable units |
| `AP-GENERIC-MODULE-NAMES` | `port.py`, `factory.py`, `utils.py`, `helpers.py`, `manager.py` — abstraction-only names | Name for the domain thing held (`graph_store.py` for `GraphStorePort` + its builder) — `BP-DOMAIN-REVEALING-NAMES` | Must open the file to learn what it is |
| `AP-OVER-FRAGMENTATION` | Many tiny single-purpose files (a 21-line `factory.py`, a 45-line `port.py`, …) splintering one cohesive concern | Consolidate into fewer dense, cohesive modules (`PR-REUSE-COMPACT`) | Navigation tax; "why so many files?"; hides the unit |
| `AP-PARALLEL-LAYOUTS` | One package mixing component-first (`loader/services/`) **and** layer-first (`services/loader/`) organisations | Pick one — component-first for larger projects (`PR-COMPONENT-FIRST`); finish the migration | "Too many modules", unclear where things live |
| `AP-EXCEPTIONS-EMBEDDED` | Exceptions defined inside a logic module (`class GraphStoreError` in `port.py`) or a file named `errors.py` | Move to `exceptions.py` per `BP-EXCEPTIONS-MODULE` | Exceptions get lost; hard to maintain/reuse |

## Cross-links (owned elsewhere — cite, don't restate)

- TDD ritual (red-green-refactor) → `superpowers:test-driven-development`.
- Sensitive-data / self-hosted-model interaction safety → [`guardrails`](../../guardrails/SKILL.md).
- ADR template → `architecture`. Domain-model contract + `make generate-models` → `conceptual-modelling`.
- The clarity-gate lightweight check → [`clarity-gate`](../../clarity-gate/SKILL.md).
