// QR menü demosunun arayüzü: durumu tutar, filtre sonucunu çizer. Mantık filter.ts'tedir.
import type { Locale } from '../../i18n/locales';
import { CATEGORIES, ITEMS } from './data';
import { categoriesFor, filterMenu, periodAt, type MenuItem, type Period } from './filter';
import { QR_MENU_STRINGS } from './strings';

interface State {
  period: Period;
  categoryId: string | null;
  query: string;
}

const PRICE_LOCALES: Record<Locale, string> = { tr: 'tr-TR', en: 'en-US' };

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function initQrMenu(root: HTMLElement): void {
  const locale: Locale = root.dataset.locale === 'en' ? 'en' : 'tr';
  const strings = QR_MENU_STRINGS[locale];
  const price = new Intl.NumberFormat(PRICE_LOCALES[locale], { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });

  const list = root.querySelector<HTMLElement>('[data-menu-list]');
  const chips = root.querySelector<HTMLElement>('[data-menu-chips]');
  const search = root.querySelector<HTMLInputElement>('[data-menu-search]');
  const status = root.querySelector<HTMLElement>('[data-menu-status]');
  const periodButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-period]')];
  if (!list || !chips || !search || !status || periodButtons.length === 0) {
    throw new Error('QR menü demosu: beklenen öğeler bulunamadı');
  }

  let state: State = { period: periodAt(new Date()), categoryId: null, query: '' };

  const setState = (patch: Partial<State>): void => {
    const next = { ...state, ...patch };
    // Dönem değişince seçili kategori yeni dönemde yoksa "Tümü"ne dönülür.
    const stillVisible = next.categoryId === null || categoriesFor(CATEGORIES, next.period).some((category) => category.id === next.categoryId);
    state = stillVisible ? next : { ...next, categoryId: null };
    render();
  };

  const renderChips = (): void => {
    const chip = (label: string, categoryId: string | null): HTMLButtonElement => {
      const button = el('button', 'qr-chip', label);
      button.type = 'button';
      button.setAttribute('aria-pressed', String(state.categoryId === categoryId));
      button.addEventListener('click', () => setState({ categoryId }));
      return button;
    };
    // Çipler yeniden çizilirken klavye odağı kaybolmasın: odak çiplerdeyse seçili çipe geri verilir.
    const hadFocus = chips.contains(document.activeElement);
    chips.replaceChildren(
      chip(strings.allCategories, null),
      ...categoriesFor(CATEGORIES, state.period).map((category) => chip(category.name[locale], category.id)),
    );
    if (hadFocus) chips.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus();
  };

  const renderItem = (item: MenuItem): HTMLLIElement => {
    const row = el('li', 'qr-item');
    const text = el('div', 'qr-item-text');
    text.append(el('p', 'qr-item-name', item.name[locale]), el('p', 'qr-item-desc', item.description[locale]));
    row.append(text, el('p', 'qr-item-price', price.format(item.priceKurus / 100)));
    return row;
  };

  const renderEmpty = (): HTMLElement => {
    const box = el('div', 'qr-empty');
    const clear = el('button', 'qr-clear', strings.clearSearch);
    clear.type = 'button';
    clear.addEventListener('click', () => {
      search.value = '';
      setState({ query: '' });
      search.focus();
    });
    box.append(el('p', 'qr-empty-title', strings.emptyTitle), el('p', 'qr-empty-hint', strings.emptyHint), clear);
    return box;
  };

  const renderList = (): void => {
    const items = filterMenu(ITEMS, CATEGORIES, { ...state, locale });
    status.textContent = strings.resultCount.replace('{count}', String(items.length));
    if (items.length === 0) {
      list.replaceChildren(renderEmpty());
      return;
    }
    const sections = categoriesFor(CATEGORIES, state.period)
      .map((category) => ({ category, rows: items.filter((item) => item.categoryId === category.id) }))
      .filter((section) => section.rows.length > 0)
      .map(({ category, rows }) => {
        const section = el('section', 'qr-section');
        const rowList = el('ul', 'qr-rows');
        rowList.append(...rows.map(renderItem));
        section.append(el('h4', 'qr-section-title', category.name[locale]), rowList);
        return section;
      });
    list.replaceChildren(...sections);
  };

  const render = (): void => {
    periodButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.period === state.period)));
    renderChips();
    renderList();
  };

  periodButtons.forEach((button) => {
    button.addEventListener('click', () => setState({ period: button.dataset.period === 'day' ? 'day' : 'evening' }));
  });
  search.addEventListener('input', () => setState({ query: search.value }));

  render();
  root.setAttribute('data-ready', '');
}
