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
- **Split (owner, 2026-10-26):** the evaluation still to do (2.4, sections 4–6, 7.3) moved to the
  parked change `evaluate-catalogue`, with the `catalogue-evaluation` spec delta. 7.1–7.2 done and the change
  archived on 2026-10-26. Next: `rebundle-by-activity`.
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
- [x] 2.5 **Docs and structure re-check** (D-10). **Accept:** `inputs/evidence/docs.md`.
- [x] 2.6 Phase 1 PRs, one per batch. *(D #72, E #73, docs #74 merged; C moved to `evaluate-catalogue`.)* **Accept:** all
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

## 7. Release documentation and verification

- [x] 7.1 CHANGELOG under Unreleased, per merged PR, written for the reader: the use-case catalogue
      and doors (users), `meaningfy-voice` (installers of core), skills that now trigger where they
      should, the eval suites (contributors).
- [x] 7.2 `make validate`, `make validate-spine`, `npm run test:opencode-installer` and
      `openspec validate restructure-and-evaluate-catalogue --strict`. **Accept:** all green.

## Roadmap

- [x] 0.1 · [x] 0.2 · [x] 0.3 · [x] 0.4
- [x] 1.1 · [x] 1.2
- [x] 2.1 · [x] 2.2 · [x] 2.3 · [x] 2.5 · [x] 2.6
- [x] 3.1 · [x] 3.2 · [x] 3.3 · [x] 3.4 · [x] 3.5 · [x] 3.6
- [x] 7.1 · [x] 7.2

Within section 3: 3.1 before 3.2 and 3.4; 3.2 before 3.5; 3.4 before 3.5; 3.2 and 3.4 before 3.6;
3.3 is independent. The evaluation tasks moved to `evaluate-catalogue` (2026-10-26).

## Verification

The gates of 7.2 green, an evidence file per batch run (D, E, docs, foundation), the use-case
catalogue and its generated view in place, and spend within the approvals.
