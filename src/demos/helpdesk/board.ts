// Destek talepleri demosunun arayüzü: durumu tutar, panoyu çizer, formu ve eylemleri işler.
// Kurallar tickets.ts ve timing.ts'te; burada yalnızca DOM vardır. Tüm metin textContent ile yazılır.
import type { Locale } from '../../i18n/locales';
import { getStore } from '../agency/storage';
import { buildCard, el, refreshCardTime, type CardContext } from './card';
import { materializeSeed } from './seed';
import { clearTickets, loadTickets, saveTickets } from './storage';
import { HELPDESK_STRINGS, type HelpdeskStrings } from './strings';
import { applyAction, assign, groupByStatus, replaceTicket, STATUSES, validateDraft, type DraftErrors, type Ticket, type TicketAction, type TicketDraft } from './tickets';
import { formatDuration, summarize } from './timing';

type FieldName = keyof TicketDraft;
type Field = HTMLInputElement | HTMLSelectElement;
/** Yeniden çizimden sonra odağın döneceği yer: talebin ilk eylem düğmesi ya da atama alanı. */
type FocusTarget = 'action' | 'assign';

const FIELD_ORDER: readonly FieldName[] = ['title', 'category', 'priority', 'requester'];
const ACTIONS: readonly TicketAction[] = ['start', 'wait', 'resume', 'resolve', 'reopen'];
const TIME_REFRESH_MS = 60_000;
const DEFAULT_PRIORITY = 'normal';

interface State {
  tickets: readonly Ticket[];
  now: number;
}

const newId = (): string => (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `t-${Date.now()}-${Math.random().toString(36).slice(2)}`);
const isAction = (value: string | undefined): value is TicketAction => (ACTIONS as readonly string[]).includes(value ?? '');
const fill = (template: string, values: Record<string, string>): string => template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

function required<T extends Element>(root: ParentNode, selector: string): T {
  const node = root.querySelector<T>(selector);
  if (!node) throw new Error(`Destek demosu: ${selector} bulunamadı`);
  return node;
}

export function initHelpdeskBoard(root: HTMLElement): void {
  const locale: Locale = root.dataset.locale === 'en' ? 'en' : 'tr';
  const strings: HelpdeskStrings = HELPDESK_STRINGS[locale];
  const store = getStore();
  const form = required<HTMLFormElement>(root, '[data-form]');
  const fields: Record<FieldName, Field> = {
    title: required(form, '[name="title"]'),
    category: required(form, '[name="category"]'),
    priority: required(form, '[name="priority"]'),
    requester: required(form, '[name="requester"]'),
  };
  const board = required<HTMLElement>(root, '[data-board]');
  const summary = required<HTMLElement>(root, '[data-summary]');
  const status = required<HTMLElement>(root, '[data-status]');
  const memoryNote = required<HTMLElement>(root, '[data-memory-note]');

  let state: State = { tickets: loadTickets(store, Date.now(), locale), now: Date.now() };

  const context = (): CardContext => ({ strings, locale, now: state.now });
  const cardOf = (id: string): HTMLElement | null => [...board.querySelectorAll<HTMLElement>('[data-ticket]')].find((card) => card.dataset.ticket === id) ?? null;
  // Alan önce boşaltılır: aynı mesaj art arda geldiğinde de ekran okuyucu yeniden okusun.
  const announce = (message: string): void => {
    status.textContent = '';
    window.requestAnimationFrame(() => {
      status.textContent = message;
    });
  };

  const renderSummary = (): void => {
    const totals = summarize(state.tickets, state.now);
    const entry = (label: string, value: string): HTMLElement => {
      const wrap = el('div');
      wrap.append(el('dt', '', label), el('dd', '', value));
      return wrap;
    };
    summary.replaceChildren(
      entry(strings.summaryOpen, String(totals.open)),
      entry(strings.summaryUrgent, String(totals.urgentOpen)),
      entry(strings.summaryOverdue, String(totals.overdue)),
      entry(strings.summaryLongest, totals.longestOpenMinutes === null ? strings.none : formatDuration(totals.longestOpenMinutes, locale)),
    );
  };

  const renderBoard = (): void => {
    const groups = groupByStatus(state.tickets);
    STATUSES.forEach((columnStatus) => {
      const column = required<HTMLElement>(board, `[data-column="${columnStatus}"]`);
      const tickets = groups[columnStatus];
      required<HTMLElement>(column, '[data-count]').textContent = String(tickets.length);
      const items = tickets.length > 0 ? tickets.map((ticket) => buildCard(ticket, context())) : [el('li', 'hd-empty', strings.emptyColumn)];
      required<HTMLElement>(column, '[data-list]').replaceChildren(...items);
    });
  };

  const render = (): void => {
    renderSummary();
    renderBoard();
  };

  const focusTicket = (id: string, target: FocusTarget): void => {
    const card = cardOf(id);
    if (!card) return;
    const selector = target === 'assign' ? '[data-assign]:not(:disabled)' : '[data-action]';
    (card.querySelector<HTMLElement>(selector) ?? card).focus();
  };

  /** Yeni listeyi kaydeder, panoyu yeniden çizer ve odağı eylemin yapıldığı talebe geri verir. */
  const commit = (tickets: readonly Ticket[], focus: { id: string; target: FocusTarget } | null): void => {
    memoryNote.hidden = saveTickets(store, tickets, locale);
    state = { tickets, now: Date.now() };
    render();
    if (focus) focusTicket(focus.id, focus.target);
  };

  const runAction = (ticket: Ticket, action: TicketAction): void => {
    const result = applyAction(ticket, action, Date.now());
    if (result.ok) {
      announce(fill(strings.movedTo, { status: strings.statuses[result.ticket.status], title: ticket.title }));
      commit(replaceTicket(state.tickets, result.ticket), { id: ticket.id, target: 'action' });
      return;
    }
    // Atanmamış talep işleme alınamaz: neden söylenir, odak atama alanına gider. İzinsiz geçişte talep değişmez.
    if (result.error !== 'unassigned') return;
    announce(strings.assignFirst);
    focusTicket(ticket.id, 'assign');
  };

  const runAssign = (ticket: Ticket, name: string): void => {
    const result = assign(ticket, name === '' ? null : name);
    if (!result.ok) {
      render();
      return;
    }
    const template = result.ticket.assignee === null ? strings.assignmentRemoved : strings.assignedTo;
    announce(fill(template, { name: result.ticket.assignee ?? '', title: ticket.title }));
    commit(replaceTicket(state.tickets, result.ticket), { id: ticket.id, target: 'assign' });
  };

  const ticketFrom = (node: Element): Ticket | null => {
    const id = node.closest<HTMLElement>('[data-ticket]')?.dataset.ticket;
    return state.tickets.find((ticket) => ticket.id === id) ?? null;
  };

  board.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-action]') : null;
    const ticket = button ? ticketFrom(button) : null;
    const action = button?.dataset.action;
    if (ticket && isAction(action)) runAction(ticket, action);
  });

  board.addEventListener('change', (event) => {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement) || select.dataset.assign === undefined) return;
    const ticket = ticketFrom(select);
    if (ticket) runAssign(ticket, select.value);
  });

  const showErrors = (errors: DraftErrors): void => {
    FIELD_ORDER.forEach((name) => {
      const message = required<HTMLElement>(form, `[data-error="${name}"]`);
      const code = errors[name];
      message.textContent = code ? strings.errors[code] : '';
      message.hidden = !code;
      fields[name].setAttribute('aria-invalid', String(Boolean(code)));
    });
    const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
    if (firstInvalid) fields[firstInvalid].focus();
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const draft: TicketDraft = { title: fields.title.value, category: fields.category.value, priority: fields.priority.value, requester: fields.requester.value };
    const result = validateDraft(draft, newId(), Date.now());
    if (!result.ok) {
      showErrors(result.errors);
      return;
    }
    showErrors({});
    fields.title.value = '';
    fields.requester.value = '';
    announce(fill(strings.opened, { title: result.ticket.title }));
    commit([...state.tickets, result.ticket], null);
    // Yeni talebin panoda nereye düştüğü kısa bir vurguyla gösterilir; odak formda kalır.
    cardOf(result.ticket.id)?.setAttribute('data-touched', '');
  });

  required<HTMLButtonElement>(root, '[data-reset]').addEventListener('click', () => {
    if (!window.confirm(strings.resetConfirm)) return;
    clearTickets(store, locale);
    showErrors({});
    form.reset();
    fields.priority.value = DEFAULT_PRIORITY;
    announce(strings.resetDone);
    state = { tickets: materializeSeed(Date.now(), locale), now: Date.now() };
    memoryNote.hidden = store !== null;
    render();
  });

  // Süreler dakikada bir yenilenir. Kutular yeniden kurulmaz: odak ve açık bir seçim alanı bozulmasın.
  window.setInterval(() => {
    state = { ...state, now: Date.now() };
    renderSummary();
    state.tickets.forEach((ticket) => {
      const card = cardOf(ticket.id);
      if (card) refreshCardTime(card, ticket, context());
    });
  }, TIME_REFRESH_MS);

  memoryNote.hidden = store !== null;
  render();
  root.setAttribute('data-ready', '');
}
