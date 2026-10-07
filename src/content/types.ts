// İçerik modüllerinin ortak tipleri. Her içerik dosyası iki dilde aynı tipi doldurur;
// eksik alan derleme hatası verir.
export interface UiStrings {
  siteName: string;
  skipToContent: string;
  switchLanguageName: string;
  footerNote: string;
  emailLabel: string;
  githubLabel: string;
  problemLabel: string;
  solutionLabel: string;
  resultLabel: string;
  technicalLabel: string;
  demoLabel: string;
  projectsHeading: string;
  backToHome: string;
  /** Görüntü henüz üretilmediyse taslakta görünen yer tutucu metni */
  mediaPending: string;
  openFullscreenDemo: string;
  backToProject: string;
  scanHeading: string;
  scanText: string;
  fullscreenDemoTitle: string;
  ogImageAlt: string;
}

export const CONTACT = {
  name: 'Baran Berkay Bostan',
  email: 'baranbostan11@gmail.com',
  githubUser: 'baranbostan1',
  githubUrl: 'https://github.com/baranbostan1',
} as const;

export type ProjectId = 'qr-menu' | 'lobby' | 'agency';

export interface ProjectContent {
  id: ProjectId;
  /** Sayfa başlığı ve özet */
  title: string;
  summary: string;
  /** Ana sayfa sahnesi: birer cümle */
  sceneProblem: string;
  sceneResult: string;
  /** Sahne görüntüsünün metin karşılığı */
  sceneAlt: string;
  /** 2–3 teknoloji etiketi */
  tags: readonly string[];
  problem: string;
  solution: string;
  technical: readonly string[];
  outcome: string;
  demoNote: string;
}

export interface HomeContent {
  metaTitle: string;
  metaDescription: string;
  hero: {
    title: string;
    lead: string;
    scrollHint: string;
    sceneAlt: string;
  };
  projectCta: string;
  live: {
    /** Lobi sahnesindeki canlı şerit */
    clockLabel: string;
    ratesLabel: string;
    ratesUnavailable: string;
    /** Acenta sahnesindeki bakiye sayacı */
    balanceLabel: string;
    balanceNote: string;
    invoiceAdded: string;
    paymentAdded: string;
  };
  howIWork: {
    heading: string;
    lead: string;
    whoLabel: string;
    steps: readonly { title: string; text: string; who: string }[];
  };
  about: {
    heading: string;
    lead: string;
    skills: readonly { title: string; text: string }[];
    educationHeading: string;
    education: string;
  };
  contact: {
    heading: string;
    lead: string;
    copyEmail: string;
    emailCopied: string;
    cvLabel: string;
    sceneAlt: string;
  };
}

export interface CvContent {
  metaTitle: string;
  metaDescription: string;
  headline: string;
  location: string;
  remoteNote: string;
  summaryHeading: string;
  summary: string;
  experienceHeading: string;
  experience: {
    title: string;
    place: string;
    period: string;
    points: readonly string[];
  };
  projectsHeading: string;
  projectsNote: string;
  educationHeading: string;
  education: { degree: string; school: string; year: string };
  skillsHeading: string;
  skills: readonly { label: string; items: string }[];
  languagesHeading: string;
  languages: readonly { name: string; level: string }[];
  downloadPdf: string;
  pdfFile: string;
}
