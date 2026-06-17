# PLAN-05: Two-Tier AI-Coding Workflow & Guardrails

> Derived from [EPIC-05](EPIC-05-two-tier-workflow-guardrails.md). Clarity-gate before execution.
> **Deps:** PLAN-02 (spine/workflows/mapping), PLAN-03 (authoring flow). This is the **one sanctioned
> supersession** of frozen `docs/ai-coding/` content — mark every superseded section.

## Approach (sequence)

**(T1) single-owner redundancy table → (T2) methodology rewrite → (T3) runbook rewrite →
(T4) setup-guide update → (T5) guardrails + agent definition + model tiering → (T6) agentic
requirements refs → (T7) DoD/quality-gates → (T8) validate.** T1 first — it is the contract every
other doc cites.

## Task breakdown

### T1 — Single-owner redundancy table *(EPIC R7–R9, DEC-8, RISK-4)*
- **Deps:** PLAN-02 T4. **Files:** `docs/ai-coding/tooling-ownership.md` (standalone, so T2–T7 cite it
  by one stable path).
- **Steps:** author the authoritative table: **OpenSpec** = artifact lifecycle (`specs/`, change/delta,
  `validate`, archive, `/opsx`); **stream-coding** = doc-first philosophy + generate-verify-integrate
  loop; **superpowers** = brainstorming/TDD/debugging/verification/subagent (`writing-plans`
  **superseded** by PLAN.md in a spine repo); **Meaningfy skills** = epic-planning/clarity-gate/
  bdd-gherkin/cosmic-python/code-review. Add the **testing-taxonomy/data/CI-lane** owner row
  (`project-setup` + `cosmic-python` + `bdd-gherkin`) and the **CI-vs-CD** row (`project-setup` owns
  CI test/lint/docs; `ci-cd-delivery` owns CD/release/delivery — EPIC-10). Document the **EARS drop**
  (DEC-8) with rationale, and the agent-roster reconciliation (5 → 3 wrappers +
  `bdd-gherkin`/`technical-writing` skills).
- **Acceptance:** every behaviour has exactly one owner (incl. testing + CI/CD rows); EARS-drop
  rationale present.

### T2 — Methodology rewrite *(EPIC R1, R2)*
- **Deps:** T1. **Files:** `docs/ai-coding/ai-coding-methodology.md`.
- **Steps:** rewrite around the two tiers (Project tier: requirements → architecture → breakdown →
  setup; Epic tier: shape EPIC → PLAN → BDD → TDD → review → docs → deliver); label the **deliberate
  Shape-Up divergence** (architecture front-loaded & stable for semantic/KG work). Mark superseded
  sections with a pointer (don't silently overwrite).
- **Acceptance:** methodology describes two tiers + the labelled divergence; supersession noted.

### T3 — Runbook rewrite *(EPIC R3)*
- **Deps:** T1, PLAN-03. **Files:** `docs/ai-coding/ai-coding-runbook.md`.
- **Steps:** day-to-day `/opsx` workflow (the PLAN-02 sequences), who drives each step, seed→EPIC→PLAN
  authoring (PLAN-03); remove "Confluence work shape is the only input".
- **Acceptance:** runbook reflects `/opsx` + seed-driven authoring; old framing gone.

### T4 — Setup-guide update *(EPIC R4)*
- **Deps:** T2. **Files:** `docs/ai-coding/ai-coding-setup-guide.md`.
- **Steps:** describe the `openspec/` layout, `.claude/` (memory as a regenerable index), CLAUDE.md.
  (Scaffolding *mechanics* are EPIC-09 — here, the *description* and cross-link.)
- **Acceptance:** setup-guide matches the spine layout; cross-links EPIC-09.

### T5 — Guardrails, agent definition, model tiering *(EPIC R5, R6)*
- **Deps:** T2. **Files:** methodology (section).
- **Steps:** document guardrails (decision bounds, output validation, prompt-injection defence) as a
  cross-cutting band; the behaviour-vs-content distinction; pin the agent definition and the
  Opus/Sonnet/Haiku model tiering.
- **Acceptance:** guardrails + agent definition + tiering present.

### T6 — Agentic-requirements references *(EPIC R10)*
- **Deps:** T2. **Files:** methodology / Project-tier section.
- **Steps:** add **SEED** and **AgOCQs++** as optional Project-tier elicitation/edge-case aids — refs,
  not required artifacts.
- **Acceptance:** both referenced with their role and "optional" status.

### T7 — DoD & quality gates *(EPIC R11)*
- **Deps:** T1. **Files:** `docs/ai-coding/dod-quality-gates.md`.
- **Steps:** build-tier gate set = clarity-gate(≥9/10, semantic) + `openspec validate --strict`
  (structural) + tests-green + coverage ≥80% + importlinter + code review + DoD. Cross-reference
  EPIC-08 for the engagement-level gates added upward.
- **Acceptance:** gate set reflects the clarity/validate split; engagement gates cross-referenced.

### T8 — Testing-standard doc + skill fold-ins *(EPIC R12)*
- **Deps:** T1. **Files:** `docs/engineering-standards/testing-standard.md`; gap fold-ins into
  `skills/.../bdd-gherkin/`, `skills/.../cosmic-python/`, `skills/engineering/project-setup/`.
- **Steps:** author the consolidating doc — narrate the test taxonomy + per-type rulesets + test-data
  & conftest conventions + tool list + coverage gate, **linking** to `project-setup`
  `testing-setup.md`, `cosmic-python` `example-testing-patterns.md`, `bdd-gherkin` (no restatement);
  fold any missing operational detail into those skills (test-data fabrication → `bdd-gherkin`;
  per-layer strategy → `cosmic-python`; layout/markers/data → `project-setup`).
- **Acceptance:** the doc points (not restates) to the three skills; gaps are folded into the owning
  skills; `make validate` link-check passes.

### T9 — Validate *(EPIC A7)*
- **Deps:** T1–T8. **Steps:** `make validate`; confirm no doc still describes the old single-tier
  model or the old 5-agent roster; all links resolve.
- **Acceptance:** validate green; no stale model/roster descriptions remain.

## Anti-patterns
- ❌ Silently overwriting frozen content — mark each supersession with a pointer (RISK-6).
- ❌ Restating skill rules in the docs — narrate and point.
- ❌ Re-adding EARS or the 5-agent roster.
- ❌ Specifying any behaviour the redundancy table assigns to another owner.

## Verification
- The redundancy table (T1) cross-checks clean against PLAN-02 `workflows.md` (no double-ownership).
- `make validate` green; `grep -rni "confluence" docs/ai-coding/` shows no "only input" framing, and
  `grep -rni "EARS" docs/ai-coding/` returns nothing (the actual stale phrase is "Confluence work
  shape is the only input").

## Roadmap
- [ ] T1 ownership table · [ ] T2 methodology · [ ] T3 runbook · [ ] T4 setup-guide
- [ ] T5 guardrails/agent/tiering · [ ] T6 agentic-requirements · [ ] T7 DoD
- [ ] T8 testing-standard doc + fold-ins · [ ] T9 validate

## Clarity-gate self-check
The single-owner table is authored first so downstream docs cite one contract; the supersession is
explicit and bounded (the only sanctioned frozen-content break); EARS-drop is reasoned, not silent.
