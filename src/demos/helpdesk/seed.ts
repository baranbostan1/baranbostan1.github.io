// Demonun başlangıç verisi: dokuz uydurma talep. Zamanlar sabit tarih değil, "şu andan X dakika önce"
// olarak tanımlıdır; demo hangi gün açılırsa açılsın güncel görünür. Kişi adları ve talepler kurgusaldır.
import type { Locale } from '../../i18n/locales';
import type { Ticket, TicketCategory, TicketPriority, TicketStatus } from './tickets';

const MS_PER_MINUTE = 60_000;

interface SeedTicket {
  title: Record<Locale, string>;
  category: TicketCategory;
  priority: TicketPriority;
  requester: string;
  assignee: string | null;
  status: TicketStatus;
  /** Açılış: şu andan kaç dakika önce */
  openedMinutesAgo: number;
  /** Çözüm: şu andan kaç dakika önce; yalnızca çözülmüş talepte */
  resolvedMinutesAgo?: number;
}

const SEED: readonly SeedTicket[] = [
  { title: { tr: 'Toplantı odasında Wi-Fi bağlanmıyor', en: 'Meeting room Wi-Fi will not connect' }, category: 'network', priority: 'urgent', requester: 'Selin', assignee: null, status: 'new', openedMinutesAgo: 25 },
  { title: { tr: 'Excel dosyası açılırken kapanıyor', en: 'Excel closes while opening a file' }, category: 'software', priority: 'normal', requester: 'Burak', assignee: null, status: 'new', openedMinutesAgo: 140 },
  { title: { tr: 'İkinci monitör için kablo isteği', en: 'Cable request for a second monitor' }, category: 'hardware', priority: 'low', requester: 'Zeynep', assignee: 'Emre', status: 'new', openedMinutesAgo: 610 },
  { title: { tr: 'E-posta şifresi kilitlendi', en: 'Email password is locked' }, category: 'account', priority: 'urgent', requester: 'Mert', assignee: 'Deniz', status: 'inProgress', openedMinutesAgo: 95 },
  // Normal öncelikte hedef 24 saat: bu talep hedefi aşmış görünür.
  { title: { tr: 'Kat yazıcısı kâğıt sıkıştırıyor', en: 'Floor printer keeps jamming' }, category: 'hardware', priority: 'normal', requester: 'Elif', assignee: 'Emre', status: 'inProgress', openedMinutesAgo: 1720 },
  { title: { tr: 'PDF okuyucu güncellemesi', en: 'PDF reader update' }, category: 'software', priority: 'low', requester: 'Kerem', assignee: 'Deniz', status: 'inProgress', openedMinutesAgo: 2900 },
  { title: { tr: 'Yeni çalışan için hesap açılması', en: 'Account setup for a new employee' }, category: 'account', priority: 'normal', requester: 'Derya', assignee: 'Emre', status: 'waiting', openedMinutesAgo: 400 },
  // Acil öncelikte hedef 4 saat: bu talep de hedefi aşmış görünür.
  { title: { tr: 'Dizüstü bilgisayar şarj olmuyor', en: 'Laptop is not charging' }, category: 'hardware', priority: 'urgent', requester: 'Can', assignee: 'Deniz', status: 'waiting', openedMinutesAgo: 330 },
  { title: { tr: 'VPN bağlantısı kopuyor', en: 'VPN connection keeps dropping' }, category: 'network', priority: 'normal', requester: 'Ayşe', assignee: 'Deniz', status: 'resolved', openedMinutesAgo: 1500, resolvedMinutesAgo: 1200 },
];

/** Başlangıç taleplerini verilen ana göre gerçek zamana çevirir. Her çağrı yeni bir liste döndürür. */
export function materializeSeed(now: number, locale: Locale = 'tr'): Ticket[] {
  return SEED.map((item, index) => ({
    id: `seed-${index + 1}`,
    title: item.title[locale],
    category: item.category,
    priority: item.priority,
    requester: item.requester,
    assignee: item.assignee,
    status: item.status,
    openedAt: now - item.openedMinutesAgo * MS_PER_MINUTE,
    resolvedAt: item.resolvedMinutesAgo === undefined ? null : now - item.resolvedMinutesAgo * MS_PER_MINUTE,
  }));
}
