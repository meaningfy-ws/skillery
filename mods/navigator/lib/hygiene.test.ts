import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { offer, onCompact, thresholdsFrom, type HygieneInput, type Thresholds } from './hygiene.ts'

// Test data only: the mod reads these values from the guardrails file, never from code.
const RAW = {
  compact_offer_context_percent: 50, context_warn_percent: 75,
  fresh_offer_min_context_percent: 15, idle_reset_minutes: 60,
  subagent_report_max_lines: 40, lookup_max_tool_calls: 3,
  model_rank: ['haiku', 'sonnet', 'opus'],
  safe_point: { after: 'commit', and_any: ['phase-left', 'task-group-done'] },
  task_boundary: { any: ['commit', 'pr-merged', 'archived'] },
  idle_reset: { requires_clean_tree: true },
}
const parsed = thresholdsFrom(RAW)
const input = (over: Partial<HygieneInput> = {}): HygieneInput =>
  ({ events: [], contextPercent: 10, idleMinutes: 0, cleanTree: false, openUnticked: true, ...over })

test('thresholdsFrom accepts the §6.5 data', () => {
  assert.ok(parsed.ok)
  assert.equal((parsed as { thresholds: Thresholds }).thresholds.model_rank[2], 'opus')
})

test('the shipped guardrails file parses when filled', () => {
  const raw = JSON.parse(readFileSync(new URL('../../../skills/guardrails/assets/session-thresholds.json', import.meta.url), 'utf8'))
  if (Object.keys(raw).length === 0) return // another builder fills it; an empty file is still being written
  assert.deepEqual(thresholdsFrom(raw), { ok: true, thresholds: raw })
})

test('thresholdsFrom names the bad key', () => {
  const bad = (over: Record<string, unknown>) => thresholdsFrom({ ...RAW, ...over })
  assert.deepEqual(thresholdsFrom(undefined), { ok: false, error: 'no thresholds file' })
  assert.deepEqual(thresholdsFrom([]), { ok: false, error: 'no thresholds file' })
  assert.deepEqual(bad({ context_warn_percent: '75' }), { ok: false, error: 'context_warn_percent' })
  assert.deepEqual(bad({ lookup_max_tool_calls: -1 }), { ok: false, error: 'lookup_max_tool_calls' })
  assert.deepEqual(bad({ model_rank: [] }), { ok: false, error: 'model_rank' })
  assert.deepEqual(bad({ model_rank: ['haiku', 3] }), { ok: false, error: 'model_rank' })
  assert.deepEqual(bad({ safe_point: { after: 'merge', and_any: [] } }), { ok: false, error: 'safe_point.after' })
  assert.deepEqual(bad({ safe_point: { after: 'commit', and_any: ['phase-gone'] } }), { ok: false, error: 'safe_point.and_any' })
  assert.deepEqual(bad({ task_boundary: { any: 'commit' } }), { ok: false, error: 'task_boundary.any' })
  assert.deepEqual(bad({ idle_reset: {} }), { ok: false, error: 'idle_reset.requires_clean_tree' })
  const { idle_reset_minutes: _, ...missing } = RAW
  assert.deepEqual(thresholdsFrom(missing), { ok: false, error: 'idle_reset_minutes' })
})

test('TC-19: thresholds missing → no offers, one warning', () => {
  const r = offer(thresholdsFrom(undefined), input({ events: ['commit', 'phase-left'], contextPercent: 90 }))
  assert.equal(r.offer, null)
  assert.equal(r.point, null)
  assert.deepEqual(r.warnings.map(w => [w.key, w.owner]), [['hygiene:thresholds-missing', 'guardrails']])
  assert.match(r.warnings[0]!.message, /no thresholds file/)
})

test('TC-08: commit + phase left at 62% → compact; no commit at 62% → no offer', () => {
  const at = offer(parsed, input({ events: ['commit', 'phase-left'], contextPercent: 62 }))
  assert.equal(at.offer, 'compact')
  assert.equal(at.point, 'safe-point')
  assert.deepEqual(at.warnings, [])
  const mid = offer(parsed, input({ events: ['phase-left'], contextPercent: 62 }))
  assert.equal(mid.offer, null)
  assert.equal(mid.point, null)
  assert.deepEqual(mid.warnings, [])
})

test('safe point below the compact threshold offers nothing', () => {
  assert.equal(offer(parsed, input({ events: ['task-group-done', 'commit'], contextPercent: 49 })).offer, null)
})

test('task boundary: fresh at or above the minimum, nothing below', () => {
  assert.equal(offer(parsed, input({ events: ['pr-merged'], contextPercent: 15 })).offer, 'fresh')
  assert.equal(offer(parsed, input({ events: ['archived'], contextPercent: 14 })).offer, null)
  assert.equal(offer(parsed, input({ events: ['archived'], contextPercent: 14 })).point, 'task-boundary')
})

test('a bare commit is a task boundary only with no unticked task open (shortcut)', () => {
  assert.equal(offer(parsed, input({ events: ['commit'], contextPercent: 30, openUnticked: false })).offer, 'fresh')
  const open = offer(parsed, input({ events: ['commit'], contextPercent: 30, openUnticked: true }))
  assert.equal(open.offer, null)
  assert.equal(open.point, null)
  // falls through to the compact rule: commit + phase left with work left → compact, not fresh
  assert.equal(offer(parsed, input({ events: ['commit', 'phase-left'], contextPercent: 62, openUnticked: true })).offer, 'compact')
  assert.equal(offer(parsed, input({ events: ['commit', 'phase-left'], contextPercent: 62, openUnticked: false })).offer, 'fresh')
})

test('idle reset: fresh after the idle gap only with a clean tree', () => {
  assert.equal(offer(parsed, input({ idleMinutes: 60, cleanTree: true })).offer, 'fresh')
  assert.equal(offer(parsed, input({ idleMinutes: 60, cleanTree: false })).offer, null)
  assert.equal(offer(parsed, input({ idleMinutes: 59, cleanTree: true })).offer, null)
  const loose = thresholdsFrom({ ...RAW, idle_reset: { requires_clean_tree: false } })
  assert.equal(offer(loose, input({ idleMinutes: 60, cleanTree: false })).offer, 'fresh')
})

test('mid-step at the warn threshold → hygiene:context warning, no offer', () => {
  const r = offer(parsed, input({ contextPercent: 75 }))
  assert.equal(r.offer, null)
  assert.deepEqual(r.warnings.map(w => [w.key, w.remedy, w.owner]), [['hygiene:context', null, 'guardrails']])
  assert.match(r.warnings[0]!.message, /commit, then compact/)
  assert.deepEqual(offer(parsed, input({ contextPercent: 74 })).warnings, [])
  // not mid-step: a safe point at high context offers instead of warning
  assert.deepEqual(offer(parsed, input({ events: ['commit', 'phase-left'], contextPercent: 80 })).warnings, [])
})

test('the rules come from the data: other events make the safe point', () => {
  const t = thresholdsFrom({ ...RAW, safe_point: { after: 'commit', and_any: ['pr-merged'] }, task_boundary: { any: ['archived'] } })
  assert.equal(offer(t, input({ events: ['commit', 'phase-left'], contextPercent: 62 })).offer, null)
  assert.equal(offer(t, input({ events: ['commit', 'pr-merged'], contextPercent: 62 })).offer, 'compact')
})

test('an automatic compaction warns; a manual one does not', () => {
  assert.deepEqual(onCompact('auto').map(w => [w.key, w.owner]), [['hygiene:auto-compact', 'guardrails']])
  assert.deepEqual(onCompact('manual'), [])
})
