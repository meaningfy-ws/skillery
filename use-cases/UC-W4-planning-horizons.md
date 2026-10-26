---
id: UC-W4
title: Planning across horizons
primary_actor: the owner
trigger: 'a planning moment comes due: the day, week, month, quarter or a life review'
success_guarantee: a plan for that horizon exists that follows the longer horizon's direction and reports back up to it
area: personal
served_by:
  agents: []
  skills:
  - vault-planning
  - vault-daily
status: partial
change: add-personal-assistants
---

# UC-W4 Planning across horizons

## Brief Description

Planning across horizons: daily grooming, weekly, monthly, quarterly, a life planner "including how I want to die". Day and week exist today. `vault-planning` now plans and reviews the year, quarter, month and week; the life horizon is not built.

## Stakeholders and Interests

- **The owner:** each day and week serving what the longer horizons set, and an honest look back.
- **Colleagues on shared work:** commitments that match the owner's capacity.

## Preconditions

The vault exists (`vault-setup`). For the day, the mail and calendar connectors are in the owner
profile.

## Minimal Guarantees

Every objective, key result and outcome is the owner's; none is invented. The change log is
append-only; a previous period's items are marked done, dropped or carried over, never deleted.

## Main Success Scenario

1. A planning moment comes due and the owner asks to plan a horizon.
2. The planner loads the plans file, the horizon above and the latest review of the same horizon
   (`vault-planning`).
3. The planner puts the review's next focus and carried-over items to the owner first.
4. The planner offers candidates from the vault (active work, open tasks) as questions.
5. **[human]** The owner states the objectives, key results or outcomes for the horizon.
6. The planner writes the new period's section, marks the previous items and appends one change-log
   line per change.
7. The planner reports the plan in five lines or fewer.
8. Each morning, `vault-daily` copies this week's objectives into the day's note.

## Extensions

- 1a. The horizon is the life plan: not built; the use case ends with that said (planned).
- 2a. The plans file is missing: the planner offers to create it and asks for the year's objectives,
  or plans the shorter horizon if the owner prefers.
- 3a. The finished period has no review: the planner offers one first (`review <horizon>`);
  **[human]** the owner confirms wins, misses, carry-over and next focus; if the owner declines,
  planning continues without it.
- 3b. A weekly review: the planner lists inbox items, active work without a session and old to-dos;
  **[human]** the owner decides each one.
- 5a. An item serves no longer-horizon objective: it is marked "unplanned".
- 5b. The owner wants no plan for this horizon: none is written.
- 6a. The owner raises friction with the method: it becomes a `kind: skill-change` note.

## Out of Scope

Turning raw ideas into objectives (UC-W2), scheduling meetings and writing to the calendar (UC-W3),
filing work sessions (UC-W1), and creating work folders (`vault-project`).

## Artefacts

- `05 To Do/Objectives YYYY.md` (`kind: objectives`) with its change log; read by the owner and by
  `vault-daily`.
- `04 Daily/reviews/<period>.md` (`kind: review`); read by the next planning session.
- `04 Daily/YYYY-MM-DD.md`, the private morning note; read by the owner.
- Planned: the life plan, form and place to decide (`add-personal-assistants`).

## Evidence

- `tests/trigger_probes.yaml`: the `vault-planning` and `vault-daily` probes.
- Planned: `tests/features/agents/planner.feature` (`add-personal-assistants`) and an outcome suite
  under `tests/evals/vault-assistant/` (`evaluate-catalogue`).

## Feedback Loop

The review session is the loop: misses and their reasons feed the next plan. Friction with the method
becomes a `kind: skill-change` note in `00 Inbox/proposed/`, and a person opens the skillery pull
request against `vault-planning` or `vault-daily`.

## Slices

1. Year, quarter, month and week planning and review: released (`vault-planning` in
   `vault-assistant`).
2. The day: released (`vault-daily` in `vault-assistant`).
3. The life planner: planned (`add-personal-assistants`).
4. A `planner` agent that prompts each planning moment when it comes due: planned
   (`add-personal-assistants`).

## Open Points

**Confidence:** high for slices 1 and 2, which restate the released skills; low for the life planner
and the agent.

- What shape has the life horizon ("including how I want to die"), and how often is it reviewed?
- Does the life plan stay private in `07 Perso/`, or sit with the year plans?
- Should a scheduled run open each planning moment (for example the weekly review), or only the owner?
