# Acceptance

- Date: 2026-11-22.
- Verified by agents: D-8's pass condition is met (`failure-case.md`); stages 1 and 2 merged
  (PR #355, PR #356) with green CI.
- The developer's call: "complete this epic and archive and cut a new release" (2026-11-22). The
  acceptance demo was not run as a separate session: the trial evidence stands as the demo, and the
  developer may reopen it.

## Pull request to the trial repository (task 3.4)

Not opened (DEC-6: the trial repository is read only; a PR there is the owner's call). Offered to
the developer in the session's closing report, carrying the audit's fixes in this order:

1. `playwright.config.ts`: `retries: 0` (UI-9).
2. An axe check on `/login`, `/` and `/history`, failing on critical or serious (UI-8).
3. Replace the 13 position selectors with role or test-id locators (UI-3).
4. Replace `waitForTimeout` and `networkidle` with retrying assertions (UI-4).
5. Add the accept-decision scenario from `trial-output/with/`.

Answer: pending; recorded here when given.
