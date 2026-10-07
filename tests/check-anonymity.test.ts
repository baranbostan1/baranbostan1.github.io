import { describe, expect, it } from 'vitest';
// @ts-expect-error — düz .mjs betiği, tip bildirimi yok
import { findBannedWords } from '../scripts/check-anonymity.mjs';

const words = ['ornekmarka', '555 11 11'];

describe('findBannedWords', () => {
  it('büyük/küçük harf ayırmadan bulur', () => {
    expect(findBannedWords('Merhaba OrnekMarka', words)).toEqual(['ornekmarka']);
  });

  it('boşluk içeren ifadeyi bulur', () => {
    expect(findBannedWords('tel: 555 11 11', words)).toEqual(['555 11 11']);
  });

  it('temiz metinde boş liste döner', () => {
    expect(findBannedWords("Erdek'te bir otel", words)).toEqual([]);
  });

  it('liste boşsa hiçbir şey bulmaz', () => {
    expect(findBannedWords('x', [])).toEqual([]);
  });

  it('Türkçe büyük İ ile yazılmış kelimeyi bulur', () => {
    expect(findBannedWords('KİRAZ', ['kiraz'])).toEqual(['kiraz']);
  });

  it('Türkçe noktasız I ile yazılmış kelimeyi bulur', () => {
    expect(findBannedWords('ILIK', ['ılık'])).toEqual(['ılık']);
  });

  it('İngilizce büyük harfle yazılmış kelimeyi bulur', () => {
    expect(findBannedWords('ORNEKMARKA INC', words)).toEqual(['ornekmarka']);
  });

  it('kısa kelimeyi başka bir kelimenin içinde saymaz', () => {
    expect(findBannedWords('kabcd klasörü, kumrular()', ['abc', 'kumru'])).toEqual([]);
  });

  it('kısa kelimeyi tek başına geçtiğinde bulur', () => {
    expect(findBannedWords('ABC ile anlaşma; Kumru, vb.', ['abc', 'kumru'])).toEqual(['abc', 'kumru']);
  });

  it('uzun kelimeyi başka bir kelimenin içinde de bulur', () => {
    expect(findBannedWords('www.ornekmarkaotel.example', words)).toEqual(['ornekmarka']);
  });

  it('aksanları atılmış (ASCII) yazımı da bulur', () => {
    expect(findBannedWords('www.ornek-sehir-oteli.example', ['örnek şehir'])).toEqual([]);
    expect(findBannedWords('Ornek Sehir Oteli', ['örnek şehir'])).toEqual(['örnek şehir']);
    expect(findBannedWords('ORNEK SEHIR', ['örnek şehir'])).toEqual(['örnek şehir']);
  });

  it('satıra bölünmüş ya da fazla boşluklu çok kelimeli ifadeyi bulur', () => {
    expect(findBannedWords(['Ahmet', '    Örnek'].join('\n'), ['ahmet örnek'])).toEqual(['ahmet örnek']);
    expect(findBannedWords('Ahmet   Örnek', ['ahmet örnek'])).toEqual(['ahmet örnek']);
  });

  it('rakamlardan oluşan ifadeyi farklı ayırıcılarla yazıldığında da bulur', () => {
    const phone = ['555 11 11'];
    expect(findBannedWords('tel: 5551111', phone)).toEqual(phone);
    expect(findBannedWords('tel: 555-11-11', phone)).toEqual(phone);
    expect(findBannedWords('tel: (555) 11.11', phone)).toEqual(phone);
    expect(findBannedWords('sipariş no 15551111', phone)).toEqual(phone);
    expect(findBannedWords('tel: 555 12 11', phone)).toEqual([]);
  });
});
