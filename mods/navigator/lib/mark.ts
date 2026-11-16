// The mark line of epic-delivery and the worker check (delivery-retrospective D-1, D-9). Pure.

import type { NavState, Warning } from './state.ts'

export const MISSING_MARK = 'No mark line in this session: write the mark line (epic-delivery)'

const MARK = /^[-*\s`]*mark: change=([a-z0-9][a-z0-9-]*) phase=(shape|plan|deliver) stage=(\d+|-)`?\s*$/
const WORKER = /(^|:)(implementer|code-reviewer)$/

export const isMarkLine = (line: string): boolean => MARK.test(line)

/** Whether the text has a mark line outside a ``` or ~~~ fenced block. */
export function hasMark(text: string): boolean {
  let fence = '' // the opening fence's character; only the same character closes it
  for (const line of text.split('\n')) {
    const head = line.trimStart().slice(0, 3)
    if (head === '```' || head === '~~~') fence = fence === head.charAt(0) ? '' : fence || head.charAt(0)
    else if (!fence && isMarkLine(line)) return true
  }
  return false
}

/** A worker is the lead's own spawn (no agentId) of an implementer or a code-reviewer, plugin-prefixed or not. */
export const isWorkerSpawn = (type: string, agentId?: string): boolean => !agentId && WORKER.test(type)

/** D-9: a worker ran in a session with an open change and no mark line; warned once, never blocks. */
export const missingMark = (s: NavState): Warning[] =>
  s.workerThisTurn && s.change && !s.marked && !s.markWarned
    ? [{ key: 'mark:missing', message: MISSING_MARK, remedy: null, owner: 'epic-delivery' }]
    : []
