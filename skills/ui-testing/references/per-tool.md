# Per-tool rows

Open this file when you write or review a test in a known tool. Each row says what the rule
changes in that tool. It is not a tutorial: follow the link for the detail.

Checked against Cypress 16.3.0 and Playwright 1.65.1 on 2026-11-22

If an API here has changed since that date, follow the tool's documentation and report the row
through `skillery-feedback`.

| Rule | Cypress | Playwright |
|---|---|---|
| UI-1 Component tests and Gherkin features | no tool-specific step | no tool-specific step |
| UI-2 State through the API or a session | `cy.request` for the data, `cy.session` for the log-in ([docs](https://docs.cypress.io/api/commands/session)) | TS: `request` fixture and `storageState` ([docs](https://playwright.dev/docs/auth)); Python: `page.request` and `browser.new_context(storage_state=...)` ([docs](https://playwright.dev/python/docs/auth)) |
| UI-3 Select by role, label or test id | `findByRole` from Testing Library, or `[data-testid]` ([docs](https://testing-library.com/docs/cypress-testing-library/intro/)) | `getByRole`, `getByTestId` / `get_by_role`, `get_by_test_id` ([docs](https://playwright.dev/docs/locators)) |
| UI-4 Retrying assertions, no fixed wait | `.should(...)` retries; never `cy.wait(<number>)` ([docs](https://docs.cypress.io/app/core-concepts/retry-ability)) | `expect(locator).toBeVisible()` / `expect(locator).to_be_visible()` ([docs](https://playwright.dev/docs/test-assertions)) |
| UI-5 Stub third parties | `cy.intercept` ([docs](https://docs.cypress.io/api/commands/intercept)) | `page.route`, same in both languages ([docs](https://playwright.dev/docs/network)) |
| UI-6 Reset before, not after | no tool-specific step | no tool-specific step |
| UI-7 One journey groups its assertions | no tool-specific step | no tool-specific step |
| UI-8 Accessibility check on each page | `cy.injectAxe()` after `cy.visit()`, then `cy.checkA11y()` ([docs](https://github.com/component-driven/cypress-axe)) | TS: `new AxeBuilder({ page }).analyze()` ([docs](https://playwright.dev/docs/accessibility-testing)); Python: `Axe().run(page)` ([docs](https://github.com/pamelafox/axe-playwright-python)) |
| UI-9 Retries are 0 | `retries: 0` in `cypress.config` ([docs](https://docs.cypress.io/app/guides/test-retries)) | TS: `retries: 0` in `playwright.config.ts` ([docs](https://playwright.dev/docs/test-retries)); Python: pytest-playwright has no retry option, so do not pass `--reruns` of pytest-rerunfailures ([docs](https://pypi.org/project/pytest-rerunfailures/)) |
| Tooling: Gherkin runner | `@badeball/cypress-cucumber-preprocessor` ([docs](https://github.com/badeball/cypress-cucumber-preprocessor)) | TS: `playwright-bdd` ([docs](https://github.com/vitalets/playwright-bdd)); Python: `pytest-bdd` ([docs](https://pytest-bdd.readthedocs.io/)) |
| Tooling: axe engine (UI-8) | `cypress-axe` ([docs](https://github.com/component-driven/cypress-axe)) | TS: `@axe-core/playwright` ([docs](https://playwright.dev/docs/accessibility-testing)); Python: `axe-playwright-python` ([docs](https://pypi.org/project/axe-playwright-python/)) |
