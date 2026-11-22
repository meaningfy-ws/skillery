<!-- Seed, verbatim from meaningfy-ws/skillery#230, read 2026-11-22. Secondary; never groomed. -->

# No skill owns UI test rules (Cypress, Playwright)

## What is missing

No skill in the catalogue owns the rules for UI tests. The only UI test rule today is rule 2 of the testing checklist in `cosmic-python` (front-end tests beside their layer; an accessibility check on every page a scenario visits). The `ui` matrix of `test-strategy` lists the rest as gaps.

## Where it shows

- `openspec/changes/activity-test-profiles` (stage 5, UI family) names no owner for UI checks.
- `openspec/changes/test-suite-care` (stage 2) parks six new UI test rules in `test-suite-care` "until a UI skill exists".

## Decision needed

Whether a UI testing skill is created, or the rules get another permanent home. Until then the six rules stay where `test-suite-care` puts them and checklist rule 2 stays in `cosmic-python`.

Found when the five test strategy changes were read against each other on 2026-11-14.
