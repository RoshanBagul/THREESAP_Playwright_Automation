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
      console.log('Going to login page');
      await page.goto(`${baseUrl}/web/index.php/auth/login`);
      console.log('after goto url', page.url());
      console.log('username visible count', await page.locator('input[name="username"]').count());
      await page.locator('input[name="username"]').waitFor({ state: 'visible', timeout: 30000 });
      await page.locator('input[name="password"]').waitFor({ state: 'visible', timeout: 30000 });
      await page.locator('input[name="username"]').fill(username, { timeout: 20000 });
      await page.locator('input[name="password"]').fill(password, { timeout: 20000 });
      await page.getByRole('button', { name: 'Login' }).click();
    }

    await login('Admin', 'admin123');
    console.log('logged in');
  } catch (err) {
    console.log('ERROR', err.message);
    console.log(err.stack);
  } finally {
    await context.close();
    await browser.close();
  }
})();
