import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Directory where test files are located
  testDir: './tests',

  // Maximum time one test can run for (30 seconds)
  timeout: 30 * 1000,

  expect: {
    // Maximum time expect() should wait for condition to be met
    timeout: 5000,
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only to catch transient flakes, 0 retries locally for faster feedback
  retries: process.env.CI ? 2 : 0,

  // Workers: parallel processes running tests. 
  // Undefined uses 50% of available CPU cores locally; 2 workers on CI for stability.
  workers: process.env.CI ? 2 : undefined,

  // Reporters: 'list' for terminal output, 'allure-playwright' for test reports
  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: true,
      },
    ],
  ],

  // Shared settings for all projects
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'https://www.saucedemo.com',

    // Collect trace only when retrying a failed test or on failure
    trace: 'retain-on-failure',

    // Capture screenshot only when a test fails
    screenshot: 'only-on-failure',

    // Record video only when a test fails
    video: 'retain-on-failure',

    // Run tests in headless mode by default
    headless: true,
  },

  // Configure projects for cross-browser testing
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});