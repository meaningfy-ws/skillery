// #188 (D-14): every default workflow that names a lead worker activates when a session's first act is
// loading that lead's primary skill (its first `skills:` entry in agents/<lead>.md).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { EMPTY, reduce, type NavState, type Signal } from './state.ts'
import { resolveWorkflows } from './workflow.ts'

const REPO = join(import.meta.dirname, '..', '..', '..')
const all = readdirSync(join(REPO, 'skills')).flatMap(skill => {
  try {
    const dir = `skills/${skill}/assets/workflows`
    return readdirSync(join(REPO, dir)).map(f => ({ path: `${dir}/${f}`, text: readFileSync(join(REPO, dir, f), 'utf8') }))
  } catch { return [] }
})
const defaults = resolveWorkflows(all, [])

/** The agents a workflow names in `activate.agents`; one of them is its lead (sales names two). */
const agentsOf = (name: string) => defaults.workflows.find(w => w.name === name)!.activate.agents ?? []

/** The first entry of the `skills:` list in an agent's frontmatter. */
const primarySkill = (agent: string) => {
  const m = readFileSync(join(REPO, 'agents', `${agent}.md`), 'utf8').match(/^skills:\s*\n\s*- (\S+)/m)
  assert.ok(m, `${agent} lists no skills`)
  return m[1]!
}

let n = 0
const id = () => `l${++n}`
const session = (...more: Signal[]): NavState => {
  const signals: Signal[] = [
    { kind: 'Started', id: id(), sessionId: 's', band: 'folded', statusLine: true, interactive: true },
    { kind: 'WorkflowsRead', id: id(), workflows: defaults.workflows, errors: [], mode: 'loose', at: 1 },
    { kind: 'ChangeRead', id: id(), change: null, openChanges: 0, at: 2 }, // a session with nothing placed yet
    ...more,
  ]
  return signals.reduce(reduce, EMPTY)
}

for (const w of defaults.workflows) {
  test(`${w.name}: the lead among its activate.agents, loading its primary skill, shows the workflow and a phase`, () => {
    assert.ok(agentsOf(w.name).length > 0, `${w.name} names no agent`)
    // A workflow may list several agents (sales: two); the lead is the one whose primary skill activates it.
    const leads = agentsOf(w.name).filter(agent =>
      session({ kind: 'SkillLoaded', id: id(), name: primarySkill(agent), at: 3 }).workflow === w.name)
    assert.ok(leads.length > 0, `no agent of ${w.name} activates it by its primary skill`)
    const s = session({ kind: 'SkillLoaded', id: id(), name: primarySkill(leads[0]!), at: 3 })
    // The skill may enter a later phase by design (sales-operations opens `pipeline`, epic-delivery `apply`).
    assert.ok(w.phases.some(p => p.id === s.phase), `${w.name} shows no phase: ${s.phase}`)
  })
}
