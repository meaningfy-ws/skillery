# OpenSpec Setup Guide (v2)

**Audience:** Meaningfy developers replicating the spine — the durable, traceable spec backbone —
layout on a project repo.

**Purpose:** describe the `openspec/` layout and the `.claude/` memory model the two-tier method
runs on. This doc **describes**; the **mechanics** of scaffolding a repo are the
[`project-setup`](../../skills/project-setup/SKILL.md) skill (EPIC-09) — this doc does
not duplicate them. For the methodology see
[`docs/ai-coding/build-lifecycle.md`](../ai-coding/build-lifecycle.md); for
the spine conventions see [`docs/development/spine.md`](../development/spine.md).

---

## 1. The `openspec/` layout

OpenSpec is the artifact-lifecycle engine. A spine repo carries:

```
openspec/
├── schemas/meaningfy/      # the forked Meaningfy schema (schema.yaml + templates/)
├── specs/                  # durable capability specs — THE TRUTH
├── changes/                # in-flight changes + changes/archive/
└── config.yaml             # project config: schema, context:, thin per-artifact rules
```

- **`schemas/meaningfy/`** — the thin Meaningfy fork of OpenSpec's schema (Shape-Up `proposal.md`
  template + native contract). See [`docs/development/spine.md`](../development/spine.md#where-things-live).
- **`specs/`** — the merged, machine-validated truth; deltas merge here on `archive`.
- **`changes/<id>/`** — `proposal.md` (EPIC), `design.md` + `tasks.md` (PLAN), `specs/` deltas, and
  `inputs/` (preserved seeds).
- **`config.yaml`** — names the schema, carries the `context:` orientation field, and the (thin)
  per-artifact rules.

---

## 2. The `context:` orientation field

OpenSpec has **no memory generator**. Its native project-context surface is `config.yaml`'s
**`context:`** string, injected (wrapped in `<context>`) into every artifact's instructions. This is
the idiomatic orientation sink: a short, current digest of repo + architecture + commit + artifact
conventions. Today it is hand-written and small.

If a generated digest is ever wanted, it is regenerated **deterministically** from `specs/` + open
changes **into `context:`** (like codegen, with a CI sync-check) — never a hand-curated parallel
file. The full policy is owned by
[`spec-stewardship`](../../skills/spec-stewardship/SKILL.md) and defined in
[`docs/development/epic-change-memory-mapping.md`](../development/epic-change-memory-mapping.md).

---

## 3. `.claude/` memory is a regenerable index — the truth is `openspec/specs/`

The bespoke `MEMORY.md`-as-truth pattern is **dropped**. There is no parallel index pretending to be
the source:

- **Truth = `openspec/specs/`** (the merged, validated capability specs).
- **Orientation = `config.yaml: context:`** (regenerable).
- Anything under `.claude/` is a cheap index, not authority — if it disagrees with `specs/`,
  `specs/` wins.

This is the migration away from the legacy `.claude/memory/epics/` pattern (frozen-but-local specs
dying at implementation) towards the durable `openspec/` store — see
[`docs/development/epic-change-memory-mapping.md`](../development/epic-change-memory-mapping.md#migration-claudememoryepics--spine).

---

## 4. `AGENTS.md` canonical — `CLAUDE.md` is a thin pointer

`AGENTS.md` at the root is the one, CLI-agnostic agent-instructions file (opencode reads it
natively). `CLAUDE.md` is a short regular file that says "read `AGENTS.md`", imports it with a line
`@AGENTS.md`, and adds only Claude Code-specific guidance. Both are regular files — **never a
symlink** between them, in either direction, and no copy-sync hook. One source, two entry points.
The rule is the `dual-cli-distribution` spec's requirement "AGENTS.md canonical, CLAUDE.md pointer,
no symlink".

---

## 5. What does the scaffolding

This guide describes the *target* layout. Laying it down on a fresh or existing repo — creating
`openspec/`, wiring `config.yaml`, `AGENTS.md` and its `CLAUDE.md` pointer, the layered package, tooling, and CI —
is the [`project-setup`](../../skills/project-setup/SKILL.md) skill (EPIC-09). **This
doc DESCRIBES; project-setup DOES.**
