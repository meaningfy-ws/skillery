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
| `explore` | `superpowers:brainstorming` + [`epic-planning`](../skills/ai-coding/epic-planning) elicitation |
| `propose` | [`epic-planning`](../skills/ai-coding/epic-planning) (shapes the EPIC = proposal.md) |
| derive PLAN | [`epic-planning`](../skills/ai-coding/epic-planning) (design.md + tasks.md) |
| clarity gate | [`clarity-gate`](../skills/ai-coding/clarity-gate) (semantic ≥9/10 on the PLAN) |
| specs (deltas) | [`bdd-gherkin`](../skills/ai-coding/bdd-gherkin) feeds executable `.feature`s off the SHALL+GWT |
| `apply` | `superpowers:test-driven-development` + [`cosmic-python`](../skills/engineering/cosmic-python) |
| `verify` | [`meaningfy-code-review`](../skills/ai-coding/meaningfy-code-review) + `superpowers:verification-before-completion` |
| `sync` / `archive` | spine convention (deterministic; kept out of the LLM path) |

> The clarity gate (PLAN, semantic) and `openspec validate --strict` (structure,
> CI) are complementary — see [`README.md`](README.md#two-gates-two-natures).
