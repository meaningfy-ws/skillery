# Meaningfy spine workflows & profiles

How the Meaningfy build tier drives OpenSpec's `/opsx` commands. This is the
single home for the verb roster — every other doc references this file by anchor
rather than re-listing verbs.

## The canonical `/opsx` verb roster {#verb-roster}

OpenSpec exposes these workflow verbs as `/opsx:<verb>` slash-commands / skills
(authoritative for the pinned version — see [`openspec-version.txt`](openspec-version.txt)):

| Verb | What it does |
|---|---|
| `propose` | create a change and generate its artifacts in one step |
| `explore` | thinking-partner mode — investigate, clarify, shape before committing |
| `new` | start a change scaffold (granular flow) |
| `continue` | resume an in-flight change |
| `apply` | implement the change's tasks (tracks `tasks.md`) |
| `ff` | fast-forward through stages |
| `verify` | check a change against its specs |
| `sync` | sync delta specs into main specs without archiving |
| `archive` | finalise a completed change; merge deltas into `openspec/specs/` |
| `bulk-archive` | archive several completed changes |
| `onboard` | guided walkthrough of one change cycle |

- **Core profile** (what `openspec init --profile core` installs): `propose`,
  `explore`, `apply`, `sync`, `archive`.
- **Expanded set** (adds): `new`, `continue`, `ff`, `verify`, `bulk-archive`,
  `onboard`. Enabled by selecting the non-core workflows via `openspec config`
  (profile becomes `custom`), then `openspec update` to regenerate the commands.

> **Profile decision.** skillery's spine ships on the **core** profile for now
> (5 verbs, deterministic, non-interactive install). The expanded set is opt-in
> per repo via `openspec config` — adopt it when a project's flow needs the
> granular `new`/`continue`/`verify` steps. (This supersedes EPIC-02 R6's
> assumption of an `expanded` preset: the real profile enum is `core | custom`.)

## Named Meaningfy workflow patterns

All patterns use the verbs above verbatim.

### Build-tier (per EPIC) — the spine's main loop
```
propose            → author the EPIC (proposal.md, Shape-Up shape)
  → derive PLAN    → design.md + tasks.md (the clarity-gate target)
  → clarity-gate   → score the PLAN pair ≥9/10 (semantic; not CI)
  → apply          → TDD implementation (superpowers + cosmic-python)
  → verify         → change satisfies its specs
  → sync / archive → merge deltas into openspec/specs/ (the durable truth)
```

### Exploratory (seed → shaped change)
```
explore  → elicit from seed inputs (changes/<id>/inputs/)
  → new  → scaffold the change
  → continue → flesh out EPIC + PLAN
  → apply
```

### Brownfield change (delta-only)
```
propose (delta-only)  → apply  → archive (merge into specs/)
```

## Command → driving Meaningfy discipline

Which skill / superpowers discipline owns each verb. This is the concrete
"how is it used", and the single-owner map EPIC-05 builds the methodology on
(so no behaviour is owned twice — RISK-4).

| `/opsx` verb | Driven by |
|---|---|
| `explore` | `superpowers:brainstorming` + [`epic-planning`](../skills/epic-planning) elicitation |
| `propose` | [`epic-planning`](../skills/epic-planning) (shapes the EPIC = proposal.md) |
| derive PLAN | [`epic-planning`](../skills/epic-planning) (design.md + tasks.md) + [`bdd-gherkin`](../skills/bdd-gherkin) authors `.feature` coverage as a **design-phase** PLAN artifact off the SHALL+GWT |
| clarity gate | [`clarity-gate`](../skills/clarity-gate) (semantic ≥9/10 on the PLAN **incl. scenario coverage**) |
| `apply` | `superpowers:test-driven-development` (step definitions + code) + [`cosmic-python`](../skills/cosmic-python) (incl. `PR-SURVEY-FIRST`) |
| `verify` | [`meaningfy-code-review`](../skills/meaningfy-code-review) + `superpowers:verification-before-completion` |
| `sync` / `archive` | spine convention (deterministic; kept out of the LLM path) |

> The clarity gate (PLAN, semantic) and `openspec validate --strict` (structure,
> CI) are complementary — see [`README.md`](README.md#two-gates-two-natures).

## superpowers ↔ spine

`superpowers` provides **disciplines** (thinking, testing, execution), **not** a parallel spec
system. In a spine repo its artifacts land in `openspec/changes/<id>/`, never a `docs/superpowers/`
tree (a Binding in the repo `CLAUDE.md` enforces this). Map:

| superpowers | role here | lands as |
|---|---|---|
| `brainstorming` | thinking method during `explore` / shaping | feeds the **EPIC** (`proposal.md`) — not a separate `docs/superpowers/specs/` design |
| `writing-plans` | **superseded** inside a spine repo | the **PLAN** (`design.md` + `tasks.md`), derived by [`epic-planning`](../skills/epic-planning/SKILL.md) and gated by [`clarity-gate`](../skills/clarity-gate/SKILL.md) |
| `test-driven-development` | the build discipline | `apply` — TDD inside [`cosmic-python`](../skills/cosmic-python/SKILL.md) layers |
| `subagent-driven-development` / `executing-plans` | execution harness | runs `tasks.md`, tracked via `/opsx:apply` |
| `systematic-debugging`, `verification-before-completion` | quality disciplines | used during `apply` / `verify` |

**Why:** one durable, traceable spec system (the spine), not two. The lifecycle (archive, grooming,
the orientation index) is owned by [`spec-stewardship`](../skills/spec-stewardship/SKILL.md). Forking
superpowers into Meaningfy skills is the documented fallback **only if** this Binding proves leaky.
