// Destek talepleri demosunun görünümü: sayfadaki öğeleri bulur, özeti ve panoyu çizer, formu okur.
// Durum tutmaz ve karar vermez; talepler ve saat her çağrıda verilir. Tüm metin textContent ile yazılır.
import type { Locale } from '../../i18n/locales';
import { buildCard, el, refreshCardTime, type CardContext } from './card';
import { HELPDESK_STRINGS, type HelpdeskStrings } from './strings';
import { groupByStatus, STATUSES, type DraftErrors, type Ticket, type TicketDraft } from './tickets';
import { formatDuration, summarize } from './timing';

export type FieldName = keyof TicketDraft;
type Field = HTMLInputElement | HTMLSelectElement;
/** Yeniden çizimden sonra odağın döneceği yer: talebin ilk eylem düğmesi ya da atama alanı. */
export type FocusTarget = 'action' | 'assign';

export interface View {
  locale: Locale;
  strings: HelpdeskStrings;
  form: HTMLFormElement;
  fields: Record<FieldName, Field>;
  board: HTMLElement;
  summary: HTMLElement;
  status: HTMLElement;
  memoryNote: HTMLElement;
  resetButton: HTMLButtonElement;
}

const FIELD_ORDER: readonly FieldName[] = ['title', 'category', 'priority', 'requester'];
const DEFAULT_PRIORITY = 'normal';

function required<T extends Element>(root: ParentNode, selector: string): T {
  const node = root.querySelector<T>(selector);
  if (!node) throw new Error(`Destek demosu: ${selector} bulunamadı`);
  return node;
}

export function findView(root: HTMLElement): View {
  const locale: Locale = root.dataset.locale === 'en' ? 'en' : 'tr';
  const form = required<HTMLFormElement>(root, '[data-form]');
  return {
    locale,
    strings: HELPDESK_STRINGS[locale],
    form,
    fields: {
      title: required(form, '[name="title"]'),
      category: required(form, '[name="category"]'),
      priority: required(form, '[name="priority"]'),
      requester: required(form, '[name="requester"]'),
    },
    board: required(root, '[data-board]'),
    summary: required(root, '[data-summary]'),
    status: required(root, '[data-status]'),
    memoryNote: required(root, '[data-memory-note]'),
    resetButton: required(root, '[data-reset]'),
  };
}

const contextOf = (view: View, now: number): CardContext => ({ strings: view.strings, locale: view.locale, now });

export function cardOf(view: View, id: string): HTMLElement | null {
  return [...view.board.querySelectorAll<HTMLElement>('[data-ticket]')].find((card) => card.dataset.ticket === id) ?? null;
}

export function renderSummary(view: View, tickets: readonly Ticket[], now: number): void {
  const { strings } = view;
  const totals = summarize(tickets, now);
  const entry = (label: string, value: string): HTMLElement => {
    const wrap = el('div');
    wrap.append(el('dt', '', label), el('dd', '', value));
    return wrap;
  };
  view.summary.replaceChildren(
    entry(strings.summaryOpen, String(totals.open)),
    entry(strings.summaryUrgent, String(totals.urgentOpen)),
    entry(strings.summaryOverdue, String(totals.overdue)),
    entry(strings.summaryLongest, totals.longestOpenMinutes === null ? strings.none : formatDuration(totals.longestOpenMinutes, view.locale)),
  );
}

export function renderBoard(view: View, tickets: readonly Ticket[], now: number): void {
  const groups = groupByStatus(tickets);
  const context = contextOf(view, now);
  STATUSES.forEach((status) => {
    const column = required<HTMLElement>(view.board, `[data-column="${status}"]`);
    const inColumn = groups[status];
    required<HTMLElement>(column, '[data-count]').textContent = String(inColumn.length);
    const items = inColumn.length > 0 ? inColumn.map((ticket) => buildCard(ticket, context)) : [el('li', 'hd-empty', view.strings.emptyColumn)];
    required<HTMLElement>(column, '[data-list]').replaceChildren(...items);
  });
}

/** Yalnızca özeti ve süre satırlarını yeniler. Kutular yeniden kurulmaz: odak ve açık bir seçim alanı bozulmasın. */
export function refreshTimes(view: View, tickets: readonly Ticket[], now: number): void {
  renderSummary(view, tickets, now);
  const context = contextOf(view, now);
  tickets.forEach((ticket) => {
    const card = cardOf(view, ticket.id);
    if (card) refreshCardTime(card, ticket, context);
  });
}

export function focusTicket(view: View, id: string, target: FocusTarget): void {
  const card = cardOf(view, id);
  if (!card) return;
  const selector = target === 'assign' ? '[data-assign]:not(:disabled)' : '[data-action]';
  (card.querySelector<HTMLElement>(selector) ?? card).focus();
}

/** Alan önce boşaltılır: aynı mesaj art arda geldiğinde de ekran okuyucu yeniden okusun. */
export function announce(view: View, message: string): void {
  view.status.textContent = '';
  window.requestAnimationFrame(() => {
    view.status.textContent = message;
  });
}

export function readDraft(view: View): TicketDraft {
  const { title, category, priority, requester } = view.fields;
  return { title: title.value, category: category.value, priority: priority.value, requester: requester.value };
}

/** Alan hatalarını yazar; hata varsa odağı ilk hatalı alana götürür. Boş nesne bütün hataları temizler. */
export function showErrors(view: View, errors: DraftErrors): void {
  FIELD_ORDER.forEach((name) => {
    const message = required<HTMLElement>(view.form, `[data-error="${name}"]`);
    const code = errors[name];
    message.textContent = code ? view.strings.errors[code] : '';
    message.hidden = !code;
    view.fields[name].setAttribute('aria-invalid', String(Boolean(code)));
  });
  const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
  if (firstInvalid) view.fields[firstInvalid].focus();
}

/** Talep açıldıktan sonra: metin alanları boşalır, kategori ve öncelik seçimi kalır. */
export function clearTextFields(view: View): void {
  view.fields.title.value = '';
  view.fields.requester.value = '';
}

export function resetForm(view: View): void {
  showErrors(view, {});
  view.form.reset();
  view.fields.priority.value = DEFAULT_PRIORITY;
}
