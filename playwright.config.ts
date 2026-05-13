import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 * 
 * This configuration sets up E2E testing with Playwright for the portfolio project.
 * Tests run against the local dev server and in CI environments.
 */

export default defineConfig({
  // Directory containing E2E test files
  testDir: './e2e',

  // Pattern to match test files
  testMatch: '**/*.spec.ts',

  // Timeout for each test (30 seconds)
  timeout: 30 * 1000,

  // Expect timeout for assertions (5 seconds)
  expect: {
    timeout: 5000,
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if left test lists are discovered
  forbidOnly: !!process.env.CI,

  // Retry failed tests up to 2 times in CI
  retries: process.env.CI ? 2 : 0,

  // Workers to run tests (1 for debugging, parallel for CI)
  workers: process.env.CI ? undefined : 1,

  // Reporter settings
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  // Global setup and teardown
  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',

  // Configure browsers for testing
  // CI runs only chromium for speed; local runs all browsers for thoroughness
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
      },
    },

    ...(process.env.CI
      ? []
      : [
          {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
          },
          {
            name: 'Firefox',
            use: { ...devices['Desktop Firefox'] },
          },
          {
            name: 'WebKit',
            use: { ...devices['Desktop Safari'] },
          },
        ]),
  ],

  // Output directory for test artifacts (screenshots, traces, videos)
  outputDir: './test-results',

  // Web server configuration for running tests
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:8080',
        reuseExistingServer: true,
        timeout: 120 * 1000,
      },
});