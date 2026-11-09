import { test } from 'node:test'
import assert from 'node:assert/strict'
import { appetiteOf, progress, readChange, type ChangeFiles } from './change.ts'

const APPETITES = ['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'VERY LARGE', 'HUGE']

const file = (id: string, mtime: number, tasks: string | null = null): ChangeFiles =>
  ({ id, proposal: '## Appetite\n\nVERY LARGE — three stages.\n\n## Problem\nSMALL bits\n', tasks, mtime, planMtime: 0 })

test('appetite: the longest name in the first paragraph under ## Appetite', () => {
  assert.equal(appetiteOf(file('x', 0).proposal, APPETITES), 'VERY LARGE')
  assert.equal(appetiteOf('## Appetite\n\nSome size.\n\nSMALL later', APPETITES), null)
  assert.equal(appetiteOf('no section', APPETITES), null)
  assert.equal(appetiteOf(file('x', 0).proposal, []), null)
})

test('progress counts boxes per group, not the roadmap', () => {
  const tasks = '## 1. One\n- [x] 1.1 a\n- [ ] 1.2 b\n## 2. Two\n- [x] 2.1 c\n## Roadmap\n- [ ] 1.1 · [ ] 1.2\n## Verification\ntext\n'
  assert.deepEqual(progress(tasks), {
    done: 2, total: 3,
    groups: [{ title: '1. One', done: 1, total: 2 }, { title: '2. Two', done: 1, total: 1 }],
  })
})

test('TC-18 three open changes, the branch names one: that one, +2', () => {
  const r = readChange([file('alpha', 3), file('navigator', 1), file('beta', 2)], 'feature/navigator-1', APPETITES)
  assert.equal(r.change?.id, 'navigator')
  assert.equal(r.openChanges, 3)
})

test('no branch match: the most recently modified', () => {
  assert.equal(readChange([file('alpha', 3), file('beta', 5)], 'develop', APPETITES).change?.id, 'beta')
})

test('TC-02 (change) no open change', () => {
  assert.deepEqual(readChange([], 'develop', APPETITES), { change: null, openChanges: 0 })
})
