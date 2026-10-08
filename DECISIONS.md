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
- **Sinematik katman üç modlu: `static` / `play` / `scrub`.** Hareket azaltma ya da Save-Data → sabit kare; dar ekran ya da dokunmatik → klip görünüme girince bir kez oynar; geniş ekran ve ince imleç → ek olarak hero videosu kaydırmaya bağlanır. Kitaplıklar yalnızca `scrub` modunda yüklenir. (İlk planda ikinci mod döngülü klipti; "Prototip" başlığındaki kararla değişti.)
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

### Yayın (2026-10-07)

- **GitHub'a tek commit'lik yeni bir geçmiş gönderildi.** Baran'ın kararı. Geliştirme geçmişi yerelde `yerel-gecmis` dalında kalır ve push edilmez.
- **Yazar adı bu repoda "Baran Berkay Bostan".** E-posta GitHub'ın gizli adresi.
- **Pages kaynağı GitHub Actions.** Repo adı nedeniyle Pages kendiliğinden dal yayınıyla açılmıştı; Actions'a çevrildi.

### Konsept proje: Ofis IT Destek Talepleri (2026-10-08)

- **Dördüncü proje bir konsept çalışmadır ve öyle etiketlenir.** Baran'ın amacı otel dışında da üretebildiğini göstermek. Proje gerçek bir işletmede kullanılmadı; sitede "Konsept" rozeti, ana sayfada ayrı "Konsept çalışma" başlığı ve "Sorun / Sonuç" yerine "Senaryo / Durum" ("Ne gösteriyor") başlıkları bunu açıkça söyler. Hero'daki "üç araç" ifadesi değişmedi.
- **Kapsam: talep panosu ve talep açma.** Rapor ekranı, bildirim, kullanıcı girişi, sürükle-bırak, mesai saatine göre hedef ve talep silme kapsam dışı (spec §9).
- **Durum düğmeyle değişir, sürükle-bırak yok.** Klavye ve telefonda aynı şekilde çalışır.
- **Başlangıç verisi iki dillidir.** Plan tek dilli veri öngörüyordu; İngilizce sayfada Türkçe talep başlıkları görünmesin diye başlıklar iki dilde tutulur. Bu yüzden her dilin panosu ayrı saklanır (Türkçe `portfolio.helpdesk-demo.v1`, İngilizce aynı anahtarın `.en` ekli hali); bir dilde yapılan değişiklik öteki dilin panosuna taşmaz.
- **Yalnızca yeni talep sahipsiz olabilir.** İşleme alınmış bir talep başka birine devredilebilir ama sahipsiz bırakılamaz; aksi halde "atanmamış talep işleme alınamaz" kuralı sonradan atama kaldırılarak aşılabilirdi (kod incelemesinin bulgusu). Arayüz "Atanmamış" seçeneğini yalnızca yeni talepte sunar; depolama doğrulaması da aynı kuralı uygular.
- **Duyuru alanı her mesajdan önce boşaltılır.** Aynı uyarı art arda geldiğinde ekran okuyucu yeniden okusun diye (kod incelemesinin bulgusu).
- **Demo arayüzü üç dosyaya bölündü:** `card.ts` (talep kutusu), `view.ts` (çizim ve form), `board.ts` (durum ve olaylar). Plan tek dosya öngörüyordu; fonksiyon ve dosya boyutu sınırı için ayrıldı.
- **Tam ekran demo sayfalarında görünmez bir "Demo" h2 başlığı var.** Demolar h3 ile başladığı için başlık sırası h1'den h3'e atlıyordu; dört demo sayfası için tek yerden düzeltildi.
- **Betik açıkken pano, kayıtlı talepler yüklenene kadar gizli kalır.** Geri gelen ziyaretçi bir an başlangıç panosunu görüp kendi panosuna atlamasın diye; betik kapalıyken ya da hata verirse başlangıç panosu görünür.
- **Talep kutusu "kart yok" kuralının istisnasıdır.** Talep sütunlar arasında taşınan ayrı bir nesne olduğu için kutudadır; ayrıntı `DESIGN.md`'de.
- **CV'de proje notu değişti:** "Üçü de aynı işletme için…" cümlesi dört maddelik listede yanlış okunacağı için "İlk üçü … sonuncusu konsept çalışmadır" oldu. İngilizce CV'nin tek sayfada kalması için yazdırma boşlukları daraltıldı.
- **Sahne görüntüsünde ekrandaki sütun başlıkları dört renklidir.** Sitenin arayüzü tek vurgu rengi kullanır; bu bir fotoğraf olduğu için Baran kareleri olduğu gibi onayladı.

### Hero geçişi (2026-10-08)

- **Hero alt kenarda düz renge değil, sayfa zeminine karışarak biter.** Baran hero ile ilk proje arasındaki yatay çizgiden hoşlanmadı. Hero düz zemin rengine sönüyordu, hemen altında ise ışık havuzlu zemin başlıyordu; görüntü ve karartma artık alt 16rem içinde maskeyle saydamlaşır (metin maskelenmez).
- **Işık havuzları ve imleç ışığı yavaşlayan bir eğriyle söner.** Doğrusal sönüşün bittiği yerde geniş ekranda kenar çizgileri görünüyordu.
- **Her ışık havuzu kendi karosunun içinde kalır.** Zemin deseni 168rem aralıkla yinelenir; karo kenarını aşan sıcak havuz sayfanın sağında düz bir yatay çizgiyle kesiliyordu (Baran ikinci çizgiyi de gösterdi). Havuzun merkezi aşağı alındı.
