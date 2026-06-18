---
name: bdd-gherkin
description: Write BDD Gherkin feature files and fabricate test data from a specification. Use to turn acceptance criteria or an EPIC into business-language `.feature` scenarios — Scenario Outline with Examples, explicit edge cases, no implementation detail. Trigger on "write Gherkin", "write feature files", "BDD scenarios for this acceptance criterion", "fabricate test data".
license: Apache 2.0
metadata:
  category: ai-coding
---

# BDD / Gherkin Authoring

## Overview

Translate a specification into precise, business-language Gherkin features that define
**what** the system should do in observable, testable terms — not **how**. Bridges the
spec (`epic-planning`) and the implementation.

## Quick Start

1. Read the source spec/EPIC; confirm it is ready (clarity-gate passed) before writing.
2. Write `.feature` files under `tests/features/` (or the project's path), named
   `<capability>.feature`, one file per coherent business capability.
3. Write in **business language** — no SQL, API paths, or class names; only business concepts.
4. Prefer **`Scenario Outline` + `Examples:`** for data-driven coverage:

```gherkin
Scenario Outline: <description>
  Given <precondition>
  When <action with parameter>
  Then <expected outcome>

  Examples:
    | parameter | expected |
    | value1    | result1  |
    | value2    | result2  |
```

5. Cover edge cases **explicitly**, sourced from the spec's test-case table and error matrix.
6. Fabricate sample/test data only where real examples are insufficient; place it in the
   project's fixtures location.

## Quality checks (before finishing)

- [ ] Every task in the breakdown has feature coverage.
- [ ] Every test-case-spec row and every error-matrix row has a scenario.
- [ ] `Scenario Outline` used wherever multiple data variations apply.
- [ ] No implementation details leak in (no SQL / API paths / class names).
- [ ] Files are syntactically valid Gherkin.

## Boundary & Related Skills

**Owns:** feature files + test data. **Does NOT** write step definitions or production code
(that is the implementer's job, following `cosmic-python` + `superpowers:test-driven-development`),
and does NOT plan (`epic-planning`) or score specs (`clarity-gate`).
**Related:** `epic-planning`, `clarity-gate`, `cosmic-python`.
