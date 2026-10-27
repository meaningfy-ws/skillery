---
name: sales-qualification
description: "Use this skill when a Meaningfy deal or lead needs its homework, its dossier or its qualification (\"research this lead before I contact them\", \"score this deal on the five Ps\", \"who decides in this deal\", \"what should I ask this prospect\"); it keeps the deal dossier in Odoo, scores the five Ps from MEDDPICC with graded evidence, holds the prospect question bank and the research checklist. Not for writing the proposal (proposal-writing) or coaching the consultant's own thinking (semantic-consulting-coach)."
license: Apache 2.0
metadata:
  purpose: crm
  area: sales
  subject: semantic-data
  posture: profiled
  stage: sell
  maturity: experimental
---

# Sales Qualification

Most of selling is homework: knowing the company, the people, their situation and their need
before talking to them. This skill does that homework and keeps it in one place, the **deal
dossier** in the Odoo opportunity's description, and gives the verdict: is this deal worth pursuing
now? Every brief, meeting plan and email is drawn from the dossier.

It owns the dossier template; MEDDPICC and the one prospect question bank
([meddpicc](references/meddpicc.md)); the five-P verdict and its bands
([five-ps](references/five-ps.md)); the value equation, risk and blame
([value-equation](references/value-equation.md)); and the research rules
([research-checklist](references/research-checklist.md)). `sales-accounts` keeps the company and
the people; `sales-pipeline-custody` does every Odoo write.

## Quick Start

**Input:** "Score the Acme Data deal; we had the discovery call yesterday."

1. Read the deal, its chatter and yesterday's call notes; fill MEDDPICC, each element sourced or
   OPEN.
2. Read the five Ps from it: Pain 2 ("three systems, three definitions of a supplier", call of
   27 Oct); Priority 1 (data-platform programme planned, budget not confirmed); Power 1 (head of
   data is champion, economic buyer OPEN); Plan 1 (next fiscal year); Fit 2 (one domain, several
   systems).
3. Total 7/10 with one OPEN: band **pursue**. The next step closes the OPEN P: "Whose budget would
   this come from?" in the follow-up.

**Output:** the dossier's *Summary* in words ("Acme Data wants one shared definition of a supplier
across three systems; discovery call held 27 Oct; next: name the budget owner; our turn"), the
*Five Ps* block, and the score handed to `sales-pipeline-custody` for the stars.

## Write rules

Before any write, read the write rules of `sales-pipeline-custody`. Writing the dossier into the description, keeping the earlier text, is *do and log* (`odoo-dossier`). A dossier never moves a stage on its own: moves follow the pipeline rules.

## Depth by stage

| Deal stage | Dossier depth |
|---|---|
| New lead, Identified, Watch, Partner introduction | **Short**: summary, lead source, pain hypothesis (marked as inference), one question that would qualify it, a provisional attention score, next step |
| Every later stage | **Full** template, all sections |

## Workflow

1. **Objective.** State the work item's objective: "the dossier of deal #ID meets the acceptance criteria below", or a narrower one, such as "stakeholders and economic buyer known for deal #ID".
2. **Read what exists.**
   - Odoo: the deal and its whole chatter, the company and people (their profiles, through `sales-accounts`).
   - Mail threads with the contacts, and calendar events.
   - The vault project that is the deal's lead source (the event project, for events).
   - The company memory: recall only, by company or person name.
3. **Research the gaps** in this order: the company and the people through `sales-accounts` (their profiles), then the deal itself, then the partner if any. Rules: [research-checklist](references/research-checklist.md). No LinkedIn scraping; list what the owner should check there.
4. **Fill MEDDPICC** ([meddpicc](references/meddpicc.md)). Each element is either known, with its source, or OPEN, with the question that would close it.
5. **Score the attention block.** For client deals, the five Ps from MEDDPICC ([five-ps](references/five-ps.md)): every P sourced or OPEN, the OPEN count, the band, any explicit ask, any disqualifier. For partnerships and tenders, the rubric of the route in `sales-pipeline-custody`. Hand the score to `sales-pipeline-custody` for the stars.
6. **Risk and blame.** Write down what could go wrong *for the champion* if they choose us, and the cover we give. See [value-equation](references/value-equation.md#risk-and-blame).
7. **The offer.**
   - Pick the lead offer on the ladder (owned by `semantic-consulting-coach`, `engagement-lifecycle`), with at most one fallback.
   - Name the step in the client's words.
   - Write the value-equation line, *why us vs. the alternative* (including doing nothing or doing it in-house), and the objection drivers ([value-equation](references/value-equation.md)).
   - Offers come from the services catalogue and the offer projects; never invent an offer.
8. **Write the dossier** with the template [`assets/templates/dossier.md`](assets/templates/dossier.md) into the opportunity's description. Keep any earlier text under *Previous notes*. Log the write.
9. **Hand back** to the verifier: the dossier, its sources, and what is still OPEN.

## Acceptance criteria (checked by the goal verifier)

**Every dossier, short or full:**
- Every section that the depth requires is present.
- Facts not yet known are marked OPEN, with the question that would close them. Nothing is guessed.
- Every fact about a company or a person has a source: a link, mail, meeting note or Odoo record. Inferences are marked as inferences.
- The earlier description text is preserved, and the write is logged.

**Full dossiers, in addition:**
- **MEDDPICC**: the economic buyer, champion, pain and decision process are each either filled or OPEN, with a named next step to fill them.
- ***Risk and blame*** names at least one risk for the champion and the cover against it.
- **Offer**:
  - one lead offer, named in the client's words, with at most one fallback;
  - a value-equation line in the client's terms;
  - a *why us vs. the alternative* line;
  - at least two objections, each with an answer.
- ***Attention score*** is present for the pipeline (five Ps, partner value or go/no-go): every element sourced or OPEN, the OPEN count shown, the band stated; a disqualifier, if any, is named.
- ***Next step*** is dated and exists as an Odoo activity.
- ***Lead source*** is filled when known.
- ***Stakeholders*** link each person's contact id; their profiles exist.
- ***Strategy*** names the evidence against winning.
- ***Partner*** block is filled for Consulting via Partner and Partnerships deals.

## Limits

- People: facts about the person live in their profile (`sales-accounts`), within its rules for personal details; the dossier holds only their part in this deal.
- When sources conflict, show both and say which is more recent.
- Research is bounded by the run's budget. What is not done is marked OPEN, not skipped silently.

## Gotchas

- **Five Ps are read from MEDDPICC, never asked.** Firing the question list at a first contact is a
  defect; pick the one or two questions that close the biggest gap.
- **Unknown is 0 and OPEN, not low.** A 3/10 with two OPENs means "not judged yet"; the next action
  is the question, never a close.
- **The summary opens in words.** A score or star code as the first line makes the owner open the
  rubric to decode it.
- **No guarantee, bonus or price is decided here.** They belong to the commercial owners named below
  and are *ask first* in any draft.

## Boundary & Related Skills

**Owns:** the deal dossier and its depth by stage; MEDDPICC and the prospect question bank; the
five-P verdict, bands and disqualifiers; evidence grading for deal facts; the value equation, risk
and blame and the objection drivers; the research checklist.

**Does NOT own:** companies, people and profiles (`sales-accounts`); stars, stages and every Odoo
write (`sales-pipeline-custody`); the offer ladder and safeguard options (`semantic-consulting-coach`,
`engagement-lifecycle`); the consultant's coaching posture and the go/no-go after a first
conversation (`semantic-consulting-coach`); objection types and answers in a conversation
(`sales-conversations`); price (`estimation`); the proposal (`proposal-writing`).

**Related:** `sales-accounts`, `sales-pipeline-custody`, `sales-conversations`, `sales-operations`,
`semantic-consulting-coach`, `proposal-writing`, `estimation`.
