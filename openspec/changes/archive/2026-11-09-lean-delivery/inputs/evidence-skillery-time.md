# Where development time goes in skillery (measured 2026-11-09, session skillery-0a)

> **Scope (owner, 2026-11-09):** this is one repo's evidence. The make targets, CI and bundle steps
> are skillery's own. The EPIC states the method and the tools in project-neutral terms
> (the project's narrow checks, its full gates, CI waits, index refresh), never these targets.

Source: the 15 most recent Claude Code transcripts in ~/.claude/projects/-home-lps-work-repos-skillery/
(about 75 h wall time), `gh run list` (40 runs), and `git log --all --since=14.days`. These are
transcript timestamps, not Langfuse data. Gaps are capped at 30 min, so idle time includes breaks.

## Main thread
- Waiting for the owner: ~17.9 h. AskUserQuestion: 10 calls, 73 min blocked.
- Tool calls: ~6.6 h. Model generation: ~3.0 h.

## Tools
| What | Calls | Time |
|---|---|---|
| `make validate` | 223 | 130.7 min (~35 s each) |
| `gh pr checks` / watch (waiting on CI) | — | 115.5 min |
| other `gh` | — | 40.1 min |
| `make bundles` | 87 | 57.6 min |
| `make validate-spine` | 53 | 31.2 min |
| `make skill-inventory` | 34 | 16.3 min |

A CI run takes 51–122 s. Four CI failures on chore/archive-navigator; jobs were dropped on #158.

## Subagents (background, they overlap the main thread)
general-purpose 69 runs / 314 min; implementer 8 / 78 min; epic-planner 2 / 75 min;
code-reviewer 3 / 13 min.

## Work mix (14 days)
- Commit types: `docs(openspec)` 58 (the most common), `feat(navigator)` 13.
- Lines changed: openspec/changes ~68k, mods ~10k, tests ~15k, skills ~47k. bundles/ ~95k is generated.
- navigator-workflows (SMALL): 403-line design.md, clarity gate 4 runs (7.5, 8.2, 8.7, 9.1),
  5 Q&A rounds, re-shaped mid-delivery.

## Owner-facing conclusion given
The machine is not the bottleneck; plan churn, repeated full checks and one-at-a-time questions are.
Proposed and committed in efe7e39 (PR #162, not merged): cap of two gate runs for TINY/SMALL (the
developer decides the gaps left, accepted gaps recorded as DEC-), PLAN depth by appetite, questions
in rounds, narrow checks while iterating, full gates once per task, repo narrow targets in AGENTS.md.
A fresh reviewer found 9 issues, all fixed in efe7e39 (incl. the clarity-gate exception wording).
