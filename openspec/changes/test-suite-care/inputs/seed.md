# Seed: test suite care (EPIC E)

**Secondary input, never groomed.** The owner's words of 2026-11-14 and the measurements taken the
same day.

## The owner's request

> is any of the epics are considering the size of the tests? adding tests more and more to
> strengthen the coverage or make more severe adversary is fairly easy, but actually trying to
> minimise the number of tests that are as effective but also do not take hours to complete running
> is a bit more challenging. can we add maybe a new skill that does like a refactoring attempt to
> the existent tests (of all sorts) and propose improvements, reductions in size, mark the slow ones
> (so profile to identify which ones are slow) so they can be triggered on controlled times, not all
> the time, make quick tests based on what has only changed, etc ... (also adhere to best practices
> of test creation)

> this problem exists across several repos i work on. development becomes slow, too slow. well if
> you will look at the rdf-persistence repo with 4k tests already, it is a challenge to make new
> developments there. (also it would be interesting to make sure that any refactoring is also taking
> into consideration the features specified in the repo/project)

(Spelling corrected; wording unchanged.)

## The recorded failure: `rdf-persistence`, 2026-11-14

Read from the repository's last full run (`test-results.xml`, 14 Nov 2026, with coverage and
parallel workers, so per-test times are inflated). Nothing was run for this seed.

| Finding | Number |
|---|---|
| Unit and feature run | 4,524 tests; 508 s wall time in parallel; 5,290 s summed over tests |
| Tests in the `unit` tier | 4,516, averaging 1.2 s; the marker reads "fast, no I/O" |
| Slowest 10 % of tests (452) | 3,686 s, 70 % of the summed time |
| `test_stage4_adversarial`, `test_router`, `test_listing_routes` (277 tests) | 1,913 s, 36 % |
| Files with `adversarial` in the name | 704 tests (16 %), 1,751 s (33 %) |
| Parametrised cases | 2,960 of 4,524 |
| Tests marked `slow` | 51; 697 take 2 s or more in this run |
| Scenarios in `openspec/specs` | 200; a text search found no test that names one |
| Feature tier | 8 tests, 2 `.feature` files |

Observations:

- The repository already has `make test-fast` (not `slow`), `make test-changed` (tests of the files
  changed against a base, `tests/changed.py`) and `make profile-tests` (the 15 slowest, set-up and
  call apart). Development is still slow, so lanes alone do not solve it.
- The adversarial files are named by delivery stage (`test_stage1_adversarial` …
  `test_stage4_adversarial`): each stage's attack tests stay as written.
- The entrypoint tests build their client fixture for every test (`tests/unit/entrypoints/conftest.py`).

## Where the catalogue stands

- `cosmic-python`'s testing checklist has 16 rules for writing a test. Three touch cost (rule 6 and
  rule 13 on fixture scope, rule 12 on sleeps); `SKILL.md` adds "fastest tests run first", the
  pyramid and FIRST; `project-setup`'s testing set-up describes a fast CI lane without the
  container tests. None covers the size of a suite, or reviewing one that already exists.
- Checklist rule 15 and `bdd-gherkin`'s traceability check make feature tests name their scenario;
  unit tests carry no such link.
- EPICs A to D add checks and strengthen the adversary. B schedules mutation testing weekly with a
  time budget; nothing else limits run time, and A's six questions have none about cost.
