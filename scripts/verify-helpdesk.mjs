// Geliştirme yardımcısı: destek talepleri demosunu gerçek tarayıcıda dener.
// Kullanım: node scripts/verify-helpdesk.mjs [ekran-görüntüsü-klasörü]
import { chromium } from 'playwright';
import path from 'node:path';

const BASE_URL = process.env.SHOTS_BASE_URL ?? 'http://localhost:4321';
const PAGE = '/projeler/destek-talepleri/';
const PAGE_EN = '/en/projects/helpdesk/';
const DEMO_PAGE = '/demo/destek-talepleri/';
const STORAGE_KEY = 'portfolio.helpdesk-demo.v1';
const SEED_COUNT = 9;
const ANNOUNCE_WAIT_MS = 120;
const UNASSIGNED_TITLE = 'Toplantı odasında Wi-Fi bağlanmıyor';
const XSS_TITLE = '<img src=x onerror=alert(1)>';
const shotDir = process.argv[2];
const results = [];
const check = (name, pass, detail = '') => results.push({ name, pass, detail });

const card = (page, title) => page.locator('[data-ticket]', { hasText: title });
const columnOf = (page, title) => card(page, title).evaluate((node) => node.closest('[data-column]').dataset.column);
const ticketCount = (page) => page.locator('[data-ticket]').count();
const summaryValue = (page, index) => page.locator('[data-summary] dd').nth(index).textContent();
// Duyuru alanı önce boşaltılıp bir kare sonra yazılır; okumadan önce kısa bir bekleme gerekir.
const announced = async (page) => {
  await page.waitForTimeout(ANNOUNCE_WAIT_MS);
  return page.locator('[data-status]').textContent();
};
// Odak, eylemin yapıldığı talebin içinde mi (BODY'ye düşmedi mi)?
const focusInside = (page, title) => card(page, title).evaluate((node) => node.contains(document.activeElement));
const act = (page, title, name) => card(page, title).locator('[data-action]', { hasText: name }).click();

async function walkTicket(page, tag) {
  const title = UNASSIGNED_TITLE;
  const openAtStart = Number(await summaryValue(page, 0));

  // Atanmamış talep işleme alınamaz.
  await act(page, title, 'İşleme al');
  check(tag('atanmamış: uyarı duyurulur'), (await announced(page)) === 'Önce talebi birine atayın.', (await announced(page)) ?? '');
  check(tag('atanmamış: talep yerinde kalır'), (await columnOf(page, title)) === 'new');
  check(tag('atanmamış: odak atama alanında'), await card(page, title).locator('[data-assign]').evaluate((select) => select === document.activeElement));

  await card(page, title).locator('[data-assign]').selectOption('Deniz');
  check(tag('atama: duyuru'), ((await announced(page)) ?? '').includes('Deniz'), (await announced(page)) ?? '');
  check(tag('atama: odak talepte kalır'), await focusInside(page, title));

  const steps = [
    ['İşleme al', 'inProgress', 0],
    ['Kullanıcıyı bekle', 'waiting', 0],
    ['Devam et', 'inProgress', 0],
    ['Çöz', 'resolved', -1],
    ['Yeniden aç', 'inProgress', 0],
  ];
  for (const [name, column, delta] of steps) {
    await act(page, title, name);
    const actual = await columnOf(page, title);
    check(tag(`${name}: talep "${column}" sütununda`), actual === column, actual);
    const open = Number(await summaryValue(page, 0));
    check(tag(`${name}: açık talep sayısı`), open === openAtStart + delta, `${open}`);
    check(tag(`${name}: odak talepte kalır`), await focusInside(page, title));
  }
  const choices = await card(page, title).locator('[data-assign] option').allTextContents();
  check(tag('işlemdeki talep sahipsiz bırakılamaz'), !choices.includes('Atanmamış'), choices.join('|'));
  check(tag('çözülmüş talepte atama kapalı'), await card(page, 'VPN bağlantısı kopuyor').locator('[data-assign]').isDisabled());
}

async function tryForm(page, tag) {
  const before = await ticketCount(page);
  await page.getByRole('button', { name: 'Talebi aç' }).click();
  const shown = await page.locator('.hd-error:visible').allTextContents();
  check(tag('boş form: başlık ve talep eden hatası'), shown.length === 2, shown.join(' | '));
  check(tag('boş form: odak ilk hatalı alanda'), await page.getByLabel('Sorun ya da istek').evaluate((input) => input === document.activeElement));
  check(tag('boş form: talep eklenmedi'), (await ticketCount(page)) === before);

  await page.getByLabel('Sorun ya da istek').fill('x'.repeat(81));
  await page.getByLabel('Talep eden', { exact: true }).fill('Deneme');
  await page.getByRole('button', { name: 'Talebi aç' }).click();
  check(tag('81 karakterlik başlık reddedilir'), (await ticketCount(page)) === before && (await page.locator('.hd-error:visible').count()) === 1);

  // Betik enjeksiyonu: başlık düz metin olarak yazılır.
  await page.getByLabel('Sorun ya da istek').fill(XSS_TITLE);
  await page.getByLabel('Öncelik').selectOption('urgent');
  await page.getByRole('button', { name: 'Talebi aç' }).click();
  check(tag('talep açıldı'), (await ticketCount(page)) === before + 1 && (await page.locator('.hd-error:visible').count()) === 0);
  check(tag('HTML içeren başlık düz metin olarak görünür'), (await page.locator('[data-board] img').count()) === 0 && (await card(page, XSS_TITLE).count()) === 1);
  check(tag('yeni talep "new" sütununda'), (await columnOf(page, XSS_TITLE)) === 'new');
  check(tag('talep açıldı: duyuru'), ((await announced(page)) ?? '').startsWith('Talep açıldı:'), (await announced(page)) ?? '');
}

const browser = await chromium.launch({ channel: 'msedge' });
try {
  for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'tablet', width: 768, height: 1024 }, { name: 'mobile', width: 360, height: 740 }]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
    page.on('dialog', (dialog) => dialog.accept());
    const tag = (text) => `[${viewport.name}] ${text}`;
    const open = async (target = PAGE) => {
      await page.goto(BASE_URL + target, { waitUntil: 'networkidle' });
      await page.waitForSelector('[data-helpdesk-demo][data-ready]');
    };

    await open();
    check(tag('başlangıç: 9 talep'), (await ticketCount(page)) === SEED_COUNT, `${await ticketCount(page)}`);
    const heads = await page.locator('.hd-column-head').evaluateAll((nodes) => nodes.map((node) => node.firstChild.textContent.trim()));
    check(tag('dört sütun başlığı'), heads.join('|') === 'Yeni|İşlemde|Kullanıcı bekleniyor|Çözüldü', heads.join('|'));
    const summary = await page.locator('[data-summary] dd').allTextContents();
    check(tag('özet değerleri'), summary.join('|') === '8|3|2|2 gün', summary.join('|'));
    check(tag('hedefi aşan iki talep işaretli'), (await page.locator('.hd-overdue:visible').count()) === 2);
    check(tag('"Konsept" rozeti görünür'), await page.locator('.concept-badge', { hasText: 'Konsept' }).isVisible());
    const h2s = await page.locator('article h2').allTextContents();
    check(tag('"Senaryo" ve "Durum" başlıkları var, "Sorun" ve "Sonuç" yok'), h2s.includes('Senaryo') && h2s.includes('Durum') && !h2s.includes('Sorun') && !h2s.includes('Sonuç'), h2s.join('|'));

    await walkTicket(page, tag);
    await tryForm(page, tag);

    // Yalnızca klavye: düğmeye odaklanıp Enter ile eylem; odak yine talepte.
    await card(page, 'E-posta şifresi kilitlendi').locator('[data-action]').first().focus();
    await page.keyboard.press('Enter');
    check(tag('klavye: Enter ile eylem'), (await columnOf(page, 'E-posta şifresi kilitlendi')) === 'waiting' && (await focusInside(page, 'E-posta şifresi kilitlendi')));

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    check(tag('yatay taşma yok'), !overflow);
    const columns = await page.locator('[data-column]').evaluateAll((nodes) => new Set(nodes.map((node) => Math.round(node.getBoundingClientRect().left))).size);
    check(tag('düzen: geniş ekranda dört sütun, darda tek'), columns === (viewport.width >= 1024 ? 4 : 1), `${columns}`);

    // Yenileme: değişiklikler durur.
    await open();
    check(tag('yenileme: talepler duruyor'), (await ticketCount(page)) === SEED_COUNT + 1 && (await columnOf(page, UNASSIGNED_TITLE)) === 'inProgress');

    await page.getByRole('button', { name: 'Demo’yu sıfırla' }).click();
    check(tag('sıfırla: başlangıç verisi'), (await ticketCount(page)) === SEED_COUNT && (await columnOf(page, UNASSIGNED_TITLE)) === 'new');
    check(tag('sıfırla: depolama temizlendi'), (await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)) === null);

    await page.evaluate((key) => localStorage.setItem(key, '{bozuk'), STORAGE_KEY);
    await open();
    check(tag('bozuk depolama: demo açılır'), (await ticketCount(page)) === SEED_COUNT);
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);

    // Dil değiştirici karşı sayfaya gider; İngilizce sayfada metinler İngilizcedir.
    await page.locator('a[hreflang="en"]').first().click();
    await page.waitForSelector('[data-helpdesk-demo][data-ready]');
    check(tag('dil değiştirici İngilizce sayfaya gider'), new URL(page.url()).pathname === PAGE_EN, page.url());
    // Türkçe sayfada yapılan değişiklikler İngilizce panoya taşmaz.
    check(tag('İngilizce: Türkçe panonun kaydı taşmaz'), (await ticketCount(page)) === SEED_COUNT);
    check(tag('İngilizce: başlangıç talepleri İngilizce'), (await card(page, 'Meeting room Wi-Fi will not connect').count()) === 1);
    check(tag('İngilizce: "Concept" rozeti ve "Status" başlığı'), (await page.locator('.concept-badge', { hasText: 'Concept' }).isVisible()) && (await page.locator('article h2').allTextContents()).includes('Status'));

    // Tam ekran demo sayfası.
    await open(DEMO_PAGE);
    check(tag('tam ekran demo: 9 talep'), (await ticketCount(page)) === SEED_COUNT);
    check(tag('tam ekran demo: yatay taşma yok'), !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)));

    check(tag('konsol hatası yok'), errors.length === 0, errors.join(' | '));
    await open();
    if (shotDir) await page.screenshot({ path: path.join(shotDir, `helpdesk-${viewport.name}.png`), fullPage: true });
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
  await page.waitForSelector('[data-helpdesk-demo][data-ready]');
  check('[depolama kapalı] not görünür', await page.locator('[data-memory-note]').isVisible());
  await page.getByLabel('Sorun ya da istek').fill('Klavye tuşu basmıyor');
  await page.getByLabel('Talep eden', { exact: true }).fill('Deneme');
  await page.getByRole('button', { name: 'Talebi aç' }).click();
  check('[depolama kapalı] talep bellekte eklenir', (await ticketCount(page)) === SEED_COUNT + 1, `${await ticketCount(page)}`);
  check('[depolama kapalı] hata yok', errors.length === 0, errors.join(' | '));
  await context.close();

  // JavaScript kapalı: başlangıç panosu sunucudan okunur.
  const staticContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const staticPage = await staticContext.newPage();
  await staticPage.goto(BASE_URL + PAGE, { waitUntil: 'load' });
  check('[JavaScript kapalı] 9 talep okunur', (await staticPage.locator('[data-ticket]').count()) === SEED_COUNT);
  await staticContext.close();
} finally {
  await browser.close();
}

for (const result of results) console.log(`${result.pass ? 'GEÇTİ ' : 'KALDI '} ${result.name}${result.detail ? `  (${result.detail})` : ''}`);
const failed = results.filter((result) => !result.pass).length;
console.log(`\n${results.length - failed}/${results.length} geçti`);
process.exit(failed === 0 ? 0 : 1);
