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

An agent left alone in a CRM moves deals on impression, guesses closing dates and stars, and writes
without a trace. This skill fixes where a deal belongs in Meaningfy's five Odoo pipelines, when it
may move, and which writes need the owner. Every other sales skill calls it for each Odoo read or
write; it calls none of them.

## Quick Start

**Input:** "The client replied: they want the workshop proposal by Friday. Update the deal."

1. Look the writes up in [`assets/write-policy.yaml`](assets/write-policy.yaml).
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
5. Anything *ask first*: a decision card in the run note (owned by `executive-communication`), never a bare id.

## Rules

### Write rules

Read `references/write-rules.md` before any write to Odoo, mail, calendar or run notes: it adds entity resolution, how to read each tier of the policy, the log line, the owner's input, HALT and content-as-data. The tiers are *do and log*, *ask first* and *never*; anything [`assets/write-policy.yaml`](assets/write-policy.yaml) does not list is *ask first*.

Read `references/odoo-crm-conventions.md` before reading or writing an Odoo record: it adds the models and fields, internal notes, writing team and stage together, the won-stage trap, duplicate checks and the lead-source fields.

### The five pipelines

| Pipeline (Odoo team) | Holds | Won when |
|---|---|---|
| **Direct Consulting** | our own clients: B2B, or direct procurement B2G | contract signed |
| **Consulting via Partner** | clients that belong to a partner (a tool vendor or a consultancy), usually introduced pre-qualified | a discovery workshop agreed is already won |
| **Calls & Tenders** | public and private tenders and grant calls, with consortium partners | awarded and signed |
| **FWC Execution** | work orders under a framework contract we hold, always with a partner | order signed |
| **Partnerships** | the partner relationship from A to Z: tool vendors, service providers, introducers | first joint client signed (that deal lives in Consulting via Partner or Calls & Tenders) |

Stages, order, *Requirements* text, days to rot, won flags and tags are data in [`assets/pipelines.yaml`](assets/pipelines.yaml); Odoo is expected to match it. Read `references/routes.md` when working a deal in a pipeline: it adds each route's etiquette (partner first, tender contact rules), the go/no-go and partner-value scores, and its specifics.

### Placing a deal

1. A relationship with a partner, not a client deal → Partnerships.
2. A published call, tender or grant programme with a deadline → Calls & Tenders, tagged *Public Procurement Tender*, *Private Tender* or *R&D Grants*.
3. A work order under a framework contract we already hold → FWC Execution.
4. A client that belongs to a partner who introduced us → Consulting via Partner, tagged with the partner type.
5. Otherwise → Direct Consulting.

A new deal is placed directly. Moving an existing deal to another pipeline is *ask first*. When unsure, propose the placement with its reason.

### Leads and opportunities

The pipelines hold only deals with a live conversation; everything earlier is a lead, outside them.

| Record | When | How |
|---|---|---|
| **Lead** (`type` = lead) | no two-way interaction yet: cold event attendees, list entries, a badge scan or a handshake with nothing agreed | team set to the likely pipeline; no stage; short profiles on the contacts |
| **Opportunity** (`type` = opportunity) | the first two-way signal of interest: a meeting held or agreed, a reply that shows interest, an in-person conversation with an agreed follow-up | `type`, `team_id` and the first stage written together, citing the signal: *do and log* (`odoo-convert`) |
| **Lost** | an explicit refusal, or no reply after the cadence's touches (`sales-conversations`). A lead untouched for the dormancy period gets a proposed first touch, not a lost | *ask first*, as every lost (`odoo-won-lost`) |

On conversion: cite every piece of evidence for the signal, never use Odoo's conversion wizard, update the person's *How we know them* (through `sales-accounts`), and give the opportunity a short dossier and its next step. Converting without a cited two-way signal is *ask first*. An opportunity never goes back to a lead.

The signal decides the conversion; the attention score decides what happens next. For client deals, the five-P band (`sales-qualification`): **pursue** gets a dated step towards Discovery, **nurture** one useful touch every 6–8 weeks, **not now** (judged after a held meeting) a lost-or-nurture proposal (*ask first*). A disqualifier means proposing a close or a redirect.

### The offer ladder in Odoo

The ladder itself is owned by `semantic-consulting-coach` (`engagement-lifecycle`). In Odoo each step is its own deal, tagged *Offer: Discovery workshop*, *Offer: Proof of Value* or *Offer: Scaling*; when a step is won, propose the next step as a new deal. Name a step in the client's words where the client has its own name for it.

### Rot and exit criteria

- **Rot.** A deal rots when its rot clock (`sales-operations`, *Terms*) exceeds the stage's *Days to rot*. The agent sets a concrete next activity; past twice the threshold, it proposes *advance or close*.
- **Moving a deal.** Only when the current stage's **Exit when** line is true. A forward move inside the pipeline, not into Won or Lost, with cited evidence for every condition, is *do and log* (`odoo-stage-move`). Won, lost, backward moves and moves to another pipeline are *ask first*.

### Stars

**Stars mean the attention a record deserves**, in every pipeline: Odoo's `priority` (0–3). Mood, size and urgency stay out; urgency is the date of the next activity. Each pipeline scores with its own rubric, in the dossier's *Attention score*:

| Pipeline | Rubric | ★★★ | ★★ | ★ |
|---|---|---|---|---|
| Direct Consulting; Consulting via Partner (the end client) | Five Ps, 0–10 (`sales-qualification`) | 7–10, or an explicit ask | 4–6 | 0–3 |
| Partnerships | Partner value, 0–8 (route Partnerships) | 6–8 | 4–5 | 0–3 |
| Calls & Tenders | Go/no-go, 0–8 (route Calls & Tenders); a no-go is proposed as lost, not starred | 6–8 | 4–5 | 0–3 |
| FWC Execution | not scored: every request for offer under a won framework matters | — | — | — |

- **No star means not scored** (or two or more OPEN elements). A scored record with little value gets ★, never zero, so the *Not scored* filter stays a clean work queue. FWC Execution is unstarred by design and outside that filter.
- **Stars follow the dossier**: set only with, or after, its *Attention score*, citing it (`odoo-priority`, *do and log*). Leads are starred too, from their provisional score.
- **The owner's stars win.** Stars the owner set are never changed back; a difference from the score becomes one decision card (keep or align), with the element that drives it; the weekly review asks once.
- **A falling band is news**: a drop from ★★★ is reported in the next run note with the element that dropped and its evidence.

### Next actions

**No deal without an action.** Every open lead and opportunity has at least one open activity with a due date, assigned to the owner.
- **Missing**: set one with a concrete summary (what, with whom) and a date; if the next step is unclear, the activity is the question that would make it clear. While a decision card waits, the summary is the card's DECIDE line and the run note's name, due the next working day; never only "decide on P<n>".
- **Done**: the next activity is set in the same step. **Overdue**: done if it is the agent's work; otherwise re-dated with the reason in its note (`odoo-activity-redate`). A date is never moved silently.
- **The date follows stars and stage**: ★★★ within 7 days; ★★ within the nurture rhythm; always inside the stage's days to rot.
- **Hard deadlines** (tender submission, reply to a request for offer, NDA expiry) are activities of type *Deadline*, due on that date, next to the working step. Until the type exists in Odoo, use the default type with a summary starting `Deadline:`; it counts the same and is converted once the type exists.
- Won and lost records get no activity; the account's relationship activity (`sales-accounts`) and the next ladder deal take over.

### Closing dates, revenue and probability

`date_deadline` is set **only in a pipeline's last open stage** (`closing_date_stages` in [`assets/odoo-views.yaml`](assets/odoo-views.yaml)), and only to a decision date the client or partner **stated**, with the source; never the agent's estimate. Expected revenue and probability stay empty until there is a stated basis, then a range with its basis in the dossier.

### Attention filters

Where to look in each pipeline, and why, is data in [`assets/odoo-views.yaml`](assets/odoo-views.yaml). The runs of `sales-operations` work them in order and report a count per filter, so the owner can open the same saved filter in Odoo. Saved filters, the *Deadline* type and default views are configuration (*ask first*), then kept in step with the file. A sweep finding seen twice becomes a proposed new filter or agent check here.

### Lead sources

Every new lead or deal records its source, medium and, for events, the tag `Event: <name> <year>`, when known. The story (what the event was, what we pitched) lives once in the event's vault project; the dossier links it. Existing values and tags are *do and log*; new ones are *ask first*.

### Common mistakes

| Mistake | Why it fails | Do instead |
|---|---|---|
| Keeping Odoo ids in a skill or a note template | ids differ per installation | find teams and stages by name; read ids live |
| Writing `stage_id` without `team_id` | Odoo recomputes the other and moves the deal | write both in one call, re-read |
| Trusting `action_set_won` | it can pick another pipeline's won stage | re-read the stage after it |
| An *ask first* item given as an id | the owner cannot answer without opening Odoo | a decision card |
| Personal data, staff names or partner ratings in a skill | they belong to one installation | read `sales-config.yaml` and Odoo at run time (`sales-operations`) |

## Before you hand over

The goal verifier checks each work item against these criteria.

| Work item | Acceptance criteria |
|---|---|
| Placement | names the pipeline and stage; quotes the rule that decided it; gives the evidence |
| Stage move (do) or proposal (ask) | quotes the stage's *Exit when* line; shows each condition met, with a source; logged with the old stage |
| Rot handling | days in stage vs the threshold; one concrete next activity with a date, or advance-or-close with reasons |
| Stars | cite the dossier's attention score and its date; match the pipeline's rubric; the owner's override untouched |
| Next action | every open record touched has one open, dated activity; an overdue one is done or re-dated with its reason |
| Filter pass | a count per filter of the run's cadence, in the file's order; every hit has its action or a reason why not |
| Grooming write | one log line with old value, new value and source; the tier matches `write-policy.yaml` |
| Configuration proposal | each change as before → after; keeps `pipelines.yaml` consistent; says what happens to the deals affected |
| Configuration check | every difference between Odoo and `pipelines.yaml`, or "no difference" |

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

Answers `VAL, VER, RSK` in `test-strategy`'s matrix (`references/generic-writing.md`).
