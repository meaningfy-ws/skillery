---
kind: memo
date: YYYY-MM-DD
audience: self
last_run: YYYY-MM-DD HH:MM
---
# YYYY-MM-DD grooming session

<!-- Only when halted, as the first line: HALT: <rule broken> on <record in words (#id)>; check <what>; write "Owner: resume" to clear. -->

## Decisions needed

Decision cards (`executive-communication`, decision request), soonest deadline first, each followed
by `Answer:` for the owner. "None." when there are none.

## Today's plan

The owner's actions for today, at most the week's capacity, highest rank first; one line each:
deal in words (#id) · talk to / answer / chase · whom · why now · where the plan or draft is.
Open day writes it; close day marks each line `done`, `carried` (with the reason) or `dropped`.

## Attention list

Every open item that needs attention, in words, one line each (record (#id) · what · since when).
Each rank is headed by its count and the change since the previous working day.

### This week

The week's focus deals and new P1 items, in full.

- **P1 · today: <n> (<±n>)**: meetings today and tomorrow, replies waiting, deadlines within 3 working days, cards past their `BY`.
- **P2 · this week: <n> (<±n>)**: overdue or missing next actions, ★★★ rotting, late-stage deals without a next step, deadlines within 14 days.
- **P3 · grooming: <n> (<±n>)**: the agent's own work, listed for the record.

<details><summary>Later: P1 <n> · P2 <n> · P3 <n></summary>

Items outside the week's focus, ranked the same way.

</details>

## Done by the agent

One line per record: record in words (#id) · what changed, before → after · why.

## Owner's notes

(The owner writes here, after an `Answer:`, or on lines starting `Owner:`. The agent never writes in this section.)

## Log (for the verifier; fold it)

Runs: open day HH:MM · close day HH:MM · since: <time of the previous run>

### Objective

- [ ] Every deal with an external meeting today or tomorrow has a meeting plan.
- [ ] Every reply waiting for the owner has a draft.
- [ ] Every Calls & Tenders deadline within 14 days is listed with its status.
- [ ] Every deal past twice its rot threshold has an advance-or-close card.
- [ ] Every open lead and opportunity has an open, dated activity, and none is overdue.
- [ ] Every attention filter of today's runs is worked, with its count below.
- [ ] <anything the owner asked for>

Clarifications (dated, by whom):

### Filter counts

| Filter | Pipeline | Open day | Close day |
|---|---|---|---|

### Applied

The owner's input carried out: input (note, line) → what was done → record (#id). The same mark goes next to the input: `(applied YYYY-MM-DD HH:MM, #id)`.

### Iteration 1

Plan v1: steps in priority order; budget (goal-loop).

Writes: one line per write: system · model or tool · record (#id) · field · old → new · source. One line per resolution that created or disambiguated: keys · candidates (#id) · decision.

Verification: (goal verifier, recipient reader and guardrail auditor outputs, pasted as written; or "unverified")

Decision: achieved | not yet, continue (Plan v2 delta) | not yet, pause (what is open, why)

### Carried forward

From the previous working day's note, after the re-check in Odoo and mail: carried (still open) ·
resolved since (what closed it, with its source).

### Open for tomorrow

What the next run must pick up.
