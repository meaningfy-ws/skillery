# Hook load check (task 4.5) — Claude Code

Date: 2026-11-09. Run by the lead, branch `feat/lean-delivery-stage-4`.

Setup: a scratch, non-interactive Claude Code session (`claude -p --model haiku`) loading the
branch's rendered bundles with `--plugin-dir bundles/meaningfy-core --plugin-dir
bundles/meaningfy-navigator`, Bash allowed. Three commands, one tool call each.

| Command | Result |
|---|---|
| `for i in 1 2; do echo $i; sleep 1; done` | Denied by the PreToolUse hook with the D-5 message ("Sleep loops are denied. Run the command in the foreground…"), attributed to `meaningfy-core` |
| `sleep 1 && echo single-ok` | Ran: `single-ok` |
| `echo done` | Ran: `done` |

- The hook command `node "${CLAUDE_PLUGIN_ROOT}/mods/no-poll-loops/no-poll-loops.mjs"` resolved to
  the bundle's own copy (path shown in the denial).
- Navigator's bundle loaded in the same session with no hook or module error.

Verdict: pass.
