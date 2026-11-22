import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

import { expectNoSeriousA11yViolations } from './a11y'
import { test } from './fixtures'

const { Given, When, Then } = createBdd(test)

Given('a signed-in curator with two pending decisions', async ({ page }) => {
  // The session comes from the stored token and stubbed routes in the fixture.
  await page.goto('/')
  const menu = page.getByRole('menu')
  await expect(menu.getByText('Alice Johnson')).toBeVisible()
  await expect(menu.getByText('Bob Smith')).toBeVisible()
})

Given('the curator has selected the decision for {string}', async ({ page }, name: string) => {
  await page.getByRole('menuitem').filter({ hasText: name }).click()
})

Given('the comparison panel shows the proposed match', async ({ page }) => {
  await expect(page.getByTestId('current-entity-card')).toBeVisible()
  const proposedCard = page.getByTestId('proposed-match-card')
  await expect(proposedCard).toBeVisible()
  await expect(proposedCard).toContainText('alice@example.com')
  await expectNoSeriousA11yViolations(page)
})

When('the curator accepts the proposed match and confirms', async ({ page }) => {
  // The accept button is icon-only; its accessible name comes from the icon.
  await page.getByRole('button', { name: 'check' }).click()
  await expect(page.getByText(/confirm the match and assign/)).toBeVisible()
  await page.getByRole('button', { name: 'OK' }).click()
})

Then('the app sends the accept request for that decision', async ({ curation }) => {
  await expect.poll(() => curation.accepted).toEqual(['decision-001'])
})

Then('the app confirms {string}', async ({ page }, message: string) => {
  await expect(page.getByText(message, { exact: true })).toBeVisible()
})

Then('{string} is no longer in the pending decisions', async ({ page }, name: string) => {
  await expect(page.getByRole('menu').getByText(name)).toHaveCount(0)
})

Then('{string} is still in the pending decisions', async ({ page }, name: string) => {
  await expect(page.getByRole('menu').getByText(name)).toBeVisible()
})

Then('the header counts one more accepted match', async ({ page }) => {
  await expect(page.getByText(/43 Selected Top/)).toBeVisible()
})
