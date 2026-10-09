const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const allVars = await page.evaluate(() => {
    const wins = Object.keys(window).filter(k => k.startsWith('__'));
    return wins.map(k => ({
      name: k,
      val: window[k] && typeof window[k].get === 'function' ? window[k].get() : window[k],
      events: window[k] && window[k].events ? Object.keys(window[k].events) : null,
    }));
  });
  console.log(allVars);
  await browser.close();
})();
