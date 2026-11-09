// Strict mode (design §7, DEC-5): one rule per `hooks.yaml` `mod` intent; `id` equals the hook id
// (`mod_bindings_match` lint). Strict adds to loose, never replaces it. Pure: register.tsx asks.

import { missingExpect } from './process-drift.ts'
import type { NavState, Warning } from './state.ts'
import { currentPhase, isStrict } from './workflow.ts'

export const STRICT_RULES = [
  { id: 'navigator-strict-commit', owner: 'epic-delivery' },
  { id: 'navigator-strict-archive', owner: 'spec-stewardship' },
  { id: 'navigator-strict-spawn', owner: 'guardrails' },
  { id: 'navigator-strict-reminder', owner: 'epic-delivery' },
] as const

export type RuleId = (typeof STRICT_RULES)[number]['id']
export type Decision = { allow: true } | { deny: string } | { model: string }

const ALLOW: Decision = { allow: true }
const open = (s: NavState, w: Warning) => !s.accepted.includes(w.key)

/** The fixed deny template: the reason, then every way out. */
export function denyText(id: RuleId, w: Warning): string {
  const ways = [...(w.remedy ? [`/${w.remedy}`] : []), `/navigator accept ${w.key} "<reason>"`, '/navigator mode loose']
  return `navigator (strict, ${id}): ${w.message}. Way out: ${ways.join(' · ')}`
}

/** navigator-strict-commit: PD-1's condition now, before the commit runs, or an open gate warning of the phase. */
export function decideCommit(s: NavState): Decision {
  const here = isStrict(s) ? currentPhase(s) : undefined
  if (!here) return ALLOW
  const { p } = here
  const missing = missingExpect(s, p, 'commit').map((k): Warning =>
    ({ key: `process:missing:${p.id}:${k}`, message: `commit in ${p.id} without ${k}`, remedy: k, owner: p.owner }))
  const gate = s.warnings.filter(w => w.key.startsWith(`process:gate:${p.id}:`))
  const first = [...missing, ...gate].find(w => open(s, w))
  return first ? { deny: denyText('navigator-strict-commit', first) } : ALLOW
}

/** navigator-strict-archive: any open plan or process drift. */
export function decideArchive(s: NavState): Decision {
  if (!isStrict(s)) return ALLOW
  const first = s.warnings.find(w => /^(plan|process):/.test(w.key) && open(s, w))
  return first ? { deny: denyText('navigator-strict-archive', first) } : ALLOW
}

/** navigator-strict-spawn: an over-spawn (PD-8) is denied; a model above the parent's with no
 *  declared model (PD-7) is rewritten to the parent's. `dispatch.ts` decides both. */
export function decideSpawn(s: NavState, overspawn: Warning | null, rewriteTo: string | null): Decision {
  if (!isStrict(s)) return ALLOW
  if (overspawn && open(s, overspawn)) return { deny: denyText('navigator-strict-spawn', overspawn) }
  return rewriteTo ? { model: rewriteTo } : ALLOW
}

/** navigator-strict-reminder: built only from the workflow file's data, no rule prose (DEC-2). */
export function reminder(s: NavState): string | null {
  const here = isStrict(s) ? currentPhase(s) : undefined
  if (!here) return null
  const { w, p } = here
  const expected = p.expect.map(x => x.skill).join(', ') || 'none'
  return `Phase ${p.id} of ${w.title} (owner skill: ${p.owner}). Expected: ${expected}. ` +
    `Gates: ${(p.gates ?? []).join(', ') || 'none'}. Workflow file: ${w.name}.workflow.json.`
}
