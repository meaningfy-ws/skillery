---
name: architecture
description: System-level solution architecture — C4 levels (Context, Container, Component, Code), ArchiMate and UML notations, ADRs, and contracts (OpenAPI/AsyncAPI/LinkML). Use for system and solution design, architecture documentation, and architectural decision-making. Distinct from code structure inside a service (see the cosmic-python skill).
license: Apache 2.0
metadata:
  purpose: modelling
  area: coding
  subject: modelling
  posture: reusable
  stage: design
  maturity: stable
---

# Solution architecture

Architecture here is contract-first and driver-first: no diagram before the drivers and the
contracts, no decision without a driver, one C4 question per diagram. State end states formally,
not drawing steps, and call out wrong notation semantics.

## Quick Start

Driver: "orders from web, mobile and API; under 2 s; 10,000 concurrent users at peak".

| Artefact | Content |
|---|---|
| Driver row | DR-1 *Peak load*, source: the sales lead, 2026-11-03, shapes ADR-0007 |
| Use case | `UC-W1: Place an order` (contract), refined by `UC-B1.1` (sync API) and `UC-B1.2` (async channel) |
| L2 view (ArchiMate) | API Gateway, Order Orchestrator, Order Repository, Event Broker; Flow orchestrator → broker marked async |
| ADR-0007 (L2) | async order events; rejected: synchronous calls; "we trade operational complexity for independent scaling" |
| Contract | AsyncAPI `order-events`; the order entity from the conceptual model |

## Workflow

The navigator mod tracks these phases from `assets/workflows/architecting.workflow.json`.

1. **Drivers.** Extract the architectural drivers and have the developer confirm them; no modelling
   starts without them. Read `references/business-requirements-to-architecture.md` when extracting
   drivers: it adds the questions per area, what is not a driver, the traceability chain and the
   twelve-box checklist.
2. **Use cases.** Write the White/Blue catalogue. Read `references/use-cases-cockburn.md` when
   writing or reviewing a use case: it adds the two levels, the DRY rule, numbering, the canonical
   skeleton and the derivation mapping to Gherkin. Copy the skeletons from
   `assets/use-case-template-white.adoc` and `assets/use-case-template-blue.adoc`.
3. **Contracts.** Specs first (OpenAPI, AsyncAPI, JSON Schema or Protobuf for internal messages,
   domain structures from the conceptual model), then ADRs, then diagrams that reference the specs.
4. **C4 views.** L1–L2 in ArchiMate (UML Component a second option at L2; UML Use Case at L1 only
   as a structural reference), L3 in UML Component (ArchiMate Application Structure second), L4 in UML Class/Sequence, only for stable public abstractions; no ArchiMate at
   L4. BPMN where business choreography matters. Every container traces to a driver. Read
   `references/diagram-checklists.md` while drawing or reviewing a diagram: it adds the per-notation
   checklist, what each level must not hold, and the size limits that say "split it".
5. **Decide.** An ADR per significant decision (below), from `assets/ADR_TEMPLATE.md`.
6. **Domain.** The domain model is `conceptual-modelling`'s; contracts and views name only concepts it holds.
7. **Verify and trace.** Each endpoint is realised by a container or component; the deployment
   view places the containers; mark which decisions are stable and which may change. Read
   `references/architecture-index-page.md` when writing the architecture document or validating
   the design: it adds the index page's shape, a library's consumer needs, and the walkthrough and
   spike that must pass before an ADR is Accepted.

Deliverables, referencing each other: the models in Enterprise Architect (Sparks), the index page
with its ADRs, and the specifications, versioned with the code.

## Rules

**ADRs.** One per irreversible architectural commitment, grouped by C4 level, never deleted, only superseded. Typical counts: L1
2–3, L2 3–5, L3 2–4 per container, L4 1–2 per system; 5–8 in all is usual, 14+ suggests conflated or
redundant decisions. Compress consequences that follow from one decision ("monotonic versioning"
covers update semantics and client expectations); split decisions with independent trade-offs.
Every consequence explicit and within the decision's scope: replace "best effort" or "appropriate"
with structure, and over-absolute claims with conditions. Each ADR states its Confirmation (a tool
or a reading) and where it appears in models, specs and code. The docs stage (`technical-writing`) brings the C4
views and the index page to as-built and links each ADR to its change; it never changes an ADR's
status, and an as-built fact that contradicts an ADR goes to the lead.

**Presenting a decision.** Recommend one option with a rationale of one or two sentences, name
exactly one rejected alternative and why, and state the trade-off in one sentence ("we gain X, we
accept Y"). If the decision is premature, say so and list what must be decided first. House
defaults, each still an ADR: the consumer or orchestrator owns an interface contract and the
provider realises it; entity evolution is tracked by monotonic versions, not status fields.

**Diagrams.** Draw one only if it answers one C4 question and supports a decision; skip one that
mixes levels or carries meaning in prose labels; unclear scope → an ADR instead. Review a diagram
in order: its C4 level, the notation for that level, semantic misuse, what to remove or add, the
corrected end state.

**Common mistakes**

| Mistake | Why it fails | Do instead |
|---|---|---|
| Mixing L2 with L3: pipeline steps in a container view | Hides what deploys where | Steps go to L3; L2 keeps containers and contracts |
| Over-labelled relationships ("validates, transforms, stores") | Capabilities hide in prose | One Application Service each; one relationship per modality |
| Structure as behaviour ("Request Validation" component) | Not deployable | Model components; behaviour emerges from them |
| Technology first ("Kafka container") | Infrastructure drives design | Abstract services; technology in the Technology layer |
| Diagram before specs (vague "data processor") | Boxes map to no contract | Specs first, then diagram |
| Contract detail in L1–L2 (paths, payloads) | Wrong level | Specs hold it; diagrams reference them |
| "Pluggable" with no interface | Replaceability unproven | Interface owned by the orchestrator, realised by the service, specified in OpenAPI/AsyncAPI |

## Before you hand over

| Question | If not | Action |
|---|---|---|
| Does every ADR trace to a driver, and every driver to an ADR? | A gap or an unjustified decision | Add the driver or drop the decision |
| Does each diagram answer exactly one C4 question in its level's notation? | Mixed levels | Split it per the checklist |
| Does every Blue use case refine one White and restate nothing? | DRY broken | Cut the repeated contract |
| Does each ADR have options, consequences and a Confirmation? | Not reviewable | Complete it from the template |
| Has the walkthrough passed every ADR marked Accepted? | Premature acceptance | Set it back to Proposed |

## Boundary & Related Skills

**This skill owns** system and solution design: C4 levels, ArchiMate/UML/BPMN notation, ADRs, the
use case catalogue, the architecture index page and the external contracts (OpenAPI/AsyncAPI/LinkML
as a notation). It is the single source of authority for the ADR template: any other skill or doc
that needs an ADR uses `assets/ADR_TEMPLATE.md`.

**It does not own** code structure inside a service (`cosmic-python`), where architecture files live
in a repo (`project-setup`), the living conceptual model and its source (`conceptual-modelling`), or
the LinkML craft and generated artefacts (`linkml-engineering`); `cosmic-python`'s
`entrypoints/api` consumes the contract.

**Related:** `cosmic-python` (code structure), `stream-coding` (doc-first delivery method), `epic-planning` (turning a Work Shape into an implementation spec), `writing-antipatterns` (Decision-record/Contract genre failure modes for ADRs and contracts; this skill's diagram mistakes are a separate, model-structure axis, cited not restated), `bdd-gherkin` (projects the use case catalogue into `.feature` scenarios), `conceptual-modelling` (the living domain model behind the contracts), `linkml-engineering` (generates the typed artefacts from a LinkML contract), `epic-delivery` (when the walkthrough and the spike run in a delivery), `technical-writing` (the docs stage brings C4 and index pages to as-built), `test-strategy` (answers `VAL, VER, ADQ, CLR, RSK` in its matrix, `references/architecture.md`).
