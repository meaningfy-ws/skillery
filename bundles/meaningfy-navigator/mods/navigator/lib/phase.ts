// Active workflow, variant and phase (design §6.2). Pure; reduce() calls navigate() after each signal.

import { holds } from './change.ts'
import { onEnter, onLeave } from './process-drift.ts'
import type { Activate, NavState, Phase, Warning, Workflow } from './state.ts'
import { bare } from './workflow.ts'

/** The skill or agent a signal names, if any. */
export type Trigger = { skill?: string; agent?: string }
/** What can advance a phase with no `enter` of its own: a command that ran, or an answered consent. */
export type Advance = { command?: string; consent?: true }

const conditions = (a: Activate, s: NavState) =>
  (!a.openChange || s.change !== null) &&
  (!a.change || holds(a.change, s.change)) &&
  (a.interactive === undefined || a.interactive === s.interactive)

const triggered = (a: Activate, t: Trigger | null) =>
  !!t && ((!!t.skill && (a.skills ?? []).map(bare).includes(bare(t.skill))) ||
    (!!t.agent && (a.agents ?? []).map(bare).includes(bare(t.agent))))

const conditionOnly = (a: Activate) => !a.skills && !a.agents

/** The active workflow and variant: the one the trigger activates, else the current one while it
 *  still holds, else the workflow that activates on an open change (build-tier). */
export function select(s: NavState, t: Trigger | null): { workflow: string | null; variant: string | null } {
  const ws = s.workflows
  const named = (n: string | null) => ws.find(w => w.name === n && conditions(w.activate, s))
  const w = ws.find(w => conditions(w.activate, s) && triggered(w.activate, t)) ??
    named(s.workflow) ?? ws.find(w => w.activate.openChange && conditions(w.activate, s))
  if (!w) return { workflow: null, variant: null }
  const vs = w.variants ?? []
  const v = vs.find(v => conditions(v.activate, s) && triggered(v.activate, t)) ??
    (w.name === s.workflow ? vs.find(v => v.name === s.variant && conditions(v.activate, s)) : undefined) ??
    vs.find(v => conditionOnly(v.activate) && conditions(v.activate, s))
  return { workflow: w.name, variant: v?.name ?? null }
}

export function workflowOf(s: NavState): Workflow | undefined {
  return s.workflows.find(w => w.name === s.workflow)
}

export function phasesOf(w: Workflow, variant: string | null): Phase[] {
  const v = w.variants?.find(v => v.name === variant)
  return v ? w.phases.filter(p => v.phases.includes(p.id)) : w.phases
}

export function enteredBy(phases: Phase[], t: Trigger | null): string | null {
  if (!t) return null
  return phases.find(p => triggered({ skills: p.enter.skills, agents: p.enter.agents }, t))?.id ?? null
}

/** The phase a signal entered, moved forward when the change files now satisfy a later phase; with
 *  no signal, the last phase whose predicate holds, else the first. */
export function phaseFor(phases: Phase[], signal: string | null, change: NavState['change']): string | null {
  const byFiles = (after: number) =>
    phases.findLastIndex((p, i) => i > after && !!p.enter.change && holds(p.enter.change, change))
  const i = phases.findIndex(p => p.id === signal)
  const j = byFiles(i)
  return phases[j >= 0 ? j : i >= 0 ? i : 0]?.id ?? null
}

const noEnter = (p: Phase | undefined) => !!p && Object.keys(p.enter).length === 0

/** DevOps phases have no `enter`: the command that passes a gate of this or a later phase moves to
 *  the phase after it (`terraform plan` → card); an answered consent enters the next phase that holds
 *  a consent gate. Only into a phase with no `enter`. Driven by the gate regexes, never by phase
 *  names (design §4.2). */
export function advanceOn(w: Workflow, phases: Phase[], current: string, ev: Advance): string | null {
  const i = phases.findIndex(p => p.id === current)
  if (i < 0) return null
  for (let k = i; k < phases.length; k++) {
    const p = phases[k]
    for (const id of p?.gates ?? []) {
      const g = w.gates?.[id]
      const passed = ev.command !== undefined && g &&
        ((g.kind === 'command' && new RegExp(g.match).test(ev.command)) ||
         (g.kind === 'consent' && new RegExp(g.before).test(ev.command)))
      if (passed && noEnter(phases[k + 1])) return phases[k + 1]!.id
      if (ev.consent && g?.kind === 'consent' && k > i && noEnter(p)) return p!.id
    }
  }
  return null
}

const addWarnings = (s: NavState, ws: Warning[]): Warning[] =>
  [...s.warnings, ...ws.filter(w => !s.warnings.some(x => x.key === w.key))]

/** Re-derive workflow, variant and phase; a phase change runs the leave and enter checks (§6.3). */
export function navigate(s: NavState, at: number, t: Trigger | null = null, ev: Advance | null = null): NavState {
  const { workflow, variant } = select(s, t)
  const w = s.workflows.find(x => x.name === workflow)
  if (!w) return { ...s, workflow: null, variant: null, phase: null, signalPhase: null }
  const phases = phasesOf(w, variant)
  const kept = workflow === s.workflow && phases.some(p => p.id === s.signalPhase) ? s.signalPhase : null
  const advanced = ev && s.phase && workflow === s.workflow ? advanceOn(w, phases, s.phase, ev) : null
  const signal = enteredBy(phases, t) ?? advanced ?? kept
  const phase = phaseFor(phases, signal, s.change)
  const next: NavState = { ...s, workflow, variant, signalPhase: signal, phase }
  if (phase === s.phase && workflow === s.workflow) return next
  // The first placement of a session is not an entry: no checks on what an earlier session did (DD-36).
  if (s.phase === null || workflow !== s.workflow) return { ...next, phaseAt: at }
  const from = phases.find(p => p.id === s.phase) ?? w.phases.find(p => p.id === s.phase)
  const to = phases.find(p => p.id === phase)
  const warnings = [...(from ? onLeave(s, w, from) : []), ...(to ? onEnter(s, w, to) : [])]
  return { ...next, phaseAt: at, warnings: addWarnings(s, warnings) }
}

export { addWarnings }
