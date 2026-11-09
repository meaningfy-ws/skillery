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
