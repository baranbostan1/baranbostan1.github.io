import { describe, expect, it } from 'vitest';
import {
  allowedActions,
  applyAction,
  assign,
  ASSIGNEES,
  groupByStatus,
  replaceTicket,
  sortForColumn,
  STATUSES,
  validateDraft,
  type Ticket,
  type TicketAction,
  type TicketStatus,
} from '../src/demos/helpdesk/tickets';

const NOW = Date.UTC(2026, 9, 8, 9, 0, 0);
const MIN = 60_000;

const base: Ticket = {
  id: 't1',
  title: 'Yazıcı çalışmıyor',
  category: 'hardware',
  priority: 'normal',
  requester: 'Ayşe',
  assignee: 'Deniz',
  status: 'new',
  openedAt: NOW - 30 * MIN,
  resolvedAt: null,
};
const at = (status: TicketStatus, extra: Partial<Ticket> = {}): Ticket =>
  Object.freeze({ ...base, status, resolvedAt: status === 'resolved' ? NOW - MIN : null, ...extra });

describe('allowedActions', () => {
  it('her durumda yalnızca tabloda yazan eylemlere izin verir', () => {
    expect(allowedActions('new')).toEqual(['start']);
    expect(allowedActions('inProgress')).toEqual(['wait', 'resolve']);
    expect(allowedActions('waiting')).toEqual(['resume', 'resolve']);
    expect(allowedActions('resolved')).toEqual(['reopen']);
  });
});

describe('applyAction', () => {
  const TARGET: Record<TicketStatus, Partial<Record<TicketAction, TicketStatus>>> = {
    new: { start: 'inProgress' },
    inProgress: { wait: 'waiting', resolve: 'resolved' },
    waiting: { resume: 'inProgress', resolve: 'resolved' },
    resolved: { reopen: 'inProgress' },
  };
  const ACTIONS: TicketAction[] = ['start', 'wait', 'resume', 'resolve', 'reopen'];
  const cases = STATUSES.flatMap((status) => ACTIONS.map((action) => [status, action, TARGET[status][action] ?? null] as const));

  it.each(cases)('%s durumunda %s → %s', (status, action, target) => {
    const ticket = at(status);
    const result = applyAction(ticket, action, NOW);
    if (target === null) {
      expect(result).toEqual({ ok: false, error: 'notAllowed' });
      return;
    }
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.ticket.status).toBe(target);
  });

  it('çözülünce çözüm zamanını yazar', () => {
    const result = applyAction(at('inProgress'), 'resolve', NOW);
    expect(result).toMatchObject({ ok: true, ticket: { status: 'resolved', resolvedAt: NOW } });
  });

  it('yeniden açılınca çözüm zamanını siler', () => {
    const result = applyAction(at('resolved'), 'reopen', NOW);
    expect(result).toMatchObject({ ok: true, ticket: { status: 'inProgress', resolvedAt: null } });
  });

  it('atanmamış talep işleme alınamaz', () => {
    expect(applyAction(at('new', { assignee: null }), 'start', NOW)).toEqual({ ok: false, error: 'unassigned' });
  });

  it('girdiyi değiştirmez; yeni talep döndürür', () => {
    const ticket = at('new');
    const result = applyAction(ticket, 'start', NOW);
    expect(ticket.status).toBe('new');
    expect(result.ok && result.ticket).not.toBe(ticket);
  });

  it('açılış zamanına, başlığa ve talep edene dokunmaz', () => {
    const result = applyAction(at('inProgress'), 'resolve', NOW);
    expect(result).toMatchObject({ ok: true, ticket: { id: 't1', title: base.title, requester: 'Ayşe', openedAt: base.openedAt } });
  });
});

describe('assign', () => {
  it('açık talebi listedeki birine atar', () => {
    expect(assign(at('new', { assignee: null }), 'Deniz')).toMatchObject({ ok: true, ticket: { assignee: 'Deniz' } });
  });

  it('yeni talebin ataması kaldırılabilir', () => {
    expect(assign(at('new'), null)).toMatchObject({ ok: true, ticket: { assignee: null } });
  });

  it.each(['inProgress', 'waiting'] as const)('%s durumundaki talep sahipsiz bırakılamaz', (status) => {
    expect(assign(at(status), null)).toEqual({ ok: false, error: 'ownerRequired' });
  });

  it.each(['inProgress', 'waiting'] as const)('%s durumundaki talep başka birine devredilebilir', (status) => {
    expect(assign(at(status), 'Emre')).toMatchObject({ ok: true, ticket: { assignee: 'Emre' } });
  });

  it('çözülmüş talebin ataması değiştirilemez', () => {
    expect(assign(at('resolved'), 'Emre')).toEqual({ ok: false, error: 'resolved' });
  });

  it('listede olmayan birine atanamaz', () => {
    expect(assign(at('new'), 'Bilinmeyen')).toEqual({ ok: false, error: 'unknownAssignee' });
  });

  it('iki kurgusal destek görevlisi vardır', () => {
    expect(ASSIGNEES).toEqual(['Deniz', 'Emre']);
  });

  it('girdiyi değiştirmez', () => {
    const ticket = at('new', { assignee: null });
    assign(ticket, 'Emre');
    expect(ticket.assignee).toBeNull();
  });
});

describe('validateDraft', () => {
  const ok = { title: 'Yazıcı çalışmıyor', category: 'hardware', priority: 'urgent', requester: 'Ayşe' };

  it('geçerli taslağı temizleyip yeni, atanmamış bir talebe çevirir', () => {
    expect(validateDraft({ title: '  Yazıcı   çalışmıyor ', category: 'hardware', priority: 'urgent', requester: ' Ayşe ' }, 'id1', NOW)).toEqual({
      ok: true,
      ticket: { id: 'id1', title: 'Yazıcı çalışmıyor', category: 'hardware', priority: 'urgent', requester: 'Ayşe', assignee: null, status: 'new', openedAt: NOW, resolvedAt: null },
    });
  });

  it.each(['', '   ', 'ab', 'x'.repeat(81)])('%j başlığını reddeder', (title) => {
    expect(validateDraft({ ...ok, title }, 'i', NOW)).toEqual({ ok: false, errors: { title: 'titleLength' } });
  });

  it('sınırdaki başlıkları kabul eder (3 ve 80 karakter)', () => {
    expect(validateDraft({ ...ok, title: 'abc' }, 'i', NOW).ok).toBe(true);
    expect(validateDraft({ ...ok, title: 'x'.repeat(80) }, 'i', NOW).ok).toBe(true);
  });

  it.each(['', ' ', 'A', 'y'.repeat(41)])('%j talep edenini reddeder', (requester) => {
    expect(validateDraft({ ...ok, requester }, 'i', NOW)).toEqual({ ok: false, errors: { requester: 'requesterLength' } });
  });

  it('bütün hataları birlikte bildirir', () => {
    expect(validateDraft({ title: '', category: 'yok', priority: 'acil', requester: 'A' }, 'i', NOW)).toEqual({
      ok: false,
      errors: { title: 'titleLength', category: 'categoryInvalid', priority: 'priorityInvalid', requester: 'requesterLength' },
    });
  });

  it('HTML içeren başlığı olduğu gibi saklar (kaçış arayüzün işidir)', () => {
    const title = '<img src=x onerror=alert(1)>';
    expect(validateDraft({ ...ok, title }, 'i', NOW)).toMatchObject({ ok: true, ticket: { title } });
  });
});

describe('sortForColumn / groupByStatus / replaceTicket', () => {
  const list: Ticket[] = [
    at('new', { id: 'low-old', priority: 'low', openedAt: NOW - 500 * MIN }),
    at('new', { id: 'urgent-new', priority: 'urgent', openedAt: NOW - 5 * MIN }),
    at('new', { id: 'normal', priority: 'normal', openedAt: NOW - 60 * MIN }),
    at('new', { id: 'urgent-old', priority: 'urgent', openedAt: NOW - 90 * MIN }),
  ];

  it('önce önceliğe, sonra eskiden yeniye sıralar', () => {
    expect(sortForColumn(list).map((ticket) => ticket.id)).toEqual(['urgent-old', 'urgent-new', 'normal', 'low-old']);
  });

  it('girdi dizisini değiştirmez', () => {
    const before = list.map((ticket) => ticket.id);
    sortForColumn(list);
    expect(list.map((ticket) => ticket.id)).toEqual(before);
  });

  it('dört durumun anahtarı her zaman vardır', () => {
    const groups = groupByStatus([at('waiting', { id: 'w' })]);
    expect(Object.keys(groups)).toEqual(['new', 'inProgress', 'waiting', 'resolved']);
    expect(groups.waiting.map((ticket) => ticket.id)).toEqual(['w']);
    expect(groups.new).toEqual([]);
  });

  it('her grubu sıralı döndürür', () => {
    expect(groupByStatus(list).new.map((ticket) => ticket.id)).toEqual(['urgent-old', 'urgent-new', 'normal', 'low-old']);
  });

  it('yalnızca aynı kimlikli talebi değiştirir ve yeni dizi döndürür', () => {
    const next = { ...list[2]!, title: 'Değişti' };
    const replaced = replaceTicket(list, next);
    expect(replaced).not.toBe(list);
    expect(replaced[2]).toBe(next);
    expect(replaced[0]).toBe(list[0]);
    expect(list[2]!.title).toBe(base.title);
  });

  it('kimlik yoksa içerik aynı kalır', () => {
    expect(replaceTicket(list, { ...base, id: 'yok' })).toEqual(list);
  });
});
