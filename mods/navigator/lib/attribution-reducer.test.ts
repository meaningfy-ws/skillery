// D-4 in the reducer: a skill load is credited by what is in flight; only the lead's load moves the lead.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { EMPTY, reduce, type Change, type NavState, type Signal } from './state.ts'
import { resolveWorkflows } from './workflow.ts'

const REPO = join(import.meta.dirname, '..', '..', '..')
const file = (skill: string, name: string) => {
  const path = `skills/${skill}/assets/workflows/${name}.workflow.json`
  return { path, text: readFileSync(join(REPO, path), 'utf8') }
}
const defaults = resolveWorkflows([file('epic-delivery', 'epic-delivery'), file('technical-writing', 'documentation')], [])

let n = 0
const id = () => `x${++n}`
const change: Change = { id: 'navigator', appetite: 'VERY LARGE', done: 3, total: 9, groups: [], planMtime: 0, hasDesign: true,
  hasTasks: true, archived: false }
const run = (...signals: Signal[]): NavState => signals.reduce(reduce, reduce(EMPTY,
  { kind: 'Started', id: id(), sessionId: 's', band: 'folded', statusLine: true, interactive: true }))
const base = () => run(
  { kind: 'WorkflowsRead', id: id(), workflows: defaults.workflows, errors: [], mode: 'loose', at: 1 },
  { kind: 'ChangeRead', id: id(), change, openChanges: 1, at: 2 })

const loaded = (name: string, at: number): Signal => ({ kind: 'SkillLoaded', id: id(), name, at })
const callStart = (toolUseId: string, name: string, agentId: string | null, at: number): Signal =>
  ({ kind: 'SkillCallStarted', id: `skillcall:${toolUseId}`, toolUseId, name, agentId, at })
const callEnd = (toolUseId: string): Signal => ({ kind: 'SkillCallEnded', id: `skillend:${toolUseId}`, toolUseId })
const spawned = (agentId: string, at: number): Signal =>
  ({ kind: 'SubagentSpawned', id: `spawn:${agentId}`, agentId, type: 'implementer', model: 'm', description: '', at })
const pending = (toolUseId: string, at: number): Signal => ({ kind: 'SpawnStarted', id: `pend:${toolUseId}`, toolUseId, type: 'implementer', at })
const resolved = (toolUseId: string, agentId: string | null): Signal =>
  ({ kind: 'SpawnResolved', id: `resolved:${toolUseId}`, toolUseId, agentId })

/** What a subagent's load must leave alone. */
const lead = (s: NavState) => ({ skills: s.skills, workflow: s.workflow, phase: s.phase, gates: s.gates, turnEvents: s.turnEvents,
  warnings: s.warnings })
const skillsOf = (s: NavState, agentId: string) => s.subagents.find(a => a.agentId === agentId)?.skills

const leadAfter = (...more: Signal[]) => more.reduce(reduce, base())

test('control: a lead load of a gate skill passes its gate, enters the trail and the turn events', () => {
  const s = leadAfter(loaded('clarity-gate', 3))
  assert.equal(s.gates['clarity']?.state, 'ok')
  assert.deepEqual(s.skills.map(k => k.name), ['clarity-gate'])
  assert.deepEqual(s.turnEvents, [{ kind: 'skill', name: 'clarity-gate' }])
})

test('TC-14: a person\'s /name, nothing in flight, activates as today', () => {
  const s = leadAfter(loaded('clarity-gate', 3))
  assert.deepEqual(s.skills.map(k => k.name), ['clarity-gate'])
})

test('TC-14: a lead Skill call in flight credits the lead', () => {
  const s = leadAfter(callStart('c1', 'clarity-gate', null, 3), loaded('clarity-gate', 4), callEnd('c1'))
  assert.deepEqual(s.skills.map(k => k.name), ['clarity-gate'])
  assert.equal(s.gates['clarity']?.state, 'ok')
  assert.deepEqual(s.skillCalls, [])
})

test('TC-14: a second skill.prompt during one lead call does not count twice', () => {
  const s = leadAfter(callStart('c1', 'clarity-gate', null, 3), loaded('clarity-gate', 4), loaded('clarity-gate', 5))
  assert.equal(s.skills.length, 1)
  assert.equal(s.turnEvents.length, 1)
})

test('TC-14: a subagent Skill call in flight credits that subagent only', () => {
  const before = leadAfter(spawned('a1', 3))
  const s = [callStart('c1', 'clarity-gate', 'a1', 4), loaded('clarity-gate', 5), callEnd('c1')].reduce(reduce, before)
  assert.deepEqual(skillsOf(s, 'a1'), ['clarity-gate'])
  assert.deepEqual(lead(s), lead(before))
  assert.notEqual(s.gates['clarity']?.state, 'ok')
})

test('TC-14: a skill pending on a spawn goes to the subagent when the spawn resolves', () => {
  const before = leadAfter()
  let s = [pending('t1', 3), loaded('clarity-gate', 4)].reduce(reduce, before)
  assert.deepEqual(lead(s), lead(before))
  s = [spawned('a1', 5), resolved('t1', 'a1')].reduce(reduce, s)
  assert.deepEqual(skillsOf(s, 'a1'), ['clarity-gate'])
  assert.deepEqual(s.pendingSpawns, [])
  assert.deepEqual(lead(s), lead(before))
})

test('a spawn that resolves with no agent (denied) drops its pending entry and its skills', () => {
  const s = [pending('t1', 3), loaded('clarity-gate', 4), resolved('t1', null)].reduce(reduce, leadAfter())
  assert.deepEqual(s.pendingSpawns, [])
  assert.deepEqual(s.skills, [])
})

test('TC-14b: a just-started subagent with no tool call yet gets a preload; the lead is untouched', () => {
  const before = leadAfter(spawned('a1', 3))
  const s = [loaded('technical-writing', 4), loaded('clarity-gate', 4)].reduce(reduce, before)
  assert.deepEqual(skillsOf(s, 'a1'), ['technical-writing', 'clarity-gate'])
  assert.deepEqual(lead(s), lead(before))
})

test('D-19: two spawns interleave: the first subagent\'s preloads go to it, not to the second spawn still pending', () => {
  const before = leadAfter()
  const s = [pending('tA', 3), pending('tB', 3), spawned('a1', 4), resolved('tA', 'a1'),
    loaded('technical-writing', 5), loaded('clarity-gate', 5)].reduce(reduce, before)
  assert.deepEqual(skillsOf(s, 'a1'), ['technical-writing', 'clarity-gate'])
  assert.deepEqual(s.pendingSpawns.map(p => [p.toolUseId, p.skills ?? []]), [['tB', []]])
  assert.deepEqual(lead(s), lead(before))
})

test('after its first tool call a subagent is not a preload target: the load is the lead\'s', () => {
  const s = leadAfter(spawned('a1', 3), { kind: 'AgentCalled', id: id(), agentId: 'a1' }, loaded('clarity-gate', 4))
  assert.deepEqual(s.skills.map(k => k.name), ['clarity-gate'])
  assert.deepEqual(skillsOf(s, 'a1'), [])
})

test('TC-14c: two subagents load one skill at once, each credited, the lead never', () => {
  const before = leadAfter(spawned('a1', 3), spawned('a2', 3), { kind: 'AgentCalled', id: id(), agentId: 'a1' },
    { kind: 'AgentCalled', id: id(), agentId: 'a2' })
  const s = [callStart('c1', 'clarity-gate', 'a1', 4), callStart('c2', 'clarity-gate', 'a2', 5),
    loaded('clarity-gate', 6), loaded('clarity-gate', 7), callEnd('c1'), callEnd('c2')].reduce(reduce, before)
  assert.deepEqual(skillsOf(s, 'a1'), ['clarity-gate'])
  assert.deepEqual(skillsOf(s, 'a2'), ['clarity-gate'])
  assert.deepEqual(lead(s), lead(before))
})

test('a background subagent\'s later load does not add lead turn events', () => {
  const before = leadAfter(spawned('a1', 3))
  const s = [callStart('c1', 'clarity-gate', 'a1', 4), loaded('clarity-gate', 5)].reduce(reduce, before)
  assert.deepEqual(s.turnEvents, before.turnEvents)
})
