# Trial audit: entity-resolution-service-webapp, Playwright suite

- Repo: `/home/lps/work/workspace-charm/entity-resolution-service-webapp`
- Commit: 8f4e466
- Date: 2026-11-22
- Rules audited: `skills/ui-testing/SKILL.md` (UI-1 to UI-9), `skills/ui-testing/references/per-tool.md` (Playwright column), `skills/ui-testing/references/suite-checks.md`
- Files read: `src/test/e2e/app.spec.ts`, `filters.spec.ts`, `history.spec.ts`, `login.spec.ts`, `helpers.ts`, `global-setup.ts`, `playwright.config.ts` (repo root)
- Method: `design.md` D-8 step 1, read only. Nothing was run, installed or changed in the repo.

## Counts

| Rule | Breaks | Where (file:line) |
|---|---|---|
| UI-1 | 2 | `src/test/e2e/` (no `.feature` file); `src/test/components/` (not beside the code) |
| UI-2 | 0 | none |
| UI-3 | 13 | `app.spec.ts:130,131,156,165`; `filters.spec.ts:49`; `history.spec.ts:172,173,174,179,180,185,186,208` |
| UI-4 | 5 | `filters.spec.ts:40`; `filters.spec.ts:73`; `filters.spec.ts:75-76`; `app.spec.ts:218`; `history.spec.ts:224` |
| UI-5 | 0 | none |
| UI-6 | 0 | none |
| UI-7 | 4 | `login.spec.ts:38-67,155-165`; `history.spec.ts:123-133`; `history.spec.ts:183-197,214-217`; `app.spec.ts:113-118,201-204` |
| UI-8 | 3 | `login.spec.ts:44` (`/login`); `app.spec.ts:114` (`/`); `history.spec.ts:124` (`/history`) |
| UI-9 | 1 | `playwright.config.ts:10` |
| Total | 28 | |

## Citations

**UI-1 (2).**
- The four e2e files are plain `*.spec.ts` tests named after screens or controls. No Gherkin
  feature exists anywhere in the repo, so no scenario is "one per use case".
- Component, hook, page and context tests (about 45 files) sit in a separate tree,
  `src/test/components|hooks|pages|context/`, away from `src/components/` and the other code. Not
  beside the code they test.

**UI-2 (0).**
- `helpers.ts:26-41` sets the session with `addInitScript` (tokens in `localStorage`) and a
  `page.route` fulfil for `/users/me`. No typed login outside the login use case.
- `login.spec.ts:125-128` and `:147-150` type the credentials. That is the log-in use case, so it is allowed.

**UI-3 (13).** All are position locators, `.first()` or `.nth()`:
- `app.spec.ts:130,131` `getByText('Confidence:').first()`, `getByText('Similarity:').first()`.
- `app.spec.ts:156` `getByText('Alice Johnson').first()`.
- `app.spec.ts:165` `getByRole('menuitem').first()`.
- `filters.spec.ts:49` `getByText('All Confidence').first()`.
- `history.spec.ts:172-174` three `getByText(...).first()` in the menu.
- `history.spec.ts:179,180,185,186` four more `.first()`.
- `history.spec.ts:208` `getByRole('menuitem').nth(2)`, tied to the order of the mock list.
- Not counted here: many `getByText` and `getByPlaceholder` selectors. The rule bans CSS, XPath
  and position, and prefers role, label or test id. Plain text is neither banned nor preferred.
  `getByTestId` is used well at `app.spec.ts:167-169,183-184`.

**UI-4 (5).**
- `filters.spec.ts:40` and `:73`: `waitForTimeout(600)` for the debounce. A fixed wait.
- `filters.spec.ts:75-76`: `expect(page.url()).not.toContain(...)` on a plain string. It does not
  retry, and it depends on the fixed wait above. `toHaveURL` with a negated pattern would retry.
- `app.spec.ts:218` and `history.spec.ts:224`: `waitForLoadState('networkidle')` and then a
  one-shot `expect(errors).toHaveLength(0)`. A time-based quiet wait, not a retrying assertion.
- Not counted: `waitForResponse` before an assertion (`app.spec.ts:138,150`, `history.spec.ts:154,166`)
  waits on an event, not on a time. The `timeout: 15_000` values are deadlines of retrying
  assertions.

**UI-5 (0).**
- No real external URL is visited. `global-setup.ts:21` and the config visit `localhost:5173`.
  Every `/api/v1/**` call is stubbed with `page.route`, with a catch-all fulfil.

**UI-6 (0).**
- No `afterEach` or `afterAll`. State is set in `beforeEach` (`app.spec.ts:97`, `filters.spec.ts:21`,
  `history.spec.ts:103`), which is the right direction.

**UI-7 (4).** Each group is one idea split over single-assert tests that load the same page:
- `login.spec.ts:38-67` and `:155-165`: four tests each `goto('/login')` and check one thing (heading,
  two fields, submit button, header absent).
- `history.spec.ts:123-133`: one test checks the URL, the next checks the heading, on the same load.
- `history.spec.ts:183-197` and `:214-217`: four tests on the detail panel, each one `getByText`
  assertion.
- `app.spec.ts:113-118` (title) and `:201-204` (user email in header): one assertion each, same
  page and same header as the neighbours.
- Fair side: `app.spec.ts:120-126`, `:161-178` and `:180-199` group several assertions well.

**UI-8 (3).**
- No axe engine in `package.json` or in any spec. The pages visited are `/login`, `/` and `/history`.
  Three pages with no check. The first visit of each is cited above.

**UI-9 (1).**
- `playwright.config.ts:10`: `retries: process.env.CI ? 2 : 1`. Above 0 on both lanes: one line,
  two lanes. `trace: 'on-first-retry'` (line 17) relies on it.

## Suite-check findings (not counted)

- **Accessibility (CHK-58).** Absent. No axe engine, no `a11y-accepted.json`. Only
  `eslint-plugin-jsx-a11y` lints the source in `src/package.json`, which is not a page check.
- **Browser matrix (CHK-147).** The config runs Chromium and Firefox in one list
  (`playwright.config.ts:19-34`), the same on every run. No split of per-pull-request versus release.
  No WebKit and no phone viewport.
- **E2E in CI.** `.github/workflows/ci.yaml` runs lint, typecheck and `make test-coverage` (unit
  tests only). I found no job that runs `playwright test`. The e2e suite has no gate.
- **Broken-screen (CHK-148).** No record in the repo. By reading, some scenarios would still pass
  with a failed API call, since the catch-all returns `{}` and they only check static labels, for
  example `app.spec.ts:128-134` and `login.spec.ts:38-57`. Not confirmed by running.

## Not counted

- `playwright.config.ts:6` has `testDir: './test/e2e'` at the repo root, but the specs are in `src/test/e2e`. The path looks wrong for a root config.
- `global-setup.ts:25-29` swallows every warm-up error with an empty `catch`.
- `playwright.config.ts` sets `timeout: 60_000` per test and a 60 s navigation timeout for Firefox, to absorb slow loads.
- `package.json` and `src/package.json` both declare `@playwright/test` 1.58.2 and the same e2e scripts.
- `app.spec.ts:45-47` has a stale comment about `decision-001` that sits in the wrong mock object.
