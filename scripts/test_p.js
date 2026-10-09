const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  await page.evaluate(() => window.scrollTo(0, 2520));
  await page.waitForTimeout(400);

  const allOpacities = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div'));
    return divs
      .filter(d => (d.getAttribute('style') || '').includes('opacity'))
      .map(d => ({
        tag: d.className,
        style: d.getAttribute('style'),
      }));
  });

  console.log(JSON.stringify(allOpacities, null, 2));
  await browser.close();
})();
