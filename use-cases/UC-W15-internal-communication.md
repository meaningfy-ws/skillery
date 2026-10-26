---
id: UC-W15
title: Internal communication
primary_actor: the owner
trigger: 'a briefing or team message is due: monthly, weekly or daily'
success_guarantee: the message is sent, grounded in the employee handbook, current projects and achievements
area: business
served_by:
  agents: []
  skills: []
status: missing
change: add-business-partners
---

# UC-W15 Internal communication

## Brief Description

Internal communication, a people's person: monthly executive briefings; weekly or daily messages based on the employee handbook, current projects, victories and achievements (much is in Odoo).

## Stakeholders and Interests

- **The owner:** a team that knows where the company stands and feels its work is seen.
- **Employees:** short, accurate messages that credit the right people.
- **The company:** nothing confidential leaves the people who may see it.

## Preconditions

The employee handbook is reachable. Read access to Odoo, where current projects and achievements are
recorded. The audience and channel for each cadence are known.

## Minimal Guarantees

Nothing is sent without the owner's yes. Every claim in a draft names its source. Salary, health and
other personal data are never used.

## Main Success Scenario

1. A briefing or message comes due: monthly, weekly or daily.
2. The agent gathers the sources: current projects and achievements from Odoo, and the employee
   handbook where it applies.
3. The agent selects what matters for the audience and the period.
4. The agent drafts the message: governing thought first (`executive-communication`), in the company
   voice (`meaningfy-voice`).
5. The agent returns the draft with the source of each claim.
6. **[human]** The owner edits and approves it.
7. **[human]** The owner sends it, or approves sending it to the named channel.

## Extensions

- 2a. Odoo cannot be reached: the agent drafts from what it has and names the gap.
- 3a. Nothing new in the period: the agent says so; the owner decides whether to send anything.
- 4a. The message names a person (praise, a new role): the agent flags each name for the owner's check.
- 6a. The owner rejects the draft: the reason is kept as feedback for the next draft.

## Out of Scope

External content for LinkedIn and blogs (UC-W24), client status reports (UC-W23), writing the employee
handbook, and personal messages to one employee.

## Artefacts

- Planned: the briefing and message drafts, and the channel they are sent through
  (`add-business-partners`).
- Planned: the internal-message channel profile, today a placeholder at
  `skills/meaningfy-voice/references/channels/internal-message.md` (`add-content-creation`).

## Evidence

- `tests/trigger_probes.yaml`: the `executive-communication` probes.
- Planned: `tests/features/agents/internal-comms.feature` (`add-business-partners`).

## Feedback Loop

The owner's edits to each draft are the signal: a repeated edit becomes a Defect issue and ends as a
rule in the internal-message profile or the agent's procedure.

## Slices

1. Structure and voice for a message the owner writes: released (`executive-communication` in
   `meaningfy-consulting`, `meaningfy-voice` in `meaningfy-core`).
2. The internal-message voice profile: planned (`add-content-creation`).
3. Gathering from Odoo and the handbook, and scheduled drafts: planned (`add-business-partners`).

## Open Points

**Confidence:** low. The brief names the cadences and the sources; the audiences, channels and Odoo
models are not known.

- Which audience and channel for each cadence (email, chat, Odoo), and who receives the monthly
  executive briefing?
- Where does the employee handbook live, and which Odoo models hold projects and achievements?
- May the agent send on a schedule after the first approval, or always wait for the owner?
