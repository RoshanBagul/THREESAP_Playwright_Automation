import { test } from '@playwright/test';
import path from 'node:path';
import { DashboardPage } from '../pages/DashboardPage';
import { NavigationPage } from '../pages/NavigationPage';
import { ENVIRONMENT_CONFIG } from '../utils/environment';
import { ESS_TEST_CONFIG } from '../utils/constants';

test.describe('OrangeHRM role-based navigation', { tag: '@regression' }, () => {
  test('Admin can access administrative navigation', { tag: ['@e2e', '@smoke'] }, async ({ page }) => {
    await new DashboardPage(page).open();
    await new NavigationPage(page).verifyMenuItemsVisible(['Admin', 'PIM']);
  });

  test('ESS can access self-service navigation but not administrative menus', { tag: '@e2e' }, async ({ browser, browserName }) => {
    test.skip(
      !ESS_TEST_CONFIG,
      'Configure ORANGEHRM_ESS_USERNAME and ORANGEHRM_ESS_PASSWORD to enable ESS role tests.'
    );

    const context = await browser.newContext({
      baseURL: ENVIRONMENT_CONFIG.orangeHrmBaseUrl,
      storageState: path.resolve(__dirname, `../.auth/${browserName}/ess.json`)
    });

    try {
      const page = await context.newPage();
      await new DashboardPage(page).open();

      const navigation = new NavigationPage(page);
      await navigation.verifyMenuItemsVisible(['My Info']);
      await navigation.verifyMenuItemsHidden(['Admin', 'PIM']);
    } finally {
      await context.close();
    }
  });
});
