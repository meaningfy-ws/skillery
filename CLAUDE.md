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

- **Read files with Read; edit them with Edit or Write**, never with `cat`, `head`, `sed`,
  `python3 - <<EOF` or other shell or script operations. Filtering command output in a pipe is
  fine; generated files are written only by their generator (`make bundles`).
  Edit shows a reviewable diff and fails when the text is not where you expect it.
- **For code, Serena and ast-grep are mandatory** on every programming task: Serena to find, read
  and replace symbols, ast-grep for structural search and rewrite, GitNexus for impact and context.
  Grep and whole-file reads only when they are unavailable, and say so. For prose, Edit is the
  direct way.
- **Do not poll.** No `until … sleep` or `while … sleep` loops. Run a long command with
  `run_in_background` and wait for its completion notice.
- **Ask open questions in one AskUserQuestion call**, up to four at a time, each with a recommended
  option.
