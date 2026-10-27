> Derived from EPIC `fix-desktop-marketplace-install` (proposal.md)

## Context

claude.ai's marketplace sync (used by Claude Desktop) rejects `meaningfy-ws/skillery` with a generic
error; the CLI accepts it. Evidence and layout history: [`inputs/2026-10-27-diagnosis.md`](inputs/2026-10-27-diagnosis.md).
Two variables changed between the last working layout (v2.10) and v3.x — per-folder plugin sources
without `plugin.json`, and (until #103) symlinks — and were never tested apart.

## Goals / Non-Goals

**Goals:** find, by experiment, a layout Desktop syncs and installs (DEC-1, DEC-3); generate it from
`make bundles`; keep CLI and opencode green (DEC-5); ship v3.3.2.
**Non-goals:** see the EPIC's no-gos.

## Decisions

- **D-1 Spike branches are hand-built, not generated.** They live only on `origin` as
  `spike/desktop-<variant>`, never merged, deleted when the EPIC closes. `make validate` is not
  expected to pass on them (the bundle gate flags `plugin.json` as an orphan and symlinks as errors).
- **D-2 `plugin.json` content** is derived from `bundles.yaml` + `VERSION`, identical to the
  marketplace entry: `{"name", "version", "description", "author": {"name": "Meaningfy"}}`. The
  entry's `version` is dropped from `marketplace.json` when `plugin.json` carries it (the validator
  warns on both; `plugin.json` wins).
- **D-3 Spikes branch from `develop` at `e493af2`** so the only difference between spike and baseline
  is the variant under test.

## Algorithm / approach

### Spike procedure (per variant)

1. `git switch -c spike/desktop-<v> develop`; apply the variant (below); commit; push.
2. Locally: `claude plugin validate .` and, with a clean `CLAUDE_CONFIG_DIR`,
   `claude plugin marketplace add ./` and `claude plugin install meaningfy-core@meaningfy-skillery`.
   Record pass/fail and any symlink warning.
3. Human, in Desktop: remove any earlier skillery marketplace; add
   `https://github.com/meaningfy-ws/skillery.git#spike/desktop-<v>`. If the ref is refused, use the
   throwaway repo (DEC-4).
4. Human: install `meaningfy-core`; in a new chat ask "what skills do you have from meaningfy-core?" —
   expect `technical-writing`, `guardrails` among them.
5. Record in `inputs/spike-results.md`: variant, branch SHA, CLI result, Desktop sync result, Desktop
   install result, exact Desktop error text, timestamp.

### Variants

**C — symlinks + plugin.json** (first):
```
bundles/meaningfy-core/
  .claude-plugin/plugin.json
  skills/technical-writing -> ../../../skills/technical-writing
  ...
```
Build: for each bundle in `bundles.yaml`, replace each copied skill/agent with a relative symlink to
its source (the v3.2.0 tree shape: `git ls-tree v3.2.0 bundles`), then write `plugin.json`.

**A — copies + plugin.json:** `develop` tree + the same `plugin.json` files.

**B — root layout:** `marketplace.json` entries become
`{"name", "description", "source": "./", "strict": false, "skills": ["./skills/<s>", ...], "agents": ["./agents/<a>.md", ...]}`
from `bundles.yaml` (the v2.11.0 shape); `bundles/` untouched (Claude ignores it).

**H — angle brackets:** on the best-scoring layout, replace `<note>`/`<project>`/`<name>` with
`NOTE`/`PROJECT`/`NAME` in the three vault descriptions.

### Decision table after the spike

| C | A | B | Adopt | Spec delta (DEC-6) |
|---|---|---|---|---|
| pass | – | – | C | reverse "no symlinks" for `bundles/`; add per-bundle `plugin.json` |
| fail | pass | – | A | keep "no symlinks"; add per-bundle `plugin.json` |
| fail | fail | pass | B | keep "no symlinks"; Claude sources are the repo root, `bundles/` is opencode-only or removed |
| fail | fail | fail | try H, then escalate | none until cause known |

### Anti-patterns

- ❌ Changing the generator before a variant passes in Desktop.
- ❌ Calling sync success a pass without the install + chat check (DEC-3).
- ❌ Testing two variables in one spike (e.g. C + H together).
- ❌ Leaving spike branches or the throwaway repo behind after the EPIC.

## Error matrix

| Failure | Handling |
|---|---|
| Desktop refuses `#ref` URL | Throwaway public repo (DEC-4); note it in results |
| Desktop syncs but plugin installs empty (symlinks dropped) | Variant fails (DEC-3); move to next |
| CLI install fails on a variant that passes Desktop | Variant fails (DEC-5) |
| Desktop caches the earlier failed marketplace | Remove marketplace, restart Desktop, retry once |
| All variants fail | Run H; if still failing, open an Anthropic support ticket with `spike-results.md` |

## Risks / Trade-offs

- [C passes sync but a later Desktop release stops following links] → keep the copy-mode generator
  path behind one switch until a release has run on links for a cycle.
- [B duplicates skill paths in `marketplace.json`] → generated from `bundles.yaml`, never hand-edited.
- [Human-in-the-loop test is slow] → three spikes are pushed together; the human tests in order.

## Open Questions

- Does Desktop accept `owner/repo#ref` or a `.git#ref` URL? Answered by spike step 3.
- Does claude.ai expose the real sync error anywhere (web devtools network tab)? Human may check
  during the C spike; record it if found.
