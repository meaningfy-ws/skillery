---
name: spec-stewardship
description: Steward the living specification spine after an EPIC is authored — the EPIC↔change lifecycle, archiving completed changes, grooming the durable specs/ store, and keeping the orientation index in sync. Use when finishing/archiving a change, merging spec deltas into the truth, grooming or reviewing the living specs, or refreshing project context/memory. Trigger on "archive this change", "groom the specs", "sync the spec deltas", "what's the lifecycle of a change", "regenerate the memory index", "merge into specs". For authoring the EPIC/PLAN use epic-planning; for the schema/conventions see the spine docs.
license: Apache 2.0
metadata:
  purpose: software-development
  area: coding
  subject: spec-driven
  posture: reusable
  stage: shape
  maturity: stable
---

# Spec Stewardship

## Overview

The spine is only valuable if its specs stay **well maintained, groomed, and preserved**. This
skill owns the **care of the living specs** after `epic-planning` has
authored an EPIC and PLAN: moving a change through its lifecycle, merging its deltas into the
durable truth, grooming that truth, and keeping the cheap orientation index honest.

It does **not** author EPICs/PLANs (that is `epic-planning`) and does **not** define the schema or
conventions (those are OpenSpec's and the `meaningfy` schema's) — it *runs* them.

## The change lifecycle (maps to the OpenSpec `/opsx` verbs)

```
author in openspec/changes/<id>/     (epic-planning: proposal.md + design.md + tasks.md + specs/ deltas)
  → implement            /opsx:apply  (TDD; the implementer agent drives this)
  → verify               /opsx:verify (change satisfies its specs)
  → sync / archive       /opsx:sync | /opsx:archive
        archive validates the deltas, merges them into openspec/specs/<cap>/spec.md
        (RENAMED → REMOVED → MODIFIED → ADDED), then moves the change to
        openspec/changes/archive/<date>-<id>/
```

- **Archive is deterministic** — keep it out of the LLM-generation path. Run
  `openspec validate --strict` first; archive blocks on invalid deltas.
- **No open plan drift at archive.** A change is archived only when what was built matches its
  EPIC and PLAN: each drift is either reconciled into the PLAN or recorded as a deviation, with its
  reason, in the change's `deviations.md`. The navigator mod's *Archive check* lists what is open.
- **After archive, run `make fix-spec-links`.** The archive copies a delta's relative links into
  `specs/` verbatim, so a delta nested deeper than its merged home leaves over-deep `../` links.
  The auto-fixer recomputes the depth; the validator's `broken_links` check is the safety net.
- **Seed inputs survive.** `changes/<id>/inputs/` (and `evidence/`, when present) is preserved
  with the archived change — never deleted or groomed (traceability).
- **Who archives.** In an EPIC's delivery, the lead runs the archive at the end of the epic session
  (`epic-delivery`).

## Grooming the durable `specs/`

- The durable truth is `openspec/specs/<capability>/spec.md` — the merged, machine-validated specs.
- Grooming happens **at archive review**: fix a freshly-created spec's `Purpose` placeholder, keep
  capability names coherent, and ensure no requirement lost detail in a MODIFIED delta (a common
  pitfall — MODIFIED must carry the full updated requirement, not a fragment).
- Brownfield changes are **delta-only**: `propose` the delta → `apply` → `archive`. Do not rewrite
  the whole spec; express the change as ADDED/MODIFIED/REMOVED/RENAMED.

## The orientation index (memory) — keep it honest, don't let it pretend to be truth

Per the spine decision (one EPIC is one OpenSpec change):

- **Truth = `openspec/specs/`.** There is no bespoke `MEMORY.md`-as-truth.
- **Orientation = `openspec/config.yaml`'s `context:` field** (OpenSpec's native sink, injected into
  every artifact's instructions). Keep it short and current.
- If a generated digest is ever wanted, **regenerate it deterministically** from `specs/` + open
  changes **into `context:`** (like codegen, with a CI sync-check) — never hand-curate a parallel
  index that silently diverges. Building that generator is deferred until it is proven needed.

## The Rule of Divergence (stewardship view)

When reality and spec disagree, fix the **spec**, not by quietly editing code:

- PLAN-level wrongness → revise the PLAN (back to `epic-planning`).
- EPIC-level wrongness (the bet is invalid) → a deliberate, logged **re-shape** or a superseding new
  change — never a silent rewrite of a frozen, shaped EPIC.

## Boundary & Related Skills

**Owns:** the post-authoring **lifecycle and care** of the living specs — change archive, delta→`specs/`
merge, grooming the durable store, brownfield delta conventions, and the orientation-index policy.
**Delegates:** authoring the EPIC/PLAN → `epic-planning`; the schema +
conventions → OpenSpec and the `meaningfy` schema; implementation → external `implementer`/TDD;
scoring the PLAN → `clarity-gate`.
**Related:** `epic-planning`, `epic-delivery`, `clarity-gate`, `bdd-gherkin`.

Answers `VAL, VER` in `test-strategy`'s matrix (`references/shaping.md`, `references/cross-cutting.md`).
