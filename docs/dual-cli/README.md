# Dual-CLI distribution

Run the skillery catalogue identically on **Claude Code** and **opencode** from one set of sources.

| If you want to… | Read |
|---|---|
| Install on Claude Code | [`setup-claude.md`](setup-claude.md) |
| Install on opencode | [`setup-opencode.md`](setup-opencode.md) |
| Understand source → CLI translation | [`mapping.md`](mapping.md) |
| Regenerate the committed `.opencode/` tree | run `make generate-opencode` (gated by `make validate`) |
| Install an MCP server | [`mcp-setup.md`](mcp-setup.md) |
| Check external plugin/skill/MCP support | [`compatibility.md`](compatibility.md) |
| See the skill-body CLI-agnosticism audit | [`body-agnosticism-audit.md`](body-agnosticism-audit.md) |
| Understand hook intent → per-CLI binding | [`../../hooks/README.md`](../../hooks/README.md) |

The canonical operating manual is the root [`AGENTS.md`](../../AGENTS.md) (CLI-agnostic); `CLAUDE.md`
is a thin pointer to it. Versions on both CLIs derive from the root `VERSION` file.
