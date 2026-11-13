import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EMPTY, reduce, revive, settingsFrom } from './state.ts'

const started = (id = 's1', statusLine = true) =>
  reduce(EMPTY, { kind: 'Started', id, sessionId: id, band: 'folded', statusLine, interactive: true })

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
  s = reduce(s, { kind: 'Started', id: 's2', sessionId: 's2', band: 'folded', statusLine: false, interactive: true })
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

// ---------------------------------------------------------------- adversarial (stage 1)
const skill = (n: number) => ({ kind: 'SkillLoaded' as const, id: `k${n}`, name: `s${n}`, at: n })

test('the seen list holds the last 200 ids', () => {
  let s = started()
  for (let i = 0; i < 250; i++) s = reduce(s, skill(i))
  assert.equal(s.seen.length, 200)
  assert.equal(s.seen.at(-1), 'k249')
  assert.equal(s.seen[0], 'k50')
  assert.equal(s.skills.length, 250)
})

test('a replay within the last 200 ids is ignored; one older than the cap is applied again', () => {
  let s = started()
  for (let i = 0; i < 250; i++) s = reduce(s, skill(i))
  assert.equal(reduce(s, skill(249)), s)
  assert.equal(reduce(s, skill(50)), s)
  const again = reduce(s, skill(49)) // evicted: at-least-once delivery beyond the cap duplicates (design §3: last 200)
  assert.equal(again.skills.length, 251)
  assert.equal(again.seen.length, 200)
})

test('a duplicate does not refresh its place in the seen list', () => {
  let s = started()
  for (let i = 0; i < 200; i++) s = reduce(s, skill(i))
  s = reduce(s, skill(0)) // replay: returns same state
  s = reduce(s, skill(200)) // evicts the oldest, k0 included
  assert.ok(!s.seen.includes('k0'))
})

test('SubagentFinished for an unknown agent is kept as a done placeholder until its spawn (DD-34)', () => {
  const s0 = reduce(started(), { kind: 'SubagentSpawned', id: 'tu1', agentId: 'a1', type: 't', model: 'm', description: '', at: 1 })
  const s1 = reduce(s0, { kind: 'SubagentFinished', id: 'f1', agentId: 'ghost', tokens: 10 })
  assert.deepEqual(s1.subagents.map(a => [a.agentId, a.done, a.tokens]), [['a1', false, 0], ['ghost', true, 10]])
  assert.ok(s1.seen.includes('f1'))
})

test('SubagentFinished arriving before its Spawned still marks the agent done', () => {
  let s = reduce(started(), { kind: 'SubagentFinished', id: 'f1', agentId: 'a1', tokens: 5 })
  s = reduce(s, { kind: 'SubagentSpawned', id: 'tu1', agentId: 'a1', type: 't', model: 'm', description: '', at: 1 })
  assert.equal(s.subagents[0]?.done, true)
})

test('Started clears everything and keeps only its own id as seen, even when replayed', () => {
  let s = started('s1')
  s = reduce(s, skill(1))
  s = reduce(s, { kind: 'ChangeRead', id: 'c1', change: { id: 'x', appetite: null, done: 1, total: 2, groups: [], planMtime: 0, hasDesign: true, hasTasks: true, archived: false }, openChanges: 2, at: 0 })
  s = reduce(s, { kind: 'SubagentSpawned', id: 'tu', agentId: 'a', type: 't', model: 'm', description: '', at: 1 })
  const again = reduce(s, { kind: 'Started', id: 's1', sessionId: 's1', band: 'unfolded', statusLine: false, interactive: true })
  assert.deepEqual(again, { ...EMPTY, sessionId: 's1', display: { band: 'unfolded', line: false }, seen: ['s1'] })
})

test('after Started a signal id seen in the previous session applies again', () => {
  let s = reduce(started('s1'), skill(1))
  s = reduce(s, { kind: 'Started', id: 's2', sessionId: 's2', band: 'folded', statusLine: true, interactive: true })
  assert.equal(reduce(s, skill(1)).skills.length, 1)
})

test('reduce does not mutate its input, even a frozen one, and never EMPTY', () => {
  const frozen = Object.freeze({ ...started(), skills: Object.freeze([]) as never, seen: Object.freeze(['s1']) as never })
  const next = reduce(frozen, skill(1))
  assert.equal((frozen.skills as unknown[]).length, 0)
  assert.equal(next.skills.length, 1)
  assert.deepEqual(EMPTY.skills, [])
  assert.deepEqual(EMPTY.seen, [])
})


test('a band value outside the cycle goes back to folded on toggle', () => {
  const s = { ...started(), display: { band: 'weird' as never, line: true } }
  assert.equal(reduce(s, { kind: 'ToggleBand', id: 'b' }).display.band, 'folded')
})

test('revive of non-objects and arrays gives a usable state', () => {
  for (const junk of [null, 'str', 42, true, [], undefined]) {
    const s = revive(junk)
    assert.equal(reduce(s, skill(1)).skills.length, 1)
  }
})

test('revive of a stored state with wrongly typed fields still reduces', () => {
  for (const bad of [{ seen: null }, { seen: 'abc' }, { skills: null }, { subagents: {} }, { display: null }]) {
    assert.doesNotThrow(() => reduce(revive(bad), { kind: 'ToggleBand', id: 'x' }), JSON.stringify(bad))
    assert.doesNotThrow(() => reduce(revive(bad), skill(1)), JSON.stringify(bad))
  }
})

test('revive keeps stored extra fields of a later version', () => {
  assert.equal((revive({ version: 2, future: 1 }) as Record<string, unknown>)['future'], 1)
})

test('settingsFrom: known values pass, anything else takes the default', () => {
  assert.deepEqual(settingsFrom({ band: 'hidden', statusLine: false }), { band: 'hidden', statusLine: false })
  assert.deepEqual(settingsFrom({ band: 'sideways', statusLine: 'no' }), { band: 'folded', statusLine: true })
  assert.deepEqual(settingsFrom({}), { band: 'folded', statusLine: true })
})


// ---------------------------------------------------------------- D-1: root, skill calls, per-agent entries
const root = (path: string, branch = 'b') => ({ path, common: '/r/.git', branch })
const spawned = (agentId: string) =>
  ({ kind: 'SubagentSpawned' as const, id: `tu-${agentId}`, agentId, type: 'implementer', model: 'opus', description: 'd', at: 1 })

test('D-1 a new atom has no root, no last change, nothing merged, no calls in flight', () => {
  assert.deepEqual([EMPTY.root, EMPTY.lastChangeId, EMPTY.mergedBranches, EMPTY.skillCalls, EMPTY.pendingSpawns],
    [null, null, [], [], []])
  assert.deepEqual([spawned('a1')].map(sg => reduce(started(), sg).subagents[0]).map(a => [a?.root, a?.skills]), [[null, []]])
})

test('RootFollowed sets the lead root; to the current root it changes nothing', () => {
  let s = reduce(started(), { kind: 'RootFollowed', id: 'r1', root: root('/r') })
  assert.deepEqual(s.root, root('/r'))
  const again = reduce(s, { kind: 'RootFollowed', id: 'r2', root: root('/r') })
  assert.deepEqual(again.root, s.root)
  s = reduce(s, { kind: 'RootFollowed', id: 'r3', root: root('/r/.claude/worktrees/tdr') })
  assert.equal(s.root?.path, '/r/.claude/worktrees/tdr')
})

test('RootFollowed: the same signal id twice is applied once', () => {
  const once = reduce(started(), { kind: 'RootFollowed', id: 'r1', root: root('/r') })
  assert.equal(reduce(once, { kind: 'RootFollowed', id: 'r1', root: root('/x') }), once)
})

test('ChangeRead keeps lastChangeId at the id of the change read, null when none is read', () => {
  const change = { id: 'x', appetite: null, done: 0, total: 0, groups: [], planMtime: 0, hasDesign: false, hasTasks: false, archived: false }
  let s = reduce(started(), { kind: 'ChangeRead', id: 'c1', change, openChanges: 1, at: 1 })
  assert.equal(s.lastChangeId, 'x')
  s = reduce(s, { kind: 'ChangeRead', id: 'c2', change: null, openChanges: 1, at: 2 })
  assert.equal(s.lastChangeId, null)
})

test('AgentRooted sets that subagent root only; idempotent per agent', () => {
  let s = reduce(reduce(started(), spawned('a1')), spawned('a2'))
  s = reduce(s, { kind: 'AgentRooted', id: 'rooted:a1', agentId: 'a1', root: '/r-tdr' })
  assert.deepEqual(s.subagents.map(a => [a.agentId, a.root]), [['a1', '/r-tdr'], ['a2', null]])
  assert.equal(reduce(s, { kind: 'AgentRooted', id: 'rooted:a1', agentId: 'a1', root: '/elsewhere' }), s)
})

test('AgentRooted for an agent not yet listed changes nothing', () => {
  const s = started()
  assert.deepEqual(reduce(s, { kind: 'AgentRooted', id: 'rooted:zz', agentId: 'zz', root: '/x' }).subagents, [])
})

test('SkillCallStarted adds an in-flight call; SkillCallEnded removes it by toolUseId', () => {
  let s = reduce(started(), { kind: 'SkillCallStarted', id: 'c1', toolUseId: 'tu1', name: 'clarity-gate', agentId: null, at: 1 })
  s = reduce(s, { kind: 'SkillCallStarted', id: 'c2', toolUseId: 'tu2', name: 'clarity-gate', agentId: 'a1', at: 2 })
  assert.deepEqual(s.skillCalls, [
    { toolUseId: 'tu1', name: 'clarity-gate', agentId: null, at: 1 },
    { toolUseId: 'tu2', name: 'clarity-gate', agentId: 'a1', at: 2 }])
  s = reduce(s, { kind: 'SkillCallEnded', id: 'e1', toolUseId: 'tu1' })
  assert.deepEqual(s.skillCalls.map(c => c.toolUseId), ['tu2'])
  assert.equal(reduce(s, { kind: 'SkillCallEnded', id: 'e2', toolUseId: 'unknown' }).skillCalls.length, 1)
})

test('SkillCallStarted/Ended: a repeated id changes nothing', () => {
  const a = reduce(started(), { kind: 'SkillCallStarted', id: 'c1', toolUseId: 'tu1', name: 'x', agentId: null, at: 1 })
  assert.equal(reduce(a, { kind: 'SkillCallStarted', id: 'c1', toolUseId: 'tu1', name: 'x', agentId: null, at: 1 }), a)
  const b = reduce(a, { kind: 'SkillCallEnded', id: 'e1', toolUseId: 'tu1' })
  assert.equal(reduce(b, { kind: 'SkillCallEnded', id: 'e1', toolUseId: 'tu1' }), b)
})

test('ToolUsed of the lead is a tool event of the turn; the same id twice counts once', () => {
  const s = reduce(started(), { kind: 'ToolUsed', id: 't1' })
  assert.deepEqual(s.turnEvents, [{ kind: 'tool' }])
  assert.equal(reduce(s, { kind: 'ToolUsed', id: 't1' }), s)
  assert.deepEqual(reduce(s, { kind: 'ToolUsed', id: 't2', agentId: 'a1' }).turnEvents, [{ kind: 'tool' }]) // 3.2 does the per-agent part
})

test('revive of an atom written before D-1 fills the new fields and still reduces', () => {
  const old = { ...EMPTY } as Record<string, unknown>
  for (const k of ['root', 'lastChangeId', 'mergedBranches', 'skillCalls', 'pendingSpawns']) delete old[k]
  old['subagents'] = [{ agentId: 'a1', toolUseId: 't', type: 'x', model: 'm', description: '', startedAt: 0, tokens: 0, done: false }]
  const s = revive(old)
  assert.deepEqual([s.root, s.lastChangeId, s.mergedBranches, s.skillCalls, s.pendingSpawns], [null, null, [], [], []])
  assert.doesNotThrow(() => reduce(s, { kind: 'RootFollowed', id: 'r', root: root('/r') }))
})
