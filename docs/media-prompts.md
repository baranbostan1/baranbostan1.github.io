# Medya üretim kaydı

Sahne görüntüleri Higgsfield üzerinden üretildi. Hero klibi kodlama sırasında 1,7–3,1. saniyelere kırpılır ve 2× yavaşlatılır (`scripts/encode-media.mjs` içindeki `EDITS`). Ham dosyalar `media-src/` altında (repoya girmez); siteye giren dosyalar `node scripts/encode-media.mjs <ad>` ile `public/media/` altına kodlanır.

Her sahnede yöntem aynı: önce bir çapa kare üretilir, eş kare ondan türetilir (aynı kadraj, yalnızca dönüşen şey değişir), sonra iki kare başlangıç ve bitiş olarak verilip klip üretilir.

Ortak kurallar (her istemde): insan, el, yüz yok; okunabilir yazı, harf, rakam yok; logo, marka, tabela yok; tanınabilir yer yok. Kâğıt ve ekranlardaki "yazı" bulanık ya da yer tutucu çizgidir.

| Sahne | Ne | Model | Ayar |
|---|---|---|---|
| hero | Bitiş karesi: gece, loş masa, yanan ekran | GPT Image 2.5 | 16:9, 2K, orta kalite |
| hero | Başlangıç karesi: aynı masa, ekran kapalı (bitiş karesinden türetildi) | GPT Image 2.5 | aynı |
| hero | Klip: ekran yanar, ışık masayı doldurur | Kling 3.0 Pro | 5 sn, 16:9, sessiz, başlangıç + bitiş karesi |
| qr-menu | Başlangıç karesi: tahta tutucuda basılı menü kartı | GPT Image 2.5 | 16:9, 2K, orta kalite |
| qr-menu | Başlangıç karesi v2: karttaki satırlar keskin yer tutucu çizgilerle (Baran'ın geri bildirimi) | GPT Image 2.5 | aynı |
| qr-menu | Bitiş karesi: aynı tutucuda telefon, dijital menü (başlangıç karesinden türetildi) | GPT Image 2.5 | aynı |
| qr-menu | Klip: kart yerinde telefona dönüşür | Kling 3.0 Pro | 5 sn, 16:9, sessiz, başlangıç + bitiş karesi |
| lobby | Bitiş karesi: duvarda açık TV, bilgi paneli; başlangıç karesi ondan türetildi (TV kapalı) | GPT Image 2.5 | 16:9, 2K, orta kalite |
| lobby | Klip: TV açılır, panel parça parça dolar | Kling 3.0 Pro | 5 sn, 16:9, sessiz, başlangıç + bitiş karesi |
| agency | Başlangıç karesi: masada dağınık fatura yığını; bitiş karesi ondan türetildi (derli toplu deste, monitörde tablo) | GPT Image 2.5 | aynı |
| agency | Klip: yığın kendiliğinden derlenir, monitörde tablo satır satır dolar | Kling 3.0 Pro | aynı |
| closing | Bitiş karesi: yan yana üç açık ekran (telefon, monitör, dizüstü); başlangıç karesi ondan türetildi (ekranlar kapalı) | GPT Image 2.5 | aynı |
| closing | Klip: ekranlar soldan sağa sırayla açılır | Kling 3.0 Pro | aynı |
| helpdesk | Başlangıç karesi: kapalı monitör, çerçevesinde ve masada yapışkan notlar; bitiş karesi ondan türetildi (notlar yok, ekranda dört sütunlu pano) | GPT Image 2.5 | aynı |
| helpdesk | Klip: notlar tek tek kalkıp ekrana doğru kaybolur, ekran açılır, sütunlar dolar | Kling 3.0 Pro | aynı |

## İstem özetleri

- **hero / bitiş:** Sinematik geniş kare, gece. Hafif yukarıdan üç çeyrek açıyla loş bir çalışma masası. Sağ yarıda sıcak kehribar ışık yayan açık bir dizüstü; ekranda yalnızca odak dışı soyut ışık blokları. Dağınık kâğıtlar, dosyalar, kalem, düz bir kupa. Karenin sol üçte biri neredeyse siyah ve boş (metin için). 35mm anamorfik görünüm, sığ alan derinliği, film greni.
- **hero / başlangıç:** Aynı kare; yalnızca ışık değişir: ekran kapalı ve siyah, sahne çok loş, soğuk ve zayıf bir ortam ışığı.
- **hero / klip:** Sabit kamera, çok yavaş ileri hareket. Ekran bir kez titreyip yanar; kehribar ışık klavyeye, kâğıtlara, kaleme ve kupaya yayılır. Başka hiçbir şey kıpırdamaz.
- **qr-menu / başlangıç:** Sinematik yakın kare, akşam. Koyu ahşap restoran masası; küçük tahta tutucuda krem kâğıda basılı menü kartı. Yanında su bardağı ve katlı peçete, sağda mum ışığı, arkada loş bokeh.
- **qr-menu / başlangıç v2:** Aynı kare; karttaki bulaşık çizgiler yerine keskin baskı düzeni: üstte küçük bir süs ve başlık çubuğu, üç bölüm, her satırda solda çubuk, noktalı çizgi, sağda kısa fiyat çubuğu. Harf ve rakam yok.
- **qr-menu / bitiş:** Aynı kare; kartın yerinde, aynı tutucuda dik duran markasız bir telefon. Ekranda koyu temalı dijital menü: başlık, kategori çipleri, küçük görselli satırlar; yazılar okunmaz çizgiler.
- **qr-menu / klip:** Sabit kamera. Kâğıt kart yerinde telefona dönüşür: kenarlar ince koyu gövdeye, kâğıt parlayan ekrana, basılı satırlar dijital listeye. Bardak, peçete ve arka plan yerinde; yalnızca mum alevi titrer.
- **helpdesk / başlangıç:** Sinematik geniş kare, gece. Hafif yukarıdan üç çeyrek açıyla koyu ahşap ofis masası. Sağ yarıda kapalı, markasız bir monitör; çerçevesine üst üste yapıştırılmış ve masaya dağılmış sarı-turuncu yapışkan notlar, üzerlerinde okunmaz karalama çizgiler. Düz klavye, düz kupa, kalem. Sağdan sıcak kehribar lamba ışığı; sol üçte bir neredeyse siyah ve boş.
- **helpdesk / bitiş:** Aynı kare; yalnızca şu değişir: bütün notlar gitmiş, masa temiz. Monitör açık; koyu temalı, dört dikey sütunlu düzenli bir pano. Kutularda yalnızca kısa yer tutucu çubuklar, birkaçında kehribar bir çubuk. Çerçevede logo yok.
- **helpdesk / klip:** Sabit kamera. Notlar tek tek kalkıp karanlık ekrana doğru süzülür ve içinde kaybolur; ardından ekran açılır, pano sütun sütun, kutu kutu dolar. Lamba, kupa, klavye, kalem ve arka plan kıpırdamaz.

## Harcama

| Tarih | Ne | Kredi |
|---|---|---|
| 2026-10-07 | 5 sabit kare (4 + 1 yeniden üretim) | 5 |
| 2026-10-07 | 2 klip | 17,5 |
| 2026-10-07 | 6 sabit kare (lobi, acenta, kapanış) | 6 |
| 2026-10-07 | 3 klip (lobi, acenta, kapanış) | 26,25 |
| 2026-10-08 | 2 sabit kare (destek talepleri) | 2 |
| 2026-10-08 | 1 klip (destek talepleri) | 8,75 |
| | **Toplam** | **65,5** |
