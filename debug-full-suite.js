const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const recordDir = path.resolve(__dirname, 'test-results', 'combined-suite-debug');
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
    const baseUrl = 'https://opensource-demo.orangehrmlive.com';

    async function login(username, password) {
      console.log('--- login attempt', username, password);
      await page.goto(`${baseUrl}/web/index.php/auth/login`);
      await page.locator('input[name="username"]').waitFor({ state: 'visible', timeout: 30000 });
      await page.locator('input[name="password"]').waitFor({ state: 'visible', timeout: 30000 });
      await page.locator('input[name="username"]').fill(username, { timeout: 20000 });
      await page.locator('input[name="password"]').fill(password, { timeout: 20000 });
      await page.getByRole('button', { name: 'Login' }).click();
      console.log('clicked login');
    }

    async function waitForText(text, timeout = 15000) {
      await page.getByText(text, { exact: false }).first().waitFor({ state: 'visible', timeout });
    }

    console.log('1. Successful login');
    await login('Admin', 'admin123');
    await page.waitForURL(/\/dashboard/i, { timeout: 20000 });
    console.log('Dashboard loaded');
    await page.getByRole('heading', { name: 'Dashboard' }).waitFor({ state: 'visible', timeout: 15000 });

    console.log('2. Invalid credentials');
    await login('WrongUser', 'WrongPassword');
    await waitForText('Invalid credentials');
    console.log('invalid after login');

    console.log('3. Empty username');
    await login('', 'admin123');
    await waitForText('Required');
    console.log('required after empty username');

    console.log('4. Empty password');
    await login('Admin', '');
    await waitForText('Required');
    console.log('required after empty password');

    console.log('5. Both empty');
    await login('', '');
    await waitForText('Required');
    console.log('required after both empty');

    console.log('6. Invalid username');
    await login('InvalidUser', 'admin123');
    await waitForText('Invalid credentials');
    console.log('invalid username done');

    console.log('7. Invalid password');
    await login('Admin', 'WrongPassword');
    await waitForText('Invalid credentials');
    console.log('invalid password done');

    console.log('8. Failed login remains on login page');
    await login('WrongUser', 'WrongPassword');
    await page.locator('input[name="username"]').waitFor({ state: 'visible', timeout: 15000 });
    await page.locator('input[name="password"]').waitFor({ state: 'visible', timeout: 15000 });
    console.log('after failed login page remains');

    console.log('9. Password field type check');
    await page.goto(`${baseUrl}/web/index.php/auth/login`);
    const passwordType = await page.locator('input[name="password"]').getAttribute('type');
    if (passwordType !== 'password') { throw new Error(`Password field type mismatch: ${passwordType}`); }
    console.log('password type ok', passwordType);

    console.log('10. Employee lifecycle flow');
    await login('Admin', 'admin123');
    await page.waitForURL(/\/dashboard/i, { timeout: 20000 });
    await page.goto(`${baseUrl}/web/index.php/pim/addEmployee`);
    console.log('Add employee page');

    const employeeId = `EMP${Date.now().toString().slice(-6)}`;
    const firstName = `Test${Date.now()}`;
    const lastName = 'Employee';

    await page.getByPlaceholder('First Name').fill(firstName);
    await page.getByPlaceholder('Last Name').fill(lastName);
    await page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input').first().fill(employeeId);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForURL(/\/pim\/viewPersonalDetails\//, { timeout: 20000 });

    await page.getByRole('tab', { name: 'Job' }).click();
    await page.locator('.oxd-input-group').filter({ hasText: 'Job Title' }).locator('.oxd-select-text').first().click();
    await page.getByText('QA Engineer', { exact: true }).click();
    await page.locator('.oxd-input-group').filter({ hasText: 'Employment Status' }).locator('.oxd-select-text').first().click();
    await page.getByText('Full-Time Permanent', { exact: true }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Successfully Updated', { exact: false }).waitFor({ state: 'visible', timeout: 15000 });

    await page.goto(`${baseUrl}/web/index.php/pim/viewEmployeeList`);
    await page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input').first().fill(employeeId);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.locator('.oxd-table-row').filter({ hasText: employeeId }).first().waitFor({ state: 'visible', timeout: 15000 });
    await page.locator('.oxd-table-row').filter({ hasText: employeeId }).first().locator('button').last().click();
    await page.getByRole('button', { name: 'Yes, Delete' }).click();
    await page.getByText('Successfully Deleted', { exact: false }).waitFor({ state: 'visible', timeout: 15000 });
    await page.goto(`${baseUrl}/web/index.php/auth/logout`);
    await page.waitForURL(/\/auth\/login/i, { timeout: 20000 });

    const videoPath = await page.video().path();
    console.log('Combined video saved at:', videoPath);
    console.log('All scenarios executed in a single recorded run.');
  } finally {
    await context.close();
    await browser.close();
  }
})();
