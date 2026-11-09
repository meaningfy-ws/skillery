// The state contract (design §3). reduce() is the only writer; every function here is pure.

import type { BandDisplay, Change, NavState } from '../types'

export type { BandDisplay, Change, GateState, Group, NavState, SkillUse, Subagent } from '../types'

export const EMPTY: NavState = {
  version: 1,
  sessionId: '',
  change: null,
  openChanges: 0,
  phase: null,
  mode: { repo: 'loose', sessionLoose: false },
  mainModel: null,
  skills: [],
  subagents: [],
  gates: {},
  warnings: [],
  display: { band: 'folded', line: true },
  seen: [],
}

const SEEN_MAX = 200
export const BAND_DISPLAYS: readonly BandDisplay[] = ['folded', 'unfolded', 'hidden'] // also the /navigator band cycle

export type Settings = { band: BandDisplay; statusLine: boolean }

/** The plugin settings (userConfig) as the mod uses them; anything unknown takes the default. */
export function settingsFrom(options: Readonly<Record<string, unknown>>): Settings {
  const band = BAND_DISPLAYS.find(b => b === options['band']) ?? EMPTY.display.band
  return { band, statusLine: options['statusLine'] !== false }
}

export type Signal =
  | { kind: 'Started'; id: string; sessionId: string; band: BandDisplay; statusLine: boolean; model?: string | null }
  | { kind: 'ChangeRead'; id: string; change: Change | null; openChanges: number }
  | { kind: 'SkillLoaded'; id: string; name: string; at: number }
  | { kind: 'SubagentSpawned'; id: string; agentId: string; type: string; model: string; description: string; at: number }
  | { kind: 'SubagentFinished'; id: string; agentId: string; tokens: number }
  | { kind: 'TurnEnded'; id: string; model: string | null }
  | { kind: 'ToggleBand'; id: string }
  | { kind: 'SetBand'; id: string; band: BandDisplay }
  | { kind: 'ToggleLine'; id: string }

const kindOf = (v: unknown) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v)

/** Load a stored state of any earlier shape: new fields, and fields of the wrong type, take their
 *  defaults; unknown fields of a later version are kept. */
export function revive(stored: unknown): NavState {
  if (!stored || typeof stored !== 'object') return EMPTY
  const out: Record<string, unknown> = { ...EMPTY }
  for (const [k, v] of Object.entries(stored)) {
    const d = (EMPTY as Record<string, unknown>)[k]
    if (!(k in EMPTY) || kindOf(v) === kindOf(d) || d === null) out[k] = v
  }
  return out as NavState
}

export function reduce(state: NavState, s: Signal): NavState {
  // A new session starts clean whatever was seen before; every other signal is applied once.
  if (s.kind !== 'Started' && state.seen.includes(s.id)) return state
  const seen = [...state.seen, s.id].slice(-SEEN_MAX)
  const next = apply(state, s)
  return { ...next, seen: s.kind === 'Started' ? [s.id] : seen }
}

function apply(state: NavState, s: Signal): NavState {
  switch (s.kind) {
    case 'Started':
      return { ...EMPTY, sessionId: s.sessionId, mainModel: s.model ?? null, display: { band: s.band, line: s.statusLine } }
    case 'ChangeRead':
      return { ...state, change: s.change, openChanges: s.openChanges }
    case 'SkillLoaded':
      return { ...state, skills: [...state.skills, { name: s.name, at: s.at }] }
    case 'SubagentSpawned': {
      // The spawn may resolve after the subagent's turn completed: keep what the finish recorded.
      const known = state.subagents.find(a => a.agentId === s.agentId)
      const spawned = { agentId: s.agentId, toolUseId: s.id, type: s.type, model: s.model,
        description: s.description, startedAt: s.at, tokens: known?.tokens ?? 0, done: known?.done ?? false }
      return { ...state, subagents: [...state.subagents.filter(a => a !== known), spawned] }
    }
    case 'SubagentFinished': {
      const known = state.subagents.some(a => a.agentId === s.agentId)
      const finished = known ? state.subagents : [...state.subagents, {
        agentId: s.agentId, toolUseId: '', type: '?', model: '?', description: '', startedAt: 0, tokens: 0, done: false }]
      return {
        ...state,
        subagents: finished.map(a =>
          a.agentId === s.agentId ? { ...a, tokens: a.tokens + s.tokens, done: true } : a),
      }
    }
    case 'TurnEnded':
      return s.model ? { ...state, mainModel: s.model } : state
    case 'ToggleBand': {
      const i = BAND_DISPLAYS.indexOf(state.display.band)
      return { ...state, display: { ...state.display, band: BAND_DISPLAYS[(i + 1) % BAND_DISPLAYS.length]! } }
    }
    case 'SetBand':
      return { ...state, display: { ...state.display, band: s.band } }
    case 'ToggleLine':
      return { ...state, display: { ...state.display, line: !state.display.line } }
  }
}
