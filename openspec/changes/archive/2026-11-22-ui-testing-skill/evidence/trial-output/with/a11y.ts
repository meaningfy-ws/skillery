import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import AxeBuilder from '@axe-core/playwright'
import { expect } from '@playwright/test'

import type { Page } from '@playwright/test'

type Accepted = { rule: string; selector: string; issue: string; date: string }

const loadAccepted = (): Accepted[] => {
  try {
    return JSON.parse(readFileSync(join(__dirname, 'a11y-accepted.json'), 'utf-8'))
  } catch {
    return []
  }
}

/** Fails on any critical or serious axe finding that is not in a11y-accepted.json. */
export const expectNoSeriousA11yViolations = async (page: Page) => {
  const accepted = loadAccepted()
  const { violations } = await new AxeBuilder({ page }).analyze()
  const blocking = violations
    .filter((v) => v.impact === 'critical' || v.impact === 'serious')
    .flatMap((v) =>
      v.nodes
        .filter((n) => !accepted.some((a) => a.rule === v.id && n.target.join(' ') === a.selector))
        .map((n) => `${v.id} (${v.impact}): ${n.target.join(' ')}`)
    )
  expect(blocking, `accessibility findings:\n${blocking.join('\n')}`).toEqual([])
}
