import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ADDED_CAP, parseDiffAdded, parseStatus, planDrift, type PlanInput } from './plan-drift.ts'
import { archiveCheck, appendDeviation, parseDeviations } from './deviations.ts'

const input = (over: Partial<PlanInput> = {}): PlanInput => ({
  changed: [], added: [], tasks: '', design: '', proposal: '', ignore: [], changeId: 'navigator', ...over })
const keys = (i: PlanInput) => planDrift(i).map(w => w.key)

test('TC-05 §6.4 worked example: uncovered path warns, archive check fails, passes after the deviation', () => {
  const i = input({
    tasks: '- [ ] 3.1 Build the band in `mods/navigator/lib/`\n',
    changed: ['mods/navigator/lib/view.ts', 'tools/repo_lint/lint.py'] })
  const ws = planDrift(i)
  assert.deepEqual(ws.map(w => w.key), ['plan:outside:tools/repo_lint/lint.py'])
  assert.equal(ws[0]!.remedy, 'openspec-update-change navigator')
  assert.equal(archiveCheck(ws, new Set()).ok, false)
  const text = appendDeviation(null, 'plan:outside:tools/repo_lint/lint.py', 'lint check added for DD-10', '2026-11-12')!
  const r = archiveCheck(ws, parseDeviations(text))
  assert.equal(r.ok, true)
  assert.deepEqual(r.open, [])
  assert.deepEqual(r.accepted, ['plan:outside:tools/repo_lint/lint.py'])
})

test('PL-1 coverage: exact path, parent folder of depth >= 2, stem >= 4 chars, ignore glob, the change folder', () => {
  const changed = ['a/b/c.ts', 'x/y/z/q.ts', 'docs/guide.md', 'p/q/ab.ts', 'build/out.js', 'openspec/changes/navigator/tasks.md', 'top/f.ts']
  const got = keys(input({ changed, tasks: 'see `a/b/c.ts` and x/y/ and the guide', design: 'top/', ignore: ['build/**'] }))
  // ab.ts: stem too short; top/f.ts: parent folder depth 1 does not cover
  assert.deepEqual(got, ['plan:outside:p/q/ab.ts', 'plan:outside:top/f.ts'])
})

test('PL-1 stem matches a whole word only', () => {
  assert.deepEqual(keys(input({ changed: ['src/x/view.ts'], proposal: 'a preview pane' })), ['plan:outside:src/x/view.ts'])
  assert.deepEqual(keys(input({ changed: ['src/x/view.ts'], proposal: 'the view band' })), [])
})

test('PL-2 ticked task whose path tokens did not change; unticked and token-less tasks are not judged', () => {
  const tasks = [
    '- [x] 1.1 Edit `lib/view.ts` and `README.md`',
    '- [x] 1.2 Write `lib/state.ts`',
    '- [ ] 1.3 Write `lib/other.ts`',
    '- [x] 1.4 Run `make validate`',
    '- [x] 1.5 Fill the folder `mods/navigator/docs/`',
  ].join('\n')
  const got = keys(input({ tasks, changed: ['mods/navigator/lib/view.ts', 'mods/navigator/docs/a.md'] }))
  assert.deepEqual(got, ['plan:ticked:1.2'])
})

test('PL-3 shortcut: or a new DD-/DEC- id that design.md does not mention, keyed by file:line', () => {
  const added = [
    { path: 'a/b/x.ts', line: 3, text: '// shortcut: no cache, add when slow' },
    { path: 'a/b/y.ts', line: 7, text: '// shortcut: fine, design names this file' },
    { path: 'a/b/z.ts', line: 9, text: '// DD-12 known, DEC-99 is new' },
    { path: 'a/b/w.ts', line: 1, text: '// per DD-12' },
    { path: 'build/gen.ts', line: 1, text: '// shortcut: ignored' },
  ]
  const got = keys(input({ added, design: 'a/b/y.ts DD-12 a/b/', ignore: ['build/**'] }))
  assert.deepEqual(got, ['plan:decision:a/b/x.ts:3', 'plan:decision:a/b/z.ts:9'])
})

test('PL-3 reads at most the first 2 000 added lines', () => {
  const added = Array.from({ length: ADDED_CAP + 5 }, (_, n) => ({ path: 'a/b/x.ts', line: n + 1, text: 'shortcut: s' }))
  assert.equal(planDrift(input({ added, design: '' })).length, ADDED_CAP)
})

test('parseDiffAdded reads git diff -U0 into added lines and caps them', () => {
  const diff = [
    'diff --git a/a/x.ts b/a/x.ts', '--- a/a/x.ts', '+++ b/a/x.ts',
    '@@ -1,0 +2,2 @@', '+one', '+two',
    '@@ -9 +10 @@', '-old', '+ten',
    'diff --git a/gone.ts b/gone.ts', '--- a/gone.ts', '+++ /dev/null', '@@ -1 +0,0 @@', '-bye',
  ].join('\n')
  const r = parseDiffAdded(diff)
  assert.deepEqual(r.added, [
    { path: 'a/x.ts', line: 2, text: 'one' }, { path: 'a/x.ts', line: 3, text: 'two' }, { path: 'a/x.ts', line: 10, text: 'ten' }])
  assert.equal(r.truncated, false)
  const big = ['+++ b/f.ts', '@@ -0,0 +1,2001 @@', ...Array.from({ length: ADDED_CAP + 1 }, () => '+l')].join('\n')
  const c = parseDiffAdded(big)
  assert.equal(c.added.length, ADDED_CAP)
  assert.equal(c.truncated, true)
})

test('parseStatus reads git status --porcelain paths, renames to the new path', () => {
  assert.deepEqual(parseStatus(' M a/x.ts\n?? new.md\nR  old.ts -> b/new.ts\n M "sp ace.ts"\n'),
    ['a/x.ts', 'new.md', 'b/new.ts', 'sp ace.ts'])
})
