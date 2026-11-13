// The lead's working tree and each subagent's (design D-2, D-16). Pure: io.ts gathers the git facts.

import type { NavState, Root } from './state.ts'

/** What io memoises per directory: where a working tree is and which repository it belongs to (D-21.1). */
export type Tree = Pick<Root, 'path' | 'common'>

/** `a/b/../c` → `a/c`, a trailing `/` dropped, for an absolute path. */
export function normalise(path: string): string {
  const parts: string[] = []
  for (const p of path.split('/')) {
    if (p === '..') parts.pop()
    else if (p && p !== '.') parts.push(p)
  }
  return `/${parts.join('/')}`
}

/** The output of `git rev-parse --show-toplevel --git-common-dir --abbrev-ref HEAD` run in `dir`;
 *  null when it is not three lines (not a repository). git prints a relative common dir relative to
 *  `dir`, the directory it ran in, so it is made absolute against that. */
export function parseRevParse(output: string, dir: string): Root | null {
  const [path, common, branch] = output.split('\n').map(l => l.trim())
  if (!path || !common || !branch) return null
  return { path, common: common.startsWith('/') ? normalise(common) : normalise(`${dir}/${common}`), branch }
}

/** The tree to follow after an edit, or null for no change: the edit's working tree differs from the
 *  followed one and belongs to the same repository. A tree of another repository, or none, is ignored;
 *  so is any edit while no root is followed: the root then comes only from the session (D-21.3). */
export function decideRoot<T extends Tree>(current: Root | null, edit: T | null): T | null {
  if (!current || !edit) return null
  const same = normalise(edit.path) === normalise(current.path)
  return same || normalise(edit.common) !== normalise(current.common) ? null : edit
}

/** The followed root with the branch just read, or null when it is unchanged (the branch is re-read each main turn). */
export const rebranched = (current: Root | null, branch: string | null): Root | null =>
  current && branch && branch !== current.branch ? { ...current, branch } : null

/** The start root, when the followed one's directory is gone; null otherwise (nothing to fall back to). */
export function decideFallback(current: Root | null, exists: boolean, start: Root | null): Root | null {
  return current && !exists && start && start.path !== current.path ? start : null
}

/** A new atom (`/clear`, `/resume`, `/branch`) keeps the followed root. */
export const startRoot = (carried: Root | null, fresh: Root | null): Root | null => carried ?? fresh

/** The directory of a path; `.` for a bare name, `/` for a file in the root directory. */
export function dirOf(file: string): string {
  const i = file.lastIndexOf('/')
  return i < 0 ? '.' : i === 0 ? '/' : file.slice(0, i)
}

/** `file` relative to `root` when it lies inside it; else the file itself (normalised when absolute), so
 *  a path that leaves the root never looks like one inside it. */
export function relativeTo(root: string | null, file: string): string {
  if (!file.startsWith('/')) return file
  const f = normalise(file)
  const r = root ? normalise(root) : null
  const prefix = r === '/' ? '/' : `${r}/`
  return r && f.startsWith(prefix) ? f.slice(prefix.length) : f
}

/** The directory an edit is made relative to: a subagent's own root, else the lead's. */
export function editRoot(s: NavState, agentId: string | undefined): string | null {
  return (agentId ? s.subagents.find(a => a.agentId === agentId)?.rootPath : null) ?? s.root?.path ?? null
}

/** A subagent already listed and not yet rooted (missing counts as unrooted); an unlisted one is retried on its next call. */
export const needsRoot = (s: NavState, agentId: string): boolean =>
  s.subagents.some(a => a.agentId === agentId && a.rootPath == null)
