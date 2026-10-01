# Test Cases for OrangeHRM Login Flow

## Scope
This document covers the login functionality currently implemented in the project and the most relevant validation scenarios for the OrangeHRM application.

## Functional Area
- Authentication
- Dashboard access validation
- Error validation for invalid login attempts

## Test Cases

| TC ID | Test Case | Preconditions | Steps | Expected Result |
|------|-----------|---------------|-------|-----------------|
| TC-01 | Verify login page loads successfully | User is on the application base URL | 1. Open the login page 2. Observe the page | Login form is displayed with username, password, and login button |
| TC-02 | Verify valid admin login | User has valid credentials (Admin / admin123) | 1. Enter valid username 2. Enter valid password 3. Click Login | User is redirected to the Dashboard and dashboard heading is visible |
| TC-03 | Verify empty username field | User is on login page | 1. Leave username empty 2. Enter a valid password 3. Click Login | Login should not proceed and validation message or field error should be shown |
| TC-04 | Verify empty password field | User is on login page | 1. Enter valid username 2. Leave password empty 3. Click Login | Login should not proceed and validation message or field error should be shown |
| TC-05 | Verify both fields empty | User is on login page | 1. Leave username empty 2. Leave password empty 3. Click Login | Login should not proceed and validation messages should be displayed |
| TC-06 | Verify invalid username | User is on login page | 1. Enter invalid username 2. Enter valid password 3. Click Login | User should not be logged in and an invalid credentials message should be displayed |
| TC-07 | Verify invalid password | User is on login page | 1. Enter valid username 2. Enter invalid password 3. Click Login | User should not be logged in and an invalid credentials message should be displayed |
| TC-08 | Verify wrong username and wrong password | User is on login page | 1. Enter incorrect username 2. Enter incorrect password 3. Click Login | Login should fail and user stays on the login page |
| TC-09 | Verify dashboard visibility after successful login | User has valid credentials | 1. Login successfully 2. Observe next page | Dashboard heading is visible and user is authenticated |
| TC-10 | Verify login page remains accessible after failed login | User is on login page and credentials are invalid | 1. Enter invalid credentials 2. Submit form | User remains on the login page with an error message |
| TC-11 | Verify password field masking | User is on login page | 1. Enter password 2. Observe field behavior | Password is entered as masked/secure text |
| TC-12 | Verify browser maximization does not affect login behavior | Browser is open in headed mode and maximized | 1. Launch the browser 2. Navigate to login page 3. Log in successfully | Login still works normally in the maximized window |

## Automation Notes
The current project already validates the main happy path in:
- `tests/login.spec.ts`

Relevant Page Objects:
- `pages/LoginPage.ts`
- `pages/DashboardPage.ts`

## Recommended Next Automation Coverage
1. Invalid credentials test
2. Empty username/password validation
3. Logout validation
4. Dashboard page heading assertion
5. Browser window maximize verification across runs
