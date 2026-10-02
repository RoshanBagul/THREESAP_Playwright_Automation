const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/\/dashboard/i);
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee');
  await page.getByPlaceholder('First Name').fill('Inspect');
  await page.getByPlaceholder('Last Name').fill('Employee');
  await page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input').first().fill('ABC12');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(5000);
  console.log('URL after save:', page.url());
  console.log('BODY TEXT:\n' + (await page.locator('body').textContent()));
  await browser.close();
})();
