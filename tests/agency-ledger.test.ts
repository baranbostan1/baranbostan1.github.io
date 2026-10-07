import { describe, expect, it } from 'vitest';
import {
  addInvoice,
  addPayment,
  agencyBalances,
  agencyKey,
  summarize,
  validateInvoice,
  validatePayment,
  type Invoice,
  type Ledger,
  type Payment,
} from '../src/demos/agency/ledger';

let counter = 0;
const nextId = () => `t${++counter}`;
const inv = (agency: string, amountKurus: number): Invoice => ({ id: nextId(), agency, date: '2026-07-01', invoiceNo: 'F-1', amountKurus });
const pay = (agency: string, amountKurus: number): Payment => ({ id: nextId(), agency, date: '2026-07-02', amountKurus });
const EMPTY: Ledger = { invoices: [], payments: [] };

describe('agencyBalances', () => {
  it('bakiye = fatura toplamı − ödeme toplamı; acenta adına göre sıralı', () => {
    const ledger: Ledger = {
      invoices: [inv('Yelken Seyahat', 20000), inv('Pusula Tur', 100000), inv('Pusula Tur', 50000)],
      payments: [pay('Pusula Tur', 60000)],
    };
    expect(agencyBalances(ledger)).toEqual([
      { agency: 'Pusula Tur', invoicedKurus: 150000, paidKurus: 60000, balanceKurus: 90000 },
      { agency: 'Yelken Seyahat', invoicedKurus: 20000, paidKurus: 0, balanceKurus: 20000 },
    ]);
  });

  it('fazla ödemede bakiye eksiye düşer', () => {
    expect(agencyBalances({ invoices: [inv('A', 100)], payments: [pay('A', 250)] })[0]?.balanceKurus).toBe(-150);
  });

  it('yalnızca ödemesi olan acenta da listelenir', () => {
    expect(agencyBalances({ invoices: [], payments: [pay('B', 100)] })).toEqual([{ agency: 'B', invoicedKurus: 0, paidKurus: 100, balanceKurus: -100 }]);
  });

  it('boş defterde boş liste döner', () => {
    expect(agencyBalances(EMPTY)).toEqual([]);
  });

  it('yazım farkları tek acenta sayılır; görünen ad ilk kaydın adıdır', () => {
    const ledger: Ledger = { invoices: [inv('Pusula Tur', 100), inv(' pusula  tur ', 100), inv('PUSULA TUR', 100)], payments: [pay('pusula tur', 50)] };
    expect(agencyBalances(ledger)).toEqual([{ agency: 'Pusula Tur', invoicedKurus: 300, paidKurus: 50, balanceKurus: 250 }]);
  });

  it('ASCII büyük harfle girilen ad yeni acenta açmaz', () => {
    const ledger: Ledger = { invoices: [inv('Mavi Rota Turizm', 100), inv('MAVI ROTA TURIZM', 100)], payments: [pay('Zeytin Dalı Travel', 10), pay('ZEYTIN DALI TRAVEL', 10)] };
    expect(agencyBalances(ledger).map((row) => row.agency)).toEqual(['Mavi Rota Turizm', 'Zeytin Dalı Travel']);
  });

  it('Türkçe harf sırasına göre sıralar', () => {
    const ledger: Ledger = { invoices: [inv('Zeytin Dalı Travel', 1), inv('Çınar Tur', 1), inv('Ihlamur Tur', 1), inv('İskele Tur', 1), inv('Cam Tur', 1)], payments: [] };
    expect(agencyBalances(ledger).map((row) => row.agency)).toEqual(['Cam Tur', 'Çınar Tur', 'Ihlamur Tur', 'İskele Tur', 'Zeytin Dalı Travel']);
  });
});

describe('agencyKey', () => {
  it('noktasız I ve ı aynı anahtarı verir', () => {
    expect(agencyKey('IŞIK Tur')).toBe(agencyKey('ışık tur'));
  });

  it('noktalı İ ve i aynı anahtarı verir', () => {
    expect(agencyKey('İZ Tur')).toBe(agencyKey('iz tur'));
  });

  it('Türkçe klavyesi olmayan biri büyük harfle yazınca da aynı acentadır', () => {
    expect(agencyKey('MAVI ROTA TURIZM')).toBe(agencyKey('Mavi Rota Turizm'));
    expect(agencyKey('ZEYTIN DALI TRAVEL')).toBe(agencyKey('Zeytin Dalı Travel'));
    expect(agencyKey('zeytin dali travel')).toBe(agencyKey('Zeytin Dalı Travel'));
  });

  it('i harfinin dört yazımı (I, İ, ı, i) tek anahtara iner', () => {
    expect(new Set(['IZ Tur', 'İZ Tur', 'ız tur', 'iz tur'].map(agencyKey)).size).toBe(1);
  });

  it('birleşik ve ayrık yazılmış aksanlı harfler aynı anahtarı verir', () => {
    expect(agencyKey('İskele Tur')).toBe(agencyKey('İskele Tur'));
    expect(agencyKey('Çınar Tur')).toBe(agencyKey('Çınar Tur'));
  });

  it('baştaki, sondaki ve yinelenen boşlukları yok sayar', () => {
    expect(agencyKey('  Mavi   Rota  Turizm ')).toBe(agencyKey('Mavi Rota Turizm'));
  });
});

describe('summarize', () => {
  it('tüm acentaların toplamını verir', () => {
    const ledger: Ledger = { invoices: [inv('A', 150000), inv('B', 20000)], payments: [pay('A', 60000)] };
    expect(summarize(ledger)).toEqual({ invoicedKurus: 170000, paidKurus: 60000, balanceKurus: 110000 });
  });

  it('boş defterde sıfırdır', () => {
    expect(summarize(EMPTY)).toEqual({ invoicedKurus: 0, paidKurus: 0, balanceKurus: 0 });
  });
});

describe('addInvoice / addPayment', () => {
  it('yeni defter döndürür, eskisini değiştirmez', () => {
    const before: Ledger = { invoices: [], payments: [] };
    const after = addInvoice(before, inv('A', 1));
    expect(before.invoices).toHaveLength(0);
    expect(after).not.toBe(before);
    expect(after.invoices).toHaveLength(1);
    expect(after.payments).toBe(before.payments);
  });

  it('ödeme eklemek faturalara dokunmaz', () => {
    const before = addInvoice(EMPTY, inv('A', 100));
    const after = addPayment(before, pay('A', 40));
    expect(before.payments).toHaveLength(0);
    expect(after.payments).toHaveLength(1);
    expect(summarize(after).balanceKurus).toBe(60);
  });
});

describe('validateInvoice', () => {
  const valid = { agency: 'Pusula Tur', date: '2026-07-01', invoiceNo: 'F-1', amount: '100' };

  it('geçerli taslağı temizleyip faturaya çevirir', () => {
    expect(validateInvoice({ agency: '  Pusula   Tur ', date: '2026-07-01', invoiceNo: ' F-1 ', amount: '1.250,50' }, 'id1')).toEqual({
      ok: true,
      value: { id: 'id1', agency: 'Pusula Tur', date: '2026-07-01', invoiceNo: 'F-1', amountKurus: 125050 },
    });
  });

  it('boş acentayı reddeder', () => {
    expect(validateInvoice({ ...valid, agency: '  ' }, 'x')).toEqual({ ok: false, errors: { agency: 'agencyRequired' } });
  });

  it('bütün hataları birlikte bildirir', () => {
    expect(validateInvoice({ agency: 'A', date: '2026-02-30', invoiceNo: '', amount: '0' }, 'x')).toEqual({
      ok: false,
      errors: { date: 'dateInvalid', invoiceNo: 'invoiceNoRequired', amount: 'amountInvalid' },
    });
  });

  it.each(['', '01.07.2026', '2026-13-01', '2026-7-1', '2026-00-10', '2026-06-31', '2025-02-29', 'bugün'])('%j tarihini reddeder', (date) => {
    expect(validateInvoice({ ...valid, date }, 'x')).toEqual({ ok: false, errors: { date: 'dateInvalid' } });
  });

  it('artık yıl 29 Şubat geçerlidir', () => {
    expect(validateInvoice({ ...valid, date: '2028-02-29' }, 'x').ok).toBe(true);
  });

  it.each(['abc', '-5', '0', '1.2.3', '1.000.000.000'])('%j tutarını reddeder', (amount) => {
    expect(validateInvoice({ ...valid, amount }, 'x')).toEqual({ ok: false, errors: { amount: 'amountInvalid' } });
  });

  it('çok uzun acenta adını reddeder', () => {
    expect(validateInvoice({ ...valid, agency: 'A'.repeat(61) }, 'x')).toEqual({ ok: false, errors: { agency: 'agencyTooLong' } });
  });
});

describe('validatePayment', () => {
  it('geçerli taslağı ödemeye çevirir', () => {
    expect(validatePayment({ agency: ' Yelken Seyahat ', date: '2026-07-05', amount: '500' }, 'p1')).toEqual({
      ok: true,
      value: { id: 'p1', agency: 'Yelken Seyahat', date: '2026-07-05', amountKurus: 50000 },
    });
  });

  it('eksi tutarı reddeder', () => {
    expect(validatePayment({ agency: 'A', date: '2026-07-01', amount: '-5' }, 'x')).toEqual({ ok: false, errors: { amount: 'amountInvalid' } });
  });

  it('fatura numarası istemez', () => {
    expect(validatePayment({ agency: 'A', date: '2026-07-01', amount: '5' }, 'x').ok).toBe(true);
  });
});
