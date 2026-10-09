const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const res = await page.evaluate(() => {
    const h1Motion = document.querySelector('h1').parentElement;
    const fiber = h1Motion[Object.keys(h1Motion).find(k => k.startsWith('__reactFiber'))];
    // Find visualElement in fiber or props
    let curr = fiber;
    let visualElement = null;
    while (curr) {
      if (curr.memoizedState && curr.memoizedState.visualElement) {
        visualElement = curr.memoizedState.visualElement;
        break;
      }
      if (curr.stateNode && curr.stateNode.visualElement) {
        visualElement = curr.stateNode.visualElement;
        break;
      }
      curr = curr.return;
    }
    return {
      foundVE: !!visualElement,
      veValues: visualElement ? Array.from(visualElement.values.keys()) : null,
    };
  });
  console.log('VisualElement info:', res);
  await browser.close();
})();
