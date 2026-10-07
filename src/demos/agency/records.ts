// Kayıt listesinin saf mantığı: fatura ve ödemeleri tek listede birleştirme, filtreleme, sıralama.
import { agencyKey, type Ledger } from './ledger';

export type RecordKind = 'invoice' | 'payment';
export type SortOrder = 'newest' | 'oldest' | 'largest';

export interface LedgerRecord {
  id: string;
  kind: RecordKind;
  agency: string;
  date: string;
  invoiceNo: string;
  amountKurus: number;
}

const COMPARATORS: Record<SortOrder, (a: LedgerRecord, b: LedgerRecord) => number> = {
  newest: (a, b) => b.date.localeCompare(a.date),
  oldest: (a, b) => a.date.localeCompare(b.date),
  largest: (a, b) => b.amountKurus - a.amountKurus,
};

/** `agency` null ise tüm acentalar; aksi halde yazım farkı gözetmeden yalnızca o acenta. */
export function listRecords(ledger: Ledger, agency: string | null, order: SortOrder): LedgerRecord[] {
  const all: LedgerRecord[] = [
    ...ledger.invoices.map((item) => ({ ...item, kind: 'invoice' as const })),
    ...ledger.payments.map((item) => ({ ...item, kind: 'payment' as const, invoiceNo: '' })),
  ];
  const wanted = agency === null ? null : agencyKey(agency);
  return all.filter((record) => wanted === null || agencyKey(record.agency) === wanted).sort(COMPARATORS[order]);
}
