import { test } from 'node:test'
import assert from 'node:assert/strict'
import { inlineSpawn, modelAbove, overspawn, reportOversized, reviewQuota, roleOf, secondCheck, shipCommand, smallStageAllowance,
  unusedSkills, type DispatchEvent } from './dispatch.ts'
import { thresholdsFrom, type Thresholds } from './hygiene.ts'
import { EMPTY, type Workflow } from './state.ts'

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
  change: { id: 'x', appetite, done: 0, total: 1, groups: [], planMtime: 0, hasDesign: true, hasTasks: true, archived: false },
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

test('unused skill: a load followed by another load with no tool call between', () => {
  const w = unusedSkills([
    { kind: 'skill', name: 'meaningfy-core:guardrails' }, { kind: 'skill', name: 'epic-delivery' },
    { kind: 'tool' }, { kind: 'skill', name: 'clarity-gate' },
  ])
  assert.deepEqual(w.map(x => [x.key, x.remedy]), [['hygiene:unused:guardrails', null]])
  assert.match(w[0]!.message, /skillery-feedback/)
  assert.deepEqual(unusedSkills([{ kind: 'skill', name: 'a' }]), []) // the last load of a turn is not judged
  assert.deepEqual(unusedSkills([{ kind: 'skill', name: 'a' }, { kind: 'tool' }, { kind: 'skill', name: 'b' }]), [])
})
