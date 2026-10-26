<!-- PLAN (tasks half). PLAN = design.md + this file. Document type: Implementation. Revision 5
     (2026-10-27: use cases, model rev. 2; clarity gate 8.5 → gaps closed → 9.1/10, task 0.4). -->

> Derived from EPIC: restructure-and-evaluate-catalogue (`proposal.md`); design in `design.md`
> (D-1…D-20). Gate for every task: `make validate` green at its end. Each batch or task group is one
> PR into `develop` (D-6), from a branch `eval/<batch>` or `arch/<group>`. **No model run happens
> without the owner's approval of that batch's estimate** (D-5). GitNexus `impact` before editing a
> symbol in `tools/`; `detect_changes` before each commit.

## Current state (2026-10-27, after the reshape): how to continue

- **Done and merged into `develop`:** batch D with the scaffolding (#72), batch E (#73), the docs and
  structure re-check (#74). Evidence in `inputs/evidence/D.md`, `E.md`, `docs.md`.
- **Reshaped** on 2026-10-27 (`inputs/2026-10-27-reshaping-qa.md`): architecture track added
  (section 3), Haiku is the record model (D-4), D-13 adopted, agent evals run their Gherkin (D-3).
- **Reshape PR:** #76, merged 2026-10-26.
- **Section 3 done (2026-10-26):** 3.1 PR #77 (`arch/area-terms`); 3.2–3.6 PR #78
  (`arch/use-cases`, stacked). The owner rendered the class-view SVG and approved 3.5
  (`inputs/approvals.md`).
- **Next:** 2.4 (batch C on Haiku), then section 4, within the ≈ $3.19 left of the $5 approval;
  Haiku only, no Opus.
- **Not blocking:** the `ANTHROPIC_API_KEY` repository secret; until then every run is local on the
  owner's login, approved per batch.

## 0. Preconditions

- [x] 0.1 Score the PLAN (revision 3) with the full `clarity-gate`. **Accept:** ≥ 9/10. *(Scored 8.9, the
      round-2 gaps closed, accepted by the owner.)*
- [x] 0.2 The owner approves the calibration together with batch C's provisional estimate.
      **Accept:** recorded in `inputs/approvals.md`.
- [x] 0.3 Calibrate (D-12): one query on `sonnet` and one on `haiku`. **Accept:** both unit costs and
      model ids in `inputs/approvals.md`.
- [x] 0.4 Re-score this PLAN (revision 5) with the full `clarity-gate`. **Accept:** ≥ 9/10, the score
      in the header comment of both PLAN files.

## 1. Shared scaffolding (no model runs)

- [x] 1.1 Write `evals/README.md` (D-11) and its register row. **Accept:** `make validate` green.
- [x] 1.2 Write `inputs/evidence/TEMPLATE.md` with the D-1 columns. **Accept:** exactly ten columns.

## 2. Phase 1: batches D, E, C and the re-check

- [x] 2.1 **Batch D:** probes for `linkml-engineering` and `modelling-conventions`. **Accept:**
      `inputs/evidence/D.md` lists the 4 probes.
- [x] 2.2 **Batch E:** resolve the one-way Related pairs by D-9. **Accept:** `inputs/evidence/E.md`.
- [x] 2.3 **Batch C** trigger set `evals/triggers/executive-communication.json`. **Accept:** 20
      entries, valid JSON.
- [ ] 2.4 **Batch C on Haiku with D-13.** The owner confirms the switch in `inputs/approvals.md`
      (Haiku, within the remaining approval). Write `evals/triggers/to_cases.py` with its self-check;
      update `evals/README.md` for D-4 and D-13 (drop the `run_eval.py` route). Run the Haiku
      "before"; draft the description on Haiku (≤ 600 characters, posture `profiled`: name the bind
      switch); Haiku "after"; rerun the seed case `quotation-bind`; add a positive and a near-miss
      probe. **Accept:** `inputs/evidence/C.md` has the row with both scores and the cost; the D-2
      pass rule holds, or the row says "reverted"; `python evals/triggers/to_cases.py --self-check`
      passes.
- [x] 2.5 **Docs and structure re-check** (D-10). **Accept:** `inputs/evidence/docs.md`.
- [ ] 2.6 Phase 1 PRs, one per batch. *(D #72, E #73, docs #74 merged; C pending.)* **Accept:** all
      merged into `develop` with CI green.

## 3. Phase 2: the architecture track (no model runs)

One PR per task group. Each starts with the check or generator and a failing fixture.

- [x] 3.1 **Area terms** (D-20): add `operations`, `business`, `legal`, `design` to `area` in
      `facets.yaml`, each with its one-line definition. **Accept:** `make validate` green.
- [x] 3.2 **Use-case catalogue** (D-14): the `use_case_catalogue` lint check with negative tests;
      `use-cases/UC-W1…UC-W21-*.md` seeded from `inputs/2026-10-27-scenarios.md` (S<n> → UC-W<n>),
      each with a success guarantee; `make skill-inventory` renders `docs/use-cases.md` (by area,
      status, change), with
      its drift test and register row. **Accept:** 21
      use-case files pass the check; in `docs/use-cases.md` each UC-W<n> has the status of S<n> in
      the seed gap map, after the D-14 area mapping; a use case with an unknown `area` fails the
      check.
- [x] 3.3 **Foundation skills** (D-15): the `cross_skill_paths` lint error with negative tests;
      create the foundation skill `meaningfy-voice` in `meaningfy-core` holding
      `company-voice.md`; repoint `executive-communication` and `explanatory-writing` by name;
      resolve every other cross-skill path the check finds (rule of two, or a name citation); probes
      for `meaningfy-voice`; add `requires: [meaningfy-core]` to every bundle whose skills cite a
      core foundation skill (at least `meaningfy-consulting`); `make bundles`, `make skill-inventory`.
      **Accept:** `cross_skill_paths` clean in `make validate`; `meaningfy-voice` is in
      `meaningfy-core` and every citing bundle is core or requires it (checked by reading
      `bundles.yaml` in the PR); the resolved paths listed in `inputs/evidence/foundation.md`.
- [x] 3.4 **The model** (D-16): `docs/catalogue-architecture.md` with the class view (rev. 2) from
      `inputs/2026-10-27-catalogue-model.class.puml` and its rendered SVG, the area↔domain mapping
      with `define-ai-domains` (D-20), and a register row. **Accept:** every class names a file or
      check that exists, or is marked "planned (change …)"; the SVG is re-rendered by hand from the
      committed source in the same commit.
- [x] 3.5 **Target structure, roster and roadmap** (D-17, D-19): in
      `docs/catalogue-architecture.md`, the target bundles by activity, the agent roster (agent, type,
      use cases, bundle, change) and the roadmap (follow-on changes in waves, including the
      infrastructure changes of D-19); set `change` in every use case. The owner approves.
      **Accept:** approval dated in `inputs/approvals.md`; every use case with `status` `partial` or
      `missing` has a `change` that appears in the roadmap.
- [x] 3.6 **Three doors** (D-18): the README documentation section becomes Install / Use / Develop,
      linking `docs/use-cases.md` and `docs/catalogue-architecture.md`. **Accept:** each door has at
      least one link and every link resolves (`make validate`); nothing else in the README changes.

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

## 7. Release documentation and verification

- [ ] 7.1 CHANGELOG under Unreleased, per merged PR, written for the reader: the use-case catalogue
      and doors (users), `meaningfy-voice` (installers of core), skills that now trigger where they
      should, the eval suites (contributors).
- [ ] 7.2 `make validate`, `make validate-spine`, `npm run test:opencode-installer` and
      `openspec validate restructure-and-evaluate-catalogue --strict`. **Accept:** all green.
- [ ] 7.3 Total spend across `inputs/evidence/*.md` against the approvals. **Accept:** the sum is ≤
      the approved amounts and is stated in the final PR.

## Roadmap

- [x] 0.1 · [x] 0.2 · [x] 0.3 · [x] 0.4
- [x] 1.1 · [x] 1.2
- [x] 2.1 · [x] 2.2 · [x] 2.3 · [ ] 2.4 · [x] 2.5 · [ ] 2.6
- [x] 3.1 · [x] 3.2 · [x] 3.3 · [x] 3.4 · [x] 3.5 · [x] 3.6
- [ ] 4.1 · [ ] 4.2 · [ ] 4.3 · [ ] 4.4
- [ ] 5.0 · [ ] 5.1 · [ ] 5.2 · [ ] 5.3 · [ ] 5.4
- [ ] 6.1 · [ ] 6.2 · [ ] 6.3
- [ ] 7.1 · [ ] 7.2 · [ ] 7.3

Section 3 runs first; 2.4 and sections 4–6 wait until it is done (owner, 2026-10-27). Within section
3: 3.1 before 3.2 and 3.4; 3.2 before 3.5; 3.4 before 3.5; 3.2 and 3.4 before 3.6; 3.3 is
independent. Then 2.4, then sections 4–6 in order (batch A uses the near-misses the
use cases reveal). The EPIC may stop after any phase whose results the owner judges sufficient.

## Verification

The gates of 7.2 green, an evidence file per batch, the use-case catalogue and its generated view in
place, spend within the approvals, and this PLAN scored ≥ 9/10 by `clarity-gate`.
