<!-- PLAN (tasks half). Each task names the spec requirement it satisfies (specs/<capability>/spec.md
     in this change) and the design anchor to read; it does not restate acceptance criteria. One
     stage = one task group = one PR into develop; stages 2 to 5 end with a measurement task. -->

> Derives from: EPIC `skillery-performance-improvement` ([proposal.md](proposal.md)); design in [design.md](design.md).

## 1. Measure and clean (stage 1, DEC-6, DEC-17)

- [x] 1.1 Set the model prices in the Langfuse project for the four model ids seen in the window, from the current price list; the per-day query then shows a non-zero cost. `session-retrospective` "A Langfuse usage report is reproducible"; design.md#d-11.
- [x] 1.2 Write `skills/session-retrospective/references/langfuse-report.md`: the eight queries with their arguments, the pinned fields, how to read each; add the pointer in `SKILL.md` ("read when…"). `session-retrospective` "A Langfuse usage report is reproducible"; design.md#d-11.
- [x] 1.3 Create `docs/practice/ai-coding/usage-reports/` with `README.md` (the series and how to add a page), `2026-11-22.md` from the seed, `2026-11-09.md` re-filed from `archive/2026-11-09-lean-delivery/inputs/evidence-skillery-time.md` (linked, not copied); the docs register and top-level-folder lints pass. `session-retrospective` "Usage reports form a comparable series"; design.md#d-11.
- [ ] 1.4 Measure the starting load with the CLI's context command for a fresh session in skillery and for three `implementer` variants (today; no `Skill` + one preload; exact MCP names vs globs + `ToolSearch`) and a `code-reviewer`; record the composition (system, tools, skills, bindings, memory, hooks), whether the skill listing and the `rules-first` block appear in a subagent, and which variant is under 40 k, in `usage-reports/2026-11-22.md` §Floor. `subagent-dispatch` "A subagent starts fresh from a brief"; design.md#d-3.
- [x] 1.5 (the disable list awaits the owner's approval, D-22; the second machine is owed) Write the sanitation procedure into `langfuse-report.md` §Inventory and run it on this machine: `usage-reports/inventory-<host>-2026-11.md` with used / unused / undecided lists; the owner approves the disable list; the second machine follows the same page. `session-retrospective` "An inventory separates used from unused"; design.md#d-12.
- [x] 1.6 (as D-20: the manual tag on each machine, the upstream ask deferred to a PR) The Langfuse hook tags every trace `skillery:<installed version>`; `langfuse-report.md` gains the gates-passed source (`gh` first-run CI green of merged PRs, Critical findings from `result:` lines) and the per-version filter, with a test of the tag. `session-retrospective` "A Langfuse usage report is reproducible"; design.md#d-11, design.md#d-17.

## 2. End sessions (stage 2, DEC-4, DEC-12, DEC-13)

- [x] 2.1 `session-thresholds.json`: the three token keys, percent kept as fallback; the navigator (`mods/navigator/lib/hygiene.ts`, `state.ts`, `io.ts`, `lean.ts` and their tests) reads tokens first, `window × percent` second, and prints the number and unit it used; `make mods` green; `guardrails` §Session hygiene names the keys. `subagent-dispatch` "Dispatch and hygiene thresholds are data", `session-navigation` "The navigator warns in tokens"; design.md#d-1.
- [x] 2.2 `guardrails`: session hygiene wins over a conflicting repository rule; `rule-learner`: a candidate rule that keeps a session past a stage boundary is flagged on the approval card. `subagent-dispatch` "A stage boundary is a fresh session"; design.md#d-1.
- [x] 2.3 `epic-planning`: compaction after `proposal.md` is saved, a fresh session per EPIC of an initiative, rounds capped by appetite with the confirmation inside the next round; `seed-intake.md` aligned. `epic-shape` "The PLAN is derived and gated while shaping", "Planning effort follows the appetite"; design.md#d-8.
- [x] 2.4 `epic-delivery`: the fixer brief carries `max_red_runs` and one pass; the `blocked` report and the lead's two options in `stage-loop.md`; the navigator warns when one subagent runs the `full-gates` command more than `max_red_runs` times (test in `mods/navigator`); the lead compacts at a safe point past `compact_offer_tokens`, reads `git diff --stat` and spot-checks, the checker reads the diff. `epic-delivery` "Findings pass a severity floor and a stage has one fix pass", "The lead stays small"; design.md#d-5, design.md#d-6.
- [ ] 2.5 Measure: within seven days of the stage-2 release, §Stage 2 of the report page on the traces tagged with its version: median `LLM Call` context, share above 150 k, gates passed, against the baseline. `session-retrospective` "Usage reports form a comparable series"; design.md#d-17.

## 3. Scale verification (stage 3, DEC-3, DEC-11, DEC-13)

- [x] 3.1 (approved through DEC-3, D-34) Propose P-0006 (D-8 wording) and R-0004 ("when it pays") to the owner through `rule-learner`; write what is approved with `rules.py`; `epic-planning` step 7–8 cite the scoped rule. `epic-shape` "Planning effort follows the appetite"; design.md#d-8.
- [x] 3.2 `epic-delivery` workflow JSON (`reviewers`, `lenses`, `risk_reviewers` per appetite; the navigator's ceiling in `mods/navigator/lib/dispatch.ts` reads `risk=recorded` from the mark, with tests) and `meaningfy-code-review`: the review sets of D-4, the grouped run reporting per lens id, the five-lens run as the opt-in deep review, the "combined is a defect" sentence replaced; `code-reviewer` body accepts a lens group. `epic-delivery` "The loop scales with the appetite", `pr-review-modes` "The default review is two grouped runs"; design.md#d-4.
- [x] 3.3 `epic-delivery`: the light-chore rule and `lead-fixed:` commit line; independent spawns in one message; checker and cold reader merged when no how-to page changed; the tester opt-in; every brief ends with the report shape. `epic-delivery` "The lead stays small", "Each check runs once, at its moment, with one owner"; design.md#d-6.
- [x] 3.4 GitNexus at two points: `epic-delivery` stage loop and briefs, `meaningfy-code-review` lenses take blast radius from the brief, `team-lead` keeps the GitNexus tools, `implementer` and `code-reviewer` lose them, with a Gherkin scenario under `tests/features/agents` for each agent change. `epic-delivery` "Each check runs once…", `pr-review-modes` "Refactor recommendations carry gitnexus blast radius"; design.md#d-7.
- [ ] 3.5 Measure: within seven days of the release, §Stage 3: spawns per stage and verification share from the result lines, gates passed. `session-retrospective` "Usage reports form a comparable series"; design.md#d-17.

## 4. Lower the floor (stage 4, DEC-5, DEC-9, DEC-15, DEC-16)

- [ ] 4.1 `skills/guardrails/assets/model-matrix.json` with D-2's roles and values; `metadata.role` on every agent; `tools/repo_lint` check "agent model matches the matrix" with its test; workflow definitions name roles. `subagent-dispatch` "The subagent's agent and model are the cheapest that fit"; design.md#d-2.
- [ ] 4.2 Agents: the variant 1.4 chose (one preload per role, `Skill` and MCP names per the measurement); the thin `skills/stage-check` holding the moved check references; the new `agents/checker.md`; both declared in `bundles.yaml` with facets; a Gherkin scenario per agent change; `make bundles`, `make skill-inventory`. `subagent-dispatch` "A subagent starts fresh from a brief"; design.md#d-3.
- [ ] 4.3 `agents/epic-planner.md`: drop the `stream-coding` preload and the duplicate `epic-planning` load, with its Gherkin scenario; `dependencies.yaml` and the two skills keep `stream-coding` as an external pointer. `epic-shape` "Planning effort follows the appetite"; design.md §Algorithm "The planner" (DEC-16).
- [ ] 4.4 Rewrite `clarity-gate/references/clarity-gate-checklist.md` (≤ 4 KB, minimums per appetite); the `design.md` budget check in `tools/repo_lint` (appetite parsed as `appetiteOf`, archived and allow-listed changes exempt, unparseable is an error) with its tests; `tasks.md` template says "cite a design anchor". `epic-shape` "A PLAN has a size budget by appetite"; design.md#d-9.
- [ ] 4.5 `epic-delivery/assets/templates/builder-brief.md` (≤ 2 KB); builder and fixer briefs point to it; `cosmic-python` principles cited by id; Serena essentials in the card, `initial_instructions` not called by subagents (`activity-tools.md` line changed). `subagent-dispatch` "A subagent starts fresh from a brief"; design.md#d-15.
- [ ] 4.6 `rulebook` `load --brief` (rules without the playbook) with its test; agent bodies drop "load the rulebook"; `epic-delivery` briefs carry the rules. `rules-first-routing` "Rules reach a subagent through its brief"; design.md#d-14.
- [ ] 4.7 Measure: within seven days of the release, §Stage 4: the starting load of a session, an implementer and a reviewer (as 1.4), against 1.4; gates passed. `session-retrospective` "Usage reports form a comparable series"; design.md#d-17.

## 5. Quiet the tools (stage 5, DEC-8, DEC-14)

- [ ] 5.1 The tool-output principle in `guardrails` §Session hygiene and the `activity-tools.md` header; one line in the brief templates. `activity-tools` "A tool call returns a result, not a log"; design.md#d-10.
- [ ] 5.2 Mod `mods/quiet-tools`: PreToolUse on Bash, warns on D-10's noisy forms through `hookSpecificOutput.additionalContext` at exit 0, names the quiet form, never denies; declared in a bundle, `make mods` green, a test per form asserting the `additionalContext`. `activity-tools` "A tool call returns a result, not a log"; design.md#d-10.
- [ ] 5.3 `project-setup` templates per D-13 (pytest, AGENTS, Serena, `no_polling`, gate-shape table, GitNexus target and lint); the quick start shows the thin AGENTS; a probe scaffolds a repository and `make validate` passes there. `lean-project-templates` (all requirements); design.md#d-13.
- [ ] 5.4 `epic-delivery`: `gh pr merge --auto --merge` after the PR opens or one background watch, never a re-read of a running task's output; one full gate per stage, the fix pass re-runs the narrow checks. `epic-delivery` "A pull request is watched and merged by one command", "Each check runs once…"; design.md#d-18.
- [ ] 5.5 Measure: within seven days of the release, §Stage 5: `Tool: Bash` observations per turn and the share matching D-10's forms, gates passed, against the baseline. `session-retrospective` "Usage reports form a comparable series"; design.md#d-17.

## 6. Measure again (DEC-2)

- [ ] 6.1 Two weeks after the stage-5 release, on the traces tagged with its version: the report page with the four DEC-2 numbers and gates passed (D-11); the EPIC closes when all four hold, or the weakest stage is re-opened with one question round. `session-retrospective` "Usage reports form a comparable series"; design.md#d-11, design.md#d-17.

## Roadmap

- [x] 1.1 · [x] 1.2 · [x] 1.3 · [ ] 1.4 · [x] 1.5 · [x] 1.6 · [x] 2.1 · [x] 2.2 · [x] 2.3 · [x] 2.4 · [ ] 2.5 · [x] 3.1 · [x] 3.2 · [x] 3.3 · [x] 3.4 · [ ] 3.5 · [ ] 4.1 · [ ] 4.2 · [ ] 4.3 · [ ] 4.4 · [ ] 4.5 · [ ] 4.6 · [ ] 4.7 · [ ] 5.1 · [ ] 5.2 · [ ] 5.3 · [ ] 5.4 · [ ] 5.5 · [ ] 6.1

Within a stage, tasks are independent unless numbered after one they name (2.1 before 2.4's
threshold reference; 4.1 before 4.2; 1.2 before 1.3, 1.5 and 1.6; 1.4 decides 4.2's variant);
the measurement task is last.

## Verification

Each stage PR: `make validate` green (lint, bundles, skill-inventory, mods, spine), the new lint
checks and the mod tested in `tests/`, a CHANGELOG line per stage, the stage's measurement page
against the baseline (DEC-7); the EPIC: the four numbers of DEC-2 on the stage-6 page.
