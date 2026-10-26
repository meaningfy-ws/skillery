# PLAN-07: `decision-package` Skill

> Derived from [EPIC-07](EPIC-07-decision-package-skill.md). Clarity-gate before execution.
> **Deps:** PLAN-04 (`consulting/` subfolder + bundle). **Gated by** the dogfood gate — extract from
> what the first real engagement taught.

## Approach (sequence)

**(T1) deliverable structure → (T2) discovery flow → (T3) compose with neighbours → (T4) absorb
strategic-blueprint → (T5) boundary + spine spec + golden-thread root → (T6) naming → (T7) place +
bundle + validate.**

## Task breakdown

### T1 — Decision Package structure *(EPIC R1, R2)*
- **Deps:** none. **Files:** `skills/consulting/decision-package/SKILL.md`,
  `references/package-template.md`.
- **Steps:** define the deliverable: recommendation for the first initiative · scope (in / explicitly
  out) · sequenced pilot→scale roadmap · buy/build/defer · ready-to-contract execution brief. Frame
  around **decision-readiness** as the unit of value; produce it as an executive artifact (compose
  with `executive-communication`).
- **Acceptance:** the five parts + the decision-readiness framing are specified with a template.

### T2 — Discovery flow *(EPIC R3, R4)*
- **Deps:** T1. **Files:** `skills/consulting/decision-package/references/discovery-flow.md`.
- **Steps:** document structured discovery → landscape/data reading → **gap analysis**
  → option framing → sequencing → buy/build/defer → execution brief; note a first-cut conceptual model
  often appears here (compose with `conceptual-modelling` by reference for that fragment only).
- **Acceptance:** the flow incl. gap analysis is documented; modelling composed by reference.

### T3 — Compose with neighbours (no restatement) *(EPIC C1)*
- **Deps:** T1, T2. **Files:** `skills/consulting/decision-package/SKILL.md` (the "Related skills"
  section). **Steps:** reference `executive-communication`, `semantic-consulting-coach`,
  `conceptual-modelling` by name; pull none of their depth in.
- **Acceptance:** SKILL.md routes to neighbours by name; no duplicated content from them.

### T4 — Absorb `strategic-blueprint-checklist` *(EPIC R5)*
- **Deps:** T1. **Files:** `skills/consulting/decision-package/references/` (fold target) +
  `docs/engineering-standards/references/strategic-blueprint-checklist.md` (reduced to a pointer).
- **Steps:** fold the MVP/personas/metrics framing into the skill's references (one discovery
  framework); reduce the old checklist to a 2-line pointer to the skill.
- **Acceptance:** one discovery framework; old checklist is a 2-line pointer.

### T5 — Free→paid boundary + spine spec + golden-thread root *(EPIC R6, R7)*
- **Deps:** T1. **Files:** `skills/consulting/decision-package/SKILL.md`.
- **Steps:** state the boundary (P0 free/shallow via `semantic-consulting-coach`; P1 paid via this
  skill) and that the skill does not blur into free coaching; specify that the Decision Package lands
  as a **first-class spec in `openspec/specs/`** (per EPIC-02) and is assigned a golden-thread ID that
  is the **root** of the thread (`decision → architecture → model → epic → …`).
- **Acceptance:** boundary explicit; SKILL.md says the package lands in `openspec/specs/` with a
  golden-thread root ID.

### T6 — Naming *(EPIC R8)*
- **Deps:** none. **Files:** `skills/consulting/decision-package/SKILL.md`.
- **Steps:** adopt **"Decision Package"** as the default name (internal + client-facing) per EPIC-07
  R8; document the allowed per-engagement client-facing relabel (e.g. *Semantic Readiness &
  Direction*) without renaming the skill.
- **Acceptance:** SKILL.md states the default name + the per-engagement override rule.

### T7 — Place + bundle + validate *(EPIC C3, A5)*
- **Deps:** T1–T6, PLAN-04 T3. **Files:** `.claude-plugin/marketplace.json`.
- **Steps:** place under `skills/consulting/`; add to the `meaningfy-consulting` bundle; record
  trigger probes vs `semantic-consulting-coach` (produce vs coach) **in the PR body**; `SKILL.md`
  ≤500 lines; `make validate`.
- **Acceptance:** bundled; probes (in PR body) distinguish produce-vs-coach; validate green.

## Anti-patterns
- ❌ Blurring the free→paid boundary (producing the package as free coaching).
- ❌ Restating `executive-communication` / `conceptual-modelling` depth.
- ❌ Keeping two discovery frameworks (strategic-blueprint must be absorbed).
- ❌ Letting the Decision Package die in Confluence instead of the spine.

## Verification
- Probe set separates `decision-package` (produce) from `semantic-consulting-coach` (coach);
  `make validate` green; a sample Decision Package registers as a spine spec / golden-thread root.

## Roadmap
- [x] T1 structure · [x] T2 discovery flow · [x] T3 compose · [x] T4 absorb blueprint
- [x] T5 boundary + spine root · [x] T6 naming · [x] T7 place+bundle+validate

## Execution status
Skill at `skills/consulting/decision-package/` (SKILL.md + references: discovery-flow,
decision-package-template, blueprint-absorbed). Registered in `meaningfy-consulting`.
Decision Package home = `openspec/decisions/<id>.md` (Q7.1=A); golden-thread root added
to `spine/golden-thread.md`. Blueprint reconciled (Q7.2=A) and the original doc reduced
to a pointer. Coach cross-points here (coach vs produce). README/EXPECTED_BUNDLES/probe
updated; `make validate` green. Provisional pending the dogfood gate.

## Clarity-gate self-check
Grounded in Research B §2.4; the free→paid boundary and the golden-thread-root role are explicit;
the strategic-blueprint reconciliation has a recorded disposition. Naming is an open choice surfaced
as a task, not a hidden assumption.
