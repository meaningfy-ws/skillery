# MCP server setup (Claude Code & opencode)

The catalogue does **not** ship committed MCP server configs. MCP servers carry
credentials and are environment-specific, so each developer installs the servers
they need **one by one**, locally. This page is **reference only** — copy a template,
fill in your own paths/keys, never commit secrets.

> Where configs live:
> - **Claude Code** — project `.mcp.json` (or user `~/.claude.json` / settings). Not committed here.
> - **opencode** — `opencode.json` under the `"mcp"` key (project or `~/.config/opencode/`). Not committed here.
>
> Secrets: use environment variables (`${VAR}` placeholders) — do not paste tokens into the file.

## Template shapes

**Claude Code — `.mcp.json`:**
```json
{
  "mcpServers": {
    "<name>": {
      "command": "<cmd>",
      "args": ["..."],
      "env": { "SOME_TOKEN": "${SOME_TOKEN}" }
    },
    "<remote-name>": {
      "type": "http",
      "url": "https://example/mcp",
      "headers": { "Authorization": "Bearer ${SOME_TOKEN}" }
    }
  }
}
```

**opencode — `opencode.json`:**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "<name>": {
      "type": "local",
      "command": ["<cmd>", "..."],
      "enabled": true,
      "environment": { "SOME_TOKEN": "${SOME_TOKEN}" }
    },
    "<remote-name>": {
      "type": "remote",
      "url": "https://example/mcp",
      "enabled": true,
      "headers": { "Authorization": "Bearer ${SOME_TOKEN}" }
    }
  }
}
```

The two are structurally equivalent: `command`+`env` (local/stdio) or `url`+`headers` (remote).
Translate field names per the table; keep the same server name on both CLIs.

| Concept | Claude `.mcp.json` | opencode `opencode.json` |
|---|---|---|
| server map | `mcpServers` | `mcp` |
| local transport | `command` (string) + `args[]` | `command[]` (argv array) |
| local env | `env` | `environment` |
| remote transport | `type: "http"`, `url` | `type: "remote"`, `url` |
| remote auth | `headers` | `headers` |
| enable toggle | (omit to enable) | `enabled: true` |

---

## Per-tool reference templates

Install only what you use. Replace every `${...}` with an environment variable.

### GitNexus (code intelligence) — local
```jsonc
// Claude .mcp.json → mcpServers
"gitnexus": { "command": "node", "args": [".gitnexus/run.cjs", "mcp"] }
// opencode opencode.json → mcp
"gitnexus": { "type": "local", "command": ["node", ".gitnexus/run.cjs", "mcp"], "enabled": true }
```

### Atlassian — Confluence / Jira (Rovo) — remote
```jsonc
"atlassian": { "type": "http", "url": "https://mcp.atlassian.com/v1/sse",
               "headers": { "Authorization": "Bearer ${ATLASSIAN_TOKEN}" } }
"atlassian": { "type": "remote", "url": "https://mcp.atlassian.com/v1/sse", "enabled": true,
               "headers": { "Authorization": "Bearer ${ATLASSIAN_TOKEN}" } }
```

### Google — Gmail / Drive / Calendar (tools CLI + MCP) — remote (OAuth)
```jsonc
// One server per Google product, or a combined gateway — follow the provider's MCP endpoint + OAuth.
"google-workspace": { "type": "http", "url": "https://<google-mcp-endpoint>/mcp",
                      "headers": { "Authorization": "Bearer ${GOOGLE_OAUTH_TOKEN}" } }
"google-workspace": { "type": "remote", "url": "https://<google-mcp-endpoint>/mcp", "enabled": true,
                      "headers": { "Authorization": "Bearer ${GOOGLE_OAUTH_TOKEN}" } }
```

### Odoo (odoo-mcp CLI) — local
```jsonc
"odoo": { "command": "odoo-mcp", "args": ["serve", "--profile", "${ODOO_PROFILE}"],
          "env": { "ODOO_API_KEY": "${ODOO_API_KEY}" } }
"odoo": { "type": "local", "command": ["odoo-mcp", "serve", "--profile", "${ODOO_PROFILE}"],
          "enabled": true, "environment": { "ODOO_API_KEY": "${ODOO_API_KEY}" } }
```

### Neo4j (per database) — local; repeat per DB (LUXSE, budget, cargo, …)
```jsonc
"neo4j-<db>": { "command": "uvx", "args": ["mcp-neo4j-cypher", "--db", "<db>"],
                "env": { "NEO4J_URI": "${NEO4J_URI}", "NEO4J_PASSWORD": "${NEO4J_PASSWORD}" } }
"neo4j-<db>": { "type": "local", "command": ["uvx", "mcp-neo4j-cypher", "--db", "<db>"], "enabled": true,
                "environment": { "NEO4J_URI": "${NEO4J_URI}", "NEO4J_PASSWORD": "${NEO4J_PASSWORD}" } }
```

### MongoDB — local
```jsonc
"mongodb": { "command": "npx", "args": ["-y", "mongodb-mcp-server"],
             "env": { "MDB_MCP_CONNECTION_STRING": "${MDB_MCP_CONNECTION_STRING}" } }
"mongodb": { "type": "local", "command": ["npx", "-y", "mongodb-mcp-server"], "enabled": true,
             "environment": { "MDB_MCP_CONNECTION_STRING": "${MDB_MCP_CONNECTION_STRING}" } }
```

### Context7 (library docs) — local
```jsonc
"context7": { "command": "npx", "args": ["-y", "@upstash/context7-mcp"] }
"context7": { "type": "local", "command": ["npx", "-y", "@upstash/context7-mcp"], "enabled": true }
```

---

> ⚠️ These templates are **illustrative defaults** — confirm the exact command/endpoint/auth against
> each tool's own current docs before use. Endpoints and package names change.
> Keep all secrets in environment variables.
