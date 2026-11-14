// Adversarial tests of the navigator's `criteria` shape rule (test-strategy D-5, D-16).
// The CASES list is kept parallel to CASES in tests/test_workflow_criteria_adversarial.py: same labels, same order.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseWorkflow, resolveWorkflows, type Source } from './workflow.ts'

const minimal = (over: object = {}) => JSON.stringify({
  name: 'epic-delivery', title: 'T', owner: 'epic-delivery', activate: {},
  phases: [{ id: 'apply', owner: 'epic-delivery', expect: [], enter: {} }], ...over })
const src = (path: string, text: string): Source => ({ path, text })
const GOOD = { succeeds: 'tests pass', fails: 'a test is red' }
const phase = (extra: object) => ({ id: 'apply', owner: 'o', expect: [], enter: {}, ...extra })
const withPhases = (...phases: unknown[]) => src('docs/navigator/c.workflow.json', minimal({ phases }))
const withCriteria = (criteria: unknown) => withPhases(phase({ criteria }))
const errorsOf = (s: Source) => resolveWorkflows([], [s]).errors
const MESSAGE = 'workflow file docs/navigator/c.workflow.json: phases[0].criteria must be {succeeds, fails}, each a non-empty string'

const s = (succeeds: unknown, fails: unknown = 'b') => ({ succeeds, fails })

// [label, criteria value, valid per D-5]
const CASES: [string, unknown, boolean][] = [
  ['good pair', GOOD, true],
  ['text padded with spaces', s('  a  ', ' b '), true],
  ['non-ASCII text', s('é à 日本', 'ünïcode'), true],
  ['very long strings (200000 chars)', s('x'.repeat(200000), 'y'.repeat(200000)), true],
  ['wrong pair (succeeds, passes)', { succeeds: 'x', passes: 'y' }, false],
  ['wrong pair (passes, fails)', { passes: 'x', fails: 'y' }, false],
  ['right pair plus a third key', { succeeds: 'a', fails: 'b', extra: 'c' }, false],
  ['keys differ in case', { Succeeds: 'a', Fails: 'b' }, false],
  ['key with a trailing space', { 'succeeds ': 'a', fails: 'b' }, false],
  ['key with a leading space', { succeeds: 'a', ' fails': 'b' }, false],
  ['only succeeds', { succeeds: 'a' }, false],
  ['only fails', { fails: 'b' }, false],
  ['empty object', {}, false],
  ['succeeds is an object', s({ a: 1 }), false],
  ['fails is an object', s('a', { a: 1 }), false],
  ['succeeds is a list', s(['a']), false],
  ['fails is a list', s('a', ['b']), false],
  ['succeeds is a number', s(1), false],
  ['fails is a number', s('a', 0), false],
  ['succeeds is true', s(true), false],
  ['fails is false', s('a', false), false],
  ['succeeds is null', s(null), false],
  ['fails is null', s('a', null), false],
  ['criteria false', false, false],
  ['criteria true', true, false],
  ['criteria 0', 0, false],
  ['criteria 1', 1, false],
  ['criteria empty string', '', false],
  ['criteria text', 'succeeds and fails', false],
  ['criteria empty list', [], false],
  ['criteria list of the two strings', ['succeeds', 'fails'], false],
  ['criteria null', null, false],
  ['succeeds empty', s(''), false],
  ['fails empty', s('a', ''), false],
  ['both empty', s('', ''), false],
  ['succeeds spaces only', s('   '), false],
  ['fails spaces only', s('a', '   '), false],
  ['tab only', s('\t'), false],
  ['newline only', s('\n'), false],
  ['CRLF only', s('\r\n'), false],
  ['vertical tab and form feed only', s('\u000b\u000c'), false],
  ['non-breaking space only', s(' '), false],
  ['em space only', s(' '), false],
  ['ideographic space only', s('　'), false],
  ['line and paragraph separator only', s('  '), false],
  ['mixed ASCII and Unicode whitespace only', s(' \t\n 　 '), false],
  ['fails non-breaking space only', s('a', ' '), false],
]

// D-16 says "whitespace-only counts as empty" and does not define whitespace. JS trim() and Python strip()
// differ on these; the verdict is unspecified, but it must be the same in both validators.
const UNSPECIFIED: [string, unknown][] = [
  ['BOM / zero-width no-break space only', s('﻿')],
  ['next line (U+0085) only', s('\u0085')],
  ['file separator (U+001C) only', s('\u001c')],
  ['group separator (U+001D) only', s('\u001d')],
  ['record separator (U+001E) only', s('\u001e')],
  ['unit separator (U+001F) only', s('\u001f')],
  ['zero-width space only', s('​')],
  ['Mongolian vowel separator only', s('᠎')],
  ['newline inside a text (D-5 says one line)', s('line one\nline two')],
]
export const PARALLEL = [...CASES.map(([l]) => l), ...UNSPECIFIED.map(([l]) => l)]

for (const [label, criteria, valid] of CASES) {
  test(`criteria: ${label} is ${valid ? 'accepted' : 'rejected'}`, () => {
    assert.deepEqual(errorsOf(withCriteria(criteria)), valid ? [] : [MESSAGE])
  })
}

test('criteria absent is accepted (optional for the navigator)', () => {
  assert.deepEqual(errorsOf(withPhases(phase({}))), [])
})

test('criteria written as undefined-looking JSON null is rejected, not treated as absent', () => {
  assert.deepEqual(errorsOf(src('docs/navigator/c.workflow.json',
    minimal().replace('"enter":{}', '"enter":{},"criteria":null'))), [MESSAGE])
})

test('unspecified whitespace and newline cases never crash the navigator', () => {
  for (const [label, criteria] of UNSPECIFIED) {
    assert.doesNotThrow(() => errorsOf(withCriteria(criteria)), label)
  }
})

test('criteria is checked on every phase, and the message names the second phase', () => {
  const e = errorsOf(withPhases(phase({ criteria: GOOD }), phase({ id: 'two', criteria: {} })))
  assert.deepEqual(e, ['workflow file docs/navigator/c.workflow.json: phases[1].criteria must be {succeeds, fails}, each a non-empty string'])
})

test('good criteria on every phase of a default file are accepted too', () => {
  const r = resolveWorkflows([withPhases(phase({ criteria: GOOD }), phase({ id: 'two', criteria: GOOD }))], [])
  assert.deepEqual(r.errors, [])
})

test('bad criteria in a default file are rejected as in a repo file', () => {
  const r = resolveWorkflows([src('skills/a/assets/workflows/a.workflow.json', minimal({ phases: [phase({ criteria: {} })] }))], [])
  assert.deepEqual(r.errors,
    ['workflow file skills/a/assets/workflows/a.workflow.json: phases[0].criteria must be {succeeds, fails}, each a non-empty string'])
})

// ------------------------------------------------------------------ where the key sits
test('criteria at the top level of the workflow is rejected', () => {
  assert.equal(errorsOf(src('docs/navigator/c.workflow.json', minimal({ criteria: GOOD }))).length, 1)
})

test('criteria inside enter is rejected', () => {
  assert.equal(errorsOf(withPhases(phase({ enter: { criteria: GOOD } }))).length, 1)
})

test('criteria in a variant is rejected', () => {
  const r = errorsOf(src('docs/navigator/c.workflow.json',
    minimal({ variants: [{ name: 'v', phases: ['apply'], criteria: GOOD }] })))
  assert.equal(r.length, 1)
})

test('a phase that is a string, a list, null or a number is rejected without a crash', () => {
  for (const p of ['x', [], null, 3, true]) {
    assert.equal(errorsOf(withPhases(p)).length, 1, JSON.stringify(p))
  }
})

test('phases holding null next to a good phase is rejected without a crash', () => {
  assert.equal(errorsOf(withPhases(phase({ criteria: GOOD }), null)).length, 1)
})

test('phases that is not a list is rejected', () => {
  for (const p of ['x', {}, null, 3]) {
    assert.equal(errorsOf(src('docs/navigator/c.workflow.json', minimal({ phases: p }))).length, 1, JSON.stringify(p))
  }
})

test('a phase with valid criteria but no id is rejected', () => {
  const { id: _id, ...noId } = phase({ criteria: GOOD })
  assert.equal(errorsOf(withPhases(noId)).length, 1)
})

test('duplicate phase ids with good criteria are rejected', () => {
  assert.equal(errorsOf(withPhases(phase({ criteria: GOOD }), phase({ criteria: GOOD }))).length, 1)
})

test('a phase with an unknown key next to good criteria is rejected', () => {
  assert.equal(errorsOf(withPhases(phase({ criteria: GOOD, criterias: GOOD }))).length, 1)
})

// ------------------------------------------------------------------ the file itself
test('a file that is valid JSON but a list, a string, a number or null is an error, not a crash', () => {
  for (const text of ['[]', '"x"', '3', 'null', 'true']) {
    const r = parseWorkflow(src('f', text), 'repo')
    assert.ok('error' in r, text)
  }
})

test('an empty file and a whitespace-only file are errors, not a crash', () => {
  for (const text of ['', '  \n']) assert.ok('error' in parseWorkflow(src('f', text), 'repo'), JSON.stringify(text))
})

test('a file with a UTF-8 BOM is an error, not a crash', () => {
  const r = parseWorkflow(src('f', '﻿' + minimal()), 'repo')
  assert.ok('error' in r)
})

test('a file nested 100000 levels deep is an error, not a crash', () => {
  const r = parseWorkflow(src('f', '['.repeat(100000) + ']'.repeat(100000)), 'repo')
  assert.ok('error' in r)
})
