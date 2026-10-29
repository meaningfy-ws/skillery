# Permission settings: opencode

> **UNVERIFIED.** The shapes below follow opencode's documented `permission` and `tools` settings, but
> have not been tested against the pinned opencode version with these connectors. Tell the owner so,
> and test each deny (see Verify) before relying on it.

opencode reads `AGENTS.md` at the vault root natively; no pointer file is needed.

## `opencode.json` at the vault root

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "bash": { "*": "ask", "obsidian *": "allow", "mv *": "ask", "rm *": "ask", "curl *": "deny", "wget *": "deny", "python3 <home>/.config/opencode/skills/rulebook/scripts/rules.py *": "allow" },
    "webfetch": "deny",
    "websearch": "deny",
    "edit": "ask",
    "<mail-server>_send*": "deny",
    "<mail-server>_reply*": "deny",
    "<mail-server>_forward*": "deny",
    "<mail-server>_trash*": "deny",
    "<mail-server>_*spam*": "deny",
    "<mail-server>_*label*": "deny",
    "<calendar-server>_create_event": "deny",
    "<calendar-server>_update_event": "deny",
    "<calendar-server>_delete_event": "deny",
    "<calendar-server>_respond_to_event": "deny",
    "<drive-server>_*": "deny",
    "<chat-server>_*": "deny",
    "<memory-server>_remember": "deny",
    "<memory-server>_forget": "deny"
  }
}
```

Replace each `<…-server>` with the MCP server name as opencode shows it; opencode names MCP tools
`<server>_<tool>`. Within a pattern map **the last matching rule wins**, so the catch-all `"*"` comes
first and the specific rules after it. The older top-level `tools` block is deprecated; use
`permission` only. `mv` and `rm` ask, so the owner approves each move or delete they requested
(`vault-conventions`, Moving and deleting).

The rulebook script is allowed by its full path in the global opencode skills folder (`<home>` is
the owner's home folder written out; on Windows, `python` and the Windows path). opencode's `*`
matches any text, so this pinned path is the narrowest rule: `python3 *rules.py *` would allow any
Python program whose arguments mention `rules.py`. The rule comes after the catch-all, because the
last matching rule wins. Recorded 2026-10-29 from the opencode permission documentation, not tested
live.

## `opencode.scheduled.json` at the vault root

Loaded only by the scheduled run ([`scheduler.md`](scheduler.md)) through `OPENCODE_CONFIG`, on top of
`opencode.json`, so an unattended run can never move or delete:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": { "bash": { "*": "deny", "obsidian *": "allow", "mv *": "deny", "rm *": "deny" } }
}
```

## Gaps against Claude Code

- `edit` is set to `ask` for the whole vault instead of denying edits to `AGENTS.md` and
  `opencode.json` only; ask the owner to refuse any edit to those two files.
- Skills cannot be invoked with a slash; the owner asks for them by name.
- Rule usage is not traced on opencode (no Langfuse plugin), so the weekly rules review sees no
  usage from opencode sessions.

## Verify

Start opencode at the vault root and ask the agent to send a test mail and to fetch a web page; both
must be refused. Record the result for the owner.
