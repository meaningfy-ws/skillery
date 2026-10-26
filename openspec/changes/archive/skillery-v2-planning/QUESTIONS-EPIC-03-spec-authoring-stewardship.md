# Open Questions — EPIC-03: Spec Authoring & Stewardship

> Questions for [EPIC-03](EPIC-03-spec-authoring-stewardship.md) · [PLAN-03](PLAN-03-spec-authoring-stewardship.md). Answer inline on the **Answer:** lines.

### Q3.1 — One enriched `epic-planning` skill, or is it now too big for one SKILL.md?
DEC-9 folds stewardship into `epic-planning` (no new skill). EPIC-03 then loads it with seed-intake,
elicitation, EPIC authoring, PLAN derivation, lifecycle, *and* memory-index regen — under a ≤500-line
cap (C1) with detail pushed to `references/`. This is open because the fold-in may overflow the skill's
cohesion even if it fits the line cap.
- **A) ★** Keep one skill; aggressively push all procedure into `references/` (seed-intake, stewardship-lifecycle already planned) and keep `SKILL.md` as a thin router. — Honours DEC-9 and the cap; the reference split is already in PLAN-03.
- **B)** Keep one skill but split the *agent* layer: a distinct `steward` agent wrapper alongside `epic-planner`, both loading the one skill. — Preserves DEC-9 at the skill layer while separating the two workflows operationally.
- **C) (scope-expanding — only if you want to re-shape)** Revisit DEC-9 and split stewardship into its own skill. — Cleanest cohesion, but reopens a locked decision and adds a skill.

**Answer:** C) we shall be as precise as possible and guard the boundaris to allow for proper lifecycle per skill and limited set of responsabilities (not sure thsi applies to otehr skills,and if so it is allways better to breakdown into 2-3 skills tan keep a massive one) 

### Q3.2 — How "frozen" is a frozen EPIC when elicitation reveals the bet was wrong?
R6 freezes the EPIC once shaped; further change goes through new deltas, "preserving the Rule of
Divergence." But seed-driven elicitation (R2) can surface, mid-PLAN, that the *shaped bet itself* is
wrong — not just the plan. The Rule of Divergence says fix the spec, not the code; here the "spec" is
the frozen EPIC.
- **A) ★** Distinguish two cases: PLAN-level wrongness → revise PLAN (normal divergence); EPIC-level (the bet is wrong) → explicitly *re-shape* the EPIC as a deliberate, logged event, not a silent edit. — Keeps the freeze meaningful while allowing genuine bet-invalidation, with an audit trail.
- **B)** Strict freeze: a wrong bet becomes a *new* change/EPIC that supersedes the old one; the original is archived as-shaped. — Purest golden-thread history, but heavier for small corrections.
- **C)** Soft freeze: allow in-place EPIC edits before the first PLAN task is implemented, hard-freeze after. — Pragmatic, but the "first task" boundary is fuzzy and gameable.

**Answer:** A) 

### Q3.3 — Does clarity-gating only the PLAN (R8) leave the EPIC's quality ungated?
R8 runs the clarity gate on `PLAN.md`, never the EPIC (it is a Shape-Up bet, deliberately looser). But
a vague EPIC produces a vague PLAN; gating only downstream may let bet-level ambiguity through to
implementation.
- **A) ★** Keep clarity-gate on the PLAN only, but add a *lightweight* EPIC readiness check (the existing `clarity-gate` "lightweight variant" mentioned in the skill catalogue) before PLAN derivation. — Catches bet-level ambiguity early without over-formalising the shape.
- **B)** Clarity-gate the PLAN only, as locked — trust that a bad EPIC surfaces as a failing PLAN gate. — Simplest; relies on downstream catch.
- **C)** Gate both EPIC and PLAN at ≥9/10. — Strongest, but over-formalises the Shape-Up bet and slows shaping.

**Answer:** A) 
