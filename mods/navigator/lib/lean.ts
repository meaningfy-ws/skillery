// Subagent rules (PD-6..PD-10) and session hygiene (design §6.3, §6.5), fed from signals. Pure:
// reduce() calls lean() after apply(); the rules and numbers are in dispatch.ts, hygiene.ts and the
// guardrails thresholds file.

import { creditLoad } from './attribution.ts'
import { inlineSpawn, modelAbove, overspawn, reportOversized, roleOf, secondCheck, shipCommand, unusedSkills,
  type Role } from './dispatch.ts'
import { offer, onCompact, thresholdsFrom, type HygieneEvent } from './hygiene.ts'
import { addWarnings } from './process-drift.ts'
import type { Change, NavState, Signal, Warning } from './state.ts'
import { isArchive, isCommit, isPrMerge, workflowOf } from './workflow.ts'

const MAIN = 'main' // the lead's agent name in turn events (D-9)
const groupsDone =(c: Change | null) => c?.groups.filter(g => g.total > 0 && g.done === g.total).length ?? 0

/** The hygiene events a signal makes (§6.5's fixed vocabulary). */
function eventsOf(prev: NavState, next: NavState, s: Signal): HygieneEvent[] {
  const out: HygieneEvent[] = []
  if (prev.phase !== null && next.phase !== prev.phase && prev.workflow === next.workflow) out.push('phase-left')
  if (prev.change && prev.change.id === next.change?.id && groupsDone(next.change) > groupsDone(prev.change)) out.push('task-group-done')
  if (s.kind === 'ToolRan' && s.ok && !s.agentId) {
    if (isCommit(s.command)) out.push('commit')
    if (isPrMerge(s.command)) out.push('pr-merged')
    if (isArchive(s.command)) out.push('archived')
  }
  return out
}

export function lean(prev: NavState, after: NavState, s: Signal): NavState {
  let n: NavState = { ...after, hygieneEvents: [...after.hygieneEvents, ...eventsOf(prev, after, s)] }
  if (prev.change?.id !== n.change?.id) n = { ...n, shipLog: [] }
  const add = (ws: Warning[]) => { n = { ...n, warnings: addWarnings(n, ws) } }
  const t = thresholdsFrom(n.thresholds)
  // The review set lives in the workflow that has one (epic-delivery), whichever is active (DD-21).
  const reviews = n.workflows.find(w => w.reviews)
  const appetite = n.change?.appetite ?? null
  switch (s.kind) {
    case 'ThresholdsRead':
      return { ...n, thresholds: s.raw }
    case 'SkillLoaded': { // a load credited to the lead or to a subagent is that agent's turn event (D-4, D-9)
      const c = creditLoad(prev, s.name)
      const agent = c.kind === 'lead' ? MAIN : c.kind === 'subagent' ? c.agentId : null
      return agent ? { ...n, turnEvents: [...n.turnEvents, { kind: 'skill', name: s.name, agent }] } : n
    }
    case 'AgentCalled': // every tool call of a subagent counts for PD-6, not only Bash (DD-41)
      return { ...n, agentCalls: { ...n.agentCalls, [s.agentId]: (n.agentCalls[s.agentId] ?? 0) + 1 } }
    case 'ToolUsed': // any tool but Skill, by its agent (D-9)
      return { ...n, turnEvents: [...n.turnEvents, { kind: 'tool', agent: s.agentId ?? MAIN }] }
    case 'ToolRan': {
      n = { ...n, turnEvents: [...n.turnEvents, { kind: 'tool', agent: s.agentId ?? MAIN }] }
      if (s.agentId) return n
      if (s.ok && shipCommand(s.command)) {
        n = { ...n, shipLog: [...n.shipLog, { kind: 'ship' }] }
        if (reviews && n.change) add(secondCheck(reviews, appetite, n.change.id, n.shipLog))
      }
      return n
    }
    case 'SpawnAsked': { // before the spawn runs: parallel spawns each see the ones before (DD-41)
      const role = roleIn(n, s.type, s.description)
      n = { ...n, turnRoles: [...n.turnRoles, role], shipLog: [...n.shipLog, { kind: 'spawn', role }],
        turnEvents: [...n.turnEvents, { kind: 'spawn', agent: s.agentId ?? MAIN }] }
      if (reviews) add(overspawn(reviews, appetite, n.turnId || 'start', n.turnRoles))
      return n
    }
    case 'SubagentSpawned': {
      n = { ...n, parentModel: s.parentModel ?? n.parentModel }
      // shortcut: the event does not say whether the agent declares a model, so an explicit ask is
      // taken as undeclared (DD-40); upgrade by reading the agent's frontmatter.
      if (t.ok && s.asked) add(modelAbove(t.thresholds, { agentId: s.agentId, model: s.asked, declared: false }, n.parentModel))
      return n
    }
    case 'SubagentFinished':
      if (t.ok) add([...inlineSpawn(t.thresholds, s.agentId, n.agentCalls[s.agentId] ?? 0),
        ...reportOversized(t.thresholds, s.agentId, s.answer ?? '')])
      add(unusedSkills(n.turnEvents, s.agentId))
      return { ...n, turnEvents: n.turnEvents.filter(e => e.agent !== s.agentId) }
    case 'TurnEnded': {
      add(unusedSkills(n.turnEvents, MAIN)) // only the lead's; a background subagent's events wait for its finish (D-9)
      // shortcut: idle resets are not offered; the gap is only known once the person has typed (DD-40).
      const r = offer(t, { events: n.hygieneEvents, contextPercent: s.contextPercent, idleMinutes: 0,
        cleanTree: s.cleanTree, openUnticked: !!n.change && n.change.done < n.change.total })
      const kept = n.warnings.filter(w => w.key !== 'hygiene:context' && w.key !== 'hygiene:thresholds-missing')
      n = { ...n, warnings: kept }
      add(r.warnings)
      return { ...n, offer: r.offer, hygieneEvents: r.point ? [] : n.hygieneEvents,
        sessionTokens: n.sessionTokens + (s.tokens ?? 0), usd: s.usd ?? n.usd,
        turnId: s.turnId, turnRoles: [], turnEvents: n.turnEvents.filter(e => e.agent !== MAIN) }
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

/** The role of a spawn, from the active workflow's roles, else the one with a review set. */
function roleIn(s: NavState, type: string, description: string): Role {
  const w = workflowOf(s) ?? s.workflows.find(x => x.reviews)
  return w ? roleOf(w, type, description) : 'other'
}

/** Strict, after `SpawnAsked` recorded this spawn: the over-spawn it makes, if any. */
export function overspawnNow(s: NavState): Warning | null {
  const reviews = s.workflows.find(w => w.reviews)
  return (reviews && overspawn(reviews, s.change?.appetite ?? null, s.turnId || 'start', s.turnRoles)[0]) || null
}

/** Strict: the parent's model when the spawn asks one ranked above it (PD-7). */
export function rewriteModel(s: NavState, asked: string | undefined, parentModel: string): string | null {
  const t = thresholdsFrom(s.thresholds)
  return t.ok && asked && modelAbove(t.thresholds, { agentId: 'next', model: asked, declared: false }, parentModel).length
    ? parentModel : null
}
