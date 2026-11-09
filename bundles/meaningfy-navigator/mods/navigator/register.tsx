// The only file that touches `$` (design §1): events → signals → reduce → state; draws the line
// and the band. Everything it decides is in lib/, pure and unit-tested.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import { backOnTrack, commandFor, nextStep, validateRuns } from './lib/actions.ts'
import { appetitesOf, readChange, type ChangeFiles } from './lib/change.ts'
import { EMPTY, reduce, revive, settingsFrom, type BandDisplay, type NavState, type Settings, type Signal } from './lib/state.ts'
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
        planMtime: Math.max(0, ...files.filter(f => f.name === 'design.md' || f.name === 'tasks.md').map(f => f.mtimeMs)),
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

async function start($: EngineInterface, settings: Settings, interactive: boolean) {
  const sessionId = await $.session.id()
  await send($, { kind: 'Started', id: sessionId, sessionId, ...settings, interactive })
  await send($, await readWorkflowsSignal($, `workflows:${sessionId}`))
  await send($, await readChangeSignal($, `change:${sessionId}`))
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
      description: 'Navigator: `band [fold|unfold|hide|show]`, `line [show|hide]`, `validate` runs the phase gates',
      argumentHint: 'band | line | validate',
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
    const id = `cmd:${await $.clock.now()}`
    const band = BAND_ARGS[arg]
    if (verb === 'band' && !arg) await send($, { kind: 'ToggleBand', id })
    else if (verb === 'band' && band) await send($, { kind: 'SetBand', id, band })
    else if (verb === 'line' && !arg) await send($, { kind: 'ToggleLine', id })
    else if (verb === 'line' && (arg === 'show' || arg === 'hide')) await send($, { kind: 'SetLine', id, line: arg === 'show' })
    else if (verb === 'validate') return { text: await validate($, revive(await read($, nav))), isTextDisplayOnly: true }
    else return { text: 'Usage: /navigator band [fold|unfold|hide|show] | line [show|hide] | validate', isTextDisplayOnly: true }
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
    const result = await next(e)
    if (result.deny !== undefined) return result
    const at = await $.clock.now()
    if (e.tool === 'Bash') {
      await send($, { kind: 'ToolRan', id: `tool:${e.tool_use_id}`, command: e.command, ok: !result.isError, at })
    } else if (e.tool === 'Edit' || e.tool === 'Write' || e.tool === 'NotebookEdit') {
      const root = await repoRoot($)
      const file = e.tool === 'NotebookEdit' ? e.notebook_path : e.file_path
      const path = file.startsWith(`${root}/`) ? file.slice(root.length + 1) : file
      await send($, { kind: 'FileTouched', id: `tool:${e.tool_use_id}`, path, at })
    }
    return result
  }).catch(($, e, next) => next(e))

  // A person's own prompt answers a consent card; a plugin's prompt never does.
  on('prompt.submit', async ($, e, next) => {
    if (e.origin.kind !== 'plugin') await send($, { kind: 'UserPrompted', id: `prompt:${await $.clock.now()}`, at: await $.clock.now() })
    return next(e)
  }).catch(($, e, next) => next(e))

  on('agent.spawn', async ($, e, next) => {
    const result = await next(e)
    if (!result.deny && result.agentId) {
      await send($, {
        kind: 'SubagentSpawned', id: e.tool_use_id, agentId: result.agentId, type: e.subagentType,
        model: result.model, description: e.description, at: await $.clock.now(),
      })
    }
    return result
  }).catch(($, e, next) => next(e))

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    const u = result.usage
    if (e.agentId) {
      const tokens = u ? u.input_tokens + u.output_tokens + u.cache_read_input_tokens + u.cache_creation_input_tokens : 0
      await send($, { kind: 'SubagentFinished', id: e.turnId, agentId: e.agentId, tokens })
    } else {
      // Git and file reads run once per main turn, never per subagent turn (design §5).
      await send($, { kind: 'AnswerShown', id: `answer:${e.turnId}`, text: result.text, at: await $.clock.now() })
      await send($, await readChangeSignal($, `change:${e.turnId}`))
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
    const press = (line: string) => () => act($, line)
    return (
      <Box flexDirection="column">
        <Box>
          {model.folded !== '' && <Text dimColor>{model.folded} </Text>}
          {step && <Button key="next" label="Next step" onPress={press(step)} />}
          {back && <Button key="back" label="Back on track" onPress={press(back)} />}
          <Button key="fold" label={isFolded ? 'Unfold' : 'Fold'} onPress={set(isFolded ? 'unfolded' : 'folded')} />
          <Button key="hide" label="Hide" onPress={set('hidden')} />
        </Box>
        {s.display.band === 'unfolded' && model.rows.filter(r => r.items.length > 0).map(r => (
          <Text key={r.label} dimColor>{r.label.padEnd(10)}{r.items.join(' · ')}</Text>
        ))}
        {s.display.band === 'unfolded' && validateRuns(s).length > 0 && (
          <Box><Button key="validate" label="Validate" onPress={press('navigator validate')} /></Box>
        )}
        {below}
      </Box>
    )
  }).catch(($, e, next) => next(e))
}
