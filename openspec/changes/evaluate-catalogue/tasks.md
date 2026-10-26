<!-- Parked tasks, moved unchanged from restructure-and-evaluate-catalogue on 2026-10-26 (owner: "we
     will do evaluation later"). Re-derive the PLAN (design.md + this file) when the change is unparked:
     batch A's skill lists and the suites' key skills follow the bundles after rebundle-by-activity. -->

> Task numbers keep their origin in `restructure-and-evaluate-catalogue` so its records still match.

## Batch C

- [ ] 2.4 **Batch C on Haiku with D-13.** The owner confirms the switch in `inputs/approvals.md`
      (Haiku, within the remaining approval). Write `evals/triggers/to_cases.py` with its self-check;
      update `evals/README.md` for D-4 and D-13 (drop the `run_eval.py` route). Run the Haiku
      "before"; draft the description on Haiku (≤ 600 characters, posture `profiled`: name the bind
      switch); Haiku "after"; rerun the seed case `quotation-bind`; add a positive and a near-miss
      probe. **Accept:** `inputs/evidence/C.md` has the row with both scores and the cost; the D-2
      pass rule holds, or the row says "reverted"; `python evals/triggers/to_cases.py --self-check`
      passes.

## 4. Phase 3: outcome suites and agents (after approval)

- [ ] 4.1 The owner approves the Phase 3 estimate (≈ $1–2, Haiku) and the key skills. Default key
      skills: core `technical-writing`, `writing-antipatterns`, `meaningfy-git-workflow`,
      `guardrails`; consulting `executive-communication` (seed), `proposal-writing`, `estimation`,
      `semantic-consulting-coach`; architecture `architecture`, `conceptual-modelling`,
      `linkml-engineering`, `modelling-conventions`; building `epic-planning`, `cosmic-python`,
      `meaningfy-code-review`, `project-setup`; vault `vault-conventions`, `vault-project`,
      `vault-resume`, `vault-capture`. **Accept:** recorded in `inputs/approvals.md`.
- [ ] 4.2 Write the skill suites under `evals/<bundle>/` (D-3); vault cases with a `scaffold_script`
      and `--scaffold`; extend `.github/workflows/plugin-eval.yml` with `scaffold` and `allow_tools`
      inputs. **Accept:** each of the 5 bundles has ≤ 4 skill cases with an `llm` and a `tool_used`
      grader; a local run of one vault case completes.
- [ ] 4.3 **Agent cases from the Gherkin** (D-3, DEC-11): for `epic-planner`, `implementer` and
      `code-reviewer`, one return case and one refusal case each, every `prompt.md` opening with its
      `runs:` line, graded on dispatch, contract, least privilege and side effects. **Accept:** 6
      cases; each `runs:` line names a scenario that exists in its `.feature`; across the three
      agents, all four contract lists (needs, returns, side effects, refuses) are graded.
- [ ] 4.4 Run every suite once as "before" on Haiku (3 runs, `--ablation none`, a ceiling per
      bundle). A failing agent case is recorded as the agent's failure case (D-3). **Accept:**
      `inputs/evidence/suites.md` has a row per case with score and cost; total ≤ the approval.

## 5. Phase 4: batch A, the long descriptions (each sub-batch after approval)

For each sub-batch: approve → write the trigger sets (near-misses include the neighbours the use-case
catalogue revealed) → Haiku before → Haiku drafts → Haiku after → evidence → PR. Run count capped by
D-12.

- [ ] 5.0 Before each sub-batch, the owner approves its estimate. **Accept:** four dated approvals.
- [ ] 5.1 **A1:** `estimation`, `decision-package`, `project-setup`, `conceptual-modelling`,
      `proposal-writing`. **Accept:** `inputs/evidence/A1.md` has five rows with a before and after;
      every kept description is ≤ 600 characters and passes D-2; probes added.
- [ ] 5.2 **A2:** `ci-cd-delivery`, `linkml-engineering`, `modelling-conventions`,
      `writing-antipatterns`, `vault-conventions`. **Accept:** as 5.1, for `A2.md`.
- [ ] 5.3 **A3:** `explanatory-writing`, `vault-setup`, `vault-project`, `vault-capture`,
      `meaningfy-code-review`. **Accept:** as 5.1, for `A3.md`.
- [ ] 5.4 **A4:** `epic-planning`, `meaningfy-release`, `guardrails`, `vault-resume`,
      `spec-stewardship`, `vault-daily`. **Accept:** as 5.1, for `A4.md`; the description-length
      advisory is empty, or lists only skills whose row says why they stay.

## 6. Phase 5: batch B and the suites' after-pass (after approval)

- [ ] 6.1 The owner approves batch B and the suites' "after" pass (≈ $2, Haiku). **Accept:** two
      dated approvals.
- [ ] 6.2 **Batch B:** for `architecture` and `cosmic-python`, 3 scenarios each, baseline (5
      repetitions, Haiku), move detail into `references/` (D-8), after. **Accept:**
      `inputs/evidence/B.md` shows no scenario worse after; the size advisory no longer lists them, or
      the row says why.
- [ ] 6.3 Rerun every suite as "after", agent cases included. **Accept:** `inputs/evidence/suites.md`
      has the after column; any worse case has a recorded verdict.

- [ ] 7.3 Total spend across `inputs/evidence/*.md` against the approvals. **Accept:** the sum is ≤
      the approved amounts and is stated in the final PR.

