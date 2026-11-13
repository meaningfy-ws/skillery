// The epic-delivery workflow data after lean-delivery stage 3 (D-9): apply → accept → archive, engine-checked landings.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { progress } from './change.ts'
import { EMPTY, reduce, type Change, type NavState, type Signal } from './state.ts'
import { resolveWorkflows } from './workflow.ts'

const REPO = join(import.meta.dirname, '..', '..', '..')
const file = (skill: string, name: string) => {
  const path = `skills/${skill}/assets/workflows/${name}.workflow.json`
  return { path, text: readFileSync(join(REPO, path), 'utf8') }
}
const defaults = resolveWorkflows([file('epic-delivery', 'epic-delivery'), file('technical-writing', 'documentation')], [])

let n = 0
const id = () => `e${++n}`
// An inline tasks.md (the change's own file moves at archive): build tasks ticked, the docs stage and the close plain lines.
const ticked = ['## Stage 1 — Build', '- [x] 1.1 first', '- [x] 1.2 second', '- [x] 1.3 third', '',
  '## Stage 5 — Docs', '- D.1 write the docs', '', '## Close (not counted)', '- C.1 archive', ''].join('\n')
const change = (over: Partial<Change> = {}): Change =>
  ({ id: 'lean-delivery', appetite: 'LARGE', ...progress(ticked), planHash: '', hasDesign: true, hasTasks: true, archived: false, ...over })
function run(...signals: Signal[]): NavState {
  return signals.reduce(reduce, reduce(EMPTY, { kind: 'Started', id: id(), sessionId: 's', band: 'folded', statusLine: true, interactive: true }))
}
const workflows = (): Signal => ({ kind: 'WorkflowsRead', id: id(), workflows: defaults.workflows, errors: [], mode: 'loose', at: 1 })
const read = (c: Change | null, at = 2): Signal => ({ kind: 'ChangeRead', id: id(), change: c, openChanges: c ? 1 : 0, at })
const skill = (name: string, at: number): Signal => ({ kind: 'SkillLoaded', id: id(), name, at })
const cmd = (command: string, at: number, ok = true): Signal => ({ kind: 'ToolRan', id: id(), command, ok, at })
const write = (path: string, at: number): Signal => ({ kind: 'FileTouched', id: id(), path, at })
const where = (s: NavState) => [s.workflow, s.variant, s.phase]

test('a tasks.md with the build boxes ticked and plain docs and close lines counts the build tasks only and places accept', () => {
  const c = change()
  assert.ok(c.total > 0 && c.done === c.total, `${c.done}/${c.total}`)
  assert.deepEqual(where(run(workflows(), read(c), skill('epic-delivery', 3))), ['epic-delivery', null, 'accept'])
})

test('accept: the acceptance file passes the acceptance gate and the phase stays accept', () => {
  const s = run(workflows(), read(change()), skill('epic-delivery', 3),
    write('openspec/changes/lean-delivery/evidence/acceptance.md', 4))
  assert.equal(s.gates.acceptance?.state, 'ok')
  assert.equal(s.phase, 'accept')
})

test('openspec-archive-change after the documentation workflow lands in archive', () => {
  const s = run(workflows(), read(change()), skill('epic-delivery', 3), skill('technical-writing', 4))
  assert.equal(s.workflow, 'documentation')
  assert.deepEqual(where(reduce(s, skill('openspec-archive-change', 5))), ['epic-delivery', null, 'archive'])
})

test('spec-stewardship alone lands in accept while the tasks are done (archive needs openspec-archive-change)', () => {
  assert.deepEqual(where(run(workflows(), read(change()), skill('spec-stewardship', 3))), ['epic-delivery', null, 'accept'])
})

test('brownfield: done tasks land in accept; the phases are apply, accept, archive', () => {
  const s = run(workflows(), read(change({ hasDesign: false, done: 3, total: 3 })), skill('epic-delivery', 3))
  assert.deepEqual(where(s), ['epic-delivery', 'brownfield', 'accept'])
  const mid = run(workflows(), read(change({ hasDesign: false, done: 1, total: 3 })))
  assert.deepEqual(where(mid), ['epic-delivery', 'brownfield', 'apply'])
})

test('only the exact `make check-all` passes full-gates; other targets do not', () => {
  const at = (c: string) => run(workflows(), read(change({ done: 3, total: 9 })), cmd(c, 5)).gates['full-gates']?.state ?? 'none'
  assert.equal(at('make check-all'), 'ok')
  assert.equal(at('make validate'), 'none')
  assert.equal(at('make check-architecture'), 'none')
  assert.equal(at('make check-all-fast'), 'none')
  assert.equal(at('make check-all -n'), 'none')
  assert.equal(at('make check-all --dry-run'), 'none')
})
