// Active workflow, variant and phase (design §6.2, DD-36, DD-38). Pure; reduce() calls navigate()
// after each signal.

import { holds, holdsAny } from './change.ts'
import { addWarnings, onEnter, onLeave } from './process-drift.ts'
import type { Activate, NavState, Phase, Workflow } from './state.ts'
import { bare, phasesOf } from './workflow.ts'

/** The skill or agent a signal names, if any. */
export type Trigger = { skill?: string; agent?: string }
/** What can advance a phase with no `enter` of its own: a command that ran, or an answered consent. */
export type Advance = { command?: string; consent?: true }

/** `openChange` gates only the default chosen with no trigger (DD-38). */
const conditions = (a: Activate, s: NavState, asDefault = false) =>
  (!a.openChange || !asDefault || s.change !== null) &&
  (!a.change || holds(a.change, s.change)) &&
  (a.interactive === undefined || a.interactive === s.interactive)

const triggered = (a: { skills?: string[]; agents?: string[] }, t: Trigger | null) =>
  !!t && ((!!t.skill && (a.skills ?? []).map(bare).includes(bare(t.skill))) ||
    (!!t.agent && (a.agents ?? []).map(bare).includes(bare(t.agent))))

const conditionOnly = (a: Activate) => !a.skills && !a.agents

/** The active workflow and variant: the one the trigger activates, else the current one while it
 *  still holds, else the workflow that activates on an open change (build-tier). */
export function select(s: NavState, t: Trigger | null): { workflow: string | null; variant: string | null } {
  const ws = s.workflows
  // Once active, a workflow stays while its conditions hold (after an archive, build-tier is in explore).
  const current = ws.find(w => w.name === s.workflow && conditions(w.activate, s))
  const w = ws.find(w => conditions(w.activate, s) && triggered(w.activate, t)) ??
    current ?? ws.find(w => w.activate.openChange && conditions(w.activate, s, true))
  if (!w) return { workflow: null, variant: null }
  const vs = w.variants ?? []
  // A skill of the workflow that no variant matches ends a variant a skill picked.
  const ofWorkflow = triggered(w.activate, t) || w.phases.some(p => triggered(p.enter, t))
  const v = vs.find(v => conditions(v.activate, s) && triggered(v.activate, t)) ??
    (w.name === s.workflow && !ofWorkflow ? vs.find(v => v.name === s.variant && conditions(v.activate, s)) : undefined) ??
    vs.find(v => conditionOnly(v.activate) && conditions(v.activate, s))
  return { workflow: w.name, variant: v?.name ?? null }
}

export function enteredBy(phases: Phase[], t: Trigger | null): string | null {
  return phases.find(p => triggered(p.enter, t))?.id ?? null
}

/** The phase a signal entered, moved forward when the change files satisfy a later phase. Files are
 *  read against the whole workflow, then mapped to the nearest earlier phase of the variant. With
 *  neither, the current phase stays. */
export function phaseFor(w: Workflow, phases: Phase[], signal: string | null, change: NavState['change'],
  current: string | null): string | null {
  const all = w.phases
  const i = all.findIndex(p => p.id === signal)
  const j = all.findLastIndex((p, k) => k > i && p.enter.change !== undefined && holdsAny(p.enter.change, change))
  const k = j >= 0 ? j : i
  if (k < 0) return phases.some(p => p.id === current) ? current : phases[0]?.id ?? null
  const inVariant = all.slice(0, k + 1).findLast(p => phases.some(q => q.id === p.id))
  return inVariant?.id ?? phases[0]?.id ?? null
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

/** Re-derive workflow, variant and phase; a phase change runs the leave and enter checks (§6.3),
 *  and a forward move by a command or consent leaves each phase it skips (DD-38). */
export function navigate(s: NavState, at: number, t: Trigger | null = null, ev: Advance | null = null): NavState {
  const { workflow, variant } = select(s, t)
  const w = s.workflows.find(x => x.name === workflow)
  if (!w) return { ...s, workflow: null, variant: null, phase: null, signalPhase: null }
  const phases = phasesOf(w, variant)
  const same = workflow === s.workflow && variant === s.variant
  const kept = same && phases.some(p => p.id === s.signalPhase) ? s.signalPhase : null
  const advanced = ev && s.phase && same ? advanceOn(w, phases, s.phase, ev) : null
  const signal = enteredBy(phases, t) ?? advanced ?? kept
  const phase = phaseFor(w, phases, signal, s.change, same ? s.phase : null)
  const next: NavState = { ...s, workflow, variant, signalPhase: signal, phase }
  if (phase === s.phase && same) return next
  // A session's first placement, a workflow or a variant change: placed, not entered (DD-36, DD-38).
  if (s.phase === null || !same) return { ...next, phaseAt: at }
  const from = phases.findIndex(p => p.id === s.phase)
  const to = phases.findIndex(p => p.id === phase)
  const skipped = advanced && to > from + 1 ? phases.slice(from + 1, to) : []
  const warnings = [
    ...(from >= 0 ? onLeave(s, w, phases[from]!) : []),
    ...skipped.flatMap(p => onLeave(s, w, p)),
    ...(to >= 0 ? onEnter(s, w, phases[to]!) : []),
  ]
  return { ...next, phaseAt: at, warnings: addWarnings(s, warnings) }
}
