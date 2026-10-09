const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const res = await page.evaluate(() => {
    const el = document.querySelector('h1').parentElement;
    window.__headlineOpacity.set(0.123);
    return {
      styleAfterSet: el.getAttribute('style'),
      opacityValue: window.__headlineOpacity.get(),
    };
  });
  console.log('Result:', res);
  await browser.close();
})();
