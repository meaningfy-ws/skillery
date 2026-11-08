# Context commands per CLI

The rules for when to reset or compact a session live in the `guardrails` skill, *Session hygiene*
([`skills/guardrails/SKILL.md`](../../../skills/guardrails/SKILL.md)). This page only maps them to
each CLI's commands. Checked against the official docs on 2026-11-08: Claude Code
([commands](https://code.claude.com/docs/en/commands),
[context window](https://code.claude.com/docs/en/context-window),
[prompt caching](https://code.claude.com/docs/en/prompt-caching),
[checkpointing](https://code.claude.com/docs/en/checkpointing)) and opencode
([TUI](https://docs.opencode.ai/docs/tui/), [config](https://opencode.ai/docs/config/)).

| Need | Claude Code | opencode |
|---|---|---|
| Fresh session | `/clear` (aliases `/reset`, `/new`); the old session stays resumable; `CLAUDE.md` is re-read | `/new` (alias `/clear`), `ctrl+x n` |
| Compact, with a focus | `/compact <what to keep>` | `/compact` (alias `/summarize`), `ctrl+x c` |
| Automatic compaction | at the context limit; tunable with `/autocompact <size>` or the `autoCompactWindow` setting | config key `compaction.auto` |
| See the context size | `/context` | — |
| See the cost | `/usage` (alias `/cost`) | — |
| Go back to an earlier point | `/rewind` or Esc Esc (code, conversation or both; changes made through shell commands are not tracked) | `/undo`, `/redo` (file snapshots) |
| Reopen a session | `/resume`, `claude --continue`, `claude --resume` | `/sessions` (aliases `/resume`, `/continue`) |

**Prompt cache (Claude Code).** The cached prefix lives 5 minutes by default (API key, credits or a
cloud provider); on a subscription within plan usage the main conversation gets 1 hour. It is
invalidated by `/compact`, changing tools or connected servers, switching the model or the effort,
toggling fast mode, and a Claude Code upgrade. Editing `CLAUDE.md` mid-session does not invalidate
it, but the edit applies only after `/clear`, `/compact` or a restart.

Not documented at the time of checking: Claude Code's default auto-compaction threshold and
opencode's `compaction.auto` default.
