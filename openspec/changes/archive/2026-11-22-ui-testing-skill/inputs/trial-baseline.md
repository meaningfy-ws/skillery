<!-- Secondary input. A first read of the trial repository, 2026-11-22, by grep; the stage-1
     audit replaces it with a rule-by-rule count. Never groomed. -->

# Trial repository: first read

`entity-resolution-service-webapp` (local checkout, last commit 2026-09-29, `1.1.0-rc.8`).
Playwright `@playwright/test` 1.58.2; `playwright.config.ts` at the root; `testDir: ./test/e2e`,
which resolves under `src/` (`src/test/e2e/`).

| Thing looked for | Found |
|---|---|
| Spec files | `app.spec.ts`, `filters.spec.ts`, `history.spec.ts`, `login.spec.ts`, plus `helpers.ts`, `global-setup.ts`; 765 lines |
| Fixed waits (`waitForTimeout`, `setTimeout`) | 2, in `filters.spec.ts` |
| CSS or XPath locators | 0 found by a simple pattern |
| Role, label, test id or text locators | 62 |
| Retries | `retries: process.env.CI ? 2 : 1`: a test may be retried to pass, in CI and locally |
| Accessibility check (axe) | none |
| Browsers | Chromium and Firefox desktop; no mobile viewport |
| `afterEach` clean-up | none |
| Log-in | the API is mocked with `route.fulfill` in `helpers.ts`; whether every test logs in through the screen is for the audit |

The suite is already in fair shape, so the trial's "before" is small and specific: fixed waits,
retries that hide flakiness, no accessibility check, no viewport row (RSK-1 in the EPIC).
