# Trial record (tasks 1.11 to 1.13, D-64)

The trial ran in the trial repository of D-14 as its change `test-suite-grooming`, delivered in one
pull request (#132 there, merged 2026-11-17), with fixes for CI after it (#135, #136 there). It
was driven by skillery 3.19.0's `test-suite-care`, `epic-planning`, `clarity-gate` and
`epic-delivery`.

## Where the outputs are (paths in the trial repository)

| Output | Path |
|---|---|
| Report (task 1.11) | `tests/audit/report-2026-11-16.md` |
| Scenario map, one row per test function | `tests/audit/scenario-map.csv` (3,623 rows, matched to the collection) |
| Slow-marker check | `tests/audit/slow-markers.md` |
| Report after the proposals landed | `tests/audit/report-2026-11-17-after.md` |
| The change (EPIC, PLAN, gate) | `openspec/changes/archive/2026-11-16-test-suite-grooming/` |
| Feedback to skillery | that change's `inputs/skillery-execution-report.md` and `inputs/strategy-and-skill-review.md` |
| Lead decisions taken while the owner was away | that change's `inputs/decisions-to-validate.md` |

## Outcome

| Measure | Before | After |
|---|---|---|
| Unit and feature cases | 7,357 | 6,790 |
| Run A wall time (unit and feature, no coverage) | 123 s | 72 s |
| `make check-all` | 3 min 59 s | 2 min 28 s |
| Coverage | 95.59 % | 95.60 % |
| Domain mutants killed (of 1,085) | 974 | 974, the identical surviving set |
| Asserts without a message | 1,301 | 0 |
| Wrong `slow` markers | 27 | 0 |

The skill's claim held: cost removed, effectiveness kept. It held only because measuring overruled
three estimates by reading and review overruled four merges; those are the defects of D-66.

## Decisions (task 1.12)

The owner accepted every proposal ("I accept everything") and waived the sample check of the map.
Of 35 proposals, the lead withdrew three as never W-5 (they read the real store), and two were built,
measured at no saving and not landed. The owner's answer on the lead's own decisions is D-65.

## Feedback filed (D-66)

Issues #307 to #319 and a comment on #195, from the two feedback files above. Task 1.14 takes the
`test-suite-care` ones, task 1.15 the others.
