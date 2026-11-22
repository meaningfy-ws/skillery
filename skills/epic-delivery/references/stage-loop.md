# The stage loop in detail

The six steps of a stage and the ledger that gives every check one moment and one owner. The
review set of each appetite is in
[`epic-delivery.workflow.json`](../assets/workflows/epic-delivery.workflow.json).

## The steps

1. **Prepare.**
   - Every change the stage needs in one of our libraries is merged upstream and the lock is
     refreshed. A missing one blocks the stage ([`dependencies.md`](dependencies.md)).
   - Every external-library decision the stage needs is recorded in `design.md`.
   - The lead runs the project's code index once at stage start, where the project has one. A
     failed run warns, and the step reads the code instead. Then it runs `impact` on each task's
     symbols and pastes at most ten lines per task into that task's brief (high or critical: to
     the developer first).
   - **Tester condition** (defined here only; the tester is opt-in): from MEDIUM up, the stage
     changed code and either a PLAN `## Invariants` row for it has a *Test* cell starting
     `tester`, or the lead records a `D-n` asking for it. Otherwise none runs. The PR body gets
     `tester: yes, <INV-n or D-n>` or `tester: no, <reason>`.
   - A stage risk not in the PLAN's `RISK-` rows is recorded as a `D-n`.
   - Scenarios: signed off once per EPIC at the PLAN gate *(provisional)*, per `bdd-gherkin`. A
     scenario changed since is re-signed alone. Nothing is built on an unsigned scenario.
2. **Build.**
   - Builders and reviewers run no GitNexus tool; the brief carries the pasted impact lines.
     Before the stage commit the lead runs the index, `detect_changes` and `impact` once. More runs
     only when a task's scope moves, never per edit or per lens.
   - Builders take the tasks one at a time, test-first. Parallel builders only on disjoint files;
     otherwise one after another, or in separate worktrees.
   - The builder also updates the docs its task changed. There is no separate writer.
   - While a task is in progress the builder runs only the narrow checks its edit touches.
   - Before it reports, the builder runs the project's task gate once. The project's `AGENTS.md`
     names it: the full gates by default, a narrower gate where the project says so.
   - The builder reports every gate run with the *implementing* fields (`guardrails`
     `references/subagent-reports.md`).
   - The lead reads `git diff --stat` and the report, spot-checks the files the report names (the
     checker reads the full diff), reads the upstream findings and files the issues they call for,
     and commits the task. Once its context passes `compact_offer_tokens` it compacts at the next
     safe point, after a commit (`guardrails` §6). It re-runs a gate only on a trigger, and names it in the
     commit body (`Re-run: T1, <reason>`):
     - **T1** the report lacks a field, or contradicts the diff: tests added but the count
       unchanged; exit 0 with failures listed; no gate for a file type the diff touches. The lead
       re-runs the task gate. Example: a builder reports `exit 0, 41 passed`, the diff adds two
       tests and the previous count was 41; the commit body reads
       `Re-run: T1, count unchanged after two added tests`.
     - **T2** parallel builders touched a shared file. The lead re-runs the task gate.
     - **T3** the lead's full-gates run after a fix round (step 4).
3. **Challenge.**
   - The lead runs the full gates once, unless the last task's report ran them on the commit that
     is the PR's head (same check, same code). It records the report, the *implementing* fields,
     in the PR body and opens the PR.
   - Then, in parallel: the appetite's review set (the workflow file; `SKILL.md`, *Review sets*)
     and the tester on its condition.
   - **Parallel spawns:** the lead sends independent spawns in one message: the reviewers of a
     stage, and builders on disjoint files.
   - Reviewers are read-only. They read the gate report in the PR body and never re-run the suite;
     a missing or red run is a finding. Each report ends with its result line.
4. **Decide and fix.**
   - Before the fix round the lead checks that `git status` is clean; an edit made by a reviewer
     is discarded and reported.
   - **The floor:** only a Critical finding (`meaningfy-code-review`'s scale) is fixed. The rest
     are rejected "under the floor", one line each under `## Delivery decisions`, and a tester
     test that failed first for one is deleted. A re-label to Critical needs a reason; the label,
     not the lens, decides, and the checker judges it. A Critical finding that is a light chore
     (at most ten lines in files the lead has already read in this stage, no new test) the lead
     applies with Edit and the commit body says `lead-fixed: <finding id>`; every other one is a
     brief.
   - **The sort of the tester's tests**, in the one fix pass, before the gate run that checks it
     (with no finding above the floor, the sort is the whole pass). Its builder keeps a test that
     failed first for an accepted finding, a test that alone covers a scenario or an error-matrix
     row, and one property per invariant the tester brief names; it deletes every other one (a test
     under the floor goes as the floor bullet says), moves the kept into files named by feature
     (testing checklist rule 21), and returns the kept list, the deleted list, each with its
     reason, and the refactoring opportunities it saw. The lead confirms the lists; the builder
     restores a deletion the lead does not confirm, in the same pass. The PR lists each deleted
     test with its reason, and the opportunities.
   - Each accepted finding is a decision in `design.md` before any code (the Rule of Divergence),
     or an upstream issue when it is our library's. The PR body gets the result lines again.
   - **One fix pass:** fixers in one batch, security first, then structure; a fixer re-runs
     only the failing tests, at most `max_red_runs` red runs (`fixer_max_red_runs`, default 3),
     then stops with a `blocked` report (below); then the full gates once (T3) and CI. A red CI run or a
     refused merge is no review round: only that failure is fixed.
   - **After a `blocked` report** the lead chooses one of two: a fresh fixer briefed with that
     report, or one question round to the developer with a recommendation per question. Never a
     third fixer on the same finding; the lead tracks finding ids in the stage's result lines.
     The navigator warns when one subagent runs the full gates more than `fixer_max_red_runs`
     times.
   - A flaky test is quarantined per the testing checklist (`cosmic-python`
     `references/testing-checklist.md`), not chased with re-runs. A project with no quarantine
     marker uses the framework's skip-with-reason plus the issue link.
5. **Check.** One fresh checker where the appetite's set has one; otherwise the full gates and
   CI, with the single review pass as the four-eyes pass. The checker and the cold reader
   are one run, the checker's, when the stage changed no how-to or tutorial page; when it did, a
   separate cold reader reads that page alone. An unmet item, a disputed re-label or a late tester finding
   goes to the developer as a question: fix it now as a `D-n` (one fixer, one full-gates run,
   nothing else) or a follow-up issue. No second fix pass.
6. **Merge.** Within the lead's authority (`SKILL.md`, *Authority*); without a grant the developer
   approves the merge first. The note ([template](../assets/templates/handover.md)) is committed as
   `openspec/changes/<id>/handover.md`, the PR's last commit; a fix after a red check goes before
   it, the note re-committed last, then the command runs again. A PR that lists no check run has
   not had CI: wait for it, never merge, and never use `gh pr merge --auto` (with no required
   checks it merges at once). Once the PR lists a check run, one
   background command: `gh pr checks <n> --watch --fail-fast && gh pr merge <n> --merge
   --delete-branch` (the repository's merge method); its notice is the only wait, never a sleep
   loop. On a non-zero exit, `gh pr view <n> --json state,mergeStateStatus` tells a red or missing
   check, a refused merge, or only the local branch left. When a repository rule conflicted with
   session hygiene during the stage, the lead notes it under Open in `handover.md`. Then the session ends, no compaction;
   the next stage starts fresh from the note's prompt.

A LARGE EPIC with screens, three stages, runs this way: all scenarios signed off at the gate; per
stage, builder tasks, full gates, the PR, then five lenses, the UX lens and the tester on its
condition in parallel, the one fix pass, full gates, the checker, the note, watch-and-merge, a
fresh session. After stage 3 the mandatory demo, then the docs stage when docs are owed (one PR
with the LARGE review set), then archive.

## After the last build stage

In this order: accept, docs stage, archive.

- **Acceptance demo**, offered whenever the EPIC delivers or changes a use case: the lead runs the
  use case in the running system (or through the API) against the EPIC's success measure. The
  developer accepts it or names what is wrong. Whether it may be skipped is set by the appetite
  table in [`verification-validation.md`](verification-validation.md). The verdict, what was shown
  and the date, or the skip (who, why, date), go to `evidence/acceptance.md`. A rejection is a
  decision in `design.md` and a fix stage (steps 4–6) before any docs are written.
- **Docs stage.** The lead decides at accept. If the EPIC changed a use case, the architecture,
  installation or user-facing behaviour, it loads `technical-writing` first, then writes
  `evidence/docs-owed.md` (the pages owed) during the workflow's *inventory* phase, so the
  documentation workflow sees it. Otherwise it writes "no docs owed" in `evidence/docs-owed.md`
  and archives. As-built that contradicts an ADR is a finding to the lead and the developer
  decides; the page is not edited to match.
- **Archive.** The lead archives the change per `spec-stewardship`.

In `tasks.md` only the build stages carry checkboxes. The docs stage and the close are plain lines
under their own headings, with no checkbox; the documentation workflow tracks the docs stage. The
navigator band shows `accept` once every build box is ticked; while the lead has `technical-writing`
loaded mid-build it shows *documentation*, and loading `epic-delivery` or `openspec-apply-change`
switches back.

## The check ledger

Every check of a delivery, its one moment and its one owner. No phase of the workflow file repeats
a row.

| Check | Moment | Owner | Re-run only when |
|---|---|---|---|
| Clarity gate (at most 2 runs, any appetite) | In shaping, before the epic session | Planner; the developer decides gaps | — |
| Scenario sign-off | At the PLAN gate; a changed scenario alone | Developer | The scenario changed |
| Impact (GitNexus, lead only) | Two points: index and `impact` per task at stage start (≤ 10 lines per brief); index, `detect_changes` and `impact` once before the stage commit | Lead | A task's scope moves |
| Narrow checks | While a task is in progress | Builder | Each edit |
| Task gate | Once per task, before the report | Builder | T1, T2 (lead) |
| Diff reading | Each task, before its commit | Lead | — |
| Full gates | Once per stage before the PR (skipped only if the last report ran them on the PR's head commit); once after the fix pass | Lead | T3 is the second |
| Review set of the appetite (incl. L2 doc agreement, `meaningfy-code-review`) | Once per stage, on the PR | Reviewers | — |
| Adversarial tester | Once per stage, on its opt-in condition (Prepare) | Tester | Distilled in step 4 |
| Floor and fix pass; failing tests | Once per stage; failing tests after a red run, at most `max_red_runs` | Lead (floor), fixer | — |
| Checker (also the cold reader when no how-to or tutorial page changed) | Once per stage, after the fix pass | Checker | — (unmet → developer) |
| Evidence before a claim (`verification-before-completion`) | Before the lead reports a stage done | Lead | — |
| Cold reader (separate agent) | A how-to or tutorial changed in a stage; every task-oriented page of the docs stage | Cold reader | The page changed again |
| CI | Each push | CI | — |
| Acceptance demo or skip record | After the last build stage | Developer | Rejection → fix stage |
| Docs-stage verify (snippets, docs gate) | Docs stage | Builder | — |
| `openspec validate --strict` | Archive | Lead | — |
