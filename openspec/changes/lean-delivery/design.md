# Design: lean delivery

> Derives from: EPIC `lean-delivery` (`proposal.md`, DEC-1..DEC-16). Answers: `inputs/qa.md`
> rounds 1–3 (R3-1..R3-3). Document type: implementation. Repositories named below are evidence
> only (DEC-2); `tasks.md` may name skillery's own targets because it plans work in skillery.
> Workflow data was checked against the navigator engine (task 3.1 turns that probe into tests).

## Terms

| Term | Meaning (each project names its own in its `AGENTS.md`, slot in D-12) |
|---|---|
| Narrow checks | The checks one edit touches: one test file, one lint target |
| Task gate | What a builder runs once before reporting: the full gates by default, a narrower gate (static checks plus the tests of the touched area) where the project's `AGENTS.md` says so (R3-2) |
| Full gates | Every check the project gates a merge on; CI runs the same set |
| Docs gate | The project's documentation build or link check |
| Code-intelligence tools | Symbol-level reading and editing, impact analysis, when the project has them |
| Stage | A group of tasks that ends in one PR |

## Decisions

- **D-1 The check ledger (DEC-5).** One table in `epic-delivery` `references/stage-loop.md`
  replaces *How this loop covers the longer one*: every check, its one moment, its one owner. It is
  the table under *Algorithm*, copied as is; the 13-step history shrinks to two sentences.
- **D-2 The verifiable report (DEC-4).** The *implementing* purpose in `guardrails`
  `references/subagent-reports.md` gains, per gate run: the command, the exit code, the test
  counts (passed, failed, skipped), the duration; plus the narrow checks run, as a list.
  `team-and-briefs.md`'s "report expected" points to it instead of naming fields.
- **D-3 Re-run triggers (DEC-4).** The lead re-runs a builder's task gate only on:
  **T1** the report lacks a D-2 field, or contradicts the diff (tests added but the count unchanged;
  exit 0 with failures listed; a gate missing for a file type the diff touches);
  **T2** parallel builders touched a shared file; **T3** a fix round ended (D-4).
  Each re-run names its trigger in the commit body (`Re-run: T1, <reason>`). The gotcha
  "trusting a member's report" becomes "re-running without a trigger" and "committing on an
  incomplete report".
- **D-4 Moments of the gates (DEC-5, D-b, R3-2).** Per task: the builder's task gate, once. Per
  stage: the lead runs the full gates once before opening the PR, then CI; skipped when the last
  task's report already ran the full gates on the PR's head commit (same check, same code). After
  the fix round: the fixers re-run only the failing tests until green, then the lead runs the full
  gates once (T3), then CI. A reviewer reads the gate report and never re-runs the suite: L2's
  "runs the project's test suite" becomes "reads the stage's gate report; a missing or red run is a
  finding". The success measure counts these stage-level runs apart from the per-task gate.
- **D-5 Waiting, and the hook (DEC-12, R3-3).** Rule in `guardrails` §5: a command that fits the
  tool's timeout runs in the foreground; a longer one runs in the background and is awaited by one
  completion notice or one blocking wait; never a sleep loop. Enforcement ships with the catalogue,
  not with a project:
  - **Claude Code:** a hooks-only mod `mods/no-poll-loops/` declared under `mods:` of
    `meaningfy-core` (the bundle every Meaningfy session installs). Its own `hooks.json` (no
    engine `modules`, so never mixed with navigator's) holds one `PreToolUse` command hook, matcher `Bash`, running `node "${CLAUDE_PLUGIN_ROOT}/mods/no-poll-loops/no-poll-loops.mjs"`.
  - **opencode:** `tools/opencode-plugin.mjs` adds a `tool.execute.before` handler for `bash`,
    active whatever the bundle selection (it is behaviour, not content, and no bundle requires
    `meaningfy-core`), importing the same module's `check(command)`;
    `package.json` `files` adds the module.
  - **One implementation**, `no-poll-loops.mjs` (Node, no dependencies): `check(command)` strips
    single- and double-quoted text, then **denies** a `while`, `until` or `for` loop whose body
    runs `sleep`, or `watch` with `-n`/`--interval`; **allows** everything else, including a single
    `sleep N`, `gh pr checks --watch` and `wait`. The CLI reads the hook JSON from stdin
    (`tool_input.command`), exits 2 with the message on stderr on deny, 0 otherwise. **Fails
    open**: any error, and a missing `node` (a non-2 exit is non-blocking), lets the command run;
    the opencode handler catches its own errors.
  - **Message:** "Sleep loops are denied. Run the command in the foreground if it fits the tool
    timeout (a subagent may never get a completion notice); otherwise run it in the background
    once and wait for its notice or one blocking wait."
  - **Tooling it needs** (the complete list; RISK-10):
    1. `tools/bundle_gen/gen.py` `_check_mods`: require `hooks.json` only; `types.d.ts`,
       `config.json` and `register.tsx` only when `hooks.json` names `modules`; call `_mod_config`
       only when `config.json` exists. Its tests `test_mod_missing_files_is_rejected` and
       `test_mod_missing_config_json_is_rejected_naming_it` keep their meaning for a modules mod
       and gain a hooks-only case each.
    2. `plugin_manifests`: `types` and `userConfig` only when present.
    3. `MOD_DATA`: `data/` linked only for navigator (the generator's own "key it by mod when a
       second mod lands" shortcut).
    4. `_NOT_COPIED` adds `*.test.mjs`.
    5. The `mods` Makefile target: type-check only mods with a `tsconfig.json`; run `*.test.mjs`.
    6. `mod_bindings_match` (`tools/repo_lint/lint.py`): accepts a `mod` binding whose id is a mod
       folder name; a negative test.
    7. `docs/development/mods.md`, the Mod row of `docs/development/governance.md` and the Mod row of
       `AGENTS.md` ("observes, displays, runs commands" gains "or denies a command"): a mod is a
       hooks module, either engine `modules` or plain command hooks. `hooks.yaml`: intent `no-poll-loops`,
    `{ mechanism: mod, phase: quality, trigger: PreToolUse(Bash) }`, provenance `guardrails`.
  - **Correction:** `docs/development/hook-bindings.md` describes `project-setup` projecting
    agent hooks (`scripts/hooks/*.sh`, settings, `.opencode/plugin/*`) that do not exist. It is
    rewritten: `agent` intents are declared only; the agent-runtime hooks that run ship as mods in
    a bundle and, for opencode, through the catalogue's plugin.
- **D-6 The documentation workflow is its own file (DEC-9).**
  `skills/technical-writing/assets/workflows/documentation.workflow.json`, owner
  `technical-writing`, activated by loading `technical-writing`. Reason: navigator shows one
  workflow at a time, the docs stage has its own phases, `technical-writing` owns the method, and
  the file serves an on-demand run too. Rejected: docs phases inside epic-delivery (two owners'
  methods in one file, no on-demand run). Phases have no `enter`; each moves by a gate of its own
  (engine rule: a passed gate moves to the next phase with no `enter`):

  | Phase | Gate (kind: match) | Written or run by |
  |---|---|---|
  | inventory | `owed` (file: `openspec/changes/*/evidence/docs-owed.md`) | Lead: the pages owed |
  | write | — (allows `architecture`) | Builders |
  | verify | `docs-gate` (command: `\bmake build-docs\b`) | Builder; passing it moves to cold-read |
  | cold-read | `cold-read` (file: `openspec/changes/*/evidence/cold-read.md`) | Lead, from the cold reader's verdicts |
  | publish | `published` (command: `\bgh pr create\b`) | Lead |

  Engine-checked: inventory → write (docs-owed written) → cold-read (`make build-docs`; verify's
  gate passed, so no warning) → publish (cold-read written); `gh pr create` passes `published`.
  A later file write marks `docs-gate` stale, as for every command gate. On demand without a
  change, only the two command gates move the band (accepted). Where a repo's docs-gate is a command
  builders run all the time (skillery: `make validate`), one run during *inventory* jumps the band
  to cold-read past write (accepted, same reason).
- **D-7 C4 and ADRs at docs time (DEC-9, R3-1).** The docs stage, through `architecture`'s method,
  brings C4 views and the architecture index page to as-built and links each ADR to the change that
  implemented it. It never changes an ADR's status. An as-built fact that contradicts an ADR is a
  finding to the lead; the developer decides; the page is not edited to match.
- **D-8 Order after the build stages (DEC-8, DEC-9).** accept → docs stage → archive. The demo runs
  on the built code; a rejection adds a fix stage before any docs are written. In `tasks.md` the
  docs stage and the close are plain lines (no checkbox) under their own heading, so the counted
  tasks are the build tasks and `accept` shows when they are all ticked (engine: `accept` enters on
  `tasks-done`, which counts every box under a `## ` heading). At accept the lead decides: no docs
  owed → it writes `evidence/docs-owed.md` "no docs owed" and archives; docs owed → it loads
  `technical-writing` first and writes `evidence/docs-owed.md` (the pages owed) during
  *inventory*, so the documentation workflow's `owed` gate sees it (a file written while
  epic-delivery is active never reaches that gate). Engine-checked both ways. This rule goes into
  `stage-loop.md` and `technical-writing`.
- **D-9 Delivery workflow data (DEC-13, DEC-16).** `epic-delivery.workflow.json`:
  `activate.skills` adds `openspec-archive-change`; phases ready; apply (gates `clarity`,
  `full-gates`; `expect` adds `meaningfy-code-review` and `verification-before-completion` by exit,
  which `verify` expected); accept (gate `acceptance`, file
  `openspec/changes/*/evidence/acceptance.md`; enter `change: tasks-done`); archive (gate
  `openspec`). `brownfield` = apply, accept, archive (validation is never dropped). Reviews:
  TINY/SMALL `check` becomes "The stage's full gates and CI; the single review pass is the four-eyes
  pass". Engine-checked landings: `openspec-archive-change` → `archive`; `spec-stewardship` →
  `accept` while tasks are done (archive needs `openspec-archive-change`); the acceptance file
  passes `acceptance` and the phase stays `accept` (archive has an `enter`).
  **Lead decision (logged):** the defaults `full-gates` = `\bmake check-all\b` and
  `docs-gate` = `\bmake build-docs\b` are the targets `project-setup` scaffolds in every Meaningfy
  project, so they are the method's own standard, not one repository's; each repo overrides them
  through `extends` (a shallow merge: the whole `gates` object). skillery's override
  `docs/navigator/epic-delivery.workflow.json` (`full-gates` = `\bmake validate\b`) is a flagged
  repo edit.
- **D-10 Agents (DEC-11).** `implementer` and `code-reviewer` drop `tools:` and inherit the
  session's tools. `code-reviewer` keeps `disallowedTools: [Write, Edit, NotebookEdit]`; both add
  `Agent` so neither fans out; `tools/opencode-agent-map.json` `toolPermission` gains
  `"Agent": "task"` so the deny renders on opencode. Rendered on opencode, both get
  `tools: {"skill": true}` (they declare `skills:`, `renderAgent`), which leaves the other tools,
  MCP included, at opencode's default. Each body gains one line: "Use the project's
  code-intelligence tools when it has them, and no other MCP tool; the truth stays in the spine."
- **D-11 L2 owns doc agreement (DEC-9).** L2's region adds: every page the diff changed, and every
  page naming a symbol, command, phase or file the diff changed, agrees with the code.
- **D-12 The project's binding names its checks (DEC-2).** `project-setup`'s `AGENTS.md.tmpl`
  *Make targets* line becomes a *Checks* block: narrow checks, task gate, full gates, docs gate,
  code-intelligence tools; `epic-delivery`'s brief rule 5 points to it.
- **D-13 Code index (DEC-14).** `stage-loop.md` Prepare and the start of Challenge: the lead
  refreshes the project's code index in the background; a failure warns and the step reads code.
- **D-14 Flaky tests (DEC-15).** Testing checklist item: a test that both passes and fails on
  unchanged code is quarantined with the project's marker and an issue link, gets its own task or
  issue, and is never retried with new seeds inside a stage; the stage PR names it.
- **D-15 Planning (DEC-6, DEC-7).** #162's text for `epic-planning`, `clarity-gate` and
  `epic-delivery` *Questions* lands as in `inputs/pr162-efe7e39.diff`, except its per-task lead
  re-run (D-3 instead) and its `AGENTS.md` lines (D-12 instead). `epic-shaping.workflow.json` needs
  no change: the two-run cap is a count, which navigator does not track.
- **D-16 Demo (DEC-8).** `verification-validation.md` and `stage-loop.md`: offered whenever a use
  case is delivered or changed; skippable below LARGE with the skip (who, why, date) in
  `evidence/acceptance.md`; mandatory from LARGE. "(provisional)" leaves the demo once its first
  run is recorded (this EPIC's, task A.2); it stays on the validation review.
- **D-17 Where a false doc is fixed (DEC-9, logged clarification).** Within the build stage that
  made it false, before that stage's PR: by the task that made it false, or by one doc task of the
  same stage when several tasks share a page (task 1.9).
- **D-18 No repository target in method text (DEC-2).** The check is a task-level grep, not a new
  lint rule, over exactly the skill files this change edits, each as its own pathspec (git does
  not expand braces; a plain `*` in a pathspec crosses `/`):
  `git grep -nE '\`make [a-z]' -- 'skills/epic-delivery/*.md' skills/epic-planning/SKILL.md
  skills/clarity-gate/SKILL.md skills/meaningfy-code-review/SKILL.md skills/guardrails/SKILL.md
  skills/guardrails/references/subagent-reports.md skills/cosmic-python/references/testing-checklist.md
  skills/technical-writing/SKILL.md` returns nothing after stage 2. Today it finds three lines, each
  fixed here: `guardrails` §5 "checked by `make validate`" → "checked by the catalogue's own lint";
  `subagent-reports.md` *authoring* "(`make validate` or the project's)" → "(the project's
  checks)"; `meaningfy-code-review` L2 "`make test` / `pytest`" goes with D-4. The un-backticked example
  report in `guardrails` ("Tests: make test — 214 passed") becomes "Tests: the project's task gate — 214
  passed" in task 1.4. The `cosmic-python`
  lines outside the testing checklist name the targets `project-setup` scaffolds (D-9's reasoning)
  and are out of scope.
- **D-19 Navigator sees only the lead's skills.** It records skill loads from the `skill.prompt`
  event of the session it runs in (`mods/navigator/register.tsx:69-71`); a member's skill load does
  not switch the lead's band. The lead loading `technical-writing` during a build does; loading
  `epic-delivery` or `openspec-apply-change` switches back.

## Algorithm — the check ledger (D-1)

| Check | Moment | Owner | Re-run only when |
|---|---|---|---|
| Clarity gate (≤2 runs TINY/SMALL) | Before the first task | Planner; developer decides gaps | — |
| Scenario sign-off | At the PLAN gate; a changed scenario alone | Developer | Scenario changed |
| Impact (code index refreshed, D-13) | Prepare | Lead | — |
| Narrow checks | While a task is in progress | Builder | Each edit |
| Task gate | Once per task, before the report | Builder | T1, T2 (lead) |
| Diff reading | Each task | Lead | — |
| Full gates | Once per stage before the PR (skipped if the last report ran them on the head commit); once after the fix round | Lead | T3 is the second |
| Review set of the appetite (incl. L2 doc agreement, `meaningfy-code-review`) | Once per stage, on the PR | Reviewers | — |
| Adversarial tester | Once per stage, where the set names it | Tester | — |
| Failing tests | After a red run, until green | Fixer | Until green |
| Checker | Once per stage, after the fixes | Checker | Unmet item → step 4 |
| Evidence before a claim (`verification-before-completion`) | Before the lead reports a stage done | Lead | — |
| Cold reader | A how-to or tutorial changed in a stage; every task-oriented page of the docs stage | Cold reader | Page changed again |
| CI | Each push | CI | — |
| Acceptance demo or skip record | After the last build stage | Developer | Rejection → fix stage |
| Docs-stage verify (snippets, docs gate) | Docs stage | Builder | — |
| `openspec validate --strict` | Archive | Lead | — |

No phase of the workflow file repeats a row (FC-3, FC-6).

## Examples

- **E1 SMALL, one stage, three tasks.** Three task-gate runs, zero lead re-runs, one full-gates
  run before the PR, one review pass (L2+L3), one fix, the failing test re-run alone, one
  full-gates run (T3), CI. Local full runs in the stage: 2. Demo offered and skipped:
  `evidence/acceptance.md` "skipped by <developer>, <reason>, <date>"; `evidence/docs-owed.md` "no
  docs owed"; archive.
- **E2 LARGE, three build stages, screens.** Per stage: tasks, full gates, PR, tester + five lenses
  + UX lens, decide and fix, full gates, checker, merge. All build boxes ticked: band `accept`;
  the demo (mandatory). Docs owed: the band switches to *documentation* (inventory → write →
  cold-read → publish, D-6), one PR with the LARGE review set. `openspec-archive-change`: band
  `epic-delivery/archive`.
- **E3 Inconsistent report.** A builder reports `exit 0, 41 passed`; the diff adds two tests and
  the previous count was 41. T1: the lead re-runs the task gate; commit body `Re-run: T1, count
  unchanged after two added tests`.
- **E4 Polling.** `until gh run view 123 | grep -q completed; do sleep 20; done` is denied with the
  D-5 message; `sleep 5`, `gh pr checks 7 --watch` and `python -c "while x: time.sleep(1)"`
  (quoted) run.

## Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Lead re-runs the task gate "to be sure" | Read diff + report; re-run on T1–T3 | FC-4: the same gate twice on the same code |
| Reviewer runs the test suite | Read the stage's gate report | One owner per check (D-4) |
| Re-run the whole suite after one fix | Failing tests until green, then full gates once | FC-4 |
| Chase a flaky test with new seeds in the stage | Quarantine + own task (D-14) | Hides the defect, costs runs |
| Sleep loop to wait for CI | Foreground, or one notice / one blocking wait | FC-5 |
| Name one repository's target in method text | "the project's full gates"; targets in `AGENTS.md`; scaffold defaults only in workflow data (D-9) | DEC-2, FC-10 |
| Docs stage flips an ADR to Accepted | Record as-built; route contradictions | D-7 |
| Checkboxes for the docs stage or the close in `tasks.md` | Plain lines; the documentation workflow tracks them | `accept` never shows otherwise (D-8) |
| An agent calls an external MCP tool | Only the project's code-intelligence tools (D-10 body line) | RISK-11 |

## Error matrix

| Situation | Detection | Response |
|---|---|---|
| Report missing a D-2 field | Lead reading the report | T1 re-run; fix the brief template if its report line was unclear |
| Project names no task gate or full gates | Lead cannot write brief rule 5 | Ask the developer; the answer goes into the project's `AGENTS.md` |
| Hook module throws, input unparsable, or `node` missing | Non-2 exit / caught error | The command runs (fail open) |
| Hook denies a non-loop command | Builder reports it | Allowed by rule; a new test row, then the pattern is fixed |
| Project has no marker for quarantining a test | Builder cannot apply D-14 | The framework's skip-with-reason plus the issue link |
| Code-index refresh fails | Non-zero exit in the background | Warn; impact read from code |
| opencode does not give MCP tools to an agent with no list | Probe (task 3.4) | A gap in `docs/environment/dual-cli/compatibility.md`; DEC-11 holds on Claude |
| Demo rejected | Developer's verdict | Decision in `design.md`; a fix stage; then the docs stage |
| As-built contradicts an ADR | Docs-stage write | Finding to the lead; the developer decides |
| Repo file `extends` epic-delivery and names `verify` | Navigator's workflow-file check | Its existing error; the CHANGELOG BREAKING line says the fix |
| Lead loads `technical-writing` mid-build | The band shows *documentation* | Loading `epic-delivery` or `openspec-apply-change` switches back (D-19) |

## Test coverage

- By hand, per CLI: `tests/features/epic-delivery.feature` (appetite outline, re-run triggers,
  each check once, questions in one round, two-run cap, demo by appetite, docs owed);
  `tests/features/documentation-workflow.feature` (five phases, cold reader by page type, as-built
  ADRs); `tests/features/agents/{implementer,code-reviewer}.feature` (gate report, doc agreement,
  code-intelligence tools).
- Navigator (`make mods`), from the engine probe: build boxes all ticked with docs and close as
  plain lines → `accept`; acceptance file → gate `ok`, phase `accept`; the D-6 sequence; the D-9
  landings; brownfield done → `accept`; default `full-gates` passes on `make check-all`, skillery's
  override on `make validate`; eight default files.
- Hook (`node --test mods/no-poll-loops/*.test.mjs`): deny `while`/`until`/`for` + `sleep`,
  `watch -n`; allow single sleep, `--watch`, `wait`, a loop without sleep, a quoted loop; exit 2 +
  message on deny; exit 0 on bad JSON. opencode handler: throws on deny, passes on error.
- Installer (`npm run test:opencode-installer`): both rendered agents have `tools: {"skill": true}`,
  `permission.task: "deny"`; the reviewer `permission.edit: "deny"`; no new gap in
  `make opencode-report`.
- Bundles: `meaningfy-core`'s `plugin.json` names `./mods/no-poll-loops/hooks.json` and no
  `types`; navigator's bundle unchanged.

## Risks / Trade-offs

| Id | Risk | Likelihood | Impact | Response |
|---|---|---|---|---|
| RISK-1 | A wrong builder report reaches the stage PR | Medium | Stage-sized rework | Accepted (D-b); T1; full gates + CI + review at the PR |
| RISK-2 | Fewer local runs miss an order-dependent failure | Low | A red CI | CI catches; flaky policy (D-14) |
| RISK-3 | `verify` → `accept` breaks repo overrides | Low | A workflow-file error | CHANGELOG BREAKING with the fix |
| RISK-4 | A repo's `AGENTS.md` names no checks | Medium | Briefs cannot be written | D-12 slot; error-matrix row |
| RISK-5 | The deny hook false-positives | Low | A blocked command | Loops only; quoted text ignored; fail open; test table |
| RISK-6 | A reviewer reaches an MCP edit tool | Low | An edit in a review | Read-only brief and body line; the lead reads `git status` before the fix round |
| RISK-7 | A docs stage in every EPIC | Medium | Lost leanness | Runs only on its condition; else "no docs owed" (D-8) |
| RISK-8 | The lead's band shows *documentation* during the build | Medium | A confusing band | Switch back by loading a delivery skill (D-19); noted in the navigator guide |
| RISK-9 | A project names a task gate too narrow to catch its own regressions | Low | A red stage PR | Full gates once at the stage PR plus CI (R3-2) |
| RISK-10 | Shipping the hook needs generator, lint and plugin changes beyond the estimate | Medium | The appetite grows | Re-shape trigger: anything beyond D-5's *Tooling it needs* stops the stage (proposal *Appetite*) |
| RISK-11 | Agents with no tool list reach every MCP tool in the session, external ones included | Medium | An agent acts on an external system | Body line limits them to the project's code-intelligence tools; the brief names scope; accepted for the gain of DEC-11 |

## References

| Topic | Location |
|---|---|
| The stage loop today | `skills/epic-delivery/references/stage-loop.md` |
| Briefs and reports | `skills/epic-delivery/references/team-and-briefs.md`; `skills/guardrails/references/subagent-reports.md` §*Fields per purpose* |
| V-model and demo | `skills/epic-delivery/references/verification-validation.md` |
| Lenses | `skills/meaningfy-code-review/SKILL.md` §*Lenses* |
| ADR acceptance | `skills/architecture/references/architecture-index-page.md` ("An ADR becomes Accepted only after the walkthrough") |
| Task counting, `tasks-done` | `mods/navigator/lib/change.ts` (`progress`, `holds`) |
| Phase moves by gates | `mods/navigator/lib/phase.ts` (`advanceOn`, `select`) |
| Skill loads seen by navigator | `mods/navigator/register.tsx:69-71` |
| Mod bundling | `tools/bundle_gen/gen.py` (`MOD_FILES`, `MOD_DATA`, `plugin_manifests`); `docs/development/mods.md` |
| opencode plugin and agents | `tools/opencode-plugin.mjs`; `tools/opencode-bundle-lib.mjs` (`renderAgent`) |
| Hook bindings (to be corrected) | `docs/development/hook-bindings.md` §*agent mechanism* |
| #162 text | `inputs/pr162-efe7e39.diff` |
