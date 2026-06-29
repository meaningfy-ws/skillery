# EPIC: Dual-CLI distribution — one catalogue, parity on Claude Code and opencode

## Appetite

Large. The catalogue must run identically on two CLIs with a verified parity guarantee; that is worth a sustained build. The ceiling is a second hand-maintained copy of any artifact — forbidden by single-source-of-authority, which is what forces the generator + parity-gate design.

## Why

The skillery catalogue (skills, agents, bundles) is authored once but only consumable from Claude Code, because distribution is hard-wired to `.claude-plugin/marketplace.json`. The team also uses **opencode** (sst/opencode). We want one team to reliably use the **same** skills, agents, MCPs, and documentation from **either** CLI — without forking the authoring model or letting the two distributions drift.

## Solution outline

This change is the **foundation**: it establishes the single sources of truth and the dual-CLI contract, and does the non-generator work. Add a root `VERSION` (single version source); invert the root binding so `AGENTS.md` is the canonical CLI-agnostic file and `CLAUDE.md` a thin pointer (DEC-12); single-source the hook intent inventory (DEC-13); document MCP per-tool setup with templates (DEC-9, no committed config); compatibility-analyse external dependencies and baseline packs against opencode's docs into a committed matrix; and split `docs/` per CLI over a shared mapping reference. The **generator** that reads these sources and emits + parity-gates the opencode tree is delivered by the dependent change [`dual-cli-generator`](../archive/2026-06-29-dual-cli-generator/proposal.md); the parity/coverage/mapping decisions below are the contract it implements.

Outcome: a team member installs once on either CLI and reaches every catalogue capability identically; maintainers author one copy; the build refuses to ship drift or asymmetry.

## Key decisions

- **DEC-1**: opencode support is a **generated build artifact** from the existing sources of truth, never a hand-maintained parallel layer. Rationale: single-source-of-authority forbids a second copy of any fact.
- **DEC-2**: Target **full parity** — skills, agents, commands, MCP, and the four bundles map to opencode equivalents or recorded gaps. Rationale: partial port leaves the team unable to use one CLI for real work.
- **DEC-3**: The generator is a **Python** tool in `tools/` (sibling to `tools/repo_lint`), run via `make`; its checks wire into `make validate`. Rationale: matches the repo's toolchain and CI guardrail; no second toolchain.
- **DEC-4**: Coverage bar is **100%-or-reported** — every artifact maps natively or yields an explicit `Gap(source, reason)`; nothing silently dropped.
- **DEC-5**: **Both** distribution trees are **committed in this repo** and verified in sync with source. Rationale: each CLI installs directly from the repo; drift is reviewable in diffs.
- **DEC-6**: Generate against a **single pinned opencode version**, recorded in the repo and bumped deliberately. Rationale: opencode's agent/command/plugin format is still moving.
- **DEC-7**: **Preserve the four bundles** (meaningfy-core / consulting / architecture / building) with identical membership on both CLIs.
- **DEC-8**: **A single root `VERSION` file is the one source of version truth.** `marketplace.json` `metadata.version` and the opencode manifest version are both derived from it; the gate fails if they disagree. Rationale: the team must never see different bundle versions across CLIs.
- **DEC-9** (revised): **MCP is documented per-tool setup, not a generated/committed config.** MCP servers carry secrets and are environment-specific, so the repo ships **reference templates** (`docs/dual-cli/mcp-setup.md`) showing the Claude `.mcp.json` and opencode `opencode.json` shape for each tool (GitNexus, Atlassian/Confluence/Jira, Google Gmail/Drive/Calendar, Odoo, Neo4j, MongoDB, Context7); developers install one by one, locally, with secrets in env vars. No MCP config is committed or generated. Rationale: committing/generating MCP configs would either leak secrets or encode per-developer environment; a documented install-one-by-one section with per-tool templates gives equivalence on both CLIs without either risk.
- **DEC-10**: **Parity is verified, not assumed** — a parity gate asserts every first-party artifact has equivalent Claude and opencode configs at the same VERSION, emitting a committed parity report. Rationale: this verified equivalence *is* the bet.
- **DEC-11**: **First-party vs external boundary.** First-party artifacts (`skills/`, `agents/`, bundles, MCP manifest) are generated with parity. External dependencies (superpowers, gitnexus, atlassian, context7, ponytail, mongodb, …) cannot be generated — they are compatibility-analysed against opencode docs and captured in a committed **compatibility matrix** with per-CLI install guidance and gap records. Rationale: keeps scope finite while still answering "does this work on opencode?".
- **DEC-13**: **Hooks have a shared intent inventory (SSOT), mechanism-classified, with native bindings.** A committed `hooks/` inventory captures each hook *intent* once; entries are classified by mechanism — **git** hooks (commit-msg/pre-commit/pre-push) are CLI-agnostic and share one implementation, while **agent** hooks (e.g. run-on-Stop) keep the same intent but are rendered into each CLI's native binding (Claude settings hooks vs opencode plugin hooks). Setup (project-setup) projects the inventory into a repo: shared git-hook config once, agent-hook bindings per targeted CLI. Rationale: "the hook nature must be the same" is met by a shared intent SSOT, while git's shared nature makes most hooks free and only agent hooks need per-CLI wiring.
- **DEC-12**: **`AGENTS.md` is the canonical root binding; `CLAUDE.md` is a thin pointer; no symlink.** `AGENTS.md` holds the CLI-agnostic operating manual (opencode reads it natively, and it is the cross-tool standard). `CLAUDE.md` is reduced to a thin Binding that instructs the agent to read `AGENTS.md`, carrying only Claude-specific addenda (e.g. GitNexus rules, `.claude/` paths). The existing `AGENTS.md → CLAUDE.md` symlink is removed. Rationale: a symlink ships Claude-only paths/rules to opencode; inverting to an agnostic-canonical + per-CLI-pointer model gives each CLI correct instructions from one source.

## Rabbit-holes

- Don't track unreleased opencode features — one pinned version, recorded.
- Don't attempt bidirectional sync or a runtime shim — one-way generate-on-build, source → both trees.
- The exact field/tool/model mapping tables are design work, deliberately left to design.md.
- Don't try to re-implement external third-party plugins for opencode — analyse and document compatibility only.

## No-gos

- No hand-editing of either generated tree; no CLI-only content lacking a first-party source.
- No changes to skill/agent *bodies* to accommodate opencode (mapping is structural only).
- No runtime/interop layer; build-time generation only.
- No third CLI (Gemini, Codex, Copilot) in this change.
- No committed secrets in any MCP config.

---

## What Changes

- Add a root **`VERSION`** file as the single version source (DEC-8).
- Add a committed **MCP manifest** as the MCP source of truth (DEC-9).
- Add a root `VERSION` as the single version source (DEC-8).
- Invert the root binding: make `AGENTS.md` the canonical CLI-agnostic manual, reduce `CLAUDE.md` to a pointer, remove the symlink (DEC-12).
- Document MCP per-tool setup with reference templates (`docs/dual-cli/mcp-setup.md`); no committed/generated MCP config (DEC-9).
- (Generator, mapping, and parity/drift/version-sync gates → delivered by `dual-cli-generator`.)
- Define the **mapping contract**: skill→both, agent frontmatter→opencode (model-alias, tool-name, permission, invocation-name), command→opencode, MCP→both, bundle→both.
- Add a committed **external-dependency compatibility matrix** (opencode support per external plugin/skill/MCP) with per-CLI install guidance.
- Add a committed **`hooks/` inventory** (SSOT + human-readable table) classifying each hook intent by mechanism (git = shared, agent = native binding) with provenance to the source skill; have setup project it per CLI (DEC-13).
- Restructure `docs/` to **clearly separate opencode setup/config from Claude setup/config** over a shared mapping reference.
- Provide an **easy-install path for each bundle on both CLIs** (Claude marketplace; opencode mechanism per pinned version).

## Capabilities

### New Capabilities
- `dual-cli-distribution`: the foundation and contract for running the catalogue across Claude Code and opencode — the single-`VERSION` rule, the canonical `AGENTS.md`/pointer-`CLAUDE.md` binding, the hook intent inventory, MCP documented per-tool setup, the external-dependency + baseline-pack compatibility matrix, the tool-native boundary, body-agnosticism, and the per-CLI documentation split. (The generation/parity engine is the `dual-cli-generation` capability in `dual-cli-generator`.)

### Modified Capabilities
<!-- Checked openspec/specs/: catalogue-governance governs the Claude authoring/distribution. If specs work shows a governance requirement that must explicitly bless the opencode tree or the VERSION single-source, capture it as a Modified Capability then. -->

## Impact

- **Code**: root `VERSION`; inverted root binding (`AGENTS.md` canonical, `CLAUDE.md` pointer, symlink removed); `hooks/` inventory; `tools/repo_lint` extended for the foundation invariants. (Generator code → `dual-cli-generator`.)
- **Docs**: per-CLI setup split + shared mapping reference + compatibility matrix under `docs/`.
- **CI**: `make validate` gains parity + drift + version-sync checks; build fails on asymmetry or drift.
- **Dependencies**: pin one opencode version; no new runtime deps for the catalogue.
- **Sources of truth unchanged in spirit**: `skills/`/`agents/` bodies untouched; `marketplace.json` version now derived from `VERSION`.
