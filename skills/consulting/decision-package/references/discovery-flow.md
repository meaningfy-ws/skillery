# The P1 discovery flow (in detail)

The structured flow that produces the Decision Package. It runs **inside paid P1** only (the coach
holds the free → paid line — see
[`../../semantic-consulting-coach/references/engagement-model.md`](../../semantic-consulting-coach/references/engagement-model.md)).
This is **one coherent framework**: the still-relevant product-blueprint items are absorbed into the
steps below (reconciliation in [`blueprint-absorbed.md`](blueprint-absorbed.md)), not run as a
second lens.

The flow answers one question: *what is the right next step for this organisation, given its data
landscape, governance maturity, legacy constraints, and strategic ambitions?* It is decision-enabling
and fixed-frame; it is **not** a maturity assessment, a PoC, or a substitute for the client's own
decision.

## 1. Structured discovery

Establish the **decision inputs**, not a feature brief:

- **Deciding persona** — who actually makes the commit decision, and what they will be held to.
- **Problem** — the specific pain, in the client's own situation (fragmented data, stalled
  analytics/AI, reuse pressure, governance gaps).
- **Outcome** — the measurable result the client wants, and by when. *(Absorbed blueprint Q1/Q2: the
  problem/persona/outcome and success-metric specificity, reframed as inputs that constrain the
  recommendation — not as MVP scoping.)*
- **Why now / why us** — the strategic and competitive reason this is timely. *(Absorbed blueprint
  Q3 "why we win", as a decision input.)*

## 2. Landscape / data reading

Read the terrain the decision must fit:

- Data estate (sources, quality, lineage, ownership).
- Governance maturity (MDM, metadata, cataloguing, stewardship).
- Legacy constraints and existing assets/obligations to respect.
- Strategic ambitions the first step must serve.

Surface findings as evidence for later steps; do not customise solutions yet.

## 3. Gap analysis

The pivot of the flow. Compare **current state** (steps 1–2) against the **strategic ambition**, and
classify the gaps:

| Gap class | Meaning | Effect on the recommendation |
|-----------|---------|------------------------------|
| **Blocking** | Must be closed before any safe first step | Shapes the pilot directly |
| **Sequenced** | Real, but can wait for a later phase | Goes on the roadmap, not the pilot |
| **Out of scope** | Not this engagement's problem | Named in the explicit "out" list |

The output is a ranked gap map: which gaps make the first step *unsafe* if ignored, and which can be
deferred without risk. This is what justifies the recommendation and the sequencing.

## 4. Option framing

Frame the candidate **first initiatives** as genuine options to decide between, each with its
trade-off — the "big decision" framing (absorbed blueprint Q4) kept as *options*, never a pre-made
choice. For each option: what it commits the client to, what it leaves open, its main risk, and which
blocking gaps it closes. Aim for a small, MECE set (typically 2–3).

A **first-cut conceptual model** of the domain often helps here, to ground the options in the actual
entities at stake. Produce that sketch with the
[`../../../engineering/conceptual-modelling/SKILL.md`](../../../engineering/conceptual-modelling/SKILL.md)
skill — a sketch in service of the decision, not a built model.

## 5. Sequencing

Order the chosen option(s) into a **pilot → scale** roadmap:

- **Pilot** — the smallest first step that closes the blocking gaps and proves value.
- **Scale** — what follows, in deliberate order, and on what trigger.
- **Explicitly not first** — what is real but deferred. *(Absorbs the discipline of blueprint Q6/Q7:
  a tight first step and explicit deferral, recast as roadmap + out-of-scope rather than an MVP
  feature list.)*

## 6. Buy / build / defer

For each capability the roadmap needs, make a named decision:

| Decision | When it fits | What to record |
|----------|--------------|----------------|
| **Buy** | A mature tool/platform/vocabulary exists and is not the client's moat | What to buy, rough cost posture, integration risk |
| **Build** | The capability is the client's edge, or no fit exists | Why bespoke, what it depends on |
| **Defer** | Real but not needed for the pilot | The trigger that revisits it |

Each decision carries a one-line rationale. Treat tools as enablers, never the product: prefer *buy*
for commodity capability so *build* effort stays on the differentiating work.

## 7. Execution brief

Assemble the **ready-to-contract** hand-off to the build tier (P2 / architecture): the chosen first
initiative, its in/out scope, the inputs and access required, the buy/build/defer decisions, and the
boundary with execution. It must be enough for P2 — or another implementer — to scope and contract
cleanly. Execution is always a **separate engagement** with its own scope and budget; the brief makes
that hand-off clean, not a continuation.

## Boundary safeguard

If agreed outcomes cannot be reached for reasons outside the consultant's control, **signal it
explicitly** and offer a scope reduction, short extension, or clean stop with partial delivery —
never silent overwork. (This is the coach's engagement-design principle; honour it when producing.)
