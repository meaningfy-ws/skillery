# Setup — Claude Code

Install the skillery catalogue on Claude Code. You do **not** need to read the opencode page —
follow this one end to end. The source→CLI contract is in [`mapping.md`](mapping.md).

## 1. Install bundles (marketplace)

The catalogue ships as the `meaningfy-skillery` marketplace with four role bundles. Install the
bundle(s) for your role:

| Bundle | For | Skills |
|---|---|---|
| `meaningfy-core` | everyone (writing, git, release) | 4 |
| `meaningfy-consulting` | consulting / proposals / decisions | 5 |
| `meaningfy-architecture` | architecture / modelling | 2 |
| `meaningfy-building` | building / spine / review | 9 |

```bash
# add the marketplace, then install a bundle
/plugin marketplace add meaningfy-ws/skillery
/plugin install meaningfy-core@meaningfy-skillery
/plugin install meaningfy-building@meaningfy-skillery   # add the bundles you need
```

Each bundle pins the same `VERSION` (currently `2.6.1`, from the root `VERSION` file). Skills and
agents land where Claude Code loads them; you can also drop skills into `.claude/skills/` directly.

## 2. Root binding

`CLAUDE.md` is a thin pointer that tells the agent to read `AGENTS.md` (the canonical, CLI-agnostic
operating manual) and adds Claude-only addenda (GitNexus rules, `.claude/` paths). Nothing to do —
both files ship in the repo.

## 3. MCP servers

Install the servers you use, one by one, with secrets in environment variables. Templates and the
per-tool `.mcp.json` shapes are in [`mcp-setup.md`](mcp-setup.md). No MCP config is committed.

## 4. Spine commands

The `/opsx:*` workflow commands install with the spine:

```bash
openspec update --tools claude    # registers /opsx:propose, /opsx:apply, … for Claude
```

## 5. Hooks (optional, via project-setup)

When you scaffold a repo with `project-setup`, it writes the shared git/CI hooks once and the Claude
agent-hook bindings (`settings.json`). The intent inventory and binding shapes are in
[`../../hooks/README.md`](../../hooks/README.md) and [`../../hooks/bindings.md`](../../hooks/bindings.md).

## Pinned versions & gaps

- Catalogue version: `VERSION` → `2.6.1`.
- No Claude-side capability gaps. The only recorded cross-CLI gap (`persist-before-compaction` on
  opencode) does not affect Claude. Full list: [`compatibility.md`](compatibility.md).
