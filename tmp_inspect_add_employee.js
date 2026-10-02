const { chromium } = require('playwright');
(async() => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/\/dashboard/i);
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee');
  await page.waitForTimeout(2000);

  console.log('URL=', page.url());
  console.log('heading=', await page.locator('h6, h1, h2').allTextContents());
  console.log('labels=', JSON.stringify(await page.locator('label').allTextContents()));
  console.log('inputs=', JSON.stringify(await page.locator('input').evaluateAll((els) => els.map(el => ({
    type: el.type,
    placeholder: el.placeholder,
    name: el.name,
    id: el.id,
    ariaLabel: el.getAttribute('aria-label'),
    value: el.value
  }))), null, 2));

  await browser.close();
})();
