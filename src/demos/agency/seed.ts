// Demonun başlangıç verisi. Acenta adları, fatura numaraları, tarihler ve tutarlar tamamen uydurmadır.
import type { Invoice, Ledger, Payment } from './ledger';

const invoice = (n: number, agency: string, date: string, amountKurus: number): Invoice => ({
  id: `seed-f${n}`,
  agency,
  date,
  invoiceNo: `F-2026-${String(n).padStart(3, '0')}`,
  amountKurus,
});

const payment = (n: number, agency: string, date: string, amountKurus: number): Payment => ({
  id: `seed-o${n}`,
  agency,
  date,
  amountKurus,
});

const PUSULA = 'Pusula Tur';
const YELKEN = 'Yelken Seyahat';
const MAVI = 'Mavi Rota Turizm';
const KUZEY = 'Kuzey Yıldızı Tur';
const ZEYTIN = 'Zeytin Dalı Travel';

export const SEED: Ledger = {
  invoices: [
    invoice(1, PUSULA, '2026-07-04', 4_850_000),
    invoice(2, YELKEN, '2026-07-09', 2_640_000),
    invoice(3, MAVI, '2026-07-15', 7_120_050),
    invoice(4, PUSULA, '2026-07-22', 3_375_000),
    invoice(5, KUZEY, '2026-07-28', 1_980_000),
    invoice(6, ZEYTIN, '2026-08-03', 5_460_000),
    invoice(7, YELKEN, '2026-08-11', 3_210_000),
    invoice(8, MAVI, '2026-08-17', 4_895_000),
    invoice(9, PUSULA, '2026-08-24', 6_150_000),
    invoice(10, KUZEY, '2026-08-30', 2_240_000),
    invoice(11, ZEYTIN, '2026-09-06', 3_780_000),
    invoice(12, MAVI, '2026-09-13', 5_335_000),
    invoice(13, YELKEN, '2026-09-19', 1_725_000),
    invoice(14, PUSULA, '2026-09-27', 2_960_000),
  ],
  payments: [
    payment(1, PUSULA, '2026-07-20', 4_850_000),
    payment(2, YELKEN, '2026-07-30', 2_640_000),
    payment(3, MAVI, '2026-08-05', 7_120_050),
    // Kuzey Yıldızı iki faturasını tek ödemede kapattı: bakiye sıfır.
    payment(4, KUZEY, '2026-09-08', 4_220_000),
    payment(5, PUSULA, '2026-09-02', 6_000_000),
    // Zeytin Dalı fazla ödeme yaptı: bakiye eksi (alacaklı).
    payment(6, ZEYTIN, '2026-09-15', 9_500_000),
    payment(7, YELKEN, '2026-09-22', 3_210_000),
    payment(8, MAVI, '2026-09-25', 4_000_000),
  ],
};
