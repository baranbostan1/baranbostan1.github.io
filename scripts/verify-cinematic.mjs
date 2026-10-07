// Geliştirme yardımcısı: sinematik katmanı dört durumda gerçek tarayıcıda dener ve sonucu raporlar.
// Önce `npm run dev` ya da `npm run preview` çalışıyor olmalı.
// Kullanım: node scripts/verify-cinematic.mjs [ekran-görüntüsü-klasörü]
import { chromium } from 'playwright';
import path from 'node:path';

const BASE_URL = process.env.SHOTS_BASE_URL ?? 'http://localhost:4321';
const shotDir = process.argv[2];
const results = [];
const check = (scenario, name, pass, detail = '') => results.push({ scenario, name, pass, detail });

async function open(browser, scenario, contextOptions, setup) {
  const context = await browser.newContext({ deviceScaleFactor: 1, ...contextOptions });
  const page = await context.newPage();
  const errors = [];
  const mediaRequests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (request.url().endsWith('.mp4')) mediaRequests.push(path.basename(request.url()));
  });
  if (setup) await setup(page);
  await page.goto(`${BASE_URL}/`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  return { context, page, errors, mediaRequests, scenario };
}

const shot = async (page, name) => {
  if (shotDir) await page.screenshot({ path: path.join(shotDir, `${name}.png`) });
};

const heroState = (page) =>
  page.evaluate(() => {
    const video = document.querySelector('[data-hero-track] video');
    const media = document.querySelector('[data-hero-track] .scene-media');
    return {
      mode: document.documentElement.dataset.cine,
      ready: video?.hasAttribute('data-ready') ?? false,
      failed: media?.hasAttribute('data-failed') ?? false,
      time: video?.currentTime ?? -1,
      duration: video?.duration ?? -1,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      headingVisible: (document.querySelector('h1')?.getBoundingClientRect().height ?? 0) > 0,
    };
  });

async function desktop(browser) {
  const s = await open(browser, 'masaüstü', { viewport: { width: 1440, height: 900 } });
  const { page } = s;
  await page.waitForFunction(() => document.querySelector('[data-hero-track] video')?.hasAttribute('data-ready'), null, { timeout: 15000 }).catch(() => {});
  const top = await heroState(page);
  check(s.scenario, 'mod scrub', top.mode === 'scrub', top.mode);
  check(s.scenario, 'hero videosu hazır', top.ready && !top.failed);
  check(s.scenario, 'kaydırma başında video başta', top.time < 0.3, `t=${top.time.toFixed(2)}`);
  await shot(page, 'desktop-0-top');

  const trackHeight = await page.evaluate(() => document.querySelector('[data-hero-track]').offsetHeight - window.innerHeight);
  await page.mouse.move(700, 450);
  await page.evaluate((y) => window.scrollTo(0, y), trackHeight / 2);
  await page.waitForTimeout(1500);
  const middle = await heroState(page);
  const stuck = await page.evaluate(() => Math.round(document.querySelector('.hero').getBoundingClientRect().top));
  check(s.scenario, 'yarı kaydırmada hero sabit', stuck === 0, `top=${stuck}`);
  check(s.scenario, 'yarı kaydırmada video ortada', Math.abs(middle.time - middle.duration / 2) < 0.6, `t=${middle.time.toFixed(2)} / ${middle.duration.toFixed(2)}`);
  await shot(page, 'desktop-1-middle');

  await page.evaluate((y) => window.scrollTo(0, y), trackHeight);
  await page.waitForTimeout(2500);
  const end = await heroState(page);
  check(s.scenario, 'kaydırma sonunda video sonda', end.duration - end.time < 0.3, `t=${end.time.toFixed(2)}`);
  await shot(page, 'desktop-2-end');

  await page.evaluate(() => document.querySelector('.project').scrollIntoView({ block: 'center' }));
  await page.waitForFunction(() => document.querySelector('.project video')?.ended === true, null, { timeout: 15000 }).catch(() => {});
  const project = await page.evaluate(() => {
    const video = document.querySelector('.project video');
    return { ended: video.ended, ready: video.hasAttribute('data-ready') };
  });
  check(s.scenario, 'proje klibi bir kez oynadı ve bitti', project.ended && project.ready);
  await shot(page, 'desktop-3-project');

  const hasLight = await page.evaluate(() => document.querySelector('.cursor-light') !== null);
  check(s.scenario, 'imleç ışığı eklendi', hasLight);
  check(s.scenario, 'yatay taşma yok', !end.overflow);
  check(s.scenario, 'yakalanmamış hata yok', s.errors.length === 0, s.errors.join(' | '));
  await s.context.close();
}

async function mobile(browser) {
  const s = await open(browser, 'mobil', { viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true });
  const { page } = s;
  await page.waitForFunction(() => document.querySelector('[data-hero-track] video')?.ended === true, null, { timeout: 15000 }).catch(() => {});
  const state = await heroState(page);
  const sticky = await page.evaluate(() => getComputedStyle(document.querySelector('.hero')).position);
  check(s.scenario, 'mod play', state.mode === 'play', state.mode);
  check(s.scenario, 'hero sabitlenmiyor', sticky !== 'sticky', sticky);
  check(s.scenario, 'hero klibi oynadı ve bitti', state.ready && state.duration - state.time < 0.3, `t=${state.time.toFixed(2)}`);
  check(s.scenario, 'yalnızca küçük dosyalar istendi', s.mediaRequests.includes('hero-sm.mp4') && s.mediaRequests.every((file) => file.endsWith('-sm.mp4')), s.mediaRequests.join(','));
  check(s.scenario, 'yatay taşma yok', !state.overflow);
  check(s.scenario, 'yakalanmamış hata yok', s.errors.length === 0, s.errors.join(' | '));
  await shot(page, 'mobile-0-top');
  await s.context.close();
}

async function reducedMotion(browser) {
  const s = await open(browser, 'hareket azaltma', { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const { page } = s;
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  const state = await heroState(page);
  const startShown = await page.evaluate(() => getComputedStyle(document.querySelector('.scene-start')).display !== 'none');
  check(s.scenario, 'mod static', state.mode === 'static', state.mode);
  check(s.scenario, 'hiç video istenmedi', s.mediaRequests.length === 0, s.mediaRequests.join(','));
  check(s.scenario, 'son kare görünüyor', !startShown);
  check(s.scenario, 'başlık görünüyor', state.headingVisible);
  check(s.scenario, 'yakalanmamış hata yok', s.errors.length === 0, s.errors.join(' | '));
  await s.context.close();
}

async function missingVideo(browser) {
  const s = await open(browser, 'video eksik', { viewport: { width: 1440, height: 900 } }, (page) => page.route('**/*.mp4', (route) => route.abort()));
  const { page } = s;
  await page.waitForFunction(() => document.querySelector('[data-hero-track] .scene-media')?.hasAttribute('data-failed'), null, { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(500);
  const state = await heroState(page);
  const startShown = await page.evaluate(() => getComputedStyle(document.querySelector('[data-hero-track] .scene-start')).display !== 'none');
  check(s.scenario, 'sahne başarısız olarak işaretlendi', state.failed);
  check(s.scenario, 'son kareye dönüldü', !startShown);
  check(s.scenario, 'başlık görünüyor', state.headingVisible);
  check(s.scenario, 'kaydırma çalışıyor', (await page.evaluate(() => window.scrollY)) > 0);
  check(s.scenario, 'yakalanmamış hata yok', s.errors.length === 0, s.errors.join(' | '));
  await shot(page, 'missing-video');
  await s.context.close();
}

const browser = await chromium.launch({ channel: 'msedge', args: ['--autoplay-policy=no-user-gesture-required'] });
try {
  await desktop(browser);
  await mobile(browser);
  await reducedMotion(browser);
  await missingVideo(browser);
} finally {
  await browser.close();
}

for (const result of results) {
  console.log(`${result.pass ? 'GEÇTİ ' : 'KALDI '} [${result.scenario}] ${result.name}${result.detail ? `  (${result.detail})` : ''}`);
}
const failed = results.filter((result) => !result.pass).length;
console.log(`\n${results.length - failed}/${results.length} geçti`);
process.exit(failed === 0 ? 0 : 1);
