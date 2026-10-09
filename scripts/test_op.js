const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Test what properties Framer Motion connects
  const res = await page.evaluate(() => {
    // Let's check how Framer Motion connects motion values
    return {
      version: window.__p ? 'p exists' : 'no p',
    };
  });
  console.log(res);
  await browser.close();
})();
