<!-- PLAN (design half). PLAN = this file + tasks.md. Derived 2026-11-08 from the frozen EPIC.
     Decisions settled in the EPIC are cited as DEC-n, never restated. New choices are DD-n (§13). -->

> Derives from: EPIC `navigator` (`proposal.md`, DEC-1..DEC-14, scenarios 1–13). Document type:
> implementation. Acceptance criteria live in `specs/*/spec.md`; this file says how.

## Context

Claude Code 2.1.319 lets a plugin load a hooks module (a *mod*) that hooks engine events, keeps
session state and draws above the prompt. `ponytail` 5.3.3 proves the pattern
(`hooks/claude-band.json` → `hooks/band/register.tsx`, `plugin.json` `hooks` + `types` +
`userConfig`). skillery has four artifact types, renders bundles with `tools/bundle_gen/gen.py`
(symlinks + one `plugin.json` per bundle), holds hook intents in `hooks.yaml` (mechanisms `git`,
`ci`, `agent`, checked by `hooks_inventory_shape` in `tools/repo_lint/lint.py`), and runs
`make validate` = `lint` + `test` (Python only; node runs only in the `validate-spine` and
`opencode-installer` CI jobs).

API facts this design relies on (from the engine's `claude-code.d.ts`, not restated in any skill):

| API | Used for |
|---|---|
| `on('session.start' / 'session.end' / 'session.compact')` | init, board row, hygiene |
| `on('command.run', {command:['clear','resume','branch']})` | re-init after a session move |
| `on('prompt.submit')` (`e.origin.kind`) | idle gap, consent answered |
| `on('prompt.compose')` → `sections` | strict phase reminder |
| `on('skill.prompt')` (`skill`, `frontmatter`) | skill trail |
| `on('agent.spawn')` (`subagentType`, `model?`, `parentModel`, `description`; result `agentId` or `deny`) | subagent list, strict spawn rule |
| `on('turn.complete')` (`agentId?`, `answer`, result `usage`) | subagent tokens, main-turn evaluation |
| `on('tool.call')` (result `deny` / `isError` / `text`) | commits, gates, strict blocks |
| `on('ui.render', {component:'AbovePrompt'})`, `next(e)` stacking | band, coexisting with ponytail |
| `$.ui.status(text)` | pinned status line, one per plugin |
| `$.ui.ask`, `$.ui.toast`, `$.ui.copy` | Accept deviation reason, notices, Copy status |
| `$.command.run({command,args})`, `$.command.list()`, `$.command.register(spec)` | actions, `/navigator` |
| `$.session.usage()` (`context.percent`, `cost`), `$.session.repo()`, `$.session.id()` | hygiene, cost, project |
| `$.process.run`, `$.fs.read/exists/list` | git, openspec, file reads |
| `$.state` / `atom` / `update`, `$.store` | session state; values past the session |
| `$.plugin.root`, register's `options` (= `userConfig` values) | data files; display defaults |

## Goals / Non-Goals

**Goals:** the three stages of the EPIC, in order, each shippable; every EPIC scenario 1–13 has a
spec scenario and a unit test or a hand check (DEC-14).

**Non-Goals:** the EPIC's No-gos, unchanged. Also: no `.feature` file (DD-17), no skill
description change (DD-18), no transcript reading (events cover every fact in §5).

## 1. Repository layout

```
mods/navigator/
  hooks.json            {"hooks": {}, "modules": ["./register.tsx"]}
  config.json           userConfig fields (rendered into plugin.json, DD-5, DD-25)
  types.d.ts            declare module 'claude-code' { interface PluginState { navigator: {...} } }
  register.tsx          the only file that touches `$`: events → signals → reduce → $.state; draws
  statusline.sh         optional snippet for a person's own statusLine script (DD-20)
  tsconfig.json         strict, noEmit, allowImportingTsExtensions; include lib/**
  lib/
    state.ts            NavState, Signal, reduce(state, signal) — the state contract (§3)
    workflow.ts         parseWorkflow, resolveWorkflows (defaults + repo, DD-3) — the schema (§4)
    change.ts           readChange(files) → id, appetite, tasks, groups (§6.1)
    phase.ts            inferPhase(workflow, change, trail) (§6.2)
    process-drift.ts    processDrift(state, workflow) → Warning[] (§6.3)
    dispatch.ts         dispatchWarnings(state, workflow, thresholds) (§6.3 PD-5..PD-8)
    plan-drift.ts       planDrift(change, diff, design, deviations, ignore) → Warning[] (§6.4)
    hygiene.ts          hygieneOffer(state, thresholds) (§6.5)
    strict.ts           STRICT_RULES + decide(event, state) → allow | deny | rewrite (§7)
    actions.ts          ACTIONS + commandFor(action, state, commands) (§8)
    view.ts             lineText(state), bandModel(state) — plain data, no JSX (§9)
    deviations.ts       parse/format deviations.md lines (DD-12)
    *.test.ts           node:test unit tests, one file per module (§11)
```

Only `register.tsx` imports from `claude-code` or uses `$` (DEC-14): every `lib/` function is pure
(input → output, no I/O) and runs under plain Node. `register.tsx` does the I/O (files, git,
`$.process.run`) and passes the results in.

## 2. Bundling (DEC-2, DEC-3)

`bundles.yaml` gains one bundle and one optional key `mods` (DD-4, DD-5):

```yaml
  - name: meaningfy-navigator
    description: "See who runs what and where the work stands in Claude Code: a status line and band over the session, workflow and plan drift warnings, hygiene prompts, and actions that run your own commands (Claude Code only, CLI and desktop)"
    skills: []
    agents: []
    mods: [navigator]
```

`tools/bundle_gen/gen.py` changes (all through `make bundles`, gated by `bundle_gates`):

| Rendered path | Content |
|---|---|
| `bundles/meaningfy-navigator/mods/navigator` | a copy of `mods/navigator`, gated byte-for-byte like the schema copy (DD-31) |
| `bundles/meaningfy-navigator/data/workflows/<name>.workflow.json` | symlink to each `skills/*/assets/workflows/<name>.workflow.json` (DD-2) |
| `bundles/meaningfy-navigator/data/session-thresholds.json` | symlink `../../../skills/guardrails/assets/session-thresholds.json` (DD-9) |
| `bundles/meaningfy-navigator/.claude-plugin/plugin.json` | as today plus `"hooks": ["./mods/navigator/hooks.json"]`, `"types": "./mods/navigator/types.d.ts"`, `"userConfig": <mods/navigator/config.json>` |

Rules enforced by `load()` / `gate_errors()`: `mods` is a list of kebab names; each names a folder
`mods/<m>/` holding `hooks.json`, `types.d.ts`, `config.json`, `register.tsx`; a mod is in exactly
one bundle; a bundle has at most one mod (one `types`, one `userConfig`, DD-5). `unreleased()` also
lists `mods/<m>` in no bundle. `tools/opencode-catalogue.json` omits bundles that hold only mods
(DD-6). The mod reads data only under `${$.plugin.root}/data/` — one path in dev
(`--plugin-dir bundles/meaningfy-navigator`) and installed.

## 3. State contract (`lib/state.ts`)

```ts
type Kind = 'process' | 'plan' | 'hygiene'
type Warning = { key: string; kind: Kind; check: string; message: string;
                 remedy?: ActionId; provenance: string; since: number; accepted: boolean }
type Subagent = { agentId: string; toolUseId: string; type: string; model: string;
                  role: 'reviewer' | 'checker' | 'tester' | 'other'; startedAt: number;
                  tokens: number; toolCalls: number; reportLines: number; done: boolean }
type NavState = {
  version: 1
  change: { id: string; appetite: string | null; done: number; total: number;
            groups: { title: string; done: number; total: number }[]; planMtime: number } | null
  openChanges: number
  workflow: { name: string; variant: string | null; source: 'default' | 'repo'; path: string } | null
  workflowErrors: string[]                 // malformed files, shown as warnings (scenario 7)
  phase: string | null
  mode: { repo: 'loose' | 'strict'; sessionLoose: boolean }
  skills: { name: string; at: number; phase: string | null; turnId: string; toolCallsAfter: number }[]
  subagents: Subagent[]
  gates: Record<string, { state: 'ok' | 'fail' | 'stale' | 'none'; at: number; detail: string }>
  clarity: { score: number | null; planMtime: number } | null
  warnings: Warning[]
  deviations: string[]                     // keys from deviations.md (DD-12)
  hygiene: { contextPercent: number; offer: 'compact' | 'fresh' | null;
             lastSafePointAt: number; lastUserPromptAt: number }
  usage: { tokens: number; usd: number }
  display: { band: 'unfolded' | 'folded' | 'hidden'; line: boolean }
  pending: ActionId | null                 // second half of a chained action (DD-16)
  seen: string[]                           // last 200 signal ids (idempotency)
}
// appetite names are not held by the mod: they are the `reviews` keys of the build-tier workflow file
```

`reduce(state, signal)` is the only writer. Every signal carries an `id` (`tool_use_id`, `turnId`,
`agentId`, or `kind+timestamp`); a signal whose id is in `seen` returns the state unchanged, so a
replayed or doubly delivered event is safe (at-least-once). Storage: the whole `NavState` in one
`atom({plugin:'navigator', key:'state'})` (session); `$.store` keeps only `clarity:<changeId>`
(score + PLAN mtime) and the board ledger (§10). A stored state from an older version loads as
`{...EMPTY, ...stored}` (ponytail's pattern); `version` bumps on a breaking shape change.

## 4. Workflow files (DEC-1, DEC-13)

### 4.1 Schema (`lib/workflow.ts` is its one validator, DD-8)

JSON (DD-1). Fields; unknown keys are errors.

| Field | Type | Req. | Meaning |
|---|---|---|---|
| `name` | kebab string | yes | identity; a repo file with the same name overrides (§4.3) |
| `title` | string | yes | shown in the band |
| `owner` | skill name | yes | the skill that owns the method; the file cites it |
| `provisional` | boolean | no | shown as "(provisional)" (DEC-9) |
| `mode` | `"loose"` \| `"strict"` | no | honoured only in a repo file (DEC-5); in a default file it is an error |
| `extends` | workflow name | no | repo files only; shallow merge (§4.3) |
| `activate` | `{skills?: string[], agents?: string[], openChange?: boolean, change?: ChangePredicate, interactive?: boolean}` | yes | what makes this workflow or variant the active one (§6.2); `interactive` compares with `session.start`'s `isInteractive` |
| `variants` | `{name, phases: string[], activate}[]` | no | a named subset of phases with its own activation |
| `phases` | Phase[] (ordered) | yes | see below |
| `gates` | `{[id]: Gate}` | no | named gates phases refer to |
| `reviews` | `{[appetite name]: {challenge: string, reviewers: int, lenses?: string[], ux: null \| {wording: string, extra_reviewers: int}, check: string, checker: bool, tester: null \| string}}` | no | the review set per appetite, stated once per entry (UX once, in `ux`; the tester as its wording or `null`); the build-tier file is its single source (DD-21) |
| `roles` | `{reviewer|checker|tester: {agents?: string[], describe?: regex}}` | no | how a spawn is classed |
| `replaces` | `{[externalSkill]: ourSkill}` | no | external skills a Meaningfy skill owns the job of |
| `planDrift` | `{ignore: glob[]}` | no | paths never counted as plan drift |

Phase: `{id, owner: skill, expect: {skill, by: 'commit'|'exit'}[], allow?: string[],
gates?: string[], enter: {skills?: string[], agents?: string[], change?: ChangePredicate}}`.
`ChangePredicate` ∈ `none | proposal | plan | tasks-no-design | tasks-open | tasks-partial | tasks-done | archived`
(fixed vocabulary in `lib/change.ts`); `enter.change` takes one or a list, any of which holds (DD-38).

Gate kinds (fixed in code; the file only fills them):

| `kind` | Fields | Passes when |
|---|---|---|
| `command` | `match` (regex), `run` (command line, optional) | a Bash call matching `match` exited 0 after the last edit in the phase |
| `skill` | `skill` | the skill ran after the PLAN files' last change (DD-14) |
| `consent` | `shown` (regex on an answer), `before` (regex on a Bash command) | a `shown` answer was followed by a user prompt before the `before` command |
| `file` | `glob` | a file matching `glob` changed during the phase |

Every skill or agent name in a default file must exist in `skills/` or `agents/`, or be listed in
the `skills:` key of a `dependencies.yaml` entry; the node test TC-16 checks it (DD-8, DD-28).

`dependencies.yaml` gains an optional key `skills:` per entry (DD-28): the external skill names,
without plugin prefix, that catalogue files may name. `dependencies_register` in
`tools/repo_lint/lint.py` checks it: a list of kebab names, each name in at most one entry, no name
equal to a `skills/` directory. Entries filled in this change:

| Entry | `skills:` |
|---|---|
| `superpowers` | `brainstorming`, `writing-plans`, `executing-plans`, `test-driven-development`, `systematic-debugging`, `verification-before-completion`, `requesting-code-review`, `receiving-code-review`, `dispatching-parallel-agents`, `subagent-driven-development` |
| `OpenSpec` | `openspec-explore`, `openspec-propose`, `openspec-apply-change`, `openspec-archive-change`, `openspec-update-change`, `openspec-sync-specs` |

TC-16 reads `dependencies.yaml` with a minimal line reader of `skills:` lists (`lib/` has no YAML
parser; the test is a test, not mod code): *shortcut: accepts only the inline `skills: [a, b]` form,
which the lint enforces.*

### 4.2 The four defaults (one concrete file each)

`skills/epic-delivery/assets/workflows/build-tier.workflow.json` (variants: exploratory, brownfield):

```json
{
  "name": "build-tier", "title": "Build-tier EPIC delivery", "owner": "epic-delivery",
  "activate": { "openChange": true, "skills": ["epic-planning", "epic-delivery", "spec-stewardship"] },
  "variants": [
    { "name": "exploratory", "phases": ["explore", "shape", "plan"], "activate": { "skills": ["openspec-explore"] } },
    { "name": "brownfield", "phases": ["shape", "apply", "archive"], "activate": { "change": "tasks-no-design" } }
  ],
  "phases": [
    { "id": "explore", "owner": "epic-planning", "expect": [], "allow": ["brainstorming"],
      "enter": { "skills": ["openspec-explore", "brainstorming"], "change": "none" } },
    { "id": "shape", "owner": "epic-planning", "expect": [{ "skill": "epic-planning", "by": "exit" }],
      "enter": { "skills": ["openspec-propose"], "change": "proposal" } },
    { "id": "plan", "owner": "epic-planning", "expect": [{ "skill": "epic-planning", "by": "exit" }],
      "allow": ["bdd-gherkin"], "gates": ["clarity"], "enter": { "change": "plan" } },
    { "id": "apply", "owner": "epic-delivery",
      "expect": [{ "skill": "test-driven-development", "by": "commit" }, { "skill": "cosmic-python", "by": "exit" }],
      "allow": ["meaningfy-code-review", "systematic-debugging", "subagent-driven-development"],
      "gates": ["clarity", "validate"],
      "enter": { "skills": ["openspec-apply-change", "epic-delivery"], "change": ["tasks-partial", "tasks-no-design"] } },
    { "id": "verify", "owner": "meaningfy-code-review",
      "expect": [{ "skill": "meaningfy-code-review", "by": "exit" }, { "skill": "verification-before-completion", "by": "exit" }],
      "gates": ["validate"], "enter": { "change": "tasks-done" } },
    { "id": "archive", "owner": "spec-stewardship", "expect": [{ "skill": "spec-stewardship", "by": "exit" }],
      "gates": ["validate", "openspec"], "enter": { "skills": ["openspec-archive-change"], "change": "archived" } }
  ],
  "gates": {
    "clarity":  { "kind": "skill", "skill": "clarity-gate" },
    "validate": { "kind": "command", "match": "\\bmake validate\\b", "run": "make validate" },
    "openspec": { "kind": "command", "match": "\\bopenspec validate\\b", "run": "openspec validate {change} --strict" }
  },
  "reviews": {
    "TINY":   { "challenge": "One review pass: L2 spec and tests, L3 structure with ADR conformance",
                "reviewers": 1, "lenses": ["L2", "L3"], "ux": null,
                "check": "Folded into the lead's re-run", "checker": false, "tester": null },
    "SMALL":  { "challenge": "One review pass: L2 spec and tests, L3 structure with ADR conformance",
                "reviewers": 1, "lenses": ["L2", "L3"], "ux": null,
                "check": "Folded into the lead's re-run", "checker": false, "tester": null },
    "MEDIUM": { "challenge": "Five lenses, read-only, in parallel", "reviewers": 5, "ux": null,
                "check": "Checker", "checker": true, "tester": null },
    "LARGE":  { "challenge": "Five lenses, read-only, in parallel", "reviewers": 5,
                "ux": { "wording": "plus the UX lens when screens changed", "extra_reviewers": 1 },
                "check": "Checker", "checker": true, "tester": "Adversarial tester" },
    "VERY LARGE": { "challenge": "Five lenses, read-only, in parallel", "reviewers": 5,
                "ux": { "wording": "plus the UX lens when screens changed", "extra_reviewers": 1 },
                "check": "Checker", "checker": true, "tester": "Adversarial tester" },
    "HUGE":   { "challenge": "Five lenses, read-only, in parallel", "reviewers": 5,
                "ux": { "wording": "plus the UX lens when screens changed", "extra_reviewers": 1 },
                "check": "Checker", "checker": true, "tester": "Adversarial tester" }
  },
  "roles": {
    "reviewer": { "agents": ["code-reviewer"] },
    "checker":  { "describe": "\\bcheck(er)?\\b" },
    "tester":   { "describe": "\\b(adversarial|tester)\\b" }
  },
  "replaces": { "writing-plans": "epic-planning", "executing-plans": "epic-delivery" },
  "planDrift": { "ignore": ["openspec/changes/**", "bundles/**", ".claude-plugin/**", "tools/opencode-catalogue.json",
                            "package.json", "docs/skill-inventory.md", "CHANGELOG.md"] }
}
```

`skills/architecture/assets/workflows/architecting.workflow.json` (cites `conceptual-modelling`):

```json
{
  "name": "architecting", "title": "Architecting and modelling", "owner": "architecture",
  "activate": { "skills": ["architecture", "conceptual-modelling"], "agents": ["system-architect", "conceptual-modeller"] },
  "phases": [
    { "id": "explore", "owner": "architecture", "expect": [], "allow": ["brainstorming"], "enter": { "skills": ["architecture"] } },
    { "id": "elicit", "owner": "conceptual-modelling", "expect": [{ "skill": "conceptual-modelling", "by": "exit" }],
      "allow": ["modelling-conventions"], "enter": { "skills": ["conceptual-modelling"], "agents": ["conceptual-modeller"] } },
    { "id": "decide", "owner": "architecture", "expect": [{ "skill": "architecture", "by": "exit" }], "gates": ["adr"],
      "enter": { "agents": ["system-architect"] } }
  ],
  "gates": { "adr": { "kind": "file", "glob": "**/[Aa][Dd][Rr]-[0-9]*" } }
}
```

The `adr` glob matches the ADR file names of `architecture`'s
`references/architecture-project-structure.md` (`ADR-001-….md`) and of `project-setup`'s docs
template (`adr/adr-0001-….adoc`).

`skills/infrastructure-operations/assets/workflows/devops.workflow.json` (cites `service-reliability`):

```json
{
  "name": "devops", "title": "DevOps", "owner": "infrastructure-operations",
  "activate": { "skills": ["infrastructure-operations", "stack-operations", "service-reliability"],
                "agents": ["devops-engineer", "ops-watch", "infra-reviewer"] },
  "variants": [
    { "name": "intervention", "phases": ["read", "plan", "dry-run", "card", "apply", "verify", "record"],
      "activate": { "skills": ["infrastructure-operations", "stack-operations"], "agents": ["devops-engineer"] } },
    { "name": "incident", "phases": ["triage", "apply", "verify", "record"], "activate": { "skills": ["service-reliability"] } },
    { "name": "check-up", "phases": ["check", "record"], "activate": { "agents": ["ops-watch"], "interactive": true } },
    { "name": "unattended", "phases": ["check", "apply", "record"], "activate": { "agents": ["ops-watch"], "interactive": false } }
  ],
  "phases": [
    { "id": "read", "owner": "infrastructure-operations", "expect": [], "enter": { "skills": ["infrastructure-operations"] } },
    { "id": "triage", "owner": "service-reliability", "expect": [{ "skill": "service-reliability", "by": "exit" }], "enter": { "skills": ["service-reliability"] } },
    { "id": "check", "owner": "service-reliability", "expect": [], "enter": { "agents": ["ops-watch"] } },
    { "id": "plan", "owner": "infrastructure-operations", "expect": [], "enter": {} },
    { "id": "dry-run", "owner": "infrastructure-operations", "expect": [], "gates": ["dry-run"], "enter": {} },
    { "id": "card", "owner": "infrastructure-operations", "expect": [], "enter": {} },
    { "id": "apply", "owner": "infrastructure-operations", "expect": [], "gates": ["consent"], "enter": {} },
    { "id": "verify", "owner": "service-reliability", "expect": [], "enter": {} },
    { "id": "record", "owner": "infrastructure-operations", "expect": [], "enter": {} }
  ],
  "gates": {
    "dry-run": { "kind": "command", "match": "terraform plan|ansible-playbook\\b.*--check" },
    "consent": { "kind": "consent", "shown": "^DECIDE:", "before": "terraform apply|ansible-playbook(?!.*--check)|docker stack deploy" }
  }
}
```

DevOps phases without an `enter` signal advance by the *command* that ends the previous one
(`terraform plan` → `card`; a `consent` answer → `apply`; an apply command → `verify`); the mapping
is `advanceOn` in `lib/phase.ts` driven by the gate regexes above, never by phase names.

`skills/sales-operations/assets/workflows/sales.workflow.json` (DEC-9):

```json
{
  "name": "sales", "title": "Sales (simple)", "owner": "sales-operations", "provisional": true,
  "activate": { "skills": ["sales-accounts", "sales-qualification", "sales-conversations", "estimation",
                           "proposal-writing", "sales-pipeline-custody", "sales-operations"],
                "agents": ["proposal-writer", "sales-agent"] },
  "phases": [
    { "id": "research", "owner": "sales-qualification", "expect": [{ "skill": "sales-qualification", "by": "exit" }],
      "allow": ["sales-accounts"], "enter": { "skills": ["sales-accounts", "sales-qualification"] } },
    { "id": "meet", "owner": "sales-conversations", "expect": [], "enter": { "skills": ["sales-conversations"] } },
    { "id": "offer", "owner": "proposal-writing", "expect": [{ "skill": "estimation", "by": "exit" }],
      "enter": { "skills": ["estimation", "proposal-writing"], "agents": ["proposal-writer"] } },
    { "id": "pipeline", "owner": "sales-pipeline-custody", "expect": [],
      "allow": ["sales-operations"], "enter": { "skills": ["sales-pipeline-custody", "sales-operations"], "agents": ["sales-agent"] } }
  ]
}
```

Skill names are compared without a plugin prefix (`superpowers:test-driven-development` →
`test-driven-development`). Each host skill's `SKILL.md` gains one line pointing to its file.

### 4.3 Repo overrides (DEC-1, DEC-5)

Repo files live in `<repo>/docs/navigator/*.workflow.json` (DD-2). Resolution in
`resolveWorkflows(defaults, repoFiles)`:

1. Parse every file. A malformed repo file adds `workflow file <path>: <first error>` to
   `workflowErrors` (a hygiene-kind warning with no remedy) and is skipped; the default of that name
   stays in force (scenario 7). A malformed default file is the same, but is caught by the test of
   §11 before release.
2. A repo file with no `extends` and a default's `name` replaces that default wholly.
3. A repo file with `extends: <name>` starts from that default and replaces each top-level field it
   gives (`phases` wholesale, not merged per phase).
4. A repo file with a new `name` adds a workflow.
5. The repo's mode is `strict` when any repo file says `"mode": "strict"`, else `loose` (DD-3).
   A minimal opt-in: `{"name": "build-tier", "extends": "build-tier", "mode": "strict"}`.

## 5. Event → signal map (`register.tsx`)

| Event (matcher) | Read | Signal(s) to `reduce` | Side effect |
|---|---|---|---|
| `session.start` | config options, `data/` files, `docs/navigator/*`, open changes, `$.store` clarity | `Started` | `$.command.register('navigator')`, line |
| `command.run` `clear`/`resume`/`branch` | as start, if the session id changed | `Started` | line |
| `session.end` | — | — | board row (§10) |
| `session.compact` | `trigger` | `Compacted{auto}` | — |
| `prompt.submit` (origin not plugin) | time | `UserPrompted` | — |
| `prompt.compose` | state | — | strict reminder section (§7) |
| `skill.prompt` | `skill` | `SkillLoaded` | — |
| `agent.spawn` | `subagentType`, `model ?? parentModel`, `description`; result `agentId` | `SubagentSpawned` | strict decide (§7) |
| `turn.complete` with `agentId` | `usage`, `answer` line count, tool calls counted | `SubagentFinished` | — |
| `turn.complete` main | `usage`, `$.session.usage().context.percent`, `answer`, re-read change files, `git diff` | `TurnEnded`, `ChangeRead`, `DiffRead` | line; run `pending` (DD-16) |
| `tool.call` Bash (before `next`) | `command` | — | strict decide (§7) |
| `tool.call` Bash (after `next`) | `command`, `isError` | `ToolRan{command, ok, agentId}` | — |
| `tool.call` Edit/Write/NotebookEdit (after) | `file_path` | `FileTouched` | — |
| `ui.render` `AbovePrompt` | state, `e.surface`, `e.props.bodyColumns` | — | band (§9), `next(e)` below |

Every hook ends `.catch(($, e, next) => next(e))` (fail open, DD-11). `turn.complete` work is
debounced to the main turn: git and file reads run once per main turn, never per subagent turn.
The `ToolRan` reducer derives: `commit` (`git commit` ok), `push` / `prOpened` (`git push`,
`gh pr create` ok), `prMerged` (`gh pr merge` ok; *shortcut: a merge done on the web is not seen,
so that task boundary is missed; upgrade by polling `gh pr view` if people miss the offer*), `archived` (`openspec archive` ok), gate results (gate `match` regexes),
consent order (the `before` regex).

## 6. Algorithms

### 6.1 Which change, appetite and progress (`lib/change.ts`)

- Open changes = `openspec/changes/*/proposal.md`, excluding `archive/`. None → `change: null`,
  line says `no open change` and no build-tier warnings are computed (scenario 1).
- Several → the one whose id is a substring of the current branch name; else the most recently
  modified; `openChanges` shows `+N` (DD-13).
- Appetite = the first of the build-tier workflow's `reviews` keys (longest first, so `VERY LARGE`
  wins over `LARGE`) found in the first paragraph under `## Appetite` of `proposal.md`; none, or no
  build-tier workflow → `null`, shown as `?`. The mod holds no list of appetite names.
- Tasks = lines `- [ ]` / `- [x]` in `tasks.md`; groups = `## ` headings above them. Tasks under
  `## Roadmap` are not counted (the roadmap repeats ids).
- `planMtime` = max mtime of `design.md`, `tasks.md`.
- Predicates: `none` no change; `proposal` only `proposal.md`; `plan` `design.md` and `tasks.md`
  with 0 ticked; `tasks-no-design` `tasks.md` without `design.md`; `tasks-open` total > 0, 0
  ticked; `tasks-partial` 0 < done < total; `tasks-done` done = total > 0; `archived` the id was
  open at session start and is now under `archive/`.

### 6.2 Active workflow and phase (`lib/phase.ts`)

1. Active workflow = the one whose `activate` matched the most recent signal (skill load or agent
   spawn); before any match, `build-tier` when `change` is not null, else none. Same for variants.
2. Phase = the last phase whose `enter.skills`/`enter.agents` matched a signal in this session,
   unless the change state now satisfies a *later* phase's `enter.change` predicate (files move
   forward: ticking all tasks moves `apply` → `verify`). With no signal, the first phase whose
   predicate holds, scanning backwards. DevOps phases also advance by `advanceOn` (§4.2).
3. A phase change emits `PhaseLeft{from}` — the trigger for `by: 'exit'` checks and a hygiene
   boundary.

*shortcut: phase is inferred, not declared; a session that does two activities at once shows the
latest; upgrade if people report wrong phases — a `/navigator phase <id>` override.*

### 6.3 Process drift (`lib/process-drift.ts`, `lib/dispatch.ts`)

Each check emits `Warning{key, kind:'process', remedy, provenance}`; a warning whose key is in
`deviations` is shown as accepted and does not count as open.

| Id | Fires when | Key | Remedy | Provenance |
|---|---|---|---|---|
| PD-1 | a successful commit in phase P while an `expect` entry `by:'commit'` of P has not loaded since P was entered (scenario 3) | `process:missing:<P>:<skill>` | Back on track = run `<skill>` | phase owner |
| PD-2 | `PhaseLeft{P}` with an `expect` `by:'exit'` skill not loaded in P | same form | same | phase owner |
| PD-3 | a gate of phase P is not passed at its check point: on entering P for `skill`, `command` and `file` gates (e.g. `apply` with no clarity run on the current PLAN); for a `consent` gate, when its `before` command (the apply command) runs with no consent answered (scenario 11, TC-12) | `process:gate:<P>:<gate>` | run the gate's `run` or owner skill | phase owner |
| PD-4 | a skill named in another phase's `expect`/`allow` (same workflow) loads in P and not in P's lists | `process:elsewhere:<P>:<skill>` | none (info) | workflow owner |
| PD-5 | a skill key of `replaces` loads | `process:external:<skill>` | run the mapped skill | workflow owner |
| PD-6 | a finished subagent made ≤ `lookup_max_tool_calls` tool calls | `process:inline:<agentId>` | none | `guardrails` |
| PD-7 | the spawned agent declares no model, and the spawn asks a model ranked above `parentModel` by `model_rank` of the guardrails data file; skipped when the agent declares a model (`guardrails` §5: the declared model comes first) | `process:model:<agentId>` | none | `guardrails` |
| PD-8 | reviewer spawns in one main turn exceed `reviews[appetite].reviewers + (reviews[appetite].ux?.extra_reviewers ?? 0)`, the allowance read from the workflow file (scenario 5, "over-spawn") | `process:overspawn:<turnId>` | none | `epic-delivery` |
| PD-9 | `reviews[appetite].checker` is true, reviewers ran, and a push, PR or archive follows with no checker spawn since (scenario 5, "second check missing") | `process:second-check:<change>` | Review | `guardrails` |
| PD-10 | a finished subagent's answer exceeds `subagent_report_max_lines` | `hygiene:report:<agentId>` | none | `guardrails` |

*shortcut: PD-6 approximates "spawned without paying" from tool-call counts; PD-7 knows a declared
model only when `agent.spawn` carries `model` for a catalogue agent (its frontmatter), so an
agent's declared model is never second-guessed; upgrade when false alarms are reported.*
*shortcut: roles are classed by `roles` (agent name or description regex); an unnamed checker
counts as `other`.*

A skill "loaded but unused" (EPIC hygiene) = a `skill.prompt` followed, in the same main turn, by
another `skill.prompt` with zero tool calls between them → `hygiene:unused:<skill>` with remedy
*Report to skillery* (a trigger-probe candidate); if that cut-line action is cut, the warning has
no button and its text names `skillery-feedback` for the person to run, and *Accept deviation*
stays available. *shortcut: catches only skim-and-abandon.*

### 6.4 Plan drift (`lib/plan-drift.ts`)

Inputs read by `register.tsx` once per main turn while a change is open: `git diff --name-only
<base>...HEAD` plus `git status --porcelain` paths (base = `git merge-base HEAD origin/develop`,
else `origin/main`, else `HEAD~0`), the added lines of `git diff -U0 <base>...HEAD` (capped at 2 000
lines), `tasks.md`, `design.md`, `proposal.md`, `deviations.md`.

| Id | Fires when | Key |
|---|---|---|
| PL-1 | a changed path is *uncovered*: no task line, `design.md` or `proposal.md` text names the path, a parent folder of depth ≥ 2, or its file stem (≥ 4 chars); and it does not match `planDrift.ignore` (scenario 4) | `plan:outside:<path>` |
| PL-2 | a ticked task names one or more path tokens (backticked, containing `/` or a `.ext`) and none of them changed on the branch | `plan:ticked:<taskId>` |
| PL-3 | an added line carries `shortcut:` or a new `DD-`/`DEC-` id, and `design.md` does not mention that file or id | `plan:decision:<path>:<line>` |

Remedy for all: **Reconcile EPIC**. A task id is its `N.M` prefix. Tasks with no path token are not
judged by PL-2. *shortcut: text matching, not semantics; aim is few false alarms — a path named
anywhere in the PLAN counts as covered.*

Worked example (scenario 4): branch `feature/navigator`, `tasks.md` names `mods/navigator/lib/`;
the diff has `mods/navigator/lib/view.ts` (covered by the folder) and `tools/repo_lint/lint.py`
(uncovered if no task names it) → `plan:outside:tools/repo_lint/lint.py`. *Archive check* fails.
After `/navigator accept plan:outside:tools/repo_lint/lint.py "lint check added for DD-10"` the
line is in `deviations.md`, the warning shows accepted and *Archive check* passes listing it
(scenario 13).

### 6.5 Hygiene and cost (`lib/hygiene.ts`; thresholds from `guardrails`, DD-9)

`data/session-thresholds.json` (rendered link to `skills/guardrails/assets/session-thresholds.json`):

```json
{ "compact_offer_context_percent": 50, "context_warn_percent": 75,
  "fresh_offer_min_context_percent": 15, "idle_reset_minutes": 60,
  "subagent_report_max_lines": 40, "lookup_max_tool_calls": 3,
  "model_rank": ["haiku", "sonnet", "opus"],
  "safe_point": { "after": "commit", "and_any": ["phase-left", "task-group-done"] },
  "task_boundary": { "any": ["commit", "pr-merged", "archived"] },
  "idle_reset": { "requires_clean_tree": true } }
```

| Key | Meaning |
|---|---|
| `compact_offer_context_percent` | at a safe point, context use at or above this → offer *compact now* |
| `context_warn_percent` | mid-step, context use at or above this → warning, no offer |
| `fresh_offer_min_context_percent` | at a task boundary, context use at or above this → offer *fresh session*; below it the context is still small, and carrying on with the next task costs less than a re-read, so nothing is offered |
| `idle_reset_minutes` | idle gap that makes a reset free (the cache has expired) |
| `subagent_report_max_lines` | a base report longer than this is oversized (PD-10) |
| `lookup_max_tool_calls` | a finished subagent with at most this many tool calls was a lookup (PD-6) |
| `model_rank` | cheapest first; PD-7 compares by position, matching a model id by substring |
| `safe_point` | the moment a reset may be offered: after the named event, and one of the listed ones since the last safe point |
| `task_boundary` | the events after which `guardrails` §6 says to start fresh for the next task: a commit, a merged PR, an archived change (§6 as it stands; no rule change) |
| `idle_reset` | an idle reset is offered only when the working tree is clean |

The event names (`commit`, `phase-left`, `task-group-done`, `archived`, `pr-merged`) are a fixed vocabulary `lib/hygiene.ts` recognises from signals (mechanism); which
of them make a safe point or a task boundary is the rule, stated here and in `guardrails` §6
(DD-30). An unknown name in the file → `hygiene:thresholds-missing` naming the key.

The values are owner-decided 2026-11-08: starting values, tuned later in `guardrails` by editing this file only; the
mod reads keys, never holds numbers or model names.
Missing or malformed file → hygiene checks off, one warning `hygiene:thresholds-missing`.

Evaluated at each main `TurnEnded`:

- **Safe point** and **task boundary** are evaluated from the data file's `safe_point` and
  `task_boundary` (today: a commit plus a phase left or a task group done; a commit, a merged PR or
  an archived change). Otherwise mid-step. *shortcut: §6 says "for the next, unrelated task", which
  no event shows; a bare commit counts as a task boundary only when no change is open or the open
  change has no unticked task, and otherwise falls through to the compact rule; upgrade if people
  want fresh offers mid-EPIC.* Each offer and warning carries provenance
  `guardrails`.
- Offer `fresh` at a task boundary when `context ≥ fresh_offer_min_context_percent`, or when
  `now − lastUserPromptAt ≥ idle_reset_minutes` and `idle_reset` holds.
- Else offer `compact` at a safe point when `context ≥ compact_offer_context_percent` (scenario 6).
- Mid-step: no offer; at `context ≥ context_warn_percent` a warning `hygiene:context` ("commit,
  then compact") with no button.
- `session.compact` with `trigger: 'auto'` → `hygiene:auto-compact` (it landed where the rule says
  not to). An offer clears on the next user prompt.

Cost: `usage.tokens`/`usd` from `$.session.usage()`; per subagent, the sum of its
`turn.complete` usage (input + output + cache). Shown, never judged (no budget, per `guardrails`).

## 7. Strict mode (DEC-5)

Effective mode = `strict` iff `mode.repo === 'strict' && !mode.sessionLoose`. Strict adds, never
replaces, the loose behaviour. Each rule is one entry in `lib/strict.ts` `STRICT_RULES` whose `id`
equals a `hooks.yaml` hook id with a `mod` binding (DD-10):

| `hooks.yaml` id | Event | Condition | Action | Provenance |
|---|---|---|---|---|
| `navigator-strict-commit` | `tool.call` Bash `git commit` (before `next`) | PD-1's condition evaluated now, before the commit runs: an `expect` entry `by:'commit'` of the current phase not loaded since the phase was entered (and its key not accepted); or an open PD-3 warning for the phase | `deny` (the commit never runs, so the first commit without the skill is blocked) | `epic-delivery` |
| `navigator-strict-archive` | `tool.call` Bash `openspec archive`; `command.run` `opsx:archive` | any open plan-drift or process-drift warning | `deny` | `spec-stewardship` |
| `navigator-strict-spawn` | `agent.spawn` | PD-7 (agent declares no model) → rewrite `model` to `parentModel`; never when the agent declares one; PD-8 would fire → `deny` | rewrite / `deny` | `guardrails` |
| `navigator-strict-reminder` | `prompt.compose` | a phase is known | add section `navigator-phase` (scope `session`) | `epic-delivery` |

Deny text (fixed template): `navigator (strict, <hook id>): <warning message>. Way out: <remedy
command> · /navigator accept <key> "<reason>" · /navigator mode loose`. Reminder text is built only
from file data: `Phase <id> of <title> (owner skill: <owner>). Expected: <expect skills>. Gates:
<gate ids>. Workflow file: <path>.` — no rule prose (DEC-2).

`hooks.yaml` entries (new mechanism `mod`; `_VALID_MECHANISM` gains it; phase `phase-gate`):

```yaml
  # ---- navigator strict mode (Claude Code only; opencode: recorded gap) ----
  - id: navigator-strict-commit
    intent: In strict repos, block a commit while the phase's expected skill or gate is missing
    provenance: { skill: epic-delivery }
    bindings: [{ mechanism: mod, phase: phase-gate, trigger: tool.call(git commit) }]
```

(and the three others likewise). Lint check `mod_bindings_match` (in `tools/repo_lint/lint.py`):
the set of hook ids with a `mod` binding equals the set of `id: '<...>'` literals in
`mods/*/lib/strict.ts`.

**Drop to loose**: `/navigator mode loose` (band button *Mode*) sets `sessionLoose` in session
state; the line shows `○ loose (strict dropped)`. A new session starts from `Started`, which does
not carry `sessionLoose`, so it is strict again (scenario 12). `/navigator mode strict` restores it
in the same session; in a loose repo both answer "this repo has no `mode: strict`" (DD-26).

## 8. Actions → commands (DEC-6, `lib/actions.ts`)

Every band button runs a command a person could type; `commandFor` returns `{command, args}` or a
reason it cannot. Commands are resolved by name against `$.command.list()`: the first command whose
name equals the skill or ends with `:<skill>` (DD-15). Not installed → toast `navigator: <skill>
is not installed` and nothing runs.

| Action | Command (args) | Shown when |
|---|---|---|
| Next step | first unmet `expect` skill of the phase, else the next phase's owner skill | a workflow is active |
| Back on track | the remedy of the oldest open process-drift warning | such a warning exists |
| Reconcile EPIC | `openspec-update-change` (`<id>`), then on its `turn.complete` `clarity-gate` (`<id>`) (DD-16) | a plan-drift warning exists |
| Archive check | `/navigator check` → report: open plan drift, open process drift, accepted deviations, gate states, `openspec validate <id> --strict` result | change open |
| Validate | `/navigator validate` → runs each `run` of the phase's command gates through `$.process.run`, logs output | a gate has `run` |
| Accept deviation | `/navigator accept <key> "<reason>"`; from the band, `$.ui.ask` asks the reason | per warning |
| Mode | `/navigator mode loose|strict` | repo is strict |
| Fold / Unfold / Hide | `/navigator band fold|unfold|hide|show` | always |
| Line | `/navigator line show|hide` | always (command only) |
| Compact now | `compact` (`keep: change <id>, phase <p>, open warnings, decisions are in design.md`) | `offer === 'compact'` |
| Fresh session | `clear` | `offer === 'fresh'` |
| Review | `meaningfy-code-review` (`<id> <APPETITE>`) | apply/verify |
| Board | `/navigator board` (cut line) | always |
| Copy status | `$.ui.copy` of the line + open warnings as Markdown (cut line) | always |
| Report to skillery | `skillery-feedback` (`<warning key> · skill <s> · phase <p> · workflow <w>`) (cut line) | per warning |

`/navigator accept` appends one line to `openspec/changes/<id>/deviations.md` (creating it with a
one-line header), idempotent per key (DD-12):

```
- 2026-11-12 · plan:outside:tools/repo_lint/lint.py · lint check added for DD-10
```

Outside a change (DevOps, sales) a deviation is kept in session state only and shown as accepted.

## 9. Status line and band layout (DEC-7, DEC-10)

**Status line** (`$.ui.status`, ≤ 120 chars, `lib/view.ts lineText`):

| Situation | Text (after Claude Code's own `<plugin>:` prefix) |
|---|---|
| build-tier | `navigator · VERY LARGE · Stage 1 — See it apply 9/12 · 9/41` |
| several changes | `… · 3 more open` |
| no change, no workflow | `navigator · no open change` |
| DevOps | `devops · incident · triage · ● strict` |
| sales | `sales (provisional) · offer` |
| strict | `… · ● strict`; loose, or strict dropped for the session, shows nothing (DD-35) |

No model and no `⎈`: Claude Code shows both already (DD-35). Hidden line → `$.ui.status(undefined)`.

**Band, folded** (one row; only its buttons when nothing to report, DD-35): `2 running: code-reviewer, implementer · last clarity-gate · validate ✓ · clarity 9.1 · ⚠ 3` then,
right-aligned, `[Next step] [Back on track]` (when relevant), `[Compact now]`/`[Fresh session]`
(when offered), `[Unfold]`. Gate glyphs: `✓` ok, `✗` fail, `·` stale (edited since), absent if none.

**Band, unfolded**: rows top to bottom — (0) stages: each `##` group of `tasks.md`, `✓`/`●`/`○` with its progress (DD-35); the mode, always; (1) phases of the active workflow, `✓` done `●` current `○`
next, with the variant; (2) skill trail, last 8, `name (phase)`; (3) subagents: type, model,
tokens, `running`/`done`, role; (4) appetite vs actual: appetite, tasks `done/total`, groups done,
reviewers this round vs `reviews[appetite]`, session tokens and cost; (5) warnings, each with
`[Accept]` `[Report]`; (6) action buttons: Next step, Reconcile EPIC, Back on track, Archive check,
Validate, Review, Mode, Board, Copy, Fold, Hide.

Surfaces: on `terminal` widths follow `e.props.bodyColumns`; on `desktop` rows flex (ponytail's
rule) and, if the stage-1 proof finds `$.ui.status` not drawn there, the folded row starts with the
line's text (DD-19). Hidden band → one `⎈` button above `next(e)`, which folds the band back in (DD-32). The band always draws `next(e)`'s
tree below its own, so ponytail's band still draws (scenario 8).

**Settings** (`mods/navigator/config.json` → `userConfig`, DD-25): `band` (`unfolded` | `folded`
| `hidden`, default `folded`), `statusLine` (boolean, default `true`). Read at `Started`; the
session toggles of §8 change only session state, so the next session starts from the settings
(scenario 9).

## 10. Board (cut line, DD-22)

At `session.end`, one row per session is upserted into `$.store` key `board:<project>` (change id,
workflow, phases reached, tasks done, warnings opened/accepted, tokens, cost, date);
`/navigator board` writes `<claude config dir>/navigator/<project>/board.md` (a table, newest first)
and toasts its path. Nothing leaves the machine.

## 11. Tests (DEC-14)

`make mods` (added to `make validate`, DD-24):
`node --test --experimental-strip-types 'mods/*/lib/*.test.ts'` and
`npx tsc -p mods/navigator/tsconfig.json`, with `typescript` pinned exactly (`5.6.3`) under
`devDependencies` in `package.json` and installed by `npm ci` (`make install` gains it; a
`package-lock.json` is committed); `engines.node` becomes `>=22.6` (strip-types). The opencode
installer keeps no runtime dependency (devDependencies are not installed by its users). CI `validate`
job gains `actions/setup-node@v4` (node 22), `npm ci` and `make mods`. No CI job needs the Claude Code CLI.

### Unit tests (pure logic)

| Test | Module | Input | Expected | Scenario |
|---|---|---|---|---|
| TC-01 | view | fixture state (appetite set directly, not parsed) with change, appetite, phase apply, 12/40 | line `⎈ <id> · VERY LARGE · apply 12/40 · … · ○ loose` | 1 |
| TC-02 | view, change | no proposal.md files | `⎈ no open change`, zero warnings | 1 |
| TC-03 | state | spawn then finish signals for one agentId | listed with type/model, then done with token sum | 2 |
| TC-04 | process-drift, strict | apply, no TDD load; (a) loose: commit ok; (b) strict: `decide` on the first `git commit` call; (c) strict after TDD loads | (a) PD-1 warning after the commit; (b) deny before it runs, reason + way out, no commit signal; (c) allow | 3 |
| TC-05 | plan-drift | diff with uncovered path | PL-1; archive check fails; after deviation → passes listing it | 4, 13 |
| TC-06 | dispatch | MEDIUM, 5 reviewer spawns, then `gh pr create` | PD-9 "second check missing" | 5 |
| TC-07 | dispatch | SMALL, 5 reviewer spawns in a turn | PD-8 "over-spawn" | 5 |
| TC-08 | hygiene | commit + phase left, context 62% / no commit, 62% | offer compact / no offer | 6 |
| TC-09 | workflow | repo file same name; repo file malformed | override wins; error listed, default kept | 7 |
| TC-10 | view | band hidden | line text unchanged and complete | 8 |
| TC-11 | state | `Started{statusLine:false}`; toggle line show; new `Started` | hidden; shown; hidden again | 9 |
| TC-12 | process-drift | devops variant intervention, apply cmd, no `DECIDE:` answer | PD-3 consent | 11 |
| TC-13 | view, phase | devops incident; sales offer | line shows kind and phase; `(provisional)` | 11 |
| TC-14 | strict | repo strict, apply, no TDD: `decide` on first commit; drop loose; `decide` again; new `Started`; `decide` again | deny; allow (PD-1 raised after it, loose); deny again | 12 |
| TC-15 | actions | Reconcile, Report to skillery, command list | `{command, args}` pairs; missing → reason | 13 |
| TC-16 | workflow | every `skills/*/assets/workflows/*.json` | parses; build-tier has a `reviews` entry for each of the six appetites; every name is a `skills/` dir, an `agents/` file, or in a `dependencies.yaml` `skills:` list | 7 |
| TC-17 | state | same signal id twice | state unchanged on second | — |
| TC-18 | change | 3 open changes, branch contains one id | that id, `+2` | 1 |
| TC-19 | hygiene | thresholds missing | no offers, one warning | — |
| TC-20 | deviations | accept same key twice | one line | 13 |

Python: `tests/test_repo_lint_negative.py` gains `dependencies.yaml` `skills:` cases (non-kebab name, name in two entries, name shadowing a `skills/` dir); `tests/test_bundle_gen.py` gains mod link/plugin.json/gate cases;
`tests/test_repo_lint_negative.py` gains `mod` mechanism accepted, `mod_bindings_match` mismatch,
`mods/` top-level allowed.

### Hand checks (optional, not in CI)

| Check | Surface | Setup | Verify |
|---|---|---|---|
| H-0 | CLI | `claude --plugin-dir <scratch spike folder>` (DD-29), before any bundle exists | the spike's band row and status line draw; `lib/view.ts` loads through its `.ts` specifier; Claude Code version recorded |
| H-1 | CLI | `claude --plugin-dir bundles/meaningfy-navigator` in this repo | line, folded and unfolded band, ponytail band below (8) |
| H-2 | desktop | marketplace from the working copy, install the bundle | stage 1: scenarios 1 (line), 2 (subagent row) and 8 (hidden band, ponytail below) hold as on the terminal, and the placeholder `data/` link resolves; stage 2 re-run: scenario 3 (process drift at commit);  record in `openspec/changes/navigator/evidence/desktop-proof.md` (10, DD-19) |
| H-3 | CLI | spawn a subagent during apply | band row, then tokens (2) |
| H-4 | CLI | a scratch repo with `docs/navigator/build.workflow.json` `mode: strict`, a change in apply | the first commit without `test-driven-development` is blocked before it runs; `/navigator mode loose`; the commit passes with a warning; a new session blocks again (3, 12) |
| H-5 | both | `claude plugin validate bundles/meaningfy-navigator` | no errors; register.tsx types ok |
| H-6 | CLI | Reconcile EPIC, Report to skillery buttons | the commands in the transcript as typed (13) |

## 12. Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Write a rule, threshold or phase list in `mods/` | Read it from a workflow file or the guardrails data file | DEC-2: the mod carries no method |
| Fail closed when a check throws in strict mode | `.catch(… next(e))`: allow and warn | A broken mod must never stop work (DD-11) |
| Call `$` from `lib/` | Pass values in from `register.tsx` | Unit tests must run without the Claude CLI (DEC-14) |
| Replace the `AbovePrompt` tree | Stack `next(e)` below | ponytail and other mods share the slot (scenario 8) |
| Edit `settings.json` or a person's `statusLine` | Ship `statusline.sh` as an optional snippet | No-go |
| Hold the clarity pass mark in the mod | Show the score clarity-gate printed | `clarity-gate` owns it (DD-14) |
| Read the transcript for a fact an event carries | Use the event | Rabbit-hole; transcripts exceed `$.fs.read` limits |
| Run git on every subagent turn | Once per main turn | Cost and latency |
| Hand-write anything under `bundles/` | `make bundles` | DEC-3, existing gate |
| Block in loose mode | Warn only | No-go |
| Second Python validator of the workflow schema | The node test runs the mod's own parser | One validator (DD-8) |

## 13. Error matrix

| Failure mode | Detected by | Handling |
|---|---|---|
| Not a git repo / git missing | `$.process.run` non-zero or throws | plan drift off; line still shows workflow and phase |
| No `openspec/` | no proposal files | `change: null`; DevOps/sales/architecting still work |
| `tasks.md` absent or no checkboxes | `readChange` returns `total: 0` | line shows phase without `n/m` |
| Malformed repo workflow file | `parseWorkflow` errors | warning with path and first error; default used (scenario 7) |
| Malformed default workflow file | TC-16 in `make validate` | release blocked; at run time same as repo file |
| Thresholds file missing | `$.fs.read` throws | hygiene off, one warning (TC-19) |
| A hook throws | `.catch` | `next(e)`; `$.ui.status` keeps last line; strict allows |
| Command for an action not installed | `$.command.list` lookup | toast, no run |
| `deviations.md` write fails | `$.fs.write` rejects | toast with the reason; warning stays open |
| Duplicate / replayed event | `seen` ids | no state change (idempotent) |
| Old stored state shape | missing fields | `{...EMPTY, ...stored}` |
| Diff larger than cap | > 2 000 added lines | PL-3 on the first 2 000; band says `diff truncated` |
| `$.ui.status` not drawn on desktop | H-2 | DD-19 fallback |
| Mod API change on a Claude Code upgrade | H-5 fails / load error notice | pin tested version in the user guide; re-run H-1..H-6 |
| Several mods deny the same tool call | engine chain | navigator's deny names its hook id; nothing else assumed |
| `gh` missing | `ToolRan` never sees `gh pr create` | PD-9 triggers on push or archive instead |

## 14. Decisions (DD-n, new in this PLAN)

- **DD-1** *(owner-decided 2026-11-08)* Workflow files are JSON (`*.workflow.json`): a mod loads no npm packages, and
  `JSON.parse` needs none. The EPIC's `mode: strict` is `"mode": "strict"`.
- **DD-2** Default files at `skills/<host>/assets/workflows/<name>.workflow.json`; repo files at
  `docs/navigator/*.workflow.json`.
- **DD-3** Override resolution as §4.3; a repo is strict when any of its workflow files says so.
- **DD-4** *(owner-decided 2026-11-08)* Bundle `meaningfy-navigator` (house naming), no `requires` (its data comes through
  links); the plugin a person installs carries that name; the mod and commands are `navigator`.
- **DD-5** `bundles.yaml` optional key `mods`; at most one mod per bundle; `make bundles` renders
  the mod link, the data links and the `plugin.json` `hooks`/`types`/`userConfig`.
- **DD-6** `tools/opencode-catalogue.json` omits mod-only bundles; the gap is a hand-written row
  in `compatibility.md` (outside the generated markers).
- **DD-7** `lib/` is erasable TypeScript with explicit `.ts` imports, run by
  `node --experimental-strip-types` (node ≥ 22.6); `tsc` checks `lib/`; `register.tsx` is
  type-checked by hand (H-5) because the engine types are not in the repo. Fallbacks, chosen in
  task 1.1 if H-0 fails: extensionless imports in `lib/` plus a node `--import` resolver for the
  tests; if the desktop sync (H-2) drops the single-file `data/` links, `make bundles` copies the
  data files (like the schema copy) and the gate compares bytes.
- **DD-8** The workflow-file schema check is the mod's own parser, run by TC-16.
- **DD-9** *(owner-decided 2026-11-08; values are starting values)* Guardrails thresholds are `skills/guardrails/assets/session-thresholds.json`; §5/§6
  name each key in prose without its number.
- **DD-10** `hooks.yaml` mechanism `mod`; four strict intents; lint `mod_bindings_match`.
- **DD-11** Strict fails open; drop-to-loose is session state only.
- **DD-12** Deviations go to `openspec/changes/<id>/deviations.md`, one keyed line each.
- **DD-13** Change selection by branch name, then recency, with `+N`.
- **DD-14** The clarity gate state is "ran on the current PLAN" plus the printed score (regex
  `(\d+(\.\d+)?)\s*/\s*10` in the turn that loaded `clarity-gate`); no pass mark in the mod.
- **DD-15** Action commands resolved by skill name against `$.command.list()`.
- **DD-16** Reconcile EPIC chains its second command through `pending`, run on the next main
  `turn.complete`.
- **DD-17** No `.feature` file: no agent behaviour changes (AGENTS.md); EPIC scenarios live in the
  spec deltas and TC-01..TC-20 name them.
- **DD-18** No skill `description` changes; a description change found necessary during build
  ships its positive and near-miss probe in `tests/trigger_probes.yaml`.
- **DD-19** If `$.ui.status` does not draw on desktop, the folded band leads with the line text
  there.
- **DD-20** `statusline.sh` reads `<claude config dir>/navigator/line/<session id>.txt`, which the
  mod rewrites with each line change.
- **DD-21** *(owner-decided 2026-11-08)* The review set per appetite and the role matchers have one source,
  `build-tier.workflow.json`, carrying the scaling table's wording field by field (`challenge`,
  `check`, `tester`, `ux`). Task 2.2 handles every place the grep
  `TINY|SMALL|MEDIUM|LARGE and up|five lenses|combined (L2|pass)|adversarial tester` found in
  `skills/`, `tests/features/` and `docs/` on 2026-11-08 that states the appetite→review-set
  mapping. What each place says about *how* (lens content, briefs, the UX lens's scope) stays.

  | Place | Content | Disposition |
  |---|---|---|
  | `skills/epic-delivery/SKILL.md` ~88–92 | the scaling table | pointer |
  | `skills/epic-delivery/SKILL.md` ~64–65 | adversarial tester "LARGE and up" | pointer |
  | `skills/epic-delivery/SKILL.md` ~147 | anti-pattern "Five lenses on a SMALL change" | rephrase to "a review set larger than the appetite's (see the workflow file)", a pointer |
  | `skills/epic-delivery/SKILL.md` ~22–31 | Quick Start, a SMALL EPIC, step 5 "(SMALL)" | keep: worked example |
  | `skills/epic-delivery/SKILL.md` line 3 | description "a SMALL EPIC" | keep (DD-18) |
  | `skills/epic-delivery/references/stage-loop.md` ~22–23, ~31–33 | steps 3 and 5, scaled by appetite | pointer |
  | `skills/epic-delivery/references/stage-loop.md` ~60–66 | "Two examples" (SMALL, LARGE) | keep: worked examples |
  | `skills/epic-delivery/references/stage-loop.md` ~80–81 | "Deep test", "Review" rows | pointer |
  | `skills/epic-delivery/references/team-and-briefs.md` ~18–20 | Checker, Adversarial tester, UX appetite conditions | pointer |
  | `skills/epic-delivery/references/team-and-briefs.md` ~72 | "For TINY and SMALL, one reviewer covers L2 and L3" | pointer |
  | `skills/meaningfy-code-review/SKILL.md` ~55–56 | size hook: combined pass, UX for LARGE and up | pointer (UX lens content stays) |
  | `skills/guardrails/SKILL.md` ~95 | "for TINY/SMALL the single review pass" | pointer |
  | `tests/features/epic-delivery.feature` ~19–21 | Examples rows SMALL/MEDIUM/LARGE | keep: test data illustrating the rule |
  | `docs/practice/ai-coding/working-with-agents.md` ~44, ~55 | narration, "the table is in stage-loop.md" | keep narration; repoint the link to the workflow file |
  | `docs/practice/ai-coding/dod-quality-gates.md` ~27–29 | "The scaling table is in stage-loop.md" | repoint the link to the workflow file |

- **DD-22** Board = `$.store` ledger + generated `board.md`; cut line.
- **DD-23** The driving agent shows as `main <model>`; the engine gives a hooks module no name for
  the main session's agent. *shortcut: upgrade when the API exposes it.*
- **DD-24** `make validate: lint test mods`; `typescript` an exact-pinned devDependency,
  `engines.node >=22.6`; CI validate job adds node 22 and `npm ci`.
- **DD-25** `userConfig` has two fields, `band` and `statusLine`; no others (YAGNI).
- **DD-26** In a loose repo the Mode action explains instead of switching (DEC-5: strict only by
  repo opt-in).
- **DD-27** `code-principles-governance` is changed only where it fits (the validator's
  single-source checks reach workflow files and mod bindings); the thresholds requirement sits in
  `subagent-dispatch` (see Open Questions 1).
- **DD-28** `dependencies.yaml` entries carry an optional `skills:` list, linted, so catalogue
  files can name external skills checkably.
- **DD-29** The task 1.1 spike runs from a throwaway plugin folder in the session scratch
  directory (outside git) whose `.claude-plugin/plugin.json` names the spike's `hooks.json`; nothing
  of it is committed.
- **DD-30** (lead's decision 2026-11-08, under DEC-2/DEC-6 and the owner's acceptance that
  thresholds live in `guardrails`) The hygiene definitions — safe point, task boundary, the
  idle-and-clean-tree condition — are rules of `guardrails` §6, stated as data (`safe_point`,
  `task_boundary`, `idle_reset`) in its data file; the UX allowance of over-spawn is the `ux` entry of
  the build-tier review set. `lib/hygiene.ts` and `lib/dispatch.ts` hold the event vocabulary and
  read the rules with provenance; `lib/hygiene.ts` also holds one labelled shortcut condition (a
  bare commit counts as a task boundary only when no unticked task is open, §6.5), a proxy for §6's
  "next, unrelated task", which no event shows.
- **DD-31** (lead's decision 2026-11-09, task 1.5; `claude plugin validate` on Claude Code 2.1.319)
  Four engine rules found in stage 1 change §1–§3 as follows. (1) The bundle holds a **copy** of
  `mods/navigator`, not a symlink: the engine refuses a `types` file that resolves outside the
  plugin folder and does not screen a hooks file behind a symlink. `make bundles` copies it and the
  gate compares bytes, as for the schema copy; the `data/` links stay links (DD-7). (2) The state
  types live in `types.d.ts`, which must be self-contained; `lib/state.ts` imports them from there.
  (3) The state atom is keyed by the plugin name, `meaningfy-navigator`, not `navigator`: only the
  owning plugin writes its state. (4) `register.tsx` passes `$` only to top-level functions.
  `.gitignore` un-ignores `mods/*/lib/` and `bundles/*/mods/*/lib/` (a global `lib/` rule hid
  them). `@types/node` is pinned beside `typescript` so the `lib/` tests type-check.
- **DD-32** (owner's hand check H-1, 2026-11-09) A hidden band leaves a single `⎈` button that
  brings it back folded: after pressing *Hide*, only `/navigator band` brought it back, which a
  person may not know. The folded and
  unfolded band carry *Unfold*/*Fold* and *Hide*; `/navigator band` still cycles. Scenario 8 holds:
  the line is unchanged and other mods' bands draw below.
- **DD-33** *(owner-decided 2026-11-09, stage 1 only)* Stage 1's challenge runs four subagents
  instead of seven: reviewer A covers L1 + L2, reviewer B covers L3 + L4 + L5, plus the adversarial
  tester and the checker. The stage diff is about 600 lines, half docs and tests, so five separate
  reads of it cost more than the extra depth is worth. `epic-delivery` allows combined lenses only
  for TINY and SMALL; this departs from it for this stage only. Stages 2 and 3 (drift, strict mode)
  decide their review set again. Raised for the skill as issue #148; the `code-reviewer` agent
  refuses a multi-lens brief, so the merged reviews run on general-purpose agents that load
  `meaningfy-code-review`.
- **DD-34** *(lead's decision 2026-11-09, stage-1 challenge: reviewer B = L3–L5, adversarial tester)*
  Accepted and fixed in stage 1:
  - `lib/change.ts`: CRLF files count as LF; an appetite name matches as a whole word; empty names
    are ignored; equal-length branch matches fall back to the most recent; the appetite names come
    from the workflow through `appetitesOf(workflow)` in `lib/` (task 2.1 routes it through
    `parseWorkflow`), so `register.tsx` only reads the file.
  - `lib/state.ts`: a subagent whose finish arrives before its spawn is recorded and merged (the
    engine may resolve the spawn after the subagent's turn completes); `revive` keeps a stored
    field only when its type matches the default; the model at session start rides on `Started`,
    not on a made-up `TurnEnded`; `settingsFrom(options)` and `BAND_DISPLAYS` hold the settings
    check. `NavState` also carries `sessionId` and `mainModel`, beyond §3.
  - `lib/view.ts`: the line is cut on whole characters.
  - `tools/bundle_gen`: `config.json` must parse to an object (`ValueError` naming the file); two
    workflow files with one name fail; `unreleased` skips `mods/node_modules`; the mod copy leaves
    out `*.test.ts`, so tests neither ship nor make the copy stale; `MOD_DATA` is a labelled
    shortcut (every mod gets navigator's data).
  - `register.tsx`: one clock read per signal; the `/navigator` handler fails open.
  Rejected: band items carrying their own actions (task 2.7 builds the buttons; no caller yet);
  splitting `_link_errors` (one caller, tested; revisit at the next skip rule); an explicit
  extension on the `../types` import (type-only, erased, the engine's own examples use this form).
  Noted for stage 2: fields added inside `Subagent` or `SkillUse` are not defaulted by `revive`'s
  shallow merge; stage 2 bumps `version` or defaults them.
  From reviewer A (L1 + L2), accepted: a mod copy never takes dotfiles and a symlink in a mod folder
  fails `make bundles` (a local `.env` must not reach the committed tree); the line and band drop
  control characters; the branch-substring match of DD-13 is a labelled shortcut; the `tool.call`
  hook of task 1.7 moves to stage 2, where the first gate signal needs it. Rejected: type-checking
  `register.tsx` in `make mods` (the engine types are not in the repo; it stays hand check H-5,
  run against the engine's `claude-code.d.ts`); narrowing the gate's skip of engine-written files
  to mod bundles (they are git-ignored; a force-add is not a path we guard).
- **DD-35** *(owner-decided 2026-11-09, after seeing H-1)* No repeats on screen. The status line
  carries only what nothing else shows: `navigator · <APPETITE> · <stage title> [<phase>] d/t · D/T ·
  N more open`, `· ● strict` only when strict is on; the appetite and the phase appear once known.
  It drops the `⎈` (Claude Code already prefixes the plugin name), the model (Claude Code shows it;
  supersedes DD-23) and `○ loose`. The folded band shows only running subagents by type, the last
  skill, gates and the warning count, and just its buttons when there is nothing to show; the
  unfolded band adds a stages row (`✓`/`●`/`○` per `##` group with its progress), the skill trail and
  the subagents, and later the rows of stages 2–3 and the mode, which is always visible there
  (amends DEC-5's "mode always visible"). The Mode action (task 3.7) is a session switch both ways,
  loose ⇄ strict, superseding DD-26: switching a loose repo's session to strict only adds checks, so
  a person can try strict before committing the repo file. Repo strictness stays the repo file
  (DEC-5). Cost and tokens go in the unfolded band in stage 3, never in the line.
- **DD-36** *(lead, stage 2 build, Rule of Divergence on §6.2–§6.3 and §8)* Where the PLAN left
  the mechanics open:
  1. **Gate check points.** A `skill` gate is checked on *entering* its phase (a precondition:
     clarity before apply); a `command` or `file` gate on *leaving* it (it is about the phase's own
     work, so nothing could have passed on entry); a `consent` gate when its `before` command runs.
     §6.3 PD-3 said "on entering P" for all three.
  2. **No check on a session's first placement.** The phase a session starts in is placed, not
     entered: no enter or leave check runs for it, so a session opened mid-apply does not warn for a
     clarity run an earlier session made (the `$.store` memory of §5 is stage 3's).
  3. **`advanceOn` looks ahead.** A command that passes a gate of the current *or any later* phase
     moves to the phase after that gate's phase, only into a phase with no `enter`, so
     `terraform plan` in `read` reaches `card`; an answered consent enters the next phase holding a
     consent gate. Build-tier phases all have an `enter`, so its commands never move it.
  4. **`activate` semantics.** `openChange`, `change` and `interactive` are conditions that must
     hold; `skills`/`agents` are triggers, any of which activates. A variant with conditions only
     (brownfield) applies with no trigger. With no trigger yet, the workflow whose `activate` has
     `openChange` is the default (build-tier, named by data, not by the mod).
  5. **Warnings close themselves.** Running a warning's remedy skill removes it; a gate that passes
     removes its gate warnings. `Accept deviation` (stage 3) covers the rest.
  6. **Actions are submitted as typed.** A button runs `$.prompt.submit({text: '/<command> <args>',
     asUser: true})`, so the transcript shows the command as if typed (spec *Actions are
     commands*). Fold, Unfold and Hide stay direct state changes, the same as `/navigator band
     fold|unfold|hide|show`, so pressing them leaves no transcript noise.
  7. **`archived` predicate.** Not derived from the files in stage 2 (`shortcut:` in `holds`): the
     archive phase is entered by `openspec-archive-change`.
  8. **Old stored state.** `SkillUse.phase` and `Warning.remedy`/`owner` are new; a state stored by
     the stage-1 mod lacks them and every reader treats a missing one as `null`, so `version` stays 1.
- **DD-37** *(lead, task 2.9)* DEC-13's four host skills were right; keep them. Each file sits
  with the skill that owns the activity's method, and each phase names its own owner, so a file
  that spans skills (build-tier's explore/shape/plan belong to `epic-planning`, archive to
  `spec-stewardship`; architecting's elicit to `conceptual-modelling`; DevOps's triage to
  `service-reliability`) still cites rather than restates them. Moving the planning phases into an
  `epic-planning` file would split one workflow across two files and break the brownfield variant,
  which spans both. What writing them showed: the review set is the only rule text a file *owns*
  (DD-21), and the skills each gained one pointer line, no restated phases. Sales stays provisional
  (DEC-9) until a sales session tries it.
- **DD-38** *(lead, stage-2 challenge: reviewers A (L1+L2) and B (L3–L5), adversarial tester; the
  review set of DD-33 again)* Accepted:
  1. **Validation is total.** A `file` glob and every `planDrift.ignore` glob must compile in
     `globRegex`, so `reduce` never throws on a `FileTouched`; an `extends` file's gate references
     are checked after the merge, not before.
  2. **Placement.** `enter.change` may be one predicate or a list (any holds). Build-tier's apply
     takes `["tasks-partial", "tasks-no-design"]`, so a brownfield change is in apply at 0/3 and 3/3.
     Placement by files scans the whole workflow and maps a phase outside the active variant to the
     nearest earlier phase inside it. `proposal` holds while there is no `tasks.md` (a design
     without tasks is still shaping); `tasks-done` holds for `done >= total > 0`. With no predicate
     holding, the current phase stays.
  3. **Activation.** `openChange` only gates the default with no trigger: a build-tier skill with no
     open change places explore. A variant picked by a skill is dropped when a skill of the
     workflow fires that no variant matches; a variant change runs no leave checks (as a workflow
     change, DD-36).
  4. **Skipped phases are left.** When a command or a consent moves the phase forward over phases,
     each skipped phase runs its leave checks, so a consent answered before any dry run warns for
     the `dry-run` gate. The DevOps dry-run `match` becomes `terraform plan|ansible-playbook\b.*--check`.
  5. **Only the person consents.** `UserPrompted` comes only from `composer` and `bridge` origins
     (amends §5's "origin not plugin"); a background Bash call is not a `ToolRan`.
  6. **Staleness.** A skill gate goes stale when `design.md` changes, not `tasks.md` (ticking a box
     is not a PLAN change; amends DD-14's "PLAN files"). `planMtime` is `design.md`'s mtime.
  7. **Warnings.** A gate warning is cleared by its exact key; workflow errors are keyed by their
     text and replaced on each read; the band shows each warning's owning skill (spec *Process
     drift*); one module (`process-drift.ts`) mints and clears warning keys. A skill gate warning
     reads "has not run since its inputs changed" (no build-tier words in the mod).
  8. **Small.** `commandFor('')` resolves nothing; `validateRuns` skips a `{change}` line with no
     change and puts only a safe id (`[\w.-]+`) in it. `workflowOf`, `phasesOf` and a new
     `currentPhase` move to `workflow.ts`, so `view.ts` and `actions.ts` need no drift code. The
     lint's inline `skills:` rule allows a trailing comment, forbids quotes and checks only the key
     at entry level (`- skills:` or two spaces), never text inside a block string.
  9. **Docs.** stage-loop.md's stale "scaling table" pointer; the user guide on what each warning
     names and what clears it; strict mode marks the line only until stage 3; the schema pointer goes
     to `types.d.ts` and `lib/workflow.ts`; `mods.md`'s "Adding a check" names `navigate` for
     phase-boundary checks; long lines rewrapped.
  Rejected: a skill loaded before the workflows are read (start reads them first; no real order
  produces it); a workflow switch as a PhaseLeft (DD-36: changing activity is not leaving the
  phase; the phase resumes when the work comes back); the archive phase's own leave checks (the
  Archive check action of stage 3 runs them before archiving; the `archived` predicate stays a
  shortcut); compiling regexes once (a handful per event; a repo's patterns are its own trust
  domain, like its Makefile); `run` lines only in default files (the Validate button submits
  `/navigator validate`, whose answer lists every command it ran; the same trust as `make`);
  `$.command.run` instead of `$.prompt.submit` (the submission's `command` field shows the engine
  parses slash text; hand check H-6 confirms); splitting `workflowError` and the `owners` argument
  of `_dep_skills` (readable as is, one caller); one test file per module (`phase.test.ts` drives
  `process-drift.ts` and `actions.ts` through `reduce`, the way they run); a test that the
  duplicated `reviews` entries match (each entry is its appetite's wording, by DD-21).

## Risks / Trade-offs

- [Early-access mod API] → pinned tested version in the user guide; H-1..H-6 re-run on upgrade.
- [Symlinked single files inside a plugin may not survive desktop marketplace sync] → H-2 in
  stage 1; fallback in DD-7.
- [`.ts` import specifiers may not load in the engine] → H-0 in task 1.1; fallback in DD-7.
- [False alarms from heuristics] → loose by default; every warning is acceptable with a reason;
  shortcuts labelled.
- [The review set moves out of `SKILL.md` prose into data (DD-21)] → the file keeps the table's wording; a reader of the skill follows one pointer; TC-16 checks every appetite key is present.

## Open Questions

The owner decided the former questions on thresholds, bundle name, review-set source and JSON
files on 2026-11-08 (DD-1, DD-4, DD-9, DD-21). One note remains for the record, needing no answer:

1. The EPIC lists `code-principles-governance` for the thresholds; no requirement there fits (DD-27).
