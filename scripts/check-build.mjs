// Derleme çıktısı denetimi: ana sayfalarda beş sahnenin de gerçek görüntüsüyle çıktığını doğrular.
// Neden var: sahne bileşeni medya dosyasını bulamazsa yer tutucu çizer; bu, geliştirme sunucusunda
// görünmeyip yalnızca derlemede ortaya çıkabilir. Böyle bir derleme yayına gitmemelidir.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCENES = ['hero', 'qr-menu', 'lobby', 'agency', 'closing'];
const HOME_PAGES = [path.join('dist', 'index.html'), path.join('dist', 'en', 'index.html')];

/**
 * Sayfanın HTML'inde eksik ya da yer tutucuyla çıkmış sahneleri bildirir.
 * @param {string} html
 * @param {readonly string[]} scenes
 * @returns {string[]}
 */
export function sceneProblems(html, scenes) {
  const problems = scenes.flatMap((name) => {
    const hasPoster = html.includes(`/media/${name}-poster.webp`);
    const hasVideo = html.includes(`/media/${name}-lg.mp4`);
    if (hasPoster && hasVideo) return [];
    return [`"${name}" sahnesi görüntüsüz çıktı (sabit kare: ${hasPoster ? 'var' : 'yok'}, video: ${hasVideo ? 'var' : 'yok'})`];
  });
  return html.includes('scene-placeholder') ? [...problems, 'sayfada yer tutucu ("scene-placeholder") kalmış'] : problems;
}

function main() {
  const failures = HOME_PAGES.flatMap((file) => {
    if (!existsSync(file)) return [`${file}: dosya yok`];
    return sceneProblems(readFileSync(file, 'utf8'), SCENES).map((problem) => `${file}: ${problem}`);
  });
  if (failures.length === 0) {
    console.log(`[derleme] Temiz: ${HOME_PAGES.length} ana sayfada ${SCENES.length} sahne de görüntüsüyle çıktı.`);
    return 0;
  }
  console.error(`[derleme] ${failures.length} sorun:`);
  failures.forEach((failure) => console.error(`  ${failure}`));
  return 1;
}

const isDirectRun = process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) process.exit(main());
