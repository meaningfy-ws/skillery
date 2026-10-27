---
id: UC-W12
title: Commercial structure and offer
primary_actor: the owner
trigger: an offer for a target market is to be designed or revised
success_guarantee: a complete, clear commercial structure exists, with a proposition built on it that the other sales use cases can read
area: sales
served_by:
  agents: []
  skills: []
status: missing
change: add-commercial-chain
---

# UC-W12 Commercial structure and offer

## Brief Description

Commercial structure and offer: a complete, clear commercial structure, then an irresistible proposition (Hormozi, Tony Robbins or other frameworks; reference materials exist elsewhere).

## Stakeholders and Interests

- **The owner:** a positioning and a margin he chose, written once.
- **The salesperson:** an offer that is clear to explain and easy to say yes to.
- **The client:** an offer they understand, with its value and its limits stated.
- **The commercial chain:** qualification (UC-W9, UC-W10), proposals (UC-W8) and negotiation
  (UC-W13) read Fit, packages, prices and limits from this one artefact.

## Preconditions

A market brief exists (UC-W11), or the owner states the target. The services catalogue
(`docs/practice/ai-sales/semantic-layer-services.md`) and the engagement stages
(`skills/semantic-consulting-coach/references/engagement-lifecycle.md`) are current. The owner's
reference materials on offer design are at hand; they are held outside the repo today.

## Minimal Guarantees

No price is published or sent. An existing commercial fact is never contradicted silently: a
proposed change to one is flagged for the owner.

## Main Success Scenario

1. The owner names the target market and the services to package.
2. The agent reads the market brief, the services catalogue and the engagement stages.
3. The agent drafts the commercial structure: target buyer, problem, packages, tiers, price logic,
   safeguards, and the path from the free stage to the paid ones.
4. The agent checks the structure for completeness and clarity, and lists its gaps.
5. The agent builds the proposition on the structure, drawing on the owner's chosen frameworks
   (Hormozi, Robbins), stated in our own words with a citation.
6. The agent returns the structure, the proposition and the decisions the owner must take.
7. **[human]** The owner decides the prices and the packaging, and approves the structure.
8. The agent files the approved structure where the other sales use cases read it.

## Extensions

- 1a. No market brief exists: the agent drafts against the target as stated, marks it unverified and
  recommends UC-W11.
- 3a. The draft conflicts with an existing commercial fact (for example, the Proof of Value is
  calendar-based and not priced by man-day): the agent flags it; the owner decides, and a change goes
  to the reference that owns the fact.
- 7a. The owner rejects a price: the agent returns the trade-off (scope against price), never a
  silent discount.
- 8a. The structure is a revision: the agent shows the difference and the open deals and proposals it
  affects.

## Out of Scope

Market research (UC-W11), a client-specific proposal (UC-W8), negotiation of one deal (UC-W13),
visual design of brochures and offer visuals (UC-W17) and producing sales materials (a separate
project).

## Artefacts

- Planned: the commercial structure (form and home open), read by the salesperson and by the agents
  of UC-W8, UC-W9, UC-W10 and UC-W13.
- Planned: the proposition text built on it.
- Planned: the `offer-designer` agent and the offer-design skill (`add-commercial-chain`).

## Evidence

- Planned: Gherkin scenarios and an outcome suite (`add-commercial-chain`).
- Each reading use case finds its answer in the structure: Fit for UC-W9, readiness stages for
  UC-W10, a price for UC-W8, limits for UC-W13 (checked by reading).

## Feedback Loop

A proposal that needed a package or price the structure lacked (UC-W8), or a negotiation that found
no stated limit (UC-W13), becomes an issue; it ends as a revision of the structure, approved by the
owner.

## Slices

1. The commercial structure for one target market: planned (`add-commercial-chain`).
2. The proposition built on it: planned (`add-commercial-chain`).

## Open Points

**Confidence:** low. The owner stated the goal and that the structure is the central artefact; its
contents, form and steps are a first guess.

- Does the commercial structure replace, extend or sit above the engagement stages and the services
  catalogue already in the repo (parked as HQ-08.1, the commercial layer)?
- What does a complete structure contain, and is there one per market or one for the company?
- Where are the offer-design reference materials, and may they go into the change's `inputs/`?
