# THREESAP Playwright Automation

This project automates OrangeHRM scenarios using Playwright and TypeScript with a Page Object Model (POM). It covers authentication, employee lifecycle workflows, and validation checks against the live OrangeHRM demo environment.

## Overview

The suite is built with:

- Playwright
- TypeScript
- Page Object Model structure
- Chromium, Firefox, and WebKit browser automation
- Headed browser execution for local validation

## Project Structure

```text
threesap_automation/
├── api/
├── data/
├── fixtures/
├── pages/
├── tests/
├── utils/
│   └── environment.ts
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── README.md
├── TEST_CASES.md
├── .env.example
├── playwright-report/
├── test-results/
├── test-assets/
├── node_modules/
└── .gitignore
```

## Prerequisites

- Node.js 18+
- npm
- Playwright browser binaries installed

## Installation

From the project root:

```bash
npm install
npx playwright install chromium firefox webkit
```

## Environment Configuration

Runtime settings are loaded from environment variables. For local development, copy
`.env.example` to `.env.local` and provide the test account credentials:

```powershell
Copy-Item .env.example .env.local
```

The supported `TEST_ENV` values are `local` (the default), `staging`, and `production`.
The runner loads `.env.<TEST_ENV>` first, then `.env` as a shared fallback; variables
already set in the process take precedence over both files. Create files such as
`.env.staging` for environment-specific settings. These files are ignored by Git.

The required variables are `ORANGEHRM_BASE_URL`, `ORANGEHRM_USERNAME`,
`ORANGEHRM_PASSWORD`, and `EMPLOYEE_API_BASE_URL`. `REQRES_API_KEY` is optional when
the configured API does not require authentication. For GitHub Actions, configure
the URLs as repository variables named `ORANGEHRM_BASE_URL` and
`EMPLOYEE_API_BASE_URL`, and configure the credentials as repository secrets named
`ORANGEHRM_USERNAME` and `ORANGEHRM_PASSWORD`; `REQRES_API_KEY` can also be set as a
secret when needed.

To run against another local profile, set `TEST_ENV` before invoking Playwright:

```powershell
$env:TEST_ENV = "staging"
npm test
```

On Windows, if `npm` is not recognized in PowerShell, first add Node to PATH or call it explicitly:

```powershell
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
cd "D:\Automation\threesap_automation"
npm install
npx playwright install chromium firefox webkit
```

## Run Tests

Run the default suite:

```bash
npm test
```

Run all tests in Chromium, Firefox, and WebKit:

```bash
npm run test:cross-browser
```

Run in headed mode:

```bash
npm run test:headed
```

Run in UI mode:

```bash
npm run test:ui
```

Run a specific spec in one browser:

```bash
npx playwright test tests/login.spec.ts --project=chromium
npx playwright test tests/employee-lifecycle.spec.ts --project=chromium
npx playwright test tests/employee-lifecycle.spec.ts --project=firefox
npx playwright test tests/employee-lifecycle.spec.ts --project=webkit
```

## Current Coverage

The project currently includes these automated checks:

- Login page loads
- Successful admin login
- Invalid credentials flow
- Empty username/password validation
- Employee creation flow
- Employee record editing
- API validation for created/updated employee data
- Employee deletion
- Logout flow

## Full Suite Execution Summary

The complete Playwright suite was executed successfully in the current workspace:

```powershell
cmd /c "set PATH=C:\Program Files\nodejs;%PATH% && cd /d D:\Automation\threesap_automation && npx playwright test --project=chromium"
```

Verified result:

- 10 passed
- 0 failed
- total runtime: 58.4s

## Video Recording

Playwright is configured to retain screenshots, traces, and videos for failed test runs. The artifacts are stored under:

```text
test-results/
```

If a scenario fails, the relevant failure artifacts (including video) are saved in the matching subfolder under [test-results](test-results). The generated HTML report is available in [playwright-report](playwright-report).

## Main Test Files

- `tests/login.spec.ts` — login and authentication validations
- `tests/employee-lifecycle.spec.ts` — employee add/edit/delete lifecycle workflow

## Page Objects

- `pages/LoginPage.ts`
- `pages/DashboardPage.ts`
- `pages/PimPage.ts`
- `pages/AddEmployeePage.ts`
- `pages/EmployeeListPage.ts`
- `pages/EmployeeDetailsPage.ts`

## Browser Configuration

The Playwright config uses:

- base URL from `ORANGEHRM_BASE_URL` in the selected environment configuration
- Chromium, Firefox, and WebKit projects
- a fixed 1280x800 viewport across browsers
- three CI workers so browser projects can run concurrently
- headed mode enabled in local runs
- screenshots and video retained on failure, with traces recorded on the first retry

## Flaky Test Policy

- CI retries failed tests up to two times; local runs do not retry by default.
- A test that passes only after a retry is still reported as flaky and fails the CI job.
- Failure screenshots, videos, and retry traces are uploaded with the Playwright report artifact.

## Reports

Generate and open the Allure HTML report locally:

```bash
npm run test:allure
npm run allure:report
npm run allure:open
```

GitHub Actions generates the Allure report after the test step and uploads it with the Playwright report and test results, including when tests fail.

HTML reports are generated in:

```text
playwright-report/
```

## Verified Test Result

The project has been validated successfully with the full suite and the employee lifecycle spec. The latest verified run includes:

- 10 tests passed in the full suite
- 1 employee lifecycle scenario passed

## Additional Documentation

- `TEST_CASES.md` contains the functional test case matrix for the login and employee workflows
