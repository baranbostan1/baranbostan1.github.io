# Product

<!-- impeccable:product-schema 1 -->

Kaynak: `docs/design-spec.md` (Baran onayladı, 2026-10-07). Çelişki olursa spec geçerlidir.

## Platform

web

## Stack

Astro (static output) + Tailwind CSS; Astro yerleşik i18n; Lenis (GSAP kullanılmadı, bkz. `DECISIONS.md`); demolar sade TypeScript; testler Vitest; deploy GitHub Pages (GitHub Actions). Backend ve veritabanı yok. Kullanıcı tarafından belirlendi (`CLAUDE.md` ve spec).

## Users

- **Birincil:** İşe alımcı ya da teknik yönetici. Bir başvuruyu değerlendirirken siteye 1–2 dakika ayırır; büyük olasılıkla masaüstünde, bazen telefonda (LinkedIn ya da e-posta bağlantısından).
- **İşi:** "Bu aday gerçek bir sorunu çözüp çalışır hale getirebiliyor mu?" sorusuna hızlı ve güvenilir bir yanıt bulmak; ikna olursa iletişime geçmek.
- **İkincil:** Daha fazla zaman ayıran teknik değerlendirici; demoları kurcalar, teknik ayrıntıyı okur.

## Product Purpose

Baran Berkay Bostan'ın iş başvurularında kullandığı kişisel portföy sitesi. Amaç, kısa bir ziyarette şunu göstermek: gerçek bir işletmenin sorunlarını fark edip AI destekli geliştirmeyle canlıda çalışan araçlara dönüştürebiliyor.

Başarı: ziyaretçi ilk ekranda kim olduğunu anlar, en az bir projenin sorun → çözüm → sonuç özetini görür, bir demoya girebilir ve iletişim bilgisine ulaşır.

Hedef roller: IT / teknik destek; yazılım destek, kurulum, implementasyon; iş analizi / süreç; AI destekli geliştirme ve otomasyon.

## Positioning

Portföydeki üç araç ödev ya da deneme değil; gerçek bir işletme için yapıldı, orada kullanıldı ve sorunu bizzat işin içinde görmüş biri tarafından geliştirildi. (Otel sezonluk çalışır; kullanım ifadeleri geçmiş zamanda yazılır, bkz. `DECISIONS.md`.) Konumlandırma geneldir: otel, işin yapıldığı yer olarak bağlamda geçer, Baran'ın kimliği olarak sunulmaz.

AI kullanımı saklanmaz: kod üretimi AI ile (Claude Code, ChatGPT Codex); sorunun tespiti, ürün kararları ve doğrulama Baran'da.

## Operating Context

- İki dil: Türkçe (varsayılan, `/`) ve İngilizce (`/en/`); her sayfada dil değiştirici.
- Sayfalar: ana sayfa, üç proje sayfası, CV sayfası (PDF bundan üretilir), 404.
- Ziyaretçi çoğunlukla bir başvurudaki bağlantıdan gelir; site ayrıca LinkedIn ve benzeri yerlerde paylaşıldığında önizleme kartıyla görünür.
- İletişim e-posta ve GitHub üzerinden; form yok.

## Capabilities and Constraints

- Üç proje, her biri çalışan bir demoyla: QR Menü (kurgusal restoran), Lobi Bilgi Ekranı (canlı saat, kur, hava; kurgusal otel), Acenta Fatura ve Ödeme Takibi (uydurma veriyle, tarayıcıda).
- Lobi demosu iki key'siz ücretsiz API kullanır (fawazahmed0 currency-api, Open-Meteo); başka çalışma zamanı bağımlılığı yok.
- Acenta bakiye mantığı arayüzden ayrı saf fonksiyonlardır ve TDD ile yazılır.
- **Anonimlik:** Otelin ve restoranın adı, logosu, alan adları, adresi, telefonu sitede ve repoda hiçbir yerde geçmez. Metinlerde "Erdek'te bir otel" / "a hotel in Erdek". Canlı sitelere bağlantı verilmez. Repo public'tir.
- **Gerçek veri yok:** Gerçek menü ürünleri, oda fiyatları, acenta adları, muhasebe verisi kullanılmaz.
- **Ücretsiz çalışma:** Hosting, font, API, kütüphane ücretsizdir. Tek istisna: görsel üretiminde Baran'ın mevcut Higgsfield kredisi; her üretimden önce maliyet söylenip onay alınır.
- Lighthouse: ana sayfa Performance ≥ 90; diğer sayfalar ≥ 95; Accessibility, Best Practices, SEO her sayfada ≥ 95.
- Kapsam dışı: YouTube pipeline projesi, profil fotoğrafı, LinkedIn, iletişim formu, açık tema, QR menü admin paneli demosu.
- **CV teyitleri alındı (2026-10-07):** unvan "Resepsiyon Görevlisi", dönem Mayıs 2023 – Eylül 2026, yer Erdek/Balıkesir; askerlik yazılmaz.

## Brand Commitments

- Görünen ad: Baran Berkay Bostan. E-posta: baranbostan11@gmail.com. GitHub: `baranbostan1`.
- Ses: sade, somut, abartısız. Birinci tekil şahıs. Sahte metrik, referans ya da büyük iddia yok.
- Baran'ın bağlayıcı kıldığı görsel kısıtlar: koyu tema; sinematik, kaydırmaya bağlı sahneler; yumuşak kaydırma ve geçişler; imleç ve hover etkileşimleri; görüntüler Higgsfield ile. Referans: Baran'ın paylaştığı "Claude + Higgsfield ile premium portföy" videosundaki sonuç.
- Görüntü hikâyesi "Sorundan araca": her sahne eski yöntemin araca dönüşmesini gösterir; hiçbir karede otel binası, tabela, logo ya da isim yoktur.
- Baran'ın reddettikleri: açık/sade yönler, yalnızca küçük CSS hareketlerinden oluşan animasyon, "dümdüz sayfa" görüntüsü. `CLAUDE.md`'den: mor gradient, varsayılan Inter, birbirinin aynısı kartlar yok.

## Evidence on Hand

- Lobi ekranının kaynak kodu Baran'ın bilgisayarında (repo dışında); teknik iddialar bu koddan doğrulandı.
- QR menü ve acenta aracının teknik özellikleri canlı sayfalarından doğrulandı (salt okuma).
- Kullanım bilgileri Baran'dan: QR menü 2026 yazından beri; lobi ekranı ve acenta aracı yaklaşık 2 yıldır; araçları Baran kullanıyor, yönetime raporu Baran veriyor; lobi TV kurulumunu Baran yaptı.
- Eğitim: Yönetim Bilişim Sistemleri (lisans), Bandırma Onyedi Eylül Üniversitesi, 2025. Resepsiyon deneyimi Mayıs 2023'ten itibaren.
- **Yok, uydurulmayacak:** testimonial, kullanıcı sayısı, tasarruf tutarı, sertifika, başka iş deneyimi, gerçek araçların ekran görüntüleri (Baran sağlarsa anonimleştirilerek eklenir), profil fotoğrafı.

## Product Principles

1. **Kanıt önce gelir.** Etkileyici olan her şey, çalışan bir demoya ya da doğrulanmış bir gerçeğe götürür.
2. **Yalnızca doğru olan yazılır.** Eksik bilgi sorulur ya da çıkarılır; temkinli sürüm tercih edilir.
3. **Efekt içeriği taşır, içeriğin yerini almaz.** Hareket kapalıyken site eksiksiz okunur.
4. **Otel anonim, konumlandırma genel.**
5. **İki dakikalık ziyaretçi kazanır.** Özet ilk ekranlarda; derinlik isteyene bir tık uzakta.

## Accessibility & Inclusion

WCAG AA kontrast (video üzerindeki metin dahil); klavyeyle tam gezinme ve sahneleri atlama bağlantısı; `prefers-reduced-motion` ile video ve kaydırma efektleri kapanır, içerik aynı kalır; 360px'ten itibaren kullanılabilir; dokunmatik cihazlarda imleç efektleri kapalı.
