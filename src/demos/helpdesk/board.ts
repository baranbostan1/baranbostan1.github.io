// Destek talepleri demosunun denetimi: durumu tutar, eylemleri kurallara sorar, sonucu kaydedip görünüme çizdirir.
// Kurallar tickets.ts ve timing.ts'te, DOM view.ts ve card.ts'te; burada yalnızca ikisini bağlayan akış vardır.
import { getStore, type KeyValueStore } from '../agency/storage';
import { materializeSeed } from './seed';
import { clearTickets, loadTickets, saveTickets } from './storage';
import { applyAction, assign, replaceTicket, validateDraft, type Ticket, type TicketAction } from './tickets';
import { announce, cardOf, clearTextFields, findView, focusTicket, readDraft, refreshTimes, renderBoard, renderSummary, resetForm, showErrors, type FocusTarget, type View } from './view';

const ACTIONS: readonly TicketAction[] = ['start', 'wait', 'resume', 'resolve', 'reopen'];
const TIME_REFRESH_MS = 60_000;

interface Session {
  view: View;
  store: KeyValueStore | null;
  tickets: readonly Ticket[];
}

const newId = (): string => (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `t-${Date.now()}-${Math.random().toString(36).slice(2)}`);
const isAction = (value: string | undefined): value is TicketAction => (ACTIONS as readonly string[]).includes(value ?? '');
const fill = (template: string, values: Record<string, string>): string => template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

function render(session: Session): void {
  const now = Date.now();
  renderSummary(session.view, session.tickets, now);
  renderBoard(session.view, session.tickets, now);
}

/** Yeni listeyi kaydeder, panoyu yeniden çizer ve odağı eylemin yapıldığı talebe geri verir. */
function commit(session: Session, tickets: readonly Ticket[], focus: { id: string; target: FocusTarget } | null): void {
  session.view.memoryNote.hidden = saveTickets(session.store, tickets, session.view.locale);
  session.tickets = tickets;
  render(session);
  if (focus) focusTicket(session.view, focus.id, focus.target);
}

function runAction(session: Session, ticket: Ticket, action: TicketAction): void {
  const { view } = session;
  const result = applyAction(ticket, action, Date.now());
  if (result.ok) {
    announce(view, fill(view.strings.movedTo, { status: view.strings.statuses[result.ticket.status], title: ticket.title }));
    commit(session, replaceTicket(session.tickets, result.ticket), { id: ticket.id, target: 'action' });
    return;
  }
  // Atanmamış talep işleme alınamaz: neden söylenir, odak atama alanına gider. İzinsiz geçişte talep değişmez.
  if (result.error !== 'unassigned') return;
  announce(view, view.strings.assignFirst);
  focusTicket(view, ticket.id, 'assign');
}

function runAssign(session: Session, ticket: Ticket, name: string): void {
  const { view } = session;
  const result = assign(ticket, name === '' ? null : name);
  if (!result.ok) {
    // Reddedilen seçim geri alınır: pano gerçek durumla yeniden çizilir.
    render(session);
    return;
  }
  const template = result.ticket.assignee === null ? view.strings.assignmentRemoved : view.strings.assignedTo;
  announce(view, fill(template, { name: result.ticket.assignee ?? '', title: ticket.title }));
  commit(session, replaceTicket(session.tickets, result.ticket), { id: ticket.id, target: 'assign' });
}

function ticketFrom(session: Session, node: Element): Ticket | null {
  const id = node.closest<HTMLElement>('[data-ticket]')?.dataset.ticket;
  return session.tickets.find((ticket) => ticket.id === id) ?? null;
}

function bindBoard(session: Session): void {
  const { board } = session.view;
  board.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-action]') : null;
    const ticket = button ? ticketFrom(session, button) : null;
    const action = button?.dataset.action;
    if (ticket && isAction(action)) runAction(session, ticket, action);
  });
  board.addEventListener('change', (event) => {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement) || select.dataset.assign === undefined) return;
    const ticket = ticketFrom(session, select);
    if (ticket) runAssign(session, ticket, select.value);
  });
}

function bindForm(session: Session): void {
  const { view } = session;
  view.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = validateDraft(readDraft(view), newId(), Date.now());
    if (!result.ok) {
      showErrors(view, result.errors);
      return;
    }
    showErrors(view, {});
    clearTextFields(view);
    announce(view, fill(view.strings.opened, { title: result.ticket.title }));
    commit(session, [...session.tickets, result.ticket], null);
    // Yeni talebin panoda nereye düştüğü kısa bir vurguyla gösterilir; odak formda kalır.
    cardOf(view, result.ticket.id)?.setAttribute('data-touched', '');
  });
}

function bindReset(session: Session): void {
  const { view, store } = session;
  view.resetButton.addEventListener('click', () => {
    if (!window.confirm(view.strings.resetConfirm)) return;
    clearTickets(store, view.locale);
    resetForm(view);
    announce(view, view.strings.resetDone);
    session.tickets = materializeSeed(Date.now(), view.locale);
    view.memoryNote.hidden = store !== null;
    render(session);
  });
}

export function initHelpdeskBoard(root: HTMLElement): void {
  const view = findView(root);
  const store = getStore();
  // Oturum, sayfa açık kaldıkça yaşayan tek değişken durumdur; talep listeleri ise hiç değiştirilmez, yenisiyle değiştirilir.
  const session: Session = { view, store, tickets: loadTickets(store, Date.now(), view.locale) };
  bindBoard(session);
  bindForm(session);
  bindReset(session);
  // Süreler dakikada bir yenilenir.
  window.setInterval(() => refreshTimes(view, session.tickets, Date.now()), TIME_REFRESH_MS);
  view.memoryNote.hidden = store !== null;
  render(session);
  root.setAttribute('data-ready', '');
}
