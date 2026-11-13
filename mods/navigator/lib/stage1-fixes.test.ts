// Tests of the stage 1 review fixes (design D-21): one per decision that has no test of its own elsewhere.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validatePlan } from './actions.ts'
import { creditLoad } from './attribution.ts'
import { matchOpen } from './change.ts'
import { ARCHIVE_DIR } from './deviations.ts'
import { decideRoot, rebranched, relativeTo } from './root.ts'
import { EMPTY, reduce, revive, type NavState, type Root, type Signal } from './state.ts'
import { bandOffers } from './view.ts'

const MAIN: Root = { path: '/r', common: '/r/.git', branch: 'develop' }
const TDR: Root = { path: '/r/.claude/worktrees/tdr', common: '/r/.git', branch: 'feature/tdr' }
const BESIDE: Root = { path: '/r-x', common: '/r/.git', branch: 'feature/x' }
let n = 0
const send = (s: NavState, sig: Record<string, unknown>): NavState => reduce(s, { id: `f${n++}`, ...sig } as unknown as Signal)
const change = (archived: boolean) => ({ id: 'nav', appetite: null, done: 0, total: 0, groups: [], planMtime: 0, hasDesign: true,
  hasTasks: true, archived })
const warn = { key: 'process:gate:x', message: 'm', remedy: null, owner: '' }

test('D-21.7 two lead edits in one turn: the last root wins at the turn end', () => {
  let s = send(EMPTY, { kind: 'RootFollowed', root: MAIN })
  s = send(s, { kind: 'RootFollowed', root: TDR })
  s = send(s, { kind: 'RootFollowed', root: BESIDE })
  assert.equal(s.root, BESIDE)
})

test('D-21.1 a re-read branch updates the root; an unchanged or unreadable one does not', () => {
  assert.deepEqual(rebranched(MAIN, 'feature/y'), { ...MAIN, branch: 'feature/y' })
  assert.equal(rebranched(MAIN, 'develop'), null)
  assert.equal(rebranched(MAIN, null), null)
  assert.equal(rebranched(null, 'x'), null)
})

test('D-21.10 the last occurrence of an id decides which is named later', () => {
  assert.equal(matchOpen('x/aa-bb-aa', ['aa', 'bb']), 'aa')
  assert.equal(matchOpen('x/aa-bb', ['aa', 'bb']), 'bb')
})

test('D-21.10 decideRoot and relativeTo normalise `..` and a trailing slash; a path leaving the root stays absolute', () => {
  assert.equal(decideRoot(MAIN, { path: '/r/x/..', common: '/r/.git/' }), null)
  assert.equal(relativeTo('/r/', '/r/a/../b.md'), 'b.md')
  assert.equal(relativeTo('/r', '/r/../o/x.md'), '/o/x.md')
  assert.equal(relativeTo('/', '/a.md'), 'a.md')
  assert.equal(relativeTo('/r', 'rel/x.md'), 'rel/x.md')
})

test('D-21.2 revive migrates a stored call, spawn and subagent, and drops an entry that is not an object', () => {
  const s = revive({ skillCalls: [{ toolUseId: 'c', name: 'x', agentId: null, at: 1 }, 7],
    pendingSpawns: [{ toolUseId: 'p', type: 't', at: 1 }], subagents: [{ agentId: 'a', rootPath: 5, skills: 'x' }, null] })
  assert.deepEqual(s.skillCalls.map(c => c.loaded), [false])
  assert.deepEqual(s.pendingSpawns.map(p => p.skills), [[]])
  assert.deepEqual(s.subagents.map(a => [a.rootPath, a.skills]), [[null, []]])
  assert.equal(revive({ usd: 'free', lastChangeId: 3, root: { path: '/r' } }).usd, null)
  assert.equal(revive({ lastChangeId: 3 }).lastChangeId, null)
  assert.equal(revive({ root: { path: '/r' } }).root, null)
  assert.equal(revive({ root: MAIN }).root?.path, '/r')
})

test('D-21.5 the load of a subagent is not a lead turn event; the lead\'s is', () => {
  const sub = { agentId: 'a', toolUseId: '', type: 't', model: 'm', description: '', startedAt: 1, tokens: 0, done: false, rootPath: null, skills: [] }
  const preload = send({ ...EMPTY, subagents: [sub] }, { kind: 'SkillLoaded', name: 'x', at: 2 })
  assert.deepEqual(preload.turnEvents, [])
  assert.equal(creditLoad(EMPTY, 'x').kind, 'lead')
  assert.deepEqual(send(EMPTY, { kind: 'SkillLoaded', name: 'x', at: 2 }).turnEvents, [{ kind: 'skill', name: 'x' }])
})

test('D-21.5 Accept and the Archive check are offered only on a change that is not archived', () => {
  const open = { ...EMPTY, change: change(false), warnings: [warn] }
  assert.deepEqual(bandOffers(open), { accept: [warn], check: true })
  assert.deepEqual(bandOffers({ ...open, change: change(true) }), { accept: [], check: false })
  assert.deepEqual(bandOffers({ ...EMPTY, warnings: [warn] }), { accept: [warn], check: false })
})

test('D-21.5 Validate says "no repository" with no root, and "no gate" with a root but nothing to run', () => {
  assert.deepEqual(validatePlan(EMPTY), { reply: 'Navigator: no repository; there is nothing to validate.' })
  assert.deepEqual(validatePlan({ ...EMPTY, root: MAIN }), { reply: 'Navigator: this phase has no gate to run.' })
})

test('D-21.6 one name for the archive folder', () => {
  assert.equal(ARCHIVE_DIR, 'archive')
})
