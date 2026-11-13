// Band actions → commands a person could type (design §8, DEC-6). Pure: register.tsx submits them.

import { missingExpect, openDrift } from './process-drift.ts'
import type { NavState } from './state.ts'
import { bare, currentPhase, phasesOf, safeChangeId } from './workflow.ts'

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

/** The command the Next step button runs, as a person types it: `act` resolves the skill name to `/<name>` (D-11). */
export const nextCommand = (step: string | null): string | null => (step ? `/${step}` : null)

/** The remedy of the oldest open warning that has one. */
export function backOnTrack(s: NavState): string | null {
  return openDrift(s).find(w => w.key.startsWith('process:') && w.remedy)?.remedy ?? null
}

/** The `run` lines of the phase's command gates, `{change}` filled in. */
export function validateRuns(s: NavState): string[] {
  const here = currentPhase(s)
  if (!here) return []
  // Only a safe change id goes into a command line; a `{change}` line with none is skipped (DD-38).
  const id = safeChangeId(s)
  return (here.p.gates ?? []).flatMap(g => {
    const gate = here.w.gates?.[g]
    if (gate?.kind !== 'command' || !gate.run || (gate.run.includes('{change}') && !id)) return []
    return [gate.run.replaceAll('{change}', id ?? '')]
  })
}

/** What `/navigator validate` runs, or why it runs nothing (no repository is its own reply). */
export function validatePlan(s: NavState): { root: string; runs: string[] } | { reply: string } {
  if (!s.root) return { reply: 'Navigator: no repository; there is nothing to validate.' }
  const runs = validateRuns(s)
  return runs.length ? { root: s.root.path, runs } : { reply: 'Navigator: this phase has no gate to run.' }
}

/** Resolve `name args` against the installed commands: the name itself or `<plugin>:<name>` (DD-15). */
export function commandFor(line: string, installed: readonly string[]): Command | { reason: string } {
  const [name = '', ...rest] = line.trim().split(/\s+/)
  if (!name) return { reason: 'navigator: no command to run' }
  const command = installed.find(n => n === name) ?? installed.find(n => n.endsWith(`:${name}`))
  return command ? { command, args: rest.join(' ') } : { reason: `navigator: ${name} is not installed` }
}

// ---------------------------------------------------------------- stage 3 (design §8, DD-16, DD-35)


/** Reconcile EPIC: update the change, then — after that turn ends — run the clarity gate (DD-16). */
export function reconcile(s: NavState): [string, string] | null {
  const id = safeChangeId(s)
  const open = openDrift(s).some(w => w.key.startsWith('plan:'))
  return id && open ? [`openspec-update-change ${id}`, `clarity-gate ${id}`] : null
}

/** Review: the code-review skill, where the phase expects or allows it. */
export function review(s: NavState): string | null {
  const here = currentPhase(s)
  const id = safeChangeId(s)
  const names = here ? [...here.p.expect.map(x => x.skill), ...(here.p.allow ?? [])].map(bare) : []
  return id && names.includes('meaningfy-code-review') ? `meaningfy-code-review ${id} ${s.change!.appetite ?? ''}`.trim() : null
}

/** Compact now / Fresh session, when hygiene offers one. */
export function hygieneAction(s: NavState): { label: string; line: string } | null {
  if (s.offer === 'fresh') return { label: 'Fresh session', line: 'clear' }
  if (s.offer !== 'compact') return null
  const keep = [s.change ? `change ${s.change.id}` : null, s.phase ? `phase ${s.phase}` : null,
    'open warnings', 'decisions are in design.md'].filter(Boolean).join(', ')
  return { label: 'Compact now', line: `compact keep: ${keep}` }
}

/** Mode: the session switch both ways (DD-35). */
export function modeAction(s: NavState): string {
  return `navigator mode ${(s.mode.session ?? s.mode.repo) === 'strict' ? 'loose' : 'strict'}`
}
