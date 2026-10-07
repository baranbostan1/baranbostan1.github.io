# Portföy Sitesi — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Hedef:** Baran Berkay Bostan'ın iki dilli, koyu ve sinematik portföy sitesini (ana sayfa, üç proje sayfası ve demosu, CV, 404) kurup GitHub Pages'te yayınlamak.

**Mimari:** Astro statik çıktı; tüm metinler iki dilli tipli içerik modüllerinde, sayfalar ve CV aynı kaynaktan beslenir. Sinematik katman (GSAP ScrollTrigger + Lenis) HTML'in üstüne eklenen bir geliştirmedir; kapalıyken site sabit karelerle eksiksiz okunur. Üç demo birbirinden bağımsız TypeScript modülleridir ve yalnızca kendi sayfasında yüklenir; hesap ve ayrıştırma mantığı arayüzden ayrı saf fonksiyonlardır.

**Stack:** Astro (güncel), Tailwind CSS v4 (`@tailwindcss/vite`), TypeScript (strict), Lenis (GSAP planlanmıştı, kullanılmadı; bkz. `DECISIONS.md`), Vitest, Fontsource, Playwright (yalnızca geliştirme: CV PDF ve OG görseli), ffmpeg (yerelde kurulu, 9.0.1), GitHub Actions (`withastro/action`).

**Spec:** `docs/design-spec.md` (bağlam: `PRODUCT.md`, `DECISIONS.md`, `CLAUDE.md`). Çelişkide spec geçerlidir.

## Global Constraints

- **Anonimlik:** Otelin/restoranın adı, logosu, alan adı, adresi, telefonu sitede, repoda, commit mesajında, dosya adında geçmez. Metinlerde yalnızca "Erdek'te bir otel" / "a hotel in Erdek". Canlı sitelere bağlantı yok; ileride eklenecek yerler `<!-- ONAY_SONRASI -->`.
- **Gerçek veri yok:** Gerçek menü ürünü, oda fiyatı, acenta adı, muhasebe verisi kullanılmaz.
- **Uydurma yok:** Metinler spec §4–§6'daki cümlelerden yazılır. Spec'in "Yazılmayacak" satırları bağlayıcıdır.
- **Ücretsiz:** Tüm bağımlılıklar ve servisler ücretsiz. Tek istisna Higgsfield kredisi; her üretimden önce `balance` okunur, maliyet Baran'a söylenir, onay beklenir.
- **Diller:** TR varsayılan `/`, EN `/en/`. Her sayfada dil değiştirici aynı sayfanın karşılığına gider. Kod yorumları Türkçe.
- **Tipografi:** Başlık Fraunces, gövde Schibsted Grotesk, rakam/etiket IBM Plex Mono; Fontsource ile gömülü, üçüncü tarafa istek yok. Gövde ≥ 16px, etiket ≥ 12.8px.
- **Renk:** Neredeyse siyah zemin, sıcak açık metin, tek kehribar/bakır vurgu. Mor gradient yok. Yalnızca koyu tema.
- **Hareket:** Yalnızca `transform`, `opacity`, `clip-path`. `prefers-reduced-motion` ve `Save-Data` durumunda video ve kaydırma efektleri kapalı, sabit kare gösterilir, içerik aynı.
- **Kalite:** 360px'ten itibaren; Lighthouse ana sayfa Performance ≥ 90, diğer sayfalar ≥ 95; Accessibility, Best Practices, SEO her sayfada ≥ 95; WCAG AA; klavyeyle tam gezinme; "içeriğe geç" bağlantısı.
- **Kod stili:** Değişmez veri (yeni nesne döndür, mevcut olanı değiştirme); dosya 200–400 satır, en çok 800; fonksiyon < 50 satır; sihirli sayı yerine adlandırılmış sabit.
- **Commit:** `<type>: <açıklama>` (feat, fix, refactor, docs, test, chore, perf, ci). Attribution satırı eklenmez. Her commit öncesi `npm run check:anonymity`.
- **Sessiz değişiklik yok:** Her görev sonunda `PROGRESS.md` güncellenir; plandan sapan karar `DECISIONS.md`'ye gerekçesiyle yazılır.

## Review Focus

Spec'in ima ettiği ama açıkça yazmadığı, kullanıcıyı en çok ısıracak beş durum. Her birinin testi ilgili görevdedir.

1. **Tutar yazım biçimleri** — `1.250,50`, `1250.5`, `1.250`, `12,5` hepsi doğru kuruşa çevrilmeli; `1.2.3`, `12,345`, `abc` reddedilmeli. → Görev 9
2. **Bozuk ya da eski localStorage verisi** — geçersiz JSON ya da eksik alan demoyu çökertmemeli; sahte başlangıç verisine dönülmeli. → Görev 10
3. **API'nin eksik ya da beklenmeyen yanıtı** — kur ya da hava alanı yoksa ekranda `NaN`/`undefined` değil "veri alınamadı" görünmeli. → Görev 11
4. **Acenta adının yazım farkları** — `Pusula Tur`, ` pusula tur `, `PUSULA TUR` tek acenta sayılmalı (Türkçe İ/ı dahil). → Görev 9
5. **Video oynatılamıyor** — otomatik oynatma engelli, bağlantı yavaş ya da dosya 404 ise sabit kare kalmalı, kaydırma hata vermemeli, metin okunmalı. → Görev 7

## Onay noktaları

| # | Ne zaman | Baran neyi onaylar |
|---|---|---|
| A | Görev 4 sonu | Hero ve QR Menü sahnesinin görsel taslağı (comp) |
| B | Görev 5 içinde, her üretimden önce | Higgsfield maliyeti; her sabit kare ve klip |
| C | Görev 8 sonu | **Prototip:** Hero + QR Menü (ana sayfa sahnesi, proje sayfası, demo). Onaysız Faz 2'ye geçilmez |
| D | Görev 12 içinde | Kalan sahnelerin kare ve klipleri (maliyetle birlikte) |
| E | Görev 13 içinde | CV teyitleri: unvan, otelde çalışmanın sürüp sürmediği, şehir |
| F | Görev 16 sonu | Doğrulama raporu; GitHub reposunun açılması ve ilk push |
| G | Görev 17 sonu | Canlı adres testi (VPN kapalı) |

## Dosya yapısı

```
astro.config.mjs              site, i18n, tailwind vite eklentisi
vitest.config.ts
scripts/
  check-anonymity.mjs         yasaklı kelime taraması
  encode-media.mjs            ffmpeg ile klip ve kare üretimi
  build-cv-pdf.mjs            /cv/ sayfalarından PDF
  build-og.mjs                OG görselleri
anonymity-words.local.txt     yasaklı liste (gitignore'da)
media-src/                    Higgsfield ham çıktıları (gitignore'da)
public/media/                 sıkıştırılmış klipler ve kareler
public/cv/                    CV PDF'leri
src/
  i18n/
    locales.ts                Locale tipi, sabitler
    routes.ts                 sayfa kimliği ↔ yol eşlemesi
    ui.{tr,en}.ts             ortak arayüz metinleri
  content/
    home.{tr,en}.ts           ana sayfa metinleri
    projects.{tr,en}.ts       üç projenin metinleri
    cv.{tr,en}.ts             CV içeriği
    types.ts                  içerik tipleri
  styles/global.css           Tailwind @theme belirteçleri, fontlar
  layouts/Base.astro          head, meta, hreflang, atlama bağlantısı
  layouts/Project.astro       proje sayfası ortak yapısı
  components/                 Header, LangSwitch, Footer, Scene, TechTags, ContactBlock…
  components/home/            Hero, ProjectScene, HowIWork, About, Contact
  cinematic/
    index.ts                  koşul kontrolü ve başlatma
    smooth-scroll.ts          Lenis
    scenes.ts                 sabitleme ve kaydırmaya bağlı video
    pointer.ts                imleç ışığı, çekim, eğim
  demos/
    qr-menu/                  data.ts, filter.ts, menu.ts (arayüz)
    lobby/                    config.ts, rates.ts, weather.ts, pricing.ts, panel.ts
    agency/                   ledger.ts, amount.ts, storage.ts, seed.ts, csv.ts, ui.ts
  pages/                      TR sayfaları; pages/en/ EN sayfaları
tests/                        Vitest dosyaları (kaynakla aynı ad, .test.ts)
.github/workflows/deploy.yml
```

Yollar:

| Sayfa kimliği | TR | EN |
|---|---|---|
| `home` | `/` | `/en/` |
| `qr-menu` | `/projeler/qr-menu/` | `/en/projects/qr-menu/` |
| `lobby` | `/projeler/lobi-ekrani/` | `/en/projects/lobby-display/` |
| `agency` | `/projeler/acenta-takibi/` | `/en/projects/agency-ledger/` |
| `cv` | `/cv/` | `/en/cv/` |

---

## Faz 0 — İskelet

### Task 1: Proje iskeleti ve anonimlik denetimi

**Dosyalar:** Oluştur: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `scripts/check-anonymity.mjs`, `tests/check-anonymity.test.ts`, `anonymity-words.local.txt` · Değiştir: `.gitignore`

**Arayüzler — üretir:**
- `findBannedWords(text: string, words: readonly string[]): string[]` (`scripts/check-anonymity.mjs` içinden dışa aktarılır)
- npm betikleri: `dev`, `build` (önce `check:anonymity`), `preview`, `test` (`vitest run`), `check:anonymity`

- [ ] **Adım 1:** Mevcut dosyalara dokunmadan Astro'yu kur: `npm create astro@latest -- --template minimal --typescript strict --no-git --install` geçici bir klasöre, sonra `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/` proje köküne taşınır. Ekle: `tailwindcss`, `@tailwindcss/vite`, `vitest`, `gsap`, `lenis`, `@fontsource-variable/fraunces`, `@fontsource-variable/schibsted-grotesk`, `@fontsource/ibm-plex-mono`.
- [ ] **Adım 2:** `astro.config.mjs`: `site: 'https://baranbostan1.github.io'`, `output: 'static'`, `trailingSlash: 'always'`, `i18n: { defaultLocale: 'tr', locales: ['tr','en'], routing: { prefixDefaultLocale: false } }`.
- [ ] **Adım 3:** `.gitignore`'a ekle: `anonymity-words.local.txt`, `media-src/`, `.env*`. `anonymity-words.local.txt` dosyasına `CLAUDE.local.md`'deki yasaklı kelimeler ve gerçek acenta adları satır satır yazılır.
- [ ] **Adım 4: Başarısız testi yaz** (`tests/check-anonymity.test.ts`)

```ts
const words = ['ornekmarka', '555 11 11']
expect(findBannedWords('Merhaba OrnekMarka', words)).toEqual(['ornekmarka'])   // büyük/küçük harf duyarsız
expect(findBannedWords('tel: 555 11 11', words)).toEqual(['555 11 11'])
expect(findBannedWords('Erdek\'te bir otel', words)).toEqual([])
expect(findBannedWords('x', [])).toEqual([])
```

- [ ] **Adım 5:** `npm test` → FAIL (fonksiyon yok).
- [ ] **Adım 6:** `scripts/check-anonymity.mjs` yaz. Karşılaştırma `toLocaleLowerCase('tr')` ve düz `toLowerCase()` ile iki kez yapılır. Liste kaynağı: önce `ANONYMITY_WORDS` ortam değişkeni (satır ayrımlı), yoksa `anonymity-words.local.txt`. İkisi de yoksa: `CI=true` ise uyarı yazıp 0 ile çık, değilse 1 ile çık. Taranan yerler: git'in izleyeceği tüm metin dosyaları (`git ls-files --cached --others --exclude-standard`; repo yoksa `node_modules`, `dist`, `.astro`, `.superpowers`, `media-src` dışındaki her şey) ve varsa `dist/`; ayrıca tüm dosya **adları**. İkili dosyaların içeriği atlanır. Bulursa dosya:satır listeleyip 1 ile çıkar.
- [ ] **Adım 7:** `npm test` → PASS. `npm run check:anonymity` → 0 bulgu. (Bulgu çıkarsa: mevcut dosya düzeltilir, devam edilmez.)
- [ ] **Adım 8:** `npm run build` → başarılı, `dist/index.html` var.
- [ ] **Adım 9:** `git init -b main` (yalnızca yerel; uzak depo Görev 17'de). İlk commit: `chore: astro iskeleti ve anonimlik denetimi`.

### Task 2: Tasarım belirteçleri, yerleşim ve i18n

**Dosyalar:** Oluştur: `src/styles/global.css`, `src/i18n/locales.ts`, `src/i18n/routes.ts`, `src/i18n/ui.tr.ts`, `src/i18n/ui.en.ts`, `src/content/types.ts`, `src/layouts/Base.astro`, `src/components/Header.astro`, `src/components/LangSwitch.astro`, `src/components/Footer.astro`, `tests/routes.test.ts`

**Arayüzler — üretir:**
```ts
// locales.ts
export type Locale = 'tr' | 'en'
export const DEFAULT_LOCALE: Locale = 'tr'
// routes.ts
export type PageId = 'home' | 'qr-menu' | 'lobby' | 'agency' | 'cv'
export function pathFor(page: PageId, locale: Locale): string
export function alternateFor(page: PageId, locale: Locale): { locale: Locale; path: string }
// Base.astro props
interface Props { page: PageId | 'notFound'; locale: Locale; title: string; description: string; ogImage?: string }
```

- [ ] **Adım 1: Başarısız testi yaz** (`tests/routes.test.ts`): yukarıdaki yol tablosunun on satırının tamamı `pathFor` için; `alternateFor('lobby','tr')` → `{ locale:'en', path:'/en/projects/lobby-display/' }`; `alternateFor('home','en')` → `{ locale:'tr', path:'/' }`.
- [ ] **Adım 2:** `npm test` → FAIL. `routes.ts` yazılır → PASS.
- [ ] **Adım 3:** `global.css`: Tailwind `@theme` ile belirteçler. Başlangıç değerleri (comp'ta kesinleşir, Görev 4): zemin `oklch(0.14 0.008 60)`, yüzey `oklch(0.19 0.01 60)`, metin `oklch(0.94 0.015 80)`, soluk metin `oklch(0.72 0.02 75)`, vurgu `oklch(0.74 0.13 62)`. Font aileleri üç Fontsource paketinden; yalnızca `latin` ve `latin-ext` alt kümeleri içe aktarılır. Görünür `:focus-visible` halkası vurgu renginde.
- [ ] **Adım 4:** `Base.astro`: `<html lang>`, `<title>`, açıklama, `canonical`, `hreflang` (tr, en, x-default), Open Graph ve Twitter meta, `theme-color`, ilk öğe olarak "İçeriğe geç / Skip to content" bağlantısı, `<main id="icerik">`. `notFound` için `hreflang` yazılmaz.
- [ ] **Adım 5:** `Header.astro` (ad + `LangSwitch`), `LangSwitch.astro` (`alternateFor` ile; `lang` ve `hreflang` nitelikli bağlantı, erişilebilir ad "English" / "Türkçe"), `Footer.astro`.
- [ ] **Adım 6: Tarayıcı kontrolü.** `npm run dev`; geçici bir deneme sayfasında şu dize üç fontta görünür: `İıŞşĞğÜüÖöÇç ₺ 1.250,50`. Eksik glif (yedek fonta düşme) yoksa geçer. 360px ve 1440px'te bakılır.
- [ ] **Adım 7:** Commit: `feat: tasarım belirteçleri, yerleşim ve i18n yolları`.

---

## Faz 1 — Prototip (Hero + QR Menü)

### Task 3: Ana sayfa ve QR Menü içeriği

**Dosyalar:** Oluştur: `src/content/home.tr.ts`, `home.en.ts`, `projects.tr.ts`, `projects.en.ts` · Değiştir: `src/content/types.ts`

**Arayüzler — üretir:**
```ts
export interface ProjectContent {
  id: 'qr-menu' | 'lobby' | 'agency'
  title: string; summary: string            // sayfa başlığı ve özet
  sceneProblem: string; sceneResult: string // ana sayfa sahnesi, birer cümle
  tags: readonly string[]                   // 2–3 teknoloji etiketi
  problem: string; solution: string
  technical: readonly string[]; outcome: string
  demoNote: string
}
export interface HomeContent { hero: { title: string; lead: string; scrollHint: string }; /* howIWork, about, contact Görev 12'de eklenir */ }
export function getProjects(locale: Locale): readonly ProjectContent[]
export function getHome(locale: Locale): HomeContent
```

- [ ] **Adım 1:** Hero metni spec §4.1'den aynen (TR). EN karşılığı yazılır: "I turn the everyday problems of a business into working tools." ve alt metnin doğrudan çevirisi.
- [ ] **Adım 2:** QR Menü metinleri spec §5.1'den, iki dilde. `tags`: `HTML/CSS/JS`, `Firebase Firestore`, `Cloudflare`. "Yasal zorunluluk" yazılmaz.
- [ ] **Adım 3:** `npm run check:anonymity` → 0. Commit: `feat: hero ve qr menü içeriği`.

### Task 4: Görsel taslak (comp) — Hero ve QR Menü sahnesi

Yol: impeccable, `buildPath: comp`. Kod yazılmadan önce yön onaylanır.

- [ ] **Adım 1:** `impeccable` skill'i yüklenir; `PRODUCT.md` ve spec §3 ile comp akışı izlenir. Kapsam: (a) Hero, masaüstü 1440 ve mobil 360; (b) QR Menü sahnesi, aynı iki genişlik; (c) proje sayfasının üst bölümü (başlık, özet, Problem).
- [ ] **Adım 2:** Taslakta sabit kare yerine geçici koyu yer tutucu kullanılır; Higgsfield kredisi bu adımda harcanmaz.
- [ ] **Adım 3:** Taslak Browser pane'de Baran'a gösterilir. **Onay A.** Kesinleşen renk ve ölçek değerleri `global.css`'e işlenir; Görev 2'deki başlangıç değerlerinden sapma `DECISIONS.md`'ye yazılır.

### Task 5: Higgsfield — Hero ve QR Menü görüntüleri

**Dosyalar:** Oluştur: `media-src/hero.*`, `media-src/qr-menu.*` (repoya girmez), `docs/media-prompts.md`

- [ ] **Adım 1:** `balance` okunur; `models_explore` ile sabit kare ve görüntüden-videoya modelleri ve kredi maliyetleri alınır. Baran'a tek mesajda söylenir: iki kare + iki klip için toplam tahmini kredi ve kalan bakiye. **Onay B.**
- [ ] **Adım 2:** Hero sabit karesi (16:9): spec §3 tablosundaki sahne — gece, loş çalışma masası, dağınık kâğıtlar, yanan bir ekran. İstem kuralları: yazı, logo, tabela, marka, tanınabilir yüz yok; ekran içeriği soyut; sıcak kehribar ışık, soğuk koyu gölge. Kare Baran'a gösterilir; onaylanınca klibe geçilir.
- [ ] **Adım 3:** Hero klibi (5 sn, görüntüden videoya): ekran yanar, ışık masayı doldurur; kamera çok yavaş ileri.
- [ ] **Adım 4:** QR Menü karesi ve klibi aynı sırayla: basılı menü kartı telefondaki dijital menüye dönüşür. Kart ve ekranda okunabilir yazı olmamalı.
- [ ] **Adım 5:** Her çıktı tam boyutta incelenir: okunabilir yazı, logo ya da tanınabilir yer varsa reddedilir ve (maliyet söylenerek) yeniden üretilir. Kullanılan istemler ve model adları `docs/media-prompts.md`'ye yazılır.

### Task 6: Medya kodlama betiği

**Dosyalar:** Oluştur: `scripts/encode-media.mjs`, `public/media/*`

**Arayüzler — üretir:** her sahne adı `<ad>` için `public/media/<ad>-scrub.mp4`, `<ad>-loop.mp4`, `<ad>-poster.webp`, `<ad>-poster-sm.webp`. Sahne adları: `hero`, `qr-menu`, `lobby`, `agency`, `closing`.

- [ ] **Adım 1:** `node scripts/encode-media.mjs <ad>` şunları üretir (ffmpeg):
  - `-scrub.mp4`: 1920×1080, H.264, ses yok, `-g 2` (kaydırmayla sarma için sık anahtar kare), `-crf 27`, `+faststart`. Hedef ≤ 4 MB.
  - `-loop.mp4`: 1280×720, H.264, `-crf 30`, ses yok, `+faststart`. Hedef ≤ 1,5 MB.
  - `-poster.webp` (1920 geniş, kalite 78) ve `-poster-sm.webp` (960 geniş): klibin **son** karesi (dönüşümün bittiği, aracın göründüğü an).
- [ ] **Adım 2:** `hero` ve `qr-menu` için çalıştırılır. Doğrulama: dört dosya da var; `ffprobe` ile ses izi yok; boyutlar hedefin altında. Aşılırsa `crf` 2 artırılıp yeniden denenir.
- [ ] **Adım 3:** `npm run check:anonymity` (dosya adları dahil) → 0. Commit: `feat: medya kodlama betiği, hero ve qr menü medyası`.

### Task 7: Hero, sahne bileşeni ve sinematik katman

**Dosyalar:** Oluştur: `src/components/Scene.astro`, `src/components/home/Hero.astro`, `src/components/home/ProjectScene.astro`, `src/components/TechTags.astro`, `src/cinematic/index.ts`, `smooth-scroll.ts`, `scenes.ts`, `pointer.ts`, `tests/cinematic-gate.test.ts` · Değiştir: `src/pages/index.astro`, `src/pages/en/index.astro`

**Arayüzler — üretir:**
```ts
// cinematic/index.ts
export interface Env { reducedMotion: boolean; saveData: boolean; finePointer: boolean; wide: boolean /* ≥ 1024px */ }
export type Mode = 'static' | 'loop' | 'scrub'
export function pickMode(env: Env): Mode
export function initCinematic(): void
// Scene.astro props
interface Props { name: 'hero'|'qr-menu'|'lobby'|'agency'|'closing'; eager?: boolean; alt: string }
```
`Scene.astro` çıktısı: `<section data-scene="<ad>">` içinde `<picture>` (poster; `eager` ise `fetchpriority="high"`, değilse `loading="lazy"`), kaynağı olmayan `<video muted playsinline preload="none" data-scrub="…" data-loop="…">`, metnin altında koyu geçiş katmanı ve `<slot/>`.

- [ ] **Adım 1: Başarısız testi yaz** (`tests/cinematic-gate.test.ts`)

```ts
const base = { reducedMotion: false, saveData: false, finePointer: true, wide: true }
expect(pickMode(base)).toBe('scrub')
expect(pickMode({ ...base, reducedMotion: true })).toBe('static')
expect(pickMode({ ...base, saveData: true })).toBe('static')
expect(pickMode({ ...base, wide: false })).toBe('loop')
expect(pickMode({ ...base, finePointer: false })).toBe('loop')
```

- [ ] **Adım 2:** `npm test` → FAIL; `pickMode` yazılır → PASS.
- [ ] **Adım 3:** `Hero.astro` ve `ProjectScene.astro` JavaScript olmadan tam okunur biçimde yazılır: poster, başlık (`h1` yalnızca Hero'da), metin, etiketler, "İncele / View project" bağlantısı (`pathFor`).
- [ ] **Adım 4:** `initCinematic`: `pickMode` sonucuna göre —
  - `static`: hiçbir şey yüklenmez.
  - `loop`: sahne görünüme 200px kala `data-loop` kaynağı atanır, `loop` ile oynatılır; görünümden çıkınca duraklatılır. Sabitleme yok.
  - `scrub`: GSAP, ScrollTrigger ve Lenis dinamik `import()` ile yüklenir. Her sahne sabitlenir (`pin`), `video.currentTime` kaydırma ilerlemesine bağlanır (`scrub`), metin katmanları sırayla `opacity`/`transform` ile gelir. Hero başlığı kelime kelime belirir; kelimeler `aria-hidden` parçalara bölünür, tam cümle ekran okuyucu için ayrı tutulur.
  - Video kaynağı yalnızca `loadedmetadata` sonrası sarılır; `error` olayında ya da `play()` reddedilince video öğesi gizlenir, poster kalır, sahne metni yine görünür.
  - Tüm başlatma `try/catch` içindedir; hata `console.error` ile yazılır ve sayfa `static` hâlinde kalır.
- [ ] **Adım 5:** `pointer.ts` yalnızca `scrub` modunda: imleci izleyen ışık (tek `transform` ile taşınan sabit katman), butonlarda en çok 6px çekim, proje panelinde en çok 3° eğim.
- [ ] **Adım 6: Tarayıcı kontrolü (Review Focus 5 dahil).** Browser pane'de:
  - 1440px: Hero sabitlenir, video kaydırmayla ileri/geri akar, takılma yok; QR sahnesi aynı.
  - 360px (mobil ön ayar, sayfa yenilenir): sabitleme yok, döngü klip oynar, yatay kaydırma yok.
  - Hareket azaltma açık (`matchMedia` öykünmesi): video isteği **gitmez** (ağ isteklerinden doğrulanır), poster ve tüm metin görünür.
  - `public/media/hero-scrub.mp4` geçici olarak yeniden adlandırılır: poster kalır, konsolda yakalanmamış hata yok, kaydırma çalışır. Dosya geri alınır.
  - JavaScript kapalı derleme çıktısı (`dist/index.html` düz açılır): metnin tamamı okunur.
  - Klavye: Tab sırası atlama bağlantısı → dil değiştirici → "İncele"; odak halkası video üstünde görünür.
- [ ] **Adım 7:** Kaydırmayla sarma takılıyorsa (ölçüt: 1440px'te gözle görülür kare atlaması) `-g 1` ile yeniden kodlanır; yine takılıyorsa WebP kare dizisi + `<canvas>` yöntemine geçilir ve karar `DECISIONS.md`'ye yazılır.
- [ ] **Adım 8:** Commit: `feat: hero, qr menü sahnesi ve sinematik katman`.

### Task 8: QR Menü proje sayfası ve demo

**Dosyalar:** Oluştur: `src/layouts/Project.astro`, `src/demos/qr-menu/data.ts`, `filter.ts`, `menu.ts`, `src/components/demos/QrMenuDemo.astro`, `src/pages/projeler/qr-menu.astro`, `src/pages/en/projects/qr-menu.astro`, `tests/qr-menu-filter.test.ts`

**Arayüzler — üretir:**
```ts
export type Period = 'day' | 'evening'
export interface MenuItem { id: string; categoryId: string; name: Record<Locale,string>; description: Record<Locale,string>; priceKurus: number; period?: Period }
export interface MenuCategory { id: string; name: Record<Locale,string>; order: number; period?: Period }
export function periodAt(date: Date): Period            // Europe/Istanbul 08:00–18:59 → 'day', diğer → 'evening'
export function filterMenu(items, categories, opts: { categoryId: string | null; query: string; period: Period; locale: Locale }): MenuItem[]
```
`Project.astro` düzeni: başlık ve özet → Problem → Çözüm → Demo (`<slot name="demo"/>`) → Teknik (liste) → Sonuç → sonraki proje bağlantısı.

- [ ] **Adım 1: Başarısız testleri yaz** (`tests/qr-menu-filter.test.ts`)

```ts
expect(periodAt(new Date('2026-07-01T05:00:00Z'))).toBe('day')      // İstanbul 08:00
expect(periodAt(new Date('2026-07-01T15:59:00Z'))).toBe('day')      // 18:59
expect(periodAt(new Date('2026-07-01T16:00:00Z'))).toBe('evening')  // 19:00
expect(periodAt(new Date('2026-07-01T04:59:00Z'))).toBe('evening')  // 07:59
// arama ad ve açıklamada, Türkçe büyük/küçük harf duyarsız
filterMenu(..., { query: 'IZGARA', ... })   // "ızgara" içeren ürünü bulur
filterMenu(..., { query: '  ', ... })       // boş sorgu → dönem ve kategoriye uyan hepsi
// 'evening' kategorisindeki ürün gündüz listelenmez; 'day' ürünü akşam listelenmez; dönemsiz ürün ikisinde de var
// kategori 'evening', ürün dönemsiz → gündüz listelenmez (kategori kısıtı ürüne geçer)
// sonuç kategori order'ına, sonra veri sırasına göre sıralı
```

- [ ] **Adım 2:** `npm test` → FAIL; `filter.ts` yazılır → PASS.
- [ ] **Adım 3:** `data.ts`: 5 kategori (biri yalnızca gündüz, biri yalnızca akşam), 18–22 uydurma ürün, iki dilde ad ve açıklama, yuvarlak uydurma fiyatlar. Kurgusal restoran adı için üç aday belirlenir, her biri web'de aranır (Erdek/Balıkesir'de aynı adlı işletme varsa elenir) ve Baran'a sunulur. Gerçek menüyle hiçbir ürün adı ya da fiyat bire bir eşleşmemelidir; canlı menü bu amaçla **açılmaz**, ürünler genel mutfak bilgisiyle uydurulur.
- [ ] **Adım 4:** `QrMenuDemo.astro` + `menu.ts`: telefon çerçevesi içinde menü; kategori çipleri (`aria-pressed`), arama alanı (etiketli), "Gündüz / Akşam" anahtarı (başlangıç değeri `periodAt(new Date())`), sonuç yoksa "Aramanızla eşleşen ürün yok" boş durumu, sonuç sayısı `aria-live="polite"` ile duyurulur. Üstte "Kurgusal restoran — ürün ve fiyatlar uydurmadır" notu. Admin paneli metinle anlatılır.
- [ ] **Adım 5:** İki dilde sayfa; `Project.astro` kullanılır.
- [ ] **Adım 6: Tarayıcı kontrolü.** 360 / 768 / 1440: filtre, arama, anahtar çalışır; yalnızca klavyeyle tüm demo kullanılır; dil değiştirici karşı sayfaya gider; konsol temiz.
- [ ] **Adım 7:** `npm run build` ve `npm run check:anonymity` → temiz. Commit: `feat: qr menü proje sayfası ve demo`.
- [ ] **Adım 8: Onay C.** Baran'a prototip gösterilir (ana sayfa: Hero + QR sahnesi; proje sayfası; demo). `PROGRESS.md` güncellenir. Onay gelmeden Faz 2 başlamaz.

---

## Faz 2 — Tüm site

### Task 9: Acenta bakiye mantığı (TDD zorunlu)

**Dosyalar:** Oluştur: `src/demos/agency/amount.ts`, `ledger.ts`, `tests/agency-amount.test.ts`, `tests/agency-ledger.test.ts`

**Arayüzler — üretir:**
```ts
// amount.ts
export function parseAmountToKurus(input: string): number | null
export function formatKurus(kurus: number, locale: Locale): string      // tr: "1.250,50 ₺"  en: "₺1,250.50"
// ledger.ts
export interface Invoice { id: string; agency: string; date: string; invoiceNo: string; amountKurus: number }  // date: YYYY-MM-DD
export interface Payment { id: string; agency: string; date: string; amountKurus: number }
export interface Ledger { invoices: readonly Invoice[]; payments: readonly Payment[] }
export interface AgencyBalance { agency: string; invoicedKurus: number; paidKurus: number; balanceKurus: number }
export type FieldError = 'agencyRequired' | 'dateInvalid' | 'amountInvalid' | 'invoiceNoRequired'
export type Validation<T> = { ok: true; value: T } | { ok: false; errors: Partial<Record<'agency'|'date'|'amount'|'invoiceNo', FieldError>> }
export interface InvoiceDraft { agency: string; date: string; invoiceNo: string; amount: string }
export interface PaymentDraft { agency: string; date: string; amount: string }
export function agencyKey(name: string): string                    // trim, iç boşlukları tekle, toLocaleLowerCase('tr')
export function validateInvoice(d: InvoiceDraft, id: string): Validation<Invoice>
export function validatePayment(d: PaymentDraft, id: string): Validation<Payment>
export function addInvoice(l: Ledger, i: Invoice): Ledger          // yeni Ledger döndürür
export function addPayment(l: Ledger, p: Payment): Ledger
export function agencyBalances(l: Ledger): AgencyBalance[]         // acenta adına göre tr sıralı
export function summarize(l: Ledger): { invoicedKurus: number; paidKurus: number; balanceKurus: number }
```
Kural: Bakiye = fatura toplamı − ödeme toplamı. Tüm aritmetik kuruş cinsinden tam sayıdır.

- [ ] **Adım 1: Başarısız testleri yaz — tutar** (`tests/agency-amount.test.ts`, Review Focus 1)

```ts
expect(parseAmountToKurus('1.250,50')).toBe(125050)
expect(parseAmountToKurus('1250.5')).toBe(125050)
expect(parseAmountToKurus('1250')).toBe(125000)
expect(parseAmountToKurus('1.250')).toBe(125000)      // nokta + tam 3 hane = binlik
expect(parseAmountToKurus('1,250')).toBe(125000)
expect(parseAmountToKurus('12,5')).toBe(1250)
expect(parseAmountToKurus(' 0,10 ')).toBe(10)
expect(parseAmountToKurus('1.234.567,89')).toBe(123456789)
for (const bad of ['', 'abc', '1.2.3', '12,345,6', '10,999', '-5', '0', '0,00', '1e3', '₺'])
  expect(parseAmountToKurus(bad)).toBeNull()
expect(parseAmountToKurus('0,1')! + parseAmountToKurus('0,2')!).toBe(30)   // kayan nokta hatası yok
expect(formatKurus(125050, 'tr')).toBe('1.250,50 ₺')
expect(formatKurus(-125050, 'tr')).toBe('-1.250,50 ₺')
expect(formatKurus(125050, 'en')).toBe('₺1,250.50')
```
Ayrıştırma kuralı: son ayırıcıdan sonra 1–2 hane varsa o ondalıktır; ondan önceki ayırıcılar yalnızca tam 3'lü grupları ayırıyorsa binliktir; tek ayırıcıdan sonra tam 3 hane varsa binliktir. Başka her biçim `null`.

- [ ] **Adım 2:** `npm test` → FAIL. `amount.ts` yazılır → PASS.
- [ ] **Adım 3: Başarısız testleri yaz — defter** (`tests/agency-ledger.test.ts`)

```ts
// bakiye
const l = { invoices: [inv('Pusula Tur', 100000), inv('Pusula Tur', 50000), inv('Yelken Seyahat', 20000)], payments: [pay('Pusula Tur', 60000)] }
expect(agencyBalances(l)).toEqual([
  { agency: 'Pusula Tur', invoicedKurus: 150000, paidKurus: 60000, balanceKurus: 90000 },
  { agency: 'Yelken Seyahat', invoicedKurus: 20000, paidKurus: 0, balanceKurus: 20000 },
])
expect(summarize(l)).toEqual({ invoicedKurus: 170000, paidKurus: 60000, balanceKurus: 110000 })
// fazla ödeme → eksi bakiye
expect(agencyBalances({ invoices: [inv('A', 100)], payments: [pay('A', 250)] })[0].balanceKurus).toBe(-150)
// yalnızca ödemesi olan acenta listede
expect(agencyBalances({ invoices: [], payments: [pay('B', 100)] })[0]).toMatchObject({ agency: 'B', balanceKurus: -100 })
// boş defter
expect(agencyBalances({ invoices: [], payments: [] })).toEqual([]); expect(summarize(...)).toEqual({ invoicedKurus: 0, paidKurus: 0, balanceKurus: 0 })
// Review Focus 4: yazım farkları tek acenta; görünen ad ilk kaydın adı
const m = { invoices: [inv('Pusula Tur', 100), inv(' pusula  tur ', 100), inv('PUSULA TUR', 100)], payments: [] }
expect(agencyBalances(m)).toHaveLength(1); expect(agencyBalances(m)[0]).toMatchObject({ agency: 'Pusula Tur', invoicedKurus: 300 })
expect(agencyKey('IŞIK Tur')).toBe(agencyKey('ışık tur')); expect(agencyKey('İZ Tur')).toBe(agencyKey('iz tur'))
// değişmezlik
const before = { invoices: [], payments: [] }; const after = addInvoice(before, inv('A', 1))
expect(before.invoices).toHaveLength(0); expect(after).not.toBe(before); expect(after.invoices).toHaveLength(1)
// doğrulama
expect(validateInvoice({ agency: '  ', date: '2026-07-01', invoiceNo: 'F-1', amount: '100' }, 'x')).toEqual({ ok: false, errors: { agency: 'agencyRequired' } })
expect(validateInvoice({ agency: 'A', date: '2026-02-30', invoiceNo: '', amount: '0' }, 'x')).toEqual({ ok: false, errors: { date: 'dateInvalid', invoiceNo: 'invoiceNoRequired', amount: 'amountInvalid' } })
for (const d of ['', '01.07.2026', '2026-13-01', '2026-7-1']) /* dateInvalid */
expect(validateInvoice({ agency: ' Pusula Tur ', date: '2026-07-01', invoiceNo: ' F-1 ', amount: '1.250,50' }, 'id1')).toEqual({ ok: true, value: { id: 'id1', agency: 'Pusula Tur', date: '2026-07-01', invoiceNo: 'F-1', amountKurus: 125050 } })
expect(validatePayment({ agency: 'A', date: '2026-07-01', amount: '-5' }, 'x')).toEqual({ ok: false, errors: { amount: 'amountInvalid' } })
```

- [ ] **Adım 4:** `npm test` → FAIL. `ledger.ts` yazılır → PASS. Tutar üst sınırı: 999.999.999,99 ₺ (`MAX_AMOUNT_KURUS`); üstü `amountInvalid` — testi eklenir.
- [ ] **Adım 5:** Commit: `feat: acenta bakiye mantığı (TDD)`.

### Task 10: Acenta demosu ve proje sayfası

**Dosyalar:** Oluştur: `src/demos/agency/seed.ts`, `storage.ts`, `csv.ts`, `ui.ts`, `src/components/demos/AgencyDemo.astro`, `src/pages/projeler/acenta-takibi.astro`, `src/pages/en/projects/agency-ledger.astro`, `tests/agency-storage.test.ts`, `tests/agency-csv.test.ts` · Değiştir: `projects.{tr,en}.ts`

**Arayüzler — tüketir:** Görev 9'un tamamı. **Üretir:**
```ts
export const SEED: Ledger                                   // seed.ts
export interface KeyValueStore { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void }
export const STORAGE_KEY = 'portfolio.agency-demo.v1'
export function loadLedger(store: KeyValueStore | null): Ledger    // hata ya da geçersiz veri → SEED
export function saveLedger(store: KeyValueStore | null, l: Ledger): boolean
export function getStore(): KeyValueStore | null                   // localStorage erişilemiyorsa null
export function toCsv(l: Ledger, locale: Locale): string
```

- [ ] **Adım 1:** `seed.ts`: 5 uydurma acenta (`Pusula Tur`, `Yelken Seyahat`, `Mavi Rota Turizm`, `Kuzey Yıldızı Tur`, `Zeytin Dalı Travel`), 14 fatura, 8 ödeme, son üç aya yayılmış tarihler; bir acentanın bakiyesi sıfır, birininki eksi. Adlar yasaklı listeyle ve gerçek acenta adlarıyla çakışmamalı (`check:anonymity`).
- [ ] **Adım 2: Başarısız testleri yaz** (Review Focus 2)

```ts
expect(loadLedger(null)).toEqual(SEED)
expect(loadLedger(fakeStore({}))).toEqual(SEED)                                   // anahtar yok
expect(loadLedger(fakeStore({ [STORAGE_KEY]: '{bozuk' }))).toEqual(SEED)           // geçersiz JSON
expect(loadLedger(fakeStore({ [STORAGE_KEY]: '{"invoices":[{"id":1}],"payments":[]}' }))).toEqual(SEED)  // eksik/yanlış tipli alan
expect(loadLedger(fakeStore({ [STORAGE_KEY]: '{"invoices":"x"}' }))).toEqual(SEED)
expect(loadLedger(throwingStore())).toEqual(SEED)                                 // getItem fırlatır
expect(saveLedger(throwingStore(), SEED)).toBe(false)                             // kota dolu → false, fırlatmaz
// gidiş-dönüş
const s = fakeStore({}); saveLedger(s, custom); expect(loadLedger(s)).toEqual(custom)
// CSV: BOM ile başlar; ayırıcı ';'; başlık tr: "Tür;Acenta;Tarih;Fatura No;Tutar"; tutar "1250,50"
// acenta adı ';' ya da '"' içeriyorsa tırnaklanır; '=', '+', '-', '@' ile başlayan hücrenin başına ' eklenir (formül enjeksiyonu)
```

- [ ] **Adım 3:** `npm test` → FAIL; `storage.ts`, `csv.ts` yazılır → PASS. Yüklenen her kayıt Görev 9'un doğrulamasıyla aynı kurallardan geçer; biri bile geçmezse tümü reddedilir.
- [ ] **Adım 4:** `AgencyDemo.astro` + `ui.ts`: üstte "Bu demodaki tüm veriler uydurmadır" notu; özet (toplam fatura, toplam ödeme, bakiye); acenta bakiye tablosu; kayıt listesi (acentaya göre filtre, tarihe/tutara göre sıralama); "Fatura ekle" ve "Ödeme ekle" formları (acenta alanı `datalist` ile mevcut adları önerir); "CSV indir"; "Demo'yu sıfırla" (onay sorar). Hatalar ilgili alanın altında, `aria-describedby` ile bağlı; mesajlar iki dilde `FieldError` anahtarından gelir. Kayıt eklenince bakiye ve özet anında değişir, değişen satır kısa bir `opacity` vurgusu alır ve `aria-live` ile duyurulur. Depolama yoksa "Veriler bu sekme kapanınca silinir" notu görünür. Tüm metin `textContent` ile yazılır, `innerHTML` kullanılmaz. Güvenlikle ilgili hiçbir iddia yazılmaz.
- [ ] **Adım 5:** Proje metinleri (spec §5.3) iki dilde eklenir; sayfalar oluşturulur.
- [ ] **Adım 6: Tarayıcı kontrolü.** 360 / 768 / 1440. Senaryo: `Pusula Tur` için `1.250,50` fatura ekle → bakiye 1.250,50 artar; aynı tutarda ödeme ekle → eski değere döner; boş form gönder → üç alan hatası görünür, odak ilk hatalı alana gider; sayfayı yenile → kayıtlar durur; "Sıfırla" → başlangıç verisi; geliştirici araçlarından anahtara `{bozuk` yazıp yenile → demo başlangıç verisiyle açılır. 360px'te tablo yatay taşmaz (satırlar kart düzenine geçer).
- [ ] **Adım 7:** Commit: `feat: acenta takibi demosu ve proje sayfası`.

### Task 11: Lobi ekranı demosu ve proje sayfası

**Dosyalar:** Oluştur: `src/demos/lobby/config.ts`, `rates.ts`, `weather.ts`, `pricing.ts`, `panel.ts`, `src/components/demos/LobbyDemo.astro`, `src/pages/projeler/lobi-ekrani.astro`, `src/pages/en/projects/lobby-display.astro`, `tests/lobby-rates.test.ts`, `tests/lobby-weather.test.ts`, `tests/lobby-pricing.test.ts` · Değiştir: `projects.{tr,en}.ts`

**Arayüzler — üretir:**
```ts
export interface Rates { usd: number; eur: number; gbp: number }           // 1 birim = kaç TRY
export function parseRates(json: unknown): Rates | null
export interface Weather { temperatureC: number; kind: 'clear'|'cloudy'|'fog'|'rain'|'snow'|'storm' }
export function parseWeather(json: unknown): Weather | null
export function isWeekendRate(date: Date): boolean                        // Europe/Istanbul; Cuma ve Cumartesi geceleri → true
export async function fetchJson(urls: readonly string[], opts: { timeoutMs: number; retries: number }): Promise<unknown>  // sırayla dener
```
Uç noktalar (key'siz):
- Kur: `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/try.json`, yedek `https://latest.currency-api.pages.dev/v1/currencies/try.json`. Yanıt `{ try: { usd, eur, gbp, … } }` (1 TRY'nin karşılığı); gösterilen değer `1 / x`.
- Hava: `https://api.open-meteo.com/v1/forecast?latitude=40.40&longitude=27.79&current=temperature_2m,weather_code&timezone=Europe%2FIstanbul` (Erdek).
- Sabitler: `FETCH_TIMEOUT_MS = 8000`, `FETCH_RETRIES = 2`, `REFRESH_MS = 15 * 60 * 1000`.

- [ ] **Adım 1: API'leri doğrula.** Üç adres tarayıcıdan/`curl` ile çağrılır; yanıt biçimi yukarıdakiyle eşleşmeli ve `Access-Control-Allow-Origin` başlığı tarayıcıdan çağrıya izin vermeli. Eşleşmezse biçim buna göre düzeltilir ve `DECISIONS.md`'ye yazılır. Gerçek yanıtlardan birer örnek `tests/fixtures/` altına kaydedilir.
- [ ] **Adım 2: Başarısız testleri yaz** (Review Focus 3)

```ts
expect(parseRates({ date: '2026-10-07', try: { usd: 0.025, eur: 0.02, gbp: 0.0175 } })).toEqual({ usd: 40, eur: 50, gbp: expect.closeTo(57.142857, 4) })
for (const bad of [null, {}, { try: {} }, { try: { usd: 0, eur: 0.02, gbp: 0.01 } }, { try: { usd: 'x', eur: 0.02, gbp: 0.01 } }, { try: { usd: -1, eur: 0.02, gbp: 0.01 } }, 'metin', []])
  expect(parseRates(bad)).toBeNull()
expect(parseWeather({ current: { temperature_2m: 18.4, weather_code: 0 } })).toEqual({ temperatureC: 18.4, kind: 'clear' })
// WMO kodları: 0–1 clear, 2–3 cloudy, 45/48 fog, 51–67 ve 80–82 rain, 71–77 ve 85–86 snow, 95–99 storm; bilinmeyen kod → cloudy
for (const bad of [null, {}, { current: {} }, { current: { temperature_2m: 'x', weather_code: 0 } }, { current: { temperature_2m: 999, weather_code: 0 } }])
  expect(parseWeather(bad)).toBeNull()               // −60…60 °C dışı reddedilir
expect(isWeekendRate(new Date('2026-10-09T12:00:00+03:00'))).toBe(true)    // Cuma
expect(isWeekendRate(new Date('2026-10-10T23:30:00+03:00'))).toBe(true)    // Cumartesi
expect(isWeekendRate(new Date('2026-10-11T12:00:00+03:00'))).toBe(false)   // Pazar
expect(isWeekendRate(new Date('2026-10-10T21:30:00Z'))).toBe(false)        // UTC Cumartesi 21:30 = İstanbul Pazar 00:30
// fetchJson: ilk adres 500 → ikinciyi dener; hepsi başarısız → fırlatır; zaman aşımı AbortController ile (sahte fetch ve sahte zamanlayıcı)
```

- [ ] **Adım 3:** `npm test` → FAIL; dört modül yazılır → PASS. Hafta sonu tanımı gerçek aracın kaynak kodundaki kuralla karşılaştırılır (salt okuma, `CLAUDE.local.md`'deki yol); farklıysa test ve fonksiyon ona uydurulur. Koddan hiçbir metin, fiyat ya da ad kopyalanmaz.
- [ ] **Adım 4:** `config.ts`: kurgusal otel adı (Görev 8'deki yöntemle üç aday, Baran seçer), uydurma hafta içi/hafta sonu oda fiyatları, uydurma saatler (kahvaltı, giriş/çıkış), 4 duyuru, iki dilde. `LobbyDemo.astro` + `panel.ts`: 16:9 TV çerçevesi içinde 1920×1080 sahne, kabın genişliğine göre tek `transform: scale()` ile sığdırılır; gerçek saat ve tarih (Europe/Istanbul); kur ve hava; kayan bant; iki anahtar — "Hafta içi / Hafta sonu" ve "Bağlantıyı kes" (açıkken istek yapılmaz, son veri "Çevrimdışı · SS:DD" etiketiyle kalır; kapatılınca tazelenir); tam ekran butonu (`requestFullscreen`; desteklenmiyorsa buton gizlenir). Veri hiç alınamadıysa ilgili kutuda "Veri alınamadı" yazar. Tam ekrandayken Wake Lock istenir, çıkınca bırakılır; desteklenmiyorsa sessizce atlanır. Hareket azaltma açıkken bant durur ve duyurular alt alta liste olarak görünür. Bant için duraklat düğmesi vardır (WCAG 2.2.2). Galeri alanı Görev 12'de dolar.
- [ ] **Adım 5:** Proje metinleri (spec §5.2; Problem cümlesi Baran tarafından 2026-10-07'de teyit edildi) iki dilde; sayfalar.
- [ ] **Adım 6: Tarayıcı kontrolü.** 360 / 768 / 1440: panel taşmadan ölçeklenir; saat ilerler; kur ve hava gelir; "Bağlantıyı kes" etiketi gösterir ve geri açınca tazeler; geliştirici araçlarında ağ engellenip sayfa yenilenince "Veri alınamadı" görünür, konsolda yakalanmamış hata yok; klavyeyle iki anahtar ve tam ekran kullanılır.
- [ ] **Adım 7:** Commit: `feat: lobi ekranı demosu ve proje sayfası`.

### Task 12: Ana sayfanın kalanı ve kalan medya

**Dosyalar:** Oluştur: `src/components/home/HowIWork.astro`, `About.astro`, `Contact.astro`, `LiveStrip.astro`, `BalanceTicker.astro`, `src/components/ContactBlock.astro`, `public/media/{lobby,agency,closing}-*`, `public/media/about.webp`, `public/media/gallery-*.webp` · Değiştir: `home.{tr,en}.ts`, `types.ts`, `src/pages/index.astro`, `src/pages/en/index.astro`, `src/cinematic/scenes.ts`, `LobbyDemo.astro`

**Arayüzler — tüketir:** `Scene.astro`, `ProjectScene.astro`, `parseRates`, `fetchJson`, `SEED`, `addInvoice`, `addPayment`, `summarize`, `formatKurus`.

- [ ] **Adım 1: Onay D.** Kalan üretimler için `balance` ve toplam maliyet söylenir: üç klip (lobi, acenta, kapanış), Hakkımda için bir kare, lobi galerisi için 3 genel kare. Görev 5'teki sıra ve ret kuralları geçerli; sahneler spec §3 tablosundan. Görev 6 betiğiyle kodlanır.
- [ ] **Adım 2:** `home.{tr,en}.ts` tamamlanır: Nasıl çalışıyorum (spec §4.2, beş adım ve "Kim" sütunu), Hakkımda (spec §4.3, dört başlık ve eğitim), İletişim. "Yazılmayacaklar" satırlarına uyulur.
- [ ] **Adım 3:** Lobi ve Acenta sahneleri `ProjectScene` ile eklenir.
  - `LiveStrip.astro` (lobi sahnesi): gerçek saat ve üç kur. Veri gelene kadar ve gelmezse `—` gösterir; istek sahne görünüme girince bir kez yapılır.
  - `BalanceTicker.astro` (acenta sahnesi): `SEED` üzerinden bir fatura ve bir ödeme sırayla uygulanır; sayaç `summarize` sonucunu `formatKurus` ile gösterir. `static` modda son değer sabit yazılır. Sayaç `aria-hidden`; yanında durağan metin karşılığı bulunur.
- [ ] **Adım 4:** `HowIWork.astro`: sıralı liste (`<ol>`); adımları bağlayan çizgi `scrub` modunda `clip-path`/`scaleY` ile çizilir, diğer modlarda tam görünür.
- [ ] **Adım 5:** `About.astro` ve `Contact.astro`/`ContactBlock.astro`: e-posta `mailto:` bağlantısı + "Kopyala" butonu (`navigator.clipboard`; başarı `aria-live` ile "Kopyalandı"; desteklenmiyorsa buton gizlenir), GitHub (`https://github.com/baranbostan1`), CV bağlantıları (Görev 13). Kapanış sahnesi `closing` medyasıyla.
- [ ] **Adım 6:** Lobi demosunun galerisine üç kare eklenir (anlamlı `alt`, `loading="lazy"`, genişlik/yükseklik nitelikleri).
- [ ] **Adım 7: Tarayıcı kontrolü.** Görev 7 Adım 6'daki liste ana sayfanın tamamı için tekrarlanır. Ek: başlık sırası `h1` → `h2` → `h3` atlamasız; beş sahnenin videoları yalnızca yaklaşınca istenir (ağ isteklerinden doğrulanır); 360px'te hiçbir bölüm yatay taşmaz.
- [ ] **Adım 8:** Commit: `feat: ana sayfanın tamamı ve kalan sahneler`.

### Task 13: CV sayfaları ve PDF

**Dosyalar:** Oluştur: `src/content/cv.tr.ts`, `cv.en.ts`, `src/pages/cv.astro`, `src/pages/en/cv.astro`, `src/styles/print.css`, `scripts/build-cv-pdf.mjs`, `public/cv/baran-berkay-bostan-cv-tr.pdf`, `public/cv/baran-berkay-bostan-cv-en.pdf`

- [ ] **Adım 1: Onay E.** Baran'a üç teyit sorulur: unvan (varsayılan "Resepsiyon Görevlisi"), otelde hâlâ çalışıyor mu (varsayılan "devam ediyor"), şehir (varsayılan "Balıkesir, Türkiye"). Yanıt `DECISIONS.md`'ye yazılır.
- [ ] **Adım 2:** `cv.{tr,en}.ts`: spec §6 tablosundaki alanlar aynen. Proje satırları `getProjects` özetlerinden gelir (tekrar yazılmaz). Telefon, adres, sertifika, ağ/yazıcı kurulumu, başka iş yok. İşveren satırı: "Erdek'te bir otel" / "A hotel in Erdek".
- [ ] **Adım 3:** CV sayfası: ekranda sitenin koyu temasında; `print.css` ile A4, açık zemin, koyu metin, tek sayfa, bağlantılar tam adresle. Sayfada "PDF indir" bağlantısı.
- [ ] **Adım 4:** `playwright` geliştirme bağımlılığı eklenir. `scripts/build-cv-pdf.mjs`: `astro preview` başlatır, iki sayfayı A4 PDF olarak `public/cv/` altına yazar, sunucuyu kapatır. npm betiği: `build:cv`.
- [ ] **Adım 5:** Doğrulama: her PDF tek sayfa; Türkçe karakterler doğru; metin seçilebilir; PDF meta verisinde (`Title`, `Author`) yalnızca "Baran Berkay Bostan"; `check:anonymity` PDF dosya adlarını geçirir. PDF içeriği ayrıca metne çevrilip yasaklı listeyle taranır.
- [ ] **Adım 6:** Commit: `feat: cv sayfaları ve pdf`.

### Task 14: 404, SEO ve paylaşım görseli

**Dosyalar:** Oluştur: `src/pages/404.astro`, `scripts/build-og.mjs`, `public/og/og-tr.png`, `public/og/og-en.png`, `public/favicon.svg`, `public/robots.txt` · Değiştir: `astro.config.mjs` (`@astrojs/sitemap`), `Base.astro`

- [ ] **Adım 1:** `404.astro`: GitHub Pages tek bir `404.html` sunar; sayfa iki dilde kısa metin ve iki ana sayfa bağlantısı içerir; `<html lang="tr">`, İngilizce blok `lang="en"`. `noindex`.
- [ ] **Adım 2:** `build-og.mjs` (Playwright): 1200×630; hero posteri + koyu katman + ad + hero cümlesi, sitenin fontlarıyla; iki dilde. npm betiği: `build:og`. Dosya ≤ 300 KB.
- [ ] **Adım 3:** `Base.astro`: sayfa diline göre `og:image` (mutlak adres), `og:locale`, `og:image:alt`, `twitter:card=summary_large_image`. Ana sayfaya `Person` türünde JSON-LD (ad, e-posta, `sameAs`: GitHub). Site haritası eklentisi i18n ayarıyla.
- [ ] **Adım 4:** Doğrulama: `dist/` içinde her sayfanın `<title>` ve açıklaması benzersiz; her sayfada `canonical` ve karşılıklı `hreflang` var; `sitemap-index.xml` on sayfayı içerir.
- [ ] **Adım 5:** Commit: `feat: 404, seo meta ve paylaşım görselleri`.

---

## Faz 3 — Kalite ve yayın

### Task 15: Audit ve polish (impeccable)

- [ ] **Adım 1:** `impeccable` skill'i ile audit: erişilebilirlik, responsive, tipografi, boşluk, hareket, UX metni. Kapsam: on sayfanın tamamı, 360 / 768 / 1440.
- [ ] **Adım 2:** Bulgular önem sırasıyla Baran'a listelenir; düzeltmeler uygulanır. Her düzeltmeden sonra ilgili sayfa tarayıcıda yeniden kontrol edilir.
- [ ] **Adım 3:** Kontrast: video ve poster üzerindeki her metin, posterin en açık bölgesine karşı ölçülür; ≥ 4,5:1 (büyük başlık ≥ 3:1). Yetmiyorsa koyu katman güçlendirilir.
- [ ] **Adım 4:** `npm test`, `npm run build` → temiz. Commit: `fix: audit bulguları`.

### Task 16: Doğrulama

`superpowers:verification-before-completion` ile. Hiçbir madde çıktısı görülmeden "geçti" sayılmaz.

- [ ] **Adım 1:** `npm test` → tümü geçer. `npm run build` → hatasız, uyarısız.
- [ ] **Adım 2:** `npm run check:anonymity` (`dist/` dahil) → 0 bulgu. `git log -p` çıktısının tamamı da yasaklı listeyle taranır → 0 bulgu. `public/` altındaki görsel ve videoların meta verisi (`ffprobe`, EXIF) kontrol edilir; konum ya da cihaz bilgisi varsa temizlenir.
- [ ] **Adım 3:** Lighthouse (`npx lighthouse`, `astro preview` üzerinde, mobil ve masaüstü): on sayfa. Eşikler Global Constraints'teki gibi. Sonuçlar tablo olarak `PROGRESS.md`'ye yazılır; eşik altı kalan düzeltilir ve yeniden ölçülür.
- [ ] **Adım 4:** Bağlantılar: `dist/` içindeki tüm iç bağlantılar ve varlık yolları taranır, kırık yok. Dış bağlantılar yalnızca GitHub profili ve `mailto:`.
- [ ] **Adım 5:** Elle: iki dilde on sayfa; dil değiştirici her sayfada karşılığına gider; yalnızca klavyeyle baştan sona gezinme; hareket azaltma modu; 360px; üç demonun Görev 8, 10, 11'deki senaryoları.
- [ ] **Adım 6: Onay F.** Rapor Baran'a sunulur; GitHub reposunun açılması ve ilk push için açık onay istenir.

### Task 17: Deploy

**Dosyalar:** Oluştur: `.github/workflows/deploy.yml`, `README.md`

- [ ] **Adım 1:** `deploy.yml`: `main`'e push'ta `withastro/action` + `actions/deploy-pages`; izinler `pages: write`, `id-token: write`; derlemeden önce `npm test`. `ANONYMITY_WORDS` deposu sırrı tanımlıysa `check:anonymity` CI'da da tarar (sırrı Baran depo ayarlarından ekler; yoksa adım uyarıyla geçer).
- [ ] **Adım 2:** `README.md`: iki dilde kısa tanıtım, yerelde çalıştırma, lisans notu. Otelle ilgili tanımlayıcı bilgi yok.
- [ ] **Adım 3:** Push'tan önce son kez `npm run check:anonymity` ve `git log -p` taraması. Repoya **girmeyenler** doğrulanır: `git ls-files` içinde `CLAUDE.local.md`, `anonymity-words.local.txt`, `media-src/`, `.superpowers/` yok.
- [ ] **Adım 4:** Baran `baranbostan1.github.io` adlı public repoyu açar (ya da onayıyla `gh repo create` kullanılır); `git remote add origin …`, `git push -u origin main`. Depo ayarlarında Pages kaynağı "GitHub Actions" seçilir.
- [ ] **Adım 5:** Action başarıyla biter; `https://baranbostan1.github.io/` ve `/en/` 200 döner; canlıda bir proje sayfası, bir demo ve bir CV PDF'i açılır; canlı adreste Lighthouse ana sayfa için bir kez daha çalıştırılır.
- [ ] **Adım 6: Onay G.** Baran canlı adresi VPN kapalıyken telefonda ve bilgisayarda test eder. LinkedIn Post Inspector ya da benzeri bir araçla paylaşım kartı kontrol edilir. `PROGRESS.md` son duruma getirilir.
