// Plan drift PL-1..PL-3 (design §6.4). Pure: register.tsx reads git and the change files and passes text in.
// shortcut: text matching, not semantics; a path named anywhere in the PLAN counts as covered.

import type { Warning } from './state.ts'
import { globRegex } from './workflow.ts'

export const ADDED_CAP = 2000 // design §13: PL-3 reads the first 2 000 added lines

export type AddedLine = { path: string; line: number; text: string }
export type PlanInput = {
  changed: string[]   // git diff --name-only <base>...HEAD plus git status --porcelain paths
  added: AddedLine[]  // added lines of git diff -U0 <base>...HEAD
  tasks: string; design: string; proposal: string
  ignore: string[]    // planDrift.ignore globs (validated by workflow.ts, DD-38)
  changeId: string
}

const OWNER = 'epic-planning' // owns the EPIC and PLAN that Reconcile EPIC updates
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
/** `s` appears in `text` as a whole path or word, not inside a longer one. */
const names = (text: string, s: string) => new RegExp(`(?<![\\w./-])${esc(s)}(?![\\w-]|\\.\\w)`).test(text)

export function planDrift(i: PlanInput): Warning[] {
  const remedy = `openspec-update-change ${i.changeId}`
  const warn = (key: string, message: string): Warning => ({ key, message, remedy, owner: OWNER })
  const ignores = i.ignore.map(globRegex)
  const own = `openspec/changes/${i.changeId}/`
  const skip = (p: string) => p.startsWith(own) || ignores.some(r => r.test(p))
  const plan = [i.tasks, i.design, i.proposal].join('\n')

  const covered = (p: string) => {
    const parts = p.split('/')
    const stem = (parts.at(-1) ?? '').replace(/\.[^.]*$/, '')
    const folders = parts.slice(0, -1).map((_, n) => parts.slice(0, n + 1).join('/')).filter(f => f.includes('/'))
    return names(plan, p) || folders.some(f => names(plan, f)) || (stem.length >= 4 && names(plan, stem))
  }
  const pl1 = [...new Set(i.changed)].filter(p => !skip(p) && !covered(p))
    .map(p => warn(`plan:outside:${p}`, `${p} changed; no task, design or proposal names it`))

  const changedMatch = (t: string) => i.changed.some(p =>
    p === t || p.endsWith(`/${t}`) || p.startsWith(t.endsWith('/') ? t : `${t}/`) || (t.endsWith('/') && p.includes(`/${t}`)))
  const pl2: Warning[] = []
  for (const m of i.tasks.matchAll(/^\s*- \[[xX]\]\s+(\d+\.\d+)\b(.*)$/gm)) {
    const tokens = [...m[2]!.matchAll(/`([^`\s]+)`/g)].map(t => t[1]!).filter(t => t.includes('/') || /^[\w-]+\.[A-Za-z]{1,6}$/.test(t)) // `v3.9.0`, `s.mode.session` are not paths
    if (tokens.length && !tokens.some(changedMatch)) {
      pl2.push(warn(`plan:ticked:${m[1]}`, `task ${m[1]} is ticked but none of ${tokens.join(', ')} changed`))
    }
  }

  const pl3 = i.added.slice(0, ADDED_CAP).filter(a => !skip(a.path)).flatMap(a => {
    const newIds = [...new Set(a.text.match(/\b(?:DD|DEC)-\d+\b/g) ?? [])].filter(id => !names(i.design, id))
    const shortcut = a.text.includes('shortcut:') && !names(i.design, a.path)
    if (!shortcut && !newIds.length) return []
    const what = newIds.length ? `${newIds.join(', ')} not in design.md` : 'a shortcut design.md does not record'
    return [warn(`plan:decision:${a.path}:${a.line}`, `${a.path}:${a.line}: ${what}`)]
  })
  return [...pl1, ...pl2, ...pl3]
}

/** The added lines of `git diff -U0`, at most ADDED_CAP; `truncated` is the appetite row's `diff truncated` (and rules out `smallStageAllowance`). */
export function parseDiffAdded(diff: string): { added: AddedLine[]; truncated: boolean } {
  const added: AddedLine[] = []
  let path: string | null = null
  let line = 0
  // Inside a hunk its header's counts say how many lines are left, so `+++ x` there is an added
  // line, and outside one it is a file header (DD-41). Git appends a tab to a path with a space.
  let adds = 0
  let dels = 0
  for (const l of diff.split('\n')) {
    if (adds === 0 && dels === 0) {
      if (l.startsWith('+++ ')) path = l.startsWith('+++ /dev/null') ? null : l.slice(4).replace(/\t$/, '').replace(/^b\//, '')
      const h = l.match(/^@@ -\d+(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/)
      if (h) { dels = Number(h[1] ?? 1); line = Number(h[2]); adds = Number(h[3] ?? 1) }
    } else if (l.startsWith('-')) dels = Math.max(0, dels - 1)
    else if (l.startsWith('+')) {
      adds -= 1
      if (path === null) continue
      if (added.length === ADDED_CAP) return { added, truncated: true }
      added.push({ path, line: line++, text: l.slice(1) })
    }
  }
  return { added, truncated: false }
}

/** The paths of `git status --porcelain` (v1); a rename gives its new path. */
export function parseStatus(text: string): string[] {
  return text.split('\n').filter(l => l.length > 3)
    .map(l => (l.slice(3).split(' -> ').at(-1) ?? '').replace(/^"(.*)"$/, '$1'))
}
