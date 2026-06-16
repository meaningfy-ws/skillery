---
name: epic-planning
description: Shape an EPIC (the bet + decisions) from architecture docs, then derive its clarity-gated PLAN. Specifications-first — the EPIC *is* the work shape (Shape Up style): appetite, problem, solution outline, key decisions, rabbit-holes, no-gos. The PLAN derives the executable breakdown (algorithm, examples, anti-patterns, test-case specs, error matrix, task breakdown, roadmap) and is scored by the clarity gate (≥9/10) — gate the plan, not the shape. Trigger on "write/refine an EPIC", "shape this work", "plan this epic", "derive the plan". For the general doc-first build loop use the external `stream-coding` skill; this skill produces the EPIC.md + PLAN.md.
license: Apache 2.0
metadata:
  category: ai-coding
---

# EPIC Planning

## Overview

Specifications-first. Architecture is broken into EPICs; each EPIC is **shaped** (the bet + key
decisions, at the right abstraction), then a **PLAN** is derived from it (the unambiguous executable
breakdown) and gated. The EPIC *is* the work shape (Shape Up style) — one artifact, not a separate
shape and epic. Ask before assuming; never produce a spec with hidden assumptions.

## Procedure

1. **Read all inputs** before asking: `MEMORY.md`, architecture docs / ADRs, sample data, and any
   existing `EPIC.md` / `PLAN.md` (if refining).
2. **Ask focused, grouped questions** for anything missing or ambiguous — make no assumptions.
   After each round, summarise what you understood and confirm.
3. **Shape the `EPIC.md`** (the bet) using `references/epic-template.md`: appetite, problem,
   solution outline, **key decisions**, rabbit-holes, no-gos. Keep it at shaping altitude — leave
   implementation room. It **freezes** once shaped.
4. **Derive the `PLAN.md`** from the shaped EPIC: algorithm, concrete examples, anti-patterns,
   test-case specs, error matrix, task breakdown, roadmap (same template file).
5. **Run the clarity gate on the PLAN** (the `clarity-gate` skill): it must score **≥ 9/10** before
   implementation. Below 9, list the specific gaps and revise the PLAN (not the shape).
6. Keep the EPIC and PLAN status headers current; the PLAN's Part 2 is the implementation log.

## What you do NOT do

- Write implementation code, Gherkin step definitions, or commit changes.
- Make architectural decisions unilaterally — propose options with trade-offs; the developer decides.

## Boundary & Related Skills

**Owns:** the shaping + planning procedure and the EPIC.md (shaped bet) + PLAN.md (executable plan)
structure (templates in `references/`).
**Delegates:** plan scoring → `clarity-gate`; the doc-first build method → external `stream-coding`;
Gherkin → `bdd-gherkin`; code → `cosmic-python`. This skill produces the **EPIC + PLAN**, not the build.
**Related:** `clarity-gate`, `stream-coding` (external), `bdd-gherkin`, `architecture`.
