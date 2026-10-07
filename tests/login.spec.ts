import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TEST_CONFIG } from '../utils/constants';

test.describe('OrangeHRM Login', { tag: '@regression' }, () => {

    async function maximizeWindow(page: any) {
        await page.evaluate(() => {
            window.moveTo(0, 0);
            const width = window.screen.availWidth || window.innerWidth;
            const height = window.screen.availHeight || window.innerHeight;
            window.resizeTo(width, height);
        });
    }

    test('should login successfully', { tag: '@smoke' }, async ({ page }) => {
        await maximizeWindow(page);

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
        await maximizeWindow(page);

        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.login('WrongUser', 'WrongPassword');

        await expect(
            page.getByText('Invalid credentials', { exact: false })
        ).toBeVisible({ timeout: 15000 });
    });

    test('should show validation when username is empty', async ({ page }) => {
        await maximizeWindow(page);

        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.login('', TEST_CONFIG.password);

        await expect(page.getByText('Required', { exact: false })).toHaveCount(1, { timeout: 15000 });
    });

    test('should show validation when password is empty', async ({ page }) => {
        await maximizeWindow(page);

        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.login(TEST_CONFIG.username, '');

        await expect(page.getByText('Required', { exact: false })).toHaveCount(1, { timeout: 15000 });
    });

    test('should show invalid credentials for invalid username', async ({ page }) => {
        await maximizeWindow(page);

        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.login('InvalidUser', TEST_CONFIG.password);

        await expect(
            page.getByText('Invalid credentials', { exact: false })
        ).toBeVisible({ timeout: 15000 });
    });

    test('should show invalid credentials for invalid password', async ({ page }) => {
        await maximizeWindow(page);

        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.login(TEST_CONFIG.username, 'WrongPassword');

        await expect(
            page.getByText('Invalid credentials', { exact: false })
        ).toBeVisible({ timeout: 15000 });
    });

    test('should keep user on login page after failed login', async ({ page }) => {
        await maximizeWindow(page);

        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.login('WrongUser', 'WrongPassword');

        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
    });

    test('should mask password input as a password field', async ({ page }) => {
        await maximizeWindow(page);

        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });

    test('should require username and password fields when empty', async ({ page }) => {
        await maximizeWindow(page);

        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        await loginPage.login('', '');

        await expect(page.getByText('Required', { exact: false })).toHaveCount(2, { timeout: 15000 });
    });

});
