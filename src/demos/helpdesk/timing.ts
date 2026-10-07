// Destek taleplerinde süre hesabı: ne kadardır açık, hedefi aştı mı, pano özeti.
// Saf fonksiyonlar; şimdiki zaman her zaman parametre olarak verilir.
import type { Locale } from '../../i18n/locales';
import type { Ticket, TicketPriority } from './tickets';

const MS_PER_MINUTE = 60_000;
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 1440;

/** Önceliğe göre hedef çözüm süresi (dakika). Takvim süresidir; mesai saati hesabı yapılmaz. */
export const TARGET_MINUTES: Record<TicketPriority, number> = { urgent: 240, normal: 1440, low: 4320 };

export interface BoardSummary {
  open: number;
  urgentOpen: number;
  overdue: number;
  /** En uzun süredir açık olan talebin süresi; açık talep yoksa null */
  longestOpenMinutes: number | null;
}

const isOpen = (ticket: Ticket): boolean => ticket.status !== 'resolved';

/**
 * Talebin açık kaldığı süre, tam dakika. Çözülmüş talepte açılıştan çözüme kadar sayılır.
 * Saat geri alınmışsa ya da zaman değeri bozuksa 0 döner; eksi ya da NaN üretmez.
 */
export function ageMinutes(ticket: Ticket, now: number): number {
  const end = ticket.resolvedAt ?? now;
  const minutes = Math.floor((end - ticket.openedAt) / MS_PER_MINUTE);
  return Number.isFinite(minutes) && minutes > 0 ? minutes : 0;
}

/** Çözülmemiş bir talep hedef süresini geçtiyse true. Süre hedefe tam eşitken henüz aşmış sayılmaz. */
export function isOverdue(ticket: Ticket, now: number): boolean {
  return isOpen(ticket) && ageMinutes(ticket, now) > TARGET_MINUTES[ticket.priority];
}

const UNITS: Record<Locale, { day: string; hour: string; minute: string }> = {
  tr: { day: 'gün', hour: 'sa', minute: 'dk' },
  en: { day: 'd', hour: 'h', minute: 'min' },
};

/** Süreyi en büyük iki birimle yazar: "45 dk", "3 sa 20 dk", "2 gün 4 sa". Gün varken dakika yazılmaz. */
export function formatDuration(minutes: number, locale: Locale): string {
  const unit = UNITS[locale];
  const total = Number.isFinite(minutes) && minutes > 0 ? Math.floor(minutes) : 0;
  const days = Math.floor(total / MINUTES_PER_DAY);
  const hours = Math.floor((total % MINUTES_PER_DAY) / MINUTES_PER_HOUR);
  const rest = total % MINUTES_PER_HOUR;
  const part = (value: number, label: string): string[] => (value > 0 ? [`${value} ${label}`] : []);
  if (days > 0) return [`${days} ${unit.day}`, ...part(hours, unit.hour)].join(' ');
  if (hours > 0) return [`${hours} ${unit.hour}`, ...part(rest, unit.minute)].join(' ');
  return `${rest} ${unit.minute}`;
}

export function summarize(tickets: readonly Ticket[], now: number): BoardSummary {
  const open = tickets.filter(isOpen);
  const ages = open.map((ticket) => ageMinutes(ticket, now));
  return {
    open: open.length,
    urgentOpen: open.filter((ticket) => ticket.priority === 'urgent').length,
    overdue: open.filter((ticket) => isOverdue(ticket, now)).length,
    longestOpenMinutes: ages.length > 0 ? Math.max(...ages) : null,
  };
}
