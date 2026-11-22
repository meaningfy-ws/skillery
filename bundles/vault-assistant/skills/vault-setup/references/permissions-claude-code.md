# Permission settings: Claude Code

Two files at the vault root. Write them only if absent; if present, compare and report differences.

## `CLAUDE.md`

Claude Code reads `CLAUDE.md`, not `AGENTS.md`. One line imports the vault's agent instructions:

```markdown
@AGENTS.md
```

## `.claude/settings.json`

Applies to every session started at the vault root. Deny rules win over allow rules, so the shell is
not denied wholesale (that would also block the Obsidian CLI): `obsidian` is allowed, and any other
command needs the owner's approval in an interactive session and is refused in a scheduled one.
Commands that fetch (`curl`, `wget`) are denied outright. Commands that move or delete (`mv`, `rm`)
always ask, so the owner approves each move or delete they requested (`vault-conventions`, Moving and
deleting); the scheduled run denies them on its command line ([`scheduler.md`](scheduler.md)). The read-only
mail and calendar tools and the memory `recall` are allowed, so neither an interactive session nor a
scheduled one stops to ask for them. Any other shell
command is a **stated gap**: tell the owner to refuse it when asked. The one exception is the
rulebook script (`.../rulebook/scripts/rules.py`): approve it, never refuse it, because it reads and
writes only rule notes. The allow rule that saves the prompt is per machine (below).

Copy [`assets/permissions/claude-code-settings.json`](../assets/permissions/claude-code-settings.json)
to `.claude/settings.json`. Adapt before writing:
- **`<memory-server>`** is the name the owner gave the company memory's MCP server (see
  [`memory-and-connectors.md`](memory-and-connectors.md)); `claude mcp list` shows it.
- **Outlook users:** replace the Gmail and Google Calendar entries with the Outlook connector's tools
  that send, reply, forward, delete, move, flag or change categories, and create, update, delete or
  respond to events. List the connector's tools with `/mcp` and deny every write except creating and
  updating drafts.
- A server-level entry (`mcp__claude_ai_Google_Drive`) denies every tool of that server.
- Connector tool names change when a connector updates: re-run the check in
  [`final-check.md`](final-check.md) after an update.

## Per machine: the rulebook script

The per-machine allow rule for the rulebook script is owned by `rulebook`:
the "Permissions (per machine)" section of the `rulebook` skill's `references/commands.md`.

## Verify

A denied tool is removed from the session altogether: the agent cannot call it at all (checked
2026-09-15 with `send_message` at a vault root). In a session at the vault root, `/permissions` lists
the rules; check every deny is there. Do not test
by asking for a real send. The owner may, once, ask for a mail to their own address and confirm it is
refused without a prompt.
