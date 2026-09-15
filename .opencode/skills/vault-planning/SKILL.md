---
name: vault-planning
description: Plan and review the owner's objectives in a Meaningfy Obsidian vault across four horizons: year, quarter (OKRs: objectives with measurable key results), month and week: kept in `05 To Do/Objectives YYYY.md` with its own change log, and reviewed into `04 Daily/reviews/`. Runs a planning session or a review session for one horizon; every objective comes from the owner. Use when the owner, in a vault, says "plan my week/month/quarter/year", "set my OKRs", "weekly review", "monthly/quarterly/yearly review", "what should I focus on this week", "how did this week go". The day's plan is vault-daily.
license: Apache 2.0
argument-hint: "plan|review week|month|quarter|year"
metadata:
  category: vault
---

# Vault Planning

## Overview

Each horizon frames the next: the year sets a few objectives, each quarter turns them into objectives
with measurable key results, the month picks what to push, the week names a few outcomes, and
[`vault-daily`](../vault-daily/SKILL.md) turns the week into today. A **planning** session sets a
horizon's plan; a **review** session looks back on a finished period and feeds the next plan. The
method draws on multi-scale planning, OKRs and the GTD weekly review:
[`references/planning-practices.md`](references/planning-practices.md).

The plans file and the review note have fixed shapes, owned by
[`vault-conventions`](../vault-conventions/SKILL.md) (`references/project-files.md`).

## The one rule

**Every objective, key result and outcome is the owner's.** Ask for each one; offer candidates drawn
from the vault (active projects, open tasks, last review's next focus) as questions, never as decisions.
A plan the owner did not state is not written. If the owner wants no plan for a horizon, write none.

## Planning session (`plan <horizon>`)

1. **Load the frame.** Open `05 To Do/Objectives YYYY.md`. Missing: offer to create it (`kind:
   objectives`) and ask for the year's objectives first; if the owner prefers to start at a shorter
   horizon, plan that one. Read the
   horizon above the one being planned, and the latest review of the same horizon in
   `04 Daily/reviews/`, if any. An item with nothing above it to cite is marked "unplanned", which is
   fine.
2. **Start from the review.** If the last review has a "Next focus" or carried-over items, put them to
   the owner first. No review yet for a finished period: offer to run it first, and continue without it
   if the owner declines.
3. **Ask, horizon by horizon:**
   - **year:** 3 to 5 objectives: what must be true by 31 December?
   - **quarter:** for each objective that this quarter serves, 2 to 4 key results a third person could
     measure (a number, a date, a yes/no);
   - **month:** which key results this month pushes, as monthly objectives;
   - **week:** 3 to 5 outcomes, each citing the monthly objective or key result it advances, or marked
     "unplanned" when it serves none. Check the calendar week for capacity only if the owner asks.
4. **Write** a new section for the new period above the previous one; the previous period's section
   stays, each of its items marked `done`, `dropped` or `carried over` (never deleted). Append one
   change-log line per change: `- YYYY-MM-DD <what changed>: <why>`.
5. **Report** the plan in five lines or fewer.

## Review session (`review <horizon>`)

1. **Read the period's records:** for a week, its daily notes and the `sessions.md` entries of projects
   touched; for a month, quarter or year, the reviews of the shorter periods inside it; and the plan
   that was set for the period.
2. **Weekly only, the GTD sweep:** list the items waiting in `00 Inbox/` and `00 Inbox/proposed/`, every
   active project without a session this week, and `To-Do.md` items older than two weeks. Ask what to
   do with each (the owner acts, or names a skill such as `vault-promote`); change nothing yourself.
3. **Ask** for wins, misses (with one line of why), what carries over, and what the next period should
   focus on. Offer what the records show; the owner confirms.
4. **Write** `04 Daily/reviews/<period>.md` (`kind: review`, `period`, `horizon`) with the four
   sections.
5. **Friction** with the vault's method that the owner raises becomes a `kind: skill-change` note in
   `00 Inbox/proposed/`; never edit a skill.

## Guards

- Never invent an objective, key result, deadline or metric.
- Never rewrite the change log; it is append-only.
- Never plan a project into existence: new work that needs a folder goes through
  [`vault-project`](../vault-project/SKILL.md).

## Boundary & Related Skills

**Owns:** planning and review sessions over week, month, quarter and year, and the cascade rules
between horizons.

**Delegates:** the plans file and review-note shapes → [`vault-conventions`](../vault-conventions/SKILL.md);
the day → [`vault-daily`](../vault-daily/SKILL.md); promoting and tidying what the weekly sweep finds →
[`vault-promote`](../vault-promote/SKILL.md), [`vault-tidy`](../vault-tidy/SKILL.md).

**Related:** `vault-daily`, `vault-project`, `vault-conventions`, `vault-promote`.
