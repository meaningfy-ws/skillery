# Hook bindings — how each mechanism is implemented

[`inventory.yaml`](../../hooks.yaml) is the single source of hook *intent*. This page is the
**binding reference**: how an intent's `mechanism` becomes a concrete artifact, and which
mechanisms are only declared. It points at templates; it does not duplicate the inventory.

The rule the whole design turns on: **one intent, mechanism decides duplication.**
`git` and `ci` bindings are CLI-agnostic — a *single* shared implementation serves both Claude Code
and opencode. `agent` bindings are declared only; the agent-runtime hooks that run are mods
(Claude Code) and the catalogue's plugin (opencode).

## `git` mechanism — one shared implementation

Every `git`-mechanism intent maps to a hook under a **single git-hook manager config**, committed
once at the repo root. The manager is CLI-agnostic by nature — git runs the hook regardless of which
agent CLI is in use, so there is **no per-CLI copy**.

- **Manager:** `pre-commit` (already the Meaningfy default). The shared config is
  [`../skills/project-setup/assets/templates/root/dot-pre-commit-config.yaml`](../../skills/project-setup/assets/templates/root/dot-pre-commit-config.yaml),
  rendered to `.pre-commit-config.yaml` and installed with `pre-commit install`.
- **Trigger → git stage** mapping is read straight from each binding's `trigger`:

  | inventory `trigger` | pre-commit stage |
  |---|---|
  | `commit-msg`, `prepare-commit-msg` | `commit-msg` / `prepare-commit-msg` |
  | `pre-commit` | `pre-commit` (default) |
  | `pre-push` | `pre-push` |
  | `post-merge`, `pre-rebase` | `post-merge` / `pre-rebase` |

- The Meaningfy-specific git intents (`conventional-commits`, `openspec-strict`,
  `validate-precommit`, `spec-link-integrity`, …) are `repo: local` hooks that shell out to the
  existing `make` targets (`make validate`, `openspec validate --all --strict`) — no logic is
  re-implemented in the hook.

**Branch-protection** (`protect-base-branches`) has both a `git` binding (local pre-commit guard)
and a `ci` binding (server-side branch protection); the `ci` half is the authoritative one.

## `ci` mechanism — one shared PR check

`ci`-mechanism intents (`parity-check`, `reference-discipline`, `import-linter-contracts`'s PR half,
the phase-gate reviews) are GitHub Actions jobs that call `make` targets. Shared across CLIs — CI
does not know or care which agent authored the branch. Templates live in
[`../skills/project-setup/assets/templates/ci/`](../../skills/project-setup/assets/templates/ci/)
(`ci.yaml.tmpl` calls `make validate`).

## `agent` mechanism — declared, not projected

`agent`-mechanism intents name an event inside the agent runtime (PreToolUse, PostToolUse, Stop,
SessionStart, …) where a check would belong. They are **declared only**: nothing renders a
`settings.json` hook, a `scripts/hooks/*.sh` script or a `.opencode/plugin/*` file for them, and
`project-setup` does not project them. An `agent` binding records the intent and its trigger so a
later binding has one place to start from.

The agent-runtime hooks that do run ship with the catalogue, as a `mod` (next section) in a bundle
and, for opencode, through the catalogue's plugin.

## `mod` mechanism — a hooks module shipped in a bundle

`mod`-mechanism intents are enforced by a mod's own hooks, not by settings or a git hook. A mod is
a hooks module in one of two forms: engine `modules` (navigator) or plain command hooks
(`no-poll-loops`); [`mods.md`](mods.md) owns both. There are five `mod` intents: the four
`navigator-strict-*` intents (navigator's strict mode, active in a repository whose workflow file
declares `"mode": "strict"`, or in any session switched with `/navigator mode strict`) and
`no-poll-loops`. Each `navigator-strict-*` id equals the `id` of one rule in
`mods/navigator/lib/strict.ts`; `no-poll-loops` is the folder name of a plain mod. The lint check
`mod_bindings_match` keeps each side equal to its intents. Nothing is projected at setup:
installing the bundle is the binding.

opencode has no navigator, a recorded gap in
[`compatibility.md`](../environment/dual-cli/compatibility.md). `no-poll-loops` does run there:
`tools/opencode-plugin.mjs` reuses the mod's `check`, whatever the bundle selection (see
[`mods.md`](mods.md#no-poll-loops)).
