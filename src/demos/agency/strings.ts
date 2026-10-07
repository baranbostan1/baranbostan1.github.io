import type { Locale } from '../../i18n/locales';
import type { FieldError } from './ledger';

export interface AgencyStrings {
  fictionalNote: string;
  memoryOnlyNote: string;
  summaryLabel: string;
  totalInvoiced: string;
  totalPaid: string;
  openBalance: string;
  balancesHeading: string;
  colAgency: string;
  colInvoiced: string;
  colPaid: string;
  colBalance: string;
  credit: string;
  settled: string;
  formHeading: string;
  typeLabel: string;
  invoice: string;
  payment: string;
  agencyLabel: string;
  agencyHint: string;
  dateLabel: string;
  invoiceNoLabel: string;
  amountLabel: string;
  amountHint: string;
  submitInvoice: string;
  submitPayment: string;
  errors: Record<FieldError, string>;
  /** {agency} ve {amount} yer tutucuları değişir */
  addedInvoice: string;
  addedPayment: string;
  recordsHeading: string;
  filterLabel: string;
  allAgencies: string;
  sortLabel: string;
  sortNewest: string;
  sortOldest: string;
  sortLargest: string;
  colDate: string;
  colType: string;
  colInvoiceNo: string;
  colAmount: string;
  noRecords: string;
  exportCsv: string;
  csvFileName: string;
  reset: string;
  resetConfirm: string;
  resetDone: string;
}

export const AGENCY_STRINGS: Record<Locale, AgencyStrings> = {
  tr: {
    fictionalNote: 'Bu demodaki tüm veriler uydurmadır.',
    memoryOnlyNote: 'Tarayıcı depolaması kapalı: eklediğiniz kayıtlar bu sekme kapanınca silinir.',
    summaryLabel: 'Genel özet',
    totalInvoiced: 'Toplam fatura',
    totalPaid: 'Toplam ödeme',
    openBalance: 'Açık bakiye',
    balancesHeading: 'Acenta bakiyeleri',
    colAgency: 'Acenta',
    colInvoiced: 'Fatura',
    colPaid: 'Ödeme',
    colBalance: 'Bakiye',
    credit: 'alacaklı',
    settled: 'kapalı',
    formHeading: 'Kayıt ekle',
    typeLabel: 'Kayıt türü',
    invoice: 'Fatura',
    payment: 'Ödeme',
    agencyLabel: 'Acenta',
    agencyHint: 'Listeden seçin ya da yeni bir ad yazın.',
    dateLabel: 'Tarih',
    invoiceNoLabel: 'Fatura no',
    amountLabel: 'Tutar (₺)',
    amountHint: 'Örnek: 1.250,50',
    submitInvoice: 'Faturayı ekle',
    submitPayment: 'Ödemeyi ekle',
    errors: {
      agencyRequired: 'Acenta adını yazın.',
      agencyTooLong: 'Acenta adı en çok 60 karakter olabilir.',
      dateInvalid: 'Geçerli bir tarih seçin.',
      amountInvalid: 'Sıfırdan büyük bir tutar yazın. Örnek: 1.250,50',
      invoiceNoRequired: 'Fatura numarasını yazın.',
    },
    addedInvoice: 'Fatura eklendi: {agency}, {amount}.',
    addedPayment: 'Ödeme eklendi: {agency}, {amount}.',
    recordsHeading: 'Kayıtlar',
    filterLabel: 'Acentaya göre filtrele',
    allAgencies: 'Tüm acentalar',
    sortLabel: 'Sırala',
    sortNewest: 'Tarih: yeniden eskiye',
    sortOldest: 'Tarih: eskiden yeniye',
    sortLargest: 'Tutar: büyükten küçüğe',
    colDate: 'Tarih',
    colType: 'Tür',
    colInvoiceNo: 'Fatura no',
    colAmount: 'Tutar',
    noRecords: 'Bu acentaya ait kayıt yok.',
    exportCsv: 'CSV indir',
    csvFileName: 'acenta-kayitlari-demo.csv',
    reset: 'Demo’yu sıfırla',
    resetConfirm: 'Eklediğiniz kayıtlar silinecek ve demo başlangıç verisine dönecek. Devam edilsin mi?',
    resetDone: 'Demo başlangıç verisine döndü.',
  },
  en: {
    fictionalNote: 'All data in this demo is made up.',
    memoryOnlyNote: 'Browser storage is off: records you add are lost when this tab closes.',
    summaryLabel: 'Summary',
    totalInvoiced: 'Total invoiced',
    totalPaid: 'Total paid',
    openBalance: 'Open balance',
    balancesHeading: 'Agency balances',
    colAgency: 'Agency',
    colInvoiced: 'Invoiced',
    colPaid: 'Paid',
    colBalance: 'Balance',
    credit: 'in credit',
    settled: 'settled',
    formHeading: 'Add a record',
    typeLabel: 'Record type',
    invoice: 'Invoice',
    payment: 'Payment',
    agencyLabel: 'Agency',
    agencyHint: 'Pick from the list or type a new name.',
    dateLabel: 'Date',
    invoiceNoLabel: 'Invoice no.',
    amountLabel: 'Amount (₺)',
    amountHint: 'Example: 1,250.50',
    submitInvoice: 'Add invoice',
    submitPayment: 'Add payment',
    errors: {
      agencyRequired: 'Enter the agency name.',
      agencyTooLong: 'Agency name can be at most 60 characters.',
      dateInvalid: 'Pick a valid date.',
      amountInvalid: 'Enter an amount greater than zero. Example: 1,250.50',
      invoiceNoRequired: 'Enter the invoice number.',
    },
    addedInvoice: 'Invoice added: {agency}, {amount}.',
    addedPayment: 'Payment added: {agency}, {amount}.',
    recordsHeading: 'Records',
    filterLabel: 'Filter by agency',
    allAgencies: 'All agencies',
    sortLabel: 'Sort',
    sortNewest: 'Date: newest first',
    sortOldest: 'Date: oldest first',
    sortLargest: 'Amount: largest first',
    colDate: 'Date',
    colType: 'Type',
    colInvoiceNo: 'Invoice no.',
    colAmount: 'Amount',
    noRecords: 'No records for this agency.',
    exportCsv: 'Download CSV',
    csvFileName: 'agency-records-demo.csv',
    reset: 'Reset demo',
    resetConfirm: 'The records you added will be deleted and the demo will return to its starting data. Continue?',
    resetDone: 'The demo is back to its starting data.',
  },
};
