> Derived from EPIC support-opencode-cli
> Foundation only — the generator/parity/drift build lives in the `dual-cli-generator` change.

## 1. Sources of truth

- [x] 1.1 Add root `VERSION` file; set it to current `2.6.1` (spec: Single version source)
- [x] 1.3 Write MCP per-tool setup docs `docs/dual-cli/mcp-setup.md` (Claude + opencode templates, env-var placeholders, install one-by-one) — no committed/generated MCP config (spec: MCP documented per-tool setup)

## 2. Root binding & hooks

- [x] 2.1 Invert root binding: remove the `AGENTS.md`→`CLAUDE.md` symlink, `AGENTS.md` canonical CLI-agnostic, `CLAUDE.md` thin pointer + Claude-only addenda (spec: AGENTS.md canonical, CLAUDE.md pointer, no symlink)
- [x] 2.2 Promote the hooks seed into `hooks/inventory.yaml` (56 intents, 66 bindings); confirm provenance per entry (spec: Hook intent inventory)
- [x] 2.3 Add `hooks/README.md` human-readable table, visible in repo structure (spec: inventory visible)
- [ ] 2.4 Provide the shared git-hook implementation (manager config) for git-mechanism intents (spec: git hooks share one implementation)
- [ ] 2.5 Provide agent-hook bindings per CLI (Claude settings hooks; opencode plugin hooks) for agent-mechanism intents (spec: agent hooks share intent, not binding)
- [ ] 2.6 Have project-setup project the inventory into a repo per targeted CLI (spec: Setup projects hooks per CLI)

## 3. Body agnosticism

- [ ] 3.1 Body-agnosticism audit: scan every skill body; neutralise `/opsx:`/`.claude/` operational references or gap-record them (spec: Skill bodies are CLI-agnostic)

## 4. External compatibility

- [ ] 4.1 Enumerate every external plugin/skill/MCP the catalogue references
- [ ] 4.2 Classify each against pinned-version opencode docs (native / `.claude/`-compat / unsupported); record per-CLI install path or gap (spec: Compatibility matrix)
- [ ] 4.3 Identify each CLI's baseline pack (Claude default/marketplace skills; opencode community pack e.g. opencode-power-pack); match workflow-assumed baseline capabilities per CLI or gap-record (spec: Baseline packs identified per CLI)
- [ ] 4.4 Document the tool-native boundary: hooks + native slash registration are per-CLI, never shared/generated (spec: Tool-native registration stays separate)
- [ ] 4.5 Commit the compatibility matrix `docs/dual-cli/compatibility.md`; `log` anything not yet classified

## 5. Docs & install

- [ ] 5.1 Restructure `docs/dual-cli/` to separate opencode setup/config from Claude setup/config over a shared mapping reference (spec: Per-CLI documentation split)
- [ ] 5.2 Document the pinned opencode version, recorded gaps, and the compatibility-matrix link
- [ ] 5.3 Document each bundle's install path on each CLI — Claude marketplace; opencode per pinned-version mechanism (spec: Each bundle installable on each CLI)
- [ ] 5.4 Document `openspec update --tools opencode` as the spine-command install step

## 6. Foundation validation

- [ ] 6.1 Extend `tools/repo_lint`: assert the AGENTS-canonical / no-symlink invariant, the hooks-inventory shape, and the body-agnosticism check; wire into `make validate`

## Roadmap

- [x] 1.1 · [x] 1.3 · [x] 2.1 · [x] 2.2 · [x] 2.3 · [ ] 2.4 · [ ] 2.5 · [ ] 2.6 · [ ] 3.1 · [ ] 4.1 · [ ] 4.2 · [ ] 4.3 · [ ] 4.4 · [ ] 4.5 · [ ] 5.1 · [ ] 5.2 · [ ] 5.3 · [ ] 5.4 · [ ] 6.1

## Verification

`make validate` passes (lint + tests green, AGENTS/hooks/body invariants enforced), the compatibility matrix and per-CLI docs are committed, and `openspec validate --all --strict` accepts the change. The generator that emits and parity-gates the opencode tree is delivered by `dual-cli-generator`.
