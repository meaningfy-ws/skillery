<!-- PLAN (design half). PLAN = this file + tasks.md. Derived 2026-11-13 from the frozen EPIC;
     revised the same day after the attack (findings A-1..A-12, below). -->

> Derives from: EPIC `navigator-follows-the-work` (`proposal.md`, DEC-1..DEC-14); issues #185,
> #188, #148.

## Context

The `navigator` mod (`mods/navigator/`) turns Claude Code events into signals, reduces them into one
session atom (`NavState`, `types.d.ts`) and draws a status line and a band. Its I/O is in `io.ts`
and `register.tsx`, which have no tests; every decision is pure in `lib/` and unit-tested under
Node (`make mods` runs `mods/*/lib/*.test.ts`). This PLAN keeps that split: every new decision is a
pure `lib/` function, and `io.ts` only gathers its inputs.

What this PLAN builds on, checked in the mod API types (Claude Code `claude-code.d.ts`):

| Fact | Consequence |
|---|---|
| `$.session.repo().root` is "the main working tree's for a worktree" | the root cause of #185; never used for a root again |
| `$.session.root()` follows `/cd` and a worktree move, not a shell `cd` | the lead's start root |
| `$.session.cwd()` read inside a hook is that hook's agent's directory | a subagent's root |
| `tool.call` and `turn.complete` carry `agentId` (absent on the main loop) | per-agent attribution |
| `skill.prompt` carries no `agentId`, and fires for a `/name` typed, a `Skill` tool call, **and a skill preloaded into a subagent** | attribution by what is in flight (D-4) |
| `agent.spawn` carries `description`, `cwd`, `isolation` | a subagent's task, and its root when set |
| `session.start` does not name a main-loop agent | a lead session is recognised by its first skill load (named-workers D-15, kept) |

Today `repoRoot()` (`io.ts:24`) feeds every repository read and the relative path of every edit;
`readChange` (`lib/change.ts:59`) picks by branch substring, else by mtime.

## Goals / Non-Goals

**Goals:** the four outcomes of the EPIC's solution outline, one per stage, each shippable alone.

**Non-Goals:** the EPIC's no-gos. Also: no behind-upstream warning (#185's fallback, not needed once
the worktree is followed); no main-loop agent detection beyond D-15; no automated runner for the
Gherkin files (in this repository they are walked by hand, `tests/features/*.feature` header).

## Decisions

New choices made while planning; settled ones are cited by their DEC id.

- **D-1 — The atom (DEC-1, DEC-4).** `NavState` gains `root: { path; common; branch } | null`
  (the lead's), `lastChangeId: string | null`, `mergedBranches: string[]`,
  `skillCalls: { name; agentId: string | null; at }[]` (in flight) and
  `pendingSpawns: { toolUseId; type; at }[]`. `Subagent` gains `root: string | null` and `skills: string[]`;
  its `description` is its task. `common` is `git rev-parse --git-common-dir`, absolute: two
  working trees belong to one repository exactly when their `common` paths are equal. `revive`
  keeps an older atom readable. Rejected: one `Record<agentId, Entry>` including the lead (churn
  with no gain).
- **D-2 — The lead's root (DEC-2; A-3, A-12).** A pure `lib/root.ts` decides; `io` gathers.
  - Start: `git -C $.session.root() rev-parse --show-toplevel --git-common-dir --abbrev-ref HEAD`.
  - On **every** lead `Edit`/`Write`/`NotebookEdit`: the same command in the file's directory
    (memoised per directory for the session in `io`, a cache of git facts, not state). If its
    toplevel differs from `root.path` and its `common` equals `root.common`, a `RootFollowed`
    signal re-roots the lead **before** the edit's relative path is computed; the edit then counts
    against the new root. This covers a worktree inside the main checkout (`.claude/worktrees/…`)
    and one beside it (`../repo-topic`).
  - A write outside any repository or into another repository changes nothing; a subagent's write
    never re-roots the lead.
  - A subagent's root: `AgentRooted { agentId, root }`, sent on the subagent's first `tool.call`,
    with `root` = `git rev-parse --show-toplevel` of `$.session.cwd()` read in that hook, else the
    spawn's `cwd`; idempotent per `agentId` (id `rooted:<agentId>`).
  - At each main turn end, a root whose directory is gone falls back to the start root.
  - `/clear`, `/resume` and `/branch` (`SESSION_MOVES`) carry `root` into the new atom; the
    workflows are re-read from the new root on every re-root, so a worktree's own
    `docs/navigator/` overrides apply.
- **D-3 — Matching a branch to a change (DEC-3; A-5).** A change id matches a branch when it
  occurs bounded by the start, the end, `/` or `-` on both sides (`(^|[/-])<id>([/-]|$)`); the
  longest id wins; on equal length, the one named later in the branch; then alphabetical. Never
  mtime. Examples: `feature/tenant-dump-restore` → `tenant-dump-restore`;
  `feature/atomic-commit-stage-1` → `atomic-commit`; `docs/shape-navigator-follows-the-work` →
  `navigator-follows-the-work`; `docs/shape-backlog-2026-11-12` → none; `prefix-x` does not match
  `fix`. An **archived** folder (`archive/<date>-<id>`) is matched only when its id equals
  `lastChangeId`: the session keeps following a change it just archived, and an unrelated branch
  never lands on an old archived change. On an archived change, Accept and Archive check are
  disabled.
- **D-4 — Whose skill load is it (DEC-4, DEC-7; A-2).** `register.tsx` adds a `skillCalls` entry
  before `next(e)` of a `Skill` tool call (with its `agentId`, `null` for the lead) and removes it
  after; `agent.spawn` adds a `pendingSpawns` entry keyed by its `tool_use_id` before `next(e)`
  and removes it when the spawn with that `tool_use_id` resolves, onto that subagent. A
  `skill.prompt` is credited, in order: to the oldest in-flight `Skill` call with that name; else
  to the newest pending spawn, or else the newest *just-started* subagent (running, no tool call
  yet), as a preload; else to the lead (a person's `/name`). A subagent's load enters only its
  entry: it activates no workflow, enters no lead trail, passes no skill gate. *Spike 1.1 confirms
  which of the pending and just-started cases preloads hit; the rule covers both.*
- **D-5 — Merged (DEC-5; A-1).** `gh pr view <branch> --json state,headRefName` runs, with a
  10-second timeout, at session start, after a `gh pr merge` that ran ok, and on every re-root or
  change switch. `MERGED` for the followed branch adds the branch to `mergedBranches`. The
  predicate `merged` holds when the followed branch is in `mergedBranches` **and all tasks are
  ticked**. So a stage's merge, on its own stage branch with tasks still open, moves nothing; the
  next stage's branch is not in the list. `gh pr merge --auto` exits ok without merging; it still
  triggers the re-check, which then answers `OPEN` and adds nothing. `epic-delivery.workflow.json`:
  `archive.enter.change` = `["archived", "merged"]`.
- **D-6 — Archived (DEC-5).** The predicate `archived` holds when `change.archived` (D-3),
  replacing the hard-coded `false` (`lib/change.ts:91`).
- **D-7 — Release by command (DEC-5, Q-19; A-4).** `Activate` gains `commands?: string[]`
  (regexes) and `Trigger` gains `command`. `ToolRan` checks activation **before** its
  "no workflow" return. When a command activates a workflow, the reducer then passes that same
  command through the new workflow's gates and advances, so `gh release create v1.0.0` lands in
  the phase it passes, not in `branch`; phases before an activation are not "left", so
  no `onLeave` gate warnings are raised for them. The release workflow's own activation regexes
  need a `v<digit>` or a `release/`/`hotfix/` token: a `release/` or `hotfix/` branch created;
  `gh release create v<d>`; `git push … v<d>…`. `git push --follow-tags` and a local `git tag`
  do not activate. While release is active and `meaningfy-release` has not loaded, a tier-1
  warning `process:missing:release:meaningfy-release` names it as its remedy.
- **D-8 — Hand-off (DEC-6; A-6).** When the followed change id differs from `lastChangeId`
  (including id → none and none → another id after a first read): `gates` reset, change-scoped
  warnings dropped (`process:gate:`, `process:missing:`, `process:elsewhere:`,
  `process:second-check:<old id>`, `plan:`), `accepted` re-read, `workflow`, `phase` and
  `signalPhase` set to `null`, then `navigate` re-selects and places from the new change's files
  (placed, not entered). With no change, epic-delivery is not selected by default. The first read
  of a session only sets `lastChangeId`.
- **D-9 — The unused check (DEC-7; A-8).** `register.tsx` sends a `ToolUsed { agentId? }` for every
  tool call except `Skill` (today only Bash makes a lead event). `turnEvents` entries carry
  `agent` (`'main'` or the id) and include `spawn`. A skill is used when a later `tool` or `spawn`
  event of the same agent follows; another `Skill` call is not use. The lead's skills are judged
  at the main turn's end, which clears only the lead's events; a subagent's at its
  `SubagentFinished`, which clears its own. Key `hygiene:unused:<agent>:<skill>`.
- **D-10 — Severity tiers (DEC-9; A-11).** A pure `tierOf(key)` in `lib/view.ts`:
  1 `workflow:error`, `process:gate:`, `process:missing:`, `process:elsewhere:`,
  `process:external:` (process drift); 2 `plan:`; 3 `process:inline`, `process:model`,
  `process:overspawn`, `process:second-check`; 4 `hygiene:` except `hygiene:unused:`;
  5 `hygiene:unused:`. Unknown prefixes rank 3; within a tier, newest first.
- **D-11 — The band (DEC-8, DEC-10; A-11).** Folded:
  - *now*: phase, stage short title and `done/total`, then up to two running subagents as
    `<task> → <type> (<elapsed>)` and `+n`, `<type>` without its plugin prefix. With no change and
    no workflow: `no change for branch <branch>` or `no open change`.
  - *next*: `next: <the Next step command>` with **Next step**, plus **Back on track** and the
    hygiene button when they apply.
  - *warning*: `⚠ <top message> · n more`, where `n` counts the other open warnings of tiers 1–4;
    tier 5 is counted only in Details.
  - buttons: **Details**, **Hide**.
  Details: `reading <root.path, ~ for $HOME> · <branch>`; stages; phases with each gate's state
  (`clarity ✓ 9.1`, `acceptance ·`), as today's folded gates; appetite (tasks, groups, reviewers,
  tokens; no `$`); skills (the lead's, bare names, grouped by phase); subagents grouped by type
  (`implementer ×3 done · 5.2M tokens · 1 running`, a model only when it differs from the
  parent's); warnings in tier order, each with **Accept** labelled by its message (the command
  still carries the key); mode; **Reconcile EPIC** (kept, as the live specs require), **Archive
  check**, **Validate**, **Review**, **Mode**, **Less**.
- **D-12 — Review set by stage size (DEC-12; A-7, A-9).** Each `reviews` entry of MEDIUM and above
  gains `"small_stage": { "max_added_lines": 600, "reviewers": 2,
  "lenses": [["L1","L2"],["L3","L4","L5"]] }` (`lib/workflow.ts` `reviewError` accepts and checks
  it). 600 is #148's recorded case (a ~600-line stage judged redundant at five reviewers). The lead
  may use it when the stage's added lines are at or under the limit and it judges the risk low;
  the risk is the lead's judgement, not a rule, and the decision (`D-n`) it records under a
  `## Delivery decisions` heading of `design.md` states the size and the reason. One pure
  `reviewQuota(state)` gives the expected reviewers: the small set when the plan read's added
  lines (`added.length` from `parseDiffAdded`, `lib/plan-drift.ts`, of `git diff -U0
  <base>...HEAD`, base = the merge base with `origin/develop`, as `readPlanSignal` reads it today)
  are at or under the limit, else the full set; a `truncated` read (over the 2000-line cap)
  counts as over. The band, `overspawn` and strict's `decideSpawn` all use it.
- **D-13 — The reviewer's brief (DEC-13; A-7).** `code-reviewer` accepts several lenses when the
  review set authorises them: TINY and SMALL by the workflow's own `lenses` (the brief names the
  appetite), or a small stage by a cited `D-n` that the change's `design.md` records under
  `## Delivery decisions` with those lenses, which the agent reads to confirm. Otherwise it refuses
  as today. Its description changes, so it ships with trigger probes.
- **D-14 — #188 (DEC-14).** One Gherkin scenario per default workflow naming a lead worker, and a
  unit test per workflow that its lead's primary skill activates it. The lawyer's live trial is a
  close-stage task, reported through `skillery-feedback`.
- **D-15 — Delivery decisions do not stale the PLAN (A-7).** The clarity gate goes stale on a PLAN
  change (`gatesAfterPlan`, `planMtime`). `io` now reads `design.md` and gives a hash of its text
  without the `## Delivery decisions` section (`planHash`); a skill gate goes stale when that hash
  changes, not on mtime. Recording a review decision therefore does not raise the clarity warning.

## Algorithm / approach

### Per main turn end (stage 1)

```
root   = state.root (D-2)                               // never session.repo()
open   = root/openspec/changes/* minus archive/         // proposal.md required
arch   = root/openspec/changes/archive/<date>-<id>      // only lastChangeId may match (D-3)
branch = root.branch, re-read
change = matchOpen(branch, open) ?? matchArchived(branch, arch, lastChangeId) ?? null
if change.id ≠ lastChangeId → hand-off (D-8)
accepted, plan drift, clean tree, planHash               // all in root
```

A subagent's events use its own root only to make its edits relative; every change read uses the
lead's root.

### Worked example 1 — #185 and session 3

1. A session starts in `/r` (branch `docs/shape-backlog`); open: `aggregate-events` (no tasks),
   `tenant-dump-restore`. Line: `no change for branch docs/shape-backlog`; no change warnings.
2. The lead edits `/r/.claude/worktrees/tdr/mod/x.py`. Its directory's toplevel is
   `/r/.claude/worktrees/tdr` (≠ `/r`), `common` `/r/.git` (=) → `RootFollowed` before the edit
   is recorded; the edit counts as `mod/x.py`. At the turn end: `tenant-dump-restore`, 4/8,
   stage 3; hand-off from none; Details: `reading ~/r/.claude/worktrees/tdr ·
   feature/tenant-dump-restore`.
3. The same with a sibling worktree `/r-tdr`: same `common`, same outcome.
4. `/tmp/notes.md` (no repository) or `/other/a.py` (other `common`): no re-root.
5. `/clear`: the new atom keeps `root`, so the band stays on `tenant-dump-restore`.

### Worked example 2 — session 2 and a staged EPIC

1. A staged EPIC on `feature/x-stage-1`, tasks 3/10. `gh pr merge 41` → `MERGED` → branch added;
   tasks not all ticked → `merged` does not hold → phase stays `apply`. Stage 2 on
   `feature/x-stage-2`: not in the list.
2. Session 2: `boundary-owned-hint`, all tasks ticked → `accept`. `gh pr merge 85` → `MERGED` →
   `merged` holds → `archive`.
3. The folder moves to `archive/2026-11-13-boundary-owned-hint`; `lastChangeId` matches → still
   followed, `archived`, phase `archive`; Accept disabled.
4. The lead edits in the `ci/release-pipeline` worktree → re-root → change `release-pipeline` →
   hand-off: placed from its files (`apply`, 2/5), no leave or enter warnings.
5. `git switch -c release/0.2.0` → release activates (D-7) and passes `cut`, so the phase is
   `bump`; `meaningfy-release` not loaded → tier-1 warning naming it.

### Worked example 3 — the band of session 3, after

```
apply · 3 Dump and restore 0/2 · Task 3.1 dump and restore → implementer (4m)
next: /opsx:apply                                                    [Next step]
⚠ clarity-gate has not run since its inputs changed · 1 more         [Details] [Hide]
```

### Test cases

Unit tests (`mods/navigator/lib/*.test.ts`); tasks cite these ids. Integration checks by hand:
tasks 3.7 (band on both surfaces) and 4.8 (the lawyer's trial).

| Id | Function | Input | Expected | Edge |
|---|---|---|---|---|
| TC-1 | `matchOpen` (D-3) | `feature/tenant-dump-restore`; open `tenant-dump-restore`, `aggregate-events` | `tenant-dump-restore` | — |
| TC-2 | `matchOpen` | `feature/atomic-commit-stage-1`; open `atomic-commit` | `atomic-commit` | suffix after the id |
| TC-3 | `matchOpen` | `docs/shape-navigator-follows-the-work`; open `navigator-follows-the-work`, `navigator` | `navigator-follows-the-work` | longest wins |
| TC-4 | `matchOpen` | `docs/shape-backlog-2026-11-12`; open `aggregate-events`, `release-pipeline` | none | no mtime fallback |
| TC-5 | `matchOpen` | `prefix-x`; open `fix` | none | inside a word |
| TC-6 | `matchArchived` | `fix/navigator-band`; archive `2026-11-09-navigator`; `lastChangeId` null | none | old archive (A-5) |
| TC-7 | `matchArchived` | `feature/boundary-owned-hint`; archive `2026-11-13-boundary-owned-hint`; `lastChangeId` = it | followed, `archived` | — |
| TC-8 | `decideRoot` (D-2) | edit top `/r/.claude/worktrees/tdr`, common `/r/.git`; root `/r` | re-root | inside the checkout (A-3) |
| TC-9 | `decideRoot` | edit top `/r-tdr`, common `/r/.git` | re-root | sibling (#185) |
| TC-10 | `decideRoot` | edit top `/o`, common `/o/.git` | no change | other repository |
| TC-11 | `holds('merged')` (D-5) | branch merged, tasks 3/10 | false | stage merge (A-1) |
| TC-12 | `holds('merged')` | branch merged, tasks 10/10 | true | — |
| TC-13 | `tierOf` (D-10) | `process:gate:x`, `process:external:y`, `plan:outside:z`, `process:overspawn`, `hygiene:context`, `hygiene:unused:main:s`, `foo:bar` | 1, 1, 2, 3, 4, 5, 3 | unknown prefix |
| TC-14 | `creditSkill` (D-4) | `skill.prompt` with a lead `Skill` call in flight / a pending spawn / nothing | lead / subagent / lead | preload (A-2) |
| TC-14b | `creditSkill` | `skill.prompt`, no call in flight, no pending spawn, a subagent running with no tool call yet | that subagent | just-started preload |
| TC-14c | `creditSkill` | two subagents' `Skill` calls for one skill in flight, then two `skill.prompt` | the older call first, then the newer; never the lead | concurrent loads |
| TC-15 | `reviewQuota` (D-12) | VERY LARGE, added 600 / 601 / truncated | 2 / 5 / 5 | at the limit |

### Idempotency

Every new signal carries an id (`root:<tool_use_id>`, `skillcall:<tool_use_id>`,
`merged:<branch>:<turn>`, `used:<tool_use_id>`) and the reducer's `seen` list drops a repeat.
`RootFollowed` to the current root is a no-op; a hand-off compares ids, so a repeated
`ChangeRead` does not reset twice; `mergedBranches` is a set.

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Call `$.session.repo()` for a root | `state.root` (D-2) | it is the main working tree's for a worktree (#185) |
| Decide "elsewhere" by a path prefix | compare toplevel and `--git-common-dir` | a worktree may lie inside or beside the main checkout (A-3) |
| Record an edit, then re-root | re-root first | the first edit would miss its file gate (A-3) |
| Fall back to the most recent change, or to any archived one | `none`, or `lastChangeId` only | it is whichever session wrote last; old archives match loosely (A-5) |
| Treat a stage's merge as the change's | `merged` needs all tasks ticked | stages merge one by one (A-1) |
| Credit an unattributed `skill.prompt` to the lead | in-flight call, then pending spawn, then lead | preloads are subagents' (A-2) |
| Hard-code release commands in `lib/` | `activate.commands` in the workflow file | workflows are data |
| Put decisions in `io.ts` | pure functions in `lib/` | `io.ts` has no test harness (A-10) |
| Persist anything outside the atom | keep it in `NavState` | DEC-1 |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| `$.session.root()` is not in a git repository | `git rev-parse` exits non-zero | `root: null`; line says `no repository`; no change reads |
| An edit's directory no longer exists | `git -C` exits non-zero | no re-root |
| The followed worktree is removed | its path is gone at the turn end | fall back to the start root; hand-off rules apply |
| Two open changes match the branch | D-3 tie rule | later in the branch, then alphabetical; never mtime |
| A branch matches an old archived change only | id ≠ `lastChangeId` | no change followed |
| A stage PR is merged with tasks open (A-1) | `merged` needs all tasks ticked | no phase move |
| `gh` missing, offline, unauthenticated or slow | non-zero exit or the 10 s timeout | branch not added; no warning (accepted, Q-16) |
| `gh pr view` answers for another branch | `headRefName` differs | ignored |
| A skill preloaded into a subagent (A-2) | no in-flight `Skill` call; a spawn pending or just started | credited to that subagent |
| Two subagents load the same skill at once | two in-flight calls with one name | oldest first; never the lead |
| A background subagent outlives the main turn | its `SubagentFinished` comes later | its skills judged then; the main turn clears only the lead's events |
| The lead edits two worktrees in one turn | two `RootFollowed` | the last wins at the turn end |
| A release command arrives with no workflow active (A-4) | activation checked before the no-workflow return | release activates, the command passes its gates |
| `git push --follow-tags` on a feature branch | no `v<d>` token | no activation |
| A malformed `small_stage` | `reviewError` | `workflow:error`, as any malformed file |
| A delivery decision is recorded in `design.md` | `planHash` ignores that section | the clarity gate stays fresh (D-15) |
| `/clear` mid-session (A-12) | `Started` from a session move | `root` carried over |
| A duplicate event | `seen` | ignored |

## Risks / Trade-offs

- **RISK-1 — The platform behaves unlike its docs or changes** (medium, medium: the band misleads;
  in strict mode a gate can block). Mitigation: spike 1.1 proves `root()`, a subagent's `cwd()`
  and the `skill.prompt` order for all three sources before stage 1 builds on them; every rule
  the facts feed is a pure, tested `lib/` function. Drift after release is accepted (Q-16).
- **RISK-2 — People move between worktrees without writing** (shell `cd`, reading only); medium,
  low. Details always names the checkout read. Accepted (Q-16).
- **RISK-3 — Strict mode acts on a wrong change** (low, high). Stage 1 ships first; strict uses the
  same `change`, so fixing the root fixes it.
- **RISK-4 — Field response** (Q-15): hide or disable the band; a PATCH release; the failure
  becomes a test.
- **RISK-5 — `gh pr view` adds latency** at start and after merges (low, low): one call, a 10 s
  timeout, never per turn.
- **Trade-off:** state stays in the atom (DEC-1): gates and phase are forgotten after `/clear`
  (the root is carried, D-2) and not shared by parallel sessions on one change.

## Attack findings (2026-11-13)

A fresh subagent attacked the first draft; every finding is folded in above.

| Id | Finding | Where handled |
|---|---|---|
| A-1 | A stage merge sent the EPIC to archive for good | D-5, matrix |
| A-2 | Preloaded skills credited to the lead | D-4, spike 1.1 (d), matrix |
| A-3 | A worktree inside the main checkout never followed; edit recorded before re-root | D-2, anti-patterns |
| A-4 | Release could not activate from no workflow; wrong phase and false gate warnings; `--follow-tags` | D-7, matrix |
| A-5 | Archived fallback matched old changes; Accept into a stray folder | D-3 |
| A-6 | Change → none not a hand-off | D-8 |
| A-7 | Merged lenses vs TINY/SMALL; decision stales the clarity gate; quota mismatch; id style | D-12, D-13, D-15 |
| A-8 | The lead's non-Bash tools are invisible to the unused check; per-agent clearing | D-9 |
| A-9 | Parser rejects `small_stage`, `merged`, `commands` | D-7, D-12, tasks 2.1, 2.4, 4.1 |
| A-10 | `io.ts` has no harness; no fixtures | Context, D-2, task 1.2b |
| A-11 | Reconcile EPIC and gate states dropped; tests that assert mtime; `process:external` tier | D-10, D-11, task 1.3 |
| A-12 | `/clear` forgets the root; overrides read from the launch root | D-2 |

## Open Questions

None blocking. Spike 1.1 settles D-4's event order; its fallback is specified.

## Delivery decisions

- **D-16 — Spike 1.1 (`evidence/spike-1.1.md`).** D-4 stands: a preload's `skill.prompt` fires
  after `agent.spawn` resolves, so the just-started-subagent case credits it. D-2 drops "else the
  spawn's `cwd`": `agent.spawn` carries neither `cwd` nor `isolation` on this build; a subagent's
  root comes only from `cwd()` in its first `tool.call`.
- **D-17 — #148 runs in parallel with stage 1.** Tasks 4.1 and 4.3–4.6 touch the review data,
  skills and agent, not the files stage 1 changes, so they run on their own branch
  (`feature/navigator-follows-the-work-review-sizing`, off `develop`) and ship as their own PR.
  Tasks 4.2 and 4.7–4.9 stay in the closing stage. Reason: the owner asked for parallel work.
- **D-18 — Corrections to D-2 found while building 1.4.** `git rev-parse --git-common-dir` prints a
  relative path against the directory it ran in, not the toplevel, so it is resolved against that
  directory. A session that starts outside any repository (`root: null`) follows its first edit
  into a repository. A `Write` into a directory that does not exist yet does not re-root (accepted:
  the next edit there does).
