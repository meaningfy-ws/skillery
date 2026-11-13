# Spike 1.1: mod API event order (2026-11-13)

Task 1.1 of the PLAN. A throwaway logging mod (outside the repository, hot-loaded into the epic
session) logged `tool.call` (pre and post), `skill.prompt`, `agent.spawn` (pre and post) and
`turn.complete`, each with `$.session.root()` and `$.session.cwd()` read inside the hook. Claude Code
2.1.323. `R` is the main checkout.

## The log (trimmed)

```
tool.call PRE  Bash  agent=-                       root=R cwd=R
                                                   (the Bash ran `cd R/mods`)
tool.call PRE  Skill agent=-  id=…YXv45            root=R cwd=R/mods
skill.prompt   ponytail:ponytail-help              root=R cwd=R/mods
tool.call POST Skill agent=-  id=…YXv45
tool.call PRE  Agent (code-reviewer)  id=…JZ8WGXAZnJ
tool.call PRE  Agent (general-purpose, isolation: worktree)  id=…6xQbxB1xNhgHEKmj5UFC
agent.spawn PRE  code-reviewer    cwd=- iso=-
agent.spawn PRE  general-purpose  cwd=- iso=-
agent.spawn POST code-reviewer    agentId=a17c…
tool.call POST Agent (code-reviewer)
skill.prompt   meaningfy-code-review               (preloaded into code-reviewer)
skill.prompt   cosmic-python                       (preloaded into code-reviewer)
tool.call POST Agent (general-purpose)
agent.spawn POST general-purpose  agentId=ac42…
tool.call PRE  Bash  agent=a17c…                   root=R cwd=R/mods
tool.call PRE  Skill agent=ac42…                   root=R cwd=R/.claude/worktrees/agent-ac42…
skill.prompt   ponytail:ponytail-help              root=R cwd=R/.claude/worktrees/agent-ac42…
tool.call POST Skill agent=ac42…
```

The worktree subagent's `git rev-parse --show-toplevel --git-common-dir --abbrev-ref HEAD`:
`R/.claude/worktrees/agent-<id>`, `R/.git`, `worktree-agent-<id>`.

## Findings

| Question | Answer | Consequence for the PLAN |
|---|---|---|
| (a) `root()` after a shell `cd` | unchanged (`R`) | as documented; D-2's start root holds |
| (a) `root()` after EnterWorktree | not run (it would move the epic session); the API doc says it follows a worktree move | accepted on the doc |
| (a') `cwd()` of the lead after a shell `cd` | **follows the `cd`** (`R/mods`) | `cwd()` is not a root; D-2 keeps using `root()` for the lead's start |
| (b) `cwd()` in a subagent's `tool.call`, isolated in a worktree | the worktree (`R/.claude/worktrees/agent-<id>`) | D-2's subagent root from `cwd()` + `git rev-parse --show-toplevel` works |
| (b) `cwd()` in a subagent's `tool.call`, not isolated | the lead's current shell directory | `--show-toplevel` of it gives the lead's tree, as wanted |
| (b') `root()` inside a subagent's hook | the lead's root, not the worktree | never use `root()` for a subagent |
| (b'') `agent.spawn` input `cwd` / `isolation` | **absent** even with `isolation: worktree` | D-2's "else the spawn's `cwd`" fallback has nothing to read: drop it; a subagent with no tool call yet has no root |
| (c) `skill.prompt` within a `Skill` tool call | between its pre and post, lead and subagent alike | D-4's in-flight rule works |
| (d) a preloaded skill's `skill.prompt` | **after** `agent.spawn` resolves (and after the `Agent` tool call's post), before the subagent's first tool call | D-4's *just-started subagent* case is the one that fires; the *pending spawn* case does not occur on this build. Kept as a harmless first check (cheap, covers a future order) |
| (d') two spawns in one turn | their `spawn` posts and preloads interleave: the first subagent's preloads fire while the second spawn is still pending | D-4's order (pending spawn before just-started) would credit them to the second spawn: amended by D-19 (just-started first) |

## Verdict

D-4's in-flight rule stands; its order is amended by D-19 (found reading the 1.6 diff against this
log). D-2 changes in one detail: the spawn's `cwd` fallback is dropped (the input carries none),
D-16. Both are in `design.md` § Delivery decisions.
