// Task 3.3 of delivery-retrospective (D-9): the warning of a worker spawned in a session with no mark line.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { isMarkLine, hasMark } from './mark.ts'
import { EMPTY, reduce, type Change, type NavState, type Signal } from './state.ts'

const FIXTURE = join(import.meta.dirname, '..', '..', '..', 'tests', 'fixtures', 'session-retrospective', 'mark-lines.json')
const MARK = 'mark: change=x phase=deliver stage=2'
const WARNING = 'No mark line in this session: write the mark line (epic-delivery)'

let n = 0
const id = () => `mk-${++n}`
const change: Change = { id: 'x', appetite: 'MEDIUM', done: 1, total: 4, groups: [], planHash: '', hasDesign: true, hasTasks: true, archived: false }
const run = (...signals: Signal[]): NavState =>
  signals.reduce(reduce, reduce(EMPTY, { kind: 'Started', id: id(), sessionId: 's', band: 'folded', statusLine: true, interactive: true }))
const read: Signal = { kind: 'ChangeRead', id: 'cr', change, openChanges: 1, at: 2 }
const readNone: Signal = { kind: 'ChangeRead', id: 'crn', change: null, openChanges: 0, at: 2 }
const spawn = (type: string, agentId?: string): Signal =>
  ({ kind: 'SpawnAsked', id: id(), type, description: 'd', ...(agentId ? { agentId } : {}) })
const answer = (text: string): Signal => ({ kind: 'AnswerShown', id: id(), text, at: 3 })
const end = (): Signal => ({ kind: 'TurnEnded', id: id(), turnId: id(), contextPercent: 10, cleanTree: true, at: 4 })
const marks = (s: NavState) => s.warnings.filter(w => w.message === WARNING)

test('a mark and an implementer spawn in one turn: no warning', () => {
  assert.equal(marks(run(read, spawn('implementer'), answer(`done\n${MARK}`), end())).length, 0)
})

test('an implementer spawn with no mark: one warning, the spawn is not denied', () => {
  const s = run(read, spawn('implementer'), answer('hello'), end())
  assert.equal(marks(s).length, 1)
  assert.equal(s.markWarned, true)
})

test('a hand-over first turn: the change is read at the turn end, before TurnEnded', () => {
  assert.equal(marks(run(spawn('code-reviewer'), answer('x'), read, end())).length, 1)
})

test('a second unmarked worker turn: no second warning', () => {
  const s = run(read, spawn('implementer'), end(), spawn('implementer'), end())
  assert.equal(marks(s).length, 1)
})

test('a mark in an earlier turn keeps later worker turns quiet', () => {
  assert.equal(marks(run(read, answer(MARK), end(), spawn('implementer'), end())).length, 0)
})

test('an Explore spawn or a nested spawn is not a worker', () => {
  assert.equal(marks(run(read, spawn('Explore'), end())).length, 0)
  assert.equal(marks(run(read, spawn('implementer', 'agent-1'), end())).length, 0)
})

test('a plugin-prefixed implementer is a worker', () => {
  assert.equal(marks(run(read, spawn('meaningfy-building:implementer'), end())).length, 1)
  assert.equal(marks(run(read, spawn('x:code-reviewer'), end())).length, 1)
  assert.equal(marks(run(read, spawn('not-implementer'), end())).length, 0)
})

test('no open change: no warning', () => {
  assert.equal(marks(run(readNone, spawn('implementer'), end())).length, 0)
})

test('a state stored before the fields existed revives with them false', () => {
  const s = run(read)
  assert.deepEqual([s.marked, s.markWarned, s.workerThisTurn], [false, false, false])
})

test('the shared fixture: every line is a mark or not, as expected', () => {
  const rows: { line: string; mark: boolean }[] = JSON.parse(readFileSync(FIXTURE, 'utf8'))
  for (const r of rows) assert.equal(isMarkLine(r.line), r.mark, JSON.stringify(r.line))
  assert.equal(hasMark('text\n```\nmark: change=x phase=deliver stage=1\n```'), false) // inside a fence
})
