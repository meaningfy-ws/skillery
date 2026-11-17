# The team and its briefs

Who plays each role and the brief each member gets. The brief and report mechanics (fresh not a
copy, inputs as paths, the base report, the four-eyes rule) are owned by `guardrails` §5; this page
adds only what delivery puts into them.

## Who plays each role, and when

The developer and the domain expert are people (`SKILL.md`, *The team*).

| Role | Played by | Model | Used when |
|---|---|---|---|
| Lead | The main session, which may be started as the `team-lead` agent | The session's | Always. Never a subagent: it is the only one that talks to the developer |
| Architect | `system-architect` agent | Declared (opus) | Shaping session |
| Planner | `epic-planner` agent | Declared (opus) | Shaping only (an `epic-planner` session) |
| Builder | `implementer` agent | Declared (sonnet) | Every task, every accepted fix, every spike |
| Reviewer | `code-reviewer` agent, one per lens | Declared (opus) | Every stage, scaled by appetite |
| Checker | A fresh general-purpose subagent | opus | Once per stage, where the appetite's review set has one ([`epic-delivery.workflow.json`](../assets/workflows/epic-delivery.workflow.json)) |
| Adversarial tester | `implementer` with the tester brief | Declared (sonnet) | On its condition ([`stage-loop.md`](stage-loop.md), Prepare) |
| UX designer | A general-purpose subagent with the design skills | opus | Screens in scope, any size (the UX review lens runs where the appetite's review set has `ux`, when screens changed) |

No role has its own catalogue agent beyond these. The checker and the tester differ from the others
by their brief, not by their tools. The lead sets the model only for the general-purpose roles:
opus, as both are judgement work (`guardrails` §5).

The tester tries to break the behaviour and leaves tests in the suite. The checker reads the stage
against the briefs and the decisions and leaves only a verdict; it never wrote the tests it judges
and never built or tested the stage.

## What every brief names

1. The change id and the task (or the stage, for reviewer and checker).
2. The files in scope, as paths.
3. The decisions already made: `DEC-n`, the ADR, the spec scenario, the use case.
4. What is out of scope.
5. **Standing rules**: the project's own list and its narrow checks, task gate, full gates, docs
   gate and code-intelligence tools, all from the *Checks* block in its `AGENTS.md`; the testing
   checklist (`cosmic-python` `references/testing-checklist.md`); and the dependency rule
   ([`dependencies.md`](dependencies.md)): never work around our library. A project that names no
   task gate or full gates leaves this item unwritable: the lead asks the developer, and the answer
   goes into the project's `AGENTS.md`.
6. **Tools**, for every role: code is read with Read (a range), Grep and Serena, not `sed -n`,
   `cat` or `grep -A | head` chains through Bash; files change through Edit or Serena only; Bash
   runs tests, checks and git, one purpose per call. A sandbox bypass names the commands it covers
   (`uv run pytest <file>`, `git commit`), never "commands need the sandbox disabled".
7. **The report expected**: the base report and the *implementing* fields of `guardrails`
   `references/subagent-reports.md`, plus
   **Upstream findings**: every bug, gap or awkwardness met in any library, each marked *ours* or
   *external*, with a reproduction, or "none". The lead routes them per the dependency rule.
   For the tester, a reviewer and the checker, the report ends in **the result line** (its one
   definition), written with `accepted=-`:

   ```text
   result: stage=<s> role=tester tests=<n> failed-first=<n> findings=<n> accepted=<n|->
   result: stage=<s> role=reviewer lens=<L1+L2> findings=<n> accepted=<n|->
   result: stage=<s> role=checker verdict=<pass|fail> findings=<n> accepted=<n|->
   ```

   The lead writes each line again with `accepted=<n>` under `Results` in the PR body. A report
   without it is incomplete: the lead returns it and re-runs nothing.

   **The mark** (its one definition) says which change, phase and stage the session is in:

   ```text
   mark: change=<id> phase=<shape|plan|deliver> stage=<n|->
   ```

   The lead writes it as a whole line in its own message (not in a fence, not in a tool input) at the
   start of each stage and, in a session carried on from a hand-over note, before its first brief. It
   repeats the line in the turn's last message when that turn dispatches a worker, because the
   navigator reads only the last message. Archive and release write none.

Tools for each activity, and their fallbacks: the table in `guardrails` (`references/activity-tools.md`).

## Builder

> **Goal:** implement task `<n>` of `openspec/changes/<id>/tasks.md`, test-first. Update the docs
> this task changes. **Read:** `tasks.md` §`<n>`, `design.md` `<DEC-n>`,
> `tests/features/<f>.feature`. **Decided:** `<…>`. **Out of scope:** `<…>`. **Standing rules:**
> `<project list>`; the testing checklist; no workaround of our library: stop and report it.
> **Edits:** Edit or Serena only; Bash runs commands and never writes a file. **Scratch:**
> `<scratchpad>/<task-id>/`.
> **Report:** base report + the *implementing* fields (`guardrails` `references/subagent-reports.md`) + Upstream findings.

The brief always carries the *Edits* line word for word, and never a blanket "commands need the
sandbox disabled": that sends every step, file writes included, through Bash.

**Worktrees.** The lead makes each builder's worktree (`git worktree add <path> <sha>`, outside the
sandbox) inside a folder its session can edit: a git-ignored `.worktrees/` in the repository, or a
folder the session was started with (`--add-dir`, `permissions.additionalDirectories`). A worktree
beside the repository is outside the session, so `Edit` is refused there and the builder falls
back to shell edits. Never the Agent tool's `isolation: worktree`, which bases on the remote
default branch. The brief names the path and the base commit. The builder runs
`git rev-parse HEAD` there first and, if it is not the named commit, stops and reports. Builder and
lead use the sandbox bypass only for commands that write `.git` or the environment (`git commit`,
`uv sync`). Parallel sessions each started in their own worktree need none of this; the lead of a
long session with parallel builders works in its own worktree from the start, so another session
cannot take its checkout.

**Edits.** Edit tool or Serena only, Makefiles one recipe at a time, never `sed -i`, an inline
`python`/`node` write, a `cat`/`tee` heredoc or a `git checkout`/`git restore` of a file; the
`no-shell-edits` mod denies them. If `Edit` is refused, the builder stops and reports. For the same mechanical
edit at many sites, the builder may write a script that only prints the edits
(`file:line old → new`); the lead reviews that list before the builder applies it, and the builder
reads every changed site back.

**Parallel builders** each get a scratch directory, `<scratchpad>/<task-id>/`, and never run a
script from another builder's directory. They never kill processes by pattern, never use
`git stash` (the stack is shared by all worktrees) and never start a second background run.

A **fixer** is a builder whose task is a set of accepted findings, named by their `design.md`
decision. A **spike** is a builder whose task is one question; it ends with yes or no and the
evidence in `evidence/spike-<topic>.md`, and its code is not kept.

## Adversarial tester

> **Goal:** break the behaviour of stage `<s>` of `<id>`: edge cases, bad input, failures, limits.
> Write tests only, never production code; write one property per invariant in the PLAN's
> `## Invariants` section, or per error-matrix row where it has none. **Read:** the stage's tasks,
> scenarios and diff range. **Standing rules:** as for the builder. **Report:** base report + the
> tests added, each with what it attacks (a scenario or error-matrix row, or "none" and why) and
> whether it failed on its first run (the test's docstring says "found <defect id>" or "probe of
> <decision id>") + each failing test with what it shows + Upstream findings
> and the result line.

A failing test is a finding: the lead decides it in step 4, under the floor. A failure in our library becomes an
upstream issue, not a fix here.

## Reviewer

> **Goal:** review stage `<s>` of `<id>` through lens `<Ln>`. Read-only. **Read:** the diff range,
> `design.md`, the ADRs the stage touches, the stage's gate report. Do not re-run the suite: a
> missing or red gate run is a finding. **Report:** findings by priority per
> `meaningfy-code-review`, any workaround of our library as a finding, and the result line.

Where the appetite's set is one pass or two merged reviewers (the MEDIUM default, a recorded small
stage; `SKILL.md`, the review sets), the brief names the appetite and the lenses each reviewer
covers. The lenses are owned by `meaningfy-code-review`.

## Checker

> **Goal:** check stage `<s>` of `<id>`. Read-only. You did not build, test or review it. **Read:**
> the briefs of the stage, `design.md` (decisions incl. accepted findings), the spec scenarios, the
> diff range. **Check:** every brief item and every accepted finding is met (yes or no, with
> evidence); each re-label of a finding as Critical (agree or not, one line); the traceability
> check per `bdd-gherkin`. **Report:** base report + the verdict per item and the result line.

The checker is the stage's four-eyes pass. When the stage changed a how-to or tutorial page, the
lead also dispatches a cold reader per `technical-writing`: a separate fresh agent given only the
page, because the checker has context a cold reader must not have.
