---
id: UC-W13
title: Negotiation thinking partner
primary_actor: the owner
trigger: a difficult commercial or business situation arises
success_guarantee: the owner has a negotiation approach for the situation, grounded in named frameworks and stated in our own words
area: business
served_by:
  agents: []
  skills: []
status: missing
change: add-commercial-chain
---

# UC-W13 Negotiation thinking partner

## Brief Description

Negotiation thinking partner for difficult commercial and business situations (Chris Voss, Robert Greene, Sun Tzu and other relevant authors).

## Stakeholders and Interests

- **The owner:** a good outcome, a relationship kept where it is worth keeping, and a clear walk-away
  point.
- **The counterpart:** to be treated with respect and understood.
- **Meaningfy:** margin, commitments it can keep, and its reputation.

## Preconditions

The owner can describe the situation: the parties, the stakes, the history and what is on the table.
For a commercial negotiation, the commercial structure (UC-W12) gives the limits; the deal's history
is in Odoo.

## Minimal Guarantees

Nothing is sent to the counterpart by the partner. The situation stays in the owner's private working
space. Every framework idea is stated in our own words and names its author.

## Main Success Scenario

1. The owner describes the situation and what he wants out of it.
2. The partner asks questions that separate interests from positions, and that surface the
   counterpart's motives and constraints and the owner's alternatives and walk-away point.
3. The partner reads the situation through named frameworks (Voss, Greene, Sun Tzu and other relevant
   authors), saying which lens shows what.
4. The partner proposes two or three approaches, each with its risk and the likely response.
5. **[human]** The owner chooses an approach.
6. The partner prepares the conversation: the opening, the questions, the concessions available and
   their order, the walk-away point.
7. The partner drafts a message if one is needed.
8. **[human]** The owner sends, changes or holds the message.

## Extensions

- 1a. The situation is a business or engagement-design decision rather than a negotiation: the
  partner says so and points to `semantic-consulting-coach` or the business coach (UC-W14).
- 4a. The situation has legal stakes (contract terms, liability): the partner flags them and points
  to UC-W16.
- 8a. After the conversation the owner reports what happened: the partner records the lesson in the
  brief.

## Out of Scope

Designing prices and limits (UC-W12), drafting the contract (UC-W16), business strategy coaching
(UC-W14), the proposal itself (UC-W8) and sending anything.

## Artefacts

- Planned: the negotiation brief (situation, chosen approach, questions, concessions, walk-away,
  lesson), in the owner's private working space; read by the owner.
- Planned: the `negotiation-partner` agent and a skill that states the frameworks in our own words,
  with the source materials in the change's `inputs/` (`add-commercial-chain`).

## Evidence

- Planned: Gherkin scenarios from past situations, told without names (`add-commercial-chain`).
- Every framework idea in a brief names its author and is not quoted at length (checked by reading).

## Feedback Loop

The owner's report after the conversation (8a) shows what worked. A lesson that repeats becomes an
issue and ends as a change to the skill's guidance.

## Slices

1. A thinking partner for one situation: planned (`add-commercial-chain`).

## Open Points

**Confidence:** low. The owner named the goal and the authors; the steps, the brief and the lenses
are a first guess.

- `semantic-consulting-coach` already covers negotiation decisions in the consulting domain: extend
  it, or build a separate partner for all commercial and business situations?
- Which authors and works beyond Voss, Greene and Sun Tzu, and is Greene used only to read motives,
  as decided for the sales agent?
- Where may negotiation briefs be kept, given that they name real counterparts?
