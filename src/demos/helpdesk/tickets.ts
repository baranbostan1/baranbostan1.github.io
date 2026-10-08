// Destek talebi kuralları: doğrulama, durum geçişleri, atama, sıralama.
// Saf fonksiyonlar; arayüze, depolamaya ve saate dokunmaz (şimdiki zaman parametre olarak verilir).
// Hiçbir fonksiyon girdisini değiştirmez.

export type TicketStatus = 'new' | 'inProgress' | 'waiting' | 'resolved';
export type TicketCategory = 'hardware' | 'software' | 'account' | 'network';
export type TicketPriority = 'low' | 'normal' | 'urgent';
export type TicketAction = 'start' | 'wait' | 'resume' | 'resolve' | 'reopen';

/** Panodaki sütun sırası. */
export const STATUSES: readonly TicketStatus[] = ['new', 'inProgress', 'waiting', 'resolved'];
export const CATEGORIES: readonly TicketCategory[] = ['hardware', 'software', 'account', 'network'];
export const PRIORITIES: readonly TicketPriority[] = ['low', 'normal', 'urgent'];
/** Demodaki iki kurgusal destek görevlisi. */
export const ASSIGNEES: readonly string[] = ['Deniz', 'Emre'];

export const TITLE_MIN = 3;
export const TITLE_MAX = 80;
export const REQUESTER_MIN = 2;
export const REQUESTER_MAX = 40;

export interface Ticket {
  id: string;
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  requester: string;
  /** null: henüz kimseye atanmadı */
  assignee: string | null;
  status: TicketStatus;
  /** Açılış zamanı, epoch ms */
  openedAt: number;
  /** Çözüm zamanı, epoch ms; yalnızca durum 'resolved' iken doludur */
  resolvedAt: number | null;
}

export interface TicketDraft {
  title: string;
  category: string;
  priority: string;
  requester: string;
}

export type DraftError = 'titleLength' | 'categoryInvalid' | 'priorityInvalid' | 'requesterLength';
export type DraftErrors = Partial<Record<keyof TicketDraft, DraftError>>;
export type DraftValidation = { ok: true; ticket: Ticket } | { ok: false; errors: DraftErrors };
export type ActionError = 'notAllowed' | 'unassigned';
export type AssignError = 'resolved' | 'unknownAssignee' | 'ownerRequired';
export type Result<E> = { ok: true; ticket: Ticket } | { ok: false; error: E };

// Her durumdan hangi eylemle hangi duruma geçilir. Tabloda olmayan her geçiş reddedilir.
const TRANSITIONS: Record<TicketStatus, Partial<Record<TicketAction, TicketStatus>>> = {
  new: { start: 'inProgress' },
  inProgress: { wait: 'waiting', resolve: 'resolved' },
  waiting: { resume: 'inProgress', resolve: 'resolved' },
  resolved: { reopen: 'inProgress' },
};

const PRIORITY_RANK: Record<TicketPriority, number> = { urgent: 0, normal: 1, low: 2 };

const collapseSpaces = (text: string): string => text.trim().replace(/\s+/g, ' ');
const isCategory = (value: string): value is TicketCategory => (CATEGORIES as readonly string[]).includes(value);
const isPriority = (value: string): value is TicketPriority => (PRIORITIES as readonly string[]).includes(value);
const lengthBetween = (text: string, min: number, max: number): boolean => text.length >= min && text.length <= max;

/** Formdan gelen taslağı doğrular; geçerliyse yeni, atanmamış bir talep döndürür. */
export function validateDraft(draft: TicketDraft, id: string, now: number): DraftValidation {
  const title = collapseSpaces(draft.title);
  const requester = collapseSpaces(draft.requester);
  const { category, priority } = draft;
  const errors: DraftErrors = {
    ...(lengthBetween(title, TITLE_MIN, TITLE_MAX) ? {} : { title: 'titleLength' as const }),
    ...(isCategory(category) ? {} : { category: 'categoryInvalid' as const }),
    ...(isPriority(priority) ? {} : { priority: 'priorityInvalid' as const }),
    ...(lengthBetween(requester, REQUESTER_MIN, REQUESTER_MAX) ? {} : { requester: 'requesterLength' as const }),
  };
  if (!isCategory(category) || !isPriority(priority) || Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, ticket: { id, title, category, priority, requester, assignee: null, status: 'new', openedAt: now, resolvedAt: null } };
}

export function allowedActions(status: TicketStatus): readonly TicketAction[] {
  return Object.keys(TRANSITIONS[status]) as TicketAction[];
}

/** Eylemi uygular. İzinsiz geçişte ya da atanmamış talebi işleme almada talep değişmez, neden döner. */
export function applyAction(ticket: Ticket, action: TicketAction, now: number): Result<ActionError> {
  const target = TRANSITIONS[ticket.status][action];
  if (target === undefined) return { ok: false, error: 'notAllowed' };
  if (action === 'start' && ticket.assignee === null) return { ok: false, error: 'unassigned' };
  return { ok: true, ticket: { ...ticket, status: target, resolvedAt: target === 'resolved' ? now : null } };
}

/**
 * Talebi birine atar ya da atamayı kaldırır (null). Çözülmüş talebin ataması değişmez.
 * Atama yalnızca yeni talepte kaldırılabilir: işleme alınmış bir talep devredilir, sahipsiz bırakılmaz.
 */
export function assign(ticket: Ticket, assignee: string | null): Result<AssignError> {
  if (ticket.status === 'resolved') return { ok: false, error: 'resolved' };
  if (assignee === null && ticket.status !== 'new') return { ok: false, error: 'ownerRequired' };
  if (assignee !== null && !ASSIGNEES.includes(assignee)) return { ok: false, error: 'unknownAssignee' };
  return { ok: true, ticket: { ...ticket, assignee } };
}

/** Aynı kimlikli talebi yenisiyle değiştirilmiş yeni bir liste döndürür. */
export function replaceTicket(tickets: readonly Ticket[], next: Ticket): Ticket[] {
  return tickets.map((ticket) => (ticket.id === next.id ? next : ticket));
}

/** Sütun içi sıra: önce acil, sonra normal, sonra düşük; aynı öncelikte en eski açılan üstte. */
export function sortForColumn(tickets: readonly Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || a.openedAt - b.openedAt);
}

export function groupByStatus(tickets: readonly Ticket[]): Record<TicketStatus, Ticket[]> {
  const column = (status: TicketStatus): Ticket[] => sortForColumn(tickets.filter((ticket) => ticket.status === status));
  return { new: column('new'), inProgress: column('inProgress'), waiting: column('waiting'), resolved: column('resolved') };
}
