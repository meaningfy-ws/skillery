# Failure case: test-strategy

The recorded failures this change answers (design D-11). Both are read from `develop` at commit
`6a54619`, before the change; each is now an acceptance test in `tests/test_test_strategy.py`.

## 1. Two skills gave opposite rules for test data

A builder asked "how do I build a model object in a test?" got two answers, depending on which
skill it loaded.

| Where (at `6a54619`) | What it said |
|---|---|
| `skills/project-setup/references/testing-setup.md`, § *Test-data and fixture conventions* | "**polyfactory** for domain objects — subclass `ModelFactory` per model and call `.build()`" |
| `skills/cosmic-python/references/testing-checklist.md`, item 6 | "Build model objects with small builder functions, through the models, never bare dicts." |

The same file of `project-setup` also restated the red, green, refactor loop, which the external
`test-driven-development` skill owns.

**Now a test:** `test_real_repo_has_one_home_per_fact` fails when `polyfactory` is named outside
the checklist, a dependency line or the pointer line, and when the loop is named on a line that does
not cite its owner. The owner's decision between the two rules is Q-2 in `inputs/qa.md`.

## 2. Verification and validation were out of reach outside an epic delivery

The definition ("Verification asks … Validation asks …") and the V-model table lived only in
`skills/epic-delivery/SKILL.md` § *Verification and validation* and
`skills/epic-delivery/references/verification-validation.md`. `epic-delivery` loads only when a
gated PLAN is delivered by an agent team. An agent writing a document, a contract or an offer never
loaded it, so it had no definition of what validates that work and no place that says which check
answers which question (`inputs/seed.md`, *Fragmentation found*).

**Now a test:** the same test fails when the definition is stated anywhere but
`skills/test-strategy/SKILL.md`; `test_real_repo_inventory_is_covered_by_the_matrix` fails when a
family lacks a row for one of the six questions. The trigger probe "what is the difference between
verification and validation" expects `test-strategy`, as a near-miss of `epic-delivery`.

## Not this change's failure case

The method-less adversarial tester (Q-2 of `harden-checks-and-tests`) is EPIC B's failure case.
