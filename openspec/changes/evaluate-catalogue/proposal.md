# EPIC: Evaluate the catalogue — measured revision on Haiku (parked)

> **Golden thread.** Split out of `restructure-and-evaluate-catalogue` on 2026-10-26 (owner: "we will
> do evaluation later"). Its parents are that change's: the baseline audit of 2026-10-26
> (`skill-crafting-method`, archived) and the use-case catalogue [`use-cases/`](../../../use-cases/).
> The starting PLAN is that change's design, decisions D-1 to D-13 (evidence files, trigger sets,
> outcome suites, Haiku as the record model, approval per batch, the spend cap, trigger sets run
> through `claude plugin eval`), and its spend log `inputs/approvals.md`; cite them, do not restate.
> **Status: parked.** It starts after `rebundle-by-activity`, so it measures the skills and agents in
> their target bundles rather than ones about to move.

## Appetite

**Medium, in gated batches: about three to four weeks part time.** Each batch is one PR with its
evidence file and its own spend approval, on Haiku only (no Opus) until the owner says otherwise.

## Why

No skill or agent in the catalogue has behavioural evidence. The audit found long descriptions,
oversized skills and a measured trigger gap; fixing them by edit alone is judging by opinion, which
the method forbids. Measuring now would waste the spend: `rebundle-by-activity` moves skills and
adds agents, so the descriptions and neighbours a trigger set tests are about to change.

## Solution outline

1. **Re-derive the PLAN** from D-1 to D-13 against the bundles and agents as they stand after the
   re-bundling: batch A's sub-batches, the suites' key skills, and the agent cases (one return and one
   refusal per agent, from its Gherkin).
2. **Batch C first** (`executive-communication`), as the proof of the `claude plugin eval` route: the
   harness smoke test of 2026-10-26 fired the skill on Haiku for $0.003 per run.
3. **The outcome suites "before"**, then **batch A** (the long descriptions), then **batch B** (the two
   oversized skills) and the suites "after".

The parked tasks are in [`tasks.md`](tasks.md); the requirements in
[`specs/catalogue-evaluation/spec.md`](specs/catalogue-evaluation/spec.md).

## Cost

On the measured Haiku unit costs ($0.0038 per trigger query, about $0.006 per short outcome run):
batch C about $1; suites "before" about $0.5–2; batch A about $2.5–5 per sub-batch of five skills, four
sub-batches; batch B and the suites "after" about $2. In total about $14–25, approved batch by batch.

## No-gos

- No model run without a dated approval of that batch's estimate.
- No Opus. No eval in CI on push, pull request or release.
- No description rewrite without a before and an after on the same set.
