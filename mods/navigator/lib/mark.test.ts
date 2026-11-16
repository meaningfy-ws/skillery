// Task 3.3 of delivery-retrospective (D-9): the warning of a worker spawned in a session with no mark line.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { isMarkLine, hasMark, MISSING_MARK } from './mark.ts'
import { isOpen } from './process-drift.ts'
import { EMPTY, reduce, revive, type Change, type NavState, type Signal } from './state.ts'
import { decideSpawn } from './strict.ts'
import { resolveWorkflows } from './workflow.ts'

const REPO = join(import.meta.dirname, '..', '..', '..')
const FIXTURE = join(REPO, 'tests', 'fixtures', 'session-retrospective', 'mark-lines.json')
const WORKFLOW = 'skills/epic-delivery/assets/workflows/epic-delivery.workflow.json'
const { workflows } = resolveWorkflows([{ path: WORKFLOW, text: readFileSync(join(REPO, WORKFLOW), 'utf8') }], [])
const MARK = 'mark: change=x phase=deliver stage=2'
const KEY = 'mark:missing'

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
const marks = (s: NavState) => s.warnings.filter(w => w.key === KEY)

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

test('the warning carries the exported message, the owning skill and no remedy', () => {
  assert.deepEqual(marks(run(read, spawn('implementer'), end())),
    [{ key: KEY, message: MISSING_MARK, remedy: null, owner: 'epic-delivery' }])
})

test('strict mode: a held mark:missing warning never blocks a spawn', () => {
  const s = run(read, { kind: 'WorkflowsRead', id: id(), workflows, errors: [], mode: 'strict', at: 1 },
    spawn('implementer'), end())
  const [w] = marks(s)
  assert.ok(w)
  assert.equal(isOpen(s, w), false) // not drift, so no commit or archive gate holds it either
  assert.deepEqual(decideSpawn(s, null, null), { allow: true })
})

test('a state stored before the fields existed revives with them false', () => {
  const s = revive({ sessionId: 's' })
  assert.deepEqual([s.marked, s.markWarned, s.workerThisTurn], [false, false, false])
})

test('the shared fixture: every line is a mark or not, as expected', () => {
  const rows: { line: string; mark: boolean }[] = JSON.parse(readFileSync(FIXTURE, 'utf8'))
  for (const r of rows) assert.equal(isMarkLine(r.line), r.mark, JSON.stringify(r.line))
  assert.equal(hasMark('text\n```\nmark: change=x phase=deliver stage=1\n```'), false) // inside a fence
})

test('a tilde fence hides a mark, and a backtick line inside it does not close it', () => {
  const m = 'mark: change=x phase=deliver stage=1'
  assert.equal(hasMark(`~~~\n${m}\n~~~`), false)
  assert.equal(hasMark(`~~~\n\`\`\`\n${m}\n\`\`\`\n~~~`), false)
  assert.equal(hasMark(`~~~\nx\n~~~\n${m}`), true)
})
