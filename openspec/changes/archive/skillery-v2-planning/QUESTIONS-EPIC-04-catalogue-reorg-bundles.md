# Open Questions — EPIC-04: Catalogue Reorg & Bundle Re-cut

> Questions for [EPIC-04](EPIC-04-catalogue-reorg-bundles.md) · [PLAN-04](PLAN-04-catalogue-reorg-bundles.md). Answer inline on the **Answer:** lines.

### Q4.1 — Are the 7 bundles the right cut, or do consulting skills over-concentrate?
DEC-6 locks 7 bundles. But the cut is open in *practice*: `meaningfy-consulting` will hold
`semantic-consulting-coach`, `decision-package`, `proposal-writing`, `estimation` (4 skills across
sales + discovery), while `meaningfy-modelling` holds one. The question is whether the consulting
bundle should sub-split, not whether 7 is the count.
- **A) ★** Ship 7 as locked; let `meaningfy-consulting` be the largest bundle — a consultant wants all of it together anyway. — Honours DEC-6; bundle size follows real install intent (a consultant installs the whole tier).
- **B)** Keep 7 bundle *names* but allow finer-grained install via per-skill pins documented alongside. — Flexibility without changing the cut.
- **C) (scope-expanding — only if you want to re-shape)** Split consulting into `meaningfy-sales` (proposal/estimation) + `meaningfy-discovery` (coach/decision-package). — Cleaner mental model, but reopens DEC-6's bundle count.

**Answer:** A) note that it is okay to have bundles with a single skill for now, we will add later new ones - in fact, you could move the modelling into the the meaningfy-engineering bundle next to the `architecting` skill. 

### Q4.2 — Should the validator enforce trigger-precision, or only structure?
R7 extends `repo_lint` to check structure (paths, names, spine presence, no orphan refs). But the
recurring risk across EPIC-03/04/06/07/08 is *trigger collision* after descriptions grow/move — and
that is left to manual "probes recorded in the PR body." A structural-only validator cannot catch a
regression where two skills now fire on the same probe.
- **A)** Keep trigger-precision manual (PR-body probes) as planned — validators stay deterministic/structural. — Matches the current tooling boundary; no flaky LLM-in-CI.
- **B) ★** Add a *non-blocking* trigger-probe harness (a fixtures file of probe→expected-skill) that `make validate` runs and reports, but does not hard-fail CI on. — Catches collisions automatically without putting a non-deterministic gate in the blocking path.
- **C)** Add a blocking trigger-precision test. — Strongest, but non-deterministic LLM matching in a hard CI gate is fragile.

**Answer:** B)

### Q4.3 — Does the one-commit constraint (C2) force an impractically large PR?
C2/PLAN-04 require move + marketplace + validator to land in one commit so the repo is never
inconsistent. With 11 skills moving, the marketplace re-cut, validator rules, and two doc rewrites,
that is a very large single change to review.
- **A) ★** Keep the *self-consistency* invariant but allow a stacked-PR series where only the final merge must be green; the mechanical `git mv` PR is reviewed separately from the doc-rewrite PR. — Preserves the invariant at merge while making review tractable.
- **B)** One big atomic PR as written. — Guarantees consistency, but heavy review.
- **C)** Land moves first behind a temporary compatibility shim (old paths symlinked), then remove the shim. — Smaller diffs, but adds throwaway shim complexity.

**Answer:** A) 
