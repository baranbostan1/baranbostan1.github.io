# İlerleme

Yeni session'da önce bu dosyayı ve `DECISIONS.md`'yi oku.

## Durum (2026-10-07)

**Aşama 1–5 (brainstorming, tasarım bağlamı, plan, prototip, geliştirme):** Tamamlandı.
**Aşama 6 — Audit:** Tasarım dedektörü (bulgu yok) ve bağımsız kod incelemesi yapıldı; incelemenin kritik ve önemli bulguları düzeltildi. Impeccable'ın görsel bitiş incelemesi ve `DESIGN.md` yazımı yapılmadı.
**Aşama 7 — Doğrulama:** Tamamlandı; rapor aşağıda (Onay F alındı).
**Aşama 8 — Deploy:** Yayında: https://baranbostan1.github.io (repo: `baranbostan1/baranbostan1.github.io`). **Onay G bekleniyor:** Baran canlı adresi VPN kapalıyken dener.

## Plan ilerlemesi

- [x] Görev 1–14 — İskelet, prototip, üç demo, ana sayfa, CV, 404/SEO
- [x] Görev 15 — Audit: dedektör + kod incelemesi + düzeltme turu (görsel bitiş incelemesi yapılmadı)
- [x] Görev 16 — Doğrulama (Onay F)
- [x] Görev 17 — Deploy: yayında; **Onay G bekleniyor**

Ayrıntılı defter (yerel): `.superpowers/sdd/plan/progress.md`.

## Doğrulama raporu (derlenmiş site üzerinde, 2026-10-07)

| Kontrol | Sonuç |
|---|---|
| Birim testleri | 234/234 |
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

1. Onay G: Baran canlı adresi VPN kapalıyken, telefonda ve bilgisayarda dener; QR kodu okutur; LinkedIn paylaşım kartına bakar.
2. İsteğe bağlı: ertelenen küçük bulgular; depo sırrı `ANONYMITY_WORDS` (CI'da anonimlik denetimi için).
3. Yayından sonra, ayrı iş: dördüncü proje (öneri: arıza ve istek takibi; "konsept" etiketiyle).

## Baran'dan beklenenler

- **Onay G:** canlı adres denemesi.
- `public/media/hero-scrub.mp4` ve `public/media/hero-loop.mp4` dosyalarının silinmesi (eski adlandırmadan kaldı; repoya girmiyor ama yerel derlemeye kopyalanıyor).
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
- Ertelenen küçük bulgular defterde (`minor (deferred)`): lobi panelinde "-0°", "0.500" tutarının kabul edilmesi, acenta filtresinin nadir bir durumda boş görünmesi, CSV indirmede URL'nin hemen iptali, dil değiştiricinin erişilebilir adı ve birkaç küçük şey daha.
- Fontlarda ok karakteri (→) yok; oklar SVG ile çizilir.
- Higgsfield: 1000 krediden 54,75 harcandı (11 kare, 5 klip). Kayıt: `docs/media-prompts.md`.
- QR Menü sayfasındaki QR kod yayın adresini gösterir; yayından önce telefonda açılmaz.
- Paylaşım görselleri `npm run build:og`, CV PDF'leri `npm run build:cv` ile yeniden üretilir (CV metni ya da proje özetleri değişirse).
- Yedek kur API adresi (`pages.dev`) Türkiye'den erişilemiyor olabilir; asıl adres (jsdelivr) çalışıyor.
- `astro check` kurulu TypeScript 7 ile çalışmıyor; `.astro` dosyalarında tip denetimi yok.
- Yasaklı kelime listesi repoya girmeyen yerel bir dosyada (`anonymity-words.local.txt`).
- Kurulu araçlar: Node 24.13.0, npm 11.6.2, ffmpeg 9.0.1, Playwright (kurulu Edge ile).
