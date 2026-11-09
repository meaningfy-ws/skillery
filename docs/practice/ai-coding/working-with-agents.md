# Working with agents

**Audience:** developers who build a Meaningfy system with a team of AI agents.

**Purpose:** what a working day looks like when agents deliver an EPIC: the sessions, the team, the
loop of a stage, and what you decide and when. This page narrates. Every rule it mentions lives in
the [`epic-delivery`](../../../skills/epic-delivery/SKILL.md) skill; read the skill for the rule,
read this page for the picture.

---

## The short version

You are the product manager and the owner. You set the direction, answer questions, sign off the
scenarios and accept the EPIC. One agent, the **lead**, runs the work for you. It is the only agent
that talks to you. It briefs other agents for one job each, checks what they bring back, and
commits. Agents check that the work is built right. You check that it is the right thing.

## Sessions

Work runs in sessions, not sprints
([`epic-delivery` → Sessions](../../../skills/epic-delivery/SKILL.md#sessions)).

- A **shaping session** turns a need into EPICs. You talk with the architect and the planner;
  the session ends with one change per EPIC. The method for this half is
  [`epic-planning`](../../../skills/epic-planning/SKILL.md) and
  [`architecture`](../../../skills/architecture/SKILL.md).
- An **epic session** finishes and gates the PLAN of one EPIC, then delivers it stage by stage.
  Each stage ends in one PR.
- A **validation review** closes an iteration: did each EPIC deliver its value, did each decision
  hold?

## The team

Two people and a handful of agents
([`epic-delivery` → The team](../../../skills/epic-delivery/SKILL.md#the-team);
the briefs are in [`team-and-briefs.md`](../../../skills/epic-delivery/references/team-and-briefs.md)).

- **You, the developer**, decide.
- **A domain expert** joins when the model changes, to say whether it means what the domain means.
- **The lead** is your main session. It walks you through each decision with options and a
  recommendation, records your answers, plans the stages and keeps the spine and the docs current.
- **The members** each do one job: an architect and a planner while shaping; a builder, a reviewer
  and a checker while delivering. Larger EPICs add an adversarial tester, and a UX designer when
  screens change.

Members never ask you anything. If a member needs a decision, the lead brings it to you.

## The loop of a stage

Each stage runs the same six steps: prepare, build, challenge, decide and fix, check, merge
([`epic-delivery` → The loop](../../../skills/epic-delivery/SKILL.md#the-loop-of-a-stage); the
detail is in [`stage-loop.md`](../../../skills/epic-delivery/references/stage-loop.md)).

The loop scales with the EPIC's appetite: a small EPIC gets one review pass, a larger one more
review, a checker and a tester. The review set of each appetite is in
[`epic-delivery.workflow.json`](../../../skills/epic-delivery/assets/workflows/epic-delivery.workflow.json). You do not pay for a
large loop on a small change.

## What you decide, and when

| When | You decide | The lead brings you |
|---|---|---|
| Shaping | The why, the appetite and the success measure; each key decision | Options with a recommendation, one plain sentence per term |
| At the PLAN gate | Whether the scenarios say what you want (sign-off, once per EPIC) | The scenarios, in business language |
| During a stage | Questions the PLAN did not answer; how to handle a gap in an external library | Options with a recommendation |
| After the last stage | Whether the EPIC is accepted (the acceptance demo, when it delivers or changes a use case) | The use case, run against the success measure |
| End of an iteration | What the validation review changes | Each EPIC and decision, against what happened |

When you say "choose what is best", the lead decides and records the choice as its own. You can
overrule it later.

The scenario sign-off (per EPIC), the acceptance demo and the validation review are still **provisional**: their first real runs will
confirm or reshape them
([`verification-validation.md`](../../../skills/epic-delivery/references/verification-validation.md)).

## Our libraries

When a library we build ourselves falls short, the task stops and the gap is reported upstream.
Nobody works around it. When an external library falls short, the lead gives you the options and you
decide ([`dependencies.md`](../../../skills/epic-delivery/references/dependencies.md)).

## Commits and authority

By default the lead commits only with your consent. You can grant more for one named EPIC, for
example "commit, push and merge for this EPIC without asking"; the limits of that grant are in
[`epic-delivery` → Authority](../../../skills/epic-delivery/SKILL.md#authority).

## In a project

A project scaffolded by [`project-setup`](../../../skills/project-setup/SKILL.md) carries its own
short version of this page under `docs/.../develop/`: who the people are, the project's standing
rules, its libraries and gates. Your role in the wider process is in
[the developer playbook](playbooks/developer.md).
