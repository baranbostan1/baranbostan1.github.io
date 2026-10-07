// Geliştirme yardımcısı: QR menü demosunu gerçek tarayıcıda, fare ve klavyeyle dener.
// Kullanım: node scripts/verify-qr-menu.mjs [ekran-görüntüsü-klasörü]
import { chromium } from 'playwright';
import path from 'node:path';

const BASE_URL = process.env.SHOTS_BASE_URL ?? 'http://localhost:4321';
const shotDir = process.argv[2];
const results = [];
const check = (name, pass, detail = '') => results.push({ name, pass, detail });
const names = (page) => page.locator('.qr-item-name').allTextContents();
const sections = (page) => page.locator('.qr-section-title').allTextContents();

const browser = await chromium.launch({ channel: 'msedge' });
try {
  for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'tablet', width: 768, height: 1024 }, { name: 'mobile', width: 360, height: 740 }]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
    await page.goto(BASE_URL + '/projeler/qr-menu/', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-qr-menu][data-ready]');
    const tag = (text) => `[${viewport.name}] ${text}`;

    await page.getByRole('button', { name: 'Gündüz', exact: true }).click();
    const day = await sections(page);
    check(tag('gündüz: kahvaltı var, akşam sofrası yok'), day.includes('Kahvaltı') && !day.includes('Akşam Sofrası'), day.join(','));
    check(tag('gündüz: akşam ürünü (Kalamar) yok'), !(await names(page)).includes('Kalamar Tava'));

    await page.getByRole('button', { name: 'Akşam', exact: true }).click();
    const evening = await sections(page);
    check(tag('akşam: akşam sofrası var, kahvaltı yok'), evening.includes('Akşam Sofrası') && !evening.includes('Kahvaltı'), evening.join(','));
    check(tag('akşam: gündüz ürünü (Mantı) yok'), !(await names(page)).includes('Ev Mantısı'));

    await page.getByRole('searchbox').fill('IZGARA');
    const found = await names(page);
    check(tag('arama büyük harfle: ızgara ürünleri'), found.length === 2 && found.includes('Izgara Köfte') && found.includes('Izgara Levrek'), found.join(','));
    const status = await page.locator('[data-menu-status]').textContent();
    check(tag('sonuç sayısı duyuruluyor'), status === '2 ürün gösteriliyor', status ?? '');

    await page.getByRole('searchbox').fill('pizza');
    check(tag('eşleşme yoksa boş durum'), await page.getByText('Aramanızla eşleşen ürün yok').isVisible());
    await page.getByRole('button', { name: 'Aramayı temizle' }).click();
    check(tag('temizle: liste geri gelir'), (await names(page)).length > 10);

    await page.getByRole('button', { name: 'Tatlılar', exact: true }).click();
    const sweets = await sections(page);
    check(tag('kategori: yalnızca tatlılar'), sweets.length === 1 && sweets[0] === 'Tatlılar', sweets.join(','));

    await page.getByRole('button', { name: 'Akşam Sofrası', exact: true }).click();
    await page.getByRole('button', { name: 'Gündüz', exact: true }).click();
    const pressed = await page.locator('.qr-chip[aria-pressed="true"]').textContent();
    check(tag('dönem değişince kaybolan kategori "Tümü"ne döner'), pressed === 'Tümü', pressed ?? '');

    // Yalnızca klavye: odakla, Enter ile dönemi değiştir.
    await page.getByRole('button', { name: 'Akşam', exact: true }).focus();
    await page.keyboard.press('Enter');
    check(tag('klavye: Enter dönemi değiştirir'), (await page.getByRole('button', { name: 'Akşam', exact: true }).getAttribute('aria-pressed')) === 'true');
    await page.keyboard.press('Tab');
    await page.keyboard.type('çay');
    check(tag('klavye: Tab arama alanına geçer ve yazılır'), (await names(page)).join(',') === 'Çay', (await names(page)).join(','));

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    check(tag('yatay taşma yok'), !overflow);
    check(tag('konsol hatası yok'), errors.length === 0, errors.join(' | '));

    const alt = await page.locator('header a[hreflang]').getAttribute('href');
    check(tag('dil değiştirici karşı sayfaya gider'), alt === '/en/projects/qr-menu/', alt ?? '');

    if (shotDir) {
      await page.getByRole('searchbox').fill('');
      await page.locator('.qr-demo').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(shotDir, `qr-demo-${viewport.name}.png`), fullPage: true });
    }
    await context.close();
  }
} finally {
  await browser.close();
}

for (const result of results) console.log(`${result.pass ? 'GEÇTİ ' : 'KALDI '} ${result.name}${result.detail ? `  (${result.detail})` : ''}`);
const failed = results.filter((result) => !result.pass).length;
console.log(`
${results.length - failed}/${results.length} geçti`);
process.exit(failed === 0 ? 0 : 1);
