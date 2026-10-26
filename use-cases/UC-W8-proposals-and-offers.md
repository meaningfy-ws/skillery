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
