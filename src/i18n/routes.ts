import type { Locale } from './locales';

export type ProjectPageId = 'qr-menu' | 'lobby' | 'agency' | 'helpdesk';
export type DemoPageId = `demo-${ProjectPageId}`;
export type PageId = 'home' | ProjectPageId | 'cv' | DemoPageId;

const PATHS: Record<PageId, Record<Locale, string>> = {
  home: { tr: '/', en: '/en/' },
  'qr-menu': { tr: '/projeler/qr-menu/', en: '/en/projects/qr-menu/' },
  lobby: { tr: '/projeler/lobi-ekrani/', en: '/en/projects/lobby-display/' },
  agency: { tr: '/projeler/acenta-takibi/', en: '/en/projects/agency-ledger/' },
  // Konsept proje: gerçek kullanımda değil, sitede ayrı başlık altında durur.
  helpdesk: { tr: '/projeler/destek-talepleri/', en: '/en/projects/helpdesk/' },
  cv: { tr: '/cv/', en: '/en/cv/' },
  // Demoların çerçevesiz, tam ekran sürümleri (QR kodla ya da "Tam ekran aç" bağlantısıyla açılır).
  'demo-qr-menu': { tr: '/demo/qr-menu/', en: '/en/demo/qr-menu/' },
  'demo-lobby': { tr: '/demo/lobi-ekrani/', en: '/en/demo/lobby-display/' },
  'demo-agency': { tr: '/demo/acenta-takibi/', en: '/en/demo/agency-ledger/' },
  'demo-helpdesk': { tr: '/demo/destek-talepleri/', en: '/en/demo/helpdesk/' },
};

const OTHER_LOCALE: Record<Locale, Locale> = { tr: 'en', en: 'tr' };

export function pathFor(page: PageId, locale: Locale): string {
  return PATHS[page][locale];
}

export function demoPageFor(project: ProjectPageId): DemoPageId {
  return `demo-${project}`;
}

// Aynı sayfanın diğer dildeki karşılığı (dil değiştirici ve hreflang için).
export function alternateFor(page: PageId, locale: Locale): { locale: Locale; path: string } {
  const other = OTHER_LOCALE[locale];
  return { locale: other, path: pathFor(page, other) };
}
