// Acenta defteri: fatura ve ödeme kayıtları, doğrulama ve bakiye hesabı.
// Saf fonksiyonlar; arayüze ve depolamaya dokunmaz. Hiçbir fonksiyon girdisini değiştirmez.
// Bakiye = acentanın fatura toplamı − ödeme toplamı. Tüm tutarlar kuruş cinsinden tam sayıdır.
import { parseAmountToKurus } from './amount';

export interface Invoice {
  id: string;
  agency: string;
  /** YYYY-MM-DD */
  date: string;
  invoiceNo: string;
  amountKurus: number;
}

export interface Payment {
  id: string;
  agency: string;
  /** YYYY-MM-DD */
  date: string;
  amountKurus: number;
}

export interface Ledger {
  invoices: readonly Invoice[];
  payments: readonly Payment[];
}

export interface AgencyBalance {
  agency: string;
  invoicedKurus: number;
  paidKurus: number;
  balanceKurus: number;
}

export interface Totals {
  invoicedKurus: number;
  paidKurus: number;
  balanceKurus: number;
}

export type FieldError = 'agencyRequired' | 'agencyTooLong' | 'dateInvalid' | 'amountInvalid' | 'invoiceNoRequired';
export type FieldName = 'agency' | 'date' | 'amount' | 'invoiceNo';
export type FieldErrors = Partial<Record<FieldName, FieldError>>;
export type Validation<T> = { ok: true; value: T } | { ok: false; errors: FieldErrors };

export interface InvoiceDraft {
  agency: string;
  date: string;
  invoiceNo: string;
  amount: string;
}

export interface PaymentDraft {
  agency: string;
  date: string;
  amount: string;
}

export const AGENCY_NAME_MAX_LENGTH = 60;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const collapseSpaces = (text: string): string => text.trim().replace(/\s+/g, ' ');

/**
 * Acenta adının karşılaştırma anahtarı: boşluklar sadeleşir, harfler küçülür ve i harfinin dört yazımı
 * (I, İ, ı, i) tek harfe iner. Böylece Türkçe klavyesi olmayan biri "MAVI ROTA TURIZM" yazdığında
 * "Mavi Rota Turizm" ile aynı acenta sayılır. Anahtar yalnızca eşleştirme içindir, ekranda gösterilmez.
 */
export function agencyKey(name: string): string {
  return collapseSpaces(name).normalize('NFC').toLocaleLowerCase('tr').replace(/ı/g, 'i');
}

// Takvimde gerçekten var olan bir gün mü? (2026-02-30 gibi tarihler reddedilir.)
export function isValidDate(text: string): boolean {
  const match = ISO_DATE.exec(text);
  if (!match) return false;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function agencyError(agency: string): FieldError | undefined {
  if (agency === '') return 'agencyRequired';
  if (agency.length > AGENCY_NAME_MAX_LENGTH) return 'agencyTooLong';
  return undefined;
}

// Tanımsız alanları atar; böylece hata nesnesi yalnızca gerçekten hatalı alanları taşır.
function compact(errors: Record<string, FieldError | undefined>): FieldErrors {
  return Object.fromEntries(Object.entries(errors).filter(([, value]) => value !== undefined)) as FieldErrors;
}

export function validateInvoice(draft: InvoiceDraft, id: string): Validation<Invoice> {
  const agency = collapseSpaces(draft.agency);
  const invoiceNo = draft.invoiceNo.trim();
  const amountKurus = parseAmountToKurus(draft.amount);
  const errors = compact({
    agency: agencyError(agency),
    date: isValidDate(draft.date) ? undefined : 'dateInvalid',
    invoiceNo: invoiceNo === '' ? 'invoiceNoRequired' : undefined,
    amount: amountKurus === null ? 'amountInvalid' : undefined,
  });
  if (amountKurus === null || Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { id, agency, date: draft.date, invoiceNo, amountKurus } };
}

export function validatePayment(draft: PaymentDraft, id: string): Validation<Payment> {
  const agency = collapseSpaces(draft.agency);
  const amountKurus = parseAmountToKurus(draft.amount);
  const errors = compact({
    agency: agencyError(agency),
    date: isValidDate(draft.date) ? undefined : 'dateInvalid',
    amount: amountKurus === null ? 'amountInvalid' : undefined,
  });
  if (amountKurus === null || Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { id, agency, date: draft.date, amountKurus } };
}

export function addInvoice(ledger: Ledger, invoice: Invoice): Ledger {
  return { ...ledger, invoices: [...ledger.invoices, invoice] };
}

export function addPayment(ledger: Ledger, payment: Payment): Ledger {
  return { ...ledger, payments: [...ledger.payments, payment] };
}

/** Acenta bazında fatura, ödeme ve bakiye; acenta adına göre Türkçe sıralı. */
export function agencyBalances(ledger: Ledger): AgencyBalance[] {
  const rows = new Map<string, AgencyBalance>();
  const rowFor = (agency: string): AgencyBalance => {
    const key = agencyKey(agency);
    // Görünen ad, acentanın ilk kaydındaki yazımdır.
    return rows.get(key) ?? { agency: collapseSpaces(agency), invoicedKurus: 0, paidKurus: 0, balanceKurus: 0 };
  };
  const apply = (agency: string, invoiced: number, paid: number): void => {
    const row = rowFor(agency);
    const invoicedKurus = row.invoicedKurus + invoiced;
    const paidKurus = row.paidKurus + paid;
    rows.set(agencyKey(agency), { agency: row.agency, invoicedKurus, paidKurus, balanceKurus: invoicedKurus - paidKurus });
  };
  ledger.invoices.forEach((invoice) => apply(invoice.agency, invoice.amountKurus, 0));
  ledger.payments.forEach((payment) => apply(payment.agency, 0, payment.amountKurus));
  return [...rows.values()].sort((a, b) => a.agency.localeCompare(b.agency, 'tr'));
}

export function summarize(ledger: Ledger): Totals {
  const invoicedKurus = ledger.invoices.reduce((sum, invoice) => sum + invoice.amountKurus, 0);
  const paidKurus = ledger.payments.reduce((sum, payment) => sum + payment.amountKurus, 0);
  return { invoicedKurus, paidKurus, balanceKurus: invoicedKurus - paidKurus };
}
