# The `/opsx` Runbook (v2)

**Audience:** Meaningfy developers running the EPIC-tier build loop with Claude Code.

**Purpose:** the day-to-day `/opsx` workflow — how a single Epic moves from seed to archived spec.
For the *why* see [two-tier-methodology.md](two-tier-methodology.md); for the repo layout see
[openspec-setup-guide.md](openspec-setup-guide.md); for the gates see
[dod-quality-gates.md](dod-quality-gates.md).

This runbook points; the authority for each step is the skill it names.

---

## 1. The verb roster (summary — point, don't duplicate)

OpenSpec exposes the build loop as `/opsx:<verb>` commands. skillery ships the **core profile**
(`propose`, `explore`, `apply`, `sync`, `archive`); an expanded set (`new`, `continue`, `ff`,
`verify`, `bulk-archive`, `onboard`) is opt-in per repo. The full table and the command→driving-skill
map are the single source in [`spine/workflows.md`](../../spine/workflows.md#verb-roster) — do not
re-list verbs elsewhere.

---

## 2. The build-tier command sequence

The main per-Epic loop (see [`spine/workflows.md`](../../spine/workflows.md#named-meaningfy-workflow-patterns)
for the canonical pattern):

```
/opsx:propose   → author the EPIC (proposal.md, Shape-Up shape)
  derive PLAN   → design.md + tasks.md (the clarity-gate target)
  clarity-gate  → score the PLAN pair ≥9/10 (semantic; not CI)
  (bdd)         → .feature acceptance off the spec deltas
/opsx:apply     → TDD implementation
/opsx:verify    → change satisfies its specs
/opsx:sync | /opsx:archive → merge deltas into openspec/specs/ (the durable truth)
```

Each verb has exactly one driving discipline — see the command→skill map in
[`spine/workflows.md`](../../spine/workflows.md#command--driving-meaningfy-discipline).

---

## 3. The seed → EPIC → PLAN authoring flow

Authoring is owned by [`epic-planning`](../../skills/epic-planning/SKILL.md):

1. **Seed intake** (`/opsx:explore`) — read every human seed (briefs, notes, ADRs, sample data,
   brownfield codebase analysis) and enumerate what was read.
2. **Elicit** — a myriad of clarifying questions, one concern at a time; no silent assumptions.
3. **Archive the seeds** to `changes/<id>/inputs/` — preserved, never groomed (traceability).
4. **Shape the EPIC** (`/opsx:propose` → `proposal.md`) — appetite, why, solution, key decisions
   (`DEC-` ids), rabbit-holes, no-gos; cite the golden-thread parent.
5. **Derive the PLAN** (`design.md` + `tasks.md`) and **gate it** with
   [`clarity-gate`](../../skills/clarity-gate/SKILL.md) at ≥9/10 before implementation.

Seeds are *inputs*, not the spec: any brief, note, codebase analysis, or ticket can seed an Epic.
There is no single mandated input format — the shaped EPIC is the truth, the seeds sit beneath it.

---

## 4. Archive & lifecycle

Once the change is implemented and verified, the living-spec lifecycle is owned by
[`spec-stewardship`](../../skills/spec-stewardship/SKILL.md):

- `/opsx:sync` merges delta specs into the main specs without archiving;
- `/opsx:archive` validates the deltas (`openspec validate --strict`), merges them into
  `openspec/specs/<cap>/spec.md`, and moves the change to `openspec/changes/archive/`.
- Archive is **deterministic** — kept out of the LLM-generation path. Seed inputs survive with the
  archived change.

The full lifecycle (grooming the durable store, brownfield delta conventions, the orientation-index
policy) lives in [`spec-stewardship`](../../skills/spec-stewardship/SKILL.md); the
mapping of nouns to files in [`spine/epic-change-memory-mapping.md`](../../spine/epic-change-memory-mapping.md).
