// The only file that touches `$` (design §1): events → signals → reduce → state; draws the line
// and the band. Everything it decides is in lib/, pure and unit-tested.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import { backOnTrack, commandFor, hygieneAction, modeAction, nextStep, reconcile, review, validateRuns } from './lib/actions.ts'
import { appetitesOf, readChange, type ChangeFiles } from './lib/change.ts'
import { appendDeviation, archiveCheck, parseDeviations } from './lib/deviations.ts'
import { spawnCheck } from './lib/lean.ts'
import { parseDiffAdded, parseStatus, planDrift } from './lib/plan-drift.ts'
import { EMPTY, reduce, revive, settingsFrom, type BandDisplay, type NavState, type Settings, type Signal } from './lib/state.ts'
import { decideArchive, decideCommit, decideSpawn, reminder } from './lib/strict.ts'
import { bandModel, lineText } from './lib/view.ts'
import { resolveWorkflows, type Source } from './lib/workflow.ts'

const nav = atom({ plugin: 'meaningfy-navigator', key: 'state' } as const, EMPTY)
const SESSION_MOVES = ['clear', 'resume', 'branch']

async function send($: EngineInterface, signal: Signal) {
  await update($, nav, s => reduce(revive(s), signal))
  const s = revive(await read($, nav))
  $.ui.status(s.display.line ? lineText(s) : undefined)
}

async function repoRoot($: EngineInterface): Promise<string> {
  return (await $.session.repo())?.root ?? (await $.session.cwd())
}

async function workflowFiles($: EngineInterface, dir: string): Promise<Source[]> {
  if (!(await $.fs.exists(dir))) return []
  const names = (await $.fs.list(dir)).map(f => f.name).filter(n => n.endsWith('.workflow.json')).sort()
  return Promise.all(names.map(async n => ({ path: `${dir}/${n}`, text: await $.fs.read(`${dir}/${n}`) })))
}

// Defaults ship in the bundle's data/ (from the host skills); a repo's own files override (design §4.3).
async function readWorkflowsSignal($: EngineInterface, id: string): Promise<Signal> {
  const root = await repoRoot($)
  const repo = (await workflowFiles($, `${root}/docs/navigator`)).map(f => ({ ...f, path: f.path.slice(root.length + 1) }))
  const r = resolveWorkflows(await workflowFiles($, `${$.plugin.root}/data/workflows`), repo)
  return { kind: 'WorkflowsRead', id, ...r, at: await $.clock.now() }
}

async function readChangeSignal($: EngineInterface, id: string): Promise<Signal> {
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

async function state($: EngineInterface): Promise<NavState> {
  return revive(await read($, nav))
}

/** The guardrails thresholds, unparsed: lib/hygiene.ts reports a missing or bad file (TC-19). */
async function readThresholdsSignal($: EngineInterface, id: string): Promise<Signal> {
  try {
    return { kind: 'ThresholdsRead', id, raw: JSON.parse(await $.fs.read(`${$.plugin.root}/data/session-thresholds.json`)) }
  } catch {
    return { kind: 'ThresholdsRead', id, raw: null }
  }
}

const deviationsPath = (root: string, change: string) => `${root}/openspec/changes/${change}/deviations.md`

async function readAcceptedSignal($: EngineInterface, id: string): Promise<Signal | null> {
  const s = await state($)
  const path = s.change && deviationsPath(await repoRoot($), s.change.id)
  if (!path || !(await $.fs.exists(path))) return null
  return { kind: 'Accepted', id, keys: [...parseDeviations(await $.fs.read(path))] }
}

async function git($: EngineInterface, root: string, args: string[]): Promise<string | null> {
  const r = await $.process.run(['git', ...args], { cwd: root })
  return r.exitCode === 0 ? r.stdout : null
}

// Plan drift reads the branch's diff against its base once per main turn (design §6.4).
async function readPlanSignal($: EngineInterface, id: string): Promise<Signal | null> {
  const s = await state($)
  if (!s.change) return null
  const root = await repoRoot($)
  let base = 'HEAD'
  for (const ref of ['origin/develop', 'origin/main']) {
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

async function turnEndedSignal($: EngineInterface, turnId: string): Promise<Signal> {
  const usage = await $.session.usage()
  const status = await git($, await repoRoot($), ['status', '--porcelain'])
  return { kind: 'TurnEnded', id: `turn:${turnId}`, turnId, contextPercent: usage.context.percent ?? 0,
    cleanTree: status !== null && status.trim() === '', at: await $.clock.now() }
}

async function start($: EngineInterface, settings: Settings, interactive: boolean) {
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
async function accept($: EngineInterface, key: string, reason: string): Promise<string> {
  const s = await state($)
  if (!key || !reason) return 'Usage: /navigator accept <warning key> "<reason>"'
  const id = `accept:${await $.clock.now()}:${key}`
  if (s.change) {
    const path = deviationsPath(await repoRoot($), s.change.id)
    const old = (await $.fs.exists(path)) ? await $.fs.read(path) : null
    const date = new Date(await $.clock.now()).toISOString().slice(0, 10)
    const text = appendDeviation(old, key, reason, date)
    if (text !== null) await $.fs.write(path, text)
  }
  await send($, { kind: 'Accepted', id, keys: [key] })
  return `Navigator: ${key} accepted${s.change ? ` in openspec/changes/${s.change.id}/deviations.md` : ' for this session'}.`
}

/** `/navigator check`: the Archive check (design §8). */
async function check($: EngineInterface): Promise<string> {
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
async function acceptFromBand($: EngineInterface, key: string) {
  try {
    const reason = await $.ui.ask(`Why accept ${key}?`, ['Agreed with the owner', 'Out of scope; follow-up recorded'])
    $.ui.toast(await accept($, key, reason))
  } catch {
    // dismissed: nothing recorded
  }
}

async function reconcileFromBand($: EngineInterface, steps: [string, string]) {
  await send($, { kind: 'SetPending', id: `pending:${await $.clock.now()}`, line: steps[1] })
  await act($, steps[0])
}

/** A band action: submit the command as if the person typed it (DEC-6); not installed → say so. */
async function act($: EngineInterface, line: string) {
  const cmd = commandFor(line, (await $.command.list()).map(c => c.name))
  if ('reason' in cmd) $.ui.toast(cmd.reason)
  else await $.prompt.submit({ text: `/${cmd.command}${cmd.args ? ` ${cmd.args}` : ''}`, asUser: true })
}

/** `/navigator validate`: run the phase's gate commands; their results update the gates. */
async function validate($: EngineInterface, s: NavState): Promise<string> {
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

const BAND_ARGS: Record<string, BandDisplay> = { fold: 'folded', unfold: 'unfolded', hide: 'hidden', show: 'folded' }

export const register: Register = (on, options) => {
  const settings = settingsFrom(options)

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'navigator',
      description: 'Navigator: `band`, `line`, `validate`, `check` (archive), `accept <key> "<reason>"`, `mode loose|strict`',
      argumentHint: 'band | line | validate | check | accept | mode',
    })
    await start($, settings, e.isInteractive)
    return next(e)
  }).catch(($, e, next) => next(e))

  on('command.run', { command: SESSION_MOVES }, async ($, e, next) => {
    const result = await next(e)
    const s = revive(await read($, nav))
    if (s.sessionId !== (await $.session.id())) await start($, settings, s.interactive)
    return result
  }).catch(($, e, next) => next(e))

  on('command.run', { command: 'navigator' }, async ($, e) => {
    const [verb = '', arg = ''] = e.args.trim().split(/\s+/)
    if (verb === 'accept') {
      const m = e.args.trim().match(/^accept\s+(\S+)\s+"?(.*?)"?\s*$/)
      return { text: await accept($, m?.[1] ?? '', m?.[2] ?? ''), isTextDisplayOnly: true }
    }
    if (verb === 'check') return { text: await check($), isTextDisplayOnly: true }
    if (verb === 'mode' && (arg === 'loose' || arg === 'strict')) {
      await send($, { kind: 'SetMode', id: `mode:${await $.clock.now()}`, mode: arg })
      return { text: `Navigator: ${arg} for this session; the next session follows the repo again.`, isTextDisplayOnly: true }
    }
    const id = `cmd:${await $.clock.now()}`
    const band = BAND_ARGS[arg]
    if (verb === 'band' && !arg) await send($, { kind: 'ToggleBand', id })
    else if (verb === 'band' && band) await send($, { kind: 'SetBand', id, band })
    else if (verb === 'line' && !arg) await send($, { kind: 'ToggleLine', id })
    else if (verb === 'line' && (arg === 'show' || arg === 'hide')) await send($, { kind: 'SetLine', id, line: arg === 'show' })
    else if (verb === 'validate') return { text: await validate($, revive(await read($, nav))), isTextDisplayOnly: true }
    else return { text: 'Usage: /navigator band [fold|unfold|hide|show] | line [show|hide] | validate | check | accept <key> "<reason>" | mode loose|strict', isTextDisplayOnly: true }
    const s = revive(await read($, nav))
    return { text: `Navigator: band ${s.display.band}, line ${s.display.line ? 'shown' : 'hidden'}.`, isTextDisplayOnly: true }
  }).catch(() => ({ text: 'Navigator could not change the display; see the debug log.', isTextDisplayOnly: true as const }))

  on('skill.prompt', async ($, e, next) => {
    const at = await $.clock.now()
    await send($, { kind: 'SkillLoaded', id: `skill:${e.skill}:${at}`, name: e.skill, at })
    return next(e)
  }).catch(($, e, next) => next(e))

  // Commands and edits feed the gates, the commit checks and the DevOps phases (design §5).
  on('tool.call', async ($, e, next) => {
    // Strict mode decides before the command runs (design §7); loose never blocks.
    if (e.tool === 'Bash') {
      const s = await state($)
      const d = /\bgit\s+commit\b/.test(e.command) ? decideCommit(s) : /\bopenspec\s+archive\b/.test(e.command) ? decideArchive(s) : null
      if (d && 'deny' in d) return { deny: d.deny }
    }
    const result = await next(e)
    if (result.deny !== undefined) return result
    const at = await $.clock.now()
    // A background call has not run yet when it returns: it passes no gate (DD-38).
    if (e.tool === 'Bash' && !e.run_in_background) {
      await send($, { kind: 'ToolRan', id: `tool:${e.tool_use_id}`, command: e.command, ok: !result.isError, at,
        ...(e.agentId ? { agentId: e.agentId } : {}) })
    } else if (e.tool === 'Edit' || e.tool === 'Write' || e.tool === 'NotebookEdit') {
      const root = await repoRoot($)
      const file = e.tool === 'NotebookEdit' ? e.notebook_path : e.file_path
      const path = file.startsWith(`${root}/`) ? file.slice(root.length + 1) : file
      await send($, { kind: 'FileTouched', id: `tool:${e.tool_use_id}`, path, at })
    }
    return result
  }).catch(($, e, next) => next(e))

  // Only a person's own prompt answers a consent card: typed, or through Remote Control (DD-38).
  on('prompt.submit', async ($, e, next) => {
    if (e.origin.kind === 'composer' || e.origin.kind === 'bridge') await send($, { kind: 'UserPrompted', id: `prompt:${await $.clock.now()}`, at: await $.clock.now() })
    return next(e)
  }).catch(($, e, next) => next(e))

  on('agent.spawn', async ($, e, next) => {
    const s = await state($)
    const c = spawnCheck(s, e.subagentType, e.description, e.model, e.parentModel)
    const d = decideSpawn(s, c.overspawn, c.rewriteTo)
    if ('deny' in d) return { deny: d.deny }
    const result = await next('model' in d ? { ...e, model: d.model } : e)
    if (!result.deny && result.agentId) {
      await send($, {
        kind: 'SubagentSpawned', id: e.tool_use_id, agentId: result.agentId, type: e.subagentType,
        model: result.model, description: e.description, at: await $.clock.now(),
        ...(e.model ? { asked: e.model } : {}), parentModel: e.parentModel,
      })
    }
    return result
  }).catch(($, e, next) => next(e))

  on('command.run', { command: 'opsx:archive' }, async ($, e, next) => {
    const d = decideArchive(await state($))
    return 'deny' in d ? { text: d.deny, isTextDisplayOnly: true } : next(e)
  }).catch(($, e, next) => next(e))

  on('session.compact', async ($, e, next) => {
    await send($, { kind: 'Compacted', id: `compact:${await $.clock.now()}`, trigger: e.trigger })
    return next(e)
  }).catch(($, e, next) => next(e))

  // Strict mode reminds the model of the phase, from the workflow file's data only (design §7).
  on('prompt.compose', async ($, e, next) => {
    const result = await next(e)
    const text = reminder(await state($))
    return text ? { sections: [...result.sections, { id: 'navigator-phase', text, scope: 'session' as const }] } : result
  }).catch(($, e, next) => next(e))

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    const u = result.usage
    if (e.agentId) {
      const tokens = u ? u.input_tokens + u.output_tokens + u.cache_read_input_tokens + u.cache_creation_input_tokens : 0
      await send($, { kind: 'SubagentFinished', id: e.turnId, agentId: e.agentId, tokens, answer: result.text })
    } else {
      // Git and file reads run once per main turn, never per subagent turn (design §5).
      await send($, { kind: 'AnswerShown', id: `answer:${e.turnId}`, text: result.text, at: await $.clock.now() })
      await send($, await readChangeSignal($, `change:${e.turnId}`))
      const plan = await readPlanSignal($, `plan:${e.turnId}`)
      if (plan) await send($, plan)
      await send($, await turnEndedSignal($, e.turnId))
      // Reconcile EPIC's second step runs once the first one's turn has ended (DD-16).
      const { pending } = await state($)
      if (pending) {
        await send($, { kind: 'SetPending', id: `pending-done:${e.turnId}`, line: null })
        await act($, pending)
      }
    }
    return result
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const s = revive(await read($, nav))
    const below = await next(e)
    if (e.props.hasSurvey) return below
    const { Box, Text, Button } = $.ui.resolve(e)
    const set = (band: BandDisplay) => async () => send($, { kind: 'SetBand', id: `press:${await $.clock.now()}`, band })
    // Hidden leaves one button, so a person who pressed Hide can bring the band back (DD-32).
    if (s.display.band === 'hidden') {
      return (
        <Box flexDirection="column">
          <Button key="show" label="⎈ navigator" onPress={set('folded')} />
          {below}
        </Box>
      )
    }
    const model = bandModel(s)
    const isFolded = s.display.band === 'folded'
    const step = nextStep(s)
    const back = backOnTrack(s)
    const hygiene = hygieneAction(s)
    const steps = reconcile(s)
    const reviewLine = review(s)
    const press = (line: string) => () => act($, line)
    const openWarnings = s.warnings.filter(w => /^(plan|process):/.test(w.key) && !s.accepted.includes(w.key))
    return (
      <Box flexDirection="column">
        <Box>
          {model.folded !== '' && <Text dimColor>{model.folded} </Text>}
          {step && <Button key="next" label="Next step" onPress={press(step)} />}
          {back && <Button key="back" label="Back on track" onPress={press(back)} />}
          {hygiene && <Button key="hygiene" label={hygiene.label} onPress={press(hygiene.line)} />}
          <Button key="fold" label={isFolded ? 'Unfold' : 'Fold'} onPress={set(isFolded ? 'unfolded' : 'folded')} />
          <Button key="hide" label="Hide" onPress={set('hidden')} />
        </Box>
        {s.display.band === 'unfolded' && model.rows.filter(r => r.items.length > 0).map(r => (
          <Text key={r.label} dimColor>{r.label.padEnd(10)}{r.items.join(' · ')}</Text>
        ))}
        {s.display.band === 'unfolded' && openWarnings.map(w => (
          <Box key={`accept:${w.key}`}>
            <Text dimColor>{`⚠ ${w.key} `}</Text>
            <Button key="accept" label="Accept" onPress={() => acceptFromBand($, w.key)} />
          </Box>
        ))}
        {s.display.band === 'unfolded' && (
          <Box>
            {steps && <Button key="reconcile" label="Reconcile EPIC" onPress={() => reconcileFromBand($, steps)} />}
            {s.change && <Button key="check" label="Archive check" onPress={press('navigator check')} />}
            {validateRuns(s).length > 0 && <Button key="validate" label="Validate" onPress={press('navigator validate')} />}
            {reviewLine && <Button key="review" label="Review" onPress={press(reviewLine)} />}
            <Button key="mode" label="Mode" onPress={press(modeAction(s))} />
          </Box>
        )}
        {below}
      </Box>
    )
  }).catch(($, e, next) => next(e))
}
