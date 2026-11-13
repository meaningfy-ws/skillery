// Stage 2 of navigator-follows-the-work: merged and archived predicates (D-5, D-6), the hand-off (D-8)
// and release by command (D-7).

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { holds } from './change.ts'
import { EMPTY, reduce, revive, type Change, type NavState, type Signal } from './state.ts'
import { resolveWorkflows, workflowError } from './workflow.ts'

const REPO = join(import.meta.dirname, '..', '..', '..')
const file = (skill: string, name: string) => {
  const path = `skills/${skill}/assets/workflows/${name}.workflow.json`
  return { path, text: readFileSync(join(REPO, path), 'utf8') }
}
const defaults = resolveWorkflows([file('epic-delivery', 'epic-delivery'), file('meaningfy-release', 'release')], [])

let n = 0
const id = () => `s2-${++n}`
const change = (done: number, total: number, over: Partial<Change> = {}): Change =>
  ({ id: 'x', appetite: 'MEDIUM', done, total, groups: [], planMtime: 0, hasDesign: true, hasTasks: true, archived: false, ...over })

const run = (...signals: Signal[]): NavState =>
  signals.reduce(reduce, reduce(EMPTY, { kind: 'Started', id: id(), sessionId: 's', band: 'folded', statusLine: true, interactive: true }))
const workflows: Signal = { kind: 'WorkflowsRead', id: 'wf', workflows: defaults.workflows, errors: [], mode: 'loose', at: 1 }
const read = (c: Change | null, at = 2): Signal => ({ kind: 'ChangeRead', id: id(), change: c, openChanges: c ? 1 : 0, at })
const rooted = (branch: string, path = '/r'): Signal =>
  ({ kind: 'RootFollowed', id: id(), root: { path, common: '/r/.git', branch } })
const merged = (branch: string, at?: number): Signal => ({ kind: 'PrMerged', id: id(), branch, ...(at ? { at } : {}) } as Signal)
const skill = (name: string, at: number): Signal => ({ kind: 'SkillLoaded', id: id(), name, at })
const cmd = (command: string, at: number, ok = true): Signal => ({ kind: 'ToolRan', id: id(), command, ok, at })
const keys = (s: NavState) => s.warnings.map(w => w.key)
const where = (s: NavState) => [s.workflow, s.phase]

// ---------------------------------------------------------------- 2.1 predicates
test('TC-11 holds(merged): a merged branch with tasks open (a stage merge) does not hold', () => {
  assert.equal(holds('merged', change(3, 10), true), false)
})

test('TC-12 holds(merged): a merged branch with every task ticked holds; an unmerged one does not', () => {
  assert.equal(holds('merged', change(10, 10), true), true)
  assert.equal(holds('merged', change(10, 10), false), false)
  assert.equal(holds('merged', null, true), false)
})

test('D-6 holds(archived) follows change.archived', () => {
  assert.equal(holds('archived', change(10, 10, { archived: true })), true)
  assert.equal(holds('archived', change(10, 10)), false)
})

test('D-5 PrMerged adds the branch once; replaying another id adds nothing', () => {
  const s = run(merged('feature/a'), merged('feature/a'), merged('feature/b'))
  assert.deepEqual(s.mergedBranches, ['feature/a', 'feature/b'])
})

test('D-5 revive keeps only the string entries of mergedBranches', () => {
  assert.deepEqual(revive({ ...EMPTY, mergedBranches: ['a', 1, null, 'b'] }).mergedBranches, ['a', 'b'])
})

test('worked example 2, step 1: a stage merge with tasks open moves nothing, and the next stage is not merged', () => {
  const s = run(workflows, rooted('feature/x-stage-1'), read(change(3, 10)), merged('feature/x-stage-1', 5))
  assert.deepEqual(where(s), ['epic-delivery', 'apply'])
  const next = reduce(s, rooted('feature/x-stage-2'))
  assert.deepEqual(where(reduce(next, read(change(3, 10), 6))), ['epic-delivery', 'apply'])
})

test('worked example 2, step 2: all tasks ticked is accept; the merge of its branch enters archive', () => {
  const s = run(workflows, rooted('feature/boundary-owned-hint'), read(change(5, 5)))
  assert.equal(s.phase, 'accept')
  assert.equal(reduce(s, merged('feature/boundary-owned-hint', 5)).phase, 'archive')
  assert.equal(reduce(s, merged('feature/other', 5)).phase, 'accept')
})

test('worked example 2, step 3: the change folder moved to archive/ is still followed, in archive', () => {
  const s = run(workflows, rooted('feature/boundary-owned-hint'), read(change(5, 5)), merged('feature/boundary-owned-hint', 5),
    read(change(5, 5, { archived: true }), 6))
  assert.deepEqual([s.workflow, s.phase, s.change?.archived], ['epic-delivery', 'archive', true])
})

test('D-6 an archived change enters archive without a merge', () => {
  assert.equal(run(workflows, read(change(5, 5, { archived: true }))).phase, 'archive')
})

// ---------------------------------------------------------------- 2.3 hand-off
test('worked example 2, step 4: moving to another change places it from its files, with none of the old warnings', () => {
  const old = run(workflows, rooted('feature/boundary-owned-hint'), read(change(3, 5, { id: 'boundary-owned-hint' })),
    read(change(5, 5, { id: 'boundary-owned-hint' }), 3), merged('feature/boundary-owned-hint', 4))
  assert.ok(keys(old).some(k => k.startsWith('process:gate:') || k.startsWith('process:missing:')), keys(old).join())
  const s = reduce(reduce(old, rooted('ci/release-pipeline', '/r/.claude/worktrees/rp')), read(change(2, 5, { id: 'release-pipeline' }), 5))
  assert.deepEqual([s.workflow, s.phase, s.change?.id], ['epic-delivery', 'apply', 'release-pipeline'])
  assert.deepEqual(keys(s), [])
  assert.deepEqual(s.gates, {})
})

test('D-8 the hand-off drops only change-scoped warnings and re-reads accepted', () => {
  const base = run(workflows, read(change(3, 5, { id: 'a' })))
  const withWarnings: NavState = { ...base, accepted: ['process:gate:apply:clarity'], warnings: [
    ...['process:gate:apply:g', 'process:missing:apply:m', 'process:elsewhere:e', 'process:second-check:a', 'plan:outside:p']
      .map(key => ({ key, message: key, remedy: null, owner: 'o' })),
    ...['process:second-check:b', 'hygiene:context', 'workflow:error:x'].map(key => ({ key, message: key, remedy: null, owner: 'o' }))] }
  const s = reduce(withWarnings, read(change(1, 5, { id: 'b' }), 4))
  assert.deepEqual(keys(s), ['process:second-check:b', 'hygiene:context', 'workflow:error:x'])
  assert.deepEqual(s.accepted, [])
})

test('D-8 change to none: epic-delivery is not kept', () => {
  const s = run(workflows, read(change(3, 5)), read(null, 3))
  assert.deepEqual([s.workflow, s.phase, s.change], [null, null, null])
})

test('D-8 the first read of a session only sets lastChangeId', () => {
  const base = run(workflows)
  const seeded: NavState = { ...base, gates: { 'full-gates': { state: 'ok', at: 1, detail: '' } },
    warnings: [{ key: 'process:gate:apply:g', message: 'm', remedy: null, owner: 'o' }] }
  const s = reduce(seeded, read(change(3, 5)))
  assert.equal(s.lastChangeId, 'x')
  assert.deepEqual(keys(s), ['process:gate:apply:g'])
  assert.equal(s.gates['full-gates']?.state, 'ok')
})

test('D-8 a repeated read of the new change does not reset a second time', () => {
  const s = run(workflows, read(change(3, 5, { id: 'a' })), read(change(1, 5, { id: 'b' }), 3), cmd('make check-all', 4))
  assert.equal(s.gates['full-gates']?.state, 'ok')
  const again = reduce(s, read(change(1, 5, { id: 'b' }), 5))
  assert.equal(again.gates['full-gates']?.state, 'ok')
})

// ---------------------------------------------------------------- 2.4 release by command
const released = (...c: [string, number][]) => run(workflows, read(null), ...c.map(([x, at]) => cmd(x, at)))

test('D-7 git switch -c release/1.0.0 activates release and lands in bump, asking for the skill', () => {
  const s = released(['git switch -c release/1.0.0', 3])
  assert.deepEqual(where(s), ['release', 'bump'])
  assert.deepEqual(keys(s), ['process:missing:release:meaningfy-release'])
  assert.equal(s.warnings[0]?.remedy, 'meaningfy-release')
})

test('D-7 loading meaningfy-release clears the missing-skill warning', () => {
  const s = reduce(released(['git switch -c hotfix/1.0.1', 3]), skill('meaningfy-release', 4))
  assert.deepEqual(keys(s), [])
  assert.equal(s.workflow, 'release')
})

test('D-7 gh release create v1.0.0 lands past the publish gate, with no gate warning for the phases before', () => {
  const s = released(['gh release create v1.0.0 --notes "x"', 3])
  assert.deepEqual(where(s), ['release', 'back-merge'])
  assert.deepEqual(keys(s), ['process:missing:release:meaningfy-release'])
})

test('D-7 git push origin v1.0.0 activates release', () => {
  assert.equal(released(['git push origin v1.0.0', 3]).workflow, 'release')
})

for (const command of ['git tag v1.0.0', 'git tag -d v1.0.0', 'git push --follow-tags', 'git push origin --delete v1.0.0',
  'git push -u origin release/1.0.0', 'git commit -m "git switch -c release/1.0.0"', 'gh release view v1.0.0']) {
  test(`D-7 \`${command}\` does not activate release`, () => {
    assert.deepEqual(where(released([command, 3])), [null, null])
  })
}

test('D-7 a failed release command activates nothing', () => {
  assert.equal(run(workflows, read(null), cmd('git switch -c release/1.0.0', 3, false)).workflow, null)
})

test('D-7 a release command with an open change selects release, and no gate warning is raised for epic-delivery', () => {
  const s = run(workflows, read(change(3, 9)), cmd('git switch -c release/1.0.0', 3))
  assert.deepEqual(where(s), ['release', 'bump'])
  assert.ok(!keys(s).some(k => k.startsWith('process:gate:')), keys(s).join())
})

test('D-7 activate.commands must be a list of regular expressions', () => {
  const w = (commands: unknown) => ({ name: 'f', title: 'T', owner: 'o', activate: { commands },
    phases: [{ id: 'a', owner: 'o', expect: [], enter: {} }] })
  assert.equal(workflowError(w(['git switch -c x/']), 'repo'), null)
  assert.match(workflowError(w('x'), 'repo') ?? '', /activate\.commands must be a list of regular expressions/)
  assert.match(workflowError(w(['(']), 'repo') ?? '', /activate\.commands/)
})
