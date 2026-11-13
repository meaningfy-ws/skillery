# Navigator — see where the work stands

Navigator is a small add-on for Claude Code. It shows, while you work, which change you are on,
how far its tasks have got, which step of the Meaningfy workflow you are in, and which skills and
subagents are running. When a step of the workflow is skipped, it says so and offers the command
that puts it right. It draws in two places: one
line in the status bar, and a band just above the prompt. It works in the terminal (CLI) and in the
desktop app. It does not exist for opencode.

## Install

In Claude Code, CLI or desktop:

```
/plugin marketplace add meaningfy-ws/skillery#releases
/plugin install meaningfy-navigator@meaningfy-skillery
```

Tested with Claude Code 2.1.319. Restart the session. Navigator needs no other bundle, but it says more in a repository that has an
`openspec/changes/` folder.

## What you see

**The status line** says where the work stands, and nothing Claude Code already shows (the model,
the plugin name):

```
meaningfy-navigator: navigator · VERY LARGE · Stage 1 — See it apply 9/12 · 9/41 · 3 more open
```

That is the open change, its appetite (its size, once the PLAN names it), the current stage of its
`tasks.md` with the workflow phase (`apply`) and that stage's progress, the progress of the whole
change, and how many other changes are open. It shows the one your branch names (see *Which change
it follows* below). When no change matches the branch it reads
`navigator · no change for branch docs/shape-backlog`, and outside a git repository
`navigator · no repository`; once you load a skill of the EPIC shaping workflow it reads
`epic-shaping · explore` instead. In a repository whose workflow file declares strict mode, it ends
with `● strict` (see *Loose and strict* below).

In another workflow (DevOps, sales, architecting), the line names that workflow, its variant and its
phase instead, even while a change is open:

```
meaningfy-navigator: devops · incident · triage
meaningfy-navigator: sales (provisional) · offer
```

**The band** sits above the prompt, folded by default to three lines: what is happening now, the
next step, and the warnings.

```
apply · 3 Dump and restore 0/2 · Task 3.1 dump and restore → implementer (4m)
next: /superpowers:test-driven-development                           [Next step]
⚠ 2 warnings · apply: clarity-gate has not run since its inputs changed  [Back on track] [Details] [Hide]
```

- **now**: the phase, the current stage of `tasks.md` and its progress, then up to two running
  subagents as `<task> → <type> (<time running>)`, and `+n` for more. With no change it says why:
  `no change for branch <branch>` or `no repository`.
- **next**: the command **Next step** runs, as you would type it. **Compact now** or **Fresh
  session** sits here when offered.
- **warnings**: how many warnings are open, then the most severe one (a single warning shows alone,
  `⚠ <message>`). **Back on track** sits here when a skipped step has a fix. Skills loaded and left
  unused are not counted here; they show only in Details.

The next line is left out when there is no next step and nothing to offer there; with no open
warning, the warnings line shows only its buttons. **Details** unfolds the band:

```
reading ~/r/.claude/worktrees/tdr · feature/tenant-dump-restore
stages    ✓ 1 Dump 4/4 · ✓ 2 Restore 2/2 · ● 3 Dump and restore 0/2 · ○ Close 0/2
phases    EPIC delivery · ✓ ready · ● apply · ○ accept · ○ archive · clarity · 9.1 · full-gates ✓
appetite  MEDIUM · tasks 6/10 · reviewers 0/5 this turn · small stage: 2 reviewers allowed · 1.2M tokens
skills    ready: epic-delivery · apply: test-driven-development, cosmic-python
subagents implementer ×2 done · 3.1M tokens · 1 running · code-reviewer ×2 done · sonnet · 410.0k tokens
[Accept: apply: clarity-gate has not run since its inputs ch…]
⚠ context 82% mid-step (context_warn_percent)
mode      ○ loose
[Reconcile EPIC] [Archive check] [Validate] [Review] [Switch to strict] [Less]
```

- **reading** names the working tree navigator reads (`~` for your home folder) and its branch.
- **phases** ends with each gate's state: `✓` passed, `✗` failed, `·` not run since its inputs
  changed, with the clarity score when there is one. The stale `·` sits where `✓` or `✗` would, so
  `clarity · 9.1` reads "clarity not run since its inputs changed, last score 9.1", not a separator.
- **appetite** shows the reviewers the review set allows this turn, and `small stage: 2 reviewers
  allowed` when the stage is small enough for the smaller review (see
  [`workflows.md`](../development/workflows.md#review-sets)). The figure is the branch's added lines
  against its base (`git diff <base>...HEAD`), not the current stage's alone, so a branch that
  carries several stages adds them up. `diff truncated` shows when the branch's diff was too long to
  read whole.
- **skills** are the ones you loaded, grouped by phase; **subagents** are grouped by type, with a
  model only when it differs from yours.
- **warnings**: every warning, most severe first. A warning's message is `<phase>: <what>` for a
  gate warning. A warning you can accept (every open `plan:` or `process:` one) is drawn only as its
  button, `Accept: <its message>`, the label cut to 60 characters; any other open warning (such as
  a hygiene one) is a `⚠ <message>` line; an accepted one reads `✓ accepted: <message>`.
- **Less** folds the band again.

## Which change it follows

Navigator follows the change your branch names: a change folder `openspec/changes/<id>/` whose id
appears in the branch name as a whole part, between `/` or `-` and the ends. `feature/tenant-dump-restore`
follows `tenant-dump-restore`, `feature/atomic-commit-stage-1` follows `atomic-commit`, and when
two ids fit, the longer one wins (`docs/shape-navigator-follows-the-work` follows
`navigator-follows-the-work`, not `navigator`). A branch that names no open change follows none; it
never guesses the most recently edited one. An archived change is followed only if this session was
already following it and the branch still names it, so the band stays on a change you just archived; Accept and Archive check
are not offered on it.

When the change followed switches (a new branch, another worktree), the gates and the warnings of
the old change are dropped and the new change is placed in its phase from its files, without
warnings for phases it did not pass in this session.

### Worktrees

Navigator reads the working tree you are working in, not the one the session started in. When
Claude edits a file in another worktree of the same repository, inside the checkout
(`.claude/worktrees/…`) or beside it (`../repo-topic`), navigator moves there before it counts the
edit, and follows that worktree's branch, change and `docs/navigator/` workflow files. An edit
outside any repository, or in another repository, moves nothing. A subagent's edits count against
its own working tree and never move yours. `/clear`, `/resume` and `/branch` keep the worktree
followed. If the worktree is removed, navigator goes back to the one the session started in.
Details names the tree read on its `reading` line. A session started outside a git repository
shows `no repository` and stays so.

Moving with a shell `cd`, or only reading files in another worktree, is not seen: navigator moves
on an edit.

### A worked example

A session starts in `~/r` on branch `docs/shape-backlog`; two changes are open,
`aggregate-events` and `tenant-dump-restore`.

1. The status line reads `navigator · no change for branch docs/shape-backlog`, and the band has no
   change warnings.
2. Claude edits `~/r/.claude/worktrees/tdr/mod/x.py`, a worktree on
   `feature/tenant-dump-restore`. Navigator moves there; at the end of the turn the band shows
   `tenant-dump-restore` in stage 3, and Details reads
   `reading ~/r/.claude/worktrees/tdr · feature/tenant-dump-restore`. A worktree beside the
   checkout (`~/r-tdr`) gives the same result.
3. You `/clear`. The band stays on `tenant-dump-restore`.
4. The stage's pull request merges with tasks still open: the phase stays `apply`. Later, with
   every task ticked, the last merge moves it to `archive`; once the folder is archived the band
   still follows it.
5. `git switch -c release/0.2.0`: the band shows the release workflow in `bump`, with a warning
   that `meaningfy-release` has not been loaded.

## Workflows and phases

Navigator follows nine workflows, each kept as a file in the skill that owns it: EPIC shaping
(`epic-planning`), EPIC delivery (`epic-delivery`), architecting (`architecture`), conceptual modelling
(`conceptual-modelling`), release (`meaningfy-release`), DevOps (`infrastructure-operations`),
sales (`sales-operations`, provisional), documentation (`technical-writing`: inventory, write,
verify, cold-read, publish) and contract (`contract-practice`, provisional, with no gates until the
contract repository adds its own). Loading `technical-writing` in the middle of a build shows
*documentation*; loading `epic-delivery` or `openspec-apply-change` shows the build again. EPIC
shaping has the phases explore, variants, decide, propose, design and revise; EPIC delivery has
ready, apply, accept and archive; its variant `brownfield` (tasks and no design) has apply, accept and
archive. Each file lists its own phases, and each workflow has one lead agent
([`workflows.md`](../development/workflows.md#workflow-files) names it).
It picks the workflow from the skills you load and the subagents you start; with an open change and nothing else loaded, it
is EPIC delivery, starting at `ready`. The phase follows the skills you load and the state of the change's files: ticking
the last task of `tasks.md` moves `apply` to `accept`, and `accept` passes its gate when
`evidence/acceptance.md` is written. The docs stage between `accept` and `archive` is the documentation
workflow: load `technical-writing` and the band shows it; loading `openspec-archive-change` shows
`archive`. Merging the change's pull request also moves it to `archive`, but only once every task is
ticked: a staged EPIC merges one stage at a time, and a stage's merge with tasks still open moves
nothing. Archiving the change (its folder moves under `archive/`) moves it there too. In DevOps,
the commands move it: `terraform plan` reaches the consent card, your answer to the card reaches
`apply`.

A release starts from its commands as well as from `meaningfy-release`: creating a `release/` or
`hotfix/` branch (`git switch -c release/0.2.0`), `gh release create v1.2`, or pushing a version
tag (`git push origin v1.2.0`) switches the session to the release workflow, in the phase that
command completes (after `git switch -c release/0.2.0` the band shows `bump`). A tag you only
create locally (`git tag v1.2.0`) and `git push --follow-tags` do not. If `meaningfy-release` has
not been loaded, a warning names it.

A file you write can move the phase too. A phase may name a file gate, a glob for the artifact
that starts the next phase. When a written file matches it, the session moves to the next phase:
writing the first use case ends `drivers` and enters `use-cases` in architecting; writing under
`model/` ends `decide` and enters `domain`. It only moves forward, it never blocks, and it does not
pick a workflow. The globs are in the `gates` of each workflow file.

A repository can change a workflow with its own file in `docs/navigator/`; see
[`workflows.md`](../development/workflows.md#workflow-files). A file navigator cannot read shows as a
warning naming the file, and the default is used.

## When a step is skipped

Navigator warns, and never blocks, when:

- you commit during a phase without a skill the phase expects at each commit (for example a commit
  in `apply` without `test-driven-development`);
- you leave a phase without a skill it expects, or with a gate not passed (the `full-gates` command,
  `make check-all` unless the repository sets another, not run since the last edit);
- you enter a phase whose precondition did not run (`apply` without `clarity-gate` on the current
  PLAN);
- a DevOps apply command runs with no consent card answered;
- a skill of another phase runs, or an external skill does a job a Meaningfy skill owns
  (`writing-plans` where `epic-planning` owns the PLAN).

Each warning names, in brackets, the skill that owns the rule. A warning about a missing skill
clears when that skill runs; a warning about a gate clears when the gate passes (`make check-all`
for the `full-gates` gate, through **Validate** or typed). A warning about a skill of another phase is
information only and stays for the session.

When you open a session in the middle of a phase, navigator places you there without checking what
earlier sessions did: it warns only about what happens in this session.

## When the work drifts from the plan

While a change is open, navigator compares the branch's changes with the change's EPIC and PLAN at
the end of each turn. It warns when:

- a changed file is named nowhere in `tasks.md`, `design.md` or `proposal.md` (not the file, its
  folder, or its name);
- a ticked task names files and none of them changed;
- a new `shortcut:` comment, or a new `DD-` or `DEC-` decision id, is not in `design.md`.

A worked example. Your branch changes `mods/navigator/lib/view.ts`, which `tasks.md` names through
`mods/navigator/lib/`, and `tools/repo_lint/lint.py`, which no task names. The band shows
`⚠ tools/repo_lint/lint.py changed; no task, design or proposal names it (epic-planning)`. You have two ways out:

- **Reconcile EPIC** runs `/openspec-update-change <id>` to put the file into the PLAN, then
  `/clarity-gate <id>` once that turn ends. The next read finds the file covered and the warning goes.
- **Accept** the deviation, with a reason: `/navigator accept plan:outside:tools/repo_lint/lint.py
  "lint check added for DD-10"`, or the warning's **Accept: …** button in Details. Navigator adds one
  line to the change's `deviations.md`; the warning stays in the band as `✓ accepted:` and no
  longer counts.

Before you archive, **Archive check** (`/navigator check`) lists what is still open, what was
accepted, the gate states and the `openspec validate --strict` result. `spec-stewardship` archives
a change only when nothing is open.

## Keeping the session lean

Navigator reads the thresholds in `guardrails` and, at the end of each turn:

- offers **Compact now** at a safe point (a commit, after a phase or a task group is done) once the
  context is large enough;
- offers **Fresh session** at a task boundary (a commit with every task ticked, a merged PR, an
  archived change);
- mid-step, with a large context, warns `context N% mid-step` without a button: finish the step,
  commit, then compact (`guardrails`).

It also flags a subagent that only did a lookup, a subagent report longer than the limit, more
reviewers in one turn than the appetite's review set, a missing second check before a push, PR or
archive, and a skill loaded and left unused (if it should not have fired, run `skillery-feedback`).
The unused check judges each agent apart: a skill preloaded into a subagent counts as that
subagent's, and is used when that subagent acts after loading it. It shows these; it never decides
for you.

Warnings are ranked: skipped steps and gates first, then plan drift, then subagent and review
warnings, then session hygiene, and unused skills last.

## Loose and strict

Loose is the default: navigator warns and never blocks. A repository becomes strict with a workflow
file of its own, `docs/navigator/epic-delivery.workflow.json`:

```json
{ "name": "epic-delivery", "extends": "epic-delivery", "mode": "strict" }
```

A repository whose files live elsewhere changes a glob with `extends`. The merge is shallow: a field
you give replaces the whole field of the default. To move the use-case glob, give the full `gates`
object, not only the one glob (copy `gates` from the
[default file](../../skills/architecture/assets/workflows/architecting.workflow.json) and change the one glob):

```json
{ "name": "architecting", "extends": "architecting",
  "gates": { "usecases": { "kind": "file", "glob": "docs/uc/**" }, "c4": { "kind": "file", "glob": "**/*[Cc]4*" },
             "adr": { "kind": "file", "glob": "**/[Aa][Dd][Rr]-[0-9]*" }, "model": { "kind": "file", "glob": "model/**" } } }
```

Strict adds four checks: a commit is refused while the phase's expected skill or a gate is missing;
an archive is refused while plan or process drift is open; a subagent spawn over the appetite's
review set is refused, and one asking a model above yours is moved to yours; and the model is
reminded of the current phase at each prompt. A refusal names its reason and every way out: run the
missing skill, accept the deviation, or `/navigator mode loose`.

**Switch to strict** / **Switch to loose** (or `/navigator mode loose|strict`) switches this session either way: drop a strict repo
to loose, or try strict in a loose one. The next session follows the repository again.

## Actions

| Button | Runs | Shown |
|---|---|---|
| **Next step** | the command on the `next:` line: the first skill the phase still expects, else the owner of the next phase | a workflow is active |
| **Back on track** | the command that puts right the oldest open process warning (a skipped step) | such a warning, on the warning line |
| **Compact now** / **Fresh session** | `/compact` with what to keep / `/clear` | when offered, on the `next:` line |
| **Details** / **Less** | unfolds / folds the band | folded / unfolded |
| **Accept: <message>** | `/navigator accept <key> "<reason>"`, asking the reason; the dialog names the message | each open plan or process warning (Details) |
| **Reconcile EPIC** | `/openspec-update-change <id>`, then `/clarity-gate <id>` | plan drift is open (Details) |
| **Archive check** | `/navigator check` | a change is open and not archived (Details) |
| **Validate** | `/navigator validate`: the phase's gate commands, such as `make validate` | the phase has one (Details) |
| **Review** | `/meaningfy-code-review <id> <APPETITE>` | the phase expects or allows a review (Details) |
| **Switch to strict** / **Switch to loose** | `/navigator mode strict` or `loose` | always (Details) |
| **Hide** | hides the band | always |

A button types its command into the session as you would, so you see it in the transcript. If the
command is not installed, navigator says so and runs nothing.

If another add-on also draws a band (for example ponytail), its band stays below navigator's.

## Show and hide

| Command | Does |
|---|---|
| `/navigator band` | cycles the band: folded → unfolded → hidden |
| `/navigator band fold`, `unfold`, `hide`, `show` | sets the band |
| `/navigator line`, `line show`, `line hide` | toggles, shows or hides the status line |
| `/navigator validate` | runs the gate commands of the current phase |
| `/navigator check` | the Archive check |
| `/navigator accept <key> "<reason>"` | records a deviation |
| `/navigator mode loose`, `mode strict` | switches the mode for this session |

The band's own buttons do the same: **Details** / **Less**, and **Hide**. A hidden band leaves a
small `⎈` button above the prompt; press it to bring the band back.

These change the current session only. The next session starts from your settings.

## Settings

In `/plugin`, open `meaningfy-navigator` and its settings:

| Setting | Values | Default |
|---|---|---|
| Band | `unfolded`, `folded`, `hidden` | `folded` |
| Status line | on, off | on |

## Turn it off

`/plugin disable meaningfy-navigator` turns it off; `/plugin uninstall meaningfy-navigator`
removes it. The only file navigator writes in your repository is a change's `deviations.md`, when you
accept a deviation.

Developers changing navigator: see [`docs/development/mods.md`](../development/mods.md).
