// The lead's working tree and each subagent's (design D-2, D-16). Pure: io.ts gathers the git facts.

import type { NavState, Root } from './state.ts'

/** `a/b/../c` → `a/c` for an absolute path. */
function normalise(path: string): string {
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

/** The root to follow after an edit, or null for no change: the edit's working tree differs from the
 *  followed one and belongs to the same repository. A tree of another repository, or none, is ignored. */
export function decideRoot(current: Root | null, edit: Root | null): Root | null {
  if (!edit || (current && (edit.path === current.path || edit.common !== current.common))) return null
  return edit
}

/** The start root, when the followed one's directory is gone; null otherwise (nothing to fall back to). */
export function decideFallback(current: Root | null, exists: boolean, start: Root | null): Root | null {
  return current && !exists && start && start.path !== current.path ? start : null
}

/** A new atom (`/clear`, `/resume`, `/branch`) keeps the followed root. */
export const startRoot = (carried: Root | null, fresh: Root | null): Root | null => carried ?? fresh

export const dirOf = (file: string): string => file.slice(0, file.lastIndexOf('/')) || '/'

/** `file` relative to `root` when it lies inside it. */
export const relativeTo = (root: string | null, file: string): string =>
  root && file.startsWith(`${root}/`) ? file.slice(root.length + 1) : file

/** The directory an edit is made relative to: a subagent's own root, else the lead's. */
export function editRoot(s: NavState, agentId: string | undefined): string | null {
  return (agentId ? s.subagents.find(a => a.agentId === agentId)?.root : null) ?? s.root?.path ?? null
}

/** A subagent already listed and not yet rooted; an unlisted one is retried on its next call. */
export const needsRoot = (s: NavState, agentId: string): boolean =>
  s.subagents.some(a => a.agentId === agentId && a.root === null)
