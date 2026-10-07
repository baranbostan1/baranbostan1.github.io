import { describe, expect, it } from 'vitest';
import { toCsv } from '../src/demos/agency/csv';
import type { Ledger } from '../src/demos/agency/ledger';

const BOM = '﻿';
const ledger: Ledger = {
  invoices: [
    { id: 'a', agency: 'Pusula Tur', date: '2026-07-10', invoiceNo: 'F-1', amountKurus: 125050 },
    { id: 'b', agency: 'Yelken Seyahat', date: '2026-07-01', invoiceNo: 'F-2', amountKurus: 200000 },
  ],
  payments: [{ id: 'c', agency: 'Pusula Tur', date: '2026-07-05', amountKurus: 5000 }],
};

const lines = (csv: string) => csv.slice(BOM.length).trimEnd().split('\r\n');

describe('toCsv', () => {
  it('Excel Türkçe karakterleri tanısın diye BOM ile başlar', () => {
    expect(toCsv(ledger, 'tr').startsWith(BOM)).toBe(true);
  });

  it('Türkçe başlık, noktalı virgül ayırıcı, virgüllü tutar; tarihe göre sıralı', () => {
    expect(lines(toCsv(ledger, 'tr'))).toEqual([
      'Tür;Acenta;Tarih;Fatura No;Tutar',
      'Fatura;Yelken Seyahat;2026-07-01;F-2;2000,00',
      'Ödeme;Pusula Tur;2026-07-05;;50,00',
      'Fatura;Pusula Tur;2026-07-10;F-1;1250,50',
    ]);
  });

  it('İngilizce başlık, virgül ayırıcı, noktalı tutar', () => {
    expect(lines(toCsv(ledger, 'en'))).toEqual([
      'Type,Agency,Date,Invoice No,Amount',
      'Invoice,Yelken Seyahat,2026-07-01,F-2,2000.00',
      'Payment,Pusula Tur,2026-07-05,,50.00',
      'Invoice,Pusula Tur,2026-07-10,F-1,1250.50',
    ]);
  });

  it('ayırıcı ya da tırnak içeren hücreyi tırnaklar', () => {
    const tricky: Ledger = { invoices: [{ id: 'a', agency: 'Ada; "Tur"', date: '2026-07-01', invoiceNo: 'F,1', amountKurus: 100 }], payments: [] };
    expect(lines(toCsv(tricky, 'tr'))[1]).toBe('Fatura;"Ada; ""Tur""";2026-07-01;F,1;1,00');
    expect(lines(toCsv(tricky, 'en'))[1]).toBe('Invoice,"Ada; ""Tur""",2026-07-01,"F,1",1.00');
  });

  it.each(['=1+1', '+90', '-5', '@komut', '\tsekme'])('formül gibi başlayan hücreyi (%j) etkisizleştirir', (agency) => {
    const risky: Ledger = { invoices: [{ id: 'a', agency, date: '2026-07-01', invoiceNo: 'F-1', amountKurus: 100 }], payments: [] };
    expect(lines(toCsv(risky, 'tr'))[1]?.split(';')[1]).toBe(`'${agency}`);
  });

  it('boş defterde yalnızca başlık vardır', () => {
    expect(lines(toCsv({ invoices: [], payments: [] }, 'tr'))).toEqual(['Tür;Acenta;Tarih;Fatura No;Tutar']);
  });
});
