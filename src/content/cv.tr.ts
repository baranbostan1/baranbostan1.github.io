import type { CvContent } from './types';

export const cv: CvContent = {
  metaTitle: 'Özgeçmiş — Baran Berkay Bostan',
  metaDescription:
    'Baran Berkay Bostan’ın özgeçmişi: Yönetim Bilişim Sistemleri mezunu; ön büro deneyimi ve bir işletme için geliştirdiği üç dijital araç.',
  headline: 'Yönetim Bilişim Sistemleri mezunu · IT ve yazılım destek, kurulum, iş analizi',
  location: 'Erdek, Balıkesir',
  remoteNote: 'Uzaktan çalışmaya açık',
  summaryHeading: 'Özet',
  summary:
    'Bir otelin resepsiyonunda çalışırken işin içindeki eksikleri gördüm ve aynı işletme için üç dijital araç geliştirdim: QR menü, lobi bilgi ekranı ve acenta fatura takibi. Sorunun tespiti, ürün kararları ve doğrulama bende; kodu AI araçlarıyla (Claude Code, ChatGPT Codex) üretiyor, okuyup yönlendiriyorum.',
  experienceHeading: 'Deneyim',
  experience: {
    title: 'Resepsiyon Görevlisi',
    place: 'Erdek’te bir otel (sezonluk)',
    period: 'Mayıs 2023 – Eylül 2026',
    points: [
      'Ön büroda günlük işte AKINSOFT Wolvox Otel, Muhasebe ve Cafe programlarını kullandım.',
      'Bilgisayar sorunlarında işletmede ilk aranan kişiydim.',
      'Acentalara kesilen faturaları ve gelen ödemeleri kendi geliştirdiğim araçla takip ettim; yönetime raporu bu araçtan verdim.',
      'Lobi TV’si için Android TV çubuğu seçtirdim, bilgi panelini kiosk uygulamasıyla kurdum ve yaklaşık iki yıl çalışır tuttum.',
      'Restoranın basılı menüsünü, panelden güncellenen QR menüye taşıdım.',
    ],
  },
  projectsHeading: 'Projeler',
  projectsNote: 'İlk üçü aynı işletme için geliştirildi ve orada kullanıldı; sonuncusu konsept çalışmadır. Çalışan demoları sitede.',
  conceptNote: 'Konsept',
  educationHeading: 'Eğitim',
  education: { degree: 'Yönetim Bilişim Sistemleri, lisans', school: 'Bandırma Onyedi Eylül Üniversitesi', year: '2025' },
  skillsHeading: 'Beceriler',
  skills: [
    { label: 'AI destekli geliştirme', items: 'Claude Code, ChatGPT Codex' },
    { label: 'Projelerde kullandıklarım', items: 'Firebase, Cloudflare, GitHub Pages' },
    { label: 'Temel düzeyde okuma', items: 'HTML, CSS, SQL' },
    { label: 'Ofis ve sistem', items: 'Excel (orta), Windows kurulumu, araştırarak sorun giderme' },
    { label: 'Otel yazılımları', items: 'AKINSOFT Wolvox Otel, Muhasebe, Cafe' },
  ],
  languagesHeading: 'Diller',
  languages: [
    { name: 'Türkçe', level: 'ana dil' },
    { name: 'İngilizce', level: 'orta' },
  ],
  downloadPdf: 'PDF indir',
  pdfFile: '/cv/baran-berkay-bostan-cv-tr.pdf',
};
