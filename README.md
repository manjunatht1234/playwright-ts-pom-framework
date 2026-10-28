🎭 Playwright + TypeScript Automation Framework

A scalable, production-style test automation framework for Web UI (Swag Labs / SauceDemo) and REST API (Simple Books API) testing, built with Playwright, TypeScript and the Page Object Model (POM) design pattern.

Playwright TypeScript Node Allure Jenkins GitHub Actions

📖 Table of Contents
Overview
Key Features
Technology Stack
Framework Architecture
Project Structure
Applications Under Test
Prerequisites
Installation & Setup
Environment Configuration
Test Scenarios Covered
Running Tests
Page Object Model & Fixtures
API Testing Approach
Test Data Management
Reporting
CI/CD Integration
Troubleshooting
Coding Conventions

🎯 Overview

This repository contains a dual-layer automation framework:

Layer	Target Application	What Is Tested
🌐 Web UI	Swag Labs (SauceDemo)	Login, product catalog, sorting, cart, checkout and order confirmation
🔌 REST API	Simple Books API	Status, books catalog, API client registration, and full order CRUD with authentication

The framework focuses on maintainability (POM + fixtures), reliability (isolated, self-contained tests with dynamic data) and visibility (Playwright HTML + Allure reports, traces, screenshots).

✨ Key Features
✅ Dual-Layer Automation — browser-based E2E UI tests and fast, lightweight API tests in one repo
✅ Page Object Model (POM) — locators and DOM interactions fully decoupled from test logic, with a shared BasePage
✅ Custom Playwright Fixtures — page objects are injected automatically into tests (no repetitive setup)
✅ Dynamic & Isolated Test Data — random generators and timestamp/crypto hashing prevent collisions across parallel runs
✅ Multi-Browser Testing — Chromium, Firefox and WebKit
✅ Parallel Execution — isolated browser contexts running across multiple workers
✅ Rich Reporting — Playwright HTML Report and Allure Report with screenshots, traces and steps
✅ CI/CD Ready — declarative Jenkinsfile and GitHub Actions workflow
✅ Centralized Utilities — environment loader with default fallbacks and dynamic data generators
🛠️ Technology Stack
Component	Technology	Version / Requirement
Automation Engine	Playwright Test	^1.40.0 or higher
Language	TypeScript	^5.0.0
Runtime	Node.js	v18.x or v20.x LTS
Design Pattern	Page Object Model	Inheritance via BasePage
Reporting	allure-playwright, allure-commandline, Playwright HTML	Allure needs Java 8+
CI/CD	Jenkins, GitHub Actions	Declarative pipeline (Jenkinsfile)
Apps Under Test	SauceDemo (UI), Simple Books API (REST)	saucedemo.com, simple-books-api.click
🏗️ Framework Architecture
🧪 Test Layer
📊 Reports
Playwright HTMLplaywright-report/
Allureallure-results/
📁 Test Data
test-data/checkoutData.tsuserData.ts
🔧 Utilities
envHelper.ts
dataGenerator.ts
index.tsbarrel exports
💉 Fixtures
fixtures/pageFixtures.tsextended test + POMinjection
📄 Page Object Layer
BasePage
LoginPage
InventoryPage
CartPage
CheckoutPage
⚙️ Configuration
playwright.config.tsprojects, reporters, retries
utils/envHelper.tsenv vars + defaults
tsconfig.json
tests/web/login.spec.tse2e-order.spec.ts
tests/api/simple-books-api.spec.ts
📁 Project Structure
text
playwright-pom-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml           # GitHub Actions automated regression workflow
├── allure-results/                  # Raw Allure result artifacts (generated)
├── docs/
│   └── git_github.md                # Branching strategy and team Git standards
├── fixtures/
│   └── pageFixtures.ts              # Extended Playwright `test` injecting POM classes
├── pages/
│   ├── BasePage.ts                  # Base class: common interactions & waits
│   ├── LoginPage.ts                 # SauceDemo login actions, locators, error banners
│   ├── InventoryPage.ts             # Product list, sorting, cart badge
│   ├── CartPage.ts                  # Cart verification and checkout navigation
│   └── CheckoutPage.ts              # Shipping info, price calculation, order finish
├── playwright-report/               # Playwright HTML report (generated)
├── test-data/
│   ├── checkoutData.ts              # Checkout customer info and expected order data
│   └── userData.ts                  # SauceDemo user credentials / login test data
├── test-results/                    # Screenshots, traces, videos (generated)
├── tests/
│   ├── api/
│   │   └── simple-books-api.spec.ts # Simple Books API scenarios (TC_API_01 – TC_API_14)
│   └── web/
│       ├── login.spec.ts            # SauceDemo authentication suite
│       └── e2e-order.spec.ts        # End-to-end purchase flows (TC_E2E_01 – TC_E2E_06)
├── utils/
│   ├── dataGenerator.ts             # Dynamic email, customer and string generators
│   ├── envHelper.ts                 # Environment variable loader with default fallbacks
│   └── index.ts                     # Barrel file re-exporting all utilities
├── .gitignore                       # Ignore rules for reports, logs and dependencies
├── Jenkinsfile                      # Jenkins declarative pipeline
├── package.json                     # Dependencies and npm script shortcuts
├── package-lock.json                # Resolved dependency tree
├── playwright.config.ts             # Runner config (browsers, reporters, retries, workers)
└── tsconfig.json                    # TypeScript compiler settings
🌍 Applications Under Test
🛍️ Swag Labs (SauceDemo) — Web UI
URL: https://www.saucedemo.com/
A sample e-commerce app published by Sauce Labs for automation practice.
Password for all users: secret_sauce
Username	Behavior
standard_user	Normal, fully working user
locked_out_user	Login is rejected with a "locked out" error
problem_user	Intentionally shows broken images / UI glitches
performance_glitch_user	Slow responses on login/navigation
error_user	Triggers errors on certain actions
visual_user	Visual/layout differences for visual testing

💡 Credentials are publicly listed on the SauceDemo login page and are safe to use in this repository.

📚 Simple Books API — REST
Base URL: https://simple-books-api.click
Reference: Simple Books API documentation
Allows you to browse books and reserve (order) a book.
Method	Endpoint	Auth	Description
GET	/status	❌	Returns the API status
GET	/books	❌	List books. Optional query: type (fiction | non-fiction), limit (1–20)
GET	/books/:bookId	❌	Detailed information about a single book
POST	/api-clients/	❌	Register an API client and get an access token (valid 7 days)
POST	/orders	✅	Submit an order (bookId, customerName) — returns the order ID
GET	/orders	✅	Retrieve all orders of the authenticated client
GET	/orders/:orderId	✅	Retrieve a single order
PATCH	/orders/:orderId	✅	Update an order (customerName)
DELETE	/orders/:orderId	✅	Delete an order (empty request body)

Authentication — register a client, then send the token as a Bearer header:

http
POST /api-clients/
Content-Type: application/json

{
  "clientName": "Postman",
  "clientEmail": "valentin@example.com"
}
http
POST /orders
Authorization: Bearer <YOUR TOKEN>
Content-Type: application/json

{
  "bookId": 1,
  "customerName": "John"
}

⚠️ Registering a client with an already-used clientEmail returns 409 Conflict ("API client already registered"). This framework generates a unique email per run to avoid it.

📋 Prerequisites
Requirement	Version	Notes
Node.js	v18.x or v20.x LTS	Download
npm	v9+	Bundled with Node.js
Git	Latest	Download
Java (JRE/JDK)	8+ (11+ recommended)	Required only for generating Allure reports; must be on PATH
🚀 Installation & Setup
bash
# 1. Clone the repository
git clone <repository-url>
cd playwright-pom-framework

# 2. Install project dependencies
npm install

# 3. Install Playwright browsers and OS dependencies
npx playwright install --with-deps

# 4. (Optional) Verify TypeScript compiles cleanly
npx tsc --noEmit

# 5. Run the whole suite
npx playwright test
🔧 Environment Configuration

Configuration values are loaded by utils/envHelper.ts, which falls back to sensible defaults, so the framework runs out of the box. To override values, create a .env file in the project root (make sure it is listed in .gitignore):

env
# Web UI (SauceDemo)
BASE_URL=https://www.saucedemo.com
STANDARD_USER=standard_user
LOCKED_USER=locked_out_user
PASSWORD=secret_sauce

# REST API (Simple Books API)
API_BASE_URL=https://simple-books-api.click

📝 Variable names above are illustrative — match them to the keys actually read in utils/envHelper.ts.

🧪 Test Scenarios Covered
1️⃣ Web UI Suite (SauceDemo)
Area	Scenarios
Authentication	Valid login, invalid credentials error handling, locked-out user validation
Product Catalog	Product selection, sorting (A–Z, Z–A, Price Low→High, Price High→Low), dynamic cart badge increments
End-to-End Checkout	Login → add to cart → cart validation → customer information → subtotal/tax calculation → order confirmation (TC_E2E_01 – TC_E2E_06)
2️⃣ REST API Suite (Simple Books API)
ID	Scenario	Request	Expected
TC_API_01	Service health status	GET /status	200 OK
TC_API_02	Filter catalog by query params	GET /books?type=fiction&limit=2	200 OK, filtered list
TC_API_03	Single book + schema validation	GET /books/:id	200 OK, contract valid
TC_API_04	Non-existent book ID (negative)	GET /books/99999	404 Not Found
TC_API_05	Client registration & token acquisition	POST /api-clients	201 Created, accessToken
TC_API_06	Duplicate client registration	POST /api-clients	409 Conflict
TC_API_07	Order an in-stock book	POST /orders	201 Created, orderId
TC_API_08	Order without token (authorization)	POST /orders	401 Unauthorized
TC_API_09	Order an out-of-stock book (business rule)	POST /orders	404 / 400
TC_API_10	Retrieve all customer orders	GET /orders	200 OK
TC_API_11	Retrieve a specific order	GET /orders/:orderId	200 OK
TC_API_12	Update customer name + persistence check	PATCH /orders/:orderId	204 No Content
TC_API_13	Delete an order	DELETE /orders/:orderId	204 No Content
TC_API_14	Delete an already-deleted order	DELETE /orders/:orderId	404 Not Found
▶️ Running Tests
Run everything
bash
npx playwright test
Run by layer
bash
npx playwright test tests/web/     # UI suite only
npx playwright test tests/api/     # API suite only
Run specific files or scenarios
bash
npx playwright test tests/web/e2e-order.spec.ts
npx playwright test tests/api/simple-books-api.spec.ts

# Filter by test title / ID
npx playwright test -g "TC_API_01"
npx playwright test -g "TC_E2E_01"
Browser selection & headed mode
bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test tests/web/ --headed
Debugging & UI mode
bash
npx playwright test --ui       # Interactive Playwright UI Mode
npx playwright test --debug    # Step-by-step with Playwright Inspector
Parallelism & retries
bash
npx playwright test --workers=4
npx playwright test --retries=2
🔄 Test Execution Flow
Reporters
SauceDemo / Simple Books API
Page Objects
Fixtures
Playwright Runner
User / CI
Reporters
SauceDemo / Simple Books API
Page Objects
Fixtures
Playwright Runner
User / CI
alt
[Test fails]
loop
[Each test]
npx playwright test
Read playwright.config.ts
Allocate parallel workers
Create isolated context
Inject page objects
Navigate / interact / send request
Response / rendered page
Return locators / values
expect() assertions in spec
Capture screenshot + trace
HTML report + Allure results
Summary & exit code
📄 Page Object Model & Fixtures
Page Objects

Each page extends BasePage and encapsulates locators and actions only — assertions stay in spec files.

Class	File	Responsibility
BasePage	pages/BasePage.ts	Shared navigation, click/fill wrappers, waits
LoginPage	pages/LoginPage.ts	Login actions, error banner locator
InventoryPage	pages/InventoryPage.ts	Product list, sorting, add-to-cart, cart badge
CartPage	pages/CartPage.ts	Cart items and checkout navigation
CheckoutPage	pages/CheckoutPage.ts	Customer info, price summary, finish order
typescript
// pages/LoginPage.ts (illustrative)
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorBanner: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorBanner = page.locator('[data-test="error"]');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
Custom Fixtures (Dependency Injection)

Page objects are registered once in fixtures/pageFixtures.ts and injected into tests automatically.

typescript
// fixtures/pageFixtures.ts (illustrative)
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

type Pages = { loginPage: LoginPage; inventoryPage: InventoryPage };

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
});

export { expect } from '@playwright/test';
Example Test
typescript
import { test, expect } from '../../fixtures/pageFixtures';

test('Valid login lands on the inventory page', async ({ loginPage, page }) => {
  await page.goto('/');
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory/);
});
🔌 API Testing Approach

API tests use Playwright's built-in request fixture — no browser is launched, making them very fast.

typescript
import { test, expect } from '@playwright/test';
import { randomBytes } from 'crypto';

const BASE_URL = 'https://simple-books-api.click';

test('TC_API_05: Register client and obtain token', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/api-clients/`, {
    data: {
      clientName: 'Playwright Client',
      clientEmail: `pw_${randomBytes(4).toString('hex')}@example.com`,
    },
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body).toHaveProperty('accessToken');
});

Good practices used:

🔑 A fresh, unique client (random email) is registered per run → avoids 409 Conflict and a missing accessToken
🔗 Order-lifecycle tests (create → get → patch → delete → re-delete) run serially in a single describe block so they can share the orderId
✅ Status codes, response bodies and schema/contract are all asserted
🧹 Created orders are deleted at the end to keep the test environment clean
📊 Test Data Management
Source	Location	Purpose
Checkout data	test-data/checkoutData.ts	Customer first/last name, postal code, expected totals
User data	test-data/userData.ts	SauceDemo usernames and password for login scenarios
Dynamic data	utils/dataGenerator.ts	Unique emails, customer names, random strings (timestamps / crypto)
Environment	utils/envHelper.ts	URLs and credentials with default fallbacks

All utilities are re-exported from utils/index.ts:

typescript
import { getEnv, generateEmail } from '../../utils';
📈 Reporting
1️⃣ Playwright HTML Report

Generated automatically after each run:

bash
npx playwright show-report
2️⃣ Allure Report

Test data is written to allure-results/ on every run.

bash
# (Optional) clean previous results
rm -rf allure-results allure-report

# Run tests to generate fresh results
npx playwright test

# Generate and open the report
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report

# Or serve it directly from a temporary server
npx allure serve allure-results

🪟 Windows (PowerShell): use Remove-Item -Recurse -Force allure-results, allure-report instead of rm -rf.

3️⃣ Failure Artifacts

On failure, Playwright keeps screenshots, traces and (optionally) videos under test-results/. Open a trace with:

bash
npx playwright show-trace test-results/<test-folder>/trace.zip
🚀 CI/CD Integration
🟦 GitHub Actions

Workflow: .github/workflows/playwright.yml — runs the regression suite on pushes and pull requests and uploads the report as an artifact.

🔴 Jenkins

The included Jenkinsfile is a declarative pipeline:

🔄 Checkout
📦 Install Dependenciesnpm ci
🌐 Install Browsersplaywright install--with-deps chromium
🧪 Execute Tests--project=chromium
📊 Post Actions
Stage	Description
Checkout	Clones the repository from source control
Install Dependencies	npm ci for deterministic installs
Install Browsers	npx playwright install --with-deps chromium so the agent has browsers and OS libraries
Execute Tests	Runs tests with --project=chromium
Post Actions	Archives playwright-report/** and test-results/**, publishes the Allure dashboard via the Jenkins Allure Plugin, and cleans the workspace
🔧 Troubleshooting
Issue	Root Cause	Solution
ts(2307): Cannot find module '../../utils'	Missing barrel file	Ensure utils/index.ts exists and re-exports modules, e.g. export * from './envHelper'; export * from './dataGenerator';
ts(2304): Cannot find name 'accessToken'	Variable not declared in test scope	Declare let accessToken: string; in the describe scope or generate the token inside the test
API 401 Unauthorized on /orders	Earlier POST /api-clients returned 409, leaving accessToken undefined	Generate a unique client email using a timestamp or crypto.randomBytes(4).toString('hex')
Parallel race conditions	Tests share mutable outer variables across workers	Make tests self-contained or set up preconditions in test.beforeEach; use test.describe.configure({ mode: 'serial' }) for dependent flows
allure command not recognized	allure-commandline not installed	Run via npx allure ... or npm install -g allure-commandline
Allure fails with Java error	Java missing or not on PATH	Install JDK 8+ and verify with java -version
Browsers missing / launch errors	Playwright binaries not installed	Run npx playwright install --with-deps
API tests fail with ENOTFOUND / timeouts	Wrong base URL or network issue	Confirm the base URL is https://simple-books-api.click and the API is reachable
Login tests flaky on performance_glitch_user	Slow app responses	Increase the timeout for that test or rely on Playwright auto-waiting assertions
📐 Coding Conventions
Assertions live in specs only. Keep expect() inside tests/**/*.spec.ts; page objects perform actions or return locators/values.
Locator strategy. Prefer semantic locators (getByRole, getByPlaceholder, getByText) or stable IDs/data-test attributes (#user-name). Avoid brittle absolute XPath.
Fixture registration. When adding a new page object, register it in fixtures/pageFixtures.ts so it is injectable into UI specs.
Self-contained tests. Each test should create (and clean up) its own data.
Naming. Use IDs and descriptive titles, e.g. TC_API_07: Place order for in-stock book.
Clean code. Run TypeScript verification before opening a Pull Request:
bash
  npx tsc --noEmit
🤝 Contributing

Branching strategy and Git standards are documented in docs/git_github.md.

Fork the repository and create a feature branch: git checkout -b feature/<short-description>
Make your changes following the coding conventions
Run the relevant tests locally and npx tsc --noEmit
Commit with a clear message and push your branch
Open a Pull Request against main
📚 References
Playwright Documentation
Swag Labs (SauceDemo)
Simple Books API documentation
Allure Report
