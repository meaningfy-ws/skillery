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
Commands that move, delete or fetch (`mv`, `rm`, `curl`, `wget`) are denied outright. Any other shell
command is a **stated gap**: tell the owner to refuse it when asked.

```json
{
  "permissions": {
    "allow": [
      "Bash(obsidian:*)",
      "mcp__claude_ai_Gmail__create_draft",
      "mcp__claude_ai_Gmail__update_draft"
    ],
    "deny": [
      "mcp__claude_ai_Gmail__send_message",
      "mcp__claude_ai_Gmail__reply",
      "mcp__claude_ai_Gmail__forward",
      "mcp__claude_ai_Gmail__trash_message",
      "mcp__claude_ai_Gmail__trash_thread",
      "mcp__claude_ai_Gmail__untrash_message",
      "mcp__claude_ai_Gmail__untrash_thread",
      "mcp__claude_ai_Gmail__mark_message_spam",
      "mcp__claude_ai_Gmail__mark_thread_spam",
      "mcp__claude_ai_Gmail__unmark_message_spam",
      "mcp__claude_ai_Gmail__unmark_thread_spam",
      "mcp__claude_ai_Gmail__label_message",
      "mcp__claude_ai_Gmail__label_thread",
      "mcp__claude_ai_Gmail__unlabel_message",
      "mcp__claude_ai_Gmail__unlabel_thread",
      "mcp__claude_ai_Gmail__update_message_labels",
      "mcp__claude_ai_Gmail__apply_sensitive_message_label",
      "mcp__claude_ai_Gmail__apply_sensitive_thread_label",
      "mcp__claude_ai_Gmail__create_label",
      "mcp__claude_ai_Gmail__update_label",
      "mcp__claude_ai_Gmail__delete_label",
      "mcp__claude_ai_Google_Calendar__create_event",
      "mcp__claude_ai_Google_Calendar__update_event",
      "mcp__claude_ai_Google_Calendar__delete_event",
      "mcp__claude_ai_Google_Calendar__respond_to_event",
      "mcp__claude_ai_Google_Drive",
      "mcp__claude_ai_Slack",
      "mcp__<memory-server>__remember",
      "mcp__<memory-server>__forget",
      "WebFetch",
      "WebSearch",
      "Bash(mv:*)",
      "Bash(rm:*)",
      "Bash(curl:*)",
      "Bash(wget:*)",
      "Edit(/.claude/**)",
      "Edit(/AGENTS.md)",
      "Edit(/CLAUDE.md)"
    ]
  }
}
```

Adapt before writing:
- **`<memory-server>`** is the name the owner gave the company memory's MCP server (see
  [`memory-and-connectors.md`](memory-and-connectors.md)); `claude mcp list` shows it.
- **Outlook users:** replace the Gmail and Google Calendar entries with the Outlook connector's tools
  that send, reply, forward, delete, move, flag or change categories, and create, update, delete or
  respond to events. List the connector's tools with `/mcp` and deny every write except creating and
  updating drafts.
- A server-level entry (`mcp__claude_ai_Google_Drive`) denies every tool of that server.
- Connector tool names change when a connector updates: re-run the check in
  [`final-check.md`](final-check.md) after an update.

## Verify

In a session at the vault root, `/permissions` lists the rules; check every deny is there. Do not test
by asking for a real send. The owner may, once, ask for a mail to their own address and confirm it is
refused without a prompt.
