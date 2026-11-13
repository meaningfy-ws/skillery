// Which change, its appetite and its progress (design §6.1). Pure: register.tsx reads the files.

import type { Change, ChangePredicate, Group, NavState } from './state.ts'

export type ChangeFiles = {
  id: string // an archived change's is its folder name, `<date>-<id>`
  proposal: string
  tasks: string | null
  design: boolean
  planMtime: number // newest mtime of design.md and tasks.md, 0 if neither
}

/** The appetite names are the epic-delivery workflow's `reviews` keys; the mod holds no list. */
export function appetitesOf(workflow: unknown): string[] {
  const reviews = (workflow as { reviews?: unknown } | null)?.reviews
  return reviews && typeof reviews === 'object' ? Object.keys(reviews) : []
}

const lines = (text: string) => text.replaceAll('\r\n', '\n')
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function appetiteOf(proposal: string, appetites: string[]): string | null {
  const section = lines(proposal).split(/^## Appetite\s*$/m)[1]
  if (!section) return null
  const para = section.trim().split(/\n\s*\n|^## /m)[0] ?? ''
  const byLength = appetites.filter(a => a.trim()).sort((a, b) => b.length - a.length)
  // Whole words only: SMALLER is not SMALL.
  return byLength.find(a => new RegExp(`(?<![\\w-])${escape(a)}(?![\\w-])`).test(para)) ?? null
}

export function progress(tasks: string | null): { done: number; total: number; groups: Group[] } {
  const groups: Group[] = []
  let current: Group | null = null
  // Boxes above the first `## ` heading belong to no group and are not counted (§6.1).
  for (const line of lines(tasks ?? '').split('\n')) {
    const heading = line.match(/^## (.+)$/)
    if (heading?.[1]) {
      const title = heading[1].trim()
      // The roadmap repeats task ids: not counted.
      current = /^roadmap\b/i.test(title) ? null : { title, done: 0, total: 0 }
      if (current) groups.push(current)
      continue
    }
    const box = line.match(/^\s*- \[( |x|X)\]/)
    if (box && current) {
      current.total += 1
      if (box[1] !== ' ') current.done += 1
    }
  }
  const counted = groups.filter(g => g.total > 0)
  return {
    done: counted.reduce((n, g) => n + g.done, 0),
    total: counted.reduce((n, g) => n + g.total, 0),
    groups: counted,
  }
}

/** Where `id` last occurs in `branch` bounded by the start, the end, `/` or `-` on both sides; -1 if it does not (D-3, D-21.10). */
function boundedAt(branch: string, id: string): number {
  const last = [...branch.matchAll(new RegExp(`(^|[/-])${escape(id)}(?=[/-]|$)`, 'g'))].at(-1)
  return last ? last.index + last[1]!.length : -1
}

/** The open change id a branch names: the longest, on a tie the one named later, then alphabetical.
 *  Never the most recently modified (DEC-3). */
export function matchOpen(branch: string, open: string[]): string | null {
  const hits = open.filter(id => id && boundedAt(branch, id) >= 0)
  hits.sort((a, b) => b.length - a.length || boundedAt(branch, b) - boundedAt(branch, a) || a.localeCompare(b))
  return hits[0] ?? null
}

const ARCHIVE_DATE = /^\d{4}-\d{2}-\d{2}-/

/** The archive folders (`<date>-<id>`) of `lastChangeId`: the only ones io reads (D-3). */
export const archivedFolders = (names: string[], lastChangeId: string | null): string[] =>
  lastChangeId ? names.filter(f => f.replace(ARCHIVE_DATE, '') === lastChangeId) : []

/** The archived folder (`<date>-<id>`) of the change just archived: only `lastChangeId`, and only when the branch names it.
 *  Archived twice, the newest folder (the date sorts it). */
export function matchArchived(branch: string, archived: string[], lastChangeId: string | null): string | null {
  if (!lastChangeId || boundedAt(branch, lastChangeId) < 0) return null
  return archivedFolders(archived, lastChangeId).sort().at(-1) ?? null
}

const toChange = (c: ChangeFiles, id: string, appetites: string[], archived: boolean): Change =>
  ({ id, appetite: appetiteOf(c.proposal, appetites), ...progress(c.tasks), planMtime: c.planMtime,
    hasDesign: c.design, hasTasks: c.tasks !== null, archived })

/** The branch's change: an open one it names, else the archived one it just followed; else none (D-3). */
export function readChange(open: ChangeFiles[], archived: ChangeFiles[], lastChangeId: string | null, branch: string,
  appetites: string[]): { change: Change | null; openChanges: number } {
  const id = matchOpen(branch, open.map(c => c.id))
  const folder = id === null ? matchArchived(branch, archived.map(c => c.id), lastChangeId) : null
  const files = id === null ? archived.find(c => c.id === folder) : open.find(c => c.id === id)
  return { change: files ? toChange(files, id ?? lastChangeId!, appetites, id === null) : null, openChanges: open.length }
}

/** One predicate, or a list of which any holds (DD-38). */
export const holdsAny = (p: ChangePredicate | ChangePredicate[], c: Change | null, merged = false) =>
  (Array.isArray(p) ? p : [p]).some(q => holds(q, c, merged))

/** Whether the followed branch's pull request was seen merged (D-5). */
export const branchMerged = (s: Pick<NavState, 'root' | 'mergedBranches'>) =>
  s.root !== null && s.mergedBranches.includes(s.root.branch)

/** The fixed predicates a workflow's `change` field names (design §6.1, DD-38). `merged` is whether the
 *  followed branch was merged; it holds only with every task ticked, so a stage's merge moves nothing (D-5). */
export function holds(p: ChangePredicate, c: Change | null, merged = false): boolean {
  if (p === 'none') return c === null
  if (!c) return false
  switch (p) {
    case 'proposal': return !c.hasTasks // a design without tasks is still shaping
    case 'plan': return c.hasDesign && c.hasTasks && c.done === 0
    case 'tasks-no-design': return c.hasTasks && !c.hasDesign
    case 'tasks-open': return c.total > 0 && c.done === 0
    case 'tasks-partial': return c.done > 0 && c.done < c.total
    case 'tasks-done': return c.total > 0 && c.done >= c.total
    case 'merged': return merged && c.total > 0 && c.done >= c.total
    case 'archived': return c.archived
  }
}
