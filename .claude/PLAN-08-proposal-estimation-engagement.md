# PLAN-08: `proposal-writing` + `estimation` Skills + Engagement Docs

> Derived from [EPIC-08](EPIC-08-proposal-estimation-engagement.md). Clarity-gate before execution.
> **Deps:** PLAN-07 (decision-package; the engagement frame).

## Approach (sequence)

**(T1) proposal-writing skill → (T2) estimation skill → (T3) engagement docs P0–P3 → (T4) engagement
stage gates upward → (T5) place + bundle + validate.**

## Task breakdown

### T1 — `proposal-writing` skill *(EPIC R1–R3)*
- **Deps:** none. **Files:** `skills/consulting/proposal-writing/SKILL.md`, `references/`.
- **Steps:** produce a proposal + SoW with an **explicit scope boundary** (in/out); document the flow
  (qualify need → frame the Decision Phase offer → price fixed-frame → write); compose by reference
  with `executive-communication` (SCQA/Minto) and pair with `decision-package`. Home is
  `skills/consulting/` (per EPIC-04 R1).
- **Acceptance:** proposal+SoW with scope boundary; flow documented; composed by reference.

### T2 — `estimation` skill *(EPIC R4, R5)*
- **Deps:** none. **Files:** `skills/consulting/estimation/SKILL.md`, `references/`.
- **Steps:** a lightweight fixed-cost scoping discipline — decomposition, uncertainty ranges,
  assumptions/exclusions, contingency, link to the SoW scope boundary; compose with
  `decision-package` (roadmap) and `epic-planning` (build breakdown). Keep it a checklist+method, not
  a heavy model.
- **Acceptance:** estimation method ties to the SoW boundary; lightweight.

### T3 — Engagement docs (P0–P3) *(EPIC R6)*
- **Deps:** none. **Files:** `docs/engagement/` (P0 Orientation, P1 Decision, P2 Execution, P3
  Partnership).
- **Steps:** narrate the four-phase model and **point** to the owning skills (don't restate);
  format per DEC-3 (human canon).
- **Acceptance:** P0–P3 described; links to skills; no restated skill content.

### T4 — Engagement stage gates (upward) *(EPIC R7, R8)*
- **Deps:** T3, PLAN-05 T7 (EPIC-05 owns `dod-quality-gates.md` and writes the build half first; this
  task **appends** the engagement rows). **Files:** `docs/ai-coding/dod-quality-gates.md`.
- **Steps:** append the engagement gate ladder as one ladder with the build DoD — using the
  enforcement table from EPIC-08 R8 (proposal signed = human sign-off; decision accepted = human
  sign-off; architecture accepted = human sign-off + `openspec validate --strict`; build DoD = the
  automated build gate set).
- **Acceptance:** one ladder; each engagement gate has the R8 enforcement; build half (EPIC-05)
  untouched except for the appended rows.

### T5 — Place + bundle + validate *(EPIC C2–C4, A5)*
- **Deps:** T1–T4, PLAN-04 T3. **Files:** `.claude-plugin/marketplace.json`.
- **Steps:** place both skills under `skills/consulting/`; add both to the `meaningfy-consulting`
  bundle; record trigger probes **in the PR body**; `SKILL.md` ≤500 lines each; `make validate`.
- **Acceptance:** both in `meaningfy-consulting`; probes (PR body) pass; validate green.

## Anti-patterns
- ❌ A heavy estimation model (keep it a checklist+method).
- ❌ Restating skill content in `docs/engagement/`.
- ❌ Two gate ladders (build vs engagement) instead of one cross-referenced ladder.
- ❌ Leaving gate enforcement unspecified (Research B open #5 must be settled per gate).

## Verification
- `docs/engagement/` points to skills (no restatement); the DoD doc shows one ladder with
  per-gate enforcement; `make validate` green; trigger probes pass.

## Roadmap
- [ ] T1 proposal-writing · [ ] T2 estimation · [ ] T3 engagement docs · [ ] T4 stage gates · [ ] T5 bundle+validate

## Clarity-gate self-check
Grounded in Research B #5/#6 + §2.4; the gate-enforcement open decision is surfaced as a task to
settle (T4), not assumed; the build/engagement ladder is unified via cross-reference, avoiding a
second DoD.
