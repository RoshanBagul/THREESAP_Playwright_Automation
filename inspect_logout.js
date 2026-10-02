const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/\/dashboard/i);
  const candidates = [
    '.oxd-userdropdown-tab',
    '.oxd-userdropdown-name',
    '[class*="userdropdown"]',
    'button',
    'a',
    '[role="button"]',
    '[role="menuitem"]',
    'span'
  ];

  for (const sel of candidates) {
    const count = await page.locator(sel).count();
    console.log('selector', sel, 'count=', count);
    for (let i = 0; i < Math.min(count, 10); i++) {
      const el = page.locator(sel).nth(i);
      const text = await el.textContent().catch(() => '');
      const role = await el.getAttribute('role').catch(() => '');
      const aria = await el.getAttribute('aria-label').catch(() => '');
      const className = await el.getAttribute('class').catch(() => '');
      if (text || role || aria) {
        console.log({ i, text: (text || '').trim(), role, aria, className: (className || '').slice(0, 120) });
      }
    }
  }
  await browser.close();
})();
