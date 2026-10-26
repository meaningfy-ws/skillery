# EPIC-02: The Spine — OpenSpec `meaningfy` Schema + Golden Thread

> Part of the Skillery v2 series. See [EPIC-00](EPIC-00-master-index.md) for the governing thought
> and decisions register. **Tier:** foundation (keystone). **Depends on:** EPIC-01 (doc standard,
> CLAUDE-canonical, one constitution).

## 0. Revisions absorbed (from QUESTIONS-EPIC-02 + grounding on OpenSpec 1.4.1)

This EPIC was revised before execution to absorb the answers and the verified
OpenSpec mechanics. Deltas from the original text below:

- **Q2.1=A (thin fork).** Fork now but keep it thin: only the EPIC/PLAN templates
  + **3 hard rules**; defer rich per-artifact `rules:` until the dogfood gate.
  *(Standing task HQ-02.5: revisit the fork after the whole series lands.)*
- **Q2.2=B (OpenSpec-native artifacts).** Keep OpenSpec's **native filenames** and
  overlay the Meaningfy vocabulary — **EPIC ≡ `proposal.md`**, **PLAN ≡
  `design.md` + `tasks.md`** (the clarity gate scores the *pair*, not a merged
  `PLAN.md`). This supersedes R2's "emit `EPIC.md` + `PLAN.md`" below. EPIC-00
  DEC-2 + §4 amended to match. Downstream EPIC-03/05/09 inherit this.
- **Q2.3=A + coarser thread.** Human-readable minted IDs; the golden-thread chain
  is deliberately **coarse/provisional** (`requirement → architecture(…) →
  epic/change → task → test → commit`) — see `spine/golden-thread.md` and
  HQ-02.1/HQ-02.2.
- **Q2.4 (memory).** OpenSpec has no memory generator; truth = `openspec/specs/`,
  orientation = `openspec/config.yaml: context:`. **Drop** a bespoke
  `MEMORY.md`-as-truth; a deterministic generator into `context:` is deferred
  (HQ-02.3). See `spine/epic-change-memory-mapping.md`.
- **Grounding corrections (OpenSpec 1.4.1):** the schema lives where OpenSpec
  resolves it — **`openspec/schemas/meaningfy/`** (not `spine/openspec-meaningfy-schema/`);
  per-artifact `rules:` live in **`openspec/config.yaml`** (not `schema.yaml`);
  the profile enum is **`core | custom`** (there is no `expanded` preset — R6
  corrected); skillery dogfoods its own spine via a live `openspec/`. The
  `spine/` directory now holds the **documentation/conventions**; the live
  OpenSpec assets live under `openspec/`.

## 1. Purpose & goals (the shaped bet)

**Appetite:** medium — this is the keystone of the whole series; do it carefully, but resist
gold-plating before the dogfood gate (EPIC-00 §6) teaches us what the artifacts must carry.

**Problem.** skillery is strong islands with no **durable, traceable specification spine**. Specs
live frozen-but-local in `.claude/memory/epics/` and die at implementation. There is no persistent,
validated source of truth, no change/delta model for brownfield work, and no way to answer "why does
this code exist?" in one hop. Both research syntheses name this as *the* gap.

**Solution outline.** Adopt OpenSpec as the spec-lifecycle engine (DEC-2), fork a custom
`meaningfy` schema that emits our artifacts (`EPIC.md`, `PLAN.md`) plus the durable `specs/` store,
define Meaningfy-specific **workflows/profiles** over the `/opsx:*` commands, add the **golden-thread**
ID convention, wire the **clarity-gate** and the **lessons-learned loop**, and ship a
`meaningfy-spine` meta-bundle. This EPIC defines the spine *as a skillery asset*; EPIC-09 instantiates
it into project repos.

**What OpenSpec is (grounding).** A CLI (`@fission-ai/openspec`, v1.0 "OPSX") **plus** `/opsx:*`
slash-commands/skills it installs into `.claude/`. It owns: a durable `specs/` store (capability
behaviour contracts), a change/delta lifecycle (`changes/<id>/` with `proposal.md` + `design.md` +
`tasks.md` + spec deltas → `archive` merges deltas into `specs/`), and a **structural** validator
(`openspec validate --strict`). It uses RFC-2119 `SHALL` + Given/When/Then (markdown), **not EARS**.
It does **not** own: the execution/TDD loop, a *semantic* clarity gate, real `.feature` BDD, or
Shape-Up vocabulary. (Full report in the implementation log; sources cited there.)

**Non-goals.** Rewriting the methodology docs (EPIC-05); enriching `epic-planning` (EPIC-03);
scaffolding `openspec/` into project repos (EPIC-09).

---

## 2. Requirements

### 2.1 The forked `meaningfy` schema (DEC-2)

- **R1** Fork an OpenSpec schema: `openspec schema fork spec-driven meaningfy` (pin the OpenSpec
  version — RISK-3). The schema and its templates live at `spine/openspec-meaningfy-schema/`
  (`schema.yaml` + `templates/`).
- **R2** Define the artifact pipeline (`schema.yaml` `artifacts:` with `requires:` edges) to emit
  the Meaningfy ladder (EPIC-00 §4):
  - `EPIC.md` — the shaped bet = work shape = OpenSpec proposal. Template carries the **Shape Up
    vocabulary** OpenSpec lacks: appetite, problem, solution outline, key decisions, rabbit-holes,
    no-gos. `requires: []`.
  - `PLAN.md` — the derived executable breakdown (`tasks.md` role + `design.md` role): algorithm,
    concrete examples, anti-patterns, test-case specs, error matrix, task breakdown, roadmap.
    `requires: [EPIC]`. This is the artifact the **clarity gate** scores.
  - spec **deltas** (`## ADDED/MODIFIED/REMOVED Requirements`) carrying RFC-2119 `SHALL` +
    Given/When/Then — the normative layer (DEC-8, no EARS).
  - `apply.requires: [PLAN]`, `apply.tracks: PLAN.md` so execution gates on the clarity-gated plan.
- **R3** Per-artifact `rules:` in `config.yaml` encode Meaningfy conventions (e.g. `rules.EPIC`:
  appetite + no-gos mandatory; `rules.specs`: Given/When/Then + `SHALL`; `rules.PLAN`: must cite its
  parent EPIC ID). These shape generation; the *hard* gates remain `validate --strict` (structural)
  + clarity-gate (semantic) — keep both (RISK-4).
- **R4** `openspec schema validate meaningfy` passes (syntax, template refs, no circular deps).

### 2.2 Meaningfy workflows / profiles (user request)

- **R5** Define Meaningfy-specific **workflow patterns** as named `/opsx` command sequences mapped to
  the two-tier model, in `spine/workflows.md`. First **pin the canonical `/opsx` verb roster** (the
  OpenSpec command names: `propose`, `explore`, `new`, `continue`, `ff`, `apply`, `verify`, `sync`,
  `archive`, `bulk-archive`, `onboard`) in that doc; every other Meaningfy doc references this roster
  by anchor rather than re-listing verbs. Patterns (using those verbs verbatim), at minimum:
  - **Build-tier (per Epic):** `propose` (→ EPIC) → derive PLAN → clarity-gate → `apply` (TDD via
    superpowers) → `verify` → `sync` → `archive`.
  - **Exploratory:** `explore` (elicit from seeds) → `new` → `continue` → `apply`.
  - **Brownfield change:** delta-only `propose` → `apply` → `archive` (merge into `specs/`).
- **R6** Adopt the **expanded** OpenSpec profile (`/opsx:new`, `continue`, `ff`, `verify`,
  `bulk-archive`, `onboard`) for the granular Meaningfy flow; set `openspec config profile expanded`
  and record it in `spine/workflows.md`.
- **R7** Map each `/opsx` command to which **Meaningfy skill / superpowers discipline** drives it
  (e.g. `explore` ↔ `superpowers:brainstorming` + `epic-planning` elicitation; `apply` ↔
  `superpowers:test-driven-development` + `cosmic-python`). This is the concrete answer to "how is it
  used" and feeds EPIC-05.

### 2.3 Golden thread (Research B §5.2)

- **R8** Define the **golden-thread ID convention** as a lightweight spec (an ID scheme + a
  "cite-your-parent" rule), in `spine/golden-thread.md`:
  `requirement → ADR → model-entity → epic → change → task → test → commit`.
  Each layer cites the one above so "why does this code exist?" is answerable in one hop (relevant to
  DORA / AI-Act explainability positioning).
- **R9** Encode "cite your parent" as a per-artifact `rule` (R3) where feasible, and as a validator
  check where structural (EPIC-04 extends the linter to flag artifacts missing a parent ID).

### 2.4 Spec store, seeds & lifecycle (DEC-9)

- **R10** Establish the durable `specs/` store as the **single source of truth** that survives
  implementation; `.claude/memory/MEMORY.md` becomes a **regenerable index**, not truth (Research A
  D4 / open #2). Define the migration note from `.claude/memory/epics/` → `openspec/changes` +
  `specs/` (the *mechanics* of projecting this into a repo are EPIC-09).
- **R11** Define **seed-input archiving** (EPIC-00 §4 level 0): human seeds live in
  `changes/<id>/inputs/`, are preserved for traceability, **never deleted or groomed**, and play a
  secondary role beneath the authored EPIC. (The authoring *flow* is EPIC-03.)
- **R12** Reconcile **EPIC ↔ OpenSpec change** explicitly (Research B risk): an `EPIC.md` *is* the
  change's `proposal.md`; the task breakdown *is* `tasks.md`/`PLAN.md`; the durable `specs/` is
  net-new. Record this mapping in the spine docs so nothing is authored twice (RISK-4).

### 2.5 Quality gates & lessons loop

- **R13** Define the gate composition: **`clarity-gate`** is the *semantic* gate on `PLAN.md` (≥9/10),
  run by a human/agent — **not** CI-automated; **`openspec validate --strict`** is the *structural*
  gate, **CI-automated**. They are complementary. This EPIC wires `openspec validate` + `schema
  validate` into **skillery's own CI**; the *projected-repo* CI wiring is EPIC-09.
- **R14** Define the **lessons-learned → skill-evolution loop** (Research B §5.3, #4) in
  `spine/lessons-loop.md`: each finished engagement produces a short "what we'd encode differently"
  note → a PR against the relevant skill → gated by `make validate`. Running the spine on the first
  project *is* the loop dogfooding itself.

### 2.6 Distribution

- **R15** **Define** the **`meaningfy-spine`** meta-bundle's contents (schema + golden-thread +
  lessons-loop + the spine skill refs). EPIC-04 (PLAN-04 T3) performs the actual edit to
  `.claude-plugin/marketplace.json` as part of the single re-cut — this EPIC does not edit that file.

---

## 3. Constraints

- **C1** Pin the OpenSpec version (RISK-3); `openspec schema validate` runs in CI; the documented
  fallback is to lift only `specs/` + `archive` + `validate` conventions by hand if maintaining the
  fork proves too costly.
- **C2** Keep the **deterministic** parts (validate, archive/merge) out of the LLM-generation path.
- **C3** Do not duplicate planning: `PLAN.md` supersedes `superpowers:writing-plans` *inside* a
  spine repo (RISK-4, documented in EPIC-05).
- **C4** `make validate` passes; the new spine assets are themselves validated.

---

## 4. Acceptance criteria

- **A1** `openspec schema validate meaningfy` passes; the schema emits `EPIC.md` + `PLAN.md` + spec
  deltas with the `requires:` DAG and `apply` gate (R1–R4).
- **A2** A worked **example change** exists at `changes/example-spine-roundtrip/` demonstrating
  EPIC→PLAN→spec-delta→archive→`specs/` merge, used as the canonical sample (and the dogfood seed).
- **A3** `spine/` contains: the schema + templates, `workflows.md` (R5–R7), `golden-thread.md`
  (R8–R9), `lessons-loop.md` (R14), and the EPIC↔change mapping (R12).
- **A4** The clarity-gate vs `validate --strict` split is documented and both are invocable (R13).
- **A5** The `meaningfy-spine` bundle is defined (R15) and `make validate` passes.

---

## 5. Added / changed / deleted

| Action | Artifact |
|---|---|
| **Added** | `spine/openspec-meaningfy-schema/` (`schema.yaml` + `templates/`); `spine/workflows.md`; `spine/golden-thread.md`; `spine/lessons-loop.md`; a reference example change; `meaningfy-spine` bundle entry |
| **Changed** | `docs/environment-setup.md` (OpenSpec as a dependency — row owned with EPIC-04). **Note:** this EPIC only *defines* the `meaningfy-spine` bundle's contents; **EPIC-04 (PLAN-04 T3) is the sole editor of `.claude-plugin/marketplace.json`** (avoids the one-commit-ownership clash) |
| **Deleted** | nothing here (the `.claude/memory/epics/` → `specs/` migration is defined here, executed per-repo in EPIC-09) |

**R-DOCS (cross-cutting):** OpenSpec becomes a **mandatory external dependency** — flag the
`environment-setup.md` dependency row and the methodology composition for EPIC-04/05.
