# CLAUDE.md — Claude Code binding

**Read [`AGENTS.md`](AGENTS.md) first.** It is the canonical, CLI-agnostic operating manual for
this repo — what the repo is, the four artifact types, the single-source-of-authority rule, how to
maintain/validate the catalogue, versioning, spine/OpenSpec conventions, and hooks. Everything there
applies to Claude Code.

This file adds **only Claude Code-specific guidance**. opencode reads `AGENTS.md` natively — do not
duplicate the operating manual here.

GitNexus guidance (impact analysis, `detect_changes`, re-indexing) lives in [`AGENTS.md`](AGENTS.md) only.
Claude Code loads the canonical manual, GitNexus rules included, through this import (one copy in git):

@AGENTS.md
