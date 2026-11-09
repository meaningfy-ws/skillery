// What the status line and the band say (design §9). Plain data, no JSX: register.tsx draws it.

import type { NavState, Subagent } from './state.ts'

const LINE_MAX = 120
const TRAIL = 8
const GLYPH = { ok: '✓', fail: '✗', stale: '·', none: '' } as const

export function modeText(s: NavState): string {
  if (s.mode.repo === 'strict' && s.mode.sessionLoose) return '○ loose (strict dropped)'
  return s.mode.repo === 'strict' ? '● strict' : '○ loose'
}

export function lineText(s: NavState): string {
  if (!s.change) return '⎈ no open change'
  const c = s.change
  const parts = [
    `⎈ ${c.id}${s.openChanges > 1 ? ` +${s.openChanges - 1}` : ''}`,
    c.appetite ?? '?',
    `${s.phase ? `${s.phase} ` : ''}${c.done}/${c.total}`,
    ...(s.mainModel ? [`main ${s.mainModel}`] : []),
    modeText(s),
  ]
  const text = parts.join(' · ')
  return text.length > LINE_MAX ? `${text.slice(0, LINE_MAX - 1)}…` : text
}

export function subagentText(a: Subagent): string {
  const state = a.done ? `done · ${tokens(a.tokens)} tokens` : 'running'
  return `${a.type} · ${a.model} · ${state}`
}

function tokens(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

export type BandModel = {
  folded: string
  rows: { label: string; items: string[] }[]
}

export function bandModel(s: NavState): BandModel {
  const running = s.subagents.filter(a => !a.done).length
  const last = s.skills.at(-1)
  const gates = Object.entries(s.gates)
    .filter(([, g]) => g.state !== 'none')
    .map(([id, g]) => `${id} ${GLYPH[g.state]}`)
  const folded = [
    `▸ ${running} running`,
    ...(last ? [`last ${last.name}`] : []),
    ...gates,
    ...(s.warnings.length ? [`⚠ ${s.warnings.length}`] : []),
  ].join(' · ')
  const rows: BandModel['rows'] = [
    { label: 'skills', items: s.skills.slice(-TRAIL).map(k => k.name) },
    { label: 'subagents', items: s.subagents.map(subagentText) },
  ]
  if (s.change) {
    const c = s.change
    const groups = c.groups.filter(g => g.total > 0 && g.done === g.total).length
    rows.push({
      label: 'progress',
      items: [`appetite ${c.appetite ?? '?'}`, `tasks ${c.done}/${c.total}`, `groups ${groups}/${c.groups.length}`],
    })
  }
  return { folded, rows }
}
