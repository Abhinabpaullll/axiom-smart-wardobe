const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  for (const y of [0, 1575, 2048, 2520]) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(400);
    const res = await page.evaluate(() => {
      const h1Parent = document.querySelector('h1')?.parentElement;
      return {
        scrollY: window.scrollY,
        styleAttr: h1Parent ? h1Parent.getAttribute('style') : null,
        computedOpacity: h1Parent ? window.getComputedStyle(h1Parent).opacity : null,
      };
    });
    console.log(y, res);
  }
  await browser.close();
})();
