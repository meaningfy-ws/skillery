import { defineBddConfig } from 'playwright-bdd'

import { defineConfig } from '@playwright/test'

import base from './playwright.config'

const testDir = defineBddConfig({
  features: 'src/test/e2e/features/*.feature',
  steps: ['src/test/e2e/accept-decision.steps.ts', 'src/test/e2e/fixtures.ts']
})

// Same app, server and browsers as the main config; a failed test is never re-run.
export default defineConfig({
  ...base,
  testDir,
  globalSetup: undefined,
  retries: 0
})
