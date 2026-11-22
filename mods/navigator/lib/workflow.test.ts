import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { namesIn, parseWorkflow, resolveWorkflows, workflowError, type Source } from './workflow.ts'
import type { Workflow } from './state.ts'

const REPO = join(import.meta.dirname, '..', '..', '..')

const minimal = (over: object = {}) => JSON.stringify({
  name: 'epic-delivery', title: 'T', owner: 'epic-delivery', activate: {},
  phases: [{ id: 'apply', owner: 'epic-delivery', expect: [], enter: {} }], ...over })
const src = (path: string, text: string): Source => ({ path, text })

test('TC-09 a repo file with a default name replaces it; a malformed one is reported and the default stays', () => {
  const def = src('default/epic-delivery.workflow.json', minimal())
  const own = resolveWorkflows([def], [src('docs/navigator/b.workflow.json', minimal({ title: 'Ours' }))])
  assert.equal(own.workflows[0]!.title, 'Ours')
  assert.deepEqual(own.errors, [])

  const bad = resolveWorkflows([def], [src('docs/navigator/bad.workflow.json', '{"name": "epic-delivery", "title": 3}')])
  assert.equal(bad.workflows[0]!.title, 'T')
  assert.deepEqual(bad.errors, ["workflow file docs/navigator/bad.workflow.json: missing 'owner'"])
})

test('an extends file replaces only the fields it gives; mode strict makes the repo strict', () => {
  const r = resolveWorkflows([src('d', minimal())],
    [src('r', '{"name": "epic-delivery", "extends": "epic-delivery", "mode": "strict"}')])
  assert.deepEqual(r.errors, [])
  assert.equal(r.mode, 'strict')
  assert.equal(r.workflows[0]!.title, 'T')
  assert.equal(resolveWorkflows([src('d', minimal())], []).mode, 'loose')
})

test('a repo file with a new name adds a workflow; one extending an unknown name is reported', () => {
  const r = resolveWorkflows([src('d', minimal())], [src('r', minimal({ name: 'ours' })),
    src('x', '{"name": "x", "extends": "nope"}')])
  assert.deepEqual(r.workflows.map(w => w.name), ['epic-delivery', 'ours'])
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
    ...[2.5, -1, '5', null].map((risk_reviewers): [object, RegExp] =>
      [{ reviews: { MEDIUM: { challenge: 'c', reviewers: 2, ux: null, check: 'c', checker: true, tester: null, risk_reviewers } } }, /risk_reviewers/]),
    // D-37 W3: a malformed lens group is refused with the "list of lens groups" message.
    ...[[['L1'], 'L2'], [[1]], [['L1'], []], [['L1', 'L9']], [['L1', 'L2'], ['L2', 'L3']]].map((lenses): [object, RegExp] =>
      [{ reviews: { MEDIUM: { challenge: 'c', reviewers: 2, ux: null, check: 'c', checker: true, tester: null, lenses } } }, /list of lens groups/]),
    // D-37 S3: a risk run never has fewer reviewers than the default run.
    [{ reviews: { LARGE: { challenge: 'c', reviewers: 2, ux: null, check: 'c', checker: true, tester: null, risk_reviewers: 1 } } }, /risk_reviewers.*reviewers|reviewers.*risk_reviewers/],
    ...[{ max_added_lines: 0, reviewers: 2, lenses: [['L1']] }, { max_added_lines: 600, reviewers: '2', lenses: [['L1']] },
      { max_added_lines: 600, reviewers: 2, lenses: ['L1'] }, { max_added_lines: 600, reviewers: 2, lenses: [['L1']], x: 1 },
      { max_added_lines: 600, reviewers: 2 }, 'small'].map((small_stage): [object, RegExp] =>
      [{ reviews: { MEDIUM: { challenge: 'c', reviewers: 5, ux: null, check: 'c', checker: true, tester: null, small_stage } } }, /small_stage/]),
  ]
  for (const [over, error] of cases) {
    const r = parseWorkflow(src('f', minimal(over)), 'default')
    assert.ok('error' in r && error.test(r.error), `${JSON.stringify(over)} → ${JSON.stringify(r)}`)
  }
  assert.match((parseWorkflow(src('f', '{'), 'repo') as { error: string }).error, /^workflow file f: not JSON/)
})

// Stage 3 tester (D-38): the review-set rules of the validator, on one MEDIUM or LARGE set at a time.
const GROUPED = [['L1', 'L2'], ['L3', 'L4', 'L5']]
const reviewSet = (over: Record<string, unknown>) =>
  ({ challenge: 'c', reviewers: 2, lenses: GROUPED, ux: null, check: 'c', checker: true, tester: null, ...over })
const reviewErr = (over: Record<string, unknown>, appetite = 'MEDIUM') =>
  workflowError(JSON.parse(minimal({ reviews: { [appetite]: reviewSet(over) } })), 'default')

test('D-4: the review set the tests start from is valid, and so are risk_reviewers beside reviewers from LARGE up', () => {
  assert.equal(reviewErr({}), null)
  for (const appetite of ['LARGE', 'VERY LARGE', 'HUGE']) {
    assert.equal(reviewErr({ risk_reviewers: 2 }, appetite), null, appetite)
    assert.equal(reviewErr({ risk_reviewers: 5 }, appetite), null, appetite)
  }
})

test('D-4: a negative, fractional, string, boolean, list or object risk_reviewers is rejected', () => {
  for (const v of [-1, 2.5, '5', true, [], {}, null]) assert.match(reviewErr({ risk_reviewers: v }, 'LARGE') ?? '', /risk_reviewers/, JSON.stringify(v))
})

test('D-38 S3: risk_reviewers below reviewers, or 0, is rejected, naming both keys', () => {
  for (const v of [1, 0]) assert.match(reviewErr({ risk_reviewers: v }, 'LARGE') ?? '', /risk_reviewers.*reviewers/, String(v))
})

test('D-4: risk_reviewers below LARGE is rejected, so MEDIUM keeps its two runs on a risk', () => {
  for (const appetite of ['TINY', 'SMALL', 'MEDIUM']) assert.match(reviewErr({ risk_reviewers: 5 }, appetite) ?? '', /risk_reviewers/, appetite)
})

test('D-38 W3: an empty group, an empty list, a duplicated lens or a lens outside L1 to L5 is rejected', () => {
  assert.match(reviewErr({ lenses: [['L1'], []] }) ?? '', /lens groups/)
  assert.match(reviewErr({ lenses: [], reviewers: 1 }) ?? '', /lens groups/)
  assert.match(reviewErr({ lenses: [['L1', 'L2'], ['L2', 'L3']] }) ?? '', /lens groups/)
  assert.match(reviewErr({ lenses: ['L2', 'L2'], reviewers: 1 }) ?? '', /lens groups/)
  for (const lens of ['L6', 'L0', 'banana']) assert.match(reviewErr({ lenses: [['L1', lens], ['L3']] }) ?? '', /lens groups/, lens)
})

test('D-4: a mixed or deeper lens list is rejected, and a flat small_stage set is rejected', () => {
  for (const l of [['L1', ['L2']], [[['L1']]], 'L1', 7, {}]) assert.match(reviewErr({ lenses: l }) ?? '', /lenses/, JSON.stringify(l))
  const small = (lenses: unknown) => reviewErr({ small_stage: { max_added_lines: 600, reviewers: 2, lenses } }, 'LARGE')
  assert.equal(small(GROUPED), null)
  assert.match(small(['L1', 'L2']) ?? '', /small_stage/)
})

test('D-38: reviewers must equal the number of lens groups, a flat list being one group; so for small_stage.reviewers', () => {
  assert.match(reviewErr({ reviewers: 3 }) ?? '', /reviewers/)
  assert.match(reviewErr({ reviewers: 1 }) ?? '', /reviewers/)
  assert.match(reviewErr({ reviewers: 2, lenses: ['L2', 'L3'] }) ?? '', /reviewers/)
  assert.equal(reviewErr({ reviewers: 1, lenses: ['L2', 'L3'] }), null)
  assert.match(reviewErr({ small_stage: { max_added_lines: 600, reviewers: 3, lenses: GROUPED } }, 'LARGE') ?? '', /small_stage/)
})

const withCriteria = (criteria?: unknown) =>
  src('docs/navigator/c.workflow.json', minimal({ phases: [{ id: 'apply', owner: 'o', expect: [], enter: {},
    ...(criteria === undefined ? {} : { criteria }) }] }))

test('criteria is optional on a phase; valid criteria load (D-5)', () => {
  for (const c of [undefined, { succeeds: 'tests pass', fails: 'a test is red' }]) {
    assert.deepEqual(resolveWorkflows([], [withCriteria(c)]).errors, [], JSON.stringify(c))
  }
})

test('malformed criteria is a schema error naming the file and the phase (D-5)', () => {
  const bad = [{ succeeds: '' }, 'text', ['a'], null, { succeeds: 'a' }, { fails: 'b' },
    { succeeds: 'a', fails: 'b', extra: 'c' }, { succeeds: 'a', fails: '' }, { succeeds: 'a', fails: '   ' },
    { succeeds: 1, fails: 'b' },
    { succeeds: 'a', other: 'b' }]
  for (const c of bad) {
    assert.deepEqual(resolveWorkflows([], [withCriteria(c)]).errors,
      ['workflow file docs/navigator/c.workflow.json: phases[0].criteria must be {succeeds, fails}, each a non-empty string'],
      JSON.stringify(c))
  }
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
    ['architecting.workflow.json', 'contract.workflow.json', 'devops.workflow.json', 'documentation.workflow.json',
      'epic-delivery.workflow.json', 'epic-shaping.workflow.json', 'modelling.workflow.json', 'release.workflow.json',
      'sales.workflow.json'])
  assert.ok(external.includes('test-driven-development') && external.includes('openspec-explore'))
  for (const d of defaults) {
    const r = parseWorkflow(d, 'default')
    assert.ok('workflow' in r, 'error' in r ? r.error : '')
    const unknown = namesIn((r as { workflow: Workflow }).workflow).filter(n => !known.has(n))
    assert.deepEqual(unknown, [], `${d.path} names unknown skills or agents`)
  }
})

test('TC-16 epic-delivery has a review set for each of the six appetites', () => {
  const r = parseWorkflow(defaults.find(d => d.path.endsWith('epic-delivery.workflow.json'))!, 'default')
  assert.deepEqual(Object.keys((r as { workflow: Workflow }).workflow.reviews ?? {}),
    ['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'VERY LARGE', 'HUGE'])
})

const DEFAULT_SMALL_STAGE = { max_added_lines: 600, reviewers: 2, lenses: [['L1', 'L2'], ['L3', 'L4', 'L5']] }
const TESTER = 'Adversarial tester, on its condition (stage loop, Prepare)'

test('D-12 epic-delivery: LARGE and above carry the small_stage set; TINY, SMALL and MEDIUM do not; MEDIUM defaults to two reviewers', () => {
  const r = parseWorkflow(defaults.find(d => d.path.endsWith('epic-delivery.workflow.json'))!, 'default')
  const reviews = (r as { workflow: Workflow }).workflow.reviews ?? {}
  for (const [name, set] of Object.entries(reviews)) {
    const sized = !['TINY', 'SMALL', 'MEDIUM'].includes(name)
    assert.deepEqual(set.small_stage, sized ? DEFAULT_SMALL_STAGE : undefined, name)
    assert.equal(set.tester, ['TINY', 'SMALL'].includes(name) ? null : TESTER, name)
  }
})

test('D-4 epic-delivery: the review sets as data, one pass at TINY and SMALL, two grouped runs from MEDIUM, five lenses on a risk from LARGE', () => {
  const r = parseWorkflow(defaults.find(d => d.path.endsWith('epic-delivery.workflow.json'))!, 'default')
  const reviews = (r as { workflow: Workflow }).workflow.reviews ?? {}
  const GROUPS = [['L1', 'L2'], ['L3', 'L4', 'L5']]
  for (const name of ['TINY', 'SMALL']) {
    assert.deepEqual([reviews[name]?.reviewers, reviews[name]?.lenses, reviews[name]?.risk_reviewers], [1, ['L2', 'L3'], undefined], name)
  }
  assert.deepEqual([reviews.MEDIUM?.reviewers, reviews.MEDIUM?.lenses, reviews.MEDIUM?.risk_reviewers], [2, GROUPS, undefined])
  for (const name of ['LARGE', 'VERY LARGE', 'HUGE']) {
    assert.deepEqual([reviews[name]?.reviewers, reviews[name]?.lenses, reviews[name]?.risk_reviewers, reviews[name]?.ux?.extra_reviewers],
      [2, GROUPS, 5, 1], name)
  }
  assert.match(reviews.MEDIUM?.challenge ?? '', /^Two grouped runs \(L1 with L2; L3 with L4 and L5\)/)
  assert.match(reviews.LARGE?.challenge ?? '', /five single lenses.*risk/i)
})

test('roles.matrix: string values for declared roles pass; a non-string value or an undeclared role is refused naming the key', () => {
  const roles = { reviewer: { agents: ['code-reviewer'] }, checker: { describe: '\\bcheck(er)?\\b' } }
  const ok = (matrix?: object) => parseWorkflow(src('f', minimal({ roles: matrix ? { ...roles, matrix } : roles })), 'default')
  assert.ok('workflow' in ok({ reviewer: 'reviewer-single', checker: 'checker' }))
  assert.ok('workflow' in ok())
  const bad: [object, RegExp][] = [
    [{ reviewer: 1 }, /roles\.matrix\.reviewer/],
    [{ checker: null }, /roles\.matrix\.checker/],
    [{ tester: 'builder' }, /roles\.matrix\.tester/],
    [{ ghost: 'builder' }, /roles\.matrix\.ghost/],
  ]
  for (const [matrix, error] of bad) {
    const r = ok(matrix)
    assert.ok('error' in r && error.test(r.error), `${JSON.stringify(matrix)} → ${JSON.stringify(r)}`)
  }
})

test('a misspelt skill in a workflow is caught', () => {
  const w = JSON.parse(minimal({ owner: 'epic-deliverie' })) as Workflow
  assert.deepEqual(namesIn(w).filter(n => !known.has(n)), ['epic-deliverie'])
  assert.deepEqual(namesIn({ ...w, owner: 'superpowers:test-driven-development' }).filter(n => !known.has(n)), [])
})
