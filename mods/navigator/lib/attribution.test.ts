import { test } from 'node:test'
import assert from 'node:assert/strict'
import { creditSkill } from './attribution.ts'
import type { PendingSpawn, SkillCall, Subagent } from '../types.d.ts'

type Facts = Parameters<typeof creditSkill>[0]

const call = (toolUseId: string, name: string, agentId: string | null, at: number): SkillCall => ({ toolUseId, name, agentId, at, loaded: false })
const spawn = (toolUseId: string, at: number): PendingSpawn => ({ toolUseId, type: 'implementer', at, skills: [] })
const sub = (agentId: string, startedAt: number, over: Partial<Subagent> = {}): Subagent =>
  ({ agentId, toolUseId: `t-${agentId}`, type: 'implementer', model: 'm', description: '', startedAt, tokens: 0, done: false, rootPath: null, skills: [], ...over }) as Subagent
const facts = (over: Partial<Facts> = {}): Facts => ({ skillCalls: [], pendingSpawns: [], subagents: [], agentCalls: {}, ...over })

test('TC-14: a lead call in flight credits the lead and names the call', () => {
  assert.deepEqual(creditSkill(facts({ skillCalls: [call('c1', 'tdd', null, 1)] }), 'tdd'), { agent: null, via: 'call', toolUseId: 'c1' })
})

test('TC-14: a pending spawn is credited as a preload and names the spawn', () => {
  assert.deepEqual(creditSkill(facts({ pendingSpawns: [spawn('s1', 1), spawn('s2', 2)] }), 'tdd'), { agent: null, via: 'spawn', toolUseId: 's2' })
})

test('TC-14: nothing in flight credits the lead (a typed /name)', () => {
  assert.deepEqual(creditSkill(facts(), 'tdd'), { agent: null, via: 'lead' })
})

test('a call for another skill is ignored', () => {
  assert.deepEqual(creditSkill(facts({ skillCalls: [call('c1', 'other', 'a1', 1)] }), 'tdd'), { agent: null, via: 'lead' })
})

test('TC-14b: a just-started subagent is credited as a preload', () => {
  const s = facts({ subagents: [sub('a1', 1), sub('a2', 5)] })
  assert.deepEqual(creditSkill(s, 'tdd'), { agent: 'a2', via: 'preload' })
})

test('a subagent with a tool call already is not just started', () => {
  assert.deepEqual(creditSkill(facts({ subagents: [sub('a1', 1)], agentCalls: { a1: 1 } }), 'tdd'), { agent: null, via: 'lead' })
})

test('a finished subagent is never credited', () => {
  assert.deepEqual(creditSkill(facts({ subagents: [sub('a1', 1, { done: true })] }), 'tdd'), { agent: null, via: 'lead' })
})

test('a just-started subagent wins over a pending spawn (D-19)', () => {
  assert.deepEqual(creditSkill(facts({ pendingSpawns: [spawn('s1', 9)], subagents: [sub('a1', 1)] }), 'tdd'), { agent: 'a1', via: 'preload' })
})

test('an in-flight call wins over a pending spawn', () => {
  const s = facts({ skillCalls: [call('c1', 'tdd', 'a1', 1)], pendingSpawns: [spawn('s1', 2)] })
  assert.deepEqual(creditSkill(s, 'tdd'), { agent: 'a1', via: 'call', toolUseId: 'c1' })
})

test('TC-14c: two subagents load one skill at once, oldest first, never the lead', () => {
  const both = [call('c1', 'tdd', 'a1', 1), call('c2', 'tdd', 'a2', 2)]
  const first = creditSkill(facts({ skillCalls: both }), 'tdd')
  assert.deepEqual(first, { agent: 'a1', via: 'call', toolUseId: 'c1' })
  const second = creditSkill(facts({ skillCalls: both.filter(c => c.toolUseId !== first.toolUseId) }), 'tdd')
  assert.deepEqual(second, { agent: 'a2', via: 'call', toolUseId: 'c2' })
})
