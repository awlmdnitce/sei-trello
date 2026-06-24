const puppeteer = require('puppeteer');
const path = require('path');

const files = [
  { svg: 'icon.svg', png: 'icon-128.png', w: 128, h: 128 },
  { svg: 'banner-440x280.svg', png: 'banner-440x280.png', w: 440, h: 280 },
];

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  for (const f of files) {
    const svgPath = path.resolve(__dirname, f.svg);
    const outPath = path.resolve(__dirname, f.png);
    const page = await browser.newPage();
    await page.setViewport({ width: f.w, height: f.h, deviceScaleFactor: 1 });
    await page.goto('file:///' + svgPath.replace(/\\/g, '/'));
    await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: f.w, height: f.h } });
    await page.close();
    console.log('Gerado:', outPath);
  }
  await browser.close();
})();
