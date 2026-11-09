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
const DEFAULT_SOURCES = [file('epic-delivery', 'epic-delivery'), file('epic-planning', 'epic-shaping'),
  file('architecture', 'architecting'),
  file('conceptual-modelling', 'modelling'), file('meaningfy-release', 'release'),
  file('infrastructure-operations', 'devops'), file('sales-operations', 'sales'), file('technical-writing', 'documentation')]
const defaults = resolveWorkflows(DEFAULT_SOURCES, [])
const epicDelivery = defaults.workflows.find(w => w.name === 'epic-delivery')!

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
  const own = { name: 'epic-delivery', extends: 'epic-delivery', variants: [],
    phases: [{ id: 'apply', owner: 'epic-delivery', expect: [], gates: ['full-gates'], enter: { change: 'tasks-partial' } }] }
  const r = resolveWorkflows(DEFAULT_SOURCES, [src('docs/navigator/b.workflow.json', JSON.stringify(own))])
  assert.deepEqual(r.errors, [])
  assert.deepEqual(r.workflows.find(w => w.name === 'epic-delivery')!.phases.map(p => p.id), ['apply'])
})

test('extends: a file that breaks required fields after the merge is reported; the default stays', () => {
  for (const own of [{ name: 'epic-delivery', extends: 'epic-delivery', title: '' },
    { name: 'epic-delivery', extends: 'epic-delivery', phases: [] },
    { name: 'epic-delivery', extends: 'epic-delivery', variants: [{ name: 'x', phases: ['nope'], activate: {} }] }]) {
    const r = resolveWorkflows(DEFAULT_SOURCES, [src('b', JSON.stringify(own))])
    assert.equal(r.errors.length, 1, JSON.stringify(own))
    assert.equal(r.workflows.find(w => w.name === 'epic-delivery')!.title, epicDelivery.title)
  }
})

test('extends: a malformed repo strict file does not make the repo strict; the default stays', () => {
  const r = resolveWorkflows(DEFAULT_SOURCES, [src('b', '{"name": "epic-delivery", "extends": "epic-delivery", "mode": "STRICT"}')])
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
test('phase: total 0 with design and tasks is ready', () => {
  assert.equal(run(workflows(), read(change(0, 0))).phase, 'ready')
})

test('phase: an open change is never placed in explore, whose predicate is "none"', () => {
  for (const c of [change(0, 0, { hasTasks: false }), change(10, 9)]) {
    const s = run(workflows(), read(c))
    assert.notEqual(s.phase, 'explore', JSON.stringify(c))
  }
})

test('§6.2.2 files move forward: brownfield placed in apply by files does not fall back to propose when all tasks tick', () => {
  const s = run(workflows(), read(change(1, 3, { hasDesign: false })), read(change(3, 3, { hasDesign: false }), 3))
  assert.equal(s.variant, 'brownfield')
  assert.notEqual(s.phase, 'propose')
})

test('phaseFor with no phases or an unknown signal is safe', () => {
  assert.equal(phaseFor({ ...epicDelivery, phases: [] }, [], null, null, null), null)
  assert.equal(phaseFor(epicDelivery, epicDelivery.phases, 'nope', null, null), 'ready')
})

// ================================================================ §6.3 warnings: dedupe and clearing
test('warnings: two commits without TDD give one warning; the prefixed remedy clears it', () => {
  const s = run(workflows(), read(change(3, 9)), skill('epic-delivery', 5), cmd('git commit -m a', 6), cmd('git commit -m b', 7))
  assert.equal(keys(s).filter(k => k === 'process:missing:apply:test-driven-development').length, 1)
  const fixed = reduce(s, skill('superpowers:test-driven-development', 8))
  assert.ok(!keys(fixed).includes('process:missing:apply:test-driven-development'))
})

test('warnings: one command gate used by two phases warns in both; one run clears both (DD-36.5, inline workflow)', () => {
  const w: Workflow = { name: 'flow', title: 'T', owner: 'o', activate: { skills: ['go'] },
    phases: [{ id: 'p', owner: 'o', expect: [], gates: ['g'], enter: { skills: ['go'] } },
      { id: 'q', owner: 'o', expect: [], gates: ['g'], enter: { skills: ['next'] } },
      { id: 'r', owner: 'o', expect: [], enter: { skills: ['last'] } }],
    gates: { g: { kind: 'command', match: '^ship$' } } }
  const s = run(workflows([w]), read(null), skill('go', 3), skill('next', 4), skill('last', 5))
  assert.ok(keys(s).includes('process:gate:p:g') && keys(s).includes('process:gate:q:g'), keys(s).join())
  const passed = reduce(s, cmd('ship', 6))
  assert.ok(!keys(passed).some(k => k.endsWith(':g')), keys(passed).join())
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

test('PD-3 skill gate: design → apply by files warns clarity; running clarity-gate clears it', () => {
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

// ---- stage 3
// Plan drift (§6.4), deviations (§8, DD-12), hygiene (§6.5, DD-30), dispatch (§6.3, DD-40), strict (§7,
// DD-11, DD-35), actions (§8, DD-16). Each asserts what the design says SHOULD happen.

import { ADDED_CAP, parseDiffAdded, parseStatus, planDrift, type PlanInput } from './plan-drift.ts'
import { appendDeviation, archiveCheck, parseDeviations } from './deviations.ts'
import { offer, thresholdsFrom } from './hygiene.ts'
import { modelAbove, overspawn, roleOf, secondCheck, unusedSkills } from './dispatch.ts'
import { decideArchive, decideCommit, decideSpawn, reminder } from './strict.ts'
import { hygieneAction, modeAction, reconcile, review } from './actions.ts'
import { rewriteModel } from './lean.ts'

const THRESHOLDS = JSON.parse(readFileSync(join(REPO, 'skills/guardrails/assets/session-thresholds.json'), 'utf8'))
const T = (() => { const t = thresholdsFrom(THRESHOLDS); assert.ok(t.ok); return t.thresholds })()
const plan = (over: Partial<PlanInput> = {}): PlanInput => ({
  changed: [], added: [], tasks: '', design: '', proposal: '', ignore: [], changeId: 'navigator', ...over })
const pkeys = (over: Partial<PlanInput>) => planDrift(plan(over)).map(w => w.key)
const hyg = (events: string[], contextPercent: number, openUnticked = true) =>
  offer({ ok: true, thresholds: T }, { events: events as never, contextPercent, idleMinutes: 0, cleanTree: true, openUnticked })
const planWarn = (key: string) => ({ key, message: key, remedy: 'openspec-update-change navigator', owner: 'epic-planning' })
const planRead = (...ks: string[]): Signal => ({ kind: 'PlanRead', id: id(), warnings: ks.map(planWarn), truncated: false })
const setMode = (mode: 'loose' | 'strict'): Signal => ({ kind: 'SetMode', id: id(), mode })
const turnEnd = (contextPercent: number): Signal => ({ kind: 'TurnEnded', id: id(), turnId: id(), contextPercent, cleanTree: true, at: 9 })
// A spawn is counted when it is asked, before it runs (DD-41): what register.tsx sends first.
const spawnS = (type: string, description = ''): Signal => ({ kind: 'SpawnAsked', id: id(), type, description })
const applyState = (mode: 'loose' | 'strict' = 'loose', c = change(3, 9)) => run(workflows(defaults.workflows, [], mode), read(c))

// ---------------------------------------------------------------- plan drift PL-1
test('s3 PL-1: a path with spaces named in a task is covered', () => {
  assert.deepEqual(pkeys({ changed: ['docs/my guide.md'], tasks: '- [ ] 1.1 update `docs/my guide.md`' }), [])
})

test('s3 PL-1: stem of 3 chars does not cover, stem of 4 chars does', () => {
  assert.deepEqual(pkeys({ changed: ['p/q/abc.ts', 'p/q/abcd.ts'], tasks: 'abc and abcd' }), ['plan:outside:p/q/abc.ts'])
})

test('s3 PL-1: own change folder and ignore globs are skipped, a sibling change folder is not', () => {
  assert.deepEqual(pkeys({ changed: ['openspec/changes/navigator/x.md', 'openspec/changes/navigator-2/x.md', 'bundles/a/b.json'],
    ignore: ['bundles/**'] }), ['plan:outside:openspec/changes/navigator-2/x.md'])
})

test('s3 PL-1: a path named only inside a code block counts as named (a path anywhere in the PLAN)', () => {
  assert.deepEqual(pkeys({ changed: ['mods/x/y.ts'], design: '```\nmods/x/y.ts\n```\n' }), [])
})

test('s3 parseStatus: renames give the new path (quoted with spaces too); a deleted file is a changed path', () => {
  assert.deepEqual(parseStatus('R  old.ts -> new.ts\nR  "a b.md" -> "c d.md"\nD  gone.ts\n'), ['new.ts', 'c d.md', 'gone.ts'])
})

test('s3 parseDiffAdded: git appends a tab to a +++ path that has a space; the path excludes it', () => {
  const r = parseDiffAdded('+++ b/docs/my file.md\t\n@@ -0,0 +1 @@\n+DD-99\n')
  assert.equal(r.added[0]?.path, 'docs/my file.md')
})

test('s3 parseDiffAdded: an added line whose text starts with "++ " is an added line, not a file header', () => {
  const r = parseDiffAdded('diff --git a/x.c b/x.c\n--- a/x.c\n+++ b/x.c\n@@ -0,0 +1,2 @@\n+++ i;\n+DD-99 here\n')
  assert.deepEqual(r.added.map(a => [a.path, a.line, a.text]), [['x.c', 1, '++ i;'], ['x.c', 2, 'DD-99 here']])
})

// ---------------------------------------------------------------- plan drift PL-2
test('s3 PL-2: a ticked task naming a real path that did not change warns; unticked or token-free are not judged', () => {
  assert.deepEqual(pkeys({ tasks: '- [x] 1.3 edit `tools/a.py`\n- [ ] 1.4 edit `tools/b.py`\n- [x] 1.5 talk to people\n' }), ['plan:ticked:1.3'])
})

test('s3 PL-2: code tokens like `s.mode.session` or `v3.9.0` are not path tokens', () => {
  assert.deepEqual(pkeys({ tasks: '- [x] 1.1 set `s.mode.session` and bump to `v3.9.0`\n' }), [])
})

test('s3 PL-2: a folder token without a trailing slash counts as changed when a file under it changed', () => {
  assert.deepEqual(pkeys({ changed: ['mods/navigator/lib/x.ts'], tasks: '- [x] 1.2 build `mods/navigator`\n' }), [])
})

// ---------------------------------------------------------------- plan drift PL-3
test('s3 PL-3: ids already in design.md are quiet; DD-1 is not DD-10, DEC-20 is not DEC-2', () => {
  const added = ['DD-10', 'DD-1', 'DEC-2', 'DEC-20'].map((text, n) => ({ path: 'mods/a.ts', line: n + 1, text }))
  assert.deepEqual(pkeys({ design: 'see DD-10 and DEC-2', added }), ['plan:decision:mods/a.ts:2', 'plan:decision:mods/a.ts:4'])
})

test('s3 PL-3: a shortcut in a file design.md names is quiet; own folder and ignored paths are skipped', () => {
  const added = [{ path: 'mods/a.ts', line: 1, text: '// shortcut: x' }, { path: 'mods/b.ts', line: 1, text: '// shortcut: y' },
    { path: 'openspec/changes/navigator/design.md', line: 5, text: 'DD-99' }, { path: 'bundles/x.json', line: 1, text: 'DD-98' }]
  assert.deepEqual(pkeys({ design: 'mods/a.ts holds a shortcut', added, ignore: ['bundles/**'] }), ['plan:decision:mods/b.ts:1'])
})

test('s3 PL-3 cap: exactly 2 000 added lines is not truncated; 2 001 is, and line 2 001 is never judged', () => {
  const diff = (n: number) => `+++ b/a.ts\n@@ -0,0 +1,${n} @@\n` + Array.from({ length: n }, (_, i) => `+${i === n - 1 ? 'DD-999' : 'x'}`).join('\n')
  assert.equal(parseDiffAdded(diff(ADDED_CAP)).truncated, false)
  const r = parseDiffAdded(diff(ADDED_CAP + 1))
  assert.equal(r.truncated, true)
  assert.equal(r.added.length, ADDED_CAP)
  const added = Array.from({ length: ADDED_CAP + 1 }, (_, i) => ({ path: 'a.ts', line: i + 1, text: i === ADDED_CAP ? 'DD-999' : 'x' }))
  assert.deepEqual(pkeys({ added }), [])
})

// ---------------------------------------------------------------- deviations
test('s3 deviations: a key with a bare · is kept; " · " or a newline in a key throws', () => {
  const t = appendDeviation(null, 'plan:outside:a·b.md', 'r', '2026-11-12')!
  assert.ok(parseDeviations(t).has('plan:outside:a·b.md'))
  assert.throws(() => appendDeviation(null, 'plan:outside:a · b', 'r', '2026-11-12'))
  assert.throws(() => appendDeviation(null, 'plan:x\nplan:y', 'r', '2026-11-12'))
})

test('s3 deviations: a reason with quotes, " · " and newlines stays one line and the key parses back', () => {
  const t = appendDeviation(null, 'plan:x', 'he said "ok" · then\nleft\r\n', '2026-11-12')!
  assert.equal(t.split('\n').filter(l => l.startsWith('- ')).length, 1)
  assert.ok(t.includes('he said "ok" · then left'))
  assert.deepEqual([...parseDeviations(t)], ['plan:x'])
})

test('s3 deviations: accepting the same key twice records it once (DD-12)', () => {
  const t = appendDeviation(null, 'plan:x', 'r', '2026-11-12')!
  assert.equal(appendDeviation(t, 'plan:x', 'other', '2026-11-13'), null)
})

test('s3 deviations: a malformed existing file is appended to, not lost; CRLF lines still count', () => {
  const t = appendDeviation('garbage\nno newline at end', 'plan:x', 'r', '2026-11-12')!
  assert.ok(t.startsWith('garbage\nno newline at end\n- 2026-11-12 · plan:x · r\n'))
  assert.equal(appendDeviation('# h\r\n- 2026-11-12 · plan:x · r\r\n', 'plan:x', 'r', '2026-11-12'), null)
})

test('s3 deviations: a hand-edited line with the key but no reason still records the key (idempotent per key)', () => {
  assert.equal(appendDeviation('# h\n- 2026-11-12 · plan:x\n', 'plan:x', 'r', '2026-11-13'), null)
})

test('s3 archive check: hygiene warnings never block; every accepted key is listed', () => {
  const r = archiveCheck([{ key: 'hygiene:context', message: '', remedy: null, owner: 'guardrails' }, planWarn('plan:a')], new Set(['plan:a', 'plan:old']))
  assert.equal(r.ok, true)
  assert.deepEqual(r.accepted.sort(), ['plan:a', 'plan:old'])
})

// ---------------------------------------------------------------- hygiene
test('s3 thresholds: wrong types and unknown event names fail and the warning names the key', () => {
  const bad: [object, string][] = [[{ compact_offer_context_percent: '50' }, 'compact_offer_context_percent'],
    [{ model_rank: 'opus' }, 'model_rank'], [{ safe_point: { after: 'push', and_any: [] } }, 'safe_point.after'],
    [{ task_boundary: { any: ['commit', 'deploy'] } }, 'task_boundary.any'], [{ idle_reset: { requires_clean_tree: 'yes' } }, 'idle_reset']]
  for (const [over, k] of bad) {
    const p = thresholdsFrom({ ...THRESHOLDS, ...over })
    assert.ok(!p.ok && p.error.includes(k), JSON.stringify(over))
    const r = offer(p, { events: ['commit'], contextPercent: 90, idleMinutes: 0, cleanTree: true, openUnticked: false })
    assert.equal(r.offer, null)
    assert.ok(r.warnings[0]!.key === 'hygiene:thresholds-missing' && r.warnings[0]!.message.includes(k))
  }
  assert.ok(thresholdsFrom({ ...THRESHOLDS, extra: 1 }).ok)
  assert.ok(!thresholdsFrom([THRESHOLDS]).ok)
})

test('s3 hygiene: values exactly at each threshold count (at or above)', () => {
  assert.equal(hyg(['commit', 'phase-left'], 50).offer, 'compact')
  assert.equal(hyg(['commit', 'phase-left'], 49.9).offer, null)
  assert.equal(hyg(['commit'], 15, false).offer, 'fresh')
  assert.equal(hyg(['commit'], 14.9, false).offer, null)
  assert.deepEqual(hyg([], 75).warnings.map(w => w.key), ['hygiene:context'])
  assert.deepEqual(hyg([], 74.9).warnings, [])
})

test('s3 hygiene: safe-point events in any order (DD-40.5); a bare commit with tasks open is mid-step', () => {
  assert.equal(hyg(['phase-left', 'commit'], 60).offer, 'compact')
  assert.equal(hyg(['task-group-done', 'commit'], 60).offer, 'compact')
  assert.equal(hyg(['commit'], 60).offer, null)
  assert.equal(hyg(['commit'], 60, false).offer, 'fresh')
  assert.equal(hyg(['commit', 'phase-left'], 60, false).offer, 'fresh') // both: fresh wins
})

test('s3 hygiene via reduce: commit in one turn, phase left in the next → compact at the second turn end', () => {
  const s0 = run({ kind: 'ThresholdsRead', id: id(), raw: THRESHOLDS }, workflows(), read(change(0, 9, { appetite: 'SMALL' })))
  const s1 = [cmd('git commit -m x', 3), turnEnd(62)].reduce(reduce, s0)
  assert.equal(s1.offer, null)
  const s2 = [skill('epic-delivery', 4), turnEnd(62)].reduce(reduce, s1)
  assert.equal(s2.offer, 'compact')
})

// ---------------------------------------------------------------- dispatch
test('s3 roleOf: agent name (plugin-prefixed) first, then description regex, case-insensitive', () => {
  assert.equal(roleOf(epicDelivery, 'meaningfy-building:code-reviewer', 'stage checker'), 'reviewer')
  assert.equal(roleOf(epicDelivery, 'general-purpose', 'Stage CHECKER'), 'checker')
  assert.equal(roleOf(epicDelivery, 'general-purpose', 'adversarial run'), 'tester')
  assert.equal(roleOf(epicDelivery, 'general-purpose', 'checklist builder'), 'other')
})

test('s3 roleOf: a role regex that does not compile classes as other and never throws', () => {
  const w = { ...epicDelivery, roles: { checker: { describe: '(' } } } as Workflow
  assert.equal(roleOf(w, 'general-purpose', '('), 'other')
  assert.doesNotThrow(() => run(workflows([w]), read(change(3, 9)), spawnS('general-purpose', '(')))
})

test('s3 PD-8: one reviewer per turn over three turns is fine on SMALL; two in a turn over-spawn; LARGE allows 6', () => {
  const s = run({ kind: 'ThresholdsRead', id: id(), raw: THRESHOLDS }, workflows(), read(change(3, 9, { appetite: 'SMALL' })),
    spawnS('code-reviewer'), turnEnd(10), spawnS('code-reviewer'), turnEnd(10), spawnS('code-reviewer'))
  assert.ok(!keys(s).some(k => k.startsWith('process:overspawn:')), keys(s).join())
  assert.equal(overspawn(epicDelivery, 'SMALL', 't', ['reviewer', 'reviewer']).length, 1)
  assert.equal(overspawn(epicDelivery, 'LARGE', 't', Array(6).fill('reviewer')).length, 0)
  assert.equal(overspawn(epicDelivery, 'LARGE', 't', Array(7).fill('reviewer')).length, 1)
  assert.equal(overspawn(epicDelivery, 'LARGE', 't', ['reviewer', 'checker', 'tester', 'other']).length, 0)
})

test('s3 PD-9: a checker spawned before the reviewers does not count as the second check', () => {
  assert.equal(secondCheck(epicDelivery, 'MEDIUM', 'x', [{ kind: 'spawn', role: 'checker' }, { kind: 'spawn', role: 'reviewer' }, { kind: 'ship' }]).length, 1)
  assert.equal(secondCheck(epicDelivery, 'MEDIUM', 'x', [{ kind: 'spawn', role: 'reviewer' }, { kind: 'spawn', role: 'checker' }, { kind: 'ship' }]).length, 0)
  assert.equal(secondCheck(epicDelivery, 'SMALL', 'x', [{ kind: 'spawn', role: 'reviewer' }, { kind: 'ship' }]).length, 0)
  const s = run({ kind: 'ThresholdsRead', id: id(), raw: THRESHOLDS }, workflows(), read(change(3, 9, { appetite: 'MEDIUM' })),
    spawnS('general-purpose', 'stage checker'), ...Array.from({ length: 5 }, () => spawnS('code-reviewer')), cmd('git push origin x', 5))
  assert.ok(keys(s).includes('process:second-check:navigator'), keys(s).join())
})

test('s3 PD-7: model ranks by substring; a declared or unranked model is never judged', () => {
  const sp = (model: string, declared = false) => ({ agentId: 'a', model, declared })
  assert.equal(modelAbove(T, sp('claude-opus-5-5'), 'claude-sonnet-4-5').length, 1)
  assert.equal(modelAbove(T, sp('sonnet'), 'claude-opus-5-5').length, 0)
  assert.equal(modelAbove(T, sp('opus'), 'claude-opus-5-5[1m]').length, 0)
  assert.equal(modelAbove(T, sp('claude-opus-5-5[1m]'), 'haiku').length, 1)
  assert.equal(modelAbove(T, sp('opus', true), 'haiku').length, 0)
  assert.equal(modelAbove(T, sp('fable'), 'haiku').length, 0)
  const s = run({ kind: 'ThresholdsRead', id: id(), raw: THRESHOLDS }, workflows(), read(change(3, 9)))
  assert.equal(rewriteModel(s, 'opus', 'claude-sonnet-4-5'), 'claude-sonnet-4-5')
  assert.equal(rewriteModel(s, 'haiku', 'claude-sonnet-4-5'), null)
})

test('s3 unused skill: only a load followed directly by another load in the turn; plugin prefix dropped', () => {
  const ws = unusedSkills([{ kind: 'skill', name: 'p:a' }, { kind: 'skill', name: 'b' }, { kind: 'tool' }, { kind: 'skill', name: 'c' }])
  assert.deepEqual(ws.map(w => [w.key, w.owner]), [['hygiene:unused:a', 'skillery-feedback']])
})

// ---------------------------------------------------------------- strict
test('s3 strict: a loose repo with session strict decides; a strict repo dropped then restored is strict again', () => {
  assert.ok('deny' in decideCommit(run(workflows(), read(change(3, 9)), setMode('strict'))))
  const back = [setMode('loose'), setMode('strict')].reduce(reduce, applyState('strict'))
  assert.equal(back.mode.session, null)
  assert.ok('deny' in decideCommit(back))
})

test('s3 strict: a phase with no expect and no gates allows the commit; the reminder says none', () => {
  const w = minimal({ phases: [{ id: 'a', owner: 'o', expect: [], enter: {} }] })
  const parsed = resolveWorkflows([src('skills/x/assets/workflows/flow.workflow.json', JSON.stringify(w))], [])
  const s = run(workflows(parsed.workflows, [], 'strict'), skill('go', 3))
  assert.equal(s.phase, 'a')
  assert.deepEqual(decideCommit(s), { allow: true })
  assert.match(reminder(s) ?? '', /Expected: none\. Gates: none\./)
})

test('s3 strict: no workflow at all → commit, spawn and archive are allowed, no reminder', () => {
  const s = run(workflows([], [], 'strict'))
  assert.deepEqual(decideCommit(s), { allow: true })
  assert.deepEqual(decideSpawn(s, null, null), { allow: true })
  assert.deepEqual(decideArchive(s), { allow: true })
  assert.equal(reminder(s), null)
})

test('s3 strict: an accepted over-spawn is not denied; the model rewrite still applies', () => {
  const over = { key: 'process:overspawn:t1', message: 'm', remedy: null, owner: 'epic-delivery' }
  const s = reduce(applyState('strict'), { kind: 'Accepted', id: id(), keys: [over.key] })
  assert.deepEqual(decideSpawn(s, over, 'sonnet'), { model: 'sonnet' })
  assert.deepEqual(decideSpawn(s, over, null), { allow: true })
})

test('s3 strict archive: open plan drift denies with the remedy and accept command; accepted allows', () => {
  const s = reduce(applyState('strict'), planRead('plan:outside:a.ts'))
  const d = decideArchive(s)
  assert.ok('deny' in d && d.deny.includes('/openspec-update-change navigator') && d.deny.includes('/navigator accept plan:outside:a.ts'))
  assert.deepEqual(decideArchive(reduce(s, { kind: 'Accepted', id: id(), keys: ['plan:outside:a.ts'] })), { allow: true })
})

// ---------------------------------------------------------------- actions
test('s3 reconcile: chains update then clarity gate for a safe id; null for unsafe ids or no open plan drift', () => {
  const s = reduce(applyState(), planRead('plan:outside:a.ts'))
  assert.deepEqual(reconcile(s), ['openspec-update-change navigator', 'clarity-gate navigator'])
  for (const bad of ['x; rm -rf /', 'a b', '$(id)', '']) {
    assert.equal(reconcile({ ...s, change: { ...s.change!, id: bad } }), null, bad)
  }
  assert.equal(reconcile(reduce(s, { kind: 'Accepted', id: id(), keys: ['plan:outside:a.ts'] })), null)
  assert.equal(reconcile(applyState()), null)
})

test('s3 reconcile/review: a change id that starts with "-" is not put on a command line (option injection)', () => {
  const s = reduce(applyState(), planRead('plan:outside:a.ts'))
  const dash = { ...s, change: { ...s.change!, id: '--help' } }
  assert.equal(reconcile(dash), null)
  assert.equal(review(dash), null)
})

test('s3 review: shown in apply only (D-9: the review is an apply exit), with id and appetite', () => {
  const s = applyState()
  assert.equal(s.phase, 'apply')
  assert.equal(review(s), 'meaningfy-code-review navigator VERY LARGE')
  for (const p of ['explore', 'propose', 'design', 'accept', 'archive']) assert.equal(review({ ...s, phase: p }), null, p)
  assert.equal(review({ ...s, change: { ...s.change!, id: 'a b' } }), null)
})

test('s3 modeAction: the switch goes both ways from the effective mode (DD-35)', () => {
  assert.equal(modeAction(applyState('loose')), 'navigator mode strict')
  assert.equal(modeAction(reduce(applyState('loose'), setMode('strict'))), 'navigator mode loose')
  assert.equal(modeAction(applyState('strict')), 'navigator mode loose')
  assert.equal(modeAction(reduce(applyState('strict'), setMode('loose'))), 'navigator mode strict')
})

test('s3 hygieneAction: compact keeps change, phase, warnings, decisions; fresh is clear; none otherwise', () => {
  const s = applyState()
  assert.deepEqual(hygieneAction({ ...s, offer: 'compact' }),
    { label: 'Compact now', line: 'compact keep: change navigator, phase apply, open warnings, decisions are in design.md' })
  assert.deepEqual(hygieneAction({ ...s, offer: 'fresh' }), { label: 'Fresh session', line: 'clear' })
  assert.equal(hygieneAction(s), null)
})
