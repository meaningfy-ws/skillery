# Seed — agent design notes and mechanics (for `agent-authoring-standard`)

**Status:** SECONDARY input. Preserved verbatim, **never groomed, never deleted**. The shaped EPIC
(`../proposal.md`) supersedes this as the primary truth but does not replace it.

**Provenance:** Claude Cowork session with Eugeniu Costetchi, 2026-10-25. §1 is the human's own note
text, reproduced as written. §2–§4 are facts read from vendor documentation on that date.

---

## §1. The human's notes (verbatim, from opencode 2.0 tutorials)

> Agents are embedded into the system.
> • open code 2.0 runs sessions across devices
> • use open code Agent Builder
> • agents setup for development (a team of roles): team lead (primary), builder, product manager,
>   architect, conceptual modeller, tech lead, tester, code reviewer, devops engineer, uiux designer.
> • Alternatively, OpenAgents Control - looks too ambitious to be taken with a grain of salt. There you
>   can see for example the team lead asking the product manager to clarify requirements
> • "script-writer" skill can help us with the communication skills in meaningfy
> • why break into subagents vs single main thread - team scale - better performance, consistency,
>   speed, parallelization, but usually leads to more tokens consumed
> • one job per agent, keep it focused (e.g. write project documentation so its instructions are
>   "update docs based on code changes, and keep alignment to features or specs", or code reviewer
>   which has only a few lines of instructions what its role is what it does and what to pay
>   attention to high level (not like skills)
> • note BMAD method, framework for software development

Session correction accepted by the human: opencode 2.0 (13 Oct 2026) runs a local shared service
with device pairing (terminal, web, desktop share one backend), not cloud session sync; its real
additions are background subagents and Code Mode.

## §2. Claude Code mechanics (code.claude.com docs)

- **Subagents:** `.claude/agents/<name>.md`; frontmatter `name`, `description`, `model`, `tools`,
  `disallowedTools`, `skills`, `effort`, `autoCompactWindow`, optional `background: true`; own
  context window; result returns to caller. Created by hand or via `/agents`.
- **Agent teams (experimental, `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`):** one lead session,
  teammates as full sessions with own context, shared task list (file-locked claims, dependencies),
  mailbox messaging between any two agents. A teammate can be spawned **from a subagent definition**
  (its `tools`, `model`, `disallowedTools`, `effort`, body apply; its `skills` do not). Limitations:
  no nested teams, one team per session, no resume of in-process teammates, lead fixed, permission
  prompts bubble to lead. Guidance: start with 3–5 teammates; research/review before parallel
  implementation; avoid two teammates editing one file. Token cost scales per teammate.
- **Comparison table (docs):** subagents = lower cost, caller manages work, results summarised back;
  teams = higher cost, self-coordination, direct messaging. Use teams when teammates must discuss
  and challenge each other.

## §3. opencode mechanics (opencode.ai docs)

- Agent file: `.opencode/agents/<name>.md` or `~/.config/opencode/agents/`; body = system prompt;
  frontmatter `description`, `mode: primary|subagent|all`, `model: provider/model#variant`,
  `permissions` (ordered rules `action/resource/effect`, last match wins), `steps`, `hidden`,
  `color`, `disabled`. Built-ins: `build`, `plan` (primary), `general`, `explore` (subagent).
- A parent may launch a subagent only if its `subagent` permission allows it (deny all, allow named).
- `opencode agent create`: describe purpose → LLM writes the file → pick tools → pick mode.
- No teams concept; background subagents since 2.0.

## §4. Reference evaluations made in session

| Reference | Finding | Verdict recorded |
|---|---|---|
| 10-role dev team | Roles overlap (architect/tech lead, team lead/PM); current roster is 3 | Grow by need; Work Shaper and documenter first |
| OpenAgents Control | ~4.9k stars, MIT; plan-first with approval gates; context files in `.opencode/context/`; targets opencode **v1**; Claude plugin BETA; "major overhaul coming" | Mine ideas (ContextScout, approval gates); do not adopt |
| BMAD v6.12 | Agile personas as skills; PRD → architecture → stories; readiness gate PASS/CONCERNS/FAIL; ~1.7k tokens/session overhead; redesigned several times; Claude Code/Codex/Cursor | Overlaps Shape Up + OpenSpec + clarity-gate; borrow readiness-gate idea only |
| "script-writer" skill | No canonical source found | Gap; likely an extension of `executive-communication` |
| Subagents vs single thread | Human's note confirmed by docs | Split for isolation/parallelism; pay in tokens; start read-only |

## §5. Existing agents — observed shape

- `code-reviewer`: `model: opus`, read-only tools, `skills: [meaningfy-code-review, cosmic-python]`;
  body carries a strict dispatch rule ("exactly one lens per run", five-lens fan-out by the caller),
  a 5-step process, and gitnexus impact calls.
- `implementer`: `model: sonnet`, write tools, `skills: [cosmic-python, stream-coding]`; opencode
  rendering appends `superpowers:test-driven-development`, `superpowers:systematic-debugging`.
- `epic-planner`: `model: opus` (per the `ai-dev-workflow` inventory), asks many questions.
- All three are auto-discovered into all five Claude plugins today (see
  `single-source-distribution` inputs §2).
