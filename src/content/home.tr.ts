import type { HomeContent } from './types';

export const home: HomeContent = {
  metaTitle: 'Baran Berkay Bostan — İşletme sorunlarından çalışan araçlara',
  metaDescription:
    'Yönetim Bilişim Sistemleri mezunu. Sezonluk çalışan bir otel için geliştirdiğim ve orada kullanılmış üç araç: QR menü, lobi bilgi ekranı ve acenta fatura takibi. Demolarıyla birlikte.',
  hero: {
    title: 'İşletmelerin gündelik sorunlarını, çalışan araçlara dönüştürüyorum.',
    lead: 'Yönetim Bilişim Sistemleri mezunuyum. Sorunu yerinde görür, çözümü planlar, AI destekli geliştirmeyle canlıya alırım. Aşağıdaki üç aracı Erdek’te sezonluk çalışan bir otel için geliştirdim; üçü de orada gerçek işte kullanıldı.',
    scrollHint: 'Kaydır',
    sceneAlt: 'Gece, loş bir çalışma masası; dağınık kâğıtların arasında yanan bir ekran masayı aydınlatıyor.',
  },
  projectCta: 'İncele',
  live: {
    clockLabel: 'Şu an',
    ratesLabel: 'Canlı kur',
    ratesUnavailable: 'Kur verisi alınamadı',
    balanceLabel: 'Açık bakiye',
    balanceNote: 'Uydurma veriyle çalışan demo sayacı',
    invoiceAdded: 'Fatura eklendi',
    paymentAdded: 'Ödeme eklendi',
  },
  howIWork: {
    heading: 'Nasıl çalışıyorum',
    lead: 'Sorunun tespiti, ürün kararları ve doğrulama bende; kodu AI ile üretiyorum. Bu site de aynı yöntemle yapıldı.',
    whoLabel: 'Kim',
    steps: [
      { title: 'Tespit et', text: 'İşin içindeyken eksik ya da zor olanı fark ederim.', who: 'Ben' },
      { title: 'Planla', text: 'Kim kullanacak, neye ihtiyaç var, en sade çözüm ne: bunları netleştiririm.', who: 'Ben' },
      { title: 'AI ile geliştir', text: 'Kodu Claude Code ve ChatGPT Codex ile üretirim; okur, yönlendiririm.', who: 'AI ve ben' },
      { title: 'Test et', text: 'Gerçek cihazda, gerçek kullanımda denerim.', who: 'Ben' },
      { title: 'Canlıya al', text: 'Yayınlar, kurar, sorun çıkınca düzeltirim.', who: 'Ben' },
    ],
  },
  about: {
    heading: 'Hakkımda',
    lead: 'Yönetim Bilişim Sistemleri mezunuyum. Resepsiyon deneyimim Erdek’te bir otelde; işin içindeyken eksik olanı gördüm ve bu üç aracı o işletme için geliştirdim.',
    skills: [
      {
        title: 'Sorunu ve süreci görmek',
        text: 'Acenta bakiyeleri takip edilmiyordu. İhtiyacı fark ettim ve aracı kurdum.',
      },
      {
        title: 'AI ile geliştirip canlıya almak',
        text: 'Üç araç geliştirdim; üçü de gerçek bir işletmenin günlük işinde kullanıldı.',
      },
      {
        title: 'Kurulum ve sahada çözüm',
        text: 'Lobi TV’si için bir Android TV çubuğu (Xiaomi Mi Stick) seçtirdim ve paneli bir kiosk uygulamasıyla kurdum. Panel ekrana sığmayınca tasarımı her çözünürlüğe oturacak şekilde düzenledim.',
      },
      {
        title: 'Teknik destek',
        text: 'Resepsiyonda çalışırken bilgisayar sorunlarında ilk aranan kişiydim. Günlük işte AKINSOFT Wolvox Otel, Muhasebe ve Cafe programlarını kullandım.',
      },
    ],
    educationHeading: 'Eğitim',
    education: 'Yönetim Bilişim Sistemleri, lisans. Bandırma Onyedi Eylül Üniversitesi, 2025.',
  },
  contact: {
    heading: 'İletişim',
    lead: 'Bir pozisyon ya da proje için e-postayla ulaşabilirsiniz. Uzaktan çalışmaya açığım.',
    copyEmail: 'E-postayı kopyala',
    emailCopied: 'Kopyalandı',
    cvLabel: 'CV',
    sceneAlt: 'Üç ekran yan yana, açık ve çalışıyor.',
  },
};
