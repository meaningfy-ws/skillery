# PLAN-03: Spec Authoring & Stewardship (`epic-planning` enrichment)

> Derived from [EPIC-03](EPIC-03-spec-authoring-stewardship.md). Clarity-gate before execution.
> **Deps:** PLAN-02 (schema, golden thread, seed convention).

## Approach (sequence)

Enrich one existing skill (no new skill). **(T1) seed-intake reference → (T2) elicitation discipline
→ (T3) EPIC authoring via schema → (T4) PLAN derivation + clarity-gate → (T5) stewardship/lifecycle
→ (T6) memory-index regen → (T7) update epic-planner wrapper → (T8) trigger-precision + validate.**

## Task breakdown

> **Path note:** this PLAN edits the `epic-planning` skill. Its directory is `skills/epic-planning/`
> **before** the EPIC-04 reorg and `skills/ai-coding/epic-planning/` **after**. If PLAN-03 runs
> before PLAN-04, use the flat path; the file names below are written reorg-agnostic as
> `…/epic-planning/…`.

### T1 — Seed-intake reference *(EPIC R1, R3)*
- **Deps:** PLAN-02 T6. **Files:** `…/epic-planning/references/seed-intake.md` (new),
  `…/epic-planning/SKILL.md` (link).
- **Steps:** document seed sources (human briefs, architecture, test/sample data, notes, brownfield
  codebase analysis via GitNexus); the **archive** rule (`changes/<id>/inputs/`, preserved, secondary,
  never groomed); the Q&A-record format. State the EPIC supersedes the seeds.
- **Acceptance:** an agent following the reference reads seeds, archives them, and enumerates inputs.

### T2 — Elicitation discipline *(EPIC R2)*
- **Deps:** T1. **Files:** `SKILL.md` (+ reference).
- **Steps:** specify the "myriad clarifying questions, one concern at a time, no silent assumptions"
  loop; compose by reference with `superpowers:brainstorming` and map to `/opsx:explore` (PLAN-02 T4).
- **Acceptance:** the skill drives elicitation-before-authoring and references (not restates)
  brainstorming.

### T3 — EPIC authoring via the schema *(EPIC R4–R6)*
- **Deps:** T2, PLAN-02 T3. **Files:** `SKILL.md`.
- **Steps:** produce `EPIC.md` through the `meaningfy` schema (= the change `proposal.md`), Shape-Up
  vocabulary, carrying golden-thread parent IDs; freeze once shaped (further change via deltas, not
  rewrites).
- **Acceptance:** EPIC authored once (not duplicated as a separate proposal); parent IDs present.

### T4 — PLAN derivation + clarity gate *(EPIC R7, R8)*
- **Deps:** T3. **Files:** `SKILL.md`.
- **Steps:** derive `PLAN.md` (algorithm, examples, anti-patterns, test-specs, error matrix, task
  breakdown w/ layers+deps+acceptance, roadmap); each task cites its parent EPIC; run **clarity-gate
  ≥9/10** on the PLAN; gate-fail → revise PLAN/spec, **never** patch code.
- **Acceptance:** clarity-gate is invoked on PLAN (not EPIC); the divergence rule is explicit.

### T5 — Stewardship & lifecycle *(EPIC R9)*
- **Deps:** T3. **Files:** `…/epic-planning/references/stewardship-lifecycle.md`.
- **Steps:** document author-in-`changes/<id>/` → `/opsx:apply` → `sync`/`archive` merges deltas into
  `specs/` → folder moves to `changes/archive/`; grooming `specs/` is part of archive review.
- **Acceptance:** the full lifecycle is documented and ties to PLAN-02's workflows.

### T6 — Memory-index regeneration *(EPIC R10)*
- **Deps:** T5. **Files:** `…/epic-planning/references/stewardship-lifecycle.md` (same file as T5).
- **Steps:** define how `.claude/memory/MEMORY.md` is regenerated from `specs/`/changes (cache, not
  truth) and the ≤200-line cap.
- **Acceptance:** memory-as-index procedure documented.

### T7 — Update the `epic-planner` wrapper *(EPIC R11)*
- **Deps:** T1–T6. **Files:** `agents/epic-planner.md`.
- **Steps:** load enriched `epic-planning` + `clarity-gate`; drive `/opsx:explore`/`propose`; keep the
  wrapper thin (role + model + tools + skills + glue, no knowledge).
- **Acceptance:** wrapper carries no knowledge; references the enriched skill.

### T8 — Trigger precision + validate *(EPIC C4, A5)*
- **Deps:** T1–T7. **Steps:** confirm `epic-planning` still fires on its probes and doesn't collide
  with neighbours after the description grows; `SKILL.md` ≤ ~500 lines (push detail to `references/`);
  `make validate`.
- **Acceptance:** probes recorded; length ok; validate green.

## Anti-patterns
- ❌ Overloading `epic-planning` with the lifecycle (Q3.1=C — stewardship is its
  own `spec-stewardship` skill; keep authoring and lifecycle boundaries clean).
- ❌ Authoring an EPIC and a separate OpenSpec proposal (they are one: EPIC ≡ `proposal.md`).
- ❌ Deleting/grooming seed inputs (preserve, secondary).
- ❌ Running the FULL clarity gate on the EPIC instead of the PLAN (the EPIC gets a
  *lightweight* readiness check only — Q3.3=A).

## Verification
- A dry-run on the PLAN-02 sample: seeds archived under `inputs/`, EPIC+PLAN produced, clarity-gate
  invoked on PLAN, wrapper drives `/opsx`. `make validate` green; trigger probes pass.

## Roadmap
- [x] T1 seed-intake · [x] T2 elicitation · [x] T3 EPIC authoring · [x] T4 PLAN+clarity-gate
- [x] T5 stewardship · [x] T6 memory index · [x] T7 wrapper · [x] T8 triggers+validate

## Execution status
Stewardship split into its own **`spec-stewardship`** skill (Q3.1=C). `epic-planning`
enriched with seed intake (`references/seed-intake.md`), elicitation→`/opsx:explore`,
EPIC≡`proposal.md` shaping, the lightweight EPIC readiness check (Q3.3=A), PLAN≡
`design.md`+`tasks.md` derivation, clarity-gate on the PLAN, and the freeze-vs-reshape
rule (Q3.2=A). `spec-stewardship` owns the change lifecycle, delta→`specs/` merge,
grooming, and the orientation-index policy (truth=`specs/`, index=`config.yaml: context:`).
`epic-planner` agent rewired to drive `/opsx` with native paths. Registered in
`meaningfy-ai-coding` + `meaningfy-spine`; trigger probe added; `make validate` green.

## Clarity-gate self-check
Each task names files + acceptance; the no-new-skill and EPIC≡proposal constraints are explicit;
the divergence rule is restated. No hidden assumptions about OpenSpec (all grounded in PLAN-02).
