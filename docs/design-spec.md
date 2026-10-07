# Portföy Sitesi — Tasarım Spec'i

Tarih: 2026-10-07 · Durum: Baran onayladı (2026-10-07)

> **Sonradan değişenler (`DECISIONS.md` geçerlidir):** Otel sezonluk çalışıyor ve Baran artık orada çalışmıyor; bu belgedeki "kullanılıyor" cümleleri sitede geçmiş zamanda yazılır. Kompozisyon standart portföy düzenine çevrildi (proje sahneleri sabitlenmez); GSAP kullanılmadı; lobi galerisi ve Hakkımda karesi yapılmadı; tam ekran demolar ve QR kod eklendi.

Bu belge brainstorming aşamasının çıktısıdır. `CLAUDE.md` ile çeliştiği yerde bu belge geçerlidir; çelişkiler "CLAUDE.md'den sapmalar" başlığında listelenmiştir.

## 1. Amaç ve konumlandırma

Baran Berkay Bostan'ın iş başvurularında kullanacağı kişisel portföy sitesi. Ziyaretçi bir işe alımcı ya da teknik yönetici; 1–2 dakika ayırır.

**Mesaj:** YBS mezunu; bir işletmenin sorununu yerinde fark edip AI destekli geliştirmeyle canlıda çalışan araca dönüştürebiliyor.

**Konumlandırma geneldir, otele özel değildir.** Otel, işin yapıldığı yer olarak bağlam cümlesinde geçer ("Erdek'te bir otel"); Baran'ın kimliği olarak sunulmaz.

**Hedef roller:**
- IT / teknik destek (junior, helpdesk, remote dahil)
- Yazılım destek, kurulum, implementasyon
- İş analizi / süreç (YBS'nin doğrudan alanı)
- AI destekli geliştirme, otomasyon, iç araç geliştirme

**Başarı ölçütü:** Ziyaretçi ilk ekranda kim olduğunu anlar, en az bir projenin "sorun → çözüm → sonuç" özetini görür, bir demoya girebilir ve iletişim bilgisine ulaşır.

## 2. Kimlik ve iletişim

| Alan | Değer |
|---|---|
| Sitede görünen ad | Baran Berkay Bostan |
| E-posta | baranbostan11@gmail.com (herkese açık) |
| GitHub | `baranbostan1` |
| LinkedIn | Yok, alan gösterilmez |
| Profil fotoğrafı | Yok |
| Repo / adres | `baranbostan1.github.io` → `https://baranbostan1.github.io` |

GitHub kullanıcı adı yakın zamanda değişti; deploy aşamasında adresin bu adla çalıştığı doğrulanır.

## 3. Estetik yön

Koyu, sinematik, kaydırmayla ilerleyen bir hikâye. Referans: Baran'ın paylaştığı "Claude + Higgsfield ile premium portföy" videosundaki sonuç (tam ekran sinematik görüntü, kaydırmaya bağlı sahneler, yumuşak kaydırma, imleç etkileşimleri).

- **Renk:** Neredeyse siyah zemin, sıcak açık metin, tek sıcak vurgu rengi (kehribar/bakır tonu). Mor gradient yok.
- **Tipografi:** Başlık Fraunces (serif), gövde Schibsted Grotesk, rakam ve etiketler IBM Plex Mono. Üçü de Fontsource ile siteye gömülür; Türkçe karakterler prototipte doğrulanır. Gövde metni en az 16px, etiketler en az 12.8px.
- **Hareket ilkesi:** Hareket ya hikâyeyi ilerletir (sahne, dönüşüm) ya da bilgi taşır (canlı veri, sayaç). Animasyonlar `transform`, `opacity` ve `clip-path` ile yapılır; genişlik, yükseklik, boşluk animasyonu yok.
- **Tema:** Site koyu temalıdır; ayrı bir açık tema yoktur.

### Görüntü hikâyesi: "Sorundan araca"

Her sahne eski yöntemin yeni araca dönüşmesini gösterir. Hiçbir karede otel binası, tabela, logo ya da isim yoktur.

| Durak | Görüntü |
|---|---|
| Hero | Gece, loş bir çalışma masası; dağınık kâğıtlar. Bir ekran yanar, ışığı masayı doldurur. |
| QR Menü | Basılı menü kartı, telefondaki dijital menüye dönüşür. |
| Lobi Ekranı | Duvarda karanlık TV açılır; saat, kur ve hava durumu ile dolar. |
| Acenta Takibi | Yığılmış faturalar düzenli satırlara, sonra ekrandaki tabloya dönüşür. |
| Kapanış | Üç ekran yan yana, açık ve çalışıyor; kamera uzaklaşır. |

**Üretim:** Higgsfield (Baran'ın mevcut Plus planı ve kredisi). 5 kısa klip, Hakkımda için 1 sabit kare, lobi demosunun galerisi için birkaç genel kare. Kredi harcayan her üretimden önce maliyet söylenir ve onay alınır.

## 4. Site yapısı

Yaklaşım: **sinematik ana sayfa + sade proje sayfaları.**

Sayfalar (her biri TR `/` ve EN `/en/` altında):
- Ana sayfa
- Proje sayfaları: QR Menü, Lobi Bilgi Ekranı, Acenta Fatura ve Ödeme Takibi
- CV sayfası (yazdırma düzeni; PDF bundan üretilir)
- 404

Her sayfada dil değiştirici vardır ve aynı sayfanın diğer dildeki karşılığına gider.

### 4.1 Ana sayfa akışı

| # | Durak | Ekranda | Kaydırınca |
|---|---|---|---|
| 1 | Hero | Ad, tek cümle tanıtım, alt metin, dil değiştirici, kaydır işareti | Video kaydırmayla ilerler; başlık kelime kelime belirir |
| 2 | QR Menü | Proje adı, bir cümle sorun, bir cümle sonuç, 2–3 teknoloji etiketi, "İncele" | Sahne sabitlenir, metin katman katman gelir |
| 3 | Lobi Ekranı | Aynı yapı + gerçek saat ve canlı kur şeridi | Şerit canlı veriyle dolar |
| 4 | Acenta Takibi | Aynı yapı + sahte veriyle güncellenen bakiye sayacı | Sayaç bir fatura ve bir ödemeyle değişir |
| 5 | Nasıl çalışıyorum | Beş adım ve kimin ne yaptığı | Adımları bağlayan çizgi çizilir |
| 6 | Hakkımda | Giriş, dört yetkinlik, eğitim, CV indirme | Metin yumuşakça belirir |
| 7 | İletişim | E-posta (bağlantı + kopyala), GitHub, CV | Kapanış görüntüsü |

**Hero metni (taslak, prototipte kesinleşir):**
- TR başlık: "İşletmelerin gündelik sorunlarını, çalışan araçlara dönüştürüyorum."
- TR alt metin: "Yönetim Bilişim Sistemleri mezunuyum. Sorunu yerinde görür, çözümü planlar, AI destekli geliştirmeyle canlıya alırım. Aşağıdaki üç araç gerçek bir işletmede bugün kullanılıyor."

**Etkileşimler (yalnızca ince imleçli cihazlarda):** imleci takip eden ışık, imlece doğru hafifçe çekilen butonlar, imlece göre hafifçe eğilen proje panelleri, ağırlıklı yumuşak kaydırma.

**Mobil:** Sahneler sabitlenmez; her durak kısa, sessiz, döngülü bir klip ve altında metin olarak gelir. İmleç efektleri kapalıdır.

**Yükleme:** Önce sabit kare, video arkadan. Sonraki sahnelerin videoları yaklaşınca yüklenir.

### 4.2 Nasıl çalışıyorum

| Adım | Ne oluyor | Kim |
|---|---|---|
| Tespit et | İşin içindeyken eksik ya da zor olanı fark etmek | Baran |
| Planla | Kim kullanacak, neye ihtiyaç var, en sade çözüm ne | Baran |
| AI ile geliştir | Kodu Claude Code ve ChatGPT Codex ile üretmek, okuyup yönlendirmek | AI + Baran |
| Test et | Gerçek cihazda, gerçek kullanımda denemek | Baran |
| Canlıya al | Yayınlamak, kurmak, sorun çıkınca düzeltmek | Baran |

AI kullanımı açıkça ve olumlu yazılır: kod üretimi AI ile; sorunun tespiti, ürün kararları ve doğrulama Baran'da.

### 4.3 Hakkımda

Dört başlık, her biri gerçek bir örnekle:

- **Sorunu ve süreci görmek:** Acenta bakiyeleri takip edilmiyordu; ihtiyacı fark edip aracı kurdu.
- **AI ile geliştirip canlıya almak:** Üç araç, üçü de gerçek kullanımda.
- **Kurulum ve sahada çözüm:** Lobi TV'si için Android TV çubuğu (Xiaomi Mi Stick) seçtirdi, kiosk uygulamasıyla paneli kurdu; panel ekrana sığmayınca tasarımı her çözünürlüğe oturacak şekilde düzenledi.
- **Teknik destek:** Resepsiyonda çalışırken bilgisayar sorunlarında ilk aranan kişiydi. Günlük işte AKINSOFT Wolvox Otel, Muhasebe ve Cafe programlarını kullandı.

Eğitim: Yönetim Bilişim Sistemleri, lisans, Bandırma Onyedi Eylül Üniversitesi, 2025.

**Yazılmayacaklar:** "Başkalarına eğitim verdim" (araçları yalnızca Baran kullandı). Mezuniyetin uzama nedeni. Turizme neden yöneldiği.

## 5. Proje sayfaları

Ortak yapı: başlık ve özet → Problem → Çözüm → Demo → Teknik → Sonuç → sonraki proje. Video yok, hafif geçişler var. Teknik bölümünde yalnızca koddan doğrulananlar, Sonuç bölümünde yalnızca Baran'ın verdiği bilgiler yer alır.

### 5.1 QR Menü

- **Problem:** Basılı menü kullanılıyordu; her fiyat değişikliği yeniden baskı masrafıydı. Hazır QR menü servislerinin aboneliğine para ödenmesin istendi.
- **Çözüm:** QR kodla açılan dijital menü ve içeriği yönetmek için admin paneli.
- **Teknik (doğrulandı):** Düz HTML/CSS/JavaScript; veriler Firebase Firestore'da; önünde Cloudflare. Kategori filtresi; ürün adı ve açıklamada arama; isteğe bağlı ürün görseli; Türkiye saatine göre otomatik Gündüz/Akşam menüsü (08:00–19:00 gündüz), kısıt hem kategori hem ürün bazında; kategori sırası panelden belirlenir. Dil: Türkçe.
- **Sonuç:** 2026 yazından beri restoranda kullanılıyor. Fiyat ve ürünleri panelden Baran güncelliyor.
- **Demo:** Kurgusal restoran, uydurma ürünler. Kategori filtresi, arama, elle çevrilebilen Gündüz/Akşam anahtarı. Veri statik; Firebase yok. Admin paneli demoya dahil değil, metinle anlatılır.
- **Yazılmayacak:** "QR menü yasal zorunluluk" gerekçesi (doğrulanmadı).

### 5.2 Lobi Bilgi Ekranı

- **Problem (Baran teyit etti, 2026-10-07):** Misafirlerin sık sorduğu bilgiler (saatler, fiyatlar, kur, hava) için resepsiyonun karşısında sürekli açık bir ekran yoktu.
- **Çözüm:** TV'de 7/24 çalışan web tabanlı bilgi paneli.
- **Teknik (doğrulandı):** Düz HTML/CSS/JavaScript; Cloudflare Workers üzerinde statik yayın; güvenlik başlıkları ve içerik güvenlik politikası. Döviz ve hava durumu key'siz ücretsiz API'lerden (fawazahmed0 currency-api, Open-Meteo). Metin, fiyat ve duyurular kod bilmeyen birinin düzenleyebileceği ayrı bir ayar dosyasında. Hafta içi/hafta sonu oda fiyatı güne göre otomatik değişir. İstek zaman aşımı ve yeniden deneme; bağlantı kesilince son veri "Çevrimdışı · saat" etiketiyle gösterilir, bağlantı gelince tazelenir. 7/24 önlemleri: Wake Lock API, her gece 04:00'te otomatik yenileme, ekran yanmasına karşı piksel kaydırma, imleç gizleme, 1920×1080 sahneyi her çözünürlüğe orantılı sığdırma. QR kodlar ve kayan duyuru bandı.
- **Sonuç:** Yaklaşık 2 yıldır resepsiyonun karşısındaki TV'de çalışıyor; 2–3 kez yeniden tasarlandı. Kurulumu Baran yaptı.
- **Demo:** TV çerçevesi içinde canlı panel, kurgusal otel adı, uydurma oda fiyatları. Gerçek saat, canlı kur ve hava durumu (aynı API'ler), kayan bant. İki anahtar: "Hafta içi / Hafta sonu" ve "Bağlantıyı kes" (çevrimdışı durumunu gösterir). Tam ekran butonu. Galeri alanında Higgsfield ile üretilmiş genel kareler; otelin fotoğrafları kullanılmaz.

### 5.3 Acenta Fatura ve Ödeme Takibi

- **Problem:** Acentalara kesilen faturalar ve gelen ödemeler acenta bazında takip edilmiyordu; kimin ne kadar borcu olduğu tek bakışta görülemiyordu.
- **Çözüm:** Fatura ve ödeme kayıtlarını tutan, acenta bazında bakiye gösteren dahili araç. Muhasebe için değil, ön büro takibi için.
- **Teknik (doğrulandı):** Tek sayfa; Firebase Firestore ile canlı senkron. Fatura/ödeme kaydı, acentaya göre filtre, sıralama, Excel/Sheets'ten yapıştırarak toplu aktarma, CSV dışa aktarma, hızlı özet.
- **Sonuç:** Yaklaşık 2 yıldır kullanımda. Kayıtları Baran giriyor ve yönetime raporu bu araçtan veriyor. Öncesinde bu takip yapılmıyordu.
- **Demo:** Uydurma acenta adları ve tutarlar. Fatura/ödeme ekleme; acenta bakiyesi ve genel özet anında değişir. Filtre, sıralama, CSV indirme, "Demo'yu sıfırla". Veri yalnızca tarayıcıda (localStorage); depolama kapalıysa bellek içinde çalışır. Üstte "Bu demodaki tüm veriler uydurmadır" notu.
- **Bakiye mantığı TDD ile yazılır:** arayüzden ayrı saf fonksiyonlar. Bakiye = acentanın fatura toplamı − ödeme toplamı. Tutarlar kuruş cinsinden tam sayı olarak hesaplanır. Geçersiz kayıt (boş acenta, sıfır ya da negatif tutar, geçersiz tarih) reddedilir.
- **Yazılmayacak:** Güvenlikle ilgili herhangi bir iddia. Gerçek araçtan hiçbir veri, acenta adı ya da adres.

## 6. CV

- Sitedeki içerikle aynı kaynaktan üretilen TR ve EN iki sayfa; yazdırma düzeniyle PDF'e çevrilir ve repoya statik dosya olarak konur.
- Telefon ve ev adresi yok. E-posta, GitHub, site adresi, şehir ve "remote çalışmaya açık" notu var.

| Alan | İçerik |
|---|---|
| Eğitim | Yönetim Bilişim Sistemleri (lisans), Bandırma Onyedi Eylül Üniversitesi, 2025 |
| Deneyim | Resepsiyon, Erdek'te bir otel, Mayıs 2023'ten itibaren; yanında üç dijital araç |
| Projeler | Üç proje, birer satır özet ve site bağlantısı |
| Yabancı dil | İngilizce, orta seviye |
| Beceriler | Excel (orta); Windows kurulumu ve araştırarak sorun giderme; SQL, HTML, CSS (temel düzeyde okuma); AI destekli geliştirme (Claude Code, ChatGPT Codex); Firebase, Cloudflare, GitHub Pages (projelerde kullanıldı); AKINSOFT Wolvox Otel, Muhasebe, Cafe |

Yazılmayacaklar: ağ ve yazıcı kurulumu, sertifika, başka iş ya da staj (yok).

**Açık teyitler (CV adımında Baran'a sorulur; yanıt gelene kadar varsayılan kullanılır):**
- Unvan: varsayılan "Resepsiyon Görevlisi".
- Otelde hâlâ çalışıyor mu: varsayılan "devam ediyor".
- Şehir: varsayılan "Balıkesir, Türkiye".

## 7. Teknik mimari

| Katman | Görev | Araç |
|---|---|---|
| İçerik | İki dilde tüm metinler tek yerde; sayfalar ve CV buradan beslenir | Astro içerik dosyaları |
| Sayfa iskeleti | Statik HTML; JavaScript olmadan da okunur | Astro (static) + Tailwind CSS |
| i18n | TR varsayılan `/`, EN `/en/` | Astro yerleşik i18n routing |
| Sinematik katman | Yumuşak kaydırma, sahne sabitleme, kaydırmaya bağlı video, imleç efektleri | GSAP (ScrollTrigger) + Lenis |
| Demolar | Üç bağımsız demo; yalnızca kendi sayfasında yüklenir | Sade TypeScript |
| Hesap mantığı | Acenta bakiyesi, saf fonksiyonlar | TypeScript + Vitest |
| Medya | Sıkıştırılmış klipler (masaüstü ve mobil boyutları) ve sabit kareleri | Statik dosyalar |
| Deploy | GitHub Pages | GitHub Actions, Astro'nun resmi action'ı |

Backend ve veritabanı yok.

**Kararlar:**
- Sinematik katman bir eklenti gibi çalışır: kapalıyken (hareket azaltma, JavaScript hatası) site sabit karelerle eksiksiz okunur.
- Videolar repoda durur; her klip birkaç MB'a sıkıştırılır (GitHub Pages sınırları: dosya 100 MB, site 1 GB).
- Tek dış çalışma zamanı bağımlılığı lobi demosundaki iki API'dir.
- Fontlar siteye gömülür; üçüncü tarafa istek gitmez.
- İletişim formu yok.

**Hata durumları:**
- Video yüklenemezse sabit kare kalır.
- API yanıt vermezse lobi demosu "veri alınamadı / çevrimdışı" durumunu gösterir.
- Tarayıcı depolaması kapalıysa acenta demosu bellek içinde çalışır.
- Acenta demosunda geçersiz giriş, alanın yanında açık bir hata mesajıyla reddedilir.

## 8. Anonimlik ve doğruluk kuralları

- Otelin ve restoranın adı, logosu, alan adları, adresi, telefonu sitede ve repoda hiçbir yerde geçmez. Metinlerde "Erdek'te bir otel" / "a hotel in Erdek".
- Canlı sitelere bağlantı verilmez. Onay sonrası eklenecek yerler `<!-- ONAY_SONRASI -->` ile işaretlenir.
- Gerçek menü ürünleri, gerçek oda fiyatları, gerçek acenta adları ve gerçek muhasebe verisi kullanılmaz; demolar uydurma veriyle çalışır.
- Ekran görüntüsü kullanılırsa marka adı içeren her öğe kırpılır ya da blur'lanır.
- **Otomatik denetim:** Build öncesi çalışan bir kontrol, yasaklı kelimeleri tüm dosyalarda arar ve bulursa build'i durdurur. Yasaklı kelime listesi repoya girmeyen yerel bir dosyada tutulur.
- Sahte metrik, referans ya da abartılı iddia yok. Belirsiz tarihler yuvarlak ifadeyle yazılır ("yaklaşık 2 yıldır", "2026 yazından beri").

## 9. Kalite hedefleri

- Mobile-first; 360px'ten geniş ekranlara.
- Lighthouse: ana sayfa Performance ≥ 90; proje ve CV sayfaları Performance ≥ 95; Accessibility, Best Practices, SEO her sayfada ≥ 95.
- WCAG AA kontrast (video üzerindeki metin koyu katmanla korunur); klavyeyle tam gezinme; sahneleri atlayıp içeriğe geçme bağlantısı.
- `prefers-reduced-motion`: video ve kaydırma efektleri kapanır, sabit kareler gösterilir, içerik aynı kalır.
- Open Graph meta ve paylaşım görseli, iki dilde.

## 10. Test ve doğrulama

- Bakiye mantığı: birim testleri, TDD.
- Her geliştirme adımından sonra tarayıcıda 360px, tablet ve masaüstü kontrolü.
- Sonda: build, Lighthouse, iki dil, tüm bağlantılar, klavye gezinmesi, hareket azaltma modu, anonimlik denetimi.
- Deploy sonrası Baran canlı adresi VPN kapalıyken test eder.

## 11. Kapsam dışı

- YouTube video üretim pipeline'ı projesi.
- Profil fotoğrafı, LinkedIn, iletişim formu.
- Açık tema.
- QR menü admin panelinin demosu.
- Gerçek araçlarda herhangi bir değişiklik (acenta aracının giriş güvenliği dahil; ayrı bir iş olarak önerildi).

## 12. CLAUDE.md'den sapmalar

| CLAUDE.md | Bu spec | Neden |
|---|---|---|
| Hedef: otel yazılımı firmaları ve junior IT | Dört genel rol ailesi | Baran portföyün otele özel olmamasını istedi |
| Hakkımda: YBS + otelcilik kesişimi | Dört yetkinlik, gerçek örneklerle | Aynı neden |
| Ücretli hiçbir şey yok | Higgsfield kredisi görsel üretiminde kullanılır | Baran onayladı; sitenin çalışması yine ücretsiz |
| Lighthouse her kategoride ≥ 95 | Ana sayfa Performance ≥ 90 | Tam ekran video; Baran onayladı |
| Dark mode | Yalnızca koyu tema | Baran koyu tema istedi; ikinci tema kapsam dışı |
| CV indirme butonu sorulacak | CV proje içinde üretilir | Baran'ın hazır CV'si yok |
