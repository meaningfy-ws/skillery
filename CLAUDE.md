# CLAUDE.md — Claude Code binding

**Read [`AGENTS.md`](AGENTS.md) first.** It is the canonical, CLI-agnostic operating manual for
this repo — what the repo is, the five artifact types, the single-source-of-authority rule, how to
maintain/validate the catalogue, versioning, spine/OpenSpec conventions, and hooks. Everything there
applies to Claude Code.

This file adds **only Claude Code-specific guidance**. opencode reads `AGENTS.md` natively — do not
duplicate the operating manual here.

GitNexus guidance (impact analysis, `detect_changes`, re-indexing) lives in [`AGENTS.md`](AGENTS.md) only.
Claude Code loads the canonical manual, GitNexus rules included, through this import (one copy in git):

@AGENTS.md

## Tool habits (Claude Code)

How Claude Code's own tools serve the rules in `AGENTS.md` and the `guardrails` skill:

- **Edit files with Edit or Write**, never with `python3 - <<EOF`, `sed -i` or other shell rewrites.
  Edit shows a reviewable diff and fails when the text is not where you expect it.
- **For code, use symbol-level tools when the session has them** (find and replace a symbol, the
  code index's impact and context). For prose, Edit is the direct way.
- **Do not poll.** No `until … sleep` or `while … sleep` loops. Run a long command with
  `run_in_background` and wait for its completion notice.
- **Ask open questions in one AskUserQuestion call**, up to four at a time, each with a recommended
  option.
