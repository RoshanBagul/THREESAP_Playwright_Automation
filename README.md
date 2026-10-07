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
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── README.md
├── TEST_CASES.md
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

- base URL: `https://opensource-demo.orangehrmlive.com`
- Chromium, Firefox, and WebKit projects
- a fixed 1280x800 viewport across browsers
- three CI workers so browser projects can run concurrently
- headed mode enabled in local runs
- screenshots, video, and traces retained on failure

## Reports

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
