import { test } from 'node:test'
import assert from 'node:assert/strict'
import { appetiteOf, appetitesOf, progress, readChange, type ChangeFiles } from './change.ts'

const APPETITES = ['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'VERY LARGE', 'HUGE']

const file = (id: string, mtime: number, tasks: string | null = null): ChangeFiles =>
  ({ id, proposal: '## Appetite\n\nVERY LARGE — three stages.\n\n## Problem\nSMALL bits\n', tasks, mtime, planMtime: 0 })

test('appetite: the longest name in the first paragraph under ## Appetite', () => {
  assert.equal(appetiteOf(file('x', 0).proposal, APPETITES), 'VERY LARGE')
  assert.equal(appetiteOf('## Appetite\n\nSome size.\n\nSMALL later', APPETITES), null)
  assert.equal(appetiteOf('no section', APPETITES), null)
  assert.equal(appetiteOf(file('x', 0).proposal, []), null)
})

test('progress counts boxes per group, not the roadmap', () => {
  const tasks = '## 1. One\n- [x] 1.1 a\n- [ ] 1.2 b\n## 2. Two\n- [x] 2.1 c\n## Roadmap\n- [ ] 1.1 · [ ] 1.2\n## Verification\ntext\n'
  assert.deepEqual(progress(tasks), {
    done: 2, total: 3,
    groups: [{ title: '1. One', done: 1, total: 2 }, { title: '2. Two', done: 1, total: 1 }],
  })
})

test('TC-18 three open changes, the branch names one: that one, +2', () => {
  const r = readChange([file('alpha', 3), file('navigator', 1), file('beta', 2)], 'feature/navigator-1', APPETITES)
  assert.equal(r.change?.id, 'navigator')
  assert.equal(r.openChanges, 3)
})

test('no branch match: the most recently modified', () => {
  assert.equal(readChange([file('alpha', 3), file('beta', 5)], 'develop', APPETITES).change?.id, 'beta')
})

test('TC-02 (change) no open change', () => {
  assert.deepEqual(readChange([], 'develop', APPETITES), { change: null, openChanges: 0 })
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
  const open = [file('nav', 9), file('navigator', 1)]
  assert.equal(readChange(open, 'feature/navigator-1', APPETITES).change?.id, 'navigator')
  assert.equal(readChange(open, 'feature/nav-1', APPETITES).change?.id, 'nav')
})

test('readChange: a branch holding two ids picks the longer one, whatever the order of the folders', () => {
  const a = [file('alpha', 1), file('beta', 9)]
  assert.equal(readChange(a, 'x/beta-alpha', APPETITES).change?.id, 'alpha')
  assert.equal(readChange([...a].reverse(), 'x/beta-alpha', APPETITES).change?.id, 'alpha')
})

test('readChange: equal-length ids both in the branch is deterministic across folder order', () => {
  const a = [file('aaa', 1), file('bbb', 1)]
  assert.equal(readChange(a, 'aaa-bbb', APPETITES).change?.id, readChange([...a].reverse(), 'aaa-bbb', APPETITES).change?.id)
})

test('readChange: equal mtimes and an empty branch name still pick a change and never throw', () => {
  const r = readChange([file('a', 5), file('b', 5)], '', APPETITES)
  assert.ok(r.change)
  assert.equal(r.openChanges, 2)
})

test('readChange: carries planMtime; ids are matched case-sensitively', () => {
  const f = { ...file('Navigator', 1), planMtime: 77 }
  assert.equal(readChange([f], 'feature/navigator-1', APPETITES).change?.planMtime, 77) // falls back to most recent
  assert.equal(readChange([f, file('zzz', 99)], 'feature/navigator-1', APPETITES).change?.id, 'zzz') // ids are case-sensitive
})

test('readChange: empty proposal and null tasks give a change with null appetite and zero progress', () => {
  const r = readChange([{ id: 'x', proposal: '', tasks: null, mtime: 0, planMtime: 0 }], 'x', APPETITES)
  assert.deepEqual(r.change, { id: 'x', appetite: null, done: 0, total: 0, groups: [], planMtime: 0 })
})

test('appetitesOf: the build-tier reviews keys; nothing for a missing or odd workflow', () => {
  assert.deepEqual(appetitesOf({ reviews: { SMALL: {}, 'VERY LARGE': {} } }), ['SMALL', 'VERY LARGE'])
  for (const odd of [null, undefined, 'x', {}, { reviews: null }, { reviews: 'x' }]) assert.deepEqual(appetitesOf(odd), [])
})

test('readChange: equal-length ids in the branch, the most recent wins', () => {
  assert.equal(readChange([file('aaa', 1), file('bbb', 5)], 'aaa-bbb', APPETITES).change?.id, 'bbb')
  assert.equal(readChange([file('aaa', 5), file('bbb', 1)], 'aaa-bbb', APPETITES).change?.id, 'aaa')
})
