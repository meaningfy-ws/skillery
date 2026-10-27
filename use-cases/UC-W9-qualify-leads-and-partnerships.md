---
id: UC-W9
title: Qualify leads and partnerships
primary_actor: a Meaningfy salesperson
trigger: a new lead or a possible partnership appears
success_guarantee: the lead or partnership is ranked as worth pursuing or not, with the reasons recorded
area: sales
served_by:
  agents: []
  skills: [sales-qualification]
status: partial
change: add-commercial-chain
---

# UC-W9 Qualify leads and partnerships

## Brief Description

Qualify leads and partnerships: who deserves our attention and who does not; which partnerships to pursue.

## Stakeholders and Interests

- **The salesperson:** time spent on the leads and partners that can pay back.
- **The owner:** a focused pipeline and partnerships that fit the company's direction.
- **The lead or partner:** not chased when there is no fit.
- **The sales assistant (UC-W7):** a score and a band it can mirror in Odoo and act on.

## Preconditions

The lead or partner candidate is named, with its source. The agent can read Odoo and the company
memory. The commercial structure (UC-W12) gives the Fit criteria; until it exists, Fit is judged
against `docs/practice/ai-sales/semantic-layer-services.md`.

## Minimal Guarantees

A ranking is a recommendation: nothing is sent, and nothing is created in Odoo without a search for
an existing record. Each score carries its evidence or is marked unknown.

## Main Success Scenario

1. The salesperson names the lead or partnership candidate and where it came from.
2. The agent searches Odoo and the company memory for what is already known.
3. The agent researches public information on the organisation and its people.
4. For a lead, the agent scores the five P (Pain, Priority, Power, Plan, Fit), each with its
   evidence or marked unknown.
5. The agent ranks the candidate as pursue, nurture or drop, with the reasons and the questions that
   would change the score.
6. **[human]** The salesperson accepts or changes the ranking.
7. The agent records the score, the reasons and the sources in Odoo, and sets the next activity.

## Extensions

- 1a. The candidate is a partnership: the partnership criteria are not decided, so at 4 the agent
  returns the evidence it found (services, buyers, overlap) and the owner judges at 6.
- 2a. A record already exists: the agent updates it rather than creating a duplicate.
- 4a. Most of the five P are unknown: the agent ranks nurture and returns the questions for the
  first conversation (UC-W10).
- 6a. The salesperson decides to drop: the record is marked lost with its reason, never deleted.

## Out of Scope

Qualifying a prospect inside a sales conversation (UC-W10), daily pipeline grooming (UC-W7),
describing the target market (UC-W11), writing the offer (UC-W8) and any outreach.

## Artefacts

- The qualification on the Odoo record: the five-P score, the band mirrored as stars, the reasons
  and the sources; read by the sales team and the sales assistant.
- Planned: the `qualifier` agent and the qualification skill (`add-commercial-chain`).

## Evidence

- Planned: Gherkin scenarios for the `qualifier` agent and an outcome suite under
  `tests/evals/meaningfy-sales/` (`add-commercial-chain`).
- Two readers of the recorded reasons reach the same band (checked by reading).

## Feedback Loop

A pursued lead that wasted effort, or a dropped one that later bought, becomes a Defect issue; it
ends as a change to the scoring guidance or a new row in the feature's Examples table.

## Slices

1. Lead qualification with the five-P score: planned (`add-commercial-chain`); the method is in the
   sales package (`add-sales-bundle`).
2. Partnership qualification: planned (`add-commercial-chain`).

## Open Points

**Confidence:** medium. The five-P score and the lead and opportunity rules are decided in
`add-sales-bundle`; the steps are extrapolated, and partnership qualification is a first guess.

- Does the five-P skill from the sales package own qualification for UC-W7, UC-W9 and UC-W10 (one
  method, three variants), or does `add-commercial-chain` own it?
- What makes a partnership worth pursuing, and which kinds of partner count (technology vendors,
  integrators, tender consortia)?
