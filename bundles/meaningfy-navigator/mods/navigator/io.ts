// The I/O half of register.tsx (split at its size limit, DD-41): reading files, git and the
// engine, and sending signals. No decisions: those are in lib/.
import { atom, read, update } from 'claude-code'
import type { EngineInterface } from 'claude-code'

import { commandFor, validateRuns } from './lib/actions.ts'
import { appetitesOf, archivedFolders, readChange, type ChangeFiles } from './lib/change.ts'
import { acceptTarget, appendDeviation, archiveCheck, archivedRefusal, parseDeviations } from './lib/deviations.ts'
import { parseDiffAdded, parseStatus, planDrift } from './lib/plan-drift.ts'
import { decideFallback, decideRoot, dirOf, editRoot, needsRoot, parseRevParse, relativeTo, startRoot } from './lib/root.ts'
import { EMPTY, reduce, revive, type BandDisplay, type NavState, type Root, type Settings, type Signal } from './lib/state.ts'
import { lineText } from './lib/view.ts'
import { resolveWorkflows, type Source } from './lib/workflow.ts'

export const nav = atom({ plugin: 'meaningfy-navigator', key: 'state' } as const, EMPTY)
export const SESSION_MOVES = ['clear', 'resume', 'branch']

export async function send($: EngineInterface, signal: Signal) {
  await update($, nav, s => reduce(revive(s), signal))
  const s = revive(await read($, nav))
  $.ui.status(s.display.line ? lineText(s) : undefined)
}

// A cache of git facts per directory, not state (D-2). A failure is not cached: the directory may appear later.
const facts = new Map<string, Root>()

/** The working tree `dir` belongs to, or null outside a repository (D-2). */
export async function rootOf($: EngineInterface, dir: string): Promise<Root | null> {
  const hit = facts.get(dir)
  if (hit) return hit
  const out = await git($, dir, ['rev-parse', '--show-toplevel', '--git-common-dir', '--abbrev-ref', 'HEAD'])
  const root = out === null ? null : parseRevParse(out, dir)
  if (root) facts.set(dir, root)
  return root
}

/** The lead follows `root`: its workflows are re-read from there (a worktree's own docs/navigator applies). */
async function followRoot($: EngineInterface, id: string, root: Root) {
  await send($, { kind: 'RootFollowed', id: `root:${id}`, root })
  await send($, await readWorkflowsSignal($, `workflows:${id}`))
}

/** A lead edit in another working tree of the same repository moves the root, before the edit is counted. */
export async function followEdit($: EngineInterface, toolUseId: string, file: string) {
  const to = decideRoot((await state($)).root, await rootOf($, dirOf(file)))
  if (to) await followRoot($, toolUseId, to)
}

/** A subagent's root: its own `cwd()` read in its first call; the lead's is `session.root()`, never this (D-16). */
export async function rootSubagent($: EngineInterface, agentId: string) {
  if (!needsRoot(await state($), agentId)) return
  const root = await rootOf($, await $.session.cwd())
  if (root) await send($, { kind: 'AgentRooted', id: `rooted:${agentId}`, agentId, root: root.path })
}

/** At a main turn end a followed root that is gone falls back to the start root. */
export async function ensureRoot($: EngineInterface, turnId: string) {
  const { root } = await state($)
  const exists = root ? await $.fs.exists(root.path) : true
  const to = decideFallback(root, exists, await rootOf($, await $.session.root()))
  if (to) await followRoot($, `fallback:${turnId}`, to)
}

/** The path a tool call touched, relative to its own agent's root (the lead's, or the subagent's). */
export async function touchedPath($: EngineInterface, file: string, agentId: string | undefined): Promise<string> {
  return relativeTo(editRoot(await state($), agentId), file)
}

export async function workflowFiles($: EngineInterface, dir: string): Promise<Source[]> {
  if (!(await $.fs.exists(dir))) return []
  const names = (await $.fs.list(dir)).map(f => f.name).filter(n => n.endsWith('.workflow.json')).sort()
  return Promise.all(names.map(async n => ({ path: `${dir}/${n}`, text: await $.fs.read(`${dir}/${n}`) })))
}

// Defaults ship in the bundle's data/ (from the host skills); a repo's own files override (design §4.3).
export async function readWorkflowsSignal($: EngineInterface, id: string): Promise<Signal> {
  const root = (await state($)).root?.path
  const repo = root ? (await workflowFiles($, `${root}/docs/navigator`)).map(f => ({ ...f, path: f.path.slice(root.length + 1) })) : []
  const r = resolveWorkflows(await workflowFiles($, `${$.plugin.root}/data/workflows`), repo)
  return { kind: 'WorkflowsRead', id, ...r, at: await $.clock.now() }
}

/** One change folder (`proposal.md` required) as the files readChange takes; its `id` is the folder name. */
async function changeFolder($: EngineInterface, dir: string, name: string): Promise<ChangeFiles | null> {
  const files = await $.fs.list(`${dir}/${name}`)
  const has = (n: string) => files.find(f => f.name === n)
  if (!has('proposal.md')) return null
  return {
    id: name,
    proposal: await $.fs.read(`${dir}/${name}/proposal.md`),
    tasks: has('tasks.md') ? await $.fs.read(`${dir}/${name}/tasks.md`) : null,
    design: !!has('design.md'),
    // Ticking a box is not a PLAN change: only design.md stales a skill gate (DD-38).
    planMtime: files.find(f => f.name === 'design.md')?.mtimeMs ?? 0,
  }
}

async function changeFolders($: EngineInterface, dir: string, keep: (names: string[]) => string[]): Promise<ChangeFiles[]> {
  if (!(await $.fs.exists(dir))) return []
  const names = keep((await $.fs.list(dir)).filter(d => d.kind === 'dir').map(d => d.name))
  return (await Promise.all(names.map(n => changeFolder($, dir, n)))).filter((c): c is ChangeFiles => c !== null)
}

export async function readChangeSignal($: EngineInterface, id: string): Promise<Signal> {
  const s = await state($)
  const at = await $.clock.now()
  // Outside a repository there is no change to read (error matrix).
  if (!s.root) return { kind: 'ChangeRead', id, change: null, openChanges: 0, at }
  const dir = `${s.root.path}/openspec/changes`
  const open = await changeFolders($, dir, ns => ns.filter(n => n !== 'archive'))
  const archived = await changeFolders($, `${dir}/archive`, ns => archivedFolders(ns, s.lastChangeId))
  const git = await $.process.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], { cwd: s.root.path })
  const branch = git.exitCode === 0 ? git.stdout.trim() : ''
  // The epic-delivery workflow names the appetites (design §6.1); the mod holds no list.
  const appetites = appetitesOf(s.workflows.find(w => w.activate.openChange) ?? null)
  return { kind: 'ChangeRead', id, ...readChange(open, archived, s.lastChangeId, branch, appetites), at }
}

export async function state($: EngineInterface): Promise<NavState> {
  return revive(await read($, nav))
}

/** The guardrails thresholds, unparsed: lib/hygiene.ts reports a missing or bad file (TC-19). */
export async function readThresholdsSignal($: EngineInterface, id: string): Promise<Signal> {
  try {
    return { kind: 'ThresholdsRead', id, raw: JSON.parse(await $.fs.read(`${$.plugin.root}/data/session-thresholds.json`)) }
  } catch {
    return { kind: 'ThresholdsRead', id, raw: null }
  }
}

export async function readAcceptedSignal($: EngineInterface, id: string): Promise<Signal | null> {
  const target = acceptTarget(await state($))
  if (target.kind === 'session') return null // outside a change, accepted keys live in the session only
  // A change with no deviations.md (or an archived one) has none: a switch drops the old change's keys (DD-41).
  if (target.kind === 'archived' || !(await $.fs.exists(target.path))) return { kind: 'AcceptedRead', id, keys: [] }
  return { kind: 'AcceptedRead', id, keys: [...parseDeviations(await $.fs.read(target.path))] }
}

export async function git($: EngineInterface, root: string, args: string[]): Promise<string | null> {
  const r = await $.process.run(['git', ...args], { cwd: root })
  return r.exitCode === 0 ? r.stdout : null
}

// Plan drift reads the branch's diff against its base once per main turn (design §6.4).
export async function readPlanSignal($: EngineInterface, id: string): Promise<Signal | null> {
  const s = await state($)
  if (!s.change || !s.root) return null
  // An archived change has no PLAN folder left to drift from.
  if (s.change.archived) return { kind: 'PlanRead', id, warnings: [], truncated: false }
  const root = s.root.path
  let base = 'HEAD'
  for (const ref of ['origin/develop', 'origin/main', 'develop', 'main']) {
    const mb = await git($, root, ['merge-base', 'HEAD', ref])
    if (mb) { base = mb.trim(); break }
  }
  const names = (await git($, root, ['diff', '--name-only', `${base}...HEAD`])) ?? ''
  const status = (await git($, root, ['status', '--porcelain'])) ?? ''
  const { added, truncated } = parseDiffAdded((await git($, root, ['diff', '-U0', `${base}...HEAD`])) ?? '')
  const dir = `${root}/openspec/changes/${s.change.id}`
  const text = async (f: string) => ((await $.fs.exists(`${dir}/${f}`)) ? $.fs.read(`${dir}/${f}`) : '')
  const changed = [...new Set([...names.split('\n').filter(Boolean), ...parseStatus(status)])]
  const ignore = s.workflows.find(w => w.planDrift)?.planDrift?.ignore ?? []
  const warnings = planDrift({ changed, added, tasks: await text('tasks.md'), design: await text('design.md'),
    proposal: await text('proposal.md'), ignore, changeId: s.change.id })
  return { kind: 'PlanRead', id, warnings, truncated }
}

export async function turnEndedSignal($: EngineInterface, turnId: string, tokens: number): Promise<Signal> {
  const usage = await $.session.usage()
  const root = (await state($)).root?.path
  const status = root ? await git($, root, ['status', '--porcelain']) : null
  return { kind: 'TurnEnded', id: `turn:${turnId}`, turnId, contextPercent: usage.context.percent ?? 0,
    cleanTree: status !== null && status.trim() === '', at: await $.clock.now(), tokens, usd: usage.cost?.usd ?? null }
}

/** `carry` is the root of the session this one moves on from (`/clear`, `/resume`, `/branch`). */
export async function start($: EngineInterface, settings: Settings, interactive: boolean, carry: Root | null = null) {
  const sessionId = await $.session.id()
  await send($, { kind: 'Started', id: sessionId, sessionId, ...settings, interactive })
  const root = startRoot(carry, await rootOf($, await $.session.root()))
  if (root) await send($, { kind: 'RootFollowed', id: `root:start:${sessionId}`, root })
  await send($, await readThresholdsSignal($, `thresholds:${sessionId}`))
  await send($, await readWorkflowsSignal($, `workflows:${sessionId}`))
  await send($, await readChangeSignal($, `change:${sessionId}`))
  const accepted = await readAcceptedSignal($, `accepted:${sessionId}`)
  if (accepted) await send($, accepted)
}

/** `/navigator accept <key> "<reason>"`: one line in the change's deviations.md, once per key (DD-12);
 *  outside a change, this session only. */
export async function accept($: EngineInterface, key: string, reason: string): Promise<string> {
  const s = await state($)
  if (!key || !reason) return 'Usage: /navigator accept <warning key> "<reason>"'
  const id = `accept:${await $.clock.now()}:${key}`
  const target = acceptTarget(s)
  if (target.kind === 'archived') return archivedRefusal(s)!
  if (target.kind === 'file') {
    // A failed write names its reason and records nothing: the warning stays open (§13).
    try {
      const path = target.path
      const old = (await $.fs.exists(path)) ? await $.fs.read(path) : null
      const date = new Date(await $.clock.now()).toISOString().slice(0, 10)
      const text = appendDeviation(old, key, reason, date)
      if (text !== null) await $.fs.write(path, text)
    } catch (err) {
      const text = `Navigator: ${key} not accepted: ${(err as Error).message}`
      $.ui.toast(text)
      return text
    }
  }
  await send($, { kind: 'Accepted', id, keys: [key] })
  return `Navigator: ${key} accepted${target.kind === 'file' && s.change ? ` in openspec/changes/${s.change.id}/deviations.md` : ' for this session'}.`
}

/** `/navigator check`: the Archive check (design §8). */
export async function check($: EngineInterface): Promise<string> {
  const s = await state($)
  if (!s.change || !s.root) return 'Navigator: no open change to check.'
  const refused = archivedRefusal(s)
  if (refused) return refused
  const r = archiveCheck(s.warnings, new Set(s.accepted))
  const v = await $.process.run(['openspec', 'validate', s.change.id, '--strict'], { cwd: s.root.path })
  const gates = Object.entries(s.gates).map(([g, x]) => `${g} ${x.state}`).join(', ') || 'none run'
  return [`Archive check for ${s.change.id}: ${r.ok && v.exitCode === 0 ? 'passes' : 'fails'}`,
    ...r.open.map(w => `  open: ${w.key} — ${w.message}`),
    ...r.accepted.map(k => `  accepted: ${k}`),
    `  gates: ${gates}`, `  openspec validate --strict: ${v.exitCode === 0 ? 'valid' : 'invalid'}`].join('\n')
}

/** Accept from the band: ask the reason, then the same as the command. */
export async function acceptFromBand($: EngineInterface, key: string) {
  try {
    const reason = await $.ui.ask(`Why accept ${key}?`, ['Agreed with the owner', 'Out of scope; follow-up recorded'])
    // Typed into the session as a person would, so the transcript shows it (DEC-6, DD-41).
    await act($, `navigator accept ${key} "${reason.replace(/["\r\n]/g, ' ')}"`)
  } catch {
    // dismissed: nothing recorded
  }
}

export async function reconcileFromBand($: EngineInterface, steps: [string, string]) {
  // The second step waits for the first one's turn, and only if the first was submitted (DD-16, DD-41).
  if (await act($, steps[0])) await send($, { kind: 'SetPending', id: `pending:${await $.clock.now()}`, line: steps[1] })
}

/** A band action: submit the command as if the person typed it (DEC-6); not installed → say so. */
export async function act($: EngineInterface, line: string): Promise<boolean> {
  const cmd = commandFor(line, (await $.command.list()).map(c => c.name))
  if ('reason' in cmd) {
    $.ui.toast(cmd.reason)
    return false
  }
  // A slash command runs through the command channel; prompt.submit refuses a text starting with `/`.
  void $.command.run({ command: cmd.command, args: cmd.args }).catch((err: Error) => $.ui.toast(`navigator: /${cmd.command} did not run: ${err.message}`))
  return true
}

/** `/navigator validate`: run the phase's gate commands; their results update the gates. */
export async function validate($: EngineInterface, s: NavState): Promise<string> {
  const runs = validateRuns(s)
  if (!runs.length || !s.root) return 'Navigator: this phase has no gate to run.'
  const root = s.root.path
  const out: string[] = []
  for (const line of runs) {
    const r = await $.process.run(['sh', '-c', line], { cwd: root })
    const at = await $.clock.now()
    await send($, { kind: 'ToolRan', id: `validate:${at}:${line}`, command: line, ok: r.exitCode === 0, at })
    out.push(`${r.exitCode === 0 ? '✓' : '✗'} ${line} (exit ${r.exitCode})`, ...r.stdout.trim().split('\n').slice(-5))
  }
  return out.join('\n')
}

export const BAND_ARGS: Record<string, BandDisplay> = { fold: 'folded', unfold: 'unfolded', hide: 'hidden', show: 'folded' }
