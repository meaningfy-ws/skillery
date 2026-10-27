# EPIC: Make the skillery marketplace install on Claude Desktop

> **Golden thread.** Parent: the durable capability
> [`dual-cli-distribution`](../../specs/dual-cli-distribution/spec.md) — its requirement that Claude
> bundles reach skills through `bundles/<bundle>/` — and the failure recorded in
> [`inputs/2026-10-27-diagnosis.md`](inputs/2026-10-27-diagnosis.md).
> **Follows:** #103 (`fix/bundles-real-copies`), which removed the symlinks without fixing Desktop.

## Appetite

**Small.** A spike of up to three throwaway branches added in Desktop by hand, then one generator
change and a patch release. If no variant syncs after the three, stop and escalate to Anthropic
support with the evidence instead of guessing further.

## Why

Since v3.0.0 nobody can add `meaningfy-ws/skillery` in Claude Desktop: claude.ai answers "Marketplace
sync failed" and logs nothing locally. The Claude Code CLI installs the same repo fine, so CLI users
see no problem and Desktop users get no catalogue. #103 assumed symlinks were the cause; removing them
did not help. The real difference from the last working layout (v2.10) is that each plugin now lives
in its own folder **without a `.claude-plugin/plugin.json`**, which every Anthropic subfolder plugin
has.

## Solution outline

Separate the two confounded variables — symlinks and the missing `plugin.json` — by testing candidate
layouts in Desktop, one at a time, on spike branches. Adopt the first one that syncs and installs,
generate it from `make bundles`, and release it.

Candidates, in test order:

- **C — symlinked bundles + `plugin.json`** (tested first, at the human's request). The v3.0 tree
  (`bundles/<b>/skills/<s> -> ../../../skills/<s>`) plus a generated
  `bundles/<b>/.claude-plugin/plugin.json`. If it syncs, symlinks were never the problem and the
  `bundles/` copies can go back to links (no duplicated skill text in git).
- **A — real copies + `plugin.json`.** Today's tree plus the same `plugin.json`. Smallest change from
  `develop`.
- **B — 2.10 root layout.** `source: "./"`, `strict: false`, skills/agents listed per entry in
  `marketplace.json`; Claude stops using `bundles/`. Known to have worked, matches `anthropics/skills`.
- **H — angle brackets** (only if A, B and C all fail): strip `<`/`>` from the three vault skill
  descriptions and retest the best layout.

## Key decisions

- **DEC-1: Test before building.** Each candidate is first a hand-assembled spike branch added in
  Desktop; the generator changes only for the winner. Rationale: the failure is server-side and
  silent; only Desktop can tell us.
- **DEC-2: Order is C → A → B, stop at the first pass.** C first by the human's call: it answers the
  open question #103 left (are symlinks really rejected?) and, if it passes, gives the leanest repo.
- **DEC-3: Pass means sync *and* install.** The marketplace adds, all six plugins appear, and
  installing `meaningfy-core` shows its skills in a Desktop chat. Sync alone is not enough — Desktop
  may accept a symlink at sync time and drop its content at install time.
- **DEC-4: Spike channel.** Add `https://github.com/meaningfy-ws/skillery.git#<spike-branch>` in
  Desktop. If Desktop refuses a ref, push the spike tree to a throwaway public repo under the
  `meaningfy-ws` org and delete it after.
- **DEC-5: The CLI and opencode must keep working.** Whatever wins must still pass
  `claude plugin validate`, a CLI `marketplace add` + install, and `npm run test:opencode-installer`.
  A layout that fixes Desktop by breaking the CLI is a fail.
- **DEC-6: The durable spec follows the evidence.** If C wins, the "no symlinks" clause and its
  scenario in `dual-cli-distribution` are reversed; if A or B wins, the clause stays and gains the
  `plugin.json` (A) or root-layout (B) requirement. The delta spec is written after the spike, not
  before.

- **DEC-7 (re-shape, 2026-10-27): C is built into `develop` to be tested.** The human reports that
  Desktop reads only the repository's default branch (`develop`), so DEC-4's `#ref` spike channel
  does not work. C is therefore implemented in the generator and merged to `develop` *as* the Desktop
  test; if it fails, the next variant replaces it the same way. Supersedes DEC-1's "spike before
  generator" for C only.

## Rabbit-holes

- Reverse-engineering claude.ai's sync. We test layouts; we don't hunt for its source.
- The `openspec/schemas/meaningfy` symlink on `releases`. Out of `bundles/`, not referenced by any
  plugin; only touch it if a spike points at it.
- Making `plugin.json` rich (keywords, homepage, MCP). Name, version, description, author only.

## No-gos

- No change to which skills/agents are in which bundle, or to bundle names.
- No change to the opencode install path beyond what the winning layout forces.
- No new release tooling; the fix ships through the existing `meaningfy-release` flow as v3.3.2.
- No Desktop-only fork of the marketplace (one `marketplace.json` serves both).

---

## What Changes

- `tools/bundle_gen` renders `bundles/<b>/.claude-plugin/plugin.json` (C, A) **or** a root-layout
  `marketplace.json` (B); its drift gate learns the new files.
- If C wins: `bundles/` returns to symlinks; the no-symlink gate is narrowed. **BREAKING** for
  nobody (install ids unchanged).
- `docs/environment/dual-cli/` and `docs/development/releasing.md` record the Desktop constraint.
- CHANGELOG line for installers; release v3.3.2.

## Capabilities

### New Capabilities

### Modified Capabilities
- `dual-cli-distribution`: the bundle-layout requirement (symlink clause, per-bundle manifest) —
  delta written after the spike (DEC-6).

## Impact

`tools/bundle_gen/gen.py` (`render`, `write`, `_link_errors`), `tests/test_bundle_gen.py`, the
committed `bundles/` tree, `.claude-plugin/marketplace.json`, the `releases` branch publish, docs.
