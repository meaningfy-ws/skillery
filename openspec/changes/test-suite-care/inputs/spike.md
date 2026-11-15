# Spike and survey record: test suite care (EPIC E)

**Secondary input, never groomed.** Three fresh subagents, 2026-11-14, before the PLAN was derived.
Their full reports are in the session transcript; the facts the PLAN uses are here.

## Spike on `rdf-persistence` (read-only, a subset)

Subset: four files of `tests/unit/entrypoints`, 193 tests, four workers. The machine was under
heavy load, so ratios are rough and seconds are inflated. Nothing in the repository was changed.

| Question | Finding |
|---|---|
| Per-test coverage | `pytest --cov=<pkg> --cov-context=test` works with async tests, xdist and pytest-bdd. Wall time 2.3 times the run without coverage (plain coverage: 1.6 times); data file six times larger. |
| The other way | `dynamic_context = test_function` in the coverage config fails under xdist (`pytest_cov.DistCovError`) and, without xdist, collapses parametrised cases into one context. |
| Reading it back | Contexts are `<node id>\|setup`, `\|run`, `\|teardown`. SQLite tables `context`, `file`, `line_bits`; `numbits` is a bitmap of line numbers. Lines only, no branches. |
| Where the time goes | Set-up 89 %, call 11 %, teardown 0 %. Three function-scoped fixtures account for it: one costs 4.9 s per test over 49 tests. |
| Timing source | `--junitxml` gives one time per test with no phases; `--durations=0 -vv` gives text. A 12-line plugin on `pytest_runtest_logreport` and `pytest_fixture_setup` gives phases and fixture times as JSON lines. |
| Overlap | 154 of 191 tests cover a set of lines contained in one other test's set. Of 139 parametrised cases, 110 cover exactly the same lines as a sibling. |
| Link to specs | 216 scenarios, 91 requirements, 14 capabilities. No marker and no scenario id in any test. Twenty random unit tests read by name and docstring: 1 assigned with high confidence, 9 medium, 10 none (5 reach a requirement at best; 5 belong to a change whose specs are not yet in `openspec/specs`). |
| Adversarial tests | 20 files, about 620 tests. No per-test record of which found a defect; the evidence is in fix-commit bodies and delivery logs. |
| Changed-files lane | `tests/changed.py`: the mechanism (git diff against the merge base, first matching rule, fall back to the fast lane) is generic; the table of path rules is the repository's. |

Not checked: timings on an idle machine; the whole suite; branch coverage; whether async tasks
ever attribute lines to the wrong test.

## Survey of published test rules

Twenty-three candidate rules not in the catalogue, with sources (testsmells.org; *Software
Engineering at Google* ch. 11 and 12; Vocke, "The Practical Test Pyramid"; Fowler, "Eradicating
Non-Determinism in Tests"; Hammant, "The Rise of Test Impact Analysis"; Beck, Test Desiderata;
Cucumber anti-patterns; Cypress and Playwright best practices; Shi et al., FSE 2014, on test-suite
reduction). The ones the PLAN adopts are listed in `design.md` (D-8) with their source.

Two cautions from the sources: a test whose covered lines are contained in another's can still
detect faults the other misses (Shi et al.), so coverage overlap is a hint and never proof; and
Meszaros and van Deursen were cited from memory, not opened.

For a check that is not code, the sources give: the share of planted defects it finds (Mills,
defect seeding), the same verdict on a repeated run (LLM judges vary between runs), and agreement
with a person's reading of the same items. A stable verdict is not a correct one, so they are
reported together.

## Recon of skillery

- EPIC A is delivered: `skills/test-strategy/` is on `develop`; the highest inventory id is
  `CHK-144`. A new `exists` row needs a pointer line in the owning skill's `SKILL.md`
  (`tests/test_test_strategy.py`).
- `ci-cd-delivery` owns deployment only; everything about test runs in CI belongs to
  `project-setup` (its `SKILL.md`, line 24). The proposal's DEC-6 named the wrong home.
- No skill owns UI test rules. The only one is testing checklist rule 2.
- EPIC B's gated PLAN replaces the tester's brief, extends checklist rule 10, adds "Checked by" to
  every checklist rule and edits the tester row of the stage-loop ledger (its D-3, D-9).
- The Gherkin features under `tests/features/` are run by hand; a lint checks their shape.
- CI installs only `pyyaml` and `pytest`.
