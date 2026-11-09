// Which change, its appetite and its progress (design §6.1). Pure: register.tsx reads the files.

import type { Change, Group } from './state.ts'

export type ChangeFiles = {
  id: string
  proposal: string
  tasks: string | null
  mtime: number // newest mtime of the change's files
  planMtime: number // newest mtime of design.md and tasks.md, 0 if neither
}

/** The appetite names are the build-tier workflow's `reviews` keys; the mod holds no list. */
export function appetiteOf(proposal: string, appetites: string[]): string | null {
  const section = proposal.split(/^## Appetite\s*$/m)[1]
  if (!section) return null
  const para = section.trim().split(/\n\s*\n|^## /m)[0] ?? ''
  const byLength = [...appetites].sort((a, b) => b.length - a.length)
  return byLength.find(a => para.includes(a)) ?? null
}

export function progress(tasks: string | null): { done: number; total: number; groups: Group[] } {
  const groups: Group[] = []
  let current: Group | null = null
  for (const line of (tasks ?? '').split('\n')) {
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
  const byBranch = open.filter(c => branch.includes(c.id)).sort((a, b) => b.id.length - a.id.length)[0]
  const pick = byBranch ?? [...open].sort((a, b) => b.mtime - a.mtime)[0]!
  return {
    change: { id: pick.id, appetite: appetiteOf(pick.proposal, appetites), ...progress(pick.tasks), planMtime: pick.planMtime },
    openChanges: open.length,
  }
}
