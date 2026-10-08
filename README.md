# THREESAP Playwright Automation

This project automates OrangeHRM scenarios using Playwright and TypeScript with a Page Object Model (POM). It covers authentication, role-based navigation, and employee lifecycle workflows against the environment selected at runtime.

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
├── pages/
│   └── BasePage.ts
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
├── playwright-report/  # submitted Playwright HTML report
└── .gitignore
```

The current Playwright HTML report is included under `playwright-report/` for
submission review. Per-test results, Allure output, authentication state, and
installed dependencies remain generated and uncommitted. See [Reports](#reports).

## Key Design Decisions

- **Environment is explicit:** the selected `TEST_ENV` profile supplies the OrangeHRM
  URL and credentials; tests do not embed environment URLs or secrets. CI configures
  its own staging profile.
- **UI tests verify user-visible behavior:** login and the employee creation flow
  remain browser-driven. The lifecycle update and delete tests use the authenticated
  OrangeHRM PIM API to seed employees, then perform the behavior under test in the UI.
- **API checks verify the same record:** the update test reads the employee it changed
  from OrangeHRM's PIM API rather than relying on a separate mock service.
- **Test data is isolated and cleaned up:** employee IDs and names are generated per
  test, and a fixture removes tracked employees even when a test fails.
- **Browser authentication is reused safely:** setup creates browser-specific storage
  state; login tests deliberately start unauthenticated.
- **The submission includes a reviewable test report:** `playwright-report/` is
  refreshed by the test run and included in source control; detailed test results
  and Allure artifacts remain ignored and are available from CI.

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

The supported `TEST_ENV` values are `local` (the default), `qa`, `staging`, and
`production`.
The runner loads `.env.<TEST_ENV>` first, then `.env` as a shared fallback; variables
already set in the process take precedence over both files. Create files such as
`.env.staging` for environment-specific settings. These files are ignored by Git.

The required variables are `ORANGEHRM_BASE_URL`, `ORANGEHRM_USERNAME`, and
`ORANGEHRM_PASSWORD`. To run Admin-versus-ESS role checks,
also set `ORANGEHRM_ESS_USERNAME` and `ORANGEHRM_ESS_PASSWORD` to an existing ESS user;
both must be set together. Those checks verify that ESS can see `My Info` but cannot
see the `Admin` or `PIM` menus, while Admin sees the administrative menus. Without
ESS credentials, the Admin menu test still runs and the ESS-specific test is reported
as skipped. If no `ORANGEHRM_BASE_URL` repository variable is set, GitHub Actions
uses the public OrangeHRM demo with its public demo account by default. When targeting
another environment, set `ORANGEHRM_BASE_URL` and configure
`ORANGEHRM_USERNAME` and `ORANGEHRM_PASSWORD` as repository secrets or as secrets in
the GitHub `staging` Environment used by the workflow. Custom URLs do not get demo
credential fallbacks; the workflow stops with a clear error if either credential is
missing.
Optionally configure
`ORANGEHRM_ESS_USERNAME` and `ORANGEHRM_ESS_PASSWORD` as secrets to enable the ESS
checks.

To run against another environment, provide its configuration in `.env.<name>` (for
example `.env.qa`) and select it with `TEST_ENV`:

```powershell
Copy-Item .env.example .env.qa
# Set the QA URL and credentials in .env.qa before running tests.
$env:TEST_ENV = "qa"
npm test
```

## Run Tests

Run the default suite:

```bash
npm test
```

Run tests by tag:

```bash
npm run test:smoke
npm run test:regression
npm run test:e2e
npm run test:api
```

Tests carry `@regression` at suite level; focused happy-path tests are additionally
tagged `@smoke`, browser-driven workflow cases use `@e2e`, and lifecycle tests that
use OrangeHRM's PIM API for employee setup or verification also use `@api`. Tags
can be combined with Playwright's `--grep` / `--grep-invert` options. `test:api`
selects tests that use the API; those lifecycle tests also exercise the UI and are
not API-only tests.

## Test Data Management

- Employee records are generated per test with cryptographically random identifiers
  and distinct first/last names, so independent tests and parallel workers do not
  reuse employee data.
- Shared selectable employee values (job title and employment status) live in
  `data/employeeData.json`; assertions compare against those values instead of
  duplicating them in test code.
- Tests that create employees register the employee ID with the cleanup fixture
  immediately. Fixture teardown deletes remaining records even when a later test
  step fails; cleanup failures are logged and attached to the Playwright report.
- The employee create-and-find scenario creates its record through the UI. Update
  and delete scenarios seed their records through OrangeHRM's PIM API, then exercise
  the target action through the UI. This keeps test setup separate from the behavior
  under test while using the selected environment's authenticated session.
- Keep credentials and environment-specific URLs in `.env.<TEST_ENV>` or CI
  variables/secrets. Do not store account credentials or generated test records in
  committed fixtures.

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

- Successful login, invalid-credential handling, required-field validation, and
  password masking
- Admin and optional ESS navigation access
- Independent employee creation/list verification, update/API verification, and
  deletion tests
- Independent logout test

## Video Recording

Playwright is configured to retain screenshots, traces, and videos for failed test runs. The artifacts are stored under:

```text
test-results/
```

If a scenario fails, the relevant failure artifacts (including video) are saved in the matching subfolder under [test-results](test-results). The generated HTML report is available in [playwright-report](playwright-report).

## Main Test Files

- `tests/auth.setup.ts` — authenticates in browser-specific setup projects and saves
  storage state for reuse
- `tests/login.spec.ts` — login and authentication validations
- `tests/role-access.spec.ts` — compares Admin and optional ESS navigation visibility
- `tests/employee-lifecycle.spec.ts` — independent UI create, update/API verify, delete, and logout cases with named Playwright steps
- `fixtures/employeeCleanup.ts` — tracks test-created employees, logs cleanup failures, and attaches failure details to the Playwright report

## Page Objects

- `pages/BasePage.ts`
- `pages/LoginPage.ts`
- `pages/DashboardPage.ts`
- `pages/NavigationPage.ts`
- `pages/PimPage.ts`
- `pages/AddEmployeePage.ts`
- `pages/EmployeeListPage.ts`
- `pages/EmployeeDetailsPage.ts`

## Browser Configuration

The Playwright config uses:

- base URL from `ORANGEHRM_BASE_URL` in the selected environment configuration
- Chromium, Firefox, and WebKit projects
- a setup project that saves authenticated storage state to the ignored `.auth/` directory for reuse across browser projects
- the login spec uses an empty storage state so authentication scenarios still exercise the login UI
- shared action, navigation, assertion, and per-workflow test timeouts are maintained in `utils/timeouts.json`
- a fixed 1280x800 viewport across browsers
- three CI workers so browser projects can run concurrently
- headed mode enabled in local runs
- screenshots and video retained on failure, with traces recorded on the first retry

## Flaky Test Policy

### Detection and CI behavior

- Local runs use no retries. CI retries a failed test up to two times to collect evidence and distinguish intermittent failures from consistent failures; retries are diagnostic, not a pass condition.
- `failOnFlakyTests` is enabled in CI, so a test that fails and then passes on retry still fails the workflow. Do not increase retries to make a red test appear green.
- CI retains failure screenshots, videos, and traces from the first retry. The `test-reports` artifact also includes the Playwright and Allure reports. Review the failed attempt and retry trace before changing a test.

### Triage workflow

1. Identify the first failing Playwright step and compare the original attempt with its retry. Check whether the failure is a locator/assertion timeout, navigation or authentication problem, test-data collision, cleanup failure, browser-specific issue, or an unavailable/rate-limited external service.
2. Reproduce the affected spec and browser locally, first without retries:

   ```bash
   npx playwright test tests/<spec>.spec.ts --project=<chromium|firefox|webkit> --workers=1
   ```

   Use `--debug` or `--headed` when the failure needs visual inspection. Run the same command more than once only to establish that the failure is intermittent; keep the failing artifacts.
3. Fix the cause, then rerun the targeted test without retries and run the relevant cross-browser coverage. Don’t land a change that only succeeds after retry.

### Prevention guidelines

- Prefer Playwright locator actions and auto-retrying assertions (`expect(locator).toBeVisible()`, `toHaveText()`, `toHaveURL()`) over fixed sleeps or manual polling. Add an explicit wait only for a specific observable state, not simply to wait for time to pass.
- Keep tests isolated: generate unique employee IDs/data per test, avoid depending on execution order or shared mutable accounts, and register created data with the cleanup fixture immediately so it is removed even after a later assertion fails.
- Keep UI and API checks targeted at the same created record. Avoid multiplying requests to public or rate-limited services across browser projects; use the configured OrangeHRM environment for its authenticated PIM API.
- Treat environment availability and credentials separately from product failures. Confirm the selected `TEST_ENV`, URL, and required secrets are configured before diagnosing browser behavior; never log passwords, tokens, or authentication state.
- If a genuine external outage prevents a test from running, report the outage and preserve the failed result/artifacts. Don’t silently catch the error, add broad skips, or weaken assertions to hide it.

## Reports

Generate and open the Allure HTML report locally:

```bash
npm run test:allure
npm run allure:report
npm run allure:open
```

The latest Playwright HTML report is checked in under [playwright-report](playwright-report)
for submission review. Regenerate it by running `npm run test:allure`. GitHub Actions
also uploads the Playwright report, detailed test results, and Allure output in the
`test-reports` artifact, including when tests fail; CI retains that artifact for
14 days.

The checked-in report was generated by a full serial run
(`npm run test:allure -- --workers=1`): 41 passed, 4 failed, and 6 skipped out of
51 tests. The failures show authenticated pages returning to the login page in
navigation checks and one created employee not appearing in the employee list.
This is a recorded test result, not a claim that the full suite is currently green;
use the report's screenshots and videos to investigate.

Detailed local test results and Allure report output are ignored by Git and appear
after the corresponding commands run:

```text
test-results/       # per-test results and failure evidence
allure-results/     # Allure raw results
allure-report/      # generated Allure HTML report
```

This Playwright project has no separate application build output; TypeScript is
checked with `npx tsc --noEmit`. Test coverage and expected behavior are maintained
in [TEST_CASES.md](TEST_CASES.md).

## Additional Documentation

- `TEST_CASES.md` contains the functional test case matrix for authentication,
  role-based navigation, and employee lifecycle workflows.
