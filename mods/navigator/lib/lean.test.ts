import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { EMPTY, reduce, type Change, type NavState, type Signal } from './state.ts'
import { overspawnNow } from './lean.ts'
import { decideSpawn } from './strict.ts'
import { bandView } from './view.ts'
import { resolveWorkflows } from './workflow.ts'

const REPO = join(import.meta.dirname, '..', '..', '..')
const path = 'skills/epic-delivery/assets/workflows/epic-delivery.workflow.json'
const { workflows } = resolveWorkflows([{ path, text: readFileSync(join(REPO, path), 'utf8') }], [])
const thresholds = JSON.parse(readFileSync(join(REPO, 'skills/guardrails/assets/session-thresholds.json'), 'utf8'))
let n = 0
const id = () => `l${++n}`
const change = (appetite: string, done = 3, total = 9): Change =>
  ({ id: 'x', appetite, done, total, groups: [], planMtime: 0, hasDesign: true, hasTasks: true, archived: false })
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
const band = (s: NavState) => bandView(s, { now: 0, home: '' })
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

test('D-22: a small stage (added ≤ 600) is an allowance: the full set still passes, the band shows both, six over-spawn', () => {
  const planRead = (added: number, truncated = false): Signal => ({ kind: 'PlanRead', id: id(), warnings: [], truncated, added })
  const fan = (n: number) => Array.from({ length: n }, () => spawn('code-reviewer'))
  const strict = (s: NavState): NavState => ({ ...s, mode: { repo: 'strict', session: null } })
  const five = run(...base('VERY LARGE'), planRead(600), ...fan(5))
  assert.ok(!keys(five).some(k => k.startsWith('process:overspawn:')), keys(five).join())
  assert.deepEqual(decideSpawn(strict(five), overspawnNow(five), null), { allow: true })
  assert.deepEqual(appetite(five).slice(2, 4),
    ['reviewers 5/6 this turn', 'small stage: 2 allowed'])
  const seven = run(...base('VERY LARGE'), planRead(600), ...fan(7)) // ceiling = 5 + 1 UX
  assert.ok(keys(seven).some(k => k.startsWith('process:overspawn:')), keys(seven).join())
  assert.ok('deny' in decideSpawn(strict(seven), overspawnNow(seven), null))
  for (const read of [planRead(601), planRead(10, true)]) {
    const full = run(...base('VERY LARGE'), read, ...fan(5))
    assert.ok(!keys(full).some(k => k.startsWith('process:overspawn:')), keys(full).join())
    assert.ok(JSON.stringify(band(full)).includes('reviewers 5/6 this turn'))
  }
})

test('D-22: no plan read yet, or a change switch, shows no small-stage figure', () => {
  const unread = run(...base('VERY LARGE'))
  assert.equal(unread.planAdded, null)
  assert.ok(!JSON.stringify(band(unread)).includes('small stage'))
  const read = reduce(unread, { kind: 'PlanRead', id: id(), warnings: [], truncated: false, added: 10 })
  assert.ok(JSON.stringify(band(read)).includes('small stage: 2 allowed'))
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
