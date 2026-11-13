import { test } from 'node:test'
import assert from 'node:assert/strict'
import { prSignal, shouldAskGh, type PrOutcome } from './pr.ts'
import { EMPTY, type Change, type NavState } from './state.ts'

const change = (done: number, total: number): Change =>
  ({ id: 'x', appetite: 'MEDIUM', done, total, groups: [], planMtime: 0, hasDesign: true, hasTasks: true, archived: false })
const asking = (c: Change | null, mergedBranches: string[] = [], root: NavState['root'] = { path: '/r', common: '/r/.git', branch: 'b' }) =>
  shouldAskGh({ ...EMPTY, root, change: c, mergedBranches })

test('D-25 gh is asked only with every task ticked and the branch not yet seen merged', () => {
  assert.equal(asking(change(5, 5)), true)
  assert.equal(asking(change(3, 5)), false)
  assert.equal(asking(change(0, 0)), false)
  assert.equal(asking(null), false)
  assert.equal(asking(change(5, 5), ['b']), false)
  assert.equal(asking(change(5, 5), [], null), false)
})

const BRANCH = 'feature/tenant-dump-restore'
const view = (state: string, headRefName = BRANCH): PrOutcome =>
  ({ exitCode: 0, stdout: JSON.stringify({ state, headRefName }) })

test('a merged pull request of the followed branch is sent', () => {
  assert.deepEqual(prSignal(BRANCH, view('MERGED')), { kind: 'PrMerged', branch: BRANCH })
})

test('an open pull request sends nothing', () => {
  assert.equal(prSignal(BRANCH, view('OPEN')), null)
})

test('another branch\'s merged pull request sends nothing', () => {
  assert.equal(prSignal(BRANCH, view('MERGED', 'feature/other')), null)
})

test('a non-zero exit sends nothing', () => {
  assert.equal(prSignal(BRANCH, { exitCode: 1, stdout: JSON.stringify({ state: 'MERGED', headRefName: BRANCH }) }), null)
})

test('bad JSON sends nothing', () => {
  assert.equal(prSignal(BRANCH, { exitCode: 0, stdout: 'not json' }), null)
  assert.equal(prSignal(BRANCH, { exitCode: 0, stdout: 'null' }), null)
})

test('a timeout or failure to run sends nothing', () => {
  assert.equal(prSignal(BRANCH, null), null)
})
