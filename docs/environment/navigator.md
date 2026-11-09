# Navigator — see where the work stands

Navigator is a small add-on for Claude Code. It shows, while you work, which change you are on,
how far its tasks have got, and which skills and subagents are running. It draws in two places: one
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
meaningfy-navigator: navigator · VERY LARGE · Stage 1 — See it 9/12 · 9/41 · 3 more open
```

That is the open change, its appetite (its size, once the PLAN names it), the current stage of its
`tasks.md` with that stage's progress, the progress of the whole change, and how many other changes
are open. It shows the one your branch names. With no open change it reads
`navigator · no open change`. In a repository that runs strict mode, it ends with `● strict`.

**The band** sits above the prompt, folded to one row by default. It shows only what is happening:

```
2 running: code-reviewer, implementer · last clarity-gate · validate ✓        [Unfold] [Hide]
```

With nothing to report it shows just its buttons. Unfolded, it adds:

```
stages    ✓ 1 See it 12/12 · ● 2 Follow the workflow 3/12 · ○ 3 Stay on plan 0/13 · ○ Close 0/4
skills    epic-delivery · plugin-authoring · clarity-gate
subagents code-reviewer · sonnet · done · 41.0k tokens · implementer · opus · running
mode      ○ loose
```

If another add-on also draws a band (for example ponytail), its band stays below navigator's.

## Show and hide

| Command | Does |
|---|---|
| `/navigator band` | cycles the band: folded → unfolded → hidden |
| `/navigator line` | shows or hides the status line |

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
