# Test suite audit, <yyyy-mm-dd>

Map: `tests/audit/scenario-map.csv` at commit `<sha>`. Owner's sample: <n> rows, <n> wrong (or:
waived by the owner on <date>; class 3 then needs W-8 pair evidence or a re-read `high` survivor).

## Numbers

| Lane (make target) | Tests | Wall time (s) | Summed time (s) | Share of set-up |
|---|---|---|---|---|
| | | | | |

Commands run (run A and run B, as given):

```
<commands>
```

## Where the time goes

Ten costliest files:

| File | Tests | Seconds |
|---|---|---|

Ten costliest fixtures:

| Fixture | Scope | Tests using it | Summed set-up (s) |
|---|---|---|---|

## Proposals

Class 1 first. One decided change per proposal; an open choice goes to *Spec questions* or to the
owner, never into the proposal.

| Id | Class | What | Evidence (waste id and its pieces) | Measured or estimated saving | Scenarios touched | Survivor | Lane that still runs it in CI |
|---|---|---|---|---|---|---|---|
| P-1 | 1 | | W-1: | | none | not applicable | |

## Held back

Candidates read and not proposed, with the evidence that refuted them (a contained pair whose
assertions differ, a test that reads the real store).

## Mutation run

Tool, selection (layer and its tests), mutants, killed, surviving, time; or why it was not run.

## Scenarios with no test

## Tests that serve no scenario

| Test | Waste row it matches |
|---|---|

## Broken rules

| Test | Checklist rule | Fix (one, decided) |
|---|---|---|

## Spec questions

Where a test and the spec disagree, or a scenario is unclear: the question, the test, the spec line.

## Libraries

Test libraries considered (adopt, trial, drop) and why.

## Not measured

What was not looked for, and why (a missing tool, a failing or flaky test, a lane no target runs,
W-8 without mutation results, a loaded machine).

## Decisions

Filled in with the owner.

| Proposal | Decision (approved, rejected, later) | Owner's reason | Pull request |
|---|---|---|---|
| P-1 | | | |
