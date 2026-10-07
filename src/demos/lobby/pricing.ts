// Oda fiyatının hafta içi mi hafta sonu mu olduğuna karar verir.
const HOTEL_TIME_ZONE = 'Europe/Istanbul';
const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const weekdayName = new Intl.DateTimeFormat('en-US', { timeZone: HOTEL_TIME_ZONE, weekday: 'short' });

/**
 * Verilen an, otelin saat diliminde hafta sonu fiyatı uygulanan bir güne denk geliyor mu?
 * `weekendDays` ayardan gelir: 0 = Pazar … 6 = Cumartesi.
 */
export function isWeekendRate(date: Date, weekendDays: readonly number[]): boolean {
  const day = WEEKDAY_INDEX[weekdayName.format(date)];
  return day !== undefined && weekendDays.includes(day);
}
