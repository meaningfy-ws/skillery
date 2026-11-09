# The team and its briefs

Who plays each role, when it is used, and the brief each member gets. The brief and report
mechanics (fresh not a copy, inputs as paths, the base report, the four-eyes rule) are owned by
`guardrails` §5; this page adds only what delivery puts into them.

## Who plays each role, and when

| Role | Played by | Model | Used when |
|---|---|---|---|
| Developer | A person | — | Always: decides, signs off scenarios, accepts the EPIC |
| Domain expert | A person | — | The model changes |
| Lead | The main session | The session's | Always. Never a subagent: it is the only one that talks to the developer |
| Architect | `system-architect` agent | Declared (opus) | Shaping session |
| Planner | `epic-planner` agent | Declared (opus) | Shaping, or finishing the PLAN at the start of an epic session |
| Builder | `implementer` agent | Declared (sonnet) | Every task, every accepted fix, every spike |
| Reviewer | `code-reviewer` agent, one per lens | Declared (opus) | Every stage, scaled by appetite |
| Checker | A fresh general-purpose subagent | opus | Once per stage, where the appetite's review set has one ([`epic-delivery.workflow.json`](../assets/workflows/epic-delivery.workflow.json)) |
| Adversarial tester | `implementer` with the tester brief | Declared (sonnet) | Where the appetite's review set names one |
| UX designer | A general-purpose subagent with the design skills | opus | Screens in scope, any size (the UX review lens runs where the appetite's review set has `ux`, when screens changed) |

No role has its own catalogue agent beyond these. The checker and the tester differ from the others
by their brief, not by their tools. The lead sets the model only for the general-purpose roles; both
are judgement work, so opus, per the model rule in `guardrails` §5.

The tester and the checker both look for problems, differently. The tester tries to break the
behaviour and leaves tests in the suite. The checker reads the stage against the briefs and the
decisions and leaves only a verdict. A checker never writes the tests it judges, and never built or
tested the stage it checks.

## What every brief names

1. The change id and the task (or the stage, for reviewer and checker).
2. The files in scope, as paths.
3. The decisions already made: `DEC-n`, the ADR, the spec scenario, the use case.
4. What is out of scope.
5. **Standing rules**: the project's own list and its narrow checks, task gate, full gates, docs
   gate and code-intelligence tools, all from the *Checks* block in its `AGENTS.md`; the testing
   checklist (`cosmic-python` `references/testing-checklist.md`); and the dependency rule
   ([`dependencies.md`](dependencies.md)): never work around our library.
6. **The report expected**: the base report and the *implementing* fields of `guardrails`
   `references/subagent-reports.md` (each gate run with its command, exit code, counts, duration
   and commit, and the narrow checks run), plus
   **Upstream findings**: every bug, gap or awkwardness met in any library, each marked *ours* or
   *external*, with a reproduction, or "none". The lead routes them per the dependency rule.

Builders and reviewers use the project's code-intelligence tools when it has them (symbol-level
reading and editing, impact analysis), and no other MCP tool. Builders use them for reading and
editing, reviewers for reading only. Those tools are for code only; the truth stays in the spine.

## Builder

> **Goal:** implement task `<n>` of `openspec/changes/<id>/tasks.md`, test-first. Update the docs
> this task changes. **Read:** `tasks.md` §`<n>`, `design.md` `<DEC-n>`,
> `tests/features/<f>.feature`. **Decided:** `<…>`. **Out of scope:** `<…>`. **Standing rules:**
> `<project list>`; the testing checklist; no workaround of our library: stop and report it.
> **Report:** base report + the *implementing* fields (`guardrails` `references/subagent-reports.md`) + Upstream findings.

A **fixer** is a builder whose task is a set of accepted findings, named by their `design.md`
decision. A **spike** is a builder whose task is one question; it ends with yes or no and the
evidence in `evidence/spike-<topic>.md`, and its code is not kept.

## Adversarial tester

> **Goal:** break the behaviour of stage `<s>` of `<id>`: edge cases, bad input, failures, limits.
> Write tests only, never production code. **Read:** the stage's tasks, scenarios and diff range.
> **Standing rules:** as for the builder. **Report:** base report + the tests added + each failing
> test with what it shows + Upstream findings.

A failing test is a bug: the lead decides it in step 4. A failure in our library becomes an
upstream issue, not a fix here.

## Reviewer

> **Goal:** review stage `<s>` of `<id>` through lens `<Ln>`. Read-only. **Read:** the diff range,
> `design.md`, the ADRs the stage touches, the stage's gate report. Do not re-run the suite: a
> missing or red gate run is a finding. **Report:** findings by priority per
> `meaningfy-code-review`, and any workaround of our library as a finding.

Where the appetite's review set is one pass ([`epic-delivery.workflow.json`](../assets/workflows/epic-delivery.workflow.json)), one reviewer covers its lenses together. The lenses themselves are owned by
`meaningfy-code-review`.

## Checker

> **Goal:** check stage `<s>` of `<id>`. Read-only. You did not build, test or review it. **Read:**
> the briefs of the stage, `design.md` (decisions incl. accepted findings), the spec scenarios, the
> diff range. **Check:** every brief item and every accepted finding is met (yes or no, with
> evidence); the traceability check per `bdd-gherkin`. **Report:** base report + the verdict per
> item.

The checker is the stage's four-eyes pass. When the stage changed a how-to or tutorial page, the
lead also dispatches a cold reader per `technical-writing`: a separate fresh agent given only the
page, because the checker has context a cold reader must not have.
