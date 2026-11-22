<!-- PLAN (design half), derived 2026-11-22. DEC-n are the EPIC's, cited not restated. -->

> Derives from: EPIC `ui-testing-skill` ([`proposal.md`](proposal.md)).

## Context

The material is quoted in `inputs/seeds/parked-sources.md`:
- the six parked rules;
- checklist rule 2;
- the UI matrix, which has two gaps.

The trial repository has a Playwright 1.58 suite in TypeScript (`inputs/trial-baseline.md`).
`project-setup` scaffolds Python repositories with uv and pytest. `pytest-bdd` is already pinned
there, and the scaffold has a `frontend/` convention, an `e2e` tier and a `test-e2e` target.

The paths this plan uses by short name:

| Short name | Path |
|---|---|
| SKILL | `skills/ui-testing/SKILL.md` |
| ROWS | `skills/ui-testing/references/per-tool.md` |
| SUITE | `skills/ui-testing/references/suite-checks.md` |
| CHECKLIST | `skills/cosmic-python/references/testing-checklist.md` |
| UI-MATRIX | `skills/test-strategy/references/ui.md` |
| INVENTORY | `skills/test-strategy/references/inventory.md` |
| SCAFFOLD | `skills/project-setup/scripts/scaffold.sh` |
| INTERVIEW | `skills/project-setup/references/interview.md` |
| TESTING-SETUP | `skills/project-setup/references/testing-setup.md` |
| TPL-TESTS | `tests/test_project_setup_templates.py` |

## Goals / Non-Goals

**Goals:** the EPIC's Solution outline. **Non-goals:** the EPIC's No-gos.

## Decisions

### D-1 Shape (DEC-1)

The skill follows the lean standard: under 24 KB, with no budget exception.
- SKILL holds the Quick Start, rules UI-1 to UI-9, *Which tool* (D-4) and
  `## Boundary & Related Skills`.
- ROWS is opened "when you write or review a test in a known tool".
- SUITE is opened "when you set up the accessibility check, the browser matrix or a broken-screen
  check".
- The facets are those of `test-suite-care`: quality, coding, generic, reusable, verify,
  experimental.
- The last line of SKILL: `Answers VER, ADQ, ROB, RSK in test-strategy's matrix (references/ui.md)`.

**Boundary.** The skill owns how UI tests are written and run. It delegates:
- Gherkin to `bdd-gherkin`;
- non-UI test rules to CHECKLIST;
- the UX lens to `meaningfy-code-review`;
- suite cost to `test-suite-care`.

### D-2 The nine rules

Each rule cites its source in SKILL.

| Id | Rule | Source |
|---|---|---|
| UI-1 | Component tests live next to the code they test; end-to-end scenarios are Gherkin features, one per use case | checklist rule 2 |
| UI-2 | Set state through the API or a stored session, not the screen; only the log-in use case logs in through the screen | Cypress best practices, "Organizing tests, logging in, controlling state" |
| UI-3 | Select by role, label or `data-testid`; never by CSS class, XPath or position | Cypress, "Selecting elements"; Playwright, "Use locators" |
| UI-4 | Use assertions that retry until a deadline; no fixed wait | Cypress, "Unnecessary waiting"; Playwright, "Use web first assertions"; checklist rule 12 |
| UI-5 | Never visit a site you do not control; stub third parties at the network layer | Cypress, "Visiting external sites" |
| UI-6 | Reset state before a test, not after | Cypress, "Using after or afterEach hooks" |
| UI-7 | One journey groups its assertions | Cypress, "Creating tiny tests with a single assertion" |
| UI-8 | Run an accessibility check on every page a scenario visits (D-5) | checklist rule 2, CHK-58 |
| UI-9 | Retries are 0 on every lane; a test that is sometimes red on unchanged code is quarantined under checklist rule 14 | checklist rule 14; the parked "waste" list |

### D-3 Per-tool rows (DEC-2, RISK-2)

ROWS is one table with the columns Rule | Cypress | Playwright.
- Each cell is one line: the API name or the setting, and a link to the tool's documentation.
- A rule that is the same in both tools reads "no tool-specific step".
- A Playwright cell names the TypeScript and the Python form, for example `getByRole` /
  `get_by_role`.
- Above the table: `Checked against Cypress <v> and Playwright <v> on <date>`.
- Two extra rows:
  - the Gherkin runner: `@badeball/cypress-cucumber-preprocessor`; `pytest-bdd` (Python) or
    `playwright-bdd` (TypeScript);
  - the axe engine: `cypress-axe`; `@axe-core/playwright` or `axe-playwright-python`.

The test of task 1.5 holds this format.

### D-4 Which tool (DEC-5)

1. Read the `UI tests: <Cypress|Playwright> (<language>)` line in the project's `AGENTS.md`.
2. If it is missing, use the config file found at the root or under `frontend/`
   (`playwright.config.*`, `cypress.config.*`).
3. If both files are found, or neither: ask the developer. Never pick one.

### D-5 Suite checks (DEC-4): SUITE

- **Accessibility (VER, ROB; CHK-58).**
  - axe runs on every visited page once a retrying assertion has passed.
  - It fails the run on `critical` or `serious` findings.
  - An accepted finding goes into `tests/e2e/a11y-accepted.json` (a list of objects) with the rule id, the selector, an
    issue link and a date.
  - The check is never switched off for a whole suite.
- **Browser and device matrix (RSK; CHK-147).**
  - Each pull request runs Chromium on desktop at 1280×720.
  - The release branch's gate runs Chromium, Firefox and WebKit on desktop, plus one phone
    viewport (Playwright `Pixel 7`, Cypress `iphone-x`).
  - A project may list fewer browsers in `AGENTS.md`. That list shrinks only the release matrix.
  - No scheduled run (`test-suite-care` D-10).
- **Broken-screen check (ADQ; CHK-148).**
  - Whoever adds a scenario breaks the screen twice on purpose and confirms the scenario fails each
    time:
    1. the element its first `Then` checks is removed;
    2. the page's API call returns an error, through the stub.
  - Then the break is reverted.
  - A scenario that still passes is a failed check. Under `epic-delivery` it is a finding for the
    tester.
  - The PR body records one line: `broken-screen: <scenario> fails on element / on API error`.

### D-6 Scaffold (DEC-5)

SCAFFOLD gains `--ui-tool playwright|cypress|none`, for `product` only. The default `none` changes
nothing.

A project is TypeScript when `--typescript` is given or a `frontend/` folder exists. This is the
trigger the scaffold already uses for Serena. Any other project is Python. The developer decided
this at sign-off.

| Answer | Files | Target |
|---|---|---|
| `playwright`, Python | `pytest-playwright` and `axe-playwright-python` pinned in the `test` group; `tests/e2e/conftest.py` (base URL from `UI_BASE_URL`, the axe check of D-5) | `test-e2e` runs it; a new `ui-browsers` target runs `uv run playwright install --with-deps chromium` |
| `playwright`, TypeScript | `playwright.config.ts` (`testDir: tests/e2e`); a `package.json` with only `@playwright/test`, `playwright-bdd` and `@axe-core/playwright` | `test-ui`: `npx playwright test` |
| `cypress` | `cypress.config.js` (`specPattern: tests/e2e/**/*.feature`); a `package.json` with only `cypress`, `@badeball/cypress-cucumber-preprocessor` and `cypress-axe` | `test-ui`: `npx cypress run` |

In both Node rows:
- an existing `package.json` is left alone, with a warning naming the dependencies to add;
- the files go under `frontend/` when that folder exists.

Each tool also writes the line `UI tests: <tool> (<language>)` into `AGENTS.md`. When the answer is
`none`, the template's placeholder line is removed. INTERVIEW group 4 gains the question "UI tool:
Playwright, Cypress, none". TESTING-SETUP gains a line pointing to `ui-testing`.

### D-7 What moves (DEC-3)

- **CHECKLIST.** Rule 2 now reads "When the project has a UI, UI tests follow `ui-testing`." The
  number is kept, so no other reference shifts. Rule 11 gains "in unit and feature tests".
- **INVENTORY.** CHK-58 points to `skills/ui-testing/SKILL.md (UI-8)`. CHK-147 (matrix) and
  CHK-148 (broken screen) are added, owned by `ui-testing` and found in SUITE. If another change
has taken these ids by task 1.6, use the next two free ids and update SUITE.
- **UI-MATRIX.**
  - VER and ROB name `ui-testing`.
  - ADQ is CHK-148, run by the tester when a scenario is added; status `exists`.
  - RSK is CHK-147, run on each PR and at the release gate; status `exists`.
- **Pointers.** `bdd-gherkin` and `test-suite-care` each get one *Related* line naming
  `ui-testing`. No rule text moves into them.

### D-8 Trial (DEC-6, RISK-1)

The trial reads `../entity-resolution-service-webapp` at the commit recorded on the day, and
changes nothing in it.

1. **Audit.** For each rule UI-1 to UI-9, count the breaks in `src/test/e2e/` and
   `playwright.config.ts`, citing `file:line`. Write the result to `evidence/trial-audit.md`. Only
   the nine rules are counted.
2. **Before and after.** Two fresh `implementer` subagents get the same brief: write one new
   Playwright TypeScript scenario for a journey the suite does not cover. The lead names the
   journey at stage start, from the app's routes. Only the "with" brief points to
   `skills/ui-testing/`. Each subagent writes to `evidence/trial-output/<without|with>/`. A fresh
   `checker` scores both outputs rule by rule, without knowing which brief produced which, into
   `evidence/trial-ab.md`.
3. **Failure case.** `evidence/failure-case.md` takes the breaks found by the audit and the
   "without" output. It is the acceptance test.

**Pass:** the "with" output breaks none of the rules that apply, and the failure case lists at least
one real break. If the "without" output breaks nothing, the failure case rests on the audit, and
that is recorded. A pull request with the audit's fixes is offered to the developer, never opened
on our own.

## Algorithm / approach

1. Stage 1 builds the skill, test-first:
   1. the probes and the ROWS test;
   2. SKILL, ROWS and SUITE;
   3. the moves of D-7 and the bundle entry.
2. Stage 2 adds the scaffold (D-6), test-first in TPL-TESTS.
3. Stage 3 runs the trial (D-8), then writes the evidence, the docs and the close.

**Anti-patterns:** a tool tutorial in ROWS; a CI-only retry; a non-blind scorer.

## Error matrix

| Situation | Behaviour |
|---|---|
| Both config files and no binding line | Ask the developer (D-4) |
| A third tool (Selenium, WebdriverIO) | The rules apply; the agent says ROWS has no row for that tool (No-gos) |
| `--ui-tool` with `library` or `doc-only` | Exit 2: "--ui-tool needs the product archetype" |
| `--ui-tool` with an unknown value | Exit 2, listing the three values |
| A Node tool and a `package.json` exists | Left untouched; a warning names the dependencies |
| A ROWS API changed after its checked date | Follow the tool's documentation; report the row through `skillery-feedback` (RISK-2) |
| A `serious` axe finding in a third-party widget | Goes to the accepted file with an issue link |
| The trial repository is not checked out | Stage 3 stops; the lead asks the developer and never swaps the repository |
| The "without" output breaks no rule | Recorded; the failure case rests on the audit |
| SKILL goes over 24 KB | Move text into ROWS or SUITE; no exception |

## Risks / Trade-offs

| Id | Risk | Likelihood / impact | Treatment |
|---|---|---|---|
| RISK-1 | The trial suite is in fair shape, so the audit finds little | high / low | Count only the nine rules. The before-and-after does not depend on the suite. Record what is found |
| RISK-2 | The per-tool rows go stale | medium / medium | One line, a link and a checked date (D-3), plus the error-matrix row |
| RISK-3 | A project is detected with the wrong language | low / low | The scaffold prints the language it detected, and the `--typescript` flag forces TypeScript |
| RISK-4 | The pinned packages fail to install | low / medium | `ui-browsers` is a separate target, and skillery's CI checks the templates only. Task 2.4 runs one local scaffold through `uv sync` |

## Attack record

Run 2026-11-22, inline by the lead (P-0006: at TINY to MEDIUM the attack and the gate run inline).

- Rule 11 contradicts UI-7 → D-7 scopes rule 11.
- Cypress has no Gherkin runner → a row in D-3.
- Retry until green → UI-9.
- Stale rows; an existing `package.json` → error-matrix rows.
- A biased scorer → blind scoring (D-8).
- "Without the skill an agent breaks the rules" may be false → the error matrix records it.

## Delivery decisions

<!-- Filled during delivery. -->

## Open Questions

None.
