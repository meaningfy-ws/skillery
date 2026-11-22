---
name: decision-package
description: Produce the Decision Package — the paid keystone deliverable of a semantic/data consulting engagement's Proof of Value. Use to write the recommendation, the in/out scope, the sequenced (pilot → scale) roadmap, the buy/build/defer decisions, and the ready-to-contract execution brief that hands off to the build/architecture tier. The unit of value is decision-readiness; the artefact sits ABOVE architecture (it justifies and scopes the build before a repo exists). Triggers — "produce a decision package", "write the recommendation / scope / roadmap / buy-build-defer", "decision-readiness deliverable", "execution brief for the build", "scope this engagement", "Semantic Readiness & Direction / Decision Foundation deliverable". This skill PRODUCES the artefact; it does NOT coach the engagement design or hold the free→paid line (that is semantic-consulting-coach — "produce" vs "coach"). Not for free presale, not for delivery artefacts (an ontology, a mapping), not for code architecture.
license: Apache 2.0
metadata:
  purpose: advising
  area: consulting
  subject: semantic-data
  posture: profiled
  stage: advise
  maturity: stable
---

# Decision Package

> **Provisional pending the first-engagement gate.** The consulting depth here refines after the first real
> paid Proof of Value engagement; treat this wiring as the floor, not the finished standard.

This skill **produces** the Decision Package, the paid keystone deliverable of Discovery &
Onboarding's **Proof of Value**. Its unit of value is **decision-readiness**: the client knows what
to do next, why, what success looks like and what comes later. It corrects two drifts: a package
that reads as a maturity assessment or open-ended discovery, and a package that pre-empts the build
(stack, layers, architecture) instead of deciding whether and what to build.

## Quick Start

A regional statistics office bought a Proof of Value. Its package, at `openspec/decisions/<id>.md`
with the id `DEC-7`:

- **Recommendation (Governing Thought):** "Start with one shared code-list vocabulary for the three
  labour-market datasets, published as a governed SKOS service, before any knowledge graph."
- **Scope:** in: the three datasets, the code lists, stewardship for them. **Out:** the census
  data, a triple store purchase, any dashboard (they return at scale).
- **Roadmap:** pilot, the code-list service; next, link the datasets through it; explicitly not
  first, the enterprise knowledge graph.
- **Buy / build / defer:** buy a taxonomy tool (commodity); build the mappings (their edge); defer
  the graph store.
- **Execution brief:** the pilot, its in/out scope, the client's data owners and access needed, and
  "from here, we can execute, or you can take this and execute with someone else."

## Workflow

The **Proof of Value discovery flow** (R3, R5), one framework that has absorbed the still-relevant
items of the internal product-blueprint checklist:

1. **Structured discovery:** the deciding persona, the problem, the measurable outcome, why now.
2. **Landscape / data reading:** data estate, governance maturity, legacy constraints, assets.
3. **Gap analysis:** current state against the strategic ambition; gaps classed blocking,
   sequenced or out of scope.
4. **Option framing:** two or three candidate first initiatives, each with its trade-off.
5. **Sequencing:** pilot → scale, and what is explicitly not first.
6. **Buy / build / defer** for each capability, with a one-line rationale.
7. **Execution brief:** the ready-to-contract hand-off to the build tier.

Read `references/discovery-flow.md` while running a step: it adds the decision inputs per step, the
gap classes and their effect, the option criteria and the buy/build/defer table. Read
`references/blueprint-absorbed.md` when someone asks why a product-blueprint question (stack, MVP
features, ADRs, phase timings) is missing or recast: it holds the mapping of each item into the
flow or out of it.

When a first-cut conceptual model surfaces (R4), produce it with `conceptual-modelling` as a sketch
in service of the decision; no LinkML, generation or ontology engineering here.

## Rules

**The five parts (R1)**, fixed; framed answer-first with `executive-communication`, which supplies
how it reads while this skill supplies what it says:

1. **Recommendation:** the first initiative, as a Governing Thought, with why it is safe to commit.
2. **Scope:** explicitly in and explicitly **out**; the out list protects the boundary with the
   build tier (Scaling) and is load-bearing.
3. **Sequenced roadmap:** pilot → scale, in deliberate order.
4. **Buy / build / defer:** a named decision with rationale per capability.
5. **Ready-to-contract execution brief:** enough for Scaling, or another implementer, to scope and
   contract cleanly.

Copy `assets/decision-package-template.md` to start the document.

**Only inside the paid Proof of Value (R6).** Presale is the only free stage; if the work asked
for is still presale, do not produce the package: that is `semantic-consulting-coach`'s territory,
and the coach holds the line.

**Golden-thread root (R7).** The package lands at `openspec/decisions/<id>.md`, its own spine
artefact type, never `openspec/specs/` (those are RFC-2119 behaviour contracts; this is an
executive narrative). Mint a human-readable id; the first requirement and architecture artefacts
cite it as parent: decision package → requirement / architecture → conceptual model → EPIC →
task → test → commit (the golden thread is `epic-planning`'s).

**Naming (R8).** The default name is "Decision Package" for the skill and the deliverable. An
engagement may relabel the client-facing cover (*Semantic Readiness & Direction*, *Decision
Foundation*, *Scope Definition*); the skill name and the five parts stay fixed.

**Voice.** British English; answer-first, concise, every claim load-bearing; scope boundaries and
trade-offs explicit; decisions named, not hedged; never consultancy-bland.

| Mistake | Why it fails | Do instead |
|---|---|---|
| Choosing the stack, layers or ADRs in the package | Pre-empts architecture and blurs the Proof of Value / Scaling boundary | Record the commercial buy/build/defer; defer the stack |
| One recommended option, no alternatives | The client cannot see the decision | Frame 2–3 options with trade-offs, then decide |
| An empty or vague "out" list | Scope creeps into the build tier | Name what is out and when it returns |
| Silent overrun when outcomes slip | Breaks the safeguard | Signal it; offer scope reduction, short extension or clean stop |

## Before you hand over

| Question | If not | Action |
|---|---|---|
| Are all five parts present? | The package is not decision-ready | Add the missing part |
| Does the recommendation lead, as one sentence? | The answer is buried | Rewrite it as a Governing Thought |
| Does every roadmap step close a named gap? | Sequencing is arbitrary | Tie each step to the gap map |
| Is the id minted and the path `openspec/decisions/<id>.md`? | The golden thread has no root | Mint it; place it there |

## Boundary & Related Skills

**This skill OWNS:** producing the Decision Package (the five R1 parts) and running the
**Proof of Value discovery flow** that yields it (structured discovery → landscape reading → gap
analysis → option framing → sequencing → buy/build/defer → execution brief), including the absorbed
product-blueprint items recast for decision-readiness.

**This skill DELEGATES:**
- Coaching the engagement design and **holding the free → paid boundary** →
  `semantic-consulting-coach`. The coach decides *whether/how* to run the Proof of Value; this
  skill builds its deliverable.
- Executive framing and voice (Governing Thought, SCQA, Minto) → `executive-communication`.

The proposal or Statement of Work for the engagement is a sales hand-off, not a peer: see also
`proposal-writing` (in `meaningfy-sales`).

The first-cut conceptual model fragment (sketch only; no modelling depth here) and the
system/solution architecture that descends from the package are hand-offs, not peers: see also
`conceptual-modelling` for the model sketch and `architecture` for the system design that follows.

**Related:** `semantic-consulting-coach`, `executive-communication`, `proposal-writing` (the SoW that
sells the Proof of Value), `estimation` (effort ranges for the sequenced options),
`writing-antipatterns` (Decision genre failure modes).

Answers `VER` in `test-strategy`'s matrix (`references/generic-writing.md`).
