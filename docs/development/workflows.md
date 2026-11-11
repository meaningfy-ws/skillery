# Meaningfy spine workflows & profiles

How the Meaningfy build tier drives OpenSpec's `/opsx` commands. This is the
single home for the verb roster — every other doc references this file by anchor
rather than re-listing verbs.

## The canonical `/opsx` verb roster {#verb-roster}

OpenSpec exposes these workflow verbs as `/opsx:<verb>` slash-commands / skills
(authoritative for the pinned version — see [`openspec-version.txt`](../../openspec/openspec-version.txt)):

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
During `apply`, the lead runs the PLAN stage by stage with a small agent team (prepare, build,
challenge, decide and fix, check, merge), scaled by the EPIC's appetite; when the EPIC delivers or
changes a use case, the acceptance demo comes before `archive`. The loop is owned by [`epic-delivery`](../../skills/epic-delivery/SKILL.md).
The phases navigator shows are in [`navigator.md`](../environment/navigator.md); their order is owned by `epic-delivery`.

### Work shaping (seed → gated PLAN)
```
explore  → elicit from seed inputs (changes/<id>/inputs/)
  → propose → shape the EPIC, derive the PLAN
  → clarity-gate
```
The flow ends at the clarity gate; delivery is the next session. The steps are owned by
[`epic-planning`](../../skills/epic-planning/SKILL.md).

### Brownfield change (delta-only)
```
propose (delta-only)  → apply  → archive (merge into specs/)
```

### Workflow files

The phases of these patterns, and of the other Meaningfy activities, are also data: one workflow
file per activity, kept in the skill that owns it. The [navigator](../environment/navigator.md) mod
reads them to show the phase and to warn when a step is skipped. A skill that hosts one is an
*activity skill* ([`creating-skills.md`](creating-skills.md#activity-skills)).

**One lead per workflow.** Each default workflow has exactly one lead worker: the agent whose
primary skill is the workflow's host skill (its `owner`) and whose type is `lead`, or `scheduled`
when its **Input** offers a `human session` (as `sales-agent` does). The workflow file has no field
of its own for the lead: it follows from the agent's type and primary skill, and the workflow's
top-level `activate.agents` lists it. The lead may delegate parts of the work
([`agent-template.md` § *Workers*](agent-template.md#workers)). The `workflow_lead` check of
`make validate` holds both rules.

| Workflow | File | Lead | Variants |
|---|---|---|---|
| EPIC shaping | [`epic-planning`](../../skills/epic-planning/assets/workflows/epic-shaping.workflow.json) | `epic-planner` | — |
| EPIC delivery | [`epic-delivery`](../../skills/epic-delivery/assets/workflows/epic-delivery.workflow.json) | `team-lead` | brownfield |
| Architecture | [`architecture`](../../skills/architecture/assets/workflows/architecting.workflow.json) | `system-architect` | — |
| Conceptual modelling | [`conceptual-modelling`](../../skills/conceptual-modelling/assets/workflows/modelling.workflow.json) | `conceptual-modeller` | — |
| Release | [`meaningfy-release`](../../skills/meaningfy-release/assets/workflows/release.workflow.json) | `release-manager` | — |
| DevOps | [`infrastructure-operations`](../../skills/infrastructure-operations/assets/workflows/devops.workflow.json) | `devops-engineer` | intervention, incident, check-up, unattended |
| Sales (provisional) | [`sales-operations`](../../skills/sales-operations/assets/workflows/sales.workflow.json) | `sales-agent` | — |
| Documentation | [`technical-writing`](../../skills/technical-writing/assets/workflows/documentation.workflow.json) | `technical-writer` | — |

A *workflow bundle* is something else: a bundle that serves one personal routine
(`vault-assistant`), unrelated to these workflow files.

A repository can change them with its own files in `docs/navigator/*.workflow.json`. A file with
the name of a default replaces it; a file with `"extends": "<name>"` replaces only the fields it
gives; a file with a new name adds a workflow. The smallest one declares the repository strict,
so navigator blocks a skipped step (what strict refuses is in
[`navigator.md`](../environment/navigator.md#loose-and-strict)):

```json
{ "name": "epic-delivery", "extends": "epic-delivery", "mode": "strict" }
```

`extends` merges one level: a field you give replaces the default's whole field. The default gates
are the targets `project-setup` scaffolds, `full-gates` = `make check-all` (epic-delivery) and
`docs-gate` = `make build-docs` (documentation). A repository whose checks have other names gives the
whole `gates` object, with its own command in the gate it changes and the others copied. This
repository does so with `make validate`: see
[`docs/navigator/epic-delivery.workflow.json`](../navigator/epic-delivery.workflow.json) and
[`documentation.workflow.json`](../navigator/documentation.workflow.json).

```json
{ "name": "epic-delivery", "extends": "epic-delivery",
  "gates": {
    "full-gates": { "kind": "command", "match": "\\bmake validate(?![\\w-])", "run": "make validate" }
  } }
```

This shows the changed gate only. Because `gates` is replaced whole, the real file
[`docs/navigator/epic-delivery.workflow.json`](../navigator/epic-delivery.workflow.json) restates the
other gates too.

The schema is described in [`mods.md`](mods.md#workflow-files).

## Command → driving Meaningfy discipline

Which skill / superpowers discipline owns each verb. This is the concrete
"how is it used", and the single-owner map EPIC-05 builds the methodology on
(so no behaviour is owned twice — RISK-4).

| `/opsx` verb | Driven by |
|---|---|
| `explore` | `superpowers:brainstorming` + [`epic-planning`](../../skills/epic-planning) elicitation |
| `propose` | [`epic-planning`](../../skills/epic-planning) (shapes the EPIC = proposal.md) |
| derive PLAN | [`epic-planning`](../../skills/epic-planning) (design.md + tasks.md) + [`bdd-gherkin`](../../skills/bdd-gherkin) authors `.feature` coverage as a **design-phase** PLAN artifact off the SHALL+GWT |
| clarity gate | [`clarity-gate`](../../skills/clarity-gate) (semantic ≥9/10 on the PLAN **incl. scenario coverage**) |
| `apply` | `superpowers:test-driven-development` (step definitions + code) + [`cosmic-python`](../../skills/cosmic-python) (incl. `PR-SURVEY-FIRST`) |
| `verify` | [`meaningfy-code-review`](../../skills/meaningfy-code-review) + `superpowers:verification-before-completion` |
| `sync` / `archive` | spine convention (deterministic; kept out of the LLM path) |

> The clarity gate (PLAN, semantic) and `openspec validate --strict` (structure,
> CI) are complementary — see [`README.md`](spine.md#two-gates-two-natures).

## superpowers ↔ spine

`superpowers` provides **disciplines** (thinking, testing, execution), **not** a parallel spec
system. In a spine repo its artifacts land in `openspec/changes/<id>/`, never a `docs/superpowers/`
tree (a Binding in the repo `CLAUDE.md` enforces this). Map:

| superpowers | role here | lands as |
|---|---|---|
| `brainstorming` | thinking method during `explore` / shaping | feeds the **EPIC** (`proposal.md`) — not a separate `docs/superpowers/specs/` design |
| `writing-plans` | **superseded** inside a spine repo | the **PLAN** (`design.md` + `tasks.md`), derived by [`epic-planning`](../../skills/epic-planning/SKILL.md) and gated by [`clarity-gate`](../../skills/clarity-gate/SKILL.md) |
| `test-driven-development` | the build discipline | `apply` — TDD inside [`cosmic-python`](../../skills/cosmic-python/SKILL.md) layers |
| `subagent-driven-development` / `executing-plans` | execution harness | runs `tasks.md`, tracked via `/opsx:apply` |
| `systematic-debugging`, `verification-before-completion` | quality disciplines | used during `apply` / `verify` |

**Why:** one durable, traceable spec system (the spine), not two. The lifecycle (archive, grooming,
the orientation index) is owned by [`spec-stewardship`](../../skills/spec-stewardship/SKILL.md). Forking
superpowers into Meaningfy skills is the documented fallback **only if** this Binding proves leaky.
