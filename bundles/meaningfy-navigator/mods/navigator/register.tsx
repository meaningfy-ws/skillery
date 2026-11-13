// The only module that hooks events (design §1): events → signals → reduce → state; draws the line
// and the band. Its I/O helpers are in io.ts; everything it decides is in lib/, pure and unit-tested.
import type { Register } from 'claude-code'

import { backOnTrack, hygieneAction, modeAction, nextStep, reconcile, review, validateRuns } from './lib/actions.ts'
import { overspawnNow, rewriteModel } from './lib/lean.ts'
import { settingsFrom, type BandDisplay } from './lib/state.ts'
import { decideArchive, decideCommit, decideSpawn, reminder } from './lib/strict.ts'
import { parseAccept } from './lib/deviations.ts'
import { bandModel, bandOffers, capped, toneOf, type Tone } from './lib/view.ts'
import { isArchive, isCommit } from './lib/workflow.ts'
import { BAND_ARGS, SESSION_MOVES, accept, acceptFromBand, act, check, ensureRoot, readAcceptedSignal,
  checkPr, readChangeSignal, readPlanSignal, reconcileFromBand, recordCall, rootSubagent, send, start, state, trackSkillCall,
  turnEndedSignal, validate } from './io.ts'


// Colour says state only (done, current, to do, failed, warning); cost and counts stay neutral.
const STYLE: Record<NonNullable<Tone>, { color?: string; bold?: boolean; dimColor?: boolean }> = {
  done: { color: 'success' }, now: { color: 'claude', bold: true }, todo: { dimColor: true },
  fail: { color: 'error' }, warn: { color: 'warning' },
}
const style = (item: string) => { const t = toneOf(item); return t ? STYLE[t] : {} }
const WARNING_LINES = 4
const ACCEPT_LINES = 3

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
    const carried = (await state($)).root // the new session keeps the followed root (D-2)
    const result = await next(e)
    const s = await state($)
    if (s.sessionId !== (await $.session.id())) await start($, settings, s.interactive, carried)
    return result
  }).catch(($, e, next) => next(e))

  on('command.run', { command: 'navigator' }, async ($, e) => {
    const [verb = '', arg = ''] = e.args.trim().split(/\s+/)
    if (verb === 'accept') {
      const a = parseAccept(e.args)
      return { text: a ? await accept($, a.key, a.reason) : 'Usage: /navigator accept <warning key> "<reason>"', isTextDisplayOnly: true }
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
    else if (verb === 'validate') return { text: await validate($, await state($)), isTextDisplayOnly: true }
    else return { text: 'Usage: /navigator band [fold|unfold|hide|show] | line [show|hide] | validate | check | accept <key> "<reason>" | mode loose|strict', isTextDisplayOnly: true }
    const s = await state($)
    return { text: `Navigator: band ${s.display.band}, line ${s.display.line ? 'shown' : 'hidden'}.`, isTextDisplayOnly: true }
  }).catch(() => ({ text: 'Navigator could not change the display; see the debug log.', isTextDisplayOnly: true as const }))

  on('skill.prompt', async ($, e, next) => {
    const at = await $.clock.now()
    await send($, { kind: 'SkillLoaded', id: `skill:${e.skill}:${at}`, name: e.skill, at })
    return next(e)
  }).catch(($, e, next) => next(e))

  // Commands and edits feed the gates, the commit checks and the DevOps phases (design §5).
  on('tool.call', async ($, e, next) => {
    // A subagent's root is its `cwd()` in its first call (D-16).
    if (e.agentId) await rootSubagent($, e.agentId)
    // Strict mode decides before the command runs (design §7); loose never blocks.
    if (e.tool === 'Bash') {
      const s = await state($)
      const d = isCommit(e.command) ? decideCommit(s) : isArchive(e.command) ? decideArchive(s) : null
      if (d && 'deny' in d) return { deny: d.deny }
    }
    const result = await trackSkillCall($, e, () => next(e))
    if (result.deny === undefined) await recordCall($, e, !!result.isError)
    return result
  }).catch(($, e, next) => next(e))

  // Only a person's own prompt answers a consent card: typed, or through Remote Control (DD-38).
  on('prompt.submit', async ($, e, next) => {
    if (e.origin.kind === 'composer' || e.origin.kind === 'bridge') await send($, { kind: 'UserPrompted', id: `prompt:${await $.clock.now()}`, at: await $.clock.now() })
    return next(e)
  }).catch(($, e, next) => next(e))

  on('agent.spawn', async ($, e, next) => {
    if (e.resume) return next(e) // waking a parked agent is not a spawn (DD-41)
    // Counted before it runs, so parallel spawns each see the ones before; strict reads the count after.
    await send($, { kind: 'SpawnAsked', id: `ask:${e.tool_use_id}:${await $.clock.now()}:${e.name ?? e.description}`,
      type: e.subagentType, description: e.description })
    const s = await state($)
    const rewriteTo = rewriteModel(s, e.model, e.parentModel)
    const d = decideSpawn(s, overspawnNow(s), rewriteTo)
    if ('deny' in d) return { deny: d.deny }
    // Pending until it resolves: a skill prompt in between is that subagent's preload (D-4).
    await send($, { kind: 'SpawnStarted', id: `spawnpending:${e.tool_use_id}`, toolUseId: e.tool_use_id, type: e.subagentType,
      at: await $.clock.now() })
    let agentId: string | null = null
    try {
      const result = await next('model' in d ? { ...e, model: d.model } : e)
      if (!result.deny && result.agentId) {
        agentId = result.agentId
        await send($, {
          kind: 'SubagentSpawned', id: `spawn:${e.tool_use_id}:${result.agentId}`, agentId: result.agentId, type: e.subagentType,
          model: result.model, description: e.description, at: await $.clock.now(), parentModel: e.parentModel,
          // A model strict already moved to the parent's is no breach (DD-41).
          ...(e.model && !('model' in d) ? { asked: e.model } : {}),
        })
      }
      return result
    } finally { // denied, failed or resolved: the spawn is no longer pending, and its preloads move onto the subagent
      await send($, { kind: 'SpawnResolved', id: `spawnresolved:${e.tool_use_id}`, toolUseId: e.tool_use_id, agentId })
    }
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
    const tokens = u ? u.input_tokens + u.output_tokens + u.cache_read_input_tokens + u.cache_creation_input_tokens : 0
    if (e.agentId) {
      await send($, { kind: 'SubagentFinished', id: e.turnId, agentId: e.agentId, tokens, answer: result.text })
    } else {
      // Git and file reads run once per main turn, never per subagent turn (design §5).
      await send($, { kind: 'AnswerShown', id: `answer:${e.turnId}`, text: result.text, at: await $.clock.now() })
      await ensureRoot($, e.turnId)
      await send($, await readChangeSignal($, `change:${e.turnId}`))
      await checkPr($, `turn:${e.turnId}`, false) // after the change read: a re-root's new change decides (D-26)
      const accepted = await readAcceptedSignal($, `accepted:${e.turnId}`)
      if (accepted) await send($, accepted)
      const plan = await readPlanSignal($, `plan:${e.turnId}`)
      if (plan) await send($, plan)
      await send($, await turnEndedSignal($, e.turnId, tokens))
      // Reconcile EPIC's second step runs once the first one's turn has ended (DD-16).
      const { pending } = await state($)
      // Only after a turn that answered; an aborted or failed one drops it (DD-41).
      if (pending) {
        await send($, { kind: 'SetPending', id: `pending-done:${e.turnId}`, line: null })
        if (e.reason === 'answer') await act($, pending)
      }
    }
    return result
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const s = await state($)
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
    const offers = bandOffers(s)
    const openWarnings = offers.accept
    // One line per row, cut at the edge; items coloured by their glyph, labels and separators dim.
    const row = (key: string, label: string | null, items: string[]) => (
      <Text key={key} wrap="truncate-end">
        {label !== null && <Text dimColor>{label.padEnd(10)}</Text>}
        {items.flatMap((it, i) => [
          ...(i ? [<Text key={`s${i}`} dimColor> · </Text>] : []),
          <Text key={`i${i}`} {...style(it)}>{it}</Text>,
        ])}
      </Text>
    )
    return (
      <Box flexDirection="column">
        <Box>
          {model.foldedItems.length > 0 && row('folded', null, model.foldedItems)}
          {step && <Button key="next" label="Next step" variant="primary" onPress={press(step)} />}
          {back && <Button key="back" label="Back on track" onPress={press(back)} />}
          {hygiene && <Button key="hygiene" label={hygiene.label} onPress={press(hygiene.line)} />}
          <Button key="fold" label={isFolded ? 'Unfold' : 'Fold'} dimColor onPress={set(isFolded ? 'unfolded' : 'folded')} />
          <Button key="hide" label="Hide" dimColor onPress={set('hidden')} />
        </Box>
        {s.display.band === 'unfolded' && model.rows.filter(r => r.items.length > 0).flatMap(r => r.label === 'warnings'
          // Warnings one per line, so none hides behind another; the rest as `+n more`.
          ? capped(r.items, WARNING_LINES).map((it, i) => row(`w${i}`, i ? '' : r.label, [it]))
          : [row(r.label, r.label, r.items)])}
        {s.display.band === 'unfolded' && openWarnings.slice(0, openWarnings.length > ACCEPT_LINES ? ACCEPT_LINES - 1 : ACCEPT_LINES).map(w => (
          <Box key={`accept:${w.key}`}>
            <Text dimColor>{`⚠ ${w.key} `}</Text>
            <Button key="accept" label="Accept" onPress={() => acceptFromBand($, w.key)} />
          </Box>
        ))}
        {s.display.band === 'unfolded' && openWarnings.length > ACCEPT_LINES && (
          <Text dimColor>{`${openWarnings.length - ACCEPT_LINES + 1} more to accept: /navigator accept <key> "<reason>"`}</Text>
        )}
        {s.display.band === 'unfolded' && (
          <Box>
            {steps && <Button key="reconcile" label="Reconcile EPIC" onPress={() => reconcileFromBand($, steps)} />}
            {offers.check && <Button key="check" label="Archive check" onPress={press('navigator check')} />}
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
