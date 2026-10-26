<!-- PLAN (design half). PLAN = this file + tasks.md. Document type: Implementation. Revision 3
     (clarity-gate: round 1 8.0/10, round 2 8.9/10; round-2 gaps closed here). -->

> Parent: EPIC `restructure-and-evaluate-catalogue` ([`proposal.md`](proposal.md), DEC-1…DEC-7).
> Golden thread: the baseline audit,
> [`../archive/2026-10-26-skill-crafting-method/inputs/baseline-audit.md`](../archive/2026-10-26-skill-crafting-method/inputs/baseline-audit.md);
> owner answers in [`inputs/2026-10-26-shaping-qa.md`](inputs/2026-10-26-shaping-qa.md).
> Acceptance criteria are the deltas under [`specs/`](specs/).

## Context

v3.2.0 ships the method (`skill-crafting-method`) and the catalogue model (`define-catalogue-model`):
every skill and agent records its posture and facets, bundles declare requirements, and the checks
report the audit's findings on every `make validate`. The tools are in place:
- `skill-creator`'s `scripts/run_eval.py` measures trigger rates. Its input is a JSON list of
  `{query, should_trigger}`; it takes `--description` to test a candidate without editing the skill,
  plus `--runs-per-query`, `--trigger-threshold` and `--model`.
- `claude plugin eval` runs outcome suites with graders.
- `.github/workflows/plugin-eval.yml` runs the same suites on demand once the `ANTHROPIC_API_KEY`
  secret exists. The owner will provide it later.

Until then, every run is local, on the owner's Claude login, after the owner approves that batch.

Measured costs from 2026-10-26: one short outcome run is $0.04 on `claude-sonnet-5-5` and $0.11 on
the default model. A trigger run is shorter; it is estimated at $0.03 on Sonnet and $0.01 on Haiku.

## Goals / Non-Goals

**Goals:**
- Close audit batches A–E with evidence.
- Give every bundle an outcome suite, with agent cases in `meaningfy-building`.
- Re-check the docs and structure against the method and the register.
- Keep each batch's spend within the amount the owner approves for it.

**Non-Goals:** the proposal's no-gos: no new skills or splits, no bundle changes, no CI runs on
push, PR or release, no third-party platform, no opencode runner.

## Decisions

- **D-1. One evidence file per batch**, `inputs/evidence/<batch>.md`, one row per item, with exactly
  this ten-column header:

  ```
  | Item | Posture | Change | Eval | Model | Runs | Before | After | Cost | Verdict |
  ```

  *Model* is the id the CLI reports for the run. *Cost* is measured for outcome suites (`claude plugin
  eval` reports it) and estimated for trigger sets as runs × measured unit cost (D-12), marked "est.".
  *Verdict* is kept, reverted or handed off.

  An item whose "after" is not better than its "before" is reverted or kept with a written reason.
- **D-2. Trigger sets** live in `evals/triggers/<skill>.json`, in the `skill-creator` format. Each
  set has 20 queries, 10 that should trigger and 10 near-misses that should not, seeded from the
  skill's probes in `tests/trigger_probes.yaml`.
  - **Measurement:** `run_eval.py --eval-set evals/triggers/<skill>.json --skill-path
    skills/<skill> --runs-per-query 3`. "Before" runs on the current description, "after" on the
    candidate (`--description`).
  - **Isolation (required).** `run_eval.py` writes a temporary command into the nearest
    `.claude/commands/`, runs `claude -p` and counts only that temporary name. In a session where the
    skillery plugin is installed, the real skill would fire under its own name and be scored as "no
    trigger", alongside hundreds of other installed skills. So trigger sets run in an isolated
    environment, and the evidence row names it:
    - **Directory:** a scratch directory outside `$HOME` (for example `/tmp/skillery-trigger/`) that
      holds its own empty `.claude/`. `run_eval.py` walks up to the first `.claude/` it finds, so
      under `$HOME` the temporary commands would land in the owner's real `~/.claude`.
    - **Config:** `CLAUDE_CONFIG_DIR` pointing to a fresh directory with no plugins installed.
    - **Login:** that directory starts without credentials. Either copy the owner's
      `.credentials.json` into it for the duration of the batch and delete it afterwards (the
      pattern used for the 3.1.0 tests), or set `ANTHROPIC_API_KEY` once the owner provides it. The
      evidence row says which. Collisions with real neighbours are
    measured by the bundle suites (D-3), not by trigger sets.
  - **Pass:** at least 90% of should-trigger queries fire at a rate of 0.5 or more, at most 10% of
    near-misses do, and the score is not worse than "before".
  - **Location:** the sets sit outside the skills, so they do not ship to installers.
- **D-3. Outcome suites** live in `evals/<bundle>/<case>/` (`prompt.md` plus `graders/`), as the
  seed suite does. Each case has one `llm` grader for the outcome and one `tool_used` grader for the
  skill (or agent) firing.
  - **Size:** one case per key skill, at most 4 skill cases per bundle in the first pass, plus one
    case per agent in `meaningfy-building`. "Key skill" means the most-used per bundle, chosen by the
    owner when approving the batch (default: listed in task 3.1).
  - **Agent cases:** grade the dispatch (a `tool_used` grader on `Agent` with the namespaced
    subagent) and the contract (an `llm` grader on what the agent returns and what it refuses).
  - **Flags and plugins a suite needs:** cases that let an agent write (`implementer`) need
    `--allow-tools Write Edit Bash`; vault cases that seed a scratch vault need `--scaffold`. The
    temporary plugin also includes the skills of every bundle the tested bundle `requires:`
    (building gets architecture's skills). Vault cases must not depend on the external obsidian CLI:
    the vault skills' file-move fallback covers it. `evals/README.md` and the workflow carry these
    options.
- **D-4. Models.**
  - **The record of every trigger set is Sonnet, before and after** (alias `sonnet`; the evidence
    row records the id the CLI reports). The same model and the same set are used on both sides.
  - **Haiku (alias `haiku`) is only for iterating drafts,** before the Sonnet "after". It is never
    compared with a Sonnet number.
  - **Outcome suites and baselines** run on `sonnet`.
  - **Change by approval:** the owner can change the record model when approving a batch.
- **D-5. Order, and approval per batch** (proposal DEC-5). Cheap and structural work comes first.
  Phases group the batches; **every batch that uses model runs is approved on its own estimate**.
  The estimates are provisional until D-12 measures the unit cost:

  | Phase | Batch | Model runs | Provisional estimate |
  |---|---|---|---|
  | 1 | D missing probes | none | $0 |
  | 1 | E one-way Related links | none | $0 |
  | 1 | docs and structure re-check | none | $0 |
  | 1 | C `executive-communication` | 120 Sonnet trigger runs + Haiku drafts + 1 suite case | ≈ $5 |
  | 2 | suites "before" (5 bundles, ≤ 4 skill cases each + 3 agent cases, 3 runs) | ≈ 70 outcome runs | ≈ $8 |
  | 3 | A1–A4, one sub-batch at a time (5–6 skills) | 600–720 Sonnet trigger runs + drafts each | ≈ $20–25 each |
  | 4 | B baselines (2 skills × 3 scenarios × 5 reps × 2) + suites "after" | ≈ 130 outcome runs | ≈ $10 |

  The full scope is about $110–125 at these provisional unit costs. Phase 1 fits the owner's $5;
  Phase 3 is the bulk, and its sub-batches can stop at any point. Fewer queries per set are not an
  option, because the method fixes the set size.
- **D-6. A batch is one PR** (proposal DEC-4). It holds the evidence file, the edits and the regenerated
  catalogue map. Phase 3 runs one PR per sub-batch.
- **D-7. Revisions follow the recorded posture** (proposal DEC-6), read from `metadata.posture`.
  A `reusable` skill gains no domain wording in its description; a `profiled` skill names its
  switch; a `precise` skill keeps its guardrails.
- **D-8. Body restructures (batch B) move detail, never meaning.** Sections move into
  `references/` with a pointer at the point of use. The baseline proves that no scenario got worse.
- **D-9. Batch E rule.** For each one-way Related pair, either add the return link or turn the
  one-way link into a sentence in the `## Boundary & Related Skills` section of the source skill
  ("see also … for …"). The advisory `reciprocal_related_report` is then empty, or lists only the
  pairs the evidence file justifies as one-way.
- **D-10. The docs and structure re-check** reads every hand-written row of the register (§8)
  against the method: one topic per view, facts stated once, links resolving, no restated skill
  rules. Findings are fixed in the batch when small (a link, a sentence). Otherwise they are handed
  to the change that owns the file, or named for a later change.
- **D-11. `evals/README.md`** is the one place that says how to run both kinds of eval locally and
  through the workflow (commands, models, cost ceilings). The method links to it rather than
  repeating it.

- **D-12. Spend is capped by run count.** `run_eval.py` has no cost ceiling, reports no cost and runs
  queries in parallel. So before a trigger batch, one calibration query is run with `claude -p
  --output-format json` in the isolated environment, on each model the batch will use, and its
  `total_cost_usd` gives the unit cost. The approved amount ÷ unit cost gives the maximum number of
  runs, counting the Haiku draft runs as well as the Sonnet record runs, and the batch is split so
  that it never exceeds that count. The two calibration queries cost a few cents and are approved
  together with batch C (task 0.2). Outcome suites use
  `--max-cost-usd` as well.

- **D-13 (proposed 2026-10-27, awaiting the owner): trigger sets run through `claude plugin eval`,
  not `run_eval.py`.** In Claude Code 2.1.310, `run_eval.py`'s command-file registration never
  reaches the model's skill list, so it cannot measure triggering (evidence C). Instead, a short
  converter turns `evals/triggers/<skill>.json` into one case per query, in a temporary plugin that
  holds only the skill under test (the candidate description is written into the copy for the
  "after"):
  - a should-trigger query gets a `tool_used` grader on `Skill` with `min: 1`;
  - a near-miss gets `min: 0, max: 0`;
  - 3 runs each, `--ablation none`, `--model sonnet` for the record and `haiku` for drafts,
    `--max-cost-usd` set to the approved amount.

  `claude plugin eval` loads none of the owner's settings, plugins, `CLAUDE.md` or skills, so the
  isolation of D-2 comes built in, and the `/tmp` + `CLAUDE_CONFIG_DIR` set-up is no longer needed.
  The pass rule of D-2 is unchanged. If adopted, `evals/README.md` and D-2 are updated to match.

## Algorithm / approach

For each batch, in order:
1. **Estimate and ask.** List the runs, the model and the cost estimate, and get the owner's yes
   (D-5). No yes, no run.
2. **Measure before.** Run the trigger set or suite on the current text and write the "before"
   column.
3. **Revise.** Edit, following the posture (D-7), the method's description rule and the
   proportionate test rule.
4. **Measure after.** Use the same set, the same model (the Sonnet record, D-4) and the same number
   of runs.
5. **Decide.** Keep, revert or hand off. Then fill the evidence row with the cost.
6. **Ship.** Regenerate the map, run `make validate`, and open the PR (D-6).

*Worked example (batch C; the numbers are illustrative).*
- **Before:** `evals/triggers/executive-communication.json` holds 10 should-trigger queries ("write
  the cover email for this quotation", "turn these notes into a board recommendation", …) and 10
  near-misses ("write the SoW for the decision phase" → `proposal-writing`, "why does this ADR read
  badly" → `writing-antipatterns`, …). The current description scores, for example, 6/10
  should-trigger and 1/10 near-miss (Sonnet, isolated).
- **Revise:** the candidate description adds "cover messages for quotations, SoWs and tenders",
  stays ≤ 600 characters and keeps the "bind" register; drafts are iterated on Haiku.
- **Record (Sonnet, isolated):** before 6/10 and 1/10, after 9/10 and 0/10.
- **Outcome:** the seed case `quotation-bind` passes `skill-fired`. The evidence row records about
  $1.40 and "kept".

**Idempotency:** trigger sets and suites are files. A rerun of the same set on the same model
reproduces the measurement within noise, which is why each set runs 3 times per query.

### Anti-patterns

- ❌ Running a batch without the owner's yes on its estimate.
- ❌ Changing a description and its trigger set in the same step, which would move the goalposts. The
  set is fixed before "before".
- ❌ Comparing "before" on Haiku with "after" on Sonnet; the record is Sonnet on both sides.
- ❌ Running a trigger set where the skillery plugin is installed (D-2 isolation).
- ❌ Moving meaning into `references/` in batch B, or deleting content.
- ❌ Growing a bundle suite past 4 skill cases in the first pass (agent cases come on top).
- ❌ Hiding a revert: an item that did not improve says so in the evidence file.

## Error matrix

| Failure mode | Expected handling |
|---|---|
| A batch would exceed the approved amount | Suites stop at `--max-cost-usd`. Trigger batches never start more runs than the D-12 count allows; the rest wait for a new approval |
| `run_eval.py` reports 0 for every should-trigger query | Check that the skill reaches the session's skill list (stream-json `init` event); in Claude Code 2.1.310 it does not: use D-13 |
| A trigger set runs in a session with the plugin installed | Invalid measurement: rerun in the isolated environment (D-2); the evidence row names the environment |
| "After" is worse than "before" | Revert the edit; the evidence row says "reverted" with the scores |
| A trigger set misfires on a near-miss after the rewrite | Treat it as a failed "after": adjust the description or revert; never delete the near-miss |
| The owner's Claude login is unavailable | No runs; the structural batches (D, E, re-check) still proceed |
| `run_eval.py` changes upstream | Pin to the `skill-creator` copy that was read; note its date in `evals/README.md` |
| A docs finding sits in a file another change owns | Hand off to that change's `inputs/`; no edit here |
| The `ANTHROPIC_API_KEY` secret arrives mid-EPIC | Later batches may run through `plugin-eval`; the evidence row names where it ran |

## Risks / Trade-offs

- [Haiku drafting can mislead about how Sonnet will trigger] → Haiku only iterates drafts; the
  Sonnet before and after, in the isolated environment, is the record (D-4).
- [Small samples (3 runs) give noisy rates] → the pass rule uses thresholds and "not worse than
  before", not exact scores; borderline items get a second "after".
- [Costs exceed the estimates] → ceilings per batch, stop and ask.
- [Twenty-one description rewrites shift triggers across neighbours] → each trigger set includes the
  neighbours' near-misses, and probes are added for every changed description.

## Open Questions

- Phase approvals happen at run time (D-5); none blocks the PLAN.
