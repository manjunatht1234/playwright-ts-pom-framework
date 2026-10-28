Automated Test Cases Documention:
https://docs.google.com/spreadsheets/d/15CeJ-r5Vli0ec-sDDPum7JIWNkqfWuLz6Ti7mwS2Mys/edit?usp=sharing

```md
# 🎭 Playwright + TypeScript Automation Framework

A scalable, production-style automation framework for web UI and REST API testing, built with Playwright, TypeScript, and the Page Object Model (POM) design pattern.

This repository supports:
- Web UI testing for Swag Labs (SauceDemo)
- REST API testing for Simple Books API
- Cross-browser execution
- Allure and Playwright reporting
- CI/CD integration with Jenkins and GitHub Actions

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Framework Architecture](#framework-architecture)
- [Project Structure](#project-structure)
- [Applications Under Test](#applications-under-test)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Test Scenarios Covered](#test-scenarios-covered)
- [Running Tests](#running-tests)
- [Page Object Model & Fixtures](#page-object-model--fixtures)
- [API Testing Approach](#api-testing-approach)
- [Test Data Management](#test-data-management)
- [Reporting](#reporting)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Coding Conventions](#coding-conventions)
- [Contributing](#contributing)

---

## Overview

This repository contains a dual-layer automation framework:

| Layer | Target Application | Scope |
| --- | --- | --- |
| 🌐 Web UI | Swag Labs (SauceDemo) | Login, product catalog, sorting, cart, checkout, and order confirmation |
| 🔌 REST API | Simple Books API | Service health, books retrieval, client registration, and order CRUD |

The framework emphasizes:
- Maintainability via Page Object Model (POM)
- Reliability through isolated test data and fixtures
- Visibility through Playwright HTML and Allure reports
- CI/CD readiness for Jenkins and GitHub Actions

---

## Key Features

- ✅ Dual-layer automation: UI + API tests in one repository
- ✅ Page Object Model (POM) with reusable BasePage
- ✅ Custom Playwright fixtures for dependency injection
- ✅ Dynamic and isolated test data generation
- ✅ Cross-browser execution: Chromium, Firefox, WebKit
- ✅ Parallel execution supported
- ✅ Rich reporting with Playwright HTML and Allure
- ✅ CI/CD ready with Jenkins and GitHub Actions
- ✅ Centralized utilities for environment configuration

---

## Technology Stack

| Component | Technology | Requirement |
| --- | --- | --- |
| Automation Engine | Playwright Test | ^1.40.0 or higher |
| Language | TypeScript | ^5.0.0 |
| Runtime | Node.js | v18.x or v20.x LTS |
| Design Pattern | Page Object Model | Inheritance via `BasePage` |
| Reporting | Allure + Playwright HTML | Java 8+ required for Allure |
| CI/CD | Jenkins, GitHub Actions | Declarative pipeline support |
| Apps Under Test | SauceDemo, Simple Books API | UI + REST |

---

## Framework Architecture

### Test Layer
- UI tests
- API tests
- Shared fixtures and utility services

### Reports
- `playwright-report/`
- `allure-results/`

### Test Data
- `test-data/checkoutData.ts`
- `test-data/userData.ts`

### Utilities
- `utils/envHelper.ts`
- `utils/dataGenerator.ts`
- `utils/index.ts`

### Fixtures
- `fixtures/pageFixtures.ts`

### Page Object Layer
- `pages/BasePage.ts`
- `pages/LoginPage.ts`
- `pages/InventoryPage.ts`
- `pages/CartPage.ts`
- `pages/CheckoutPage.ts`

### Configuration
- `playwright.config.ts`
- `tsconfig.json`

### Test Files
- `tests/web/login.spec.ts`
- `tests/web/e2e-order.spec.ts`
- `tests/api/simple-books-api.spec.ts`

---

## Project Structure

```text
playwright-pom-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── allure-results/
├── docs/
│   └── git_github.md
├── fixtures/
│   └── pageFixtures.ts
├── pages/
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── playwright-report/
├── test-data/
│   ├── checkoutData.ts
│   └── userData.ts
├── test-results/
├── tests/
│   ├── api/
│   │   └── simple-books-api.spec.ts
│   └── web/
│       ├── login.spec.ts
│       └── e2e-order.spec.ts
├── utils/
│   ├── dataGenerator.ts
│   ├── envHelper.ts
│   └── index.ts
├── .gitignore
├── Jenkinsfile
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

---

## Applications Under Test

### Swag Labs (SauceDemo) — Web UI

URL: https://www.saucedemo.com/

Password for all users: `secret_sauce`

| Username | Behavior |
| --- | --- |
| `standard_user` | Normal user |
| `locked_out_user` | Login rejected |
| `problem_user` | Broken UI / image issues |
| `performance_glitch_user` | Slow page responses |
| `error_user` | Simulated error scenarios |
| `visual_user` | Visual layout differences |

> These credentials are publicly known and intended for test automation practice.

### Simple Books API — REST

Base URL: https://simple-books-api.click

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/status` | No | API health status |
| GET | `/books` | No | List books |
| GET | `/books/:bookId` | No | Get a single book |
| POST | `/api-clients/` | No | Register a client and get a token |
| POST | `/orders` | Yes | Place an order |
| GET | `/orders` | Yes | Get all orders |
| GET | `/orders/:orderId` | Yes | Get one order |
| PATCH | `/orders/:orderId` | Yes | Update an order |
| DELETE | `/orders/:orderId` | Yes | Delete an order |

Example client registration:

```http
POST /api-clients/
Content-Type: application/json

{
  "clientName": "Postman",
  "clientEmail": "valentin@example.com"
}
```

Example order creation:

```http
POST /orders
Authorization: Bearer <YOUR TOKEN>
Content-Type: application/json

{
  "bookId": 1,
  "customerName": "John"
}
```

> A duplicate `clientEmail` returns `409 Conflict`. This framework generates a unique email per test run to avoid collisions.

---

## Prerequisites

| Requirement | Version | Notes |
| --- | --- | --- |
| Node.js | v18.x or v20.x LTS | Required |
| npm | v9+ | Included with Node.js |
| Git | Latest | Required |
| Java (JRE/JDK) | 8+ (11+ recommended) | Required for Allure |

---

## Installation & Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd playwright-pom-framework

# 2. Install dependencies
npm install

# 3. Install Playwright browsers and OS dependencies
npx playwright install --with-deps

# 4. Optional: verify TypeScript compilation
npx tsc --noEmit

# 5. Run the full suite
npx playwright test
```

---

## Environment Configuration

Create a `.env` file in the project root if you want to override defaults:

```env
# Web UI (SauceDemo)
BASE_URL=https://www.saucedemo.com
STANDARD_USER=standard_user
LOCKED_USER=locked_out_user
PASSWORD=secret_sauce

# REST API (Simple Books API)
API_BASE_URL=https://simple-books-api.click
```

The project loads these values via `utils/envHelper.ts`, which provides sensible default fallbacks so the framework works out of the box.

---

## Test Scenarios Covered

### Web UI Suite

| Area | Scenarios |
| --- | --- |
| Authentication | Valid login, invalid credentials, locked-out user validation |
| Product Catalog | Product selection, sorting, cart badge validation |
| Checkout | Login → add to cart → validate cart → checkout → totals → confirmation |

### REST API Suite

| ID | Scenario | Request | Expected |
| --- | --- | --- | --- |
| TC_API_01 | Service health | GET `/status` | 200 OK |
| TC_API_02 | Filter books by query | GET `/books?type=fiction&limit=2` | 200 OK |
| TC_API_03 | Fetch single book | GET `/books/:id` | 200 OK |
| TC_API_04 | Missing book | GET `/books/99999` | 404 |
| TC_API_05 | Register client | POST `/api-clients` | 201 Created |
| TC_API_06 | Duplicate client registration | POST `/api-clients` | 409 Conflict |
| TC_API_07 | Place order | POST `/orders` | 201 Created |
| TC_API_08 | Order without token | POST `/orders` | 401 Unauthorized |
| TC_API_09 | Out-of-stock order | POST `/orders` | 404 / 400 |
| TC_API_10 | Get all orders | GET `/orders` | 200 OK |
| TC_API_11 | Get one order | GET `/orders/:orderId` | 200 OK |
| TC_API_12 | Update order name | PATCH `/orders/:orderId` | 204 No Content |
| TC_API_13 | Delete order | DELETE `/orders/:orderId` | 204 No Content |
| TC_API_14 | Delete already-deleted order | DELETE `/orders/:orderId` | 404 |

---

## Running Tests

### Full suite

```bash
npx playwright test
```

### By layer

```bash
npx playwright test tests/web/
npx playwright test tests/api/
```

### Specific files

```bash
npx playwright test tests/web/e2e-order.spec.ts
npx playwright test tests/api/simple-books-api.spec.ts
```

### Filter by title or ID

```bash
npx playwright test -g "TC_API_01"
npx playwright test -g "TC_E2E_01"
```

### Browser selection

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Headed mode

```bash
npx playwright test tests/web/ --headed
```

### Debug mode

```bash
npx playwright test --ui
npx playwright test --debug
```

### Parallelism and retries

```bash
npx playwright test --workers=4
npx playwright test --retries=2
```

---

## Page Object Model & Fixtures

### Page Objects

Each page object encapsulates locators and actions, while assertions remain in the spec file.

| Class | File | Responsibility |
| --- | --- | --- |
| `BasePage` | `pages/BasePage.ts` | Shared interactions and waits |
| `LoginPage` | `pages/LoginPage.ts` | Login actions and error handling |
| `InventoryPage` | `pages/InventoryPage.ts` | Product listing and cart interactions |
| `CartPage` | `pages/CartPage.ts` | Cart review and navigation |
| `CheckoutPage` | `pages/CheckoutPage.ts` | Customer info and order finish |

Example:

```ts
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
```

### Custom Fixtures

```ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

type Pages = { loginPage: LoginPage; inventoryPage: InventoryPage };

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
});

export { expect } from '@playwright/test';
```

Example usage:

```ts
import { test, expect } from '../../fixtures/pageFixtures';

test('Valid login lands on the inventory page', async ({ loginPage, page }) => {
  await page.goto('/');
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory/);
});
```

---

## API Testing Approach

API tests use Playwright's built-in `request` fixture, which allows fast and isolated HTTP calls without launching a browser.

```ts
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
```

Good practices used:
- Fresh unique client email for each run
- Serial execution for dependent order lifecycle tests
- Contract validation for API responses
- Cleanup of created orders after test execution

---

## Test Data Management

| Source | File | Purpose |
| --- | --- | --- |
| Checkout data | `test-data/checkoutData.ts` | Customer info and expected totals |
| User data | `test-data/userData.ts` | SauceDemo usernames and passwords |
| Dynamic data | `utils/dataGenerator.ts` | Unique emails and random values |
| Environment config | `utils/envHelper.ts` | Base URLs and credentials |

These utilities are re-exported through:

```ts
import { getEnv, generateEmail } from '../../utils';
```

---

## Reporting

### Playwright HTML Report

```bash
npx playwright show-report
```

### Allure Report

```bash
# Clean previous reports
rm -rf allure-results allure-report

# Run the tests
npx playwright test

# Generate Allure report
npx allure generate allure-results --clean -o allure-report

# Open the report
npx allure open allure-report
```

### Failure Artifacts

Playwright stores traces, screenshots, and videos under `test-results/`.

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

---

## CI/CD Integration

### GitHub Actions

The project includes a workflow at:

```text
.github/workflows/playwright.yml
```

This workflow runs the regression suite on pushes and pull requests and uploads the generated report as an artifact.

### Jenkins

The repository includes a `Jenkinsfile` for declarative pipeline execution:

- Checkout
- Install dependencies (`npm ci`)
- Install Playwright browsers
- Run tests with Chromium
- Archive reports and artifacts
- Publish Allure dashboard

---

## Troubleshooting

| Issue | Cause | Fix |
| --- | --- | --- |
| `Cannot find module '../../utils'` | Missing barrel export | Ensure `utils/index.ts` exports the modules |
| `Cannot find name 'accessToken'` | Variable not declared in scope | Declare `let accessToken: string;` |
| `401 Unauthorized` on `/orders` | Token missing or invalid | Register a new client with a unique email |
| Parallel test race | Shared mutable data | Use self-contained tests or serial mode |
| `allure` command missing | `allure-commandline` not installed | Use `npx allure ...` |
| Java-related Allure failure | Java missing from PATH | Install JDK 8+ and verify with `java -version` |
| Browser launch errors | Playwright browsers not installed | Run `npx playwright install --with-deps` |
| API timeout / ENOTFOUND | Wrong URL or network issue | Verify `https://simple-books-api.click` is reachable |

---

## Coding Conventions

- Keep `expect()` assertions inside spec files
- Prefer semantic locators such as `getByRole`, `getByPlaceholder`, and `getByText`
- Register new page objects in `fixtures/pageFixtures.ts`
- Keep tests self-contained and clean up generated data
- Use descriptive test names, e.g. `TC_API_07: Place order for in-stock book`
- Validate TypeScript before opening a PR:

```bash
npx tsc --noEmit
```

---

## Contributing

This project follows a standard branching workflow. More details are available in:

```text
docs/git_github.md
```

Recommended workflow:

```bash
git checkout -b feature/<short-description>
# make changes
npx playwright test
npx tsc --noEmit
git add .
git commit -m "Add feature description"
git push origin feature/<short-description>
```

Then open a Pull Request against `main`.

---

## References

- Playwright Documentation
- SauceDemo
- Simple Books API
- Allure Report
- Allure Report Details:
<img width="916" height="509" alt="image" src="https://github.com/user-attachments/assets/1f8e2f3a-4a41-4594-bdce-8507b3e0aa2f" />


---
