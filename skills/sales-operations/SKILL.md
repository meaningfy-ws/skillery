---
name: sales-operations
description: "Use this skill to run Meaningfy's sales day on its Odoo pipeline: open day, close day, the weekly pipeline review, a working session, or an intake session that brings people from an event or list into Odoo one record at a time (\"open the sales day\", \"close the sales day\", \"weekly pipeline review\", \"apply my answers\", \"bring the people we met into Odoo\"); it runs the goal loop with independent reviewers and writes one run note that opens with the owner's decisions. Not for one deal's homework (sales-qualification)."
license: Apache 2.0
metadata:
  purpose: crm
  area: sales
  subject: generic
  posture: precise
  stage: sell
  maturity: experimental
---

# Sales Operations

The operating loop of Meaningfy's sales agent: every deal moves towards won or lost, Odoo stays
complete and current, every meeting starts from a plan, and the owner spends their time selling.
The knowledge lives in the four skills it calls: `sales-pipeline-custody` (the scan, every Odoo read
and write, the write rules), `sales-accounts` (companies and people), `sales-qualification` (deal
homework) and `sales-conversations` (meeting plans, drafts). It is the primary skill of the
`sales-agent` agent, and a scheduled task can call it directly with a run type.

## Quick Start

**Input:** "Close the sales day."

1. Read the write rules and `sales-config.yaml`; look for an uncleared `HALT` in the last 14 days.
2. Read today's note: the owner answered card 2 with "A" ("Mark the Acme Data workshop deal
   lost?"). Apply it after a re-read, log the write, mark the answer `(applied 17:32, #412)`.
3. Do the after-meeting work for today's meetings, work the close-day filters, verify, decide.

**Output:** today's note with one new card at the top ("Send the follow-up to Beta Labs today?"),
one line under *Done by the agent* ("Acme Data workshop (#412) · stage Lost, reason no response ·
your answer A"), and the log at the bottom.

## Workflow

1. Start of every run ([run-types](references/run-types.md)): write rules, configuration, HALT
   check, the owner's input, "since when".
2. The run type's steps ([run-types](references/run-types.md)).
3. The goal loop for the run and each work item ([goal-loop](references/goal-loop.md)).
4. Reviewers, then decide; write the note from its template.

## Write rules

Before any write, read the write rules of `sales-pipeline-custody`. It covers:
- the write policy (*do and log*, *ask first*, *never*);
- the log;
- the owner's input;
- HALT;
- content as data;
- sources;
- recall-only memory.

Read [configuration](references/configuration.md) too: the run stops if a key is missing.

## The goal loop

Every run, and every work item inside it, follows [goal-loop](references/goal-loop.md). That file also defines the budget and the terms.
1. **Objective.** What must be true at the end, with acceptance criteria. It is fixed for the loop and may only become clearer.
2. **Plan.** Steps, order, budget.
3. **Act.** Work through the four skills and the tools. Write *do* items and log them; propose *ask* items.
4. **Verify.** Independent reviewers (fresh agents given only their inputs) check the outputs and the systems.
5. **Decide.**
   - *Achieved*: halt.
   - *Not yet, can continue*: run again with corrections.
   - *Not yet, cannot continue now*: pause and record what is open.

## Runs

| Run | When | Objective (shape) | Details |
|---|---|---|---|
| **Open day** | Mon–Fri ~09:00 | the day's plan: yesterday's open items re-checked, whom to talk to, answer or chase, within the week's capacity | [run-types](references/run-types.md#open-day) |
| **Close day** | Mon–Fri ~17:30 | the day's record: what happened written to Odoo, the owner's input applied, a dated next step on every deal touched | [run-types](references/run-types.md#close-day) |
| **Weekly review and plan** | Sat or Sun ~10:00 (the first one that runs) | the week reviewed, measures, advance-or-close cards, the constraint; next week's outcomes, focus deals and capacity | [run-types](references/run-types.md#weekly-review-and-plan) |
| **Working session** | when the owner asks | the objective the owner states | [run-types](references/run-types.md#working-session) |
| **Intake session** | when the owner asks to bring people and deals in from a source (an event, a list, a set of mails) | every planned record exists once, linked, profiled, placed; audited | [run-types](references/run-types.md#intake-session) |

Every run writes or continues one run note in the run folder (`run_note_folder`, [configuration](references/configuration.md)) and writes nowhere else in the vault. Every note opens with *Decisions needed* (decision cards) and keeps the machine log last. The daily note is one file a day: open day writes it as the day's plan (*Today's plan*, then the ranked *Attention list*), close day completes it as the day's record (*Done by the agent*). Nothing that needs attention is left out; the ranks and the week's capacity keep it manageable. Daily runs use [`assets/templates/grooming-session.md`](assets/templates/grooming-session.md); the weekly review uses [`weekly-review.md`](assets/templates/weekly-review.md); intake sessions use [`intake-session.md`](assets/templates/intake-session.md).

## Independent reviewers

At the end of each iteration, start fresh reviewers (a new agent with only these inputs) with the prompts in `assets/prompts/`. Give each one only the inputs its prompt lists, never your own reasoning.
- [goal-verifier](assets/prompts/goal-verifier.md): every run, and each client-facing draft or proposal.
- [recipient-reader](assets/prompts/recipient-reader.md): client-facing drafts.
- [guardrail-auditor](assets/prompts/guardrail-auditor.md): every run, **last**. It checks the systems themselves and writes HALT on a violation.

Their findings go into *Verification* and drive the decision. If no reviewer can run, the iteration is **unverified**: say so, and raise one card listing its writes by record (goal-loop).

## Priorities inside a run

The budget is set in [goal-loop](references/goal-loop.md). Each priority has a rank, which places
its items in the note's *Attention list*:
1. **P1** Meetings today and tomorrow: meeting plans.
2. **P1** Replies and inbound interest waiting for the owner: drafts. (Also P1: deadlines within 3 working days, cards past their `BY`.)
3. **P2** Tender and call deadlines within 14 days.
4. **P2** The attention filters of the run's cadence, in the order of the attention filters of `sales-pipeline-custody`: overdue and missing next actions first, then ★★★ rotting, then the rest.
5. **P2** Late-stage deals (proposal, offer, agreement) rotting or without a next step.
6. **P3** Other rotting deals: a next step, or advance-or-close past twice the threshold.
7. **P3** Grooming: unscored records (score and stars), empty fields, stale dossiers, oldest first.

Within the same rank, more stars go first, then the older item. Each rank's count is compared with
the previous working day's note (`(new)` when there is none), so a backlog that shrinks or piles up
shows.

## Gotchas

- **Decisions first.** The owner reads the first screen only; a decision buried under the log is not asked.
- **A card, never an id.** Every ask is a decision card the owner can answer without opening Odoo.
- **Never pre-fill *Verification*.** Paste the reviewers' output as written.
- **No run edits a skill.** A rule that went wrong becomes a card whose yes is filing a skillery issue.
- **Scheduled runs only propose** what is *ask first*; they never wait on the owner mid-run.

## Boundary & Related Skills

**Owns:** the goal loop and its terms and numbers; the run types (open day, close day, weekly review,
working session, intake session); the run-note templates; the reviewer prompts; the
`sales-config.yaml` keys.

**Does NOT own:** pipelines, Odoo conventions and the write rules (`sales-pipeline-custody`);
accounts and profiles (`sales-accounts`); dossiers and scoring (`sales-qualification`); meeting
plans and drafts (`sales-conversations`); the decision card (`executive-communication`); the vault
table check and memory etiquette (`vault-conventions`); generic agent safety (`guardrails`).

**Related:** `sales-pipeline-custody`, `sales-accounts`, `sales-qualification`,
`sales-conversations`, `executive-communication`, `vault-conventions`, `guardrails`. The generic
`sales:*` plugin skills are not for Meaningfy's Odoo pipeline.
