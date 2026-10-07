# Kararlar

Önemli kararlar ve gerekçeleri. Ayrıntı için `docs/design-spec.md`.

## 2026-10-07

- **Konumlandırma genel, otele özel değil.** Baran'ın hedefi turizm değil; hedef roller IT/teknik destek, yazılım destek ve kurulum, iş analizi/süreç, AI destekli geliştirme. Otel yalnızca bağlam olarak geçer.
- **Yapı: sinematik ana sayfa + sade proje sayfaları.** Ana sayfa etkiyi verir; demolar kendi sayfalarında kaydırma efektleriyle çakışmadan kullanılır ve ağır medya proje sayfalarını yavaşlatmaz.
- **Estetik: koyu, sinematik, kaydırmaya bağlı sahneler.** Baran ilk iki mockup turunu (açık/sade yönler ve hafif CSS animasyonları) reddetti; referans olarak "Claude + Higgsfield" portföy videosunu verdi.
- **Görüntü hikâyesi "Sorundan araca".** Otel gezisi yerine eski yöntemin araca dönüşmesi; hem genel konumlandırmaya uyar hem de oteli göstermez.
- **Higgsfield kullanılacak.** Baran'ın mevcut planı ve kredisiyle; her üretimden önce maliyet söylenip onay alınır. Sitenin çalışması ücretsiz kalır.
- **Lighthouse Performance ana sayfada ≥ 90.** Tam ekran videoyla 95 sözü verilemez; diğer sayfalar ve diğer kategoriler ≥ 95.
- **Yalnızca koyu tema.** İkinci tema kapsam dışı.
- **Üç proje; YouTube pipeline yok.** Baran iki kez "ekleme" dedi.
- **Üç projenin de demosu var.** QR menü demosu kurgusal restoranla yeniden yazılır; admin paneli demoya dahil değil.
- **CV proje içinde üretilir.** Baran'ın hazır CV'si yok; site içeriğiyle aynı kaynaktan TR ve EN PDF. Telefon ve adres yazılmaz.
- **Profil fotoğrafı, LinkedIn, iletişim formu yok.**
- **Sonuç cümlelerinde temkinli sürüm.** Araçları yalnızca Baran kullanıyor; "yönetim de kullanıyor" ve "eğitim verdim" yazılmaz.
- **"QR menü yasal zorunluluk" gerekçesi yazılmaz.** Doğrulanmadı.
- **Anonimlik otomatik denetlenir.** Build öncesi yasaklı kelime taraması; liste repoya girmez.
- **Repo adı `baranbostan1.github.io`.** Kök adreste yayın, `base` ayarı gerekmez.
- **İnşa yolu "önce görsel, sonra kod".** Baran onayladı; Higgsfield kredisi yön onaylanmadan harcanmaz.
- **Lobi ekranının "Problem" cümlesi teyit edildi.** Spec §5.2'deki cümle aynen kullanılır.

### Plan kararları (`docs/plan.md`)

- **Metinler tipli TypeScript modüllerinde** (`src/content/*.{tr,en}.ts`). Sayfalar ve CV aynı kaynaktan beslenir; eksik çeviri derleme hatası verir.
- **Sinematik katman üç modlu: `static` / `loop` / `scrub`.** Hareket azaltma ya da Save-Data → sabit kare; dar ekran ya da dokunmatik → döngülü klip; geniş ekran ve ince imleç → kaydırmaya bağlı video. Kitaplıklar yalnızca `scrub` modunda yüklenir.
- **Kaydırmaya bağlı video önce sık anahtar kareli MP4 ile denenir.** Takılırsa WebP kare dizisi + canvas'a geçilir; karar prototipte verilir.
- **Tutar ayrıştırma hem `1.250,50` hem `1250.5` biçimini kabul eder.** Belirsiz biçimler reddedilir; tüm hesap kuruş cinsinden tam sayıdır.
- **Acenta adları trim ve Türkçe küçük harfle eşleştirilir.** Yazım farkı ayrı acenta oluşturmaz.
- **Anonimlik listesi yerelde dosyadan, CI'da isteğe bağlı depo sırrından okunur.** Liste yoksa yerelde build durur, CI'da uyarıyla geçer.
- **CV PDF ve paylaşım görseli Playwright ile üretilir** (yalnızca geliştirme bağımlılığı, ücretsiz); çıktılar repoya statik dosya olarak girer.
- **Kurgusal otel ve restoran adları web'de aranıp Baran'a seçtirilir.** Bölgede aynı adlı gerçek işletme varsa aday elenir.
- **Commit'lere attribution satırı eklenmez.**

### Görsel yön (plan Görev 4)

- **Kompozisyon: standart portföy düzeni.** Baran üç yön arasından bunu seçti: sinematik hero, altında klasik proje bölümleri (görüntü + bir cümle sorun, bir cümle sonuç, etiketler, "İncele"). Kıyas noktası Baran'ın paylaştığı referans videodaki işçilik düzeyi.
- **Spec §4.1'den sapma:** Proje sahneleri ekrana sabitlenmez. Kaydırmaya bağlı video yalnızca hero'dadır; proje görüntüleri görünüme girince dönüşümü oynatır. Gerekçe: seçilen düzen.
- **Taslak yöntemi: tarayıcıda HTML.** Higgsfield kredisi taslağa harcanmaz; taslak gerçek bileşenlerle kurulur ve siteye dönüşür.
- **Monospace yalnızca veri ve teknoloji etiketlerinde.** Ad, menü ve dil değiştirici gövde fontuyla yazılır.
- **Ekran görüntüleri Playwright + kurulu Edge ile alınır** (`scripts/shots.mjs`); tarayıcı indirmesi gerekmez.

### Prototip (plan Görev 5–8)

- **Klipler Kling 3.0 Pro ile, başlangıç ve bitiş karesi verilerek üretilir.** Klip 8,75 kredi; aynı işi Seedance 35–60 krediye yapıyor. Kareler önce onaylanır.
- **Klipler döngüye girmez; görünüme girince bir kez oynar ve son karede kalır.** Döngüde dönüşmüş hâlden eski hâle sıçrama oluyordu.
- **Her sahnenin iki sabit karesi var.** Hareket kapalıyken son kare (dönüşmüş hâl); video oynatılacaksa önce ilk kare gösterilir, böylece video başlarken sıçrama olmaz.
- **GSAP kullanılmıyor.** Hero sabitleme CSS `sticky`, video sarma küçük bir döngü; Lenis yalnızca geniş ekranda yüklenir.
- **Hero klibi olayın olduğu aralığa kırpıldı ve 2× yavaşlatıldı; kaydırma mesafesi 60svh.** Baran ışığın açılması için çok kaydırmak gerektiğini söyledi; klibin ilk iki saniyesi durağandı.

### Zemin (2026-10-07)

- **Zemin düz kahverengi değil.** Baran aşağı inildikçe zeminin düz kahverengi kaldığını söyledi. Zemin, görüntülerin gölgelerindeki soğuk koyu tona çevrildi; sayfa boyunca yer değiştiren sıcak ve soğuk ışık havuzları ile ince bir film greni eklendi. Vurgu rengi (kehribar) aynı kaldı.

### Kapsam eklemeleri (2026-10-07)

- **Demoların tam ekran sürümleri var** (`/demo/…`). Proje sayfasından bağlantıyla açılır; arama motorlarına kapalıdır.
- **QR Menü sayfasında gerçek bir QR kod var.** Tam ekran demoyu telefonda açar; kod derleme sırasında üretilir ve yayın adresini (`baranbostan1.github.io`) gösterir, yani yayından önce çalışmaz.
- **Dördüncü proje yayından sonra.** Baran ek bir örnek proje istedi; öneri "arıza ve istek takibi" (hedef rollerle doğrudan ilgili). Eklenirse "konsept, gerçek kullanımda değil" diye etiketlenir; hero'daki "üç araç" ifadesi korunur.
- **Lobi demosunda galeri yok.** Spec, Higgsfield ile üretilmiş genel kareler öngörüyordu; yapay görüntülerin "panelin durduğu yer" gibi sunulması yanıltıcı olurdu. Ana sayfadaki lobi sahnesi bu işi görüyor.

### Kullanım ifadeleri ve CV teyitleri (2026-10-07)

- **"Bugün kullanılıyor" yazılmaz.** Baran: otel sezonluk kapandı; yeniden açıldığında kendisi orada olmayacak. Araçların kullanımı geçmiş zamanda ("sezon boyunca kullanıldı"), Baran'ın rolü geçmiş zamanda ("güncelledim", "girdim") yazılır; otelin sezonluk çalıştığı ve araçların yerinde durduğu belirtilir. Spec §5'teki "kullanılıyor" cümleleri bu kararla değişti.
- **CV:** unvan "Resepsiyon Görevlisi"; dönem "Mayıs 2023 – Eylül 2026"; yer "Erdek, Balıkesir". Askerlik CV'de ve sitede yazılmaz (Baran'ın tercihi).
