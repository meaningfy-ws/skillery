## ADDED Requirements

### Requirement: One skill owns the UI test rules
The `ui-testing` skill SHALL hold the rules UI-1 to UI-9 for writing and running UI tests, each
citing its source, without naming a tool in the rule text; no other skill SHALL restate them
(DEC-1, DEC-3, design D-2).

#### Scenario: Rule 2 has moved
- **WHEN** a contributor reads rule 2 of `cosmic-python`'s testing checklist
- **THEN** it points to `ui-testing` and states no UI rule itself

#### Scenario: A fixed wait in a UI test
- **WHEN** an agent with `ui-testing` loaded writes a UI test that needs to wait for a page
- **THEN** it uses an assertion that retries and no fixed wait, citing UI-4

### Requirement: Each tool has one-line rows
The skill SHALL carry a per-tool reference with one row per rule a tool changes, one line per cell
for Cypress and Playwright, each non-empty cell linking the tool's documentation, under a line
naming the versions and the date checked; a test SHALL fail on a broken row (DEC-2, design D-3).

#### Scenario: A row grows into a tutorial
- **WHEN** a cell of the per-tool table holds two lines
- **THEN** `make validate` fails, naming the rule's row

### Requirement: The agent knows which tool a project uses
The skill SHALL read the tool from the `UI tests:` line of the project's `AGENTS.md`, else from the
one config file found; with both config files or none it SHALL ask the developer (DEC-5, design D-4).

#### Scenario: Two tools found
- **WHEN** a project has `playwright.config.ts` and `cypress.config.js` and no `UI tests:` line
- **THEN** the agent asks the developer which tool applies before writing a test

### Requirement: A UI suite checks accessibility, browsers and broken screens
The skill SHALL state how a suite runs the accessibility check (failing on `critical` and `serious`
findings, accepted findings listed with an issue link), the browser and device matrix (one browser
per pull request, the full matrix at the release gate) and the broken-screen check on each new
scenario (DEC-4, design D-5).

#### Scenario: A scenario that cannot fail
- **WHEN** a new scenario still passes after the element its first `Then` checks is removed
- **THEN** the broken-screen check fails and the scenario is not accepted

#### Scenario: A known accessibility finding
- **WHEN** the axe check reports a `serious` finding on a third-party widget the team cannot fix
- **THEN** the finding is listed in the accepted file with its rule id, selector, issue link and date, and the check stays on

### Requirement: A UI test is never retried to pass
The skill SHALL require a retry count of 0 on every lane and send a test that is sometimes red on
unchanged code to quarantine under the testing checklist's rule 14 (design D-2, UI-9).

#### Scenario: Retries in CI
- **WHEN** a suite's config sets `retries: 2` for CI
- **THEN** a review against `ui-testing` reports it as a break of UI-9
