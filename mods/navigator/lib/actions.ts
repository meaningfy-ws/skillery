// Band actions → commands a person could type (design §8, DEC-6). Pure: register.tsx submits them.

import { phasesOf, workflowOf } from './phase.ts'
import type { NavState } from './state.ts'
import { bare } from './workflow.ts'

export type Command = { command: string; args: string }

/** The first `expect` skill of the phase not run since it was entered, else the next phase's owner. */
export function nextStep(s: NavState): string | null {
  const w = workflowOf(s)
  if (!w) return null
  const phases = phasesOf(w, s.variant)
  const i = phases.findIndex(p => p.id === s.phase)
  const p = phases[i]
  if (!p) return null
  const loaded = new Set(s.skills.filter(k => k.at >= s.phaseAt).map(k => bare(k.name)))
  const unmet = p.expect.map(x => bare(x.skill)).find(k => !loaded.has(k))
  return unmet ?? (phases[i + 1] ? bare(phases[i + 1]!.owner) : null)
}

/** The remedy of the oldest open warning that has one. */
export function backOnTrack(s: NavState): string | null {
  return s.warnings.find(w => w.remedy)?.remedy ?? null
}

/** The `run` lines of the phase's command gates, `{change}` filled in. */
export function validateRuns(s: NavState): string[] {
  const w = workflowOf(s)
  const p = w && phasesOf(w, s.variant).find(p => p.id === s.phase)
  if (!w || !p) return []
  return (p.gates ?? []).flatMap(id => {
    const g = w.gates?.[id]
    return g?.kind === 'command' && g.run ? [g.run.replaceAll('{change}', s.change?.id ?? '')] : []
  })
}

/** Resolve `name args` against the installed commands: the name itself or `<plugin>:<name>` (DD-15). */
export function commandFor(line: string, installed: readonly string[]): Command | { reason: string } {
  const [name = '', ...rest] = line.trim().split(/\s+/)
  const command = installed.find(n => n === name) ?? installed.find(n => n.endsWith(`:${name}`))
  return command ? { command, args: rest.join(' ') } : { reason: `navigator: ${name} is not installed` }
}
