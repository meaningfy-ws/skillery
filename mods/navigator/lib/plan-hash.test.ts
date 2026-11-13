import test from 'node:test'
import assert from 'node:assert/strict'

import { planHash } from './plan-hash.ts'
import { gatesAfterSkill } from './process-drift.ts'
import { reduce, EMPTY, type Change, type NavState, type Workflow } from './state.ts'

const DESIGN = '# Design\n\n## Algorithm\nstep one\n\n## Delivery decisions\n- D-1 first\n\n## Notes\nnotes\n'

test('planHash: a decision added under Delivery decisions does not change it', () => {
  const more = DESIGN.replace('- D-1 first\n', '- D-1 first\n- D-2 second\n')
  assert.equal(planHash(more), planHash(DESIGN))
})

test('planHash: an edit elsewhere changes it', () => {
  assert.notEqual(planHash(DESIGN.replace('step one', 'step two')), planHash(DESIGN))
  assert.notEqual(planHash(DESIGN.replace('notes\n', 'other notes\n')), planHash(DESIGN))
})

test('planHash: the section at the end of the file is stripped too', () => {
  const tail = '# D\n\n## A\nx\n\n## Delivery decisions\n- D-1\n'
  assert.equal(planHash(`${tail}- D-2\n`), planHash(tail))
})

test('planHash: identical text, identical hash; no design gives the empty hash', () => {
  assert.equal(planHash(DESIGN), planHash(DESIGN))
  assert.equal(planHash(null), '')
})

// ---- the reducer: a skill gate goes stale only when the hash changes between reads of the same change
const WF: Workflow = {
  name: 'w', activate: { openChange: true }, phases: [{ id: 'plan', owner: 'lead', expect: [], enter: {} }], gates: { clarity: { kind: 'skill', skill: 'clarity-gate' } },
} as unknown as Workflow
const change = (id: string, hash: string): Change =>
  ({ id, appetite: null, done: 0, total: 0, groups: [], planHash: hash, hasDesign: true, hasTasks: true, archived: false })
let n = 0 // a signal id is applied once
const read = (s: NavState, c: Change): NavState => reduce(s, { kind: 'ChangeRead', id: `c${n++}`, change: c, openChanges: 1, at: 100 })
const clarity = (s: NavState) => s.gates.clarity?.state

function passed(hash: string): NavState {
  const s0 = { ...EMPTY, workflows: [WF], workflow: 'w' } as NavState
  const s1 = read(s0, change('x', hash))
  return { ...s1, gates: gatesAfterSkill(s1.gates, WF, 'clarity-gate', 200) }
}

test('ChangeRead: a re-read with the same hash keeps the clarity gate ok', () => {
  const s = passed('h1')
  assert.equal(clarity(s), 'ok')
  assert.equal(clarity(read(s, change('x', 'h1'))), 'ok')
})

test('ChangeRead: a different hash for the same change stales the clarity gate', () => {
  assert.equal(clarity(read(passed('h1'), change('x', 'h2'))), 'stale')
})

test('ChangeRead: a hand-off to another change clears the gates, it does not stale them', () => {
  assert.notEqual(clarity(read(passed('h1'), change('y', 'h2'))), 'stale')
})
