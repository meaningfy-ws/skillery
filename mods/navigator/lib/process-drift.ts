// Process drift PD-1..PD-5 and the gate states they read (design §6.3). Pure. This module mints and
// clears every warning key (DD-38).

import type { GateState, NavState, Phase, Warning, Workflow } from './state.ts'
import { bare, globRegex } from './workflow.ts'

const warning = (key: string, message: string, remedy: string | null, owner: string): Warning =>
  ({ key, message, remedy, owner })

/** A drift warning (plan or process) not recorded as a deviation (DD-41). */
export const isDrift = (key: string) => /^(plan|process):/.test(key)
export const isOpen = (s: NavState, w: Warning) => isDrift(w.key) && !s.accepted.includes(w.key)
export const openDrift = (s: NavState) => s.warnings.filter(w => isOpen(s, w))

/** Warnings added to the list, one per key. */
export const addWarnings = (s: NavState, ws: Warning[]): Warning[] =>
  [...s.warnings, ...ws.filter(w => !s.warnings.some(x => x.key === w.key))]

/** Workflow-file errors: the last read replaces the earlier ones. */
export function workflowErrors(s: NavState, errors: string[]): Warning[] {
  const kept = s.warnings.filter(w => !w.key.startsWith('workflow:error:'))
  return [...kept, ...[...new Set(errors)].map(m => warning(`workflow:error:${m}`, m, null, 'navigator'))]
}

/** A gate that passed removes the gate warnings of exactly that gate. */
export function clearGateWarnings(warnings: Warning[], gateIds: string[]): Warning[] {
  return warnings.filter(w => !gateIds.includes(w.key.match(/^process:gate:[^:]+:(.+)$/)?.[1] ?? '\0'))
}

export const loadedSince = (s: NavState, at: number) => new Set(s.skills.filter(k => k.at >= at).map(k => bare(k.name)))

/** The expected skills of the phase, of one kind, not run since it was entered. */
export function missingExpect(s: NavState, p: Phase, by: 'commit' | 'exit'): string[] {
  const loaded = loadedSince(s, s.phaseAt)
  return p.expect.filter(x => x.by === by).map(x => bare(x.skill)).filter(k => !loaded.has(k))
}

/** PD-1: a successful commit while a `by: 'commit'` skill of the phase has not run since it was entered. */
export function onCommit(s: NavState, p: Phase): Warning[] {
  return missingExpect(s, p, 'commit').map(k =>
    warning(`process:missing:${p.id}:${k}`, `commit in ${p.id} without ${k}`, k, bare(p.owner)))
}

/** PD-2, and PD-3 for command and file gates: what the phase left undone (DD-36). */
export function onLeave(s: NavState, w: Workflow, p: Phase): Warning[] {
  const missing = missingExpect(s, p, 'exit').map(k =>
    warning(`process:missing:${p.id}:${k}`, `left ${p.id} without ${k}`, k, bare(p.owner)))
  const gates = (p.gates ?? []).filter(id => {
    const kind = w.gates?.[id]?.kind
    return (kind === 'command' || kind === 'file') && s.gates[id]?.state !== 'ok'
  })
  return [...missing, ...gates.map(id => gateWarning(w, p, id))]
}

/** PD-3 for skill gates: a precondition of the phase (clarity before apply). */
export function onEnter(s: NavState, w: Workflow, p: Phase): Warning[] {
  return (p.gates ?? []).filter(id => w.gates?.[id]?.kind === 'skill' && s.gates[id]?.state !== 'ok')
    .map(id => gateWarning(w, p, id))
}

function gateWarning(w: Workflow, p: Phase, id: string): Warning {
  const g = w.gates![id]!
  const [what, remedy] =
    g.kind === 'skill' ? [`${bare(g.skill)} has not run since its inputs changed`, bare(g.skill)] :
    g.kind === 'command' ? [`${id} has not passed since the last edit`, g.run ? 'navigator validate' : null] :
    g.kind === 'file' ? [`no file matching ${g.glob} changed`, null] :
    ['ran without an answered consent card', null]
  return warning(`process:gate:${p.id}:${id}`, `${p.id}: ${what}`, remedy, bare(p.owner))
}

/** A command activated `w` while its owner skill has not loaded: the band asks for it (D-7). */
export function onCommandActivation(s: NavState, w: Workflow): Warning[] {
  const owner = bare(w.owner)
  return loadedSince(s, 0).has(owner) ? []
    : [warning(`process:missing:${w.name}:${owner}`, `${w.name} started without ${owner}`, owner, owner)]
}

/** The state left behind when the followed change becomes another one or none (D-8): what belonged to the
 *  old change goes, and the workflow is chosen again from the new change's files. A workflow that is not
 *  about a change (release) keeps its phase, gates and warnings (D-25). */
export function handOff(s: NavState, oldId: string): NavState {
  const w = s.workflows.find(x => x.name === s.workflow)
  if (w && !w.activate.openChange && !w.activate.change) {
    return { ...s, accepted: [], warnings: s.warnings.filter(x => !x.key.startsWith('plan:') && x.key !== `process:second-check:${oldId}`) }
  }
  const scoped = ['process:gate:', 'process:missing:', 'process:elsewhere:', `process:second-check:${oldId}`, 'plan:']
  return { ...s, gates: {}, accepted: [], workflow: null, variant: null, phase: null, signalPhase: null,
    warnings: s.warnings.filter(w => !scoped.some(p => w.key.startsWith(p))) }
}

/** PD-4 (a skill of another phase) and PD-5 (an external skill a Meaningfy skill replaces). */
export function onSkill(s: NavState, w: Workflow | undefined, p: Phase | undefined, skill: string): Warning[] {
  const name = bare(skill)
  const out: Warning[] = []
  const owner = s.workflows.find(x => Object.keys(x.replaces ?? {}).some(from => bare(from) === name))
  const to = owner && Object.entries(owner.replaces!).find(([from]) => bare(from) === name)![1]
  if (owner && to) out.push(warning(`process:external:${name}`, `${name} ran; ${bare(to)} owns this job here`, bare(to), bare(owner.owner)))
  if (w && p) {
    const listed = (q: Phase) => [...q.expect.map(e => e.skill), ...(q.allow ?? [])].map(bare)
    const gateSkills = (p.gates ?? []).flatMap(id => { const g = w.gates?.[id]; return g?.kind === 'skill' ? [bare(g.skill)] : [] })
    const own = new Set([...listed(p), bare(p.owner), ...(p.enter.skills ?? []).map(bare), ...gateSkills])
    if (!own.has(name) && w.phases.some(q => q.id !== p.id && listed(q).includes(name))) {
      out.push(warning(`process:elsewhere:${p.id}:${name}`, `${name} ran in ${p.id}; it belongs to another phase`, null, bare(w.owner)))
    }
  }
  return out
}

/** PD-3 for consent gates: the `before` command ran with no consent answered. Each run uses the consent up. */
export function onCommand(s: NavState, w: Workflow, command: string): { warnings: Warning[]; consent: NavState['consent'] } {
  const consent = { ...s.consent }
  const warnings: Warning[] = []
  for (const p of w.phases) {
    for (const id of p.gates ?? []) {
      const g = w.gates?.[id]
      if (g?.kind !== 'consent' || !new RegExp(g.before).test(command)) continue
      if (!consent[id]) warnings.push(gateWarning(w, p, id))
      consent[id] = false
    }
  }
  return { warnings, consent }
}

/** An answer that shows a consent card (its `shown` regex on any line). */
export const showsConsent = (w: Workflow, text: string) =>
  Object.values(w.gates ?? {}).some(g => g.kind === 'consent' && new RegExp(g.shown, 'm').test(text))

// ---------------------------------------------------------------- gate states (the band's ✓ ✗ ·)
type Gates = Record<string, GateState>

export function gatesAfterCommand(gates: Gates, w: Workflow, command: string, ok: boolean, at: number): Gates {
  const out = { ...gates }
  for (const [id, g] of Object.entries(w.gates ?? {})) {
    if (g.kind === 'command' && new RegExp(g.match).test(command)) out[id] = { state: ok ? 'ok' : 'fail', at, detail: command }
  }
  return out
}

export function gatesAfterFile(gates: Gates, w: Workflow, path: string, at: number): Gates {
  const out = { ...gates }
  for (const [id, g] of Object.entries(w.gates ?? {})) {
    if (g.kind === 'command' && out[id]?.state === 'ok') out[id] = { ...out[id]!, state: 'stale' }
    if (g.kind === 'file' && globRegex(g.glob).test(path)) out[id] = { state: 'ok', at, detail: path }
  }
  return out
}

export function gatesAfterSkill(gates: Gates, w: Workflow, skill: string, at: number): Gates {
  const out = { ...gates }
  for (const [id, g] of Object.entries(w.gates ?? {})) {
    if (g.kind === 'skill' && bare(g.skill) === bare(skill)) out[id] = { state: 'ok', at, detail: '' }
  }
  return out
}

/** A passed skill gate goes stale when the PLAN's design changed since the last read (DD-14, D-15). */
export function gatesAfterPlan(gates: Gates, w: Workflow): Gates {
  const out = { ...gates }
  for (const [id, g] of Object.entries(w.gates ?? {})) {
    if (g.kind === 'skill' && out[id]?.state === 'ok') out[id] = { ...out[id]!, state: 'stale' }
  }
  return out
}
