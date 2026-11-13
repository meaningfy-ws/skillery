import { test } from 'node:test'
import assert from 'node:assert/strict'
import { prSignal, type PrOutcome } from './pr.ts'

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
