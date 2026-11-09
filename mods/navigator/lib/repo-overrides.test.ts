// skillery's own workflow overrides in docs/navigator/ (lean-delivery 3.2): `extends` merges `gates` shallowly.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { EMPTY, reduce, type Change, type NavState, type Signal } from './state.ts'
import { resolveWorkflows } from './workflow.ts'

const REPO = join(import.meta.dirname, '..', '..', '..')
const src = (path: string) => ({ path, text: readFileSync(join(REPO, path), 'utf8') })
const defaults = [src('skills/epic-delivery/assets/workflows/epic-delivery.workflow.json'),
  src('skills/technical-writing/assets/workflows/documentation.workflow.json')]
const resolved = resolveWorkflows(defaults, [src('docs/navigator/epic-delivery.workflow.json'), src('docs/navigator/documentation.workflow.json')])

let n = 0
const id = () => `o${++n}`
const change: Change = { id: 'x', appetite: 'LARGE', done: 3, total: 9, groups: [], planMtime: 0, hasDesign: true, hasTasks: true }
const run = (...signals: Signal[]): NavState =>
  signals.reduce(reduce, reduce(EMPTY, { kind: 'Started', id: id(), sessionId: 's', band: 'folded', statusLine: true, interactive: true }))
const base = (c: Change | null): Signal[] => [
  { kind: 'WorkflowsRead', id: id(), workflows: resolved.workflows, errors: resolved.errors, mode: 'loose', at: 1 },
  { kind: 'ChangeRead', id: id(), change: c, openChanges: c ? 1 : 0, at: 2 }]
const cmd = (command: string, at: number): Signal => ({ kind: 'ToolRan', id: id(), command, ok: true, at })
const skill = (name: string, at: number): Signal => ({ kind: 'SkillLoaded', id: id(), name, at })

test('skillery overrides resolve with no errors', () => assert.deepEqual(resolved.errors, []))

const FULL: [string, string][] = [['make validate', 'ok'], ['make check-all', 'none'], ['make validate-spine', 'none'], ['make validate-x', 'none']]
for (const [command, state] of FULL) {
  test(`full-gates in skillery: \`${command}\` -> ${state}`, () => {
    assert.equal(run(...base(change), cmd(command, 5)).gates['full-gates']?.state ?? 'none', state)
  })
}

const DOCS: [string, string][] = [['make validate', 'cold-read'], ['make build-docs', 'inventory'], ['make validate-spine', 'inventory']]
for (const [command, phase] of DOCS) {
  test(`docs-gate in skillery: \`${command}\` -> ${phase}`, () => {
    assert.equal(run(...base(null), skill('technical-writing', 3), cmd(command, 5)).phase, phase)
  })
}

test('the documentation override keeps the default gates it does not change', () => {
  const merged = resolved.workflows.find(w => w.name === 'documentation')!
  const def = resolveWorkflows(defaults, []).workflows.find(w => w.name === 'documentation')!
  for (const g of ['owed', 'cold-read', 'published']) assert.deepEqual(merged.gates?.[g], def.gates?.[g], g)
  const epic = resolved.workflows.find(w => w.name === 'epic-delivery')!
  const epicDef = resolveWorkflows(defaults, []).workflows.find(w => w.name === 'epic-delivery')!
  for (const g of ['clarity', 'acceptance', 'openspec']) assert.deepEqual(epic.gates?.[g], epicDef.gates?.[g], g)
})
