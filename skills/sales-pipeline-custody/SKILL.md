---
name: sales-pipeline-custody
description: "Use this skill when a deal or lead in Meaningfy's Odoo CRM must be placed in a pipeline, moved, converted, starred, given a next action, checked for rot or groomed, or before any write a sales agent makes to Odoo, mail, calendar or run notes (\"which pipeline does this deal belong to\", \"is this deal rotting\", \"may the sales agent do this\"); it holds the five pipelines, their stages and exit criteria, the attention filters and the three-tier write policy. Not for scoring a deal (sales-qualification) or for generic pipeline reviews outside Odoo."
license: Apache 2.0
metadata:
  purpose: crm
  area: sales
  subject: generic
  posture: precise
  stage: sell
  maturity: experimental
---

# Sales Pipeline Custody

Meaningfy sells through five routes; each is an Odoo CRM sales team with its own pipeline. This skill
is the one home for those pipelines, the stars, next actions, closing dates and attention filters,
how an agent reads and writes Odoo CRM, and the **write rules** that bound every write by a sales
skill. The other sales skills (`sales-operations`, `sales-accounts`, `sales-qualification`,
`sales-conversations`) call it for every Odoo read or write; it calls none of them.

## Quick Start

**Input:** "The client replied: they want the workshop proposal by Friday. Update the deal."

1. Read [write-rules](references/write-rules.md), then look the writes up in
   [`assets/write-policy.yaml`](assets/write-policy.yaml).
2. Resolve the deal to its Odoo record (two agreeing keys) and read its stage's *Exit when* in
   [`assets/pipelines.yaml`](assets/pipelines.yaml).
3. *Solution shaping* exits when the champion accepts the lead offer: the reply is the cited
   evidence, so the forward move to *Proposal & negotiation* is *do and log* (`odoo-stage-move`),
   team and stage written together.
4. Mark the current activity done and set the next one in the same step: "Send the workshop
   proposal", due Friday (`odoo-activity`).

**Output (run-note log):** `Odoo · crm.lead · Acme Data (#412) · stage_id · Solution shaping → Proposal & negotiation · reply of 27 Oct` and the new activity line.

## Workflow

1. Before any write: the write rules and the policy tier (below).
2. New record: place it (*Placing a deal*), then lead or opportunity (*Leads and opportunities*).
3. Existing record: exit criteria and rot, stars, next action, closing date, in that order.
4. Runs: work the attention filters of [`assets/odoo-views.yaml`](assets/odoo-views.yaml) in their order.
5. Anything *ask first*: a decision card in the run note (the card is owned by
   `executive-communication`), never a bare id.

## Write rules

Before any write, read [write-rules](references/write-rules.md). The tier of every action is in [`assets/write-policy.yaml`](assets/write-policy.yaml):
- *do and log*;
- *ask first*;
- *never*;
- anything unlisted is *ask first*.

## The five pipelines

| Pipeline (Odoo team) | Holds | Won when | Route file |
|---|---|---|---|
| **Direct Consulting** | our own clients: B2B, or direct procurement B2G | contract signed | [route-direct-consulting](references/route-direct-consulting.md) |
| **Consulting via Partner** | clients that belong to a partner (a tool vendor or a consultancy), usually introduced pre-qualified | a discovery workshop agreed is already won | [route-consulting-via-partner](references/route-consulting-via-partner.md) |
| **Calls & Tenders** | public and private tenders and grant calls, with consortium partners | awarded and signed | [route-calls-and-tenders](references/route-calls-and-tenders.md) |
| **FWC Execution** | work orders under a framework contract we hold, always with a partner | order signed | [route-fwc-execution](references/route-fwc-execution.md) |
| **Partnerships** | the partner relationship from A to Z: tool vendors, service providers, introducers | first joint client signed (that deal lives in Consulting via Partner or Calls & Tenders) | [route-partnerships](references/route-partnerships.md) |

The exact configuration is data, in [`assets/pipelines.yaml`](assets/pipelines.yaml): stages, order, *Requirements* text, days to rot, won flags, tags. Odoo is expected to match it.

## Placing a deal

1. **Is it a relationship with a partner, not a client deal?** → Partnerships.
2. **Is there a published call, tender or grant programme with a deadline?** → Calls & Tenders. Tag it *Public Procurement Tender*, *Private Tender* or *R&D Grants*.
3. **Is it a work order under a framework contract we already hold?** → FWC Execution.
4. **Does the client belong to a partner who introduced us?** → Consulting via Partner. Tag the partner type.
5. Otherwise → Direct Consulting.

A new deal is placed directly. Moving an existing deal to another pipeline is *ask first*. When unsure, do not guess: propose the placement with its reason.

## Leads and opportunities

The pipelines hold only deals with a live conversation. Everything earlier is a lead, outside the pipelines.

| Record | When | How |
|---|---|---|
| **Lead** (`type` = lead) | no two-way interaction yet: cold event attendees, list entries, sporadic contacts, a badge scan or a handshake with nothing agreed | team set to the likely pipeline; no stage; short profiles on the contacts |
| **Opportunity** (`type` = opportunity) | the first two-way signal of interest: a meeting held or agreed, a reply that shows interest, an in-person conversation with an agreed follow-up | convert by writing `type`, `team_id` and the pipeline's first stage together, citing the signal: *do and log* (`odoo-convert`) |
| **Lost** | an explicit refusal; or no reply after the cadence's touches (`sales-conversations`, cadence). A lead untouched for the dormancy period gets a proposed first touch, not a lost | *ask first*, as every lost (`odoo-won-lost`) |

On conversion: cite every piece of evidence for the signal (the reply, the meeting in the calendar), never use Odoo's conversion wizard (it can merge and create contacts), update the person's profile (*How we know them*, through `sales-accounts`), and give the new opportunity a short dossier and its next step.

Converting without a cited two-way signal is *ask first*. An opportunity never goes back to a lead.

The signal decides the conversion; the attention score decides what happens next. For client deals the five-P band (`sales-qualification`, `references/five-ps.md`): **pursue** gets a dated step towards Discovery, **nurture** gets one useful touch every 6–8 weeks, **not now** (judged, after a held meeting) gets a lost-or-nurture proposal (*ask first*). A disqualifier means proposing a close or a redirect.

## The offer ladder in Odoo

The ladder itself (discovery workshop → Proof of Value → Scaling, durations, what is paid) is owned by `semantic-consulting-coach` (`engagement-lifecycle`). In Odoo:

Each step is its own deal with its own offer, tagged *Offer: Discovery workshop*, *Offer: Proof of Value* or *Offer: Scaling*. When a step is won, propose the next step as a new deal.

Name a step in the client's words where the client has its own name for it (`sales-conversations`).

## Rot and exit criteria

- **Rot.** A deal rots when its rot clock (see `sales-operations` (goal loop, *Terms*)) exceeds the stage's *Days to rot*. Odoo flags it. The agent then does one of two things:
  - sets a concrete next activity;
  - past twice the threshold, proposes *advance or close*.
- **Moving a deal.** A deal moves only when the current stage's **Exit when** line is true.
  - A forward move inside the pipeline, not into Won or Lost, with cited evidence for every condition, is *do and log* (`odoo-stage-move`).
  - Won, lost, backward moves and moves to another pipeline are *ask first*.

## Stars

**Stars mean the attention a record deserves**, in every pipeline. They use Odoo's `priority` on `crm.lead` (0–3), which shows on kanban cards and sorts, filters and groups. Mood, size and urgency stay out of them; urgency is the date of the next activity.

Each pipeline scores with its own rubric, written in the record's dossier (*Attention score*):

| Pipeline | Rubric | ★★★ | ★★ | ★ |
|---|---|---|---|---|
| Direct Consulting; Consulting via Partner (the end client) | Five Ps, 0–10 (`sales-qualification`, `references/five-ps.md`) | 7–10, or an explicit ask | 4–6 | 0–3 |
| Partnerships | Partner value, 0–8 ([route-partnerships](references/route-partnerships.md)) | 6–8 | 4–5 | 0–3 |
| Calls & Tenders | Go/no-go, 0–8 ([route-calls-and-tenders](references/route-calls-and-tenders.md)); a no-go is proposed as lost, not starred | 6–8 | 4–5 | 0–3 |
| FWC Execution | not scored: every request for offer under a won framework matters | — | — | — |

- **No star means not scored**, or not judged yet (two or more OPEN elements). A scored record with little value gets ★, never zero stars, so the *Not scored* filter stays a clean work queue. FWC Execution is unstarred by design and outside that filter.
- **Stars follow the dossier.** The agent sets them only with, or after, the dossier's *Attention score*, citing it (`odoo-priority`, *do and log*). Never on impression.
- **Leads are starred too**, from their provisional score, to rank first touches and intake sessions.
- **The owner's stars win.** If the tracking shows the owner set the stars, the agent never changes them back. A difference from the score becomes one decision card (keep the owner's stars or align to the score), with the element that drives the difference and its evidence; the weekly review asks once.
- **A falling band is news.** A drop (★★★ to ★★ or lower) is reported in the next run note with the element that dropped and its evidence.

## Next actions

**No deal without an action.** Every open lead and opportunity, in every pipeline, has at least one open activity with a due date, assigned to the owner.
- **Missing**: the scan sets one, with a concrete summary (what, with whom) and a date. If the next step is unclear, the activity is the question that would make it clear. While a decision card waits for the owner, the activity's summary is the card's DECIDE line and the run note's name, due the next working day; never only "decide on P<n>".
- **Done**: the next activity is set in the same step (`action_feedback`, then a new activity). No gap between them.
- **Overdue**: done, if it is the agent's work (research, a draft); otherwise re-dated with the reason in the activity's note (`odoo-activity-redate`). A date is never moved silently.
- **The date follows the stars and the stage**: ★★★ within 7 days; ★★ within the nurture rhythm; always inside the stage's days to rot.
- **Hard deadlines** (a tender submission, a reply to a request for offer, an NDA expiry) are activities of type *Deadline*, due on that date. Until that type exists in Odoo, use the default activity type with a summary starting `Deadline:`; it counts the same, and is converted once the type exists. A deadline activity sits next to the next working step; it does not replace it.
- Won and lost records get no activity; after a win, the account's relationship activity (`sales-accounts`) and the next ladder deal take over.

## Closing dates, revenue and probability

An expected closing date early in a deal is a guess, and "closing" means different things per pipeline. So:
- `date_deadline` is set **only in a pipeline's last open stage** (listed in [`assets/odoo-views.yaml`](assets/odoo-views.yaml), `closing_date_stages`), and only to a decision date the client or partner **stated**, with the source. Everywhere else it stays empty; the agent never fills it on its own estimate.
- Expected revenue and probability follow the same rule: empty until there is a stated basis, then a range with its basis in the dossier.

## Attention filters

Where to look in each pipeline, and why, is data: [`assets/odoo-views.yaml`](assets/odoo-views.yaml). Every filter has a question, an Odoo domain or an agent check (when it needs the chatter or the dossier), an action for each hit, a target (*zero* or *worklist*) and a cadence (open day, close day, weekly). The runs of `sales-operations` work them in their order and report a count per filter, so the owner can open the same saved filter in Odoo and see the same records.

The saved filters, the *Deadline* activity type and the default views are configuration: created in Odoo through a proposal (*ask first*), then kept in step with the file. A sweep finding seen twice (`sales-operations`) becomes a proposed new filter or agent check here.

## Lead sources

Every new lead or deal records where it came from, when known:
- a **source**: the kind of origin (Conference/Event, Referral…);
- a **medium**: how we first talked;
- an **event tag** for events: `Event: <name> <year>`, which groups everything from one event.

The context (what the event was, what we pitched) lives once, in the event's vault project, and the dossier links it. Rules are in [lead-sources](references/lead-sources.md). Setting existing values and tags is *do and log*; new values and new tags are *ask first*.

## Reading and writing Odoo

The how-to is in [odoo-crm-conventions](references/odoo-crm-conventions.md): models, fields, internal notes, writing team and stage together, re-reading after a write, logging old values, duplicate checks.

## Objective and acceptance criteria for this skill's work items

| Work item | Acceptance criteria (checked by the goal verifier) |
|---|---|
| Placement | names the pipeline and stage; quotes the rule above that decided it; gives the evidence |
| Stage move (do) or proposal (ask) | quotes the stage's *Exit when* line; shows each condition met, with a source; logged with the old stage |
| Rot handling | states days in stage vs the threshold; sets one concrete next activity with a date, or proposes advance-or-close with reasons |
| Stars | cite the dossier's attention score and its date; the stars match the pipeline's rubric; the owner's override untouched |
| Next action | every open record touched has one open, dated activity; an overdue one is done or re-dated with its reason |
| Filter pass | a count per filter of the run's cadence, in the file's order; every hit has its action or a reason why not |
| Grooming write | one log line with the old value, new value and source; the tier matches `write-policy.yaml` |
| Configuration proposal | lists each change as before → after; shows it keeps `pipelines.yaml` consistent; says what happens to the deals affected |
| Configuration check | lists every difference between Odoo and `pipelines.yaml`, or states "no difference" |

## Gotchas

- **Odoo ids are not in this skill.** Teams and stages are found by name; ids are read live.
- **Team and stage go together** in one write, or Odoo moves the deal to another pipeline.
- **`action_set_won` can pick another pipeline's won stage**: re-read the stage after it
  ([odoo-crm-conventions](references/odoo-crm-conventions.md)).
- **A proposal that is an id is not a proposal.** Every *ask first* item is a decision card.
- **Personal data, staff names and partner ratings** come from `sales-config.yaml` and Odoo at run
  time, never from this skill (see `sales-operations` for the keys).

## Boundary & Related Skills

**Owns:** the five pipelines and their stages, exit criteria and days to rot; placement; the lead
lifecycle; stars, next actions, closing dates and attention filters; the Odoo read/write
conventions; the write rules and the write policy of every sales skill.

**Does NOT own:** the offer ladder (`semantic-consulting-coach`, `engagement-lifecycle`); deal
scoring, the dossier and the five Ps (`sales-qualification`); identity and profiles
(`sales-accounts`); runs and run notes (`sales-operations`); drafts and conversations
(`sales-conversations`); the decision card (`executive-communication`); generic agent safety
(`guardrails`).

**Related:** `sales-operations`, `sales-accounts`, `sales-qualification`, `sales-conversations`,
`guardrails`, `executive-communication`, `semantic-consulting-coach`.
