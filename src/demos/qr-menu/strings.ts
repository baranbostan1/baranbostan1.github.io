import type { Locale } from '../../i18n/locales';

export interface QrMenuStrings {
  fictionalNote: string;
  periodLabel: string;
  day: string;
  evening: string;
  searchLabel: string;
  searchPlaceholder: string;
  categoriesLabel: string;
  allCategories: string;
  emptyTitle: string;
  emptyHint: string;
  clearSearch: string;
  /** Sonuç sayısı duyurusu; {count} yer tutucusu sayıyla değişir */
  resultCount: string;
  tryHeading: string;
  tryItems: readonly string[];
  adminNote: string;
}

export const QR_MENU_STRINGS: Record<Locale, QrMenuStrings> = {
  tr: {
    fictionalNote: 'Kurgusal restoran · ürün ve fiyatlar uydurmadır',
    periodLabel: 'Menü dönemi',
    day: 'Gündüz',
    evening: 'Akşam',
    searchLabel: 'Menüde ara',
    searchPlaceholder: 'Ürün ya da içerik ara',
    categoriesLabel: 'Kategoriler',
    allCategories: 'Tümü',
    emptyTitle: 'Aramanızla eşleşen ürün yok',
    emptyHint: 'Başka bir kelime deneyin ya da aramayı temizleyin.',
    clearSearch: 'Aramayı temizle',
    resultCount: '{count} ürün gösteriliyor',
    tryHeading: 'Deneyin',
    tryItems: [
      'Gündüz ve Akşam arasında geçin: kahvaltı kaybolur, akşam sofrası gelir. Gerçek menüde bu geçiş Türkiye saatine göre kendiliğinden olur.',
      '“ızgara” yazın: arama hem ürün adına hem açıklamaya bakar.',
      'Bir kategori seçin: liste yalnızca o bölümü gösterir.',
    ],
    adminNote:
      'Gerçek araçta ürünler, fiyatlar, kategori sırası ve dönem kısıtları bir admin panelinden yönetilir. Panel bu demoda yer almaz.',
  },
  en: {
    fictionalNote: 'Fictional restaurant · items and prices are made up',
    periodLabel: 'Menu period',
    day: 'Day',
    evening: 'Evening',
    searchLabel: 'Search the menu',
    searchPlaceholder: 'Search items or ingredients',
    categoriesLabel: 'Categories',
    allCategories: 'All',
    emptyTitle: 'No items match your search',
    emptyHint: 'Try another word or clear the search.',
    clearSearch: 'Clear search',
    resultCount: '{count} items shown',
    tryHeading: 'Try it',
    tryItems: [
      'Switch between Day and Evening: breakfast disappears and the evening table appears. On the real menu this happens on its own, based on Türkiye time.',
      'Type “grilled”: search looks at both item names and descriptions.',
      'Pick a category: the list shows only that section.',
    ],
    adminNote:
      'In the real tool, items, prices, category order and period restrictions are managed from an admin panel. The panel is not part of this demo.',
  },
};
