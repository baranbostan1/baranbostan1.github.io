// Geliştirme yardımcısı: acenta demosunu gerçek tarayıcıda dener.
// Kullanım: node scripts/verify-agency.mjs [ekran-görüntüsü-klasörü]
import { chromium } from 'playwright';
import path from 'node:path';

const BASE_URL = process.env.SHOTS_BASE_URL ?? 'http://localhost:4321';
const PAGE = '/projeler/acenta-takibi/';
const STORAGE_KEY = 'portfolio.agency-demo.v1';
const shotDir = process.argv[2];
const results = [];
const check = (name, pass, detail = '') => results.push({ name, pass, detail });

const balanceOf = (page, agency) => page.locator('[data-balances] tr', { hasText: agency }).locator('.ag-balance').evaluate((cell) => cell.firstChild.textContent.trim());
const openBalance = (page) => page.locator('[data-summary] dd').nth(2).textContent();
const recordCount = (page) => page.locator('[data-records] tr').count();

async function fill(page, { kind, agency, invoiceNo, amount }) {
  if (kind) await page.getByRole('radio', { name: kind, exact: true }).check();
  await page.getByLabel('Acenta', { exact: true }).fill(agency);
  if (invoiceNo !== undefined) await page.getByLabel('Fatura no').fill(invoiceNo);
  await page.getByLabel('Tutar (₺)').fill(amount);
}

const browser = await chromium.launch({ channel: 'msedge' });
try {
  for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'tablet', width: 768, height: 1024 }, { name: 'mobile', width: 360, height: 740 }]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce', acceptDownloads: true });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
    page.on('dialog', (dialog) => dialog.accept());
    const tag = (text) => `[${viewport.name}] ${text}`;
    const open = async () => {
      await page.goto(BASE_URL + PAGE, { waitUntil: 'networkidle' });
      await page.waitForSelector('[data-agency-demo][data-ready]');
    };

    await open();
    const startBalance = await balanceOf(page, 'Pusula Tur');
    const startOpen = await openBalance(page);
    const startRecords = await recordCount(page);
    check(tag('başlangıç: 5 acenta, 22 kayıt'), (await page.locator('[data-balances] tr').count()) === 5 && startRecords === 22, `${startRecords}`);
    check(tag('başlangıç bakiyesi (Pusula Tur)'), startBalance === '64.850,00 ₺', startBalance);

    // Boş form: üç alan hatası, odak ilk hatalı alanda.
    await page.getByRole('button', { name: 'Faturayı ekle' }).click();
    const shown = await page.locator('.ag-error:visible').allTextContents();
    check(tag('boş form: üç hata görünür'), shown.length === 3, shown.join(' | '));
    check(tag('boş form: odak ilk hatalı alanda'), await page.getByLabel('Acenta', { exact: true }).evaluate((input) => input === document.activeElement));
    check(tag('boş form: kayıt eklenmedi'), (await recordCount(page)) === startRecords);

    // Fatura ekle → bakiye 1.250,50 artar.
    await fill(page, { agency: 'Pusula Tur', invoiceNo: 'F-TEST', amount: '1.250,50' });
    await page.getByRole('button', { name: 'Faturayı ekle' }).click();
    const afterInvoice = await balanceOf(page, 'Pusula Tur');
    check(tag('fatura: bakiye 1.250,50 artar'), afterInvoice === '66.100,50 ₺', afterInvoice);
    check(tag('fatura: hatalar temizlendi'), (await page.locator('.ag-error:visible').count()) === 0);
    const status = await page.locator('[data-status]').textContent();
    check(tag('fatura: duyuru'), status === 'Fatura eklendi: Pusula Tur, 1.250,50 ₺.', status ?? '');
    check(tag('fatura: genel özet değişti'), (await openBalance(page)) !== startOpen);

    // Aynı tutarda ödeme → bakiye eski değerine döner. Yazım farkı aynı acentaya gider.
    await fill(page, { kind: 'Ödeme', agency: '  pusula  tur ', amount: '1250.5' });
    check(tag('ödeme: fatura no alanı gizli'), !(await page.getByLabel('Fatura no').isVisible()));
    await page.getByRole('button', { name: 'Ödemeyi ekle' }).click();
    const afterPayment = await balanceOf(page, 'Pusula Tur');
    check(tag('ödeme: bakiye eski değerine döner'), afterPayment === startBalance, afterPayment);
    check(tag('ödeme: yazım farkı yeni acenta açmaz'), (await page.locator('[data-balances] tr').count()) === 5);
    check(tag('ödeme: genel özet eski değerinde'), (await openBalance(page)) === startOpen);

    // Geçersiz tutar reddedilir.
    await fill(page, { agency: 'Pusula Tur', amount: '1.2.3' });
    await page.getByRole('button', { name: 'Ödemeyi ekle' }).click();
    check(tag('geçersiz tutar: hata mesajı'), await page.getByText('Sıfırdan büyük bir tutar yazın').isVisible());

    // Filtre ve sıralama.
    await page.getByLabel('Acentaya göre filtrele').selectOption('Kuzey Yıldızı Tur');
    check(tag('filtre: yalnızca seçilen acenta'), (await recordCount(page)) === 3, `${await recordCount(page)}`);
    await page.getByLabel('Acentaya göre filtrele').selectOption('');
    await page.getByLabel('Sırala').selectOption('largest');
    const top = await page.locator('[data-records] tr').first().locator('td').last().textContent();
    check(tag('sıralama: en büyük tutar üstte'), top === '95.000,00 ₺', top ?? '');

    // Yenileme: kayıtlar durur.
    await open();
    check(tag('yenileme: eklenen kayıtlar duruyor'), (await recordCount(page)) === startRecords + 2, `${await recordCount(page)}`);

    // CSV indirme.
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'CSV indir' }).click()]);
    check(tag('CSV: dosya adı'), download.suggestedFilename() === 'acenta-kayitlari-demo.csv', download.suggestedFilename());

    // Sıfırla.
    await page.getByRole('button', { name: 'Demo’yu sıfırla' }).click();
    check(tag('sıfırla: başlangıç verisi'), (await recordCount(page)) === startRecords && (await balanceOf(page, 'Pusula Tur')) === startBalance);
    check(tag('sıfırla: depolama temizlendi'), (await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)) === null);

    // Bozuk depolama: demo başlangıç verisiyle açılır.
    await page.evaluate((key) => localStorage.setItem(key, '{bozuk'), STORAGE_KEY);
    await open();
    check(tag('bozuk depolama: demo açılır'), (await recordCount(page)) === startRecords && (await balanceOf(page, 'Pusula Tur')) === startBalance);

    // Betik enjeksiyonu: ad düz metin olarak yazılır.
    await fill(page, { agency: '<img src=x onerror=alert(1)>', invoiceNo: 'F-X', amount: '10' });
    await page.getByRole('button', { name: 'Faturayı ekle' }).click();
    check(tag('HTML içeren ad düz metin olarak görünür'), (await page.locator('[data-balances] img').count()) === 0 && (await page.locator('[data-balances] th', { hasText: '<img' }).count()) === 1);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    check(tag('yatay taşma yok'), !overflow);
    check(tag('konsol hatası yok'), errors.length === 0, errors.join(' | '));

    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await open();
    if (shotDir) await page.screenshot({ path: path.join(shotDir, `agency-${viewport.name}.png`), fullPage: true });
    await context.close();
  }

  // Depolama kapalı: demo bellek içinde çalışır ve not görünür.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get: () => { throw new Error('kapalı'); } });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(BASE_URL + PAGE, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-agency-demo][data-ready]');
  check('[depolama kapalı] not görünür', await page.locator('[data-memory-note]').isVisible());
  await fill(page, { agency: 'Yelken Seyahat', invoiceNo: 'F-M', amount: '100' });
  await page.getByRole('button', { name: 'Faturayı ekle' }).click();
  check('[depolama kapalı] kayıt bellekte eklenir', (await recordCount(page)) === 23, `${await recordCount(page)}`);
  check('[depolama kapalı] hata yok', errors.length === 0, errors.join(' | '));
  await context.close();
} finally {
  await browser.close();
}

for (const result of results) console.log(`${result.pass ? 'GEÇTİ ' : 'KALDI '} ${result.name}${result.detail ? `  (${result.detail})` : ''}`);
const failed = results.filter((result) => !result.pass).length;
console.log(`\n${results.length - failed}/${results.length} geçti`);
process.exit(failed === 0 ? 0 : 1);
