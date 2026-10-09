const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  await page.evaluate(() => window.scrollTo(0, 2520));
  await page.waitForTimeout(400);

  const res = await page.evaluate(() => {
    const el = document.querySelector('h1').parentElement;
    return {
      p: window.__p.get(),
      styleAttr: el.getAttribute('style'),
      styleOpacity: el.style.opacity,
      computedOpacity: window.getComputedStyle(el).opacity,
    };
  });
  console.log('At scroll 2520:', res);
  await browser.close();
})();
