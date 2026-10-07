import { describe, expect, it } from 'vitest';
import type { Ticket, TicketPriority, TicketStatus } from '../src/demos/helpdesk/tickets';
import { ageMinutes, formatDuration, isOverdue, summarize, TARGET_MINUTES } from '../src/demos/helpdesk/timing';

const NOW = Date.UTC(2026, 9, 8, 9, 0, 0);
const MIN = 60_000;

let counter = 0;
const open = (openedAt: number, priority: TicketPriority = 'normal', status: TicketStatus = 'inProgress'): Ticket => ({
  id: `t${++counter}`,
  title: 'Talep',
  category: 'software',
  priority,
  requester: 'Ayşe',
  assignee: 'Deniz',
  status,
  openedAt,
  resolvedAt: null,
});
const resolved = (openedAt: number, resolvedAt: number, priority: TicketPriority = 'normal'): Ticket => ({ ...open(openedAt, priority, 'resolved'), resolvedAt });

describe('TARGET_MINUTES', () => {
  it('acil 4 saat, normal 24 saat, düşük 72 saat', () => {
    expect(TARGET_MINUTES).toEqual({ urgent: 240, normal: 1440, low: 4320 });
  });
});

describe('ageMinutes', () => {
  it('açık talepte açılıştan şimdiye geçen tam dakikadır', () => {
    expect(ageMinutes(open(NOW - 45 * MIN), NOW)).toBe(45);
  });

  it('aşağı yuvarlar', () => {
    expect(ageMinutes(open(NOW - 59_999), NOW)).toBe(0);
    expect(ageMinutes(open(NOW - (2 * MIN + 59_000)), NOW)).toBe(2);
  });

  it('çözülmüş talepte açılıştan çözüme kadar sayar', () => {
    expect(ageMinutes(resolved(NOW - 300 * MIN, NOW - 100 * MIN), NOW)).toBe(200);
  });

  it('saat geri alınmışsa eksiye düşmez', () => {
    expect(ageMinutes(open(NOW + 10 * MIN), NOW)).toBe(0);
    expect(ageMinutes(resolved(NOW, NOW - 5 * MIN), NOW)).toBe(0);
  });

  it('bozuk zaman değeri NaN üretmez', () => {
    expect(ageMinutes({ ...open(NOW), openedAt: Number.NaN }, NOW)).toBe(0);
    expect(ageMinutes(open(NOW - 5 * MIN), Number.NaN)).toBe(0);
  });
});

describe('isOverdue', () => {
  it('süre hedefe tam eşitken aşmış sayılmaz', () => {
    expect(isOverdue(open(NOW - 240 * MIN, 'urgent'), NOW)).toBe(false);
    expect(isOverdue(open(NOW - 1440 * MIN, 'normal'), NOW)).toBe(false);
    expect(isOverdue(open(NOW - 4320 * MIN, 'low'), NOW)).toBe(false);
  });

  it('hedefi bir dakika geçince aşmış sayılır', () => {
    expect(isOverdue(open(NOW - 241 * MIN, 'urgent'), NOW)).toBe(true);
    expect(isOverdue(open(NOW - 1441 * MIN, 'normal'), NOW)).toBe(true);
    expect(isOverdue(open(NOW - 4321 * MIN, 'low'), NOW)).toBe(true);
  });

  it('çözülmüş talep hiçbir zaman aşmış sayılmaz', () => {
    expect(isOverdue(resolved(NOW - 9999 * MIN, NOW - MIN, 'urgent'), NOW)).toBe(false);
  });

  it('kullanıcı beklenen ve yeni talepler de aşabilir', () => {
    expect(isOverdue(open(NOW - 300 * MIN, 'urgent', 'waiting'), NOW)).toBe(true);
    expect(isOverdue(open(NOW - 300 * MIN, 'urgent', 'new'), NOW)).toBe(true);
  });
});

describe('formatDuration', () => {
  it.each([
    [0, '0 dk'],
    [45, '45 dk'],
    [59, '59 dk'],
    [60, '1 sa'],
    [200, '3 sa 20 dk'],
    [1439, '23 sa 59 dk'],
    [1440, '1 gün'],
    [1501, '1 gün 1 sa'],
    [3120, '2 gün 4 sa'],
  ])('%i dakika → %s', (minutes, expected) => {
    expect(formatDuration(minutes, 'tr')).toBe(expected);
  });

  it.each([
    [45, '45 min'],
    [60, '1 h'],
    [200, '3 h 20 min'],
    [1440, '1 d'],
    [3120, '2 d 4 h'],
  ])('İngilizce: %i dakika → %s', (minutes, expected) => {
    expect(formatDuration(minutes, 'en')).toBe(expected);
  });

  it('eksi ya da bozuk değerde 0 yazar', () => {
    expect(formatDuration(-5, 'tr')).toBe('0 dk');
    expect(formatDuration(Number.NaN, 'en')).toBe('0 min');
  });

  it('kesirli dakikayı aşağı yuvarlar', () => {
    expect(formatDuration(45.9, 'tr')).toBe('45 dk');
  });
});

describe('summarize', () => {
  it('boş panoda sıfırdır ve en uzun bekleyen yoktur', () => {
    expect(summarize([], NOW)).toEqual({ open: 0, urgentOpen: 0, overdue: 0, longestOpenMinutes: null });
  });

  it('yalnızca çözülmemiş talepleri sayar', () => {
    const tickets = [
      resolved(NOW - 9000 * MIN, NOW - 10 * MIN, 'urgent'),
      open(NOW - 300 * MIN, 'urgent'),
      open(NOW - 20 * MIN, 'urgent', 'new'),
      open(NOW - 3000 * MIN, 'normal', 'waiting'),
      open(NOW - 10 * MIN, 'low'),
    ];
    expect(summarize(tickets, NOW)).toEqual({ open: 4, urgentOpen: 2, overdue: 2, longestOpenMinutes: 3000 });
  });

  it('hepsi çözülmüşse açık talep ve en uzun bekleyen yoktur', () => {
    expect(summarize([resolved(NOW - 100 * MIN, NOW - 50 * MIN)], NOW)).toEqual({ open: 0, urgentOpen: 0, overdue: 0, longestOpenMinutes: null });
  });
});
