import { describe, expect, it } from 'vitest';
import { filterMenu, periodAt, type MenuCategory, type MenuItem } from '../src/demos/qr-menu/filter';

const categories: MenuCategory[] = [
  { id: 'aksam', name: { tr: 'Akşam Yemekleri', en: 'Dinner' }, order: 2, period: 'evening' },
  { id: 'kahvalti', name: { tr: 'Kahvaltı', en: 'Breakfast' }, order: 1, period: 'day' },
  { id: 'icecek', name: { tr: 'İçecekler', en: 'Drinks' }, order: 3 },
];

const item = (id: string, categoryId: string, tr: string, extra: Partial<MenuItem> = {}): MenuItem => ({
  id,
  categoryId,
  name: { tr, en: `${tr} (en)` },
  description: { tr: '', en: '' },
  priceKurus: 10000,
  ...extra,
});

const items: MenuItem[] = [
  item('levrek', 'aksam', 'Izgara Levrek', { description: { tr: 'Roka ve limonla', en: 'With rocket and lemon' } }),
  item('cay', 'icecek', 'Çay'),
  item('serpme', 'kahvalti', 'Serpme Kahvaltı'),
  item('salep', 'icecek', 'Salep', { period: 'evening' }),
  item('ayran', 'icecek', 'Ayran', { period: 'day' }),
  item('corba', 'aksam', 'Günün Çorbası', { description: { tr: 'Izgara ekmekle', en: 'With grilled bread' } }),
];

const ids = (list: readonly MenuItem[]) => list.map((entry) => entry.id);
const base = { categoryId: null, query: '', locale: 'tr' as const };

describe('periodAt', () => {
  it('İstanbul saatiyle 08:00 gündüzdür', () => {
    expect(periodAt(new Date('2026-07-01T05:00:00Z'))).toBe('day');
  });

  it('18:59 hâlâ gündüzdür', () => {
    expect(periodAt(new Date('2026-07-01T15:59:00Z'))).toBe('day');
  });

  it('19:00 akşamdır', () => {
    expect(periodAt(new Date('2026-07-01T16:00:00Z'))).toBe('evening');
  });

  it('07:59 akşam menüsündedir', () => {
    expect(periodAt(new Date('2026-07-01T04:59:00Z'))).toBe('evening');
  });

  it('gece yarısından sonra akşam menüsündedir', () => {
    expect(periodAt(new Date('2026-07-01T22:30:00Z'))).toBe('evening');
  });
});

describe('filterMenu', () => {
  it('gündüz: akşam kategorisini ve akşam ürünlerini göstermez, kategori sırasıyla döner', () => {
    expect(ids(filterMenu(items, categories, { ...base, period: 'day' }))).toEqual(['serpme', 'cay', 'ayran']);
  });

  it('akşam: gündüz kategorisini ve gündüz ürünlerini göstermez', () => {
    expect(ids(filterMenu(items, categories, { ...base, period: 'evening' }))).toEqual(['levrek', 'corba', 'cay', 'salep']);
  });

  it('kategori kısıtı dönemsiz ürüne de geçer', () => {
    expect(ids(filterMenu(items, categories, { ...base, period: 'day' }))).not.toContain('levrek');
  });

  it('seçilen kategoriyle sınırlar', () => {
    expect(ids(filterMenu(items, categories, { ...base, period: 'evening', categoryId: 'icecek' }))).toEqual(['cay', 'salep']);
  });

  it('aramayı ürün adında, Türkçe büyük/küçük harf ayırmadan yapar', () => {
    expect(ids(filterMenu(items, categories, { ...base, period: 'evening', query: 'IZGARA LEV' }))).toEqual(['levrek']);
  });

  it('aramayı açıklamada da yapar', () => {
    expect(ids(filterMenu(items, categories, { ...base, period: 'evening', query: 'ızgara' }))).toEqual(['levrek', 'corba']);
  });

  it('noktalı İ ile yazılan aramayı bulur', () => {
    expect(ids(filterMenu(items, categories, { ...base, period: 'evening', query: 'LİMON' }))).toEqual(['levrek']);
  });

  it('yalnızca boşluktan oluşan sorguyu boş sayar', () => {
    expect(ids(filterMenu(items, categories, { ...base, period: 'day', query: '   ' }))).toEqual(['serpme', 'cay', 'ayran']);
  });

  it('eşleşme yoksa boş liste döner', () => {
    expect(filterMenu(items, categories, { ...base, period: 'day', query: 'pizza' })).toEqual([]);
  });

  it('seçilen dilde arar', () => {
    expect(ids(filterMenu(items, categories, { ...base, period: 'evening', query: 'rocket', locale: 'en' }))).toEqual(['levrek']);
  });

  it('kategorisi tanımlı olmayan ürünü göstermez', () => {
    const orphan = [...items, item('kayip', 'yok', 'Kayıp Ürün')];
    expect(ids(filterMenu(orphan, categories, { ...base, period: 'day' }))).not.toContain('kayip');
  });

  it('girdi dizilerini değiştirmez', () => {
    const before = JSON.stringify([items, categories]);
    filterMenu(items, categories, { ...base, period: 'evening', query: 'çay' });
    expect(JSON.stringify([items, categories])).toBe(before);
  });
});
