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
Every external sales meeting starts from a plan and ends with a dated next step; the messages
around it are drafts, never sent. This skill calls `sales-accounts` for the people in the meeting,
`sales-qualification` when the deal's dossier is missing or older than the last contact, and
`sales-pipeline-custody` for every Odoo write.

Read `references/selling-method.md` before writing any plan or draft: it adds the principles, the
channel matrix, personal touches, price, the cadence and where each source is not used.

## Quick Start

**Input:** "Prepare tomorrow's call with the head of data at Acme Pharma; we met at the data summit."

1. Read the dossier (`sales-qualification`): stage Discovery, pain stated, economic buyer OPEN.
2. Read her profile (`sales-accounts`): cares about the AI pilot; fears being blamed for a failed
   platform choice.
3. Fill [`assets/templates/meeting-plan.md`](assets/templates/meeting-plan.md): the commitment to ask
   for is "an intro to whoever owns the data budget"; insight 2 ("AI does not scale on data that
   disagrees"); three calibrated questions on the economic buyer and the decision process; the
   offer is held, because the economic buyer is OPEN.

**Output:** a one-screen plan posted as an internal note on the deal, with "Decision needed from the
owner before the meeting: none".

## Workflow

### Before: the meeting plan

1. **Objective**: "a meeting plan for meeting M with deal #ID that meets the acceptance criteria".
2. **Read**: the dossier (via `sales-qualification`), the last exchanges, the calendar event and its
   attendees.
3. **Fill [`assets/templates/meeting-plan.md`](assets/templates/meeting-plan.md)**, every field:
   the **one commitment to ask for**; calibrated questions that close the biggest MEDDPICC gaps,
   the weakest of the five Ps first. In Discovery-stage meetings, **hold the offer while pain or
   the economic buyer is OPEN**: the plan's weight is on questions.
   Read `references/insights.md` when a plan or a first touch needs an insight to teach: it adds
   the six insights Meaningfy teaches, with proof, opening question and role, and
   the rules for using and adding one.
4. **Post the plan** as an internal note on the deal (through `sales-pipeline-custody`) and log it.

### During: tools to use

Read `references/conversation-tools.md` when choosing the tools for a meeting: it adds Meaningfy's
discovery flow, the conditions on commercial teaching and listening, and when each is not used.

### After: notes, follow-up, next step

1. When the owner's notes arrive (vault or chat), update the dossier via `sales-qualification`.
2. Draft the follow-up **the same day**. Read `references/email-patterns.md` before any draft: it
   adds the cc rule, the whose-turn check, meeting proposals, the pattern per situation and what a
   draft never does.
3. Set the next activity. If the stage's *Exit when* is now true, move the stage per the pipeline
   rules.
4. Read `references/objections.md` when an objection comes up or a new one must be filed: it adds
   the five objection types and first moves, and the rules of the objection library.

## Rules

Before any write, read the write rules of `sales-pipeline-custody`.
- **Drafts**: creating Gmail drafts is *do and log*. Sending, or scheduling a send, is *never*.
- **Commitments**: a draft that commits Meaningfy (price, guarantee, free work, named staff, date,
  exclusivity) is *ask first*.
- **Whose turn first.** Before a reply or revival, decide whose turn it is: a revival when the
  ball is ours (they asked for an offer) loses the deal; deliver what was asked first.
- **The other sender in cc** on every external draft; without it the draft is not written.
- **No sales technique in a tender**, and nothing behind a partner's back (the channel matrix).

## Before you hand over: acceptance criteria

Checked by the goal verifier and the recipient reader.

| Work item | Criteria |
|---|---|
| Meeting plan | fits one screen; names who leads and one commitment to ask for; every question targets a MEDDPICC gap named in the dossier; offer named in their words, with at most one fallback, or held in Discovery |
| Follow-up draft | drafted the day of the notes; one clear ask with a date; repeats their words for the pain; commits nothing without approval; no discount |
| Revival or delivery draft | whose turn stated and right; under 40 words for the nine-word pattern; one question; within the cadence limits |
| Partner draft | states what is in it for the partner; goes through the partner; quotes nothing below the partner |
| Every draft | a **Gmail draft**, never sent; in the language and formality of the thread; the other of the owner and the second sender in cc; logged with its draft id |

## Boundary & Related Skills

**Owns:** the meeting plan; the selling method and the channel matrix; the conversation tools; the commercial insights; the objection
taxonomy and the library rules; the email patterns, whose turn, the cc rule and the cadence.

**Does NOT own:** the tone of an outreach email (`meaningfy-voice`, channel `outreach-email`);
answer-first structure and the decision card (`executive-communication`); prices and effort
(`estimation`, `proposal-writing`); the offer ladder and guarantees (`semantic-consulting-coach`,
`engagement-lifecycle`); the dossier, MEDDPICC and the five Ps (`sales-qualification`); profiles and
personal details (`sales-accounts`); Odoo writes (`sales-pipeline-custody`).

**Related:** `sales-qualification`, `sales-accounts`, `sales-pipeline-custody`, `sales-operations`,
`meaningfy-voice`, `executive-communication`, `proposal-writing`, `estimation`,
`semantic-consulting-coach`.
