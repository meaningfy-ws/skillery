// D-9 (3.2): a skill's use is counted per agent; the lead is judged at the main turn's end, a subagent at its finish.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EMPTY, reduce, type NavState, type Signal } from './state.ts'

let n = 0
const id = () => `u${++n}`
const run = (...signals: Signal[]): NavState => signals.reduce(reduce, { ...EMPTY })
const load = (name: string): Signal => ({ kind: 'SkillLoaded', id: id(), name, at: 1 })
const used = (agentId?: string): Signal => ({ kind: 'ToolUsed', id: id(), ...(agentId ? { agentId } : {}) })
const spawned = (agentId: string): Signal =>
  ({ kind: 'SubagentSpawned', id: id(), agentId, type: 'implementer', model: 'm', description: '', at: 1 })
const turnEnd = (): Signal => ({ kind: 'TurnEnded', id: id(), turnId: id(), contextPercent: 10, cleanTree: true, at: 9 })
const finished = (agentId: string): Signal => ({ kind: 'SubagentFinished', id: id(), agentId, tokens: 1 })
const unused = (s: NavState) => s.warnings.map(w => w.key).filter(k => k.startsWith('hygiene:unused:'))

test('two loads then a Read: neither is unused', () => {
  assert.deepEqual(unused(run(load('cosmic-python'), load('tdd'), used(), turnEnd())), [])
})

test('a load, another Skill call, then nothing: the first is unused, keyed by agent', () => {
  assert.deepEqual(unused(run(load('cosmic-python'), load('tdd'), turnEnd())), ['hygiene:unused:main:cosmic-python'])
})

test('a spawn after a load is use', () => {
  const spawn: Signal = { kind: 'SpawnAsked', id: id(), type: 'implementer', description: '' }
  assert.deepEqual(unused(run(load('a'), load('b'), spawn, turnEnd())), [])
})

test('the lead\'s main turn end clears the lead\'s events, so the next turn starts fresh', () => {
  const s = run(load('a'), used(), turnEnd(), load('b'), turnEnd())
  assert.deepEqual(unused(s), [])
  assert.deepEqual(s.turnEvents, [])
})

test('a subagent\'s skill is judged at its finish, not at the main turn end', () => {
  const s = run(spawned('a1'), load('x'), load('y'))
  assert.deepEqual(unused(s), [])
  assert.deepEqual(unused(reduce(s, finished('a1'))), ['hygiene:unused:a1:x'])
})

test('a subagent that used its skills is not reported; its events are cleared at its finish', () => {
  const s = run(spawned('a1'), load('x'), load('y'), used('a1'), finished('a1'))
  assert.deepEqual(unused(s), [])
  assert.deepEqual(s.turnEvents, [])
})

test('the lead\'s tool call is not a subagent\'s use', () => {
  assert.deepEqual(unused(run(spawned('a1'), load('x'), load('y'), used(), finished('a1'))), ['hygiene:unused:a1:x'])
})

test('a background subagent outliving the turn keeps its events until it finishes', () => {
  const s = run(spawned('a1'), load('x'), load('y'), turnEnd())
  assert.deepEqual(unused(s), [])
  assert.equal(s.turnEvents.filter(e => e.agent === 'a1').length, 2)
  assert.deepEqual(unused(reduce(s, finished('a1'))), ['hygiene:unused:a1:x'])
})

// ---------------------------------------------------------------- D-27.5
const ran = (): Signal => ({ kind: 'ToolRan', id: id(), command: 'ls', ok: true, at: 2 })

test('a Bash call is one tool event: ToolUsed counts, the ToolRan beside it adds none', () => {
  assert.deepEqual(run(used(), ran()).turnEvents, [{ kind: 'tool', agent: 'main' }])
  assert.deepEqual(run(ran()).turnEvents, [], 'ToolRan alone (a Validate run) is not the lead using its skills')
})

test('the lead\'s turn end drops the events of a subagent that is not running; a running one keeps its own', () => {
  const s = run(spawned('a1'), load('x'), load('y'), used('ghost'), used('a1'), used(), turnEnd())
  assert.deepEqual([...new Set(s.turnEvents.map(e => e.agent))], ['a1'])
  const done = run(spawned('a1'), load('x'), finished('a1'), used('a1'), turnEnd()) // an event after its finish: the agent is done
  assert.deepEqual(done.turnEvents, [])
})
