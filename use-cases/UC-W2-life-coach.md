---
id: UC-W2
title: Life coach and personal growth
primary_actor: the owner
trigger: the owner brings ideas or objectives to organise
success_guarantee: each idea or objective is organised into a plan the owner agrees with, with the next concrete step named
area: personal
served_by:
  agents: []
  skills: []
status: missing
change: add-personal-assistants
---

# UC-W2 Life coach and personal growth

## Brief Description

Life coach and personal-growth assistant: "I will provide many ideas and objectives, and will need him to help me organise and realise them … quite an important one."

## Stakeholders and Interests

- **The owner:** ideas and objectives turned into plans they believe in, and help to see them through.
- **The people the owner's objectives involve:** their privacy; nothing about them leaves the vault.

## Preconditions

The owner has a vault (`vault-setup`). A runtime for the coach exists, interactive at least.

## Minimal Guarantees

The coach never invents an objective or a deadline; a plan the owner did not agree is not written.
Personal notes stay in `07 Perso/` with `private: true` and never reach the company memory.

## Main Success Scenario

1. The owner brings ideas and objectives, in any order and at any stage.
2. The coach asks questions to understand each one before proposing anything.
3. The coach reflects back what it heard, grouped, and asks which matter now.
4. **[human]** The owner chooses what to pursue, what to park and what to drop.
5. The coach drafts a plan for each chosen objective: the outcome, the first steps and the next
   concrete step.
6. **[human]** The owner agrees or amends each plan.
7. The coach records each agreed objective at the horizon the owner names (`vault-planning`) and each
   parked idea in `02 Ideas/`.
8. At a later session, the coach reviews progress against the plan and asks what blocks the next step.

## Extensions

- 1a. Too many ideas for one session: the coach asks the owner to rank them and parks the rest in
  `02 Ideas/`.
- 5a. An objective needs a body of work: the coach hands it to `vault-project new` and its charter gate
  (UC-W1).
- 6a. The owner rejects a plan: the coach asks what is wrong and redrafts; it never argues for it.
- 8a. An objective has stalled across several reviews: the coach asks whether to keep, change or drop
  it, and records the answer.

## Out of Scope

Planning mechanics at each horizon (UC-W4), scheduling and the calendar (UC-W3), the owner's business
strategy (UC-W14), and any therapeutic or medical advice.

## Artefacts

- Agreed objectives in `05 To Do/Objectives YYYY.md`, read by the owner and by the planning loop
  (exists through `vault-planning`).
- Parked ideas in `02 Ideas/` (folder exists in `vault-conventions`).
- Planned: coaching session notes, location to decide (`add-personal-assistants`).

## Evidence

Planned: `tests/features/agents/life-coach.feature` and an outcome suite (`add-personal-assistants`,
`evaluate-catalogue`).

## Feedback Loop

A session the owner found unhelpful, or a question the coach should have asked, becomes a Defect issue
and ends as a change to the coach's question set. Inside the vault, friction becomes a
`kind: skill-change` note in `00 Inbox/proposed/`.

## Slices

1. Recording an agreed objective in the plans: available today through `vault-planning` (UC-W4), not
   yet joined to a coach.
2. The coach that organises ideas into plans: planned (`add-personal-assistants`).
3. Follow-through between sessions: planned (`add-personal-assistants`).

## Open Points

**Confidence:** low. Only the owner's one sentence exists; the steps are a first guess at a partner
that thinks with the owner and hands agreed objectives to the planning loop.

- What does "realise them" mean: check-ins on a schedule, or only when the owner asks?
- Which areas of life are in (health, relationships, money, learning), and which must the coach decline?
- Is there a method or author the coach should follow?
