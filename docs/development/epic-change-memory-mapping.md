# EPIC ↔ change, seeds, and the memory/orientation decision

How the Meaningfy artifact vocabulary maps onto OpenSpec-native files, so nothing
is ever authored twice (RISK-4), and how project "memory" is handled.

## EPIC ↔ OpenSpec change (R12)

The spine keeps OpenSpec's **native filenames** and overlays Meaningfy nouns —
the most faithful reading of "stick to OpenSpec conventions" (Q2.2=B). One
artifact per concept; no parallel `EPIC.md`/`PLAN.md` files to drift.

| Meaningfy noun | OpenSpec-native file | Authored by |
|---|---|---|
| **EPIC** (work shape) | `changes/<id>/proposal.md` | the EPIC *is* the proposal — Shape-Up sections + native contract |
| **PLAN** | `changes/<id>/design.md` + `tasks.md` | design half + tasks half; the clarity gate scores the pair |
| normative requirements | `changes/<id>/specs/<cap>/spec.md` | SHALL + Given/When/Then deltas |
| durable truth | `openspec/specs/<cap>/spec.md` | the deltas, merged on `archive` |

Because the EPIC *is* `proposal.md` and the PLAN *is* `design.md`+`tasks.md`,
there is exactly one place to write each fact. The clarity gate's target is the
PLAN **pair** (not a third merged file). A rendered `PLAN.md` view MAY be
generated for human reading later — deferred as thin (Q2.1=A); it is a view, not
a source.

## Seed inputs (R11)

- Human seeds (briefs, notes, codebase analysis) live in `changes/<id>/inputs/`.
- They are **preserved for traceability and never deleted or groomed** — the
  authored EPIC supersedes them but does not replace them.
- They play a secondary role beneath the EPIC; the EPIC is the shaped truth.

## Memory / orientation (R10, Q2.4) — decided

**OpenSpec has no memory generator.** Its native project-context surface is
`openspec/config.yaml`'s `context:` string (injected into every artifact's
instructions) plus the `specs/` corpus itself. So:

- **The durable truth is `openspec/specs/`.** We **drop the bespoke,
  hand-maintained `.claude/memory/MEMORY.md`-as-truth** (Q2.4 preferred path C):
  no parallel index pretending to be the source.
- **The orientation index is `openspec/config.yaml`'s `context:` field** — the
  idiomatic, native sink. Today it is hand-written and small.
- **If a generated digest is ever wanted** (Q2.4 fallback A), regenerate it
  *deterministically* from `specs/` + open changes **into the `context:` field**
  — like codegen, with a CI sync-check — rather than curating a separate file.
  Building that generator is **deferred** until EPIC-03 / the first engagement proves an
  index beyond `specs/` + `context:` is actually needed.

## Migration: `.claude/memory/epics/` → spine (R10)

The legacy pattern (frozen-but-local specs dying at implementation in
`.claude/memory/epics/`) migrates to:

- in-flight work → `openspec/changes/<id>/` (EPIC + PLAN + spec deltas + inputs),
- the preserved truth → `openspec/specs/`,
- orientation → `openspec/config.yaml: context:`.

This document is the **definition**. The *mechanics* of projecting this layout
into a fresh or existing repo are EPIC-09 (`project-setup`).
