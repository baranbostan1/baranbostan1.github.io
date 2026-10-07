// Demo verisi. Restoran kurgusaldır; ürünler, açıklamalar ve fiyatlar uydurmadır.
// Gerçek menüden hiçbir ürün ya da fiyat alınmamıştır.
import type { MenuCategory, MenuItem } from './filter';

export const RESTAURANT_NAME = 'Zeytin Gölgesi';

export const CATEGORIES: readonly MenuCategory[] = [
  { id: 'kahvalti', name: { tr: 'Kahvaltı', en: 'Breakfast' }, order: 1, period: 'day' },
  { id: 'baslangic', name: { tr: 'Başlangıçlar', en: 'Starters' }, order: 2 },
  { id: 'ana', name: { tr: 'Ana Yemekler', en: 'Mains' }, order: 3 },
  { id: 'aksam', name: { tr: 'Akşam Sofrası', en: 'Evening Table' }, order: 4, period: 'evening' },
  { id: 'tatli', name: { tr: 'Tatlılar', en: 'Desserts' }, order: 5 },
  { id: 'icecek', name: { tr: 'İçecekler', en: 'Drinks' }, order: 6 },
];

const lira = (amount: number): number => amount * 100;

export const ITEMS: readonly MenuItem[] = [
  {
    id: 'serpme',
    categoryId: 'kahvalti',
    name: { tr: 'Serpme Kahvaltı', en: 'Breakfast Spread' },
    description: { tr: 'İki kişilik; peynirler, zeytin, reçel, yumurta ve sıcak ekmek.', en: 'For two; cheeses, olives, jam, eggs and warm bread.' },
    priceKurus: lira(780),
  },
  {
    id: 'menemen',
    categoryId: 'kahvalti',
    name: { tr: 'Menemen', en: 'Menemen' },
    description: { tr: 'Domates, biber ve yumurta; bakır sahanda.', en: 'Tomato, pepper and egg, served in a copper pan.' },
    priceKurus: lira(210),
  },
  {
    id: 'gozleme',
    categoryId: 'kahvalti',
    name: { tr: 'Otlu Gözleme', en: 'Herb Flatbread' },
    description: { tr: 'Mevsim otları ve lor peyniriyle.', en: 'With seasonal greens and curd cheese.' },
    priceKurus: lira(190),
  },
  {
    id: 'corba',
    categoryId: 'baslangic',
    name: { tr: 'Günün Çorbası', en: 'Soup of the Day' },
    description: { tr: 'Her gün değişir; kızarmış ekmekle.', en: 'Changes daily; served with toasted bread.' },
    priceKurus: lira(140),
  },
  {
    id: 'zeytinyagli',
    categoryId: 'baslangic',
    name: { tr: 'Zeytinyağlı Tabağı', en: 'Olive Oil Plate' },
    description: { tr: 'Üç çeşit zeytinyağlı; enginar, taze fasulye, barbunya.', en: 'Three cold dishes in olive oil: artichoke, green beans, borlotti beans.' },
    priceKurus: lira(260),
  },
  {
    id: 'salata',
    categoryId: 'baslangic',
    name: { tr: 'Mevsim Salatası', en: 'Seasonal Salad' },
    description: { tr: 'Roka, domates, salatalık; nar ekşili sos.', en: 'Rocket, tomato, cucumber; pomegranate dressing.' },
    priceKurus: lira(180),
  },
  {
    id: 'kalamar',
    categoryId: 'baslangic',
    name: { tr: 'Kalamar Tava', en: 'Fried Calamari' },
    description: { tr: 'Tarator sosla.', en: 'With tarator sauce.' },
    priceKurus: lira(390),
    period: 'evening',
  },
  {
    id: 'kofte',
    categoryId: 'ana',
    name: { tr: 'Izgara Köfte', en: 'Grilled Meatballs' },
    description: { tr: 'Pilav ve közlenmiş biberle.', en: 'With rice and roasted peppers.' },
    priceKurus: lira(420),
  },
  {
    id: 'tavuk',
    categoryId: 'ana',
    name: { tr: 'Tavuk Şiş', en: 'Chicken Skewers' },
    description: { tr: 'Bulgur pilavı ve mevsim yeşillikleriyle.', en: 'With bulgur pilaf and seasonal greens.' },
    priceKurus: lira(380),
  },
  {
    id: 'manti',
    categoryId: 'ana',
    name: { tr: 'Ev Mantısı', en: 'Homemade Mantı' },
    description: { tr: 'Sarımsaklı yoğurt ve tereyağlı sosla.', en: 'With garlic yoghurt and butter sauce.' },
    priceKurus: lira(340),
    period: 'day',
  },
  {
    id: 'makarna',
    categoryId: 'ana',
    name: { tr: 'Sebzeli Makarna', en: 'Vegetable Pasta' },
    description: { tr: 'Kabak, patlıcan ve domates sosuyla.', en: 'With courgette, aubergine and tomato sauce.' },
    priceKurus: lira(290),
  },
  {
    id: 'levrek',
    categoryId: 'aksam',
    name: { tr: 'Izgara Levrek', en: 'Grilled Sea Bass' },
    description: { tr: 'Roka, limon ve haşlanmış patatesle.', en: 'With rocket, lemon and boiled potatoes.' },
    priceKurus: lira(620),
  },
  {
    id: 'guvec',
    categoryId: 'aksam',
    name: { tr: 'Karides Güveç', en: 'Shrimp Casserole' },
    description: { tr: 'Tereyağı, sarımsak ve kaşar peyniriyle fırında.', en: 'Baked with butter, garlic and kashar cheese.' },
    priceKurus: lira(540),
  },
  {
    id: 'meze',
    categoryId: 'aksam',
    name: { tr: 'Meze Tabağı', en: 'Meze Platter' },
    description: { tr: 'Günün beş mezesi.', en: 'Five mezes of the day.' },
    priceKurus: lira(360),
  },
  {
    id: 'sutlac',
    categoryId: 'tatli',
    name: { tr: 'Fırın Sütlaç', en: 'Baked Rice Pudding' },
    description: { tr: 'Tarçınla.', en: 'With cinnamon.' },
    priceKurus: lira(150),
  },
  {
    id: 'irmik',
    categoryId: 'tatli',
    name: { tr: 'Dondurmalı İrmik Helvası', en: 'Semolina Halva with Ice Cream' },
    description: { tr: 'Sıcak servis edilir.', en: 'Served warm.' },
    priceKurus: lira(190),
  },
  {
    id: 'meyve',
    categoryId: 'tatli',
    name: { tr: 'Mevsim Meyveleri', en: 'Seasonal Fruit' },
    description: { tr: 'Dilimlenmiş, buzlu.', en: 'Sliced, on ice.' },
    priceKurus: lira(170),
  },
  {
    id: 'cay',
    categoryId: 'icecek',
    name: { tr: 'Çay', en: 'Tea' },
    description: { tr: 'İnce belli bardakta.', en: 'In a tulip glass.' },
    priceKurus: lira(30),
  },
  {
    id: 'kahve',
    categoryId: 'icecek',
    name: { tr: 'Türk Kahvesi', en: 'Turkish Coffee' },
    description: { tr: 'Sade, orta ya da şekerli.', en: 'Plain, medium or sweet.' },
    priceKurus: lira(90),
  },
  {
    id: 'limonata',
    categoryId: 'icecek',
    name: { tr: 'Ev Limonatası', en: 'Homemade Lemonade' },
    description: { tr: 'Taze nane ile.', en: 'With fresh mint.' },
    priceKurus: lira(110),
  },
  {
    id: 'ayran',
    categoryId: 'icecek',
    name: { tr: 'Ayran', en: 'Ayran' },
    description: { tr: 'Köpüklü.', en: 'Frothy.' },
    priceKurus: lira(60),
  },
];
