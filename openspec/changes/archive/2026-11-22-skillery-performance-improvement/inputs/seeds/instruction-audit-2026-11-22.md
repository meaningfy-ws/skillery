# Seed: audit of the instructions that drive the cost

**Secondary input, never groomed.** Captured 2026-11-22. Three read-only reviewers read the
instructions against the findings F-1 to F-7 of `langfuse-analysis-2026-11-22.md`; the lead
spot-checked the high-impact claims (marked ✓). Sizes are bytes / 4 ≈ tokens.

Owner's request (verbatim): "look at the epic shhapng and plannign and epic buildignd and coding
skills and identify what possibly in tehse skills leads to inefficiencies. Also look at the
rdf-persistence and mwb2 repos (especially teh agents.md and otehr instructions for agents) to
identify where inneifciencies may be"

## 1. What each role carries before it works

| Role | Instructions it is told to load | Approx. tokens | On top of |
|---|---|---|---|
| epic-planner session | epic-planning, clarity-gate, bdd-gherkin, stream-coding preloaded; opsx-explore, brainstorming, opsx-propose, the 15.6 KB clarity checklist, test-strategy + 2 tables, seed-intake, golden-thread | 30-36 k | the ~70 k floor |
| team-lead session | 5 preloaded skills + references | ~19 k | the ~70 k floor |
| implementer (builder, fixer) | TDD, cosmic-python + principles + testing checklist, verification-before-completion, team-and-briefs, activity-tools, subagent-reports; optional stream-coding, systematic-debugging | 13-22 k | the ~81 k floor |
| code-reviewer, per lens | lens catalogue regions, review skill, briefs | ~12.5 k | the ~81 k floor |
| any session in MWB2 | AGENTS.md + CLAUDE.md (GitNexus block twice) | ~6.6 k | |
| any session in rdf-persistence | AGENTS.md + CLAUDE.md; rulebook load of 19 rules | ~1.4 k + up to 3 k | |

## 2. Subagents the text mandates

| Where | TINY/SMALL | MEDIUM | LARGE+ |
|---|---|---|---|
| Planning (P-0006 + epic-planning steps 7-8) | 3-4 per EPIC | 4-6 | 8-11 per EPIC |
| Delivery, verification per stage (besides one builder per task) | 1-3 | 4-10 | 8-11 |
| Stand-alone review (`meaningfy-code-review`) | 5 lenses, always | 5 | 5 |

A 3-task LARGE stage is about 75 % verification spawns, which matches the 55 % measured.

## 3. Findings: shaping and planning (S-)

| id | Where | Cause | Feeds | Impact |
|---|---|---|---|---|
| S-1 | `docs/rules` P-0006 | spec deltas, attack and gate runs go to subagents at every appetite, overriding "when one pays" | F-3 | high |
| S-2 | `clarity-gate/references/clarity-gate-checklist.md` | borrowed Stream Coding checklist pushes PLAN size: "5+ anti-patterns", "5 unit + 3 integration tests per component", two error matrices; design.md now 45-83 KB | F-2, F-3 | high |
| S-3 | `agents/epic-planner.md:12-16` | preloads `stream-coding` (25 KB), whose 13-item gate duplicates clarity-gate | F-2 | high |
| S-4 | `agents/epic-planner.md:53` | loads `epic-planning` again with the Skill tool although preloaded | F-2 | medium |
| S-5 | `epic-planning/SKILL.md:96-117` | one shaping session per initiative through every EPIC's gated PLAN; the reset only "may" happen | F-1, F-5 | high |
| S-6 | `epic-planning/SKILL.md:44-48` | "myriad of clarifying questions", confirm after each round; no cap on rounds | F-5 | medium |
| S-7 | `epic-planning/SKILL.md:39-43` | "read every seed and supporting input" plus a codebase analysis on the main thread | F-2, F-4 | medium |
| S-8 | `seed-intake.md:36-37` | large inputs kept beside the PLAN and re-read at delivery | F-2 | low-medium |
| S-9 | `openspec/schemas/meaningfy/schema.yaml` | proposal capped at 1-2 pages, design.md unbounded; every implementer reads the whole PLAN | F-2 | high |
| S-10 | `test-strategy`, epic-planning:179 | CHK ids invite reading the 43.8 KB inventory | F-2 | medium |
| S-11 | `epic-planning:172-174`, workflow.json | five skills activated plus brainstorming: ~45 KB of overlapping elicitation guidance | F-2 | medium |
| S-12 | `epic-planner.md:9`, guardrails | opus for every planning subagent, including gate run 2 that only checks listed gaps | F-6 | medium |

## 4. Findings: delivery and coding (D-)

| id | Where | Cause | Feeds | Impact |
|---|---|---|---|---|
| D-1 ✓ | `guardrails/assets/session-thresholds.json` | thresholds in percent of the window (compact offer 50 %, warn 75 %); with 1 M windows that is ~500 k and ~750 k | F-1 | high |
| D-2 | `epic-delivery` workflow.json, stage-loop.md, team-and-briefs.md | five lenses + UX + tester + fixer + checker + cold reader per LARGE stage | F-3, F-2 | high |
| D-3 ✓ | `meaningfy-code-review/SKILL.md:44` | "One combined subagent that runs all lenses is a defect": every review is 5 spawns | F-3 | high |
| D-4 | `meaningfy-code-review/SKILL.md:105-111` | every lens traverses exhaustively and runs gitnexus impact per modified symbol, repeating the lead's | F-3, F-4 | high |
| D-5 | `epic-delivery/SKILL.md:87-89` | the lead never applies even a one-line fix; a fresh fixer is spawned | F-3, F-2 | medium-high |
| D-6 | `stage-loop.md:68-70` | red-run loop has no bound (the 150-call fixer) | F-1 | medium |
| D-7 ✓ | `agents/implementer.md:10`, `code-reviewer.md:12` | `Skill` tool (full skill listing) and wildcard MCP tool lists | F-2 | medium-high |
| D-8 | `team-and-briefs.md:18,20` | checker, UX designer and explorers are general-purpose: the heaviest floor | F-2 | medium |
| D-9 ✓ | `code-reviewer.md:10` | reviewer declared opus; guardrails says sonnet for a single-lens review | F-6 | medium |
| D-10 | `implementer.md:27-33`, cosmic-python:47 | 13-22 k tokens of skills per builder and fixer | F-2 | medium |
| D-11 | `stage-loop.md` | the builder's task gate is the full gate by default; verbose logs; waits past the cache TTL | F-5, F-4 | medium |
| D-12 | `activity-tools.md:30` | Serena `initial_instructions` in every subagent (427 ToolSearch calls) | F-4, F-2 | medium |
| D-13 | AGENTS.md "read a range" | nothing enforces Read over Bash reads; the range rule invites line-number lookups | F-4 | medium |
| D-14 | `epic-delivery/SKILL.md:80-81` | the lead reads every diff and report in the main thread | F-1 | medium |
| D-15 | navigator, hooks.yaml | a phase reminder in a changing system section may break the cached prefix | F-2, F-5 | low |

## 5. Findings: rdf-persistence (R-)

| id | Where | Cause | Feeds | Impact |
|---|---|---|---|---|
| R-1 ✓ | `pytest.ini:10-11` | `-v` over ~7,355 tests plus a `term-missing` coverage table: output overflows to a file the agent then greps | F-4, F-1 | high |
| R-2 ✓ | `docs/rules/P-0016` | "carry on in the same session through every stage, the docs stage and the archive": the direct opposite of session hygiene | F-1, F-5 | high |
| R-3 | `docs/rules/P-0013` | merge on green: the session watches CI and re-reads background output | F-4, F-5 | medium |
| R-4 | P-0017, P-0018, `.serena/project.yml` | Serena rooted at the main checkout, builders work in worktrees, so they read with Bash | F-4 | high |
| R-5 | `AGENTS.md:38` | every session and subagent loads the rulebook (19 rules) | F-2, F-3 | medium |
| R-6 | `develop/agents.adoc:119-121` | full `check-all` (13 min) twice per stage | F-1, F-5 | medium |
| R-7 | `develop/agents.adoc:57-59` | stale "skip impact until #254" brief text | F-2 | low |
| R-8 | `agents.adoc` + `testing.adoc` | builders pointed at 19 KB of pages | F-2 | medium |
| R-9 | `develop/index.adoc:130` | a full timing history in a table cell | F-2 | low |

## 6. Findings: MWB2 (M-)

| id | Where | Cause | Feeds | Impact |
|---|---|---|---|---|
| M-1 ✓ | `AGENTS.md:262-305` and `CLAUDE.md:13-56` | GitNexus block in both files; CLAUDE.md imports AGENTS.md, so it loads twice | F-2 | high |
| M-2 | `AGENTS.md:271-283` | "MUST run impact before editing": per edit, in every implementer | F-3, F-4 | high |
| M-3 | `.claude/skills/` | GitNexus skills in two copies; OpenSpec skills duplicating the user level | F-2 | medium |
| M-4 ✓ | `.serena/project.yml:42-43` | `language_servers: [typescript]` on a Python backend: Serena finds nothing, agents grep | F-4 | high |
| M-5 | `AGENTS.md:23-74, 209-216` | routing, spine binding and commit format restated (~6 KB) | F-2 | medium |
| M-6 | `AGENTS.md:76-163` | the no-workaround procedure (6.3 KB) loaded by every subagent | F-2 | medium |
| M-7 | `develop/agents.adoc:121` | `check-quality` by the builder after every task and again by the lead | F-3, F-4 | medium |
| M-8 | repo | no `no_polling` hook; "re-index regularly" | F-4 | low-medium |
| M-9 | `openspec/config.yaml:132-180` | 5 KB status snapshot in `context:`; says default branch `main` | F-2 | low |
| M-10 | `.claude/agents/mwb1-*.md` | no `model:`; ~30 tools incl. stale names | F-6, F-2 | low |
| M-11 ✓ | `pytest.ini:10` | `-v` | F-4 | low now |

MWB2's AGENTS.md is 22 KB against 5 KB in rdf-persistence because it kept the full project-setup
template body, added its policies in full, and received the GitNexus injection. The size costs
~5 k tokens per context; the per-edit impact mandate it carries costs more.

## 7. What already helps

Gate run at most twice, the second on the listed gaps only; PLAN depth follows appetite; question
rounds; one fix pass with a Critical-only floor; reviewers read the gate report, not re-run it;
CI watched by one background command; the no-poll mod; briefs point to paths; report line caps;
implementer and reviewer cannot spawn agents; rdf-persistence's thin AGENTS.md, P-0005 (one
L2+L3 pass per stage) and `test-changed`; MWB2's project agents have tool allow-lists.

## 8. Where each fix belongs

- **skillery skills and agents:** S-1 to S-12, D-1 to D-15; `guardrails` makes session hygiene win
  over a conflicting "same session" rule (R-2); `epic-delivery` uses `gh pr merge --auto` or one
  background watch (R-3), passes rules in the brief (R-5), one full gate per stage (R-6).
- **skillery `project-setup` templates:** quiet pytest (`-q -rfE`, no `term-missing`) (R-1,
  M-11); a slim AGENTS template with repo-specific content only (M-5); ship `no_polling` and the
  gate-shape table (M-7, M-8); Serena config listing every language, rooted per worktree (M-4,
  R-4); GitNexus block never in CLAUDE.md, `--skip-agents-md` by default, impact by the lead only
  (M-1, M-2); no project copies of user-level skills (M-3).
- **rulebook:** a lead-only load mode (R-5).
- **the repositories themselves:** R-2, R-3 (through their rulebook), R-4, R-7, R-8, R-9; M-1 to
  M-4, M-6, M-9, M-10.

## 9. The levers, ranked

1. **End sessions:** absolute token thresholds (D-1), P-0016 rewritten (R-2), one session per EPIC
   in planning (S-5), bounded fixer loops (D-6).
2. **Shrink verification fan-out:** appetite-scaled P-0006 with attack merged into gate run 1
   (S-1), two grouped review lenses by default (D-2, D-3), the lead applies small fixes (D-5),
   impact run once by the lead (D-4, M-2).
3. **Lower every spawn's floor:** preloaded skills instead of the `Skill` tool and exact MCP tool
   lists (D-7), a slim checker agent (D-8), drop the stream-coding preload and the borrowed
   checklist (S-2, S-3), a design.md budget (S-9), slim AGENTS files (M-1, M-5, M-6).
4. **Quiet tools:** `-q` gates (R-1), Serena that works in worktrees and on Python (R-4, M-4),
   CI by `--auto` merge (R-3).
