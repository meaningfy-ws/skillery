import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EMPTY, type NavState } from './state.ts'
import { bandView, lineText, orderedWarnings, tierOf } from './view.ts'

const w = (key: string, message = key) => ({ key, message, remedy: null, owner: 'x' })
const sub = (o: Partial<NavState['subagents'][number]>): NavState['subagents'][number] =>
  ({ agentId: 'a', toolUseId: 't', type: 'implementer', model: 'sonnet', description: '', startedAt: 0, tokens: 0, done: false,
    rootPath: null, skills: [], ...o })
const env = { now: 4 * 60_000, home: '/home/lps' }
const change = { id: 'c', appetite: 'MEDIUM', done: 0, total: 2, groups: [{ title: '3. Stage 3 — Dump and restore', done: 0, total: 2 }],
  planMtime: 0, hasDesign: true, hasTasks: true, archived: false }
const root = { path: '/home/lps/work/r', common: '/home/lps/work/r/.git', branch: 'feature/c' }

test('TC-13 tierOf ranks the keys in five tiers; an unknown prefix is 3', () => {
  const keys = ['process:gate:x', 'process:external:y', 'plan:outside:z', 'process:overspawn', 'hygiene:context', 'hygiene:unused:main:s', 'foo:bar']
  assert.deepEqual(keys.map(tierOf), [1, 1, 2, 3, 4, 5, 3])
  assert.deepEqual(['workflow:error:a', 'process:missing:a', 'process:elsewhere:a', 'process:inline', 'process:model',
    'process:second-check'].map(tierOf), [1, 1, 1, 3, 3, 3])
})

test('warnings are ordered by tier, newest first within a tier', () => {
  const s = { ...EMPTY, warnings: [w('hygiene:a'), w('plan:old'), w('process:gate:1'), w('plan:new'), w('process:gate:2')] }
  assert.deepEqual(orderedWarnings(s).map(x => x.key), ['process:gate:2', 'process:gate:1', 'plan:new', 'plan:old', 'hygiene:a'])
})

test('worked example 3: the folded band of session 3', () => {
  const s: NavState = { ...EMPTY, change, root, openChanges: 1, phase: 'apply',
    subagents: [sub({ description: 'Task 3.1 dump and restore', type: 'meaningfy-building:implementer', startedAt: 0 })],
    warnings: [w('process:gate:clarity', 'clarity-gate has not run since its inputs changed'), w('plan:outside:a.py', 'a.py is outside the PLAN')] }
  const v = bandView(s, env)
  assert.equal(v.now, 'apply · 3 Dump and restore 0/2 · Task 3.1 dump and restore → implementer (4m)')
  assert.equal(v.warning, '⚠ clarity-gate has not run since its inputs changed · 1 more')
})

test('the folded warning counts tiers 1-4 only, never accepted ones; tier 5 alone shows none', () => {
  const s = { ...EMPTY, warnings: [w('hygiene:unused:main:s'), w('hygiene:context', 'ctx'), w('plan:a', 'p'), w('plan:b', 'q')], accepted: ['plan:b'] }
  assert.equal(bandView(s, env).warning, '⚠ p · 1 more')
  assert.equal(bandView({ ...EMPTY, warnings: [w('hygiene:unused:main:s')] }, env).warning, null)
})

test('now line: no change, no workflow', () => {
  assert.equal(bandView({ ...EMPTY, root }, env).now, 'no change for branch feature/c')
  assert.equal(bandView(EMPTY, env).now, 'no open change')
})

test('now line: three running subagents show two and +1', () => {
  const s: NavState = { ...EMPTY, change, phase: 'apply',
    subagents: [sub({ agentId: '1', description: 'a', startedAt: 3 * 60_000 }), sub({ agentId: '2', description: 'b', type: 'p:reviewer' }),
      sub({ agentId: '3', description: 'c' })] }
  assert.equal(bandView(s, env).now,
    'apply · 3 Dump and restore 0/2 · a → implementer (1m) · b → reviewer (4m) · +1')
})

test('Details: reading line with ~ for HOME, and no root', () => {
  assert.equal(bandView({ ...EMPTY, root }, env).details.reading, 'reading ~/work/r · feature/c')
  assert.equal(bandView(EMPTY, env).details.reading, null)
  assert.equal(bandView({ ...EMPTY, root: { ...root, path: '/other/r' } }, env).details.reading, 'reading /other/r · feature/c')
})

const row = (s: NavState, label: string) => bandView(s, env).details.rows.find(r => r.label === label)

test('Details: the gate states sit in the phases row; none prints nothing', () => {
  const g = (state: 'ok' | 'fail' | 'stale' | 'none', detail = '') => ({ state, at: 1, detail })
  const s: NavState = { ...EMPTY, gates: { clarity: g('ok', '9.1'), acceptance: g('stale'), review: g('none'), validate: g('fail') } }
  assert.deepEqual(row(s, 'phases')!.items, ['clarity ✓ 9.1', 'acceptance ·', 'validate ✗'])
})

test('Details: appetite without $, skills bare and grouped by phase, subagents grouped by type', () => {
  const s: NavState = { ...EMPTY, change, usd: 1.5, sessionTokens: 2000, parentModel: 'opus',
    skills: [{ name: 'p:cosmic-python', at: 1, phase: 'apply' }, { name: 'tdd', at: 2, phase: 'apply' }, { name: 'clarity-gate', at: 3, phase: null }],
    subagents: [sub({ done: true, tokens: 2_600_000 }), sub({ done: true, tokens: 2_600_000 }), sub({ done: true }), sub({ model: 'opus' }),
      sub({ type: 'p:reviewer', model: 'opus', done: true, tokens: 10 })] }
  assert.ok(!row(s, 'appetite')!.items.join().includes('$'))
  assert.deepEqual(row(s, 'skills')!.items, ['apply: cosmic-python, tdd', 'clarity-gate'])
  assert.deepEqual(row(s, 'subagents')!.items, ['implementer ×3 done · sonnet · 5.2M tokens · 1 running', 'reviewer done · 10 tokens'])
})

test('Details: warnings in tier order with key and message; accepted ones not offered; archived offers none', () => {
  const s: NavState = { ...EMPTY, change, warnings: [w('hygiene:a', 'h'), w('plan:b', 'p')], accepted: ['hygiene:a'] }
  assert.deepEqual(bandView(s, env).details.warnings.map(x => [x.key, x.message, x.accepted, x.accept]),
    [['plan:b', 'p', false, true], ['hygiene:a', 'h', true, false]])
  const arch = { ...s, change: { ...change, archived: true } }
  assert.ok(bandView(arch, env).details.warnings.every(x => !x.accept))
})

test('Details: actions, Archive check only on an open change', () => {
  const labels = (s: NavState) => bandView(s, env).details.actions
  assert.deepEqual(labels({ ...EMPTY, change }), ['Reconcile EPIC', 'Archive check', 'Validate', 'Review', 'Mode', 'Less'])
  assert.ok(!labels(EMPTY).includes('Archive check'))
  assert.ok(!labels({ ...EMPTY, change: { ...change, archived: true } }).includes('Archive check'))
})

test('status line: no change for the branch, no repository, strict kept', () => {
  assert.equal(lineText({ ...EMPTY, root }), 'navigator · no change for branch feature/c')
  assert.equal(lineText(EMPTY), 'navigator · no repository')
  assert.equal(lineText({ ...EMPTY, root, mode: { repo: 'strict', session: null } }), 'navigator · no change for branch feature/c · ● strict')
  assert.equal(lineText({ ...EMPTY, mode: { repo: 'strict', session: null } }), 'navigator · no repository · ● strict')
})
