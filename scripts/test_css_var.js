const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Test if CSS variables get change listeners from Framer Motion
  const result = await page.evaluate(() => {
    // Let's check window.__headlineOpacity
    return {
      hOp: window.__headlineOpacity ? window.__headlineOpacity.get() : null,
      events: window.__headlineOpacity ? Object.keys(window.__headlineOpacity.events || {}) : null,
    };
  });
  console.log('Result:', result);
  await browser.close();
})();
