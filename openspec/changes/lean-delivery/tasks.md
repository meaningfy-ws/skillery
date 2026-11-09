> Derives from: EPIC `lean-delivery` (`proposal.md`); design `design.md` (D-1..D-19).
> Appetite LARGE: each stage ends in one PR into `develop` with LARGE's review set (five lenses,
> adversarial tester, checker). skillery's own checks (this repo's binding, `AGENTS.md`): narrow =
> `make lint`, `make mods`, one `pytest` file, `make validate-spine`; task gate and full gates =
> `make bundles` when a skill, agent, bundle or mod changed, then `make validate`, plus
> `make validate-spine` when `openspec/` changed and `npm run test:opencode-installer` when `tools/`
> or `package.json` changed. Builders run the task gate once per task; the lead re-runs only on
> T1–T3 (D-3). A doc a task makes false is fixed in the same stage (D-17). The `.feature` coverage
> was authored with this PLAN; a task that changes a behaviour keeps its scenario true.
> Only the build stages carry checkboxes: acceptance, the docs stage and the close are plain lines,
> so navigator shows `accept` when the build is done (D-8).

## Stage 1 — Delivery method (PR 1)

- [x] 1.1 `epic-delivery` `SKILL.md`: loop step 2 (builder's task gate, D-2 report, lead reads diff + report, D-3 triggers), step 4 (failing tests, then full gates once, D-4), step 5 (no checker: the stage's full gates + CI and the single review pass), *Questions* (one round, D-15), Quick Start per E1, gotchas (D-3), *After the last stage* (accept → docs stage → archive; docs and close as plain lines in `tasks.md`, D-8), *Verification and validation* pointer
- [x] 1.2 `references/stage-loop.md`: the check ledger (D-1) replacing the coverage table; Prepare and Challenge index refresh (D-13); flaky pointer (D-14); docs stage after accept and `evidence/docs-owed.md` (D-8); SMALL and LARGE examples; the delivery rows of the design's error matrix
- [x] 1.3 `references/team-and-briefs.md`: brief rule 5 points to the project's *Checks* block (D-12); report line points to D-2; reviewer brief reads the gate report; code-intelligence line (DEC-11). `references/verification-validation.md`: demo by appetite and skip record (D-16); docs row: cold reader where the page changed, docs stage (DEC-9)
- [x] 1.4 `guardrails` §5 and `references/subagent-reports.md`: D-2 fields under *implementing*; the waiting rule (D-5, text); enforcement line names the `no-poll-loops` intent; the two `make validate` lines of D-18
- [x] 1.5 `epic-planning` and `clarity-gate`: #162's text (D-15)
- [x] 1.6 `meaningfy-code-review`: L2 reads the gate report instead of running the suite; L2 doc agreement (D-11)
- [x] 1.7 `cosmic-python` `references/testing-checklist.md`: the flaky-test item (D-14)
- [x] 1.8 `project-setup` `assets/templates/agentic/AGENTS.md.tmpl`: the *Checks* block (D-12)
- [x] 1.9 Runbooks made false by 1.1–1.7: `docs/practice/ai-coding/{build-lifecycle,opsx-runbook,dod-quality-gates,working-with-agents}.md`, `playbooks/{developer,solution-builder}.md`, `docs/development/README.md` §*How an EPIC is delivered*; CHANGELOG lines. Acceptance: `tests/features/epic-delivery.feature` agrees with 1.1–1.3; the D-18 grep returns nothing for the stage-1 files; `make bundles`, `make validate`

## Stage 2 — Documentation workflow (PR 2)

- [ ] 2.1 `technical-writing` `SKILL.md`: *The documentation workflow*: condition (DEC-9), the five phases and their evidence files (D-6), documents covered, C4/ADR as built through `architecture` with no status change (D-7), cold reader by page type, on-demand use; points to its workflow file
- [ ] 2.2 `skills/technical-writing/assets/workflows/documentation.workflow.json` exactly as D-6's table; add it to the default lists in `mods/navigator/lib/phase.test.ts`, `edge-cases.test.ts` and TC-16 in `workflow.test.ts` (eight files); tests from the engine probe: the D-6 sequence (`technical-writing` loaded, then `docs-owed.md` → write → `make build-docs` → cold-read → `cold-read.md` → publish; `published` ok on `gh pr create`); "no docs owed" written at accept leaves epic-delivery in `accept`, then `openspec-archive-change` → `archive` (D-8), `technical-writing` mid-apply shows *documentation* and `epic-delivery` switches back (D-19). `make mods`
- [ ] 2.3 `architecture` `SKILL.md`: one line, the docs stage brings C4 and the index page to as-built and never changes an ADR's status (D-7). `epic-delivery` *Sessions* table: "docs current" names the docs stage. Acceptance: `tests/features/documentation-workflow.feature` agrees; `make bundles`, `make validate`

## Stage 3 — Delivery workflow data and agents (PR 3)

- [ ] 3.1 `epic-delivery.workflow.json` per D-9 (**BREAKING**). Navigator tests naming `verify` updated for meaning (`phase.test.ts`, `edge-cases.test.ts`, `dispatch.test.ts`). New tests from the engine probe: build boxes ticked with plain docs/close lines → `accept` (reads this `tasks.md` through `progress`); acceptance file → gate `ok`, phase `accept`; `openspec-archive-change` after *documentation* → `archive`; `spec-stewardship` → `accept`; brownfield done → `accept`; `full-gates` ok on `make check-all`. `make mods`
- [ ] 3.2 Flagged repo edit, own commit: `docs/navigator/epic-delivery.workflow.json` for skillery (`extends`, the whole `gates` object, `full-gates` = `\bmake validate\b`); and `docs/navigator/documentation.workflow.json` (`docs-gate` = `\bmake validate\b`; skillery has no `build-docs`); test: `make validate` passes `full-gates` and `docs-gate` with the overrides, `make check-all` does not
- [ ] 3.3 Agents (D-10): drop `tools:` from `agents/implementer.md` and `agents/code-reviewer.md`; add `Agent` to both `disallowedTools`; the body line; `"Agent": "task"` in `toolPermission` of `tools/opencode-agent-map.json`; `agents/code-reviewer.md` L2 text agrees with D-4. Installer test in `tests/opencode-bundle-installer.test.mjs`: both rendered agents have `tools: {"skill": true}` and `permission.task: "deny"`, the reviewer `permission.edit: "deny"`; `make opencode-report` shows no new gap. `make bundles`, `npm run test:opencode-installer`
- [ ] 3.4 opencode probe (by hand): an agent with no tool list in an opencode session with one MCP server lists and calls an MCP tool, and its `task` permission is denied. Result in `evidence/opencode-mcp-probe.md`; a failure becomes a gap in `docs/environment/dual-cli/compatibility.md`
- [ ] 3.5 `docs/environment/navigator.md`, `docs/development/workflows.md`: phases ready/apply/accept/archive, brownfield with `accept`, the documentation workflow row, `full-gates` and the `extends` example; CHANGELOG BREAKING line with the fix for a repo file naming `verify`. `make validate`, `make validate-spine`

## Stage 4 — The no-polling hook (PR 4)

- [x] 4.1 `mods/no-poll-loops/`: `hooks.json` (D-5), `no-poll-loops.mjs` (`check` + CLI), `no-poll-loops.test.mjs` with D-5's table (deny, allow, quoted loop, exit codes, bad JSON). `bundles.yaml`: `meaningfy-core` `mods: [no-poll-loops]`
- [x] 4.2 Tooling: D-5 *Tooling it needs* items 1–6, nothing more (RISK-10's re-shape trigger); the two existing mod tests kept for a modules mod plus a hooks-only case each; `hooks.yaml` intent. Test: `meaningfy-core`'s `plugin.json` names the hooks file and no `types`; navigator's bundle unchanged. `make bundles`, `make validate`
- [x] 4.3 opencode: `tools/opencode-plugin.mjs` `tool.execute.before` (bash, whatever the bundle selection, fail open); `package.json` `files` adds the module; installer test: throws on a sleep loop, passes a single sleep, passes when `check` throws. `npm run test:opencode-installer`
- [x] 4.4 `docs/development/hook-bindings.md` rewritten per D-5 *Correction*; D-5 item 7 (`mods.md`, the Mod row in `governance.md`). `make validate`
- [x] 4.5 Load check (by hand, Claude Code), before the PR: install `meaningfy-core` from the branch in a scratch session; a sleep loop is denied with the message, `sleep 1` runs, the hook's `${CLAUDE_PLUGIN_ROOT}` command resolves; navigator's modules still load beside it. Result in `evidence/hook-load-check.md`

## Acceptance, between stages 4 and 5 (mandatory, LARGE; not counted)

- A.1 Demo to the developer against the success measure: counts from the transcripts of stages 2–4 (task-gate runs per task, local full-gates runs per stage, lead re-runs with triggers, polling calls); the hook denying a sleep loop live; the band through apply → accept → documentation → archive. Verdict in `evidence/acceptance.md`; a rejection is a decision here and a fix stage
- A.2 The demo's first run is recorded: remove "(provisional)" from the acceptance demo in `epic-delivery` (SKILL, `verification-validation.md`, `stage-loop.md`) and its runbooks; it stays on the validation review (D-16). Lands in PR 5

## Stage 5 — Docs stage of this EPIC (PR 5; the documentation workflow's first run; not counted)

- D.1 Load `technical-writing`, then inventory (condition met: the method's user-facing behaviour changed): `technical-writing` Quick Start example for the docs stage; README entry-point row for the documentation workflow; `docs/development/README.md` V&V table (docs row); `docs/skill-inventory.md` via `make skill-inventory`. Written to `evidence/docs-owed.md`
- D.2 Write; verify (`make validate`, which holds skillery's doc checks; its docs-gate override); cold-read the how-to pages written, verdicts in `evidence/cold-read.md`; publish (PR 5 with A.2)

## Close (not counted)

- C.1 Spec deltas checked against what was built; `openspec validate lean-delivery --strict`, `make validate-spine`; merge on green CI; archive per `spec-stewardship`

## Roadmap

- Stage 1 (1.1–1.9) · Stage 2 (2.1–2.3) · Stage 3 (3.1–3.5) · Stage 4 (4.1–4.5) · Accept (A.1–A.2) · Stage 5 (D.1–D.2) · Close (C.1)

## Verification

`make validate` (repo lint, navigator and hook tests, feature files present), `make
validate-spine`, `npm run test:opencode-installer`, `openspec validate lean-delivery --strict`;
by hand: the feature files per CLI, the opencode probe, the demo.
