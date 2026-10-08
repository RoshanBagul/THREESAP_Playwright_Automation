# OrangeHRM Automated Test Cases

This matrix documents the automated behavior currently covered by Playwright. Tests
run against the environment selected through `TEST_ENV` and its corresponding
`ORANGEHRM_BASE_URL` and credentials. See [README.md](README.md#environment-configuration)
for setup instructions.

## Authentication

Login tests use an empty browser storage state and submit credentials through the UI.
Tests requiring a valid account use the Admin credentials for the selected environment.

| ID | Automated scenario | Steps | Expected result |
|---|---|---|---|
| AUTH-01 | Valid Admin login | Open login page; submit configured username and password | Dashboard verification succeeds |
| AUTH-02 | Invalid username and password | Submit an invalid username and password | Invalid-credentials message is shown |
| AUTH-03 | Empty username | Leave username blank; submit configured password | One required-field message is shown |
| AUTH-04 | Empty password | Submit configured username; leave password blank | One required-field message is shown |
| AUTH-05 | Invalid username | Submit an invalid username and configured password | Invalid-credentials message is shown |
| AUTH-06 | Invalid password | Submit configured username and an invalid password | Invalid-credentials message is shown |
| AUTH-07 | Remain on login after failed authentication | Submit invalid credentials | Login form remains visible |
| AUTH-08 | Password masking | Inspect password input on login page | Password input has password type |
| AUTH-09 | Both fields empty | Submit the login form with both fields blank | Two required-field messages are shown |

## Role-Based Navigation

| ID | Automated scenario | Preconditions | Steps | Expected result |
|---|---|---|---|---|
| ROLE-01 | Admin navigation | Admin authentication setup succeeded | Open dashboard; inspect navigation | `Admin` and `PIM` menus are visible |
| ROLE-02 | ESS navigation restrictions | ESS credentials and browser-specific ESS storage state are configured | Open dashboard as ESS; inspect navigation | `My Info` is visible; `Admin` and `PIM` are hidden |

ROLE-02 is skipped when ESS credentials are not configured. Configure both
`ORANGEHRM_ESS_USERNAME` and `ORANGEHRM_ESS_PASSWORD` together.

## Employee Lifecycle

| ID | Automated scenario | Test data setup | Steps | Expected result |
|---|---|---|---|---|
| EMP-01 | Create and find employee | Generate unique data; create through UI | Search employee list by generated Employee ID | Created employee is visible |
| EMP-02 | Update employee and verify via API | Generate unique data; create through authenticated OrangeHRM PIM API | Update job title and employment status in UI; read employee through PIM API | UI and API show the requested values on the same employee |
| EMP-03 | Delete employee | Generate unique data; create through authenticated OrangeHRM PIM API | Find and delete employee through UI | Employee no longer appears in the list |
| EMP-04 | Logout | Use authenticated Admin browser state | Log out from dashboard | Login form is visible |

Created employee records are registered with the cleanup fixture. The fixture deletes
remaining records during teardown, including after a test failure. Cleanup failures
fail the test and are logged and attached to the Playwright report.

## Execution and Reports

The suite runs in Chromium, Firefox, and WebKit by default. Use
`npm run test:cross-browser` to explicitly run those browser projects. The `@api`
tag selects lifecycle tests that use the
OrangeHRM API for setup or verification; those tests also exercise the UI.

Playwright HTML reports and per-test results are generated under `playwright-report/`
and `test-results/`. Allure raw results and the generated Allure report are under
`allure-results/` and `allure-report/`. These generated directories are gitignored.
GitHub Actions uploads them in the `test-reports` artifact for 14 days.
