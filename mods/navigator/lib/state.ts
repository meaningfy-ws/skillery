// The state contract (design §3). reduce() is the only writer; every function here is pure.

import type { BandDisplay, Change, NavState, Root, Warning, Workflow } from '../types'
import { creditLoad, placeholderAgent, withSkill } from './attribution.ts'
import { lean } from './lean.ts'
import { activatedByCommand, navigate } from './phase.ts'
import { addWarnings, clearGateWarnings, gatesAfterCommand, gatesAfterFile, gatesAfterPlan, gatesAfterSkill, handOff, onCommand,
  onCommandActivation, onCommit, onSkill, showsConsent, workflowErrors } from './process-drift.ts'
import { bare, currentPhase, isCommit, workflowOf } from './workflow.ts'

export type { Activate, BandDisplay, Change, ChangePredicate, Gate, GateState, Group, NavState, PendingSpawn, Phase, Review,
  Root, SkillCall, SkillUse, Subagent, Warning, Workflow } from '../types'

export const EMPTY: NavState = {
  version: 1,
  sessionId: '',
  change: null,
  openChanges: 0,
  root: null,
  lastChangeId: null,
  mergedBranches: [],
  skillCalls: [],
  pendingSpawns: [],
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
  planAdded: null,
  thresholds: null,
  parentModel: '',
  turnId: '',
  turnRoles: [],
  turnEvents: [],
  agentCalls: {},
  shipLog: [],
  hygieneEvents: [],
  offer: null,
  sessionTokens: 0,
  usd: null,
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
  | { kind: 'SpawnAsked'; id: string; type: string; description: string; agentId?: string }
  | { kind: 'AcceptedRead'; id: string; keys: string[] }
  | { kind: 'TurnEnded'; id: string; turnId: string; contextPercent: number; cleanTree: boolean; at: number;
      tokens?: number; usd?: number | null }
  | { kind: 'Compacted'; id: string; trigger: string }
  | { kind: 'ToggleBand'; id: string }
  | { kind: 'SetBand'; id: string; band: BandDisplay }
  | { kind: 'ToggleLine'; id: string }
  | { kind: 'SetLine'; id: string; line: boolean }
  | { kind: 'SetMode'; id: string; mode: 'loose' | 'strict' }
  | { kind: 'Accepted'; id: string; keys: string[] }
  | { kind: 'PlanRead'; id: string; warnings: Warning[]; truncated: boolean; added: number }
  | { kind: 'SetPending'; id: string; line: string | null }
  | { kind: 'RootFollowed'; id: string; root: Root }
  | { kind: 'AgentRooted'; id: string; agentId: string; root: string }
  | { kind: 'SkillCallStarted'; id: string; toolUseId: string; name: string; agentId: string | null; at: number }
  | { kind: 'SkillCallEnded'; id: string; toolUseId: string }
  | { kind: 'SpawnStarted'; id: string; toolUseId: string; type: string; at: number }
  | { kind: 'SpawnResolved'; id: string; toolUseId: string; agentId: string | null }
  | { kind: 'ToolUsed'; id: string; agentId?: string }
  | { kind: 'PrMerged'; id: string; branch: string; at?: number } // `at` defaults to the phase's start

const kindOf = (v: unknown) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v)

/** What a field that defaults to null holds otherwise; `thresholds` is unparsed, so anything. */
const NULLABLE: Record<string, string | undefined> = { change: 'object', root: 'object', lastChangeId: 'string',
  workflow: 'string', variant: 'string', phase: 'string', signalPhase: 'string', pending: 'string', usd: 'number',
  planAdded: 'number' }

const isObject = (v: unknown): v is Record<string, unknown> => kindOf(v) === 'object'
const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter(x => typeof x === 'string') : [])

/** Whether a stored value has the shape of the default: the same kind, or for a null default the kind it holds. */
function fits(k: string, v: unknown, d: unknown): boolean {
  if (d !== null) return kindOf(v) === kindOf(d)
  if (k === 'thresholds' || v === null) return true
  if (k === 'root') return isObject(v) && typeof v['path'] === 'string' && typeof v['common'] === 'string' && typeof v['branch'] === 'string'
  return kindOf(v) === NULLABLE[k]
}

/** Entries of an older atom get the fields added since: a stored subagent without `skills` or `rootPath`, a call
 *  without `loaded`, a pending spawn without `skills`. Anything that is not an object is dropped. */
function migrate(out: Record<string, unknown>): void {
  const objects = (v: unknown) => (Array.isArray(v) ? v.filter(isObject) : [])
  out['subagents'] = objects(out['subagents']).map(a => ({ ...a, skills: strings(a['skills']),
    rootPath: typeof a['rootPath'] === 'string' ? a['rootPath'] : null }))
  out['skillCalls'] = objects(out['skillCalls']).map(c => ({ ...c, loaded: c['loaded'] === true }))
  out['pendingSpawns'] = objects(out['pendingSpawns']).map(p => ({ ...p, skills: strings(p['skills']) }))
  out['mergedBranches'] = strings(out['mergedBranches'])
}

/** Load a stored state of any earlier shape: new fields, and fields of the wrong shape, take their
 *  defaults; unknown fields of a later version are kept; older subagents are migrated. */
export function revive(stored: unknown): NavState {
  if (!stored || typeof stored !== 'object') return EMPTY
  const out: Record<string, unknown> = { ...EMPTY }
  for (const [k, v] of Object.entries(stored)) {
    if (!(k in EMPTY) || fits(k, v, (EMPTY as Record<string, unknown>)[k])) out[k] = v
  }
  migrate(out)
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
      const switched = s.change?.id !== state.change?.id // a new change has no plan read yet (D-22)
      // A hand-off needs an old change to leave: the first read of a session only sets lastChangeId (D-8).
      const left = state.lastChangeId !== null && s.change?.id !== state.lastChangeId
      const read = { ...(left ? handOff(state, state.lastChangeId!) : state), change: s.change, openChanges: s.openChanges,
        lastChangeId: s.change?.id ?? null, planAdded: switched ? null : state.planAdded }
      const w = workflowOf(read)
      // The same change's design changed since the previous read (D-15); a first read or another change compares nothing.
      const before = state.change?.id === s.change?.id ? state.change?.planHash : undefined
      const edited = typeof before === 'string' && before !== s.change?.planHash
      const gates = w && edited ? gatesAfterPlan(read.gates, w, s.change?.designMtime) : read.gates
      return navigate({ ...read, gates }, s.at)
    }
    case 'SkillLoaded': {
      const credit = creditLoad(state, s.name)
      if (credit.kind === 'ignore') return state // a second prompt of a call already counted
      if (credit.kind === 'subagent') return withSkill(credit.state, credit.agentId, s.name)
      if (credit.kind === 'spawn') return { ...credit.state, pendingSpawns: credit.state.pendingSpawns.map(p =>
        p.toolUseId === credit.toolUseId ? { ...p, skills: [...p.skills, s.name] } : p) }
      state = credit.state
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
      // A command may activate a workflow before any is active (D-7): it is placed, then the same command runs its gates.
      const hit = s.ok ? activatedByCommand(state, s.command) : undefined
      const base = hit ? navigate(state, s.at, { command: s.command }) : state
      const w = workflowOf(base)
      if (!w) return base
      let next = passGates(base, gatesAfterCommand(base.gates, w, s.command, s.ok, s.at))
      const consent = onCommand(next, w, s.command)
      next = { ...next, consent: consent.consent, warnings: addWarnings(next, consent.warnings) }
      if (hit) next = { ...next, warnings: addWarnings(next, onCommandActivation(next, w)) }
      const p = currentPhase(next)?.p
      if (s.ok && p && isCommit(s.command)) next = { ...next, warnings: addWarnings(next, onCommit(next, p)) }
      return s.ok ? navigate(next, s.at, null, hit ? { command: s.command, placed: true } : { command: s.command }) : next
    }
    case 'PrMerged': // the followed branch's pull request merged: `merged` holds once every task is ticked (D-5)
      return state.mergedBranches.includes(s.branch) ? state
        : navigate({ ...state, mergedBranches: [...state.mergedBranches, s.branch] }, s.at ?? state.phaseAt)
    case 'FileTouched': {
      const w = workflowOf(state)
      return w ? navigate(passGates(state, gatesAfterFile(state.gates, w, s.path, s.at)), s.at, null, { file: s.path }) : state
    }
    case 'AnswerShown': {
      const w = workflowOf(state)
      const scored = w ? withScore(state, w, s.text) : state
      return w && showsConsent(w, s.text) ? { ...scored, consentShown: true } : scored
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
        description: s.description, startedAt: s.at, tokens: known?.tokens ?? 0, done: known?.done ?? false,
        rootPath: known?.rootPath ?? null, skills: known?.skills ?? [] }
      return navigate({ ...state, subagents: [...state.subagents.filter(a => a !== known), spawned] }, s.at, { agent: s.type })
    }
    case 'SubagentFinished': {
      const known = state.subagents.some(a => a.agentId === s.agentId)
      const finished = known ? state.subagents : [...state.subagents, placeholderAgent(s.agentId)]
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
    case 'RootFollowed': // the same root and branch again is no change; re-reading the workflows is io's job (D-2, D-21.1)
      return state.root && s.root.path === state.root.path && s.root.branch === state.root.branch ? state : { ...state, root: s.root }
    case 'AgentRooted':
      return { ...state, subagents: state.subagents.map(a => a.agentId === s.agentId ? { ...a, rootPath: s.root } : a) }
    case 'SkillCallStarted':
      return { ...state, skillCalls: [...state.skillCalls,
        { toolUseId: s.toolUseId, name: s.name, agentId: s.agentId, at: s.at, loaded: false }] }
    case 'SkillCallEnded':
      return { ...state, skillCalls: state.skillCalls.filter(c => c.toolUseId !== s.toolUseId) }
    case 'SpawnStarted':
      return { ...state, pendingSpawns: [...state.pendingSpawns, { toolUseId: s.toolUseId, type: s.type, at: s.at, skills: [] }] }
    case 'SpawnResolved': { // the skills loaded while it was pending are the new subagent's
      const spawn = state.pendingSpawns.find(p => p.toolUseId === s.toolUseId)
      const rest = { ...state, pendingSpawns: state.pendingSpawns.filter(p => p !== spawn) }
      return s.agentId ? (spawn?.skills ?? []).reduce((acc, name) => withSkill(acc, s.agentId!, name), rest) : rest
    }
    case 'ToolUsed': // recorded by lean() (lib/lean.ts)
    case 'ThresholdsRead':
    case 'AgentCalled':
    case 'SpawnAsked':
    case 'TurnEnded':
    case 'Compacted':
      return state // lean() keeps these (lib/lean.ts)
    case 'PlanRead': // each read replaces the last, so fixed drift disappears
      return { ...state, planTruncated: s.truncated, planAdded: s.added,
        warnings: [...state.warnings.filter(w => !w.key.startsWith('plan:')), ...s.warnings] }
    case 'SetPending':
      return { ...state, pending: s.line }
    case 'AcceptedRead': // the change's deviations.md, read each main turn: a change switch takes its own
      return { ...state, accepted: s.keys }
    case 'Accepted':
      return { ...state, accepted: [...new Set([...state.accepted, ...s.keys])] }
  }
}

/** A skill gate shows the score its skill printed (`9.1/10`), never one the mod judges (DD-14). */
function withScore(state: NavState, w: Workflow, text: string): NavState {
  const last = state.skills.at(-1)
  const score = text.match(/(\d+(?:\.\d+)?)\s*\/\s*10\b/)?.[1]
  const id = last && score && Object.entries(w.gates ?? {})
    .find(([gid, g]) => g.kind === 'skill' && bare(g.skill) === bare(last.name) && state.gates[gid]?.state === 'ok')?.[0]
  return id ? { ...state, gates: { ...state.gates, [id]: { ...state.gates[id]!, detail: score } } } : state
}

/** New gate states; a gate that passes clears its open gate warnings. */
function passGates(state: NavState, gates: NavState['gates']): NavState {
  const passed = Object.keys(gates).filter(id => gates[id]!.state === 'ok' && state.gates[id]?.state !== 'ok')
  return { ...state, gates, warnings: clearGateWarnings(state.warnings, passed) }
}
