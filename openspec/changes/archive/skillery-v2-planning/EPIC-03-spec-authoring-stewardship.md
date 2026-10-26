# EPIC-03: Spec Authoring & Stewardship (`epic-planning` enrichment)

> Part of the Skillery v2 series. See [EPIC-00](EPIC-00-master-index.md). **Tier:** foundation.
> **Depends on:** EPIC-02 (the `meaningfy` schema, golden thread, seed-archiving convention).

## 0. Revisions absorbed (from QUESTIONS-EPIC-03)

- **Q3.1=C — split, don't overload (reopens DEC-9).** Stewardship is **its own
  skill** `spec-stewardship`, not folded into `epic-planning`. Two guarded
  skills with limited responsibilities: `epic-planning` = **authoring**
  (seed→EPIC→PLAN→gate); `spec-stewardship` = **living-spec lifecycle** (archive,
  delta→`specs/` merge, grooming, orientation-index policy). DEC-9 amended in
  EPIC-00. (Standing preference: prefer 2–3 focused skills over one massive one.)
- **Q3.2=A — freeze vs re-shape.** PLAN-level wrongness → revise the PLAN
  (normal divergence); EPIC-level wrongness (the bet is wrong) → a **deliberate,
  logged re-shape**, not a silent edit. Encoded in both skills.
- **Q3.3=A — gate the PLAN, lightly check the EPIC.** Full clarity-gate (≥9/10)
  on the PLAN only; a **lightweight readiness check** runs over the EPIC before
  PLAN derivation to catch bet-level ambiguity.
- Artifacts are OpenSpec-native (inherited from EPIC-02/Q2.2): EPIC ≡
  `proposal.md`, PLAN ≡ `design.md` + `tasks.md`. The skills reference the spine
  schema templates rather than restating them.

## 1. Purpose & goals (the shaped bet)

**Appetite:** small–medium. This turns the spine from a *store* into a *practice*: the human-led
flow that produces well-formed, groomed, preserved EPICs and PLANs from messy human seeds.

**Problem.** Today `epic-planning` starts from "architecture docs / a Confluence work shape" and
produces an EPIC. The user's actual flow is richer and unowned:
> start from **human-written seed files** → pull in additional inputs (architecture, test data,
> notes, existing-codebase analysis) → ask a **myriad of clarifying questions** to elicit, clarify,
> and make the needed decisions → write the work shape (EPIC) → derive the PLAN respecting Meaningfy
> coding practices.

And: specs/EPICs must be **well maintained, groomed, and preserved**; the human inputs must be
**archived for traceability (not deleted)** while playing a secondary role beneath the authored EPIC.
There is no skill owning this stewardship.

**Solution outline.** Enrich the existing **`epic-planning`** skill (DEC-9 — no new skill) to own:
(1) seed-driven elicitation, (2) EPIC authoring as the OpenSpec proposal, (3) PLAN derivation, and
(4) the EPIC↔change lifecycle/stewardship, wired to the `/opsx` workflows from EPIC-02. The
`epic-planner` agent wrapper is updated to drive this flow.

**Non-goals.** Re-authoring the methodology narrative (EPIC-05); the clarity-gate rubric itself
(unchanged — only *invoked* here); BDD (`bdd-gherkin`, unchanged); execution (`implementer`).

---

## 2. Requirements

### 2.1 Seed-driven elicitation

- **R1** `epic-planning` gains an explicit **seed-intake** step: read one or more human-written seed
  files plus additional inputs (architecture docs, test/sample data, free notes, and — for brownfield
  — an existing-codebase analysis, optionally via GitNexus). The skill enumerates what it read.
- **R2** **Elicitation discipline:** drive a *myriad of clarifying questions*, one concern at a time,
  to surface and decide every ambiguity, conflict, and assumption **before** writing the EPIC. This
  composes with `superpowers:brainstorming` and maps to `/opsx:explore` (per EPIC-02 R7) — reference,
  do not restate, that discipline. The skill makes **no silent assumptions** (Human Sovereignty).
- **R3** **Seed archiving** (EPIC-02 R11): captured seeds and the Q&A record are written to
  `changes/<id>/inputs/` for traceability, marked secondary, **never deleted or groomed**. The
  authored EPIC is the primary artifact; the skill states explicitly that the EPIC supersedes the
  seeds.

### 2.2 EPIC authoring (the work shape)

- **R4** Produce `EPIC.md` via the `meaningfy` schema (EPIC-02): the shaped bet in Shape-Up
  vocabulary (appetite, problem, solution outline, key decisions, rabbit-holes, no-gos). The EPIC
  *is* the OpenSpec change `proposal.md` (EPIC-02 R12) — authored once, not duplicated.
- **R5** The EPIC carries its **golden-thread parent IDs** (cites the architecture/ADR/model-entity
  it derives from) per EPIC-02 R8–R9.
- **R6** The EPIC is **frozen once shaped** (the bet is stable); subsequent grooming happens via new
  changes/deltas, not by rewriting the shaped bet (preserve the Rule of Divergence).

### 2.3 PLAN derivation

- **R7** Derive `PLAN.md` from the frozen EPIC, respecting Meaningfy coding practices: algorithm,
  concrete examples, anti-patterns, test-case specs, error matrix, ordered task breakdown (with
  layers/dependencies/acceptance), roadmap. Each task cites its parent EPIC (golden thread).
- **R8** Run **`clarity-gate` (≥9/10)** on the PLAN (the semantic gate, EPIC-02 R13). The skill
  blocks progression to BDD/implementation until the gate passes; failing items drive PLAN revision,
  **never** code patches (Rule of Divergence).

### 2.4 Stewardship (folded in — DEC-9)

- **R9** `epic-planning` documents the **lifecycle**: author in `changes/<id>/` → implement
  (`/opsx:apply`) → `/opsx:sync`/`archive` merges spec deltas into `specs/` → the change folder moves
  to `changes/archive/`. Grooming the durable `specs/` is part of archive review.
- **R10** Define how the **`.claude/memory` index** is regenerated from `specs/`/changes (it is a
  cache, not truth — EPIC-02 R10), and the `MEMORY.md` ≤200-line cap is preserved.
- **R11** Update the **`epic-planner` agent wrapper** (`agents/epic-planner.md`) to load the enriched
  `epic-planning` + `clarity-gate` and to drive the `/opsx:explore`/`propose` workflow — wrapper
  stays thin (no knowledge).

---

## 3. Constraints

- **C1** No new skill (DEC-9); all of the above lands inside `epic-planning` + its references + the
  spine docs. Keep `SKILL.md` ≤ ~500 lines; push detail to `references/`.
- **C2** Reference external disciplines by name (`superpowers:brainstorming`), never vendor them.
- **C3** Keep the EPIC=proposal / PLAN=tasks identity (no parallel artifacts; RISK-4).
- **C4** `make validate` passes (trigger precision: `epic-planning` must still fire on its probes and
  not collide with neighbours after the description grows).

---

## 4. Acceptance criteria

- **A1** `epic-planning` documents the full seed→questions→EPIC→PLAN flow with seed-archiving
  (R1–R8), and a worked example references the EPIC-02 sample change.
- **A2** Seeds are demonstrably archived under `changes/<id>/inputs/`, marked secondary and
  preserved (R3; EPIC-02 R11).
- **A3** The clarity-gate is invoked on PLAN, not EPIC; the gate-fails-→-revise-spec rule is explicit
  (R8).
- **A4** `epic-planner` wrapper drives the `/opsx` flow and carries no knowledge (R11).
- **A5** `make validate` passes; trigger-precision probes recorded.

---

## 5. Added / changed / deleted

| Action | Artifact |
|---|---|
| **Changed** | `skills/.../epic-planning/SKILL.md` + `references/` (seed intake, elicitation, stewardship, lifecycle); `agents/epic-planner.md` (drive `/opsx`) |
| **Added** | `epic-planning/references/seed-intake.md` (seed sources, archiving, Q&A record format) + `epic-planning/references/stewardship-lifecycle.md` (lifecycle + memory-index regen) |
| **Deleted** | the old "Work Shape from Confluence" framing as the *only* input (superseded by seed-driven intake) |

**R-DOCS (cross-cutting):** the runbook's "provide a Confluence work shape to epic-planner" step is
superseded — flag for EPIC-05.
