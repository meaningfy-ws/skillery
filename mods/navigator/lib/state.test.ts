import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EMPTY, reduce, revive } from './state.ts'

const started = (id = 's1', statusLine = true) =>
  reduce(EMPTY, { kind: 'Started', id, sessionId: id, band: 'folded', statusLine })

test('TC-03 a subagent is listed while it runs, then done with its tokens', () => {
  let s = reduce(started(), { kind: 'SubagentSpawned', id: 'tu1', agentId: 'a1', type: 'implementer', model: 'opus', description: 'task 1.6', at: 1 })
  assert.deepEqual(s.subagents.map(a => [a.type, a.model, a.done]), [['implementer', 'opus', false]])
  s = reduce(s, { kind: 'SubagentFinished', id: 'f1', agentId: 'a1', tokens: 1200 })
  s = reduce(s, { kind: 'SubagentFinished', id: 'f2', agentId: 'a1', tokens: 300 })
  assert.deepEqual(s.subagents.map(a => [a.done, a.tokens]), [[true, 1500]])
})

test('TC-11 the line setting holds for a new session; the toggle only for this one', () => {
  let s = started('s1', false)
  assert.equal(s.display.line, false)
  s = reduce(s, { kind: 'ToggleLine', id: 't1' })
  assert.equal(s.display.line, true)
  s = reduce(s, { kind: 'Started', id: 's2', sessionId: 's2', band: 'folded', statusLine: false })
  assert.equal(s.display.line, false)
})

test('TC-17 the same signal id twice leaves the state unchanged', () => {
  const once = reduce(started(), { kind: 'SkillLoaded', id: 'k1', name: 'clarity-gate', at: 1 })
  assert.equal(reduce(once, { kind: 'SkillLoaded', id: 'k1', name: 'clarity-gate', at: 1 }), once)
})

test('the band cycles folded, unfolded, hidden', () => {
  let s = started()
  const seen = []
  for (const id of ['b1', 'b2', 'b3']) { s = reduce(s, { kind: 'ToggleBand', id }); seen.push(s.display.band) }
  assert.deepEqual(seen, ['unfolded', 'hidden', 'folded'])
})

test('a stored state of an older shape gets the new fields', () => {
  const s = revive({ version: 1, sessionId: 'x' })
  assert.equal(s.sessionId, 'x')
  assert.deepEqual(s.subagents, [])
  assert.equal(revive(undefined), EMPTY)
})

test('a band button sets the band directly; a hidden band can be shown again', () => {
  let s = reduce(started(), { kind: 'SetBand', id: 'p1', band: 'hidden' })
  assert.equal(s.display.band, 'hidden')
  s = reduce(s, { kind: 'SetBand', id: 'p2', band: 'folded' })
  assert.equal(s.display.band, 'folded')
})
