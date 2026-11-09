// Subagent rules (PD-6..PD-10) and session hygiene (design §6.3, §6.5), fed from signals. Pure:
// reduce() calls lean() after apply(); the rules and numbers are in dispatch.ts, hygiene.ts and the
// guardrails thresholds file.

import { inlineSpawn, modelAbove, overspawn, reportOversized, roleOf, secondCheck, shipCommand, unusedSkills,
  type DispatchEvent, type Role, type TurnEvent } from './dispatch.ts'
import { offer, onCompact, thresholdsFrom, type HygieneEvent } from './hygiene.ts'
import { addWarnings } from './process-drift.ts'
import type { Change, NavState, Warning } from './state.ts'
import type { Signal } from './state.ts'
import { workflowOf } from './workflow.ts'

const groupsDone = (c: Change | null) => c?.groups.filter(g => g.total > 0 && g.done === g.total).length ?? 0

/** The hygiene events a signal makes (§6.5's fixed vocabulary). */
function eventsOf(prev: NavState, next: NavState, s: Signal): HygieneEvent[] {
  const out: HygieneEvent[] = []
  if (prev.phase !== null && next.phase !== prev.phase && prev.workflow === next.workflow) out.push('phase-left')
  if (prev.change && prev.change.id === next.change?.id && groupsDone(next.change) > groupsDone(prev.change)) out.push('task-group-done')
  if (s.kind === 'ToolRan' && s.ok && !s.agentId) {
    if (/\bgit\s+commit\b/.test(s.command)) out.push('commit')
    if (/\bgh\s+pr\s+merge\b/.test(s.command)) out.push('pr-merged')
    if (/\bopenspec\s+archive\b/.test(s.command)) out.push('archived')
  }
  return out
}

export function lean(prev: NavState, after: NavState, s: Signal): NavState {
  let n: NavState = { ...after, hygieneEvents: [...after.hygieneEvents, ...eventsOf(prev, after, s)] }
  if (prev.change?.id !== n.change?.id) n = { ...n, shipLog: [] }
  const add = (ws: Warning[]) => { n = { ...n, warnings: addWarnings(n, ws) } }
  const t = thresholdsFrom(n.thresholds)
  // The review set lives in the workflow that has one (build-tier), whichever is active (DD-21).
  const reviews = n.workflows.find(w => w.reviews)
  const appetite = n.change?.appetite ?? null
  switch (s.kind) {
    case 'ThresholdsRead':
      return { ...n, thresholds: s.raw }
    case 'SkillLoaded':
      return { ...n, turnEvents: [...n.turnEvents, { kind: 'skill', name: s.name }] }
    case 'ToolRan': {
      if (s.agentId) return { ...n, agentCalls: { ...n.agentCalls, [s.agentId]: (n.agentCalls[s.agentId] ?? 0) + 1 } }
      n = { ...n, turnEvents: [...n.turnEvents, { kind: 'tool' }] }
      if (s.ok && shipCommand(s.command)) {
        n = { ...n, shipLog: [...n.shipLog, { kind: 'ship' }] }
        if (reviews && n.change) add(secondCheck(reviews, appetite, n.change.id, n.shipLog as DispatchEvent[]))
      }
      return n
    }
    case 'SubagentSpawned': {
      const w = workflowOf(n) ?? reviews
      const role: Role = w ? roleOf(w, s.type, s.description) : 'other'
      n = { ...n, parentModel: s.parentModel ?? n.parentModel, turnRoles: [...n.turnRoles, role],
        shipLog: [...n.shipLog, { kind: 'spawn', role }] }
      if (reviews) add(overspawn(reviews, appetite, n.turnId || 'start', n.turnRoles as Role[]))
      // shortcut: the event does not say whether the agent declares a model, so an explicit ask is
      // taken as undeclared (DD-40); upgrade by reading the agent's frontmatter.
      if (t.ok && s.asked) add(modelAbove(t.thresholds, { agentId: s.agentId, model: s.asked, declared: false }, n.parentModel))
      return n
    }
    case 'SubagentFinished':
      if (t.ok) add([...inlineSpawn(t.thresholds, s.agentId, n.agentCalls[s.agentId] ?? 0),
        ...reportOversized(t.thresholds, s.agentId, s.answer ?? '')])
      return n
    case 'TurnEnded': {
      add(unusedSkills(n.turnEvents as TurnEvent[]))
      // shortcut: idle resets are not offered; the gap is only known once the person has typed (DD-40).
      const r = offer(t, { events: n.hygieneEvents as HygieneEvent[], contextPercent: s.contextPercent, idleMinutes: 0,
        cleanTree: s.cleanTree, openUnticked: !!n.change && n.change.done < n.change.total })
      const kept = n.warnings.filter(w => w.key !== 'hygiene:context' && w.key !== 'hygiene:thresholds-missing')
      n = { ...n, warnings: kept }
      add(r.warnings)
      return { ...n, offer: r.offer, hygieneEvents: r.point ? [] : n.hygieneEvents,
        turnId: s.turnId, turnRoles: [], turnEvents: [] }
    }
    case 'Compacted':
      add(onCompact(s.trigger))
      return n
    case 'UserPrompted':
      return { ...n, offer: null }
    default:
      return n
  }
}

/** Before a spawn runs (strict mode): would it over-spawn (PD-8), and should its model be the
 *  parent's (PD-7)? The same rules as after the spawn, asked one spawn early. */
export function spawnCheck(s: NavState, type: string, description: string, asked: string | undefined,
  parentModel: string): { overspawn: Warning | null; rewriteTo: string | null } {
  const reviews = s.workflows.find(w => w.reviews)
  const w = workflowOf(s) ?? reviews
  const role: Role = w ? roleOf(w, type, description) : 'other'
  const over = reviews ? overspawn(reviews, s.change?.appetite ?? null, s.turnId || 'start', [...s.turnRoles as Role[], role]) : []
  const t = thresholdsFrom(s.thresholds)
  const above = t.ok && asked ? modelAbove(t.thresholds, { agentId: 'next', model: asked, declared: false }, parentModel) : []
  return { overspawn: over[0] ?? null, rewriteTo: above.length ? parentModel : null }
}
