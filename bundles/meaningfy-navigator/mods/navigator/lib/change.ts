// Which change, its appetite and its progress (design §6.1). Pure: register.tsx reads the files.

import type { Change, ChangePredicate, Group } from './state.ts'

export type ChangeFiles = {
  id: string
  proposal: string
  tasks: string | null
  design: boolean
  mtime: number // newest mtime of the change's files
  planMtime: number // newest mtime of design.md and tasks.md, 0 if neither
}

/** The appetite names are the build-tier workflow's `reviews` keys; the mod holds no list. */
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

/** The branch's change if its name contains an id, else the most recently modified (DD-13). */
export function readChange(open: ChangeFiles[], branch: string, appetites: string[]):
  { change: Change | null; openChanges: number } {
  if (open.length === 0) return { change: null, openChanges: 0 }
  const recent = [...open].sort((a, b) => b.mtime - a.mtime || a.id.localeCompare(b.id))
  // The longest id the branch names; a tie goes to the most recent, so folder order never decides.
  // shortcut: a substring match, so a short id such as `fix` also matches `fix/other`; match on
  // separators if people report a wrong change.
  const byBranch = recent.filter(c => branch.includes(c.id)).sort((a, b) => b.id.length - a.id.length)[0]
  const pick = byBranch ?? recent[0]!
  return {
    change: { id: pick.id, appetite: appetiteOf(pick.proposal, appetites), ...progress(pick.tasks), planMtime: pick.planMtime,
      hasDesign: pick.design, hasTasks: pick.tasks !== null },
    openChanges: open.length,
  }
}

/** The fixed predicates a workflow's `change` field names (design §6.1). */
export function holds(p: ChangePredicate, c: Change | null): boolean {
  if (p === 'none') return c === null
  if (!c) return false
  switch (p) {
    case 'proposal': return !c.hasDesign && !c.hasTasks
    case 'plan': return c.hasDesign && c.hasTasks && c.done === 0
    case 'tasks-no-design': return c.hasTasks && !c.hasDesign
    case 'tasks-open': return c.total > 0 && c.done === 0
    case 'tasks-partial': return c.done > 0 && c.done < c.total
    case 'tasks-done': return c.total > 0 && c.done === c.total
    // shortcut: the mod does not watch archive/; the archive phase is entered by its skill or
    // `openspec archive`. Upgrade if the phase is missed.
    case 'archived': return false
  }
}
