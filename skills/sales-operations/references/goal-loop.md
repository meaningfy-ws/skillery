# The goal loop

The loop for agentic work (intent → plan → tools → reflect), made explicit. Five steps repeat **until the objective is achieved**. There is no separate "correct" step: correcting is what the decision chooses when the objective is not yet met.

```
1. OBJECTIVE ─► 2. PLAN ─► 3. ACT ─► 4. VERIFY ─► 5. DECIDE ─┬─ achieved ─────────────────► halt, record
   (fixed;                                                    ├─ not yet, can continue ────► corrections → 2
    only clearer)                                             └─ not yet, cannot continue ─► pause, record open items;
                                                                                              the next run resumes
```

## Terms and numbers

This section is the only place the numbers are stated; other files point here.

- **Budget**: 15 deals in depth per run, and at most 3 loop iterations per run.
- **Deal in depth**: a deal the run works on beyond the scan, through research, a dossier, a meeting plan, a draft, or a proposal that needs evidence. The scan itself covers every open deal and does not count: rot, next activity, exit criteria, deadlines.
- **Fallback**: at most one fallback offer next to the lead offer.
- **Dormancy period**: 90 days.
  - A field unchanged for that long is dormant: Odoo shows no `mail.tracking.value` for it in the period. Untracked fields count as filled by the owner.
  - A partnership with no joint deal for 90 days after its agreement gets an activation proposal.
- **Sweep period**: 28 days. Every open record is read in full (record, chatter, dossier, mail threads) at least once per sweep period; the record's chatter holds an internal note `Swept YYYY-MM-DD …`, whose date is the swept date (run-types, *Weekly review*, step 4).
- **Rot clock**: the days since the deal's last stage change (`date_last_stage_update`), compared with the stage's *Days to rot*.
- **Agent's own writes**: every write listed in a run note's *Log* (the write rules of `sales-pipeline-custody`, section 2).

## 1. Objective

The objective is what must be true at the end, with **acceptance criteria a third person could check**.

**Run level (a day).** For example:
- every deal with an external meeting today or tomorrow has a meeting plan;
- every reply waiting for the owner has a draft;
- every deal past twice its rot threshold has an advance-or-close proposal;
- every open lead and opportunity has an open, dated activity, and none is overdue (`sales-pipeline-custody`, *Next actions*);
- every attention filter of the run's cadence is worked and its count reported (`sales-pipeline-custody`, `assets/odoo-views.yaml`);
- every Calls & Tenders deadline within 14 days is listed with its status.

**Work-item level.** Either the intent card ("meet John Doe, Head of Data at X, to agree a discovery workshop, before 20 Oct"), or the item's criteria from the owning skill.

**The objective never changes during the loop.** It may only become clearer, in one of two ways:
- **The owner's input**, in the run note or in a chat.
- **A recorded clarification by the agent**, when verification shows an ambiguity. For example: "'has a meeting plan' read as: written as an internal note on the deal". The clarification is dated and marked "agent", and the owner can overrule it.

A clarification may not lower the bar, drop a criterion or swap the target. If the objective turns out to be wrong, the loop pauses and asks the owner.

## 2. Plan

Write *Plan v1* in the iteration block: the steps, their order (the priorities in `SKILL.md`), the budget above, and what to skip if the budget runs out.

## 3. Act

Work the plan through `sales-pipeline-custody`, `sales-accounts`, `sales-qualification` and `sales-conversations`, within the write rules (the write rules of `sales-pipeline-custody`).
- Do the *do* writes and log each one.
- Write each *ask* item as a decision card (owned by `executive-communication`) under *Decisions needed*, with an `Answer:` line under it for the owner.

When a choice is the owner's:
- in a working session, ask them directly;
- in a scheduled run, write a decision card in the note and continue with what does not depend on it.

## 4. Verify

Independent reviewers check the outputs against the acceptance criteria and the guardrails. They are fresh agents run with the prompts in `assets/prompts/`.
- **Verdicts.** Criterion by criterion: **met**; **partly met**, with what is missing; or **not met**, with why.
- **Input.** Each reviewer receives the objective, the criteria, the outputs, the sources and the *Log*, never the worker's reasoning.
- **Where findings go.** Into the iteration's *Verification*, pasted as the reviewers wrote them. **Never pre-fill or summarise *Verification* yourself.**
- **The auditor runs last**, after every write of the iteration. It checks the systems themselves, not only the log.
- **No reviewer available.** The iteration is **unverified**:
  - write "unverified" in *Verification*;
  - add one decision card "Check this unverified run?" listing the iteration's writes by record (in words, with ids), the risky ones first.

## 5. Decide

Write exactly one outcome per iteration in *Decision*, with its reason.

**Achieved.** Every criterion is met: halt.

**Not yet, can continue.** Run again with corrections:
1. Clarify the objective if needed (rules above).
2. Write *Plan v2* as a **delta** ("keep 1–4 done; redo 5 with the missing sources; add 7").
3. Act only on what is missing.
4. Verify again.

**Not yet, cannot continue now.** The budget is spent, the run is waiting on the owner, or there is a HALT:
- pause;
- list exactly what is open;
- the next run resumes the same loop from there, not from scratch.

## Two levels

The run is one loop. Each work item inside it is its own small loop.

The close-day run **continues** the open-day loop of the same day, with the owner's input as feedback. The weekly review checks the week's loops and proposes improvements to these instructions.
