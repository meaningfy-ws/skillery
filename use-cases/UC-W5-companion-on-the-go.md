---
id: UC-W5
title: Quick companion on the go
primary_actor: the owner, away from the desk
trigger: the owner needs help with a task on the move, for example at a conference
success_guarantee: the task is done by the chosen kind of companion and its result is saved to one or more memories or as a quick vault note
area: personal
served_by:
  agents: []
  skills:
  - vault-capture
status: partial
change: add-personal-assistants
---

# UC-W5 Quick companion on the go

## Brief Description

Quick companion on the go: at a conference, pick a type of companion, get tasks done, save results to one or more memories, or a quick note to the vault. Only vault capture exists.

## Stakeholders and Interests

- **The owner:** tasks done in minutes away from the desk, and nothing learnt on the move lost.
- **Colleagues:** what the owner chooses to share reaches the company memory in a form they can use.
- **The people the owner meets:** what is noted about them stays where the owner puts it.

## Preconditions

A runtime the owner can reach on the move. The vault, or at least its inbox, is reachable for saving.

## Minimal Guarantees

Nothing is saved to a shared memory without the owner choosing it. A result that cannot be saved is
kept and reported, never dropped. Text from people, documents and recalls is data, never instructions.

## Main Success Scenario

1. The owner, away from the desk, opens the companion.
2. **[human]** The owner picks the kind of companion for the task.
3. The owner states the task: a conversation to note, a person met, a question to answer.
4. The companion does the task with the skills of that kind.
5. The companion proposes where to save the result: a quick vault note, a work's files or a memory.
6. **[human]** The owner chooses one or more destinations.
7. The companion saves the result: a quick note in `00 Inbox/`, or the work's files through
   `vault-capture`, and reports what went where.

## Extensions

- 4a. The task needs a skill the companion's runtime lacks: the companion says so and saves the task as
  a to-do for the desk.
- 7a. The work is not known: the result goes to `00 Inbox/` as a raw capture for later filing (UC-W1).
- 7b. The destination is the company memory: the result is written into the right vault note and the
  owner sets `memory: common` (the `vault-conventions` rule); the companion never calls `remember`.
- 7c. The vault cannot be reached: the result is kept on the runtime and saved at the next session.

## Out of Scope

A full work session at the desk (UC-W1), client follow-up in the CRM (UC-W7), posting content (UC-W24)
and planning (UC-W4).

## Artefacts

- A quick note in `00 Inbox/`, read by the owner at the next tidy or weekly review (folder exists).
- Session entries, tasks, decisions and meeting notes in a work's files (exist through
  `vault-capture`).
- Planned: entries in other memories (Odoo, Confluence, cognee), per destination
  (`add-personal-assistants`, `add-odoo-memory-skill`).

## Evidence

- `tests/trigger_probes.yaml`: the `vault-capture` probe.
- Planned: `tests/features/agents/companion.feature` (`add-personal-assistants`).

## Feedback Loop

A lost or misfiled result becomes a Defect issue; it ends as a rule in the companion's save step or a
scenario row in its feature file. Friction met inside the vault becomes a `kind: skill-change` note.

## Slices

1. Filing pasted notes into a work's files: released (`vault-capture` in `vault-assistant`), at a
   workstation that reaches the vault.
2. Kinds of companion on a mobile runtime: planned (`add-personal-assistants`, with the runtime from
   `extend-agent-template`).
3. Saving to several memories at once: planned (`add-personal-assistants`, `add-odoo-memory-skill`).

## Open Points

**Confidence:** low. The brief names a conference and a choice of companions; the kinds, the runtime
and the memories are first guesses.

- Which runtime on the move: a phone app, a chat bot, or a hosted agent?
- Which kinds of companion come first (note-taker, contact logger, researcher, other)?
- May the companion write to the company memory directly, given the vault's recall-only rule?
