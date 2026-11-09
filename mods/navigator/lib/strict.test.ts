import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { EMPTY, reduce, type Change, type NavState, type Signal } from './state.ts'
import { decideArchive, decideCommit, decideSpawn, reminder } from './strict.ts'
import { modeText } from './view.ts'
import { resolveWorkflows } from './workflow.ts'

const REPO = join(import.meta.dirname, '..', '..', '..')
const path = 'skills/epic-delivery/assets/workflows/build-tier.workflow.json'
const { workflows } = resolveWorkflows([{ path, text: readFileSync(join(REPO, path), 'utf8') }], [])
let n = 0
const id = () => `s${++n}`
const change: Change = { id: 'x', appetite: 'SMALL', done: 3, total: 9, groups: [], planMtime: 0, hasDesign: true, hasTasks: true }
const started = (): Signal => ({ kind: 'Started', id: id(), sessionId: 's', band: 'folded', statusLine: true, interactive: true })
const read = (mode: 'loose' | 'strict'): Signal[] => [
  { kind: 'WorkflowsRead', id: id(), workflows, errors: [], mode, at: 1 },
  { kind: 'ChangeRead', id: id(), change, openChanges: 1, at: 2 },
  { kind: 'SkillLoaded', id: id(), name: 'epic-delivery', at: 3 },
]
const run = (...signals: Signal[]): NavState => signals.reduce(reduce, EMPTY)
const denied = (d: ReturnType<typeof decideCommit>) => 'deny' in d

test('TC-04 (b) strict: the first commit without test-driven-development is denied, with reason and way out', () => {
  const d = decideCommit(run(started(), ...read('strict')))
  assert.ok('deny' in d)
  assert.match(d.deny, /^navigator \(strict, navigator-strict-commit\): commit in apply without test-driven-development\. Way out: \/test-driven-development · \/navigator accept process:missing:apply:test-driven-development "<reason>" · \/navigator mode loose$/)
})

test('TC-04 (c) strict after test-driven-development loads: allowed', () => {
  assert.deepEqual(decideCommit(run(started(), ...read('strict'), { kind: 'SkillLoaded', id: id(), name: 'test-driven-development', at: 4 })), { allow: true })
})

test('TC-04 (a) loose never decides against a commit', () => {
  assert.deepEqual(decideCommit(run(started(), ...read('loose'))), { allow: true })
})

test('TC-14 strict: deny; drop to loose: allow; a new session is strict again', () => {
  const s = run(started(), ...read('strict'))
  assert.ok(denied(decideCommit(s)))
  const loose = reduce(s, { kind: 'SetMode', id: id(), mode: 'loose' })
  assert.deepEqual(decideCommit(loose), { allow: true })
  assert.equal(modeText(loose), '○ loose (strict dropped)')
  assert.ok(denied(decideCommit(run(started(), ...read('strict'), started(), ...read('strict')))))
})

test('the Mode switch works both ways: a loose repo can try strict for the session (DD-35)', () => {
  const s = reduce(run(started(), ...read('loose')), { kind: 'SetMode', id: id(), mode: 'strict' })
  assert.ok(denied(decideCommit(s)))
  assert.equal(modeText(s), '● strict (this session)')
  assert.equal(reduce(s, { kind: 'SetMode', id: id(), mode: 'loose' }).mode.session, null)
})

test('an accepted key is not denied again', () => {
  const s = reduce(run(started(), ...read('strict')),
    { kind: 'Accepted', id: id(), keys: ['process:missing:apply:test-driven-development'] })
  assert.deepEqual(decideCommit(s), { allow: true })
})

test('archive is denied while plan or process drift is open, allowed once accepted', () => {
  const s = run(started(), ...read('strict'), { kind: 'ToolRan', id: id(), command: 'git commit -m x', ok: true, at: 5 })
  const d = decideArchive(s)
  assert.ok('deny' in d && d.deny.includes('navigator-strict-archive'))
  const ok = reduce(s, { kind: 'Accepted', id: id(), keys: s.warnings.map(w => w.key) })
  assert.deepEqual(decideArchive(ok), { allow: true })
})

test('spawn: an over-spawn is denied, a model above the parent is rewritten, loose does neither', () => {
  const s = run(started(), ...read('strict'))
  const over = { key: 'process:overspawn:t1', message: '6 reviewers, SMALL allows 1', remedy: null, owner: 'epic-delivery' }
  assert.ok('deny' in decideSpawn(s, over, null))
  assert.deepEqual(decideSpawn(s, null, 'sonnet'), { model: 'sonnet' })
  assert.deepEqual(decideSpawn(run(started(), ...read('loose')), over, 'sonnet'), { allow: true })
})

test('the reminder is built from file data only', () => {
  assert.equal(reminder(run(started(), ...read('strict'))),
    'Phase apply of Build-tier EPIC delivery (owner skill: epic-delivery). Expected: test-driven-development, cosmic-python. ' +
    'Gates: clarity, validate. Workflow file: skills/epic-delivery/assets/workflows/build-tier.workflow.json.')
  assert.equal(reminder(run(started(), ...read('loose'))), null)
})
