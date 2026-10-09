const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const initialStyle = await page.evaluate(() => {
    const el = document.querySelector('h1').parentElement;
    return el.getAttribute('style');
  });
  console.log('Initial style:', initialStyle);

  await page.evaluate(() => window.scrollTo(0, 2048));
  await page.waitForTimeout(500);

  const afterStyle = await page.evaluate(() => {
    const el = document.querySelector('h1').parentElement;
    return {
      styleAttr: el.getAttribute('style'),
      inlineOpacity: el.style.opacity,
      computedOpacity: window.getComputedStyle(el).opacity,
    };
  });
  console.log('After style:', afterStyle);

  await browser.close();
})();
