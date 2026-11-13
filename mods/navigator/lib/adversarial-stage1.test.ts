// Adversarial tests for stage 1 of navigator-follows-the-work (PR #200). Tests only.
// "DEFECT" tests fail on the PR head and show a wrong output; "PIN" tests pass and fix a risky edge.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { archivedFolders, matchArchived, matchOpen, readChange } from './change.ts'
import { creditSkill } from './attribution.ts'
import { acceptTarget } from './deviations.ts'
import { ARCHIVED_CHANGES, changeFiles, GIT, type GitFacts } from './fixtures.test-helpers.ts'
import { decideFallback, decideRoot, dirOf, editRoot, needsRoot, parseRevParse, relativeTo, startRoot } from './root.ts'
import { EMPTY, reduce, revive, type NavState, type Root, type Signal, type Subagent } from './state.ts'

const rootOf = (g: GitFacts): Root => parseRevParse(g.output, g.toplevel)!
const MAIN = rootOf(GIT.main)
const INSIDE = rootOf(GIT.inside)

const agent = (agentId: string, over: Partial<Subagent> = {}): Subagent =>
  ({ agentId, toolUseId: '', type: 't', model: 'm', description: '', startedAt: 1, tokens: 0, done: false, rootPath: null, skills: [], ...over })
const withState = (over: Partial<NavState>): NavState => ({ ...EMPTY, ...over })
let n = 0
type Sent = Signal extends infer S ? (S extends Signal ? Omit<S, 'id'> & { id?: string } : never) : never
const send = (s: NavState, sig: Sent): NavState => reduce(s, { id: `t${n++}`, ...sig } as Signal)

// ------------------------------------------------------------------ matchOpen

test('PIN matchOpen: regex characters in an id are literal', () => {
  assert.equal(matchOpen('feature/aXb', ['a.b']), null)
  assert.equal(matchOpen('feature/ccd', ['c+d']), null)
  assert.equal(matchOpen('feature/c+d', ['c+d']), 'c+d')
  assert.equal(matchOpen('feature/x', ['(x)', '[x]', 'x|y', '^x$']), null)
})

test('PIN matchOpen: nav vs nav-x, longest wins, a shorter id still matches a longer branch word', () => {
  assert.equal(matchOpen('feature/nav-x-stage-1', ['nav', 'nav-x']), 'nav-x')
  assert.equal(matchOpen('feature/nav-x', ['nav']), 'nav') // D-3: `-` is a boundary, so nav claims nav-x's branch
})

test('PIN matchOpen: dot and underscore are not boundaries; empty ids and empty branch never match', () => {
  assert.equal(matchOpen('feature/nav.v2', ['nav']), null)
  assert.equal(matchOpen('feature/nav_x', ['nav']), null)
  assert.equal(matchOpen('feature/x', ['']), null)
  assert.equal(matchOpen('', ['a']), null)
  assert.equal(matchOpen('HEAD', ['develop', 'main']), null) // detached HEAD names nothing
})

test('DEFECT? matchOpen: "the one named later in the branch" uses the FIRST occurrence of each id, not the last', () => {
  // `aa` is named last (offset 6) but its first occurrence (0) is before `bb` (3): the tie-break picks bb.
  assert.equal(matchOpen('aa/bb/aa', ['aa', 'bb']), 'aa') // change.ts:60 `exec` finds the first occurrence only
})

// ------------------------------------------------------------------ archived

test('DEFECT archivedFolders/matchArchived: the same id archived twice yields the OLDEST folder, not the newest', () => {
  // readdir order is ascending, so [0] is the oldest dated folder; the change followed is stale. change.ts:81
  const names = ['2026-11-01-nav', '2026-11-13-nav']
  assert.deepEqual(archivedFolders(names, 'nav'), names) // both found, order as given
  assert.equal(matchArchived('feature/nav', names, 'nav'), '2026-11-13-nav')
})

test('DEFECT readChange: re-archived id shows the old folder\'s progress', () => {
  const old = changeFiles('2026-11-01-nav', '## 1. One\n- [x] 1.1 a\n')
  const recent = changeFiles('2026-11-13-nav', '## 1. One\n- [ ] 1.1 a\n- [ ] 1.2 b\n')
  const { change } = readChange([], [old, recent], 'nav', 'feature/nav', [])
  assert.equal(change?.total, 2) // got 1: the oldest folder
})

test('PIN readChange: an unrelated branch never lands on an old archived change; an open id wins over lastChangeId', () => {
  assert.equal(readChange([], ARCHIVED_CHANGES, 'navigator', 'docs/shape-backlog', []).change, null)
  const open = [changeFiles('nav-x')]
  const r = readChange(open, [changeFiles('2026-11-09-nav')], 'nav', 'feature/nav-x', [])
  assert.equal(r.change?.id, 'nav-x')
  assert.equal(r.change?.archived, false)
})

test('PIN readChange: a just-archived id also claims any later branch that merely contains it (D-3 boundary rule)', () => {
  const r = readChange([], [changeFiles('2026-11-09-nav')], 'nav', 'feature/nav-y-unrelated', [])
  assert.equal(r.change?.archived, true) // Accept is disabled on a branch the person thinks is new work
})

// ------------------------------------------------------------------ parseRevParse

test('PIN parseRevParse: CRLF output, trailing slash and dot segments in the common dir', () => {
  assert.deepEqual(parseRevParse('/r\r\n/r/.git/\r\ndevelop\r\n', '/r'), { path: '/r', common: '/r/.git', branch: 'develop' })
  assert.equal(parseRevParse('/r\n/r/x/../.git\ndevelop\n', '/r')?.common, '/r/.git')
  assert.equal(parseRevParse('/r/sub\n../.git/\ndevelop\n', '/r/sub/')?.common, '/r/.git')
})

test('PIN parseRevParse: detached HEAD is a root whose branch is the word HEAD; a blank branch is no repository', () => {
  assert.equal(parseRevParse('/r\n/r/.git\nHEAD\n', '/r')?.branch, 'HEAD')
  assert.equal(parseRevParse('/r\n/r/.git\n\n', '/r'), null)
})

// ------------------------------------------------------------------ decideRoot / fallback / startRoot / paths

test('DEFECT decideRoot: the same working tree with a trailing slash is a re-root', () => {
  assert.equal(decideRoot(MAIN, { ...MAIN, path: '/r/' }), null) // returns the edit: root.ts:27 compares strings
})

test('PIN decideRoot/decideFallback/startRoot basics', () => {
  assert.equal(decideRoot(null, null), null)
  assert.equal(decideRoot(null, rootOf(GIT.other)), null) // no root: an edit adopts nothing (D-21.3)
  assert.equal(decideRoot(MAIN, rootOf(GIT.other)), null)
  assert.equal(decideFallback(INSIDE, false, INSIDE), null)
  assert.equal(decideFallback(INSIDE, false, null), null)
  assert.equal(decideFallback(null, false, MAIN), null)
  assert.equal(startRoot(INSIDE, MAIN), INSIDE)
})

test('DEFECT dirOf: a path with no slash loses its last character', () => {
  assert.notEqual(dirOf('rel.txt'), 'rel.tx') // root.ts:39 slice(0,-1) when lastIndexOf is -1
})

test('PIN relativeTo: a file outside the root stays absolute, never `../`', () => {
  assert.equal(relativeTo('/r', '/r2/openspec/x.md'), '/r2/openspec/x.md')
  assert.equal(relativeTo('/r', '/o/openspec/x.md'), '/o/openspec/x.md')
  assert.equal(relativeTo('/r', '/r'), '/r')
  assert.equal(relativeTo(null, '/r/x'), '/r/x')
})

test('DEFECT relativeTo: a `..` path that leaves the root is returned as a `../` relative path', () => {
  // `/r/../o/openspec/changes/x/proposal.md` is outside /r; the result must not look like an in-root path.
  assert.ok(!relativeTo('/r', '/r/../o/openspec/changes/x/proposal.md').startsWith('..')) // root.ts:43 never normalises
})

test('PIN editRoot: a subagent not yet rooted (or unlisted) falls back to the lead root, so its edit is lead-relative', () => {
  const s = withState({ root: MAIN, subagents: [agent('a1')] })
  assert.equal(needsRoot(s, 'a1'), true)
  assert.equal(needsRoot(s, 'ghost'), false) // unlisted: retried on its next call
  assert.equal(editRoot(s, 'a1'), '/r')
  assert.equal(editRoot(s, 'ghost'), '/r')
  // its worktree inside the lead's tree: the gate path is prefixed with .claude/worktrees, not `openspec/...`
  assert.equal(relativeTo(editRoot(s, 'a1'), '/r/.claude/worktrees/w/openspec/changes/x/tasks.md'),
    '.claude/worktrees/w/openspec/changes/x/tasks.md')
  const rooted = send(s, { kind: 'AgentRooted', agentId: 'a1', root: '/r/.claude/worktrees/w' })
  assert.equal(editRoot(rooted, 'a1'), '/r/.claude/worktrees/w')
  assert.equal(needsRoot(rooted, 'a1'), false)
})

// ------------------------------------------------------------------ reducer: RootFollowed / AgentRooted

test('PIN RootFollowed: same path and branch is a no-op; a new branch updates it (D-21.1); a different path replaces; same id replays', () => {
  const s1 = send(EMPTY, { kind: 'RootFollowed', id: 'r1', root: MAIN })
  assert.equal(send(s1, { kind: 'RootFollowed', id: 'r1b', root: { ...MAIN } }).root, s1.root)
  const s2 = send(s1, { kind: 'RootFollowed', id: 'r2', root: { ...MAIN, branch: 'other' } })
  assert.equal(s2.root?.branch, 'other')
  const s3 = send(s2, { kind: 'RootFollowed', id: 'r3', root: INSIDE })
  assert.equal(s3.root, INSIDE)
  assert.equal(send(s3, { kind: 'RootFollowed', id: 'r3', root: MAIN }), s3) // seen id
})

test('PIN AgentRooted before SubagentSpawned is lost, and the subagent is then retried (needsRoot)', () => {
  const early = send(EMPTY, { kind: 'AgentRooted', agentId: 'a1', root: '/w' })
  assert.equal(early.subagents.length, 0)
  const listed = send(early, { kind: 'SubagentSpawned', agentId: 'a1', type: 't', model: 'm', description: '', at: 1 })
  assert.equal(listed.subagents[0]?.rootPath, null)
  assert.equal(needsRoot(listed, 'a1'), true)
})

test('PIN AgentRooted: same id twice is applied once, a later id re-roots the agent', () => {
  const s = withState({ subagents: [agent('a1')] })
  const a = send(s, { kind: 'AgentRooted', id: 'rooted:a1', agentId: 'a1', root: '/w1' })
  assert.equal(send(a, { kind: 'AgentRooted', id: 'rooted:a1', agentId: 'a1', root: '/w2' }).subagents[0]?.rootPath, '/w1')
})

// ------------------------------------------------------------------ creditSkill / SkillLoaded

const call = (toolUseId: string, name: string, agentId: string | null, at: number) => ({ toolUseId, name, agentId, at, loaded: false })

test('PIN creditSkill: a finished subagent is never a preload; a denied/unresolved spawn is the last resort before the lead', () => {
  const done = withState({ subagents: [agent('a1', { done: true })] })
  assert.deepEqual(creditSkill(done, 'x'), { agent: null, via: 'lead' })
  const calling = withState({ subagents: [agent('a1')], agentCalls: { a1: 1 } })
  assert.deepEqual(creditSkill(calling, 'x'), { agent: null, via: 'lead' })
})

test('PIN creditSkill: same name from lead and subagent credits the oldest call; equal timestamps keep list order', () => {
  const s = withState({ skillCalls: [call('c2', 'x', 'a1', 5), call('c1', 'x', null, 3)] })
  assert.equal(creditSkill(s, 'x').toolUseId, 'c1')
  const tie = withState({ skillCalls: [call('c1', 'x', 'a1', 5), call('c2', 'x', null, 5)] })
  assert.equal(creditSkill(tie, 'x').toolUseId, 'c1')
})

test('PIN SkillLoaded: two prompts of one call count once; two concurrent calls take one prompt each', () => {
  let s = withState({ skillCalls: [call('c1', 'x', null, 1), call('c2', 'x', 'a1', 2)], subagents: [agent('a1', { startedAt: 0 })], agentCalls: { a1: 1 } })
  s = send(s, { kind: 'SkillLoaded', name: 'x', at: 3 })
  assert.equal(s.skills.length, 1)
  s = send(s, { kind: 'SkillLoaded', name: 'x', at: 4 })
  assert.deepEqual(s.subagents[0]?.skills, ['x'])
  assert.equal(s.skills.length, 1)
  s = send(s, { kind: 'SkillLoaded', name: 'x', at: 5 }) // a third prompt: both calls loaded
  assert.equal(s.skills.length, 1)
  assert.deepEqual(s.subagents[0]?.skills, ['x'])
})

test('PIN SkillLoaded: a person\'s /name typed while a tool-less subagent is running is credited to it (A-2 ambiguity)', () => {
  const s = send(withState({ subagents: [agent('a1')] }), { kind: 'SkillLoaded', name: 'plan', at: 9 })
  assert.equal(s.skills.length, 0) // not in the lead's trail
  assert.deepEqual(s.subagents[0]?.skills, ['plan'])
})

test('DEFECT SkillLoaded: a subagent preload of a skill the lead\'s still-in-flight (already loaded) call also names is dropped', () => {
  // the lead's call of `x` is loaded but not ended; a just-started subagent preloads `x`: `every(loaded)` ignores it. state.ts:258
  let s = withState({ skillCalls: [call('c1', 'x', null, 1)], subagents: [agent('a1')] })
  s = send(s, { kind: 'SkillLoaded', name: 'x', at: 2 }) // the lead's own
  s = send(s, { kind: 'SkillLoaded', name: 'x', at: 3 }) // the preload
  assert.deepEqual(s.subagents[0]?.skills, ['x'])
})

test('DEFECT SpawnResolved before SubagentSpawned drops the pending spawn\'s preloaded skills', () => {
  let s = send(EMPTY, { kind: 'SpawnStarted', toolUseId: 'p1', type: 't', at: 1 })
  s = send(s, { kind: 'SkillLoaded', name: 'x', at: 2 })
  s = send(s, { kind: 'SpawnResolved', toolUseId: 'p1', agentId: 'a1' }) // no subagent listed yet: withSkill maps nothing
  s = send(s, { kind: 'SubagentSpawned', agentId: 'a1', type: 't', model: 'm', description: '', at: 3 })
  assert.deepEqual(s.subagents[0]?.skills, ['x']) // state.ts:227 + :187 `skills: known?.skills ?? []`
})

test('PIN SpawnResolved: skills move to the subagent when it is already listed; a denied spawn (agentId null) discards them', () => {
  let s = send(withState({ subagents: [agent('a1')] }), { kind: 'SpawnStarted', toolUseId: 'p1', type: 't', at: 1 })
  s = send(s, { kind: 'SkillLoaded', name: 'x', at: 2 }) // fresh a1 wins over pending (D-19)
  assert.deepEqual(s.subagents[0]?.skills, ['x'])
  let d = send(EMPTY, { kind: 'SpawnStarted', toolUseId: 'p2', type: 't', at: 1 })
  d = send(d, { kind: 'SkillLoaded', name: 'y', at: 2 })
  d = send(d, { kind: 'SpawnResolved', toolUseId: 'p2', agentId: null })
  assert.equal(d.pendingSpawns.length, 0)
  assert.equal(d.skills.length, 0)
})

// ------------------------------------------------------------------ revive

test('DEFECT revive: a stored root of the wrong type is kept (fields defaulting to null accept anything)', () => {
  assert.equal(revive({ root: 'not-a-root' }).root, null) // state.ts:111 `d === null` short-circuits the type check
})

test('DEFECT revive + reduce: a stored subagent from before `skills` existed makes a preload throw', () => {
  const old = { agentId: 'a1', toolUseId: '', type: 't', model: 'm', description: '', startedAt: 1, tokens: 0, done: false }
  const s = revive({ subagents: [old] })
  assert.doesNotThrow(() => send(s, { kind: 'SkillLoaded', name: 'x', at: 2 })) // withSkill: a.skills.includes, state.ts:270
})

test('DEFECT needsRoot: a stored subagent without a `root` key is never rooted (undefined !== null)', () => {
  const old = { agentId: 'a1', toolUseId: '', type: 't', model: 'm', description: '', startedAt: 1, tokens: 0, done: false }
  assert.equal(needsRoot(revive({ subagents: [old] }), 'a1'), true) // root.ts:52 strict `=== null`
})

test('PIN revive: new fields default, wrong-typed arrays default, unknown fields survive', () => {
  const s = revive({ skillCalls: 'x', pendingSpawns: {}, future: 1 })
  assert.deepEqual(s.skillCalls, [])
  assert.deepEqual(s.pendingSpawns, [])
  assert.equal((s as unknown as { future: number }).future, 1)
  assert.equal(revive(null), EMPTY)
})

// ------------------------------------------------------------------ Accept

test('PIN acceptTarget: no change or no root is the session; archived wins even without a root', () => {
  const change = readChange([changeFiles('nav')], [], null, 'feature/nav', []).change!
  const archived = { ...change, archived: true }
  assert.deepEqual(acceptTarget(withState({ root: MAIN, change: null })), { kind: 'session' })
  assert.deepEqual(acceptTarget(withState({ root: null, change })), { kind: 'session' })
  const refused = { kind: 'archived', refusal: 'Navigator: nav is archived; there is nothing to accept or check.' } // D-21.5
  assert.deepEqual(acceptTarget(withState({ root: null, change: archived })), refused)
  assert.deepEqual(acceptTarget(withState({ root: INSIDE, change: archived })), refused)
  assert.deepEqual(acceptTarget(withState({ root: INSIDE, change })), { kind: 'file', path: '/r/.claude/worktrees/tdr/openspec/changes/nav/deviations.md' })
})

test('DEFECT acceptTarget: a stored non-object root builds the path "undefined/openspec/..."', () => {
  const change = readChange([changeFiles('nav')], [], null, 'feature/nav', []).change!
  const s = revive({ root: 'oops', change })
  assert.deepEqual(acceptTarget(s), { kind: 'session' }) // truthy string root: deviations.ts:14 reads `.path` of a string
})
