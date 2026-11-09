# Mods — the developer guide

A **mod** is the fifth artifact type (see [`governance.md`](governance.md)): a Claude Code hooks
module that watches session events, shows state above the prompt and in the status line, runs
commands a person could type, or denies a command. It carries no method. Every rule, threshold and
phase list it uses is a data file in the skill that owns it, read at run time.

A mod is a hooks module in one of two forms. An **engine `modules` mod** has a `hooks.json` that
names `modules`, plus `config.json`, `types.d.ts` and `register.tsx`. A **plain command-hooks mod**
has only a `hooks.json` with command hooks, and whatever scripts it runs.

skillery has two mods. `navigator` is the modules mod; people install it through the
`meaningfy-navigator` bundle, and the user guide is
[`docs/environment/navigator.md`](../environment/navigator.md). `no-poll-loops` is the plain one:
a `PreToolUse` hook on `Bash` that runs `no-poll-loops.mjs` and denies a sleep loop (exit 2 with a
message); `meaningfy-core` carries it, and `tools/opencode-plugin.mjs` calls the same `check` on
opencode. This page is for whoever changes them; the sections below describe the modules form. The design it follows is the PLAN of the `navigator` change
(`openspec/changes/navigator/design.md`); this page points to it and does not restate it.

## Structure

```
mods/navigator/
  hooks.json      {"hooks": {}, "modules": ["./register.tsx"]}
  config.json     the settings, rendered into the bundle's plugin.json as userConfig
  types.d.ts      the $.state contract (interface PluginState); self-contained, no imports
  register.tsx    the hooks: events → signals → reduce → state; draws
  io.ts           register.tsx's I/O half (files, git, the engine), no decisions
  tsconfig.json   strict type check of lib/
  lib/*.ts        pure functions, no I/O, tested by the *.test.ts beside them (process-drift.ts
                  through phase.test.ts, as it runs)
```

The split is the whole testing strategy. `register.tsx` and `io.ts` pass `$` only to functions
declared at the top of a file (an engine rule). It reads files, runs git and hooks events; it
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
- `.claude-plugin/plugin.json` — with `hooks` taken from the mod, and `types` and `userConfig`
  when the mod has a `types.d.ts` and a `config.json`.

The generator requires `hooks.json` of every mod, and `config.json`, `types.d.ts` and
`register.tsx` only when `hooks.json` names `modules`. Only `navigator` gets `data/`. A mod's
`*.test.mjs` and `*.test.ts` do not ship.

The mod reads its data only under `${plugin root}/data/`, which is the same path in development and
after install. A bundle that holds only mods is left out of the opencode catalogue: mods are
Claude Code only, a recorded gap in
[`docs/environment/dual-cli/compatibility.md`](../environment/dual-cli/compatibility.md).

## Workflow files

A workflow file is JSON: the phases of one activity, the skill that owns each phase, the skills
expected to run (`by: "commit"` or `by: "exit"`), the gates, and, for epic-delivery, the review set
per appetite. The schema is the `Workflow` type in
[`mods/navigator/types.d.ts`](../../mods/navigator/types.d.ts); its one validator is
[`lib/workflow.ts`](../../mods/navigator/lib/workflow.ts) (`parseWorkflow`,
`resolveWorkflows`), which the TC-16 test runs on every
`skills/*/assets/workflows/*.workflow.json`, so a misspelt skill name fails `make validate`. A name
may be a `skills/` folder, an `agents/` file, or an external skill listed in the `skills: [a, b]`
list of its entry in [`dependencies.yaml`](../../dependencies.yaml).

Repository overrides live in `<repo>/docs/navigator/*.workflow.json` and are resolved over the
defaults at session start (see [`workflows.md`](workflows.md#workflow-files)). A malformed one is
shown as a warning naming the file, and the default stays in force. Only a repository file may say
`"mode"` or `"extends"`.

`lib/phase.ts` places the active workflow, variant and phase; `lib/process-drift.ts` raises the
process-drift warnings PD-1 to PD-5 and keeps the gate states; each check module mints the keys of
its own prefix (`process:`, `plan:`, `hygiene:`), and `process-drift.ts` says which are open; design
decisions DD-36 and DD-38 record how they read the file.

### Adding a check

1. Name the rule in the skill that owns it; the mod only applies it.
2. If it needs data, add a field to the workflow schema in `lib/workflow.ts` (and design §4.1) and
   fill it in the owning skill's file.
3. Write the check as a pure function in `lib/` with its test, give its warning a key
   `<prefix>:<what>:...` in its module's prefix, a `remedy` (the command that puts it right, or
   `null`) and the owning skill.
4. Call it from `reduce` in `lib/state.ts` for the signal that triggers it (or from `lib/lean.ts`
   for a subagent or hygiene check), or from `navigate` in
   `lib/phase.ts` when it runs at a phase boundary (leaving or entering).

### Adding an action

An action is a command a person could type (DEC-6). Add a pure function in `lib/actions.ts` that
returns the command line; `register.tsx` resolves it against the installed commands
(`commandFor`) and submits it as typed, or toasts that it is not installed. Draw its button in the
`ui.render` hook only when the function returns something.

### Adding a strict rule

1. Add the intent to [`hooks.yaml`](../../hooks.yaml) with a `mod` binding (`phase-gate` or
   `quality`) and the owning skill as provenance.
2. Add an entry with the same `id` to `STRICT_RULES` in `lib/strict.ts` and a pure decision
   function beside it that returns `allow`, `deny` (through `denyText`, which names every way out)
   or a rewrite; test it. The lint check `mod_bindings_match` fails until both sides agree.
3. Ask it from the hook in `register.tsx` *before* `next(e)`; a throw there falls through to
   `next(e)`, so a broken rule allows (DD-11).

## Events and signals

`register.tsx` turns engine events into signals (design §5); `reduce` in `lib/state.ts` applies
them, then `lib/lean.ts` feeds the subagent and hygiene checks.

| Event | Signal(s) |
|---|---|
| `session.start`, a `clear`/`resume`/`branch` to a new session | `Started`, `ThresholdsRead`, `WorkflowsRead`, `ChangeRead`, `AcceptedRead` |
| `skill.prompt` | `SkillLoaded` |
| `tool.call` Bash (after it ran; strict decides before) | `ToolRan` |
| `tool.call` by a subagent, any tool | `AgentCalled` |
| `tool.call` Edit, Write, NotebookEdit | `FileTouched` |
| `prompt.submit` (typed or Remote Control) | `UserPrompted` |
| `agent.spawn` (not a resume) | `SpawnAsked` before it runs (strict decides then), `SubagentSpawned` after |
| `turn.complete` of a subagent | `SubagentFinished` |
| `turn.complete` of the main loop | `AnswerShown`, `ChangeRead`, `AcceptedRead`, `PlanRead`, `TurnEnded`, `SetPending` (Reconcile's second step) |
| `session.compact` | `Compacted` |
| `/navigator …` and the band's buttons | `SetBand`, `SetLine`, `SetMode`, `Accepted`, `SetPending`, `ToolRan` (Validate) |
| `prompt.compose` (strict) | none: adds the phase reminder |

## Checks

- `make mods` (part of `make validate`) runs the `lib/` unit tests and each mod's `*.test.mjs` with
  Node's test runner and type-checks the mods that have a `tsconfig.json` with `tsc`; `register.tsx` and `io.ts` need the engine's types, so they are
  type-checked by hand check H-5.
- By hand, after a change to `register.tsx`: `claude plugin validate bundles/meaningfy-navigator`,
  then `claude --plugin-dir bundles/meaningfy-navigator` in this repo, and check the status line
  and the band on the terminal. On the desktop app, install the bundle from the working-copy
  marketplace and check the same. The checks and their results are recorded under the change's
  `evidence/` folder.
