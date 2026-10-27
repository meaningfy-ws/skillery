---
name: sales-conversations
description: "Use this skill when a Meaningfy sales or partner meeting needs a plan, when meeting notes need a same-day follow-up draft, when a deal needs a reply or a quiet one a revival email, or when a client's objection needs an answer (\"prepare my meeting with X\", \"draft the follow-up to the call\", \"how do I answer this objection\", \"revive this deal\"); it writes the one-screen meeting plan and the drafts, applying the selling method, the commercial insights and the objection taxonomy. Drafts only, never sent. Not for scoring a deal (sales-qualification)."
license: Apache 2.0
metadata:
  purpose: offers
  area: sales
  subject: semantic-data
  posture: profiled
  stage: sell
  maturity: experimental
---

# Sales Conversations

A meeting without a goal roams, and a follow-up sent three days late loses the deal's momentum.
This skill makes every external sales meeting start from a plan and end with a dated next step, and
it drafts the messages around the meeting. `sales-operations` calls it for meetings today or
tomorrow, after-meeting work, replies waiting and rotting deals; the owner can call it directly. It
calls `sales-accounts` for the people in the meeting, `sales-qualification` when the deal's dossier
is missing or older than the last contact, and `sales-pipeline-custody` for every Odoo write.

## Quick Start

**Input:** "Prepare tomorrow's call with the head of data at Acme Pharma; we met at the data summit."

1. Read the dossier (`sales-qualification`): stage Discovery, pain stated, economic buyer OPEN.
2. Read her profile (`sales-accounts`): cares about the AI pilot; fears being blamed for a failed
   platform choice.
3. Fill [`assets/templates/meeting-plan.md`](assets/templates/meeting-plan.md): the commitment to ask
   for is "an intro to whoever owns the data budget"; insight 2 from [insights](references/insights.md)
   ("AI does not scale on data that disagrees"); three calibrated questions on the economic buyer and
   the decision process; the offer is held, because the economic buyer is OPEN.

**Output:** a one-screen plan posted as an internal note on the deal, with "Decision needed from the
owner before the meeting: none".

## Workflow

### Before: the meeting plan

1. **Objective**: "a meeting plan for meeting M with deal #ID that meets the acceptance criteria".
2. **Read**: the dossier (via `sales-qualification`), the last exchanges, the calendar event and its attendees.
3. **Fill [`assets/templates/meeting-plan.md`](assets/templates/meeting-plan.md)**:
   - who leads, and their goal;
   - the **one commitment to ask for**;
   - the champion's risk and our cover;
   - labels;
   - calibrated questions that close the biggest MEDDPICC gaps, the weakest of the five Ps first;
   - the offer, named in their words;
   - likely objections;
   - non-cash concessions;
   - the next step, with a date;
   - when we walk away;
   - what to check on LinkedIn.
   
   In Discovery-stage meetings, **hold the offer while pain or the economic buyer is OPEN**: the plan's weight is on questions.
4. **Post the plan** as an internal note on the deal (through `sales-pipeline-custody`) and log it.

### During: tools to use

The discovery flow, listening first, aiming for "that's right". Details are in [conversation-tools](references/conversation-tools.md).

### After: notes, follow-up, next step

1. When the owner's notes arrive (vault or chat), update the dossier via `sales-qualification`.
2. Draft the follow-up **the same day** ([email-patterns](references/email-patterns.md)).
3. Set the next activity. If the stage's *Exit when* is now true, move the stage per the pipeline rules.
4. Add any new objection, and the answer that worked, to the objection library ([objections](references/objections.md)).

### Replies and revivals

First decide **whose turn** it is ([email-patterns](references/email-patterns.md#first-whose-turn-is-it)).
- **Ours**: deliver what was asked and own any delay.
- **Theirs**: revive, within the cadence limits of the method.

## Write rules

Before any write, read the write rules of `sales-pipeline-custody`.
- **Drafts**: creating Gmail drafts is *do and log*. Sending is *never*.
- **Commitments**: a draft that commits Meaningfy (price, guarantee, free work, named staff, date, exclusivity) is *ask first*.

## The method

[selling-method](references/selling-method.md) holds the principles, the channel matrix (B2G, direct, partner-led), decisions under uncertainty, personal touches, where prices come from, the cadence, and where each source is not used. Read it before writing a plan or a draft.

## Acceptance criteria (checked by the goal verifier and the recipient reader)

| Work item | Criteria |
|---|---|
| Meeting plan | fits one screen; names who leads and one commitment to ask for; every question targets a MEDDPICC gap named in the dossier; offer named in their words, with at most one fallback, or held in Discovery |
| Follow-up draft | drafted the day of the notes; one clear ask with a date; repeats their words for the pain; commits nothing without approval; no discount |
| Revival or delivery draft | whose turn stated and right; under 40 words for the nine-word pattern; one question; within the cadence limits |
| Partner draft | states what is in it for the partner; goes through the partner; quotes nothing below the partner |
| Every draft | a **Gmail draft**, never sent; in the language and formality of the thread; the other of the owner and the second sender in cc; logged with its draft id |

## Gotchas

- **Drafts only.** Creating a draft is *do and log*; sending, or scheduling a send, is *never*.
- **Whose turn first.** A revival sent when the ball is ours (they asked for an offer) loses the deal;
  deliver what was asked before anything else.
- **The other sender in cc** on every external draft; without it the draft is not written.
- **Hold the offer in Discovery** while the pain or the economic buyer is OPEN.
- **No sales technique in a tender**, and nothing behind a partner's back (the channel matrix).

## Boundary & Related Skills

**Owns:** the meeting plan; the selling method and the channel matrix; the conversation tools
(discovery flow, commercial teaching, listening, rapport); the commercial insights; the objection
taxonomy and the library rules; the email patterns, whose turn, the cc rule and the cadence.

**Does NOT own:** the tone of an outreach email (`meaningfy-voice`, channel `outreach-email`);
answer-first structure and the decision card (`executive-communication`); prices and effort
(`estimation`, `proposal-writing`); the offer ladder and guarantees (`semantic-consulting-coach`,
`engagement-lifecycle`); the dossier, MEDDPICC and the five Ps (`sales-qualification`); profiles and
personal details (`sales-accounts`); Odoo writes (`sales-pipeline-custody`).

**Related:** `sales-qualification`, `sales-accounts`, `sales-pipeline-custody`, `sales-operations`,
`meaningfy-voice`, `executive-communication`, `proposal-writing`, `estimation`,
`semantic-consulting-coach`.
