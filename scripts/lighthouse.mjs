// Geliştirme yardımcısı: derlenmiş sitenin sayfalarını Lighthouse ile ölçer ve eşiklerle karşılaştırır.
// Önce: `npm run build && npx astro preview --port 4322`
// Kullanım: node scripts/lighthouse.mjs [mobile|desktop]
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.LH_BASE_URL ?? 'http://localhost:4322';
const OUT_DIR = path.join('.impeccable', 'review', 'lighthouse');
const EDGE_PATHS = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'];
const HOME_ROUTES = new Set(['/', '/en/']);
// Ana sayfada tam ekran video var: Performance eşiği 90; diğer sayfalarda 95.
const THRESHOLDS = { home: { performance: 90 }, default: { performance: 95 }, common: { accessibility: 95, 'best-practices': 95, seo: 95 } };
const ROUTES = ['/', '/en/', '/projeler/qr-menu/', '/projeler/lobi-ekrani/', '/projeler/acenta-takibi/', '/en/projects/qr-menu/', '/en/projects/lobby-display/', '/en/projects/agency-ledger/', '/cv/', '/en/cv/'];

const preset = process.argv[2] === 'desktop' ? 'desktop' : 'mobile';
const chromePath = EDGE_PATHS.find((candidate) => existsSync(candidate));
if (!chromePath) {
  console.error('Edge bulunamadı; CHROME_PATH ortam değişkenini ayarlayın.');
  process.exit(1);
}
mkdirSync(OUT_DIR, { recursive: true });

let failures = 0;
console.log(`Lighthouse (${preset})\n${'sayfa'.padEnd(36)} Perf  A11y  BP    SEO`);
for (const route of ROUTES) {
  const name = `${preset}-${route.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home'}.json`;
  const output = path.join(OUT_DIR, name);
  const args = ['lighthouse', BASE_URL + route, '--quiet', '--output=json', `--output-path=${output}`, '--chrome-flags=--headless=new --no-sandbox', '--only-categories=performance,accessibility,best-practices,seo'];
  if (preset === 'desktop') args.push('--preset=desktop');
  rmSync(output, { force: true });
  try {
    execFileSync('npx', args, { stdio: 'ignore', env: { ...process.env, CHROME_PATH: chromePath }, shell: true });
  } catch (error) {
    // Windows'ta Lighthouse, raporu yazdıktan sonra geçici klasörünü silerken EPERM ile çıkabilir.
    // Rapor yazıldıysa ölçüm geçerlidir; yazılmadıysa hata gerçektir.
    if (!existsSync(output)) throw error;
  }
  const { categories, audits } = JSON.parse(readFileSync(output, 'utf8'));
  const score = (id) => Math.round((categories[id]?.score ?? 0) * 100);
  const limits = { ...(HOME_ROUTES.has(route) ? THRESHOLDS.home : THRESHOLDS.default), ...THRESHOLDS.common };
  const failed = Object.entries(limits).filter(([id, min]) => score(id) < min).map(([id]) => id);
  failures += failed.length;
  const row = ['performance', 'accessibility', 'best-practices', 'seo'].map((id) => String(score(id)).padEnd(5)).join(' ');
  console.log(`${route.padEnd(36)} ${row} ${failed.length ? `← eşik altı: ${failed.join(', ')}` : ''}`);
  if (failed.length) {
    const weak = Object.values(audits).filter((audit) => audit.score !== null && audit.score < 0.9 && audit.scoreDisplayMode !== 'informative' && audit.scoreDisplayMode !== 'manual').map((audit) => `${audit.id}${audit.displayValue ? ` (${audit.displayValue})` : ''}`);
    console.log(`    zayıf denetimler: ${weak.slice(0, 12).join('; ')}`);
  }
}
console.log(failures === 0 ? '\nTüm eşikler karşılandı.' : `\n${failures} eşik karşılanmadı.`);
process.exit(failures === 0 ? 0 : 1);
