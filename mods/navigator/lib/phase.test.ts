import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { backOnTrack, commandFor, nextStep, validateRuns } from './actions.ts'
import { EMPTY, reduce, type Change, type NavState, type Signal } from './state.ts'
import { bandModel, lineText } from './view.ts'
import { resolveWorkflows } from './workflow.ts'

const REPO = join(import.meta.dirname, '..', '..', '..')
const file = (skill: string, name: string) => {
  const path = `skills/${skill}/assets/workflows/${name}.workflow.json`
  return { path, text: readFileSync(join(REPO, path), 'utf8') }
}
const defaults = resolveWorkflows([file('epic-delivery', 'build-tier'), file('architecture', 'architecting'),
  file('infrastructure-operations', 'devops'), file('sales-operations', 'sales')], [])

let n = 0
const id = () => `x${++n}`
const change = (done: number, total: number, over: Partial<Change> = {}): Change =>
  ({ id: 'navigator', appetite: 'VERY LARGE', done, total, groups: [], planMtime: 0, hasDesign: true, hasTasks: true, ...over })

function run(...signals: Signal[]): NavState {
  return signals.reduce(reduce, reduce(EMPTY, { kind: 'Started', id: id(), sessionId: 's', band: 'folded', statusLine: true, interactive: true }))
}
const workflows = (mode: 'loose' | 'strict' = 'loose'): Signal =>
  ({ kind: 'WorkflowsRead', id: id(), workflows: defaults.workflows, errors: [], mode, at: 1 })
const read = (c: Change | null, at = 2): Signal => ({ kind: 'ChangeRead', id: id(), change: c, openChanges: c ? 1 : 0, at })
const skill = (name: string, at: number): Signal => ({ kind: 'SkillLoaded', id: id(), name, at })
const cmd = (command: string, at: number, ok = true): Signal => ({ kind: 'ToolRan', id: id(), command, ok, at })
const keys = (s: NavState) => s.warnings.map(w => w.key)

test('the defaults resolve with no errors', () => assert.deepEqual(defaults.errors, []))

test('an open change with partial tasks places build-tier in apply; ticking all moves it to verify', () => {
  const s = run(workflows(), read(change(3, 9)))
  assert.deepEqual([s.workflow, s.variant, s.phase], ['build-tier', null, 'apply'])
  assert.equal(run(workflows(), read(change(3, 9)), read(change(9, 9), 3)).phase, 'verify')
  assert.equal(run(workflows(), read(null)).workflow, null)
})

test('a change with tasks and no design is the brownfield variant', () => {
  const s = run(workflows(), read(change(1, 3, { hasDesign: false })))
  assert.deepEqual([s.variant, s.phase], ['brownfield', 'apply'])
})

test('TC-04 (a) loose: a commit in apply without test-driven-development warns after the commit, with a remedy', () => {
  const s = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5), cmd('git commit -m "x"', 6))
  const w = s.warnings.find(w => w.key === 'process:missing:apply:test-driven-development')
  assert.ok(w, keys(s).join())
  assert.equal(w.remedy, 'test-driven-development')
  assert.equal(w.owner, 'epic-delivery')
  assert.equal(backOnTrack(s), 'test-driven-development')
})

test('a commit after test-driven-development ran in the phase does not warn; running the remedy clears it', () => {
  const ok = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5),
    skill('superpowers:test-driven-development', 6), cmd('git commit -m x', 7))
  assert.ok(!keys(ok).some(k => k.startsWith('process:missing:apply')))
  const fixed = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5), cmd('git commit -m x', 6),
    skill('superpowers:test-driven-development', 7))
  assert.ok(!keys(fixed).includes('process:missing:apply:test-driven-development'))
  assert.ok(!keys(run(workflows(), read(change(3, 9)), cmd('git commit -m x', 6, false))).length)
})

test('PD-2 leaving a phase without its exit skill; PD-3 command gate not passed on leaving', () => {
  const s = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5), read(change(9, 9), 6))
  assert.equal(s.phase, 'verify')
  assert.ok(keys(s).includes('process:missing:apply:cosmic-python'), keys(s).join())
  assert.ok(keys(s).includes('process:gate:apply:validate'))
  const passed = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5), skill('cosmic-python', 6),
    cmd('make validate', 7), read(change(9, 9), 8))
  assert.deepEqual(keys(passed).filter(k => k.startsWith('process:') && k.includes(':apply:')), [])
})

test('PD-3 skill gate: entering apply with no clarity-gate run; the first placement of a session is not checked', () => {
  assert.ok(!keys(run(workflows(), read(change(3, 9)))).length)
  const s = run(workflows(), read(change(0, 9)), skill('epic-planning', 3), skill('epic-delivery', 5))
  assert.equal(s.phase, 'apply')
  assert.ok(keys(s).includes('process:gate:apply:clarity'), keys(s).join())
  const gated = run(workflows(), read(change(0, 9)), skill('epic-planning', 3), skill('clarity-gate', 4), skill('epic-delivery', 5))
  assert.ok(!keys(gated).includes('process:gate:apply:clarity'))
})

test('the validate gate: ok after make validate, stale after an edit, fail on a failed run', () => {
  let s = run(workflows(), read(change(3, 9)), cmd('make validate', 5))
  assert.equal(s.gates.validate?.state, 'ok')
  s = reduce(s, { kind: 'FileTouched', id: id(), path: 'tools/x.py', at: 6 })
  assert.equal(s.gates.validate?.state, 'stale')
  assert.equal(run(workflows(), read(change(3, 9)), cmd('make validate', 5, false)).gates.validate?.state, 'fail')
})

test('PD-4 a skill of another phase; PD-5 an external skill a Meaningfy skill replaces', () => {
  const s = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5), skill('superpowers:writing-plans', 6))
  assert.ok(keys(s).includes('process:external:writing-plans'))
  assert.equal(s.warnings.find(w => w.key === 'process:external:writing-plans')!.remedy, 'epic-planning')
  const e = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5), skill('bdd-gherkin', 6))
  assert.ok(keys(e).includes('process:elsewhere:apply:bdd-gherkin'), keys(e).join())
  assert.equal(e.warnings.find(w => w.key === 'process:elsewhere:apply:bdd-gherkin')!.remedy, null)
})

// ---------------------------------------------------------------- DevOps and sales
test('TC-12 a DevOps apply with no answered consent card warns; an answered card does not', () => {
  const start = [workflows(), read(null), skill('infrastructure-operations', 3)]
  const s = run(...start, cmd('terraform apply -auto-approve', 4))
  assert.deepEqual([s.workflow, s.variant], ['devops', 'intervention'])
  assert.ok(keys(s).includes('process:gate:apply:consent'), keys(s).join())

  const asked = run(...start, cmd('terraform plan', 4),
    { kind: 'AnswerShown', id: id(), text: 'Here is the plan.\nDECIDE: apply the change?', at: 5 },
    { kind: 'UserPrompted', id: id(), at: 6 }, cmd('terraform apply', 7))
  assert.ok(!keys(asked).includes('process:gate:apply:consent'), keys(asked).join())
  assert.equal(asked.phase, 'verify')
})

test('DevOps phases advance by commands and consent: read → card → apply', () => {
  const start = [workflows(), read(null), skill('infrastructure-operations', 3)]
  assert.equal(run(...start).phase, 'read')
  assert.equal(run(...start, cmd('terraform plan', 4)).phase, 'card')
  assert.equal(run(...start, cmd('terraform plan', 4),
    { kind: 'AnswerShown', id: id(), text: 'DECIDE: go?', at: 5 }, { kind: 'UserPrompted', id: id(), at: 6 }).phase, 'apply')
  assert.equal(run(...start, cmd('terraform plan', 4), { kind: 'UserPrompted', id: id(), at: 6 }).phase, 'card')
})

test('TC-13 the line names the workflow, variant and phase; sales says provisional', () => {
  const incident = run(workflows('strict'), read(null), skill('service-reliability', 3))
  assert.equal(lineText(incident), 'devops · incident · triage · ● strict')
  const sales = run(workflows(), read(null), skill('estimation', 3))
  assert.equal(lineText(sales), 'sales (provisional) · offer')
  assert.ok(bandModel(sales).rows.find(r => r.label === 'phases')!.items.includes('● offer'))
})

test('the ops-watch check-up and unattended variants follow isInteractive', () => {
  const spawn = (interactive: boolean) => [
    reduce(EMPTY, { kind: 'Started', id: id(), sessionId: 's', band: 'folded', statusLine: true, interactive }),
    workflows(), read(null),
    { kind: 'SubagentSpawned', id: id(), agentId: 'a', type: 'ops-watch', model: 'm', description: '', at: 3 } as Signal,
  ] as const
  const [s0, ...rest] = spawn(false)
  assert.equal(rest.reduce(reduce, s0).variant, 'unattended')
  const [t0, ...more] = spawn(true)
  assert.equal(more.reduce(reduce, t0).variant, 'check-up')
})

test('the band shows phases and the skill trail with phases', () => {
  const s = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5))
  const rows = bandModel(s).rows
  assert.deepEqual(rows.find(r => r.label === 'phases')!.items,
    ['Build-tier EPIC delivery', '✓ explore', '✓ shape', '✓ plan', '● apply', '○ verify', '○ archive'])
  assert.deepEqual(rows.find(r => r.label === 'skills')!.items, ['epic-delivery (apply)'])
})

// ---------------------------------------------------------------- actions (TC-15 partial)
test('Next step: the first unmet expected skill, then the next phase owner', () => {
  const s = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5))
  assert.equal(nextStep(s), 'test-driven-development')
  const all = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5), skill('test-driven-development', 6), skill('cosmic-python', 7))
  assert.equal(nextStep(all), 'meaningfy-code-review')
  assert.equal(nextStep(run(workflows(), read(null))), null)
})

test('Validate runs the phase command gates; commands resolve by name or plugin prefix', () => {
  assert.deepEqual(validateRuns(run(workflows(), read(change(3, 9)))), ['make validate'])
  const installed = ['navigator', 'meaningfy-building:clarity-gate', 'superpowers:test-driven-development']
  assert.deepEqual(commandFor('test-driven-development', installed), { command: 'superpowers:test-driven-development', args: '' })
  assert.deepEqual(commandFor('navigator validate', installed), { command: 'navigator', args: 'validate' })
  assert.deepEqual(commandFor('openspec-update-change navigator', installed), { reason: 'navigator: openspec-update-change is not installed' })
})

test('a malformed repo workflow file is a warning naming the file', () => {
  const s = run({ kind: 'WorkflowsRead', id: id(), workflows: defaults.workflows, errors: ['workflow file docs/navigator/x.workflow.json: not JSON'], mode: 'loose', at: 1 })
  assert.deepEqual(s.warnings.map(w => w.message), ['workflow file docs/navigator/x.workflow.json: not JSON'])
})
