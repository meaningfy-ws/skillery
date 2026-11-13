import { test } from 'node:test'
import assert from 'node:assert/strict'
import { appetiteOf, appetitesOf, holds, matchArchived, matchOpen, progress, readChange, type ChangeFiles } from './change.ts'
import { ARCHIVED_CHANGES, OPEN_CHANGES } from './fixtures.test-helpers.ts'

const APPETITES = ['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'VERY LARGE', 'HUGE']

const file = (id: string, tasks: string | null = null): ChangeFiles =>
  ({ id, proposal: '## Appetite\n\nVERY LARGE — three stages.\n\n## Problem\nSMALL bits\n', tasks, design: false, planMtime: 0 })

test('appetite: the longest name in the first paragraph under ## Appetite', () => {
  assert.equal(appetiteOf(file('x').proposal, APPETITES), 'VERY LARGE')
  assert.equal(appetiteOf('## Appetite\n\nSome size.\n\nSMALL later', APPETITES), null)
  assert.equal(appetiteOf('no section', APPETITES), null)
  assert.equal(appetiteOf(file('x').proposal, []), null)
})

test('progress counts boxes per group, not the roadmap', () => {
  const tasks = '## 1. One\n- [x] 1.1 a\n- [ ] 1.2 b\n## 2. Two\n- [x] 2.1 c\n## Roadmap\n- [ ] 1.1 · [ ] 1.2\n## Verification\ntext\n'
  assert.deepEqual(progress(tasks), {
    done: 2, total: 3,
    groups: [{ title: '1. One', done: 1, total: 2 }, { title: '2. Two', done: 1, total: 1 }],
  })
})

test('TC-18 three open changes, the branch names one: that one, +2', () => {
  const r = readChange([file('alpha'), file('navigator'), file('beta')], [], null, 'feature/navigator-1', APPETITES)
  assert.equal(r.change?.id, 'navigator')
  assert.equal(r.change?.archived, false)
  assert.equal(r.openChanges, 3)
})

test('no branch match: no change, whatever the open ones are (DEC-3: never the most recent)', () => {
  const r = readChange([file('alpha'), file('beta')], [], null, 'develop', APPETITES)
  assert.deepEqual(r, { change: null, openChanges: 2 })
})

test('TC-02 (change) no open change', () => {
  assert.deepEqual(readChange([], [], null, 'develop', APPETITES), { change: null, openChanges: 0 })
})

// ---------------------------------------------------------------- D-3: matching a branch to a change
const ids = (list: ChangeFiles[]) => list.map(c => c.id)

test('TC-1 the branch holds the whole id', () => {
  assert.equal(matchOpen('feature/tenant-dump-restore', ['tenant-dump-restore', 'aggregate-events']), 'tenant-dump-restore')
})

test('TC-2 a suffix after the id', () => {
  assert.equal(matchOpen('feature/atomic-commit-stage-1', ['atomic-commit']), 'atomic-commit')
})

test('TC-3 the longest id wins', () => {
  assert.equal(matchOpen('docs/shape-navigator-follows-the-work', ['navigator', 'navigator-follows-the-work']),
    'navigator-follows-the-work')
})

test('TC-4 no id in the branch: none, and no mtime fallback', () => {
  assert.equal(matchOpen('docs/shape-backlog-2026-11-12', ['aggregate-events', 'release-pipeline']), null)
})

test('TC-5 an id inside a word does not match', () => {
  assert.equal(matchOpen('prefix-x', ['fix']), null)
  assert.equal(matchOpen('feature/fixture', ['fix']), null)
  assert.equal(matchOpen('fix/other', ['fix']), 'fix') // bounded by the start and `/`
})

test('D-3 equal length: the id named later in the branch, then alphabetical; folder order never decides', () => {
  assert.equal(matchOpen('aaa-bbb', ['aaa', 'bbb']), 'bbb')
  assert.equal(matchOpen('aaa-bbb', ['bbb', 'aaa']), 'bbb')
  assert.equal(matchOpen('beta-alpha', ['alpha', 'beta']), 'alpha')
})

test('D-3 a branch holding two ids of different length picks the longer, whatever the folder order', () => {
  assert.equal(matchOpen('x/beta-alpha1', ['beta', 'alpha1']), 'alpha1')
  assert.equal(matchOpen('x/beta-alpha1', ['alpha1', 'beta']), 'alpha1')
})

test('D-3 ids are matched case-sensitively; an empty branch matches nothing', () => {
  assert.equal(matchOpen('feature/navigator-1', ['Navigator']), null)
  assert.equal(matchOpen('', ['a', 'b']), null)
})

test('TC-6 an old archived change is not followed by an unrelated branch', () => {
  assert.equal(matchArchived('fix/navigator-band', ['2026-11-09-navigator'], null), null)
  assert.equal(matchArchived('fix/navigator-band', ['2026-11-09-navigator'], 'aggregate-events'), null)
})

test('TC-7 the change just archived is still followed', () => {
  const folder = '2026-11-13-boundary-owned-hint'
  assert.equal(matchArchived('feature/boundary-owned-hint', [folder], 'boundary-owned-hint'), folder)
  assert.equal(matchArchived('develop', [folder], 'boundary-owned-hint'), null) // the branch must name it too
  assert.equal(matchArchived('feature/boundary-owned-hint-2', [folder], 'boundary-owned-hint'), folder)
})

test('TC-7 readChange: lastChangeId names the archived folder; the change comes back archived', () => {
  const r = readChange(OPEN_CHANGES, ARCHIVED_CHANGES, 'boundary-owned-hint', 'feature/boundary-owned-hint', APPETITES)
  assert.equal(r.change?.id, 'boundary-owned-hint')
  assert.equal(r.change?.archived, true)
  assert.equal(r.openChanges, OPEN_CHANGES.length)
  assert.equal(readChange(OPEN_CHANGES, ARCHIVED_CHANGES, null, 'feature/boundary-owned-hint', APPETITES).change, null)
})

test('an open change is preferred to an archived one', () => {
  const r = readChange([file('navigator')], ARCHIVED_CHANGES, 'navigator', 'fix/navigator', APPETITES)
  assert.equal(r.change?.archived, false)
})

test('fixtures: the open changes of a synthetic repository, one without tasks', () => {
  assert.deepEqual(ids(OPEN_CHANGES).slice(-1), ['release-pipeline'])
  const r = readChange(OPEN_CHANGES, [], null, 'docs/shape-release-pipeline', APPETITES)
  assert.equal(r.change?.hasTasks, false)
  assert.equal(readChange(OPEN_CHANGES, [], null, 'feature/navigator-follows-the-work-stage-1', APPETITES).change?.id,
    'navigator-follows-the-work')
})

// ---------------------------------------------------------------- adversarial (stage 1)
test('progress: CRLF tasks.md counts the same as LF', () => {
  const lf = '## 1. One\n- [x] 1.1 a\n- [ ] 1.2 b\n## 2. Two\n- [x] 2.1 c\n'
  assert.deepEqual(progress(lf.replaceAll('\n', '\r\n')), progress(lf))
})

test('progress: indented boxes count; "* [ ]" boxes do not (design names "- [ ]" only)', () => {
  const tasks = '## G\n  - [ ] a\n\t- [x] b\n* [ ] c\n1. [ ] d\n'
  assert.deepEqual(progress(tasks), { done: 1, total: 2, groups: [{ title: 'G', done: 1, total: 2 }] })
})

test('progress: boxes before any ## heading are not counted; "- [X]" is done', () => {
  assert.deepEqual(progress('- [ ] orphan\n## G\n- [X] a\n'),
    { done: 1, total: 1, groups: [{ title: 'G', done: 1, total: 1 }] })
})

test('progress: roadmap variants are skipped, a heading that merely starts with the word is not', () => {
  const tasks = [
    '## Roadmap (draft)', '- [ ] r1',
    '## roadmap', '- [ ] r2',
    '## Roadmapping', '- [ ] counted',
    '## Real', '- [x] ok',
  ].join('\n')
  assert.deepEqual(progress(tasks).groups.map(g => g.title), ['Roadmapping', 'Real'])
  assert.equal(progress(tasks).total, 2)
})

test('progress: boxes after the roadmap and before the next ## are not leaked into the previous group', () => {
  assert.deepEqual(progress('## A\n- [x] a\n## Roadmap\n- [ ] r\n').groups, [{ title: 'A', done: 1, total: 1 }])
})

test('progress: empty, whitespace and heading-only files give zeros', () => {
  const zero = { done: 0, total: 0, groups: [] }
  assert.deepEqual(progress(''), zero)
  assert.deepEqual(progress(null), zero)
  assert.deepEqual(progress('\n\n  \n'), zero)
  assert.deepEqual(progress('## Empty\n## Also empty\n'), zero)
})

test('progress: a "###" subheading is not a group; its boxes stay in the enclosing group', () => {
  assert.deepEqual(progress('## G\n### sub\n- [x] a\n').groups, [{ title: 'G', done: 1, total: 1 }])
})

test('appetite: the section as the last one, with no trailing newline', () => {
  assert.equal(appetiteOf('# P\n\n## Appetite\n\nSMALL', APPETITES), 'SMALL')
  assert.equal(appetiteOf('## Appetite', APPETITES), null)
})

test('appetite: the paragraph ends at the next ## heading even without a blank line', () => {
  assert.equal(appetiteOf('## Appetite\nMEDIUM\n## Problem\nHUGE\n', APPETITES), 'MEDIUM')
})

test('appetite: CRLF proposal', () => {
  assert.equal(appetiteOf('## Appetite\r\n\r\nSMALL — one stage.\r\n\r\n## Problem\r\nHUGE\r\n', APPETITES), 'SMALL')
})

test('appetite: a name inside another word is not the appetite', () => {
  assert.equal(appetiteOf('## Appetite\n\nSMALLER than first thought.\n', APPETITES), null)
})

test('appetite: "## Appetite notes" is not the Appetite heading; only the first Appetite section counts', () => {
  assert.equal(appetiteOf('## Appetite notes\n\nSMALL\n', APPETITES), null)
  assert.equal(appetiteOf('## Appetite\n\nTINY\n\n## Appetite\n\nHUGE\n', APPETITES), 'TINY')
})

test('appetite: names with regex characters and the empty-string name do not throw or match everything', () => {
  assert.equal(appetiteOf('## Appetite\n\nS.ALL\n', ['S.ALL', '(x']), 'S.ALL')
  assert.equal(appetiteOf('## Appetite\n\nanything\n', ['']), null)
})

test('readChange: ids that contain one another, the longest id in the branch wins', () => {
  const open = [file('nav'), file('navigator')]
  assert.equal(readChange(open, [], null, 'feature/navigator-1', APPETITES).change?.id, 'navigator')
  assert.equal(readChange(open, [], null, 'feature/nav-1', APPETITES).change?.id, 'nav')
})

test('readChange: carries planMtime', () => {
  const f = { ...file('navigator'), planMtime: 77 }
  assert.equal(readChange([f], [], null, 'feature/navigator-1', APPETITES).change?.planMtime, 77)
})

test('readChange: empty proposal and null tasks give a change with null appetite and zero progress', () => {
  const r = readChange([{ id: 'x', proposal: '', tasks: null, design: false, planMtime: 0 }], [], null, 'x', APPETITES)
  assert.deepEqual(r.change, { id: 'x', appetite: null, done: 0, total: 0, groups: [], planMtime: 0, hasDesign: false,
    hasTasks: false, archived: false })
})

test('appetitesOf: the epic-delivery reviews keys; nothing for a missing or odd workflow', () => {
  assert.deepEqual(appetitesOf({ reviews: { SMALL: {}, 'VERY LARGE': {} } }), ['SMALL', 'VERY LARGE'])
  for (const odd of [null, undefined, 'x', {}, { reviews: null }, { reviews: 'x' }]) assert.deepEqual(appetitesOf(odd), [])
})

test('the change predicates of design §6.1', () => {
  const c = (done: number, total: number, hasDesign = true, hasTasks = true) =>
    ({ id: 'x', appetite: null, done, total, groups: [], planMtime: 0, hasDesign, hasTasks, archived: false })
  assert.ok(holds('none', null) && !holds('proposal', null))
  assert.ok(holds('proposal', c(0, 0, false, false)) && !holds('proposal', c(0, 3)))
  assert.ok(holds('plan', c(0, 3)) && holds('tasks-open', c(0, 3)) && !holds('plan', c(1, 3)))
  assert.ok(holds('tasks-no-design', c(0, 3, false)) && !holds('tasks-no-design', c(0, 3)))
  assert.ok(holds('tasks-partial', c(1, 3)) && !holds('tasks-partial', c(3, 3)))
  assert.ok(holds('tasks-done', c(3, 3)) && !holds('tasks-done', c(0, 0)))
})
