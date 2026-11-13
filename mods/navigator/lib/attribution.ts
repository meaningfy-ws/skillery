import type { NavState, Subagent } from './state.ts'

export type Credit = {
  /** The agent credited; null for the lead, and for a pending spawn whose agentId is not yet known. */
  agent: string | null
  via: 'call' | 'spawn' | 'preload' | 'lead'
  /** The in-flight `Skill` call or pending spawn this credit uses, so the caller can consume it. */
  toolUseId?: string
}

/** The first of `xs` that is newest (or oldest) by `at`; on a tie, the first in list order. */
const extreme = <T>(xs: T[], at: (x: T) => number, newest: boolean): T | undefined =>
  xs.reduce<T | undefined>((a, x) => (a === undefined || (newest ? at(x) > at(a) : at(x) < at(a)) ? x : a), undefined)

/**
 * Who a `skill.prompt` belongs to (D-4): it carries no agentId, so credit by what is in flight.
 * The oldest in-flight `Skill` call of that name, else the newest running subagent with no tool
 * call yet (a preload), else the newest pending spawn, else the lead. A just-started subagent
 * comes before a pending spawn (D-19): with two spawns in one turn, the first one's preloads fire
 * while the second is still pending.
 */
export function creditSkill(state: Pick<NavState, 'skillCalls' | 'pendingSpawns' | 'subagents' | 'agentCalls'>, name: string): Credit {
  const call = extreme(state.skillCalls.filter(c => c.name === name), c => c.at, false)
  if (call) return { agent: call.agentId, via: 'call', toolUseId: call.toolUseId }

  const fresh = extreme(state.subagents.filter(s => !s.done && !state.agentCalls[s.agentId]), s => s.startedAt, true)
  if (fresh) return { agent: fresh.agentId, via: 'preload' }

  const pending = extreme(state.pendingSpawns, s => s.at, true)
  if (pending) return { agent: null, via: 'spawn', toolUseId: pending.toolUseId }

  return { agent: null, via: 'lead' }
}

export type Credited =
  | { kind: 'lead'; state: NavState }
  | { kind: 'subagent'; state: NavState; agentId: string }
  | { kind: 'spawn'; state: NavState; toolUseId: string }
  | { kind: 'ignore' }

/** Whose load a `SkillLoaded` is (D-4). A `Skill` call is counted once: its first prompt marks it loaded, so a
 *  second prompt of the same call is ignored and a second concurrent call of that name takes the next one.
 *  Only a prompt nothing else claims (no call left to count, no preload, no pending spawn) is ignored. */
export function creditLoad(state: NavState, name: string): Credited {
  const open = state.skillCalls.filter(c => c.name === name)
  const c = creditSkill({ ...state, skillCalls: state.skillCalls.filter(k => !k.loaded) }, name)
  if (c.via === 'lead' && open.length > 0 && open.every(k => k.loaded)) return { kind: 'ignore' }
  if (c.via === 'spawn') return { kind: 'spawn', state, toolUseId: c.toolUseId! }
  if (c.via === 'call') {
    const marked = { ...state, skillCalls: state.skillCalls.map(k => k.toolUseId === c.toolUseId ? { ...k, loaded: true } : k) }
    return c.agent === null ? { kind: 'lead', state: marked } : { kind: 'subagent', state: marked, agentId: c.agent }
  }
  return c.agent === null ? { kind: 'lead', state } : { kind: 'subagent', state, agentId: c.agent }
}

/** A subagent known only by its id: its spawn or its turn has not been seen yet. */
export const placeholderAgent = (agentId: string): Subagent => ({
  agentId, toolUseId: '', type: '?', model: '?', description: '', startedAt: 0, tokens: 0, done: false, rootPath: null, skills: [] })

/** A subagent's own list of the skills it loaded; it touches nothing of the lead's. An unlisted agent is
 *  listed as a placeholder, so a spawn resolved before its `SubagentSpawned` keeps its preloads. */
export function withSkill(state: NavState, agentId: string, name: string): NavState {
  const known = state.subagents.some(a => a.agentId === agentId)
  const subagents = known ? state.subagents : [...state.subagents, placeholderAgent(agentId)]
  return { ...state, subagents: subagents.map(a =>
    a.agentId === agentId && !a.skills.includes(name) ? { ...a, skills: [...a.skills, name] } : a) }
}
