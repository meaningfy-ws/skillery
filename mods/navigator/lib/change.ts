// Which change, its appetite and its progress (design §6.1). Pure: register.tsx reads the files.

import type { Change, ChangePredicate, Group } from './state.ts'

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

/** Where `id` occurs in `branch` bounded by the start, the end, `/` or `-` on both sides; -1 if it does not (D-3). */
function boundedAt(branch: string, id: string): number {
  const m = new RegExp(`(^|[/-])${escape(id)}([/-]|$)`).exec(branch)
  return m ? m.index + m[1]!.length : -1
}

/** The open change id a branch names: the longest, on a tie the one named later, then alphabetical.
 *  Never the most recently modified (DEC-3). */
export function matchOpen(branch: string, open: string[]): string | null {
  const hits = open.filter(id => id && boundedAt(branch, id) >= 0)
  hits.sort((a, b) => b.length - a.length || boundedAt(branch, b) - boundedAt(branch, a) || a.localeCompare(b))
  return hits[0] ?? null
}

const ARCHIVE_DATE = /^\d{4}-\d{2}-\d{2}-/

/** The archived folder (`<date>-<id>`) of the change just archived: only `lastChangeId`, and only when the branch names it. */
export function matchArchived(branch: string, archived: string[], lastChangeId: string | null): string | null {
  if (!lastChangeId || boundedAt(branch, lastChangeId) < 0) return null
  return archived.find(f => f.replace(ARCHIVE_DATE, '') === lastChangeId) ?? null
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
export const holdsAny = (p: ChangePredicate | ChangePredicate[], c: Change | null) =>
  (Array.isArray(p) ? p : [p]).some(q => holds(q, c))

/** The fixed predicates a workflow's `change` field names (design §6.1, DD-38). */
export function holds(p: ChangePredicate, c: Change | null): boolean {
  if (p === 'none') return c === null
  if (!c) return false
  switch (p) {
    case 'proposal': return !c.hasTasks // a design without tasks is still shaping
    case 'plan': return c.hasDesign && c.hasTasks && c.done === 0
    case 'tasks-no-design': return c.hasTasks && !c.hasDesign
    case 'tasks-open': return c.total > 0 && c.done === 0
    case 'tasks-partial': return c.done > 0 && c.done < c.total
    case 'tasks-done': return c.total > 0 && c.done >= c.total
    // shortcut: the mod does not watch archive/; the archive phase is entered by
    // `openspec-archive-change` only. Upgrade if the phase is missed.
    case 'archived': return false
  }
}
