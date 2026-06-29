# Setup — opencode

Install the skillery catalogue on opencode (sst/opencode). Follow this page end to end — you do
**not** need the Claude page. The source→CLI contract is in [`mapping.md`](mapping.md).

> Pinned opencode version: `.opencode-version` (established by the `dual-cli-generator` change).
> These instructions target opencode's documented config schema: `.opencode/skills`,
> `.opencode/agents`, `.opencode/commands`, and `opencode.json` `mcp`. Re-confirm on each version bump.

## 1. Install bundles

opencode reads skills from **both** `.opencode/skills/` and `.claude/skills/` natively, and the
generator emits the `.opencode/` tree for each bundle at the same `VERSION`. Two install paths:

- **opencode community pack** — install the bundle via opencode's plugin mechanism (the
  `opencode-power-pack` registry is the assumed community baseline; confirm membership at the pinned
  version).
- **Direct** — point opencode at the repo's `.opencode/` tree (or the `.claude/skills/` it reads
  natively) for the bundle's skills and agents.

| Bundle | For | Skills |
|---|---|---|
| `meaningfy-core` | everyone | 4 |
| `meaningfy-consulting` | consulting | 5 |
| `meaningfy-architecture` | architecture / modelling | 2 |
| `meaningfy-building` | building / spine / review | 9 |

Every bundle carries the same membership and `VERSION` as on Claude (`2.6.1`) — that parity is
gate-enforced by the generator.

## 2. Root binding

opencode reads **`AGENTS.md`** natively — it is the canonical, CLI-agnostic operating manual. No
pointer file needed; `CLAUDE.md` is irrelevant on opencode.

## 3. MCP servers

Install per tool into `opencode.json` under `mcp`, secrets in environment variables. The per-tool
opencode shapes are in [`mcp-setup.md`](mcp-setup.md). Every referenced MCP server's transport maps
to opencode (see [`compatibility.md`](compatibility.md)). No MCP config is committed.

## 4. Spine commands

```bash
openspec update --tools opencode    # registers opsx-propose, opsx-apply, … for opencode
```

The spine commands are **delegated** to this step — they are not part of the generated tree. The
`/opsx:<id>` form on Claude is `opsx-<id>` here.

## 5. Hooks (optional, via project-setup)

`project-setup` writes the shared git/CI hooks once (identical to Claude) and the **opencode**
agent-hook bindings as plugins under `.opencode/plugin/`. Intent inventory and binding shapes:
[`../../hooks/README.md`](../../hooks/README.md), [`../../hooks/bindings.md`](../../hooks/bindings.md).

## Pinned versions & gaps

- Catalogue version: `VERSION` → `2.6.1`; opencode version: `.opencode-version` (generator change).
- Recorded gaps on opencode:
  - `persist-before-compaction` — no `PreCompact` event; degrades to a `session.idle` binding.
  - Slash-command registration form differs by design (`opsx-<id>`) — tool-native, not a gap.
  Full matrix: [`compatibility.md`](compatibility.md).
