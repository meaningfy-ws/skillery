import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readChange } from './change.ts'
import { ARCHIVED_CHANGES, changeFiles, GIT, OPEN_CHANGES, type GitFacts } from './fixtures.test-helpers.ts'
import { decideFallback, decideRoot, dirOf, editRoot, needsRoot, parseRevParse, relativeTo, startRoot } from './root.ts'
import { EMPTY, reduce, type NavState, type Root, type Signal } from './state.ts'
import { workflowOf } from './workflow.ts'

const rootOf = (g: GitFacts, dir = g.toplevel): Root | null => parseRevParse(g.output, dir)
const MAIN = rootOf(GIT.main)!
const INSIDE = rootOf(GIT.inside)!
const BESIDE = rootOf(GIT.beside)!
const OTHER = rootOf(GIT.other)!

// ---------------------------------------------------------------- parseRevParse

test('parseRevParse reads toplevel, common dir and branch', () => {
  assert.deepEqual(rootOf(GIT.inside), { path: '/r/.claude/worktrees/tdr', common: '/r/.git', branch: 'feature/tenant-dump-restore' })
})

test('parseRevParse makes a relative common dir absolute against the directory git ran in', () => {
  // git prints it relative to the working directory, not to the toplevel: `../../.git` from a subfolder.
  assert.equal(parseRevParse('/r\n../../.git\ndevelop\n', '/r/mods/navigator')?.common, '/r/.git')
  assert.equal(parseRevParse('/r\n.git\ndevelop\n', '/r')?.common, '/r/.git')
})

test('parseRevParse: no output or a short one is no repository', () => {
  assert.equal(parseRevParse('', '/x'), null)
  assert.equal(parseRevParse('/r\n/r/.git\n', '/r'), null)
})

// ---------------------------------------------------------------- decideRoot (TC-8, TC-9, TC-10)

test('TC-8 an edit in a worktree inside the checkout re-roots', () => {
  assert.deepEqual(decideRoot(MAIN, INSIDE), INSIDE)
})

test('TC-9 an edit in a worktree beside the checkout re-roots', () => {
  assert.deepEqual(decideRoot(MAIN, BESIDE), BESIDE)
})

test('TC-10 an edit in another repository changes nothing', () => {
  assert.equal(decideRoot(MAIN, OTHER), null)
})

test('an edit in no repository, or in the followed root itself, changes nothing', () => {
  assert.equal(decideRoot(MAIN, null), null)
  assert.equal(decideRoot(MAIN, MAIN), null)
  assert.equal(decideRoot(INSIDE, INSIDE), null)
})

test('a session that started outside any repository follows its first repository edit', () => {
  assert.deepEqual(decideRoot(null, MAIN), MAIN)
})

// ---------------------------------------------------------------- fallback and carry

test('a followed root whose directory is gone falls back to the start root', () => {
  assert.deepEqual(decideFallback(INSIDE, false, MAIN), MAIN)
})

test('no fallback while the root exists, with no start root, or when the start root is the followed one', () => {
  assert.equal(decideFallback(INSIDE, true, MAIN), null)
  assert.equal(decideFallback(INSIDE, false, null), null)
  assert.equal(decideFallback(MAIN, false, MAIN), null)
  assert.equal(decideFallback(null, false, MAIN), null)
})

test('a new atom carries the followed root; without one it takes the start root', () => {
  assert.deepEqual(startRoot(INSIDE, MAIN), INSIDE)
  assert.deepEqual(startRoot(null, MAIN), MAIN)
  assert.equal(startRoot(null, null), null)
})

// ---------------------------------------------------------------- paths

test('dirOf and relativeTo', () => {
  assert.equal(dirOf('/r/.claude/worktrees/tdr/mod/x.py'), '/r/.claude/worktrees/tdr/mod')
  assert.equal(dirOf('/x.py'), '/')
  assert.equal(relativeTo('/r/.claude/worktrees/tdr', '/r/.claude/worktrees/tdr/mod/x.py'), 'mod/x.py')
  assert.equal(relativeTo('/r', '/r-tdr/a.py'), '/r-tdr/a.py') // a sibling is not inside
  assert.equal(relativeTo(null, '/r/a.py'), '/r/a.py')
})

// ---------------------------------------------------------------- the reducer with roots (worked example 1)

const send = (s: NavState, ...signals: Signal[]) => signals.reduce(reduce, s)
const started = () => reduce(EMPTY, { kind: 'Started', id: 's1', sessionId: 's1', band: 'folded', statusLine: true, interactive: true })
const tdrTasks = (n: number) => `## 1. Work\n${Array.from({ length: 8 }, (_, i) => `- [${i < n ? 'x' : ' '}] 1.${i + 1} t\n`).join('')}`
const OPEN = [changeFiles('aggregate-events', null, false), changeFiles('tenant-dump-restore', tdrTasks(4))]
const changeAt = (s: NavState, id: string): Signal => ({ kind: 'ChangeRead', id, ...readChange(OPEN, [], s.lastChangeId,
  s.root?.branch ?? '', []), at: 1 })

/** What register.tsx does for a lead edit: re-root first, then count the file against the root it ends on. */
function leadEdit(s: NavState, file: string, facts: GitFacts | null, n: number): NavState {
  const edit = facts ? parseRevParse(facts.output, dirOf(file)) : null
  const to = decideRoot(s.root, edit)
  const rooted = to ? reduce(s, { kind: 'RootFollowed', id: `root:${n}`, root: to }) : s
  return reduce(rooted, { kind: 'FileTouched', id: `tool:${n}`, path: relativeTo(editRoot(rooted, undefined), file), at: n })
}

const shaping = () => {
  const main = { path: '/r', common: '/r/.git', branch: 'docs/shape-backlog' }
  const s = send(started(), { kind: 'RootFollowed', id: 'r0', root: main })
  return send(s, changeAt(s, 'c0'))
}

test('worked example 1.1 a session on a backlog branch follows no change', () => {
  assert.equal(shaping().change, null)
  assert.equal(shaping().openChanges, 2)
})

test('worked example 1.2 an edit in the worktree re-roots first; the change follows the worktree branch', () => {
  const s = leadEdit(shaping(), '/r/.claude/worktrees/tdr/mod/x.py', GIT.inside, 2)
  assert.equal(s.root?.path, '/r/.claude/worktrees/tdr')
  assert.equal(s.root?.branch, 'feature/tenant-dump-restore')
  const next = send(s, changeAt(s, 'c2'))
  assert.deepEqual([next.change?.id, next.change?.done, next.change?.total], ['tenant-dump-restore', 4, 8])
  assert.equal(next.lastChangeId, 'tenant-dump-restore')
})

test('worked example 1.2 the edit counts against the new root (A-3): its file gate sees the relative path', () => {
  const touched: string[] = []
  const s = shaping()
  const to = decideRoot(s.root, parseRevParse(GIT.inside.output, '/r/.claude/worktrees/tdr/mod'))!
  const rooted = reduce(s, { kind: 'RootFollowed', id: 'root:2', root: to })
  touched.push(relativeTo(editRoot(rooted, undefined), '/r/.claude/worktrees/tdr/mod/x.py'))
  // recorded before re-rooting it would have been the long path that no file gate matches
  touched.push(relativeTo(editRoot(s, undefined), '/r/.claude/worktrees/tdr/mod/x.py'))
  assert.deepEqual(touched, ['mod/x.py', '.claude/worktrees/tdr/mod/x.py'])
})

test('worked example 1.3 a sibling worktree gives the same outcome', () => {
  const s = leadEdit(shaping(), '/r-tdr/mod/x.py', GIT.beside, 3)
  assert.equal(s.root?.path, '/r-tdr')
  const next = send(s, changeAt(s, 'c3'))
  assert.equal(next.change?.id, 'tenant-dump-restore')
})

test('worked example 1.4 a file outside any repository, or in another one, does not re-root', () => {
  const before = shaping()
  assert.equal(leadEdit(before, '/tmp/notes.md', null, 4).root, before.root)
  assert.equal(leadEdit(before, '/other/a.py', GIT.other, 5).root, before.root)
})

test('worked example 1.5 /clear carries the root, so the band stays on the change', () => {
  const s = leadEdit(shaping(), '/r/.claude/worktrees/tdr/mod/x.py', GIT.inside, 2)
  let fresh = started() // Started resets the atom, root included
  assert.equal(fresh.root, null)
  fresh = reduce(fresh, { kind: 'RootFollowed', id: 'r-clear', root: startRoot(s.root, MAIN)! })
  assert.equal(fresh.root?.path, '/r/.claude/worktrees/tdr')
  assert.equal(send(fresh, changeAt(fresh, 'c-clear')).change?.id, 'tenant-dump-restore')
})

test('a followed root that is gone falls back to the start root at the turn end', () => {
  const s = leadEdit(shaping(), '/r/.claude/worktrees/tdr/mod/x.py', GIT.inside, 2)
  const to = decideFallback(s.root, false, MAIN)!
  assert.equal(reduce(s, { kind: 'RootFollowed', id: 'root:fallback:t1', root: to }).root?.path, '/r')
})

test('an archived change is read from the archive folder, by the id the last read followed', () => {
  const r = readChange(OPEN_CHANGES, ARCHIVED_CHANGES, 'boundary-owned-hint', 'feature/boundary-owned-hint', [])
  assert.deepEqual([r.change?.id, r.change?.archived], ['boundary-owned-hint', true])
})

// ---------------------------------------------------------------- subagents

const spawned = (agentId: string): Signal =>
  ({ kind: 'SubagentSpawned', id: `tu-${agentId}`, agentId, type: 'implementer', model: 'opus', description: 'd', at: 1 })

test('needsRoot: a known subagent with no root yet; not an unknown one, not one already rooted', () => {
  const s = send(started(), spawned('a1'))
  assert.equal(needsRoot(s, 'a1'), true)
  assert.equal(needsRoot(s, 'zz'), false) // not spawned yet: wait for the next call, do not mark it seen
  assert.equal(needsRoot(send(s, { kind: 'AgentRooted', id: 'rooted:a1', agentId: 'a1', root: '/r-tdr' }), 'a1'), false)
})

test("a subagent's write in its own worktree passes a file gate relative to it and leaves the lead's change alone", () => {
  const wf = { name: 'filed', title: 'Filed', owner: 'o', source: 'repo', activate: { skills: ['wf'] },
    phases: [{ id: 'a', owner: 'o', expect: [], gates: ['ga'], enter: { skills: ['wf'] } }, { id: 'b', owner: 'o', expect: [], enter: {} }],
    gates: { ga: { kind: 'file', glob: 'mod/x.py' } } } as unknown as NavState['workflows'][number]
  let s = send(started(), { kind: 'RootFollowed', id: 'r0', root: { path: '/r', common: '/r/.git', branch: 'feature/tenant-dump-restore' } },
    { kind: 'WorkflowsRead', id: 'w', workflows: [wf], errors: [], mode: 'loose', at: 1 },
    { kind: 'SkillLoaded', id: 'k', name: 'wf', at: 2 }, spawned('a1'),
    { kind: 'AgentRooted', id: 'rooted:a1', agentId: 'a1', root: '/r/.claude/worktrees/agent-a1' })
  const lead = s.root
  const file = '/r/.claude/worktrees/agent-a1/mod/x.py'
  assert.equal(editRoot(s, 'a1'), '/r/.claude/worktrees/agent-a1')
  assert.equal(editRoot(s, undefined), '/r')
  s = reduce(s, { kind: 'FileTouched', id: 'tool:1', path: relativeTo(editRoot(s, 'a1'), file), at: 3 })
  assert.equal(s.gates['ga']?.state, 'ok')
  assert.equal(workflowOf(s)?.name, 'filed')
  assert.deepEqual(s.root, lead) // the lead's root and change stay put
  assert.equal(s.change, null)
})

test('an unrooted subagent writes relative to the lead root', () => {
  const s = send(started(), { kind: 'RootFollowed', id: 'r0', root: MAIN }, spawned('a1'))
  assert.equal(editRoot(s, 'a1'), '/r')
})
