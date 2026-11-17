<!-- STATUS: PLAN derived, attacked and gated 2026-11-14 (9.05 on the fourth run). Nothing
     delivered. Revised 2026-11-14 by owner decision (design D-35, D-36: tasks 1.9 and 3.2);
     not gated again. Revised 2026-11-15 against the three refactoring EPICs (design D-37 to
     D-42: tasks 1.0, 1.3, 1.5, 1.9, 1.13, 2.3, 3.2, 3.7 and the Roadmap); not gated again.
     Revised 2026-11-15 again by owner agreement (D-43 to D-46): stage 2 deferred (2.1 to 2.6, id
     kept), stage 3 after the retrospective tooling EPIC, 3.7 handed over, tasks 1.0 and 3.2
     and the Roadmap corrected; not gated again. Revised 2026-11-16 against the lean skills on
     develop (D-47 to D-52: tasks 1.3, 1.6, 1.8, 1.9, 3.2 and the stage 3 line); not gated
     again. Stage 1 build (1.0 to 1.10) delivered 2026-11-16 in PR #298 (D-55 to D-63); the
     trial tasks 1.11 to 1.13 are next (handover.md). -->

# PLAN (tasks): test suite care

**Derives from:** [`proposal.md`](proposal.md) and [`design.md`](design.md). Three stages, of which stage 2 is deferred (D-43), one pull
request each in skillery; the trial pull requests live in the trial repositories. Every task names
the design decision it carries out, or is procedural (sign-off, baseline, review, archive); test ids (`T-n`) are those of D-15. After any skill edit: `make bundles`, `make skill-inventory`,
`make lint`. Before each stage PR: `make validate`.

## 1. Stage 1: the audit for Python suites, the rules, the distilling, the lanes

- [x] 1.0 Scenario sign-off: the owner reads the scenarios of `specs/` and answers OQ-1 to OQ-5;
      the answers are recorded in `evidence/acceptance.md`. *Acceptance:* the file exists with the
      owner's words.
      Also put to the owner: the deviations table of the design.
      *Revised 2026-11-15 (D-43, D-45, D-46):* OQ-1 and OQ-2 wait with stage 2, OQ-4 and OQ-5
      are answered, and D-33 (the closing check) is handed over; so only OQ-3 is asked.
- [x] 1.0b Baseline: `make validate` on the fresh branch, result recorded in
      `evidence/validate-baseline.md` (D-32). *Acceptance:* the record names any check already
      failing.
- [x] 1.1 Write `tests/test_test_suite_care.py` (D-15), T-1 to T-12 and T-15. *Acceptance:* each test
      fails for its own reason (a missing script, a missing file, a checklist of 16 rules, a
      scaffold without `tests/changed.py`), recorded in `evidence/red.md`.
- [x] 1.2 Write `skills/test-suite-care/scripts/phase_times.py` and `scripts/overlap.py` (D-3).
      *Acceptance:* T-1 and T-3 to T-6 pass; T-2 and T-7 pass once under `uv run --with pytest-cov --with pytest-xdist`, output in
      `evidence/scripts.md`.
      *Reconciled:* D-28 (the three packages).
- [x] 1.3 Write `SKILL.md` and `references/measuring.md`, `scenario-map.md`, `waste.md`,
      and `assets/report-template.md` (D-1, D-2, D-4 to D-7), with the frontmatter and facets of D-1. *Acceptance:*
      T-10 passes, and the `waste.md` part of T-11.
      *Reconciled with B, C and D:* apply D-20 of the design's Delivery decisions.
      *Revised 2026-11-15 (D-40):* the skill is written lean, by the sort and the sizes of D-40:
      at most 24 KB of prose with a body near 6 KB, each pointer to a reference saying when to
      open it and what it adds, no example code copied in; the report format is a template, not
      a reference. *Acceptance, added:* the sizes by `wc -c` are in the stage's pull request and
      the budget check of `lean-skills` passes with no recorded exception.
      *Revised 2026-11-16 (D-48):* the body has the sections of the lean standard; the Gotchas
      are a Common mistakes table under `## Rules`.
- [x] 1.4 Register the skill (D-16): `bundles.yaml`, `use-cases/UC-W18-programming-team-lead.md`,
      the two README rows, `CHANGELOG.md`, `make bundles`, `make skill-inventory`. *Acceptance:*
      `make lint` is clean; `make bundles` leaves no difference; `tests/test_skill_inventory.py`
      passes.
      (`make validate` is the acceptance of 1.10.)
- [x] 1.5 Trigger probes in `tests/trigger_probes.yaml` (D-16): positive "our test suite takes too long,
      find what to cut" expects `test-suite-care`; near-miss "write tests for this function"
      expects `cosmic-python`; near-miss "which checks does this activity need" expects
      `test-strategy`. *Acceptance:* each probe is asked three times in a fresh session; the
      positive one loads the skill three times of three and each near-miss at most once of three;
      recorded in `evidence/triggers.md`.
      *Note, 2026-11-15 (D-41):* if the orchestrator of `orchestrate-external-skills` has landed,
      add the near-miss "which skill do I use to speed up our tests", which expects the
      orchestrator, and check that the orchestrator has a row for this skill. If it has not
      landed, that EPIC adds both; this task does not wait for it.
- [x] 1.6 The checklist in `skills/cosmic-python/references/testing-checklist.md`: amend rules 6
      and 14, add rules 17 to 21 and the Sources list; the one Gherkin rule in
      `skills/bdd-gherkin/SKILL.md` (D-8); "rules 1-16" becomes "rules 1-21" in
      `skills/test-strategy/references/software.md` and `inventory.md`; the order rule against
      EPIC B's "Checked by" applied. *Acceptance:* T-11 passes, and the rule-count and Gherkin parts of T-15.
      *Reconciled with B, C and D:* apply D-19 of the design's Delivery decisions.
      *Reconciled:* D-34 (comment on issue #210).
      *Revised 2026-11-16 (D-50):* the checklist additions are at most 2.5 KB, so
      `cosmic-python` stays under 24 KB; the size is in the stage's pull request.
- [x] 1.7 `test-strategy` row and pointer (D-13): the next free `CHK-` id in `inventory.md`, the
      `ADQ` row in `references/software.md`, the lanes in the Moment cell of both `CHK-2` rows,
      the pointer line in the new `SKILL.md`.
      *Acceptance:* the matrix parts of T-15 pass and `tests/test_test_strategy.py` stays green.
- [x] 1.8 Lanes in `project-setup` (D-10): `pytest.ini`, `Makefile.tmpl`, `tests/changed.py`
      template, its line in `scripts/scaffold.sh`, the "Developer lanes" section of
      `references/testing-setup.md`. *Acceptance:* T-8 and T-9 pass: on a temporary
      git repository a change under `<package>/services/` prints `tests/unit/services/` and a
      change to `pytest.ini` exits 3; `scaffold.sh` into a temporary directory produces
      `tests/changed.py` and the three targets.
      *Reconciled with B, C and D:* apply D-21 of the design's Delivery decisions.
      *Reconciled:* D-26 (the base as an argument), D-27 (T-9 pure Python; the manual
      `check-quality` run); also update `skills/project-setup/references/config-files.md` (the
      target list and the template table) and `references/layout.md`.
      *Revised 2026-11-16 (D-49):* `layout.md` is gone and `config-files.md` holds no target
      list or template table, so neither is edited. `project-setup` is 79 bytes under budget:
      the `changed.py` contract is the template's docstring, the target texts their `##` help
      comments, and `testing-setup.md` gets no new section, only its **Lanes** bullet names the
      two targets. *Acceptance, added:* `prose_budget` passes for `project-setup` with no
      `skill-budget.yaml` entry; if it cannot, the owner decides.
- [x] 1.9 Distilling in `epic-delivery` (D-12): tester brief, `SKILL.md` step 4, `stage-loop.md`
      step 4 and ledger row; the scenario in
      `tests/features/epic-delivery.feature`, the Examples row in
      `tests/features/agents/team-lead.feature`; the order rule against EPIC B applied.
      *Acceptance:* `make lint` is clean (agent features); T-12 passes.
      *Reconciled with B, C and D:* apply D-18 of the design's Delivery decisions.
      The rule on which properties the tester writes has one home, the tester's brief (D-31).
      Whichever of this task and B's task 2.4 lands first writes it; the other keeps it.
      *Revised 2026-11-14 (D-35):* the `SKILL.md` sentence, the `stage-loop.md` detail, the
      scenario and the Examples row say that a builder sorts and returns the kept list, the
      deleted list and the refactoring opportunities, and that the lead confirms. The tester's
      result line is R3's (`delivery-process-and-tools` DEC-18): this task adds none.
      *Revised 2026-11-15 (D-38):* this task starts after `delivery-process-and-tools` has
      merged. It adds the sentence of D-35 to step 4 as that EPIC wrote it and rewrites nothing
      else there; the texts say the sort happens in the stage's one fix pass, before the gate run
      that checks the pass (its DEC-4).
      *Added 2026-11-15 (D-46):* the texts also say that the severity floor applies to the
      tester's findings ("under the floor" is the reason for such a deletion), that with no
      finding above the floor the sort is the whole pass, and that the builder restores a
      deletion the lead does not confirm in the same pass.
      *Revised 2026-11-16 (D-51):* `SKILL.md` gets a clause in the **Decide and fix** item of
      "The loop of a stage", not a sentence; the detail goes into `stage-loop.md` step 4 beside
      the floor bullet, which already deletes a test under the floor and is cited, not restated.
- [x] 1.10 Stage review, fixes, PR, merge on green CI. *Acceptance:* `make validate` passes with
      T-1 to T-12 and T-15 green (T-7 and T-2 may skip in CI).
- [x] 1.11 Trial on `rdf-persistence` (D-14): run A and run B on an idle machine for the unit,
      feature and integration lanes; build the map with one subagent per test folder; write the
      report; open the pull request there with both files. *Acceptance:* the report has every
      section of D-7; the map has one row per test function (its rows match the node ids of
      `pytest --collect-only -q` with the `[...]` suffix removed, each once).
      *Done 2026-11-17 (D-64):* as the trial repository's change `test-suite-grooming`;
      `evidence/trial.md`.
- [x] 1.12 Acceptance demo with the owner (D-5, D-7, D-14): the sample check of the map, then the discussion of
      the report; decisions recorded in the report and in `evidence/acceptance.md`.
      *Acceptance:* every proposal has a decision and a reason.
      *Done 2026-11-16 (D-64):* the owner accepted every proposal and waived the sample check;
      `evidence/acceptance.md`.
- [x] 1.13 The approved proposals as pull requests in `rdf-persistence`, each with before and
      after (D-7). What the trial taught goes into the skill as a follow-up PR in skillery,
      within the budget of D-40.
      *Acceptance:* each merged pull request names its proposal id; or the report records that
      none was approved.
      *Done 2026-11-17 (D-64):* the proposals landed in one pull request whose commits name their
      proposal ids; the follow-up in skillery is tasks 1.14 and 1.15 (D-66).
- [ ] 1.14 The trial's feedback into `test-suite-care` (D-66, D-68), test first: issues #307 to
      #315 and the further items of D-66. *Acceptance:* a test per script change is red before
      and green after (fixture lines never in the phase file; `--files`; the refresher keeps the
      map on an empty or failed collection and drops a vanished test's row); each issue is
      answered by a named line of `SKILL.md`, `references/` or `assets/`; the skill stays within
      D-40 and D-53; the trigger probes still pass.
- [ ] 1.15 The trial's feedback into the other skills (D-66, D-67): `epic-delivery` #316, #317 and
      the #195 comment; `project-setup` #318; the `implementer` agent #319; `epic-planning` the
      PLAN half of #315; `cosmic-python` rule 6 (D-67). *Acceptance:* each issue is answered by a
      named line; a behavioural agent change has its Gherkin scenario; D-53 holds for every skill
      at or near 24 KB.
- [ ] 1.16 Stage review of 1.14 and 1.15, a `CHANGELOG.md` line, `make validate`, one PR whose body
      closes #307 to #319, merge on green CI (CI checked to have run on the PR before the merge).

## 2. Stage 2: UI suites (deferred 2026-11-15, D-43)

Not delivered with this EPIC. It waits until a trial repository is named and the UI rules have an
owner (issue #230). The ids are kept; the tasks are not part of this delivery.

- 2.1 *Deferred (D-43), id kept.*
- 2.2 *Deferred (D-43), id kept.*
- 2.3 *Deferred (D-43), id kept.*
- 2.4 *Deferred (D-43), id kept.*
- 2.5 *Deferred (D-43), id kept.*
- 2.6 *Deferred (D-43), id kept.*

## 3. Stage 3: checks that are not code

Starts after the retrospective tooling EPIC (`openspec/changes/delivery-retrospective`) is
delivered, no earlier than wave 4 (D-44). *Revised 2026-11-16 (D-52):* that EPIC was archived
on 2026-11-16, so only the wave remains.

- [ ] 3.1 Write T-14 (D-15). *Acceptance:* red, because the file and the id are missing.
- [ ] 3.2 Write `references/non-code-checks.md` (D-11); add the second inventory id and its row
      in `skills/test-strategy/references/cross-cutting.md`, and extend the pointer line (D-13). Link the file
      from `SKILL.md`.
      *Acceptance:* 3.1 and `tests/test_test_strategy.py` pass.
      *Reconciled with B, C and D:* apply D-22 of the design's Delivery decisions.
      *Reconciled:* D-29 names the four files and the cell.
      *Revised 2026-11-14 (D-36):* step 4 of the procedure names the two scripts as the source
      of the tokens and minutes.
      *Revised 2026-11-15 (D-40, D-42):* the file is at most 2.5 KB and the skill stays within
      24 KB; the link says when to open the file. The scripts are named at their path in
      `openspec/changes/delivery-retrospective/inputs/scripts/` and are neither moved nor
      changed; no skill is assumed for them.
      *Revised 2026-11-15 (D-44, D-46):* this task starts after the retrospective tooling EPIC
      is delivered; the file may still cite the scripts' present path until that EPIC corrects
      the line.
      *Revised 2026-11-16 (D-52):* that EPIC is delivered; the file cites the scripts in
      `skills/session-retrospective/scripts/`.
- [ ] 3.3 Trigger probe (D-16): "is our cold reader any good, does it catch real problems" expects
      `test-suite-care`; near-miss "have a reader attack this draft" expects the skill that holds
      the adversarial reader's brief (`guardrails`, EPIC D); asked three times, recorded as in 1.5.
- [ ] 3.4 Stage review, a line in `CHANGELOG.md`, `make validate`, PR, merge.
- [ ] 3.5 Trial (D-11): assess the cold reader of `technical-writing` on one past document of this
      repository, five planted flaws, three runs on each copy; the owner reads first, then decides.
      Recorded in `evidence/non-code-trial.md`. *Acceptance:* the record has the six run results,
      the owner's own findings and the decision.
- [ ] 3.6 Archive the change (`spec-stewardship`).
- 3.7 *Handed over 2026-11-15 (D-45), id kept.* The programme's closing check (D-33) is run in
      the last stage of `harden-checks-and-tests`, which now lands last. This EPIC runs none.

## Roadmap

Stage 1 (1.0 → 1.0b → 1.1 → 1.2 ∥ 1.3 → 1.4 → 1.5 to 1.9 in any order → 1.10 → 1.11 → 1.12 → 1.13) →
stage 3 (stage 2 is deferred, D-43). The order against the other EPICs is D-17 as replaced by D-37,
D-43 and D-44: stage 1 in wave 3 of the reassessment of 2026-11-15, after
`delivery-process-and-tools` and stage 1 of `lean-skills`; stage 3 after the retrospective
tooling EPIC is delivered, no earlier than wave 4; stage 2 deferred. Tasks 1.6, 1.8 and 1.9 may run in parallel: their files are disjoint, except that 1.6 and 1.9
may each add one line to `openspec/changes/harden-checks-and-tests/tasks.md`, which the lead adds. Stage 1
tasks 1.6 and 1.9 are ordered against EPIC B's stages 1 and 2 by D-8 and D-12. Stage 3 does not depend on stage 2.

## Verification

- `tests/test_test_suite_care.py` green; `make validate` green on each stage PR.
- The spec scenarios hold by reading: the trial's report and map against `specs/test-suite-care`,
  a stage PR that distilled against `specs/epic-delivery`.
- The owner's decisions are in the report and in `evidence/acceptance.md`.
