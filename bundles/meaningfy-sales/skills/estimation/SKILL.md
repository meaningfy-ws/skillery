---
name: estimation
description: "A lightweight fixed-cost scoping / estimation discipline that de-risks fixed-cost bids — a CHECKLIST + METHOD, not a heavy model. Produces a work breakdown plus PERT-weighted effort estimates, uncertainty ranges, assumptions & exclusions, and contingency, feeding the SoW scope boundary. PERT (three-point: optimistic / most-likely / pessimistic) is the default technique; analogous, parametric, and bottom-up are alternatives. Gantt charts / scheduling are rendered in EXTERNAL tools (Smartsheet, MS Project) from the work breakdown — this skill produces the breakdown + estimates, not the chart. It OWNS the estimation/scoping discipline; it DELEGATES the proposal/SoW wrapper to `proposal-writing` and sequencing to `decision-package`, and pairs with `epic-planning` for the build breakdown. Triggers — \"estimate this engagement\", \"PERT estimate\", \"fixed-cost scoping\", \"work breakdown for estimation\", \"contingency / uncertainty range\". Independently triggerable; also the pricing step of the `proposal-writing` flow."
license: Apache 2.0
metadata:
  purpose: offers
  area: sales
  subject: generic
  posture: reusable
  stage: sell
  maturity: stable
---

# Estimation

A fixed-cost bid goes wrong when it rests on a round point figure and a flat percentage buffer;
this skill turns an engagement into a defensible number (a work breakdown, PERT-weighted effort
with ranges, assumptions and exclusions, contingency from the spread) with a checklist and a
method, not a heavy model. It is provisional until the first paid engagement is estimated and
delivered against: refine it then.

## Quick Start

Input: a Proof of Value with two leaves, in person-days.

| Leaf | O | M | P | TE = (O+4M+P)/6 | SD = (P−O)/6 | Variance |
|---|---|---|---|---|---|---|
| landscape reading | 3 | 5 | 11 | 5.67 | 1.33 | 1.78 |
| option framing | 2 | 3 | 7 | 3.50 | 0.83 | 0.69 |

Output: engagement TE 9.17; engagement SD √2.47 = 1.57; contingency 1 × SD = 1.57 (about 84%
confidence); fixed frame 10.7 ≈ 11 person-days, with the assumptions and the exclusions that go
to `proposal-writing` as the SoW's out-of-scope list. Open
[`assets/pert-worksheet.md`](assets/pert-worksheet.md) to fill the same table for a real bid.

## Workflow

1. **Decomposition (work breakdown).** Break the engagement into estimable leaf items — small enough
   that each can carry a three-point estimate. For build-tier work, decompose against the EPIC/PLAN
   breakdown from `epic-planning`; do not invent a parallel
   breakdown.
2. **Uncertainty ranges.** Each leaf gets a range, not a point. PERT (below) is how the range becomes
   a weighted estimate plus a variance you can roll up.
3. **Assumptions & exclusions.** State what the number assumes (inputs, access, decisions,
   availability) and what it explicitly excludes. **The exclusions are the SoW out-of-scope list** —
   one list, two documents (see `proposal-writing`).
4. **Contingency.** A buffer sized from the rolled-up variance and the assumption risk — not a flat
   guess.
5. **Link to the SoW scope boundary.** The breakdown's leaves are the in-scope items; the exclusions
   are the out-of-scope items; the PERT total + contingency is the fixed-frame price.

## Rules

- **PERT is the default.** For each leaf, O = optimistic, M = most-likely, P = pessimistic
  (plausible worst case — not catastrophe); TE = (O + 4·M + P) / 6, SD = (P − O) / 6. Roll up:
  engagement TE = Σ leaf TE, engagement SD = √(Σ leaf variances). One unit throughout
  (person-days or hours).
- **Contingency = k × engagement SD**, k ≈ 1 for about 84% confidence, ≈ 2 for about 98%; choose k
  for the confidence the fixed frame needs and state it. Fixed frame = engagement TE + contingency.
- **Alternatives triangulate.** Analogous (top-down from a similar past engagement; early, little
  detail), parametric (units × rate, e.g. per source system or per ontology module, when the work
  scales with a countable driver), bottom-up (sum of leaves; pairs with PERT). On a large bid,
  cross-check against at least one; a disagreement is a signal to re-examine the breakdown, not to
  average.
- **Gantt and scheduling are external.** This skill produces the work breakdown and the estimates,
  never a Gantt or a calendar: dependencies, calendar, resource levelling and the Gantt itself are
  rendered in **Smartsheet or MS Project** by importing the breakdown, so export it clean.
  Sequencing *intent* (pilot → scale order) comes from `decision-package`.
- **Voice.** British English. Terse and numeric. Every number traces to a leaf, an assumption, and
  a technique; no unexplained round figures. A point estimate without a range is a smell — show the
  range and the contingency that covers it.

## Before you hand over

Read `references/estimation-checklist.md` before any number leaves the room: it holds the full
checklist (decomposition, PERT, uncertainty and contingency, assumptions and exclusions,
triangulation, hand-off).

## Boundary & Related Skills

**This skill OWNS:** the **estimation / scoping discipline** — PERT + work breakdown + uncertainty
ranges + assumptions/exclusions + contingency, and the clean breakdown that external scheduling tools
consume.

**This skill DELEGATES:**
- The proposal / SoW wrapper (and the scope-boundary discipline the exclusions feed) →
  `proposal-writing`.
- Sequencing / roadmap intent (pilot → scale) → `decision-package`.
- The calendar/Gantt rendering → **external tools** (Smartsheet, MS Project) — out of repo.

See also `epic-planning` for the build breakdown an estimate decomposes against; the link is
one-way, since shaping an EPIC needs no estimate.

**Related:** `proposal-writing`, `decision-package`, `sales-qualification`, `sales-conversations` (cite this skill for any price in a draft).

Answers `VER, RSK` in `test-strategy`'s matrix (`references/generic-writing.md`).
