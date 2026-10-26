---
id: UC-W11
title: Market research
primary_actor: the owner
trigger: a new market is considered, or a commercial structure needs a target
success_guarantee: a target market and its buyers are described well enough for a commercial structure to target them
area: sales
served_by:
  agents: []
  skills: []
status: missing
change: add-commercial-chain
---

# UC-W11 Market research

## Brief Description

Market research: identify a target market and its buyers, so commercial structures can target them.

## Stakeholders and Interests

- **The owner:** a market worth aiming at, chosen on evidence.
- **The salesperson:** a clear picture of who to approach and why.
- **The commercial structure (UC-W12):** a target and buyer descriptions to design the offer for.
- **Qualification (UC-W9):** Fit criteria grounded in the chosen market.

## Preconditions

The owner has a market hypothesis: a sector, a geography or a kind of buyer, B2B or B2G. The agent
can read Odoo's deal history, the company memory and public sources. The services catalogue is in
`docs/practice/ai-sales/semantic-layer-services.md`.

## Minimal Guarantees

Every claim carries its source, and an estimate without one is marked as such. Nothing is published,
bought or sent.

## Main Success Scenario

1. The owner states the market hypothesis and the question it must answer.
2. The agent asks the questions that sharpen it: segment, geography, buyer role, B2B or B2G.
3. The agent reads what Meaningfy already knows: past deals and contacts in Odoo, notes in Confluence
   and the vault.
4. The agent researches public sources: signals of the market's size, its buyers and their pains,
   competitors, public tenders.
5. The agent describes the target market and its buyer personas, each claim with its source and
   confidence.
6. The agent states the fit with Meaningfy's services and the open risks.
7. **[human]** The owner accepts the target, narrows it or drops it.
8. The agent files the market brief where the commercial structure (UC-W12) will read it.

## Extensions

- 3a. Meaningfy has no history in the market: the agent says so, and the brief rests on public
  sources only.
- 4a. A paid data source would help: the agent does not buy or sign up; it names the source and asks.
- 7a. The owner narrows the target: the agent returns to 4 with the narrowed segment.

## Out of Scope

Designing the offer (UC-W12), qualifying individual leads and partners (UC-W9), daily pipeline work
(UC-W7) and tender watching (it exists outside the catalogue).

## Artefacts

- Planned: the market brief (target, buyer personas, sources, fit, risks), read by the owner and by
  UC-W12; where it lives is open.
- Planned: the `market-researcher` agent (`add-commercial-chain`).

## Evidence

- Planned: Gherkin scenarios and an outcome suite (`add-commercial-chain`).
- Every claim in the brief has a source or is marked as an estimate (checked by reading).

## Feedback Loop

A target that yields no qualified leads in UC-W9, or a buyer persona that sales conversations
contradict (UC-W10), is noted in the brief and becomes an issue; it ends as a revised brief or a
change to the research method.

## Slices

1. A market brief from one hypothesis: planned (`add-commercial-chain`).

## Open Points

**Confidence:** low. Only the goal and its place in the commercial chain are stated by the owner;
the steps, sources and artefact are a first guess.

- Which markets come first (sectors, B2B or B2G, geographies)?
- Where does the market brief live and in what form: Confluence, the vault, or Odoo?
- Which sources are allowed, given that paid data sources are excluded for the sales agent?
