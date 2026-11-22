# Suite checks

Open this file when you set up the accessibility check, the browser matrix or a broken-screen
check. Each part has a check id in `test-strategy`'s inventory.

## Accessibility check (CHK-58; answers VER and ROB)

- The axe engine runs on every page a scenario visits, once a retrying assertion has shown the
  page is ready.
- The run fails on a `critical` or `serious` finding.
- An accepted finding goes into `tests/e2e/a11y-accepted.json`, a list of objects. Each object
  holds the rule id, the selector, a link to an issue and a date.
- The check is never switched off for a whole suite.
- A `serious` finding in a third-party widget the team cannot fix is accepted the same way.

## Browser and device matrix (CHK-147; answers RSK)

- Each pull request runs Chromium on desktop at 1280 by 720.
- The release branch's gate runs Chromium, Firefox and WebKit on desktop, and one phone viewport
  (Playwright `Pixel 7`, Cypress `iphone-x`).
- A project may list fewer browsers in its `AGENTS.md`. That list shrinks only the release matrix.
- No scheduled run is added (`test-suite-care`, D-10).

## Broken-screen check (CHK-148; answers ADQ)

Whoever adds a scenario breaks the screen twice on purpose and confirms the scenario fails each
time:

1. Remove the element that the scenario's first `Then` checks.
2. Make the page's API call return an error, through the stub.

Then revert the break. A scenario that still passes is a failed check. Under `epic-delivery` it is
a finding for the tester. The pull request body records one line:
`broken-screen: <scenario> fails on element / on API error`.
