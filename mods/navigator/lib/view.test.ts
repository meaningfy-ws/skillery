import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EMPTY, type NavState } from './state.ts'
import { bandModel, lineText } from './view.ts'

const apply: NavState = {
  ...EMPTY,
  change: { id: 'navigator', appetite: 'VERY LARGE', done: 12, total: 40, groups: [], planMtime: 0 },
  openChanges: 1,
  phase: 'apply',
  mainModel: 'opus',
}

test('TC-01 the line names change, appetite, phase and progress, driving agent and mode', () => {
  assert.equal(lineText(apply), '⎈ navigator · VERY LARGE · apply 12/40 · main opus · ○ loose')
})

test('the line before the phase and appetite are known', () => {
  const s = { ...apply, phase: null, mainModel: null, openChanges: 3,
    change: { ...apply.change!, appetite: null } }
  assert.equal(lineText(s), '⎈ navigator +2 · ? · 12/40 · ○ loose')
})

test('strict, and strict dropped for the session', () => {
  assert.match(lineText({ ...apply, mode: { repo: 'strict', sessionLoose: false } }), /· ● strict$/)
  assert.match(lineText({ ...apply, mode: { repo: 'strict', sessionLoose: true } }), /· ○ loose \(strict dropped\)$/)
})

test('TC-02 (view) no open change: the line says so, the band has no warning', () => {
  assert.equal(lineText(EMPTY), '⎈ no open change')
  assert.equal(bandModel(EMPTY).folded, '▸ 0 running')
})

test('TC-10 hiding the band leaves the line text unchanged and complete', () => {
  const hidden = { ...apply, display: { band: 'hidden' as const, line: true } }
  assert.equal(lineText(hidden), lineText(apply))
})

test('the band: running subagents, last skill, gates, warnings; unfolded rows', () => {
  const s: NavState = {
    ...apply,
    skills: [{ name: 'epic-delivery', at: 1 }, { name: 'clarity-gate', at: 2 }],
    subagents: [
      { agentId: 'a', toolUseId: 't', type: 'code-reviewer', model: 'sonnet', description: '', startedAt: 0, tokens: 0, done: false },
      { agentId: 'b', toolUseId: 'u', type: 'implementer', model: 'opus', description: '', startedAt: 0, tokens: 12345, done: true },
    ],
    gates: { validate: { state: 'ok', at: 1, detail: '' }, clarity: { state: 'none', at: 0, detail: '' } },
    warnings: [{ key: 'k', message: 'm' }],
  }
  const b = bandModel(s)
  assert.equal(b.folded, '▸ 1 running · last clarity-gate · validate ✓ · ⚠ 1')
  assert.deepEqual(b.rows.find(r => r.label === 'subagents')?.items,
    ['code-reviewer · sonnet · running', 'implementer · opus · done · 12.3k tokens'])
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
  assert.equal(lineText(s), '⎈ navigator · VERY LARGE · apply 0/0 · main opus · ○ loose')
  const progress = bandModel(s).rows.find(r => r.label === 'progress')!
  assert.deepEqual(progress.items, ['appetite VERY LARGE', 'tasks 0/0', 'groups 0/0'])
})

test('groups done counts only complete, non-empty groups', () => {
  const groups = [{ title: 'a', done: 2, total: 2 }, { title: 'b', done: 1, total: 2 }, { title: 'c', done: 0, total: 0 }]
  const s = { ...apply, change: { ...apply.change!, groups } }
  assert.equal(bandModel(s).rows.find(r => r.label === 'progress')!.items[2], 'groups 1/3')
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
    { agentId: 'a', toolUseId: 't', type: 'x', model: 'm', description: '', startedAt: 0, tokens: 0, done: true }] }
  const b = bandModel(s)
  assert.equal(b.folded, '▸ 0 running')
  assert.deepEqual(b.rows.find(r => r.label === 'skills')!.items, [])
  assert.deepEqual(b.rows.find(r => r.label === 'subagents')!.items, ['x · m · done · 0 tokens'])
  assert.equal(b.rows.find(r => r.label === 'progress'), undefined)
})

test('band: every gate state prints its glyph, none prints nothing, order follows the gates', () => {
  const g = (state: 'ok' | 'fail' | 'stale' | 'none') => ({ state, at: 1, detail: '' })
  const s: NavState = { ...EMPTY, gates: { validate: g('fail'), clarity: g('stale'), review: g('none'), tests: g('ok') } }
  assert.equal(bandModel(s).folded, '▸ 0 running · validate ✗ · clarity · · tests ✓')
})

test('band: only warnings, no last skill, no gates', () => {
  const s: NavState = { ...EMPTY, warnings: [{ key: 'a', message: '' }, { key: 'b', message: '' }] }
  assert.equal(bandModel(s).folded, '▸ 0 running · ⚠ 2')
})

test('band: the skill trail is the last 8, oldest first', () => {
  const skills = Array.from({ length: 10 }, (_, i) => ({ name: `s${i}`, at: i }))
  assert.deepEqual(bandModel({ ...EMPTY, skills }).rows.find(r => r.label === 'skills')!.items,
    ['s2', 's3', 's4', 's5', 's6', 's7', 's8', 's9'])
})

test('tokens: 999 stays plain, 1000 becomes 1.0k', () => {
  const a = (tokens: number): NavState => ({ ...EMPTY, subagents: [
    { agentId: 'a', toolUseId: 't', type: 'x', model: 'm', description: '', startedAt: 0, tokens, done: true }] })
  assert.deepEqual(bandModel(a(999)).rows[1]!.items, ['x · m · done · 999 tokens'])
  assert.deepEqual(bandModel(a(1000)).rows[1]!.items, ['x · m · done · 1.0k tokens'])
})

test('control characters in names never reach the line or the band', () => {
  const s: NavState = { ...apply, change: { ...apply.change!, id: 'evil\u001b]0;x\u0007' },
    skills: [{ name: 'a\u001b[2Jb', at: 1 }] }
  assert.equal(lineText(s), '⎈ evil]0;x · VERY LARGE · apply 12/40 · main opus · ○ loose')
  const b = bandModel(s)
  assert.ok(!/[\u0000-\u001f]/.test(b.folded + b.rows.flatMap(r => r.items).join('')))
})
