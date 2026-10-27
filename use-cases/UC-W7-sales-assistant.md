---
id: UC-W7
title: Sales assistant
primary_actor: a Meaningfy salesperson
trigger: an account needs attention, or the CRM needs grooming
success_guarantee: the CRM is groomed, each account's history is current, and every outgoing email is customised in the predefined style
area: sales
served_by:
  agents: [sales-agent]
  skills: [sales-operations, sales-pipeline-custody, sales-accounts, sales-qualification, sales-conversations]
status: covered
change: add-sales-bundle
---

# UC-W7 Sales assistant

## Brief Description

Sales assistant: groom the CRM, keep accounts, write customised emails in a predefined style; "keeping track of what to tell whom". Served by the `sales-agent` and the five sales skills of `meaningfy-sales`.

## Stakeholders and Interests

- **The salesperson:** a clean pipeline each morning and drafts ready to send.
- **The second sender:** sight of every outgoing email, by being in cc.
- **The prospect or client:** emails that fit their history, and no duplicate or stale chasing.
- **The owner:** an Odoo CRM that can be trusted as the company's memory of deals, and no
  irreversible action taken by an agent.

## Preconditions

The agent can read and write the Odoo CRM, read the vault and the company memory, and draft in the
salesperson's mail. The owner's `sales-config.yaml` names the run-note folder and the people in
cc; the day's run note exists there, or the agent creates it.

## Minimal Guarantees

No email is sent and no record is deleted or bulk-imported by the agent. Every write is one record at
a time, after a search for an existing record. What the agent could not do is listed in the session
report.

## Main Success Scenario

1. The scheduler starts the daily grooming session, or the salesperson opens it interactively.
2. The agent re-reads the day's grooming-session note for the salesperson's steering.
3. The agent works each pipeline through its Odoo filters: deals without a next activity, stale
   leads, leads with a two-way signal.
4. For each record the agent plans the change, searches before it creates, writes one record and
   audits the write.
5. The agent drafts the follow-up emails in the predefined style: the booking link, a proposed slot
   or a re-contact date, and the other sender in cc.
6. The agent writes the run note: the decisions it needs first, as decision cards, then what to
   watch, then what it changed.
7. **[human]** The salesperson reviews the drafts and the proposed conversions, and sends or rejects
   each email.
8. The agent records each outcome as an activity in Odoo, so every open deal has a next activity.

## Extensions

- 2a. No note exists for the day: the agent works from the standing rules and says so in the report.
- 3a. A lead shows a two-way signal (a meeting or a positive reply): the agent proposes converting it
  to an opportunity; the salesperson confirms at 7.
- 3b. A deal met an explicit refusal, or no interest after chasing: the agent proposes marking it
  lost, with the reason; it never deletes.
- 4a. The agent is asked to import many records at once: it refuses the bulk import and returns the
  records for review one at a time.
- 4b. The search finds a possible duplicate: the agent creates nothing and lists the candidates in
  the report.
- 4c. A change is risky or irreversible (a delete, a merge, a mass update): the agent does not make
  it and lists it for the salesperson.
- 5a. The account's history is too thin to customise the email: the agent scouts public information
  on the company and the person, records the sources, and asks if it is still thin.

## Out of Scope

Deciding whether a new lead or partnership deserves attention (UC-W9), qualifying a prospect in a
conversation (UC-W10), writing proposals (UC-W8), producing sales materials such as brochures and
case studies (a separate project), and server deployment of the agent (a named follow-up).

## Artefacts

- Odoo records: leads, opportunities, contacts, activities, and the stars that mirror the five-P
  band; read by the sales team and by the agent on its next run.
- The daily run note in the owner's run-note folder; written by the salesperson and the agent,
  re-read by the agent.
- Email drafts in the salesperson's mail, in the predefined style.
- The `sales-agent` agent and the skills `sales-operations`, `sales-pipeline-custody`,
  `sales-accounts`, `sales-qualification`, `sales-conversations` in `meaningfy-sales`.

## Evidence

- `tests/features/agents/sales-agent.feature`: the agent's behaviour scenarios, run by hand per CLI.
- `tests/test_sales_write_policy.py` and `tests/test_sales_assets.py`: the write policy and the
  run-note shape, checked in `make validate`.
- After a session, the Odoo filter for open deals without a next activity returns nothing (checked
  on the artefact).

## Feedback Loop

The salesperson writes a correction into the session note; the agent re-reads it the next day. A
correction that repeats becomes a Defect issue and ends as a rule in the owning sales skill or a row
in the Gherkin Examples table.

## Slices

1. Daily grooming from Claude Desktop with the scheduler: covered (`sales-operations` called by the
   scheduled tasks; see `docs/environment/sales-agent.md`).
2. The interactive mode (account review and email drafting on request): covered (`sales-agent` in a
   human session).
3. Server deployment (OpenClaw): planned as a named follow-up of `add-sales-bundle`, no change yet.

## Open Points

**Confidence:** high for slices 1 and 2: the skills are the pilot's, groomed in `add-sales-bundle`.

Answered by `add-sales-bundle`:
- One agent with modes (DEC-1): run types are modes of one job, not separate agents.
- Safety (DEC-4): the write rules and policy of `sales-pipeline-custody` are the concrete instance of
  `guardrails`; the agent's contract names its refusals and denies the send and delete tools.
- The email style (D-12): tone is the `outreach-email` channel of `meaningfy-voice`; the patterns and
  cadence are `sales-conversations`.
