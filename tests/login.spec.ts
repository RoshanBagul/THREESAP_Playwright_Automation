import { test } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TEST_CONFIG } from '../utils/constants';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('OrangeHRM Login', { tag: '@regression' }, () => {

    test('should login successfully', { tag: '@smoke' }, async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);

        await loginPage.navigate();

        await loginPage.login(
            TEST_CONFIG.username,
            TEST_CONFIG.password
        );

        await dashboardPage.verifyDashboard();
    });

    test('should show invalid credentials message for wrong username and password', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.login('WrongUser', 'WrongPassword');

        await loginPage.verifyInvalidCredentials();
    });

    test('should show validation when username is empty', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.login('', TEST_CONFIG.password);

        await loginPage.verifyRequiredFieldCount(1);
    });

    test('should show validation when password is empty', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.login(TEST_CONFIG.username, '');

        await loginPage.verifyRequiredFieldCount(1);
    });

    test('should show invalid credentials for invalid username', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.login('InvalidUser', TEST_CONFIG.password);

        await loginPage.verifyInvalidCredentials();
    });

    test('should show invalid credentials for invalid password', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.login(TEST_CONFIG.username, 'WrongPassword');

        await loginPage.verifyInvalidCredentials();
    });

    test('should keep user on login page after failed login', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.login('WrongUser', 'WrongPassword');

        await loginPage.verifyLoginFormVisible();
    });

    test('should mask password input as a password field', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.verifyPasswordIsMasked();
    });

    test('should require username and password fields when empty', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.login('', '');

        await loginPage.verifyRequiredFieldCount(2);
    });

});
