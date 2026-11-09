// The I/O half of register.tsx (split at its size limit, DD-41): reading files, git and the
// engine, and sending signals. No decisions: those are in lib/.
import { atom, read, update } from 'claude-code'
import type { EngineInterface } from 'claude-code'

import { commandFor, validateRuns } from './lib/actions.ts'
import { appetitesOf, readChange, type ChangeFiles } from './lib/change.ts'
import { appendDeviation, archiveCheck, parseDeviations } from './lib/deviations.ts'
import { parseDiffAdded, parseStatus, planDrift } from './lib/plan-drift.ts'
import { EMPTY, reduce, revive, type BandDisplay, type NavState, type Settings, type Signal } from './lib/state.ts'
import { lineText } from './lib/view.ts'
import { resolveWorkflows, type Source } from './lib/workflow.ts'

export const nav = atom({ plugin: 'meaningfy-navigator', key: 'state' } as const, EMPTY)
export const SESSION_MOVES = ['clear', 'resume', 'branch']

export async function send($: EngineInterface, signal: Signal) {
  await update($, nav, s => reduce(revive(s), signal))
  const s = revive(await read($, nav))
  $.ui.status(s.display.line ? lineText(s) : undefined)
}

export async function repoRoot($: EngineInterface): Promise<string> {
  return (await $.session.repo())?.root ?? (await $.session.cwd())
}

export async function workflowFiles($: EngineInterface, dir: string): Promise<Source[]> {
  if (!(await $.fs.exists(dir))) return []
  const names = (await $.fs.list(dir)).map(f => f.name).filter(n => n.endsWith('.workflow.json')).sort()
  return Promise.all(names.map(async n => ({ path: `${dir}/${n}`, text: await $.fs.read(`${dir}/${n}`) })))
}

// Defaults ship in the bundle's data/ (from the host skills); a repo's own files override (design §4.3).
export async function readWorkflowsSignal($: EngineInterface, id: string): Promise<Signal> {
  const root = await repoRoot($)
  const repo = (await workflowFiles($, `${root}/docs/navigator`)).map(f => ({ ...f, path: f.path.slice(root.length + 1) }))
  const r = resolveWorkflows(await workflowFiles($, `${$.plugin.root}/data/workflows`), repo)
  return { kind: 'WorkflowsRead', id, ...r, at: await $.clock.now() }
}

export async function readChangeSignal($: EngineInterface, id: string): Promise<Signal> {
  const root = await repoRoot($)
  const dir = `${root}/openspec/changes`
  const open: ChangeFiles[] = []
  if (await $.fs.exists(dir)) {
    for (const d of await $.fs.list(dir)) {
      if (d.kind !== 'dir' || d.name === 'archive') continue
      const files = await $.fs.list(`${dir}/${d.name}`)
      const has = (n: string) => files.find(f => f.name === n)
      if (!has('proposal.md')) continue
      open.push({
        id: d.name,
        proposal: await $.fs.read(`${dir}/${d.name}/proposal.md`),
        tasks: has('tasks.md') ? await $.fs.read(`${dir}/${d.name}/tasks.md`) : null,
        design: !!has('design.md'),
        mtime: Math.max(...files.map(f => f.mtimeMs)),
        // Ticking a box is not a PLAN change: only design.md stales a skill gate (DD-38).
        planMtime: files.find(f => f.name === 'design.md')?.mtimeMs ?? 0,
      })
    }
  }
  const git = await $.process.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], { cwd: root })
  const branch = git.exitCode === 0 ? git.stdout.trim() : ''
  // The build-tier workflow names the appetites (design §6.1); the mod holds no list.
  const s = revive(await read($, nav))
  const appetites = appetitesOf(s.workflows.find(w => w.activate.openChange) ?? null)
  return { kind: 'ChangeRead', id, ...readChange(open, branch, appetites), at: await $.clock.now() }
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

export const deviationsPath = (root: string, change: string) => `${root}/openspec/changes/${change}/deviations.md`

export async function readAcceptedSignal($: EngineInterface, id: string): Promise<Signal | null> {
  const s = await state($)
  if (!s.change) return null // outside a change, accepted keys live in the session only
  const path = deviationsPath(await repoRoot($), s.change.id)
  // A change with no deviations.md has none: a switch drops the old change's keys (DD-41).
  if (!(await $.fs.exists(path))) return { kind: 'AcceptedRead', id, keys: [] }
  return { kind: 'AcceptedRead', id, keys: [...parseDeviations(await $.fs.read(path))] }
}

export async function git($: EngineInterface, root: string, args: string[]): Promise<string | null> {
  const r = await $.process.run(['git', ...args], { cwd: root })
  return r.exitCode === 0 ? r.stdout : null
}

// Plan drift reads the branch's diff against its base once per main turn (design §6.4).
export async function readPlanSignal($: EngineInterface, id: string): Promise<Signal | null> {
  const s = await state($)
  if (!s.change) return null
  const root = await repoRoot($)
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
  const status = await git($, await repoRoot($), ['status', '--porcelain'])
  return { kind: 'TurnEnded', id: `turn:${turnId}`, turnId, contextPercent: usage.context.percent ?? 0,
    cleanTree: status !== null && status.trim() === '', at: await $.clock.now(), tokens, usd: usage.cost?.usd ?? null }
}

export async function start($: EngineInterface, settings: Settings, interactive: boolean) {
  const sessionId = await $.session.id()
  await send($, { kind: 'Started', id: sessionId, sessionId, ...settings, interactive })
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
  if (s.change) {
    // A failed write names its reason and records nothing: the warning stays open (§13).
    try {
      const path = deviationsPath(await repoRoot($), s.change.id)
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
  return `Navigator: ${key} accepted${s.change ? ` in openspec/changes/${s.change.id}/deviations.md` : ' for this session'}.`
}

/** `/navigator check`: the Archive check (design §8). */
export async function check($: EngineInterface): Promise<string> {
  const s = await state($)
  if (!s.change) return 'Navigator: no open change to check.'
  const r = archiveCheck(s.warnings, new Set(s.accepted))
  const v = await $.process.run(['openspec', 'validate', s.change.id, '--strict'], { cwd: await repoRoot($) })
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
  await $.prompt.submit({ text: `/${cmd.command}${cmd.args ? ` ${cmd.args}` : ''}`, asUser: true })
  return true
}

/** `/navigator validate`: run the phase's gate commands; their results update the gates. */
export async function validate($: EngineInterface, s: NavState): Promise<string> {
  const runs = validateRuns(s)
  if (!runs.length) return 'Navigator: this phase has no gate to run.'
  const root = await repoRoot($)
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
