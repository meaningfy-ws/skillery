---
id: UC-W10
title: Qualify a prospect in a sales conversation
primary_actor: a Meaningfy salesperson
trigger: a sales conversation with a prospect is under way or just ended
success_guarantee: the prospect is assessed against the commercial structure, the domain and readiness to buy, and the next step is named
area: sales
served_by:
  agents: []
  skills: []
status: missing
change: add-commercial-chain
---

# UC-W10 Qualify a prospect in a sales conversation

## Brief Description

Qualify a prospect in a sales conversation: against a commercial structure, the domain and readiness to buy.

## Stakeholders and Interests

- **The salesperson:** a clear read of the prospect and the next move.
- **The prospect:** a next step that matches where they are, not a premature offer.
- **The owner:** the free and paid line held, and effort spent on prospects ready to buy.

## Preconditions

The notes or the transcript of the conversation exist, and the prospect is in Odoo. The commercial
structure (UC-W12) gives the offer to qualify against; until it exists, the agent uses the services
catalogue `docs/practice/ai-sales/semantic-layer-services.md` and the engagement stages in
`skills/semantic-consulting-coach/references/engagement-lifecycle.md`.

## Minimal Guarantees

Nothing is sent to the prospect. Odoo changes wait for the salesperson's acceptance. What the
conversation did not reveal is marked unknown, not guessed.

## Main Success Scenario

1. The salesperson gives the notes or the transcript and names the prospect.
2. The agent reads the prospect's history in Odoo and the company memory.
3. The agent maps what was said to the five P and to the domain: which services or Semantic Layer
   building blocks the need touches.
4. The agent assesses readiness to buy: still presale, ready for Discovery & Onboarding (Light or
   Deep), or direct to build.
5. The agent names the gaps and the questions or teaching point for the next conversation, in the
   Challenger manner.
6. The agent proposes the next step and whether the lead becomes an opportunity on the two-way
   signal.
7. **[human]** The salesperson accepts the assessment and the next step.
8. The agent records the assessment, the conversion if accepted, and the next activity in Odoo.

## Extensions

- 1a. The conversation is still running: the agent returns only the next two or three questions;
  the full assessment follows after the call.
- 3a. The need is outside Meaningfy's domain: the agent says so and proposes a referral or a drop.
- 4a. The talk has moved from "is this relevant?" to "what should we do?": presale has reached its
  boundary, and the next step is a paid offer (UC-W8).
- 6a. The prospect refused explicitly: the agent proposes marking the deal lost, with the reason.

## Out of Scope

Qualifying leads and partners before contact (UC-W9), daily pipeline grooming (UC-W7), writing the
offer (UC-W8), coaching the engagement design (`semantic-consulting-coach`, UC-W22) and negotiation
(UC-W13).

## Artefacts

- The assessment on the Odoo opportunity: five-P score, domain, readiness, gaps, next step; read by
  the sales team and the sales assistant.
- The next activity in Odoo.
- Planned: the agent and its skill (`add-commercial-chain`), reading the commercial structure
  (UC-W12).

## Evidence

- Planned: Gherkin scenarios built from recorded conversations, and an outcome suite under
  `tests/evals/meaningfy-sales/` (`add-commercial-chain`).
- The recorded next step matches the readiness stage named (checked by reading).

## Feedback Loop

A prospect who moved faster or slower than assessed, or a question the agent should have suggested,
becomes a Defect issue; it ends as a change to the qualification guidance or an Examples row.

## Slices

1. Assessment after the conversation: planned (`add-commercial-chain`).
2. Live support during the conversation: planned (`add-commercial-chain`).

## Open Points

**Confidence:** medium. The five-P score, Challenger selling and the two-way signal are decided in
`add-sales-bundle`, and the engagement stages exist; the steps and the live mode are extrapolated.

- Is this the same agent as UC-W9 (one qualification method, three variants) or a mode of the sales
  assistant (UC-W7)?
- Is live support during a call wanted, and from which transcript source?
