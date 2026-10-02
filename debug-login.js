const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.waitForTimeout(5000);

  console.log('url', page.url());
  console.log('input count', await page.locator('input').count());
  console.log('name username count', await page.locator('input[name="username"]').count());
  console.log('placeholder username count', await page.locator('input[placeholder="Username"]').count());
  console.log('all input attrs', await page.locator('input').evaluateAll((els) =>
    els.map((el) => ({
      name: el.getAttribute('name'),
      placeholder: el.getAttribute('placeholder'),
      type: el.getAttribute('type')
    }))
  ));

  await browser.close();
})();
