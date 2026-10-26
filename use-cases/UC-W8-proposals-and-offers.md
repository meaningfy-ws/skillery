---
id: UC-W8
title: Proposals and formal offers
primary_actor: a Meaningfy salesperson or consultant
trigger: a client states requirements and asks for an offer
success_guarantee: a sendable proposal exists, a PDF in company style or a simpler proposal email, built from the answers to the right questions
area: sales
served_by:
  agents:
  - proposal-writer
  skills:
  - proposal-writing
  - estimation
  - decision-package
  - executive-communication
status: partial
change: add-commercial-chain
---

# UC-W8 Proposals and formal offers

## Brief Description

Proposals and formal offers from client requirements, standard or bespoke: an assistant that asks the right questions and leads to a sendable PDF in company style, or a simpler proposal email. The `proposal-writer` agent drafts the proposal or email; the company-style PDF is not built yet.

## Stakeholders and Interests

- **The salesperson:** a sendable offer.
- **The client:** a clear scope and price.
- **The owner:** the margin and the commitments kept.

## Preconditions

The client's requirements are written down.

## Minimal Guarantees

Nothing is sent and no price is committed without the owner; open questions are returned to the caller.

## Main Success Scenario

1. The caller passes the requirements and the form wanted (formal proposal or email).
2. The agent returns the open questions.
3. The caller answers them.
4. The agent estimates the effort.
5. The agent drafts the scope, the estimate and the executive summary.
6. The agent returns the draft and a recommendation to send it.
7. **[human]** The salesperson or the owner reviews the price and sends the proposal.

## Extensions

- 1a. The requirements are only a conversation note: the agent returns the questions that turn them
  into stated requirements, and the use case restarts at 1.
- 3a. The caller cannot answer a pricing question: the agent drafts with a stated assumption and
  flags it in the executive summary.
- 4a. The work is a Decision Phase rather than a build: the agent drafts the Decision Package offer
  (`decision-package`) instead of a build estimate.
- 7a. The owner rejects the price: the agent returns the trade-off (scope against price), never a
  silent discount.

## Out of Scope

Pricing strategy and packaging (UC-W12), qualifying whether to bid at all (UC-W9, UC-W10), contract
drafting (UC-W16) and sending anything to the client.

## Artefacts

- The proposal draft (Markdown) or the proposal email text, in the caller's working folder.
- The open-questions list with recommended answers.
- Planned: the company-style PDF rendered from the draft (`add-commercial-chain`).

## Evidence

- `tests/features/agents/proposal-writer.feature`: the return and refusal scenarios.
- The draft names its scope boundary, its estimate range and its assumptions (checked by reading).
- Planned: an outcome suite under `tests/evals/meaningfy-sales/` (`evaluate-catalogue`).

## Feedback Loop

A proposal the owner rewrote, or a client question the agent should have asked, becomes a Defect
issue; it ends as a new question in `proposal-writing`'s checklist or a scenario row in the feature
file. Accepted proposals are kept as examples for the PDF template slice.

## Slices

1. Draft a proposal or email from stated requirements: released (`proposal-writer`,
   `proposal-writing`, `estimation`, `executive-communication`).
2. Decision Phase offers: released (`decision-package`).
3. The company-style PDF: planned (`add-commercial-chain`).

## Open Points

**Confidence:** high for slices 1 and 2 (the owner approved the sections on 2026-10-26); medium for
the PDF slice.

- Which PDF toolchain and template carry the company style (LaTeX on Overleaf, as UC-W16, or another)?
- Who may approve a price: the owner only, or the salesperson within a band?

