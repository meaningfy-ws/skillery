// Adversarial edge cases for the documentation workflow (lean-delivery D-6, D-8, D-19).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { EMPTY, reduce, type Change, type NavState, type Signal } from './state.ts'
import { resolveWorkflows } from './workflow.ts'

const REPO = join(import.meta.dirname, '..', '..', '..')
const file = (skill: string, name: string) => {
  const path = `skills/${skill}/assets/workflows/${name}.workflow.json`
  return { path, text: readFileSync(join(REPO, path), 'utf8') }
}
const defaults = resolveWorkflows([file('epic-delivery', 'epic-delivery'), file('technical-writing', 'documentation')], [])

let n = 0
const id = () => `d${++n}`
const change = (done: number, total: number, name = 'lean-delivery'): Change =>
  ({ id: name, appetite: 'LARGE', done, total, groups: [], planMtime: 0, hasDesign: true, hasTasks: true })
function run(...signals: Signal[]): NavState {
  return signals.reduce(reduce, reduce(EMPTY, { kind: 'Started', id: id(), sessionId: 's', band: 'folded', statusLine: true, interactive: true }))
}
const workflows = (): Signal => ({ kind: 'WorkflowsRead', id: id(), workflows: defaults.workflows, errors: [], mode: 'loose', at: 1 })
const read = (c: Change | null, at = 2, openChanges = c ? 1 : 0): Signal => ({ kind: 'ChangeRead', id: id(), change: c, openChanges, at })
const skill = (name: string, at: number): Signal => ({ kind: 'SkillLoaded', id: id(), name, at })
const cmd = (command: string, at: number, ok = true): Signal => ({ kind: 'ToolRan', id: id(), command, ok, at })
const write = (path: string, at: number): Signal => ({ kind: 'FileTouched', id: id(), path, at })
const where = (s: NavState) => [s.workflow, s.variant, s.phase]
const keys = (s: NavState) => s.warnings.map(w => w.key)
const owed = (c = 'lean-delivery') => `openspec/changes/${c}/evidence/docs-owed.md`
const cold = (c = 'lean-delivery') => `openspec/changes/${c}/evidence/cold-read.md`
const docs = (...more: Signal[]) => run(workflows(), read(null), skill('technical-writing', 3), ...more)

test('the documentation workflow resolves with no errors', () => assert.deepEqual(defaults.errors, []))

// ---- out of order
test('cold-read.md written during inventory does not skip the phases', () => {
  const s = docs(write(cold(), 4))
  assert.equal(s.phase, 'inventory')
})

test('cold-read.md written before docs-owed: after docs-owed the band is not stuck behind the earlier write', () => {
  const s = docs(write(cold(), 4), write(owed(), 5))
  assert.equal(s.phase, 'write')
})

test('gh pr create during inventory does not jump to publish', () => {
  const s = docs(cmd('gh pr create', 4))
  assert.equal(s.phase, 'inventory')
})

test('a failed make build-docs in verify does not move to cold-read', () => {
  const s = docs(write(owed(), 4), cmd('make build-docs', 5, false))
  assert.equal(s.phase, 'write')
})

// ---- accepted quirks (D-6)
test('D-6: on demand without a change, only the two command gates move the band (a docs-owed write must not)', () => {
  const s = docs(write(owed(), 4))
  assert.deepEqual(where(s), ['documentation', null, 'inventory'])
})

test('accepted: on demand without a change, make build-docs then gh pr create move the band', () => {
  const s = docs(cmd('make build-docs', 4))
  assert.equal(s.phase, 'cold-read')
  assert.equal(reduce(s, cmd('gh pr create', 5)).gates.published?.state, 'ok')
})

test('accepted: make build-docs during inventory jumps to cold-read past write', () => {
  const s = docs(cmd('make build-docs', 4))
  assert.equal(s.phase, 'cold-read')
})

test('accepted: a file write after make build-docs marks docs-gate stale', () => {
  const s = docs(write(owed(), 4), cmd('make build-docs', 5), write('docs/x.adoc', 6))
  assert.equal(s.gates['docs-gate']?.state, 'stale')
})

// ---- command match
test('make build-docs-old does not pass docs-gate', () => {
  assert.equal(docs(cmd('make build-docs-old', 4)).phase, 'inventory')
})

test('make build-docs inside a quoted string is not a run (echo "make build-docs")', () => {
  assert.equal(docs(cmd('echo "make build-docs"', 4)).phase, 'inventory')
})

test('gh pr create-draft style lookalike does not pass published', () => {
  const s = docs(write(owed(), 4), cmd('make build-docs', 5), write(cold(), 6), cmd('gh pr create-x', 7))
  assert.notEqual(s.gates.published?.state, 'ok')
})

// ---- multiple changes
test('docs-owed in a different change folder still counts (glob is change-agnostic); pinned', () => {
  const s = run(workflows(), read(change(9, 9), 2), skill('technical-writing', 3), write(owed('other-change'), 4))
  assert.equal(s.phase, 'write')
})

test('two open changes: docs-owed of the open change moves inventory to write', () => {
  const s = run(workflows(), read(change(9, 9), 2, 2), skill('technical-writing', 3), write(owed(), 4))
  assert.equal(s.phase, 'write')
})

// ---- reload, allow, D-19
test('re-loading technical-writing mid-workflow does not restart the phase', () => {
  const s = docs(write(owed(), 4), skill('technical-writing', 5))
  assert.equal(s.phase, 'write')
})

test('architecture loaded during write raises no warning', () => {
  const s = docs(write(owed(), 4), skill('architecture', 5))
  assert.deepEqual(keys(s), [])
})

test('architecture loaded during inventory warns (allow is only for write); pinned, not in D-6', () => {
  const s = docs(skill('architecture', 4))
  assert.deepEqual(keys(s), ['process:elsewhere:inventory:architecture'])
})

test('D-19 both directions repeated: docs, delivery, docs, delivery', () => {
  let s = run(workflows(), read(change(3, 9)), skill('epic-delivery', 3))
  for (let i = 0; i < 3; i++) {
    s = reduce(s, skill('technical-writing', 10 + i * 2))
    assert.equal(s.workflow, 'documentation', `round ${i} to docs`)
    s = reduce(s, skill(i % 2 ? 'openspec-apply-change' : 'epic-delivery', 11 + i * 2))
    assert.equal(s.workflow, 'epic-delivery', `round ${i} back`)
  }
})

test('returning to documentation after epic-delivery restarts at inventory', () => {
  let s = run(workflows(), read(change(9, 9)), skill('technical-writing', 3), write(owed(), 4))
  assert.equal(s.phase, 'write')
  s = reduce(reduce(s, skill('epic-delivery', 5)), skill('technical-writing', 6))
  assert.equal(s.workflow, 'documentation')
})

test('openspec-archive-change while documentation is active does not raise a process warning in documentation', () => {
  const s = docs(write(owed(), 4), skill('openspec-archive-change', 5))
  assert.ok(!keys(s).some(k => k.startsWith('process:') && k.includes('documentation')), keys(s).join())
})
