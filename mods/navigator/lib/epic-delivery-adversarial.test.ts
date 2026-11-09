// Adversarial cases for the epic-delivery workflow (lean-delivery stage 3, D-8, D-9, DL-9) and skillery's repo overrides.
// A test named "PIN" records plausible, undocumented behaviour; the others assert documented behaviour.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { holds, progress } from './change.ts'
import { EMPTY, reduce, type Change, type NavState, type Signal } from './state.ts'
import { resolveWorkflows, type Source } from './workflow.ts'

const REPO = join(import.meta.dirname, '..', '..', '..')
const src = (path: string): Source => ({ path, text: readFileSync(join(REPO, path), 'utf8') })
const DEFAULTS = [src('skills/epic-delivery/assets/workflows/epic-delivery.workflow.json'),
  src('skills/technical-writing/assets/workflows/documentation.workflow.json')]
const defaults = resolveWorkflows(DEFAULTS, [])

let n = 0
const id = () => `a${++n}`
const change = (tasks: string | null, over: Partial<Change> = {}): Change =>
  ({ id: 'x', appetite: 'LARGE', ...progress(tasks), planMtime: 0, hasDesign: true, hasTasks: tasks !== null, ...over })
function run(...signals: Signal[]): NavState {
  return signals.reduce(reduce, reduce(EMPTY, { kind: 'Started', id: id(), sessionId: 's', band: 'folded', statusLine: true, interactive: true }))
}
const workflows = (w = defaults): Signal => ({ kind: 'WorkflowsRead', id: id(), workflows: w.workflows, errors: [], mode: 'loose', at: 1 })
const read = (c: Change | null, at = 2): Signal => ({ kind: 'ChangeRead', id: id(), change: c, openChanges: c ? 1 : 0, at })
const skill = (name: string, at: number): Signal => ({ kind: 'SkillLoaded', id: id(), name, at })
const cmd = (command: string, at: number): Signal => ({ kind: 'ToolRan', id: id(), command, ok: true, at })
const write = (path: string, at: number): Signal => ({ kind: 'FileTouched', id: id(), path, at })
const where = (s: NavState) => [s.workflow, s.variant, s.phase]
const tasks = (...boxes: string[]) => `## 1. Build\n${boxes.map((b, i) => `- [${b}] 1.${i + 1} t`).join('\n')}\n`
const ACC = (c: string) => `openspec/changes/${c}/evidence/acceptance.md`

test('D-8 anti-pattern: unticked boxes under a docs/close heading keep the phase in apply', () => {
  const t = `${tasks('x', 'x')}\n## 2. Docs stage\n- [ ] 2.1 write pages\n## 3. Close\n- [ ] 3.1 archive\n`
  const c = change(t)
  assert.deepEqual([c.done, c.total], [2, 4])
  assert.equal(run(workflows(), read(c), skill('epic-delivery', 3)).phase, 'apply')
})

test('D-8: plain lines under the docs and close headings do not count, so accept shows', () => {
  const t = `${tasks('x', 'x')}\n## 2. Docs stage\n- write pages\n## 3. Close\n- archive\n`
  assert.equal(run(workflows(), read(change(t)), skill('epic-delivery', 3)).phase, 'accept')
})

test('PIN: a tasks.md with zero boxes is "plan" (done 0, design present), not tasks-done; the phase is ready', () => {
  const c = change('## 1. Build\n- no boxes here\n')
  assert.equal(c.total, 0)
  assert.equal(holds('tasks-done', c), false)
  assert.equal(holds('tasks-partial', c), false)
  assert.equal(run(workflows(), read(c)).phase, 'ready')
})

test('PIN: boxes above the first ## heading are not counted, so such a file reads as no tasks', () => {
  const c = change('- [x] a\n- [x] b\n')
  assert.equal(c.total, 0)
  assert.equal(run(workflows(), read(c)).phase, 'ready')
})

test('partial -> all ticked -> one unticked again: accept goes back to apply', () => {
  const s = run(workflows(), read(change(tasks('x', ' ', ' ')), 2), skill('epic-delivery', 3))
  assert.equal(s.phase, 'apply')
  const done = reduce(s, read(change(tasks('x', 'x', 'x')), 4))
  assert.equal(done.phase, 'accept')
  const back = reduce(done, read(change(tasks('x', 'x', ' ')), 5))
  assert.equal(back.phase, 'apply')
})

test('acceptance.md written before the tasks are done: gate ok, but the phase stays apply (accept has an enter)', () => {
  const s = run(workflows(), read(change(tasks('x', ' '))), skill('epic-delivery', 3), write(ACC('x'), 4))
  assert.equal(s.phase, 'apply')
  assert.equal(s.gates.acceptance?.state, 'ok')
})

test('acceptance.md written at ready does not skip to accept or archive', () => {
  const s = run(workflows(), read(change(tasks(' ', ' '))), write(ACC('x'), 4))
  assert.equal(s.phase, 'ready')
})

test('PIN: acceptance.md in another change folder still passes the acceptance gate (the glob is change-agnostic, as the docs-owed gate in DL-7.2)', () => {
  const s = run(workflows(), read(change(tasks('x', 'x'))), skill('epic-delivery', 3), write(ACC('other-change'), 4))
  assert.equal(s.gates.acceptance?.state, 'ok')
})

test('acceptance.md under a lookalike path does not pass the gate', () => {
  for (const p of ['openspec/changes/x/acceptance.md', 'openspec/changes/x/evidence/acceptance.md.bak',
    'openspec/changes/x/evidence/sub/acceptance.md', 'docs/evidence/acceptance.md']) {
    const s = run(workflows(), read(change(tasks('x', 'x'))), skill('epic-delivery', 3), write(p, 4))
    assert.notEqual(s.gates.acceptance?.state, 'ok', p)
  }
})

test('openspec-archive-change with the tasks partial still lands in archive (the signal wins; the phase is skipped forward)', () => {
  const s = run(workflows(), read(change(tasks('x', ' '))), skill('epic-delivery', 3), skill('openspec-archive-change', 4))
  assert.equal(s.phase, 'archive')
})

test('PIN: openspec-archive-change before any task is ticked lands in archive too (no guard on accept)', () => {
  const s = run(workflows(), read(change(tasks(' ', ' '))), skill('openspec-archive-change', 3))
  assert.equal(s.phase, 'archive')
})

test('make check-all in ready: gate ok is recorded, the phase does not move', () => {
  const s = run(workflows(), read(change(tasks(' ', ' '))), cmd('make check-all', 4))
  assert.equal(s.phase, 'ready')
  assert.equal(s.gates['full-gates']?.state, 'ok')
})

test('make check-all in accept: phase stays accept; the gate belongs to apply and the band stays calm', () => {
  const s = run(workflows(), read(change(tasks('x', 'x'))), skill('epic-delivery', 3), cmd('make check-all', 4))
  assert.equal(s.phase, 'accept')
})

test('a tasks edit after make check-all (new ChangeRead with fewer done) does not crash and re-places the phase', () => {
  const s = run(workflows(), read(change(tasks('x', ' '))), cmd('make check-all', 3), read(change(tasks('x', 'x')), 4))
  assert.equal(s.phase, 'accept')
})

const OPENSPEC: [string, boolean][] = [
  ['openspec validate lean-delivery --strict', true], ['openspec validate x', true],
  ['openspec validated', false], ['openspec  validate x', false], ['openspec list', false], ['openspec archive x', false],
  ['openspec validate-all', false], // lookalike like DL-9.2's `make validate-spine`; the openspec pattern has no (?![\w-])
]
for (const [command, ok] of OPENSPEC) {
  test(`openspec gate: \`${command}\` -> ${ok ? 'ok' : 'none'}`, () => {
    const s = run(workflows(), read(change(tasks('x', 'x'))), skill('openspec-archive-change', 3), cmd(command, 4))
    assert.equal(s.gates.openspec?.state ?? 'none', ok ? 'ok' : 'none')
  })
}

test('brownfield: tasks without design, partly ticked -> apply; none ticked -> apply (tasks-no-design)', () => {
  assert.deepEqual(where(run(workflows(), read(change(tasks('x', ' '), { hasDesign: false })))), ['epic-delivery', 'brownfield', 'apply'])
  assert.deepEqual(where(run(workflows(), read(change(tasks(' ', ' '), { hasDesign: false })))), ['epic-delivery', 'brownfield', 'apply'])
})

test('brownfield has no ready phase: the opening phase is apply', () => {
  const w = defaults.workflows.find(x => x.name === 'epic-delivery')!
  assert.deepEqual(w.variants?.[0]?.phases, ['apply', 'accept', 'archive'])
})

test('brownfield: openspec-archive-change lands in archive and the openspec gate is kept', () => {
  const s = run(workflows(), read(change(tasks('x', 'x'), { hasDesign: false })), skill('openspec-archive-change', 3), cmd('openspec validate x --strict', 4))
  assert.deepEqual(where(s), ['epic-delivery', 'brownfield', 'archive'])
  assert.equal(s.gates.openspec?.state, 'ok')
})

test('PIN: an open change without tasks.md still activates epic-delivery in ready (activate.openChange); it never reaches apply', () => {
  assert.deepEqual(where(run(workflows(), read(change(null)))), ['epic-delivery', null, 'ready'])
})

// Repo overrides --------------------------------------------------------------------------------------------------
const override = (obj: unknown) => resolveWorkflows(DEFAULTS, [{ path: 'docs/navigator/epic-delivery.workflow.json', text: JSON.stringify(obj) }])
const names = (r: ReturnType<typeof resolveWorkflows>) => r.workflows.map(w => w.name)

test('BREAKING: an override extending epic-delivery whose variant still names `verify` is reported, with the file and phase', () => {
  const r = override({ name: 'epic-delivery', extends: 'epic-delivery', variants: [{ name: 'brownfield', phases: ['apply', 'verify', 'archive'], activate: { change: 'tasks-no-design' } }] })
  assert.equal(r.errors.length, 1)
  assert.match(r.errors[0]!, /docs\/navigator\/epic-delivery\.workflow\.json/)
  assert.match(r.errors[0]!, /verify/)
})

test('BREAKING: the failed override leaves the default epic-delivery in place', () => {
  const r = override({ name: 'epic-delivery', extends: 'epic-delivery', variants: [{ name: 'brownfield', phases: ['apply', 'verify', 'archive'], activate: { change: 'tasks-no-design' } }] })
  const w = r.workflows.find(x => x.name === 'epic-delivery')!
  assert.equal(w.source, 'skills/epic-delivery/assets/workflows/epic-delivery.workflow.json')
  assert.deepEqual(w.phases.map(p => p.id), ['ready', 'apply', 'accept', 'archive'])
})

test('BREAKING: an override that replaces phases with an old verify-era set is reported (the brownfield variant no longer finds accept)', () => {
  const old = [{ id: 'apply', owner: 'epic-delivery', expect: [], enter: {} }, { id: 'verify', owner: 'epic-delivery', expect: [], gates: ['full-gates-old'], enter: {} }]
  const r = override({ name: 'epic-delivery', extends: 'epic-delivery', phases: old })
  assert.match(r.errors.join('\n'), /docs\/navigator\/epic-delivery\.workflow\.json: variants\[0\]: no phase 'accept'/)
})

test('an override whose gates drop `openspec` is reported (shallow merge drops it) and the default stays', () => {
  const r = override({ name: 'epic-delivery', extends: 'epic-delivery',
    gates: { 'full-gates': { kind: 'command', match: '\\bmake validate(?![\\w-])', run: 'make validate' } } })
  assert.equal(r.errors.length, 1)
  assert.match(r.errors[0]!, /no gate '(clarity|acceptance|openspec)'/)
  assert.equal(r.workflows.find(w => w.name === 'epic-delivery')!.gates?.['full-gates']?.match, defaults.workflows.find(w => w.name === 'epic-delivery')!.gates?.['full-gates']?.match)
})

test('an override extending an unknown workflow is reported and adds nothing', () => {
  const r = resolveWorkflows(DEFAULTS, [{ path: 'o.json', text: JSON.stringify({ name: 'x', extends: 'nope' }) }])
  assert.match(r.errors[0]!, /extends unknown workflow 'nope'/)
  assert.ok(!names(r).includes('x'))
})

test('an override with an invalid full-gates regex is reported', () => {
  const r = override({ name: 'epic-delivery', extends: 'epic-delivery', gates: {
    clarity: { kind: 'skill', skill: 'clarity-gate' }, 'full-gates': { kind: 'command', match: '(', run: 'make x' },
    acceptance: { kind: 'file', glob: 'openspec/changes/*/evidence/acceptance.md' },
    openspec: { kind: 'command', match: '\\bopenspec validate(?![\\w-])', run: 'openspec validate {change} --strict' } } })
  assert.equal(r.errors.length, 1)
})

test('skillery override: make check-all, the default target, no longer passes full-gates in the repo (the override wins)', () => {
  const r = resolveWorkflows(DEFAULTS, [src('docs/navigator/epic-delivery.workflow.json')])
  const s = run(workflows(r), read(change(tasks('x', ' '))), cmd('make check-all', 5))
  assert.equal(s.gates['full-gates']?.state ?? 'none', 'none')
  assert.equal(run(workflows(r), read(change(tasks('x', ' '))), cmd('make validate', 5)).gates['full-gates']?.state, 'ok')
})

test('skillery override keeps phases, variants, reviews and roles of the default wholesale', () => {
  const r = resolveWorkflows(DEFAULTS, [src('docs/navigator/epic-delivery.workflow.json')])
  const a = r.workflows.find(w => w.name === 'epic-delivery')!
  const b = defaults.workflows.find(w => w.name === 'epic-delivery')!
  for (const k of ['phases', 'variants', 'reviews', 'roles', 'activate', 'replaces'] as const) assert.deepEqual(a[k], b[k], k)
})
