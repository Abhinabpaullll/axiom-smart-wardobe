const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const outDir = 'C:\\Users\\abhin\\.gemini\\antigravity-ide\\brain\\3981e0f9-1864-4c54-8a5b-e44999ab27f3\\screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const progressLevels = [0, 5, 15, 35, 50, 65, 80, 95, 100];

(async () => {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  for (const vp of viewports) {
    console.log(`\n=== Capturing ${vp.name} (${vp.width}x${vp.height}) ===`);
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Get max scroll for hero (hero height - window innerHeight)
    const { totalHeroScroll, heroHeight } = await page.evaluate(() => {
      const hero = document.querySelector('section');
      const hHeight = hero ? hero.offsetHeight : window.innerHeight * 4.5;
      return {
        totalHeroScroll: hHeight - window.innerHeight,
        heroHeight: hHeight,
      };
    });

    console.log(`Hero height: ${heroHeight}px, total scroll range: ${totalHeroScroll}px`);

    for (const prog of progressLevels) {
      const scrollY = Math.round((prog / 100) * totalHeroScroll);
      await page.evaluate((y) => {
        window.scrollTo({ top: y, behavior: 'instant' });
      }, scrollY);

      // Wait for layout/paint
      await page.waitForTimeout(400);

      const filename = `hero_${vp.name}_p${prog}.png`;
      const filePath = path.join(outDir, filename);
      await page.screenshot({ path: filePath });
      console.log(`Saved ${filename} at scrollY: ${scrollY}px (progress: ${prog}%)`);
    }

    await page.close();
  }

  await browser.close();
  console.log('\nAll verification screenshots captured successfully!');
})().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
