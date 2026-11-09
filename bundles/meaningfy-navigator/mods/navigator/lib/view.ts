// What the status line and the band say (design §9). Plain data, no JSX: register.tsx draws it.

import type { Group, NavState, Subagent } from './state.ts'

const LINE_MAX = 120
const TRAIL = 8
const GLYPH = { ok: '✓', fail: '✗', stale: '·', none: '' } as const

// Names come from folders and events: drop control characters so none reaches the terminal.
const clean = (text: string) => text.replace(/[\u0000-\u001f\u007f-\u009f]/g, '')

export function modeText(s: NavState): string {
  if (s.mode.repo === 'strict' && s.mode.sessionLoose) return '○ loose (strict dropped)'
  return s.mode.repo === 'strict' ? '● strict' : '○ loose'
}

export function lineText(s: NavState): string {
  if (!s.change) return 'navigator · no open change'
  const c = s.change
  const stage = currentGroup(c.groups)
  const step = `${s.phase ? `${s.phase} ` : ''}${stage ? `${stage.done}/${stage.total}` : `${c.done}/${c.total}`}`
  // Only what nothing else on screen shows (DD-35): no model, no plugin glyph, loose is not news.
  const parts = [
    c.id,
    ...(c.appetite ? [c.appetite] : []),
    stage ? `${bareTitle(stage.title)} ${step}` : step,
    ...(stage && c.groups.length > 1 ? [`${c.done}/${c.total}`] : []),
    ...(s.openChanges > 1 ? [`${s.openChanges - 1} more open`] : []),
    ...(isStrict(s) ? ['● strict'] : []),
  ]
  const text = clean(parts.join(' · '))
  const chars = [...text] // whole characters, never half an emoji
  return chars.length > LINE_MAX ? `${chars.slice(0, LINE_MAX - 1).join('')}…` : text
}

const isStrict = (s: NavState) => s.mode.repo === 'strict' && !s.mode.sessionLoose

/** The stage being worked: the first `##` group not finished, else the last one. */
export function currentGroup(groups: Group[]): Group | undefined {
  return groups.find(g => g.done < g.total) ?? groups.at(-1)
}

/** `1. Stage 1 — See it` → `Stage 1 — See it`: the heading without its list number. */
const bareTitle = (title: string) => title.replace(/^\d+\.\s*/, '')

/** `1. Stage 1 — See it` → `1 See it`; `4. Close` → `Close`. */
export function shortTitle(title: string): string {
  const bare = bareTitle(title)
  // shortcut: knows the `Stage <n> — <name>` heading of Meaningfy PLANs; others show as written.
  const stage = bare.match(/^Stage (\d+)\s*[—–-]\s*(.+)$/)
  return stage ? `${stage[1]} ${stage[2]}` : bare
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
  const running = s.subagents.filter(a => !a.done)
  const last = s.skills.at(-1)
  const gates = Object.entries(s.gates)
    .filter(([, g]) => g.state !== 'none')
    .map(([id, g]) => `${id} ${GLYPH[g.state]}`)
  // Empty when there is nothing to report: the band then shows only its buttons.
  const folded = [
    ...(running.length ? [`${running.length} running: ${running.map(a => a.type).join(', ')}`] : []),
    ...(last ? [`last ${last.name}`] : []),
    ...gates,
    ...(s.warnings.length ? [`⚠ ${s.warnings.length}`] : []),
  ].join(' · ')
  const rows: BandModel['rows'] = []
  if (s.change && s.change.groups.length) {
    const now = currentGroup(s.change.groups)
    rows.push({
      label: 'stages',
      items: s.change.groups.map(g =>
        `${g.total > 0 && g.done === g.total ? '✓' : g === now ? '●' : '○'} ${shortTitle(g.title)} ${g.done}/${g.total}`),
    })
  }
  rows.push(
    { label: 'skills', items: s.skills.slice(-TRAIL).map(k => k.name) },
    { label: 'subagents', items: s.subagents.map(subagentText) },
    { label: 'mode', items: [modeText(s)] },
  )
  return { folded: clean(folded), rows: rows.map(r => ({ ...r, items: r.items.map(clean) })) }
}
