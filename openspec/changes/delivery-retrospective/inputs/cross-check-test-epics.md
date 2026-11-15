# Cross-check — the findings against the test EPICs

**Status:** secondary input. Made on 2026-11-14 by a reader who saw the findings first and the EPICs
after. It read each proposal in full and the designs in passages; it did not read the `specs/`,
`inputs/qa.md` or `evidence/` folders.

EPICs compared: `harden-checks-and-tests`, `activity-test-profiles`, `generic-task-test-profiles`,
`test-suite-care`, and the delivered `test-strategy` (archived).

## Result in three sentences

The EPICs add checks and the findings measure what checks cost, so they barely overlap. None of the
four open EPICs sets a cost budget or says which tools its new subagents carry. Three of them add
recurring agent work.

## Recommendations against the EPICs

| Recommendation | Covered? | Where |
|---|---|---|
| R-1 tool allow-list for workers | No, and made worse | `generic-task-test-profiles` D-5 gives two agents an unscoped `Agent` tool; D-9 uses a general-purpose reader |
| R-2 measure the session start | No | |
| R-3 small lead context | Not here; a rule in `guardrails` | `test-suite-care` D-12 adds a sorting step to the lead |
| R-4 no polling | No | |
| R-5 scale reviews, record outcome | First half contradicted, second half partly | `harden-checks-and-tests` DEC-9 and RISK-8 add a tester per MEDIUM stage; outcomes are recorded in prose only |
| R-6 fewer gate runs | No | `generic-task-test-profiles` passed on run 5 and was gated again (run 7) |
| R-7 compact before leaving | No | |
| R-8 longer-lived workers | No; two EPICs use fresh subagents on purpose | |
| R-9 machine-readable phase and outcome | Partly | workflow `criteria` from `test-strategy` |
| R-10 Langfuse prices and gap | No | |
| R-11 home for the scripts | No | `test-suite-care` D-11 assesses a check by "cost (tokens and minutes)" and needs these numbers |

## Correction to the cross-check

The reader said the EPICs broke the two-run limit of `epic-planning`. That limit applies to TINY and
SMALL EPICs only; these EPICs are larger, so no rule was broken. The finding stands in another form:
there is no limit for larger EPICs.

## Owner decisions, 2026-11-14

| # | Decision |
|---|----------|
| 1 | Give the worker agents a tool list again now, outside any EPIC. The list includes the code tools: Serena, ast-grep and GitNexus. |
| 2 | `generic-task-test-profiles`: the reader gets a named tool list; consider the same code tools where the piece read is code. |
| 3 | `harden-checks-and-tests` DEC-9: the tester from MEDIUM up becomes conditional. |
| 4 | Tester and review results get one fixed line a script can read. |
| 5 | `test-suite-care`: the builder sorts the tests and the lead confirms; the retrospective scripts are the cost source; the sort also looks for refactoring opportunities. |
| 6 | `activity-test-profiles`: a stage that only records accepted gaps takes the small review set. |
| 7 | The two-run gate limit holds on any re-gate. |

## What the measurements cannot judge

Whether the new checks catch real defects: the data shows what a check costs, not what it finds.
The sessions are mostly coding work, so the checks on offers, contracts and sales runs are not
measured.
