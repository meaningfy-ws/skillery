import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { backOnTrack, commandFor, nextStep, validateRuns } from './actions.ts'
import { EMPTY, reduce, type Change, type NavState, type Signal } from './state.ts'
import { decideCommit } from './strict.ts'
import { bandView, lineText } from './view.ts'
import { resolveWorkflows } from './workflow.ts'

const env = { now: 0, home: '', commands: [] }
const REPO = join(import.meta.dirname, '..', '..', '..')
const file = (skill: string, name: string) => {
  const path = `skills/${skill}/assets/workflows/${name}.workflow.json`
  return { path, text: readFileSync(join(REPO, path), 'utf8') }
}
const defaults = resolveWorkflows([file('epic-delivery', 'epic-delivery'), file('epic-planning', 'epic-shaping'),
  file('architecture', 'architecting'),
  file('conceptual-modelling', 'modelling'), file('meaningfy-release', 'release'),
  file('infrastructure-operations', 'devops'), file('sales-operations', 'sales'), file('technical-writing', 'documentation')], [])

let n = 0
const id = () => `x${++n}`
const change = (done: number, total: number, over: Partial<Change> = {}): Change =>
  ({ id: 'navigator', appetite: 'VERY LARGE', done, total, groups: [], planMtime: 0, hasDesign: true, hasTasks: true, archived: false, ...over })

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

test('an open change with partial tasks places epic-delivery in apply; ticking all moves it to accept', () => {
  const s = run(workflows(), read(change(3, 9)))
  assert.deepEqual([s.workflow, s.variant, s.phase], ['epic-delivery', null, 'apply'])
  assert.equal(run(workflows(), read(change(3, 9)), read(change(9, 9), 3)).phase, 'accept')
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
  assert.equal(s.phase, 'accept')
  assert.ok(keys(s).includes('process:missing:apply:cosmic-python'), keys(s).join())
  assert.ok(keys(s).includes('process:missing:apply:meaningfy-code-review'), keys(s).join())
  assert.ok(keys(s).includes('process:missing:apply:verification-before-completion'), keys(s).join())
  assert.ok(keys(s).includes('process:gate:apply:full-gates'))
  const passed = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5), skill('cosmic-python', 6),
    skill('meaningfy-code-review', 6), skill('verification-before-completion', 6),
    cmd('make check-all', 7), read(change(9, 9), 8))
  assert.deepEqual(keys(passed).filter(k => k.startsWith('process:') && k.includes(':apply:')), [])
})

test('PD-3 skill gate: a delivery session entering apply with no clarity-gate run warns; the first placement is not checked', () => {
  assert.ok(!keys(run(workflows(), read(change(3, 9)))).length)
  const placed = run(workflows(), read(change(0, 9)))
  assert.equal(placed.phase, 'ready')
  assert.ok(!keys(placed).length)
  const s = reduce(placed, skill('epic-delivery', 5))
  assert.equal(s.phase, 'apply')
  assert.ok(keys(s).includes('process:gate:apply:clarity'), keys(s).join())
  // The gate runs in epic-shaping's revise; epic-delivery then places apply without a check.
  const gated = [skill('clarity-gate', 4), skill('epic-delivery', 5)].reduce(reduce, placed)
  assert.equal(gated.phase, 'apply')
  assert.ok(!keys(gated).includes('process:gate:apply:clarity'))
})

test('the full-gates gate: ok after make check-all, stale after an edit, fail on a failed run (D-9)', () => {
  let s = run(workflows(), read(change(3, 9)), cmd('make check-all', 5))
  assert.equal(s.gates['full-gates']?.state, 'ok')
  s = reduce(s, { kind: 'FileTouched', id: id(), path: 'tools/x.py', at: 6 })
  assert.equal(s.gates['full-gates']?.state, 'stale')
  assert.equal(run(workflows(), read(change(3, 9)), cmd('make check-all', 5, false)).gates['full-gates']?.state, 'fail')
  assert.equal(run(workflows(), read(change(3, 9)), cmd('make validate', 5)).gates['full-gates']?.state ?? 'none', 'none')
})

test('PD-4 a skill of another phase; PD-5 an external skill a Meaningfy skill replaces', () => {
  const s = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5), skill('superpowers:writing-plans', 6))
  assert.ok(keys(s).includes('process:external:writing-plans'))
  assert.equal(s.warnings.find(w => w.key === 'process:external:writing-plans')!.remedy, 'epic-planning')
  const e = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5), skill('spec-stewardship', 6))
  assert.ok(keys(e).includes('process:elsewhere:apply:spec-stewardship'), keys(e).join())
  assert.equal(e.warnings.find(w => w.key === 'process:elsewhere:apply:spec-stewardship')!.remedy, null)
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
  assert.ok(bandView(sales, env).details.rows.find(r => r.label === 'phases')!.items.includes('● offer'))
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
  const rows = bandView(s, env).details.rows
  assert.deepEqual(rows.find(r => r.label === 'phases')!.items,
    ['EPIC delivery', '✓ ready', '● apply', '○ accept', '○ archive'])
  assert.deepEqual(rows.find(r => r.label === 'skills')!.items, ['apply: epic-delivery'])
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
  assert.deepEqual(validateRuns(run(workflows(), read(change(3, 9)))), ['make check-all'])
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

// ---------------------------------------------------------------- epic-shaping and epic-delivery (navigator-workflows D-2, D-3)
const fresh = (over: Partial<Change> = {}) => change(0, 9, { id: 'x', ...over })
const proposalOnly = fresh({ total: 0, hasDesign: false, hasTasks: false })
const shaped = (...signals: Signal[]) => run(workflows(), read(null), skill('epic-planning', 3), ...signals)
const where = (s: NavState) => [s.workflow, s.variant, s.phase]

const bandPhases = (st: NavState) =>
  bandView(st, env).details.rows.find(r => r.label === 'phases')!.items.filter(i => /^[✓●○] /.test(i)).map(i => i.slice(2)) // phases only; the title and the gates are not
const SIX = ['explore', 'variants', 'decide', 'propose', 'design', 'revise']

test('Shaping: seed, Q&A, proposal, design and tasks, then the clarity gate, walk the six phases with no warnings', () => {
  const start = shaped()
  assert.deepEqual(where(start), ['epic-shaping', null, 'explore'])
  assert.deepEqual(bandPhases(start), SIX)
  const seeded = reduce(start, write('openspec/changes/x/inputs/seed.md', 4))
  assert.equal(seeded.phase, 'variants')
  const asked = reduce(seeded, write('openspec/changes/x/inputs/qa.md', 5))
  assert.equal(asked.phase, 'decide')
  const proposed = reduce(asked, read(proposalOnly, 6))
  assert.equal(proposed.phase, 'propose')
  assert.deepEqual(bandPhases(proposed), SIX)
  const planned = reduce(reduce(proposed, write('openspec/changes/x/design.md', 7)), read(fresh(), 8))
  assert.equal(planned.phase, 'design')
  const gated = [skill('clarity-gate', 9), { kind: 'AnswerShown', id: id(), text: 'Clarity score: 9.2/10', at: 10 } as Signal]
    .reduce(reduce, planned)
  assert.deepEqual(where(gated), ['epic-shaping', null, 'revise'])
  assert.ok(bandView(gated, env).details.rows.find(r => r.label === 'phases')!.items.includes('clarity ✓ 9.2'))
  assert.equal(nextStep(gated), null)
  assert.deepEqual(keys(gated), [])
})

test('Shaping: reloading epic-planning keeps the phase (D-3)', () => {
  assert.equal(reduce(shaped(write('openspec/changes/x/inputs/seed.md', 4)), skill('epic-planning', 5)).phase, 'variants')
})

const delivery = (...signals: Signal[]) => run(workflows(), read(fresh()), ...signals)

test('Delivery, next session: epic-delivery warns clarity; clarity-gate revises; epic-delivery returns to apply clean', () => {
  const placed = delivery()
  assert.deepEqual(where(placed), ['epic-delivery', null, 'ready'])
  const entered = reduce(placed, skill('epic-delivery', 3))
  assert.deepEqual(where(entered), ['epic-delivery', null, 'apply'])
  assert.deepEqual(keys(entered), ['process:gate:apply:clarity'])
  assert.equal(backOnTrack(entered), 'clarity-gate')
  const revised = reduce(entered, skill('clarity-gate', 4))
  assert.deepEqual(where(revised), ['epic-shaping', null, 'revise'])
  assert.deepEqual(keys(revised), [])
  const back = reduce(revised, skill('epic-delivery', 5))
  assert.deepEqual(where(back), ['epic-delivery', null, 'apply'])
  assert.deepEqual(keys(back), [])
})

test('Delivery, next session: strict still refuses a commit in apply until test-driven-development runs', () => {
  const strict = run({ ...workflows('strict') }, read(fresh()), skill('epic-delivery', 3), skill('clarity-gate', 4), skill('epic-delivery', 5))
  const d = decideCommit(strict)
  assert.ok('deny' in d && /without test-driven-development/.test(d.deny))
  assert.deepEqual(decideCommit(reduce(strict, skill('test-driven-development', 6))), { allow: true })
})

test('Reconcile mid-delivery: update-change revises, epic-delivery returns to apply; all tasks done returns to accept', () => {
  const mid = change(3, 10, { id: 'x' })
  const revised = run(workflows(), read(mid), skill('epic-delivery', 3), skill('openspec-update-change', 4))
  assert.deepEqual(where(revised), ['epic-shaping', null, 'revise'])
  assert.deepEqual(where(reduce(revised, skill('epic-delivery', 5))), ['epic-delivery', null, 'apply'])
  const done = change(10, 10, { id: 'x' })
  const revisedDone = run(workflows(), read(done), skill('openspec-update-change', 4))
  assert.deepEqual(where(revisedDone), ['epic-shaping', null, 'revise'])
  assert.deepEqual(where(reduce(revisedDone, skill('epic-delivery', 5))), ['epic-delivery', null, 'accept'])
})

test('Error matrix: another change open in a delivery state; the new change inputs move shaping from explore', () => {
  const other = change(3, 10, { id: 'other' })
  const start = run(workflows(), read(other), skill('epic-planning', 3))
  assert.deepEqual(where(start), ['epic-shaping', null, 'explore'])
  const seeded = reduce(start, write('openspec/changes/new/inputs/seed.md', 4))
  assert.equal(seeded.phase, 'variants')
  const asked = reduce(seeded, write('openspec/changes/new/inputs/qa.md', 5))
  assert.equal(asked.phase, 'decide')
  assert.equal(asked.change!.id, 'other')
})

test('Error matrix: another change open in proposal or plan; the band sits at propose or design and inputs do not move it', () => {
  const at = (other: Change) => {
    const s = run(workflows(), read(other), skill('epic-planning', 3))
    return reduce(reduce(s, write('openspec/changes/new/inputs/seed.md', 4)), write('openspec/changes/new/inputs/qa.md', 5))
  }
  const proposal = at(change(0, 0, { id: 'other', hasDesign: false, hasTasks: false }))
  assert.deepEqual([proposal.workflow, proposal.phase, proposal.change!.id], ['epic-shaping', 'propose', 'other'])
  const plan = at(change(0, 10, { id: 'other' }))
  assert.deepEqual([plan.workflow, plan.phase, plan.change!.id], ['epic-shaping', 'design', 'other'])
})

test('Error matrix: tasks.md before design.md holds design with no warning; design.md keeps design; revise warns until clarity-gate passes', () => {
  const inputs = [write('openspec/changes/x/inputs/seed.md', 4), write('openspec/changes/x/inputs/qa.md', 5)]
  const proposed = shaped(...inputs, read(proposalOnly, 6))
  assert.equal(proposed.phase, 'propose')
  const early = reduce(proposed, read(fresh({ hasDesign: false }), 7))
  assert.deepEqual(where(early), ['epic-shaping', null, 'design'])
  assert.deepEqual(keys(early), [])
  const designed = reduce(early, read(fresh(), 8))
  assert.equal(designed.phase, 'design')
  assert.deepEqual(keys(designed), [])
  const strict = run(workflows('strict'), read(null), skill('epic-planning', 3), ...inputs, read(proposalOnly, 6),
    read(fresh({ hasDesign: false }), 7), read(fresh(), 8))
  assert.deepEqual(decideCommit(strict), { allow: true })
  const revised = reduce(designed, skill('openspec-update-change', 9))
  assert.deepEqual([revised.phase, keys(revised)], ['revise', ['process:gate:revise:clarity']])
  assert.deepEqual(keys(reduce(designed, skill('clarity-gate', 9))), [])
})

test('Error matrix: a fresh session on a change with only a proposal lands in ready; epic-planning switches to shaping', () => {
  const s = run(workflows(), read(proposalOnly))
  assert.deepEqual(where(s), ['epic-delivery', null, 'ready'])
  assert.deepEqual(where(reduce(s, skill('epic-planning', 3))), ['epic-shaping', null, 'propose'])
})

test('Reconcile: openspec-apply-change in epic-shaping revise switches back to epic-delivery', () => {
  const revised = run(workflows(), read(change(3, 10, { id: 'x' })), skill('openspec-update-change', 3))
  assert.deepEqual(where(revised), ['epic-shaping', null, 'revise'])
  assert.deepEqual(where(reduce(revised, skill('openspec-apply-change', 4))), ['epic-delivery', null, 'apply'])
})

test('Status line: epic-shaping shows its name and phase with no change id, also in a Reconcile', () => {
  assert.equal(lineText(shaped()), 'epic-shaping · explore')
  const revised = run(workflows(), read(change(3, 10, { id: 'x' })), skill('openspec-update-change', 3))
  assert.equal(lineText(revised), 'epic-shaping · revise')
})

// ---------------------------------------------------------------- architecture, modelling, release (navigator-workflows D-1, D-3, D-4, D-5, D-6)
const archIn = (...signals: Signal[]) => run(workflows(), read(null), skill('architecture', 3), ...signals)
const toDomain = [write('docs/use-cases/use-case-catalogue.adoc', 4), write('docs/architecture/c4-context.adoc', 5),
  write('docs/adr/ADR-0001-store.md', 6), write('model/core.yaml', 7)]

test('Architecture to modelling: architecture walks drivers to domain; Next step names conceptual-modelling', () => {
  assert.deepEqual(where(archIn()), ['architecting', null, 'drivers'])
  const phases = ['use-cases', 'c4', 'decide', 'domain']
  let s = archIn()
  toDomain.forEach((w, i) => { s = reduce(s, w); assert.equal(s.phase, phases[i], w.kind === 'FileTouched' ? w.path : '') })
  assert.equal(nextStep(s), 'conceptual-modelling')
  assert.deepEqual(keys(s), [])
})

test('Architecture: writing the ADR passes the adr gate; editing an old use case in decide stays in decide', () => {
  const s = archIn(toDomain[0]!, toDomain[1]!, toDomain[2]!)
  assert.deepEqual([s.phase, s.gates.adr?.state], ['decide', 'ok'])
  assert.equal(reduce(s, write('docs/use-cases/use-case-catalogue.adoc', 8)).phase, 'decide')
})

test('Architecture: reloading architecture or spawning system-architect keeps the phase', () => {
  const s = archIn(toDomain[0]!, toDomain[1]!)
  assert.equal(s.phase, 'c4')
  assert.equal(reduce(s, skill('architecture', 8)).phase, 'c4')
  const spawned = reduce(s, { kind: 'SubagentSpawned', id: id(), agentId: 'sa', type: 'system-architect', model: 'm', description: '', at: 8 } as Signal)
  assert.equal(spawned.phase, 'c4')
})

test('Architecture to modelling: conceptual-modelling hands over to modelling and the model gates walk it', () => {
  let s = reduce(archIn(...toDomain), skill('conceptual-modelling', 8))
  assert.deepEqual(where(s), ['modelling', null, 'elicit'])
  s = reduce(s, write('model/core.yaml', 9))
  assert.equal(s.phase, 'model')
  s = reduce(s, cmd('make generate-models', 10))
  assert.equal(s.phase, 'generate')
  s = reduce(s, write('tests/examples/order.yaml', 11))
  assert.equal(s.phase, 'validate')
  s = reduce(s, write('openspec/changes/x/evidence/model-review.md', 12))
  assert.equal(s.phase, 'validate')
  assert.equal(s.gates.review?.state, 'ok')
  assert.deepEqual(keys(s), [])
  assert.equal(reduce(s, skill('conceptual-modelling', 13)).phase, 'validate')
})

// Reduce each signal in turn and assert the phase it lands in.
const walk = (s: NavState, steps: [Signal, string][]): NavState => {
  for (const [sig, phase] of steps) { s = reduce(s, sig); assert.equal(s.phase, phase, JSON.stringify(sig)) }
  return s
}

test('Release: the seven steps walk branch to back-merge and mark the release done', () => {
  let s = run(workflows(), read(null), skill('meaningfy-release', 3))
  assert.deepEqual(where(s), ['release', null, 'branch'])
  s = walk(s, [
    [cmd('git switch -c release/3.11.0', 4), 'bump'],
    [write('CHANGELOG.md', 5), 'validate'],
    [cmd('make validate', 6), 'merge'],
    [cmd('gh pr merge 160', 7), 'publish'],
    [cmd('git push origin v3.11.0', 8), 'back-merge'],
  ])
  s = reduce(s, cmd('gh pr create --base develop', 9))
  assert.equal(s.phase, 'back-merge')
  assert.equal(s.gates.back?.state, 'ok')
  assert.deepEqual(keys(s), [])
  assert.equal(reduce(s, skill('meaningfy-release', 10)).phase, 'back-merge')
})

// D-7: a local tag, a deleted tag, --follow-tags and a pushed release branch are not a release; the commands
// that are (a release/ branch cut, gh release create, a pushed version tag) are tested in stage2.test.ts.
test('Release: a local tag, a deleted tag and --follow-tags activate nothing, with or without an open change', () => {
  const cmds = [cmd('git tag v1.0.0', 3), cmd('git tag -d v1.0.0', 4), cmd('git push --follow-tags', 5), cmd('git push -u origin release/1.0.0', 6)]
  assert.deepEqual(where(run(workflows(), read(null), ...cmds)), [null, null, null])
  assert.deepEqual(where(run(workflows(), read(change(3, 9)), ...cmds)), ['epic-delivery', null, 'apply'])
})

test('Release: make validate in branch skips to merge with the cut and bumped gate warnings', () => {
  const s = run(workflows(), read(null), skill('meaningfy-release', 3), cmd('make validate', 4))
  assert.equal(s.phase, 'merge')
  assert.deepEqual(keys(s).sort(), ['process:gate:branch:cut', 'process:gate:bump:bumped'])
})

// D-5 and W4/W5: every listed case of the `published` and `back` gates, one test each.
const releaseTo = (stop: 'publish' | 'back-merge') => {
  const upTo = [skill('meaningfy-release', 3), cmd('git switch -c hotfix/1.0.1', 4), write('CHANGELOG.md', 5), cmd('make validate', 6),
    cmd('gh pr merge 1', 7)]
  return run(workflows(), read(null), ...upTo, ...(stop === 'back-merge' ? [cmd('git push origin v1.0.1', 8)] : []))
}
const PUBLISHED: [string, boolean][] = [
  ['gh release create v3.11.0', true], ['git tag v1.0.0', true], ['git tag -a v1.0.0 -m "x"', true],
  ['git tag -am "x" v1.0.0', true], ['git tag -s v1.0.0', true], ['git push --tags', true],
  ['git push origin --follow-tags', true], ['git push origin v3.11.0', true], ['git push origin main --tags', true],
  ['gh release view v3.11.0', false], ['git tag -l v3*', false], ['git tag -d v1.0', false], ['git tag --list v3*', false],
  ['git tag -v v1.0.0', false], ['git tag -n v1', false], ['git tag --contains v1.0', false], ['git tag --verify v1.0.0', false],
  ['git push --delete origin v1.0.0', false], ['git push -d origin v1.0.0', false], ['git push origin --tags --dry-run', false],
  ['git push -n origin v1.0.0', false], ['git push -u origin release/1.0.0', false], ['git push origin main', false],
]
for (const [command, passes] of PUBLISHED) {
  test(`Release published: \`${command}\` ${passes ? 'passes' : 'does not pass'}`, () => {
    const s = reduce(releaseTo('publish'), cmd(command, 9))
    assert.equal(s.phase, passes ? 'back-merge' : 'publish')
  })
}
const BACK: [string, boolean][] = [
  ['gh pr create --base develop', true], ['gh pr create -B develop --title x', true], ['gh pr create --base=develop', true],
  ['git merge release/3.11.0', true], ['git merge --no-ff main', true], ['git merge origin/main', true],
  ['git merge hotfix/main-fix', true],
  ['gh pr create --base develop-old', false], ['gh pr create --base main', false],
  ['git merge feature/x -m "Merge into main"', false], ['git merge-base main HEAD', false],
]
for (const [command, passes] of BACK) {
  test(`Release back: \`${command}\` ${passes ? 'passes' : 'does not pass'}`, () => {
    const s = reduce(releaseTo('back-merge'), cmd(command, 9))
    assert.equal(s.gates.back?.state ?? 'none', passes ? 'ok' : 'none')
  })
}

// ---------------------------------------------------------------- documentation (lean-delivery D-6, D-8, D-19)
// Test names carry the behaviour; the ids D-6 (walk, published), D-8 (docs-owed, archive) and D-19 (switching) are here.
const OWED = 'openspec/changes/lean-delivery/evidence/docs-owed.md'
const COLD = 'openspec/changes/lean-delivery/evidence/cold-read.md'
const docs = () => run(workflows(), read(null), skill('technical-writing', 3))

test('Documentation: the phases walk from inventory to publish as the gates pass (D-6)', () => {
  let s = docs()
  assert.deepEqual(where(s), ['documentation', null, 'inventory'])
  s = walk(s, [
    [write(OWED, 4), 'write'],
    [cmd('make build-docs', 5), 'cold-read'],
    [write(COLD, 6), 'publish'],
  ])
  assert.deepEqual(keys(s), [])
})

test('Documentation: gh pr create passes published from the publish state (D-6)', () => {
  const s = reduce(walk(docs(), [[write(OWED, 4), 'write'], [cmd('make build-docs', 5), 'cold-read'], [write(COLD, 6), 'publish']]),
    cmd('gh pr create --base develop', 7))
  assert.equal(s.phase, 'publish')
  assert.equal(s.gates.published?.state, 'ok')
})

test('Documentation: docs-owed written while epic-delivery is active does not move the documentation workflow (D-8)', () => {
  const s = reduce(run(workflows(), read(change(9, 9)), skill('epic-delivery', 3)), write(OWED, 4))
  assert.equal(s.workflow, 'epic-delivery')
  assert.equal(s.phase, 'accept')
  assert.equal(s.gates.owed, undefined)
})

test('Documentation: archive lands in epic-delivery archive after docs-owed is written (D-8)', () => {
  const s = reduce(run(workflows(), read(change(9, 9)), skill('epic-delivery', 3), write(OWED, 4)), skill('openspec-archive-change', 5))
  assert.deepEqual(where(s), ['epic-delivery', null, 'archive'])
})

test('Documentation: technical-writing mid-apply shows documentation; epic-delivery or openspec-apply-change switches back (D-19)', () => {
  const apply = run(workflows(), read(change(3, 9)), skill('epic-delivery', 3))
  const mid = reduce(apply, skill('technical-writing', 4))
  assert.deepEqual(where(mid), ['documentation', null, 'inventory'])
  assert.equal(reduce(mid, skill('epic-delivery', 5)).workflow, 'epic-delivery')
  assert.equal(reduce(mid, skill('openspec-apply-change', 5)).workflow, 'epic-delivery')
})
