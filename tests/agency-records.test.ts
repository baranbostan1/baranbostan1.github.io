import { describe, expect, it } from 'vitest';
import type { Ledger } from '../src/demos/agency/ledger';
import { listRecords } from '../src/demos/agency/records';

const ledger: Ledger = {
  invoices: [
    { id: 'f1', agency: 'Pusula Tur', date: '2026-07-10', invoiceNo: 'F-1', amountKurus: 300 },
    { id: 'f2', agency: 'Yelken Seyahat', date: '2026-07-01', invoiceNo: 'F-2', amountKurus: 900 },
  ],
  payments: [{ id: 'o1', agency: 'pusula  tur', date: '2026-07-05', amountKurus: 500 }],
};

const ids = (records: { id: string }[]) => records.map((record) => record.id);

describe('listRecords', () => {
  it('fatura ve ödemeleri birleştirir, yeniden eskiye sıralar', () => {
    expect(ids(listRecords(ledger, null, 'newest'))).toEqual(['f1', 'o1', 'f2']);
  });

  it('eskiden yeniye sıralar', () => {
    expect(ids(listRecords(ledger, null, 'oldest'))).toEqual(['f2', 'o1', 'f1']);
  });

  it('tutara göre büyükten küçüğe sıralar', () => {
    expect(ids(listRecords(ledger, null, 'largest'))).toEqual(['f2', 'o1', 'f1']);
  });

  it('acentaya göre, yazım farkı gözetmeden filtreler', () => {
    expect(ids(listRecords(ledger, 'PUSULA TUR', 'oldest'))).toEqual(['o1', 'f1']);
  });

  it('ödemede fatura numarası boştur, tür doğru işaretlenir', () => {
    expect(listRecords(ledger, null, 'oldest')[1]).toMatchObject({ kind: 'payment', invoiceNo: '' });
  });

  it('kaydı olmayan acentada boş liste döner', () => {
    expect(listRecords(ledger, 'Olmayan Tur', 'newest')).toEqual([]);
  });

  it('defteri değiştirmez', () => {
    const before = JSON.stringify(ledger);
    listRecords(ledger, null, 'largest');
    expect(JSON.stringify(ledger)).toBe(before);
  });
});
