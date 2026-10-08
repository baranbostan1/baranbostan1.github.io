// Geliştirme yardımcısı: tasarım incelemesi için geçerli ekran görüntüleri alır.
// Tam sayfa görüntüsü tek başına yanıltır: tembel yüklenen görseller kaydırılmadan yüklenmez ve sabit katmanlar
// (film greni) yalnızca ilk ekrana çizilir. Bu yüzden sayfa önce baştan sona kaydırılır, bütün görsellerin
// yüklendiği doğrulanır, sonra her ekran yüksekliği için ayrı bir görüntü alınır.
// Kullanım: SHOTS_BASE_URL=http://localhost:4322 node scripts/capture-review.mjs <çıktı-klasörü>
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.SHOTS_BASE_URL ?? 'http://localhost:4322';
const outDir = process.argv[2];
if (!outDir) {
  console.error('Kullanım: node scripts/capture-review.mjs <çıktı-klasörü>');
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 360, height: 740, hasTouch: true, isMobile: true },
];
const PAGES = [
  { slug: 'home', route: '/' },
  { slug: 'en-home', route: '/en/' },
  { slug: 'qr-menu', route: '/projeler/qr-menu/' },
  { slug: 'lobi-ekrani', route: '/projeler/lobi-ekrani/' },
  { slug: 'acenta-takibi', route: '/projeler/acenta-takibi/' },
  { slug: 'destek-talepleri', route: '/projeler/destek-talepleri/' },
  { slug: 'cv', route: '/cv/' },
];
const SETTLE_MS = 350;

async function scrollThrough(page, viewportHeight) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += Math.round(viewportHeight * 0.8)) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(SETTLE_MS);
  }
  // Yalnızca görünür görseller beklenir: hareket kapalıyken gizli duran "ilk kare" görselleri bilerek hiç yüklenmez.
  const pending = () => [...document.images].filter((image) => image.offsetParent !== null && !(image.complete && image.naturalWidth > 0)).length;
  await page.waitForFunction(`(${pending})() === 0`, null, { timeout: 15000 }).catch(() => {});
  const broken = await page.evaluate(pending);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(SETTLE_MS);
  return { height, broken };
}

const browser = await chromium.launch({ channel: 'msedge', args: ['--autoplay-policy=no-user-gesture-required'] });
try {
  for (const viewport of VIEWPORTS) {
    // Hareket azaltma açık: sahneler son karelerinde durur, giriş animasyonları oynamaz.
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, hasTouch: Boolean(viewport.hasTouch), isMobile: Boolean(viewport.isMobile), deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const { slug, route } of PAGES) {
      await page.goto(BASE_URL + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const { height, broken } = await scrollThrough(page, viewport.height);
      const slices = Math.ceil(height / viewport.height);
      for (let index = 0; index < slices; index += 1) {
        await page.evaluate((top) => window.scrollTo(0, top), index * viewport.height);
        await page.waitForTimeout(SETTLE_MS);
        await page.screenshot({ path: path.join(outDir, `${slug}-${viewport.name}-${String(index + 1).padStart(2, '0')}.png`) });
      }
      console.log(`${slug}-${viewport.name}: ${slices} ekran, yüklenmeyen görsel ${broken}`);
    }
    await context.close();
  }

  // Hareketli durumlar (hareket açık): hero kaydırma başı ve sonu, bir proje sahnesi dönüşümün ortasında.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: 'load' });
  await page.waitForFunction(() => document.querySelector('[data-hero-track] video')?.hasAttribute('data-ready'), null, { timeout: 20000 });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: path.join(outDir, 'state-hero-scroll-start.png') });
  const scrollable = await page.evaluate(() => document.querySelector('[data-hero-track]').offsetHeight - window.innerHeight);
  await page.evaluate((top) => window.scrollTo(0, top), Math.round(scrollable * 0.5));
  await page.waitForTimeout(1800);
  await page.screenshot({ path: path.join(outDir, 'state-hero-scroll-middle.png') });
  await page.evaluate((top) => window.scrollTo(0, top), scrollable);
  await page.waitForTimeout(2200);
  await page.screenshot({ path: path.join(outDir, 'state-hero-scroll-end.png') });
  // İkinci proje sahnesi (lobi): görünüme girince oynar; ortasında yakalanır, altında sonraki bölüm görünür.
  await page.evaluate(() => {
    const section = document.querySelectorAll('.project')[1];
    window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY - 60);
  });
  await page.waitForFunction(() => (document.querySelectorAll('.project video')[1]?.currentTime ?? 0) > 2.2, null, { timeout: 20000 }).catch(() => {});
  await page.screenshot({ path: path.join(outDir, 'state-project-scene-mid-transition.png') });
  await context.close();
} finally {
  await browser.close();
}
console.log('tamam');
