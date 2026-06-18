---
name: estimation
description: A lightweight fixed-cost scoping / estimation discipline that de-risks fixed-cost bids — a CHECKLIST + METHOD, not a heavy model. Produces a work breakdown plus PERT-weighted effort estimates, uncertainty ranges, assumptions & exclusions, and contingency, feeding the SoW scope boundary. PERT (three-point: optimistic / most-likely / pessimistic) is the default technique; analogous, parametric, and bottom-up are alternatives. Gantt charts / scheduling are rendered in EXTERNAL tools (Smartsheet, MS Project) from the work breakdown — this skill produces the breakdown + estimates, not the chart. It OWNS the estimation/scoping discipline; it DELEGATES the proposal/SoW wrapper to `proposal-writing`, the build breakdown to `epic-planning`, and sequencing to `decision-package`. Triggers — "estimate this engagement", "PERT estimate", "fixed-cost scoping", "work breakdown for estimation", "contingency / uncertainty range". Independently triggerable; also the pricing step of the `proposal-writing` flow.
license: Apache 2.0
metadata:
  category: consulting
---

# Estimation

> **Provisional pending the dogfood gate.** This wiring is the floor, not the finished standard;
> refine it after the first real paid engagement is estimated and delivered against.

## Overview

A **fixed-cost scoping / estimation discipline** that de-risks fixed-cost bids. It is deliberately
**light — a checklist plus a method, not a model**. The job is to turn an engagement into a
defensible number: a **work breakdown**, **PERT-weighted effort** with **uncertainty ranges**,
explicit **assumptions & exclusions**, and **contingency** — then hand those to the SoW so the price
and the scope boundary rest on the same evidence.

It is independently triggerable (any "estimate this" / "PERT estimate" request) and is also the
**pricing step** of the [`proposal-writing`](../proposal-writing/SKILL.md) flow.

It composes by reference: the estimate decomposes against the build breakdown owned by
[`epic-planning`](../../ai-coding/epic-planning/SKILL.md), and its sequencing/roadmap framing comes
from [`decision-package`](../decision-package/SKILL.md). It restates neither.

## What it covers (R4)

1. **Decomposition (work breakdown).** Break the engagement into estimable leaf items — small enough
   that each can carry a three-point estimate. For build-tier work, decompose against the EPIC/PLAN
   breakdown from [`epic-planning`](../../ai-coding/epic-planning/SKILL.md); do not invent a parallel
   breakdown.
2. **Uncertainty ranges.** Each leaf gets a range, not a point. PERT (below) is how the range becomes
   a weighted estimate plus a variance you can roll up.
3. **Assumptions & exclusions.** State what the number assumes (inputs, access, decisions,
   availability) and what it explicitly excludes. **The exclusions are the SoW out-of-scope list** —
   one list, two documents (see [`proposal-writing`](../proposal-writing/SKILL.md)).
4. **Contingency.** A buffer sized from the rolled-up variance and the assumption risk — not a flat
   guess. The [worksheet](references/pert-worksheet.md) shows the roll-up.
5. **Link to the SoW scope boundary.** The breakdown's leaves are the in-scope items; the exclusions
   are the out-of-scope items; the PERT total + contingency is the fixed-frame price.

## Techniques: PERT is the default

Multiple estimation techniques exist; **PERT is the favoured system** here because three-point
estimates make fixed-cost uncertainty explicit and roll up into a defensible contingency.

**PERT (three-point) — the default.** For each leaf, capture three estimates and weight them:

```
Expected (TE) = (O + 4·M + P) / 6        SD = (P − O) / 6        Variance = SD²
```

- **O** = optimistic (everything goes right), **M** = most-likely, **P** = pessimistic (plausible
  worst case — not catastrophe).
- Roll up: **engagement TE = Σ leaf TE**; **engagement SD = √(Σ leaf variances)**.
- Size **contingency** from the rolled-up SD (e.g. a one- or two-SD buffer for the confidence level
  the fixed frame needs). The [worksheet](references/pert-worksheet.md) does the arithmetic.

**Alternatives (use when they fit better, or to triangulate):**

| Technique | Use when |
|-----------|----------|
| **Analogous** (top-down, from a similar past engagement) | Early, little detail; a quick sanity anchor |
| **Parametric** (units × rate, e.g. per source system / per ontology module) | The work scales with a countable driver |
| **Bottom-up** (sum of leaf estimates) | Detail exists; pairs naturally with PERT per leaf |

Triangulate when the stakes are high: a PERT bottom-up that disagrees with an analogous top-down is a
signal to re-examine the breakdown.

## Gantt / scheduling is EXTERNAL

This skill produces the **work breakdown + estimates**. It does **not** draw Gantt charts or
schedules. Scheduling (dependencies, calendar, resource levelling, the Gantt itself) is rendered in
**external tools — Smartsheet or MS Project** — by importing the work breakdown. Do not attempt to
draw Gantts in-repo; produce a clean breakdown that those tools can consume. Sequencing *intent*
(pilot → scale order) comes from [`decision-package`](../decision-package/SKILL.md); the calendar
rendering of it is the external tool's job.

## The checklist

Run before any number leaves the room:

- [ ] Work broken into leaves small enough for a three-point estimate (decomposed against the
      `epic-planning` breakdown where build work is involved).
- [ ] Each leaf has O / M / P and a PERT expected value.
- [ ] Variances rolled up; engagement SD computed.
- [ ] Contingency sized from the rolled-up SD + assumption risk (not a flat percentage guess).
- [ ] Assumptions listed; each risky assumption has an exclusion or a stop/extend trigger.
- [ ] **Exclusions = the SoW out-of-scope list** (the invariant in `proposal-writing`).
- [ ] Triangulated against at least one alternative technique when the bid is large.
- [ ] Work breakdown exported clean enough for Smartsheet / MS Project to schedule.

The fillable worksheet (PERT table + roll-up + contingency) is in
[`references/pert-worksheet.md`](references/pert-worksheet.md); the full checklist is in
[`references/estimation-checklist.md`](references/estimation-checklist.md).

## Boundary & Related Skills

**This skill OWNS:** the **estimation / scoping discipline** — PERT + work breakdown + uncertainty
ranges + assumptions/exclusions + contingency, and the clean breakdown that external scheduling tools
consume.

**This skill DELEGATES:**
- The proposal / SoW wrapper (and the scope-boundary discipline the exclusions feed) →
  [`proposal-writing`](../proposal-writing/SKILL.md).
- The build breakdown the estimate decomposes against →
  [`epic-planning`](../../ai-coding/epic-planning/SKILL.md).
- Sequencing / roadmap intent (pilot → scale) → [`decision-package`](../decision-package/SKILL.md).
- The calendar/Gantt rendering → **external tools** (Smartsheet, MS Project) — out of repo.

**Related:** `proposal-writing`, `epic-planning`, `decision-package`.

## Tone & style

British English. Terse and numeric. Every number traces to a leaf, an assumption, and a technique; no
unexplained round figures. A point estimate without a range is a smell — show the range and the
contingency that covers it.
