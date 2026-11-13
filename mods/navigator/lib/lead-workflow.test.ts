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

/** The lead worker of each default workflow (named-workers; the Gherkin scenarios of #188 name the same). */
const LEADS: Record<string, string> = {
  'architecting': 'system-architect', 'modelling': 'conceptual-modeller', 'contract': 'lawyer',
  'epic-delivery': 'team-lead', 'epic-shaping': 'epic-planner', 'devops': 'devops-engineer',
  'release': 'release-manager', 'documentation': 'technical-writer', 'sales': 'sales-agent',
}

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

test('the table names a lead for every default workflow, and no other', () => {
  assert.deepEqual(defaults.workflows.map(w => w.name).sort(), Object.keys(LEADS).sort())
})

for (const [name, lead] of Object.entries(LEADS)) {
  test(`${name}: its lead ${lead} loading its primary skill shows the workflow and a phase`, () => {
    const w = defaults.workflows.find(x => x.name === name)!
    const skill = primarySkill(lead)
    const s = session({ kind: 'SkillLoaded', id: id(), name: skill, at: 3 })
    assert.equal(s.workflow, name, `${skill} did not activate ${name}`)
    // The skill may enter a later phase by design (sales-operations opens `pipeline`, epic-delivery `apply`).
    assert.ok(w.phases.some(p => p.id === s.phase), `${name} shows no phase: ${s.phase}`)
  })
}
