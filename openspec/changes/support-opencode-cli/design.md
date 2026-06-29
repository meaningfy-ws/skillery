# Design: dual-CLI foundation

## Parent

Derives from EPIC `support-opencode-cli` (`proposal.md`). This change is the foundation and contract; the generator that emits/parity-gates the opencode tree is the dependent change [`dual-cli-generator`](../dual-cli-generator/design.md). Decisions cited from the proposal; requirements owned by `specs/dual-cli-distribution/spec.md`.

## Context (recon)

- No `VERSION` file; version `2.6.1` lives only in `marketplace.json`.
- No committed MCP config (`.mcp.json` absent); MCP is referenced in `CLAUDE.md`/skills but declared in user settings.
- Agents carry `model: opus`, `tools: [Read,…]` (PascalCase), `disallowedTools`, `skills:`, `color:`.
- `AGENTS.md` was a symlink to `CLAUDE.md` (Claude-only paths/rules).
- opencode reads `.opencode/skills/` and natively `.claude/skills/`; reads `AGENTS.md` natively; `openspec update --tools opencode` already emits the `/opsx` spine commands for opencode (so spine commands are out of generator scope — delegated).

## Decisions

- **D1 — Invert canonical/pointer; `AGENTS.md` canonical, `CLAUDE.md` points; no symlink** (DEC-12). One-time content refactor: the CLI-agnostic manual moves to `AGENTS.md` (opencode reads it natively); `CLAUDE.md` becomes "read `AGENTS.md`" + Claude-only addenda (GitNexus rules, `.claude/` paths). Lint asserts the invariant.
- **D2 — Tool-native registration out of the shared surface** (DEC tool-native). Slash-command *registration/invocation* is per-CLI native; only command content/templates derive from a shared source. Recon: no Claude hooks and no first-party slash commands beyond `/opsx` (delegated), so command-mapping is near-empty in practice.
- **D3 — Body-agnosticism audit** (DEC body-agnostic). Recon shows ~4 behavioural skills (`epic-planning`, `spec-stewardship`, `clarity-gate`, `guardrails`) carry `/opsx:`/`.claude/` references; `project-setup` assets carry Claude-flavoured templates (reconciled separately). Audit each body: neutralise CLI-specific operational references or record a cosmetic gap. `Skill tool` has zero body hits.
- **D4 — Hooks: shared intent inventory, two-axis classification, native bindings** (DEC-13). SSOT `hooks/inventory.yaml` (+ `hooks/README.md`) keyed by intent. Schema `intent → {mechanism, phase, binding, source}[]`. **mechanism** = `git`/`ci`/`agent`; **phase** = `quality`/`phase-gate`. **Provenance** = a source skill *or* an imperative MUST/NEVER rule in a binding (e.g. GitNexus "run impact analysis before editing"). Pre-derived in `assets/hooks-inventory.seed.yaml` (56 intents, 66 bindings: 32 git / 13 ci / 21 agent); promoted to `hooks/inventory.yaml`. project-setup projects: shared git/ci config once + agent bindings per targeted CLI.
- **D5 — MCP documented, not generated** (DEC-9, revised). Committing/generating MCP config would leak secrets or encode per-developer environment; instead `docs/dual-cli/mcp-setup.md` shows the Claude `.mcp.json` and opencode `opencode.json` shape per tool (GitNexus, Atlassian, Google, Odoo, Neo4j, MongoDB, Context7) with env-var placeholders, install one-by-one.
- **D6 — External deps + baseline packs: analyse, don't generate** (DEC-11). Committed compatibility matrix `docs/dual-cli/compatibility.md` classifies each external plugin/skill/MCP (native / `.claude/`-compat / unsupported) with per-CLI install path or gap, and identifies each CLI's baseline pack (Claude default/marketplace skills; opencode community pack e.g. opencode-power-pack).

## Decided layout

| Artifact | Committed path |
|---|---|
| Version source | `VERSION` (root) |
| Root binding | `AGENTS.md` (canonical), `CLAUDE.md` (pointer) |
| Hooks inventory | `hooks/inventory.yaml` + `hooks/README.md` |
| MCP setup docs | `docs/dual-cli/mcp-setup.md` |
| Compatibility matrix | `docs/dual-cli/compatibility.md` |
| Per-CLI setup docs | `docs/dual-cli/setup-claude.md`, `docs/dual-cli/setup-opencode.md` |
| opencode tree, `opencode.json`, `.opencode-version` | owned by `dual-cli-generator` |

## Open Questions (apply-time externalities)

- opencode-power-pack contents — resolved during the matrix research (task 4.3).
- opencode's native bundle-install construct, or documentation-only grouping — resolved during task 5.3 against the pinned version.
