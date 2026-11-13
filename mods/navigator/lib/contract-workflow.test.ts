// Adversarial cases for the contract workflow (named-workers-and-legal D-10): provisional, no gates,
// activated by contract-practice or lawyer; a repository adds gates with `extends`.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { EMPTY, reduce, type Change, type NavState, type Signal } from './state.ts'
import { resolveWorkflows } from './workflow.ts'

const REPO = join(import.meta.dirname, '..', '..', '..')
const all = readdirSync(join(REPO, 'skills')).flatMap(skill => {
  try {
    const dir = `skills/${skill}/assets/workflows`
    return readdirSync(join(REPO, dir)).map(f => ({ path: `${dir}/${f}`, text: readFileSync(join(REPO, dir, f), 'utf8') }))
  } catch { return [] }
})
const defaults = resolveWorkflows(all, [])

let n = 0
const id = () => `k${++n}`
const change: Change = { id: 'x', appetite: 'LARGE', done: 1, total: 9, groups: [], planHash: '', hasDesign: true, hasTasks: true, archived: false }
const run = (...signals: Signal[]): NavState =>
  signals.reduce(reduce, reduce(EMPTY, { kind: 'Started', id: id(), sessionId: 's', band: 'folded', statusLine: true, interactive: true }))
const workflows = (ws = defaults.workflows): Signal => ({ kind: 'WorkflowsRead', id: id(), workflows: ws, errors: [], mode: 'loose', at: 1 })
const read = (c: Change | null, at = 2): Signal => ({ kind: 'ChangeRead', id: id(), change: c, openChanges: c ? 1 : 0, at })
const skill = (name: string, at: number): Signal => ({ kind: 'SkillLoaded', id: id(), name, at })
const spawn = (type: string, at: number): Signal =>
  ({ kind: 'SubagentSpawned', id: id(), agentId: id(), type, model: 'sonnet', description: 'd', at })
const cmd = (command: string, at: number): Signal => ({ kind: 'ToolRan', id: id(), command, ok: true, at })
const write = (path: string, at: number): Signal => ({ kind: 'FileTouched', id: id(), path, at })
const where = (s: NavState) => [s.workflow, s.phase]

test('every default workflow, contract included, resolves with no errors', () => assert.deepEqual(defaults.errors, []))

test('the contract default has no gates field and seven phases from intake', () => {
  const w = defaults.workflows.find(w => w.name === 'contract')!
  assert.equal(w.gates, undefined)
  assert.deepEqual(w.phases.map(p => p.id), ['intake', 'draft', 'align', 'review', 'negotiate', 'sign', 'harvest'])
})

test('loading contract-practice activates contract at intake', () =>
  assert.deepEqual(where(run(workflows(), read(null), skill('contract-practice', 3))), ['contract', 'intake']))

test('a plugin-prefixed contract-practice activates contract too', () =>
  assert.equal(run(workflows(), read(null), skill('meaningfy-legal:contract-practice', 3)).workflow, 'contract'))

test('spawning lawyer activates contract', () =>
  assert.deepEqual(where(run(workflows(), read(null), spawn('lawyer', 3))), ['contract', 'intake']))

test('loading corpus-repository alone does not activate contract', () =>
  assert.notEqual(run(workflows(), read(null), skill('corpus-repository', 3)).workflow, 'contract'))

test('with no gates, commands and file writes leave contract at intake (accepted, D-10)', () => {
  const s = run(workflows(), read(null), skill('contract-practice', 3), cmd('git commit -m x', 4), cmd('gh pr create', 5),
    write('contracts/acme/draft.md', 6), cmd('make validate', 7))
  assert.deepEqual(where(s), ['contract', 'intake'])
  assert.deepEqual(s.gates, {})
})

test('corpus-repository loaded inside contract is allowed: no process warning', () => {
  const s = run(workflows(), read(null), skill('contract-practice', 3), skill('corpus-repository', 4))
  assert.equal(s.workflow, 'contract')
  assert.deepEqual(s.warnings.filter(w => w.key.startsWith('process:')), [])
})

// ---- collision with an open change
test('an open change alone activates epic-delivery, not contract', () =>
  assert.equal(run(workflows(), read(change)).workflow, 'epic-delivery'))

test('contract-practice loaded with an open change switches to contract (the trigger wins)', () =>
  assert.equal(run(workflows(), read(change), skill('contract-practice', 3)).workflow, 'contract'))

test('contract stays active when the open change is re-read', () =>
  assert.equal(run(workflows(), read(change), skill('contract-practice', 3), read(change, 4)).workflow, 'contract'))

// ---- a repository adds gates with extends
const override = {
  path: 'docs/navigator/contract.workflow.json',
  text: JSON.stringify({
    name: 'contract', extends: 'contract',
    phases: [
      { id: 'intake', owner: 'contract-practice', expect: [], gates: ['brief'], enter: {} },
      { id: 'draft', owner: 'contract-practice', expect: [], allow: ['corpus-repository'], gates: ['drafted'], enter: {} },
      { id: 'align', owner: 'contract-practice', expect: [], enter: {} },
    ],
    gates: {
      brief: { kind: 'file', glob: 'contracts/*/brief.md' },
      drafted: { kind: 'file', glob: 'contracts/*/draft.md' },
    },
  }),
}
const repo = resolveWorkflows(all, [override])

test('a repository override of contract with gates resolves with no errors', () => assert.deepEqual(repo.errors, []))

test('the override keeps activate, owner and provisional from the default', () => {
  const w = repo.workflows.find(w => w.name === 'contract')!
  assert.deepEqual(w.activate, { skills: ['contract-practice'], agents: ['lawyer'] })
  assert.equal(w.owner, 'contract-practice')
  assert.equal(w.provisional, true)
})

test('override gates move the phase: brief.md to draft, draft.md to align', () => {
  const base = [workflows(repo.workflows), read(null), skill('contract-practice', 3)]
  assert.equal(run(...base).phase, 'intake')
  assert.equal(run(...base, write('contracts/acme/brief.md', 4)).phase, 'draft')
  assert.equal(run(...base, write('contracts/acme/brief.md', 4), write('contracts/acme/draft.md', 5)).phase, 'align')
})

test('an override naming a gate it does not define is reported and the default stays', () => {
  const bad = { path: override.path, text: JSON.stringify({ name: 'contract', extends: 'contract',
    phases: [{ id: 'intake', owner: 'contract-practice', expect: [], gates: ['nope'], enter: {} }] }) }
  const r = resolveWorkflows(all, [bad])
  assert.equal(r.errors.length, 1)
  assert.equal(r.workflows.find(w => w.name === 'contract')!.phases.length, 7)
})
