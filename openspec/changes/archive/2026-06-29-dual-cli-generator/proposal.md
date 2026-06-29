# EPIC: dual-CLI generator — emit & parity-gate both trees from source

## Appetite

Large. A Python generator plus parity/drift/version-sync gates is the engine that makes the dual-CLI promise verifiable; it is worth a sustained build. Ceiling: a second hand-maintained tree — forbidden by single-source-of-authority, which is what forces generation.

## Why

[`support-opencode-cli`](../support-opencode-cli/proposal.md) established the foundation — `VERSION`, the inverted `AGENTS.md`/`CLAUDE.md` binding, the hooks inventory, MCP setup docs, and the per-CLI documentation split. What it does **not** do is *produce* the opencode distribution or *verify* parity. This change builds the generator that reads the single sources of truth and emits both committed trees, with drift, parity, and version-sync gates wired into `make validate`.

## Solution outline

A Python tool in `tools/` reads `skills/`, `agents/`, `marketplace.json`, and `VERSION`, and emits the opencode tree (`.opencode/` + `opencode.json`) deterministically, mapping each first-party skill, agent, and (non-opsx) command to a native opencode equivalent or a recorded gap. It writes `VERSION` into `marketplace.json` and the opencode manifest. A per-artifact ledger drives a committed parity report and gap report. Three gates fail the build on asymmetry: **drift** (committed tree ≠ regenerated), **parity** (an artifact lacks an equivalent or gap on one CLI), **version-sync** (a tree's version ≠ `VERSION`). MCP is out of scope here (documented setup, per `support-opencode-cli` DEC-9). Spine `/opsx` commands are out of scope (delegated to `openspec update --tools opencode`).

Outcome: regenerating from unchanged source is a no-op; any drift or asymmetry fails `make validate`.

## Key decisions

- **DEC-1**: Generator is **Python** in `tools/` (sibling to `tools/repo_lint`), run via `make`; gates wire into `make validate`. Rationale: matches the repo toolchain; no second toolchain.
- **DEC-2**: Output is **deterministic** (sorted keys, fixed ordering, no timestamps) so drift diffs are meaningful.
- **DEC-3**: Coverage bar **100%-or-reported** — every artifact maps natively or yields a `Gap(source, cli, reason)`; nothing silently dropped.
- **DEC-4**: **Parity is a distinct gate** from drift — a per-artifact ledger asserts every first-party artifact has equivalent Claude and opencode configs at the same `VERSION`.
- **DEC-5**: Target a **single pinned opencode version**, recorded in `.opencode-version`; verify path/format ambiguities (`agents`/`commands` spelling) against it before emitting.
- **DEC-6**: **Mapping is structural only** — skill bodies pass through unchanged (body-agnosticism is owned by `support-opencode-cli`); only frontmatter/registration is mapped.

## Rabbit-holes

- Don't re-map MCP or `/opsx` commands — both are out of scope by the decisions above.
- Don't track unreleased opencode features — one pinned version.
- Don't hand-edit either tree — generation only.

## No-gos

- No changes to skill/agent *bodies*.
- No committed secrets.
- No third CLI.
- No runtime/interop layer.

---

## What Changes

- Add Python generator `tools/<opencode-generator>/`; emit `.opencode/` (skills, agents, commands), `opencode.json`, bundle manifests; write committed parity + gap reports.
- Write `VERSION` into `marketplace.json` and the opencode manifest; record pinned opencode version in `.opencode-version`.
- Add `make` generate target; wire drift + parity + version-sync into `make validate`; extend `tools/repo_lint`.
- Add generator tests (mappers, gaps, error matrix, determinism, coverage, parity).

## Capabilities

### New Capabilities
- `dual-cli-generation`: producing the opencode tree from source with mapping (skills, agents, commands, bundles), the 100%-or-reported coverage rule, deterministic output, and the drift/parity/version-sync gates.

### Modified Capabilities
<!-- None. Depends on the dual-cli-distribution capability owned by support-opencode-cli; this change references that contract and does not modify its requirements. -->

## Impact

- **Depends on**: `support-opencode-cli` (VERSION, inverted binding, hooks, MCP docs, compatibility matrix).
- **Code**: new generator package; committed `.opencode/` tree, `opencode.json`, `.opencode-version`, parity/gap reports; `Makefile` + `validate` wiring; `tools/repo_lint` extended.
- **CI**: `make validate` gains drift + parity + version-sync.
