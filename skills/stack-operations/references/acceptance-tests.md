# Acceptance tests for a stack

Each stack has acceptance features that run against the live stack, no mocks. They answer "does this
stack still do its job" before and after a change. When to run the baseline before a change is part
of the safe-change protocol (`infrastructure-operations`); this file says how the tests are shaped.
How to write Gherkin itself is owned by `bdd-gherkin`.

Start from [`assets/templates/acceptance.feature`](../assets/templates/acceptance.feature).

## Shape

- One file per capability: `tests/<stack>/features/<capability>.feature`, tagged `@<stack>`.
- The header names the spec, the change and the settings the scenarios need.
- Scenario Outlines with one Examples row per instance, so one feature covers every instance.
- Tags: `@smoke` (health, TLS, sign-in per hostname), `@negative` (what must be refused: closed
  ports, denied routes), `@e2e` (create, read back, clean up), `@manual` (needs a person, such as a
  count comparison after a cutover).
- A missing setting skips the scenario; a strict mode fails it instead, used for a go-live.
- Test data carries a per-run marker and is deleted when the run ends.
- Checks on the VM itself go through the bastion and skip when there is no access.

## When they run

- Before a non-trivial change (failures are expected and recorded as the baseline) and after it.
- After every deploy: the smoke scenarios.
- In CI where the runner can reach the stack. A test suite that never runs in CI decays; wire it
  in, even if only the smoke scenarios.
