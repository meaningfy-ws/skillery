<!-- PLAN (tasks half). PLAN = design.md + this file. Document type: Implementation. Revision 3
     (clarity-gate: round 1 8.0/10, round 2 8.9/10; round-2 gaps closed here). -->

> Derived from EPIC: restructure-and-evaluate-catalogue (`proposal.md`); design in `design.md`
> (D-1…D-12). Gate for every task: `make validate` green at its end. Each batch is one PR into
> `develop` (D-6), from a branch `eval/<batch>`. **No model run happens without the owner's approval
> of that batch's estimate** (D-5). GitNexus `impact` before editing a symbol in `tools/`;
> `detect_changes` before each commit.

## 0. Preconditions

- [x] 0.1 Score this PLAN with the full `clarity-gate`. **Accept:** ≥ 9/10.
- [ ] 0.2 The owner approves the calibration (two queries, a few cents) together with batch C's
      provisional estimate (D-5, ≈ $5). **Accept:** the approval, its date and amount, recorded in
      `inputs/approvals.md`.
- [ ] 0.3 Set up the isolated trigger environment (D-2: a `/tmp` scratch directory with its own
      `.claude/`, a fresh `CLAUDE_CONFIG_DIR`, and a login) and calibrate (D-12): one query on
      `sonnet` and one on `haiku` with `claude -p --output-format json`; record each
      `total_cost_usd` and the model id the CLI reports, and re-estimate D-5. **Accept:** both unit
      costs and model ids recorded in `inputs/approvals.md`; the D-5 table updated; if batch C's
      re-estimate exceeds the approved amount, the owner is asked again before 2.4.

## 1. Shared scaffolding (no model runs)

- [ ] 1.1 Write `evals/README.md` (D-11): how to run a trigger set (`run_eval.py` command, flags, the
      pinned `skill-creator` copy and its date) and an outcome suite (local `claude plugin eval` with
      a temporary plugin; the `plugin-eval` workflow), the default models (D-4) and the cost
      ceilings. Add a register row for it in `docs/development-method.md` §8. **Accept:** `make
      validate` green; the README names both commands with their flags, the isolation steps (D-2), the run-count cap (D-12) and the
      suite options (D-3); `grep -n "evals/README.md" docs/development-method.md` hits in §8.
- [ ] 1.2 Write `inputs/evidence/TEMPLATE.md` with the D-1 columns. **Accept:** the template's header is
      exactly the ten columns of D-1.

## 2. Phase 1: batches D, E, C and the re-check

- [ ] 2.1 **Batch D** (no model runs): a positive and a near-miss probe for `linkml-engineering` and
      `modelling-conventions` (`near_miss_of` the closest neighbour). **Accept:** the
      `trigger-probe` advisory no longer lists either skill; `inputs/evidence/D.md` lists the 4 probes.
- [ ] 2.2 **Batch E** (no model runs): re-count the one-way Related pairs at the start (20 on
      2026-10-27; 19 in the audit), then resolve each by D-9. **Accept:** `inputs/evidence/E.md` has
      a row per pair; `reciprocal_related_report` lists only the pairs whose row says why they stay
      one-way.
- [ ] 2.3 **Batch C** trigger set: write `evals/triggers/executive-communication.json` (10
      should-trigger, 10 near-misses, seeded from the probes). **Accept:** 20 entries, valid JSON, in
      the `{query, should_trigger}` format.
- [ ] 2.4 **Batch C** in the isolated environment (D-2, D-4, D-12): Sonnet "before"; draft the
      description on Haiku (≤ 600 characters, posture `profiled`: name the bind switch); Sonnet
      "after"; rerun the seed case `quotation-bind`; add positive and near-miss probes for the new
      description. **Accept:** `inputs/evidence/C.md` has the row with both scores and the cost; the
      D-2 pass rule holds on Sonnet, or the row says "reverted".
- [ ] 2.5 **Docs and structure re-check** (D-10, no model runs): read each hand-written row of the
      register against the method; fix the small findings; hand off the rest. **Accept:**
      `inputs/evidence/docs.md` lists every register row with a finding or "clean"; hand-offs are
      written into the owning changes' `inputs/`.
- [ ] 2.6 Phase 1 PRs: one per batch (D, E, C, docs), each with its evidence file and a regenerated
      catalogue map. **Accept:** all merged into `develop` with CI green.

## 3. Phase 2: outcome suites and agents (after approval)

- [ ] 3.1 The owner approves the Phase 2 estimate (≈ $8) and the key skills. Default key skills:
      core `technical-writing`, `writing-antipatterns`, `meaningfy-git-workflow`, `guardrails`;
      consulting `executive-communication` (seed), `proposal-writing`, `estimation`,
      `semantic-consulting-coach`; architecture `architecture`, `conceptual-modelling`,
      `linkml-engineering`, `modelling-conventions`; building `epic-planning`, `cosmic-python`,
      `meaningfy-code-review`, `project-setup`; vault `vault-conventions`, `vault-project`,
      `vault-resume`, `vault-capture`. **Accept:** recorded in `inputs/approvals.md`.
- [ ] 3.2 Write the suites under `evals/<bundle>/` (D-3); the vault cases seed a scratch vault with a
      `scaffold_script` and run with `--scaffold`. Extend `.github/workflows/plugin-eval.yml` with
      `scaffold` and `allow_tools` inputs, and assemble the temporary plugin with the skills of every
      required bundle. **Accept:** each of the 5 bundles has ≤ 4 skill cases, each with an `llm` and a
      `tool_used` grader; the workflow has both inputs; a local run of one vault case completes.
- [ ] 3.3 Write one agent case each for `epic-planner`, `implementer` and `code-reviewer` in
      `evals/meaningfy-building/` (dispatch plus contract graders). Cases that let an agent write
      run with `--allow-tools Write Edit Bash`. **Accept:** 3 cases; each grades a refusal or a return
      shape from the agent's dispatch contract.
- [ ] 3.4 Run every suite once as "before" on Sonnet (3 runs, `--ablation none`, a ceiling per
      bundle). **Accept:** `inputs/evidence/suites.md` has a row per case with score and cost; total ≤
      the approved amount.

## 4. Phase 3: batch A, the long descriptions (each sub-batch after approval)

For each sub-batch: approve (its own task) → write the trigger sets → Sonnet before → Haiku drafts →
Sonnet after → evidence → PR. Each sub-batch's run count is capped by D-12.

- [ ] 4.0 Before each sub-batch, the owner approves its estimate (recorded per sub-batch in
      `inputs/approvals.md`). **Accept:** four dated approvals by the end of Phase 3, one per
      sub-batch run. Sub-batches, worst first (characters from the audit):

- [ ] 4.1 **A1:** `estimation`, `decision-package`, `project-setup`, `conceptual-modelling`,
      `proposal-writing`. **Accept:** `inputs/evidence/A1.md` has five rows with a Sonnet before and after
      from the isolated environment; every kept description is ≤ 600 characters and passes D-2;
      probes added.
- [ ] 4.2 **A2:** `ci-cd-delivery`, `linkml-engineering`, `modelling-conventions`,
      `writing-antipatterns`, `vault-conventions`. **Accept:** as 4.1, for `A2.md`.
- [ ] 4.3 **A3:** `explanatory-writing`, `vault-setup`, `vault-project`, `vault-capture`,
      `meaningfy-code-review`. **Accept:** as 4.1, for `A3.md`.
- [ ] 4.4 **A4:** `epic-planning`, `meaningfy-release`, `guardrails`, `vault-resume`,
      `spec-stewardship`, `vault-daily`. **Accept:** as 4.1, for `A4.md`; the description-length
      advisory is empty, or lists only skills whose evidence row says why they stay.

## 5. Phase 4: batch B and the suites' after-pass (after approval)

- [ ] 5.1 The owner approves batch B and, separately, the suites' "after" pass (≈ $10 together,
      re-estimated per D-12). **Accept:** two dated approvals recorded in `inputs/approvals.md`.
- [ ] 5.2 **Batch B:** for `architecture` and `cosmic-python`, write 3 scenarios each, run the
      baseline (5 repetitions, Sonnet), move detail into `references/` (D-8), run the after.
      **Accept:** `inputs/evidence/B.md` shows no scenario worse after; the skill-size advisory no
      longer lists them, or the row says why.
- [ ] 5.3 Rerun every suite as "after". **Accept:** `inputs/evidence/suites.md` has the after column;
      any case worse than before is investigated and its verdict recorded.

## 6. Release documentation and verification

- [ ] 6.1 CHANGELOG under Unreleased: what users notice (skills that now trigger where they should;
      the eval suites and `evals/README.md` for contributors). **Accept:** lines written for the
      reader, per batch merged.
- [ ] 6.2 `make validate`, `make validate-spine`, `npm run test:opencode-installer` and
      `openspec validate restructure-and-evaluate-catalogue --strict`. **Accept:** all green.
- [ ] 6.3 Total spend across `inputs/evidence/*.md` against the approvals. **Accept:** the sum is ≤
      the sum of the approved amounts and is stated in the final PR.

## Roadmap

- [x] 0.1 · [ ] 0.2 · [ ] 0.3
- [ ] 1.1 · [ ] 1.2
- [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6
- [ ] 3.1 · [ ] 3.2 · [ ] 3.3 · [ ] 3.4
- [ ] 4.0 · [ ] 4.1 · [ ] 4.2 · [ ] 4.3 · [ ] 4.4
- [ ] 5.1 · [ ] 5.2 · [ ] 5.3
- [ ] 6.1 · [ ] 6.2 · [ ] 6.3

Phases run in order; within Phase 1, D, E and the re-check use no model and need no approval; they may run in
parallel with C. The EPIC may stop after any phase whose results the owner judges sufficient
(proposal: appetite).

## Verification

The gates of 6.2 green, an evidence file per batch, spend within the approvals, and this PLAN scored
≥ 9/10 by `clarity-gate`.
