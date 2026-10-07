// CV sayfalarından PDF üretir (A4, yazdırma düzeni). Çıktılar repoya statik dosya olarak girer.
// Önce site çalışıyor olmalı: `npm run dev` ya da `npm run preview`.
// Kullanım: npm run build:cv   (çıktı: public/cv/baran-berkay-bostan-cv-{tr,en}.pdf)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.SHOTS_BASE_URL ?? 'http://localhost:4321';
const OUT_DIR = path.join('public', 'cv');
const PAGES = [
  { route: '/cv/', file: 'baran-berkay-bostan-cv-tr.pdf' },
  { route: '/en/cv/', file: 'baran-berkay-bostan-cv-en.pdf' },
];

mkdirSync(OUT_DIR, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge' });
let failed = false;
try {
  const page = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage();
  for (const { route, file } of PAGES) {
    await page.goto(BASE_URL + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: 'print' });
    const target = path.join(OUT_DIR, file);
    const buffer = await page.pdf({ path: target, format: 'A4', printBackground: false, preferCSSPageSize: true });
    // Sayfa sayısı: PDF içindeki sayfa nesneleri sayılır.
    const pageCount = (buffer.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    const onePage = pageCount === 1;
    failed ||= !onePage;
    console.log(`${target}  ${(buffer.length / 1024).toFixed(0)} KB, ${pageCount} sayfa${onePage ? '' : '  (tek sayfa olmalı)'}`);
  }
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
