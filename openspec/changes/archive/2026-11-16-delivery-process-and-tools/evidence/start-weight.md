# Start-weight measurement (D-12, DEC-14 check 3)

Run on one day, 2026-11-16, Claude Code headless (`claude -p`), model `claude-opus-5-5`.

## Setup

- **Base:** `54528dc` (`develop` with the PLAN merged, #245, before stage 1 merged in #247).
  `AGENTS.md` 14,904 bytes, `CLAUDE.md` 1,755.
- **New:** `d28c56a` (stage 3 merged, #258). `AGENTS.md` 11,290 bytes, `CLAUDE.md` 573.
- Each run starts in a detached scratch worktree of that commit, so its own `AGENTS.md` and
  `CLAUDE.md` load. Its nine bundles are loaded with one `--plugin-dir` each, from a dereferenced
  copy (`cp -rL bundles/*`, D-33).
- The installed plugins are off: `--setting-sources project,local` (no user settings, so no
  enabled marketplace plugins) and `--strict-mcp-config` (no MCP servers). The init record of
  every run lists the nine bundles from the scratch copies and no installed Meaningfy plugin, so
  `--plugin-dir` did replace the installed versions (the fallback in D-12 was not needed).
- Figures: `first_ctx` from `session_digest.py`, used as it is, over copies of the transcripts.

## Results

| Session | Base | New | Saving | Held to (D-12) | Verdict |
|---|---:|---:|---:|---:|---|
| Main session, "Reply with OK." | 37,033 | 35,041 | 1,992 | ≥ 800 | pass |
| Implementer, first call | 54,250 | 27,003 | 27,247 | ≥ 20,000 | pass |

The implementer was dispatched with the fixed brief "add one negative test to
`tests/test_repo_lint_negative.py` for `missing_skill_dirs`; report only".

## A first implementer run that under-measured

The first implementer pair gave 33,236 → 23,316 (saving 9,920). With user settings off, the
external skills the base implementer preloads (`superpowers:test-driven-development`,
`systematic-debugging`, `verification-before-completion`, and `stream-coding`) were not present in
either run, so only `cosmic-python` was measured. The pair was re-run with them present in both
runs (`--plugin-dir` on the installed `superpowers` 7.0.2, and `stream-coding` copied into each
worktree's `.claude/skills/`); the table above holds that pair. The figure was not moved.
