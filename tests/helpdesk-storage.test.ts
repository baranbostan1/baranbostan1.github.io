import { describe, expect, it } from 'vitest';
import type { KeyValueStore } from '../src/demos/agency/storage';
import { materializeSeed } from '../src/demos/helpdesk/seed';
import { HELPDESK_STORAGE_KEY, loadTickets, saveTickets } from '../src/demos/helpdesk/storage';
import { ASSIGNEES, STATUSES, type Ticket } from '../src/demos/helpdesk/tickets';
import { isOverdue } from '../src/demos/helpdesk/timing';

const NOW = Date.UTC(2026, 9, 8, 9, 0, 0);
const DAY_MS = 86_400_000;

function fakeStore(initial: Record<string, string>): KeyValueStore {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  };
}

function throwingStore(): KeyValueStore {
  const fail = (): never => {
    throw new Error('depolama kullanılamıyor');
  };
  return { getItem: fail, setItem: fail, removeItem: fail };
}

const valid: Ticket = {
  id: 'a',
  title: 'Yazıcı çalışmıyor',
  category: 'hardware',
  priority: 'urgent',
  requester: 'Ayşe',
  assignee: 'Deniz',
  status: 'inProgress',
  openedAt: NOW - 3_600_000,
  resolvedAt: null,
};
const stored = (value: unknown) => fakeStore({ [HELPDESK_STORAGE_KEY]: typeof value === 'string' ? value : JSON.stringify(value) });

describe('materializeSeed', () => {
  const seed = materializeSeed(NOW);

  it('dokuz talep üretir, kimlikleri benzersizdir', () => {
    expect(seed).toHaveLength(9);
    expect(new Set(seed.map((ticket) => ticket.id)).size).toBe(9);
  });

  it('dört durumun her birinde en az bir talep vardır', () => {
    for (const status of STATUSES) expect(seed.some((ticket) => ticket.status === status)).toBe(true);
  });

  it('en az bir talep hedefi aşmıştır, en az bir yeni talep atanmamıştır', () => {
    expect(seed.some((ticket) => isOverdue(ticket, NOW))).toBe(true);
    expect(seed.some((ticket) => ticket.assignee === null && ticket.status === 'new')).toBe(true);
  });

  it('zamanlar tutarlıdır', () => {
    expect(seed.every((ticket) => ticket.openedAt <= NOW)).toBe(true);
    expect(seed.filter((ticket) => ticket.status === 'resolved').every((ticket) => ticket.resolvedAt !== null && ticket.resolvedAt >= ticket.openedAt && ticket.resolvedAt <= NOW)).toBe(true);
    expect(seed.filter((ticket) => ticket.status !== 'resolved').every((ticket) => ticket.resolvedAt === null)).toBe(true);
  });

  it('yeni olmayan her talep birine atanmıştır ve atananlar listedendir', () => {
    expect(seed.filter((ticket) => ticket.status !== 'new').every((ticket) => ticket.assignee !== null)).toBe(true);
    expect(seed.every((ticket) => ticket.assignee === null || ASSIGNEES.includes(ticket.assignee))).toBe(true);
  });

  it('zaman kaydırılınca veri de aynı kadar kayar', () => {
    const later = materializeSeed(NOW + DAY_MS);
    expect(later.map((ticket) => ticket.openedAt - DAY_MS)).toEqual(seed.map((ticket) => ticket.openedAt));
    expect(later.map((ticket) => ticket.title)).toEqual(seed.map((ticket) => ticket.title));
  });
});

describe('loadTickets', () => {
  const seed = materializeSeed(NOW);

  it('depolama ya da kayıt yoksa başlangıç verisini verir', () => {
    expect(loadTickets(null, NOW)).toEqual(seed);
    expect(loadTickets(fakeStore({}), NOW)).toEqual(seed);
  });

  it('kaydedilen listeyi geri yükler', () => {
    const store = fakeStore({});
    const custom = [valid, { ...valid, id: 'b', status: 'resolved' as const, resolvedAt: NOW - 60_000 }];
    expect(saveTickets(store, custom)).toBe(true);
    expect(loadTickets(store, NOW)).toEqual(custom);
  });

  it.each([
    ['bozuk JSON', '{bozuk'],
    ['boş metin', ''],
    ['null', 'null'],
    ['nesne', '{}'],
    ['boş liste', '[]'],
    ['null kayıt', [null]],
    ['eksik alanlı kayıt', [{ id: 1 }]],
    ['tanınmayan durum', [{ ...valid, status: 'kapalı' }]],
    ['tanınmayan kategori', [{ ...valid, category: 'x' }]],
    ['tanınmayan öncelik', [{ ...valid, priority: 'x' }]],
    ['listede olmayan atanan', [{ ...valid, assignee: 'Bilinmeyen' }]],
    ['boş başlık', [{ ...valid, title: '' }]],
    ['çok uzun başlık', [{ ...valid, title: 'x'.repeat(81) }]],
    ['boş talep eden', [{ ...valid, requester: ' ' }]],
    ['metin olarak zaman', [{ ...valid, openedAt: 'dün' }]],
    ['çözülmüş ama çözüm zamanı yok', [{ ...valid, status: 'resolved', resolvedAt: null }]],
    ['açık ama çözüm zamanı var', [{ ...valid, status: 'new', resolvedAt: 5 }]],
    ['yinelenen kimlik', [valid, { ...valid }]],
  ])('%s → başlangıç verisi', (_label, value) => {
    expect(loadTickets(stored(value), NOW)).toEqual(seed);
  });

  it('tek bir geçersiz kayıt bütün listeyi reddettirir', () => {
    expect(loadTickets(stored([valid, { ...valid, id: 'b', status: 'yok' }]), NOW)).toEqual(seed);
  });

  it('okuma hata fırlatırsa başlangıç verisini verir', () => {
    expect(loadTickets(throwingStore(), NOW)).toEqual(seed);
  });

  it('ataması kaldırılmış açık talep geçerlidir (kurallar buna izin verir)', () => {
    const unassigned = [{ ...valid, assignee: null }];
    expect(loadTickets(stored(unassigned), NOW)).toEqual(unassigned);
  });

  it('İngilizce sayfada başlangıç verisi İngilizce gelir, zamanlar aynıdır', () => {
    const english = loadTickets(null, NOW, 'en');
    expect(english).toEqual(materializeSeed(NOW, 'en'));
    expect(english.map((ticket) => ticket.openedAt)).toEqual(seed.map((ticket) => ticket.openedAt));
    expect(english.map((ticket) => ticket.title)).not.toEqual(seed.map((ticket) => ticket.title));
  });

  it('fazladan alanları atar', () => {
    expect(loadTickets(stored([{ ...valid, hacked: '<script>' }]), NOW)).toEqual([valid]);
  });
});

describe('saveTickets', () => {
  it('depolama yoksa ya da yazılamıyorsa false döner, fırlatmaz', () => {
    expect(saveTickets(null, [valid])).toBe(false);
    expect(saveTickets(throwingStore(), [valid])).toBe(false);
  });
});
