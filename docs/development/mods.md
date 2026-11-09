# Mods — the developer guide

A **mod** is the fifth artifact type (see [`governance.md`](governance.md)): a Claude Code hooks
module that watches session events, shows state above the prompt and in the status line, and runs
commands a person could type. It carries no method. Every rule, threshold and phase list it uses is
a data file in the skill that owns it, read at run time.

skillery has one mod, `navigator`. People install it through the `meaningfy-navigator` bundle; the
user guide is [`docs/environment/navigator.md`](../environment/navigator.md). This page is for
whoever changes it. The design it follows is the PLAN of the `navigator` change
(`openspec/changes/navigator/design.md`); this page points to it and does not restate it.

## Structure

```
mods/navigator/
  hooks.json      {"hooks": {}, "modules": ["./register.tsx"]}
  config.json     the settings, rendered into the bundle's plugin.json as userConfig
  types.d.ts      the $.state contract (interface PluginState); self-contained, no imports
  register.tsx    the only file that touches `$`: events → signals → reduce → state; draws
  tsconfig.json   strict type check of lib/
  lib/*.ts        pure functions, no I/O, each with a *.test.ts beside it
```

The split is the whole testing strategy. `register.tsx` passes `$` only to functions declared at
the top of the file (an engine rule). It reads files, runs git and hooks events; it
turns what it sees into *signals* and hands them to `reduce` in `lib/state.ts`, the only writer of
the state. Everything in `lib/` is plain TypeScript that runs under Node, so `make mods` tests it
without Claude Code.

## State contract

`lib/state.ts` holds `NavState`, the `Signal` union and `reduce(state, signal)`. Each signal has an
id (`tool_use_id`, `agentId`, a turn id); a signal whose id was already seen leaves the state
unchanged, so an event delivered twice is harmless. The whole state is one session atom keyed by
the plugin's name (`meaningfy-navigator.state`). Its types live in `types.d.ts`, which the engine
requires to be self-contained; `lib/state.ts` imports them from there.

## Bundling

A mod is declared in exactly one bundle of [`bundles.yaml`](../../bundles.yaml) under `mods:`,
at most one per bundle. `make bundles` then renders, for that bundle:

- `mods/<name>` — a copy of the mod's folder (the engine refuses a hooks module or a types file
  behind a symlink), compared byte for byte by the gate, so edit `mods/`, never the copy;
- `data/` — symlinks to the skill assets the mod reads (workflow files, session thresholds);
- `.claude-plugin/plugin.json` — with `hooks`, `types` and `userConfig` taken from the mod.

The mod reads its data only under `${plugin root}/data/`, which is the same path in development and
after install. A bundle that holds only mods is left out of the opencode catalogue: mods are
Claude Code only, a recorded gap in
[`docs/environment/dual-cli/compatibility.md`](../environment/dual-cli/compatibility.md).

## Checks

- `make mods` (part of `make validate`) runs the `lib/` unit tests with Node's test runner and
  type-checks the mod with `tsc`.
- By hand, after a change to `register.tsx`: `claude plugin validate bundles/meaningfy-navigator`,
  then `claude --plugin-dir bundles/meaningfy-navigator` in this repo, and check the status line
  and the band on the terminal. On the desktop app, install the bundle from the working-copy
  marketplace and check the same. The checks and their results are recorded under the change's
  `evidence/` folder.
