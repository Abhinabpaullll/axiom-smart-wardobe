const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const info = await page.evaluate(() => {
    const el = document.querySelector('h1').parentElement;
    const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber'));
    const props = el[fiberKey]?.memoizedProps;
    return {
      opacityVal: props?.style?.opacity,
      opacityHasGet: typeof props?.style?.opacity?.get === 'function',
      yHasGet: typeof props?.style?.y?.get === 'function',
    };
  });
  console.log('Fiber style check:', info);
  await browser.close();
})();
