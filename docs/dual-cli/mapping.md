# Source → CLI mapping reference

One set of sources, two CLIs. This is the shared translation table both
[`setup-claude.md`](setup-claude.md) and [`setup-opencode.md`](setup-opencode.md) build on. It
records *what derives from what* — the contract the `dual-cli-generator` implements (it does not
generate anything here).

## Artifact mapping

| Source (authored once) | Claude Code | opencode |
|---|---|---|
| `skills/<name>/SKILL.md` | `.claude/skills/<name>/` (or marketplace plugin) | `.opencode/skills/<name>/` — *also* read natively from `.claude/skills/` |
| `agents/<name>.md` | `.claude/agents/<name>.md` | `.opencode/agents/<name>.md` |
| command content | `/opsx:<id>`, `/<name>` (native registration) | `.opencode/commands/<id>.md` (`template` + `$ARGUMENTS`) |
| root binding | `CLAUDE.md` (pointer → `AGENTS.md`) | `AGENTS.md` (read natively) |
| `VERSION` | `marketplace.json` `metadata.version` | opencode manifest version |
| hook *intent* (`hooks/inventory.yaml`) | `settings.json` hooks (agent) + pre-commit/CI (git/ci) | `.opencode/plugin/*` (agent) + the same pre-commit/CI |
| MCP (documented, not generated) | `.mcp.json` `mcpServers` | `opencode.json` `mcp` |

## Frontmatter field mapping (agents)

| Source frontmatter | opencode equivalent |
|---|---|
| `model: opus` | `model: anthropic/claude-opus-4-8` (alias lookup) |
| `tools: [Read, Edit, Bash, …]` (PascalCase) | `tools` / `permission` with lowercased names (`read`, `edit`, `bash`) |
| `disallowedTools: […]` | folded into opencode `permission` (deny) |
| `skills: […]` | opencode agent `skills` list |
| invocation name `meaningfy-<bundle>:<agent>` | opencode agent name |

These tables are the **contract**; the generator (separate change) reads sources and emits the
right-hand columns, then a parity gate asserts every first-party row has both sides at the same
`VERSION`. Anything unmappable becomes an explicit `Gap(source, cli, reason)` — never a silent drop.

## What is NOT mapped (tool-native)

Slash-command *registration* and agent-*hook bindings* are per-CLI by design — see the tool-native
boundary in [`compatibility.md`](compatibility.md). Only their content/intent is shared.
