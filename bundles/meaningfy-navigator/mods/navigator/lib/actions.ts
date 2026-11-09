// Band actions → commands a person could type (design §8, DEC-6). Pure: register.tsx submits them.

import { missingExpect } from './process-drift.ts'
import type { NavState } from './state.ts'
import { bare, currentPhase, phasesOf } from './workflow.ts'

export type Command = { command: string; args: string }

/** The first `expect` skill of the phase not run since it was entered, else the next phase's owner. */
export function nextStep(s: NavState): string | null {
  const here = currentPhase(s)
  if (!here) return null
  const phases = phasesOf(here.w, s.variant)
  const after = phases[phases.indexOf(here.p) + 1]
  const unmet = here.p.expect.map(x => bare(x.skill)).find(k => [...missingExpect(s, here.p, 'commit'),
    ...missingExpect(s, here.p, 'exit')].includes(k))
  return unmet ?? (after ? bare(after.owner) : null)
}

/** The remedy of the oldest open warning that has one. */
export function backOnTrack(s: NavState): string | null {
  return s.warnings.find(w => w.remedy)?.remedy ?? null
}

/** The `run` lines of the phase's command gates, `{change}` filled in. */
export function validateRuns(s: NavState): string[] {
  const here = currentPhase(s)
  if (!here) return []
  // Only a safe change id goes into a command line; a `{change}` line with none is skipped (DD-38).
  const id = s.change && /^[\w.-]+$/.test(s.change.id) ? s.change.id : null
  return (here.p.gates ?? []).flatMap(g => {
    const gate = here.w.gates?.[g]
    if (gate?.kind !== 'command' || !gate.run || (gate.run.includes('{change}') && !id)) return []
    return [gate.run.replaceAll('{change}', id ?? '')]
  })
}

/** Resolve `name args` against the installed commands: the name itself or `<plugin>:<name>` (DD-15). */
export function commandFor(line: string, installed: readonly string[]): Command | { reason: string } {
  const [name = '', ...rest] = line.trim().split(/\s+/)
  if (!name) return { reason: 'navigator: no command to run' }
  const command = installed.find(n => n === name) ?? installed.find(n => n.endsWith(`:${name}`))
  return command ? { command, args: rest.join(' ') } : { reason: `navigator: ${name} is not installed` }
}
