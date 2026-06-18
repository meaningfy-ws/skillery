# Estimation checklist

Run this before any number leaves the room. It de-risks a fixed-cost bid by forcing every figure to
trace to a leaf, an assumption, and a technique.

## Decomposition

- [ ] Engagement broken into **leaves** small enough for a three-point estimate.
- [ ] Where build work is involved, leaves decompose against the EPIC/PLAN breakdown from
      [`epic-planning`](../../../ai-coding/epic-planning/SKILL.md) — no parallel breakdown invented.
- [ ] No leaf is a black box ("integration", "misc") hiding unestimated work.

## PERT (default technique)

- [ ] Each leaf has **O / M / P** (optimistic / most-likely / pessimistic-but-plausible).
- [ ] **TE** computed per leaf: `(O + 4M + P) / 6`.
- [ ] **Variance** computed per leaf: `((P − O)/6)²`.
- [ ] Engagement **TE** and **SD** rolled up (see the [worksheet](pert-worksheet.md)).

## Uncertainty & contingency

- [ ] Every leaf carries a **range**, not a bare point.
- [ ] **Contingency** sized from the rolled-up SD + assumption risk — not a flat % guess.
- [ ] Confidence level chosen deliberately (k = 1 vs 2) and stated.

## Assumptions & exclusions

- [ ] Assumptions listed: client inputs, data access, SME availability, decision authority, timing.
- [ ] Each **risky** assumption has either an exclusion or a stop/extend trigger.
- [ ] **Exclusions = the SoW out-of-scope list** — the invariant owned by
      [`proposal-writing`](../../proposal-writing/SKILL.md). One list, two documents.

## Triangulation (large bids)

- [ ] Cross-checked against at least one alternative — **analogous** (vs a past engagement),
      **parametric** (units × rate), or **bottom-up** sum.
- [ ] A disagreement between techniques was investigated, not averaged away.

## Hand-off

- [ ] Work breakdown exported clean enough for **Smartsheet / MS Project** to schedule (this skill
      does not draw the Gantt).
- [ ] PERT total + contingency handed to `proposal-writing` as the **fixed-frame price**.
- [ ] Sequencing intent (pilot → scale) sourced from
      [`decision-package`](../../decision-package/SKILL.md), not invented here.
