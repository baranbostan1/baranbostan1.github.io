// Döviz kuru yanıtının ayrıştırılması. API "1 TRY kaç birim eder" verir; panel "1 birim kaç TRY" gösterir.
export interface Rates {
  usd: number;
  eur: number;
  gbp: number;
}

export const RATE_URLS: readonly string[] = [
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/try.json',
  'https://latest.currency-api.pages.dev/v1/currencies/try.json',
];

const CURRENCIES = ['usd', 'eur', 'gbp'] as const;
// 1 birim yabancı paranın TRY karşılığı için kabul edilen aralık.
const MIN_PLAUSIBLE_RATE = 0.01;
const MAX_PLAUSIBLE_RATE = 100_000;

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const isPositive = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0;

/** Yanıt beklenen biçimde değilse ya da bir kur eksik/geçersizse null döner; ekrana asla NaN gitmez. */
export function parseRates(json: unknown): Rates | null {
  if (!isRecord(json) || !isRecord(json.try)) return null;
  const perLira = json.try;
  if (!CURRENCIES.every((code) => isPositive(perLira[code]))) return null;
  const invert = (code: (typeof CURRENCIES)[number]): number => 1 / (perLira[code] as number);
  const rates = { usd: invert('usd'), eur: invert('eur'), gbp: invert('gbp') };
  // Bozuk bir yanıt saçma bir kur olarak ekrana çıkmasın: akla yatkın aralığın dışı reddedilir.
  const plausible = Object.values(rates).every((rate) => rate >= MIN_PLAUSIBLE_RATE && rate <= MAX_PLAUSIBLE_RATE);
  return plausible ? rates : null;
}
