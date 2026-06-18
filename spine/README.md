# The Meaningfy Spine

The **spine** is skillery's durable, traceable specification backbone: the
connective tissue that makes product development reliable across the
consulting → delivery arc. It is built on [OpenSpec](https://github.com/Fission-AI/OpenSpec)
(`@fission-ai/openspec`, pinned in [`openspec-version.txt`](openspec-version.txt))
as the artifact-lifecycle engine, with a thin Meaningfy fork of its schema.

> This directory is the spine's **documentation and conventions**. The live
> OpenSpec instance — the forked schema, project config, specs store, and the
> worked example — lives under [`../openspec/`](../openspec). skillery dogfoods
> its own spine: the `openspec/` instance here is exercised by skillery itself.

## Where things live

| Asset | Path |
|---|---|
| Forked `meaningfy` schema (`schema.yaml` + `templates/`) | [`../openspec/schemas/meaningfy/`](../openspec/schemas/meaningfy) |
| Project config (schema, context, thin rules) | [`../openspec/config.yaml`](../openspec/config.yaml) |
| Durable capability specs (the truth) | `../openspec/specs/` |
| Changes (in-flight) + archive | `../openspec/changes/` |
| Worked example (the round-trip) | [`../openspec/changes/example-spine-roundtrip/`](../openspec/changes/example-spine-roundtrip) |
| Pinned OpenSpec version | [`openspec-version.txt`](openspec-version.txt) |

## Conventions (this directory)

- [`workflows.md`](workflows.md) — the `/opsx` verb roster, the named Meaningfy
  workflow patterns, the profile, and the command → driving-skill map.
- [`golden-thread.md`](golden-thread.md) — the traceability chain and the
  cite-your-parent rule (deliberately coarse / provisional).
- [`epic-change-memory-mapping.md`](epic-change-memory-mapping.md) — how the
  Meaningfy artifact vocabulary maps onto OpenSpec-native files, the seed-input
  convention, and the memory/orientation decision.
- [`lessons-loop.md`](lessons-loop.md) — the lessons-learned → skill-evolution loop.
- [`meaningfy-spine-bundle.md`](meaningfy-spine-bundle.md) — the contents of the
  `meaningfy-spine` meta-bundle (EPIC-04 registers it in the marketplace).

## The artifact ladder (necessary and sufficient)

| Meaningfy noun | OpenSpec-native file | Role |
|---|---|---|
| **EPIC** (work shape) | `changes/<id>/proposal.md` | Shape-Up bet: appetite, why, solution, decisions, rabbit-holes, no-gos |
| **PLAN** | `changes/<id>/design.md` + `tasks.md` | design half + tasks half; the clarity gate scores the pair (≥9/10) |
| normative spec | `changes/<id>/specs/<cap>/spec.md` | RFC-2119 SHALL + Given/When/Then deltas (no EARS) |
| durable truth | `openspec/specs/<cap>/spec.md` | what the deltas merge into on `archive` |
| seed inputs | `changes/<id>/inputs/` | raw human briefs; preserved, never groomed |

## Two gates, two natures

- **Clarity gate** — *semantic*, scores the PLAN (design.md + tasks.md) ≥9/10.
  Run by a human/agent (the [`clarity-gate`](../skills/ai-coding/clarity-gate) skill).
  **Not** CI-automated.
- **`openspec validate --strict`** — *structural*, checks artifact shape and
  delta format. **CI-automated** (see [`../Makefile`](../Makefile) target
  `validate-spine`).

They are complementary: structure is mechanical, clarity is judgement.
