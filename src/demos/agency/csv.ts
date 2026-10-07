// Defteri CSV'ye çevirir (Excel ve Sheets'te açılmak üzere).
import type { Locale } from '../../i18n/locales';
import type { Ledger } from './ledger';

const BOM = '﻿';
const LINE_END = '\r\n';
const KURUS_PER_LIRA = 100;
// Bu karakterlerle başlayan hücreler tablo programlarında formül olarak çalışabilir.
const FORMULA_START = /^[=+\-@\t\r]/;

interface CsvDialect {
  separator: string;
  decimal: string;
  header: readonly string[];
  invoice: string;
  payment: string;
}

// Türkçe Excel ayırıcı olarak noktalı virgül, ondalık için virgül bekler.
const DIALECTS: Record<Locale, CsvDialect> = {
  tr: { separator: ';', decimal: ',', header: ['Tür', 'Acenta', 'Tarih', 'Fatura No', 'Tutar'], invoice: 'Fatura', payment: 'Ödeme' },
  en: { separator: ',', decimal: '.', header: ['Type', 'Agency', 'Date', 'Invoice No', 'Amount'], invoice: 'Invoice', payment: 'Payment' },
};

function cell(value: string, separator: string): string {
  const safe = FORMULA_START.test(value) ? `'${value}` : value;
  const needsQuotes = safe.includes(separator) || safe.includes('"') || safe.includes('\n') || safe.includes('\r');
  return needsQuotes ? `"${safe.replace(/"/g, '""')}"` : safe;
}

const amount = (kurus: number, decimal: string): string =>
  `${Math.floor(kurus / KURUS_PER_LIRA)}${decimal}${String(kurus % KURUS_PER_LIRA).padStart(2, '0')}`;

export function toCsv(ledger: Ledger, locale: Locale): string {
  const dialect = DIALECTS[locale];
  const rows = [
    ...ledger.invoices.map((item) => ({ type: dialect.invoice, agency: item.agency, date: item.date, invoiceNo: item.invoiceNo, amountKurus: item.amountKurus })),
    ...ledger.payments.map((item) => ({ type: dialect.payment, agency: item.agency, date: item.date, invoiceNo: '', amountKurus: item.amountKurus })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const lines = [
    dialect.header.join(dialect.separator),
    ...rows.map((row) =>
      [row.type, cell(row.agency, dialect.separator), row.date, cell(row.invoiceNo, dialect.separator), amount(row.amountKurus, dialect.decimal)].join(dialect.separator),
    ),
  ];
  return BOM + lines.join(LINE_END) + LINE_END;
}
