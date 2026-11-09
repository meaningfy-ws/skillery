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
const BAND_CYCLE: BandDisplay[] = ['folded', 'unfolded', 'hidden']

export type Signal =
  | { kind: 'Started'; id: string; sessionId: string; band: BandDisplay; statusLine: boolean }
  | { kind: 'ChangeRead'; id: string; change: Change | null; openChanges: number }
  | { kind: 'SkillLoaded'; id: string; name: string; at: number }
  | { kind: 'SubagentSpawned'; id: string; agentId: string; type: string; model: string; description: string; at: number }
  | { kind: 'SubagentFinished'; id: string; agentId: string; tokens: number }
  | { kind: 'TurnEnded'; id: string; model: string | null }
  | { kind: 'ToggleBand'; id: string }
  | { kind: 'ToggleLine'; id: string }

/** Load a stored state of any earlier shape: new fields take their defaults. */
export function revive(stored: unknown): NavState {
  return stored && typeof stored === 'object' ? { ...EMPTY, ...(stored as Partial<NavState>) } : EMPTY
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
      return { ...EMPTY, sessionId: s.sessionId, display: { band: s.band, line: s.statusLine } }
    case 'ChangeRead':
      return { ...state, change: s.change, openChanges: s.openChanges }
    case 'SkillLoaded':
      return { ...state, skills: [...state.skills, { name: s.name, at: s.at }] }
    case 'SubagentSpawned':
      return {
        ...state,
        subagents: [...state.subagents, {
          agentId: s.agentId, toolUseId: s.id, type: s.type, model: s.model,
          description: s.description, startedAt: s.at, tokens: 0, done: false,
        }],
      }
    case 'SubagentFinished':
      return {
        ...state,
        subagents: state.subagents.map(a =>
          a.agentId === s.agentId ? { ...a, tokens: a.tokens + s.tokens, done: true } : a),
      }
    case 'TurnEnded':
      return s.model ? { ...state, mainModel: s.model } : state
    case 'ToggleBand': {
      const i = BAND_CYCLE.indexOf(state.display.band)
      return { ...state, display: { ...state.display, band: BAND_CYCLE[(i + 1) % BAND_CYCLE.length]! } }
    }
    case 'ToggleLine':
      return { ...state, display: { ...state.display, line: !state.display.line } }
  }
}
