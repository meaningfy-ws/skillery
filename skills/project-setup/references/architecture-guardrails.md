# Architecture guardrails

Every Meaningfy repo gets `.importlinter` (D7): layering by convention erodes. The layers are
`cosmic-python`'s; the scaffold deliberately names the innermost one `domain/`, not `models/`
(as do `.importlinter` and `scripts/scaffold.sh`); do not rename it.

## When to add tiers

One component: one `layers` contract; the template is exactly this and passes on an empty skeleton
because every layer name is optional. Several business components: add tiers over the
per-component layers: 0 `commons` (imports no business component, everyone imports it), 1
foundation, 2 orchestration, 3 entrypoint APIs. A component imports lower tiers only, never a
same-tier peer or a higher tier, and declares only the layers it has. A pipeline's DAGs are their
own top-level package, `<pkg>_dags/` (D1).

## The two-step method

Never write contracts from intuition. First write the dependency spec as `code-anatomy.md`:
overview (root package, components, layers); assumptions (current vs target names, exclusions from
enforcement, components not yet built); component inventory (package · tier · layers · exists?);
layer rules; tier rules; global prohibitions (no upward or same-tier imports, no cycles). The bar:
an agent translates it without guessing. Then: `layers` for layer and tier order; `forbidden` (one
contract per source module) or `independence` for peer isolation and for `commons`; `layers` with
`exhaustive = true` to restrict a tier-0 package's layers.

The gotcha: a `layers` tier contract never catches a same-tier peer import; add explicit
`foundation-peer-isolation-*` contracts.

A non-obvious structure (tiers, an excluded package, an exception) is an ADR (`architecture`), and
the `.importlinter` comments point to `code-anatomy.md` and the ADR.

## Keeping the contracts living (grooming)

- On every refactor, new component or rename, update `code-anatomy.md` and the contracts in the
  same change; an out-of-date contract is a bug.
- At a natural review point, ask the developer whether the contracts still match the intended
  architecture; drop optional names that now exist, add contracts for new components, remove dead
  exclusions.
- Never weaken a contract silently to pass a build: change it deliberately and say why.
