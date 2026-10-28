# Playwright TypeScript Automation Framework (Web UI & REST API)

A robust, scalable test automation framework developed with **Playwright** and **TypeScript**, implementing the **Page Object Model (POM)** design pattern, custom dependency injection fixtures, data-driven utilities, and multi-channel reporting for both **Web UI (SauceDemo)** and **REST API (Simple Books API)** testing.

---

## 📌 Framework Highlights & Features

* **Dual-Layer Automation**: Supports browser-based end-to-end UI testing alongside lightweight, high-speed RESTful API testing.
* **Page Object Model (POM)**: Complete decoupling of test logic from page locators and DOM interactions for high maintainability.
* **Custom Playwright Fixtures**: Injects instantiated Page Objects into tests automatically via dependency injection, eliminating repetitive setup code.
* **Dynamic & Isolated Test Data**: Random data generators and timestamp hashing prevent test collision and data locking across parallel runs.
* **Multi-Browser Testing**: Fully configured for cross-browser testing across Chromium, Firefox, and WebKit.
* **Parallel Execution**: Isolated contexts allowing multi-threaded, parallel execution across multiple workers.
* **Comprehensive Reporting**: Integrated with both native **Playwright HTML Reports** and **Allure Reports** (with attached screenshots, traces, and step metrics).
* **CI/CD Ready**: Configured with a declarative **Jenkinsfile** and **GitHub Actions** workflows for automated pipeline runs.

---

## 🛠️ Technology Stack

| Component | Technology | Version / Requirement |
| :--- | :--- | :--- |
| **Automation Engine** | Playwright Test | `^1.40.0` or higher |
| **Language** | TypeScript | `^5.0.0` |
| **Runtime** | Node.js | `v18.x` or `v20.x` LTS |
| **Design Pattern** | Page Object Model (POM) | Inheritance via `BasePage` |
| **Reporting Tools** | Allure Playwright, Playwright HTML | `allure-playwright`, `allure-commandline` |
| **CI/CD Tools** | Jenkins, GitHub Actions | Declarative Pipeline (`Jenkinsfile`) |
| **Test Applications**| SauceDemo (UI), Simple Books API (REST) | `saucedemo.com`, `simple-books-api.glitch.me` |

---

## 📁 Project Directory Structure

```text
playwright-pom-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions automated regression workflow
├── allure-results/                # Raw Allure test result artifacts (JSON/attachments)
├── docs/
│   └── git_github.md              # Branching strategies and team Git standards
├── fixtures/
│   ├── pageFixtures.ts            # Page fixture declarations
│   └── testFixtures.ts            # Extended Playwright runner injecting POM classes
├── pages/
│   ├── BasePage.ts                # Base class encapsulating common interactions & waits
│   ├── LoginPage.ts               # SauceDemo login actions, locators, and error banners
│   ├── InventoryPage.ts           # Product list, item filtering, and cart badges
│   ├── CartPage.ts                # Cart item verification and checkout navigation
│   └── CheckoutPage.ts            # Shipping info, pricing calculations, and order finish
├── test-data/
│   └── checkoutData.ts            # Static test fixtures and customer mock data
├── tests/
│   ├── api/
│   │   └── simple-books-api.spec.ts # Simple Books API scenarios (TC_API_01 to TC_API_14)
│   └── web/
│       ├── login.spec.ts          # SauceDemo authentication suite
│       └── e2e-order.spec.ts      # End-to-end purchase workflows (TC_E2E_01 to TC_E2E_06)
├── utils/
│   ├── apiUtils.ts                # Common API headers and response parser utilities
│   ├── dataGenerator.ts           # Dynamic email, customer, and string generation helpers
│   ├── envHelper.ts               # Environment variable loader with default fallbacks
│   ├── logger.ts                  # Execution and assertion logging utility
│   ├── stringUtils.ts             # String manipulation and regex extraction helpers
│   └── index.ts                   # Central barrel re-export file for utils
├── .gitignore                     # Git ignore rules for reports, logs, and dependencies
├── Jenkinsfile                    # Jenkins declarative pipeline script
├── package.json                   # Project dependencies and script shortcuts
├── package-lock.json              # Resolved dependency tree
├── playwright.config.ts           # Global runner configuration (browsers, reporters, retries)
└── tsconfig.json                  # TypeScript compiler settings

🧪 Test Scenarios Covered1. Web UI Suite (SauceDemo)Authentication: Valid login, invalid credentials error handling, locked-out user validation.Product Catalog: Item selection, product sorting (A-Z, Z-A, Price Low-High, Price High-Low), dynamic cart badge increments.End-to-End Checkout (TC_E2E_01 to TC_E2E_06): Complete workflow from login, cart validation, customer information submission, subtotal/tax calculations, to final order confirmation.2. REST API Suite (Simple Books API)TC_API_01: Service health status verification (GET /status).TC_API_02: Filter book catalog by query parameters (GET /books?type=fiction&limit=2).TC_API_03: Retrieve single book by ID and contract schema validation (GET /books/:id).TC_API_04: Negative test — request non-existent book ID (GET /books/99999 $\rightarrow$ 404 Not Found).TC_API_05: Client registration and Bearer token acquisition (POST /api-clients).TC_API_06: Duplicate client registration conflict validation (POST /api-clients $\rightarrow$ 409 Conflict).TC_API_07: Order placement for in-stock book (POST /orders).TC_API_08: Authorization validation — request order without token (POST /orders $\rightarrow$ 401 Unauthorized).TC_API_09: Business logic validation — order out-of-stock book (POST /orders $\rightarrow$ 404 / 400).TC_API_10: Retrieve all authenticated customer orders (GET /orders).TC_API_11: Retrieve specific order record by order ID (GET /orders/:orderId).TC_API_12: Update order customer name and persistence check (PATCH /orders/:orderId $\rightarrow$ 204 No Content).TC_API_13: Delete order record (DELETE /orders/:orderId $\rightarrow$ 204 No Content).TC_API_14: Idempotency check on already deleted order (DELETE /orders/:orderId $\rightarrow$ 404 Not Found).⚙️ Prerequisites & Setup1. PrerequisitesNode.js: v18.x or v20.x LTS (Download)Java (JRE/JDK): Java 8+ or 11+ installed and configured on system PATH (required for generating Allure Reports).

Clone to install:
# Clone repository
git clone <repository-url>
cd playwright-pom-framework

# Install project dependencies
npm install

# Install Playwright browser binaries and system dependencies
npx playwright install --with-deps

🚀 Test Execution Commands1. Run Complete Test SuiteBash# Run all tests across all configured projects
npx playwright test
2. Run by Test Layer (UI vs API)Bash# Run UI test suite only
npx playwright test tests/web/

# Run API test suite only
npx playwright test tests/api/
3. Run Specific Files or ScenariosBash# Run specific test file
npx playwright test tests/web/e2e-order.spec.ts
npx playwright test tests/api/simple-books-api.spec.ts

# Run test scenarios matching a specific name or tag
npx playwright test -g "TC_API_01"
npx playwright test -g "TC_E2E_01"
4. Browser Selection & Headed ExecutionBash# Run on Chromium only
npx playwright test --project=chromium

# Run on Firefox only
npx playwright test --project=firefox

# Run in headed mode (visible browser window)
npx playwright test tests/web/ --headed
5. Debugging & Interactive UI ModeBash# Launch interactive Playwright UI Mode
npx playwright test --ui

# Run tests in step-by-step debug mode (Playwright Inspector)
npx playwright test --debug
📊 Test Reporting1. Playwright Native HTML ReportPlaywright automatically creates a detailed HTML report on every execution:Bash# Open the latest HTML report in your browser
npx playwright show-report
2. Allure ReportThe framework feeds test execution data directly into allure-results/.Bash# Clean previous results (optional)
rm -rf allure-results allure-report

# Run tests to generate fresh results
npx playwright test

# Generate and view the Allure Report locally
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report

# Alternative: Generate and open report directly in a temporary server
npx allure serve allure-results
🔄 Jenkins CI/CD Pipeline IntegrationThe included Jenkinsfile provides an automated build and test pipeline:Pipeline Execution Stages:Checkout: Clones the repository from source control.Install Dependencies: Executes npm ci for deterministic package installation.Install Browsers: Runs npx playwright install --with-deps chromium to ensure headless browsers and OS libraries are present on the Jenkins agent.Execute Tests: Runs tests with --project=chromium.Post Actions:Archives native Playwright HTML report and traces (playwright-report/**, test-results/**).Automatically builds and publishes the interactive Allure Report dashboard via the Jenkins Allure Plugin.Cleans workspace post-execution.🔧 Troubleshooting GuideIssueRoot CauseSolutionts(2307): Cannot find module '../../utils'Missing index.ts re-export file in utils/.Ensure utils/index.ts exists and re-exports modules (export * from './envHelper'; export * from './dataGenerator';).ts(2304): Cannot find name 'accessToken'Scope mismatch in test file; token not declared before use.Declare let accessToken: string; in test scope or generate tokens dynamically inside the test case.API 401 Unauthorized on /ordersPrior POST /api-clients returned 409 Conflict, leaving accessToken as undefined.Ensure unique client email generation using timestamps or crypto.randomBytes(4).toString('hex').Parallel worker race conditionsTests sharing mutable outer variables across worker processes.Ensure tests are self-contained or initialize preconditions independently in test.beforeEach blocks.Allure command not recognizedallure-commandline not installed globally.Install globally via npm install -g allure-commandline or run using npx allure.📐 Coding Conventions & GuidelinesAssertion Location: Keep expect() assertions strictly inside test spec files (tests/**/*.spec.ts). Page Objects should only perform actions or return locators/values.Locator Strategy: Favor semantic Playwright locators (getByRole, getByPlaceholder, getByText) or stable unique IDs (#user-name). Avoid brittle absolute XPath.Fixture Registration: When adding a new Page Object, register it in fixtures/testFixtures.ts so it is automatically injectable into UI specs.Clean Code: Run code formatting and TypeScript verification prior to creating a Pull Request:Bashnpx tsc --noEmit