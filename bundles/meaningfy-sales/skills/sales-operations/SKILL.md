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

A scheduled sales run drifts: it changes its goal mid-run, grades its own work and buries the
owner's decisions under its log. This is the operating loop of the `sales-agent` (a scheduled task
can call it directly with a run type); the knowledge lives in the four skills it calls:
`sales-pipeline-custody`, `sales-accounts`, `sales-qualification` and `sales-conversations`.

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

The navigator's sales phases: [`assets/workflows/sales.workflow.json`](assets/workflows/sales.workflow.json) (provisional).

1. Read `references/run-types.md` before any run starts: it adds the start steps (write rules, configuration, HALT check, the owner's input, "since when") and the steps of each run type.
2. Read `references/configuration.md` before the first write of a run: it adds the `sales-config.yaml` keys, and a missing key stops the run with `HALT: configuration <key> missing`.
3. Read `references/goal-loop.md` while planning, verifying or deciding: it adds the terms and numbers (budget, capacity, dormancy, sweep, rot clock), how an objective may be clarified, and the three outcomes.

## Rules

### Write rules

Before any write, read the write rules of `sales-pipeline-custody` (policy, log, the owner's input,
HALT, content as data).

### The goal loop

Every run, and every work item inside it: **Objective** (fixed; it may only become clearer) →
**Plan** → **Act** → **Verify** (independent reviewers) → **Decide** (achieved, not yet and
continue, or not yet and pause).

### Runs

| Run | When | Objective (shape) |
|---|---|---|
| **Open day** | Mon–Fri ~09:00 | the day's plan: yesterday's open items re-checked, whom to talk to, answer or chase, within the week's capacity |
| **Close day** | Mon–Fri ~17:30 | the day's record: what happened written to Odoo, the owner's input applied, a dated next step on every deal touched |
| **Weekly review and plan** | Sat or Sun ~10:00 | the week reviewed, measures, advance-or-close cards, the constraint; next week's outcomes, focus deals and capacity |
| **Working session** | on request | the objective the owner states |
| **Intake session** | on request, from a source (event, list, mails) | every planned record exists once, linked, profiled, placed; audited |

Every run writes or continues one run note in `run_note_folder` and writes nowhere else in the
vault. The daily note is
one file a day: open day writes the plan (*Today's plan*, the ranked *Attention list*), close day
completes the record (*Done by the agent*). Nothing that needs attention is left out; the ranks and
the week's capacity keep it manageable. Daily runs use [`assets/templates/grooming-session.md`](assets/templates/grooming-session.md); the weekly
review uses [`weekly-review.md`](assets/templates/weekly-review.md); intake sessions use
[`intake-session.md`](assets/templates/intake-session.md).

### Independent reviewers

At the end of each iteration, start fresh agents with the prompts in `assets/prompts/`, each given
only the inputs its prompt lists, never your reasoning.
- [goal-verifier](assets/prompts/goal-verifier.md): every run, and each client-facing draft or proposal.
- [recipient-reader](assets/prompts/recipient-reader.md): client-facing drafts.
- [guardrail-auditor](assets/prompts/guardrail-auditor.md): every run, **last**. It checks the systems themselves and writes HALT on a violation.

Their findings go into *Verification* as written and drive the decision; without a reviewer the
iteration is **unverified** (goal-loop).

### Priorities inside a run

Each priority has a rank, which places its items in the note's *Attention list*:
1. **P1** Meetings today and tomorrow: meeting plans.
2. **P1** Replies and inbound interest waiting for the owner: drafts. (Also P1: deadlines within 3 working days, cards past their `BY`.)
3. **P2** Tender and call deadlines within 14 days.
4. **P2** The attention filters of the run's cadence, in the order of `sales-pipeline-custody`: overdue and missing next actions first, then ★★★ rotting, then the rest.
5. **P2** Late-stage deals (proposal, offer, agreement) rotting or without a next step.
6. **P3** Other rotting deals: a next step, or advance-or-close past twice the threshold.
7. **P3** Grooming: unscored records (score and stars), empty fields, stale dossiers, oldest first.

Within a rank, more stars go first, then the older item. Each rank's count is compared with the
previous working day's note (`(new)` when there is none), so a growing backlog shows.

### Common mistakes

| Mistake | Why it fails | Do instead |
|---|---|---|
| Decisions placed under the log | the owner reads the first screen only | *Decisions needed* first, the log last |
| An ask given as a record id | the owner must open Odoo to answer | a decision card answerable as written |
| Pre-filling or summarising *Verification* | the run grades itself | paste the reviewers' output as written |
| Editing a skill after a wrong result | skills change only through skillery | a card whose yes is filing a skillery issue |

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

Answers `VAL, VER, CLR, RSK` in `test-strategy`'s matrix (`references/generic-writing.md`).
