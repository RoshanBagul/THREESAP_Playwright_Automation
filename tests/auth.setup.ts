import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { test as setup } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { TEST_CONFIG } from '../utils/constants';

const authFile = path.resolve(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
  await mkdir(path.dirname(authFile), { recursive: true });

  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(TEST_CONFIG.username, TEST_CONFIG.password);
  await new DashboardPage(page).verifyDashboard();
  await page.context().storageState({ path: authFile });
});
