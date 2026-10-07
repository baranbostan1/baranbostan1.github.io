import { describe, expect, it } from 'vitest';
import { agencyBalances, type Ledger } from '../src/demos/agency/ledger';
import { SEED } from '../src/demos/agency/seed';
import { loadLedger, saveLedger, STORAGE_KEY, type KeyValueStore } from '../src/demos/agency/storage';

function fakeStore(initial: Record<string, string>): KeyValueStore {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  };
}

function throwingStore(): KeyValueStore {
  const fail = (): never => {
    throw new Error('depolama kullanılamıyor');
  };
  return { getItem: fail, setItem: fail, removeItem: fail };
}

const custom: Ledger = {
  invoices: [{ id: 'a', agency: 'Pusula Tur', date: '2026-07-01', invoiceNo: 'F-9', amountKurus: 125050 }],
  payments: [{ id: 'b', agency: 'Pusula Tur', date: '2026-07-02', amountKurus: 5000 }],
};

const stored = (value: unknown) => fakeStore({ [STORAGE_KEY]: typeof value === 'string' ? value : JSON.stringify(value) });

describe('SEED', () => {
  it('beş acenta içerir; birinin bakiyesi sıfır, birininki eksi', () => {
    const balances = agencyBalances(SEED);
    expect(balances).toHaveLength(5);
    expect(balances.some((row) => row.balanceKurus === 0)).toBe(true);
    expect(balances.some((row) => row.balanceKurus < 0)).toBe(true);
    expect(SEED.invoices).toHaveLength(14);
    expect(SEED.payments).toHaveLength(8);
  });
});

describe('loadLedger', () => {
  it('depolama yoksa başlangıç verisini verir', () => {
    expect(loadLedger(null)).toEqual(SEED);
  });

  it('kayıt yoksa başlangıç verisini verir', () => {
    expect(loadLedger(fakeStore({}))).toEqual(SEED);
  });

  it('kaydedilen defteri geri yükler', () => {
    const store = fakeStore({});
    expect(saveLedger(store, custom)).toBe(true);
    expect(loadLedger(store)).toEqual(custom);
  });

  it.each([
    ['bozuk JSON', '{bozuk'],
    ['boş metin', ''],
    ['null', 'null'],
    ['dizi', '[]'],
    ['alanlar dizi değil', { invoices: 'x', payments: [] }],
    ['ödemeler eksik', { invoices: [] }],
    ['eksik alanlı fatura', { invoices: [{ id: 1 }], payments: [] }],
    ['metin olarak tutar', { invoices: [{ ...custom.invoices[0], amountKurus: '125050' }], payments: [] }],
    ['ondalıklı kuruş', { invoices: [{ ...custom.invoices[0], amountKurus: 10.5 }], payments: [] }],
    ['eksi tutar', { invoices: [], payments: [{ ...custom.payments[0], amountKurus: -1 }] }],
    ['sıfır tutar', { invoices: [], payments: [{ ...custom.payments[0], amountKurus: 0 }] }],
    ['geçersiz tarih', { invoices: [{ ...custom.invoices[0], date: '2026-02-30' }], payments: [] }],
    ['boş acenta', { invoices: [{ ...custom.invoices[0], agency: '  ' }], payments: [] }],
    ['boş fatura no', { invoices: [{ ...custom.invoices[0], invoiceNo: '' }], payments: [] }],
    ['null kayıt', { invoices: [null], payments: [] }],
  ])('%s → başlangıç verisi', (_label, value) => {
    expect(loadLedger(stored(value))).toEqual(SEED);
  });

  it('tek bir geçersiz kayıt bütün defteri reddettirir', () => {
    const mixed = { invoices: [custom.invoices[0], { id: 'x' }], payments: [] };
    expect(loadLedger(stored(mixed))).toEqual(SEED);
  });

  it('okuma hata fırlatırsa başlangıç verisini verir', () => {
    expect(loadLedger(throwingStore())).toEqual(SEED);
  });

  it('fazladan alanları yok sayar', () => {
    const extra = { invoices: [{ ...custom.invoices[0], hacked: '<script>' }], payments: custom.payments, version: 9 };
    expect(loadLedger(stored(extra))).toEqual(custom);
  });
});

describe('saveLedger', () => {
  it('depolama yoksa false döner', () => {
    expect(saveLedger(null, custom)).toBe(false);
  });

  it('yazma hata fırlatırsa false döner, fırlatmaz', () => {
    expect(saveLedger(throwingStore(), custom)).toBe(false);
  });
});
