// QR menü demosunun saf mantığı: saate göre menü dönemi ve ürün filtreleme. Arayüze dokunmaz.
import type { Locale } from '../../i18n/locales';

export type Period = 'day' | 'evening';

export interface MenuCategory {
  id: string;
  name: Record<Locale, string>;
  order: number;
  /** Tanımlıysa kategori yalnızca bu dönemde görünür */
  period?: Period;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  priceKurus: number;
  /** Tanımlıysa ürün yalnızca bu dönemde görünür */
  period?: Period;
}

export interface MenuFilter {
  categoryId: string | null;
  query: string;
  period: Period;
  locale: Locale;
}

const MENU_TIME_ZONE = 'Europe/Istanbul';
const DAY_START_HOUR = 8;
const DAY_END_HOUR = 19;

const istanbulHour = new Intl.DateTimeFormat('en-GB', { timeZone: MENU_TIME_ZONE, hour: '2-digit', hourCycle: 'h23' });

/** Türkiye saatine göre menü dönemi: 08:00–18:59 gündüz, diğer saatler akşam. */
export function periodAt(date: Date): Period {
  const hour = Number(istanbulHour.format(date));
  return hour >= DAY_START_HOUR && hour < DAY_END_HOUR ? 'day' : 'evening';
}

// Arama karşılaştırması: seçilen dilin kurallarıyla küçük harf (Türkçede I→ı, İ→i).
const normalize = (text: string, locale: Locale): string => text.toLocaleLowerCase(locale).trim();

const inPeriod = (restriction: Period | undefined, period: Period): boolean => restriction === undefined || restriction === period;

/** Döneme, kategoriye ve aramaya uyan ürünleri kategori sırasıyla, kategori içinde veri sırasıyla döndürür. */
export function filterMenu(items: readonly MenuItem[], categories: readonly MenuCategory[], filter: MenuFilter): MenuItem[] {
  const { categoryId, period, locale } = filter;
  const query = normalize(filter.query, locale);
  const visibleCategories = new Map(categories.filter((category) => inPeriod(category.period, period)).map((category) => [category.id, category]));

  const matches = (item: MenuItem): boolean => {
    if (!visibleCategories.has(item.categoryId)) return false;
    if (categoryId !== null && item.categoryId !== categoryId) return false;
    if (!inPeriod(item.period, period)) return false;
    if (query === '') return true;
    return normalize(item.name[locale], locale).includes(query) || normalize(item.description[locale], locale).includes(query);
  };

  const orderOf = (item: MenuItem): number => visibleCategories.get(item.categoryId)?.order ?? 0;
  // Array.prototype.sort kararlıdır: aynı kategorideki ürünler veri sırasını korur.
  return items.filter(matches).sort((a, b) => orderOf(a) - orderOf(b));
}

/** Verilen dönemde görünen kategoriler, sırasıyla. */
export function categoriesFor(categories: readonly MenuCategory[], period: Period): MenuCategory[] {
  return categories.filter((category) => inPeriod(category.period, period)).sort((a, b) => a.order - b.order);
}
