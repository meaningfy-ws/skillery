// Synthetic repositories as plain data (DEC-11): what io.ts reads, without a disk or a git.
// Not a test file: `make mods` runs `lib/*.test.ts` only, and tsc still type-checks this one.

import type { ChangeFiles } from './change.ts'

const PROPOSAL = '## Appetite\n\nSMALL — one stage.\n'

/** An open change; `tasks` null is a change still being shaped. */
export const changeFiles = (id: string, tasks: string | null = '## 1. One\n- [ ] 1.1 a\n', design = tasks !== null): ChangeFiles =>
  ({ id, proposal: PROPOSAL, tasks, design, planHash: '', designMtime: 0 })

/** Several open changes, one of them without tasks. */
export const OPEN_CHANGES: ChangeFiles[] = [
  changeFiles('tenant-dump-restore'),
  changeFiles('aggregate-events'),
  changeFiles('atomic-commit'),
  changeFiles('navigator'),
  changeFiles('navigator-follows-the-work'),
  changeFiles('release-pipeline', null, false), // shaping: a proposal only
]

/** `openspec/changes/archive/<date>-<id>`: the folder name is the `id`. */
export const ARCHIVED_CHANGES: ChangeFiles[] = [
  changeFiles('2026-11-09-navigator', '## 1. One\n- [x] 1.1 a\n'),
  changeFiles('2026-11-13-boundary-owned-hint', '## 1. One\n- [x] 1.1 a\n'),
]

/** The text of `git rev-parse --show-toplevel --git-common-dir --abbrev-ref HEAD`: three lines. */
export type GitFacts = { toplevel: string; common: string; branch: string; output: string }

const facts = (toplevel: string, common: string, branch: string): GitFacts =>
  ({ toplevel, common, branch, output: `${toplevel}\n${common}\n${branch}\n` })

export const GIT = {
  main: facts('/r', '/r/.git', 'develop'), // the main checkout
  inside: facts('/r/.claude/worktrees/tdr', '/r/.git', 'feature/tenant-dump-restore'), // a worktree inside it
  beside: facts('/r-tdr', '/r/.git', 'feature/tenant-dump-restore'), // a worktree beside it
  other: facts('/o', '/o/.git', 'main'), // another repository
}
