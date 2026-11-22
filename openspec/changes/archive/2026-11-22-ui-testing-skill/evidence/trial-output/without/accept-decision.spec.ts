import { expect, test } from '@playwright/test'

import {
  mockDecisionsPage,
  mockProposedCanonical,
  mockStatsAfterAccept,
  mockStatsBefore
} from './decisionMocks'
import { API_BASE, mockAuthRoutes } from './helpers'

test('curator accepts the proposed match and sees the decision resolved', async ({ page }) => {
  let accepted = false
  const acceptedIds: string[] = []

  // Catch-all first (lowest priority: Playwright matches routes LIFO).
  await page.route(`${API_BASE}/api/v1/**`, (route) => route.fulfill({ json: {} }))
  await page.route(`${API_BASE}/api/v1/curation/decisions**`, (route) =>
    route.fulfill({ json: mockDecisionsPage })
  )
  await page.route(`${API_BASE}/api/v1/curation/decisions/**/proposed-canonical-entity**`, (route) =>
    route.fulfill({ json: mockProposedCanonical })
  )
  await page.route(`${API_BASE}/api/v1/curation/decisions/*/accept`, (route) => {
    const id = route.request().url().split('/').slice(-2)[0]
    acceptedIds.push(id)
    accepted = true
    return route.fulfill({ json: {} })
  })
  // Stats are stateful: the app refetches them after a successful accept.
  await page.route(`${API_BASE}/api/v1/curation/stats`, (route) =>
    route.fulfill({ json: accepted ? mockStatsAfterAccept : mockStatsBefore })
  )
  await mockAuthRoutes(page)

  await page.goto('/')

  // Alice Johnson is the selected decision; its proposed match is shown.
  const menu = page.getByRole('menu')
  await expect(menu.getByText('Alice Johnson')).toBeVisible({ timeout: 15_000 })
  await expect(menu.getByText('Bob Smith')).toBeVisible()
  await expect(page.getByText('Alice M. Johnson').first()).toBeVisible()
  await expect(page.getByText(/42 Selected Top/)).toBeVisible()

  // Accept: the check button asks for confirmation first.
  await page.getByRole('button', { name: 'check' }).click()
  await expect(page.getByText(/This will confirm the match/)).toBeVisible()

  const acceptRequest = page.waitForRequest(
    (req) => req.method() === 'POST' && /\/curation\/decisions\/[^/]+\/accept$/.test(req.url())
  )
  await page.getByRole('button', { name: 'OK' }).click()
  await acceptRequest

  // The app shows the result of the decision.
  await expect(page.getByText('Decision accepted')).toBeVisible()
  expect(acceptedIds).toEqual(['decision-001'])
  await expect(menu.getByText('Alice Johnson')).toHaveCount(0)
  await expect(menu.getByText('Bob Smith')).toBeVisible()
  await expect(page.getByText(/43 Selected Top/)).toBeVisible()
})
