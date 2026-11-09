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
change, and how many other changes are open. It shows the one your branch names. With no open
change it reads `navigator · no open change`. In a repository that runs strict mode, it ends with
`● strict`.

Outside a change, the line names the workflow you are in, its variant and its phase:

```
meaningfy-navigator: devops · incident · triage
meaningfy-navigator: sales (provisional) · offer
```

**The band** sits above the prompt, folded to one row by default. It shows only what is happening:

```
2 running: code-reviewer, implementer · last clarity-gate · validate ✓ · ⚠ 1
[Next step] [Back on track] [Unfold] [Hide]
```

With nothing to report it shows just its buttons. Unfolded, it adds:

```
stages    ✓ 1 See it 12/12 · ● 2 Follow the workflow 3/12 · ○ 3 Stay on plan 0/13 · ○ Close 0/4
phases    Build-tier EPIC delivery · ✓ explore · ✓ shape · ✓ plan · ● apply · ○ verify · ○ archive
skills    clarity-gate (plan) · epic-delivery (apply)
subagents code-reviewer · sonnet · done · 41.0k tokens · implementer · opus · running
warnings  ⚠ commit in apply without test-driven-development
mode      ○ loose
[Validate]
```

## Workflows and phases

Navigator follows four workflows, each kept as a file in the skill that owns it: build-tier EPIC
delivery (`epic-delivery`), architecting and modelling (`architecture`), DevOps
(`infrastructure-operations`) and sales (`sales-operations`, provisional). It picks the workflow from
the skills you load and the subagents you start; with an open change and nothing else loaded, it
is build-tier. The phase follows the skills you load and the state of the change's files: ticking
the last task of `tasks.md` moves `apply` to `verify`. In DevOps, the commands move it:
`terraform plan` reaches the consent card, your answer to the card reaches `apply`.

A repository can change a workflow with its own file in `docs/navigator/`; see
[`workflows.md`](../development/workflows.md#workflow-files). A file navigator cannot read shows as a
warning naming the file, and the default is used.

## When a step is skipped

Navigator warns, and never blocks, when:

- you commit during a phase without a skill the phase expects at each commit (for example a commit
  in `apply` without `test-driven-development`);
- you leave a phase without a skill it expects, or with a gate not passed (`make validate` not run
  since the last edit);
- you enter a phase whose precondition did not run (`apply` without `clarity-gate` on the current
  PLAN);
- a DevOps apply command runs with no consent card answered;
- a skill of another phase runs, or an external skill does a job a Meaningfy skill owns
  (`writing-plans` where `epic-planning` owns the PLAN).

Each warning names the skill that owns the rule. Running the skill it names clears it.

| Button | Runs |
|---|---|
| **Next step** | the first skill the phase still expects, else the owner of the next phase |
| **Back on track** | the command that puts right the oldest warning |
| **Validate** | `/navigator validate`: the phase's gate commands, such as `make validate` |

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

The band's own buttons do the same: **Unfold** / **Fold**, and **Hide**. A hidden band leaves a
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
removes it. Navigator writes nothing into your repository.

Developers changing navigator: see [`docs/development/mods.md`](../development/mods.md).
