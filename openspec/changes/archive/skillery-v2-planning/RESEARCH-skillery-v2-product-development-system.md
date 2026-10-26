# Meaningfy Product Development System — Synthesis & Build Plan

*A consolidated design for evolving `skillery` from a skills catalogue into a full,
reliable product-development operating system spanning consulting through delivery.*

**Status:** working synthesis · **Scope:** methodology + skills + repo setup + AI setup +
SDD framework · **Date:** 2026-06

---

## 0. Governing thought

> You are not missing skills. You are missing the **thread that connects them** — and one
> revenue-critical *delivery* capability you currently only *coach*.

`skillery` today is a set of strong, mature islands. The build half is more opinionated and
complete than any off-the-shelf SDD tool. Two things are absent:

1. A **durable, traceable specification spine** that carries each phase's output into the next
   phase's input — Decision Package → Architecture + Conceptual Model → Epics → Code/Tests — and
   survives past implementation.
2. A **delivery skill for the P1 Decision Phase** — your engagement model defines the *Decision
   Package* as the keystone paid deliverable, but `semantic-consulting-coach` only coaches its
   *design* and explicitly refuses to *produce* it. The front of the funnel has no production skill.

**Reliable product development is the thread, not the island count.** Everything below serves the
thread.

---

## 1. The SDD tooling decision

### 1.1 Maturity-level taxonomy (the spine for evaluating any SDD tool)

| Level | Meaning | Tools |
|---|---|---|
| **Spec-First** | Specs precede code, then are discarded | Spec Kit, Kiro, BMAD |
| **Spec-Anchored** | Specs persist and evolve alongside code | **OpenSpec**, Spec Kitty |
| **Spec-as-Source** | Only specs are edited; code is regenerated | Tessl |

### 1.2 The three candidates, judged on *fit with skillery* (not generic merit)

| | Spec Kit | **OpenSpec** | GSD |
|---|---|---|---|
| Core unit | Feature spec, phase-gated | **Change** (bounded reviewable delta) | Phase → wave-scheduled plans |
| Spec lifecycle | Spec-First (discarded) | **Spec-Anchored (durable `specs/`)** | State in `.planning/`, not durable |
| Customisation | Edit command prompts + templates + constitution | **Fork a schema** (`schema.yaml` + templates) + `config.yaml` rules | Local patches re-applied per upgrade (fragile) |
| Emits | Agent-agnostic command files | **`.claude/skills/*` + `.claude/commands/opsx/`** (skillery's native format) | Its own orchestration + XML PLAN |
| Adds to skillery | EARS/GWT rigor (already have via bdd-gherkin) | **Durable validated spec store + delta/change model** | Wave parallelism, goal-backward verification |
| Conflicts | constitution ≈ global CLAUDE.md + clarity-gate; phase gates duplicate yours | project.md ≈ your constitution (minor) | Orchestration competes with your agents *and* superpowers |

### 1.3 Decision

**Adopt OpenSpec as the spec-lifecycle spine only.** Encode skillery's existing artifacts
(EPIC / PLAN / Gherkin) as a custom OpenSpec `meaningfy` schema. Do **not** adopt Spec Kit or
GSD wholesale — borrow ideas only:

- From **Spec Kit**: EARS phrasing as an optional acceptance-criteria format (you already have GWT).
- From **GSD**: goal-backward verification ("what must be TRUE for this to work?") into the DoD.

**Why OpenSpec wins:** it speaks skillery's native language (emits Claude Code skills + slash
commands), its "fork a schema" model bends the framework to *your* artifacts instead of imposing
its own, and it supplies the one capability you lack — a persistent, validated `specs/` source of
truth plus a change/delta model for the brownfield "modify existing behaviour" case.

### 1.4 The resulting layering (loses none of your investment)

| Concern | Owner |
|---|---|
| Spec lifecycle, durable source of truth, change/delta | **OpenSpec** (`meaningfy` custom schema) |
| Spec quality gate | `clarity-gate` (≥9/10), wired as an OpenSpec per-artifact rule + `--strict` CLI check |
| Execution: TDD, debugging, verification, fresh-context subagents | **superpowers** (already referenced in your runbook) |
| Architecture / DDD / layering | `architecture` + `cosmic-python` + `importlinter` |
| Governance / standards | one reconciled constitution (global CLAUDE.md ≡ `openspec/project.md`) |

---

## 2. What exists today

### 2.1 Skill catalogue (3 bundles)

| Bundle | Skills |
|---|---|
| `meaningfy-engineering` | project-setup · cosmic-python · architecture · meaningfy-git-workflow |
| `meaningfy-ai-coding` | clarity-gate · epic-planning · bdd-gherkin · meaningfy-code-review · technical-writing |
| `meaningfy-consulting` | semantic-consulting-coach · executive-communication |

Plus: thin agents (`implementer`, `code-reviewer`, `epic-planner`); docs
(`ai-coding-methodology`, `ai-coding-runbook`, `dod-quality-gates`, engineering-standards,
philosophy); `prompts/` (CLAUDE.md / AGENTS.md / global-prompt templates); `spec/` (authoring spec
+ governance); `template/`; a self-consistency validator (`make validate`); a Claude Code
marketplace. External skills **referenced, not copied**: `superpowers`, `stream-coding`.

### 2.2 The existing SDD pipeline (already strong)

```
Architecture Docs + Sample Data
  → EPIC            (the shaped bet — Shape Up: appetite, problem, solution outline,
  │                  key decisions, rabbit-holes, no-gos)  — freezes once shaped
  → PLAN            (derived executable breakdown; clarity-gated ≥ 9/10)
  → Gherkin + Test Data   (BDD, business language, pytest-bdd)
  → Task Implementation   (TDD tests-first; generate-verify-integrate; Cosmic Python layering)
  → Review + Architecture check (importlinter) + Coverage ≥ 80%
```

Already baked: SDD as Core Principle 1.1 · Rule of Divergence (fix the spec, not the code) ·
Human Sovereignty (no commit without consent, no assumptions) · Vertical Delivery · Clarity Gate
(13-item, 6-criterion, ≥9/10) · two-part memory files (frozen spec / running log) · dual memory
(MEMORY.md ≤200 lines + epic/task memory) · model selection (Opus/Sonnet/Haiku) · superpowers
wired for execution.

### 2.3 The architecture + model seam (already present)

`architecture` skill owns C4 (L1–L4), ArchiMate, UML, BPMN, ADRs, and **LinkML as the canonical
domain-entity contract**. The seam to code: architecture authors the LinkML contract;
`cosmic-python`'s `entrypoints/api` consumes it; **`make generate-models` is the codegen bridge**.
This is the DDD / living-model machinery — it exists, but is buried inside `architecture`.

### 2.4 The consulting engagement model (already designed, not yet productised)

`semantic-consulting-coach` defines the commercial frame:

| Phase | Question | Commercial | Output |
|---|---|---|---|
| **P0 Orientation** | "Are we relevant to each other?" | Free, bounded | — |
| **P1 Decision** *(keystone)* | "What's the right next step, and why?" | **Paid, fixed-frame** | **Decision Package** |
| **P2 Execution** | "How do we build it well?" | Paid, separate scope | Software |
| **P3 Partnership** | "How do we keep it alive?" | Paid, optional | Governance / ops |

The **Decision Package** = recommendation for the first initiative · scope (in / explicitly out) ·
sequenced roadmap (pilot → scale) · buy/build/defer decisions · ready-to-contract execution brief.
**The unit of value is decision-readiness.** The free→paid boundary must be protected.

---

## 3. What needs to be built

### 3.1 New capabilities, in priority order (reliability-gain per effort)

| # | Build | Why | Effort |
|---|---|---|---|
| 1 | **The spine**: OpenSpec `meaningfy` schema + **golden-thread** ID convention | Connects everything you already have; the named gap | M |
| 2 | **`decision-package`** delivery skill (P1) | Revenue; front of funnel; currently unproduced | M |
| 3 | **`conceptual-modelling`** skill (elevated from `architecture`) | Central to Meaningfy; living + generative; feeds both Decision Package and codegen | S |
| 4 | **Lessons-learned → skill-evolution loop** | Cheap, compounding; "lessons from past xp" | S |
| 5 | **`proposal-writing`** skill | Named target; pairs with executive-communication | M |
| 6 | **Estimation / fixed-cost scoping** discipline | De-risks fixed-cost bids | S |

### 3.2 Reconciliations (not new skills — cleanups)

- Collapse `strategic-blueprint-checklist` (internal product framing: MVP/personas/metrics) **into**
  the client-facing `decision-package` — one discovery framework, not two.
- Extend `dod-quality-gates` **upward** to define engagement-level stage gates (proposal signed →
  decision accepted → architecture accepted → DoD), not only the build phase.
- **One constitution**: reconcile global CLAUDE.md ≡ `openspec/project.md` ≡ engineering-standards
  so there is a single governing document, not three.

---

## 4. The end-to-end workflow

Each phase is defined by its **deliverable, exit gate, and the artifact it hands forward**. All
share one spec store and one ID thread.

| Phase | Deliverable | Exit gate | Skill(s) | Agent (model) |
|---|---|---|---|---|
| **P0 Orientation** | qualification | shift to "what should *you* do?" | semantic-consulting-coach | — |
| **Proposal / SoW** | proposal, SoW | signed | ＋proposal-writing · executive-communication | proposer (Opus) |
| **P1 Decision** | **Decision Package** | client accepts | ＋decision-package · semantic-consulting-coach · executive-communication | discovery-analyst (Opus) |
| **P2a Architecture** | Arch Doc, ADRs, contracts | **client accepts architecture** | architecture | architect (Opus) |
| **P2b Conceptual Model** | living LinkML model | validates; generation green | ＋conceptual-modelling | modeller (Opus) |
| **P3 Setup** | scaffolded repo + automations | scaffold + CI green | project-setup · meaningfy-git-workflow | implementer (Sonnet) |
| **P4 Epic + SDD** | EPIC + PLAN + change + living specs | clarity ≥9/10 · `openspec validate --strict` | epic-planning · clarity-gate · ＋OpenSpec schema | epic-planner (Opus) |
| **P5 Impl + Test** | code + tests + docs | DoD (green, ≥80%, arch check, review) | bdd-gherkin · cosmic-python · meaningfy-code-review · superpowers | implementer / code-reviewer |

### 4.1 Per-phase detail — steps · tools · inputs · outputs

**Proposal / SoW**
- *Steps:* qualify need → frame the Decision Phase offer → price (fixed frame) → write proposal.
- *Tools:* executive-communication (SCQA/Minto), proposal-writing, Odoo (CRM), Confluence.
- *In:* P0 notes, prospect context. *Out:* proposal + SoW with explicit scope boundary.

**P1 Decision Phase**
- *Steps:* structured discovery → landscape/data reading → **gap analysis** → option framing →
  sequencing → buy/build/defer → execution brief.
- *Tools:* decision-package skill, semantic-consulting-coach (design/boundary protection),
  executive-communication (the package *is* an exec artifact), conceptual-modelling (a first-cut
  conceptual model often appears here), Confluence/diagrams.
- *In:* signed SoW, client data landscape, strategic ambitions, constraints.
- *Out:* **Decision Package** (recommendation · scope in/out · pilot→scale roadmap · buy/build/defer
  · ready-to-contract execution brief). Lands in the durable spec store as a first-class spec.

**P2a Architecture**
- *Steps:* C4 zoom (Context→Container→Component→Code) → ArchiMate L1–L2 → UML L3–L4 → use cases →
  ADRs → external contracts (OpenAPI/AsyncAPI/LinkML).
- *Tools:* architecture skill, Enterprise Architect (Sparx), Mermaid, Antora/AsciiDoc, ADR template.
- *In:* accepted Decision Package + execution brief. *Out:* Architecture Document + models + ADRs +
  contracts. **Gate: client accepts architecture** (your explicit stage gate).

**P2b Conceptual Model**
- *Steps:* representation-agnostic conceptual model → LinkML schema → generation targets
  (Pydantic / JSON Schema / SHACL / RDF / docs) → validation.
- *Tools:* conceptual-modelling skill, LinkML + generators, `make generate-models`, SHACL/LinkML
  validators, SPARQL/LinkML MCP.
- *In:* architecture + domain glossary. *Out:* a **living** model that drives code components;
  re-runs generation on change. Stays **deterministic** — outside the LLM-generation path.

**P3 Setup & Scaffolding**
- *Steps:* repo init → Cosmic Python layout → architecture automations (importlinter contracts,
  `make` targets, codegen bridge) → CI (clarity/validate/importlinter/coverage gates) → agentic
  files (CLAUDE.md/AGENTS.md, `.claude/`, OpenSpec `openspec/`).
- *Tools:* project-setup (interview-driven scaffold), meaningfy-git-workflow, `scripts/scaffold.sh`,
  Antora, Docker/compose templates.
- *In:* accepted architecture + model. *Out:* a project repo with the spine pre-wired.

**P4 Epic Shaping + SDD spine**
- *Steps:* break architecture into EPICs → shape each (Shape Up bet) → derive PLAN → clarity gate
  ≥9/10 → register as OpenSpec change → validate.
- *Tools:* epic-planning, clarity-gate, OpenSpec (`/opsx:*` commands, `openspec validate --strict`,
  archive), GitNexus (impact analysis), Context7 (lib docs).
- *In:* architecture + model + sample data. *Out:* EPIC.md + PLAN.md + change proposal + updated
  living `specs/`.

**P5 Implementation & Test**
- *Steps:* Gherkin features → tests-first (TDD) → production code (layered) → verify (run tests;
  systematic-debugging) → integrate (consent → commit) → review → architecture check.
- *Tools:* bdd-gherkin + pytest-bdd, cosmic-python, superpowers (TDD / systematic-debugging /
  verification-before-completion / subagent-driven-development), meaningfy-code-review, importlinter,
  GitNexus, git worktrees.
- *In:* a single task from the PLAN + covering Gherkin. *Out:* code + tests + step defs + task
  outcome file; commit; archived change on completion.

---

## 5. The three connective mechanisms (the actual deliverables of the redesign)

### 5.1 One durable spec store (OpenSpec)
Specs currently live frozen-but-local in `.claude/memory/epics/`. The `meaningfy` schema gives a
persistent, validated `specs/` that survives implementation and absorbs EPIC/PLAN/Gherkin as
templates. **Extend it upward**: Decision Package, Architecture Document, and Conceptual Model
become first-class specs in the same store — not artifacts that die in Confluence.

### 5.2 The golden thread (ID traceability)
A stable-ID convention so every layer cites the one above:

```
requirement → ADR → model-entity → epic → change → task → test → commit
```

Lets you answer "why does this code exist?" in one hop — directly relevant to the DORA / AI-Act
explainability positioning. It is a lightweight spec (an ID scheme + a "cite your parent" rule),
not a tool.

### 5.3 Lessons-learned → skill-evolution loop
Each finished engagement produces a short "what we'd encode differently" note → a PR against the
relevant skill → gated by `make validate`. How tacit lessons stop living in people's heads. Cheap,
compounding, and running the spine on a first project *is* the loop dogfooding itself.

---

## 6. The DDD / conceptual-model layer

The SDD tools turn **prose specs → code**; none does formal domain modelling with deterministic
generation. LinkML *is* that. Keep it as a protected layer, not in the LLM path:

| Layer | Role | Owner |
|---|---|---|
| **0 Governance** | coding style, stack defaults, "domain types are generated from LinkML, never hand-written" | constitution (CLAUDE.md ≡ project.md) |
| **1 Domain model** | LinkML → deterministic Pydantic / JSON Schema / SHACL / RDF / docs | conceptual-modelling + `make generate-models` |
| **2 Specs** | prose specs referencing LinkML classes as ubiquitous language; GWT/EARS acceptance criteria | OpenSpec `meaningfy` schema |
| **3 Execution** | TDD subagent loop generates behavioural/glue code against specs | superpowers + cosmic-python |

The deterministic part (schema → artifacts) stays out of the non-deterministic generation path,
which is the principled answer to spec-drift and the failed-MDD critique.

---

## 7. How it all lives in one repo

**Key distinction: skillery is the operating system; project repos are instances.** Don't conflate
them. skillery houses the *methodology and reusable assets*; `project-setup` *projects* them into
each client/product repo with the spine pre-wired.

### 7.1 `skillery` v2 — phase-aligned structure

```
skillery/
├── skills/
│   ├── consulting/         # semantic-consulting-coach, decision-package(＋), proposal-writing(＋),
│   │                       #   estimation(＋)
│   ├── communication/      # executive-communication, technical-writing
│   ├── modelling/          # conceptual-modelling(＋)  [elevated from architecture]
│   ├── architecture/       # architecture
│   ├── engineering/        # project-setup, cosmic-python, meaningfy-git-workflow
│   └── ai-coding/          # epic-planning, clarity-gate, bdd-gherkin, meaningfy-code-review
├── spine/                  # ＋ the connective tissue
│   ├── openspec-meaningfy-schema/   # schema.yaml + templates (proposal/spec/tasks = EPIC/PLAN/Gherkin)
│   ├── golden-thread.md             # ID convention + cite-your-parent rule
│   └── lessons-loop.md              # retro → skill PR procedure
├── agents/                 # proposer, discovery-analyst, architect, modeller, epic-planner,
│                           #   implementer, code-reviewer  (thin wrappers)
├── docs/                   # ai-coding/ (methodology · runbook · dod-quality-gates[＋stage gates])
│                           #   · engineering-standards/ · philosophy/ · engagement/(＋ P0–P3)
├── prompts/                # CLAUDE.md / AGENTS.md / global-prompt templates (one constitution)
├── scripts/                # init-meaningfy-project.sh (now also wires openspec/)
├── spec/ · template/ · tools/ · tests/ · .claude-plugin/   # governance, authoring, validator, marketplace
```

Marketplace bundles re-cut along the value chain: `meaningfy-consulting`,
`meaningfy-communication`, `meaningfy-modelling`, `meaningfy-architecture`,
`meaningfy-engineering`, `meaningfy-ai-coding`, plus a `meaningfy-spine` meta-bundle.

### 7.2 A projected **project repo** (what `project-setup` scaffolds)

```
project-repo/
├── CLAUDE.md / AGENTS.md          # references the one constitution
├── openspec/                      # the spine, instantiated
│   ├── project.md                 # ≡ constitution for this repo
│   ├── config.yaml                # schema: meaningfy; context; per-artifact rules (GWT, clarity-gate)
│   ├── schemas/meaningfy/         # copied/pinned from skillery/spine
│   ├── specs/                     # DURABLE source of truth: decision-package, architecture, model, epics
│   └── changes/ (+ archive/)      # bounded deltas
├── model/                         # LinkML schema(s)  → make generate-models
├── src/                           # Cosmic Python: entrypoints / services / adapters / models
├── tests/                         # unit per layer + features/*.feature (pytest-bdd)
├── docs/                          # Antora: architecture, ADRs, requirements
├── .claude/                       # agents, skill refs, memory (MEMORY.md + epics/)
└── Makefile / CI                  # generate-models, validate, check-architecture, coverage, openspec validate
```

**Where the consulting deliverable lives:** P1 may run *before* a code repo exists. Either start the
project repo at P1 (Decision Package is its first spec), or keep a small **engagement repo** for
consulting-only work whose Decision Package is portable into the project repo's `specs/` when
execution is signed. Recommended default: **one repo from P1**, so the golden thread is unbroken
from requirement to commit.

---

## 8. AI setup

- **Agents (thin wrappers; knowledge lives in skills):** proposer · discovery-analyst · architect ·
  modeller · epic-planner · implementer · code-reviewer · (documenter via technical-writing).
  Sub-agents cannot spawn sub-agents; the main session orchestrates.
- **Model selection:** Opus for proposal/discovery/architecture/modelling/planning/review; Sonnet
  for implementation/BDD; Haiku for docstrings/routine docs. `/plan` mode before writing files.
- **Memory:** two-part files (frozen spec / running log, separated by `--- <!-- implementation-log --> ---`);
  dual memory (MEMORY.md ≤200 lines auto + on-demand epic/task memory). Extend the *durable* spec
  store (OpenSpec `specs/`) upward to hold Decision Package / Architecture / Model.
- **MCP tooling:** GitNexus (code intelligence, impact analysis) · Context7 (current lib docs) ·
  LinkML/SPARQL MCP (model + RDF) · Atlassian/Confluence (work shapes) · Odoo (CRM). OpenSpec CLI +
  `/opsx:*` slash commands.
- **Constitution:** single governing document; per-artifact rules in `openspec/config.yaml`
  (e.g. specs use Given/When/Then; domain types come from LinkML).

---

## 9. Build sequence

The reliability win is the thread proven on one real project — not catalogue breadth.

1. **Build the spine** (#1): OpenSpec `meaningfy` schema + golden-thread convention.
2. **Run one real engagement end-to-end** through it — ideally a small fixed-cost one where the pain
   is felt — and let that project tell you what `decision-package` and the thread IDs must carry.
3. **Extract `decision-package` (#2) and `conceptual-modelling` (#3)** from what you learned.
4. **Capture lessons (#4)** as you go — this dogfoods the loop.
5. Then **`proposal-writing` (#5)** and **estimation (#6)**.
6. Fold in reconciliations (strategic-blueprint → decision-package; dod-quality-gates upward; one
   constitution) opportunistically.

---

## 10. Principles & risks

**Principles (carry forward):**
- The thread, not the islands.
- Rule of Divergence — fix the spec, not the code (design-level failures regenerate; trivial bugs
  patched directly).
- Human sovereignty — no commit without consent, no hidden assumptions.
- Protect the free→paid boundary — orientation is free and shallow; deciding is paid.
- Keep the deterministic model layer (LinkML) out of the LLM-generation path.

**Risks:**
- *Building all six at once* → a beautiful framework you never validate. Mitigation: spine first,
  one project, then extract.
- *EPIC-vs-change unit mismatch* — OpenSpec's "change" vs your Shape Up "bet" must be reconciled
  (an EPIC ≈ a change proposal; your task breakdown ≈ tasks.md; durable `specs/` is net-new). Real
  schema-authoring work, not `npx init`.
- *Two constitutions drifting* (global CLAUDE.md vs `openspec/project.md`). Mitigation: one source.
- *Maintaining a custom schema* has a cost; fallback is to lift only OpenSpec's `specs/` + archive +
  `validate` conventions by hand.

---

## 11. Open decisions

1. One repo from P1, or a separate portable engagement repo for consulting-only work? *(Default: one
   repo from P1.)*
2. Is `conceptual-modelling` its own skill or a strengthened section of `architecture`?
   *(Recommended: its own skill.)*
3. Exact mapping of EPIC (Shape Up bet) onto an OpenSpec change unit.
4. Naming of the Decision Phase deliverable skill and the P1 working name (Semantic Readiness &
   Direction / Decision Foundation / Scope Definition).
5. Where stage gates are enforced — CI, a checklist skill, or human sign-off — for the
   engagement-level gates above the build DoD.

---

## Appendix — artifact & tool quick reference

**Artifacts:** Proposal/SoW · Decision Package · Architecture Document + ADRs + contracts ·
Conceptual (LinkML) Model · EPIC.md (bet) · PLAN.md (clarity-gated) · `.feature` files · change
proposals · durable `specs/` · task outcome files · golden-thread IDs.

**Tools:** Claude Code (skills/agents/commands) · OpenSpec (spine) · superpowers (execution) ·
clarity-gate (≥9/10) · LinkML + `make generate-models` · importlinter · pytest-bdd · GitNexus ·
Context7 · Enterprise Architect/Sparx · Mermaid · Antora/AsciiDoc · Confluence · Odoo · git worktrees.

**Models:** Opus (strategy/architecture/modelling/planning/review) · Sonnet (impl/BDD) · Haiku (docs).
