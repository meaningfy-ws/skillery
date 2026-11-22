import { test as base } from '@playwright/test'

import { API_BASE, mockAuthRoutes } from './helpers'

const decision = (id: string, name: string, cluster: string, ageMs: number) => ({
  id,
  about_entity_mention: {
    identified_by: { source_id: 'src-1', request_id: `entity-${id}`, entity_type: 'Person' },
    parsed_representation: { name, phone: '+1-555-0101' }
  },
  current_placement: { cluster_id: cluster, confidence_score: 0.85, similarity_score: 0.8 },
  created_at: new Date(Date.now() - ageMs).toISOString(),
  updated_at: null
})

const proposed = {
  confidence_score: 0.85,
  cluster_size: 3,
  top_entities: [
    {
      parsed_representation: { name: 'Alice M. Johnson', email: 'alice@example.com', phone: '+1-555-0101' }
    }
  ]
}

export type CurationApi = {
  /** Ids of decisions that received an accept POST. */
  accepted: string[]
}

/**
 * Stateful stub of the curation API. Registered fresh for every test, before
 * navigation, so no test depends on what an earlier one left behind.
 */
export const test = base.extend<{ curation: CurationApi }>({
  curation: async ({ page }, use) => {
    const state: CurationApi = { accepted: [] }
    const pending = [
      decision('decision-001', 'Alice Johnson', 'cluster-1', 60_000),
      decision('decision-002', 'Bob Smith', 'cluster-2', 3_600_000)
    ]
    const statsBody = () => ({
      registry: {
        total_entity_mentions: 200,
        total_canonical_entities: 80,
        average_cluster_size: 2.5,
        resolution_requests: 150
      },
      curation: {
        total_decisions: 67,
        selected_top: 42 + state.accepted.length,
        selected_alternative: 3,
        rejected_all: 5
      }
    })

    // Registered first = lowest priority; the specific routes below win.
    await page.route(`${API_BASE}/api/v1/**`, (route) => route.fulfill({ json: {} }))
    await page.route(`${API_BASE}/api/v1/curation/decisions**`, (route) =>
      route.fulfill({ json: { results: pending, count: pending.length, next_cursor: null } })
    )
    await page.route(
      `${API_BASE}/api/v1/curation/decisions/**/proposed-canonical-entity**`,
      (route) => route.fulfill({ json: proposed })
    )
    await page.route(`${API_BASE}/api/v1/curation/decisions/*/accept`, (route) => {
      if (route.request().method() !== 'POST') return route.fallback()
      const id = route.request().url().split('/').slice(-2)[0]
      state.accepted.push(id)
      return route.fulfill({ json: {} })
    })
    await page.route(`${API_BASE}/api/v1/curation/stats`, (route) =>
      route.fulfill({ json: statsBody() })
    )
    await mockAuthRoutes(page)

    await use(state)
  }
})
