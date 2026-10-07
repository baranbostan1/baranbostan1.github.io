// Demo defterinin tarayıcıda saklanması. Depodan gelen veri güvenilmezdir: her kayıt doğrulanır,
// tek bir geçersiz kayıt bile varsa tümü reddedilir ve başlangıç verisine dönülür.
import { MAX_AMOUNT_KURUS } from './amount';
import { AGENCY_NAME_MAX_LENGTH, isValidDate, type Invoice, type Ledger, type Payment } from './ledger';
import { SEED } from './seed';

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const STORAGE_KEY = 'portfolio.agency-demo.v1';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const isText = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';
const isAmount = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value > 0 && value <= MAX_AMOUNT_KURUS;
const isAgency = (value: unknown): value is string => isText(value) && value.length <= AGENCY_NAME_MAX_LENGTH;
const isDate = (value: unknown): value is string => typeof value === 'string' && isValidDate(value);

// Yalnızca bilinen alanlar alınır; fazladan alanlar atılır.
function toPayment(value: unknown): Payment | null {
  if (!isRecord(value)) return null;
  const { id, agency, date, amountKurus } = value;
  if (!isText(id) || !isAgency(agency) || !isDate(date) || !isAmount(amountKurus)) return null;
  return { id, agency, date, amountKurus };
}

function toInvoice(value: unknown): Invoice | null {
  const payment = toPayment(value);
  if (payment === null || !isRecord(value) || !isText(value.invoiceNo)) return null;
  return { ...payment, invoiceNo: value.invoiceNo };
}

function parseList<T>(value: unknown, convert: (item: unknown) => T | null): T[] | null {
  if (!Array.isArray(value)) return null;
  const items = value.map(convert);
  return items.every((item): item is T => item !== null) ? items : null;
}

function parseLedger(raw: string): Ledger | null {
  const data: unknown = JSON.parse(raw);
  if (!isRecord(data)) return null;
  const invoices = parseList(data.invoices, toInvoice);
  const payments = parseList(data.payments, toPayment);
  return invoices && payments ? { invoices, payments } : null;
}

/** Kaydedilmiş defteri yükler; kayıt yoksa, okunamıyorsa ya da geçersizse başlangıç verisini döndürür. */
export function loadLedger(store: KeyValueStore | null): Ledger {
  if (store === null) return SEED;
  try {
    const raw = store.getItem(STORAGE_KEY);
    return raw === null ? SEED : (parseLedger(raw) ?? SEED);
  } catch {
    // Bozuk JSON ya da erişilemeyen depolama: demo çökmez, baştan başlar.
    return SEED;
  }
}

/** Defteri kaydeder. Depolama yoksa ya da yazılamıyorsa (kota, gizli sekme) false döner. */
export function saveLedger(store: KeyValueStore | null, ledger: Ledger): boolean {
  if (store === null) return false;
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(ledger));
    return true;
  } catch {
    return false;
  }
}

export function clearLedger(store: KeyValueStore | null): void {
  try {
    store?.removeItem(STORAGE_KEY);
  } catch {
    // Silinemiyorsa yapılacak bir şey yok; bellekteki defter zaten sıfırlandı.
  }
}

/** Tarayıcının localStorage'ı; erişilemiyorsa (kapalı, gizli sekme, kısıtlı çerçeve) null. */
export function getStore(): KeyValueStore | null {
  try {
    const probe = `${STORAGE_KEY}.probe`;
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}
