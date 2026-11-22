import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { inlineSpawn, modelAbove, overspawn, reportOversized, reviewQuota, riskRecorded, roleOf, secondCheck, shipCommand, smallStageAllowance,
  unusedSkills, type DispatchEvent } from './dispatch.ts'
import { thresholdsFrom, type Thresholds } from './hygiene.ts'
import { overspawnNow } from './lean.ts'
import { EMPTY, reduce, revive, type Change, type NavState, type Signal, type Workflow } from './state.ts'
import { resolveWorkflows } from './workflow.ts'

const t = (thresholdsFrom({
  compact_offer_context_percent: 50, context_warn_percent: 75, fresh_offer_min_context_percent: 15,
  idle_reset_minutes: 60, subagent_report_max_lines: 40, lookup_max_tool_calls: 3,
  model_rank: ['haiku', 'sonnet', 'opus'],
  safe_point: { after: 'commit', and_any: ['phase-left', 'task-group-done'] },
  task_boundary: { any: ['commit', 'pr-merged', 'archived'] }, idle_reset: { requires_clean_tree: true },
}) as { thresholds: Thresholds }).thresholds

const review = (reviewers: number, checker: boolean, extra?: number) =>
  ({ challenge: '', reviewers, ux: extra === undefined ? null : { wording: '', extra_reviewers: extra }, check: '', checker, tester: null })
const W: Workflow = {
  name: 'epic-delivery', title: '', owner: 'meaningfy-building:epic-delivery', activate: {}, phases: [],
  reviews: { SMALL: review(1, false), MEDIUM: review(5, true), LARGE: review(5, true, 1) },
  roles: { reviewer: { agents: ['code-reviewer'] }, checker: { describe: '\\bcheck(er)?\\b' }, tester: { describe: '\\b(adversarial|tester)\\b' } },
}
const spawns = (n: number, role: DispatchEvent = { kind: 'spawn', role: 'reviewer' }) => Array<DispatchEvent>(n).fill(role)

test('roleOf: agent name first, then the description regex, else other', () => {
  assert.equal(roleOf(W, 'meaningfy-building:code-reviewer', 'L1 lens, a quick check'), 'reviewer')
  assert.equal(roleOf(W, 'general-purpose', 'Checker: re-verify stage 2'), 'checker')
  assert.equal(roleOf(W, 'general-purpose', 'adversarial tester for the parser'), 'tester')
  assert.equal(roleOf(W, 'general-purpose', 'find the config loader'), 'other')
  assert.equal(roleOf({ ...W, roles: undefined }, 'code-reviewer', 'x'), 'other')
  assert.equal(roleOf({ ...W, roles: { checker: { describe: '(' } } }, 'x', 'check'), 'other') // bad regex is no match
})

test('PD-6: a finished subagent with at most the lookup count of tool calls', () => {
  assert.deepEqual(inlineSpawn(t, 'a1', 3).map(w => [w.key, w.remedy, w.owner]), [['process:inline:a1', null, 'guardrails']])
  assert.deepEqual(inlineSpawn(t, 'a1', 4), [])
})

test('PD-7: no declared model and a model above the parent', () => {
  assert.deepEqual(modelAbove(t, { agentId: 'a2', model: 'claude-opus-4-1', declared: false }, 'claude-sonnet-4-5')
    .map(w => [w.key, w.owner]), [['process:model:a2', 'guardrails']])
  assert.deepEqual(modelAbove(t, { agentId: 'a2', model: 'claude-opus-4-1', declared: true }, 'claude-sonnet-4-5'), [])
  assert.deepEqual(modelAbove(t, { agentId: 'a2', model: 'sonnet', declared: false }, 'claude-sonnet-4-5'), [])
  assert.deepEqual(modelAbove(t, { agentId: 'a2', model: 'haiku', declared: false }, 'opus'), [])
  assert.deepEqual(modelAbove(t, { agentId: 'a2', model: 'Opus', declared: false }, 'mystery-model'), []) // unranked: no judgement
  assert.deepEqual(modelAbove(t, { agentId: 'a2', model: '', declared: false }, 'haiku'), [])
})

test('TC-07: SMALL, 5 reviewer spawns in a turn → over-spawn', () => {
  const w = overspawn(W, 'SMALL', 't7', ['reviewer', 'reviewer', 'reviewer', 'reviewer', 'reviewer'])
  assert.deepEqual(w.map(x => [x.key, x.owner]), [['process:overspawn:t7', 'epic-delivery']])
  assert.match(w[0]!.message, /over-spawn/)
})

test('PD-8: the allowance adds the UX reviewers; other roles do not count', () => {
  assert.deepEqual(overspawn(W, 'SMALL', 't', ['reviewer', 'checker', 'other']), [])
  assert.deepEqual(overspawn(W, 'LARGE', 't', Array(6).fill('reviewer')), [])
  assert.equal(overspawn(W, 'LARGE', 't', Array(7).fill('reviewer')).length, 1)
  assert.deepEqual(overspawn(W, null, 't', Array(9).fill('reviewer')), [])
  assert.deepEqual(overspawn(W, 'HUGE', 't', Array(9).fill('reviewer')), []) // no reviews entry
})

const SMALL_STAGE = { max_added_lines: 600, reviewers: 2, lenses: [['L1', 'L2'], ['L3', 'L4', 'L5']] }
const WS: Workflow = { ...W, reviews: { 'VERY LARGE': { ...review(5, true, 1), small_stage: SMALL_STAGE }, LARGE: review(5, true, 1) } }
const navAt = (appetite: string, planAdded: number | null, planTruncated = false) => ({
  ...EMPTY, workflows: [WS], planAdded, planTruncated,
  change: { id: 'x', appetite, done: 0, total: 1, groups: [], planHash: '', hasDesign: true, hasTasks: true, archived: false },
})

test('TC-15: smallStageAllowance, VERY LARGE: added 600 / 601 / truncated → 2 / null / null', () => {
  assert.equal(smallStageAllowance(navAt('VERY LARGE', 600)), 2)
  assert.equal(smallStageAllowance(navAt('VERY LARGE', 601)), null)
  assert.equal(smallStageAllowance(navAt('VERY LARGE', 10, true)), null)
})

test('D-22: no plan read yet (planAdded null) is not a small stage', () => {
  assert.equal(smallStageAllowance(navAt('VERY LARGE', null)), null)
})

test('smallStageAllowance: no small_stage, no review set, no change → null', () => {
  assert.equal(smallStageAllowance(navAt('LARGE', 1)), null)
  assert.equal(smallStageAllowance(navAt('HUGE', 1)), null)
  assert.equal(smallStageAllowance({ ...navAt('VERY LARGE', 1), change: null }), null)
})

test('reviewQuota is the ceiling, UX included, whatever the plan size; null without a review set', () => {
  assert.equal(reviewQuota(navAt('VERY LARGE', 600)), 6)
  assert.equal(reviewQuota(navAt('VERY LARGE', 601)), 6)
  assert.equal(reviewQuota(navAt('LARGE', 1)), 6)
  assert.equal(reviewQuota(navAt('HUGE', 1)), null)
  assert.equal(reviewQuota({ ...navAt('LARGE', 1), change: null }), null)
})

// D-4: the default review is two grouped runs; five single lenses only on a recorded risk.
const GROUPS = [['L1', 'L2'], ['L3', 'L4', 'L5']]
const WR: Workflow = { ...W, reviews: {
  MEDIUM: { ...review(2, true), lenses: GROUPS },
  LARGE: { ...review(2, true, 1), risk_reviewers: 5 },
  'VERY LARGE': { ...review(2, true, 1), risk_reviewers: 5, small_stage: SMALL_STAGE },
} }
const withMark = (appetite: string, risk: boolean | null, change = 'x') => ({
  ...navAt(appetite, 1), workflows: [WR], mark: risk === null ? null : { change, stage: '2', risk },
})

test('D-4: a MEDIUM stage with no risk has a ceiling of 2, and a recorded risk keeps it at 2', () => {
  assert.equal(reviewQuota(withMark('MEDIUM', false)), 2)
  assert.equal(reviewQuota(withMark('MEDIUM', true)), 2) // no risk_reviewers: the two grouped runs stay
  assert.equal(reviewQuota(withMark('MEDIUM', null)), 2) // no mark at all
})

test('D-4: LARGE has the default ceiling, UX included, and the risk_reviewers one when the stage mark recorded a risk', () => {
  assert.equal(reviewQuota(withMark('LARGE', false)), 3)
  assert.equal(reviewQuota(withMark('LARGE', null)), 3)
  assert.equal(reviewQuota(withMark('LARGE', true)), 6)
})

test('D-4: a risk recorded for another change does not raise this change\'s ceiling', () => {
  assert.equal(reviewQuota(withMark('LARGE', true, 'other')), 3)
})

test('D-4: a LARGE small stage still shows its allowance, with or without a risk', () => {
  assert.equal(smallStageAllowance({ ...withMark('VERY LARGE', true), planAdded: 600 }), 2)
  assert.equal(smallStageAllowance({ ...withMark('VERY LARGE', false), planAdded: 601 }), null)
})

test('D-4: over-spawn judges against the default ceiling, and the risk ceiling only when a risk is passed', () => {
  assert.equal(overspawn(WR, 'MEDIUM', 't', Array(3).fill('reviewer')).length, 1)
  assert.deepEqual(overspawn(WR, 'MEDIUM', 't', Array(2).fill('reviewer')), [])
  assert.equal(overspawn(WR, 'LARGE', 't', Array(4).fill('reviewer')).length, 1)
  assert.deepEqual(overspawn(WR, 'LARGE', 't', Array(6).fill('reviewer'), true), [])
  assert.equal(overspawn(WR, 'LARGE', 't', Array(7).fill('reviewer'), true).length, 1)
})

test('TC-06: MEDIUM, 5 reviewer spawns, then gh pr create → second check missing', () => {
  const events = [...spawns(5), { kind: 'ship' } as DispatchEvent]
  const w = secondCheck(W, 'MEDIUM', 'navigator', events)
  assert.deepEqual(w.map(x => [x.key, x.remedy, x.owner]), [['process:second-check:navigator', 'meaningfy-code-review', 'guardrails']])
  assert.match(w[0]!.message, /second check missing/)
  assert.ok(shipCommand('gh pr create --base develop'))
})

test('PD-9: a checker since the reviewers, no reviewers, or no checker required → none', () => {
  const ship: DispatchEvent = { kind: 'ship' }
  const checker: DispatchEvent = { kind: 'spawn', role: 'checker' }
  assert.deepEqual(secondCheck(W, 'MEDIUM', 'c', [...spawns(5), checker, ship]), [])
  assert.equal(secondCheck(W, 'MEDIUM', 'c', [checker, ...spawns(5), ship]).length, 1) // checker before the reviewers
  assert.deepEqual(secondCheck(W, 'MEDIUM', 'c', [ship]), [])
  assert.deepEqual(secondCheck(W, 'MEDIUM', 'c', spawns(5)), []) // nothing shipped yet
  assert.deepEqual(secondCheck(W, 'SMALL', 'c', [...spawns(1), ship]), [])
})

test('shipCommand: push, PR or archive', () => {
  for (const c of ['git push -u origin feature/x', 'gh pr create', 'openspec archive navigator -y']) assert.ok(shipCommand(c), c)
  for (const c of ['git commit -m push', 'gh pr view', 'git pushd']) assert.ok(!shipCommand(c), c)
})

test('PD-10: an answer longer than the report limit', () => {
  const lines = (n: number) => Array(n).fill('x').join('\n')
  assert.deepEqual(reportOversized(t, 'a3', lines(41)).map(w => [w.key, w.owner]), [['hygiene:report:a3', 'guardrails']])
  assert.deepEqual(reportOversized(t, 'a3', lines(40)), [])
  assert.deepEqual(reportOversized(t, 'a3', lines(40) + '\n'), []) // a trailing newline is not a line
})

const sk = (name: string, agent = 'main') => ({ kind: 'skill', name, agent }) as const
const tl = (agent = 'main') => ({ kind: 'tool', agent }) as const

test('unused skill (D-9): a load followed by another load and no tool call of its agent', () => {
  const w = unusedSkills([sk('meaningfy-core:guardrails'), sk('epic-delivery')], 'main')
  assert.deepEqual(w.map(x => [x.key, x.remedy]), [['hygiene:unused:main:guardrails', null]])
  assert.match(w[0]!.message, /skillery-feedback/)
  assert.deepEqual(unusedSkills([sk('a')], 'main'), []) // the last load of a turn is not judged
  assert.deepEqual(unusedSkills([sk('a'), tl(), sk('b')], 'main'), [])
})

test('unused skill (D-9): two loads then a tool call leave neither unused', () => {
  assert.deepEqual(unusedSkills([sk('a'), sk('b'), tl()], 'main'), [])
  assert.deepEqual(unusedSkills([sk('a'), sk('b'), { kind: 'spawn', agent: 'main' }], 'main'), [])
})

test('unused skill (D-9): only the judged agent\'s events count, and its warning key carries the agent', () => {
  const events = [sk('a', 'a1'), sk('b', 'a1'), tl('main')] // the lead's tool call is not the subagent's use
  assert.deepEqual(unusedSkills(events, 'a1').map(w => w.key), ['hygiene:unused:a1:a'])
  assert.deepEqual(unusedSkills(events, 'main'), [])
})

// Stage 3 tester (D-38): the ceiling through the reducer, on the shipped review sets.
const REPO = join(import.meta.dirname, '..', '..', '..')
const SHIPPED = 'skills/epic-delivery/assets/workflows/epic-delivery.workflow.json'
const shipped = resolveWorkflows([{ path: SHIPPED, text: readFileSync(join(REPO, SHIPPED), 'utf8') }], []).workflows
const SESSION_THRESHOLDS = JSON.parse(readFileSync(join(REPO, 'skills/guardrails/assets/session-thresholds.json'), 'utf8'))
const LEAD = 'mark: change=x phase=deliver stage=2'
let seq = 0
const sid = () => `d38-${++seq}`
const chg = (appetite: string): Change =>
  ({ id: 'x', appetite, done: 3, total: 9, groups: [], planHash: '', hasDesign: true, hasTasks: true, archived: false })
const started = (appetite: string): Signal[] => [
  { kind: 'Started', id: sid(), sessionId: 's', band: 'folded', statusLine: true, interactive: true },
  { kind: 'ThresholdsRead', id: sid(), raw: SESSION_THRESHOLDS },
  { kind: 'WorkflowsRead', id: sid(), workflows: shipped, errors: [], mode: 'loose', at: 1 },
  { kind: 'ChangeRead', id: sid(), change: chg(appetite), openChanges: 1, at: 2 },
]
const said = (text: string): Signal => ({ kind: 'AnswerShown', id: sid(), text, at: 3 })
const reviewerSpawns = (k: number): Signal[] => Array.from({ length: k }, () => ({ kind: 'SpawnAsked', id: sid(), type: 'code-reviewer', description: '' }))
const play = (...signals: Signal[]): NavState => signals.reduce(reduce, EMPTY)
const overspawned = (s: NavState) => s.warnings.filter(w => w.key.startsWith('process:overspawn:'))
const stateAt = (w: Workflow, appetite: string, mark: NavState['mark']): NavState => ({ ...EMPTY, workflows: [w], change: chg(appetite), mark })
const RISK = { change: 'x', stage: '2', risk: true }
const PLAIN = { change: 'x', stage: '2', risk: false }
const rset = (reviewers: number, extra: number | null, risk?: number) => ({ ...review(reviewers, true, extra ?? undefined), ...(risk === undefined ? {} : { risk_reviewers: risk }) })

test('D-4: a risk mark for stage 2 then a plain mark for stage 3 drops the risk; a plain then a risk mark applies it', () => {
  const dropped = play(...started('LARGE'), said(`${LEAD} risk=recorded`), said('mark: change=x phase=deliver stage=3'))
  assert.equal(riskRecorded(dropped), false)
  assert.equal(reviewQuota(dropped), 3)
  const applied = play(...started('LARGE'), said(LEAD), said(`${LEAD} risk=recorded`))
  assert.equal(riskRecorded(applied), true)
  assert.equal(reviewQuota(applied), 6)
})

test('D-4: a new session starts without a mark', () => {
  assert.equal(play(...started('LARGE'), said(`${LEAD} risk=recorded`), ...started('LARGE')).mark, null)
})

test('D-4: a MEDIUM stage with UX reviewers has a ceiling of 2 plus UX, with a risk too; LARGE has 3 and 6', () => {
  const m = { ...WR, reviews: { MEDIUM: rset(2, 1) } }
  assert.equal(reviewQuota(stateAt(m, 'MEDIUM', RISK)), 3)
  assert.equal(reviewQuota(stateAt(m, 'MEDIUM', PLAIN)), 3)
  assert.equal(overspawn(m, 'MEDIUM', 't', Array(3).fill('reviewer'), true).length, 0)
  assert.equal(overspawn(m, 'MEDIUM', 't', Array(4).fill('reviewer'), true).length, 1)
  const l = { ...WR, reviews: { LARGE: rset(2, 1, 5) } }
  assert.equal(reviewQuota(stateAt(l, 'LARGE', PLAIN)), 3)
  assert.equal(reviewQuota(stateAt(l, 'LARGE', RISK)), 6)
  assert.equal(reviewQuota(stateAt(l, 'LARGE', null)), 3)
  assert.equal(reviewQuota(stateAt({ ...WR, reviews: { LARGE: rset(2, 1, 2) } }, 'LARGE', RISK)), 3) // risk_reviewers = reviewers changes nothing
})

test('D-4: the over-spawn text names the default ceiling without a risk and the risk ceiling with one', () => {
  assert.equal(overspawned(play(...started('LARGE'), said(LEAD), ...reviewerSpawns(4)))[0]?.message, 'over-spawn: 4 reviewers in one turn, LARGE calls for 3')
  const risk = play(...started('LARGE'), said(`${LEAD} risk=recorded`), ...reviewerSpawns(7))
  assert.equal(overspawned(risk)[0]?.message, 'over-spawn: 7 reviewers in one turn, LARGE calls for 6')
  assert.equal(overspawnNow(risk)?.message, 'over-spawn: 7 reviewers in one turn, LARGE calls for 6')
  assert.equal(overspawned(play(...started('LARGE'), said(`${LEAD} risk=recorded`), ...reviewerSpawns(6))).length, 0)
})

test('D-4: on the shipped review sets, for every appetite and mark, the ceiling is risk_reviewers on a recorded risk from LARGE up, else reviewers, plus UX', () => {
  const sets = shipped.find(w => w.reviews)!.reviews!
  const marks: [string, NavState['mark']][] = [['none', null], ['plain', PLAIN], ['risk', RISK], ['risk for another change', { ...RISK, change: 'other' }]]
  for (const [appetite, r] of Object.entries(sets)) {
    const large = ['LARGE', 'VERY LARGE', 'HUGE'].includes(appetite)
    for (const [label, mark] of marks) {
      const expected = (mark?.risk && mark.change === 'x' && large && r.risk_reviewers !== undefined ? r.risk_reviewers : r.reviewers) + (r.ux?.extra_reviewers ?? 0)
      assert.equal(reviewQuota(stateAt(shipped.find(w => w.reviews)!, appetite, mark)), expected, `${appetite} ${label}`)
      const lead = said(mark ? `mark: change=${mark.change} phase=deliver stage=2${mark.risk ? ' risk=recorded' : ''}` : 'no mark')
      assert.equal(overspawned(play(...started(appetite), lead, ...reviewerSpawns(expected))).length, 0, `${appetite} ${label} at ceiling`)
      assert.equal(overspawned(play(...started(appetite), lead, ...reviewerSpawns(expected + 1))).length, 1, `${appetite} ${label} over`)
    }
  }
})

test('D-38: a revived mark with no change or a non-boolean risk never records a risk', () => {
  for (const mark of [{ change: 'x', stage: '2', risk: 'false' }, { change: 'x', stage: '2', risk: 1 }, { stage: '2', risk: true }]) {
    const s = { ...revive({ sessionId: 's', mark }), change: chg('LARGE') }
    assert.equal(riskRecorded(s), false, JSON.stringify(mark))
  }
  assert.equal(riskRecorded(revive({ sessionId: 's', mark: { stage: '2', risk: true } })), false) // no change in view
  const kept = { ...revive({ sessionId: 's', mark: { ...RISK, extra: 1 } }), workflows: shipped, change: chg('LARGE') }
  assert.equal(reviewQuota(kept), 6)
})
