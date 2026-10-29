# External-dependency & baseline-pack compatibility matrix

**Audience: skillery contributors** — checking or recording whether an external dependency has
opencode support, before referencing it from a skill or bundle. Not install documentation: an
installer following [`setup-claude.md`](setup-claude.md)/[`setup-opencode.md`](setup-opencode.md)
already gets the correct per-CLI command; come here to double-check *why*, or to add a new
dependency's row.

First-party artifacts (`skills/`, `agents/`, every bundle) ship from one source to both CLIs —
they are *not* in this matrix. This page covers the **external boundary**: third-party plugins,
skill-packs, and MCP servers the catalogue references but cannot generate (DEC-11). Each row records
opencode support and a per-CLI install path or a gap.

Status legend:

- **native** — opencode has a first-class equivalent; install via its own mechanism.
- **`.claude/`-compat** — opencode reads the artifact from `.claude/` natively (skills) or the same
  config shape works on both; no port needed.
- **unsupported** — no opencode equivalent at the pinned version → **gap** (with the degradation).
- **UNVERIFIED** — not yet tested on opencode.

The two dependency tables below are generated from [`dependencies.yaml`](../../../dependencies.yaml):
to add or change a row, edit its entry there and run `make skill-inventory`.

> Pinned opencode version: tracked in `.opencode-version`; the installer's agent renderer
> (`renderAgent` in `tools/opencode-bundle-lib.mjs`) targets that version. This matrix targets
> opencode's current documented config schema (`skills/`, `agents/` and `commands/` under
> `.opencode/`, `opencode.json` `mcp`); re-confirm rows on each version bump.

## External skill-packs / plugins

<!-- GENERATED:dependencies:plugins -->
| Dependency | Used by | opencode status | Claude install | opencode install / gap |
|---|---|---|---|---|
| **superpowers** (brainstorming, test-driven-development, systematic-debugging, verification-before-completion, requesting/receiving-code-review, dispatching-parallel-agents, subagent-driven-development) | CLAUDE.md/AGENTS.md routing, epic-planning, guardrails, spec-stewardship | native (own opencode plugin) | plugin marketplace | ships its own opencode plugin — `{"plugin": ["superpowers@git+https://github.com/obra/superpowers.git"]}` in `opencode.json`. Not a `.claude/skills/` copy; see [superpowers' own opencode install doc](https://github.com/obra/superpowers/blob/main/docs/README.opencode.md). |
| **ponytail** (laziness/YAGNI discipline) | project-setup routing, CLAUDE.md | native (own opencode plugin) | plugin marketplace | ships its own opencode plugin — `{"plugin": ["@dietrichgebert/ponytail"]}` in `opencode.json`; `/ponytail` slash form → opencode `ponytail` command (delegated). |
| **stream-coding** (doc-first method) | clarity-gate, cosmic-python (external method) | `.claude/`-compat | plugin / repo skill | it's a single `SKILL.md`, not a package — copy it into `.claude/skills/stream-coding/`; opencode reads that path natively. |
| **commit-commands** (`commit-commands:commit`) | meaningfy-git-workflow | native (command) | plugin command | opencode `.opencode/commands/`; the *content* derives from the shared command source, registration is per-CLI (tool-native boundary). |
| **OpenSpec** (`@fission-ai/openspec`, the spine engine + `/opsx:*`) | the spine (project-setup, epic-planning, spec-stewardship) | native | `npm i -g @fission-ai/openspec`; `openspec update --tools claude` | same npm package; `openspec update --tools opencode` registers `opsx-<id>`. Registration form is tool-native (differs by design), not a gap. |
| **obsidian-skills** (`obsidian@obsidian-skills`: obsidian-markdown, obsidian-bases, obsidian-cli; MIT, [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills)) | every `vault-*` skill (mandatory for `vault-assistant`) | **UNVERIFIED** (plain `SKILL.md` files) | `/plugin marketplace add kepano/obsidian-skills` + `/plugin install obsidian@obsidian-skills` | clone into the user's global opencode skills folder, never into a vault. Gaps for `vault-assistant` on opencode: explicit-only skills are invoked by name (no slash form); vault permission settings **UNVERIFIED** (see `skills/vault-setup/references/permissions-opencode.md`; a 2026-09-15 test run was inconclusive because the opencode provider did not answer). |
| **code-review** (read-only PR-review *runner*) | optional pair for `meaningfy-code-review` | unsupported (Claude plugin) | `/plugin install code-review@claude-plugins-official` | **gap (optional)** — no opencode plugin equivalent; on opencode run the `meaningfy-code-review` skill directly or opencode's native review. The review *checklist* (the skill) works on both CLIs, so no workflow is blocked. |
| **Langfuse** (session traces, read by `rule-steward` for rule usage) | rule-steward (`rules.py stats`) | native (an HTTP API; the CLI does not matter) | set `LANGFUSE_BASE_URL`, `LANGFUSE_PUBLIC_KEY` and `LANGFUSE_SECRET_KEY` on the machine (see `docs/environment/setup.md`) | the same environment variables |
| **Langfuse Claude Code plugin** (records every tool call and turn of a Claude Code session in Langfuse) | rule-steward (the only capture of rule usage; the catalogue ships no hook) | unsupported (no opencode plugin known; opencode sessions are not traced) | install the plugin and point it at the Langfuse server with the same keys | **gap**: none; rule usage from opencode sessions is not monitored |
<!-- /GENERATED -->

> **gitnexus** and **context7** are MCP servers, not skill-packs — both **native** on opencode; see the
> *MCP servers* table below.

## MCP servers

All MCP servers are **documented per-tool setup**, not generated (DEC-9). "native" here means
opencode supports the same transport in `opencode.json` `mcp`; see
[`mcp-setup.md`](mcp-setup.md) for the per-tool templates.

<!-- GENERATED:dependencies:mcp -->
| MCP server | Transport | opencode status | Notes |
|---|---|---|---|
| **GitNexus** | local (stdio) | native | `command[]` in `opencode.json` mcp; identical capability. |
| **Atlassian / Rovo** (Confluence, Jira) | remote (http) | native | `type: remote` + `headers`. |
| **Google Workspace** (Gmail, Drive, Calendar) | remote (OAuth) | native | per-product or gateway endpoint; OAuth identical. |
| **Odoo** | local | native | `odoo-mcp` CLI; env-var credentials. |
| **Neo4j** (per DB) | local | native | one server per database, same on both CLIs. |
| **MongoDB** | local | native | `mongodb-mcp-server`. |
| **Context7** (library docs) | local | native | `@upstash/context7-mcp`. |
| **Slack** | remote | native | interactively-authenticated; may be absent in headless/cron runs on either CLI (documented caveat, not a per-CLI gap). |
| **Miro** | remote | native | interactively-authenticated; may be absent in headless/cron runs on either CLI (documented caveat, not a per-CLI gap). |
<!-- /GENERATED -->

No MCP server is a gap: every referenced server's transport is expressible in `opencode.json`.

## Agent-hook gaps (cross-reference)

The only recorded *capability* gap is on the agent-hook surface, owned by
[`../../../hooks/bindings.md`](../../development/hook-bindings.md):

| Intent | Claude binding | opencode | Gap / degradation |
|---|---|---|---|
| `persist-before-compaction` | `PreCompact` hook | no `PreCompact` equivalent | degrades to `Stop`/`session.idle` binding on opencode. |

One skill also has a recorded monitoring gap, which comes from a missing plugin rather than a hook:

| Skill | Claude Code | opencode | Gap / degradation |
|---|---|---|---|
| `rule-steward` | rule usage is traced by the Langfuse Claude Code plugin | no Langfuse plugin known | opencode sessions can `load`, `cite` and `check` rules, but nothing records them, so rules used only there look unused in the weekly review. |

## Baseline packs per CLI

A "baseline pack" is the set of capabilities a CLI ships or assumes installed, independent of this
catalogue. Workflows that lean on a baseline capability need an equivalent on each CLI.

| Baseline capability assumed | Claude Code | opencode | Match / gap |
|---|---|---|---|
| Default skill/agent loading from `.claude/` | built-in | reads `.claude/` natively + `.opencode/` | match |
| Marketplace/plugin distribution | `.claude-plugin/marketplace.json` | opencode plugin install + community packs (e.g. **opencode-power-pack**) | match (different registry) — bundle install paths in [`setup-claude.md`](setup-claude.md) / [`setup-opencode.md`](setup-opencode.md) |
| Slash-command registration | `/opsx:<id>`, `/<skill>` | `opsx-<id>`, `<command>` | match via tool-native registration (form differs by design) |
| Server tools (web search/fetch) baked into the model | model-side | model-side | match — not a CLI artifact |

`opencode-power-pack` is the assumed opencode community baseline; its exact membership is confirmed
at the pinned version during setup-docs maintenance. Where a workflow assumes a Claude marketplace
skill with no opencode-power-pack equivalent, install the skill directly into `.claude/skills/`
(opencode reads it) — so no baseline capability is left unmatched.

## Tool-native boundary (task 4.4)

Two things are **never** shared or generated identically across CLIs — they are tool-native:

1. **Slash-command registration/invocation** — only the command *content/template* derives from a
   shared source; the registration form is `/opsx:<id>` (Claude) vs `opsx-<id>` (opencode).
2. **Agent-hook bindings** — the *intent* is shared (`hooks.yaml`); the binding is a
   Claude `settings.json` hook vs an opencode plugin handler. See `docs/development/hook-bindings.md`.

Everything else — the root binding (`AGENTS.md`), skill bodies, command content, the hook *intent*
inventory — is single-sourced and shared.
