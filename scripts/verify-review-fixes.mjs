// Geliştirme yardımcısı: kod incelemesinde bulunan hataların düzeldiğini gerçek tarayıcıda doğrular.
// Derlenmiş siteye karşı çalıştırılır: `npm run build && npx astro preview --port 4322`
// Kullanım: SHOTS_BASE_URL=http://localhost:4322 node scripts/verify-review-fixes.mjs [ekran-görüntüsü-klasörü]
import { chromium } from 'playwright';
import path from 'node:path';

const BASE_URL = process.env.SHOTS_BASE_URL ?? 'http://localhost:4322';
const shotDir = process.argv[2];
const results = [];
const check = (name, pass, detail = '') => results.push({ name, pass, detail });
const STALL_WAIT_MS = 12_500;
// Sayfa içi tam ekranda çıkış düğmesi için sahnenin üstünde ayrılan şerit (panel.ts ile aynı değer).
const EXIT_BAR_PX = 48;

const browser = await chromium.launch({ channel: 'msedge', args: ['--autoplay-policy=no-user-gesture-required'] });
try {
  // 1. Derlenmiş ana sayfada beş sahne de gerçek görüntüsüyle çıkıyor.
  {
    const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'load' });
    const counts = await page.evaluate(() => ({
      videos: document.querySelectorAll('.scene-media video').length,
      placeholders: document.querySelectorAll('.scene-placeholder').length,
      posterLoaded: (document.querySelector('.scene-end img')?.naturalWidth ?? 0) > 0,
    }));
    check('[derleme] ana sayfada 5 video, yer tutucu yok', counts.videos === 5 && counts.placeholders === 0, JSON.stringify(counts));
    check('[derleme] hero sabit karesi yüklendi', counts.posterLoaded);
    await page.context().close();
  }

  // 2. Video takılırsa (istek hiç bitmezse) sahne süre dolunca son karesine döner.
  {
    const page = await (await browser.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true })).newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/*.mp4', () => {}); // istek yanıtsız bırakılır
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    const early = await page.evaluate(() => getComputedStyle(document.querySelector('[data-hero-track] .scene-start')).display);
    await page.waitForTimeout(STALL_WAIT_MS);
    const late = await page.evaluate(() => ({
      failed: document.querySelector('[data-hero-track] .scene-media').hasAttribute('data-failed'),
      startShown: getComputedStyle(document.querySelector('[data-hero-track] .scene-start')).display !== 'none',
      heading: document.querySelector('h1').getBoundingClientRect().height > 0,
    }));
    check('[takılan video] başta ilk kare görünür', early !== 'none', early);
    check('[takılan video] süre dolunca sahne son karesine döner', late.failed && !late.startShown, JSON.stringify(late));
    check('[takılan video] başlık görünür, yakalanmamış hata yok', late.heading && errors.length === 0, errors.join(' | '));
    await page.context().close();
  }

  // 3. Türkçe klavyesi olmayan ziyaretçi: ASCII büyük harfle yazılan ad yeni acenta açmaz (İngilizce sayfa).
  {
    const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })).newPage();
    await page.goto(`${BASE_URL}/en/projects/agency-ledger/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-agency-demo][data-ready]');
    const before = await page.locator('[data-balances] tr').count();
    for (const [agency, no] of [['MAVI ROTA TURIZM', 'T-1'], ['ZEYTIN DALI TRAVEL', 'T-2']]) {
      await page.getByLabel('Agency', { exact: true }).fill(agency);
      await page.getByLabel('Invoice no.').fill(no);
      await page.getByLabel('Amount (₺)').fill('100');
      await page.getByRole('button', { name: 'Add invoice' }).click();
    }
    const after = await page.locator('[data-balances] tr').count();
    check('[acenta adı] ASCII büyük harf yeni satır açmaz', before === 5 && after === 5, `${before} → ${after}`);
    await page.evaluate(() => localStorage.clear());
    await page.context().close();
  }

  // 4. QR menü: çip klavyeyle seçilince odak kaybolmaz.
  {
    const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })).newPage();
    await page.goto(`${BASE_URL}/projeler/qr-menu/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-qr-menu][data-ready]');
    await page.getByRole('button', { name: 'Tatlılar', exact: true }).focus();
    await page.keyboard.press('Enter');
    const focused = await page.evaluate(() => `${document.activeElement?.tagName}:${document.activeElement?.textContent}`);
    check('[qr menü] Enter sonrası odak seçilen çipte', focused === 'BUTTON:Tatlılar', focused);
    await page.context().close();
  }

  // 5. Lobi: tam ekran API'si yokken (iPhone) düğme sayfa içi tam ekrana geçer, panel okunur boyuta gelir.
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true });
    await context.addInitScript(() => {
      delete Element.prototype.requestFullscreen;
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/projeler/lobi-ekrani/`, { waitUntil: 'load' });
    await page.waitForSelector('[data-lobby-demo][data-ready]');
    // Oda satırının ekrandaki yazı boyutu: sahnedeki 38px × sahnenin ölçeği (döndürmeden etkilenmeyen yerleşim ölçülerinden).
    const sizeOf = () => page.evaluate(() => { const frame = document.querySelector('[data-frame]'); return Math.min(frame.clientWidth / 1920, frame.clientHeight / 1080) * 38; });
    const before = await sizeOf();
    const button = page.getByRole('button', { name: 'Tam ekran', exact: true });
    check('[lobi mobil] tam ekran düğmesi API yokken de görünür', await button.isVisible());
    await button.click();
    const expanded = await page.evaluate(() => {
      const frame = document.querySelector('[data-frame]');
      const stage = document.querySelector('[data-stage]').getBoundingClientRect();
      return { expanded: frame.hasAttribute('data-expanded'), stageLong: Math.round(Math.max(stage.width, stage.height)), stageShort: Math.round(Math.min(stage.width, stage.height)), vw: innerWidth, vh: innerHeight };
    });
    const after = await sizeOf();
    check('[lobi mobil] çerçeve ekranı kaplar ve yan çevrilir', expanded.expanded && expanded.stageLong > expanded.vw && expanded.stageLong <= expanded.vh + 2 && Math.abs(expanded.stageShort - (expanded.vw - EXIT_BAR_PX)) <= 2, JSON.stringify(expanded));
    check('[lobi mobil] oda satırı yazısı okunur boyuta gelir (≥ 12px)', after >= 12, `${before.toFixed(1)}px → ${after.toFixed(1)}px`);
    if (shotDir) await page.screenshot({ path: path.join(shotDir, 'lobby-expanded-phone.png') });
    await page.getByRole('button', { name: 'Tam ekrandan çık' }).click();
    check('[lobi mobil] çıkış düğmesi görünümü kapatır', !(await page.evaluate(() => document.querySelector('[data-frame]').hasAttribute('data-expanded'))));
    await context.close();
  }
} finally {
  await browser.close();
}

for (const result of results) console.log(`${result.pass ? 'GEÇTİ ' : 'KALDI '} ${result.name}${result.detail ? `  (${result.detail})` : ''}`);
const failed = results.filter((result) => !result.pass).length;
console.log(`\n${results.length - failed}/${results.length} geçti`);
process.exit(failed === 0 ? 0 : 1);
