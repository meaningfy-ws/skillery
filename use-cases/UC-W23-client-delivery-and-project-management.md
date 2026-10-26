---
id: UC-W23
title: Client delivery and project management
primary_actor: a Meaningfy project lead
trigger: a client project is running and a delivery, status report or plan change is due
success_guarantee: the client receives the delivery and an accurate status, and the project plan reflects it
area: consulting
served_by:
  agents: []
  skills: []
status: missing
change: add-delivery-management
---

# UC-W23 Client delivery and project management

## Brief Description

Client delivery and communication, including project management: planning the work, reporting status, handing over deliveries and keeping the client informed. Nothing in the catalogue serves it yet.

## Stakeholders and Interests

- **The project lead:** an accurate plan and no surprises.
- **The client:** the delivery, an honest status and early warning of a slip.
- **The delivery team (Solution Builder):** a clear plan to work to.
- **The Solution Shipper:** what was promised, to check the delivery against.
- **The owner:** margin and commitments kept, no silent overrun.
- **Sales/Presales:** told when a contract closes, to carry the relationship on.

## Preconditions

A signed contract or execution brief states the scope. A project plan exists, and the agent can read
where the work is tracked.

## Minimal Guarantees

Nothing is sent to the client without the project lead. A status never hides a slip. A change that
touches scope, date or price goes to the owner and is never absorbed silently.

## Main Success Scenario

1. The project lead asks for the status report, the delivery hand-over or the plan update that is
   due.
2. The agent gathers the state of the work: done, open, at risk.
3. The agent compares progress with the plan and the contract scope, and names the slips and their
   causes.
4. The agent proposes plan changes and the options for any slip.
5. **[human]** The project lead decides the plan changes; those that touch scope, date or price go
   to the owner.
6. The agent updates the plan and drafts the status report or the delivery note for the client.
7. **[human]** The project lead reviews and sends it.

## Extensions

- 1a. A delivery is due: before 6 the agent assembles the hand-over and lists how it conforms to the
  request for offer, the offer, the contract and the meeting minutes, for the Solution Shipper's
  check.
- 2a. Part of the state cannot be read: the report names what is unknown rather than guessing.
- 4a. The client asks for a change: the agent routes it to a priced change (UC-W8) before the plan
  changes.
- 7a. The contract closes: the agent drafts the note that informs Sales/Presales.

## Out of Scope

Building the solution (UC-W18), release and deployment mechanics (`meaningfy-release`,
`ci-cd-delivery`), advisory work (UC-W22), the contract itself (UC-W16) and pricing a change (UC-W8).

## Artefacts

- Planned: the status report, read by the client and the owner; its form is open.
- Planned: the project plan; where it is kept is open.
- Planned: the delivery note and the conformance list, read by the client and the Solution Shipper.
- Planned: the delivery lead agent and its skills (`add-delivery-management`).

## Evidence

- Planned: Gherkin scenarios and an outcome suite (`add-delivery-management`).
- Each claim in a status report traces to a tracked item (checked on the artefact).

## Feedback Loop

A client surprised by a slip, or a report the project lead had to correct, becomes a Defect issue; it
ends as a change to the reporting method. Reports that worked are kept as examples.

## Slices

1. Status report from the tracked work: planned (`add-delivery-management`).
2. Plan maintenance: planned (`add-delivery-management`).
3. Delivery hand-over with the conformance list: planned (`add-delivery-management`).

## Open Points

**Confidence:** low. The roles and the conformance check exist in `docs/practice/`; the steps, the
artefacts and the slices are a first guess, and the bundle is still to decide.

- Where are the plan and the work tracked: Odoo, Jira and Confluence, GitHub, or the project's
  OpenSpec tasks?
- What is the cadence and form of a status report, and is there an example to start from?
- Which bundle owns delivery management?
