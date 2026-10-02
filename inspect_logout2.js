const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/\/dashboard/i);
  const body = await page.locator('body').textContent();
  console.log(body.slice(0, 4000));
  console.log('contains Admin?', body.includes('Admin'));
  console.log('contains Logout?', body.includes('Logout'));
  await browser.close();
})();
