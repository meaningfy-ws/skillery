# CLAUDE.md — Claude Code binding

**Read [`AGENTS.md`](AGENTS.md) first.** It is the canonical operating manual for this repo and
applies to Claude Code. This file adds only Claude Code-specific guidance. A lint check keeps the
GitNexus block in `AGENTS.md` only.

@AGENTS.md

## Tool habits (Claude Code)

Read, Edit and Write for files; `run_in_background` for long commands; Read with offset and limit;
several Read calls in one message; AskUserQuestion once, up to four questions. Tools for each
activity: the table in `guardrails` (`references/activity-tools.md`).
