// Process drift PD-1..PD-5 and the gate states they read (design §6.3). Pure.

import type { GateState, NavState, Phase, Warning, Workflow } from './state.ts'
import { bare } from './workflow.ts'

const warning = (key: string, message: string, remedy: string | null, owner: string): Warning =>
  ({ key, message, remedy, owner })

const loadedSince = (s: NavState, at: number) => new Set(s.skills.filter(k => k.at >= at).map(k => bare(k.name)))

/** PD-1: a successful commit while a `by: 'commit'` skill of the phase has not run since it was entered. */
export function onCommit(s: NavState, p: Phase): Warning[] {
  const loaded = loadedSince(s, s.phaseAt)
  return p.expect.filter(x => x.by === 'commit' && !loaded.has(bare(x.skill))).map(x => bare(x.skill)).map(k =>
    warning(`process:missing:${p.id}:${k}`, `commit in ${p.id} without ${k}`, k, bare(p.owner)))
}

/** PD-2, and PD-3 for command and file gates: what the phase left undone (DD-36). */
export function onLeave(s: NavState, w: Workflow, p: Phase): Warning[] {
  const loaded = loadedSince(s, s.phaseAt)
  const missing = p.expect.filter(x => x.by === 'exit' && !loaded.has(bare(x.skill))).map(x => bare(x.skill)).map(k =>
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
    g.kind === 'skill' ? [`${bare(g.skill)} has not run on the current PLAN`, bare(g.skill)] :
    g.kind === 'command' ? [`${id} has not passed since the last edit`, g.run ? 'navigator validate' : null] :
    g.kind === 'file' ? [`no file matching ${g.glob} changed`, null] :
    ['ran without an answered consent card', null]
  return warning(`process:gate:${p.id}:${id}`, `${p.id}: ${what}`, remedy, bare(p.owner))
}

/** PD-4 (a skill of another phase) and PD-5 (an external skill a Meaningfy skill replaces). */
export function onSkill(s: NavState, w: Workflow | undefined, p: Phase | undefined, skill: string): Warning[] {
  const name = bare(skill)
  const out: Warning[] = []
  const replaced = s.workflows.flatMap(x =>
    Object.entries(x.replaces ?? {}).filter(([from]) => bare(from) === name).map(([, to]) => [x, bare(to)] as const))
  for (const [x, to] of replaced.slice(0, 1)) {
    out.push(warning(`process:external:${name}`, `${name} ran; ${to} owns this job here`, to, bare(x.owner)))
  }
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

/** A skill gate passed before the PLAN files last changed is stale (DD-14). */
export function gatesAfterPlan(gates: Gates, w: Workflow, planMtime: number): Gates {
  const out = { ...gates }
  for (const [id, g] of Object.entries(w.gates ?? {})) {
    if (g.kind === 'skill' && out[id]?.state === 'ok' && out[id]!.at < planMtime) out[id] = { ...out[id]!, state: 'stale' }
  }
  return out
}

/** `**` any folders, `*` and `?` within one name, `[..]` a class. Paths are repo-relative. */
export function globRegex(glob: string): RegExp {
  let re = ''
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i]!
    if (glob.startsWith('**/', i)) { re += '(?:.*/)?'; i += 2 }
    else if (glob.startsWith('**', i)) { re += '.*'; i += 1 }
    else if (c === '*') re += '[^/]*'
    else if (c === '?') re += '[^/]'
    else if (c === '[' && glob.indexOf(']', i) > i) { const end = glob.indexOf(']', i); re += glob.slice(i, end + 1); i = end }
    else re += c.replace(/[.+^${}()|\\]/g, '\\$&')
  }
  return new RegExp(`^${re}$`)
}
