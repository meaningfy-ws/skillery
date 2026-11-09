// The only file that touches `$` (design §1): events → signals → reduce → state; draws the line
// and the band. Everything it decides is in lib/, pure and unit-tested.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import { readChange, type ChangeFiles } from './lib/change.ts'
import { EMPTY, reduce, revive, type BandDisplay, type Signal } from './lib/state.ts'
import { bandModel, lineText } from './lib/view.ts'

const nav = atom({ plugin: 'meaningfy-navigator', key: 'state' } as const, EMPTY)
const BANDS: BandDisplay[] = ['unfolded', 'folded', 'hidden']
const SESSION_MOVES = ['clear', 'resume', 'branch']

type Settings = { band: BandDisplay; statusLine: boolean }

async function send($: EngineInterface, signal: Signal) {
  await update($, nav, s => reduce(revive(s), signal))
  const s = revive(await read($, nav))
  $.ui.status(s.display.line ? lineText(s) : undefined)
}

// The appetite names are the build-tier workflow's `reviews` keys (design §6.1); none yet → `?`.
async function appetites($: EngineInterface): Promise<string[]> {
  try {
    const wf = JSON.parse(await $.fs.read(`${$.plugin.root}/data/workflows/build-tier.workflow.json`))
    return Object.keys(wf.reviews ?? {})
  } catch {
    return []
  }
}

async function readChangeSignal($: EngineInterface, id: string): Promise<Signal> {
  const root = (await $.session.repo())?.root ?? (await $.session.cwd())
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
        mtime: Math.max(...files.map(f => f.mtimeMs)),
        planMtime: Math.max(0, ...files.filter(f => f.name === 'design.md' || f.name === 'tasks.md').map(f => f.mtimeMs)),
      })
    }
  }
  const git = await $.process.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], { cwd: root })
  const branch = git.exitCode === 0 ? git.stdout.trim() : ''
  return { kind: 'ChangeRead', id, ...readChange(open, branch, await appetites($)) }
}

async function start($: EngineInterface, settings: Settings) {
  const sessionId = await $.session.id()
  await send($, { kind: 'Started', id: sessionId, sessionId, ...settings })
  await send($, await readChangeSignal($, `change:${sessionId}`))
  await send($, { kind: 'TurnEnded', id: `model:${sessionId}`, model: await $.session.model() })
}

export const register: Register = (on, options) => {
  const settings: Settings = {
    band: BANDS.includes(options.band as BandDisplay) ? (options.band as BandDisplay) : 'folded',
    statusLine: options.statusLine !== false,
  }

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'navigator',
      description: 'Navigator: `band` cycles the band (folded, unfolded, hidden); `line` shows or hides the status line',
      argumentHint: 'band | line',
    })
    await start($, settings)
    return next(e)
  }).catch(($, e, next) => next(e))

  on('command.run', { command: SESSION_MOVES }, async ($, e, next) => {
    const result = await next(e)
    if (revive(await read($, nav)).sessionId !== (await $.session.id())) await start($, settings)
    return result
  }).catch(($, e, next) => next(e))

  on('command.run', { command: 'navigator' }, async ($, e) => {
    const arg = e.args.trim()
    const id = `cmd:${await $.clock.now()}`
    if (arg === 'band') await send($, { kind: 'ToggleBand', id })
    else if (arg === 'line') await send($, { kind: 'ToggleLine', id })
    else return { text: 'Usage: /navigator band | line', isTextDisplayOnly: true }
    const s = revive(await read($, nav))
    return { text: `Navigator: band ${s.display.band}, line ${s.display.line ? 'shown' : 'hidden'}.`, isTextDisplayOnly: true }
  })

  on('skill.prompt', async ($, e, next) => {
    await send($, { kind: 'SkillLoaded', id: `skill:${e.skill}:${await $.clock.now()}`, name: e.skill, at: await $.clock.now() })
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
      await send($, await readChangeSignal($, `change:${e.turnId}`))
      await send($, { kind: 'TurnEnded', id: e.turnId, model: u?.model ?? null })
    }
    return result
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const s = revive(await read($, nav))
    const below = await next(e)
    if (s.display.band === 'hidden' || e.props.hasSurvey) return below
    const { Box, Text, Button } = $.ui.resolve(e)
    const model = bandModel(s)
    const toggle = (kind: 'ToggleBand') => async () => send($, { kind, id: `press:${await $.clock.now()}` })
    return (
      <Box flexDirection="column">
        <Box>
          <Text dimColor>{model.folded} </Text>
          <Button key="fold" label={s.display.band === 'folded' ? 'Unfold' : 'Hide'} onPress={toggle('ToggleBand')} />
        </Box>
        {s.display.band === 'unfolded' && model.rows.filter(r => r.items.length > 0).map(r => (
          <Text key={r.label} dimColor>  {r.label}: {r.items.join(' · ')}</Text>
        ))}
        {below}
      </Box>
    )
  }).catch(($, e, next) => next(e))
}
