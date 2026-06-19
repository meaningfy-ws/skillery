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

## Best-practices (the "do")

| id | Practice |
|----|----------|
| `BP-CONSTANTS-ENUMS` | Define every symbolic identifier (structural keys, status values, media types, method names) as a constant or enum **in one shared module** — in **any** layer. |
| `BP-VALIDATE-AT-BOUNDARY` | Validate input **once** at the trust boundary (entrypoint/service entry); rely on typed contracts internally. Do not re-validate everywhere (re-validate only for an explicit security reason). |
| `BP-COVERAGE-PER-LAYER` | Target **≥80% coverage, measured per layer** (not only overall) — a repo can pass overall while `models/` is under-tested. Test the decisions/branches, not the steps. |
| `BP-IDIOMATIC-SMALL` | Prefer idiomatic small snippets over large blocks; respect licences (see `AP-VERBATIM-EXTERNAL`). |

## Anti-patterns (the ❌ "don't" — smell → fix)

| id | ❌ Smell | ✅ Fix | Why |
|----|---------|--------|-----|
| `AP-DUP-CONST` | The same structural constants defined in more than one sibling module (e.g. SPARQL-JSON keys `HEAD/VARS/...` in three adapters) | Lift to one shared module and import everywhere | Refactoring is fragile; the copies drift |
| `AP-DICT-AS-MODEL` | A raw dict literal that *is* a structured contract crossing a boundary, e.g. `{"head": {"vars": []}, "results": {"bindings": []}}` | Define a Pydantic model; build it from named fields | Hidden schema, magic keys, no validation |
| `AP-FREESTR-ANYLAYER` | Free/magic strings **anywhere** — dict keys, `hasattr(o,"name")`, `if kind == "resource"` — including in `adapters/` and `entrypoints/` | Constants/enums/model fields in one home | Intent hidden, refactor-fragile (the rule is all layers, not only models/services) |
| `AP-MISPLACED-SHARED-INFRA` | Reusable infrastructure (a connection pool, a client cache) buried inside one adapter | Place it where it can be reused; import it back | New consumers re-implement or import sideways |
| `AP-VERBATIM-EXTERNAL` | Large, verbatim chunks of external-library code pasted in | Prefer idiomatic small snippets; respect the source licence | Licensing risk; opaque maintenance |
| `AP-DUP-VALIDATION` | The same validation duplicated across many call sites | Validate once at the boundary (`BP-VALIDATE-AT-BOUNDARY`) | Drift; rules diverge silently |
| `AP-IO-IN-MODELS` | I/O or framework imports in `models/` (e.g. `import requests`) | Move to `adapters/`, inject via DIP | Models can't be tested in isolation |
| `AP-LOGIC-IN-EDGES` | Business rules in `adapters/`/`entrypoints/` | Move to `services/`/`models/` | Logic scattered, untestable |
| `AP-CROSS-VARIANT-IMPORT` | Parallel variants importing each other; `core` importing outward; DAG/tools→main reversed | Share via `core`; keep `core` inward-looking; DAG/tools→main one-way only | Cycles, tangled deployable units |

## Cross-links (owned elsewhere — cite, don't restate)

- TDD ritual (red-green-refactor) → `superpowers:test-driven-development`.
- Sensitive-data / self-hosted-model interaction safety → [`guardrails`](../../guardrails/SKILL.md).
- ADR template → `architecture`. Domain-model contract + `make generate-models` → `conceptual-modelling`.
- The clarity-gate lightweight check → [`clarity-gate`](../../clarity-gate/SKILL.md).
