// What the status line and the band say (design §9). Plain data, no JSX: register.tsx draws it.

import { nextStep } from './actions.ts'
import { openDrift } from './process-drift.ts'
import { reviewQuota, smallStageAllowance } from './dispatch.ts'
import { isStrict, phasesOf, workflowOf } from './workflow.ts'
import type { Group, NavState, Subagent, Warning } from './state.ts'

const LINE_MAX = 120
const TRAIL = 8
const GLYPH = { ok: '✓', fail: '✗', stale: '·', none: '' } as const

// Names come from folders and events: drop control characters so none reaches the terminal.
const clean = (text: string) => text.replace(/[\u0000-\u001f\u007f-\u009f]/g, '')

export function modeText(s: NavState): string {
  const { repo, session } = s.mode
  if (session && session !== repo) return session === 'strict' ? '● strict (this session)' : '○ loose (strict dropped)'
  return repo === 'strict' ? '● strict' : '○ loose'
}

export function lineText(s: NavState): string {
  const w = workflowOf(s)
  // A workflow that is not about a change (DevOps, sales, architecting): its name, variant and phase.
  if (w && !w.activate.openChange) {
    return cut(clean([`${w.name}${w.provisional ? ' (provisional)' : ''}`, s.variant, s.phase,
      isStrict(s) ? '● strict' : null].filter(Boolean).join(' · ')))
  }
  if (!s.change) {
    return cut(clean(['navigator', s.root ? `no change for branch ${s.root.branch}` : 'no repository', s.phase,
      isStrict(s) ? '● strict' : null].filter(Boolean).join(' · ')))
  }
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
  return cut(clean(parts.join(' · ')))
}

function cut(text: string): string {
  const chars = [...text] // whole characters, never half an emoji
  return chars.length > LINE_MAX ? `${chars.slice(0, LINE_MAX - 1).join('')}…` : text
}


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
  // A long heading keeps its name, not its explanation: `Roots (#55) — BREAKING for …` → `Roots (#55)`.
  return stage ? `${stage[1]} ${stage[2]}` : bare.replace(/\s+[—–]\s.*$/, '')
}

/** What an item's glyph says, so the band can colour it: done, current, to do, failed, warning. */
export type Tone = 'done' | 'now' | 'todo' | 'fail' | 'warn' | null
export function toneOf(item: string): Tone {
  if (item.startsWith('⚠')) return 'warn'
  if (item.startsWith('✗') || / ✗( |$)/.test(item)) return 'fail'
  if (item.startsWith('✓') || / ✓( |$)/.test(item)) return 'done'
  if (item.startsWith('●')) return 'now'
  if (item.startsWith('○')) return 'todo'
  return null
}

/** At most `max` lines; the rest become one `+n more` line. */
export function capped(items: string[], max: number): string[] {
  return items.length > max ? [...items.slice(0, max - 1), `+${items.length - max + 1} more`] : items
}

export function subagentText(a: Subagent): string {
  const state = a.done ? `done · ${tokens(a.tokens)} tokens` : 'running'
  return `${a.type} · ${a.model} · ${state}`
}

function tokens(n: number): string {
  return n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

export type BandModel = {
  folded: string
  foldedItems: string[]
  rows: { label: string; items: string[] }[]
}

/** Accept and the Archive check do nothing on an archived change, so they are not offered (D-3, D-21.5). */
export function bandOffers(s: NavState): { accept: Warning[]; check: boolean } {
  const archived = !!s.change?.archived
  return { accept: archived ? [] : openDrift(s), check: !!s.change && !archived }
}

/** Warnings not recorded as deviations; accepted ones show but do not count. */
const openCount = (s: NavState) => s.warnings.filter(w => !s.accepted.includes(w.key)).length // every kind, accepted aside

export function bandModel(s: NavState): BandModel {
  const running = s.subagents.filter(a => !a.done)
  const last = s.skills.at(-1)
  const gates = Object.entries(s.gates)
    .filter(([, g]) => g.state !== 'none')
    .map(([id, g]) => `${id} ${GLYPH[g.state]}${/^\d+(\.\d+)?$/.test(g.detail) ? ` ${g.detail}` : ''}`)
  // Empty when there is nothing to report: the band then shows only its buttons.
  const foldedItems = [
    ...(running.length ? [`${running.length} running: ${running.map(a => a.type).join(', ')}`] : []),
    ...(last ? [`last ${last.name}`] : []),
    ...gates,
    ...(openCount(s) ? [`⚠ ${openCount(s)}`] : []),
  ].map(clean)
  const rows: BandModel['rows'] = []
  if (s.change && s.change.groups.length) {
    const now = currentGroup(s.change.groups)
    rows.push({
      label: 'stages',
      items: s.change.groups.map(g =>
        `${g.total > 0 && g.done === g.total ? '✓' : g === now ? '●' : '○'} ${shortTitle(g.title)} ${g.done}/${g.total}`),
    })
  }
  const w = workflowOf(s)
  if (w) {
    const phases = phasesOf(w, s.variant)
    const now = phases.findIndex(p => p.id === s.phase)
    rows.push({
      label: 'phases',
      items: [`${w.title}${s.variant ? ` (${s.variant})` : ''}${w.provisional ? ' (provisional)' : ''}`,
        ...phases.map((p, i) => `${i < now ? '✓' : i === now ? '●' : '○'} ${p.id}`)],
    })
  }
  // Appetite against actual (§9 row 4): shown, never judged (no budget, per guardrails).
  if (s.change) {
    const c = s.change
    const ceiling = reviewQuota(s), small = smallStageAllowance(s)
    const reviewers = s.turnRoles.filter(x => x === 'reviewer').length
    rows.push({ label: 'appetite', items: [
      c.appetite ?? '?', `tasks ${c.done}/${c.total}`,
      ...(c.groups.length ? [`groups ${c.groups.filter(g => g.total > 0 && g.done === g.total).length}/${c.groups.length}`] : []),
      ...(ceiling !== null ? [`reviewers ${reviewers}/${ceiling} this turn`] : []),
      ...(small !== null ? [`small stage: ${small} allowed`] : []),
      ...(s.sessionTokens ? [`${tokens(s.sessionTokens)} tokens`] : []),
      ...(s.usd !== null ? [`$${s.usd.toFixed(2)}`] : []),
    ] })
  }
  rows.push(
    { label: 'skills', items: s.skills.slice(-TRAIL).map(k => k.phase ? `${k.name} (${k.phase})` : k.name) },
    { label: 'subagents', items: s.subagents.map(subagentText) },
    { label: 'warnings', items: [
      ...warningItems(s),
      ...(s.planTruncated ? ['diff truncated'] : []),
    ] },
    { label: 'mode', items: [modeText(s)] },
  )
  return { folded: foldedItems.join(' · '), foldedItems, rows: rows.map(r => ({ ...r, items: r.items.map(clean) })) }
}

/** Severity tier of a warning key, 1 (most severe) to 5 (D-10); an unknown prefix ranks 3. */
export function tierOf(key: string): 1 | 2 | 3 | 4 | 5 {
  if (/^(workflow:error|process:(gate|missing|elsewhere|external):)/.test(key)) return 1
  if (key.startsWith('plan:')) return 2
  if (key.startsWith('hygiene:unused:')) return 5
  if (key.startsWith('hygiene:')) return 4
  return 3 // process:inline, model, overspawn, second-check, and any unknown prefix
}

/** Every warning by tier; within a tier the newest first (the list is appended in arrival order). */
export function orderedWarnings(s: NavState): Warning[] {
  return s.warnings.map((w, i) => ({ w, i, t: tierOf(w.key) })).sort((a, b) => a.t - b.t || b.i - a.i).map(x => x.w)
}

// ------------------------------------------------------------------ the band (D-11)
export type BandView = {
  /** Folded, line 1: phase, stage, running subagents; or why there is nothing to follow. */
  now: string
  /** Folded, line 2: `next: <step>`, null when there is none. */
  next: string | null
  /** Folded, line 3: `⚠ <top message> · n more` (tiers 1-4, not accepted); null when none. */
  warning: string | null
  details: {
    reading: string | null
    rows: { label: string; items: string[] }[] // stages, phases (with gates), appetite, skills, subagents
    warnings: { key: string; message: string; tier: number; accepted: boolean; accept: boolean }[] // `accept`: an Accept button is offered
    mode: string
    actions: string[] // button labels, in order
  }
}

const bareName = (name: string) => name.slice(name.lastIndexOf(':') + 1)
const elapsed = (ms: number) => { const m = Math.floor(Math.max(0, ms) / 60_000)
  return m < 1 ? `${Math.floor(Math.max(0, ms) / 1000)}s` : m < 60 ? `${m}m` : `${Math.floor(m / 60)}h${m % 60}m` }

function nowText(s: NavState, now: number): string {
  const w = workflowOf(s)
  const running = s.subagents.filter(a => !a.done)
  const crew = [...running.slice(0, 2).map(a => `${a.description} → ${bareName(a.type)} (${elapsed(now - a.startedAt)})`),
    ...(running.length > 2 ? [`+${running.length - 2}`] : [])]
  if (w && !w.activate.openChange) return [w.name, s.variant, s.phase, ...crew].filter(Boolean).join(' · ')
  if (!s.change) return s.root ? `no change for branch ${s.root.branch}` : 'no open change'
  const c = s.change, stage = currentGroup(c.groups)
  return [s.phase, stage ? `${shortTitle(stage.title)} ${stage.done}/${stage.total}` : `${c.done}/${c.total}`, ...crew]
    .filter(Boolean).join(' · ')
}

function subagentGroups(s: NavState): string[] {
  const types = [...new Set(s.subagents.map(a => bareName(a.type)))]
  return types.map(t => {
    const g = s.subagents.filter(a => bareName(a.type) === t)
    const done = g.filter(a => a.done).length, running = g.length - done
    const tok = g.reduce((n, a) => n + a.tokens, 0)
    // A model is shown only when it differs from the lead's; with the lead's model unknown nothing is claimed.
    const models = s.parentModel ? [...new Set(g.map(a => a.model).filter(m => m !== s.parentModel))] : []
    return [`${t}${done > 1 ? ` ×${done}` : ''}${done ? ' done' : ''}`, ...models, ...(tok ? [`${tokens(tok)} tokens`] : []),
      ...(running ? [`${running} running`] : [])].join(' · ')
  })
}

function skillGroups(s: NavState): string[] {
  const out: { phase: string | null; names: string[] }[] = []
  for (const k of s.skills.slice(-TRAIL)) {
    const g = out.find(x => x.phase === k.phase) ?? (out.push({ phase: k.phase, names: [] }), out.at(-1)!)
    g.names.push(bareName(k.name))
  }
  return out.map(g => `${g.phase ? `${g.phase}: ` : ''}${g.names.join(', ')}`)
}

/** What the band says (D-11), as plain data for register.tsx. `now` and `home` come in so it stays pure. */
export function bandView(s: NavState, env: { now: number; home: string }): BandView {
  const offers = bandOffers(s)
  const open = orderedWarnings(s).filter(x => !s.accepted.includes(x.key) && tierOf(x.key) <= 4)
  const step = nextStep(s)
  const rows: BandView['details']['rows'] = []
  const c = s.change
  if (c?.groups.length) {
    const cur = currentGroup(c.groups)
    rows.push({ label: 'stages', items: c.groups.map(g =>
      `${g.total > 0 && g.done === g.total ? '✓' : g === cur ? '●' : '○'} ${shortTitle(g.title)} ${g.done}/${g.total}`) })
  }
  const gates = Object.entries(s.gates).filter(([, g]) => g.state !== 'none')
    .map(([id, g]) => `${id} ${GLYPH[g.state]}${/^\d+(\.\d+)?$/.test(g.detail) ? ` ${g.detail}` : ''}`)
  const wf = workflowOf(s)
  if (wf) {
    const phases = phasesOf(wf, s.variant)
    const at = phases.findIndex(p => p.id === s.phase)
    rows.push({ label: 'phases', items: [`${wf.title}${s.variant ? ` (${s.variant})` : ''}${wf.provisional ? ' (provisional)' : ''}`,
      ...phases.map((p, i) => `${i < at ? '✓' : i === at ? '●' : '○'} ${p.id}`), ...gates] })
  } else if (gates.length) rows.push({ label: 'phases', items: gates })
  if (c) {
    const ceiling = reviewQuota(s), small = smallStageAllowance(s)
    const reviewers = s.turnRoles.filter(x => x === 'reviewer').length
    rows.push({ label: 'appetite', items: [c.appetite ?? '?', `tasks ${c.done}/${c.total}`,
      ...(c.groups.length ? [`groups ${c.groups.filter(g => g.total > 0 && g.done === g.total).length}/${c.groups.length}`] : []),
      ...(ceiling !== null ? [`reviewers ${reviewers}/${ceiling} this turn`] : []),
      ...(small !== null ? [`small stage: ${small} allowed`] : []),
      ...(s.sessionTokens ? [`${tokens(s.sessionTokens)} tokens`] : [])] })
  }
  rows.push({ label: 'skills', items: skillGroups(s) }, { label: 'subagents', items: subagentGroups(s) })
  const home = env.home
  const where = s.root && home && (s.root.path === home || s.root.path.startsWith(`${home}/`)) ? `~${s.root.path.slice(home.length)}` : s.root?.path
  return {
    now: clean(nowText(s, env.now)),
    next: step ? clean(`next: ${step}`) : null,
    warning: open.length ? clean(`⚠ ${open[0]!.message}${open.length > 1 ? ` · ${open.length - 1} more` : ''}`) : null,
    details: {
      reading: s.root ? clean(`reading ${where} · ${s.root.branch}`) : null,
      rows: rows.map(r => ({ ...r, items: r.items.map(clean) })),
      warnings: orderedWarnings(s).map(x => ({ key: x.key, message: clean(x.message), tier: tierOf(x.key),
        accepted: s.accepted.includes(x.key), accept: offers.accept.some(o => o.key === x.key) })),
      mode: modeText(s),
      actions: ['Reconcile EPIC', ...(offers.check ? ['Archive check'] : []), 'Validate', 'Review', 'Mode', 'Less'],
    },
  }
}

const OUTSIDE = 'plan:outside:'

/** One line per warning, except files outside the PLAN: one line for all of them (open, accepted). */
function warningItems(s: NavState): string[] {
  const line = (w: Warning) => `${s.accepted.includes(w.key) ? '✓ accepted:' : '⚠'} ${w.message}${w.owner ? ` (${w.owner})` : ''}`
  const outside = (accepted: boolean) => s.warnings.filter(w => w.key.startsWith(OUTSIDE) && s.accepted.includes(w.key) === accepted)
  const group = (ws: Warning[], accepted: boolean) => {
    if (ws.length < 2) return ws.map(line)
    const paths = ws.map(w => w.key.slice(OUTSIDE.length))
    return [`${accepted ? '✓ accepted:' : '⚠'} ${ws.length} files outside the PLAN: ${paths.slice(0, 2).join(', ')}` +
      `${ws.length > 2 ? ` +${ws.length - 2}` : ''} (${ws[0]!.owner})`]
  }
  return [...s.warnings.filter(w => !w.key.startsWith(OUTSIDE)).map(line), ...group(outside(false), false), ...group(outside(true), true)]
}
