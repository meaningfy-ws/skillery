// The mark line of epic-delivery and the worker check (delivery-retrospective D-1, D-9). Pure.

const MARK = /^[-*\s`]*mark: change=([a-z0-9][a-z0-9-]*) phase=(shape|plan|deliver) stage=(\d+|-)`?\s*$/
const WORKER = /(^|:)(implementer|code-reviewer)$/

export const isMarkLine = (line: string): boolean => MARK.test(line)

/** Whether the text has a mark line outside a fenced block. */
export function hasMark(text: string): boolean {
  let fenced = false
  for (const line of text.split('\n')) {
    if (line.trimStart().startsWith('```')) fenced = !fenced
    else if (!fenced && isMarkLine(line)) return true
  }
  return false
}

/** A worker is the lead's own spawn (no agentId) of an implementer or a code-reviewer, plugin-prefixed or not. */
export const isWorkerSpawn = (type: string, agentId?: string): boolean => !agentId && WORKER.test(type)
