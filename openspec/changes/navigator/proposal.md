<!-- STATUS: EPIC shaped 2026-11-08 from the owner's brainstorming session (inputs/seed.md,
     inputs/qa.md), round 2 answered the same day; readiness check applied, round 3 answered. Frozen.
     PLAN not derived. -->

# EPIC: navigator — see who runs what, where we are, and whether we drift

**Parents:** the owner's request and answers of 2026-11-08 (`inputs/seed.md`, `inputs/qa.md`); the
build-tier workflow in `docs/development/workflows.md`; the stage loop and appetite scaling owned by
`epic-delivery`; the appetite sizes owned by `epic-planning`; subagent dispatch and session hygiene
owned by `guardrails` (§5, §6); the DevOps operating model in `devops-engineer`, `ops-watch`,
`infrastructure-operations` and `service-reliability`; the hook-intent register `hooks.yaml`.

## Appetite

**VERY LARGE**, delivered in three stages (the owner accepts LARGE or VERY LARGE; with four
workflows, two surfaces and two documentation audiences it sits at the upper one). Several related
capabilities (workflow definitions, a status band, drift and hygiene checks), a new artifact type
and a new bundle; `governance`, `bundle_gen`, `make validate` and five owning skills are touched. If
the work starts restating skill rules inside the mod, adds an opencode renderer, builds a web
dashboard beyond the Board file, or grows the sales workflow past the simple one (DEC-9), it has
overrun this appetite.

**Stages.**
1. **See it.** The Mod artifact type, bundling, the plugin's settings, status line and band
   (folded/unfolded, show/hide), who runs what (agents, subagents, skill trail), and the proof of
   what draws on the desktop.
2. **Follow the workflow.** The workflow-file schema, the four defaults and repo overrides, phase
   and progress in the line, process drift, the core actions Next step and Back on track.
3. **Stay on plan and lean.** Plan drift, Reconcile EPIC, Archive check, Accept deviation, strict
   mode, hygiene and cost signals, the remaining actions, user and developer guides complete.

**Cut line** if the work runs over: Board, Copy status and Report to skillery go first, then the
desktop-specific polish; the core four actions, the two drift kinds and the docs stay.

## Why

While an agent works, the person beside it cannot see what the method says should be happening:
which agent is driving, which subagents run and what they cost, where the EPIC stands against its
PLAN, which skills fired and which should have. Two failures follow and are found late: the
**workflow is skipped** (a gate or skill never runs) and the **work drifts from the plan** (often
through human edits), so an EPIC is archived that no longer describes what was built. Session
hygiene and token cost are rules in `guardrails` that nothing prompts at the right moment. Claude
Code now lets a plugin observe these events and draw a band above the prompt; `ponytail` shows the
pattern works.

## Solution outline

**One Claude Code plugin in skillery, `navigator`: it observes, shows, warns, and — when asked —
steers.** Logic stays in the skills; the plugin reads, records and calls the person's own commands.

**Status line and band, different jobs.**

| Where | Shows |
|---|---|
| **Status line** (always) | Where am I: change id · appetite · phase and progress · driving agent · mode (`● strict` / `○ loose`). Enough on its own when the band is hidden. |
| **Band, folded** (one line) | Now: running subagents, last skill, gate state (validate ✓ / stale, clarity score), warning count. |
| **Band, unfolded** | Stage-loop progress, skill trail, subagent list (type, model, tokens), appetite vs actual, open warnings, actions. |

The band and the status line are each shown and hidden by a command, for the session; their
defaults, the mode and the whole plugin are set once in the plugin's settings (the Claude Code
config menu); no hotkeys. Turning navigator off entirely is uninstalling or disabling the plugin,
documented.

**Both Claude Code surfaces.** In the **CLI** the band draws above the prompt and the line pins under
it; an optional snippet puts the same line in a person's own `statusLine` script. In the **desktop
app** the band draws natively (the mod API draws per surface: terminal, desktop, VS Code); the
desktop has no `statusLine` script, so what the pinned line shows there is proven in stage 1, and if
it does not show, the folded band carries it. Both are checked by hand on both surfaces (DEC-14).

**Workflows as data that point to their owners.** Each default workflow is a small file kept *next
to the skill that owns the method*: its phases, the owning skill of each phase, the skills expected
to run, the gates, and the review set per appetite. It cites; it never restates. A repo adds or
overrides workflows in its own docs. First set: **build-tier EPIC delivery** (`epic-delivery`),
**architecture and modelling** (explore, elicit, decide; `architecture`, `conceptual-modelling`,
`system-architect`, `conceptual-modeller`), and **DevOps** (its existing modes: interactive
intervention, incident, check-up, unattended named operation; `devops-engineer`, `ops-watch`,
`infra-reviewer`), and a **simple sales** workflow, marked provisional while the sales method is
in progress: research and qualify (`sales-accounts`, `sales-qualification`) → meeting plan and
follow-up (`sales-conversations`) → estimate and offer (`estimation`, `proposal-writing`,
`proposal-writer`) → pipeline kept true (`sales-pipeline-custody`, `sales-operations`,
`sales-agent`). Exploratory and brownfield come as variants of build-tier.

**What it detects.**

- **Process drift** — the workflow is not respected: an expected skill or gate did not run for the
  phase; a skill ran that belongs elsewhere; an external skill did a job a Meaningfy skill owns;
  subagent rules from `guardrails` broken (spawned without paying, wrong model, no second check,
  more reviewers than the appetite calls for). → *fall back in line.*
- **Plan drift** — what was built differs from the EPIC/PLAN: work outside the tasks, tasks ticked
  without matching change, decisions taken in code that `design.md` does not record. → *update the
  EPIC/PLAN before archiving.*
- **Hygiene and cost** — context and token use against `guardrails` §6: prompts *compact now* or
  *fresh session* only at a safe point (phase boundary right after a commit), never mid-step; flags
  oversized subagent reports and loaded-but-unused skills. The thresholds ("high context use", "an
  oversized report") are rules, so `guardrails` gains them (§5, §6); the mod reads them, never
  holds them.

**Two modes.** **Loose** (default): observe, show, warn; never blocks. **Strict** (opted into per
repo, DEC-5): adds phase reminders to the agent's instructions — their text taken from, or citing,
the workflow file and its owning skill — blocks a commit or archive while drift is open, and stops
or corrects a subagent spawn that breaks the appetite's budget or the model rule; every block names
the reason and the way out. A person can drop to loose for the session in one action.

**Actions** run the same commands a person types. Core: **Next step**, **Reconcile EPIC**
(`openspec-update-change` then `clarity-gate`), **Back on track** (run the skipped skill/gate),
**Archive check** (plan drift + process drift + gates in one report). Also: Validate, Mode,
Fold/Hide, Accept deviation (records why a step was skipped in the change), Compact now / Fresh
session, Review (the lens set for the appetite), Board (per-EPIC ledger across sessions), Copy
status, Report to skillery (`skillery-feedback` with the evidence; a misfire becomes a
trigger-probe candidate).

**What the EPIC must prove** (draft scenarios for `bdd-gherkin`; R2-4):

1. In a repo with an open change, the status line shows its id, appetite, phase and task progress;
   with none, it says so and stays quiet.
2. A subagent spawned during *apply* appears in the band with type and model, and leaves it with
   its token cost when it finishes.
3. During *apply*, a commit with no `test-driven-development` run raises a process-drift warning; in
   strict mode the commit is blocked with the reason and the way out; in loose mode it is not.
4. A file changed outside every task of `tasks.md` raises plan drift; **Archive check** fails until
   the EPIC/PLAN is reconciled or the deviation recorded.
5. A MEDIUM EPIC that ran five lenses and no checker shows "second check missing"; a SMALL EPIC with
   five lenses shows "over-spawn".
6. At a phase boundary right after a commit with high context use, the band offers *compact now*;
   mid-step it does not.
7. A repo's own workflow file overrides the default of the same name; a malformed one is reported,
   not silently ignored.
8. Hiding the band leaves the status line complete; ponytail's band, when present, still draws.
9. Hiding the status line removes it; the setting chosen in the config menu is the default the
   next session starts with.
10. Scenarios 1–3 and 8 hold on the desktop surface as on the terminal.
11. In a DevOps session, the line shows the intervention kind and its phase; an apply with no
    consent card answered raises process drift. A sales session shows the sales phase likewise.
12. In strict mode, a blocked commit is unblocked by *drop to loose* for the session, and the next
    session starts strict again.
13. *Accept deviation* records the reason in the change; *Archive check* then passes with the
    deviation listed. *Reconcile EPIC* and *Report to skillery* each run their command, visible in
    the transcript as if typed.

**Documented for two audiences.** *Users* (CLI and desktop): install, what the band and line show,
the two modes, every action, show/hide, configuration, disable/uninstall, a worked example of a
drift caught and fixed. *Developers*: the Mod type, the mod's structure and state contract, the
workflow-file schema and how a repo adds its own, adding a check or an action, checking by hand on both
surfaces, how bundling renders it.

## Key decisions

- **DEC-1**: workflows are data that **cite** owning skills; default ones live next to their owning
  skill, repo ones in the repo's docs. Reason: single source of authority; rejected: one central
  workflow file restating phases (would drift from the skills).
- **DEC-2**: a **fifth artifact type, Mod**, home `mods/<name>/`; rule: *a mod observes, displays
  and calls commands; it carries no method*. Reason: a TSX module is none of skill/agent/doc/binding;
  rejected: hiding it in `tools/` or in a skill's `scripts/`.
- **DEC-3**: the mod ships through `bundles.yaml` in exactly one bundle (new, activity-named; name
  with R2-1) and `make bundles` renders it as a symlink plus the bundle `plugin.json`'s `hooks` and
  `types`, as it does for skills. Reason: one bundling path, existing drift gate; rejected: a
  hand-written plugin folder.
- **DEC-4**: **Claude Code only, CLI and desktop app.** opencode is a recorded, deliberate gap in
  the compatibility matrix; reusing the status line there is allowed, not required. Reason: the
  owner's call; mods exist only on Claude Code, and draw on each of its surfaces.
- **DEC-5**: **loose by default, strict opt-in per repo**, mode always visible, drop-to-loose always
  available. A repo opts in by declaring `mode: strict` in its own workflow file in its docs, so
  everyone in that repo gets the same mode with no new config file (R3-1). Each strict rule is registered in
  `hooks.yaml` with its provenance skill under a new Claude-only binding mechanism, `mod`; opencode
  gets a recorded gap, not a rendered hook. Reason: steering surprises people unless it is chosen
  and visible.
- **DEC-6**: **actions are commands** a person could type; the mod holds no decision logic beyond
  matching events to workflow phases. Reason: ponytail's proven pattern; keeps the method in skills.
- **DEC-7**: band and status line **carry different information**; no hotkeys. The owner's answers 3, 4.
- **DEC-8**: drift has two kinds with two remedies — process drift → back in line; plan drift →
  reconcile the EPIC/PLAN before archive. Reason: the owner's answer 9, 11.
- **DEC-9**: sales gets **one simple, provisional workflow** built only from the existing sales
  skills and agents; it is revised when the sales method settles. The owner's round-2 answer
  (reverses answer 7's "to be decided").
- **DEC-10**: **toggles by command, defaults by settings.** Band and status line each have a
  show/hide command for the session; the plugin's `userConfig` holds their display defaults,
  editable in the config menu. Reason: the owner's round-2 answer 3; rejected: a repo file for
  display choices (they are per person). The mode is a repo matter (DEC-5), not a display default.
- **DEC-11**: **documentation is part of done**, for users (CLI and desktop) and developers, as
  listed in the outline. Reason: the owner's round-2 answer 3.
- **DEC-12**: name **`navigator`**. The owner's round-2 answer 1.
- **DEC-13**: the four default workflow files sit in one host skill each: build-tier in
  `epic-delivery`, architecting and modelling in `architecture` (citing `conceptual-modelling`),
  DevOps in `infrastructure-operations` (citing `service-reliability` for incidents and unattended
  operations), sales in `sales-operations`. Reason: the skill that already narrates the whole
  activity hosts it; the lead's call, accepted by the owner "for now" (R3-2) — revisit if a
  host turns out wrong in stage 2.
- **DEC-14**: **tests stay light.** `make validate` gets the type-check, unit tests of the mod's
  pure logic, and the workflow-file schema check. End-to-end and integration tests, and anything
  needing the Claude Code CLI (`claude plugin validate`, `claude plugin test`), are optional and
  run by hand; no CI job depends on them. Reason: the owner's round-3 answer.

## Rabbit-holes

- Precise plan-drift detection. Matching diffs to tasks will be heuristic; aim for useful warnings
  with few false alarms, not proof. Shortcuts are labelled with their limit.
- Reading transcripts. Prefer events; read a transcript only where no event carries the fact.
- Ponytail parity. Copy the pattern, not the features (reuse %, test counts are ponytail's job).
- Board as a product. A generated local file is enough; no server, no webhook.
- Global keyboard shortcuts — dropped.
- The mod API is marked early access and may change between Claude Code releases; pin the version
  the mod is tested on and re-test on upgrade.

## No-gos

- No opencode renderer for the band or the drift checks (DEC-4).
- No sales method in the workflow file: it cites the sales skills; it does not decide their open
  questions (DEC-9).
- No VS Code- or mobile-specific work; they get what the mod API draws by default, untested.
- No method in the mod: no rule text, thresholds or phase lists that a skill owns (DEC-2, DEC-6).
- No blocking in loose mode; no strict mode switched on by default.
- No editing of a person's own `settings.json` / `statusLine` by the plugin.
- No data leaves the machine (no webhook, no telemetry).
- No CI job for end-to-end, integration or Claude-CLI tests (DEC-14).

---

## What Changes

**New artifact type and bundling**
- `docs/development/governance.md`: the Mod type and its rule; `AGENTS.md` type table row.
- `mods/navigator/`: hooks module, state contract, band, status line, drift and hygiene checks,
  unit tests of its pure logic.
- `bundles.yaml` + `tools/bundle_gen`: mod membership; symlinked `hooks/`; `hooks`/`types` in the
  bundle `plugin.json`.
- `make validate`: type-check, the mod's unit tests, workflow-file schema check (DEC-14).

**Workflows**
- A workflow file schema and four defaults in their host skills (DEC-13): `epic-delivery`
  (build-tier with exploratory and brownfield variants), `architecture` (architecting and
  modelling), `infrastructure-operations` (interactive intervention, incident, check-up, unattended
  operation), `sales-operations` (simple, provisional; DEC-9).
- `docs/development/workflows.md`: points to the workflow files; explains repo overrides.

**Rules wired**
- `hooks.yaml`: strict-mode rules as intents with provenance (`epic-delivery`, `guardrails`,
  `spec-stewardship`) under the new `mod` mechanism (DEC-5).
- `spec-stewardship`: archive requires no open plan drift, or recorded deviations.
- `guardrails` §5, §6: the hygiene and cost thresholds the mod reads.

**Docs**
- `docs/environment/dual-cli/compatibility.md`: navigator as a Claude-only gap.
- User guide (CLI and desktop): install, band and line, modes, actions, show/hide, configuration,
  disable/uninstall, worked example (DEC-11).
- Developer guide: the Mod type, `mods/navigator` structure and state contract, workflow-file
  schema and repo overrides, adding a check or action, checking by hand on both surfaces, bundling.
- README entry-point row; CHANGELOG line; `make bundles`, `make skill-inventory`.

## Capabilities

### New Capabilities
- `session-navigation`: showing who runs what and where the work stands, through status line and
  band, with actions that call the person's commands.
- `workflow-definitions`: workflow files that cite their owning skills; defaults and repo overrides.
- `drift-detection`: process drift, plan drift, hygiene and cost signals; strict and loose modes.

### Modified Capabilities
- `catalogue-governance`: the Mod artifact type.
- `dual-cli-distribution`: a recorded Claude-only artifact type.
- `catalogue-architecture`, `catalogue-model`: mods in bundles; the workflow file as a skill asset.
- `subagent-dispatch`, `code-principles-governance`: `guardrails` gains the dispatch and hygiene
  thresholds (a rule change).
- `epic-delivery`, `build-lifecycle`: the build-tier workflow file; archive needs no open plan
  drift.
- `operations-practice`: the DevOps workflow file.
- `sales-method-ownership`: the provisional sales workflow file.

## Impact

- New `mods/` tree and a TypeScript type-check and unit tests in `make validate`; no Claude Code
  CLI in CI (DEC-14).
- One new bundle; four skills gain a workflow file; `spec-stewardship` gains an archive condition;
  `guardrails` gains thresholds.
- MINOR release.
