// Subagent rules PD-6..PD-10 and the loaded-but-unused skill (design §6.3). Pure. Numbers and the
// model order come from the guardrails data file; review sets and roles from the workflow file.

import type { Thresholds } from './hygiene.ts'
import type { NavState, Review, Warning, Workflow } from './state.ts'
import { bare } from './workflow.ts'
import { isShip } from './workflow.ts'

const warning = (key: string, message: string, remedy: string | null, owner: string): Warning =>
  ({ key, message, remedy, owner })

export type Role = 'reviewer' | 'checker' | 'tester' | 'other'
const ROLES = ['reviewer', 'checker', 'tester'] as const

const matches = (pattern: string, text: string) => {
  try { return new RegExp(pattern, 'i').test(text) } catch { return false }
}

/** A spawn's role by the workflow's `roles`: an agent name first, then a description regex.
 *  shortcut: an unnamed checker whose description misses the regex counts as `other`. */
export function roleOf(w: Workflow, type: string, description: string): Role {
  const roles = w.roles ?? {}
  // The agent name first: a reviewer described as "a quick check" stays a reviewer (DD-41 rejected).
  return ROLES.find(r => roles[r]?.agents?.some(a => bare(a) === bare(type)))
    ?? ROLES.find(r => roles[r]?.describe !== undefined && matches(roles[r]!.describe!, description))
    ?? 'other'
}

/** PD-6: a finished subagent that made at most the lookup count of tool calls should have been done inline. */
export const inlineSpawn = (t: Thresholds, agentId: string, toolCalls: number): Warning[] =>
  toolCalls <= t.lookup_max_tool_calls
    ? [warning(`process:inline:${agentId}`, `subagent ${agentId} made ${toolCalls} tool calls (lookup_max_tool_calls)`, null, 'guardrails')]
    : []

/** Position in `model_rank` by substring, cheapest first; -1 when unranked. */
const rank = (t: Thresholds, model: string) => t.model_rank.findIndex(m => model.toLowerCase().includes(m.toLowerCase()))

export type Spawn = { agentId: string; model: string; declared: boolean }

/** PD-7: an agent with no declared model asked for a model above the caller's. A declared model is never judged. */
export function modelAbove(t: Thresholds, s: Spawn, parentModel: string): Warning[] {
  if (s.declared || !s.model) return []
  const asked = rank(t, s.model), parent = rank(t, parentModel)
  return asked >= 0 && parent >= 0 && asked > parent
    ? [warning(`process:model:${s.agentId}`, `subagent ${s.agentId} runs ${s.model}, above the caller's ${parentModel}`, null, 'guardrails')]
    : []
}

const ceiling = (r: Review) => r.reviewers + (r.ux?.extra_reviewers ?? 0)
const reviewOf = (s: NavState) => s.change?.appetite ? s.workflows.find(w => w.reviews)?.reviews?.[s.change.appetite] : undefined

/** D-22: the most reviewers one turn may spawn for the appetite: the full set plus its UX reviewers; null without a review set. */
export const reviewQuota = (s: NavState): number | null => {
  const r = reviewOf(s)
  return r ? ceiling(r) : null
}

/** D-12, D-22: the reviewers a small stage allows, shown beside the ceiling, never enforced. A stage is small when the
 *  last plan read added at most `max_added_lines` and was not truncated; no read yet (null) is not small. */
export function smallStageAllowance(s: NavState): number | null {
  const small = reviewOf(s)?.small_stage
  return small && !s.planTruncated && s.planAdded !== null && s.planAdded <= small.max_added_lines ? small.reviewers : null
}

/** PD-8: reviewer spawns in one main turn beyond the appetite's review set (plus its UX reviewers). */
export function overspawn(w: Workflow, appetite: string | null, turnId: string, roles: Role[]): Warning[] {
  const r = appetite ? w.reviews?.[appetite] : undefined
  if (!r) return []
  const allowed = ceiling(r)
  const spawned = roles.filter(x => x === 'reviewer').length
  return spawned > allowed
    ? [warning(`process:overspawn:${turnId}`, `over-spawn: ${spawned} reviewers in one turn, ${appetite} calls for ${allowed}`, null, bare(w.owner))]
    : []
}

/** What PD-9 reads, oldest first: spawns by role, and pushes, PRs or archives. */
export type DispatchEvent = { kind: 'spawn'; role: Role } | { kind: 'ship' }

/** A push, a PR or an archive: the moments the second check must have run by. */
export const shipCommand = isShip

/** PD-9: the appetite needs a checker, reviewers ran, and a ship followed with no checker spawned since. */
export function secondCheck(w: Workflow, appetite: string | null, change: string, events: DispatchEvent[]): Warning[] {
  if (!appetite || !w.reviews?.[appetite]?.checker) return []
  let unchecked = false
  for (const e of events) {
    if (e.kind === 'spawn' && e.role === 'reviewer') unchecked = true
    else if (e.kind === 'spawn' && e.role === 'checker') unchecked = false
    else if (e.kind === 'ship' && unchecked) {
      return [warning(`process:second-check:${change}`, `second check missing: reviewers ran and no checker since`, 'meaningfy-code-review', 'guardrails')]
    }
  }
  return []
}

/** PD-10: a base report longer than the report limit. */
export function reportOversized(t: Thresholds, agentId: string, answer: string): Warning[] {
  const lines = answer.replace(/\n$/, '').split('\n').length
  return lines > t.subagent_report_max_lines
    ? [warning(`hygiene:report:${agentId}`, `subagent ${agentId} returned ${lines} lines (subagent_report_max_lines)`, null, 'guardrails')]
    : []
}

/** The lead's agent name in turn events (D-9). */
export const MAIN = 'main'

/** Oldest first: skill loads, tool calls other than skill loads, and spawns, each by `agent` ('main' or an agent id; D-9). */
export type TurnEvent = { kind: 'skill'; name: string; agent: string } | { kind: 'tool' | 'spawn'; agent: string }

/** `agent`'s skills skimmed and abandoned: another load of the same agent follows and no tool call or spawn of it does.
 *  shortcut: catches only skim-and-abandon (a trailing load is not judged). No button (DD-39): the text names skillery-feedback. */
export function unusedSkills(events: TurnEvent[], agent: string): Warning[] {
  const mine = events.filter(e => e.agent === agent)
  return mine.flatMap((e, i) => {
    if (e.kind !== 'skill') return []
    const later = mine.slice(i + 1)
    if (later.some(l => l.kind !== 'skill') || !later.some(l => l.kind === 'skill')) return []
    const name = bare(e.name)
    return [warning(`hygiene:unused:${agent}:${name}`,
      `${name} loaded and left unused: if it should not have fired, run skillery-feedback`, null, 'skillery-feedback')]
  })
}
