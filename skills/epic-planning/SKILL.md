---
name: epic-planning
description: Shape an EPIC from human seeds, then derive its clarity-gated PLAN. Specifications-first, Shape-Up style — the EPIC is the work shape (appetite, problem, solution outline, key decisions, rabbit-holes, no-gos) and IS the OpenSpec proposal; the PLAN is the derived executable breakdown (design + tasks) scored by the clarity gate (≥9/10). Drives seed intake and a myriad of clarifying questions, makes no silent assumptions. Trigger on "write/refine an EPIC", "shape this work", "plan this epic", "derive the plan", "turn these seed notes into an epic". For the living-spec lifecycle (archive, grooming, memory) use spec-stewardship; for the doc-first build loop use external stream-coding.
license: Apache 2.0
metadata:
  category: ai-coding
---

# EPIC Planning

## Overview

Specifications-first. Architecture and human intent are turned into **shaped EPICs**, each of
which derives a gated **PLAN**. In the Meaningfy spine the artifacts are OpenSpec-native (see the
[spine](../../spine/README.md)): the **EPIC ≡ `proposal.md`** (the Shape-Up work shape) and the
**PLAN ≡ `design.md` + `tasks.md`** (the pair the clarity gate scores). One artifact per concept —
never a parallel `EPIC.md`/`PLAN.md` file. Ask before assuming; never ship a spec with hidden
assumptions (Human Sovereignty).

This skill **authors**. The living-spec lifecycle after authoring — archive, grooming `specs/`,
regenerating the orientation index — belongs to [`spec-stewardship`](../spec-stewardship/SKILL.md).

## Procedure (maps to the `/opsx` build-tier flow — see [`spine/workflows.md`](../../spine/workflows.md))

1. **Seed intake** (`/opsx:explore`). Read every human seed and supporting input — seed notes,
   architecture/ADRs, sample/test data, free notes, and for brownfield an existing-codebase analysis
   (optionally via GitNexus). Enumerate what you read. Details: [`references/seed-intake.md`](references/seed-intake.md).
2. **Elicit** (`/opsx:explore` + `superpowers:brainstorming`). Drive a *myriad of clarifying
   questions*, **one concern at a time**, to surface and decide every ambiguity, conflict, and
   assumption **before** writing the EPIC. After each round, summarise what you understood and
   confirm. Make no silent assumptions.
3. **Archive the seeds.** Write the captured seeds and the Q&A record to `changes/<id>/inputs/`,
   marked **secondary** and **never deleted or groomed** — the authored EPIC supersedes them but does
   not replace them (the EPIC is the primary, shaped truth).
4. **Shape the EPIC** (`/opsx:propose` → `proposal.md`). Use the spine template
   ([`openspec/schemas/meaningfy/templates/proposal.md`](../../openspec/schemas/meaningfy/templates/proposal.md)):
   appetite, why, solution outline, **key decisions** (each with a citeable `DEC-` id), rabbit-holes,
   **no-gos** (mandatory). Cite the EPIC's **golden-thread parents** (the requirement/architecture it
   derives from — see [`spine/golden-thread.md`](../../spine/golden-thread.md)). Keep it at shaping
   altitude — leave implementation room.
5. **EPIC readiness check** (lightweight). Before deriving the PLAN, run the **lightweight variant**
   of [`clarity-gate`](../clarity-gate/SKILL.md) over the EPIC — a quick readiness pass that catches
   bet-level ambiguity (vague problem, missing no-gos, undecided key decisions). This is *not* the
   full ≥9/10 gate (the Shape-Up bet stays deliberately looser); it just stops a vague EPIC producing
   a vague PLAN.
6. **Derive the PLAN** (`design.md` + `tasks.md`). From the shaped EPIC, produce the design half
   (algorithm, concrete examples, anti-patterns, error matrix, decisions) and the tasks half (ordered
   breakdown with layers/dependencies/acceptance, roadmap). Each PLAN cites its parent EPIC id
   (golden thread).
7. **Gate the PLAN** (full `clarity-gate`, ≥9/10). Score the `design.md`+`tasks.md` pair. Block
   progression to BDD/implementation until it passes. Below 9: list the specific gaps and **revise
   the PLAN** — never patch code to dodge a gap (Rule of Divergence).

## When the bet itself is wrong (freeze vs re-shape)

The EPIC **freezes once shaped**. But elicitation or implementation can reveal two different kinds
of wrongness — handle them differently:

- **PLAN-level wrongness** (the approach/breakdown is off, the bet still holds) → **revise the PLAN**.
  Normal divergence.
- **EPIC-level wrongness** (the *bet itself* is invalid) → **re-shape the EPIC as a deliberate,
  logged event** — record why in the EPIC's decisions and the change inputs, not a silent edit. A
  re-shape is a visible decision with an audit trail, which keeps the freeze meaningful.

## What you do NOT do

- Write implementation code, Gherkin step definitions, or commit changes.
- Run the living-spec lifecycle (archive/groom/memory) — that is `spec-stewardship`.
- Make architectural decisions unilaterally — propose options with trade-offs; the developer decides.

## Boundary & Related Skills

**Owns:** the **authoring** practice — seed intake, elicitation, EPIC shaping (= `proposal.md`), the
lightweight EPIC readiness check, and PLAN derivation (= `design.md` + `tasks.md`).
**Delegates:** PLAN scoring → [`clarity-gate`](../clarity-gate/SKILL.md); the living-spec lifecycle
(archive, grooming, memory-index regen) → [`spec-stewardship`](../spec-stewardship/SKILL.md);
Gherkin → [`bdd-gherkin`](../bdd-gherkin/SKILL.md); code → [`cosmic-python`](../cosmic-python/SKILL.md);
the doc-first build loop → external `stream-coding`.
**Related:** `clarity-gate`, `spec-stewardship`, `bdd-gherkin`, `architecture`, `stream-coding` (external).
