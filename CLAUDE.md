# Portföy Sitesi — Proje Brief'i

## Bu proje ne?
Baran'ın iş başvurularında kullanacağı kişisel portföy sitesi. Ziyaretçi bir işe alımcı ya da teknik yönetici; siteye 1–2 dakika ayıracak. Amaç bu sürede şunu net göstermek: **"Gerçek bir işletmenin gerçek problemlerini fark edip, AI destekli geliştirmeyle canlıda çalışan araçlara dönüştürebiliyor."**

Hedef roller:
- Otel yazılımı firmaları (PMS, channel manager, rezervasyon sistemleri) — destek, kurulum, eğitim pozisyonları
- Junior IT / teknik destek pozisyonları (remote dahil)

## Baran hakkında (sitede kullanılacak gerçekler)
- Yönetim Bilişim Sistemleri (YBS) mezunu, 4 yıllık lisans — Bandırma Onyedi Eylül Üniversitesi
- Erdek'te bir otelde resepsiyon deneyimi; aynı otel için ek olarak dijital araçlar geliştirdi
- Kodu okuyup anlayabiliyor; geliştirmeyi AI araçlarıyla (Claude Code, ChatGPT Codex) yapıyor
- Soyadı, e-posta, LinkedIn, GitHub kullanıcı adı: **Baran'a sor, uydurma.**

## KESİN KURALLAR

1. **Otel anonim kalacak.** Otelin veya restoranın adı, logosu, domain'i, adresi sitede ve repoda HİÇBİR yerde geçmeyecek. Metinlerde "Erdek'te bir otel" / "a hotel in Erdek" kullan. Ekran görüntülerinde marka adları blur'lanacak veya kırpılacak. Canlı sitelere link verilmeyecek. Onay alındığında eklenecek yerleri `<!-- ONAY_SONRASI -->` yorumuyla işaretle.
2. **Repo public olacak** (GitHub Pages ücretsiz planı). Bu yüzden otelle ilgili tanımlayıcı bilgiler bu dosyaya da yazılmaz. Gerekirse `CLAUDE.local.md` kullan ve `.gitignore`'a ekle.
3. **Gerçek muhasebe verisi asla kullanılmaz.** Muhasebe aracının demosu tamamen sahte verilerle çalışır (uydurma acenta adları, uydurma tutarlar).
4. **Ücretli hiçbir şey yok.** Hosting, domain, font, API, kütüphane — hepsi ücretsiz olmalı. API key gerektiren servislerden kaçın; mümkünse key'siz ücretsiz API'ler seç ve önce çalıştığını doğrula.
5. **Uydurma yok.** Sahte metrik, sahte referans/testimonial, abartılı iddia yazma. Bir bilgi eksikse Baran'a sor ya da o kısmı çıkar.
6. **AI kullanımı saklanmaz.** "AI-assisted development" açıkça ve olumlu şekilde anlatılır: problem tespiti, ürün kararları ve doğrulama Baran'da; kod üretimi AI ile.

## Diller
- Site: **Türkçe (varsayılan, `/`) + İngilizce (`/en/`)**. Tüm metinler iki dilde; dil değiştirici her sayfada.
- Claude Code ile iletişim: Türkçe, teknik terimler İngilizce.
- Kod yorumları: Türkçe.

## Teknik stack
- **Astro** (güncel sürüm, `npm create astro@latest`) — static output
- **Tailwind CSS**
- i18n: Astro'nun yerleşik i18n routing'i
- Font: Google Fonts veya Fontsource (ücretsiz)
- Deploy: **GitHub Pages**, GitHub Actions ile (Astro'nun resmi deploy action'ı). Repo adı `<kullanıcıadı>.github.io` olursa `base` ayarına gerek kalmaz — Baran'a öner.
- Backend yok, veritabanı yok. Demolar tamamen client-side.

## Site yapısı
1. **Hero** — kim olduğu ve ne yaptığı, tek cümleyle. Güçlü ama abartısız.
2. **Projeler (case study'ler)** — sitenin kalbi. Her biri şu yapıda:
   - **Problem:** Otelde ne eksikti / ne zordu?
   - **Çözüm:** Ne yapıldı?
   - **Teknik:** Kullanılan teknolojiler, öne çıkan özellikler
   - **Sonuç:** Şu an nasıl kullanılıyor? (Sadece Baran'ın verdiği gerçek bilgiler)
   - **Görseller / canlı demo**
3. **Nasıl çalışıyorum** — AI destekli geliştirme süreci: ihtiyacı tespit et → planla → AI ile geliştir → test et → canlıya al.
4. **Hakkımda** — YBS + otelcilik deneyimi kesişimi. Otel yazılımı firmaları için bu kombinasyonun değerini vurgula.
5. **İletişim** — e-posta, LinkedIn, GitHub (Baran'dan alınacak).

## Projeler

### 1. QR Menü
Otelin restoranı için QR kodla açılan dijital menü sitesi. Canlıda kullanılıyor.
→ Detayları (özellikler, kaç dil, nasıl güncelleniyor) Baran'a sor.

### 2. Lobi Bilgi Ekranı
Resepsiyonun karşısındaki TV'de 7/24 çalışan bilgi paneli. Bilinen özellikler: döviz kurları ve hava durumu (API'ler ile), Wake Lock API (ekranın uykuya geçmesini engeller), QR kodlar, kayan bilgi bandı (ticker).
→ **Demo fikri:** Uydurma bir otel adıyla çalışan, canlı bir küçük versiyonu sayfaya göm (key'siz ücretsiz API'lerle). Bu "vay canına" anlarından biri olabilir.

### 3. Acenta Fatura & Ödeme Takip Aracı
Otelin acentalara kestiği faturaları (acenta, tarih, fatura no, tutar) ve acentalardan gelen ödemeleri (acenta, tarih, tutar) kaydedip acenta bazında borç/alacak bakiyesini gösteren dahili araç. Muhasebeciler için değil, ön büro takibi için.
→ **Demo:** Sahte verilerle dolu, ziyaretçinin fatura/ödeme ekleyip bakiyenin anında değiştiğini görebildiği interaktif versiyon. "Demo'yu sıfırla" butonu olsun. Gerçek aracın adresi veya içeriği asla kullanılmaz.
→ Bakiye hesaplama mantığı **TDD ile** yazılır (tek TDD zorunlu alan).

### 4. (Opsiyonel) YouTube video üretim pipeline'ı
Blender ile 3D mekanizma/fizik videoları üreten, Claude Code ile kurulmuş otomasyon. **Eklenip eklenmeyeceğini Baran'a sor.**

## Kalite hedefleri
- Mobile-first; 360px'ten geniş ekranlara kadar kusursuz
- Lighthouse: Performance, Accessibility, Best Practices, SEO ≥ 95
- WCAG AA kontrast; klavyeyle tam gezinilebilir
- `prefers-reduced-motion` desteği; animasyonlar anlam katmalı, süs olmamalı
- Dark mode
- Open Graph meta + paylaşım görseli (LinkedIn'de paylaşılınca iyi görünsün)
- Generic "AI sitesi" görüntüsünden kaçın: mor gradient, varsayılan Inter, birbirinin aynısı kartlar yok

## İş akışı (sırayla, her aşama sonunda Baran'ın onayı alınır)

1. **Brainstorming (superpowers)** — Baran'a eksik bilgileri sor, estetik yönü birlikte belirle. Çıktı: `docs/design-spec.md`.
2. **Tasarım bağlamı (impeccable)** — Spec'e göre impeccable'ın proje bağlamını oluştur.
3. **Plan (superpowers writing-plans)** — Onay noktaları içeren adım adım plan. Çıktı: `docs/plan.md`.
4. **Prototip** — Önce sadece Hero + bir case study. Baran onaylamadan tüm siteye geçme.
5. **Geliştirme** — Plana göre. Her adımdan sonra sonucu Browser pane'de kontrol et.
6. **Audit & polish (impeccable)** — Erişilebilirlik, responsive, tipografi, detaylar.
7. **Doğrulama (superpowers verification-before-completion)** — Build, Lighthouse, iki dil, tüm linkler, mobil görünüm.
8. **Deploy** — GitHub Pages. Baran'a canlı adresi test ettir (VPN kapalıyken).

Genel kurallar:
- Sessiz değişiklik yok; her önemli değişikliği açıkla.
- Görsel işlerde TDD zorunlu değil.
- İlerlemeyi `PROGRESS.md`'ye, önemli kararları gerekçesiyle `DECISIONS.md`'ye yaz. Yeni session'da önce bu dosyaları oku.

## Baran'dan alınacak bilgiler (ilk adımda sor)
- [ ] Soyadı ve sitede görünecek isim
- [ ] E-posta, LinkedIn, GitHub kullanıcı adı
- [ ] Profil fotoğrafı kullanılacak mı?
- [ ] QR menü ve bilgi ekranı hakkında ek detaylar (ne zamandır kullanılıyor, kimler kullanıyor)
- [ ] Ekran görüntüleri (anonimleştirilecek)
- [ ] YouTube pipeline projesi eklensin mi?
- [ ] CV (PDF) indirme butonu olsun mu?
