# Source → CLI mapping reference

**Audience: skillery contributors** — this is the generation contract for the catalogue's *own*
artifacts (skills, agents, commands, hooks), read by whoever adds a skill/agent or maintains
`make bundles` and the opencode installer. It is not install documentation; if you're installing the catalogue, see
[`docs/environment/setup.md`](../setup.md) instead.

One set of sources, two CLIs. This table records *what derives from what* — the contract that
`make bundles` (`tools/bundle_gen`) and the opencode installer (`tools/skillery-opencode.mjs`)
implement, and the reason behind the steps of [`setup-claude.md`](setup-claude.md) and
[`setup-opencode.md`](setup-opencode.md). This page generates nothing.

## Artifact mapping

| Source (authored once) | Claude Code | opencode |
|---|---|---|
| `skills/<name>/SKILL.md` | via the `bundles/<b>/skills/<name>` symlinks of its bundle's marketplace plugin | copied from `skills/` at install (`skillery-opencode install`) — *also* read natively from `.claude/skills/` |
| `agents/<name>.md` | via the `bundles/<b>/agents/<name>.md` symlink of its one bundle | rendered at install from `agents/` + `tools/opencode-catalogue.json` (`--global` / `--project` only) |
| `bundles.yaml` | rendered to `.claude-plugin/marketplace.json` + the `bundles/` symlink tree (`make bundles`) | rendered to `tools/opencode-catalogue.json` (`make bundles`) |
| `tools/opencode-agent-map.json` | — | the agent model/tool/permission tables `renderAgent` reads at install |
| command content | `/opsx:<id>`, `/<name>` (native registration) | `.opencode/commands/<id>.md` (`template` + `$ARGUMENTS`) |
| root binding | `CLAUDE.md` (pointer → `AGENTS.md`) | `AGENTS.md` (read natively) |
| `VERSION` | `marketplace.json` `metadata.version` (`make bundles`) | `tools/opencode-catalogue.json` `version` and `package.json` `version` (`make bundles`) |
| hook *intent* (`hooks/inventory.yaml`) | `settings.json` hooks (agent) + pre-commit/CI (git/ci) | `.opencode/plugin/*` (agent) + the same pre-commit/CI |
| MCP (documented, not generated) | `.mcp.json` `mcpServers` | `opencode.json` `mcp` |

## Frontmatter field mapping (agents)

| Source frontmatter | opencode equivalent |
|---|---|
| `model: opus` | `model: anthropic/claude-opus-4-8` (alias lookup) |
| `tools: [Read, Edit, Bash, …]` (PascalCase) | `tools` / `permission` with lowercased names (`read`, `edit`, `bash`) |
| `disallowedTools: […]` | folded into opencode `permission` (deny) |
| `skills: […]` | not an opencode field; rendered as a load-skills body line (`Load these skills first with the skill tool: …`) |
| `color: yellow` | theme colour via `colors` in `tools/opencode-agent-map.json` (`color: warning`) |
| `metadata: {purpose, area, …}` (catalogue facets) | not rendered, by design: the facets serve the catalogue map and the validator, not the runtime. An intended omission, not a gap |
| `type: delegated` (Claude: a subagent spawned by the caller) | `mode: subagent` (via `agentModes`) |
| `type: lead` (Claude: `claude --agent meaningfy-<bundle>:<name>`; gaps G-1, G-2) | `mode: primary` |
| `type: scheduled` (Claude: an external scheduler runs `claude -p --agent meaningfy-<bundle>:<name> "<trigger prompt>"`; gap G-4) | `mode: subagent` + gap G-5 |
| invocation name `meaningfy-<bundle>:<agent>` | opencode agent name |

`type` itself is never emitted into the opencode file. The per-type contract rules are in
[`spec/agent-template.md`](../../../spec/agent-template.md#types).

**Recorded agent gaps:**

- **G-1** — Claude has no per-file guard against auto-delegation: the main thread can still delegate a
  `lead` agent by its description, where it loses `AskUserQuestion`.
- **G-2** — under `claude --agent`, the agent's `tools` restrict the human's whole session.
- **G-3** — skill preload under `claude --agent` was reported broken (Claude Code 2.1.63 issue, closed
  with no documented outcome); unverified.
- **G-4** — Claude Desktop / Cowork scheduled tasks load skills, not agent files; a `scheduled` agent
  needs an external scheduler.
- **G-5** — opencode has no scheduler: a `scheduled` agent renders as `mode: subagent` with the gap
  "run `opencode run --agent <name>` from an external scheduler".
- **G-6** — a Claude `tools` allowlist is not restrictive on opencode (all tools are enabled by
  default; the rendered `tools` map only switches tools on). Only `disallowedTools`, rendered as
  `permission: deny`, restricts on both CLIs. Follow-up: render the allowlist as permissions.

These tables are the **contract**; their values live only in `tools/opencode-agent-map.json`, and the
opencode installer renders the right-hand column at install time (`make opencode-report` prints the
parity and gap tables). Anything unmappable becomes an explicit `Gap(source, cli, reason)` — never a silent drop.

## What is NOT mapped (tool-native)

Slash-command *registration* and agent-*hook bindings* are per-CLI by design — see the tool-native
boundary in [`compatibility.md`](compatibility.md). Only their content/intent is shared.
