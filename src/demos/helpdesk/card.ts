// Panodaki tek bir talep kutusunu üretir ve süre satırını günceller.
// Yalnızca DOM kurar; karar vermez. Tüm metin textContent ile yazılır.
import type { Locale } from '../../i18n/locales';
import type { HelpdeskStrings } from './strings';
import { allowedActions, ASSIGNEES, type Ticket } from './tickets';
import { ageMinutes, formatDuration, isOverdue } from './timing';

export interface CardContext {
  strings: HelpdeskStrings;
  locale: Locale;
  now: number;
}

export function el<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** Süre metni: açık talepte "Açık: 25 dk", çözülmüşte "Çözüm süresi: 5 sa". */
export function ageText(ticket: Ticket, { strings, locale, now }: CardContext): string {
  const label = ticket.status === 'resolved' ? strings.resolvedIn : strings.openFor;
  return `${label}: ${formatDuration(ageMinutes(ticket, now), locale)}`;
}

function assignSelect(ticket: Ticket, strings: HelpdeskStrings): HTMLLabelElement {
  const label = el('label', 'hd-assign');
  const select = el('select');
  select.dataset.assign = '';
  // Panoda dokuz ayrı "Atanan" alanı var; ekran okuyucu hangisinin hangi talebe ait olduğunu adından anlar.
  select.setAttribute('aria-label', `${strings.assigneeLabel}: ${ticket.title}`);
  const none = el('option', '', strings.unassigned);
  none.value = '';
  // "Atanmamış" yalnızca henüz kimseye verilmemiş talepte sunulur: işlemdeki talep devredilir, sahipsiz bırakılmaz.
  const options = ASSIGNEES.map((name) => el('option', '', name));
  select.append(...(ticket.status === 'new' ? [none, ...options] : options));
  select.value = ticket.assignee ?? '';
  // Çözülmüş talebin ataması değişmez (kural tickets.ts'te); alan da buna göre kapalıdır.
  select.disabled = ticket.status === 'resolved';
  label.append(el('span', '', strings.assigneeLabel), select);
  return label;
}

function actionButtons(ticket: Ticket, strings: HelpdeskStrings): HTMLDivElement {
  const wrap = el('div', 'hd-actions');
  wrap.append(
    ...allowedActions(ticket.status).map((action) => {
      const button = el('button', 'hd-action', strings.actions[action]);
      button.type = 'button';
      button.dataset.action = action;
      button.setAttribute('aria-label', `${strings.actions[action]}: ${ticket.title}`);
      return button;
    }),
  );
  return wrap;
}

/** Süre satırını ve "hedefi aştı" işaretini günceller; kutunun geri kalanına (odak, açık seçim alanı) dokunmaz. */
export function refreshCardTime(card: HTMLElement, ticket: Ticket, context: CardContext): void {
  const age = card.querySelector<HTMLElement>('[data-age]');
  const mark = card.querySelector<HTMLElement>('[data-overdue-mark]');
  if (age) age.textContent = ageText(ticket, context);
  if (mark) mark.hidden = !isOverdue(ticket, context.now);
}

export function buildCard(ticket: Ticket, context: CardContext): HTMLLIElement {
  const { strings } = context;
  const card = el('li', 'hd-card');
  card.dataset.ticket = ticket.id;
  // Eylemden sonra odak verilebilsin diye; sekme sırasına girmez.
  card.tabIndex = -1;

  const meta = el('p', 'hd-meta');
  const priority = el('span', 'hd-priority', strings.priorities[ticket.priority]);
  priority.dataset.priority = ticket.priority;
  meta.append(`${strings.categories[ticket.category]} · `, priority);

  const time = el('p', 'hd-time');
  const age = el('span', 'hd-age');
  age.dataset.age = '';
  const mark = el('span', 'hd-overdue', strings.overdue);
  mark.dataset.overdueMark = '';
  time.append(age, mark);

  card.append(
    el('h5', 'hd-title', ticket.title),
    meta,
    el('p', 'hd-requester', `${strings.requesterPrefix}: ${ticket.requester}`),
    time,
    assignSelect(ticket, strings),
    actionButtons(ticket, strings),
  );
  refreshCardTime(card, ticket, context);
  return card;
}
