import type { ProjectContent } from './types';

const qrMenu: ProjectContent = {
  id: 'qr-menu',
  kind: 'real',
  title: 'QR Menü',
  summary: 'Erdek’te bir otelin restoranı için QR kodla açılan dijital menü ve içeriğini yöneten admin paneli.',
  sceneProblem: 'Basılı menüde her fiyat değişikliği yeniden baskı masrafıydı.',
  sceneResult: '2026 yaz sezonu boyunca restoranda kullanıldı; fiyat ve ürünleri panelden ben güncelledim.',
  sceneAlt: 'Basılı bir menü kartı, telefon ekranındaki dijital menüye dönüşüyor.',
  tags: ['HTML/CSS/JS', 'Firebase Firestore', 'Cloudflare'],
  problem:
    'Restoranda basılı menü kullanılıyordu; her fiyat değişikliği yeniden baskı masrafıydı. Hazır QR menü servislerinin aboneliğine para ödenmesi de istenmiyordu.',
  solution:
    'QR kodla açılan bir dijital menü ve içeriğini yönetmek için bir admin paneli yaptım. Misafir kodu okutur, menü telefonunda açılır. Ürün ya da fiyat değişince panelden güncellenir; yeniden baskı gerekmez.',
  technical: [
    'Düz HTML, CSS ve JavaScript; veriler Firebase Firestore’da, sitenin önünde Cloudflare.',
    'Kategori filtresi; ürün adı ve açıklamasında arama; isteğe bağlı ürün görseli.',
    'Türkiye saatine göre otomatik Gündüz/Akşam menüsü (08:00–19:00 gündüz). Kısıt hem kategoriye hem tek tek ürüne verilebiliyor.',
    'Kategori sırası admin panelinden belirleniyor.',
    'Menü dili Türkçe.',
  ],
  outcome: '2026 yaz sezonu boyunca restoranda kullanıldı. Fiyat ve ürünleri panelden ben güncelledim. Otel sezonluk çalışıyor; menü yeni sezon için yerinde duruyor.',
  demoNote:
    'Bu demo kurgusal bir restoranla çalışır; ürünler ve fiyatlar uydurmadır. Admin paneli demoya dahil değildir.',
};

const agency: ProjectContent = {
  id: 'agency',
  kind: 'real',
  title: 'Acenta Fatura ve Ödeme Takibi',
  summary: 'Acentalara kesilen faturaları ve gelen ödemeleri kaydedip acenta bazında bakiyeyi gösteren dahili araç. Muhasebe için değil, ön büro takibi için.',
  sceneProblem: 'Hangi acentanın ne kadar borcu olduğu tek bakışta görülemiyordu.',
  sceneResult: 'Yaklaşık iki yıl kullandım; kayıtları ben girdim ve yönetime raporu bu araçtan verdim.',
  sceneAlt: 'Üst üste yığılmış faturalar düzenli satırlara, sonra ekrandaki bir tabloya dönüşüyor.',
  tags: ['Firebase Firestore', 'JavaScript', 'CSV'],
  problem:
    'Acentalara kesilen faturalar ve acentalardan gelen ödemeler acenta bazında takip edilmiyordu. Kimin ne kadar borcu olduğu tek bakışta görülemiyordu.',
  solution:
    'Fatura ve ödeme kayıtlarını tutan, acenta bazında bakiyeyi gösteren dahili bir araç yaptım. Muhasebe programının yerini almaz; ön büronun “kim ne kadar borçlu” sorusunu yanıtlar.',
  technical: [
    'Tek sayfalık web uygulaması; veriler Firebase Firestore ile canlı senkron.',
    'Fatura kaydı (acenta, tarih, fatura no, tutar) ve ödeme kaydı (acenta, tarih, tutar).',
    'Acentaya göre filtre, sıralama ve hızlı özet.',
    'Excel ya da Sheets’ten yapıştırarak toplu aktarma; CSV olarak dışa aktarma.',
    'Bu demodaki bakiye mantığı arayüzden ayrı, test-önce (TDD) yazılmış fonksiyonlardır; tutarlar kuruş cinsinden tam sayı olarak hesaplanır.',
  ],
  outcome: 'Yaklaşık iki yıl kullanıldı. Kayıtları ben girdim ve yönetime raporu bu araçtan verdim. Öncesinde bu takip yapılmıyordu.',
  demoNote:
    'Fatura ya da ödeme ekleyin; acenta bakiyesi ve genel özet anında değişir. Eklediğiniz kayıtlar yalnızca sizin tarayıcınızda durur, hiçbir yere gönderilmez.',
};

const lobby: ProjectContent = {
  id: 'lobby',
  kind: 'real',
  title: 'Lobi Bilgi Ekranı',
  summary: 'Erdek’te bir otelin resepsiyonunun karşısındaki TV için yaptığım, sezon boyunca 7/24 açık kalan web tabanlı bilgi paneli.',
  sceneProblem: 'Misafirlerin sık sorduğu bilgiler için sürekli açık bir ekran yoktu.',
  sceneResult: 'Yaklaşık iki yıl, otelin açık olduğu sezonlarda resepsiyonun karşısındaki TV’de çalıştı; kurulumunu ben yaptım.',
  sceneAlt: 'Duvardaki karanlık bir TV açılıyor; ekran saat, döviz kuru ve hava durumuyla doluyor.',
  tags: ['HTML/CSS/JS', 'Cloudflare Workers', 'Wake Lock API'],
  problem:
    'Misafirlerin sık sorduğu bilgiler (saatler, fiyatlar, döviz kuru, hava durumu) için resepsiyonun karşısında sürekli açık bir ekran yoktu.',
  solution:
    'TV’de 7/24 açık kalacak web tabanlı bir bilgi paneli yaptım. TV’ye bir Android TV çubuğu taktırdım; paneli bir kiosk uygulamasıyla tam ekran açılacak şekilde kurdum.',
  technical: [
    'Düz HTML, CSS ve JavaScript; Cloudflare Workers üzerinde statik yayın, güvenlik başlıkları ve içerik güvenlik politikasıyla.',
    'Döviz kuru ve hava durumu, anahtar gerektirmeyen ücretsiz API’lerden geliyor (fawazahmed0 currency-api, Open-Meteo).',
    'Metinler, fiyatlar ve duyurular kod bilmeyen birinin düzenleyebileceği ayrı bir ayar dosyasında.',
    'Hafta içi ve hafta sonu oda fiyatı güne göre kendiliğinden değişiyor.',
    'İsteklerde zaman aşımı ve yeniden deneme var. Bağlantı kesilince son veri “Çevrimdışı” etiketi ve saatiyle gösteriliyor; bağlantı gelince tazeleniyor.',
    '7/24 çalışma önlemleri: Wake Lock API, her gece 04:00’te otomatik yenileme, ekran yanmasına karşı piksel kaydırma, imleç gizleme.',
    '1920×1080 sahne her çözünürlüğe orantılı sığıyor. QR kodlar ve kayan duyuru bandı var.',
  ],
  outcome: 'Yaklaşık iki yıl, otelin açık olduğu sezonlarda resepsiyonun karşısındaki TV’de 7/24 çalıştı. Bu sürede iki üç kez yeniden tasarladım. Kurulumunu ben yaptım. Otel sezonluk çalışıyor; panel yeni sezon için yerinde duruyor.',
  demoNote: 'Aşağıdaki panel kurgusal bir otelle çalışır. Saat, döviz kuru ve hava durumu gerçek ve canlıdır; gerçek panelle aynı iki API’den gelir.',
};

const helpdesk: ProjectContent = {
  id: 'helpdesk',
  kind: 'concept',
  title: 'Ofis IT Destek Talepleri',
  summary: '20 kişilik bir ofisin IT destek taleplerini takip eden konsept bir araç: talep açılır, atanır, çözülünce kapanır.',
  sceneProblem: 'Küçük ofislerde IT talepleri mesajla, sözle, yapışkan notla gelir; hangisinin beklediği unutulur.',
  sceneResult: 'Otel dışında bir ortam için kurduğum konsept: taleplerin kimde olduğu ve ne kadardır beklediği tek ekranda.',
  sceneAlt: 'Monitörün çevresine yapıştırılmış notlar, ekrandaki düzenli bir talep panosuna dönüşüyor.',
  tags: ['TypeScript', 'localStorage', 'TDD'],
  problem:
    'Küçük bir ofiste destek talepleri dağınık kanallardan gelir: mesaj, koridorda söylenen bir cümle, monitöre yapıştırılmış bir not. Kimin neyi beklediği, hangi talebin acil olduğu ve hangisinin unutulduğu görünmez.',
  solution:
    'Talepleri tek yerde toplayan bir pano kurdum. Her talep önceliğine ve durumuna göre görünür; kimde olduğu, ne kadardır açık olduğu ve hedef süreyi aşıp aşmadığı yazar.',
  technical: [
    'TypeScript; backend yok, veriler yalnızca tarayıcıda (localStorage) durur.',
    'Dört durum (Yeni, İşlemde, Kullanıcı bekleniyor, Çözüldü) ve aralarında izin verilen geçişler; atanmamış talep işleme alınamaz.',
    'Önceliğe göre hedef süre: Acil 4 saat, Normal 24 saat, Düşük 72 saat. Hedefi aşan talep işaretlenir.',
    'Durum geçişleri, doğrulama ve süre hesabı arayüzden ayrı fonksiyonlardır ve test-önce (TDD) yazıldı.',
    'Durum düğmeyle değişir, sürükle-bırak yoktur; pano klavyeyle ve telefonda da kullanılır.',
  ],
  outcome: 'Konsept çalışma. Gerçek bir işletmede kullanılmadı; destek işinin mantığını ve otel dışında bir senaryoyu göstermek için yaptım.',
  demoNote: 'Yeni bir talep açın, birine atayın, durumunu ilerletin ve çözün; üstteki özet anında değişir. Kişiler ve talepler uydurmadır; veriler yalnızca sizin tarayıcınızda durur.',
};

export const projects: readonly ProjectContent[] = [qrMenu, lobby, agency, helpdesk];
