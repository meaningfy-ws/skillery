// The PLAN's identity for skill-gate staleness (D-15). Pure: io reads design.md.

const DECISIONS = /^## Delivery decisions\s*$[\s\S]*?(?=^## |(?![\s\S]))/m

/** A hash of design.md without its `## Delivery decisions` section (heading to the next `## ` or the end),
 *  so recording a review decision does not stale the clarity gate. '' when there is no design.md.
 *  FNV-1a 32-bit: pure and synchronous, enough to notice an edit. */
export function planHash(design: string | null): string {
  if (design === null) return ''
  let h = 0x811c9dc5
  for (const ch of design.replaceAll('\r\n', '\n').replace(DECISIONS, '')) {
    h = Math.imul(h ^ ch.codePointAt(0)!, 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, '0')
}
