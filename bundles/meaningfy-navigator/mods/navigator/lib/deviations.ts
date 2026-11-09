// deviations.md of a change: one keyed line per accepted deviation (design §8, DD-12). Pure.

import type { Warning } from './state.ts'

const HEADER = '# Deviations accepted with /navigator accept'
const SEP = ' · '

/** The keys recorded in deviations.md. */
export function parseDeviations(text: string): Set<string> {
  return new Set([...text.matchAll(/^- \d{4}-\d{2}-\d{2} · (.+?) · /gm)].map(m => m[1]!))
}

/** The new file text with the line appended (header on create), or null when the key is already there (TC-20).
 * Throws on a key or date that would break the line; newlines in the reason fold to spaces. */
export function appendDeviation(text: string | null, key: string, reason: string, date: string): string | null {
  if (!key.trim() || /[\r\n]/.test(key) || key.includes(SEP)) throw new Error(`navigator: bad deviation key "${key}"`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`navigator: bad date "${date}"`)
  const why = reason.replace(/\s+/g, ' ').trim()
  if (!why) throw new Error('navigator: a deviation needs a reason')
  const base = text ?? `${HEADER}\n`
  if (parseDeviations(base).has(key)) return null
  return `${base}${base.endsWith('\n') ? '' : '\n'}- ${date}${SEP}${key}${SEP}${why}\n`
}

export type ArchiveResult = { ok: boolean; open: Warning[]; accepted: string[] }

/** Archive check (design §8): fails while a plan- or process-drift warning is open and not accepted. */
export function archiveCheck(warnings: Warning[], accepted: Set<string>): ArchiveResult {
  const open = warnings.filter(w => /^(plan|process):/.test(w.key) && !accepted.has(w.key))
  return { ok: open.length === 0, open, accepted: [...accepted] }
}
