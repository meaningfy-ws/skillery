# Design: dual-CLI generator

## Parent

Derives from EPIC `dual-cli-generator` (`proposal.md`). Depends on `support-opencode-cli` for the foundation (VERSION, inverted binding, hooks, MCP docs, compatibility matrix) and for the `dual-cli-distribution` capability contract. Decisions DEC-1…DEC-6 owned in the proposal; requirements owned in `specs/dual-cli-generation/spec.md`.

## Context

opencode formats (pinned-version docs): skills `.opencode/skills/<name>/SKILL.md` (also reads `.claude/skills/`); agents `.opencode/agents/<id>.md` (`description`/`mode`/`model`/`permission`/…); commands `.opencode/commands/<name>.md` (`template`+`$ARGUMENTS`); config `opencode.json`. Recon: agents carry `model: opus`, `tools: [Read,…]` (PascalCase), `disallowedTools`, `skills:`, `color:`. `marketplace.json` defines four bundles. Spine `/opsx` commands and MCP are out of scope (delegated / documented).

## Decisions

- **D1 — Skills pass through.** Emit each SKILL.md unchanged into the opencode skill path; validate opencode-required frontmatter only.
- **D2 — Agents generated via table-driven maps** (below); unmappable fields → `Gap`.
- **D3 — Commands**: only non-opsx catalogue commands (currently none — opsx is delegated); emit `.opencode/commands/*.md` with `template`/`$ARGUMENTS`; unrepresentable → `Gap`.
- **D4 — `VERSION` written into `marketplace.json` + opencode manifest**; version-sync gate asserts equality.
- **D5 — Drift gate** = regenerate-to-temp + diff; deterministic output (sorted keys, fixed order, no timestamps).
- **D6 — Parity gate** = per-artifact ledger {claude, opencode, gap}; fail on asymmetry; emit committed parity + gap reports.

## Mapping tables

Agent frontmatter (Claude → opencode):

| Claude | opencode | Rule |
|---|---|---|
| `description` | `description` | copy |
| (wrapper) | `mode` | `subagent` default; `primary` if marked |
| `model: opus` | `model: anthropic/<id>` | alias lookup; unknown → **fail** |
| `tools: [Read,Grep,Bash]` | `permission`/tool allow | tool-name map; no analogue → **gap** |
| `disallowedTools: [Write,Edit]` | `permission: {edit: deny,…}` | map deny; no analogue → **gap** |
| `color` | `color` | copy |
| `skills: [...]` | (global) | no-op |

Model-alias (pinned): `opus`→`anthropic/claude-opus-4-8`, `sonnet`→`anthropic/claude-sonnet-4-6`, `haiku`→`anthropic/claude-haiku-4-5`.
Tool-name: `Read`→`read`, `Edit`→`edit`, `Write`→`write`, `Bash`→`bash`, `Grep`→`grep`, `Glob`→`glob`, `WebFetch`→`webfetch`; `disallowedTools`→`permission:{<cap>:deny}`; no analogue (`NotebookEdit`,`Task`) → gap.
Invocation: `/opsx:<id>` ↔ `opsx-<id>` (registration is native; only content/templates derive from source).

**Anti-patterns:** editing a body on emit (D1 forbids); inventing a `permission` with no analogue (gap instead); non-deterministic output (kills drift gate); reading the generated tree as input; committing a literal secret.

## Error matrix

| Failure | Handling |
|---|---|
| Skill missing `name`/`description` | Fail loudly, name file |
| Unknown model alias | Fail with "unknown alias" |
| Agent field with no analogue | Emit closest + `Gap` |
| `VERSION` disagrees with a tree | Version-sync gate fails |
| First-party artifact asymmetric | Parity gate fails |
| Committed tree drifted | Drift gate fails |
| opencode format changed | Out of scope until version re-pinned |

## Risks / Trade-offs

- **[opencode churn]** → pinned version in `.opencode-version`; gates guarantee source↔tree, not tree↔runtime.
- **[lossy permission mapping]** → gap-record, surfaced in the gap report.
- **[committed tree inflates diffs]** → deterministic output keeps diffs minimal.

## Open Questions

- Exact opencode **version value** (apply-time; recorded in `.opencode-version`).
- `agents`/`commands` vs `agent`/`command` path spelling — verify against the pinned version before emitting.
