# Testing checklist

The rules every test follows, written by a person or an agent. A builder's or tester's brief points
to this file as one of its standing rules. A project adds its own rules beside it; it does not
copy these.

## Where tests live

1. A test lives in the tier folder of the layer it tests (`tests/unit/`, `tests/feature/`,
   `tests/integration/`, `tests/e2e/`); the folder also gives the marker. Domain tests import no
   adapter, service or fake.
2. When the project has a UI: front-end tests live next to the layer they test. End-to-end scenarios are Gherkin features, one
   per use case, with an accessibility check on every page a scenario visits.
3. Nothing outside the container and end-to-end tests touches the network.

## Test doubles and data

4. For a port of one of our own libraries, use the library's fakes. Never write your own: a fake
   that is missing or wrong is an issue for the library (the dependency rule of `epic-delivery`).
5. For the project's own ports, write one fake that implements the real port, with a small API.
   Prefer it over mock stubs.
6. Build model objects with polyfactory factories, through the models, never bare dicts; a
   project whose validated named builders exist already meets this. Never `model_copy(update=…)`: it
   skips validation. Write a builder only where a factory cannot express the object. Shared read-only data is
   session-scoped; mutable state is function-scoped. Costly set-up is shared at the widest scope
   whose tests do not change what it builds; a mock is never shared.

## Assertions

7. When the project stores RDF: assert on it by parsing it into a graph and comparing isomorphically; on failure, print the
   graph diff. Never compare serialisations as strings.
8. Every rule of a rule table (a permission matrix, a validation rule set) gets a positive and a
   negative case in a parametrised table, plus a test that every rule has a row.
9. Assert on problem responses by status and `type`, not by message text.
10. Property-based tests (Hypothesis) cover invariants: round trip, order independence, bounds. CI
    runs them derandomised. Every other random generator is seeded.
11. One assert per idea, each with a message. No `and` chains. Each Gherkin `Then` asserts one
    thing.

## Time and containers

12. No real sleeps and no timing-based asserts. Inject the clock or the sleep. Wait for eventual
    consistency by polling a condition with a deadline.
13. Container tests start their containers once per session, and each test namespaces its own
    data. In CI a missing Docker is a failure, not a skip.

14. A test that both passes and fails on unchanged code is quarantined with the project's marker
    and an issue link, gets its own task or issue, and is never retried with new seeds inside a
    stage; the stage PR names it. A `skip` or `xfail` that is not a quarantine carries an issue
    link, unless it skips for a tool the machine lacks.

## Traceability and validated examples

15. Every feature test names the spec scenario it covers. The full check is `bdd-gherkin`'s
    traceability check.
16. The model's validated example instances and competency questions are kept as tests (see
    `conceptual-modelling`). Compare answers as sets or graphs, never as text. Change one only with
    the model change that needs it, and say why in the commit.

## Suite size and cost

17. Every test asserts something.
18. No two parametrised cases fall in the same equivalence class, beyond the cases rule 8 requires.
19. A behaviour proven at a lower tier is not proven again at a higher one, unless the higher test
    runs something real that the lower one fakes.
20. A test whose set-up and call take longer than the project's threshold carries the `slow`
    marker; the threshold is written in the marker's description.
21. A file of adversarial tests is named by the feature it attacks, never by the stage that wrote it.

`test-suite-care` audits a suite against these rules.

## The report

What a test run reports (each gate with its time and test count) is in `epic-delivery`'s brief template.

## Sources

| Rule | Smell it prevents | Source |
|---|---|---|
| 6 | General Fixture | Meszaros, *xUnit Test Patterns* |
| 14 | Ignored Test | Fowler, "Eradicating Non-Determinism in Tests" |
| 17 | Empty Test | testsmells.org |
| 18 | Lazy Test | testsmells.org |
| 19 | Duplication across tiers | Vocke, "The Practical Test Pyramid" |
| 20 | Slow Tests | *Software Engineering at Google*, ch. 11 |
| 21 | Tests filed by history | a recorded failure (EPIC `test-suite-care`) |
