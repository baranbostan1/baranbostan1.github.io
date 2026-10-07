// Paylaşım görsellerini üretir (LinkedIn vb. önizleme kartı): 1200×630, iki dilde.
// Hero'nun son karesi + koyu katman + ad + hero cümlesi, sitenin kendi fontlarıyla.
// Kullanım: npm run build:og   (çıktı: public/og/og-tr.jpg, public/og/og-en.jpg)
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const SIZE = { width: 1200, height: 630 };
const JPEG_QUALITY = 86;
const MAX_BYTES = 300 * 1024;
const root = process.cwd();
const dataUrl = (relative, mime) => `data:${mime};base64,${readFileSync(path.join(root, relative)).toString('base64')}`;

const NAME = 'Baran Berkay Bostan';
const LINES = {
  tr: { title: 'İşletmelerin gündelik sorunlarını, çalışan araçlara dönüştürüyorum.', sub: 'Gerçek bir işletme için üç araç · demolarıyla' },
  en: { title: 'I turn the everyday problems of a business into working tools.', sub: 'Three tools for a real business · with live demos' },
};

const FONTS = {
  display: 'node_modules/@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2',
  displayExt: 'node_modules/@fontsource-variable/fraunces/files/fraunces-latin-ext-opsz-normal.woff2',
  sans: 'node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2',
  sansExt: 'node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-ext-wght-normal.woff2',
};

const html = ({ title, sub }, lang) => `<!doctype html>
<html lang="${lang}">
<meta charset="utf-8">
<style>
  @font-face { font-family: D; src: url('${dataUrl(FONTS.displayExt, 'font/woff2')}'); unicode-range: U+0100-02BA, U+1E00-1E9F, U+20A0-20C0; }
  @font-face { font-family: D; src: url('${dataUrl(FONTS.display, 'font/woff2')}'); unicode-range: U+0000-00FF, U+0131, U+2000-206F; }
  @font-face { font-family: S; src: url('${dataUrl(FONTS.sansExt, 'font/woff2')}'); unicode-range: U+0100-02BA, U+1E00-1E9F, U+20A0-20C0; }
  @font-face { font-family: S; src: url('${dataUrl(FONTS.sans, 'font/woff2')}'); unicode-range: U+0000-00FF, U+0131, U+2000-206F; }
  * { margin: 0; box-sizing: border-box; }
  body { width: ${SIZE.width}px; height: ${SIZE.height}px; position: relative; overflow: hidden; background: #0b0e14; color: #f1ece4; font-family: S, sans-serif; }
  img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 70% 40%; }
  .scrim { position: absolute; inset: 0; background: linear-gradient(to right, rgba(11,14,20,.94) 0%, rgba(11,14,20,.82) 48%, rgba(11,14,20,.25) 100%), linear-gradient(to top, rgba(11,14,20,.85), transparent 55%); }
  .body { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 64px 72px; }
  .name { font-size: 30px; font-weight: 600; }
  h1 { max-width: 15ch; font-family: D, serif; font-weight: 400; font-size: 70px; line-height: 1.06; letter-spacing: -0.015em; font-variation-settings: 'opsz' 144; }
  .sub { margin-top: 28px; font-size: 28px; color: #e39a4b; }
</style>
<img src="${dataUrl('public/media/hero-poster.webp', 'image/webp')}" alt="">
<div class="scrim"></div>
<div class="body">
  <p class="name">${NAME}</p>
  <div><h1>${title}</h1><p class="sub">${sub}</p></div>
</div>
</html>`;

const browser = await chromium.launch({ channel: 'msedge' });
let failed = false;
try {
  const page = await (await browser.newContext({ viewport: SIZE, deviceScaleFactor: 1 })).newPage();
  for (const [lang, lines] of Object.entries(LINES)) {
    await page.setContent(html(lines, lang), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const target = path.join('public', 'og', `og-${lang}.jpg`);
    const buffer = await page.screenshot({ path: target, type: 'jpeg', quality: JPEG_QUALITY });
    const tooBig = buffer.length > MAX_BYTES;
    failed ||= tooBig;
    console.log(`${target}  ${(buffer.length / 1024).toFixed(0)} KB${tooBig ? '  (300 KB sınırını aşıyor)' : ''}`);
  }
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
