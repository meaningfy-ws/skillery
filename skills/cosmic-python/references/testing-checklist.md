# Testing checklist

The rules every test follows, written by a person or an agent. A builder's or tester's brief points
to this file as one of its standing rules. A project adds its own rules beside it; it does not
copy these. Worked code is in [`example-testing-patterns.md`](example-testing-patterns.md).

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
6. Build model objects with small builder functions, through the models, never bare dicts. Shared
   read-only data is session-scoped; mutable state is function-scoped.

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
    stage; the stage PR names it.

## Traceability and validated examples

15. Every feature test names the spec scenario it covers. The full check is `bdd-gherkin`'s
    traceability check.
16. The model's validated example instances and competency questions are kept as tests (see
    `conceptual-modelling`). Compare answers as sets or graphs, never as text. Change one only with
    the model change that needs it, and say why in the commit.

## The report

What a test run reports (each gate with its time and test count) is in `epic-delivery`'s brief template.
