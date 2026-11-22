---
name: stage-check
description: Use this skill when you are the checker of a finished delivery stage, or when a lead must brief one, on "check this stage against its briefs", "is every brief item and accepted finding met", "four-eyes pass on the stage", "stage verdict". It owns how a stage is checked, what the checker reads, the item-by-item verdict and the result line. Not for reviewing code through lenses (meaningfy-code-review), choosing which checks a stage needs (epic-delivery), or scoring a spec (clarity-gate).
license: Apache 2.0
metadata:
  purpose: quality
  area: coding
  subject: spec-driven
  posture: precise
  stage: verify
  maturity: experimental
---

# Stage Check

The stage's four-eyes pass, run once by a fresh read-only checker that did not build, test or review
the stage. Whether a stage gets a checker is the lead's call (`epic-delivery`, the appetite's review
set); this skill is how the check runs.

## Read

The briefs of the stage, `design.md` (decisions, with accepted findings), the spec scenarios and the
diff range the lead names. Nothing else: not the builders' conversations.

## Check

1. Every brief item and every accepted finding is met: yes or no, each with evidence (a path and
   line, a command run and its exit code). No evidence is a no.
2. Every finding re-labelled as Critical: agree or not, one line.
3. Traceability, per `bdd-gherkin`: each scenario of the stage is covered by a test, and each test
   names its scenario.
4. A stage that changed a how-to or tutorial page is read by a separate cold reader
   (`technical-writing`), never by the checker, which has context a cold reader must not have.

## Report

The base report of `guardrails` (`references/subagent-reports.md`), the verdict per item, and at most
the report's line cap. It ends with the result line, `accepted` left as `-` for the lead to fill:

```text
result: stage=<s> role=checker verdict=<pass|fail> findings=<n> accepted=-
```

`verdict=pass` only when every item is met. A fail names each unmet item; the lead turns it into a
question for the developer.

## Boundary & Related Skills

**Owns:** what the checker reads, the item-by-item check, the verdict and its result line.

**Does NOT own / Delegates:** the lenses and the catalogue (`meaningfy-code-review`); which stages
get a checker, the briefs and the fix-or-follow-up decision (`epic-delivery`); the cold reader
(`technical-writing`); Gherkin traceability rules (`bdd-gherkin`); the base report (`guardrails`).

**Related:** `epic-delivery`, `meaningfy-code-review`, `bdd-gherkin`, `guardrails`.
