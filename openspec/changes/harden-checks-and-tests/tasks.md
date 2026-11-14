<!-- PLAN (tasks half), derived 2026-11-14; attack and the developer's round-8 answers folded in.
     Three stages, each its own PR into develop. [A] marks a task that reads EPIC A's delivered
     files (design D-12). -->

> Derives from: EPIC `harden-checks-and-tests` ([`proposal.md`](proposal.md)); design in [`design.md`](design.md).

## 1. Stage 1: `quality/`, the Ruff selection, the Semgrep rules and "Checked by"

- [ ] 1.0 The developer signs off the spec scenarios of this change (the PLAN gate), recorded in
  `evidence/acceptance.md` (D-13).
- [ ] 1.1 [A] Confirm A is merged and the branch is on current `develop`; walk the D-12 table
  against A as merged and note each difference in the stage PR; re-read every spec delta against
  the live specs and fix any conflict (error matrix rows 1–2).
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
  locally and skip in CI*).
- [ ] 1.5 Ruff: copy the cases of `inputs/ruff-probe/` to `tests/fixtures/quality/ruff/` (the
  inputs stay) and write TC-13; then change `ruff.toml.tmpl`, the Ruff pin in `pyproject.toml.tmpl`
  and the `rev` in `dot-pre-commit-config.yaml` per D-2; update `config-files.md` § Ruff and
  `decisions.md` D4; comment the probe table and the accepted `Session` gap on issue #215 (D-2;
  spec *The Ruff selection flags the hygiene cases*).
- [ ] 1.6 `AP-IO-IN-MODELS`: add the `forbidden` contract with `include_external_packages` to
  `dot-importlinter.tmpl`; show on a scaffolded project that it is green on the skeleton and red
  on `import requests` in the domain layer (D-3).
- [ ] 1.7 The five gating rules in `quality/semgrep/rules/`, each fixture first (with a near
  miss), then the rule (`sparql-built-from-strings`, `exception-outside-exceptions-module`,
  `test-network-call`, `test-rdf-string-compare`, `test-real-sleep`); add the catalogue entry
  `AP-SPARQL-FROM-STRINGS` (D-3, worked example; spec *Every Meaningfy Semgrep rule has a fixture
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
- [ ] 1.13 Project wiring. In `Makefile.tmpl`: the pin and the three tool versions,
  `quality-fetch`, `quality-tools`, `check-semgrep` (three passes), `check-layout` (ls-lint and the
  four `test -f` lines), `check-makefile`, the new `check-quality`. The template
  `quality/tools.sha256`; the `render` lines in `scaffold.sh` for the templates of D-1 that exist
  at this stage; `.quality/` in `dot-gitignore`; the cache step and the three target steps in
  `ci.yaml.tmpl`; the pin as a fourth file rendered by `tools/bundle_gen`, test-first (TC-11), and
  in `validate.yml`'s diff list. Update `ci-and-infra.md`, `layout.md`, `checklists.md`, the
  template table of `config-files.md`, the section *Adopting the shared checks* of
  `modernizing-existing-projects.md` and the "three rendered files" sentence of `AGENTS.md` (D-4,
  D-5, D-13; spec *Projects fetch the checks at one pin*, *Projects run the shared checks through
  make*).
- [ ] 1.14 [A] Add the stage's inventory rows and software rows, flip the rows A marked for B that
  this stage fills, extend the pointer lines (D-12; spec *The software rows name the checks that
  harden-checks-and-tests adds*).
- [ ] 1.15 Scaffold the product and the library archetype from the stage branch with
  `QUALITY_VERSION` set to the branch's commit and run IT-04 and IT-05; paste the output into the
  stage PR.
- [ ] 1.16 `README.md` row and `CHANGELOG.md` line; `make bundles`, `make skill-inventory`,
  `make validate`, `openspec validate harden-checks-and-tests --strict`.

## 2. Stage 2: the tester's methods and range

- [ ] 2.1 [A] Walk the D-12 table again (A-4, A-6, A-7).
- [ ] 2.2 `tests/features/epic-delivery.feature`: the MEDIUM row names the tester; add a scenario
  for the properties table in the report and one for a stage without Python (D-9; spec *The
  adversarial tester works by stated methods*).
- [ ] 2.3 Set `reviews.MEDIUM.tester` in `epic-delivery.workflow.json`; run `make mods` and
  `make bundles` (D-9; spec *The loop scales with the appetite*).
- [ ] 2.4 Replace the tester brief in `team-and-briefs.md`; add the report rule to the tester's
  row of the check ledger in `stage-loop.md`; repoint
  `docs/practice/ai-coding/working-with-agents.md` (D-9).
- [ ] 2.5 `cosmic-python`: extend checklist item 10 and add the stateful and the Schemathesis
  example to `example-testing-patterns.md`; pin Hypothesis and Schemathesis in the `test` group of
  `pyproject.toml.tmpl` and confirm `poetry lock` on a scaffold (D-9, D-4).
- [ ] 2.6 [A] Update the tester and property-test rows of the inventory and the software file
  (D-12).
- [ ] 2.7 `CHANGELOG.md` line naming the change for MEDIUM EPICs; `make bundles`,
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
- [ ] 3.4 The per-EPIC judgement: the L3 lens text in `meaningfy-code-review`; the reviewer brief
  and the ledger row in `epic-delivery` (D-11; spec *L3 judges the import contracts once per EPIC*).
- [ ] 3.5 The template `mutation_report.py`, test-first (TC-08) (D-10).
- [ ] 3.6 mutmut in the template: first resolve the lock in D-10's order on a scaffold; then
  `[tool.mutmut]` and the pin in `pyproject.toml.tmpl`; `mutation-report` and `mutation-pr` in
  `Makefile.tmpl`; `ci/mutation.yml.tmpl` and the script's `render` lines in `scaffold.sh` (code
  archetypes); `mutants/` in `dot-gitignore`; update `ci-and-infra.md` (with the setup note),
  `decisions.md` (the D2 exception) and `layout.md` (D-10; spec *Mutation results arrive weekly
  and never fail a build*).
- [ ] 3.7 [A] Add the mutation and import-contract rows, update the L3 row, flip the last rows A
  marked for B; switch TC-12 on (D-12).
- [ ] 3.8 Ask the developer which repository is the sample project (Q-22, with D-13's
  recommendation); run IT-06 there: one manual dispatch of the weekly workflow up to its pull
  request, and one failing and one passing `make check-architecture`; record them in
  `evidence/sample-project.md` (DEC-15, D-13).
- [ ] 3.9 Save this stage's tester report as `evidence/tester-report.md` (IT-07; DEC-15, D-13).
- [ ] 3.10 `CHANGELOG.md` line; `make bundles`, `make skill-inventory`, `make validate`,
  `openspec validate harden-checks-and-tests --strict`.
- [ ] 3.11 Acceptance demo with the developer: the three proofs of DEC-15, verdict in
  `evidence/acceptance.md` (D-13).

## Roadmap

- [ ] 1.0 · [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [ ] 1.7 · [ ] 1.8 · [ ] 1.9
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
