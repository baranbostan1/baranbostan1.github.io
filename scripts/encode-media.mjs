// Ham bir klipten sitenin kullandığı altı dosyayı üretir (ffmpeg gerekir):
//   <ad>-lg.mp4         1920×1080, sık anahtar kareli (kaydırmayla sarma için)
//   <ad>-sm.mp4         1280×720, dar ekranlar için
//   <ad>-poster.webp    klibin son karesi (dönüşümün bittiği an), 1920 geniş
//   <ad>-poster-sm.webp aynı kare, 960 geniş
//   <ad>-start.webp     klibin ilk karesi (video yüklenene kadar gösterilir), 1920 geniş
//   <ad>-start-sm.webp  aynı kare, 960 geniş
// Kullanım: node scripts/encode-media.mjs <ad> [kaynak-dosya]
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import path from 'node:path';

const SCENES = ['hero', 'qr-menu', 'lobby', 'agency', 'closing'];
const SOURCE_DIR = 'media-src';
const OUT_DIR = path.join('public', 'media');
const LARGE = { width: 1920, height: 1080, crf: 27, keyframeInterval: 2, maxBytes: 4 * 1024 * 1024 };
const SMALL = { width: 1280, height: 720, crf: 27, maxBytes: 1.5 * 1024 * 1024 };
const STILL_WIDTHS = { '': 1920, '-sm': 960 };
const OUTPUT_FPS = 24;
// Sahneye özel kurgu: kaynağın yalnızca [start, end] saniyeleri kullanılır; slow > 1 ise klip o kat yavaşlatılır
// (ara kareler karıştırılarak üretilir). Hero'da olay 2,0–2,6. saniyelerdedir; gerisi durağan beklemedir.
const EDITS = {
  hero: { start: 1.7, end: 3.1, slow: 2 },
};
// Son kare, kurgusuz kliplerde dosyanın sonundan bu kadar önce alınır.
const END_STILL_OFFSET = 0.2;
const POSTER_QUALITY = 78;
// Hedef boyut aşılırsa crf bu kadar artırılıp yeniden denenir.
const CRF_STEP = 2;
const MAX_CRF = 36;

const ffmpeg = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });

// Ölçekle, taşan kenarı kırp; meta veriyi ve sesi at.
const videoFilter = ({ width, height }, edit) => {
  const retime = edit?.slow ? `setpts=${edit.slow}*PTS,minterpolate=fps=${OUTPUT_FPS}:mi_mode=blend,` : '';
  return `${retime}scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},format=yuv420p`;
};

const trimArgs = (edit) => (edit ? ['-ss', String(edit.start), '-to', String(edit.end)] : []);

function encodeVideo(source, target, preset, edit, extraArgs = []) {
  for (let crf = preset.crf; crf <= MAX_CRF; crf += CRF_STEP) {
    ffmpeg([
      ...trimArgs(edit), '-i', source,
      '-an', '-map_metadata', '-1',
      '-vf', videoFilter(preset, edit),
      '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf),
      '-movflags', '+faststart',
      ...extraArgs,
      target,
    ]);
    const size = statSync(target).size;
    if (size <= preset.maxBytes) return { crf, size };
    console.warn(`  ${path.basename(target)}: ${(size / 1e6).toFixed(2)} MB hedefi aşıyor (crf ${crf}); yeniden deneniyor.`);
  }
  throw new Error(`${target}: crf ${MAX_CRF} ile bile hedef boyutun altına inmedi.`);
}

function encodeStill(source, target, width, seekArgs) {
  ffmpeg([
    ...seekArgs, '-i', source,
    '-map_metadata', '-1',
    '-vf', `scale=${width}:-2`,
    '-update', '1', '-frames:v', '1',
    '-c:v', 'libwebp', '-quality', String(POSTER_QUALITY),
    target,
  ]);
  return statSync(target).size;
}

function main() {
  const [name, sourceArg] = process.argv.slice(2);
  if (!SCENES.includes(name)) {
    console.error(`Kullanım: node scripts/encode-media.mjs <${SCENES.join('|')}> [kaynak-dosya]`);
    return 1;
  }
  const source = sourceArg ?? path.join(SOURCE_DIR, `${name}.mp4`);
  if (!existsSync(source)) {
    console.error(`Kaynak bulunamadı: ${source}`);
    return 1;
  }
  mkdirSync(OUT_DIR, { recursive: true });
  const out = (suffix) => path.join(OUT_DIR, `${name}-${suffix}`);
  const mb = (bytes) => `${(bytes / 1e6).toFixed(2)} MB`;

  const edit = EDITS[name];
  // İlk kare kurgunun başından, son kare kurgunun sonundan alınır.
  const stills = {
    poster: edit ? ['-ss', String(edit.end)] : ['-sseof', String(-END_STILL_OFFSET)],
    start: edit ? ['-ss', String(edit.start)] : [],
  };
  const large = encodeVideo(source, out('lg.mp4'), LARGE, edit, ['-g', String(LARGE.keyframeInterval), '-keyint_min', String(LARGE.keyframeInterval)]);
  console.log(`${name}-lg.mp4  ${mb(large.size)} (crf ${large.crf})`);
  const small = encodeVideo(source, out('sm.mp4'), SMALL, edit);
  console.log(`${name}-sm.mp4  ${mb(small.size)} (crf ${small.crf})`);
  for (const [still, seekArgs] of Object.entries(stills)) {
    for (const [suffix, width] of Object.entries(STILL_WIDTHS)) {
      const file = `${still}${suffix}.webp`;
      const size = encodeStill(source, out(file), width, seekArgs);
      console.log(`${name}-${file}  ${(size / 1e3).toFixed(0)} KB`);
    }
  }
  return 0;
}

try {
  process.exit(main());
} catch (error) {
  console.error(`Kodlama başarısız: ${error.message}`);
  process.exit(1);
}
