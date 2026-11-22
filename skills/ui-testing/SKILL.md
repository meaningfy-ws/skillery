---
name: ui-testing
description: "Use this skill when you write, fix or review UI tests, end-to-end tests, Cypress or Playwright tests: 'write a Playwright test for the login page', 'our Cypress tests use cy.wait(5000)', selectors that break, flaky waits, an accessibility check, a browser matrix. It holds the rules, the per-tool rows and the suite checks. Not for Gherkin wording (bdd-gherkin), shrinking a slow suite (test-suite-care) or the usability of screens (meaningfy-code-review)."
license: Apache 2.0
metadata:
  purpose: quality
  area: coding
  subject: generic
  posture: reusable
  stage: verify
  maturity: experimental
---

# UI testing

Asked for a UI test, an agent logs in through the screen, picks elements by CSS class and waits a
fixed time. The test is slow and breaks on the next restyle. This skill gives nine rules, one row
per tool for each rule a tool changes, and the checks a suite needs.

## Quick Start

The task: "a user logs in, then filters the list of orders by status". The project has Playwright.

1. Find the tool (see Which tool). The `AGENTS.md` line says Playwright with TypeScript.
2. Write the scenario as a Gherkin feature for the one use case, "filter orders".
3. UI-2: the log-in is not a step of this scenario. The test loads a stored session. Only the
   log-in use case logs in through the screen.
4. UI-3: the status filter is selected by its role and label. The list rows by `data-testid`. No
   CSS class, no position.
5. UI-4: after the filter is chosen, the `Then` asserts the visible rows with an assertion that
   retries. No fixed wait.
6. UI-8: the accessibility check runs on the orders page, and fails on a `critical` or `serious`
   finding.
7. Read `references/per-tool.md` when you write each step: it adds the Playwright form of each
   rule, in TypeScript and Python.

## Rules

Each rule names its source. The rule text is the same for every tool.

| Id | Rule | Source |
|---|---|---|
| UI-1 | Component tests live next to the code they test. End-to-end scenarios are Gherkin features, one per use case. | `cosmic-python` testing checklist, rule 2 (moved here) |
| UI-2 | Set state through the API or a stored session, not the screen. Only the log-in use case logs in through the screen. | Cypress best practices, "Organizing tests, logging in, controlling state" |
| UI-3 | Select by role, label or `data-testid`. Never by CSS class, XPath or position. | Cypress, "Selecting elements"; Playwright, "Use locators" |
| UI-4 | Use assertions that retry until a deadline. No fixed wait. | Cypress, "Unnecessary waiting"; Playwright, "Use web first assertions"; checklist rule 12 |
| UI-5 | Never visit a site you do not control. Stub third parties at the network layer. | Cypress, "Visiting external sites" |
| UI-6 | Reset state before a test, not after. | Cypress, "Using after or afterEach hooks" |
| UI-7 | One journey groups its assertions. Do not split it into one-assert tests. | Cypress, "Creating tiny tests with a single assertion" |
| UI-8 | Run an accessibility check on every page a scenario visits. | checklist rule 2 (moved here), CHK-58 |
| UI-9 | Retries are 0 on every lane. A test that is sometimes red on unchanged code is quarantined under checklist rule 14. | checklist rule 14; `test-suite-care` waste list |

UI-7 does not conflict with checklist rule 11: a journey is one idea, so its assertions stay
together. Rule 11 applies to unit and feature tests.

## Which tool

1. Read the `UI tests: <Cypress|Playwright> (<language>)` line in the project's `AGENTS.md`.
2. If it is missing, use the config file at the root or under `frontend/`:
   `playwright.config.*` or `cypress.config.*`.
3. If both files are found, or neither, ask the developer. Never pick one.

A third tool, such as Selenium or WebdriverIO, gets the same rules. Say that the per-tool rows
have no row for it.

## Rules by tool and suite checks

Read `references/per-tool.md` when you write or review a test in a known tool: it adds one line
per rule for Cypress and Playwright, with a link to each tool's documentation.

Read `references/suite-checks.md` when you set up the accessibility check, the browser and device
matrix or the broken-screen check on a new scenario: it adds the pass and fail conditions of each.

## Boundary & Related Skills

**Owns:** how UI tests are written and run: the rules UI-1 to UI-9, the per-tool rows, the
accessibility check, the browser and device matrix and the broken-screen check.

**Delegates:** Gherkin wording and traceability → `bdd-gherkin`; the rules every non-UI test
follows → `cosmic-python`'s testing checklist; the UX lens on screens → `meaningfy-code-review`;
the cost of a suite → `test-suite-care`; which checks an activity needs → `test-strategy`.

**Related:** `bdd-gherkin`, `cosmic-python`, `test-suite-care`, `test-strategy`,
`meaningfy-code-review`.

Answers `VER, ADQ, ROB, RSK` in `test-strategy`'s matrix (`references/ui.md`).
