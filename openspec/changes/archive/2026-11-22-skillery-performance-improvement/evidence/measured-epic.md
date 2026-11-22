# Measured EPIC: skillery-performance-improvement

The fourth success check of `delivery-process-and-tools` (issue #296): recorded by the lead of
the first EPIC delivered after 3.16.0. Measured on 2026-11-22 with `session_digest.py --days 3`
over `~/.claude/projects` (75 sessions), session `daa0b1dc`.

| Check | Target | Measured | Verdict |
|---|---|---|---|
| Stages per session | no session holds two stages | 5 build stages, the close, the archive and two releases in one session (PRs #328 to #342), one compaction | **fail** |
| Gate runs per PLAN | no third run | 2 (8.3, then 9.15; `evidence/clarity-gate.md`) | pass |
| Lead's peak context | below the old runs | 977,989 tokens main-thread peak, equal to the highest of the window; first call 59,512 | **fail** |

Other figures from the same row: 458 main-thread calls, 54 subagents with 892 calls, 212 M
cache-read tokens on the main thread and 66 M in subagents.

## Why

The owner asked for the whole EPIC in this session ("once you finish the planning start
implementation in this session"; "work without stopping"). The session followed that request
over `guardrails` *Session hygiene* (a fresh session at each stage merge), which the EPIC itself
made firmer (D-1, stage 2). The hand-over notes were written at each stage, so the cut was
available at every merge and not taken.

## What it shows

The method's session boundary holds only when the lead takes it. An owner's "continue in this
session" is a repository-level rule in conflict with session hygiene (the conflict P-0016 shows in
rdf-persistence, issue rdf-persistence#281); `guardrails` says hygiene wins and the lead names the
conflict under Open in the hand-over note. This session did not. The 3.22.0 measurements (tasks
2.5 to 6.1) on fresh sessions are the comparison that counts.
