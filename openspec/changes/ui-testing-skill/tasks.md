> Derives from: EPIC `ui-testing-skill` ([`proposal.md`](proposal.md)); design in [`design.md`](design.md).

<!-- PLAN (tasks half), derived 2026-11-22. Three stages, each one PR into develop. MEDIUM review
     set (epic-delivery workflow file). Layers: skill prose, lint tests, scaffold script, evidence. -->

## 1. Stage 1: the `ui-testing` skill and what moves into it

- [x] 1.1 Add the failing trigger probes to `tests/trigger_probes.yaml`.
  - Positive: "write a Playwright test for the login page", which expects `ui-testing`.
  - Positive: "our Cypress tests use cy.wait(5000), fix them", which expects `ui-testing`.
  - Near-miss: "write Gherkin scenarios for this acceptance criterion" (`bdd-gherkin`).
  - Near-miss: "our test suite takes 20 minutes, what can we drop" (`test-suite-care`).
  - Near-miss: "review the usability of these screens" (`meaningfy-code-review`).
  - *Acceptance:* the probe test fails, naming `ui-testing` as unknown.
- [x] 1.2 Write SKILL with the frontmatter and facets of D-1, the nine rules of D-2 (each citing its
  source), *Which tool* (D-4), a Quick Start and `## Boundary & Related Skills`.
  - The Quick Start shows an agent writing a log-in-then-filter scenario for a Playwright project
    and applying UI-2, UI-3, UI-4 and UI-8.
  - *Depends on:* 1.1.
  - *Acceptance:* 1.1's probes pass; `make lint` is green.
- [x] 1.3 Write ROWS (D-3): the checked-against line, then one row per rule that a tool changes,
  plus the Gherkin-runner and axe-engine rows.
  - *Acceptance:* the test of 1.5 passes.
- [x] 1.4 Write SUITE (D-5): accessibility, the browser and device matrix, the broken-screen check.
  - *Acceptance:* each part names its check id (CHK-58, CHK-147, CHK-148).
- [x] 1.5 Write the ROWS format test, test-first: add `tests/test_ui_testing_rows.py`, which fails
  when:
  - a ROWS cell has more than one line;
  - a non-empty cell has no link;
  - the "Checked against" line is missing.
  - *Acceptance:* red before 1.3, green after.
- [x] 1.6 Make the moves of D-7:
  - in CHECKLIST, the pointer for rule 2 and the scope of rule 11;
  - CHK-58 re-pointed, and CHK-147 and CHK-148 added to INVENTORY;
  - the UI-MATRIX rows;
  - the pointer lines in `bdd-gherkin` and `test-suite-care`.
  - *Acceptance:* `tests/test_test_strategy.py` is green, and no UI-MATRIX row reads `gap`.
- [x] 1.7 Declare `ui-testing` in `meaningfy-building` in `bundles.yaml`. Then run `make bundles` and
  `make skill-inventory`, and add the README entry-point row.
  - *Acceptance:* the generated files are committed and `make validate` is green.
- [x] 1.8 Write the CHANGELOG `Unreleased` line for the installer: "`ui-testing`: rules for UI tests
  in Cypress or Playwright (#230)".
- [ ] 1.9 The stage's full gates, the review set and the merge, as the stage loop of
  `epic-delivery` runs them.

## 2. Stage 2: `project-setup` records the UI tool

- [x] 2.1 Write the failing tests in TPL-TESTS:
  - `--ui-tool playwright` in a Python project adds the two dependencies, the `conftest.py`, the
    `ui-browsers` target and the `AGENTS.md` line;
  - `--ui-tool playwright --typescript`, and the same with a `frontend/` folder, writes
    `playwright.config.ts`, the `package.json`, the `test-ui` target and the line, under
    `frontend/` when that folder exists;
  - `--ui-tool cypress` writes `cypress.config.js`, the `package.json` (or warns if one exists),
    the `test-ui` target and the line;
  - `none` changes nothing;
  - `library` with `--ui-tool` exits 2;
  - an unknown value exits 2.
  - *Acceptance:* all fail for the right reason.
- [x] 2.2 Implement D-6 in SCAFFOLD and the templates. The dependencies are pinned to the latest
  PyPI release on the day of the task, in the same form as the other pins.
  - *Depends on:* 2.1.
  - *Acceptance:* 2.1 is green; a scaffolded repository passes its own `make check-bindings`.
- [x] 2.3 Add the question to INTERVIEW and the pointer line to TESTING-SETUP.
- [x] 2.4 Smoke run (RISK-4): scaffold with `--ui-tool playwright` into `$TMPDIR`, then run
  `uv sync` and `make ui-browsers`. Record the result in the PR body.
  - *Acceptance:* both exit 0, or the failure is recorded as a `D-n` with an issue.
- [ ] 2.5 The CHANGELOG line, the full gates, the review set and the merge.

## 3. Stage 3: the trial and the close

- [ ] 3.1 Record the trial repository's commit. Run the audit of D-8 step 1 into
  `evidence/trial-audit.md`.
  - *Acceptance:* each of UI-1 to UI-9 has a count and `file:line` citations, or "0".
- [ ] 3.2 Run the before-and-after of D-8 step 2. The lead picks the uncovered journey and names it
  in both briefs. The blind scoring goes into `evidence/trial-ab.md`.
  - *Depends on:* stage 1 merged.
  - *Acceptance:* both outputs are saved under `evidence/trial-output/`, and the trial repository
    has no change (`git -C ../entity-resolution-service-webapp status` is clean).
- [ ] 3.3 Write `evidence/failure-case.md` (D-8 step 3) and check D-8's pass condition.
- [ ] 3.4 Offer the developer a pull request to the trial repository carrying the audit's fixes,
  and record the answer in `evidence/acceptance.md`.
- [ ] 3.5 The acceptance demo, the docs stage (`evidence/docs-owed.md`), the archive, and
  `make fix-spec-links`. Comment on #230 with the merged PRs and close it.

## Roadmap

Stage 1, then stage 2, then stage 3. Stages 1 and 2 touch different files and could run in
parallel, but run in order: stage 2's `AGENTS.md` line names the skill that stage 1 creates.
Stage 3 needs stage 1 merged.
