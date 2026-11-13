import type { NavState } from '../types.d.ts'

export type Credit = {
  /** The agent credited; null for the lead, and for a pending spawn whose agentId is not yet known. */
  agent: string | null
  via: 'call' | 'spawn' | 'preload' | 'lead'
  /** The in-flight `Skill` call or pending spawn this credit uses, so the caller can consume it. */
  toolUseId?: string
}

const newest = <T>(xs: T[], at: (x: T) => number): T | undefined => xs.reduce<T | undefined>((a, x) => (a === undefined || at(x) > at(a) ? x : a), undefined)

/**
 * Who a `skill.prompt` belongs to (D-4): it carries no agentId, so credit by what is in flight.
 * The oldest in-flight `Skill` call of that name, else the newest pending spawn, else the newest
 * running subagent with no tool call yet, else the lead.
 */
export function creditSkill(state: Pick<NavState, 'skillCalls' | 'pendingSpawns' | 'subagents' | 'agentCalls'>, name: string): Credit {
  const inFlight = state.skillCalls.filter(c => c.name === name)
  const call = inFlight.reduce<(typeof inFlight)[number] | undefined>((a, c) => (a === undefined || c.at < a.at ? c : a), undefined)
  if (call) return { agent: call.agentId, via: 'call', toolUseId: call.toolUseId }

  const pending = newest(state.pendingSpawns, s => s.at)
  if (pending) return { agent: null, via: 'spawn', toolUseId: pending.toolUseId }

  const fresh = newest(
    state.subagents.filter(s => !s.done && !state.agentCalls[s.agentId]),
    s => s.startedAt,
  )
  if (fresh) return { agent: fresh.agentId, via: 'preload' }

  return { agent: null, via: 'lead' }
}
