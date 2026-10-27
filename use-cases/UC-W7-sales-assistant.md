---
id: UC-W7
title: Sales assistant
primary_actor: a Meaningfy salesperson
trigger: an account needs attention, or the CRM needs grooming
success_guarantee: the CRM is groomed, each account's history is current, and every outgoing email is customised in the predefined style
area: sales
served_by:
  agents: []
  skills: [sales-operations, sales-pipeline-custody, sales-accounts, sales-qualification, sales-conversations]
status: partial
change: add-sales-bundle
---

# UC-W7 Sales assistant

## Brief Description

Sales assistant: groom the CRM, keep accounts, write customised emails in a predefined style; "keeping track of what to tell whom". Skills are defined outside the repo; the change is drafted.

## Stakeholders and Interests

- **The salesperson:** a clean pipeline each morning and drafts ready to send.
- **The second sender (Eugen or Thomas):** sight of every outgoing email, by being in cc.
- **The prospect or client:** emails that fit their history, and no duplicate or stale chasing.
- **The owner:** an Odoo CRM that can be trusted as the company's memory of deals, and no
  irreversible action taken by an agent.

## Preconditions

The agent can read and write the Odoo CRM, read the vault and the company memory, and draft in the
salesperson's mail. The day's grooming-session note exists in the vault at
`04 Daily/crm-grooming-session/`, or the agent works from the standing rules.

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
6. The agent writes the session report into the note: what changed, what it proposes, what needs a
   decision.
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
- The daily grooming-session note in the vault at `04 Daily/crm-grooming-session/`; written by the
  salesperson and the agent, re-read by the agent.
- Email drafts in the salesperson's mail, in the predefined style.
- Planned: the sales skills and the `sales-assistant` agent in `meaningfy-sales` (`add-sales-bundle`).

## Evidence

- `openspec/changes/add-sales-bundle/specs/sales-pipeline-custodianship/spec.md`: the bulk-import
  refusal and search-before-create scenarios (a drafted spec, not yet a test).
- Planned: the package's Gherkin moved to `tests/features/sales/`, Scenario Outlines with Examples
  tables (`add-sales-bundle`, DEC-4).
- After a session, the Odoo filter for open deals without a next activity returns nothing (checked
  on the artefact).

## Feedback Loop

The salesperson writes a correction into the session note; the agent re-reads it the next day. A
correction that repeats becomes a Defect issue and ends as a rule in the owning sales skill or a row
in the Gherkin Examples table.

## Slices

1. Daily grooming from Claude Desktop with the scheduler: planned (`add-sales-bundle`); it runs today
   outside the catalogue.
2. The interactive mode (account review and email drafting on request): planned
   (`add-sales-bundle`).
3. Server deployment (OpenClaw): planned as a named follow-up of `add-sales-bundle`, no change yet.

## Open Points

**Confidence:** medium. The method and the safety rules restate the owner's decisions
(`add-sales-bundle` DEC-1 to DEC-6); the steps are extrapolated from the pilot, and the package is
not yet in the change's `inputs/`.

- One agent with modes, or custodian, researcher, groomer and drafter as separate agents under a
  lead?
- Which safety rules are enforced by `guardrails`, and which stay dispatch-contract lines?
- Where does the predefined email style live: in the sales package, or as a channel profile in
  `meaningfy-voice` (UC-W24)?
