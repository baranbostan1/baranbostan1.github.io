// Anonimlik denetimi: yasaklı kelimeleri repo dosyalarında, dosya adlarında ve dist/ içinde arar.
// Liste repoya girmez; ANONYMITY_WORDS ortam değişkeninden ya da yerel dosyadan okunur.
// `--history` ile git geçmişinin tamamı (tüm commit'lerin içeriği ve mesajları) da taranır;
// bir kez commit'lenip sonra silinen bir kelime de yayına gider, bu yüzden ilk push'tan önce çalıştırılır.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WORDS_FILE = 'anonymity-words.local.txt';
const WORDS_ENV = 'ANONYMITY_WORDS';
// Bu uzunluğa kadar olan kelimeler yalnızca tek başına geçtiğinde sayılır (uzun bir kelimenin içinde rastlantıyla geçen kısa dizileri yanlış alarm saymamak için).
const SHORT_WORD_MAX = 5;
// Rakam karşılaştırması yalnızca bu kadar ya da daha çok rakam içeren ifadelere uygulanır (telefon gibi).
const MIN_DIGITS_FOR_NUMBER_MATCH = 6;
const BINARY_SNIFF_BYTES = 8000;
const FALLBACK_SKIP_DIRS = new Set(['node_modules', 'dist', '.astro', '.superpowers', 'media-src', '.git']);
const HISTORY_MAX_BUFFER = 1024 * 1024 * 1024;
const FILE_NAME = 0;
const WHOLE_FILE = -1;

const collapseSpaces = (value) => value.replace(/\s+/g, ' ');
// Aksanları atılmış (ASCII'ye yakın) yazım: "ş→s, ö→o, ı/İ→i" gibi dönüşümlerle yazılmış adları da yakalar.
const foldAccents = (value) => value.normalize('NFKD').replace(/\p{M}/gu, '').replace(/ı/g, 'i').toLowerCase();
// Üç yazım denenir: Türkçe küçük harf, düz küçük harf ve aksansız yazım.
const variants = (value) => {
  const spaced = collapseSpaces(value);
  return [spaced.toLocaleLowerCase('tr'), spaced.toLowerCase(), foldAccents(spaced)];
};
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const digitsOf = (value) => value.replace(/\D/g, '');
// Yalnızca rakam ve ayırıcıdan oluşan ifadeler (telefon numarası gibi).
const isNumberLike = (value) => /^[\d\s().+\-/]+$/.test(value) && digitsOf(value).length >= MIN_DIGITS_FOR_NUMBER_MATCH;

function containsWord(haystack, needle) {
  if (needle.length > SHORT_WORD_MAX) return haystack.includes(needle);
  const wholeWord = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(needle)}(?![\\p{L}\\p{N}])`, 'u');
  return wholeWord.test(haystack);
}

/**
 * Metinde geçen yasaklı kelimeleri, listedeki yazımıyla döndürür.
 * Büyük/küçük harf, aksan, fazla boşluk ve satır sonu farkı gözetmez;
 * telefon gibi rakam ifadelerinde ayırıcı farkı da gözetmez.
 * @param {string} text
 * @param {readonly string[]} words
 * @returns {string[]}
 */
export function findBannedWords(text, words) {
  const haystacks = variants(text);
  const textDigits = digitsOf(text);
  return words.filter((word) => {
    const needles = variants(word);
    if (haystacks.some((haystack, index) => containsWord(haystack, needles[index]))) return true;
    return isNumberLike(word) && textDigits.includes(digitsOf(word));
  });
}

function parseWordList(raw) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
}

function loadWords(root) {
  const fromEnv = process.env[WORDS_ENV];
  if (fromEnv && fromEnv.trim().length > 0) return parseWordList(fromEnv);
  const filePath = path.join(root, WORDS_FILE);
  if (existsSync(filePath)) return parseWordList(readFileSync(filePath, 'utf8'));
  return null;
}

function walk(dir, skipDirs) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return skipDirs.has(entry.name) ? [] : walk(fullPath, skipDirs);
    return entry.isFile() ? [fullPath] : [];
  });
}

function listRepoFiles(root) {
  try {
    const output = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return output.split('\0').filter(Boolean).map((file) => path.join(root, file));
  } catch {
    // Git deposu yoksa klasör elle gezilir.
    return walk(root, FALLBACK_SKIP_DIRS);
  }
}

function listFiles(root) {
  const distDir = path.join(root, 'dist');
  const distFiles = existsSync(distDir) ? walk(distDir, new Set()) : [];
  const all = [...listRepoFiles(root), ...distFiles];
  return [...new Set(all)].filter((file) => existsSync(file) && statSync(file).isFile());
}

const isBinary = (buffer) => buffer.subarray(0, BINARY_SNIFF_BYTES).includes(0);

// Metni satır satır (yer bildirmek için) ve bir de bütün olarak (satıra bölünmüş adlar için) tarar.
function scanText(text, label, words) {
  const lineHits = text.split(/\r?\n/).flatMap((line, index) => findBannedWords(line, words).map((word) => ({ file: label, line: index + 1, word })));
  const found = new Set(lineHits.map((hit) => hit.word));
  const wrappedHits = findBannedWords(text, words)
    .filter((word) => !found.has(word))
    .map((word) => ({ file: label, line: WHOLE_FILE, word }));
  return [...lineHits, ...wrappedHits];
}

function scanFile(file, root, words) {
  const relative = path.relative(root, file).split(path.sep).join('/');
  const nameHits = findBannedWords(relative, words).map((word) => ({ file: relative, line: FILE_NAME, word }));
  const buffer = readFileSync(file);
  if (!isBinary(buffer)) return [...nameHits, ...scanText(buffer.toString('utf8'), relative, words)];
  // İkili dosyalar (PDF, görsel, video): meta veride düz metin olarak geçebilecek adlar aranır.
  // Kısa kelimeler ve rakam dizileri rastgele baytlarda sık çıktığı için yalnızca uzun, harfli kelimelere bakılır.
  const longWords = words.filter((word) => word.length > SHORT_WORD_MAX && !isNumberLike(word));
  const binaryHits = findBannedWords(buffer.toString('latin1'), longWords).map((word) => ({ file: relative, line: WHOLE_FILE, word }));
  return [...nameHits, ...binaryHits];
}

function scanHistory(root, words) {
  const log = execFileSync('git', ['log', '--all', '-p', '--no-color'], { cwd: root, encoding: 'utf8', maxBuffer: HISTORY_MAX_BUFFER, stdio: ['ignore', 'pipe', 'ignore'] });
  return scanText(log, 'git geçmişi', words);
}

function describe(hit) {
  if (hit.line === FILE_NAME) return `${hit.file} (dosya adı)`;
  if (hit.line === WHOLE_FILE) return `${hit.file} (dosya içinde; satıra bölünmüş ya da ikili)`;
  return `${hit.file}:${hit.line}`;
}

function main() {
  const root = process.cwd();
  const words = loadWords(root);
  if (words === null) {
    if (process.env.CI === 'true') {
      console.warn(`[anonimlik] Uyarı: yasaklı liste yok (${WORDS_ENV} tanımlı değil); tarama atlandı.`);
      return 0;
    }
    console.error(`[anonimlik] Yasaklı liste bulunamadı: ${WORDS_FILE} dosyasını oluştur ya da ${WORDS_ENV} tanımla.`);
    return 1;
  }
  const files = listFiles(root);
  const withHistory = process.argv.includes('--history');
  const hits = [...files.flatMap((file) => scanFile(file, root, words)), ...(withHistory ? scanHistory(root, words) : [])];
  if (hits.length === 0) {
    console.log(`[anonimlik] Temiz: ${files.length} dosya${withHistory ? ' ve git geçmişi' : ''}, ${words.length} kelime tarandı.`);
    return 0;
  }
  // Kelimenin kendisi çıktıya yazılmaz; CI günlükleri herkese açıktır.
  console.error(`[anonimlik] ${hits.length} bulgu:`);
  hits.forEach((hit) => console.error(`  ${describe(hit)}`));
  return 1;
}

const isDirectRun = process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) process.exit(main());
