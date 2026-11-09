# lean-delivery — seed (collected 2026-11-09, session skillery-8f)

Scope (owner, binding): everything this EPIC changes is independent of any repository, including
rdf-persistence and skillery itself. rdf-persistence and skillery are evidence only. The EPIC states the method and the tools in project-neutral terms ("the project's
narrow checks", "the project's full gates", CI waits, code-index refresh). Repo-specific targets belong
in each repo's own binding (AGENTS.md). Repo numbers below are evidence only.

## Owner positions (said in session skillery-8f)
1. The 5-lens code review runs only at the end of a stage (PR) or of the EPIC, not continually. (Open: "phase" = stage or EPIC end?)
2. Demos are offered and can be skipped; mandatory for LARGE, VERY LARGE, HUGE; optional below. A skip is recorded (proposal: in evidence/acceptance.md).
3. Docs: maybe out of the build. The lead's proposal: docs the change makes false stay in the build (builder fixes, L2 checks agreement); architecture pages, user/installation/developer manuals become their own documentation workflow owned by technical-writing, with the cold reader as validation.
4. Far fewer redundant test runs; tests are very important and quality critical, but not at every step.
5. Workflow files are faithful copies of the method; to change behaviour, change the method, then the file.
6. Make the workflows more efficient and equally effective: no gate or stage is dropped.
7. The PLAN's own churn is a cost (navigator-workflows: 4 gate runs, 5 Q&A rounds, re-shape).

## Gaps found in the delivery method (session skillery-8f analysis)
- Validation has no step in the workflow; the acceptance demo and validation review are "(provisional)" in epic-delivery.
- `make validate`-style full gate sits on three delivery phases (apply, verify, archive).
- `verify` re-asks the code review the stage loop already ran.
- Navigator polices over-review (PD-8) and checker-after-review (PD-9) but never under-review (no review before a PR, fewer lenses, no tester, no cold reader).
- No review lens owns "changed docs agree with the code" (navigator-workflows review found W2/W6 only incidentally) — the recorded failure case.
- Open owner question: does the lead re-run the full gates after the builder (epic-delivery's gotcha "trusting a member's report") or trust the builder's timed report and read the diff?

## Folded in: PR #162 (closed), commit efe7e39 on origin/docs/lighter-small-epic-loop
- epic-planning: TINY/SMALL EPIC runs the clarity gate at most twice; gaps left go to the developer in one question round; an accepted gap is a DEC- (clarity-gate names this one exception — a fresh reviewer flagged it as a blocker without that).
- epic-planning: PLAN depth follows appetite; elicitation asks questions in rounds.
- epic-delivery: questions in one round; only narrow checks while a task is in progress; full gates once per task (the lead's re-run kept — conflicts with the open question above).
- AGENTS.md (repo binding): narrow checks per artifact and the before-commit list (must include validate-spine and test:opencode-installer).

## Evidence A: skillery time analysis (skillery-0a) — copied as skillery-time-analysis.md
## Evidence B: rdf-persistence Langfuse analysis (pasted by the owner)
- Implementation sessions: waiting on shell commands 3–5× the model time (d2666b18: 4.1 h shell / 58 min main model / 30 min subagents; 5fba695a: 1.6 h / 17 min / 27 min).
- About half the slow calls: polling background runs with `until … sleep` loops, restarted on timeout (one run polled 6×).
- Full suite (3 min) / full checks (5–8 min) run 4–6× per stage: after each fixer pass, once per random seed while chasing flaky tests, again before the PR.
- Per-task gates ~5 min (quality + clean-code 2–3.5 min, affected test folders 1–3 min), paid by the builder and again by the lead.
- Code-index (GitNexus) re-index after every commit; failures cost 2–4 min.
- Builder subagents 20–40 min each, mostly the same gates.
- Owner answers ~5.5 min in one session.
- Its proposed homes: no-polling as a PreToolUse hook + one line in the binding; a changed-files task gate as a project target; gates once per task fixed in epic-delivery (team-and-briefs, stage-loop step 2); full suite once per stage + once after fixes (re-run only failing tests until green); flaky tests quarantined to their own task; slow test folder = a repo issue; re-index in the background by hook.

## Owner decisions, round 2 (2026-11-09, session skillery-8f)
- D-a: the 5-lens review runs on each stage's PR (every stage), not continually, not only at EPIC end.
- D-b: trust the builders' reports. Builders own and guarantee their quality (test-first, narrow checks while working, the project's full gates once before reporting, a verifiable report: command, exit code, counts, time). The lead reads diff + report and re-runs only rarely: report incomplete or inconsistent, parallel builders touched shared files, or after a fix round. Independence comes at the stage PR: full gates once, CI, 5-lens review. Accepted residual risk: a bad report is found at the stage PR, bounded by stage size.

## Cross-check with rdf-persistence (2026-11-09): issue draft + its change `agent-efficiency`
Source: `inputs/rdf-persistence-issue-agent-efficiency.md`; rdf-persistence `openspec/changes/agent-efficiency/proposal.md` DEC-1..DEC-8.
- Covered already: gates run twice (D-b); re-run only failing tests after a red run, then the full run once (evidence B).
- NOT yet covered — add to scope:
  - Code-intelligence tools for subagents: `implementer` and `code-reviewer` have fixed tool lists with no MCP tools, so they cannot use Serena (symbol overview, find symbol/references, replace symbol body, insert after symbol) even where installed, and fall back to reading whole files and rewriting code with Python heredocs. Same cause seen in skillery: the navigator-workflows `code-reviewer` could not run the GitNexus impact check ("gitnexus MCP tools are not available"). Precedent for MCP tools in an agent's list: `agents/sales-agent.md`. Dual-CLI mapping must hold.
  - rdf-persistence DEC-7: Serena for reading and editing symbols only; its memories/onboarding unused; the truth stays in openspec/specs.
  - No-polling enforcement lessons (rdf-persistence DEC-2..4): deny sleep *loops* only (a single sleep and `gh pr checks --watch` stay allowed); the hook fails open; the deny message offers the foreground first, because a subagent may get no completion notice and a long target fits the tool timeout. This refines "always run in the background".
- Differs from D-b: rdf-persistence DEC-6 keeps the lead re-running the fast quality gate (~45 s) per task plus reading the diff; D-b says the lead re-runs nothing except on triggers. Owner to settle.
- rdf-persistence DEC-8: these are skillery's to decide; this EPIC is where.

- Owner (2026-11-09): repo independence also applies to the rdf-persistence items. Its targets, its hook, its DEC numbers and its tool choice (Serena) are evidence. The method speaks of "the project's code-intelligence tools (symbol-level reading and editing, impact analysis), when the project has them". Open for the PLAN: agent frontmatter must name concrete tools. How does an agent get optional MCP tools without the method depending on one product (e.g. wildcard entries that are inert where absent, or tools granted by the repo binding)?
