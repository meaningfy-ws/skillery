# The stage loop in detail

The six steps of a stage, what each scales with, and the table that gives every check one moment
and one owner. The summary is in the skill, and the review set of each appetite is in
[`epic-delivery.workflow.json`](../assets/workflows/epic-delivery.workflow.json); this page adds the detail.

## The steps

1. **Prepare.**
   - Every change the stage needs in one of our libraries is merged upstream and the lock is
     refreshed. A missing one blocks the stage ([`dependencies.md`](dependencies.md)).
   - Every external-library decision the stage needs is recorded in `design.md`.
   - The lead refreshes the project's code index in the background, where the project has one. A
     failed refresh warns, and the step reads the code instead.
   - The lead checks the blast radius of the symbols the stage touches, with the project's impact
     tool where it has one. A high or critical risk goes to the developer before any build.
   - Scenarios: signed off once per EPIC at the PLAN gate *(provisional)*, per `bdd-gherkin`. A
     scenario changed since is re-signed alone. Nothing is built on an unsigned scenario.
2. **Build.**
   - Builders take the tasks one at a time, test-first. Parallel builders only on disjoint files;
     otherwise one after another, or in separate worktrees.
   - The builder also updates the docs its task changed. There is no separate writer.
   - While a task is in progress the builder runs only the narrow checks its edit touches. Before
     it reports it runs the project's task gate once (named in the project's `AGENTS.md`: the full
     gates by default, a narrower gate where the project says so) and reports every gate run:
     command, exit code, counts, duration, plus the narrow checks run (`guardrails` §5,
     *implementing*).
   - The lead reads the diff and the report, reads the upstream findings and files the issues they
     call for, and commits the task. It re-runs the task gate only on a trigger, and names it in
     the commit body (`Re-run: T1, <reason>`):
     - **T1** the report lacks a field, or contradicts the diff: tests added but the count
       unchanged; exit 0 with failures listed; no gate for a file type the diff touches.
     - **T2** parallel builders touched a shared file.
     - **T3** a fix round ended (step 4).
3. **Challenge.** The lead refreshes the code index again if the project has one (background; a
   failure warns). In parallel, scaled by appetite: the reviewers, and the adversarial tester where
   the appetite's review set names it ([`epic-delivery.workflow.json`](../assets/workflows/epic-delivery.workflow.json)). Reviewers are read-only. Before the PR the lead
   runs the full gates once, unless the last task's report already ran them on the PR's head commit
   (same check, same code). Reviewers read that gate report and never re-run the suite; a missing or
   red run is a finding.
4. **Decide and fix.**
   - The lead sorts the findings. Each accepted one becomes a decision in `design.md` before any
     code changes (the Rule of Divergence: the spec first, then the code). The rest are rejected
     with a reason.
   - A finding that belongs to one of our libraries becomes an upstream issue, not a fix here.
   - Fixers apply the decisions in batches: security first, then structure. After a red run they
     re-run only the failing tests until green. Then the lead runs the full gates once (T3), then
     CI.
   - A test that both passes and fails on unchanged code is quarantined per the testing checklist
     (`cosmic-python`), never chased by re-runs inside the stage; the stage PR names it.
5. **Check.** Where the appetite's review set has a checker ([`epic-delivery.workflow.json`](../assets/workflows/epic-delivery.workflow.json)), one fresh checker over the
   whole stage. Where it has none, the stage's full gates and CI are the check, and the single
   review pass is the four-eyes pass. A
   cold reader runs on any how-to or tutorial page the stage changed, at any appetite. An unmet item
   goes back to step 4.
6. **Merge.** The lead opens the PR and merges it only on green CI, within its authority.

After the last stage, in this order: accept, docs stage, archive.

- **Acceptance demo** *(provisional)*, offered whenever the EPIC delivers or changes a use case:
  the lead runs the use case in the running system (or through the API) against the EPIC's success
  measure. The developer accepts it or names what is wrong. Below LARGE the developer may skip it;
  at LARGE and above it runs. The verdict, what was shown and the date, or the skip (who, why,
  date), go to `evidence/acceptance.md`. A rejection is a decision in `design.md` and a fix stage
  (steps 4–6) before any docs are written.
- **Docs stage.** The lead decides at accept. If the EPIC changed a use case, the architecture,
  installation or user-facing behaviour, it loads `technical-writing` first, then writes
  `evidence/docs-owed.md` (the pages owed) during the workflow's *inventory* phase, so the
  documentation workflow sees it. Otherwise it writes "no docs owed" in `evidence/docs-owed.md`
  and archives.
- **Archive.** The lead archives the change per `spec-stewardship`.

In `tasks.md` only the build stages carry checkboxes. The docs stage and the close are plain lines
under their own headings, with no checkbox; the documentation workflow tracks the docs stage. The
band shows `accept` once every build box is ticked.

## When a situation goes wrong

| Situation | Response |
|---|---|
| A brief cannot be written | The task is not ready; fix the PLAN |
| Our library falls short | Stop the task; upstream issue; `blocked by`; other tasks go on |
| An external library falls short | A decision recorded in `design.md` before any code |
| The checker finds a brief item unmet | Back to Decide and fix |
| The developer rejects at acceptance | A decision in `design.md`; a fix stage before the docs stage |
| A builder's report lacks a field | T1: the lead re-runs the task gate; fix the brief if its report line was unclear |
| The project names no task gate or full gates | The lead cannot write brief rule 5: ask the developer; the answer goes into the project's `AGENTS.md` |
| The project has no marker for quarantining a test | The framework's skip-with-reason plus the issue link |
| The code-index refresh fails | Warn; read the code instead |
| As-built contradicts an ADR (docs stage) | A finding to the lead; the developer decides; the page is not edited to match |
| The lead loads `technical-writing` mid-build | The band shows *documentation*; loading `epic-delivery` or `openspec-apply-change` switches back |
| A scenario changes after sign-off | Re-sign that scenario only |
| A member needs a decision | It reports to the lead; the lead asks the developer |

## Two examples

- **SMALL EPIC**, one stage, three tasks: three task-gate runs, no lead re-run, one full-gates run
  before the PR, one review pass (L2 + L3), one fix with its failing test re-run alone, one
  full-gates run (T3), CI. Two local full-gates runs in the stage. No checker, no tester. No
  scenario sign-off if the EPIC adds no scenario. The demo is offered and skipped
  (`evidence/acceptance.md`: "skipped by `<developer>`, `<reason>`, `<date>`"); `evidence/docs-owed.md`
  says "no docs owed"; archive.
- **LARGE EPIC** with screens, three stages: all scenarios signed off at the gate. Per stage:
  builder tasks, full gates, the PR, then the tester, five lenses and the UX lens in parallel, then
  decide and fix, full gates, then the checker, then merge. After stage 3: the acceptance demo
  (mandatory), `evidence/acceptance.md`; then the docs stage when docs are owed (the lead loads
  `technical-writing`; one PR with the LARGE review set); then archive.
- **Inconsistent report.** A builder reports `exit 0, 41 passed`; the diff adds two tests and the
  previous count was 41. T1: the lead re-runs the task gate and the commit body reads
  `Re-run: T1, count unchanged after two added tests`.

## The check ledger

Every check of a delivery, its one moment and its one owner. No phase of the workflow file repeats
a row.

| Check | Moment | Owner | Re-run only when |
|---|---|---|---|
| Clarity gate (at most 2 runs at TINY and SMALL) | Before the first task | Planner; the developer decides gaps | — |
| Scenario sign-off | At the PLAN gate; a changed scenario alone | Developer | The scenario changed |
| Impact (code index refreshed) | Prepare | Lead | — |
| Narrow checks | While a task is in progress | Builder | Each edit |
| Task gate | Once per task, before the report | Builder | T1, T2 (lead) |
| Diff reading | Each task | Lead | — |
| Full gates | Once per stage before the PR (skipped if the last report ran them on the head commit); once after the fix round | Lead | T3 is the second |
| Review set of the appetite (incl. L2 doc agreement, `meaningfy-code-review`) | Once per stage, on the PR | Reviewers | — |
| Adversarial tester | Once per stage, where the set names it | Tester | — |
| Failing tests | After a red run, until green | Fixer | Until green |
| Checker | Once per stage, after the fixes | Checker | Unmet item → step 4 |
| Evidence before a claim (`verification-before-completion`) | Before the lead reports a stage done | Lead | — |
| Cold reader | A how-to or tutorial changed in a stage; every task-oriented page of the docs stage | Cold reader | The page changed again |
| CI | Each push | CI | — |
| Acceptance demo or skip record | After the last build stage | Developer | Rejection → fix stage |
| Docs-stage verify (snippets, docs gate) | Docs stage | Builder | — |
| `openspec validate --strict` | Archive | Lead | — |

The loop replaced an older thirteen-step loop that ran every check on every stage. It now runs
each check once, at the moment and by the owner in this table.
