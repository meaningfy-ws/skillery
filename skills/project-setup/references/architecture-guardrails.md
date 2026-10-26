# Architecture Guardrails

The procedure for setting up import-linter so the architecture cannot erode
silently. Implements decision **D7** (cosmic-python layers + import-linter
tiers). Convention-only layering rots — without an import-linter, layering
drifts over time; an enforced approach stays clean. Every
Meaningfy repo gets `.importlinter`.

## The layers and their direction

Inside each component package, four cosmic-python layers (innermost is
**`domain`**, the book's `models/`):

```
entrypoints  -> services -> adapters -> domain
                            (adapters -> domain only)
```

- `domain` imports nothing upward — pure model, no I/O, no framework.
- `adapters` import only `domain` (DB clients, HTTP clients, queues).
- `services` orchestrate `domain` + `adapters`; never import `entrypoints`.
- `entrypoints` (API/CLI/listeners) call `services`; the outermost layer.

A component need not have all four (a coordinator may be `services`-only; a
client may be `adapters` + `services`). Declare only the layers that exist.

## When to add a tier hierarchy

- **One component** → a single `layers` contract over the package is enough.
  Start here. The shipped `dot-importlinter.tmpl` is exactly this and passes on
  an empty skeleton.
- **Several business components** → add a **tier hierarchy** on top of the
  per-component layers. Tiers order the components:

  | Tier | Role | May import |
  |------|------|-----------|
  | 0 | `commons` (shared) | no business component |
  | 1 | foundation | tier 0 |
  | 2 | orchestration | tiers 0–1 |
  | 3 | entrypoint APIs | tiers 0–2 |

  A component may import any **lower** tier, never a same-tier peer or a higher
  tier. `commons` is imported by everyone and imports no one.

## The two-step method

Do **not** write contracts straight from intuition. Model the dependency spec in
prose first, then translate. This is how a well-formed `.importlinter` is produced.

### Step 1 — model the spec in prose

Write a dependency specification like `.claude/memory/code-anatomy.md`. Its
shape (keep this skeleton):

1. **Architecture overview** — root package; the two levels of structure
   (components, then layers within each).
2. **Assumptions** — current vs. target package names; what is excluded from
   enforcement (e.g. cross-cutting `observability`/`config` packages); which
   components don't exist yet.
3. **Component inventory** — a table: *package · tier · layers it has · exists?*
4. **Intra-component layer rules** — the allowed/prohibited import directions,
   applied only to layers that exist in each component.
5. **Inter-component (tier) rules** — the tier table + consequences (peers
   can't import each other; nobody imports the top tier).
6. **Global prohibitions** — no upward/same-tier imports; no cycles; commons
   imports no business component.

Quality bar: *an agent can translate this into contracts without guessing.* If a
rule is ambiguous in prose, it will be ambiguous in the contract.

### Step 2 — translate to `.importlinter` contracts

Map each prose rule to a contract type:

| Prose rule | Contract type |
|------------|---------------|
| Layer direction within a component | `layers` |
| Tier ordering across components | `layers` (one level per tier line) |
| Same-tier peers must not import each other | `forbidden` (one per source module) |
| `commons` must import no business component | `forbidden` |
| A tier-0 package may contain only certain layers | `layers` with `exhaustive = true` |

## Choosing the contract type

- **`layers`** — an ordered, top-down list; higher may import lower, never the
  reverse. Use for both intra-component layers and the tier hierarchy. Tricks:
  - Parenthesised names — `(entrypoints)` — are **optional**: the contract holds
    before that submodule exists. This is what keeps the template green on an
    empty skeleton.
  - Pipe `|` separates **independent siblings** on one level (peers that the
    layers contract treats as mutually unordered).
  - `containers = ...` applies one layer rule to many component packages at once.
- **`forbidden`** — bans specific `source_modules -> forbidden_modules` imports.
  Use for same-tier peer isolation and commons isolation. **One contract per
  source module** — a forbidden contract cannot have overlapping source and
  forbidden lists, so N peers need N contracts.
- **`independence`** — mutual non-import between a set of modules. A terser
  alternative to N `forbidden` contracts for peer isolation; prefer it when the
  whole set is symmetric and none needs an asymmetric exception.

> The `layers` tier-hierarchy contract only catches **top-down** violations. It
> does **not** stop a same-tier peer import — that needs `forbidden` (or
> `independence`) contracts. This is a known gotcha; add explicit
> `foundation-peer-isolation-*` contracts to cover it.

## Enforcement: Make + CI

`make check-architecture` wraps import-linter:

```make
check-architecture:
	poetry run lint-imports --config .importlinter
```

CI (`ci.yaml`) calls the same target between typecheck and test, so a forbidden
import fails the build. Mirror the local gate exactly — "green locally" must mean
"green in CI". The empty skeleton passes because every layer name is optional.

## Recording the decision

When you choose a structure that isn't obvious — adding tiers, excluding a
cross-cutting package, an allowed exception — record it as an ADR. Use the
`architecture` skill for the ADR format and store it under
`docs/.../pages/adr/`. The `.importlinter` comments should point back to the
prose spec (`code-anatomy.md`) and any ADR, so a future contributor can see *why*
a contract exists before "fixing" it.

## Keeping the contracts living (grooming)

The `.importlinter` is a **living artifact**, not write-once. It drifts out of date the moment a
component is added, renamed, split, or a layer appears — and a stale contract either passes vacuously
(parenthesised optional names that never materialised) or blocks legitimate work.

- **On every refactor / new component / rename:** update the prose spec (`code-anatomy.md`) **and** the
  contracts in the same change; treat an out-of-date contract as a bug.
- **Periodically, the agent asks the developer** whether the contracts still reflect the intended
  architecture (e.g. when touching structure, or at a natural review point) — and grooms them: drop
  optional names that now exist (so they are really enforced), add contracts for new components/tiers,
  remove dead exclusions. Never silently weaken a contract to make a build pass — change it deliberately
  and say why.
