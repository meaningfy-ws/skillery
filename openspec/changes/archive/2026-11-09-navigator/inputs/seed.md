<!-- SECONDARY input. Captured 2026-11-08 from the owner's brainstorming session. Superseded by
     proposal.md; never deleted or groomed. -->

# Seed: a status band for skillery, in the style of ponytail

## The trigger

The owner saw the `ponytail` plugin's status line and interactive band in Claude Code and asked for
a similar plugin for skillery: something that shows *what sort of agent is running, what task we
are on, what workflow we follow, how heavy the EPIC is, which skills and subagents are called*.

## How ponytail does it (recon, ponytail 5.3.3)

Three layers, each with one job:

1. **Status line** — `hooks/ponytail-statusline.sh` prints `[PONYTAIL]` from a flag file
   (`~/.claude/.ponytail-active`). Plain shell; reads state, holds none.
2. **Classic hooks** — `hooks/claude-codex-hooks.json`: `SessionStart`, `SubagentStart`,
   `UserPromptSubmit` write the flag and inject the mode's rules. This is the steering layer.
3. **A mod** — `hooks/band/register.tsx` (~500 lines TSX), registered through
   `hooks/claude-band.json` `{ "modules": [...] }` and named in `plugin.json` `"hooks"` + `"types"`.
   It hooks `session.start`, `prompt.submit`, `tool.call`, `turn.complete`, `command.run`,
   `session.end`; keeps state in an `atom`; draws a band above the prompt
   (`ui.render { component: 'AbovePrompt' }`) folded/unfolded, with buttons that run the same slash
   commands a person types; writes a per-project CSV ledger and a `board.html` after every turn.

Pattern worth keeping: **hooks and the mod observe and keep a little state; the band only draws it;
buttons run the person's own commands, so all logic stays in the skills.**

Mods share the `AbovePrompt` slot and stack (ponytail draws the next mod's tree below its own), so
two bands coexist.

## Mod API surface found (Claude Code 2.1.319 types)

Events a mod can hook, relevant here: `session.start`, `session.end`, `session.compact`,
`prompt.submit`, `prompt.compose`, `skill.prompt` (skill name + frontmatter on each skill run),
`agent.spawn` (subagent type, model), `turn.start`, `turn.complete` (usage; `agentId` on a
subagent's loop), `tool.call`, `command.run`, `ui.render`, `ui.press`.
`$.ui.status(text)` pins one line per plugin under the prompt. Button `hotkey` works only when the
band has focus; a global chord can only bind to a known engine action — hotkeys dropped by the owner.

## Skillery facts the band can read

- Workflows: `docs/development/workflows.md` — build-tier (propose → PLAN → clarity-gate ≥9 →
  apply → verify → archive), exploratory, brownfield; verb → owning-skill map.
- The six-step stage loop and the review set per appetite: `epic-delivery`.
- Appetite sizes TINY … HUGE: `epic-planning`.
- Subagent dispatch and session hygiene rules: `guardrails` §5, §6.
- DevOps: agents `devops-engineer`, `ops-watch`, `infra-reviewer`; record kinds in
  `infrastructure-operations/references/interventions.md`; unattended named operations in
  `service-reliability/assets/unattended-actions.yaml`.
- Hook intents single-sourced in `hooks.yaml`; bundles rendered by `make bundles` as symlinks.
