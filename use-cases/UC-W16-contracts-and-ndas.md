---
id: UC-W16
title: Contracts and NDAs
primary_actor: the owner
trigger: a contract or NDA is needed for a client or partner, or a counterparty sends its own draft
success_guarantee: the contract or NDA is drafted, revised or aligned in the contract repository on a branch with a PR, ready for the owner to review and sign
area: legal
served_by:
  agents:
  - lawyer
  skills:
  - contract-practice
  - corpus-repository
status: partial
change: named-workers-and-legal
---

# UC-W16 Contracts and NDAs

## Brief Description

Tolic the lawyer (`lawyer`) drafts, revises and aligns contracts and NDAs with the owner, in a
session started in the owner's contract repository (`meaningfy-ws/legal-agreements` today). The
repository holds the clause library, the contracts and its own rules; Tolic follows them
(`corpus-repository`) and brings the legal judgement (`contract-practice`). Overleaf is reached
through its connector when installed, git otherwise.

## Stakeholders and Interests

- **The owner:** a correct contract or NDA quickly, without drafting from a blank page.
- **The client or partner:** clear terms they can sign.
- **The company:** its liability, intellectual property and payment terms protected.

## Preconditions

The contract repository exists with an `AGENTS.md` that says how to work in it. The session is
started in that repository. The deal is known: for a contract, usually the accepted proposal (UC-W8).

## Minimal Guarantees

Nothing is sent, signed or registered without the owner confirming that one action. No clause
enters the library until the owner merges its PR. A value Tolic could not settle is marked to be
confirmed, never guessed. The draft is not final legal advice; points for a qualified lawyer are
listed. No Odoo access.

## Main Success Scenario

1. The owner names the document (NDA or contract type), the counterparty and the deal.
2. Tolic loads `contract-practice` and reads the repository's `AGENTS.md` and docs.
3. Tolic runs the intake interview and asks the open questions in one round.
4. **[human]** The owner answers them.
5. Tolic picks the skeleton and variants by the library's own guidance and drafts on a branch.
6. Tolic aligns the draft with its parent and back-to-back contracts and opens a PR listing every
   open point and every point for a qualified lawyer.
7. **[human]** The owner reviews the PR, with counsel where needed, merges it and sends the
   contract for signature.

## Extensions

- 1a. The contract follows an accepted proposal: Tolic takes scope and price from it and asks only
  what it does not settle.
- 1b. The counterparty sends its own draft: Tolic sorts each change (legal effect → variant or
  override; same effect, better wording → version) and proposes how to answer.
- 5a. The repository's check fails: Tolic stops and reports it; he never bypasses the check.
- 6a. A figure differs from the parent or back-to-back contract: reported as an open point; neither
  number is changed.
- 7a. The same clause was overridden in several contracts: Tolic opens a PR proposing a new version,
  naming the sources.

## Out of Scope

Negotiating the terms (UC-W13), the proposal and its price (UC-W8), collecting signatures, Odoo
access, HR contracts unless asked, and final legal advice. Building the contract repository itself
is a software EPIC in that repository.

## Artefacts

- Branches and PRs in the contract repository, read by the owner.
- The open-point list and the qualified-lawyer list in each PR.
- The LaTeX source in the repository and, when the connector is installed, the contract's Overleaf
  project.

## Evidence

`tests/features/agents/lawyer.feature` (draft from a mission, revise a counterparty draft, propose
a clause from three overrides, and the refusals to send, to use Odoo and to touch HR contracts).
Released without a live trial (`named-workers-and-legal` DEC-17).

## Feedback Loop

What is off in real use comes back as a skillery issue through `skillery-feedback`; it ends as a fix
in `contract-practice` or the agent, or, when it is about the repository's rules, in the contract
repository.

## Slices

1. Draft, revise and align in the contract repository: released, no live trial yet (`lawyer`,
   `contract-practice`, `corpus-repository`).
2. The live trial on real contracts: planned.
3. Odoo data for deals: planned.

## Open Points

**Confidence:** medium. The method is written; the repository it works in is being built.

- Which gates and strict mode will the contract repository add to the contract workflow?
