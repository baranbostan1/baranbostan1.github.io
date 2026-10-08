---
name: Baran Berkay Bostan — Portföy
description: Koyu, sinematik kişisel portföy; lamba ışığındaki sahneler, tek kehribar vurgu, çalışan demolar.
colors:
  accent: "oklch(0.74 0.13 62)"
  ground: "oklch(0.115 0.014 255)"
  surface: "oklch(0.165 0.014 255)"
  line: "oklch(0.3 0.016 255)"
  ink: "oklch(0.94 0.015 80)"
  ink-soft: "oklch(0.72 0.02 75)"
  danger: "oklch(0.74 0.16 28)"
typography:
  display:
    fontFamily: "'Fraunces Variable', 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(2.375rem, 1.2rem + 5.2vw, 5rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.015em"
    fontVariation: "'opsz' 144"
  headline:
    fontFamily: "'Fraunces Variable', 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(2rem, 1.4rem + 2.6vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.015em"
    fontVariation: "'opsz' 144"
  title:
    fontFamily: "'Fraunces Variable', 'Iowan Old Style', Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  lead:
    fontFamily: "'Schibsted Grotesk Variable', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "'Schibsted Grotesk Variable', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  term:
    fontFamily: "'Schibsted Grotesk Variable', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    letterSpacing: "0"
  control:
    fontFamily: "'Schibsted Grotesk Variable', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
  data:
    fontFamily: "'IBM Plex Mono', ui-monospace, 'Cascadia Mono', monospace"
    fontSize: "0.9375rem"
    fontWeight: 400
    fontFeature: "'tnum'"
  tag:
    fontFamily: "'IBM Plex Mono', ui-monospace, 'Cascadia Mono', monospace"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: "0"
  focus: "2px"
  demo-tv: "0.5rem"
  demo-field: "0.75rem"
  demo-screen: "1.75rem"
  demo-phone: "2.25rem"
  demo-pill: "999px"
spacing:
  gutter: "1.25rem"
  gutter-wide: "2rem"
  stack: "1.75rem"
  column-gap: "4.5rem"
  section: "4rem"
  section-md: "6rem"
  section-lg: "8rem"
  container: "80rem"
components:
  arrow-link:
    textColor: "{colors.accent}"
    typography: "{typography.control}"
    rounded: "{rounded.none}"
    height: "3rem"
    padding: "0 1.25rem"
  arrow-link-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ground}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ground}"
    typography: "{typography.control}"
    rounded: "{rounded.none}"
    height: "3rem"
    padding: "0 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  button-outline:
    textColor: "{colors.accent}"
    typography: "{typography.control}"
    rounded: "{rounded.none}"
    height: "3rem"
    padding: "0 1.5rem"
  button-outline-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ground}"
  button-quiet:
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.none}"
    height: "3rem"
    padding: "0 1.5rem"
  button-quiet-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  segmented-option:
    textColor: "{colors.ink-soft}"
    typography: "{typography.control}"
    rounded: "{rounded.none}"
    height: "2.75rem"
  segmented-option-active:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ground}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    height: "2.875rem"
    padding: "0 0.875rem"
  tech-tags:
    textColor: "{colors.ink-soft}"
    typography: "{typography.tag}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    height: "2.75rem"
  nav-link-hover:
    textColor: "{colors.accent}"
---

# Design System: Baran Berkay Bostan — Portföy

Bu belge yayındaki yapıdan çıkarılmıştır (`src/styles/global.css`, `src/components/`, `src/layouts/`, `src/cinematic/`). Kod ile bu belge çelişirse kod geçerlidir; belge güncellenir.

## Overview

**Creative North Star: "Lamba Işığındaki Masa"**

Site, mesai sonrası tek lambayla aydınlanan bir çalışma masası gibi okunur: neredeyse siyah, soğuk bir zemin; üstünde sıcak ışık havuzları; sıcak tonda açık metin; yalnızca bir kehribar vurgu. Zemin, sahne görüntülerinin gölge tonundan alınmıştır, bu yüzden görüntü ile sayfa arasında dikiş görünmez. Sahne görüntüleri yapay zekâ ile üretilmiş kliplerdir ve her biri eski yöntemin araca dönüşmesini gösterir.

Kompozisyon bilinçli olarak standarttır: tam ekran sinematik hero, altında sırayla proje bölümleri (görüntü + bir cümle sorun, bir cümle sonuç, teknoloji etiketleri, tek bağlantı), sonra süreç, hakkımda ve iletişim. Yoğunluk düşüktür; her bölüm tek bir şey söyler. Proje sayfaları ve demolar aynı belirteçlerle ama görüntüsüz, sade kurulur; ağır medya yalnızca ana sayfadadır.

Hareket içeriği taşır, yerini almaz. Sinematik katman bir geliştirmedir: kapalıyken ya da hata verdiğinde her sahne dönüşümün bittiği son karesiyle durur ve sayfa eksiksiz okunur. Yalnızca koyu tema vardır.

**Key Characteristics:**
- Soğuk, neredeyse siyah zemin; düz değil: ışık havuzları ve film greni taşır.
- Tek kehribar vurgu; ikinci bir marka rengi yok.
- Fraunces başlık (büyük başlıklarda `opsz` 144), Schibsted Grotesk gövde, IBM Plex Mono yalnızca veri ve teknoloji etiketleri.
- Site denetimlerinde keskin köşe, 1px çizgi, gölge yok.
- Hero ve kapanışta tam kenarlı görüntü; proje bölümlerinde çerçeveli görüntü, yönü dönüşümlü.
- Üç hareket modu: `static`, `play`, `scrub`.

## Colors

Soğuk gölge üstünde sıcak ışık: nötrler mavi-lacivert (hue 255), metin ve vurgu sıcak (hue 62–80).

### Primary
- **Lamba Kehribarı** (`accent`): Birincil bağlantının çerçevesi ve dolgusu, seçili seçenek, terim etiketleri ("Sorun", "Sonuç"), süreç çizgisi ve adım numaraları, liste imleri, odak halkası, metin seçimi. Zemin ışık havuzlarının ve imleç ışığının rengi de budur (düşük opaklıkla).

### Neutral
- **Gece Zemini** (`ground`): Sayfa zemini; vurgu dolgulu denetimlerin metin rengi; görüntü üstündeki karartma katmanlarının rengi.
- **Koyu Yüzey** (`surface`): Form alanları, sahne görüntüsünün yüklenme zemini, QR menü demosunun ekranı.
- **İnce Çizgi** (`line`): Bölüm ayırıcıları, tablo satırları, alan ve ikincil buton çerçeveleri (1px).
- **Sıcak Kâğıt** (`ink`): Başlık ve gövde metni.
- **Soluk Mürekkep** (`ink-soft`): İkincil metin, ipuçları, teknoloji etiketleri, tablo başlıkları.
- **Uyarı Kırmızısı** (`danger`): Yalnızca form doğrulama hatası (alan çerçevesi ve hata metni).

### Named Rules
**The Single Amber Rule.** Vurgu tektir. Kehribar yalnızca eylemi, seçili durumu, terim etiketini ve sırayı işaretler; gövde metni ya da geniş yüzey kehribar olmaz. İkinci bir vurgu rengi eklenmez; `danger` vurgu değil, hata durumudur.

**The Lit Ground Rule.** Zemin hiçbir sayfada düz renk değildir. `body::before` sayfa boyunca 168rem'de bir yinelenen üç ışık havuzu çizer (sağda kehribar %11, solda sıcak turuncu %10, sağ altta soğuk mavi %14); `body::after` sabit, %7 opaklıkta film greni ekler. Yeni bir bölüm opak bir şeritle bu ışığı kesmez.

## Typography

**Display Font:** Fraunces Variable (yedek: Iowan Old Style, Georgia, serif)
**Body Font:** Schibsted Grotesk Variable (yedek: system-ui, sans-serif)
**Label/Mono Font:** IBM Plex Mono 400/500 (yedek: ui-monospace, Cascadia Mono)

**Character:** Yüksek kontrastlı, yumuşak hatlı bir serif başlık ile sade, biraz geniş bir grotesk gövde. Fontlar siteye gömülüdür (Fontsource; yalnızca latin ve latin-ext). Üç font da sahibin onayladığı spec ile sabittir; Fraunces'in yaygın kullanılan bir yüz olduğu bilinerek kabul edilmiş bir istisnadır ve değiştirilmez.

### Hierarchy
- **Display** (400, `clamp(2.375rem, 1.2rem + 5.2vw, 5rem)`, 1.08, -0.015em, `opsz` 144): Hero başlığı ve İletişim başlığı; en çok 17ch. Proje sayfası başlığı aynı kesimi 2.75rem tabanla kullanır.
- **Headline** (400, `clamp(2rem, 1.4rem + 2.6vw, 3.5rem)`, 1.08, `opsz` 144): Ana sayfa bölüm ve proje başlıkları.
- **Title** (400, 1.5rem, 1.08): Süreç adımları, yetkinlik başlıkları, demo içi başlıklar. Proje sayfasının bölüm başlıkları 1.5–2rem arasında ölçeklenir.
- **Lead** (400, 1.125rem, 1.55): Bölüm giriş paragrafı ve sorun/sonuç cümleleri; 44–52ch.
- **Body** (400, 1rem, 1.6): Gövde; en çok 62ch (CV'de 68ch).
- **Term** (600, 0.875rem, harf aralığı 0, kehribar): Bir içeriği adlandıran terimler: "Sorun", "Sonuç", menü kategorisi, panel başlığı. Düz yazılır; büyük harfe çevrilmez.
- **Control** (500, 0.9375–1rem): Bağlantı, buton, üst menü.
- **Data** (IBM Plex Mono 400, 0.9375rem, `tabular-nums`): Saat, kur, tutar, fiyat, fatura no. Öne çıkan tek rakam 1.625rem'e çıkar.
- **Tag** (IBM Plex Mono 400, 0.8rem, 1.4): Teknoloji etiketleri. 0.8rem alt sınırdır; daha küçük metin yoktur.

### Named Rules
**The Mono Is Data Rule.** IBM Plex Mono yalnızca ölçülen ya da hesaplanan değerde ve teknoloji adlarında kullanılır. Ad, menü, dil değiştirici, buton ve tablo başlıkları gövde fontuyla yazılır: başlık veri değil, etikettir.

**The Opsz 144 Rule.** Display ve Headline başlıkları `font-variation-settings: 'opsz' 144` ile aynı kesimde çizilir. 1.5rem ve altındaki başlıklarda eksen ayarlanmaz.

## Layout

Tek sütunlu, mobile-first bir akış; içerik `80rem` genişliğinde ortalanır, kenar boşluğu 1.25rem, 640px'ten sonra 2rem. 1024px'ten itibaren ana sayfa bölümleri iki sütuna açılır: proje bölümlerinde görüntü 7, metin 5 birim alır ve görüntünün yanı bölümden bölüme değişir; süreç ve hakkımda bölümlerinde başlık 5, içerik 7 birimdir. Sütun arası 4.5rem'dir.

Dikey ritim üç kademelidir: proje bölümlerinde 4rem / 6rem / 8rem, metin bölümlerinde 5rem / 7rem / 9rem (dar / 640px / 1024px). Bölüm içi öğeler 1.75rem aralıkla dizilir. Proje sayfalarında bölümler 5rem boşluk ve 1px çizgiyle ayrılır; Problem–Çözüm ve Teknik–Sonuç çiftleri 900px'te yan yana gelir.

Hero `100svh` yüksekliğindedir; metin sol alttadır. Kapanış sahnesi `88svh`'dir. Dar ekranda görüntüler metnin üstünde durur ve hero kadrajı özneyi kaybetmemek için sağa kayar (`object-position: 80% 50%`). Dokunma hedefleri en az 2.75rem, birincil eylemler 3rem yüksekliğindedir. Dar ekranda veri tabloları satır başına bir bloğa dönüşür; yatay kaydırma olmaz.

## Elevation & Depth

Derinlik gölgeyle değil ışıkla kurulur. Site yüzeyleri düzdür; katman hissi zemindeki ışık havuzlarından, film greninden ve görüntülerin zemine karışmasından gelir. Hero'da görüntünün altı ve solu zemin rengine doğru koyulaşır; kapanış sahnesi üstten ve alttan maskeyle saydamlaşır, böylece opak bir şerit oluşmaz. Geniş ekranda ve ince imleçte imleci izleyen 36rem çaplı, %9 opaklıkta kehribar bir ışık eklenir.

### Shadow Vocabulary
- **Cihaz gölgesi — telefon** (`box-shadow: 0 2rem 4rem -1.5rem oklch(0 0 0 / 0.7)`): QR menü demosundaki telefon gövdesi.
- **Cihaz gölgesi — TV** (`box-shadow: 0 2.5rem 5rem -2rem oklch(0 0 0 / 0.8)`): Lobi demosundaki TV gövdesi.

### Named Rules
**The Light Not Shadow Rule.** Site denetimleri, bölümler ve çerçeveli görüntüler gölge taşımaz. Gölge yalnızca bir cihazı temsil eden demo gövdesinin altında durur.

## Shapes

Site denetimlerinin ve çerçevelerin köşesi keskindir (yarıçap 0): bağlantılar, butonlar, form alanları, seçenek grupları, görüntü çerçeveleri. Ayırıcılar ve çerçeveler 1px'tir. Oklar ve simgeler 1.5px çizgiyle, kare uçlu SVG olarak çizilir; ok karakteri ya da simge fontu kullanılmaz. Liste imleri karedir.

Yuvarlak biçim üç yerde görülür ve üçü de denetim değildir: süreç adımlarının numara halkası, imleç ışığı ve cihaz gövdeleri. Odak halkası 2px kehribar çizgidir, 3px dışarıdadır.

### Named Rules
**The Sharp Chrome Rule.** Sitenin kendi arayüzünde yarıçap 0'dır. İstisna kurgusal uygulamadır: QR menü demosunun telefon arayüzü (kurgusal restoran "Zeytin Gölgesi") bilerek yuvarlak hatlıdır: hap biçimli seçenekler (999px), 0.75rem arama alanı, 1.75rem ekran, 2.25rem gövde. O arayüz site değil, başka bir ürünün temsilidir; tam ekran sürümünde gövde yarıçapı kalkar. Lobi demosunun TV gövdesi 0.5rem'dir (kurgusal "Otel Defne Koyu").

## Components

Denetimler ince çizgili ve sakin durur; dolgu yalnızca eylem anında ya da seçili durumda görünür.

### Buttons
- **Shape:** Keskin köşe (0), 1px çerçeve, 3rem yükseklik, yatay 1.25–1.5rem iç boşluk, ağırlık 500.
- **Arrow link (birincil bağlantı):** Kehribar çerçeve ve metin, sağında çizilmiş ok. Hover ve odakta kehribarla dolar, metin zemin rengine döner, ok 4px sağa kayar.
- **Primary (form gönderimi):** Kehribar dolgu, zemin rengi metin; hover'da dolgu `ink` olur.
- **Outline:** Kehribar çerçeve ve metin; hover'da kehribarla dolar.
- **Quiet:** `line` çerçeve, `ink` metin; hover'da `ink` ile dolar. Geri alınabilir ya da ikincil eylemler için (ör. demoyu sıfırla).
- **Geçiş:** Renk ve dolgu 200ms, `cubic-bezier(0.16, 1, 0.3, 1)`; `prefers-reduced-motion` altında geçiş yoktur.

### Chips
- **Segmented seçenek:** 1px `line` çerçeveli, 0.1875rem iç boşluklu iki sütunlu grup; seçenekler 2.75rem. Seçili olan kehribar dolgu ve zemin rengi metin alır. Sitede keskin, QR menü demosunun içinde hap biçimlidir.
- **Teknoloji etiketleri:** Çerçevesiz, dolgusuz düz mono metin listesi; öğeler arası 1.5rem. Rozet ya da kutu değildir.

### Cards / Containers
- **Kart yok.** Proje bölümleri kutuya alınmaz; görüntü ve metin doğrudan zemin üstünde durur. Gruplama boşlukla ve 1px çizgiyle yapılır.
- **Veri şeridi:** Üstte ve altta 1px `line`, dikey 1rem boşluk; soluk etiket üstte, mono değer altta. Ana sayfada canlı saat/kur şeridi ve bakiye sayacı, demoda özet satırı bu kalıbı kullanır.
- **Cihaz gövdeleri:** Yalnızca demolar için; bkz. Shapes ve Elevation.
- **Pano sütunu (destek talepleri demosu):** Başlık gövde fontunda, 500 ağırlık; sağında mono talep sayısı; altında 1px `line`. 1024px ve üstünde dört sütun yan yana, altında tek sütun.
- **Talep kutusu (destek talepleri demosu):** "Kart yok" kuralının tek istisnası; talep taşınan, ayrı bir nesne olduğu için kutudadır. `surface` dolgu, 1px `line` çerçeve, keskin köşe, 1rem iç boşluk, gölge yok. Başlık gövde fontunda; süre mono; "Acil" kehribar, "Hedefi aştı" `danger` ve her ikisi de metinle yazılır. Kutudaki ilk eylem Outline, diğerleri Quiet düğmedir (2.75rem).
- **Konsept rozeti:** 1px kehribar çerçeveli, keskin köşeli düz metin; başlığın üstünde değil yanında durur, dar ekranda alt satıra iner. Yalnızca gerçek kullanımda olmayan projeyi işaretler.

### Inputs / Fields
- **Style:** `surface` dolgu, 1px `line` çerçeve, keskin köşe, 2.875rem yükseklik, 1rem metin; etiket alanın üstünde, 500 ağırlık; ipucu altında `ink-soft`.
- **Hover / Focus:** Hover'da çerçeve `ink-soft`; odakta genel odak halkası.
- **Error:** Çerçeve ve alan altındaki mesaj `danger`.

### Navigation
- Üstte sayfaya bindirilmiş, zeminsiz bir satır: solda ad, sağda diğer dilin adı. 0.9375rem, 500, `ink`; hover'da kehribar. Menü, simge ya da sabitlenen çubuk yoktur. Tam ekran demo sayfalarında bunun yerine altı çizgili ince bir şerit (geri bağlantısı + dil) bulunur. Alt bilgi 1px çizgiyle ayrılır, küçük ve `ink-soft` yazılır.

### Scene (imza bileşen)
Her sahnenin üç varlığı vardır: başlangıç karesi, bitiş karesi ve klip (geniş ve dar ekran sürümleriyle). Mod, sayfa çizilmeden önce `html[data-cine]` olarak atanır:
- **`static`** (hareket azaltma ya da Save-Data): yalnızca bitiş karesi.
- **`play`** (dar ekran ya da dokunmatik): başlangıç karesi görünür; sahnenin %35'i görünüme girince klip bir kez oynar ve son karede kalır. Klipler döngüye girmez.
- **`scrub`** (≥1024px ve ince imleç): `play` davranışına ek olarak hero ekrana sabitlenir ve klibi 60svh'lik kaydırma mesafesi boyunca ilerletir; yumuşak kaydırma, imleç ışığı, birincil bağlantılarda en çok 6px çekim ve çerçeveli görüntülerde en çok 3° eğim açılır.

Klip yüklenemezse sahne bitiş karesine döner. Hero başlığı kelime kelime belirir (800ms, kelime başına 55ms gecikme); süreç çizgisi bölüm kaydırıldıkça çizilir. Proje bölümlerinde görüntü 16:10 çerçevededir; hero ve kapanışta tam kenarlıdır.

### Named Rules
**The End Frame Rule.** Hiçbir içerik videoya bağlı değildir. Her sahne, hareket kapalıyken dönüşümün bittiği hâli gösteren bir bitiş karesiyle eksiksizdir; yeni bir sahne bu üç varlık olmadan eklenmez.

## Do's and Don'ts

### Do:
- **Do** renkleri yalnızca yedi belirteçten al (`ground`, `surface`, `line`, `ink`, `ink-soft`, `accent`, `danger`); saydam tonları aynı belirtecin opaklığıyla üret.
- **Do** büyük başlıkları Fraunces 400, `opsz` 144, satır yüksekliği 1.08 ve -0.015em ile yaz; uzunluğu `ch` ile sınırla (başlık 17ch, paragraf 44–62ch).
- **Do** sayıları ve teknoloji adlarını IBM Plex Mono ile, değişen sayıları `tabular-nums` ile yaz.
- **Do** site denetimlerini keskin köşeli, 1px çerçeveli ve en az 2.75rem yükseklikte kur; birincil eylemi 3rem yap.
- **Do** her yeni sahneye başlangıç karesi, bitiş karesi ve klip üret; `static` modda bitiş karesinin tek başına anlamlı olduğunu doğrula.
- **Do** geçişlerde `cubic-bezier(0.16, 1, 0.3, 1)` kullan ve her geçişi `prefers-reduced-motion` altında kapat.
- **Do** kurgusal bir ürünü temsil eden demoya kendi biçim dilini ver, ama renk ve font belirteçlerini siteden al.

### Don't:
- **Don't** başlığın üstüne küçük etiket (kicker, eyebrow) koyma; terim etiketi yalnızca adlandırdığı içeriğin hemen üstünde durur.
- **Don't** proje bölümlerini birbirinin aynısı kartlara çevirme; kutu, dolgu ve gölgeyle gruplama.
- **Don't** ikinci bir vurgu rengi, mor gradient ya da gradient metin ekleme.
- **Don't** gövde ya da başlık için varsayılan Inter veya sistem fontu kullanma; üç font sabittir.
- **Don't** site denetimlerine yarıçap ya da gölge verme; yuvarlak hatlar yalnızca kurgusal uygulamanın içindedir.
- **Don't** klipleri döngüye alma ve içeriği videonun oynamasına bağlama.
- **Don't** açık tema ekleme; site yalnızca koyudur.
- **Don't** bir bölümü zemindeki ışığı kesen opak, düz renkli bir şerit olarak kurma.
