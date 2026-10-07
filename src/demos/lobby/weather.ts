// Hava durumu yanıtının ayrıştırılması (Open-Meteo, anlık değerler).
export type WeatherKind = 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm';

export interface Weather {
  temperatureC: number;
  kind: WeatherKind;
}

// Erdek, Balıkesir.
export const WEATHER_URLS: readonly string[] = [
  'https://api.open-meteo.com/v1/forecast?latitude=40.40&longitude=27.79&current=temperature_2m,weather_code&timezone=Europe%2FIstanbul',
];

const MIN_PLAUSIBLE_C = -60;
const MAX_PLAUSIBLE_C = 60;

// WMO hava kodu aralıkları → panelde gösterilen tür. Listede olmayan kodlar "bulutlu" sayılır.
const KIND_RANGES: ReadonlyArray<readonly [min: number, max: number, kind: WeatherKind]> = [
  [0, 1, 'clear'],
  [2, 3, 'cloudy'],
  [45, 48, 'fog'],
  [51, 67, 'rain'],
  [71, 77, 'snow'],
  [80, 82, 'rain'],
  [85, 86, 'snow'],
  [95, 99, 'storm'],
];

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

function kindFor(code: number): WeatherKind {
  return KIND_RANGES.find(([min, max]) => code >= min && code <= max)?.[2] ?? 'cloudy';
}

/** En yakın tam dereceye yuvarlar; sıfırın hemen altı "-0" değil 0 olur. */
export function roundTemperature(celsius: number): number {
  const rounded = Math.round(celsius);
  return rounded === 0 ? 0 : rounded;
}

/** Yanıt beklenen biçimde değilse ya da sıcaklık akla yatkın aralığın dışındaysa null döner. */
export function parseWeather(json: unknown): Weather | null {
  if (!isRecord(json) || !isRecord(json.current)) return null;
  const { temperature_2m: temperature, weather_code: code } = json.current;
  if (!isNumber(temperature) || !isNumber(code)) return null;
  if (temperature < MIN_PLAUSIBLE_C || temperature > MAX_PLAUSIBLE_C) return null;
  return { temperatureC: temperature, kind: kindFor(code) };
}
