# Trial: one new scenario, without and with the skill

- Repo: `entity-resolution-service-webapp` at commit 8f4e466, read only (`git status` clean after the trial).
- Date: 2026-11-22. Method: `design.md` D-8 step 2.
- Journey, named in both briefs by the lead: "a curator accepts the proposed match for the selected
  decision in the comparison panel" (`src/components/ComparisonPanel/`), not covered by the suite.
- Two fresh implementer subagents got the same brief. Only the "with" brief pointed to
  `skills/ui-testing/`, and told it not to name the skill or its rules in its files.
- A checker subagent scored both outputs against UI-1..UI-9, blind: the folders were copied to
  `A` (with) and `B` (without), and it was told nothing about which had help. Nothing was run.
- Outputs: `trial-output/with/` and `trial-output/without/`.

## Result

| Rule | Without (B) | With (A) |
|---|---|---|
| UI-1 | broken: a plain spec, no Gherkin feature (`accept-decision.spec.ts:11`) | kept: `features/accept-decision.feature` with steps |
| UI-2 | kept: stored token through `mockAuthRoutes` | kept |
| UI-3 | broken: `getByText(...).first()` at `accept-decision.spec.ts:41`; the app's test ids went unused | kept: role and `data-testid` locators |
| UI-4 | kept: retrying assertions, `waitForRequest` | kept |
| UI-5 | kept: all API calls stubbed | kept |
| UI-6 | kept: state built before `goto` | kept |
| UI-7 | kept: one test, one journey | kept |
| UI-8 | broken: no axe check | kept: axe after the cards show, fails on critical or serious (`a11y.ts:24`) |
| UI-9 | broken: runs under the suite's `retries: CI ? 2 : 1` | kept: its config sets `retries: 0` |

**Without: 4 breaks. With: 0 breaks.**

## Limits

- Nothing was run in a browser: the scores judge the files as written.
- One journey, one run per arm. The "with" output needs two new dev dependencies
  (`playwright-bdd`, `@axe-core/playwright`) that the app does not have yet.
