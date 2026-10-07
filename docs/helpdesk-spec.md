# Konsept Proje: Ofis IT Destek Talepleri — Tasarım Spec'i

Tarih: 2026-10-08 · Durum: Baran'ın yazılı onayını bekliyor

Bu belge, yayındaki portföy sitesine eklenecek dördüncü projenin spec'idir. Sitenin genel kuralları (`CLAUDE.md`, `docs/design-spec.md`, `DECISIONS.md`, `DESIGN.md`) aynen geçerlidir; bu belge yalnızca yeni projeye özgü kararları içerir.

## 1. Amaç

Baran'ın yalnızca otel bilmediğini, başka bir ortamın sorununa da çalışan bir araçla yanıt verebildiğini göstermek. Seçilen ortam hedef rollerle doğrudan ilgilidir: IT ve yazılım destek işinin günlük aracı olan talep (ticket) takibi.

**Başarı ölçütü:** Ziyaretçi bu projenin bir konsept olduğunu ilk bakışta anlar; demoda bir talep açar, atar, ilerletir ve kapatır; bekleme süresinin ve hedef aşımının nasıl gösterildiğini görür.

## 2. Doğruluk kuralları

- Proje **konsepttir**: gerçek bir işletmede kullanılmamıştır. Bu, ana sayfada, proje sayfasında, demoda ve CV'de açıkça yazılır.
- Hero metni değişmez; "üç araç" ifadesi korunur ve bu proje o sayıya dahil edilmez.
- Ofis kurgusaldır ve **adsızdır**: metinlerde "20 kişilik bir ofis" / "a 20-person office". Şirket adı uydurulmaz.
- Talep eden ve atanan kişiler uydurma, yaygın adlardır; soyadı yazılmaz. Demoda "Bu demodaki kişiler ve talepler uydurmadır" notu bulunur.
- "Bu aracı kullandım", "ekibime kurdum", çözüm süresi istatistiği gibi gerçek kullanım iması taşıyan hiçbir cümle yazılmaz.

## 3. Sitedeki yeri

| Yer | Değişiklik |
|---|---|
| Ana sayfa | Üç gerçek projeden sonra, "Nasıl çalışıyorum"dan önce, görünür bir "Konsept çalışma" / "Concept work" başlığı ve altında tek proje bölümü. Bölüm mevcut `ProjectScene` düzenini kullanır; terim etiketleri "Senaryo" ve "Ne gösteriyor". |
| Proje sayfası | TR `/projeler/destek-talepleri/`, EN `/en/projects/helpdesk/`. Bölümler: başlık ve özet → Senaryo → Çözüm → Demo → Teknik → Durum. Başlığın yanında "Konsept" işareti. |
| Tam ekran demo | TR `/demo/destek-talepleri/`, EN `/en/demo/helpdesk/` (arama motorlarına kapalı, diğer demolar gibi). |
| CV | Projeler listesinin sonunda, "Konsept" notuyla tek satır. PDF'ler yeniden üretilir ve tek sayfa kalmalıdır. |
| Site haritası | İki yeni proje sayfası eklenir. |
| Hero, Hakkımda, İletişim | Değişmez. |

**Metinler (TR; EN karşılıkları doğrudan çeviridir):**
- Başlık: "Ofis IT Destek Talepleri"
- Özet: "20 kişilik bir ofisin IT destek taleplerini takip eden konsept bir araç: talep açılır, atanır, çözülünce kapanır."
- Senaryo (ana sayfa): "Küçük ofislerde IT talepleri mesajla, sözle, yapışkan notla gelir; hangisinin beklediği unutulur."
- Ne gösteriyor (ana sayfa): "Otel dışında bir ortam için kurduğum konsept: taleplerin kimde olduğu ve ne kadardır beklediği tek ekranda."
- Senaryo (proje sayfası): Küçük bir ofiste destek talepleri dağınık kanallardan gelir; kimin neyi beklediği, hangi talebin acil olduğu ve hangisinin unutulduğu görünmez.
- Çözüm: Talepleri tek yerde toplayan, önceliğe ve duruma göre gösteren, her talebin ne kadardır açık olduğunu ve hedef süreyi aşıp aşmadığını işaretleyen bir pano.
- Durum: "Konsept çalışma. Gerçek bir işletmede kullanılmadı; destek işinin mantığını ve otel dışında bir senaryoyu göstermek için yaptım."
- Etiketler: `TypeScript`, `localStorage`, `TDD`

## 4. Demo

### 4.1 Talep

| Alan | Değerler |
|---|---|
| Başlık | 3–80 karakter, zorunlu |
| Kategori | Donanım, Yazılım, Hesap ve şifre, Ağ |
| Öncelik | Düşük, Normal, Acil |
| Talep eden | 2–40 karakter, zorunlu |
| Atanan | Atanmamış ya da iki kurgusal destek görevlisinden biri |
| Durum | Yeni, İşlemde, Kullanıcı bekleniyor, Çözüldü |
| Açılış zamanı | Talep açıldığında otomatik |
| Çözüm zamanı | Çözüldü'ye geçince otomatik; yeniden açılınca silinir |

### 4.2 Durum geçişleri

| Bulunduğu durum | İzin verilen eylemler |
|---|---|
| Yeni | İşleme al → İşlemde |
| İşlemde | Kullanıcıyı bekle → Kullanıcı bekleniyor · Çöz → Çözüldü |
| Kullanıcı bekleniyor | Devam et → İşlemde · Çöz → Çözüldü |
| Çözüldü | Yeniden aç → İşlemde |

- Atanmamış bir talep işleme alınamaz; önce atanmalıdır. Arayüz bu durumda eylem düğmesini devre dışı bırakmaz, basılınca nedenini yazar ve odağı atama alanına götürür.
- Atama her açık durumda değiştirilebilir; çözülmüş talepte değiştirilemez.
- İzin verilmeyen bir geçiş isteği reddedilir ve talep değişmeden kalır.

### 4.3 Süre ve hedef

- **Açık kalma süresi:** açılıştan şimdiye (çözülmüşse açılıştan çözüme) geçen süre. Gösterim: 60 dakikanın altı "45 dk", 24 saatin altı "3 sa 20 dk", üstü "2 gün 4 sa".
- **Hedef süre:** Acil 4 saat, Normal 24 saat, Düşük 72 saat. Takvim süresidir; mesai saati hesabı yapılmaz (kapsam dışı).
- **Hedefi aştı:** çözülmemiş bir talebin açık kalma süresi hedefini geçtiyse işaretlenir. İşaret yalnızca renk değildir; "Hedefi aştı" metni de yazar.
- Süreler dakikada bir yenilenir.

### 4.4 Özet

Üstte dört değer: açık talep sayısı, açık acil talep sayısı, hedefi aşan talep sayısı, en uzun bekleyen açık talebin süresi. Her eylemden sonra anında güncellenir.

### 4.5 Düzen ve etkileşim

- Geniş ekranda (≥ 1024px) duruma göre dört sütun; her sütunda talepler öncelik (Acil, Normal, Düşük) ve sonra açılış zamanına göre (eski üstte) sıralanır. Dar ekranda sütunlar alt alta gelir; boş sütun "Bu durumda talep yok" yazar.
- Talep kutusunda: başlık, kategori, öncelik, talep eden, atanan (seçim alanı), süre, hedef işareti ve o durumda izinli eylem düğmeleri.
- Durum yalnızca düğmeyle değişir; sürükle-bırak yoktur.
- Bir eylemden sonra talep yeni sütununa taşınır, klavye odağı aynı talebin üzerinde kalır ve değişiklik `aria-live` ile duyurulur ("Talep İşlemde durumuna alındı").
- "Yeni talep" formu: başlık, kategori, öncelik, talep eden. Hatalar ilgili alanın altında yazılır; gönderim başarılıysa talep Yeni sütununda görünür.
- "Demo'yu sıfırla" (onay sorar).
- Site denetimleri `DESIGN.md` kurallarına uyar: keskin köşe, 1px çizgi, tek kehribar vurgu; kart gölgesi yok. Öncelik ve hedef aşımı renkle birlikte metinle belirtilir.

### 4.6 Veri

- Başlangıç verisi: 9 uydurma talep; dört durumun her birinde en az bir talep, en az bir tanesi hedefi aşmış, en az biri atanmamış.
- Başlangıç taleplerinin açılış zamanları sabit tarih olarak değil, "şu andan X dakika önce" olarak tanımlanır ve demo ilk açıldığında gerçek zamana çevrilir; demo hangi gün açılırsa açılsın güncel görünür.
- Veri yalnızca tarayıcıda tutulur (`localStorage`, anahtar `portfolio.helpdesk-demo.v1`). Depolama kapalıysa demo bellek içinde çalışır ve bunu yazar.
- Depodan okunan veri güvenilmezdir: her kayıt doğrulanır; tek bir geçersiz kayıt varsa tümü reddedilir ve başlangıç verisine dönülür.

## 5. Sahne görüntüsü

Ana sayfadaki bölüm için diğer sahnelerle aynı yöntem ve aynı kurallar (okunabilir yazı, logo, marka, yüz yok):

- Başlangıç karesi: bir monitörün kenarına ve masaya üst üste yapıştırılmış yapışkan notlar; ekran kapalı.
- Bitiş karesi: aynı masa; notlar gitmiş, ekranda dört sütunlu düzenli bir pano.
- Klip: notlar tek tek ekrana doğru kaybolur, ekran açılır ve sütunlar dolar.

Üretim Higgsfield ile (GPT Image 2.5 kareler, Kling 3.0 Pro klip), yaklaşık 11 kredi. Kareler Baran'a gösterilir; onaylanınca klip üretilir. Kayıt `docs/media-prompts.md` dosyasına eklenir.

## 6. Yapı

| Birim | Sorumluluk | Bağımlılık |
|---|---|---|
| `src/demos/helpdesk/tickets.ts` | Tipler; talep doğrulama; durum geçişleri; atama; sıralama. Saf fonksiyonlar, girdiyi değiştirmez. | — |
| `src/demos/helpdesk/timing.ts` | Açık kalma süresi, hedef süre, hedef aşımı, süre biçimlendirme, özet. Şimdiki zaman parametre olarak verilir. | `tickets.ts` |
| `src/demos/helpdesk/seed.ts` | Göreli zamanlı başlangıç verisi ve onu gerçek zamana çeviren fonksiyon. | `tickets.ts` |
| `src/demos/helpdesk/storage.ts` | Yükleme, doğrulama, kaydetme, temizleme. | `tickets.ts`, `seed.ts` |
| `src/demos/helpdesk/strings.ts` | İki dilde arayüz metinleri. | — |
| `src/demos/helpdesk/board.ts` | Arayüz: durumu tutar, panoyu çizer, formu ve eylemleri işler. Tüm metin `textContent` ile yazılır. | yukarıdakiler |
| `src/components/demos/HelpdeskDemo.astro` | Demo iskeleti ve stilleri; JavaScript yokken başlangıç verisini durağan olarak gösterir. | `seed.ts`, `timing.ts` |

Sitenin ortak parçalarındaki değişiklikler:
- `ProjectContent` tipine `kind: 'real' | 'concept'` alanı eklenir; terim etiketleri buna göre seçilir: proje sayfasında (`Project.astro`) gerçek projede "Sorun / Sonuç", konseptte "Senaryo / Durum"; ana sayfa bölümünde (`ProjectScene.astro`) gerçek projede "Sorun / Sonuç", konseptte "Senaryo / Ne gösteriyor".
- `getProjects` gerçek projeleri, yeni `getConceptProjects` konsept projeyi döndürür; ana sayfa ikisini ayrı başlıklar altında çizer.
- `routes.ts` içine `helpdesk` ve `demo-helpdesk` sayfaları eklenir; sahne adları listesine `helpdesk` eklenir (`Scene.astro`, `encode-media.mjs`, `check-build.mjs`).

**Test-önce (TDD) zorunlu alanlar:** `tickets.ts` ve `timing.ts`.

## 7. Hata durumları

- Geçersiz form girişi: alan altında açık hata mesajı; odak ilk hatalı alana gider.
- İzinsiz durum geçişi: reddedilir; talep değişmez.
- Bozuk ya da eski `localStorage` verisi: başlangıç verisine dönülür, demo çökmez.
- Depolama kapalı: demo bellek içinde çalışır, not gösterilir.
- Sistem saati geri alınmışsa (açılış zamanı gelecekte görünürse): süre "0 dk" olarak gösterilir, eksi süre yazılmaz.
- Video oynatılamıyorsa: sahne son karesiyle kalır (mevcut davranış).

## 8. Doğrulama

- Birim testleri (Vitest): geçiş tablosunun tamamı, doğrulama sınırları, süre ve hedef hesabı (sınır değerleriyle), özet, sıralama, depolama (bozuk veri), göreli başlangıç verisi.
- Gerçek tarayıcıda senaryo (derlenmiş site, 1440 / 768 / 360): talep aç → ata → işleme al → beklet → çöz → yeniden aç; atanmamış talebi işleme almayı dene; boş form; yenileme sonrası kalıcılık; sıfırlama; bozuk depolama; yalnızca klavyeyle kullanım ve eylem sonrası odağın korunması; yatay taşma yok.
- Lighthouse eşikleri mevcut kurallarla aynı; anonimlik taraması (kaynak, derleme çıktısı, git geçmişi) temiz.
- Derleme sonrası denetim (`check-build.mjs`) yeni sahneyi de kapsar.
- İnceleme görüntüleri `scripts/capture-review.mjs` ile alınır.

## 9. Kapsam dışı

Rapor ve istatistik ekranı; e-posta ya da bildirim; kullanıcı girişi ve roller; birden çok kullanıcı arasında eşzamanlama; sürükle-bırak; mesai saatine göre hedef hesabı; talebe yorum ya da dosya ekleme; talep silme.

## 10. Onay noktaları

| # | Ne zaman | Baran neyi onaylar |
|---|---|---|
| 1 | Şimdi | Bu spec |
| 2 | Plan yazılınca | Uygulama planı ve yürütme yöntemi |
| 3 | Sahne kareleri üretilince | Kareler (klip üretiminden önce) ve maliyet |
| 4 | Yerelde bitince | Çalışan demo, proje sayfası ve ana sayfa bölümü (yayından önce) |
