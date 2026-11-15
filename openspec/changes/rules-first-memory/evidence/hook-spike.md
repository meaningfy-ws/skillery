# Hook spike (task 1.2, RISK-5)

A throwaway plugin answers four questions about how Claude Code loads and runs plugin hooks. The
plugin code is not kept in the repository; only this record is. Date run: ____ . Claude Code
version: ____ .

## Questions

| # | Question |
|---|----------|
| Q1 | A plugin manifest whose `hooks` array lists two files (`./a/hooks.json`, `./b/hooks.json`): do both load? |
| Q2 | Does a `SessionStart` hook's plain stdout (exit 0) reach the agent's context? |
| Q3 | Does a `PreToolUse` hook on `Write\|Edit\|MultiEdit` that exits 2 deny the write, and does the agent see its stderr? |
| Q4 | Does a hook command that fails with exit 127 (missing binary, as a missing `node` would) leave the tool call to go on? |

## How to run

In a Claude Code session, run:

```
! bash /tmp/claude-1000/-home-lps-work-repos-skillery/47b6616c-f6e7-41b0-ad61-3e33e12d6c41/scratchpad/hook-spike/run-spike.sh
```

The script makes an empty config folder and a temporary working folder, then starts
`claude --plugin-dir <plugin>` there. A fresh config needs one interactive login. Type, one at a time:

1. `What is the word in your SPIKE-A-CONTEXT line?`
2. `Write the text hi to spike-denied.md`
3. `Run: echo ok`

Then `/hooks` to see which hooks are listed. Exit with `/exit`.

## Results

| Question | Observed | Yes/No |
|----------|----------|--------|
| Q1 hooks from both files load (`/hooks` lists a and b) | `a`'s SessionStart and `b`'s PreToolUse both fired in the same sessions, from one manifest listing both files (`/hooks` not run: headless) | yes |
| Q2 prompt 1 answered "ultramarine" | answered `ultramarine` | yes |
| Q3 prompt 2: write refused, agent quotes `SPIKE-B-DENY: do not write this file`, no `spike-denied.md` on disk | the agent reported the Write stopped by `plugin/b/b.mjs` and quoted `SPIKE-B-DENY: do not write this file`; `ls` found no file | yes |
| Q4 prompt 3: `ok` printed, only a hook error shown | `ok` printed; no hook error surfaced to the agent | yes |

Run by the lead on 2026-11-15 at the owner's request ("you run it"), headless with
`claude -p --plugin-dir <plugin>` (Claude Code 2.1.325) in a throwaway working folder. The owner's
logged-in config was used instead of an empty one, because no API key was available for a fresh
config; that does not affect the four questions. All yes: no change to D-5, D-7 or the error matrix.

## What each "no" changes

| Answer | Change (design.md RISK-5 and the error matrix) |
|--------|-----------------------------------------------|
| Q1 no | The generator merges the mods' hooks into one `hooks.json` per bundle (D-7); tasks 1.2 and 1.5 follow. |
| Q2 no | Redesign before task 1.5: emit `hookSpecificOutput` JSON (`additionalContext`) instead of plain stdout; record the form that worked here. |
| Q3 no | Redesign before task 1.5: deny with JSON `permissionDecision: deny` and a reason instead of exit 2; record the form that worked here. If the agent does not see stderr, the message goes in the JSON reason. |
| Q4 no | The error-matrix row "`node` is missing" is wrong: a missing `node` would block. Add a guard (for example `command -v node >/dev/null \|\| exit 0; node ...`) to the hook command, and rewrite the row. |
