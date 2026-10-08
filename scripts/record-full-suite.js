const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const dotenv = require('dotenv');
const TIMEOUTS = require('../utils/timeouts.json');

const testEnvironment = process.env.TEST_ENV || 'local';
dotenv.config({
  path: [
    path.resolve(process.cwd(), `.env.${testEnvironment}`),
    path.resolve(process.cwd(), '.env')
  ]
});

const baseUrl = process.env.ORANGEHRM_BASE_URL;
const username = process.env.ORANGEHRM_USERNAME;
const password = process.env.ORANGEHRM_PASSWORD;
if (!baseUrl || !username || !password) {
  throw new Error('Set ORANGEHRM_BASE_URL, ORANGEHRM_USERNAME, and ORANGEHRM_PASSWORD before recording.');
}

(async () => {
  const recordDir = path.resolve(__dirname, '..', 'test-results', 'combined-suite');
  fs.mkdirSync(recordDir, { recursive: true });

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    recordVideo: {
      dir: recordDir,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();

  try {
    async function login(username, password) {
      const currentUrl = page.url();
      if (!currentUrl.includes('/auth/login')) {
        await page.goto(`${baseUrl}/web/index.php/auth/logout`);
        await page.waitForURL(/\/auth\/login/i, { timeout: TIMEOUTS.navigation });
      }

      await page.goto(`${baseUrl}/web/index.php/auth/login`);
      await page.locator('input[name="username"]').waitFor({ state: 'visible', timeout: TIMEOUTS.assertion });
      await page.locator('input[name="password"]').waitFor({ state: 'visible', timeout: TIMEOUTS.assertion });
      await page.locator('input[name="username"]').fill(username, { timeout: TIMEOUTS.action });
      await page.locator('input[name="password"]').fill(password, { timeout: TIMEOUTS.action });
      await page.getByRole('button', { name: 'Login' }).click();
    }

    async function waitForText(text, timeout = TIMEOUTS.assertion) {
      await page.getByText(text, { exact: false }).first().waitFor({ state: 'visible', timeout });
    }

    // 1. Successful login
    await login(username, password);
    await page.waitForURL(/\/dashboard/i, { timeout: TIMEOUTS.navigation });
    await page.getByRole('heading', { name: 'Dashboard' }).waitFor({ state: 'visible', timeout: TIMEOUTS.assertion });

    // 2. Invalid credentials
    await login('WrongUser', 'WrongPassword');
    await waitForText('Invalid credentials');

    // 3. Empty username
    await login('', password);
    await waitForText('Required');

    // 4. Empty password
    await login(username, '');
    await waitForText('Required');

    // 5. Both empty
    await login('', '');
    await waitForText('Required');

    // 6. Invalid username
    await login('InvalidUser', password);
    await waitForText('Invalid credentials');

    // 7. Invalid password
    await login(username, 'WrongPassword');
    await waitForText('Invalid credentials');

    // 8. Failed login remains on login page
    await login('WrongUser', 'WrongPassword');
    await page.locator('input[name="username"]').waitFor({ state: 'visible', timeout: TIMEOUTS.assertion });
    await page.locator('input[name="password"]').waitFor({ state: 'visible', timeout: TIMEOUTS.assertion });

    // 9. Password field type check
    await page.goto(`${baseUrl}/web/index.php/auth/login`);
    const passwordType = await page.locator('input[name="password"]').getAttribute('type');
    if (passwordType !== 'password') {
      throw new Error(`Password field type mismatch: ${passwordType}`);
    }

    // 10. Employee lifecycle flow
    await login(username, password);
    await page.waitForURL(/\/dashboard/i, { timeout: TIMEOUTS.navigation });
    await page.goto(`${baseUrl}/web/index.php/pim/addEmployee`);

    const employeeId = `EMP${Date.now().toString().slice(-6)}`;
    const firstName = `Test${Date.now()}`;
    const lastName = 'Employee';

    await page.getByPlaceholder('First Name').fill(firstName);
    await page.getByPlaceholder('Last Name').fill(lastName);
    await page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input').first().fill(employeeId);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForURL(/\/pim\/viewPersonalDetails\//, { timeout: TIMEOUTS.navigation });

    await page.getByRole('tab', { name: 'Job' }).click();
    await page.locator('.oxd-input-group').filter({ hasText: 'Job Title' }).locator('.oxd-select-text').first().click();
    await page.getByText('QA Engineer', { exact: true }).click();

    await page.locator('.oxd-input-group').filter({ hasText: 'Employment Status' }).locator('.oxd-select-text').first().click();
    await page.getByText('Full-Time Permanent', { exact: true }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Successfully Updated', { exact: false }).waitFor({ state: 'visible', timeout: TIMEOUTS.assertion });

    await page.goto(`${baseUrl}/web/index.php/pim/viewEmployeeList`);
    await page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input').first().fill(employeeId);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.locator('.oxd-table-row').filter({ hasText: employeeId }).first().waitFor({ state: 'visible', timeout: TIMEOUTS.assertion });

    await page.locator('.oxd-table-row').filter({ hasText: employeeId }).first().locator('button').last().click();
    await page.getByRole('button', { name: 'Yes, Delete' }).click();
    await page.getByText('Successfully Deleted', { exact: false }).waitFor({ state: 'visible', timeout: TIMEOUTS.assertion });

    await page.goto(`${baseUrl}/web/index.php/auth/logout`);
    await page.waitForURL(/\/auth\/login/i, { timeout: TIMEOUTS.navigation });

    const videoPath = path.join(recordDir, 'combined-suite-video.webm');
    await page.video().saveAs(videoPath);
    console.log('Combined video saved at:', videoPath);
    console.log('All scenarios executed in a single recorded run.');
  } finally {
    await context.close();
    await browser.close();
  }
})();
