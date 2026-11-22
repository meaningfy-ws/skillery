import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { EMPTY, reduce, type Change, type NavState, type Signal } from './state.ts'
import { overspawnNow } from './lean.ts'
import { thresholdsFrom } from './hygiene.ts'
import { decideArchive, decideCommit, decideSpawn } from './strict.ts'
import { bandView } from './view.ts'
import { resolveWorkflows } from './workflow.ts'

const REPO = join(import.meta.dirname, '..', '..', '..')
const path = 'skills/epic-delivery/assets/workflows/epic-delivery.workflow.json'
const { workflows } = resolveWorkflows([{ path, text: readFileSync(join(REPO, path), 'utf8') }], [])
const thresholds = JSON.parse(readFileSync(join(REPO, 'skills/guardrails/assets/session-thresholds.json'), 'utf8'))
let n = 0
const id = () => `l${++n}`
const change = (appetite: string, done = 3, total = 9): Change =>
  ({ id: 'x', appetite, done, total, groups: [], planHash: '', hasDesign: true, hasTasks: true, archived: false })
const base = (appetite: string, raw: unknown = thresholds): Signal[] => [
  { kind: 'Started', id: id(), sessionId: 's', band: 'folded', statusLine: true, interactive: true },
  { kind: 'ThresholdsRead', id: id(), raw },
  { kind: 'WorkflowsRead', id: id(), workflows, errors: [], mode: 'loose', at: 1 },
  { kind: 'ChangeRead', id: id(), change: change(appetite), openChanges: 1, at: 2 },
]
// A spawn is counted when it is asked, before it runs (DD-41): what register.tsx sends first.
const spawn = (type: string, description = ''): Signal => ({ kind: 'SpawnAsked', id: id(), type, description })
const cmd = (command: string): Signal => ({ kind: 'ToolRan', id: id(), command, ok: true, at: 4 })
const turn = (contextPercent: number): Signal => ({ kind: 'TurnEnded', id: id(), turnId: id(), contextPercent, cleanTree: true, at: 5 })
const run = (...signals: Signal[]): NavState => signals.reduce(reduce, EMPTY)
const keys = (s: NavState) => s.warnings.map(w => w.key)
const band = (s: NavState) => bandView(s, { now: 0, home: '', commands: [] })
const appetite = (s: NavState) => band(s).details.rows.find(r => r.label === 'appetite')!.items
const phasesRow = (s: NavState) => band(s).details.rows.find(r => r.label === 'phases')!.items.join(' ')

test('TC-06 MEDIUM: five reviewers then a PR with no checker → second check missing (PD-9)', () => {
  const s = run(...base('MEDIUM'), ...Array.from({ length: 5 }, () => spawn('code-reviewer')), cmd('gh pr create --fill'))
  assert.ok(keys(s).some(k => k.startsWith('process:second-check:')), keys(s).join())
  const checked = run(...base('MEDIUM'), ...Array.from({ length: 5 }, () => spawn('code-reviewer')),
    spawn('general-purpose', 'stage checker'), cmd('gh pr create --fill'))
  assert.ok(!keys(checked).some(k => k.startsWith('process:second-check:')))
})

test('TC-07 SMALL: five reviewers in one turn → over-spawn (PD-8); the next turn counts afresh', () => {
  const s = run(...base('SMALL'), ...Array.from({ length: 5 }, () => spawn('code-reviewer')))
  assert.ok(keys(s).some(k => k.startsWith('process:overspawn:')), keys(s).join())
  const split = run(...base('SMALL'), spawn('code-reviewer'), turn(10), spawn('code-reviewer'))
  assert.ok(!keys(split).some(k => k.startsWith('process:overspawn:')))
})

test('D-4, D-22: two grouped runs by default (ceiling 2 + 1 UX), five lenses once the mark records a risk, the small stage shown beside', () => {
  const planRead = (added: number, truncated = false): Signal => ({ kind: 'PlanRead', id: id(), warnings: [], truncated, added })
  const fan = (n: number) => Array.from({ length: n }, () => spawn('code-reviewer'))
  const risk: Signal = { kind: 'AnswerShown', id: id(), text: 'mark: change=x phase=deliver stage=2 risk=recorded', at: 3 }
  const strict = (s: NavState): NavState => ({ ...s, mode: { repo: 'strict', session: null } })
  const three = run(...base('VERY LARGE'), planRead(600), ...fan(3))
  assert.ok(!keys(three).some(k => k.startsWith('process:overspawn:')), keys(three).join())
  assert.deepEqual(decideSpawn(strict(three), overspawnNow(three), null), { allow: true })
  assert.deepEqual(appetite(three).slice(2, 4), ['reviewers 3/3 this turn', 'small stage: 2 reviewers allowed'])
  const four = run(...base('VERY LARGE'), planRead(600), ...fan(4)) // five lenses without a recorded risk
  assert.ok(keys(four).some(k => k.startsWith('process:overspawn:')), keys(four).join())
  const five = run(...base('VERY LARGE'), planRead(600), risk, ...fan(5)) // risk=recorded: five single lenses
  assert.ok(!keys(five).some(k => k.startsWith('process:overspawn:')), keys(five).join())
  assert.deepEqual(decideSpawn(strict(five), overspawnNow(five), null), { allow: true })
  assert.ok(JSON.stringify(band(five)).includes('reviewers 5/6 this turn'))
  const seven = run(...base('VERY LARGE'), planRead(600), risk, ...fan(7)) // ceiling = 5 + 1 UX
  assert.ok(keys(seven).some(k => k.startsWith('process:overspawn:')), keys(seven).join())
  assert.ok('deny' in decideSpawn(strict(seven), overspawnNow(seven), null))
  for (const read of [planRead(601), planRead(10, true)]) {
    const full = run(...base('VERY LARGE'), read, ...fan(3))
    assert.ok(!keys(full).some(k => k.startsWith('process:overspawn:')), keys(full).join())
    assert.ok(JSON.stringify(band(full)).includes('reviewers 3/3 this turn'))
  }
})

test('D-4: a MEDIUM stage allows two reviewers, with or without a recorded risk', () => {
  const risk: Signal = { kind: 'AnswerShown', id: id(), text: 'mark: change=x phase=deliver stage=2 risk=recorded', at: 3 }
  const fan = (n: number) => Array.from({ length: n }, () => spawn('code-reviewer'))
  assert.ok(!keys(run(...base('MEDIUM'), ...fan(2))).some(k => k.startsWith('process:overspawn:')))
  assert.ok(keys(run(...base('MEDIUM'), ...fan(3))).some(k => k.startsWith('process:overspawn:')))
  assert.ok(keys(run(...base('MEDIUM'), risk, ...fan(3))).some(k => k.startsWith('process:overspawn:')))
  assert.ok(JSON.stringify(band(run(...base('MEDIUM'), risk))).includes('reviewers 0/2 this turn'))
})

test('D-22: no plan read yet, or a change switch, shows no small-stage figure', () => {
  const unread = run(...base('VERY LARGE'))
  assert.equal(unread.planAdded, null)
  assert.ok(!JSON.stringify(band(unread)).includes('small stage'))
  const read = reduce(unread, { kind: 'PlanRead', id: id(), warnings: [], truncated: false, added: 10 })
  assert.ok(JSON.stringify(band(read)).includes('small stage: 2 reviewers allowed'))
  const switched = reduce(read, { kind: 'ChangeRead', id: id(), change: { ...change('VERY LARGE'), id: 'y' }, openChanges: 1, at: 3 })
  assert.equal(switched.planAdded, null)
  const same = reduce(read, { kind: 'ChangeRead', id: id(), change: change('VERY LARGE'), openChanges: 1, at: 3 })
  assert.equal(same.planAdded, 10)
})

test('TC-08 a commit and a phase left at 62% offers compact; no commit at 62% does not', () => {
  // plan (0/9) → apply by the epic-delivery skill: a phase left, then a commit, tasks still open.
  const start = base('SMALL').slice(0, 3)
  const s = run(...start, { kind: 'ChangeRead', id: id(), change: change('SMALL', 0, 9), openChanges: 1, at: 2 },
    { kind: 'SkillLoaded', id: id(), name: 'epic-delivery', at: 3 }, cmd('git commit -m x'), turn(62))
  assert.equal(s.offer, 'compact')
  // All tasks ticked: the commit is a task boundary, so a fresh session is offered instead.
  assert.equal(run(...start, { kind: 'ChangeRead', id: id(), change: change('SMALL', 9, 9), openChanges: 1, at: 2 },
    cmd('git commit -m x'), turn(62)).offer, 'fresh')
  assert.equal(run(...base('SMALL'), turn(62)).offer, null)
  assert.equal(reduce(s, { kind: 'UserPrompted', id: id(), at: 6 }).offer, null)
})

const turnTokens = (contextPercent: number, contextTokens?: number): Signal =>
  ({ kind: 'TurnEnded', id: id(), turnId: id(), contextPercent, contextTokens, cleanTree: true, at: 5 })

test('D-1: the TurnEnded token count decides the offer and the warning, the percent is the fallback', () => {
  const start = base('SMALL').slice(0, 3)
  const open = { kind: 'ChangeRead', id: id(), change: change('SMALL', 0, 9), openChanges: 1, at: 2 } as const
  const safe = [...start, open, { kind: 'SkillLoaded', id: id(), name: 'epic-delivery', at: 3 } as const, cmd('git commit -m x')]
  assert.equal(run(...safe, turnTokens(15, 152300)).offer, 'compact')
  assert.equal(run(...safe, turnTokens(62)).offer, 'compact') // no count: 62% >= 50%
  const warn = run(...base('SMALL'), turnTokens(26, 260000))
  assert.equal(warn.warnings.find(w => w.key === 'hygiene:context')?.message, 'context 260,000 tokens mid-step (context_warn_tokens)')
})

test('D-5: one subagent running the full-gates command more than fixer_max_red_runs times warns once, never denies', () => {
  const gate = (agentId: string): Signal => ({ kind: 'ToolRan', id: id(), command: 'make check-all', ok: false, at: 4, agentId })
  const fixer = (runs: number, agentId = 'f1') => Array.from({ length: runs }, () => gate(agentId))
  const bound = (s: NavState) => s.warnings.filter(w => w.key.startsWith('hygiene:fixer-bound'))
  assert.deepEqual(bound(run(...base('SMALL'), ...fixer(3))), [])
  const four = bound(run(...base('SMALL'), ...fixer(4)))
  assert.equal(four.length, 1)
  assert.match(four[0]!.message, /f1/)
  assert.match(four[0]!.message, /4/)
  assert.equal(bound(run(...base('SMALL'), ...fixer(6))).length, 1)
  assert.deepEqual(bound(run(...base('SMALL'), ...fixer(2, 'f1'), ...fixer(2, 'f2'))), [])
  assert.deepEqual(bound(run(...base('SMALL'), ...Array.from({ length: 5 }, () =>
    ({ kind: 'ToolRan', id: id(), command: 'ls', ok: true, at: 4, agentId: 'f1' }) as Signal))), [])
  assert.deepEqual(bound(run(...base('SMALL'), ...Array.from({ length: 5 }, () => cmd('make check-all')))), []) // the lead's runs are not counted
})

// Stage 2 tester and review sort (D-30, D-32): the tests that failed first for an accepted finding, the
// error-matrix property, and the scenarios no other test covers.
const gateRun = (agentId: string, command = 'make check-all'): Signal => ({ kind: 'ToolRan', id: id(), command, ok: false, at: 4, agentId })
const gateTimes = (k: number, agentId: string, command?: string) => Array.from({ length: k }, () => gateRun(agentId, command))
const finish = (agentId: string): Signal => ({ kind: 'SubagentFinished', id: id(), agentId, tokens: 1 })
const fixerBound = (s: NavState) => s.warnings.filter(w => w.key.startsWith('hygiene:fixer-bound'))

test('found a missing fixer_max_red_runs gives no default: D-5 says default 3 but the fixer runs unbounded', () => {
  const { fixer_max_red_runs: _, ...noKey } = thresholds
  assert.equal(fixerBound(run(...base('SMALL', noKey), ...gateTimes(3, 'f1'))).length, 0)
  assert.equal(fixerBound(run(...base('SMALL', noKey), ...gateTimes(4, 'f1'))).length, 1)
})

test('probe of D-5: an agent id that names an Object property counts like any other', () => {
  for (const a of ['constructor', 'toString', 'hasOwnProperty', '__proto__']) {
    assert.deepEqual(fixerBound(run(...base('SMALL'), ...gateTimes(3, a))), [], `${a}: three runs are within the bound`)
    assert.equal(fixerBound(run(...base('SMALL'), ...gateTimes(4, a))).length, 1, `${a}: four runs exceed it`)
  }
})

test('probe of D-5: the tool calls of an agent named after an Object property count from zero (PD-6)', () => {
  const call = (agentId: string): Signal => ({ kind: 'AgentCalled', id: id(), agentId })
  const s = run(...base('SMALL'), call('constructor'), call('constructor'))
  assert.equal(s.agentCalls['constructor'], 2)
})

test('D-32 W1: the fixer-bound warning goes when its agent finishes', () => {
  const s = run(...base('SMALL'), ...gateTimes(4, 'f1'), ...gateTimes(4, 'f2'))
  assert.deepEqual(fixerBound(s).map(w => w.key).sort(), ['hygiene:fixer-bound:f1', 'hygiene:fixer-bound:f2'])
  assert.deepEqual(fixerBound(reduce(s, finish('f1'))).map(w => w.key), ['hygiene:fixer-bound:f2']) // only its own
  assert.deepEqual(fixerBound(run(...base('SMALL'), ...gateTimes(4, 'f1'), finish('f1'))), [])
})

test('D-32 W6: past 250,000 tokens with a fixer-bound warning, strict mode denies nothing', () => {
  const loose = run(...base('SMALL'), ...gateTimes(4, 'f1'), turnTokens(26, 260000))
  assert.deepEqual(keys(loose).filter(k => k.startsWith('hygiene:')).sort(), ['hygiene:context', 'hygiene:fixer-bound:f1'])
  const strict: NavState = { ...loose, mode: { repo: 'strict', session: null } }
  const clean: NavState = { ...strict, warnings: strict.warnings.filter(w => !w.key.startsWith('hygiene:')) }
  // the same state without the two hygiene warnings decides the same: they add no deny
  assert.deepEqual(decideCommit(strict), decideCommit(clean))
  assert.deepEqual(decideArchive(strict), decideArchive(clean))
  assert.deepEqual(decideSpawn(strict, overspawnNow(strict), null), { allow: true })
  const denied = [decideCommit(strict), decideArchive(strict)].filter(d => 'deny' in d)
  for (const d of denied) assert.ok(!/hygiene:/.test((d as { deny: string }).deny), 'no deny names a hygiene warning')
})

test('probe of D-5: spellings the workflow match rejects do not count (double space, dry run)', () => {
  for (const c of ['make  check-all', 'make check-all -n', 'make check-all --dry-run', 'make check-all-fast', 'make check-allx',
    'make validate', 'echo make-check-all']) {
    const s = run(...base('SMALL'), ...gateTimes(8, 'f1', c))
    assert.deepEqual(fixerBound(s), [], c)
    assert.equal(s.gateRuns['f1'] ?? 0, 0, c)
  }
})

test('probe of D-5: spellings the match accepts do count (chained, env prefix, trailing flags)', () => {
  for (const c of ['make check-all', 'cd x && make check-all', 'FOO=1 make check-all', 'make check-all 2>&1 | tail -5']) {
    assert.equal(run(...base('SMALL'), ...gateTimes(4, 'f1', c)).gateRuns['f1'], 4, c)
  }
})

test('probe of D-5: after SubagentFinished a new agent with the same id string counts from zero', () => {
  const s = run(...base('SMALL'), ...gateTimes(4, 'f1'), finish('f1'), ...gateTimes(3, 'f1'))
  assert.equal(s.gateRuns['f1'], 3)
  assert.deepEqual(fixerBound(s), [])
})

test('probe of D-28: two agents both past the bound give two warnings keyed per agent', () => {
  const s = run(...base('SMALL'), ...gateTimes(4, 'f1'), ...gateTimes(5, 'f2'))
  assert.deepEqual(fixerBound(s).map(w => w.key).sort(), ['hygiene:fixer-bound:f1', 'hygiene:fixer-bound:f2'])
})

test('probe of D-1: a non-numeric token key is rejected, never thrown later', () => {
  const values: unknown[] = ['150000', null, Number.NaN, Infinity, -1, {}, [], true, '']
  for (const key of ['fresh_offer_min_tokens', 'compact_offer_tokens', 'context_warn_tokens', 'fixer_max_red_runs']) {
    for (const v of values) {
      const raw = { ...thresholds, [key]: v }
      const p = thresholdsFrom(raw)
      assert.doesNotThrow(() => run(...base('SMALL', raw), turnTokens(80, 300000), ...gateTimes(5, 'f1')), `${key}=${String(v)}`)
      if (p.ok) assert.equal(typeof (p.thresholds as Record<string, unknown>)[key], 'number', `${key}=${String(v)} accepted as a non-number`)
    }
  }
})

// error-matrix row "A fixer exceeds the bound anyway": the warning exists iff n > bound
test('error row "fixer exceeds the bound": for n runs the warning exists iff n > bound', () => {
  for (const max of [1, 2, 3, 5, 8]) {
    for (let runs = 0; runs <= 10; runs++) {
      const s = run(...base('SMALL', { ...thresholds, fixer_max_red_runs: max }), ...gateTimes(runs, 'f1'))
      assert.equal(fixerBound(s).length === 1, runs > max, `bound ${max}, ${runs} runs`)
      assert.equal(fixerBound(s).length <= 1, true, `one warning per agent, bound ${max}, ${runs} runs`)
    }
  }
})

test('mid-step past the warn level: a warning, no offer; it is replaced, not repeated', () => {
  const s = run(...base('SMALL'), turn(80), turn(81))
  assert.equal(s.offer, null)
  assert.deepEqual(keys(s).filter(k => k === 'hygiene:context'), ['hygiene:context'])
})

test('TC-19 thresholds missing: no offers, one warning', () => {
  const s = run(...base('SMALL', null), cmd('git commit -m x'), turn(90), turn(90))
  assert.equal(s.offer, null)
  assert.deepEqual(keys(s).filter(k => k.startsWith('hygiene:')), ['hygiene:thresholds-missing'])
})

test('a subagent with few tool calls was a lookup (PD-6); an oversized report (PD-10)', () => {
  const s = run(...base('SMALL'), { kind: 'SubagentSpawned', id: id(), agentId: 'a1', type: 'Explore', model: 'haiku', description: '', at: 3 },
    { kind: 'ToolRan', id: id(), command: 'ls', ok: true, at: 4, agentId: 'a1' },
    { kind: 'SubagentFinished', id: id(), agentId: 'a1', tokens: 10, answer: 'x\n'.repeat(60) })
  assert.ok(keys(s).includes('process:inline:a1'), keys(s).join())
  assert.ok(keys(s).includes('hygiene:report:a1'))
})

test('an auto compaction warns; the band shows the offer folded', () => {
  assert.ok(keys(run(...base('SMALL'), { kind: 'Compacted', id: id(), trigger: 'auto' })).includes('hygiene:auto-compact'))
  assert.ok(band(run(...base('SMALL'), turn(80))).warning?.startsWith('⚠'))
})

test('the appetite row: appetite, tasks, reviewers against the review set, tokens and cost (§9 row 4)', () => {
  const s = run(...base('SMALL'), spawn('code-reviewer'),
    { kind: 'TurnEnded', id: id(), turnId: 't9', contextPercent: 10, cleanTree: true, at: 5, tokens: 12345, usd: 0.4 })
  assert.deepEqual(appetite(s), ['SMALL', 'tasks 3/9', 'reviewers 0/1 this turn', '12.3k tokens']) // no $ (D-11)
  assert.deepEqual(appetite(run(...base('SMALL'), spawn('code-reviewer'))),
    ['SMALL', 'tasks 3/9', 'reviewers 1/1 this turn'])
})

test('a skill gate shows the score its skill printed, never one the mod makes (DD-14)', () => {
  const s = run(...base('SMALL'), { kind: 'SkillLoaded', id: id(), name: 'meaningfy-building:clarity-gate', at: 3 },
    { kind: 'AnswerShown', id: id(), text: 'Clarity score: 9.1/10 — ready.', at: 4 })
  assert.match(phasesRow(s), /clarity ✓ 9\.1/)
  const unscored = run(...base('SMALL'), { kind: 'SkillLoaded', id: id(), name: 'clarity-gate', at: 3 },
    { kind: 'AnswerShown', id: id(), text: 'done', at: 4 })
  assert.match(phasesRow(unscored), /clarity ✓(?! \d)/)
})
