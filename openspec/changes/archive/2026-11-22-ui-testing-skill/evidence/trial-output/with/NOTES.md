Journey: a curator accepts the proposed match in the comparison panel.
- Gherkin scenario in features/accept-decision.feature, steps in accept-decision.steps.ts (playwright-bdd).
- Session is the stored token plus stubbed API (fixtures.ts); no screen log-in. Fresh stub state per test.
- Selects the Alice Johnson decision, checks the proposed card, runs an axe check (critical/serious fail).
- Clicks accept, confirms the popconfirm, then checks: POST accept for decision-001 was sent,
  "Decision accepted" notification, Alice gone from the menu, Bob still there, header 43 Selected Top.
- Locators: roles, text, data-testid; retrying assertions only, no fixed waits.
- playwright.accept.config.ts reuses the main config with retries 0. Needs dev deps playwright-bdd and @axe-core/playwright.
- Place the files in src/test/e2e/ (the feature in its features/ folder); the config goes at the repo root.
