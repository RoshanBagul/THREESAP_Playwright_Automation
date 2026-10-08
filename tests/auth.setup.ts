import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { test as setup } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { ESS_TEST_CONFIG, TEST_CONFIG } from '../utils/constants';

setup('authenticate', async ({ page, browserName }) => {
  const adminAuthFile = path.resolve(__dirname, `../.auth/${browserName}/admin.json`);
  await mkdir(path.dirname(adminAuthFile), { recursive: true });

  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(TEST_CONFIG.username, TEST_CONFIG.password);
  await new DashboardPage(page).verifyDashboard();
  await page.context().storageState({ path: adminAuthFile });
});

setup('authenticate ESS user', async ({ page, browserName }) => {
  if (!ESS_TEST_CONFIG) {
    setup.skip(true, 'Configure ORANGEHRM_ESS_USERNAME and ORANGEHRM_ESS_PASSWORD to enable ESS role tests.');
    return;
  }

  const essAuthFile = path.resolve(__dirname, `../.auth/${browserName}/ess.json`);
  await mkdir(path.dirname(essAuthFile), { recursive: true });

  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(ESS_TEST_CONFIG.username, ESS_TEST_CONFIG.password);
  await new DashboardPage(page).verifyDashboard();
  await page.context().storageState({ path: essAuthFile });
});
