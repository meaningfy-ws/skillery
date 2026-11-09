import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { backOnTrack, commandFor, nextStep, validateRuns } from './actions.ts'
import { EMPTY, reduce, type Change, type NavState, type Signal } from './state.ts'
import { decideCommit } from './strict.ts'
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

test('PD-3 skill gate: a delivery session entering apply with no clarity-gate run warns; the first placement is not checked', () => {
  assert.ok(!keys(run(workflows(), read(change(3, 9)))).length)
  const placed = run(workflows(), read(change(0, 9)))
  assert.equal(placed.phase, 'design')
  assert.ok(!keys(placed).length)
  const s = reduce(placed, skill('epic-delivery', 5))
  assert.equal(s.phase, 'apply')
  assert.ok(keys(s).includes('process:gate:apply:clarity'), keys(s).join())
  // The gate runs in revise, a variant of the workflow; epic-delivery then places apply without a check.
  const gated = [skill('clarity-gate', 4), skill('epic-delivery', 5)].reduce(reduce, placed)
  assert.equal(gated.phase, 'apply')
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
    ['Build-tier EPIC delivery', '✓ explore', '✓ variants', '✓ decide', '✓ propose', '✓ design', '✓ revise', '● apply', '○ verify', '○ archive'])
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

// A file gate advances like a command gate (navigator-workflows D-1): a write is an Advance.
const filed = {
  name: 'filed', title: 'Filed', owner: 'o', source: 'repo', activate: { skills: ['wf'] },
  phases: [
    { id: 'a', owner: 'o', expect: [], gates: ['ga'], enter: { skills: ['wf'] } },
    { id: 'b', owner: 'o', expect: [], gates: ['gb'], enter: {} },
    { id: 'c', owner: 'o', expect: [], gates: ['gc'], enter: {} },
    { id: 'd', owner: 'o', expect: [], enter: {} },
  ],
  gates: { ga: { kind: 'file', glob: 'docs/a.md' }, gb: { kind: 'file', glob: 'docs/b.md' }, gc: { kind: 'file', glob: 'docs/c.md' } },
} as unknown as NavState['workflows'][number]
const filedRun = (...signals: Signal[]) => run({ ...workflows(), workflows: [filed] } as Signal, skill('wf', 3), ...signals)
const write = (path: string, at: number): Signal => ({ kind: 'FileTouched', id: id(), path, at })

test('D-1 a write matching the gate of the current phase advances to the next phase', () => {
  const s = filedRun(write('docs/a.md', 4))
  assert.deepEqual([s.workflow, s.phase], ['filed', 'b'])
})

test('D-1 a write matching a later gate skips forward and the skipped phases warn about their open gates', () => {
  const s = filedRun(write('docs/c.md', 4))
  assert.equal(s.phase, 'd')
  assert.ok(keys(s).includes('process:gate:a:ga'), keys(s).join())
  assert.ok(keys(s).includes('process:gate:b:gb'), keys(s).join())
  assert.ok(!keys(s).includes('process:gate:c:gc'))
})

test('D-1 a write matching an earlier phase gate does not move back', () => {
  const s = filedRun(write('docs/b.md', 4), write('docs/a.md', 5))
  assert.equal(s.phase, 'c')
})

test('D-1 a file write never selects a workflow', () => {
  const s = run({ ...workflows(), workflows: [filed] } as Signal, write('docs/a.md', 4))
  assert.deepEqual([s.workflow, s.phase], [null, null])
})

// ---------------------------------------------------------------- build-tier shaping and delivery (navigator-workflows D-2, D-3)
const fresh = (over: Partial<Change> = {}) => change(0, 9, { id: 'x', ...over })
const proposalOnly = fresh({ total: 0, hasDesign: false, hasTasks: false })
const shaped = (...signals: Signal[]) => run(workflows(), read(null), skill('epic-planning', 3), ...signals)
const where = (s: NavState) => [s.workflow, s.variant, s.phase]

test('Shaping: seed, Q&A, proposal, design and tasks, then the clarity gate, walk the variant with no warnings', () => {
  const start = shaped()
  assert.deepEqual(where(start), ['build-tier', 'work-shaping', 'explore'])
  const seeded = reduce(start, write('openspec/changes/x/inputs/seed.md', 4))
  assert.equal(seeded.phase, 'variants')
  const asked = reduce(seeded, write('openspec/changes/x/inputs/qa.md', 5))
  assert.equal(asked.phase, 'decide')
  const proposed = reduce(asked, read(proposalOnly, 6))
  assert.equal(proposed.phase, 'propose')
  const planned = reduce(reduce(proposed, write('openspec/changes/x/design.md', 7)), read(fresh(), 8))
  assert.equal(planned.phase, 'design')
  const gated = [skill('clarity-gate', 9), { kind: 'AnswerShown', id: id(), text: 'Clarity score: 9.2/10', at: 10 } as Signal]
    .reduce(reduce, planned)
  assert.deepEqual(where(gated), ['build-tier', 'work-shaping', 'revise'])
  assert.match(bandModel(gated).folded, /clarity ✓ 9\.2/)
  assert.equal(nextStep(gated), null)
  assert.deepEqual(keys(gated), [])
})

test('Shaping: reloading epic-planning keeps the phase (D-3)', () => {
  assert.equal(reduce(shaped(write('openspec/changes/x/inputs/seed.md', 4)), skill('epic-planning', 5)).phase, 'variants')
})

const delivery = (...signals: Signal[]) => run(workflows(), read(fresh()), ...signals)

test('Delivery, next session: epic-delivery warns clarity; clarity-gate revises; epic-delivery returns to apply clean', () => {
  const placed = delivery()
  assert.deepEqual(where(placed), ['build-tier', null, 'design'])
  const entered = reduce(placed, skill('epic-delivery', 3))
  assert.deepEqual(where(entered), ['build-tier', null, 'apply'])
  assert.deepEqual(keys(entered), ['process:gate:apply:clarity'])
  assert.equal(backOnTrack(entered), 'clarity-gate')
  const revised = reduce(entered, skill('clarity-gate', 4))
  assert.deepEqual(where(revised), ['build-tier', 'work-shaping', 'revise'])
  assert.deepEqual(keys(revised), [])
  const back = reduce(revised, skill('epic-delivery', 5))
  assert.deepEqual(where(back), ['build-tier', null, 'apply'])
  assert.deepEqual(keys(back), [])
})

test('Delivery, next session: strict still refuses a commit in apply until test-driven-development runs', () => {
  const strict = run({ ...workflows('strict') }, read(fresh()), skill('epic-delivery', 3), skill('clarity-gate', 4), skill('epic-delivery', 5))
  const d = decideCommit(strict)
  assert.ok('deny' in d && /without test-driven-development/.test(d.deny))
  assert.deepEqual(decideCommit(reduce(strict, skill('test-driven-development', 6))), { allow: true })
})

test('Reconcile mid-delivery: update-change revises, epic-delivery returns to apply; all tasks done returns to verify', () => {
  const mid = change(3, 10, { id: 'x' })
  const revised = run(workflows(), read(mid), skill('epic-delivery', 3), skill('openspec-update-change', 4))
  assert.deepEqual(where(revised), ['build-tier', 'work-shaping', 'revise'])
  assert.deepEqual(where(reduce(revised, skill('epic-delivery', 5))), ['build-tier', null, 'apply'])
  const done = change(10, 10, { id: 'x' })
  const revisedDone = run(workflows(), read(done), skill('openspec-update-change', 4))
  assert.deepEqual(where(revisedDone), ['build-tier', 'work-shaping', 'revise'])
  assert.deepEqual(where(reduce(revisedDone, skill('epic-delivery', 5))), ['build-tier', null, 'verify'])
})

test('Error matrix: with another change open, inputs for a new change do not move the band off revise', () => {
  const other = change(3, 10, { id: 'other' })
  const s = run(workflows(), read(other), skill('epic-planning', 3), write('openspec/changes/new/inputs/seed.md', 4),
    write('openspec/changes/new/inputs/qa.md', 5))
  assert.deepEqual(where(s), ['build-tier', 'work-shaping', 'revise'])
  assert.equal(s.change!.id, 'other')
})

test('Error matrix: tasks.md before design.md stays in the variant on revise with the clarity warning; design.md moves back', () => {
  const inputs = [write('openspec/changes/x/inputs/seed.md', 4), write('openspec/changes/x/inputs/qa.md', 5)]
  const proposed = shaped(...inputs, read(proposalOnly, 6))
  assert.equal(proposed.phase, 'propose')
  const early = reduce(proposed, read(fresh({ hasDesign: false }), 7))
  assert.deepEqual(where(early), ['build-tier', 'work-shaping', 'revise'])
  assert.deepEqual(keys(early), ['process:gate:revise:clarity'])
  const designed = reduce(early, read(fresh(), 8))
  assert.equal(designed.phase, 'design')
  assert.deepEqual(keys(designed), ['process:gate:revise:clarity'])
  const strict = run(workflows('strict'), read(null), skill('epic-planning', 3), ...inputs, read(proposalOnly, 6),
    read(fresh({ hasDesign: false }), 7), read(fresh(), 8))
  assert.deepEqual(decideCommit(strict), { allow: true })
  assert.deepEqual(keys(reduce(designed, skill('clarity-gate', 9))), [])
})
