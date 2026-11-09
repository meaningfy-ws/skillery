// Edge cases of navigator (design §4.1–§4.3, §6.1–§6.3, §8, DD-36, DD-38); later testers add here.
// Each test asserts what the design says SHOULD happen; a failing one is a finding.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { backOnTrack, commandFor, nextStep, validateRuns } from './actions.ts'
import { phaseFor } from './phase.ts'
import { EMPTY, reduce, type Change, type NavState, type Signal, type Workflow } from './state.ts'
import { bandModel, lineText } from './view.ts'
import { globRegex, parseWorkflow, resolveWorkflows, workflowError, type Source } from './workflow.ts'

const REPO = join(import.meta.dirname, '..', '..', '..')
const file = (skill: string, name: string): Source => {
  const path = `skills/${skill}/assets/workflows/${name}.workflow.json`
  return { path, text: readFileSync(join(REPO, path), 'utf8') }
}
const DEFAULT_SOURCES = [file('epic-delivery', 'build-tier'), file('architecture', 'architecting'),
  file('infrastructure-operations', 'devops'), file('sales-operations', 'sales')]
const defaults = resolveWorkflows(DEFAULT_SOURCES, [])
const buildTier = defaults.workflows.find(w => w.name === 'build-tier')!

let n = 0
const id = () => `adv${++n}`
const change = (done: number, total: number, over: Partial<Change> = {}): Change =>
  ({ id: 'navigator', appetite: 'VERY LARGE', done, total, groups: [], planMtime: 0, hasDesign: true, hasTasks: true, ...over })
const started = (interactive = true): NavState =>
  reduce(EMPTY, { kind: 'Started', id: id(), sessionId: 's', band: 'folded', statusLine: true, interactive })
const run = (...signals: Signal[]): NavState => signals.reduce(reduce, started())
const workflows = (ws: Workflow[] = defaults.workflows, errors: string[] = [], mode: 'loose' | 'strict' = 'loose'): Signal =>
  ({ kind: 'WorkflowsRead', id: id(), workflows: ws, errors, mode, at: 1 })
const read = (c: Change | null, at = 2): Signal => ({ kind: 'ChangeRead', id: id(), change: c, openChanges: c ? 1 : 0, at })
const skill = (name: string, at: number, sid = id()): Signal => ({ kind: 'SkillLoaded', id: sid, name, at })
const cmd = (command: string, at: number, ok = true): Signal => ({ kind: 'ToolRan', id: id(), command, ok, at })
const answer = (text: string, at: number): Signal => ({ kind: 'AnswerShown', id: id(), text, at })
const prompted = (at: number): Signal => ({ kind: 'UserPrompted', id: id(), at })
const keys = (s: NavState) => s.warnings.map(w => w.key)
const src = (path: string, text: string): Source => ({ path, text })
const minimal = (over: object = {}) => ({
  name: 'flow', title: 'T', owner: 'o', activate: { skills: ['go'] },
  phases: [{ id: 'a', owner: 'o', expect: [], enter: {} }], ...over })

// ================================================================ §4.1 schema edge cases
test('schema: non-object JSON roots are rejected, never thrown', () => {
  for (const text of ['null', '[]', '42', '"x"', 'true']) {
    const r = parseWorkflow(src('r', text), 'repo')
    assert.ok('error' in r, text)
  }
})

test('schema: arrays and null where objects are expected are errors', () => {
  for (const over of [{ activate: [] }, { activate: null }, { gates: [] }, { gates: null }, { reviews: [] },
    { roles: [] }, { replaces: [] }, { planDrift: [] }, { phases: [null] }, { phases: [[]] },
    { phases: [{ id: 'a', owner: 'o', expect: [], enter: [] }] }, { phases: [{ id: 'a', owner: 'o', expect: null, enter: {} }] },
    { variants: [null] }, { variants: {} }]) {
    assert.ok(workflowError(minimal(over), 'repo'), JSON.stringify(over))
  }
})

test('schema: __proto__ / constructor at top level are unknown keys', () => {
  const r = parseWorkflow(src('r', '{"__proto__": {"x": 1}, "name": "flow", "title": "T", "owner": "o", "activate": {}, "phases": [{"id":"a","owner":"o","expect":[],"enter":{}}]}'), 'repo')
  assert.ok('error' in r && /unknown key '__proto__'/.test(r.error), JSON.stringify(r))
  assert.match(workflowError(minimal({ constructor: 1 }), 'repo') ?? '', /unknown key 'constructor'/)
})

test('schema: mode inside a variant is an unknown key; mode in a default file is an error (DEC-5)', () => {
  assert.match(workflowError(minimal({ variants: [{ name: 'v', phases: ['a'], activate: {}, mode: 'strict' }] }), 'repo') ?? '', /unknown key 'mode'/)
  assert.match(workflowError(minimal({ mode: 'strict' }), 'default') ?? '', /DEC-5/)
  assert.match(workflowError(minimal({ extends: 'x' }), 'default', true) ?? '', /DEC-5/)
})

test('schema: a variant without activate is an error (variants are {name, phases, activate})', () => {
  assert.ok(workflowError(minimal({ variants: [{ name: 'v', phases: ['a'] }] }), 'repo'))
})

test('schema: the same gate id used by several phases is valid', () => {
  const w = minimal({ phases: [{ id: 'a', owner: 'o', expect: [], gates: ['g'], enter: {} },
    { id: 'b', owner: 'o', expect: [], gates: ['g'], enter: {} }], gates: { g: { kind: 'command', match: 'x' } } })
  assert.equal(workflowError(w, 'repo'), null)
})

test('schema: a gate regex with JS-invalid inline flags is rejected', () => {
  assert.match(workflowError(minimal({ gates: { g: { kind: 'command', match: '(?i)make' } } }), 'repo') ?? '', /bad regular expression/)
  assert.match(workflowError(minimal({ gates: { g: { kind: 'consent', shown: '^D', before: '[' } } }), 'repo') ?? '', /bad regular expression/)
})

test('schema: a file gate with an unclosed [ glob is rejected by the one validator (DD-8), or globRegex survives it', () => {
  const err = workflowError(minimal({ gates: { g: { kind: 'file', glob: 'docs/a[b' } } }), 'repo')
  if (err === null) assert.doesNotThrow(() => globRegex('docs/a[b'))
})

test('schema: Infinity reviewers (1e400) is not a whole number', () => {
  const text = JSON.stringify(minimal()).replace(/}$/, ', "reviews": {"S": {"challenge": "c", "reviewers": 1e400, "ux": null, "check": "k", "checker": false, "tester": null}}}')
  const r = parseWorkflow(src('r', text), 'repo')
  assert.ok('error' in r && /whole number/.test(r.error), JSON.stringify(r))
})

test('schema: deeply nested / huge JSON returns an error or a workflow, never throws', () => {
  const deep = '['.repeat(100000) + ']'.repeat(100000)
  assert.doesNotThrow(() => parseWorkflow(src('deep', deep), 'repo'))
  const many = minimal({ phases: Array.from({ length: 5000 }, (_, i) => ({ id: `p${i}`, owner: 'o', expect: [], enter: {} })) })
  const r = parseWorkflow(src('many', JSON.stringify(many)), 'repo')
  assert.ok('workflow' in r)
})

// ================================================================ §4.3 extends
test('extends: a partial file whose phases name the default gates is valid (phases wholesale, gates from the default)', () => {
  // variants: [] — the default's variants name phases this file drops.
  const own = { name: 'build-tier', extends: 'build-tier', variants: [],
    phases: [{ id: 'apply', owner: 'epic-delivery', expect: [], gates: ['validate'], enter: { change: 'tasks-partial' } }] }
  const r = resolveWorkflows(DEFAULT_SOURCES, [src('docs/navigator/b.workflow.json', JSON.stringify(own))])
  assert.deepEqual(r.errors, [])
  assert.deepEqual(r.workflows.find(w => w.name === 'build-tier')!.phases.map(p => p.id), ['apply'])
})

test('extends: a file that breaks required fields after the merge is reported; the default stays', () => {
  for (const own of [{ name: 'build-tier', extends: 'build-tier', title: '' },
    { name: 'build-tier', extends: 'build-tier', phases: [] },
    { name: 'build-tier', extends: 'build-tier', variants: [{ name: 'x', phases: ['nope'], activate: {} }] }]) {
    const r = resolveWorkflows(DEFAULT_SOURCES, [src('b', JSON.stringify(own))])
    assert.equal(r.errors.length, 1, JSON.stringify(own))
    assert.equal(r.workflows.find(w => w.name === 'build-tier')!.title, buildTier.title)
  }
})

test('extends: a malformed repo strict file does not make the repo strict; the default stays', () => {
  const r = resolveWorkflows(DEFAULT_SOURCES, [src('b', '{"name": "build-tier", "extends": "build-tier", "mode": "STRICT"}')])
  assert.equal(r.mode, 'loose')
  assert.equal(r.errors.length, 1)
})

// ================================================================ signals: replay and order
test('signals: ToolRan before WorkflowsRead changes nothing but seen and the hygiene bookkeeping', () => {
  const s0 = started()
  const s = reduce(s0, cmd('git commit -m x', 1))
  assert.deepEqual({ ...s, seen: [], turnEvents: [], hygieneEvents: [] }, { ...s0, seen: [] })
  assert.deepEqual(s.hygieneEvents, ['commit'])
})

test('signals: the same SkillLoaded id twice is applied once', () => {
  const sid = id()
  const s = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5, sid), skill('epic-delivery', 6, sid))
  assert.equal(s.skills.length, 1)
})

test('signals: plugin-prefixed (even doubly) skills and agents trigger workflows', () => {
  assert.equal(run(workflows(), read(null), skill('meaningfy-architecture:architecture', 3)).workflow, 'architecting')
  assert.equal(run(workflows(), read(null), skill('a:b:service-reliability', 3)).variant, 'incident')
  const s = run(workflows(), read(null),
    { kind: 'SubagentSpawned', id: id(), agentId: 'a', type: 'meaningfy-devops:ops-watch', model: 'm', description: '', at: 3 })
  assert.deepEqual([s.workflow, s.variant], ['devops', 'check-up'])
})

test('a skill before the workflows are read selects nothing and does not throw (DD-38 rejected: start reads them first)', () => {
  const s = run(skill('architecture', 1), workflows(), read(null))
  assert.equal(s.workflow, null)
})

// ================================================================ §6.1/§6.2 odd change states
test('phase: total 0 with design and tasks is plan', () => {
  assert.equal(run(workflows(), read(change(0, 0))).phase, 'plan')
})

test('phase: an open change is never placed in explore, whose predicate is "none"', () => {
  for (const c of [change(0, 0, { hasTasks: false }), change(10, 9)]) {
    const s = run(workflows(), read(c))
    assert.notEqual(s.phase, 'explore', JSON.stringify(c))
  }
})

test('§6.2.2 files move forward: brownfield placed in apply by files does not fall back to shape when all tasks tick', () => {
  const s = run(workflows(), read(change(1, 3, { hasDesign: false })), read(change(3, 3, { hasDesign: false }), 3))
  assert.equal(s.variant, 'brownfield')
  assert.notEqual(s.phase, 'shape')
})

test('phaseFor with no phases or an unknown signal is safe', () => {
  assert.equal(phaseFor({ ...buildTier, phases: [] }, [], null, null, null), null)
  assert.equal(phaseFor(buildTier, buildTier.phases, 'nope', null, null), 'explore')
})

// ================================================================ §6.3 warnings: dedupe and clearing
test('warnings: two commits without TDD give one warning; the prefixed remedy clears it', () => {
  const s = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5), cmd('git commit -m a', 6), cmd('git commit -m b', 7))
  assert.equal(keys(s).filter(k => k === 'process:missing:apply:test-driven-development').length, 1)
  const fixed = reduce(s, skill('superpowers:test-driven-development', 8))
  assert.ok(!keys(fixed).includes('process:missing:apply:test-driven-development'))
})

test('warnings: one gate used by two phases warns per phase; passing it clears both (DD-36.5)', () => {
  const s = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5), read(change(9, 9), 6),
    skill('openspec-archive-change', 7))
  assert.ok(keys(s).includes('process:gate:apply:validate') && keys(s).includes('process:gate:verify:validate'), keys(s).join())
  const passed = reduce(s, cmd('make validate', 8))
  assert.ok(!keys(passed).some(k => k.endsWith(':validate')), keys(passed).join())
})

test('warnings: passing gate "b" does not clear the warning of gate "a:b" (DD-36.5 its own warnings)', () => {
  const w: Workflow = { name: 'flow', title: 'T', owner: 'o', activate: { skills: ['go'] },
    phases: [{ id: 'p', owner: 'o', expect: [], gates: ['a:b', 'b'], enter: { skills: ['go'] } },
      { id: 'q', owner: 'o', expect: [], enter: { skills: ['next'] } }],
    gates: { 'a:b': { kind: 'command', match: 'never-matches-xyz' }, b: { kind: 'command', match: '^bee$' } } }
  const s = run(workflows([w]), read(null), skill('go', 3), skill('next', 4))
  assert.ok(keys(s).includes('process:gate:p:a:b'), keys(s).join())
  const after = reduce(s, cmd('bee', 5))
  assert.ok(keys(after).includes('process:gate:p:a:b'), keys(after).join())
})

test('warnings: a second WorkflowsRead with a different error shows the new message', () => {
  const s = run(workflows(defaults.workflows, ['workflow file a: bad']), workflows(defaults.workflows, ['workflow file b: worse']))
  assert.ok(s.warnings.some(w => w.message === 'workflow file b: worse'), s.warnings.map(w => w.message).join())
})

test('switching workflow is not a PhaseLeft (DD-36, DD-38 rejected): no PD-2 for apply', () => {
  const s = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5), skill('architecture', 6))
  assert.equal(s.workflow, 'architecting')
  assert.ok(!keys(s).includes('process:missing:apply:cosmic-python'), keys(s).join())
})

test('PD-3 skill gate: plan → apply by files warns clarity; running clarity-gate clears it', () => {
  const s = run(workflows(), read(change(0, 9)), read(change(3, 9), 3))
  assert.equal(s.phase, 'apply')
  assert.ok(keys(s).includes('process:gate:apply:clarity'), keys(s).join())
  assert.ok(!keys(reduce(s, skill('meaningfy-building:clarity-gate', 4))).includes('process:gate:apply:clarity'))
})

// ================================================================ consent (§4.1, PD-3)
test('consent: answered twice is still one consent; apply twice warns the second time', () => {
  const start = [workflows(), read(null), skill('infrastructure-operations', 3), cmd('terraform plan', 4),
    answer('DECIDE: go?', 5), prompted(6), prompted(7)]
  const once = run(...start, cmd('terraform apply', 8))
  assert.ok(!keys(once).includes('process:gate:apply:consent'), keys(once).join())
  const twice = reduce(once, cmd('terraform apply', 9))
  assert.ok(keys(twice).includes('process:gate:apply:consent'), keys(twice).join())
})

test('consent: a DECIDE line in the middle of the answer counts; a prompt with no card shown does not', () => {
  const ok = run(workflows(), read(null), skill('infrastructure-operations', 3), answer('plan:\nDECIDE: go?\nmore', 4), prompted(5),
    cmd('terraform apply', 6))
  assert.ok(!keys(ok).includes('process:gate:apply:consent'))
  const no = run(workflows(), read(null), skill('infrastructure-operations', 3), prompted(5), cmd('terraform apply', 6))
  assert.ok(keys(no).includes('process:gate:apply:consent'))
})

test('consent: ansible-playbook --check is a dry run, not an apply', () => {
  const s = run(workflows(), read(null), skill('infrastructure-operations', 3), cmd('ansible-playbook site.yml --check', 4))
  assert.ok(!keys(s).includes('process:gate:apply:consent'))
  assert.equal(s.phase, 'card')
})

test('consent: a failed command never advances the phase', () => {
  assert.equal(run(workflows(), read(null), skill('infrastructure-operations', 3), cmd('terraform plan', 4, false)).phase, 'read')
})

// ================================================================ globRegex
test('glob: ** / * / ? / classes', () => {
  assert.ok(globRegex('**/[Aa][Dd][Rr]-[0-9]*').test('ADR-001-x.md'))
  assert.ok(globRegex('**/[Aa][Dd][Rr]-[0-9]*').test('docs/adr/adr-0001-x.adoc'))
  assert.ok(!globRegex('**/[Aa][Dd][Rr]-[0-9]*').test('docs/adr/readme.md'))
  assert.ok(globRegex('a/**/b').test('a/b') && globRegex('a/**/b').test('a/x/y/b'))
  assert.ok(!globRegex('*.md').test('docs/x.md'))
  assert.ok(!globRegex('a?c').test('a/c'))
  assert.ok(globRegex('openspec/changes/**').test('openspec/changes/x/y.md'))
  assert.ok(!globRegex('x.json').test('xxjson'))
  assert.ok(globRegex('docs/(draft)+.md').test('docs/(draft)+.md'))
})

test('glob: an unclosed [ does not throw and matches literally', () => {
  assert.doesNotThrow(() => globRegex('docs/a[b'))
  assert.ok(globRegex('docs/a[b').test('docs/a[b'))
})

// ================================================================ view
test('view: long and control-character names stay within 120 chars and carry no control characters', () => {
  const w: Workflow = { name: 'flow', title: 'T\u001b[2J\u0007'.repeat(50), owner: 'o', provisional: true, activate: { skills: ['go'] },
    variants: [{ name: 'v\u009b31m'.repeat(40), phases: ['p\u0000'.repeat(100)], activate: { skills: ['go'] } }],
    phases: [{ id: 'p\u0000'.repeat(100), owner: 'o', expect: [], enter: { skills: ['go'] } }] }
  const s = run(workflows([w]), read(null), skill('go', 3))
  const line = lineText(s)
  assert.ok([...line].length <= 120, String(line.length))
  assert.ok(!/[\u0000-\u001f\u007f-\u009f]/.test(line))
  const b = bandModel(s)
  assert.ok(!/[\u0000-\u001f\u007f-\u009f]/.test(b.folded + b.rows.flatMap(r => r.items).join('')))
  const c = run(workflows(), read(change(3, 9, { id: 'x\u001b'.repeat(300) })))
  assert.ok([...lineText(c)].length <= 120 && !/\u001b/.test(lineText(c)))
})

// ================================================================ §8 actions
test('commandFor: empty line, extra spaces, tabs', () => {
  const installed = ['navigator', 'code-review', 'meaningfy-building:meaningfy-code-review']
  assert.ok('reason' in commandFor('', installed))
  assert.ok('reason' in commandFor('   ', installed))
  assert.deepEqual(commandFor('  navigator \t validate   x  ', installed), { command: 'navigator', args: 'validate x' })
})

test('commandFor: a name that is a suffix of another resolves to itself only (DD-15)', () => {
  const installed = ['meaningfy-building:meaningfy-code-review', 'x:code-review']
  assert.deepEqual(commandFor('code-review', installed), { command: 'x:code-review', args: '' })
  assert.deepEqual(commandFor('meaningfy-code-review a SMALL', installed), { command: 'meaningfy-building:meaningfy-code-review', args: 'a SMALL' })
  assert.ok('reason' in commandFor('review', installed))
  assert.ok('reason' in commandFor('review', ['plugin:code-review', 'code-review']))
})

test('commandFor: an empty name never matches a command ending in ":"', () => {
  assert.ok('reason' in commandFor('', ['weird:']))
})

test('validateRuns with no change never yields a {change} command with an empty id', () => {
  const s0 = run(workflows(), read(change(9, 9)), skill('openspec-archive-change', 3))
  assert.equal(s0.phase, 'archive')
  assert.ok(validateRuns(s0).includes('openspec validate navigator --strict'), validateRuns(s0).join())
  const s: NavState = { ...s0, change: null }
  for (const line of validateRuns(s)) assert.ok(!/\s{2,}|validate\s+--strict/.test(line), line)
})

test('nextStep / backOnTrack with no workflow or phase are null', () => {
  assert.equal(nextStep(started()), null)
  assert.equal(backOnTrack(started()), null)
  assert.deepEqual(validateRuns(started()), [])
})
