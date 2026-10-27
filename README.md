# Scalable Playwright TypeScript Test Automation Framework

An enterprise-ready, end-to-end test automation framework built with **Playwright**, **TypeScript**, and **Allure Reports**, following the **Page Object Model (POM)** design pattern with dependency-injected fixtures.

---

## Key Framework Features

- **Language & Runtime**: TypeScript with strict type checking and modern ES modules.
- **Cross-Browser Execution**: Configured specifically for **Desktop Chromium** and **Desktop Firefox**.
- **Parallel Test Execution**: Native worker thread distribution via Playwright test runner (`fullyParallel: true`).
- **Page Object Model (POM)**: Complete decoupling of locators and browser interactions from assertions.
- **Custom Fixtures**: Automated page object instantiation via Playwright's `test.extend` dependency injection.
- **Centralized Test Data**: Dedicated test fixtures and data objects to avoid hardcoded credentials.
- **Diagnostic Capture**: Automatic capture of screenshots, videos, and full Playwright traces on test failure.
- **Interactive Reporting**: Comprehensive Allure test reports enriched with test steps and failure diagnostics.
- **CI/CD Integration**: Pre-configured GitHub Actions workflow for pull request and push events.

---

## Directory Structure

```text
playwright-pom-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions CI/CD pipeline definition
├── pages/                         # Page Object Model classes
│   ├── BasePage.ts                # Base class with shared methods and navigation
│   ├── LoginPage.ts               # Login screen locators and business workflows
│   └── InventoryPage.ts           # Product dashboard locators and queries
├── tests/                         # Test specifications and assertion logic
│   └── login.spec.ts              # Authentication test scenarios
├── fixtures/                      # Playwright custom test extensions
│   └── testFixtures.ts            # Dependency-injected page instances
├── test-data/                     # Externalized test configurations & users
│   └── userData.ts                # User credentials and test roles
├── utils/                         # Helper utilities and data generators
├── .gitignore                     # Git ignore rules for node_modules, reports, artifacts
├── package.json                   # NPM dependencies and execution scripts
├── playwright.config.ts           # Core Playwright configuration
├── tsconfig.json                  # TypeScript compiler settings
└── README.md                      # Framework documentation
```

---

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Java**: JRE/JDK 8+ (required for generating Allure reports locally)

---

## Getting Started

### 1. Clone and Install
```bash
git clone <YOUR_REPOSITORY_URL>
cd playwright-pom-framework
npm install
```

### 2. Install Playwright Browsers
Install only the required browser binaries (Chromium and Firefox):
```bash
npx playwright install --with-deps chromium firefox
```

---

## Test Execution

### Run All Tests Across All Browsers
Executes all test specs in parallel across Chromium and Firefox:
```bash
npm test
```

### Browser-Specific Runs
Execute tests specifically on **Chromium**:
```bash
npm run test:chromium
```

Execute tests specifically on **Firefox**:
```bash
npm run test:firefox
```

### Headed Mode (Visual Debugging)
Run tests in headed mode to observe browser behavior:
```bash
npm run test:headed
```

### Custom Worker Parallelism
Control worker count directly:
```bash
npx playwright test --workers=4
```

---

## Reporting & Artifacts

### Allure Reports
1. **Serve Allure Report directly**:
   ```bash
   npm run allure:serve
   ```
2. **Generate a static report and view**:
   ```bash
   npm run report
   ```

### Failure Artifacts
When a test fails, Playwright automatically generates:
- **Screenshots**: Saved to `test-results/` and embedded in the Allure report.
- **Videos**: Recorded for failing test executions.
- **Playwright Trace**: Captures full network activity, DOM snapshots, and console logs. To inspect a trace:
  ```bash
  npx playwright show-trace test-results/<test-run-folder>/trace.zip
  ```

---

## Extending the Framework

### Adding a New Page Object
1. Create `pages/CartPage.ts` extending `BasePage`:
   ```typescript
   import { Page, Locator } from '@playwright/test';
   import { BasePage } from './BasePage';

   export class CartPage extends BasePage {
     readonly checkoutButton: Locator;

     constructor(page: Page) {
       super(page);
       this.checkoutButton = page.locator('[data-test="checkout"]');
     }
   }
   ```

2. Register the page object in `fixtures/testFixtures.ts`:
   ```typescript
   import { CartPage } from '../pages/CartPage';

   type Pages = {
     // ...existing pages
     cartPage: CartPage;
   };

   export const test = baseTest.extend<Pages>({
     // ...existing fixtures
     cartPage: async ({ page }, use) => {
       await use(new CartPage(page));
     },
   });
   ```

3. Inject the fixture directly into your test spec:
   ```typescript
   import { test, expect } from '../fixtures/testFixtures';

   test('Verify Cart Page', async ({ cartPage }) => {
     await expect(cartPage.checkoutButton).toBeVisible();
   });
   ```