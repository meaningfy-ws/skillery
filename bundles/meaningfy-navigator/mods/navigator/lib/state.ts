// The state contract (design §3). reduce() is the only writer; every function here is pure.

import type { BandDisplay, Change, NavState, Warning, Workflow } from '../types'
import { lean } from './lean.ts'
import { navigate } from './phase.ts'
import { addWarnings, clearGateWarnings, gatesAfterCommand, gatesAfterFile, gatesAfterPlan, gatesAfterSkill, onCommand,
  onCommit, onSkill, showsConsent, workflowErrors } from './process-drift.ts'
import { bare, currentPhase, isCommit, workflowOf } from './workflow.ts'

export type { Activate, BandDisplay, Change, ChangePredicate, Gate, GateState, Group, NavState, Phase, Review, SkillUse,
  Subagent, Warning, Workflow } from '../types'

export const EMPTY: NavState = {
  version: 1,
  sessionId: '',
  change: null,
  openChanges: 0,
  workflows: [],
  interactive: true,
  workflow: null,
  variant: null,
  phase: null,
  phaseAt: 0,
  signalPhase: null,
  consent: {},
  consentShown: false,
  mode: { repo: 'loose', session: null },
  skills: [],
  subagents: [],
  gates: {},
  warnings: [],
  accepted: [],
  planTruncated: false,
  thresholds: null,
  parentModel: '',
  turnId: '',
  turnRoles: [],
  turnEvents: [],
  agentCalls: {},
  shipLog: [],
  hygieneEvents: [],
  offer: null,
  pending: null,
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
  | { kind: 'Started'; id: string; sessionId: string; band: BandDisplay; statusLine: boolean; interactive: boolean }
  | { kind: 'WorkflowsRead'; id: string; workflows: Workflow[]; errors: string[]; mode: 'loose' | 'strict'; at: number }
  | { kind: 'ChangeRead'; id: string; change: Change | null; openChanges: number; at: number }
  | { kind: 'SkillLoaded'; id: string; name: string; at: number }
  | { kind: 'ToolRan'; id: string; command: string; ok: boolean; at: number; agentId?: string }
  | { kind: 'FileTouched'; id: string; path: string; at: number }
  | { kind: 'AnswerShown'; id: string; text: string; at: number }
  | { kind: 'UserPrompted'; id: string; at: number }
  | { kind: 'SubagentSpawned'; id: string; agentId: string; type: string; model: string; description: string; at: number;
      asked?: string; parentModel?: string }
  | { kind: 'SubagentFinished'; id: string; agentId: string; tokens: number; answer?: string }
  | { kind: 'ThresholdsRead'; id: string; raw: unknown }
  | { kind: 'AgentCalled'; id: string; agentId: string }
  | { kind: 'SpawnAsked'; id: string; type: string; description: string }
  | { kind: 'AcceptedRead'; id: string; keys: string[] }
  | { kind: 'TurnEnded'; id: string; turnId: string; contextPercent: number; cleanTree: boolean; at: number }
  | { kind: 'Compacted'; id: string; trigger: string }
  | { kind: 'ToggleBand'; id: string }
  | { kind: 'SetBand'; id: string; band: BandDisplay }
  | { kind: 'ToggleLine'; id: string }
  | { kind: 'SetLine'; id: string; line: boolean }
  | { kind: 'SetMode'; id: string; mode: 'loose' | 'strict' }
  | { kind: 'Accepted'; id: string; keys: string[] }
  | { kind: 'PlanRead'; id: string; warnings: Warning[]; truncated: boolean }
  | { kind: 'SetPending'; id: string; line: string | null }

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
  const next = lean(state, apply(state, s), s)
  return { ...next, seen: s.kind === 'Started' ? [s.id] : seen }
}

function apply(state: NavState, s: Signal): NavState {
  switch (s.kind) {
    case 'Started':
      return { ...EMPTY, sessionId: s.sessionId, interactive: s.interactive, display: { band: s.band, line: s.statusLine } }
    case 'WorkflowsRead': {
      const read = { ...state, workflows: s.workflows, mode: { ...state.mode, repo: s.mode },
        warnings: workflowErrors(state, s.errors) }
      return navigate(read, s.at)
    }
    case 'ChangeRead': {
      const read = { ...state, change: s.change, openChanges: s.openChanges }
      const w = workflowOf(read)
      const gates = w && s.change ? gatesAfterPlan(read.gates, w, s.change.planMtime) : read.gates
      return navigate({ ...read, gates }, s.at)
    }
    case 'SkillLoaded': {
      const name = bare(s.name)
      // Running a warning's remedy puts it right; a skill gate passes.
      const resolved = { ...state, warnings: state.warnings.filter(w => w.remedy !== name) }
      const w0 = workflowOf(resolved)
      const gated = w0 ? passGates(resolved, gatesAfterSkill(resolved.gates, w0, name, s.at)) : resolved
      const moved = navigate(gated, s.at, { skill: name })
      const here = currentPhase(moved)
      return { ...moved, skills: [...moved.skills, { name: s.name, at: s.at, phase: moved.phase }],
        warnings: addWarnings(moved, onSkill(moved, workflowOf(moved), here?.p, name)) }
    }
    case 'ToolRan': {
      const w = workflowOf(state)
      if (!w) return state
      let next = passGates(state, gatesAfterCommand(state.gates, w, s.command, s.ok, s.at))
      const consent = onCommand(next, w, s.command)
      next = { ...next, consent: consent.consent, warnings: addWarnings(next, consent.warnings) }
      const p = currentPhase(next)?.p
      if (s.ok && p && isCommit(s.command)) next = { ...next, warnings: addWarnings(next, onCommit(next, p)) }
      return s.ok ? navigate(next, s.at, null, { command: s.command }) : next
    }
    case 'FileTouched': {
      const w = workflowOf(state)
      return w ? passGates(state, gatesAfterFile(state.gates, w, s.path, s.at)) : state
    }
    case 'AnswerShown': {
      const w = workflowOf(state)
      return w && showsConsent(w, s.text) ? { ...state, consentShown: true } : state
    }
    case 'UserPrompted': {
      const w = workflowOf(state)
      if (!w || !state.consentShown) return state
      const consent = { ...state.consent }
      for (const [id, g] of Object.entries(w.gates ?? {})) if (g.kind === 'consent') consent[id] = true
      return navigate({ ...state, consent, consentShown: false }, s.at, null, { consent: true })
    }
    case 'SubagentSpawned': {
      // The spawn may resolve after the subagent's turn completed: keep what the finish recorded.
      const known = state.subagents.find(a => a.agentId === s.agentId)
      const spawned = { agentId: s.agentId, toolUseId: s.id, type: s.type, model: s.model,
        description: s.description, startedAt: s.at, tokens: known?.tokens ?? 0, done: known?.done ?? false }
      return navigate({ ...state, subagents: [...state.subagents.filter(a => a !== known), spawned] }, s.at, { agent: s.type })
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
    case 'ToggleBand': {
      const i = BAND_DISPLAYS.indexOf(state.display.band)
      return { ...state, display: { ...state.display, band: BAND_DISPLAYS[(i + 1) % BAND_DISPLAYS.length]! } }
    }
    case 'SetBand':
      return { ...state, display: { ...state.display, band: s.band } }
    case 'ToggleLine':
      return { ...state, display: { ...state.display, line: !state.display.line } }
    case 'SetLine':
      return { ...state, display: { ...state.display, line: s.line } }
    case 'SetMode': // the session switch (DD-35); a new session follows the repo again
      return { ...state, mode: { ...state.mode, session: s.mode === state.mode.repo ? null : s.mode } }
    case 'ThresholdsRead':
    case 'AgentCalled':
    case 'SpawnAsked':
    case 'TurnEnded':
    case 'Compacted':
      return state // lean() keeps these (lib/lean.ts)
    case 'PlanRead': // each read replaces the last, so fixed drift disappears
      return { ...state, planTruncated: s.truncated,
        warnings: [...state.warnings.filter(w => !w.key.startsWith('plan:')), ...s.warnings] }
    case 'SetPending':
      return { ...state, pending: s.line }
    case 'AcceptedRead': // the change's deviations.md, read each main turn: a change switch takes its own
      return { ...state, accepted: s.keys }
    case 'Accepted':
      return { ...state, accepted: [...new Set([...state.accepted, ...s.keys])] }
  }
}

/** New gate states; a gate that passes clears its open gate warnings. */
function passGates(state: NavState, gates: NavState['gates']): NavState {
  const passed = Object.keys(gates).filter(id => gates[id]!.state === 'ok' && state.gates[id]?.state !== 'ok')
  return { ...state, gates, warnings: clearGateWarnings(state.warnings, passed) }
}
