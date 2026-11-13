<!-- PLAN (design half). PLAN = this file + tasks.md. Derived 2026-11-13 from the frozen EPIC. -->

> Derives from: EPIC `navigator-follows-the-work` (`proposal.md`, DEC-1..DEC-14); issues #185,
> #188, #148.

## Context

The `navigator` mod (`mods/navigator/`) turns Claude Code events into signals, reduces them into one
session atom (`NavState`, `types.d.ts`) and draws a status line and a band. Its I/O is in `io.ts`
and `register.tsx`; every decision is pure in `lib/` and unit-tested under Node (`make mods`).

What this PLAN builds on, checked in the mod API types (Claude Code `claude-code.d.ts`):

| Fact | Consequence |
|---|---|
| `$.session.repo().root` is "the main working tree's for a worktree" | it is the root cause of #185; it is never used for a root again |
| `$.session.root()` follows `/cd` and a worktree move, not a shell `cd` | the lead's start root |
| `$.session.cwd()` read inside a hook is that hook's agent's directory | a subagent's root |
| `tool.call` and `turn.complete` carry `agentId` (absent on the main loop) | per-agent attribution |
| `skill.prompt` carries **no** `agentId` | a subagent's skill load is attributed through its `Skill` tool call (D-4) |
| `agent.spawn` carries `description`, `cwd`, `isolation` | the task of a subagent and its root when set |
| `session.start` does not name a main-loop agent (`--agent`) | a lead session is recognised by its first skill load (named-workers D-15, kept) |

Today `repoRoot()` (`io.ts:24`) feeds every repository read: open changes, branch, `tasks.md`,
`deviations.md`, the plan-drift diff, the clean-tree check, validate and archive check, and the
relative path of every edit. `readChange` (`lib/change.ts:59`) picks a change by branch substring,
else by mtime.

## Goals / Non-Goals

**Goals:** the four outcomes of the EPIC's solution outline, one per stage, each shippable alone.

**Non-Goals:** the EPIC's no-gos. Also: no behind-upstream warning (#185's fallback, not needed
once the worktree is followed); no main-loop agent detection beyond D-15.

## Decisions

New choices made while planning; settled ones are cited by their DEC id.

- **D-1 — Root shape in the atom (DEC-1, DEC-2, DEC-4).** `NavState` gains
  `root: { path: string; common: string; branch: string } | null` for the lead, and `Subagent`
  gains `root: string | null`, `skills: string[]` and keeps `description` as its task. `common` is
  `git rev-parse --git-common-dir` made absolute: two working trees belong to the same repository
  exactly when their `common` paths are equal. Rejected: a `Record<agentId, Entry>` for all agents
  including the lead (the lead's trail and gates already live at the top level; moving them is
  churn with no gain).
- **D-2 — Re-rooting the lead on a write (DEC-2).** On a lead `Edit`/`Write`/`NotebookEdit` whose
  file is outside `root.path`, `io` runs one `git -C <dir of file> rev-parse --show-toplevel
  --git-common-dir --abbrev-ref HEAD`. If `common` equals the current root's, a `RootFollowed`
  signal re-roots the lead. A write outside any repository or into another repository changes
  nothing. A subagent's write never re-roots the lead.
- **D-3 — Matching a branch to a change (DEC-3).** A change id matches a branch when it occurs
  bounded by the start, the end, `/` or `-` on both sides (`(^|[/-])<id>([/-]|$)`); the longest
  matching id wins. Examples: `feature/tenant-dump-restore` → `tenant-dump-restore`;
  `feature/atomic-commit-stage-1` → `atomic-commit`; `docs/shape-navigator-follows-the-work` →
  `navigator-follows-the-work`; `docs/shape-backlog-2026-11-12` → none of `aggregate-events`,
  `release-pipeline`; `prefix-x` does not match `fix`. With no open match, archived folders
  (`archive/<YYYY-MM-DD>-<id>`) are matched the same way; a match there gives
  `{ ..., archived: true }`. Otherwise `change: null` with `unmatchedBranch` set.
- **D-4 — A subagent's skill load (DEC-4, DEC-7).** `register.tsx` marks a `Skill` tool call as
  in flight (`SkillCallStarted { agentId?, name }`) before `next(e)` and clears it after. The
  `skill.prompt` handler consumes the oldest in-flight call with the same name and sends
  `SkillLoaded { agentId }`; with none in flight the load is the lead's (a person's `/skill`). A
  subagent's load goes to `subagents[i].skills` only: it never activates a workflow, never enters
  the lead's trail and never passes a skill gate. *This order is the stage-1 spike (task 1.1); if
  `skill.prompt` does not fire inside the tool call, the `Skill` tool call alone is the subagent's
  load and `skill.prompt` is ignored while any call is in flight.*
- **D-5 — The merged signal (DEC-5).** A new change predicate `merged`. `Change` gains
  `merged: boolean`. `io` asks `gh pr view <branch> --json state` for the followed branch at
  session start, after a `gh pr merge` that ran ok, and when the followed change changes; the
  answer `MERGED` sets it. The atom keeps it per change id (`merged: string[]`), so later reads
  do not undo it. `epic-delivery.workflow.json`: `archive.enter.change` becomes
  `["archived", "merged"]`.
- **D-6 — The archived signal (DEC-5).** The `archived` predicate holds when `change.archived`
  (D-3). Replaces the hard-coded `false` (`lib/change.ts:91`).
- **D-7 — Release by command (DEC-5, Q-19).** `Activate` gains `commands?: string[]` (regexes).
  `select()` treats a `ToolRan` whose command matches as a trigger, like a skill. The release
  workflow's `activate.commands`: the `cut` regex (a `release/` or `hotfix/` branch created), `gh
  release create`, and a pushed `v<digit>` tag (the `published` push alternative). A local
  `git tag` without a push does not activate. While the release workflow is active and
  `meaningfy-release` has not loaded, a tier-1 warning `process:missing:release:meaningfy-release`
  names it as its remedy (the existing remedy clearing applies).
- **D-8 — Hand-off (DEC-6).** On `ChangeRead` whose change id differs from the previous non-null
  one: `gates` reset to `{}`, change-scoped warnings dropped (`process:gate:`, `process:missing:`,
  `process:elsewhere:`, `process:second-check:<old id>`, `plan:`), `accepted` re-read for the new
  change, `phase` and `signalPhase` set to `null`, then `navigate` places the phase from the new
  change's files (placed, not entered: no leave or enter warnings). `null → id` (first read) is a
  placement as today, not a hand-off.
- **D-9 — The unused check (DEC-7).** `turnEvents` entries gain `agent: string` (`'main'` or the
  agent id) and a `spawn` kind. A skill is used when a later event of the same agent is a `tool`
  or a `spawn`. The lead's skills are judged at the main turn's end; a subagent's at its
  `SubagentFinished`. Key `hygiene:unused:<agent>:<skill>`; tier 5.
- **D-10 — Severity tiers (DEC-9).** A pure `tierOf(key)` in `lib/view.ts`, by prefix:
  1 `workflow:error`, `process:gate:`, `process:missing:`, `process:elsewhere:`;
  2 `plan:`; 3 `process:inline`, `process:model`, `process:overspawn`, `process:second-check`,
  `process:external`; 4 `hygiene:` except `hygiene:unused:`; 5 `hygiene:unused:`.
  Unknown prefixes rank 3. Within a tier, newest first.
- **D-11 — The band (DEC-8, DEC-10).** Folded:
  - *now*: phase, stage short title and `done/total`, then up to two running subagents as
    `<task> → <type> (<elapsed>)` and `+n`; `<type>` without its plugin prefix. With no change and
    no workflow: `no change for branch <branch>` or `no open change`.
  - *next*: `next: <the Next step command>` with **Next step**, plus **Back on track** and the
    hygiene button when they apply.
  - *warning*: `⚠ <top message> · n more` (tiers 1–4 counted; tier 5 counted only in Details).
  - buttons: **Details** (unfolds) and **Hide**.
  Details: `reading <root.path relative to $HOME>` and the branch; stages; phases; appetite
  (tasks, groups, reviewers, tokens; no `$`); skills (the lead's, bare names, grouped by phase:
  `apply: test-driven-development, systematic-debugging`); subagents grouped by type
  (`implementer ×3 done · 5.2M tokens · 1 running`, model shown only when it differs from the
  parent's); warnings in tier order, each with **Accept** labelled by its message; mode;
  **Archive check**, **Validate**, **Review**, **Mode**, **Less**. The `Accept` command still
  carries the key, so the transcript names it.
- **D-12 — Review set by stage size (DEC-12).** Each `reviews` entry of MEDIUM and above in
  `epic-delivery.workflow.json` gains `"small_stage": { "max_added_lines": 600, "reviewers": 2,
  "lenses": [["L1","L2"],["L3","L4","L5"]] }`. 600 is the recorded case of #148 (a ~600-line stage
  judged redundant at five reviewers). The lead may use it when the stage's added lines are at or
  under the limit and it judges the risk low, and records a `DD-` in `design.md` naming the size
  and the reason; above the limit or with risky logic, the full set runs. Tester and checker are
  unchanged. The navigator's quota shows `reviewers x/2` when the plan read's added lines are at
  or under the limit, else the full number.
- **D-13 — The reviewer's brief (DEC-13).** `code-reviewer` accepts a brief naming several lenses
  when it cites a decision id (`DD-n` or `DEC-n`) that the change's `design.md` records with those
  lenses; it reads `design.md` to confirm. Without such a decision, it refuses as today. Its
  description changes, so it ships with trigger probes.
- **D-14 — #188 (DEC-14).** One Gherkin scenario per default workflow that names a lead worker
  (the `workflow-definitions` requirement *Every default workflow has one lead worker*): a lead
  session whose first act is loading its primary skill shows that workflow. The lawyer's live
  trial is a close-stage task done by hand and reported through `skillery-feedback`.

## Algorithm / approach

### Reads per main turn end (stage 1)

```
root   = state.root?.path ?? gitTop(await $.session.root())    // never session.repo()
open   = list(root/openspec/changes/*) minus archive/          // proposal.md required
arch   = names(root/openspec/changes/archive/*) stripped of the date
branch = git -C root rev-parse --abbrev-ref HEAD
change = match(branch, open) ?? archivedMatch(branch, arch) ?? null     // D-3
accepted, plan drift, clean tree   all read in root
```

A subagent's events use its own root only to make its edits' paths relative; all change reads use
the lead's root.

### Worked example 1 — #185 and session 3

1. A session starts in `/r` (branch `docs/shape-backlog`), open changes `aggregate-events` (no
   tasks) and `tenant-dump-restore`. `root = /r`; no change matches → line: `no change for branch
   docs/shape-backlog`; no change warnings.
2. The lead edits `/r/.claude/worktrees/tdr/mod/x.py`. `git -C …` gives top
   `/r/.claude/worktrees/tdr`, the same `common` (`/r/.git`), branch `feature/tenant-dump-restore`
   → `RootFollowed`. At turn end the change read runs in the worktree: `tenant-dump-restore`,
   4/8, stage 3. Details: `reading ~/r/.claude/worktrees/tdr · feature/tenant-dump-restore`.
3. The same with a sibling worktree `/r-tdr` (#185's layout): same `common`, same outcome.
4. An edit to `/tmp/notes.md` (no repository) or `/other-repo/a.py` (different `common`): no
   re-root.

### Worked example 2 — session 2 (merge, archive, next change)

1. Followed: `boundary-owned-hint`, phase `apply`, tasks all ticked → `accept` (files).
2. `gh pr merge 85` runs ok → `gh pr view feature/boundary-owned-hint` → `MERGED` → `merged` holds
   → `archive` entered.
3. The change folder is moved to `archive/2026-11-13-boundary-owned-hint` on the same branch:
   D-3's archived match keeps following it with `archived: true`; phase stays `archive`.
4. The lead re-roots into the `ci/release-pipeline` worktree (an edit there): the change becomes
   `release-pipeline` → D-8 hand-off: gates and change warnings cleared, phase placed from its
   files (e.g. `apply`, 2/5), no leave or enter warnings.
5. The lead runs `git switch -c release/0.2.0` → the release workflow activates (D-7) in `branch`;
   `meaningfy-release` not loaded → tier-1 warning naming it.

### Worked example 3 — the band of session 3, after

```
apply · 3 Dump and restore 0/2 · dump and restore → implementer (4m)
next: /opsx:apply                                   [Next step]
⚠ clarity-gate has not run since its inputs changed · 1 more     [Details] [Hide]
```

### Idempotency

Every new signal carries an id (`root:<tool_use_id>`, `skillcall:<tool_use_id>`,
`merged:<change>:<turn>`) and the reducer's `seen` list drops a repeat, as today. `RootFollowed`
to the current root is a no-op. A hand-off is decided by comparing ids, so a repeated
`ChangeRead` does not reset twice.

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Call `$.session.repo()` for a root | `state.root`, else `$.session.root()` | it is the main working tree's for a worktree (#185) |
| Fall back to the most recent change | `change: null` with the branch named | it is whichever session wrote last (DEC-3) |
| Re-root on a subagent's write | re-root only on the lead's | a subagent in an isolated worktree would steal the lead's change |
| Decide a repository from a path prefix | compare `--git-common-dir` | a sibling worktree has no common prefix with the main checkout |
| Hard-code release commands in `lib/` | `activate.commands` in the workflow file | workflows are data (`workflow-definitions`) |
| Parse `design.md` DDs in the navigator to size the review | use the plan read's added lines | the navigator shows, the lead decides (DEC-12) |
| Persist anything outside the atom | keep it in `NavState` | DEC-1 |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| `$.session.root()` is not in a git repository | `git rev-parse` exits non-zero | `root: null`; line says `no repository`; no change reads |
| An edit's directory no longer exists (deleted file) | `git -C` exits non-zero | no re-root |
| A worktree is removed while followed | change read finds no `openspec/` or git fails | `root` falls back to `$.session.root()` at the next turn end; hand-off rules apply |
| Two open changes match the branch at the same length | D-3 tie | the one named later in the branch wins; ties of equal position go to the alphabetically first, never to mtime |
| `gh` missing, offline or unauthenticated | non-zero exit | `merged` stays false; no warning (accepted: rare, Q-16) |
| `gh pr view` names a PR of another branch | `headRefName` differs | ignored |
| `skill.prompt` fires outside the `Skill` tool call | spike 1.1 | the fallback in D-4 |
| Two subagents load the same skill at once | two in-flight calls with one name | consumed oldest first; both attributed to a subagent, never the lead |
| A background subagent outlives the main turn | its `SubagentFinished` comes later | its skills are judged then (D-9), not at the main turn's end |
| The lead edits two worktrees in one turn | two `RootFollowed` | the last write wins; the change read at turn end uses it |
| A duplicate event | `seen` | ignored |
| A release regex matches an ordinary command | a test per regex (task 2.4) | the regex list is data; a false match is fixed there |
| A workflow file sets `small_stage` without `reviewers` | workflow parse | a `workflow:error` warning, as for any malformed file |

## Risks / Trade-offs

- **RISK-1 — The platform behaves unlike its docs or changes** (medium likelihood, medium impact:
  the band misleads; in strict mode a gate can block). Mitigation: spike 1.1 proves `root()`,
  `cwd()` in a subagent's hook and the `Skill`/`skill.prompt` order before stage 1 builds on them;
  every API fact is pinned by a unit test of `io` through a fake `$`. Drift after release is
  accepted (Q-16): the issue loop handles it.
- **RISK-2 — People move between worktrees in ways the design does not see** (shell `cd` with no
  write; reading only). Likelihood medium, impact low: Details always names the checkout read.
  Accepted as a rare edge (Q-16).
- **RISK-3 — Strict mode acts on a wrong change during the transition** (low, high). Mitigation:
  stage 1 ships before any display work; strict decisions use the same `change`, so fixing the
  root fixes them.
- **RISK-4 — Field response** (Q-15): a person hides or disables the band; a PATCH release fixes
  the cause; the failure becomes a test.
- **Trade-off:** state stays in the atom (DEC-1), so gates and phase are forgotten after `/clear`
  and are not shared by parallel sessions on one change.

## Open Questions

None blocking. Spike 1.1 settles D-4's event order; its fallback is already specified.
