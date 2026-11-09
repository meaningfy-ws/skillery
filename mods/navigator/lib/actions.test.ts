import { test } from 'node:test'
import assert from 'node:assert/strict'
import { commandFor, hygieneAction, modeAction, reconcile, review } from './actions.ts'
import { EMPTY, type NavState } from './state.ts'

const change = { id: 'navigator', appetite: 'VERY LARGE', done: 3, total: 9, groups: [], planMtime: 0, hasDesign: true, hasTasks: true }
const drift = { key: 'plan:outside:tools/x.py', message: 'm', remedy: 'openspec-update-change navigator', owner: 'epic-planning' }

test('TC-15 Reconcile EPIC: the change update, then the clarity gate, both resolved as typed', () => {
  const s: NavState = { ...EMPTY, change, warnings: [drift] }
  assert.deepEqual(reconcile(s), ['openspec-update-change navigator', 'clarity-gate navigator'])
  const installed = ['openspec-update-change', 'meaningfy-building:clarity-gate']
  assert.deepEqual(reconcile(s)!.map(l => commandFor(l, installed)), [
    { command: 'openspec-update-change', args: 'navigator' }, { command: 'meaningfy-building:clarity-gate', args: 'navigator' }])
  assert.equal(reconcile({ ...s, accepted: [drift.key] }), null)
  assert.equal(reconcile({ ...s, warnings: [] }), null)
})

test('TC-15 a command that is not installed says so and resolves nothing', () => {
  assert.deepEqual(commandFor('meaningfy-code-review navigator', ['navigator']),
    { reason: 'navigator: meaningfy-code-review is not installed' })
})

test('Review needs a phase that expects or allows the code review', () => {
  assert.equal(review({ ...EMPTY, change }), null)
})

test('Compact now carries what to keep; Fresh session is clear; nothing when not offered', () => {
  const s: NavState = { ...EMPTY, change, phase: 'apply', offer: 'compact' }
  assert.deepEqual(hygieneAction(s), { label: 'Compact now',
    line: 'compact keep: change navigator, phase apply, open warnings, decisions are in design.md' })
  assert.deepEqual(hygieneAction({ ...s, offer: 'fresh' }), { label: 'Fresh session', line: 'clear' })
  assert.equal(hygieneAction({ ...s, offer: null }), null)
})

test('Mode switches the session both ways (DD-35)', () => {
  assert.equal(modeAction(EMPTY), 'navigator mode strict')
  assert.equal(modeAction({ ...EMPTY, mode: { repo: 'strict', session: null } }), 'navigator mode loose')
  assert.equal(modeAction({ ...EMPTY, mode: { repo: 'strict', session: 'loose' } }), 'navigator mode strict')
})
