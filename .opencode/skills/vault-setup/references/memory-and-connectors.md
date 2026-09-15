# The company memory, connectors, and the ingestion opt-in

The addresses, account names and credentials for all three come from the company's **private
infrastructure runbook**, never from skillery. Ask the owner to open it.

## The company memory's MCP server (user scope)

The vault skills need `recall`; they never use `remember` or `forget` (see `vault-conventions`).

- Add the server **for the user, never as a project configuration inside the vault** (a vault-level MCP
  file would travel with the synced folder to every machine and every colleague who can read it).
- **Claude Code:** `claude mcp add --scope user --transport http <memory-server> <url from the runbook>`
  with the authentication header the runbook names. Choose a short `<memory-server>` name; the
  permission settings refer to it.
- **opencode:** add it under `mcp` in the user's global `opencode.json`.
- Do **not** install Cognee's own Claude Code plugin: it records every prompt and tool trace into the
  graph, which a vault session must never do.

Check: `claude mcp list` (or opencode's MCP list) shows the server connected.

## Mail and calendar connectors

`vault-daily` reads mail and calendar through the connectors the owner profile names.
- **Google Workspace:** the Gmail and Google Calendar connectors, authorised in the Claude account's
  connector settings (they then appear in Claude Code).
- **Microsoft 365:** the Outlook mail and calendar connector.

Write the connectors' names into the owner profile in `AGENTS.md` exactly as the CLI lists them.

## Opting in to the ingestion pipeline (optional)

The pipeline copies notes the owner marks `memory: common` (in `01 Projects/` or `03 Resources/`) and
files in `vault-files/_shared/` into the company memory every night. To join:
1. ask the infrastructure owner for a pipeline entry for this vault (its name, reader, opt-in default);
2. share only `vault/01 Projects/`, `vault/03 Resources/` and `vault-files/_shared/`, read-only, with
   the pipeline's service account named in the runbook. **Never share the whole owner folder**: that
   would expose every daily note and personal note.

Nothing is shared until the owner sets `memory: common` on a note or moves a file to `_shared/`.
