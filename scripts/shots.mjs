// Geliştirme yardımcısı: verilen sayfaların masaüstü ve mobil ekran görüntülerini alır.
// Kullanım: node scripts/shots.mjs <çıktı-klasörü> <yol> [yol...]
import { chromium } from 'playwright';
import path from 'node:path';

const BASE_URL = process.env.SHOTS_BASE_URL ?? 'http://localhost:4321';
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 360, height: 740 },
];

const [outDir, ...routes] = process.argv.slice(2);
if (!outDir || routes.length === 0) {
  console.error('Kullanım: node scripts/shots.mjs <çıktı-klasörü> <yol> [yol...]');
  process.exit(1);
}

const slug = (route) => route.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home';
const browser = await chromium.launch({ channel: 'msedge' });
try {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const route of routes) {
      await page.goto(BASE_URL + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const file = path.join(outDir, `${slug(route)}-${viewport.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      console.log(`${file}${overflow ? '  (YATAY TAŞMA)' : ''}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
