---
name: skill-name
description: Use this skill when <the situation or request that should fire it, with the phrases a user would say>; it <what the skill does and produces>. Not for <the closest neighbour's job> (only when a near-miss probe needs it).
license: Apache 2.0
metadata:
  purpose: <purpose>
  area: <area>
  subject: <subject>
  posture: <posture>
  stage: <stage>
  maturity: <maturity>
---

# Skill Title

One or two sentences: the bias or mistake this skill corrects. The shape and the budget are in
[`creating-skills.md` § *The lean standard*](creating-skills.md#the-lean-standard).

## Quick Start

The shortest path to a result, with one real worked example: the input, what you do, and the output.

## Workflow

Only in an activity skill, which also ships `assets/workflows/<name>.workflow.json`; see
[`creating-skills.md` § *Activity skills*](creating-skills.md#activity-skills). Otherwise delete
this section.

## Rules

The decision rules, Meaningfy's own and non-obvious. Point to a reference at the point of need:

- Read [`references/<question-it-answers>.md`](references/<question-it-answers>.md) when
  <situation>: it adds <what the reference holds>.

Common mistakes:

| Mistake | Why it fails | Do instead |
|---|---|---|
| <what an agent does here without this skill> | <the consequence> | <the rule to follow> |

## Triggers

- When <X appears>, <do Y>.

## Before you hand over

| Question | If not | Action |
|---|---|---|
| <the check on the output> | <what is wrong then> | <what to do> |

## Boundary & Related Skills

**Owns:** the facts and rules this skill is the single home for.

**Does NOT own:** the neighbouring jobs, and which skill owns each.

**Related:** other skills cited by name, with one line on when to use them; never restated here.
