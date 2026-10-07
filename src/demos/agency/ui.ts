// Acenta demosunun arayüzü: durumu tutar, formu işler, tabloları çizer.
// Hesap ve doğrulama ledger.ts'te; burada yalnızca DOM vardır. Tüm metin textContent ile yazılır.
import type { Locale } from '../../i18n/locales';
import { formatKurus } from './amount';
import { toCsv } from './csv';
import {
  addInvoice,
  addPayment,
  agencyBalances,
  agencyKey,
  summarize,
  validateInvoice,
  validatePayment,
  type AgencyBalance,
  type FieldErrors,
  type FieldName,
  type Ledger,
} from './ledger';
import { listRecords, type LedgerRecord, type RecordKind, type SortOrder } from './records';
import { SEED } from './seed';
import { clearLedger, getStore, loadLedger, saveLedger } from './storage';
import { AGENCY_STRINGS, type AgencyStrings } from './strings';

const FIELD_ORDER: readonly FieldName[] = ['agency', 'date', 'invoiceNo', 'amount'];
const HIGHLIGHT_MS = 1600;
const BLOB_URL_LIFETIME_MS = 10_000;

interface State {
  ledger: Ledger;
  kind: RecordKind;
  filter: string | null;
  order: SortOrder;
  /** Son eklenen kaydın acentası; tabloda kısa süre vurgulanır */
  touched: string | null;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const newId = (): string => (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `k-${Date.now()}-${Math.random().toString(36).slice(2)}`);

// Yerel saat dilimine göre bugünün tarihi, YYYY-MM-DD.
function today(): string {
  const now = new Date();
  const pad = (value: number): string => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function required<T extends Element>(root: ParentNode, selector: string): T {
  const node = root.querySelector<T>(selector);
  if (!node) throw new Error(`Acenta demosu: ${selector} bulunamadı`);
  return node;
}

export function initAgencyDemo(root: HTMLElement): void {
  const locale: Locale = root.dataset.locale === 'en' ? 'en' : 'tr';
  const strings: AgencyStrings = AGENCY_STRINGS[locale];
  const money = (kurus: number): string => formatKurus(kurus, locale);
  const dateFormat = new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const showDate = (iso: string): string => dateFormat.format(new Date(`${iso}T00:00:00Z`));

  const store = getStore();
  const form = required<HTMLFormElement>(root, '[data-form]');
  const inputs: Record<FieldName, HTMLInputElement> = {
    agency: required(form, '[name="agency"]'),
    date: required(form, '[name="date"]'),
    invoiceNo: required(form, '[name="invoiceNo"]'),
    amount: required(form, '[name="amount"]'),
  };
  const invoiceNoField = required<HTMLElement>(form, '[data-field="invoiceNo"]');
  const submit = required<HTMLButtonElement>(form, '[type="submit"]');
  const kindInputs = [...form.querySelectorAll<HTMLInputElement>('[name="kind"]')];
  const datalist = required<HTMLDataListElement>(root, '[data-agency-options]');
  const summary = required<HTMLElement>(root, '[data-summary]');
  const balancesBody = required<HTMLElement>(root, '[data-balances]');
  const recordsBody = required<HTMLElement>(root, '[data-records]');
  const filterSelect = required<HTMLSelectElement>(root, '[data-filter]');
  const sortSelect = required<HTMLSelectElement>(root, '[data-sort]');
  const status = required<HTMLElement>(root, '[data-status]');
  const memoryNote = required<HTMLElement>(root, '[data-memory-note]');

  let state: State = { ledger: loadLedger(store), kind: 'invoice', filter: null, order: 'newest', touched: null };
  let highlightTimer = 0;

  const setState = (patch: Partial<State>): void => {
    state = { ...state, ...patch };
    render();
  };

  const commit = (ledger: Ledger, touched: string | null): void => {
    const saved = saveLedger(store, ledger);
    memoryNote.hidden = saved;
    setState({ ledger, touched });
    window.clearTimeout(highlightTimer);
    if (touched === null) return;
    // Vurgu yalnızca ilgili satırdan kaldırılır; her şeyi yeniden çizmek, kullanıcının o an açtığı bir listeyi kapatabilir.
    highlightTimer = window.setTimeout(() => {
      state = { ...state, touched: null };
      balancesBody.querySelectorAll('[data-touched]').forEach((row) => row.removeAttribute('data-touched'));
    }, HIGHLIGHT_MS);
  };

  const renderSummary = (): void => {
    const totals = summarize(state.ledger);
    const entry = (label: string, value: string): HTMLElement => {
      const wrap = el('div');
      wrap.append(el('dt', '', label), el('dd', '', value));
      return wrap;
    };
    summary.replaceChildren(
      entry(strings.totalInvoiced, money(totals.invoicedKurus)),
      entry(strings.totalPaid, money(totals.paidKurus)),
      entry(strings.openBalance, money(totals.balanceKurus)),
    );
  };

  const balanceCell = (row: AgencyBalance): HTMLTableCellElement => {
    const cell = el('td', 'ag-num ag-balance', money(row.balanceKurus));
    cell.setAttribute('role', 'cell');
    cell.dataset.label = strings.colBalance;
    // Durum yalnızca renkle değil, metinle de belirtilir.
    if (row.balanceKurus < 0) cell.append(el('span', 'ag-tag', strings.credit));
    if (row.balanceKurus === 0) cell.append(el('span', 'ag-tag', strings.settled));
    return cell;
  };

  const renderBalances = (balances: readonly AgencyBalance[]): void => {
    balancesBody.replaceChildren(
      ...balances.map((row) => {
        const tr = el('tr');
        tr.setAttribute('role', 'row');
        if (state.touched !== null && agencyKey(row.agency) === agencyKey(state.touched)) tr.setAttribute('data-touched', '');
        const name = el('th', '', row.agency);
        name.scope = 'row';
        name.setAttribute('role', 'rowheader');
        const invoiced = el('td', 'ag-num', money(row.invoicedKurus));
        invoiced.setAttribute('role', 'cell');
        invoiced.dataset.label = strings.colInvoiced;
        const paid = el('td', 'ag-num', money(row.paidKurus));
        paid.setAttribute('role', 'cell');
        paid.dataset.label = strings.colPaid;
        tr.append(name, invoiced, paid, balanceCell(row));
        return tr;
      }),
    );
  };

  const renderOptions = (balances: readonly AgencyBalance[]): void => {
    datalist.replaceChildren(
      ...balances.map((row) => {
        const option = el('option');
        option.value = row.agency;
        return option;
      }),
    );
    const all = el('option', '', strings.allAgencies);
    all.value = '';
    filterSelect.replaceChildren(
      all,
      ...balances.map((row) => {
        // Değer olarak görünen ad değil anahtar tutulur: acentanın görünen yazımı sonradan değişse de seçim kaybolmaz.
        const option = el('option', '', row.agency);
        option.value = agencyKey(row.agency);
        return option;
      }),
    );
    filterSelect.value = state.filter ?? '';
  };

  const renderRecord = (record: LedgerRecord): HTMLTableRowElement => {
    const tr = el('tr');
    tr.setAttribute('role', 'row');
    const cell = (label: string, text: string, className = ''): HTMLTableCellElement => {
      const td = el('td', className, text);
      td.setAttribute('role', 'cell');
      td.dataset.label = label;
      return td;
    };
    tr.append(
      cell(strings.colDate, showDate(record.date), 'ag-date'),
      cell(strings.colType, record.kind === 'invoice' ? strings.invoice : strings.payment),
      cell(strings.colAgency, record.agency),
      cell(strings.colInvoiceNo, record.invoiceNo || '—', 'ag-mono'),
      cell(strings.colAmount, money(record.amountKurus), 'ag-num'),
    );
    return tr;
  };

  const renderRecords = (): void => {
    const records = listRecords(state.ledger, state.filter, state.order);
    if (records.length > 0) {
      recordsBody.replaceChildren(...records.map(renderRecord));
      return;
    }
    const tr = el('tr');
    tr.setAttribute('role', 'row');
    const td = el('td', 'ag-empty', strings.noRecords);
    td.setAttribute('role', 'cell');
    td.colSpan = 5;
    tr.append(td);
    recordsBody.replaceChildren(tr);
  };

  const renderForm = (): void => {
    const isInvoice = state.kind === 'invoice';
    invoiceNoField.hidden = !isInvoice;
    inputs.invoiceNo.disabled = !isInvoice;
    submit.textContent = isInvoice ? strings.submitInvoice : strings.submitPayment;
    kindInputs.forEach((input) => {
      input.checked = input.value === state.kind;
    });
  };

  const render = (): void => {
    const balances = agencyBalances(state.ledger);
    renderSummary();
    renderBalances(balances);
    renderOptions(balances);
    renderRecords();
    renderForm();
  };

  const showErrors = (errors: FieldErrors): void => {
    FIELD_ORDER.forEach((name) => {
      const message = required<HTMLElement>(form, `[data-error="${name}"]`);
      const code = errors[name];
      message.textContent = code ? strings.errors[code] : '';
      message.hidden = !code;
      inputs[name].setAttribute('aria-invalid', String(Boolean(code)));
    });
    const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
    if (firstInvalid) inputs[firstInvalid].focus();
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const draft = { agency: inputs.agency.value, date: inputs.date.value, invoiceNo: inputs.invoiceNo.value, amount: inputs.amount.value };
    const result = state.kind === 'invoice' ? validateInvoice(draft, newId()) : validatePayment(draft, newId());
    if (!result.ok) {
      showErrors(result.errors);
      return;
    }
    showErrors({});
    const record = result.value;
    const ledger = 'invoiceNo' in record ? addInvoice(state.ledger, record) : addPayment(state.ledger, record);
    const template = state.kind === 'invoice' ? strings.addedInvoice : strings.addedPayment;
    status.textContent = template.replace('{agency}', record.agency).replace('{amount}', money(record.amountKurus));
    inputs.amount.value = '';
    inputs.invoiceNo.value = '';
    commit(ledger, record.agency);
  });

  kindInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) return;
      showErrors({});
      setState({ kind: input.value === 'payment' ? 'payment' : 'invoice' });
    });
  });

  filterSelect.addEventListener('change', () => setState({ filter: filterSelect.value === '' ? null : filterSelect.value }));
  sortSelect.addEventListener('change', () => {
    const value = sortSelect.value;
    setState({ order: value === 'oldest' || value === 'largest' ? value : 'newest' });
  });

  required<HTMLButtonElement>(root, '[data-export]').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([toCsv(state.ledger, locale)], { type: 'text/csv;charset=utf-8' }));
    const link = el('a');
    link.href = url;
    link.download = strings.csvFileName;
    link.click();
    // Adres hemen iptal edilirse bazı tarayıcılar indirmeyi başlatamadan keser.
    window.setTimeout(() => URL.revokeObjectURL(url), BLOB_URL_LIFETIME_MS);
  });

  required<HTMLButtonElement>(root, '[data-reset]').addEventListener('click', () => {
    if (!window.confirm(strings.resetConfirm)) return;
    clearLedger(store);
    showErrors({});
    form.reset();
    inputs.date.value = today();
    status.textContent = strings.resetDone;
    setState({ ledger: SEED, kind: 'invoice', filter: null, order: 'newest', touched: null });
    sortSelect.value = 'newest';
  });

  inputs.date.value = today();
  memoryNote.hidden = store !== null;
  render();
  root.setAttribute('data-ready', '');
}
