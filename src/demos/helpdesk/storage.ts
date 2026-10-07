// Destek taleplerinin tarayıcıda saklanması. Depodan gelen veri güvenilmezdir: her kayıt doğrulanır,
// tek bir geçersiz kayıt bile varsa tümü reddedilir ve başlangıç verisine dönülür.
import type { Locale } from '../../i18n/locales';
import type { KeyValueStore } from '../agency/storage';
import { materializeSeed } from './seed';
import { ASSIGNEES, CATEGORIES, PRIORITIES, REQUESTER_MAX, REQUESTER_MIN, STATUSES, TITLE_MAX, TITLE_MIN, type Ticket } from './tickets';

export const HELPDESK_STORAGE_KEY = 'portfolio.helpdesk-demo.v1';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const isId = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';
const isTextBetween = (value: unknown, min: number, max: number): value is string =>
  typeof value === 'string' && value.trim().length >= min && value.length <= max;
const isTime = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const isOneOf = <T extends string>(list: readonly T[], value: unknown): value is T => typeof value === 'string' && (list as readonly string[]).includes(value);

// Yalnızca bilinen alanlar alınır; fazladan alanlar atılır.
function toTicket(value: unknown): Ticket | null {
  if (!isRecord(value)) return null;
  const { id, title, category, priority, requester, assignee, status, openedAt, resolvedAt } = value;
  if (!isId(id) || !isTextBetween(title, TITLE_MIN, TITLE_MAX) || !isTextBetween(requester, REQUESTER_MIN, REQUESTER_MAX)) return null;
  if (!isOneOf(CATEGORIES, category) || !isOneOf(PRIORITIES, priority) || !isOneOf(STATUSES, status)) return null;
  if (assignee !== null && !isOneOf(ASSIGNEES, assignee)) return null;
  if (!isTime(openedAt)) return null;
  // Çözüm zamanı yalnızca çözülmüş talepte bulunur; ikisi birbirini tutmuyorsa kayıt geçersizdir.
  const resolved = status === 'resolved' ? (isTime(resolvedAt) ? resolvedAt : undefined) : resolvedAt === null ? null : undefined;
  if (resolved === undefined) return null;
  return { id, title, category, priority, requester, assignee, status, openedAt, resolvedAt: resolved };
}

// Boş liste de geçersizdir: talep silinemediği için boş pano kullanıcı eylemiyle oluşamaz.
function parseTickets(raw: string): Ticket[] | null {
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data) || data.length === 0) return null;
  const tickets = data.map(toTicket);
  if (!tickets.every((ticket): ticket is Ticket => ticket !== null)) return null;
  const hasUniqueIds = new Set(tickets.map((ticket) => ticket.id)).size === tickets.length;
  return hasUniqueIds ? tickets : null;
}

/** Kaydedilmiş talepleri yükler; kayıt yoksa, okunamıyorsa ya da geçersizse başlangıç verisini döndürür. */
export function loadTickets(store: KeyValueStore | null, now: number, locale: Locale = 'tr'): Ticket[] {
  if (store === null) return materializeSeed(now, locale);
  try {
    const raw = store.getItem(HELPDESK_STORAGE_KEY);
    return (raw === null ? null : parseTickets(raw)) ?? materializeSeed(now, locale);
  } catch {
    // Bozuk JSON ya da erişilemeyen depolama: demo çökmez, baştan başlar.
    return materializeSeed(now, locale);
  }
}

/** Talepleri kaydeder. Depolama yoksa ya da yazılamıyorsa (kota, gizli sekme) false döner. */
export function saveTickets(store: KeyValueStore | null, tickets: readonly Ticket[]): boolean {
  if (store === null) return false;
  try {
    store.setItem(HELPDESK_STORAGE_KEY, JSON.stringify(tickets));
    return true;
  } catch {
    return false;
  }
}

export function clearTickets(store: KeyValueStore | null): void {
  try {
    store?.removeItem(HELPDESK_STORAGE_KEY);
  } catch {
    // Silinemiyorsa yapılacak bir şey yok; bellekteki liste zaten sıfırlandı.
  }
}
