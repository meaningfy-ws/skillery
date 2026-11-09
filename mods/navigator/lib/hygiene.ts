// Session hygiene (design §6.5): when to offer a compaction or a fresh session. Pure. Every number
// and every rule comes from the guardrails data file (DD-9, DD-30); this module holds only the event
// vocabulary and one labelled shortcut.

import type { Warning } from './state.ts'

/** The events the mod recognises from signals (mechanism, not rule). */
export const EVENTS = ['commit', 'phase-left', 'task-group-done', 'pr-merged', 'archived'] as const
export type HygieneEvent = (typeof EVENTS)[number]

export type Thresholds = {
  compact_offer_context_percent: number
  context_warn_percent: number
  fresh_offer_min_context_percent: number
  idle_reset_minutes: number
  subagent_report_max_lines: number
  lookup_max_tool_calls: number
  model_rank: string[]
  safe_point: { after: HygieneEvent; and_any: HygieneEvent[] }
  task_boundary: { any: HygieneEvent[] }
  idle_reset: { requires_clean_tree: boolean }
}
export type ParsedThresholds = { ok: true; thresholds: Thresholds } | { ok: false; error: string }

const NUMBERS = ['compact_offer_context_percent', 'context_warn_percent', 'fresh_offer_min_context_percent',
  'idle_reset_minutes', 'subagent_report_max_lines', 'lookup_max_tool_calls'] as const

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
const isEvent = (v: unknown): v is HygieneEvent => (EVENTS as readonly unknown[]).includes(v)
const isEvents = (v: unknown) => Array.isArray(v) && v.every(isEvent)

/** The guardrails data file, checked key by key; the error names the first bad key. Unknown keys are kept. */
export function thresholdsFrom(raw: unknown): ParsedThresholds {
  if (!isObj(raw)) return { ok: false, error: 'no thresholds file' }
  const bad = (error: string): ParsedThresholds => ({ ok: false, error })
  for (const k of NUMBERS) {
    const v = raw[k]
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) return bad(k)
  }
  const rank = raw['model_rank']
  if (!Array.isArray(rank) || rank.length === 0 || !rank.every(m => typeof m === 'string' && m)) return bad('model_rank')
  const sp = raw['safe_point']
  if (!isObj(sp) || !isEvent(sp['after'])) return bad('safe_point.after')
  if (!isEvents(sp['and_any'])) return bad('safe_point.and_any')
  const tb = raw['task_boundary']
  if (!isObj(tb) || !isEvents(tb['any'])) return bad('task_boundary.any')
  const ir = raw['idle_reset']
  if (!isObj(ir) || typeof ir['requires_clean_tree'] !== 'boolean') return bad('idle_reset.requires_clean_tree')
  return { ok: true, thresholds: raw as Thresholds }
}

const warning = (key: string, message: string): Warning => ({ key, message, remedy: null, owner: 'guardrails' })

export type HygieneInput = {
  events: HygieneEvent[] // since the last safe point or task boundary, oldest first
  contextPercent: number
  idleMinutes: number // now − lastUserPromptAt
  cleanTree: boolean
  openUnticked: boolean // a change is open and has an unticked task
}
export type Offer = 'compact' | 'fresh' | null
/** `point` tells the caller a safe point or task boundary was reached: start a new event list. */
export type HygieneResult = { offer: Offer; point: 'safe-point' | 'task-boundary' | null; warnings: Warning[] }

/** Evaluated at each main TurnEnded. Offers carry provenance `guardrails`, as do the warnings. */
export function offer(parsed: ParsedThresholds, i: HygieneInput): HygieneResult {
  if (!parsed.ok) {
    return { offer: null, point: null,
      warnings: [warning('hygiene:thresholds-missing', `hygiene checks off: guardrails thresholds unreadable (${parsed.error})`)] }
  }
  const t = parsed.thresholds
  const has = (e: HygieneEvent) => i.events.includes(e)
  // shortcut: §6 says "for the next, unrelated task", which no event shows; a bare commit counts as a
  // task boundary only when no unticked task is open, else it falls through to the compact rule (DD-30).
  const boundary = t.task_boundary.any.some(e => has(e) && !(e === 'commit' && i.openUnticked))
  const safe = has(t.safe_point.after) && t.safe_point.and_any.some(has)
  const idle = i.idleMinutes >= t.idle_reset_minutes && (i.cleanTree || !t.idle_reset.requires_clean_tree)
  const point = boundary ? 'task-boundary' : safe ? 'safe-point' : null
  if ((boundary && i.contextPercent >= t.fresh_offer_min_context_percent) || idle) return { offer: 'fresh', point, warnings: [] }
  if (safe && !boundary && i.contextPercent >= t.compact_offer_context_percent) return { offer: 'compact', point, warnings: [] }
  if (point || i.contextPercent < t.context_warn_percent) return { offer: null, point, warnings: [] }
  return { offer: null, point, warnings: [warning('hygiene:context', `context ${Math.round(i.contextPercent)}% mid-step: commit, then compact`)] }
}

/** `session.compact`: an automatic one landed where the rule says not to. */
export const onCompact = (trigger: string): Warning[] =>
  trigger === 'auto' ? [warning('hygiene:auto-compact', 'the context was compacted automatically, mid-step')] : []
