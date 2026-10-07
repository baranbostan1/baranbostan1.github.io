import { describe, expect, it } from 'vitest';
import { formatKurus, MAX_AMOUNT_KURUS, parseAmountToKurus } from '../src/demos/agency/amount';

describe('parseAmountToKurus', () => {
  it.each([
    ['1.250,50', 125050],
    ['1250.5', 125050],
    ['1250', 125000],
    ['1.250', 125000], // nokta + tam 3 hane = binlik
    ['1,250', 125000],
    ['12,5', 1250],
    ['12.50', 1250],
    [' 0,10 ', 10],
    ['0.01', 1],
    ['1.234.567,89', 123456789],
    ['1,234,567.89', 123456789],
    ['10,999', 1099900], // tek ayırıcı + tam 3 hane her zaman binliktir
    ['007', 700],
  ])('%j → %i kuruş', (input, expected) => {
    expect(parseAmountToKurus(input)).toBe(expected);
  });

  it.each(['', '   ', 'abc', '1.2.3', '12,345,6', '10,9999', '1250.500', '-5', '0', '0,00', '1e3', '₺', '12,', ',5', '1 250', '12.3.4', '1..2', '１２'])(
    '%j geçersizdir',
    (input) => {
      expect(parseAmountToKurus(input)).toBeNull();
    },
  );

  it('kuruşları tam sayı olarak toplar; kayan nokta hatası olmaz', () => {
    expect(parseAmountToKurus('0,1')! + parseAmountToKurus('0,2')!).toBe(30);
  });

  it('üst sınırı kabul eder, üstünü reddeder', () => {
    expect(parseAmountToKurus('999.999.999,99')).toBe(MAX_AMOUNT_KURUS);
    expect(parseAmountToKurus('1.000.000.000')).toBeNull();
  });
});

describe('formatKurus', () => {
  it('Türkçe biçim', () => {
    expect(formatKurus(125050, 'tr')).toBe('1.250,50 ₺');
  });

  it('eksi tutar', () => {
    expect(formatKurus(-125050, 'tr')).toBe('-1.250,50 ₺');
  });

  it('İngilizce biçim', () => {
    expect(formatKurus(125050, 'en')).toBe('₺1,250.50');
  });

  it('eksi tutar, İngilizce', () => {
    expect(formatKurus(-125050, 'en')).toBe('-₺1,250.50');
  });

  it('sıfır ve tek haneli kuruş', () => {
    expect(formatKurus(0, 'tr')).toBe('0,00 ₺');
    expect(formatKurus(5, 'tr')).toBe('0,05 ₺');
  });
});
