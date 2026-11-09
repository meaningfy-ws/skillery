import { test } from 'node:test'
import assert from 'node:assert/strict'
import { appendDeviation, archiveCheck, parseDeviations } from './deviations.ts'

const w = (key: string) => ({ key, message: key, remedy: null, owner: 'x' })

test('creating the file writes a one-line header and the keyed line (design §8)', () => {
  const t = appendDeviation(null, 'plan:outside:tools/repo_lint/lint.py', 'lint check added for DD-10', '2026-11-12')!
  const lines = t.trimEnd().split('\n')
  assert.equal(lines.length, 2)
  assert.match(lines[0]!, /^# /)
  assert.equal(lines[1], '- 2026-11-12 · plan:outside:tools/repo_lint/lint.py · lint check added for DD-10')
})

test('TC-20 accepting the same key twice keeps one line', () => {
  const once = appendDeviation(null, 'plan:ticked:1.2', 'moved', '2026-11-12')!
  assert.equal(appendDeviation(once, 'plan:ticked:1.2', 'again', '2026-11-13'), null)
  assert.equal(once.split('\n').filter(l => l.includes('plan:ticked:1.2')).length, 1)
  const two = appendDeviation(once, 'plan:ticked:1.3', 'other', '2026-11-13')!
  assert.deepEqual([...parseDeviations(two)], ['plan:ticked:1.2', 'plan:ticked:1.3'])
})

test('appending to a file without a trailing newline keeps lines apart', () => {
  const t = appendDeviation('# Deviations\n- 2026-11-01 · a:b · r', 'c:d', 'r2', '2026-11-02')!
  assert.deepEqual([...parseDeviations(t)], ['a:b', 'c:d'])
})

test('a reason cannot break the Markdown line; a bad key or date is refused', () => {
  const t = appendDeviation(null, 'k:1', 'line one\nline two\r\n  three', '2026-11-12')!
  assert.equal(t.trimEnd().split('\n')[1], '- 2026-11-12 · k:1 · line one line two three')
  assert.throws(() => appendDeviation(null, 'k\n2', 'r', '2026-11-12'))
  assert.throws(() => appendDeviation(null, 'a · b', 'r', '2026-11-12'))
  assert.throws(() => appendDeviation(null, '', 'r', '2026-11-12'))
  assert.throws(() => appendDeviation(null, 'k:1', '   ', '2026-11-12'))
  assert.throws(() => appendDeviation(null, 'k:1', 'r', '12/11/2026'))
})

test('archive check: open plan and process drift fail; accepted and hygiene warnings do not', () => {
  const ws = [w('plan:outside:a/b.ts'), w('process:missing:apply:x'), w('hygiene:unused:y')]
  const r = archiveCheck(ws, new Set(['process:missing:apply:x']))
  assert.equal(r.ok, false)
  assert.deepEqual(r.open.map(x => x.key), ['plan:outside:a/b.ts'])
  assert.deepEqual(r.accepted, ['process:missing:apply:x'])
  assert.equal(archiveCheck([w('hygiene:unused:y')], new Set()).ok, true)
})
