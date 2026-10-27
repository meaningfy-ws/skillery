# Subagent reports — the base and the fields per purpose

Every subagent returns the base report; it adds the fields of its purpose below it. The whole report
fits in about ten to twenty lines. Anything longer — a crawl's findings, a full test log — goes to a
file, and the report carries the path and a summary.

## The base report

```text
Status: done | partly done | blocked | failed
Answer: <the conclusion to what was asked, 1–3 sentences>
Evidence: <paths:lines, commands run — pointers, not content>
Not checked: <what was skipped; how sure it is>
Open questions: <decisions the coordinator must take>
Side effects: <files changed, commands with effects — or "none">
Recommendations: <actions it was not allowed to take>
```

`blocked` means the subagent cannot go on without a decision; it says what it tried and what it
needs. A subagent never reports `done` on work it did not verify.

## Fields per purpose

| Purpose | Adds |
|---|---|
| exploring | where the thing is, ranked; where it is *not* |
| researching | findings with sources and dates; a file path when long |
| implementing | tests run and their result; departures from the plan |
| authoring | files written; checks run (`make validate` or the project's); choices made that were not asked |
| reviewing | findings by severity with location and the rule they break; a verdict |
| verifying | the criteria checked; pass or fail per criterion; the gaps |
| test-running | per scenario or assertion: pass or fail; where the run's output is |

A catalogue agent's `## Report` section names its purpose and what matters most in its report; it
cites this file and does not repeat the base.

## The brief that asks for it

The brief ends by naming the report expected: "the base report plus the <purpose> fields", and,
when something matters more than usual, says so ("list every file you did not read").
