# İlerleme

Yeni session'da önce bu dosyayı ve `DECISIONS.md`'yi oku.

## Durum (2026-10-08)

**Aşama 1–5 (brainstorming, tasarım bağlamı, plan, prototip, geliştirme):** Tamamlandı.
**Aşama 6 — Audit:** Tamamlandı. Tasarım dedektörü (bulgu yok), bağımsız kod incelemesi (kritik, önemli ve küçük bulgular düzeltildi) ve impeccable görsel bitiş incelemesi (8 bulgu + 2 yan etki düzeltildi; karar: yayına hazır) yapıldı. `DESIGN.md` yazıldı.
**Aşama 7 — Doğrulama:** Tamamlandı; rapor aşağıda (Onay F alındı).
**Aşama 8 — Deploy:** Yayında: https://baranbostan1.github.io (repo: `baranbostan1/baranbostan1.github.io`). Onay G alındı (2026-10-08): Baran canlı adresi denedi, sorun bildirmedi.
**Ek iş — Konsept proje (Ofis IT Destek Talepleri):** Tamamlandı ve yayında (2026-10-08). Spec `docs/helpdesk-spec.md`, plan `docs/helpdesk-plan.md`. Aynı yayında hero altındaki çizgi ve zemin deseninin kesik kenarı da düzeltildi.

## Plan ilerlemesi

- [x] Görev 1–14 — İskelet, prototip, üç demo, ana sayfa, CV, 404/SEO
- [x] Görev 15 — Audit: dedektör, kod incelemesi, görsel bitiş incelemesi, `DESIGN.md`
- [x] Görev 16 — Doğrulama (Onay F)
- [x] Görev 17 — Deploy: yayında; Onay G alındı

Ayrıntılı defter (yerel): `.superpowers/sdd/plan/progress.md`.

Konsept proje planı (`docs/helpdesk-plan.md`):

- [x] Görev 1–4 — İçerik modeli ve yollar, talep kuralları, süre/hedef hesabı, başlangıç verisi ve depolama (test-önce)
- [x] Görev 5 — Demo arayüzü, proje ve tam ekran demo sayfaları, `scripts/verify-helpdesk.mjs`
- [x] Görev 6 — Ana sayfada "Konsept çalışma" bölümü, CV satırı
- [x] Görev 7 — Sahne görüntüsü (Onay 3 alındı)
- [x] Görev 8 — Doğrulama, son kod incelemesi, Onay 4, yayın (2026-10-08; canlıda `verify-helpdesk` 154/154)

Defter (yerel): `.superpowers/sdd/helpdesk-plan/progress.md`.

## Doğrulama raporu (derlenmiş site üzerinde, 2026-10-07)

| Kontrol | Sonuç |
|---|---|
| Birim testleri | 263/263 |
| Derleme | 17 sayfa; derleme sonrası denetim: ana sayfalarda 5 sahne de görüntüsüyle çıkıyor |
| Lighthouse, mobil | Ana sayfa Performance 91 (TR) / 95 (EN); diğer sayfalar 96–99; Accessibility, Best Practices, SEO her sayfada 100 |
| Lighthouse, masaüstü | On sayfanın tamamında dört kategori 100 |
| Tarayıcı doğrulamaları | Sinematik katman 26/26, QR menü 45/45, acenta 75/75, lobi 61/61 (canlı API), inceleme düzeltmeleri 11/11 |
| Bağlantılar | 152 iç bağlantı ve varlık, kırık yok; dış adresler yalnızca GitHub profili ve e-posta |
| Anonimlik | Kaynak, derleme çıktısı, ikili dosyalar ve git geçmişinde bulgu yok |
| Medya meta verisi | Konum ya da cihaz bilgisi yok |
| CV | İki PDF tek sayfa; metin seçilebilir; ad metin katmanında doğru okunuyor |

Canlı adreste (2026-10-07): 14 adres 200, olmayan sayfa 404; ana sayfada 5 video; tarayıcı doğrulamaları sinematik 26/26, QR menü 45/45, inceleme düzeltmeleri 11/11; Lighthouse mobil on sayfada dört kategori 100.

Elle denenmeyenler: gerçek bir iPhone'da video oynatma ve lobi tam ekran yedeği (taklit edilerek denendi); QR kodun telefonla okutulması (yayından sonra çalışır); LinkedIn paylaşım kartı (yayından sonra).

## Yeni session için başlangıç

1. `CLAUDE.md`, bu dosya, `DECISIONS.md`, `docs/design-spec.md`, `PRODUCT.md`, `docs/plan.md` ve `CLAUDE.local.md` okunur.
2. Bekleyen onay varsa önce o sorulur; sonra plan Görev 17.
3. Siteyi görmek için: `npm run dev`. Derlenmiş siteyi denemek için: `npm run build && npx astro preview --port 4322`.

## Sıradaki adımlar

1. Bekleyen iş yok. Yeni bir iş gelirse önce `DECISIONS.md` okunur.
2. İsteğe bağlı: `DESIGN.md` içindeki önerilen adların ("Lamba Işığındaki Masa", renk adları) Baran'la gözden geçirilmesi.
3. GitHub profili düzenlendi (2026-10-08): portföy dışındaki açık depolar gizlendi, biyografi ve site adresi eklendi. Depo profilde sabitlenmemiş görünüyor; tek açık depo olduğu için yine de profilde listelenir.

## Baran'dan beklenenler

- Bekleyen onay yok.
- Yayından sonra: gerçek bir telefonda ana sayfa, lobi "Tam ekran" ve QR kod denemesi.
- İsteğe bağlı: kurgusal adlar için itiraz (restoran `src/demos/qr-menu/data.ts`, otel `src/demos/lobby/config.ts`); QR menü admin panelinin ekran görüntüsü.

## Notlar

- **Yayınlanan geçmiş yenidir.** GitHub'daki `main`, tek commit'lik yeni bir geçmişle başladı. Geliştirme geçmişi yerelde `yerel-gecmis` dalında duruyor; **bu dal asla push edilmez** (eski belge sürümlerinde gerçek adı daraltabilecek bir cümle var).
- Bu repoda git yazar adı "Baran Berkay Bostan", e-posta GitHub'ın gizli adresi (yalnızca yerel repo ayarı).
- Her push'tan önce `npm run check:history` çalıştırılır (git geçmişini de tarar).
- Yayın: `main`e push → `.github/workflows/deploy.yml` (test → derleme → Pages). Pages kaynağı "GitHub Actions".
- `package-lock.json` Windows'ta üretildiği için Linux'ta eksik kalan iki paket (`@emnapi/core`, `@emnapi/runtime`) geliştirme bağımlılığı olarak eklendi; yoksa CI'da `npm ci` durur.
- Derleme sonrası (`postbuild`) iki denetim çalışır: sahnelerin görüntüsüyle çıktığı ve yeni `dist/` içinde yasaklı kelime olmadığı.
- Doğrulama betikleri varsayılan olarak dev sunucusuna (4321) bağlanır; derlenmiş siteyi denemek için `SHOTS_BASE_URL=http://localhost:4322`. Lighthouse: `node scripts/lighthouse.mjs [mobile|desktop]`.
- Kod incelemesinin ertelenen küçük bulguları düzeltildi; tek kalan `.astro` dosyalarında tip denetimi.
- Görsel bitiş incelemesinin kapsamı sınırlıydı: İngilizce sayfalar yalnızca dört mobil ana sayfa görüntüsünde görüldü; telefon tam ekranındaki lobi paneli verisi yüklenmiş hâlde görülmedi.
- İnceleme için ekran görüntüsü `node scripts/capture-review.mjs <klasör>` ile alınır (sayfayı kaydırır, görsellerin yüklendiğini doğrular, ekran ekran çeker); tek parça tam sayfa görüntüsü yanıltır.
- **Lighthouse betiği Alt+Tab'da artık bırakıyor (açık sorun).** Tarayıcı görünmez çalışıyor ve süreç kalmıyor, ama ölçülen her sayfa Alt+Tab listesinde boş bir kayıt bırakıyor (2026-10-07'de 51, 2026-10-08'de 36). Kayıtlar ancak Windows Gezgini yeniden başlatılınca gidiyor. Tarayıcıyı Playwright ile açıp Lighthouse'u ona bağlama denemesi takıldı ve geri alındı. Lighthouse çalıştırmadan önce Baran'a haber verilir; Playwright ile yazılmış doğrulama betikleri artık bırakmıyor.
- CI'da anonimlik denetimi depo sırrı `ANONYMITY_WORDS` ile çalışır; liste değişirse sır da güncellenir (`gh secret set ANONYMITY_WORDS < anonymity-words.local.txt`).
- Fontlarda ok karakteri (→) yok; oklar SVG ile çizilir.
- Higgsfield: 1000 krediden 65,5 harcandı (13 kare, 6 klip). Kayıt: `docs/media-prompts.md`.
- Ana sayfada bir sahne yer tutucuyla çıkarsa `npm run build` bilerek hata verir (`check-build.mjs`); yeni bir sahne eklenirken önce görüntüsü kodlanır.
- CV iki dilde tek sayfaya ancak sığıyor (İngilizce sürümde birkaç piksel pay var); CV'ye satır eklenirse `npm run build:cv` çıktısındaki sayfa sayısına bakılır.
- QR Menü sayfasındaki QR kod yayın adresini gösterir; yayından önce telefonda açılmaz.
- Paylaşım görselleri `npm run build:og`, CV PDF'leri `npm run build:cv` ile yeniden üretilir (CV metni ya da proje özetleri değişirse).
- Yedek kur API adresi (`pages.dev`) Türkiye'den erişilemiyor olabilir; asıl adres (jsdelivr) çalışıyor.
- `astro check` kurulu TypeScript 7 ile çalışmıyor; `.astro` dosyalarında tip denetimi yok.
- Yasaklı kelime listesi repoya girmeyen yerel bir dosyada (`anonymity-words.local.txt`).
- Kurulu araçlar: Node 24.13.0, npm 11.6.2, ffmpeg 9.0.1, Playwright (kurulu Edge ile).
