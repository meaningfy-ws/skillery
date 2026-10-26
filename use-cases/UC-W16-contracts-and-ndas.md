---
id: UC-W16
title: Contracts and NDAs
primary_actor: the owner
trigger: a contract or NDA is needed for a client or partner
success_guarantee: the contract or NDA exists in LaTeX on Overleaf, ready to sign
area: legal
served_by:
  agents: []
  skills: []
status: missing
change: add-legal-documents
---

# UC-W16 Contracts and NDAs

## Brief Description

Contracts and NDAs in LaTeX on Overleaf (Overleaf connector available).

## Stakeholders and Interests

- **The owner:** a correct contract or NDA quickly, without drafting from a blank page.
- **The client or partner:** clear terms they can sign.
- **The company:** its liability, intellectual property and payment terms protected.

## Preconditions

Approved contract and NDA templates exist in LaTeX. The Overleaf connector is configured. The deal is
known: for a contract, usually the accepted proposal (UC-W8).

## Minimal Guarantees

Nothing is signed or sent by the agent. No clause is written outside the template without being
flagged. A clause the agent could not fill is left marked, never guessed. The draft is not legal
advice.

## Main Success Scenario

1. The owner names the document (NDA or contract type), the counterparty and the deal.
2. The agent picks the matching template.
3. The agent returns the open questions: parties, scope, term, price and payment, confidentiality,
   intellectual property, governing law.
4. **[human]** The owner answers them.
5. The agent fills the template in LaTeX and writes it to an Overleaf project.
6. The agent returns the link, the list of every deviation from the template and every clause left
   open.
7. **[human]** The owner reviews the compiled document, with counsel where needed, and sends it for
   signature.

## Extensions

- 1a. The contract follows an accepted proposal: the agent takes scope and price from it and asks only
  what it does not settle.
- 2a. No template fits: the agent stops and says so; it does not draft a contract from nothing.
- 5a. Overleaf cannot be reached: the LaTeX source is kept in the working folder and the agent says so.
- 7a. The counterparty returns changes: the owner decides each one; accepted changes restart at 5.

## Out of Scope

Negotiating the terms (UC-W13), the proposal and its price (UC-W8), collecting signatures, and legal
advice.

## Artefacts

- Planned: the LaTeX source in an Overleaf project and its compiled PDF, read by the owner and the
  counterparty (`add-legal-documents`).
- Planned: the question list and the deviation list returned to the owner.
- Planned: the contract and NDA templates as a skill's assets (`add-legal-documents`).

## Evidence

Planned: `tests/features/agents/contract-drafter.feature` (`add-legal-documents`), including the
refusal when no template fits.

## Feedback Loop

A clause the owner or counsel rewrote becomes a Defect issue; it ends as a template change or a new
question in the agent's checklist.

## Slices

1. NDAs from the template: planned (`add-legal-documents`).
2. Client and partner contracts from templates: planned (`add-legal-documents`).

## Open Points

**Confidence:** low. The brief names the format and the tool only; the templates are not in hand.

- Which templates, contract types and governing laws come first?
- Is reviewing the counterparty's own paper in scope, or only drafting from ours?
- One Overleaf project per document, or one project holding all of them?
