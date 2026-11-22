<!-- Seed excerpts, verbatim, read 2026-11-22. Secondary; never groomed. -->

# The parked UI material this EPIC starts from

## The six UI test rules (archived `test-suite-care` design, stage 2, never delivered)

From `openspec/changes/archive/2026-11-17-test-suite-care/design.md` lines 236–253. Stage 2 was
deferred (its D-43), so the planned `references/ui-suites.md` was never written and the rules are in
no skill today.

> - *Measure:* the runner's own JSON report (Cypress: the mocha JSON reporter; Playwright:
>   `--reporter=json`) gives time per test and retries. Coverage per test is not assumed.
> - *Map:* a spec file's `describe` and `it` titles, or its `.feature` file, give the scenario.
> - *Waste:* logging in through the screen in every test (class 1); two specs walking the same
>   journey (class 3, with the map's evidence). Fixed waits, tests retried to pass and selectors
>   by CSS class or XPath are broken rules.
> - *Rules:* six UI test rules, each with its source in the file: set state through the API, not
>   the screen (Cypress best practices, "Organizing tests, logging in, controlling state");
>   select by role, label or `data-*` (Cypress, "Selecting elements"; Playwright best practices,
>   "Use locators"); assertions that retry, no fixed wait (Cypress, "Unnecessary waiting";
>   Playwright, "Use web first assertions"); never visit a site you do not control (Cypress,
>   "Visiting external sites"); reset state before a test, not after (Cypress, "Using after or
>   afterEach hooks"); one journey groups its assertions (Cypress, "Creating tiny tests with a
>   single assertion"). They live in this file because no skill owns UI test rules today; the
>   file says so and names the trigger to move them (a UI skill appears). The last rule and
>   checklist rule 11 (one assert per idea) do not conflict: rule 11 is scoped to unit and feature
>   tests, and the stage adds those words to it.

## Checklist rule 2 (`skills/cosmic-python/references/testing-checklist.md`)

> 2. When the project has a UI: front-end tests live next to the layer they test. End-to-end
>    scenarios are Gherkin features, one per use case, with an accessibility check on every page a
>    scenario visits.

## The UI matrix (`skills/test-strategy/references/ui.md`)

| Question | Check | Technique owner | Status |
|---|---|---|---|
| VAL | CHK-59 UX review lens | `meaningfy-code-review` | exists |
| VER | CHK-58 Accessibility check on every page a scenario visits | `cosmic-python` | exists |
| ADQ | whether the UI scenarios would catch a broken screen | none yet | gap → C |
| ROB | CHK-58 | `cosmic-python` | exists |
| CLR | CHK-59 | `meaningfy-code-review` | exists |
| RSK | what outside the screens can go wrong (browsers, devices, content) | none yet | gap → C |

## `activity-test-profiles` design (open change), D-22 neighbourhood, line 793

> UI test rules: E parks six new ones in `test-suite-care` until a UI skill exists; this EPIC names
> no UI owner and does not move them.
