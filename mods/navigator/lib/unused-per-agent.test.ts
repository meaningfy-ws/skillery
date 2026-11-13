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
