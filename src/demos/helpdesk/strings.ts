// Destek talepleri demosunun iki dildeki arayüz metinleri.
import type { Locale } from '../../i18n/locales';
import type { DraftError, TicketAction, TicketCategory, TicketPriority, TicketStatus } from './tickets';

export interface HelpdeskStrings {
  fictionalNote: string;
  memoryOnlyNote: string;
  tryHeading: string;
  trySteps: readonly [string, string, string];
  summaryLabel: string;
  summaryOpen: string;
  summaryUrgent: string;
  summaryOverdue: string;
  summaryLongest: string;
  /** Açık talep kalmadığında "en uzun bekleyen" yerine yazılır */
  none: string;
  formHeading: string;
  titleLabel: string;
  titleHint: string;
  categoryLabel: string;
  priorityLabel: string;
  requesterLabel: string;
  submit: string;
  errors: Record<DraftError, string>;
  boardHeading: string;
  statuses: Record<TicketStatus, string>;
  categories: Record<TicketCategory, string>;
  priorities: Record<TicketPriority, string>;
  actions: Record<TicketAction, string>;
  emptyColumn: string;
  requesterPrefix: string;
  assigneeLabel: string;
  unassigned: string;
  openFor: string;
  resolvedIn: string;
  overdue: string;
  assignFirst: string;
  movedTo: string;
  assignedTo: string;
  assignmentRemoved: string;
  opened: string;
  reset: string;
  resetConfirm: string;
  resetDone: string;
}

export const HELPDESK_STRINGS: Record<Locale, HelpdeskStrings> = {
  tr: {
    fictionalNote: 'Bu demodaki kişiler ve talepler uydurmadır. Değişiklikler yalnızca bu tarayıcıda saklanır.',
    memoryOnlyNote: 'Tarayıcı depolaması kapalı: değişiklikler sayfa yenilenince kaybolur.',
    tryHeading: 'Deneyin',
    trySteps: [
      'Atanmamış bir talebi önce birine atayın, sonra işleme alın.',
      'Bir talebi çözün; “Açık talep” sayısının düştüğünü görün.',
      'Acil öncelikli yeni bir talep açın; normal ve düşük önceliklilerin üstüne yerleşir.',
    ],
    summaryLabel: 'Pano özeti',
    summaryOpen: 'Açık talep',
    summaryUrgent: 'Acil',
    summaryOverdue: 'Hedefi aşan',
    summaryLongest: 'En uzun bekleyen',
    none: '—',
    formHeading: 'Yeni talep',
    titleLabel: 'Sorun ya da istek',
    titleHint: '3–80 karakter. Örnek: “Yazıcı çıktı vermiyor”.',
    categoryLabel: 'Kategori',
    priorityLabel: 'Öncelik',
    requesterLabel: 'Talep eden',
    submit: 'Talebi aç',
    errors: {
      titleLength: 'Başlık 3 ile 80 karakter arasında olmalı.',
      categoryInvalid: 'Listeden bir kategori seçin.',
      priorityInvalid: 'Listeden bir öncelik seçin.',
      requesterLength: 'Talep edenin adı 2 ile 40 karakter arasında olmalı.',
    },
    boardHeading: 'Talep panosu',
    statuses: { new: 'Yeni', inProgress: 'İşlemde', waiting: 'Kullanıcı bekleniyor', resolved: 'Çözüldü' },
    categories: { hardware: 'Donanım', software: 'Yazılım', account: 'Hesap ve şifre', network: 'Ağ' },
    priorities: { low: 'Düşük', normal: 'Normal', urgent: 'Acil' },
    actions: { start: 'İşleme al', wait: 'Kullanıcıyı bekle', resume: 'Devam et', resolve: 'Çöz', reopen: 'Yeniden aç' },
    emptyColumn: 'Bu durumda talep yok',
    requesterPrefix: 'Talep eden',
    assigneeLabel: 'Atanan',
    unassigned: 'Atanmamış',
    openFor: 'Açık',
    resolvedIn: 'Çözüm süresi',
    overdue: 'Hedefi aştı',
    assignFirst: 'Önce talebi birine atayın.',
    movedTo: 'Talep “{status}” durumuna alındı: {title}',
    assignedTo: 'Talep {name} adlı kişiye atandı: {title}',
    assignmentRemoved: 'Talebin ataması kaldırıldı: {title}',
    opened: 'Talep açıldı: {title}',
    reset: 'Demo’yu sıfırla',
    resetConfirm: 'Demo başlangıç taleplerine dönsün mü? Yaptığınız değişiklikler silinir.',
    resetDone: 'Demo sıfırlandı.',
  },
  en: {
    fictionalNote: 'The people and tickets in this demo are made up. Changes are stored only in this browser.',
    memoryOnlyNote: 'Browser storage is off: changes are lost when the page reloads.',
    tryHeading: 'Try it',
    trySteps: [
      'Assign an unassigned ticket to someone, then start it.',
      'Resolve a ticket and watch “Open tickets” go down.',
      'Open a new urgent ticket; it lands above the normal and low ones.',
    ],
    summaryLabel: 'Board summary',
    summaryOpen: 'Open tickets',
    summaryUrgent: 'Urgent',
    summaryOverdue: 'Past target',
    summaryLongest: 'Longest open',
    none: '—',
    formHeading: 'New ticket',
    titleLabel: 'Problem or request',
    titleHint: '3–80 characters. Example: “Printer will not print”.',
    categoryLabel: 'Category',
    priorityLabel: 'Priority',
    requesterLabel: 'Requested by',
    submit: 'Open ticket',
    errors: {
      titleLength: 'The title must be between 3 and 80 characters.',
      categoryInvalid: 'Choose a category from the list.',
      priorityInvalid: 'Choose a priority from the list.',
      requesterLength: 'The requester’s name must be between 2 and 40 characters.',
    },
    boardHeading: 'Ticket board',
    statuses: { new: 'New', inProgress: 'In progress', waiting: 'Waiting on user', resolved: 'Resolved' },
    categories: { hardware: 'Hardware', software: 'Software', account: 'Account and password', network: 'Network' },
    priorities: { low: 'Low', normal: 'Normal', urgent: 'Urgent' },
    actions: { start: 'Start', wait: 'Wait on user', resume: 'Resume', resolve: 'Resolve', reopen: 'Reopen' },
    emptyColumn: 'No tickets in this state',
    requesterPrefix: 'Requested by',
    assigneeLabel: 'Assigned to',
    unassigned: 'Unassigned',
    openFor: 'Open for',
    resolvedIn: 'Resolved in',
    overdue: 'Past target',
    assignFirst: 'Assign the ticket to someone first.',
    movedTo: 'Ticket moved to “{status}”: {title}',
    assignedTo: 'Ticket assigned to {name}: {title}',
    assignmentRemoved: 'Ticket unassigned: {title}',
    opened: 'Ticket opened: {title}',
    reset: 'Reset demo',
    resetConfirm: 'Return the demo to its starting tickets? Your changes will be removed.',
    resetDone: 'Demo reset.',
  },
};
