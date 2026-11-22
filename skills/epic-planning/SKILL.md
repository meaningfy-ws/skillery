---
name: epic-planning
description: Shape an EPIC from human seeds, then derive its clarity-gated PLAN. Specifications-first, Shape-Up style — the EPIC is the work shape (appetite, problem, solution outline, key decisions, rabbit-holes, no-gos) and IS the OpenSpec proposal; the PLAN is the derived executable breakdown (design + tasks) scored by the clarity gate (≥9/10). Drives seed intake and a myriad of clarifying questions, makes no silent assumptions. Trigger on "write/refine an EPIC", "shape this work", "plan this epic", "derive the plan", "turn these seed notes into an epic". For the living-spec lifecycle (archive, grooming, memory) use spec-stewardship; for the doc-first build loop use external stream-coding.
license: Apache 2.0
metadata:
  purpose: software-development
  area: coding
  subject: spec-driven
  posture: reusable
  stage: shape
  maturity: stable
---

# EPIC Planning

Architecture and human intent become **shaped EPICs**, each deriving a gated **PLAN**. The mistake
it corrects: writing a spec on silent assumptions, or as a parallel `EPIC.md`/`PLAN.md` beside the
spine. In the Meaningfy spine the artifacts are OpenSpec-native (the `meaningfy` schema): the
**EPIC ≡ `proposal.md`** (the Shape-Up work shape) and the **PLAN ≡ `design.md` + `tasks.md`**
(the pair the clarity gate scores). Ask before assuming (Human Sovereignty).

## Quick Start

Seed: "the lint should flag a skill over 24 KB". Intake reads the seed, the standard and
`tools/repo_lint`, and lists them back. One round of questions settles the counted files and the
exception list; the answers become `DEC-1`, `DEC-2` and a `RISK-1` (old skills fail at once), and
the round goes to `inputs/`. `proposal.md`: appetite `SMALL`, no-go "no auto-trimming". The
readiness check passes; `design.md` + `tasks.md` are derived, attacked (a skill with no
`references/`) and gated: run 1, 8/10, one gap fixed; run 2, 9/10, pass, logged in
`evidence/clarity-gate.md`. The developer signs off the scenarios.

## Workflow (maps to the OpenSpec `/opsx` build-tier flow)

**Mark first.** Your first reply, before any question or file, holds on its own line
`mark: change=<id> phase=shape stage=-` when you start from seeds, or `phase=plan` when you start
from a shaped EPIC; write the `phase=plan` line again when you reach step 6. In the reply, never in
a file (form: `epic-delivery`).

1. **Seed intake** (`/opsx:explore`). Read every seed and supporting input (notes, architecture,
   ADRs, sample data, and for brownfield a codebase analysis) and enumerate what you read. Read `references/seed-intake.md` before you
   start eliciting: it adds the seed sources, the elicitation discipline, the layout of
   `inputs/` and the format of the Q&A record.
2. **Elicit** (`/opsx:explore` + `superpowers:brainstorming`). Drive a *myriad of clarifying
   questions*, **one concern per question, asked together in rounds**, to surface and decide every ambiguity, conflict, and
   assumption **before** writing the EPIC. If `superpowers` is not installed, offer to install it
   (`dependencies.yaml`); if the person declines, say that you work without it and lose its
   brainstorming discipline, not this interview. Rounds per EPIC are capped by appetite: `TINY` and
   `SMALL` two, `MEDIUM` three, `LARGE` and above four; at the cap the gaps still open are recorded
   in the EPIC as assumptions for the developer, and no further round is sent. Confirm what you understood inside the
   next round, never in a turn of its own. Make no silent assumptions. **Include a test-scenario interview**: help the human enumerate
   what the EPIC must *prove* — key assertions, scenarios, edge cases — so the design phase can author
   `.feature` coverage (handed to `bdd-gherkin`, scored by `clarity-gate`). Step definitions stay in implement.
   **Include a risk question**: what could go wrong for this EPIC — in the world around it, not in
   its text — how likely, how bad, and what we do about it (mitigate, accept, or cut scope). Each
   risk gets a `RISK-` id; scope traps go to Rabbit-holes, the rest to the PLAN's Risks.
   When run inside a subagent (it cannot ask), return the open concerns as one question round to
   the caller instead of asking.
3. **Archive the seeds.** Write the captured seeds and the Q&A record to `changes/<id>/inputs/`,
   marked **secondary** and **never deleted or groomed**; the EPIC is the primary, shaped truth.
4. **Shape the EPIC** (`/opsx:propose` → `proposal.md`). Use the `meaningfy` schema's
   `proposal.md` template (`openspec/schemas/meaningfy/templates/proposal.md` in a spine-wired repo):
   appetite, why, solution outline, **key decisions** (each with a citeable `DEC-` id), rabbit-holes,
   **no-gos** (mandatory). Cite the EPIC's **golden-thread parents** (the requirement or architecture it
   derives from). Read `references/golden-thread.md` when you cite a parent or mint an id: it adds
   the traceability chain, the id prefixes and what is enforced today. Keep it at shaping
   altitude. Once `proposal.md` is saved, compact the session, or reset with the hand-over note (a safe point: the state is in the
   artefacts), then derive the PLAN.
5. **EPIC readiness check** (lightweight). Before deriving the PLAN, run the **lightweight variant**
   of `clarity-gate` over the EPIC — a quick readiness pass that catches
   bet-level ambiguity (vague problem, missing no-gos, undecided key decisions). Not the full
   ≥9/10 gate.
6. **Derive the PLAN** (`design.md` + `tasks.md`). From the shaped EPIC, produce the design half
   (algorithm, examples, anti-patterns, error matrix, decisions, and the elicited risks as
   `RISK-<n>`: likelihood, impact, mitigation or acceptance) and the tasks half (ordered
   breakdown with layers, dependencies, acceptance, roadmap). Each PLAN cites its parent EPIC id.
   The PLAN's depth follows the appetite: a TINY or SMALL PLAN keeps the sections
   the gate scores and stays short in each. For every test the PLAN moves or rewrites, it lists the
   lane that still runs it in CI and what it still proves.
7. **Attack the PLAN.** Before the gate, try to break it, with the subagent use P-0006 sets for
   the appetite (`guardrails`, *Subagent dispatch*): the input, state or order of events under which it fails,
   and the assumption which, if false, sinks it. Each counterexample becomes an error-matrix row,
   a `RISK-` entry or a PLAN fix. The gate checks the PLAN is clear; this checks it holds.
8. **Gate the PLAN** (full `clarity-gate`, ≥9/10; who runs it follows P-0006). Score the
   `design.md`+`tasks.md` pair. Block progression to BDD/implementation until it passes. Below 9: list the specific gaps and **revise
   the PLAN** — never patch code to dodge a gap (Rule of Divergence). At every appetite and on any
   re-gate, the gate runs at most twice, the second run reading only the gaps the first listed.
   Still below 9: the gaps go to the developer as one question round, each with a recommendation
   (fix, accept, re-shape). An accepted gap is a `DEC-` in `design.md`; only then may the PLAN
   proceed below 9. Each run adds a line to `evidence/clarity-gate.md` (`run <n>, <date>,
   <score>/10, pass|fail`), accepted `DEC-` ids below. The developer signs off the scenarios here.

The PLAN cuts its tasks into stages; delivery after the gate is `epic-delivery`'s.

The navigator mod tracks these phases from [`assets/workflows/epic-shaping.workflow.json`](assets/workflows/epic-shaping.workflow.json).

### The shaping session — from an initiative to a backlog of EPICs

One shaping session per initiative, with the developer. The steps above shape **one** EPIC;
this is how an initiative becomes several, in order:

1. **Architect** the initiative: use cases, drivers, decisions, C4 views (`architecture`).
2. **Model** the new concepts (`conceptual-modelling`), at concept level; exact slots come later.
3. **Validate** before slicing: the architecture walkthrough and spikes for risky assumptions
   (`architecture`), the model validation when the model changed (`conceptual-modelling`). A use case
   step with no home, or a driver with no decision, goes back to step 1.
4. **Sort each need by owner.** What any consumer of one of our libraries would need goes to that
   library, as an issue or its own EPIC there; what only this product needs stays here. In doubt,
   ask the developer with a recommendation (default: the library).
5. **Slice** the architecture into EPICs, each one vertical slice that delivers or enables a use
   case and fits one appetite. Shape each with the steps above; record the evidence of step 3
   in the change that needs it.
6. **Order** the EPICs: dependencies first (library work before the EPIC that needs it), then
   value. The order goes into each EPIC's Rabbit-holes or Why, not into a separate plan file.

The session ends with each EPIC's PLAN gated and its scenarios signed off; an EPIC shaped without
a PLAN gets one here. After slicing, each EPIC is shaped and planned in a fresh session started
from the hand-over note (`epic-delivery`'s `assets/templates/handover.md`); the reset is mandatory.

## Rules

### Appetite — how deep and extensive the solution may be

An EPIC's appetite is one of six named sizes, never a number of days or weeks: an agent cannot act
on a duration, but it can act on how far the solution should go.

| Size | How deep and how extensive the solution may be |
|---|---|
| `TINY` | One concern in one place: sharpen a rule, fix a flaw. No new concept. |
| `SMALL` | One capability touched in a few places; existing structure reused as is. |
| `MEDIUM` | One new capability (a skill section, an agent, a check) with its tests and docs; neighbours touched lightly. |
| `LARGE` | Several related capabilities, or a new bundle; boundaries move between owners; existing artifacts migrate. |
| `VERY LARGE` | Cuts across the system or the method; many artifacts migrate; delivered in stages. |
| `HUGE` | Reshapes the system or the method itself. Split into several EPICs before planning. |

The size is a judgement; the examples illustrate it, they do not define it. When the work outgrows
its appetite, cut scope or re-shape the EPIC (below) — never let it grow silently.

### When the bet itself is wrong (freeze vs re-shape)

The EPIC **freezes once shaped**. But elicitation or implementation can reveal two different kinds
of wrongness — handle them differently:

- **PLAN-level wrongness** (the approach/breakdown is off, the bet still holds) → **revise the PLAN**.
  Normal divergence.
- **EPIC-level wrongness** (the *bet itself* is invalid) → **re-shape the EPIC as a deliberate,
  logged event** — record why in the EPIC's decisions and the change inputs, not a silent edit. A
  re-shape is a visible decision with an audit trail, which keeps the freeze meaningful.

### What you do NOT do

- Write implementation code, Gherkin step definitions, or commit changes.
- Run the living-spec lifecycle (archive/groom/memory) — that is `spec-stewardship`.
- Make architectural decisions unilaterally — propose options with trade-offs; the developer decides.

## Before you hand over

| Question | If not | Action |
|---|---|---|
| Are the seeds and the Q&A record in `inputs/`? | The shaping is untraceable | Write them (step 3) |
| Does `proposal.md` have no-gos and every key decision as a `DEC-`? | The readiness check fails | Ask, then fill them |
| Does `tasks.md` cite its parent EPIC on its first line? | The schema rule fails | Add the parent id |
| Does `evidence/clarity-gate.md` log each run, ≥ 9/10 or the accepted `DEC-` ids? | The PLAN is not gated | Run or record the gate (step 8) |

## Boundary & Related Skills

**Owns:** the **authoring** practice — seed intake, elicitation, EPIC shaping (= `proposal.md`), the
lightweight EPIC readiness check, and PLAN derivation (= `design.md` + `tasks.md`).
**Delegates:** PLAN scoring → `clarity-gate`; delivery of the gated PLAN → `epic-delivery`; the living-spec lifecycle
(archive, grooming, memory-index regen) → `spec-stewardship`;
Gherkin → `bdd-gherkin`; code → `cosmic-python`;
the doc-first build loop → external `stream-coding`. For the **texture** of the EPIC/PLAN narrative
prose (the proposal "why" and "solution outline" are Explanation-quadrant), the writing family applies:
`technical-writing` and
`explanatory-writing` — referenced, not restated.
**Not an EPIC:** a team's Shape Up work shape kept in a personal vault is a `work-shape` note
(`vault-conventions`); it may feed an EPIC but is not one.
**Related:** `clarity-gate`, `epic-delivery`, `spec-stewardship`, `bdd-gherkin`, `architecture`, `technical-writing`, `stream-coding` (external).

Answers `VAL, VER, ADQ, ROB, CLR, RSK` in `test-strategy`'s matrix (`references/shaping.md`).
