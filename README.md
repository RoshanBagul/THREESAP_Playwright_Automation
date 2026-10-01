# THREESAP Playwright Automation

This project automates the OrangeHRM login flow using Playwright and TypeScript. It follows a Page Object Model approach and validates both the successful login path and key failure scenarios.

## Overview

The automation is built with:

- Playwright
- TypeScript
- Page Object Model (POM)
- Chromium browser automation
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
└── node_modules/
```

## Prerequisites

- Node.js 18 or above
- npm
- Playwright browsers installed

## Installation

```bash
npm install
npx playwright install
```

## Run Tests

Run the default suite:

```bash
npm test
```

Run in headed mode:

```bash
npm run test:headed
```

Run in UI mode:

```bash
npm run test:ui
```

Run a specific specification:

```bash
npx playwright test tests/login.spec.ts --headed
```

## Current Test Coverage

The active test suite is in:

- `tests/login.spec.ts`

It currently validates:

- successful admin login
- invalid credentials flow
- empty username/password validation
- dashboard visibility after login

## Browser Configuration

The project is configured to run Chromium in headed mode and maximize the browser window during local execution to mirror a desktop-style Selenium flow.

## Reports

The Playwright HTML report is generated in:

```text
playwright-report/
```

## Test Results

The suite is verified to run successfully with:

```bash
npx playwright test tests/login.spec.ts --headed --project=chromium
```

Current result:

- 3 passed

## Additional Documentation

- `TEST_CASES.md` contains a structured list of functional test cases for the login flow
