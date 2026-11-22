# Failure case and acceptance test (D-8 step 3)

## The failure, recorded

Without a skill that owns UI test rules, agents and people break them on a real suite:

- The existing suite of `entity-resolution-service-webapp` (commit 8f4e466) breaks the rules
  28 times (`trial-audit.md`): 13 position selectors (UI-3), 5 fixed or idle waits (UI-4), 4 journeys
  split across tests (UI-7), no accessibility check on 3 pages (UI-8), retries that hide a flaky
  test (UI-9), no Gherkin feature (UI-1).
- A fresh agent writing one new scenario without the skill breaks 4 rules: UI-1, UI-3, UI-8 and
  UI-9 (`trial-ab.md`).

## The acceptance test

With the skill, the same brief breaks none of the applicable rules (`trial-ab.md`, column "With").

## D-8 pass condition

| Condition | Met |
|---|---|
| The "with" output breaks no applicable rule | yes: 0 of 9 |
| The failure case lists at least one real break | yes: 28 in the suite, 4 in the "without" output |

**Pass.**
