<!-- PLAN (tasks half), derived 2026-11-14; attack and the developer's round-8 answers folded in.
     Three stages, each its own PR into develop. [A] marks a task that reads EPIC A's delivered
     files (design D-12). Revised 2026-11-14 by owner decision (design D-28, D-29: tasks 2.1
     to 2.4 and 2.7); not gated again. -->

> Derives from: EPIC `harden-checks-and-tests` ([`proposal.md`](proposal.md)); design in [`design.md`](design.md).

## 1. Stage 1: `quality/`, the Ruff selection, the Semgrep rules and "Checked by"

- [x] 1.0 The developer signs off the spec scenarios of this change (the PLAN gate), recorded in
  `evidence/acceptance.md` (D-13). *Open for the developer:* the three proposals of D-24, D-25
  and D-26 (the type's name), to confirm or decline.
- [ ] 1.1 [A] Confirm A is merged and the branch is on current `develop`; walk the D-12 table
  against A as merged and note each difference in the stage PR; re-read every spec delta against
  the live specs and fix any conflict (error matrix rows 1–2). *Done on 2026-11-14 (D-15):* A is
  merged, the D-12 table is walked and the spec deltas are re-read. *Remains:* cut the stage
  branch from current `develop` and copy the differences of D-15 into the stage PR.
- [ ] 1.2 Write `evidence/failure-case.md` (D-13).
- [ ] 1.3 The Check type: add `quality` to `TOP_LEVEL_FOLDERS` and the `quality_files` lint to
  `ALL_CHECKS`, test-first (TC-01, TC-02 in `tests/test_repo_lint.py` and
  `tests/test_repo_lint_negative.py`); create `quality/README.md`; update `governance.md`,
  `AGENTS.md` (line 11 and the type table) and `CLAUDE.md` (line 4); write
  `docs/development/quality.md` and register it (D-1, D-13; spec *A check is an executable rule
  and carries no rule text*, *Only the agreed top-level folders exist*, *The quality folder holds
  the shared checks*).
- [ ] 1.4 Write the Python-only group of `tests/test_quality.py`, red first (TC-03, TC-04, TC-05,
  TC-06, TC-10), with the `skipif` markers for the tool groups; add `requirements-quality.txt`
  (Semgrep, Ruff, Hypothesis) to `make install`; add the install note to `CONTRIBUTING.md`; add
  the six tool entries to `dependencies.yaml` (D-8; spec *The quality folder's tool tests run
  locally and skip in CI*). `tests/test_quality.py` never imports Hypothesis (D-18). TC-12 is
  written as skipped, with the message "switched on by task 3.7" (D-17). *Reconciled with
  test-suite-care (EPIC E):* if its stage 1 is merged and `requirements-quality.txt` exists, its
  three packages (pytest-xdist, coverage, pytest-cov) stay in the file (D-23).
- [ ] 1.5 Ruff: copy the cases of `inputs/ruff-probe/` to `tests/fixtures/quality/ruff/` (the
  inputs stay) and write TC-13; then change `ruff.toml.tmpl`, the Ruff pin in `pyproject.toml.tmpl`
  and the `rev` in `dot-pre-commit-config.yaml` per D-2; update `config-files.md` § Ruff and
  `decisions.md` D4; comment the probe table and the accepted `Session` gap on issue #215 (D-2;
  spec *The Ruff selection flags the hygiene cases*).
- [ ] 1.6 `AP-IO-IN-MODELS`: add the `domain-no-io` contract of D-3 to `dot-importlinter.tmpl`;
  its proof is IT-04's case "`import requests` in `domain`" (D-3; spec *Every catalogued rule
  names its checker*).
- [ ] 1.7 The five gating rules in `quality/semgrep/rules/`, each fixture first (with a near
  miss), then the rule (`sparql-built-from-strings`, `exception-outside-exceptions-module`,
  `test-network-call`, `test-rdf-string-compare`, `test-real-sleep`); add the catalogue entry
  `AP-SPARQL-FROM-STRINGS` and name it in the L1 lens of `meaningfy-code-review` (D-3, the rule
  table and the worked example; spec *Every Meaningfy Semgrep rule has a fixture
  test*, *SPARQL is not built from strings*; IT-01).
- [ ] 1.8 The two report-only rules (`dict-as-model`, `free-string-key`) in
  `quality/semgrep/report-only/`, and `mfy-suppression-without-reason` in
  `quality/semgrep/suppressions/` with the *Suppressions* heading in `config-files.md` (D-3, D-6;
  IT-01).
- [ ] 1.9 ls-lint: write `quality/ls-lint/python-project.yml` (the banned names and the four
  ignored folders) and the two fixture trees (D-5; IT-02).
- [ ] 1.10 checkmake: write `quality/checkmake/python-project.ini` with the required targets and
  the body limit (D-5; TC-10, IT-03).
- [ ] 1.11 External sources: `quality/semgrep/external.json` and the template
  `external_sources.py`, test-first (TC-06, TC-09); list at most five candidate sources in the
  stage PR for the owner's approval (D-7; spec *External rule sources are recorded, pinned and
  never copied*).
- [ ] 1.12 "Checked by": add the column to the three catalogue tables and the suffix to the 16
  checklist items and the 10 clean-code and SOLID bullets, from the first assignment as confirmed
  by 1.5–1.10 (D-3; spec *Every catalogued rule names its checker*; TC-04 and TC-05 green).
  *Reconciled with test-suite-care (EPIC E):* if its stage 1 is merged, the checklist has 21
  items; items 17 to 21 each end with `*Checked by:* review only, because the audit of
  test-suite-care reads it`, and the "Sources" table after "The report" is not a list of items.
- [ ] 1.13 Project wiring. In `Makefile.tmpl`: the pin and the three tool versions,
  `quality-fetch`, `quality-tools`, `check-semgrep` (three passes), `check-layout` (ls-lint and the
  four `test -f` lines), `check-makefile`, the new `check-quality`. The template
  `quality/tools.sha256`; the `render` lines in `scaffold.sh` for the templates of D-1 that exist
  at this stage; `.quality/` in `dot-gitignore`; the cache step and the three target steps in
  `ci.yaml.tmpl`; the pin as a fourth file rendered by `tools/bundle_gen`, test-first (TC-11), and
  in `validate.yml`'s diff list. Update `ci-and-infra.md`, `layout.md`, `checklists.md`, the
  template table of `config-files.md`, the section *Adopting the shared checks* of
  `modernizing-existing-projects.md`, the "three rendered files" sentence of `AGENTS.md` and
  step 2 of `docs/development/releasing.md`, which lists the rendered files (D-4, D-5, D-13,
  D-20; spec *Projects fetch the checks at one pin*, *Projects run the shared checks through
  make*).
- [ ] 1.14 [A] Add the stage's inventory rows and software rows, flip the rows A marked for B that
  this stage fills, extend the pointer lines (D-12, D-15: `software.md`
  line 33; spec *The software rows name the static, mutation and import-contract checks*).
- [ ] 1.15 Scaffold the product and the library archetype from the stage branch with
  `QUALITY_VERSION` set to the branch's commit and run IT-04 and IT-05; paste the output into the
  stage PR. *Acceptance:* the wall time of `make check-quality` on each scaffold, with a warm
  `.quality/`, is recorded in the stage PR and in `evidence/quality-cost.md` (D-22).
- [ ] 1.16 Complete `quality/README.md` with every check of the stage (TC-02's last case; spec
  scenario *Looking for a check*); `README.md` row and `CHANGELOG.md` line; `make bundles`, `make skill-inventory`,
  `make validate`, `openspec validate harden-checks-and-tests --strict`. Close
  issue #215 with a comment naming the Ruff codes and the Semgrep rule that cover its cases (tasks
  1.5 and 1.7; D-21). A release follows this stage's merge; no task assumes its number (D-19).

## 2. Stage 2: the tester's methods and range

- [ ] 2.1 [A] Walk the D-12 table again (A-4, A-6, A-7).
  *Revised 2026-11-14 (D-28, D-29):* the developer signs off the scenarios that changed after
  task 1.0 (the two MEDIUM scenarios, *The scaling has one source*, and the three of *A
  challenge or check result ends in one line*) and confirms the form of the result line;
  recorded in `evidence/acceptance.md`.
- [ ] 2.2 `tests/features/epic-delivery.feature`: the MEDIUM row names the tester; add the four
  scenarios of D-9, one per scenario of the spec requirement (D-9; spec *The adversarial tester
  works by stated methods*).
  *Revised 2026-11-14 (D-28, D-29):* the MEDIUM row names the tester with its condition; add
  the scenario *A MEDIUM stage with nothing for the tester* and the three of the result line.
- [ ] 2.3 Set `reviews.MEDIUM.tester` in `epic-delivery.workflow.json`; run `make mods` and
  `make bundles` (D-9; spec *The loop scales with the appetite*).
  *Revised 2026-11-14 (D-28):* the value is the wording with the condition.
- [ ] 2.4 Replace the tester brief in `team-and-briefs.md`; add the report rule to the tester's
  row of the check ledger in `stage-loop.md`; repoint
  `docs/practice/ai-coding/working-with-agents.md` (D-9; spec *The adversarial tester works by
  stated methods*). The brief names the adversary stance with `ROB` and `RSK`, not `ADQ`
  (D-16). The scenarios of 2.2 are written scenarios, not executed tests: the stage's
  checker reads the brief against each of them.
  *Reconciled with test-suite-care (EPIC E):* if its stage 1 is merged, keep the brief's two
  report fields (what each test attacks; whether it failed on its first run) and the words
  "Distilled in step 4" in the tester's ledger row; its test T-12 stays green.
  The rule on which properties the tester writes (one per row of the PLAN's `## Invariants`
  section where it has one, else per error-matrix row) has one home, this brief. Whichever of
  this task and test-suite-care's task 1.9 lands first writes it; the other keeps it.
  *Revised 2026-11-14 (D-29):* define the result line once under *What every brief names* and
  name it in the Report line of the tester's, the reviewer's and the checker's brief; the
  ledger rule returns a report without it as incomplete (spec *A challenge or check result ends
  in one line*).
- [ ] 2.5 `cosmic-python`: extend checklist item 10 and add the stateful and the Schemathesis
  example to `example-testing-patterns.md`; pin Hypothesis and Schemathesis in the `test` group of
  `pyproject.toml.tmpl` and confirm `poetry lock` on a scaffold (D-9, D-4).
- [ ] 2.6 [A] Update the tester and property-test rows of the inventory and the software file
  (`CHK-17`, `CHK-5`), and fill the `ROB` row "stateful and contract-driven properties for the
  tester" (`software.md` line 45, `gap → B`): it takes the next free id and status `exists`
  (D-12, D-15).
- [ ] 2.7 `CHANGELOG.md` line naming the change for MEDIUM EPICs, with the condition (D-28), and
  the result line (D-29); `make bundles`,
  `make skill-inventory`, `make validate`, `openspec validate harden-checks-and-tests --strict`.

## 3. Stage 3: the weekly mutation report and the import-contract check

- [ ] 3.1 [A] Walk the D-12 table again (A-1, A-2, A-3).
- [ ] 3.2 The template `check_contracts.py`, test-first (TC-07) (D-11; spec *Import contracts are
  checked on every pull request*).
- [ ] 3.3 Move `dot-importlinter.tmpl` to the container form with `exhaustive = true` and the six
  layers of D-11, single and multi-component; raise the import-linter pin; add the script to
  `check-architecture` in `Makefile.tmpl` and its `render` line to `scaffold.sh`; scaffold the
  product and the library archetype and run `make check-architecture` on each, green; update
  `architecture-guardrails.md` and the import-contract step of
  `modernizing-existing-projects.md` (D-11, D-13).
- [ ] 3.4 The per-EPIC judgement: first the three scenarios in
  `tests/features/agents/code-reviewer.feature`; then the L3 lens text in `meaningfy-code-review`,
  and the reviewer brief and the ledger row in `epic-delivery` (D-11; spec *L3 judges the import
  contracts once per EPIC*).
- [ ] 3.5 The template `mutation_report.py`, test-first (TC-08) (D-10).
- [ ] 3.6 mutmut in the template: first resolve the lock in D-10's order on a scaffold; then
  `[tool.mutmut]` and the pin in `pyproject.toml.tmpl`; `mutation-report` and `mutation-pr` in
  `Makefile.tmpl`; `ci/mutation.yml.tmpl` and the script's `render` lines in `scaffold.sh` (code
  archetypes); `mutants/` in `dot-gitignore`; update `ci-and-infra.md` (with the setup note),
  `decisions.md` (the D2 exception) and `layout.md` (D-10; spec *Mutation results arrive weekly
  and never fail a build*).
- [ ] 3.7 [A] Add the mutation and import-contract rows (`software.md` lines 41 and 34, each with
  the next free id), update the L3 row `CHK-82` in
  `skills/test-strategy/references/architecture.md`, flip the last rows A marked for B and remove
  the sentence about "`gap → B` rows" from line 3 of `software.md`; switch TC-12 on (D-12, D-15,
  D-17).
  *Reconciled 2026-11-14:* A's mutation row names `cosmic-python` as technique owner, but this
  stage writes the mutation rule into `project-setup`. The row's owner becomes `project-setup`,
  with its pointer line, when the row turns `exists`.
- [ ] 3.8 Ask the developer which repository is the sample project (Q-22, with D-13's
  recommendation); run IT-06 there: the three manual dispatches of the weekly workflow, and one
  failing and one passing `make check-architecture`; record them in
  `evidence/sample-project.md` (DEC-15, D-13).
- [ ] 3.9 Save this stage's tester report as `evidence/tester-report.md` (IT-07; DEC-15, D-13).
  The tester's property tests go in `tests/test_quality_properties.py`, not in
  `tests/test_quality.py` (D-18).
- [ ] 3.10 `CHANGELOG.md` line; `make bundles`, `make skill-inventory`, `make validate`,
  `openspec validate harden-checks-and-tests --strict`.
- [ ] 3.11 Acceptance demo with the developer: the three proofs of DEC-15, verdict in
  `evidence/acceptance.md` (D-13).

## Roadmap

- [x] 1.0 · [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [ ] 1.7 · [ ] 1.8 · [ ] 1.9
  · [ ] 1.10 · [ ] 1.11 · [ ] 1.12 · [ ] 1.13 · [ ] 1.14 · [ ] 1.15 · [ ] 1.16 · [ ] 2.1 · [ ] 2.2
  · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6 · [ ] 2.7 · [ ] 3.1 · [ ] 3.2 · [ ] 3.3 · [ ] 3.4 · [ ] 3.5
  · [ ] 3.6 · [ ] 3.7 · [ ] 3.8 · [ ] 3.9 · [ ] 3.10 · [ ] 3.11

Tasks 1.5 to 1.11 are independent of each other and may be built in parallel; so may 3.2–3.4 and
3.5–3.6.

## Verification

Per stage: `make validate` green (it includes `tests/test_quality.py`, the repo lint and the
bundle gates), `make mods` green in stage 2, `openspec validate harden-checks-and-tests --strict`,
and the stage's scaffold runs recorded (IT-04 and IT-05 in the stage 1 PR, task 3.3's in the
stage 3 PR). For the EPIC: the three proofs of DEC-15 in `evidence/`, and the developer's verdict
in `evidence/acceptance.md`.
