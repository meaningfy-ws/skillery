> Derived from EPIC dual-cli-generator (depends on support-opencode-cli)

## 1. Generator scaffold

- [x] 1.1 Create Python package `tools/opencode_gen/` (pure functions + thin `__main__`, mirroring `tools/repo_lint`)
- [x] 1.2 Pin opencode version in `.opencode-version`; read it in the generator (spec: Pinned opencode version)
- [x] 1.3 Create committed paths (`.opencode/`, `opencode.json`); verify `agents`/`commands` spelling against the pinned version (design Open Questions)
- [x] 1.4 Deterministic emit primitives (sorted keys, fixed order, no timestamps) (spec: Deterministic output)

## 2. Source readers & ledger

- [x] 2.1 Parse `marketplace.json` into bundle→artifact membership (spec: Bundle grouping)
- [x] 2.2 Enumerate `skills/`, `agents/`, non-opsx commands
- [x] 2.3 Define `Gap(source, cli, reason)` and a per-artifact parity ledger {claude, opencode, gap} (spec: Parity gate; design D6)

## 3. Mappers

- [x] 3.1 Skill passthrough, validating opencode-required frontmatter (spec: Generation traces to source; design D1)
- [x] 3.2 Agent map: model-alias lookup, tool-name map, `tools`/`disallowedTools`→`permission`, invocation-name; unmappable→Gap (spec: Agent frontmatter mapping; design D2)
- [x] 3.3 Command map → `.opencode/commands/*.md` with `template`/`$ARGUMENTS`; unrepresentable→Gap (design D3)

## 4. Version & assembly

- [x] 4.1 Write `VERSION` into `marketplace.json` `metadata.version` and the opencode manifest (spec: Version written from VERSION)
- [x] 4.2 Emit the opencode tree: skills, agents, commands, `opencode.json`, bundle manifests
- [x] 4.3 Write committed parity report (per-artifact claude/opencode/gap) (spec: Parity and version-sync gates)
- [x] 4.4 Write committed gap report (spec: Full-parity coverage)
- [x] 4.5 Commit the generated tree

## 5. Gates & make targets

- [x] 5.1 `make` generate target regenerates the opencode tree (spec: Generator and gates are make targets)
- [x] 5.2 Drift check: emit-to-temp + diff vs committed (spec: drift gate; design D5)
- [x] 5.3 Parity check: fail on asymmetric first-party artifact (spec: Parity and version-sync gates)
- [x] 5.4 Version-sync check: fail if any tree's version ≠ `VERSION`
- [x] 5.5 Wire drift + parity + version-sync into `make validate`; extend `tools/repo_lint`

## 6. Tests

- [x] 6.1 Unit tests per mapper incl. gap paths and error matrix (missing frontmatter, unknown alias)
- [x] 6.2 Determinism test: two runs, no diff
- [x] 6.3 Coverage test: every source skill/agent/non-opsx command mapped or gap-recorded
- [x] 6.4 Parity test: asymmetric fixture fails parity; version-mismatch fixture fails version-sync

## Roadmap

- [x] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 3.1 · [ ] 3.2 · [ ] 3.3 · [ ] 4.1 · [ ] 4.2 · [ ] 4.3 · [ ] 4.4 · [ ] 4.5 · [ ] 5.1 · [ ] 5.2 · [ ] 5.3 · [ ] 5.4 · [ ] 5.5 · [ ] 6.1 · [ ] 6.2 · [ ] 6.3 · [ ] 6.4

## Verification

`make validate` passes (lint + tests + drift + parity + version-sync), every spec scenario has covering tests, and `openspec validate --all --strict` accepts the change.
