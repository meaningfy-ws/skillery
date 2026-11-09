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

Restart the session. Navigator needs no other bundle, but it says more in a repository that has an
`openspec/changes/` folder.

## What you see

**The status line** names the open change, its appetite (its size), the task count and the mode:

```
⎈ navigator · VERY LARGE · 12/40 · ○ loose
```

With no open change it reads `⎈ no open change`. With several open changes it shows the one your
branch names, then `+2` for the others.

**The band** sits above the prompt, folded to one row by default:

```
▸ 2 running · last clarity-gate · validate ✓ · ⚠ 3                 [Unfold]
```

Unfolded, it lists the skills loaded so far, each subagent with its type, model, tokens and whether
it is still running, and the task progress of the change. If another add-on also draws a band (for
example ponytail), its band stays below navigator's.

## Show and hide

| Command | Does |
|---|---|
| `/navigator band` | cycles the band: folded → unfolded → hidden |
| `/navigator line` | shows or hides the status line |

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
