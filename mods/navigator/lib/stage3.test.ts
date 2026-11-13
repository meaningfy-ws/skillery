import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { EMPTY, reduce, type NavState, type Signal } from './state.ts'
import { bandView, lineText, orderedWarnings, tierOf } from './view.ts'
import { resolveWorkflows } from './workflow.ts'

const w = (key: string, message = key) => ({ key, message, remedy: null, owner: 'x' })
const sub = (o: Partial<NavState['subagents'][number]>): NavState['subagents'][number] =>
  ({ agentId: 'a', toolUseId: 't', type: 'implementer', model: 'sonnet', description: '', startedAt: 0, tokens: 0, done: false,
    rootPath: null, skills: [], ...o })
const env = { now: 4 * 60_000, home: '/home/lps', commands: [] as string[] }
const REPO = join(import.meta.dirname, '..', '..', '..')
const epicDelivery = resolveWorkflows([{ path: 'skills/epic-delivery/assets/workflows/epic-delivery.workflow.json',
  text: readFileSync(join(REPO, 'skills/epic-delivery/assets/workflows/epic-delivery.workflow.json'), 'utf8') }], []).workflows
let n = 0
const run = (...signals: Signal[]): NavState => signals.reduce(reduce, EMPTY)
/** The state of worked example 3: epic-delivery in apply on a change with two tasks open. */
const applying = (): NavState => run(
  { kind: 'WorkflowsRead', id: `w${++n}`, workflows: epicDelivery, errors: [], mode: 'loose', at: 1 },
  { kind: 'ChangeRead', id: `c${++n}`, change: change0, openChanges: 1, at: 2 })
const change = { id: 'c', appetite: 'MEDIUM', done: 0, total: 2, groups: [{ title: '3. Stage 3 — Dump and restore', done: 0, total: 2 }],
  planHash: '', hasDesign: true, hasTasks: true, archived: false }
const root = { path: '/home/lps/work/r', common: '/home/lps/work/r/.git', branch: 'feature/c' }
const change0 = { ...change, done: 1, groups: [] } // partly ticked: epic-delivery places it in apply

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
  assert.equal(v.warning, '⚠ 2 warnings · clarity-gate has not run since its inputs changed')
})

test('worked example 3, line 2: next: is the command the Next step button runs, asserted literally', () => {
  const s = applying()
  const installed = { ...env, commands: ['navigator', 'superpowers:test-driven-development'] }
  const v = bandView(s, installed)
  assert.equal(v.next, 'next: /superpowers:test-driven-development')
  assert.deepEqual(v.nextAction, { label: 'Next step', line: 'test-driven-development' })
  // not installed: the button still tells the person so when pressed; the line shows the step as typed
  assert.equal(bandView(s, env).next, 'next: /test-driven-development')
  assert.equal(bandView(run(), env).next, null)
  assert.equal(bandView(run(), env).nextAction, null)
})

test('the folded warning counts tiers 1-4 only, never accepted ones; tier 5 alone shows none', () => {
  const s = { ...EMPTY, warnings: [w('hygiene:unused:main:s'), w('hygiene:context', 'ctx'), w('plan:a', 'p'), w('plan:b', 'q')], accepted: ['plan:b'] }
  assert.equal(bandView(s, env).warning, '⚠ 2 warnings · p')
  assert.equal(bandView({ ...s, warnings: [w('plan:a', 'p')], accepted: [] }, env).warning, '⚠ p')
  assert.equal(bandView({ ...EMPTY, warnings: [w('hygiene:unused:main:s')] }, env).warning, null)
})

test('now line: no change, no workflow', () => {
  assert.equal(bandView({ ...EMPTY, root }, env).now, 'no change for branch feature/c')
  assert.equal(bandView(EMPTY, env).now, 'no repository') // one text for no root, as the status line says
})

test('now line: a subagent task is cut to 30 characters', () => {
  const s: NavState = { ...EMPTY, change, phase: 'apply',
    subagents: [sub({ description: 'T'.repeat(30) }), sub({ agentId: 'b', description: 'U'.repeat(31) })] }
  assert.match(bandView(s, env).now, new RegExp(`· ${'T'.repeat(30)} → implementer .* · ${'U'.repeat(29)}… → implementer`))
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

test('Many warnings (spec): twelve open, one a gate: folded shows the count and the gate one, Details lists all twelve, gate first', () => {
  const plan = Array.from({ length: 11 }, (_, i) => w(`plan:outside:f${i}.py`, `f${i}.py is outside the PLAN`))
  const s: NavState = { ...EMPTY, change, warnings: [w('process:gate:clarity', 'clarity-gate has not run'), ...plan] }
  const v = bandView(s, env)
  assert.equal(v.warning, '⚠ 12 warnings · clarity-gate has not run')
  assert.equal(v.details.warnings.length, 12)
  assert.equal(v.details.warnings[0]!.key, 'process:gate:clarity')
  assert.equal(v.details.warnings[1]!.key, 'plan:outside:f10.py') // newest first within tier 2
  assert.ok(!('moreWarnings' in v.details))
})

test('Details: open warnings come before accepted ones, so a flood of accepted never hides an Accept button', () => {
  const many = Array.from({ length: 12 }, (_, i) => w(`plan:outside:f${i}.py`))
  const s: NavState = { ...EMPTY, change, warnings: many, accepted: ['plan:outside:f11.py'] }
  const d = bandView(s, env).details
  assert.equal(d.warnings.length, 12)
  assert.deepEqual([d.warnings[0]!.accepted, d.warnings.at(-1)!.accepted], [false, true])
})

test('an Accept button reads "Accept: <message>", cut to 60 characters', () => {
  const s: NavState = { ...EMPTY, change, warnings: [w('plan:a', 'short'), w('plan:b', 'm'.repeat(80))] }
  const [long, short] = bandView(s, env).details.warnings
  assert.equal(short!.label, 'Accept: short')
  assert.equal([...long!.label].length, 60)
  assert.ok(long!.label.startsWith('Accept: mmm') && long!.label.endsWith('…'))
})

test('now line: elapsed counts in the milliseconds $.clock.now() gives, as startedAt does', () => {
  const s: NavState = { ...EMPTY, change, phase: 'apply', subagents: [sub({ description: 'd', startedAt: 1_700_000_000_000 })] }
  assert.match(bandView(s, { now: 1_700_000_000_000 + 125_000, home: '', commands: [] }).now, /\(2m\)$/)
})

const labels = (s: NavState) => bandView(s, env).details.actions.map(a => a.label)

test('Details: actions offer only what applies; Archive check only on an open change, Mode always', () => {
  assert.deepEqual(labels({ ...EMPTY, change }), ['Archive check', 'Switch to strict'])
  assert.deepEqual(labels(EMPTY), ['Switch to strict'])
  assert.ok(!labels({ ...EMPTY, change: { ...change, archived: true } }).includes('Archive check'))
  assert.deepEqual(labels({ ...EMPTY, mode: { repo: 'strict', session: null } }), ['Switch to loose'])
})

test('Details: Reconcile EPIC carries its two steps, Validate and Review their command lines', () => {
  const drift = { key: 'plan:outside:a.py', message: 'm', remedy: 'openspec-update-change c', owner: 'epic-planning' }
  const s = { ...applying(), warnings: [drift] }
  const a = bandView(s, env).details.actions
  assert.deepEqual(a.find(x => x.label === 'Reconcile EPIC'), { label: 'Reconcile EPIC', steps: ['openspec-update-change c', 'clarity-gate c'] })
  assert.ok(a.some(x => x.label === 'Review' && 'line' in x && x.line.startsWith('meaningfy-code-review c')), JSON.stringify(a))
})

test('the Back on track and hygiene buttons come from the view, with their lines', () => {
  const gate = { key: 'process:missing:apply:tdd', message: 'tdd missing', remedy: 'test-driven-development', owner: 'epic-delivery' }
  const v = bandView({ ...applying(), warnings: [gate], offer: 'compact' }, env)
  assert.deepEqual(v.backAction, { label: 'Back on track', line: 'test-driven-development' })
  assert.equal(v.hygieneAction!.label, 'Compact now')
  assert.equal(bandView(applying(), env).backAction, null)
  assert.equal(bandView(applying(), env).hygieneAction, null)
})

test('the appetite row: no groups when a stages row shows, "diff truncated" when the plan read was cut', () => {
  const grouped = { ...EMPTY, change: { ...change, groups: [{ title: '1. Stage 1 — a', done: 1, total: 2 }] } }
  const items = (s: NavState) => bandView(s, env).details.rows.find(r => r.label === 'appetite')!.items
  assert.ok(!items(grouped).some(i => i.startsWith('groups')))
  assert.ok(items({ ...EMPTY, change: { ...change, groups: [] } }).every(i => !i.startsWith('groups')))
  assert.ok(!items(grouped).includes('diff truncated'))
  assert.ok(items({ ...grouped, planTruncated: true }).includes('diff truncated'))
})

test('status line: no change for the branch, no repository, strict kept', () => {
  assert.equal(lineText({ ...EMPTY, root }), 'navigator · no change for branch feature/c')
  assert.equal(lineText(EMPTY), 'navigator · no repository')
  assert.equal(lineText({ ...EMPTY, root, mode: { repo: 'strict', session: null } }), 'navigator · no change for branch feature/c · ● strict')
  assert.equal(lineText({ ...EMPTY, mode: { repo: 'strict', session: null } }), 'navigator · no repository · ● strict')
})
