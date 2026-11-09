import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { namesIn, parseWorkflow, resolveWorkflows, workflowError, type Source } from './workflow.ts'
import type { Workflow } from './state.ts'

const REPO = join(import.meta.dirname, '..', '..', '..')

const minimal = (over: object = {}) => JSON.stringify({
  name: 'build-tier', title: 'T', owner: 'epic-delivery', activate: {},
  phases: [{ id: 'apply', owner: 'epic-delivery', expect: [], enter: {} }], ...over })
const src = (path: string, text: string): Source => ({ path, text })

test('TC-09 a repo file with a default name replaces it; a malformed one is reported and the default stays', () => {
  const def = src('default/build-tier.workflow.json', minimal())
  const own = resolveWorkflows([def], [src('docs/navigator/b.workflow.json', minimal({ title: 'Ours' }))])
  assert.equal(own.workflows[0]!.title, 'Ours')
  assert.deepEqual(own.errors, [])

  const bad = resolveWorkflows([def], [src('docs/navigator/bad.workflow.json', '{"name": "build-tier", "title": 3}')])
  assert.equal(bad.workflows[0]!.title, 'T')
  assert.deepEqual(bad.errors, ["workflow file docs/navigator/bad.workflow.json: missing 'owner'"])
})

test('an extends file replaces only the fields it gives; mode strict makes the repo strict', () => {
  const r = resolveWorkflows([src('d', minimal())],
    [src('r', '{"name": "build-tier", "extends": "build-tier", "mode": "strict"}')])
  assert.deepEqual(r.errors, [])
  assert.equal(r.mode, 'strict')
  assert.equal(r.workflows[0]!.title, 'T')
  assert.equal(resolveWorkflows([src('d', minimal())], []).mode, 'loose')
})

test('a repo file with a new name adds a workflow; one extending an unknown name is reported', () => {
  const r = resolveWorkflows([src('d', minimal())], [src('r', minimal({ name: 'ours' })),
    src('x', '{"name": "x", "extends": "nope"}')])
  assert.deepEqual(r.workflows.map(w => w.name), ['build-tier', 'ours'])
  assert.deepEqual(r.errors, ["workflow file x: extends unknown workflow 'nope'"])
})

test('a default file declares no mode and no extends (DEC-5)', () => {
  assert.match(workflowError(JSON.parse(minimal({ mode: 'strict' })), 'default')!, /declares no 'mode'/)
  assert.equal(workflowError(JSON.parse(minimal({ mode: 'strict' })), 'repo'), null)
})

test('the schema rejects what it does not know', () => {
  const cases: [object, RegExp][] = [
    [{ colour: 1 }, /unknown key 'colour'/],
    [{ name: 'Build Tier' }, /kebab/],
    [{ phases: [] }, /non-empty/],
    [{ phases: [{ id: 'a', owner: 'o', expect: [{ skill: 's', by: 'later' }], enter: {} }] }, /expect/],
    [{ phases: [{ id: 'a', owner: 'o', expect: [], enter: { change: 'soon' } }] }, /unknown 'soon'/],
    [{ phases: [{ id: 'a', owner: 'o', expect: [], gates: ['g'], enter: {} }] }, /no gate 'g'/],
    [{ gates: { g: { kind: 'command', match: '(' } } }, /bad regular expression/],
    [{ gates: { g: { kind: 'telepathy' } } }, /unknown 'telepathy'/],
    [{ variants: [{ name: 'v', phases: ['nope'], activate: {} }] }, /no phase 'nope'/],
    [{ reviews: { SMALL: { challenge: 'c', reviewers: 1, ux: null, check: 'c', checker: 'no', tester: null } } }, /checker/],
    [{ activate: { skills: 'one' } }, /list of names/],
  ]
  for (const [over, error] of cases) {
    const r = parseWorkflow(src('f', minimal(over)), 'default')
    assert.ok('error' in r && error.test(r.error), `${JSON.stringify(over)} → ${JSON.stringify(r)}`)
  }
  assert.match((parseWorkflow(src('f', '{'), 'repo') as { error: string }).error, /^workflow file f: not JSON/)
})

// ---------------------------------------------------------------- TC-16: the shipped defaults
const defaults = readdirSync(join(REPO, 'skills')).flatMap(skill => {
  const dir = join(REPO, 'skills', skill, 'assets', 'workflows')
  return existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.workflow.json'))
    .map(f => src(`skills/${skill}/assets/workflows/${f}`, readFileSync(join(dir, f), 'utf8'))) : []
})

/** The `skills: [a, b]` lists of dependencies.yaml. shortcut: the inline form only, which the lint enforces (DD-28). */
const external = readFileSync(join(REPO, 'dependencies.yaml'), 'utf8').split('\n')
  .flatMap(line => line.match(/^(?:- | {2})skills:\s*\[([^\]]*)\]/)?.[1]?.split(',').map(s => s.trim()).filter(Boolean) ?? [])

const known = new Set([
  ...readdirSync(join(REPO, 'skills')),
  ...readdirSync(join(REPO, 'agents')).map(f => f.replace(/\.md$/, '')),
  ...external,
])

test('TC-16 every default workflow file parses and names only skills and agents that exist', () => {
  assert.deepEqual(defaults.map(d => d.path.split('/').at(-1)).sort(),
    ['architecting.workflow.json', 'build-tier.workflow.json', 'devops.workflow.json', 'modelling.workflow.json',
      'release.workflow.json', 'sales.workflow.json'])
  assert.ok(external.includes('test-driven-development') && external.includes('openspec-explore'))
  for (const d of defaults) {
    const r = parseWorkflow(d, 'default')
    assert.ok('workflow' in r, 'error' in r ? r.error : '')
    const unknown = namesIn((r as { workflow: Workflow }).workflow).filter(n => !known.has(n))
    assert.deepEqual(unknown, [], `${d.path} names unknown skills or agents`)
  }
})

test('TC-16 build-tier has a review set for each of the six appetites', () => {
  const r = parseWorkflow(defaults.find(d => d.path.endsWith('build-tier.workflow.json'))!, 'default')
  assert.deepEqual(Object.keys((r as { workflow: Workflow }).workflow.reviews ?? {}),
    ['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'VERY LARGE', 'HUGE'])
})

test('a misspelt skill in a workflow is caught', () => {
  const w = JSON.parse(minimal({ owner: 'epic-deliverie' })) as Workflow
  assert.deepEqual(namesIn(w).filter(n => !known.has(n)), ['epic-deliverie'])
  assert.deepEqual(namesIn({ ...w, owner: 'superpowers:test-driven-development' }).filter(n => !known.has(n)), [])
})
