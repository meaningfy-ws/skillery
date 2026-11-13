// Subagent rules PD-6..PD-10 and the loaded-but-unused skill (design §6.3). Pure. Numbers and the
// model order come from the guardrails data file; review sets and roles from the workflow file.

import type { Thresholds } from './hygiene.ts'
import type { NavState, Warning, Workflow } from './state.ts'
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

/** D-12: the reviewers the appetite's review set expects (UX reviewers aside): the small-stage set when the last
 *  plan read added at most `max_added_lines` and was not truncated, else the full set; null without a review set. */
export function reviewQuota(s: NavState): number | null {
  const r = s.change?.appetite ? s.workflows.find(w => w.reviews)?.reviews?.[s.change.appetite] : undefined
  if (!r) return null
  const small = r.small_stage
  return small && !s.planTruncated && s.planAdded <= small.max_added_lines ? small.reviewers : r.reviewers
}

/** PD-8: reviewer spawns in one main turn beyond the appetite's review set (plus its UX reviewers). */
export function overspawn(w: Workflow, appetite: string | null, turnId: string, roles: Role[], reviewers?: number): Warning[] {
  const r = appetite ? w.reviews?.[appetite] : undefined
  if (!r) return []
  const allowed = (reviewers ?? r.reviewers) + (r.ux?.extra_reviewers ?? 0)
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

/** One main turn, oldest first: skill loads, and tool calls other than skill loads. */
export type TurnEvent = { kind: 'skill'; name: string } | { kind: 'tool' }

/** A skill loaded and followed by another load with no tool call between: skimmed and abandoned.
 *  shortcut: catches only skim-and-abandon. No button (DD-39): the text names skillery-feedback. */
export function unusedSkills(events: TurnEvent[]): Warning[] {
  const out: Warning[] = []
  events.forEach((e, i) => {
    const next = events[i + 1]
    if (e.kind === 'skill' && next?.kind === 'skill') {
      const name = bare(e.name)
      out.push(warning(`hygiene:unused:${name}`,
        `${name} loaded and left unused: if it should not have fired, run skillery-feedback`, null, 'skillery-feedback'))
    }
  })
  return out
}
