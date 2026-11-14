<!-- STATUS: PLAN derived and attacked 2026-11-14. Nothing delivered. -->

# PLAN (tasks): test suite care

**Derives from:** [`proposal.md`](proposal.md) and [`design.md`](design.md). Three stages, one pull
request each in skillery; the trial pull requests live in the trial repositories. Every task names
the design decision it carries out. After any skill edit: `make bundles`, `make skill-inventory`,
`make lint`. Before each stage PR: `make validate`.

## 1. Stage 1: the audit for Python suites, the rules, the distilling, the lanes

- [ ] 1.0 Scenario sign-off: the owner reads the scenarios of `specs/` and answers OQ-1 to OQ-3;
      the answers are recorded in `evidence/acceptance.md`. *Acceptance:* the file exists with the
      owner's words.
- [ ] 1.0b Baseline: `make validate` on the fresh branch, result recorded in
      `evidence/baseline.md`. *Acceptance:* the record names any check already failing.
- [ ] 1.1 Write `tests/test_test_suite_care.py` (D-15), every group. *Acceptance:* each test
      fails for its own reason (a missing script, a missing file, a checklist of 16 rules, a
      scaffold without `tests/changed.py`), recorded in `evidence/red.md`.
- [ ] 1.2 Write `skills/test-suite-care/scripts/phase_times.py` and `scripts/overlap.py` (D-3).
      *Acceptance:* the two script groups of 1.1 pass; the real-coverage test and the `-n 2` test
      pass once under `uv run --with pytest-cov --with pytest-xdist`, output in
      `evidence/scripts.md`.
- [ ] 1.3 Write `SKILL.md` and `references/measuring.md`, `scenario-map.md`, `waste.md`,
      `report.md` (D-1, D-2, D-4 to D-7), with the frontmatter and facets of D-1. *Acceptance:*
      the text groups of 1.1 pass; `make lint` is clean.
- [ ] 1.4 Register the skill: `bundles.yaml` (`meaningfy-building`), `use-cases/UC-W18`
      `served_by.skills`, README bundle cell and one "I want to…" row, `CHANGELOG.md` under
      Unreleased, `make bundles`, `make skill-inventory`. *Acceptance:* `make validate` passes.
- [ ] 1.5 Trigger probes in `tests/trigger_probes.yaml`: positive "our test suite takes too long,
      find what to cut" expects `test-suite-care`; near-miss "write tests for this function"
      expects `cosmic-python`; near-miss "which checks does this activity need" expects
      `test-strategy`. *Acceptance:* each probe is asked three times in a fresh session; the
      positive one loads the skill three times of three and each near-miss at most once of three;
      recorded in `evidence/triggers.md`.
- [ ] 1.6 The checklist in `skills/cosmic-python/references/testing-checklist.md`: amend rules 6
      and 14, add rules 17 to 21 and the Sources list; the one Gherkin rule in
      `skills/bdd-gherkin/SKILL.md` (D-8); "rules 1-16" becomes "rules 1-21" in
      `skills/test-strategy/references/software.md` and `inventory.md`; the order rule against
      EPIC B's "Checked by" applied. *Acceptance:* the checklist group of 1.1 passes;
      `tests/test_test_strategy.py` passes.
- [ ] 1.7 `test-strategy` row and pointer (D-13): the next free `CHK-` id in `inventory.md`, the
      `ADQ` row in `references/software.md`, the lanes in the Moment cell of the checklist's row,
      the pointer line in the new `SKILL.md`.
      *Acceptance:* `tests/test_test_strategy.py` passes.
- [ ] 1.8 Lanes in `project-setup` (D-10): `pytest.ini`, `Makefile.tmpl`, `tests/changed.py`
      template, its line in `scripts/scaffold.sh`, the "Developer lanes" section of
      `references/testing-setup.md`. *Acceptance:* the two lane tests of 1.1 pass: on a temporary
      git repository a change under `<package>/services/` prints `tests/unit/services` and a
      change to `pytest.ini` exits 3; `scaffold.sh` into a temporary directory produces
      `tests/changed.py` and the three targets.
- [ ] 1.9 Distilling in `epic-delivery` (D-12): tester brief, `SKILL.md` step 4, `stage-loop.md`
      step 4 and ledger row; one Examples row and one scenario in
      `tests/features/epic-delivery.feature`, one outline row in
      `tests/features/agents/team-lead.feature`; the order rule against EPIC B applied.
      *Acceptance:* `make lint` passes (agent features); a test of 1.1 finds the two report
      fields in the brief and "distilled in step 4" in the ledger row.
- [ ] 1.10 Stage review, fixes, `make validate`, PR, merge on green CI.
- [ ] 1.11 Trial on `rdf-persistence` (D-14): run A and run B on an idle machine for the unit,
      feature and integration lanes; build the map with one subagent per test folder; write the
      report; open the pull request there with both files. *Acceptance:* the report has every
      section of D-7; the map has one row per collected test function (the count matches
      `pytest --collect-only`).
- [ ] 1.12 Acceptance demo with the owner: the sample check of the map, then the discussion of
      the report; decisions recorded in the report and in `evidence/acceptance.md`.
      *Acceptance:* every proposal has a decision and a reason.
- [ ] 1.13 The approved proposals as pull requests in `rdf-persistence`, each with before and
      after (D-7). What the trial taught goes into the skill as a follow-up PR in skillery.
      *Acceptance:* each merged pull request names its proposal id; or the report records that
      none was approved.

## 2. Stage 2: UI suites

- [ ] 2.1 Spike on the trial repository named in OQ-2: the runner's JSON report, how specs name
      their scenario, where the time goes. Recorded in `inputs/spike-ui.md`.
- [ ] 2.2 Extend `tests/test_test_suite_care.py`: `references/ui-suites.md` has the four sections
      of D-9 and six rules, each with a source; checklist rule 11 names its scope. *Acceptance:*
      red, for those reasons.
- [ ] 2.3 Write `references/ui-suites.md` (D-9); scope checklist rule 11 to unit and feature
      tests; add the `ADQ` row to `skills/test-strategy/references/ui.md` and extend the pointer
      line (D-13). *Acceptance:* 2.2 and `tests/test_test_strategy.py` pass.
- [ ] 2.4 Trigger probe: "our Cypress run takes forty minutes" expects `test-suite-care`; asked
      three times, recorded as in 1.5.
- [ ] 2.5 Stage review, `make validate`, PR, merge.
- [ ] 2.6 Trial and discussion with the owner on that repository, as 1.11 to 1.13.

## 3. Stage 3: checks that are not code

- [ ] 3.1 Extend `tests/test_test_suite_care.py`: `references/non-code-checks.md` has the seven
      steps of D-11 and the words "no pass mark"; `cross-cutting.md` has the second id.
      *Acceptance:* red, for those reasons.
- [ ] 3.2 Write `references/non-code-checks.md` (D-11); add the row to
      `skills/test-strategy/references/cross-cutting.md` and extend the pointer line.
      *Acceptance:* 3.1 and `tests/test_test_strategy.py` pass.
- [ ] 3.3 Trigger probe: "is our cold reader any good, does it catch real problems" expects
      `test-suite-care`; asked three times, recorded as in 1.5.
- [ ] 3.4 Stage review, `make validate`, PR, merge.
- [ ] 3.5 Trial: assess the cold reader of `technical-writing` on one past document of this
      repository, five planted flaws, three runs on each copy; the owner reads first, then decides.
      Recorded in `evidence/non-code-trial.md`. *Acceptance:* the record has the six run results,
      the owner's own findings and the decision.
- [ ] 3.6 Archive the change (`spec-stewardship`).

## Roadmap

Stage 1 (1.0 → 1.0b → 1.1 → 1.2 ∥ 1.3 → 1.4 to 1.9 in any order → 1.10 → 1.11 → 1.12 → 1.13) →
stage 2 → stage 3. Tasks 1.6, 1.8 and 1.9 touch disjoint files and may run in parallel. Stage 1
tasks 1.6 and 1.9 are ordered against EPIC B's stages 1 and 2 by D-8 and D-12. Stages 2 and 3 do not depend on each other.

## Verification

- `tests/test_test_suite_care.py` green; `make validate` green on each stage PR.
- The spec scenarios hold by reading: the trial's report and map against `specs/test-suite-care`,
  a stage PR that distilled against `specs/epic-delivery`.
- The owner's decisions are in the report and in `evidence/acceptance.md`.
