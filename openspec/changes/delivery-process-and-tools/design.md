> Derives from: EPIC `delivery-process-and-tools` ([`proposal.md`](proposal.md)), DEC-1 to DEC-19,
> as re-shaped on 2026-11-15 ([`inputs/reassessment-2026-11-15.md`](inputs/reassessment-2026-11-15.md)).

## Context

The EPIC is LARGE and frozen; every DEC- is settled and cited here, not argued again. This PLAN
says where each decision lands, in which words, how it is proven, and in which order.

What the code and the skills hold today (read on 2026-11-15, `develop` at `37e90cf`):

- `skills/epic-delivery/SKILL.md` (12.1 KB) and its references `stage-loop.md` (10.3 KB),
  `team-and-briefs.md` (6.7 KB): compact between stages (SKILL l. 119); every finding sorted,
  no floor, fix then "back to step 4" on an unmet item; the Planner row of the team finishes the
  PLAN at the start of an epic session; the Sessions table lists "the PLAN finished and gated"
  as epic-session output; the tool paragraph says "MUST actively use" and names tools no agent
  sees by those names.
- `skills/epic-delivery/assets/workflows/epic-delivery.workflow.json`: `reviews.MEDIUM` is five
  lenses with a `small_stage` allowance; `tester` is `null` at TINY, SMALL and MEDIUM and
  "Adversarial tester" from LARGE up. The navigator reads `tester` and `ux` as wording, counts
  `reviewers` as the per-turn ceiling (`mods/navigator/lib/dispatch.ts` `reviewQuota`,
  `overspawn`) and validates the shape (`mods/navigator/lib/workflow.ts` `reviewError`).
- `skills/epic-planning/SKILL.md`: the two-run limit holds at TINY and SMALL only (step 8); the
  shaping session ends "shaped, not planned" (l. 101). Its workflow file
  `epic-shaping.workflow.json` already has the `design` and `revise` phases, so DEC-19 changes
  prose, not phases.
- `skills/guardrails/SKILL.md` §6 compacts "between stages of a long epic session".
  `assets/session-thresholds.json` already counts `pr-merged` as a `task_boundary`, so the
  navigator already offers a fresh session after a stage's merge; no data change is needed.
- `agents/implementer.md` preloads five skills (35% of an 80,000-token first call, second pass);
  its Glue runs the impact check before every symbol edit. `agents/code-reviewer.md` names its
  tools by glob.
- Serena exposes two tools on Claude Code: `mcp__serena__initial_instructions` (the manual and a
  session id) and `mcp__serena__serena_repl`, a Python REPL whose `s.lsp` facade holds
  `find_symbol`, `find_referencing_symbols`, `get_symbols_overview`, `rename_symbol`,
  `safe_delete_symbol`, `get_diagnostics_for_file`, and whose `s.edit` facade holds
  `replace_symbol_body`, `insert_after_symbol`, `insert_before_symbol`. Several operations fit in
  one call. On opencode an MCP tool is reached as `<server>_<tool>`; Serena there is unverified.
- Review priorities in `meaningfy-code-review` (Output format): **Critical** (breaks
  functionality, security or architecture boundaries; must fix before merge), **Warnings**,
  **Suggestions**. This is the scale the floor uses (rabbit-hole "the floor needs a scale").
- `AGENTS.md` is 14,659 characters, 2,907 of them the generated GitNexus block (which says
  "before every edit"); `CLAUDE.md` is 1,756; the template `AGENTS.md.tmpl` is 8,803.
- `tools/repo_lint/lint.py` holds the catalogue checks; `lean-skills` stage 1 adds two checks to
  the same file in the same wave.
- `harden-checks-and-tests` D-28 and D-29 are history there and deliver nothing (its D-30); the
  four test EPICs cite this EPIC for the stage loop.

Repository rules applied: P-0002 (Serena for every code operation it supports, encouraged in
instructions and briefs) and P-0003 (a skill kept to the minimum, 24 KB of prose).

## Goals / Non-Goals

**Goals:**

- Every DEC- of the EPIC lands in its one home, worded once, with the other files pointing to it.
- Each new rule has a hand-run agent scenario under `tests/features/` (DEC-14, check 1).
- A fresh session given only the hand-over note and the change folder starts the next stage
  without asking what was decided (DEC-14, check 2), proven on this EPIC's own stage boundaries.
- The implementer's and a main session's first call are measured smaller against the savings of
  D-12 (DEC-14, check 3).
- The next EPIC delivered under the new rules is measured (DEC-14, check 4).

**Non-Goals:** everything under the EPIC's No-gos. In particular: no navigator code change, no new
hook, mod, agent or skill; no description change; no edit in another repository; no shrinking of
skill bodies beyond the text a rule replaces (that is `lean-skills`).

## Decisions

New choices made while planning. Settled ones are cited by DEC-n.

- **D-1 The hand-over note** (DEC-1, DEC-19). One file, `openspec/changes/<id>/handover.md`,
  rewritten at each boundary (git keeps the earlier ones). It is the **last commit of the stage's
  pull request**, written after the check and before the watch-and-merge command, so it reaches
  `develop` with the merge and the fresh session finds it on any checkout of `develop`. Five fixed
  headings and nothing else:
  *Done* (stage, PR number), *Decided since the PLAN* (the `D-n` ids only, no restatement),
  *Open* (questions, risks, upstream issues), *Next* (the stage, its first task, the files to read
  first), *Prompt* (the one prompt the developer pastes into the fresh session, last). It points
  and does not copy: what is in `design.md` stays there. No line limit; the cold-start check of
  D-11 decides whether it was enough (rabbit-hole "too thin or too thick"). The same note is
  written between an EPIC and its PLAN when the shaping session is reset (DEC-19). The template
  lives once, as a file, `skills/epic-delivery/assets/templates/handover.md` (P-0003: a template,
  not prose); `stage-loop.md`, `epic-planning` and `guardrails` §6 point to it. A fresh session
  runs whatever skills are installed; the note's prompt carries what it needs, so the note works
  under both the old and the new release.
- **D-2 The severity floor is Critical** (DEC-4) *(owner, Q-1)*. A
  finding becomes a fix only when it is Critical on the scale of `meaningfy-code-review`.
  Warnings and Suggestions are rejected with the reason "under the floor" and listed under
  `## Delivery decisions` in `design.md`, one line each, so RISK-1 can be traced later. A lead who
  judges a Warning to be Critical re-labels it with a reason; the label, not the lens, decides.
  The checker judges each re-label (agree or not, one line); a re-label it does not agree with
  goes to the developer, so re-labelling cannot become a way round the floor.
  A tester's test that failed on its first run for a finding under the floor is deleted with the
  reason "under the floor" (DEC-4).
- **D-3 The one fix pass and what follows it** (DEC-4). Accepted findings are fixed in one batch
  of fixers (security first, then structure, as today), then the full gates run once (T3) and CI.
  The check (the checker, or the gates and CI where the appetite has none) reads that pass. An
  item the checker finds unmet is **not** a second fix pass: it goes to the developer in the
  question format, with a recommendation: fix it now as a recorded `D-n` (the one exception, by
  the developer's word, fixed by one fixer and followed by one full-gates run; nothing else is
  accepted in it), or a follow-up issue. A red CI run or a refused merge is not a review round:
  only that failure is fixed, and no new finding is accepted on the way. Findings that arrive
  after the fix pass (a late tester run, see the error matrix) go to the developer the same way
  as an unmet item. `test-suite-care` adds its sorting sentence to this pass later (S-2); this
  PLAN leaves the place for it and writes no sorting rule.
- **D-4 MEDIUM takes the small set by default, stated as wording** (DEC-5) *(the agent's choice,
  `inputs/qa-plan-2026-11-15.md`)*.
  In `reviews.MEDIUM`: `challenge` reads "Two reviewers (L1 with L2; L3 with L4 and L5) by
  default; the five lenses when a risk is recorded for the stage"; `reviewers` stays 5, because the
  navigator uses it as the ceiling a turn may spawn, and a restored full set must not warn;
  `small_stage` is removed from MEDIUM (the default replaces the allowance) and stays unchanged
  from LARGE up. "A risk recorded for the stage" means a `RISK-` row of the PLAN that names the
  stage or its files, or a `D-n` the lead records in Prepare naming the risk. No new key and no
  navigator code; the navigator no longer shows the small figure at MEDIUM, which is accepted. One
  navigator *test* asserts that MEDIUM carries `small_stage`
  (`mods/navigator/lib/workflow.test.ts`, test "D-12 epic-delivery"); its expected data changes
  with the file (task 1.2). The pages that describe the MEDIUM allowance change with it:
  `docs/development/workflows.md`, `docs/environment/navigator.md` and the small-stage lines of
  `meaningfy-code-review` (task 1.7). The `code-reviewer` description's "recorded small stage"
  stays true from LARGE up, so it is not touched (No-gos).
- **D-5 The tester condition, worded once** (DEC-3; the owner's answer to Q-3). The condition:
  the stage changed code, and the PLAN's `## Invariants` has a row for that code whose test is
  the tester's (its *Test* cell starts with `tester`, the convention of `activity-test-profiles`).
  **A PLAN without an `## Invariants` section** keeps today's rule: the tester on every stage from
  LARGE up, none below. So the switch happens PLAN by PLAN as the section appears, and no second
  edit is needed when `activity-test-profiles` lands. The rule is stated once, in
  `references/stage-loop.md` (Prepare: the lead judges it and records the answer in one line of
  the PR body). The workflow file's `tester` at MEDIUM and up only points there: "Adversarial
  tester, on its condition (stage loop, Prepare)". TINY and SMALL stay `null` (rabbit-hole on
  DEC-3). The navigator reads `tester` as wording, so no mod change.
- **D-6 The result line** (DEC-18) is defined once, in `references/team-and-briefs.md` under
  *What every brief names* (item 6), in the three forms of DEC-18. The tester's, reviewer's and
  checker's briefs end their Report line with "and the result line". In step 4 the lead writes
  each line again with `accepted=<n>` in the PR body, under a `Results` heading. A report without
  the line is incomplete (T1-like: the lead returns it, it does not re-run anything).
- **D-7 Watch and merge is one command** (DEC-6). The Merge step runs, in the background where the
  CLI offers it:
  `gh pr checks <n> --watch --fail-fast && gh pr merge <n> --merge --delete-branch`.
  Its completion notice is the only wait. On a non-zero exit the lead first runs
  `gh pr view <n> --json state,mergeStateStatus` to tell the three states apart (a red or
  missing check; a refused merge; merged but the local branch not deleted, which is harmless in a
  worktree). The command is started only after the PR has registered its first
  check run (`gh pr checks <n>` lists one); before that `--watch` exits at once with "no checks
  reported". The merge method follows the repository's own (`--merge` here; the brief names it
  where a repository squashes).
- **D-8 The lead stays small** (DEC-7). Stated once in `epic-delivery` *The team* (the Lead row
  and one sentence under it): one EPIC per session; the lead never takes a builder's task, even a
  one-line one (a one-line fix is a fixer brief); several known files are read in one call, and
  reading that would cross more than a few files goes to an exploring subagent per `guardrails`
  §5. `guardrails` §6 gains one bullet, "batch the reads", which `epic-delivery` cites.
- **D-9 The tool table** (DEC-8, DEC-9). Home: `skills/guardrails/references/activity-tools.md`,
  one table, pointed to from §5 in one line; a reference, not the body, to keep `guardrails`
  under P-0003's budget. Columns: *Activity*, *Agents* (the catalogue agents that perform it, or
  `lead`), *Claude Code*, *opencode*, *Fallback*. Rows (exact cells are task 2.1's): read code by
  symbol; find references; file overview; edit a symbol body or insert beside it; rename; safe
  delete; diagnostics; structural search and rewrite (ast-grep); impact and change check
  (GitNexus); read a file or a range; edit a file; search text; run checks; wait for a long
  command; watch and merge a PR. Below the table, one short paragraph teaches Serena: call
  `initial_instructions` once per session for the session id, then `serena_repl` with
  `s.info("lsp")` or `s.info("edit")` once, then several operations per call. The *opencode*
  column names `<server>_<tool>` forms; Serena's is marked "unverified, gap" unless task 2.3 sees
  it (rabbit-hole). "Mandatory" goes from every brief and binding that says it.
- **D-10 The table's check** (activity-tools spec). A lint check `activity_tools_table` parses the
  table: every agent in an *Agents* cell exists (`lead` is checked as `team-lead`, the lead's
  agent); every tool in that row's *Claude Code* cell matches an entry of each named agent's
  `tools:` list, globs included (`fnmatch`). Token rule: **every backticked token in a *Claude
  Code* cell is a tool name** (`Read`, `Edit`, `Bash`, `mcp__serena__serena_repl`, …), and
  anything else (flags such as `run_in_background`, Serena's `s.lsp` calls, commands) is written
  in plain text or in the *Fallback* cell. A row whose tool only some of its agents carry names
  only those agents (for example, Serena rows name `implementer` and `code-reviewer`, not `lead`). It fails naming the row and the agent. The *opencode* column is not
  checked: there the tool list does not restrict (gap G-6 in `docs/environment/dual-cli/mapping.md`).
  It runs in `make lint` and so in `make validate`.
- **D-11 The cold-start check** (DEC-14, check 2). This EPIC proves it on itself: at the end of
  stages 1 and 2 the lead writes the note and ends the session; the developer starts the next
  stage with the note's prompt. Pass: the new session reaches its first brief without asking what
  was decided and without reading `inputs/` or the archived changes. The developer records pass
  or fail, and any question the session asked, in `evidence/cold-start.md`. A fail is a fix of
  the note's template (D-1) before the next boundary, not a longer note. The check tests the note,
  not the new skill text, so it holds although those sessions run the installed release.
- **D-12 The savings the measurement is held to** (DEC-14, check 3). The skills and agents a
  session runs come from the installed plugin, not the worktree, so the measurement loads each
  version explicitly.
  - *Implementer:* first call at least 20,000 tokens smaller than the baseline (of the five
    preloaded skills, which are about 28,000 tokens, four go; DEC-10).
  - *Main session in skillery:* first call at least 800 tokens smaller (repository instructions
    from 16,415 characters to at most 12,000 plus a `CLAUDE.md` of at most 1,000; about four
    characters a token).
  - *Fixture:* in a scratch worktree of this repository, a main session started with the prompt
    "Reply with OK." (its first call is the main start weight), and in a second session one
    implementer dispatched with a fixed brief: "add one negative test to
    `tests/test_repo_lint_negative.py` for `missing_skill_dirs`; report only".
  - *Method:* after stage 3 merges, on one day, the fixture runs twice: once with
    `claude --plugin-dir` pointing at the `bundles/` plugins of a checkout of the base commit
    (`develop` before stage 1 merged, its SHA recorded), with that checkout's `AGENTS.md` and
    `CLAUDE.md`; once the same way from the checkout after stage 3. The installed plugins are
    disabled for both runs. `session_digest.py` gives `first_ctx` of each first call; the two
    retrospective scripts are used as they are (no-go). Recorded in `evidence/start-weight.md`
    with both SHAs and the instruction sizes. A saving below the figure is reported as it is,
    with the reason; the figure is not moved to fit. If `--plugin-dir` cannot replace the
    installed plugins, the after-run moves to just after the release, and the record says so.
- **D-13 The size budget** (DEC-12) *(owner, Q-2: 12,000 characters)*. The figure
  lives once, in a comment on the first line of `AGENTS.md.tmpl`
  (`<!-- size budget: 12000 characters -->`). The lint check `binding_size` reads it there and
  fails when this repository's `AGENTS.md` or the template, measured without that comment, is
  larger. The template states the budget in that same comment; a scaffolded project inherits it.
  What this repository's `AGENTS.md` (14,659 characters) cuts to fit, with the habits block
  added: the GitNexus block, 2,907 between its markers (about 3,060 with the scope paragraph
  above them) to about 700 (once per task, the flagged re-index line,
  the resource table and the CLI table kept as one pointer to `.claude/skills/gitnexus/`); the
  *Dual-CLI authoring rules* subsection, 2,137 to about 400, a pointer to
  `docs/environment/dual-cli/` and the `dual-cli-distribution` spec, which already hold them; the
  habits block adds about 550. Result about 11,150. Other sections are not touched.
- **D-14 The habits block** (DEC-12). Four lines in the template and in this `AGENTS.md`, under
  *Working conventions*: never poll (one background command and its notice); edit files with the
  edit tool, never a shell or script; read a range, not the whole file, when the range is known;
  read several known files in one call. Then one line: "Tools for each activity: the table in
  `guardrails`." `CLAUDE.md`'s *Tool habits* shrinks to what is Claude-only (the tool names that
  realise the four lines), pointing to the table.
- **D-15 Once per task, by the lead** (DEC-11). In the stage loop the impact check moves from
  Prepare (per stage) to Build (per task, before the brief, on the task's symbols); the change
  check runs once before the task's commit. The template's line "Before editing a symbol run
  gitnexus impact" and this repository's GitNexus block (between its markers) are rewritten to
  say the same. The implementer's Glue step 1 and its refusal "editing a symbol whose upstream
  impact is HIGH or CRITICAL" go: a HIGH or CRITICAL result reaches the developer through the lead
  before the brief. The lead needs the tools: `agents/team-lead.md` gains `mcp__gitnexus__*` and
  `ToolSearch` in `tools:` (MCP tools load on demand, so its first call barely grows) and a
  pointer to the table; its description is untouched. The implementer's Dispatch contract
  *Output* and its *Report* stop asking for "the impact summary per modified symbol"; they read
  "none; impact is the lead's, per task". Re-indexing must keep `--skip-agents-md`,
  which leaves the edited block untouched; the block's own re-index line, which today names
  `analyze` without the flag, is rewritten to carry it, here and in the template.
- **D-16 The implementer's preload** (DEC-10). `skills:` keeps only
  `superpowers:test-driven-development`. The body's *Skills* list keeps all five, each with "load
  when": `cosmic-python` in a Python repository; `systematic-debugging` on a failing test it cannot
  explain; `verification-before-completion` before reporting done; `stream-coding` when the brief
  names the Rule of Divergence in play. The lint `agent_skill_alignment` checks only that a
  listed skill exists, so the shorter list passes it unchanged.
- **D-17 DEC-19 in text.** `epic-planning`'s shaping session ends with each EPIC's PLAN gated
  (step 6 of *The shaping session* rewritten); the reset between EPIC and PLAN uses the note of
  D-1. `epic-delivery`'s Sessions table: the epic session leaves no PLAN behind and starts from a
  gated one; the Planner row of `team-and-briefs.md` becomes "Shaping only (an `epic-planner`
  session)". Scenario sign-off happens at the PLAN gate, now in shaping; for this change, on the
  PLAN's pull request (owner, Q-4), recorded in `evidence/acceptance.md`. **The gate's verdict has
  one home:** `epic-planning` step 8 writes `evidence/clarity-gate.md`, one line per run (`run
  <n>, <date>, <score>/10, pass|fail`) and, below, the gaps accepted as `DEC-`. It is outside
  `design.md` and `tasks.md`, so it does not change the plan hash the navigator keeps. The `ready`
  phase of the delivery workflow stays and its `criteria` name that file; it checks that the PLAN
  arrived gated. The `apply` phase drops
  `clarity` from its `gates`: gate state is per session, so a fresh delivery session would be
  warned that the clarity gate "has not run" and pushed toward a third run; the check belongs to
  `ready`'s criteria and to the shaping workflow's `revise`. The `epic-shaping` phases are
  unchanged (they already run to `revise`). A change shaped under the old split and half-way
  through is read by the same phases (rabbit-hole "Navigator").
- **D-18 The specs touched.** Modified: `epic-delivery`, `epic-shape`, `subagent-dispatch`, and
  `catalogue-governance` (it owns the bindings' content, *The bindings mandate the founding
  principle*), which is the spec that owns the instruction template the EPIC asked the PLAN to
  name. **`workflow-definitions` is not modified**: its phases and requirements stay true, and the
  review set per appetite is owned by `epic-delivery`'s *The loop scales with the appetite*. New:
  `activity-tools`.
- **D-19 No net growth of a touched skill** (P-0003). Each stage reports the byte size of every
  skill it changed, before and after. A new rule replaces the text it supersedes; a touched skill
  may not grow by more than the table of D-9 (a reference) and the note template of D-1 (an
  asset). Stage 1 also replaces the "MUST actively use" paragraph of `team-and-briefs.md` with a
  one-line pointer to where the table will be (task 1.3), so its new rules are paid for in the
  same stage. `epic-delivery` is already above
  24 KB; cutting it is `lean-skills`' (wave 5), not this EPIC's.
- **D-20 Order of stages.** As the EPIC proposed: process rules, then tools and agents, then the
  instructions; then accept, docs, release, the measured EPIC, archive. Stage 2 waits for stage 1
  because its briefs cite the result line and the stage loop it rewrites; stage 3 waits for stage
  2 because the habits block points to the table.

## Algorithm / approach

Every change is text, data or a lint check; nothing runs at delivery time except the lint. All
edits are idempotent: re-running a stage's edits on its own output changes nothing, and the lint
checks are pure reads.

**Worked example: a MEDIUM stage under the new rules.** A MEDIUM PLAN records no risk for its
stage 2, and its `## Invariants` gives the tester INV-1 on `tools/repo_lint/lint.py` (this PLAN's
own invariants are below).

1. *Prepare:* library changes merged; the lead notes "tester: yes, stage changed
   `tools/repo_lint/lint.py`, INV-1" in the PR draft.
2. *Build:* per task, the lead runs impact on the task's symbols (LOW), briefs the implementer,
   reads diff and report, runs the change check, commits.
3. *Challenge:* full gates once; PR; two reviewers (L1+L2, L3+L4+L5) and the tester in parallel.
   Their reports end with `result: stage=2 role=reviewer lens=L1+L2 findings=3 accepted=-`, etc.
4. *Decide and fix:* 7 findings; 1 Critical accepted as `D-21`; 6 rejected "under the floor",
   listed one line each; the tester's two first-run failures were for Warnings: both tests are
   deleted, reason "under the floor". The PR body gets the three result lines with `accepted=`.
   One fixer pass; full gates once (T3).
5. *Check:* the checker finds D-21 met. Verdict line written. The lead commits `handover.md` to
   the PR branch.
6. *Merge:* `gh pr checks 250 --watch --fail-fast && gh pr merge 250 --merge --delete-branch` in
   the background; the notice says merged. The lead ends the session.

**Worked example: the hand-over note.**

```markdown
# Hand-over: delivery-process-and-tools, after stage 1

## Done
Stage 1, PR #250 (merged by the watch-and-merge command after this note).

## Decided since the PLAN
D-21, D-22 (design.md, Delivery decisions).

## Open
None. RISK-6 watched: lean-skills PR #251 also edits lint.py.

## Next
Stage 2, task 2.1. Read first: tasks.md §2, design.md D-9, D-10, D-16, specs/activity-tools.

## Prompt
Act as the team lead. Deliver stage 2 of openspec/changes/delivery-process-and-tools from
handover.md. Commit, push and merge without asking; merge only on green CI.
```

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Copy decisions into `handover.md` | Cite their `D-n` ids | A copy is the old context on disk (rabbit-hole) |
| Call a third gate run a "re-check" or a "light pass" | Send the gaps to the developer after run 2 | The EPIC fails when a limit is met by renaming a round |
| A second fixer batch for a checker's unmet item | The developer decides it (D-3) | One fix pass (DEC-4) |
| Put the floor's level or the condition's wording in two files | One home each (D-2, D-5), pointers elsewhere | Single source of authority |
| Add a navigator key for the MEDIUM default | Wording in `challenge` (D-4) | No mod change (No-gos); YAGNI |
| Name a tool by a name no agent can call | A name from the agent's `tools:` list, checked by D-10 | The EPIC fails on that |
| Keep "MUST use Serena" in briefs | Point to the table; teach the REPL there | DEC-8: "mandatory" goes; DEC-9: teach the way in |
| Grow a skill body with the new rules | Replace the superseded text; the table goes to a reference | P-0003, D-19 |
| Run a plain `gitnexus analyze` in this repository | `npx gitnexus analyze --skip-agents-md` | A plain run would restore "before every edit" |
| Edit another repository's instructions | Their issues (DEC-16) | No-go |

## Invariants

Added by hand ahead of the template section of `activity-test-profiles` (D-5), so this PLAN's code
stages get the tester.

| Id | Invariant | Example | Write paths that can break it | Test |
|---|---|---|---|---|
| INV-1 | `activity_tools_table` fails if and only if a named agent's `tools:` list matches no entry for a tool in that row's *Claude Code* cell, or a named agent does not exist | holds: row names `mcp__serena__serena_repl` for `implementer`, whose list has `mcp__serena__*`; breaks: the row names `mcp__context7__query` for `implementer` | the table's rows, an agent's `tools:` list, the `lead` → `team-lead` mapping, the cell parser (backticks, globs, built-in names) | tester |
| INV-2 | `binding_size` fails if and only if `AGENTS.md` or the template, without the budget comment, is longer than the figure in that comment | holds: 11,999 characters passes; breaks: 12,001 passes, or a missing comment passes silently | the comment's figure, the comment's removal, the measuring (characters, not bytes; the comment excluded) | tester |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| The tester runs late (the condition was misjudged) and finds something after the fix pass | Its report arrives after T3 | Its findings go to the developer as an unmet item does (D-3); no second fix pass |
| The watch-and-merge command exits non-zero | Its notice | `gh pr view <n> --json state,mergeStateStatus` first, then the row below that fits (D-7) |
| The navigator test "D-12 epic-delivery" fails after the JSON edit | `make mods` | Change the test's expected data to the new MEDIUM set (D-4); never put `small_stage` back |
| A fresh delivery session is warned "clarity-gate has not run" | The navigator band | Cannot happen once `apply` drops `clarity` (D-17); if it does, `evidence/clarity-gate.md` answers it, never a new gate run |
| The navigator test "PD-3 skill gate" (`mods/navigator/lib/phase.test.ts`) fails after `apply` drops `clarity` | `make mods` | The test is rewritten to cover PD-3 on a synthetic workflow with a skill gate and to assert that the default `apply` no longer warns (task 1.2); no navigator code change |
| `evidence/clarity-gate.md` is missing for a PLAN shaped under the old split | The lead reads the change in `ready` | The lead asks the developer once whether the PLAN was gated; the answer is written to that file; no gate run by the lead |
| Someone runs `gitnexus analyze` without `--skip-agents-md` | `binding_size` fails (the block grows by about 2.9 KB) | Restore the file from git and re-run with the flag |
| `--plugin-dir` cannot replace the installed plugins | The fixture session's skills listing shows the installed version | The after-run moves to just after the release (D-12), said in the record |
| The fresh session asks what was decided, or reads `inputs/` | The developer's record in `evidence/cold-start.md` (D-11) | Fix the note's template (D-1) before the next boundary; the check runs again there |
| A note grows into a copy of `design.md` | The checker of the stage reads it against D-1 (pointers only) | A finding; the note is cut to pointers |
| `gh pr checks --watch` exits "no checks reported" | Non-zero exit with that text in the notice | Start the command again once one check is listed (D-7); this is the one allowed repeat |
| A check is red | Non-zero exit; no merge happened | The lead reads the failing check; only that failure is fixed, then full gates once and the command again; never a merge on red (D-3) |
| The merge is refused (conflict, branch protection) | `gh pr merge` exits non-zero after green checks | Rebase on `develop`, full gates once, run the command again; no finding is accepted on the way (D-3) |
| A Warning hides a real defect | It reaches `develop`; the retrospective traces it to a "under the floor" line | RISK-1: the line exists, so it is traceable; a recurring class is raised to the developer as a candidate re-label rule |
| A lead re-labels Warnings as Critical to fix them | The checker judges each re-label (D-2) | A re-label it does not agree with goes to the developer; the floor stands |
| A reviewer or tester report has no result line | The lead reads the report | Returned as incomplete; no gate re-run |
| The lead judges the tester condition wrongly | The checker reads the Prepare line against the diff and `## Invariants` | A finding; on "should have run", the tester runs before the merge |
| A PLAN has no `## Invariants` section (`activity-test-profiles` not delivered) | The lead reads the PLAN in Prepare | Today's rule: the tester on every stage from LARGE up, none below (D-5) |
| The tool table names a tool an agent lacks | `activity_tools_table` fails, naming the row and agent | Fix the row or the agent's list in the same PR |
| Serena is not connected in a session | The tool is absent from the session | The table's *Fallback* column; the report says so |
| The agent-skill lint rejects the shorter preload | `make lint` fails on task 2.4 | Use the "load on demand" form the lint accepts (D-16); the lint itself is not loosened without a `D-n` |
| `AGENTS.md` over budget after the edits | `binding_size` fails | Cut prose in the binding, never raise the figure in the same PR |
| `lean-skills` stage 1 edits `lint.py` at the same time | A merge conflict on rebase | RISK-6: rebase, keep both functions; the lint's check list is append-only |
| The baseline cannot be re-measured (no transcripts of the fixture run) | `session_digest.py` finds no session for it | Use the second pass's figures (80,000; 69,000) as baseline and say so in `evidence/start-weight.md` |
| Navigator rejects the review set's shape after the JSON edit | `make mods` (`reviewError`) fails | Fix the JSON within the shape `reviewError` accepts; no navigator code change |

## Risks / Trade-offs

- **RISK-1** (from the shaping; medium, medium) A defect gets through the floor, the one pass or
  the MEDIUM default. Mitigation: a recorded risk restores the full set (D-4); rejected findings
  stay listed (D-2), so a defect can be traced; DEC-14 check 4 looks at the next EPIC.
- **RISK-2** (high, medium) Parallel EPICs edit the same skills. Answered by the reassessment
  (S-6, order); residual handled by RISK-6.
- **RISK-3** (medium, low) A CLI changes how tools load; the table goes stale. Mitigation: the
  lint of D-10 on the Claude Code side; the opencode side is a recorded gap.
- **RISK-4** (high, low to medium) Deliveries wait for the owner to start each stage. Accepted
  (elicitation round 2).
- **RISK-5** (low, low) The tester condition needs a `## Invariants` row whose test is the
  tester's, and the template gets that section only with `activity-test-profiles` (wave 4).
  Answered by the owner (Q-3): a PLAN without the section keeps today's rule (D-5), so no LARGE
  stage loses its tester. Residual: a MEDIUM PLAN gets no tester until it carries the section, as
  today.
- **RISK-6** (high, low) `lean-skills` stage 1 adds checks to `tools/repo_lint/lint.py` in the
  same wave. Mitigation: append-only edits, rebase before the PR.
- **RISK-7** (medium, low) The saving of D-12 for the main session is small and within the noise
  of a changing skills listing. Mitigation: both runs on the same day, the same fixture and
  explicit plugin directories from two recorded commits (D-12); the instruction sizes are reported
  beside the total.
- **RISK-8** (medium, low) The stages of this EPIC run under the installed release, so its own
  delivery does not yet follow its new rules (only the note and the cold start do). Accepted:
  check 4 of DEC-14 measures the first EPIC delivered after the release.
- *Trade-off:* the navigator no longer shows a small figure at MEDIUM (D-4).

## Open Questions

None left open for delivery. The owner's four answers (Q-1 to Q-4) and the attack's fifteen
findings are recorded in `inputs/qa-plan-2026-11-15.md` and folded into D-1 to D-19, the
invariants, the error matrix and the risks.

## Delivery decisions

<!-- The lead records here, during delivery, each D-n it takes: accepted findings, rejected
     findings under the floor (one line each), a risk that restores the full review set. -->

- **D-21 Stage 1 takes the small review set.** About 380 added lines (under the 600 of LARGE's
  `small_stage`), text and data only, no `RISK-` row naming its files: two reviewers (L1+L2;
  L3+L4+L5) and the checker. Tester: no, stage 1 changes no code under an `## Invariants` row.
- **D-22 `code-reviewer` accepts the MEDIUM default groups** (stage 1, L1+L2 Critical 1). Its
  Dispatch contract accepted several lenses only on a cited `D-n` or at TINY/SMALL, so the MEDIUM
  default of D-4 would be refused. The agent body (not its description) also accepts a MEDIUM
  appetite with the groups L1+L2 and L3+L4+L5; `code-reviewer.feature` gains an accepting row.
- **D-23 The Merge step keeps the lead's authority** (stage 1, L3–L5 W1, re-labelled Critical:
  the step read as an unconditional merge, a safety rule lost). Merge runs within the lead's
  authority grant; without one, the developer approves the merge.
- **D-24 The note stays the last commit after a CI fix** (stage 1, L3–L5 W2, re-labelled
  Critical: the step contradicted itself on every red CI run). A fix after a red check goes
  before the note: the note is re-committed last, then the command runs again. D-23 and D-24 add
  214 bytes to `stage-loop.md`, so `epic-delivery`'s prose ends 131 bytes above its start
  (29,088 → 29,219); accepted for two safety fixes, and `lean-skills` cuts it (D-19).
- Under the floor (stage 1): L3–L5 W3 dangling `activity-tools.md` pointer and agents citing the
  cut tool paragraph (stage 2 lands the table; no release between stages); W4 structured MEDIUM
  default (D-4 chose wording, no key); W5 deleting a below-floor tester test (DEC-4, decided);
  W6 index refresh per task; S1 duplicate no-clarity assertions; S2 unused `clarity` gate and
  the sample band in `navigator.md`; S3 "batch the reads" restated; S4 CHK-17 wording; S5
  late-registering checks; S6 `team-lead` restates the question moment. L1+L2 W2 Shaping row
  of the Sessions table; W3 CHK-65 two-run wording; S4 MEDIUM set restated; S5 floor restated
  in `SKILL.md`; S6 the template's H1 title; S7 the stage-2 pointer; S8 gates on the head commit
  (the PR body names the SHA).
