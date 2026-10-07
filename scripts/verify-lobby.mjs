// Geliştirme yardımcısı: lobi paneli demosunu gerçek tarayıcıda ve canlı API'lerle dener.
// Kullanım: node scripts/verify-lobby.mjs [ekran-görüntüsü-klasörü]
import { chromium } from 'playwright';
import path from 'node:path';

const BASE_URL = process.env.SHOTS_BASE_URL ?? 'http://localhost:4321';
const PAGE = '/projeler/lobi-ekrani/';
const API_HOSTS = ['cdn.jsdelivr.net', 'currency-api.pages.dev', 'api.open-meteo.com'];
const shotDir = process.argv[2];
const results = [];
const check = (name, pass, detail = '') => results.push({ name, pass, detail });
const text = (page, selector) => page.locator(selector).first().textContent();
const isApi = (url) => API_HOSTS.some((host) => url.includes(host));

const browser = await chromium.launch({ channel: 'msedge' });
try {
  for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'tablet', width: 768, height: 1024 }, { name: 'mobile', width: 360, height: 740 }]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    let apiCalls = 0;
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
    page.on('request', (request) => { if (isApi(request.url())) apiCalls += 1; });
    const tag = (label) => `[${viewport.name}] ${label}`;

    await page.goto(BASE_URL + PAGE, { waitUntil: 'load' });
    await page.waitForSelector('[data-lobby-demo][data-ready]');
    await page.waitForFunction(() => /\d/.test(document.querySelector('[data-rate="usd"]')?.textContent ?? ''), null, { timeout: 30000 }).catch(() => {});

    const usd = await text(page, '[data-rate="usd"]');
    const eur = await text(page, '[data-rate="eur"]');
    check(tag('canlı kur geldi'), /^\d{2,3},\d{2}$/.test(usd ?? '') && /^\d{2,3},\d{2}$/.test(eur ?? ''), `USD ${usd} EUR ${eur}`);
    const temp = await text(page, '[data-temperature]');
    check(tag('canlı hava geldi'), /^-?\d{1,2}°$/.test(temp ?? ''), `${temp} ${await text(page, '[data-weather-kind]')}`);
    check(tag('durum satırı güncelleme saatini gösterir'), /^Güncellendi · \d{2}:\d{2}$/.test((await text(page, '[data-rates-status]')) ?? ''), (await text(page, '[data-rates-status]')) ?? '');

    const first = await text(page, '[data-clock]');
    check(tag('saat SS:DD biçiminde'), /^\d{2}:\d{2}$/.test(first ?? ''), first ?? '');
    const s1 = await text(page, '[data-seconds]');
    await page.waitForTimeout(2200);
    check(tag('saniye ilerliyor'), s1 !== (await text(page, '[data-seconds]')));

    // Sahne çerçeveye sığıyor mu?
    const fit = await page.evaluate(() => {
      const frame = document.querySelector('[data-frame]').getBoundingClientRect();
      const stage = document.querySelector('[data-stage]').getBoundingClientRect();
      return { dw: Math.abs(frame.width - stage.width), dh: Math.abs(frame.height - stage.height), ratio: frame.width / frame.height };
    });
    check(tag('sahne çerçeveyi tam dolduruyor'), fit.dw < 1.5 && fit.dh < 1.5, JSON.stringify(fit));

    // Hafta içi / hafta sonu.
    await page.getByRole('button', { name: 'Hafta içi', exact: true }).click();
    const weekday = await page.locator('[data-price]').allTextContents();
    await page.getByRole('button', { name: 'Hafta sonu', exact: true }).click();
    const weekend = await page.locator('[data-price]').allTextContents();
    check(tag('hafta içi fiyatları'), weekday.map((v) => v.trim()).join('|') === '₺3.200|₺4.100|₺5.400', weekday.join('|'));
    check(tag('hafta sonu fiyatları'), weekend.map((v) => v.trim()).join('|') === '₺3.800|₺4.900|₺6.300', weekend.join('|'));
    check(tag('fiyat dönemi etiketi değişir'), (await text(page, '[data-rate-mode]')) === 'Hafta sonu fiyatı');

    // Bağlantıyı kes: son veri kalır, etiket değişir, istek yapılmaz.
    const before = apiCalls;
    await page.getByRole('button', { name: 'Bağlantıyı kes' }).click();
    check(tag('kesince: Çevrimdışı etiketi'), /^Çevrimdışı · \d{2}:\d{2}$/.test((await text(page, '[data-rates-status]')) ?? ''), (await text(page, '[data-rates-status]')) ?? '');
    check(tag('kesince: son kur ekranda kalır'), (await text(page, '[data-rate="usd"]')) === usd);
    await page.waitForTimeout(600);
    check(tag('kesince: istek yapılmaz'), apiCalls === before, `${apiCalls - before}`);
    await page.getByRole('button', { name: 'Bağlantıyı geri aç' }).click();
    await page.waitForFunction(() => document.querySelector('[data-rates-status]')?.textContent?.startsWith('Güncellendi'), null, { timeout: 30000 }).catch(() => {});
    check(tag('geri açınca: veri tazelenir'), apiCalls > before && ((await text(page, '[data-rates-status]')) ?? '').startsWith('Güncellendi'), `${apiCalls - before} istek`);

    // Duyuru bandı durdurulabilir (WCAG 2.2.2).
    await page.getByRole('button', { name: 'Duyuru bandını durdur' }).click();
    const paused = await page.evaluate(() => getComputedStyle(document.querySelector('.lb-ticker-track')).animationPlayState);
    check(tag('bant durdurulabilir'), paused === 'paused', paused);

    // Klavye.
    await page.getByRole('button', { name: 'Hafta içi', exact: true }).focus();
    await page.keyboard.press('Enter');
    check(tag('klavye: Enter fiyat dönemini değiştirir'), (await text(page, '[data-rate-mode]')) === 'Hafta içi fiyatı');

    check(tag('tam ekran düğmesi var'), await page.getByRole('button', { name: 'Tam ekran' }).isVisible());
    check(tag('yatay taşma yok'), !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)));
    check(tag('konsol hatası yok'), errors.length === 0, errors.join(' | '));
    if (shotDir) {
      await page.locator('.lb-tv').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(shotDir, `lobby-${viewport.name}.png`) });
    }
    await context.close();
  }

  // API'ler erişilemezken: "Veri alınamadı", NaN yok, yakalanmamış hata yok.
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route((url) => isApi(url.href), (route) => route.abort());
    await page.goto(BASE_URL + PAGE, { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('[data-rates-status]')?.textContent === 'Veri alınamadı', null, { timeout: 30000 }).catch(() => {});
    const stage = (await text(page, '[data-stage]')) ?? '';
    check('[API yok] kur kutusu: Veri alınamadı', (await text(page, '[data-rates-status]')) === 'Veri alınamadı', (await text(page, '[data-rates-status]')) ?? '');
    check('[API yok] hava kutusu: Veri alınamadı', (await text(page, '[data-weather-status]')) === 'Veri alınamadı');
    check('[API yok] ekranda NaN ya da undefined yok', !/NaN|undefined|null/.test(stage));
    check('[API yok] saat çalışıyor', /^\d{2}:\d{2}$/.test((await text(page, '[data-clock]')) ?? ''));
    check('[API yok] yakalanmamış hata yok', errors.length === 0, errors.join(' | '));
    await context.close();
  }

  // API bozuk yanıt verirse (biçim değişmişse): yine "Veri alınamadı".
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.route((url) => isApi(url.href), (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"beklenmeyen":true}' }));
    await page.goto(BASE_URL + PAGE, { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('[data-rates-status]')?.textContent === 'Veri alınamadı', null, { timeout: 30000 }).catch(() => {});
    check('[bozuk yanıt] Veri alınamadı', (await text(page, '[data-rates-status]')) === 'Veri alınamadı' && (await text(page, '[data-rate="usd"]')) === '—');
    await context.close();
  }

  // Hareket azaltma: bant kaymaz.
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(BASE_URL + PAGE, { waitUntil: 'load' });
    const animation = await page.evaluate(() => getComputedStyle(document.querySelector('.lb-ticker-track')).animationName);
    check('[hareket azaltma] bant kaymıyor', animation === 'none', animation);
    await context.close();
  }
} finally {
  await browser.close();
}

for (const result of results) console.log(`${result.pass ? 'GEÇTİ ' : 'KALDI '} ${result.name}${result.detail ? `  (${result.detail})` : ''}`);
const failed = results.filter((result) => !result.pass).length;
console.log(`\n${results.length - failed}/${results.length} geçti`);
process.exit(failed === 0 ? 0 : 1);
