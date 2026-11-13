import { test } from 'node:test'
import assert from 'node:assert/strict'
import { groupDone } from './change.ts'
import { EMPTY, type NavState } from './state.ts'
import { bandView, lineText, shortTitle, toneOf } from './view.ts'

const env = { now: 0, home: '', commands: [] }
const rowOf = (s: NavState, label: string) => bandView(s, env).details.rows.find(r => r.label === label)

const apply: NavState = {
  ...EMPTY,
  change: { id: 'navigator', appetite: 'VERY LARGE', done: 12, total: 40, groups: [], planMtime: 0, hasDesign: true, hasTasks: true, archived: false },
  openChanges: 1,
  phase: 'apply',
}

const staged: NavState = { ...apply, change: { ...apply.change!, done: 9, total: 41, groups: [
  { title: '1. Stage 1 — See it', done: 9, total: 12 }, { title: '2. Stage 2 — Follow the workflow', done: 0, total: 12 },
  { title: '3. Stage 3 — Stay on plan and lean', done: 0, total: 13 }, { title: '4. Close', done: 0, total: 4 }] } }

test('TC-01 the line names change, appetite, the stage with its phase and progress, and the whole (DD-35)', () => {
  assert.equal(lineText(staged), 'navigator · VERY LARGE · Stage 1 — See it apply 9/12 · 9/41')
  assert.equal(lineText(apply), 'navigator · VERY LARGE · apply 12/40') // a tasks.md with no ## groups
})

test('the line before the phase and appetite are known: nothing unknown is shown', () => {
  const s = { ...staged, phase: null, openChanges: 4, change: { ...staged.change!, appetite: null } }
  assert.equal(lineText(s), 'navigator · Stage 1 — See it 9/12 · 9/41 · 3 more open')
})

test('strict shows; loose and strict dropped for the session do not (DD-35)', () => {
  assert.match(lineText({ ...apply, mode: { repo: 'strict', session: null } }), /· ● strict$/)
  assert.ok(!lineText({ ...apply, mode: { repo: 'strict', session: 'loose' } }).includes('strict'))
  assert.ok(!lineText(apply).includes('loose'))
})

test('the mode is always in Details', () => {
  assert.equal(bandView(apply, env).details.mode, '○ loose')
  assert.equal(bandView({ ...apply, mode: { repo: 'strict', session: 'loose' } }, env).details.mode, '○ loose (strict dropped)')
})

test('the stages row marks done, current and next, with short titles', () => {
  const s = { ...staged, change: { ...staged.change!, groups: [{ title: '1. Stage 1 — See it', done: 12, total: 12 },
    ...staged.change!.groups.slice(1)] } }
  assert.deepEqual(rowOf(s, 'stages')!.items,
    ['✓ 1 See it 12/12', '● 2 Follow the workflow 0/12', '○ 3 Stay on plan and lean 0/13', '○ Close 0/4'])
  assert.equal(shortTitle('Verification'), 'Verification')
})

test('TC-02 (view) no open change: the line says so, the band has no next step and no warning', () => {
  assert.equal(lineText(EMPTY), 'navigator · no repository')
  const v = bandView(EMPTY, env)
  assert.deepEqual([v.now, v.next, v.warning], ['no repository', null, null])
})

test('TC-10 hiding the band leaves the line text unchanged and complete', () => {
  const hidden = { ...apply, display: { band: 'hidden' as const, line: true } }
  assert.equal(lineText(hidden), lineText(apply))
})

test('the band: running subagents and the warning folded; subagents grouped by type in Details', () => {
  const s: NavState = {
    ...apply,
    parentModel: 'opus',
    subagents: [
      { agentId: 'a', toolUseId: 't', type: 'code-reviewer', model: 'sonnet', description: 'look', startedAt: 0, tokens: 0, done: false, rootPath: null, skills: [] },
      { agentId: 'b', toolUseId: 'u', type: 'implementer', model: 'opus', description: '', startedAt: 0, tokens: 12345, done: true, rootPath: null, skills: [] },
    ],
    gates: { validate: { state: 'ok', at: 1, detail: '' }, clarity: { state: 'none', at: 0, detail: '' } },
    warnings: [{ key: 'k', message: 'm', remedy: null, owner: 'x' }],
  }
  const v = bandView(s, env)
  assert.equal(v.now, 'apply · 12/40 · look → code-reviewer (0s)')
  assert.equal(v.warning, '⚠ m')
  assert.deepEqual(rowOf(s, 'subagents')!.items, ['code-reviewer · sonnet · 1 running', 'implementer done · 12.3k tokens'])
})

test('the line never exceeds 120 characters', () => {
  const long = { ...apply, change: { ...apply.change!, id: 'x'.repeat(200) } }
  assert.equal(lineText(long).length, 120)
})

// ---------------------------------------------------------------- adversarial (stage 1)
const withId = (id: string): NavState => ({ ...apply, change: { ...apply.change!, id } })

test('the line is exactly 120 characters without an ellipsis, 121 is cut with one', () => {
  const base = lineText(withId('a')).length
  const exact = lineText(withId('a'.repeat(1 + 120 - base)))
  assert.equal(exact.length, 120)
  assert.ok(!exact.includes('…'))
  const over = lineText(withId('a'.repeat(2 + 120 - base)))
  assert.equal(over.length, 120)
  assert.ok(over.endsWith('…'))
})

test('a long line is cut on whole characters: no half of a surrogate pair', () => {
  const text = lineText(withId('😀'.repeat(100)))
  assert.ok(text.isWellFormed(), 'lone surrogate in the status line')
  assert.ok([...text].length <= 120)
})

test('a multibyte line under the limit is not cut', () => {
  const text = lineText(withId('é'.repeat(30)))
  assert.ok(!text.includes('…'))
  assert.ok(text.includes('é'.repeat(30)))
})

test('zero tasks: the line and the band say 0/0 and never NaN', () => {
  const s = { ...apply, change: { ...apply.change!, done: 0, total: 0, groups: [] } }
  assert.equal(lineText(s), 'navigator · VERY LARGE · apply 0/0')
  assert.equal(rowOf(s, 'stages'), undefined)
})

test('the current stage is the first unfinished one; an empty group is never done', () => {
  const groups = [{ title: 'a', done: 2, total: 2 }, { title: 'b', done: 1, total: 2 }, { title: 'c', done: 0, total: 0 }]
  const s = { ...apply, change: { ...apply.change!, groups } }
  assert.deepEqual(rowOf(s, 'stages')!.items, ['✓ a 2/2', '● b 1/2', '○ c 0/0'])
  assert.equal(lineText({ ...s, phase: null }), 'navigator · VERY LARGE · b 1/2 · 12/40')
})

test('one open change shows no "+N"; a change with openChanges 0 never shows a negative', () => {
  assert.ok(!lineText({ ...apply, openChanges: 1 }).includes('+'))
  assert.ok(!lineText({ ...apply, openChanges: 0 }).includes('+'))
})

test('a phase with no tasks still prints', () => {
  assert.match(lineText({ ...apply, change: { ...apply.change!, done: 0, total: 0 } }), /apply 0\/0/)
})

test('band: no skills, all subagents done, no gates, no warnings', () => {
  const s: NavState = { ...EMPTY, subagents: [
    { agentId: 'a', toolUseId: 't', type: 'x', model: 'm', description: '', startedAt: 0, tokens: 0, done: true, rootPath: null, skills: [] }] }
  const v = bandView(s, env)
  assert.equal(v.warning, null)
  assert.deepEqual(rowOf(s, 'skills')!.items, [])
  assert.deepEqual(rowOf(s, 'subagents')!.items, ['x done'])
  assert.equal(rowOf(s, 'stages'), undefined)
})

test('band: the skill trail is the last 8, oldest first', () => {
  const skills = Array.from({ length: 10 }, (_, i) => ({ name: `s${i}`, at: i, phase: null }))
  assert.deepEqual(rowOf({ ...EMPTY, skills }, 'skills')!.items, ['s2, s3, s4, s5, s6, s7, s8, s9'])
})

test('groupDone: a group is done when it has tasks and all are ticked', () => {
  assert.deepEqual([{ done: 2, total: 2 }, { done: 1, total: 2 }, { done: 0, total: 0 }].map(g => groupDone({ title: 't', ...g })),
    [true, false, false])
})

test('tokens: 999 stays plain, 1000 becomes 1.0k', () => {
  const a = (tokens: number): NavState => ({ ...EMPTY, subagents: [
    { agentId: 'a', toolUseId: 't', type: 'x', model: 'm', description: '', startedAt: 0, tokens, done: true, rootPath: null, skills: [] }] })
  assert.deepEqual(rowOf(a(999), 'subagents')!.items, ['x done · 999 tokens'])
  assert.deepEqual(rowOf(a(1000), 'subagents')!.items, ['x done · 1.0k tokens'])
})

test('control characters in names never reach the line or the band', () => {
  const s: NavState = { ...apply, change: { ...apply.change!, id: 'evil\u001b]0;x\u0007' },
    skills: [{ name: 'a\u001b[2Jb', at: 1, phase: null }] }
  assert.equal(lineText(s), 'evil]0;x · VERY LARGE · apply 12/40')
  const v = bandView(s, env)
  assert.ok(!/[\u0000-\u001f]/.test([v.now, v.next, v.warning, v.details.reading, ...v.details.rows.flatMap(r => r.items)].join('')))
})

test('band tones: each glyph says done, now, to do, failed or warning; plain text has none', () => {
  const tones = ['✓ a 2/2', '● b', '○ c', '✗ x', '⚠ 3', 'validate ✗', 'tests ✓', 'clarity ✓ 9.1', 'MEDIUM', '✓ accepted: y']
    .map(toneOf)
  assert.deepEqual(tones, ['done', 'now', 'todo', 'fail', 'warn', 'fail', 'done', 'done', null, 'done'])
})

test('a stage heading drops its explanation after a dash; Stage n headings keep their name', () => {
  assert.equal(shortTitle('2. Service-written roots (#55) — BREAKING for generic writes'), 'Service-written roots (#55)')
  assert.equal(shortTitle('1. Stage 1 — See it'), '1 See it')
})

test('the folded warning: the top message by tier, the other open ones counted', () => {
  const w = (key: string, message = key) => ({ key, message, remedy: null, owner: 'epic-planning' })
  const s: NavState = { ...EMPTY, warnings: [w('plan:outside:a.py'), w('plan:outside:b.py'), w('plan:outside:c.py'), w('gate', 'gate open')] }
  assert.equal(bandView(s, env).warning, '⚠ 4 warnings · plan:outside:c.py') // tier 2 before the unknown prefix (3); newest first
})
