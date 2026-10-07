import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchJson } from '../src/demos/lobby/fetch-json';
import { isWeekendRate } from '../src/demos/lobby/pricing';
import { parseRates } from '../src/demos/lobby/rates';
import { parseWeather, roundTemperature } from '../src/demos/lobby/weather';
import ratesFixture from './fixtures/rates-try.json';
import weatherFixture from './fixtures/weather-current.json';

describe('parseRates', () => {
  it('1 TRY karşılığını "1 birim kaç TRY" değerine çevirir', () => {
    expect(parseRates({ date: '2026-10-07', try: { usd: 0.025, eur: 0.02, gbp: 0.0125 } })).toEqual({ usd: 40, eur: 50, gbp: 80 });
  });

  it('gerçek API yanıtını ayrıştırır', () => {
    const rates = parseRates(ratesFixture);
    expect(rates).not.toBeNull();
    expect(rates!.usd).toBeCloseTo(1 / ratesFixture.try.usd, 6);
    expect(rates!.eur).toBeGreaterThan(rates!.usd);
  });

  it.each([
    ['null', null],
    ['boş nesne', {}],
    ['try boş', { try: {} }],
    ['sıfır kur', { try: { usd: 0, eur: 0.02, gbp: 0.01 } }],
    ['metin kur', { try: { usd: 'x', eur: 0.02, gbp: 0.01 } }],
    ['eksi kur', { try: { usd: -1, eur: 0.02, gbp: 0.01 } }],
    ['eksik para birimi', { try: { usd: 0.025, eur: 0.02 } }],
    ['sonsuz', { try: { usd: Infinity, eur: 0.02, gbp: 0.01 } }],
    ['NaN', { try: { usd: NaN, eur: 0.02, gbp: 0.01 } }],
    ['metin', 'metin'],
    ['dizi', []],
    ['try dizi', { try: [1, 2, 3] }],
  ])('%s → null', (_label, value) => {
    expect(parseRates(value)).toBeNull();
  });
});

describe('parseRates: akla yatkınlık sınırı', () => {
  it.each([
    ['aşırı küçük değer (ters çevrilince saçma büyük kur)', { try: { usd: 1e-12, eur: 0.02, gbp: 0.0125 } }],
    ['aşırı büyük değer (ters çevrilince sıfıra yakın kur)', { try: { usd: 0.025, eur: 5000, gbp: 0.0125 } }],
  ])('%s → null', (_label, value) => {
    expect(parseRates(value)).toBeNull();
  });

  it('sınırın içindeki uç değerleri kabul eder', () => {
    expect(parseRates({ try: { usd: 1, eur: 0.001, gbp: 0.0125 } })).toEqual({ usd: 1, eur: 1000, gbp: 80 });
  });
});

describe('roundTemperature', () => {
  it('en yakın tam dereceye yuvarlar', () => {
    expect(roundTemperature(17.6)).toBe(18);
    expect(roundTemperature(-3.6)).toBe(-4);
  });

  it('sıfırın hemen altını eksi sıfır değil, sıfır yapar', () => {
    expect(Object.is(roundTemperature(-0.4), 0)).toBe(true);
    expect(Object.is(roundTemperature(-0.5), 0)).toBe(true);
    expect(new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(roundTemperature(-0.4))).toBe('0');
  });
});

describe('parseWeather', () => {
  it('sıcaklığı ve hava türünü okur', () => {
    expect(parseWeather({ current: { temperature_2m: 18.4, weather_code: 0 } })).toEqual({ temperatureC: 18.4, kind: 'clear' });
  });

  it('gerçek API yanıtını ayrıştırır', () => {
    expect(parseWeather(weatherFixture)).toEqual({ temperatureC: weatherFixture.current.temperature_2m, kind: 'clear' });
  });

  it.each([
    [0, 'clear'],
    [1, 'clear'],
    [2, 'cloudy'],
    [3, 'cloudy'],
    [45, 'fog'],
    [48, 'fog'],
    [51, 'rain'],
    [61, 'rain'],
    [67, 'rain'],
    [80, 'rain'],
    [82, 'rain'],
    [71, 'snow'],
    [77, 'snow'],
    [85, 'snow'],
    [86, 'snow'],
    [95, 'storm'],
    [99, 'storm'],
    [1234, 'cloudy'], // bilinmeyen kod
  ])('WMO %i → %s', (code, kind) => {
    expect(parseWeather({ current: { temperature_2m: 10, weather_code: code } })?.kind).toBe(kind);
  });

  it.each([
    ['null', null],
    ['boş nesne', {}],
    ['current boş', { current: {} }],
    ['metin sıcaklık', { current: { temperature_2m: 'x', weather_code: 0 } }],
    ['aralık dışı sıcaklık', { current: { temperature_2m: 999, weather_code: 0 } }],
    ['çok düşük sıcaklık', { current: { temperature_2m: -80, weather_code: 0 } }],
    ['kod eksik', { current: { temperature_2m: 10 } }],
    ['NaN', { current: { temperature_2m: NaN, weather_code: 0 } }],
  ])('%s → null', (_label, value) => {
    expect(parseWeather(value)).toBeNull();
  });
});

describe('isWeekendRate', () => {
  const FRIDAY_AND_SATURDAY = [5, 6];

  it('Cuma hafta sonu fiyatıdır', () => {
    expect(isWeekendRate(new Date('2026-10-09T12:00:00+03:00'), FRIDAY_AND_SATURDAY)).toBe(true);
  });

  it('Cumartesi gece geç saat hafta sonu fiyatıdır', () => {
    expect(isWeekendRate(new Date('2026-10-10T23:30:00+03:00'), FRIDAY_AND_SATURDAY)).toBe(true);
  });

  it('Pazar hafta içi fiyatıdır', () => {
    expect(isWeekendRate(new Date('2026-10-11T12:00:00+03:00'), FRIDAY_AND_SATURDAY)).toBe(false);
  });

  it('günü İstanbul saatine göre belirler (UTC Cumartesi 21:30 = İstanbul Pazar 00:30)', () => {
    expect(isWeekendRate(new Date('2026-10-10T21:30:00Z'), FRIDAY_AND_SATURDAY)).toBe(false);
  });

  it('günü İstanbul saatine göre belirler (UTC Perşembe 21:30 = İstanbul Cuma 00:30)', () => {
    expect(isWeekendRate(new Date('2026-10-08T21:30:00Z'), FRIDAY_AND_SATURDAY)).toBe(true);
  });

  it('gün listesi ayardan gelir', () => {
    expect(isWeekendRate(new Date('2026-10-11T12:00:00+03:00'), [0, 6])).toBe(true);
    expect(isWeekendRate(new Date('2026-10-09T12:00:00+03:00'), [0, 6])).toBe(false);
  });
});

describe('fetchJson', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const ok = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
  const fail = (status: number) => Promise.resolve(new Response('hata', { status }));
  const options = { timeoutMs: 1000, retries: 0 };

  it('ilk adres yanıt verirse onu döndürür', async () => {
    const fetcher = vi.fn(() => ok({ a: 1 }));
    await expect(fetchJson(['https://bir.example'], { ...options, fetcher })).resolves.toEqual({ a: 1 });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('ilk adres 500 dönerse ikinciyi dener', async () => {
    const fetcher = vi.fn((url: string) => (url.includes('bir') ? fail(500) : ok({ b: 2 })));
    await expect(fetchJson(['https://bir.example', 'https://iki.example'], { ...options, fetcher })).resolves.toEqual({ b: 2 });
  });

  it('ağ hatasında ikinci adrese geçer', async () => {
    const fetcher = vi.fn((url: string) => (url.includes('bir') ? Promise.reject(new TypeError('ağ yok')) : ok({ c: 3 })));
    await expect(fetchJson(['https://bir.example', 'https://iki.example'], { ...options, fetcher })).resolves.toEqual({ c: 3 });
  });

  it('bütün adresler başarısızsa fırlatır', async () => {
    const fetcher = vi.fn(() => fail(503));
    await expect(fetchJson(['https://bir.example', 'https://iki.example'], { ...options, fetcher })).rejects.toThrow();
  });

  it('yeniden deneme sayısı kadar tur atar', async () => {
    const fetcher = vi.fn(() => fail(503));
    await expect(fetchJson(['https://bir.example', 'https://iki.example'], { timeoutMs: 1000, retries: 2, fetcher })).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(6);
  });

  it('ikinci turda başarılı olursa sonucu döndürür', async () => {
    let calls = 0;
    const fetcher = vi.fn(() => (++calls < 2 ? fail(500) : ok({ d: 4 })));
    await expect(fetchJson(['https://bir.example'], { timeoutMs: 1000, retries: 1, fetcher })).resolves.toEqual({ d: 4 });
  });

  it('JSON olmayan yanıtı hata sayar', async () => {
    const fetcher = vi.fn(() => Promise.resolve(new Response('<html>', { status: 200 })));
    await expect(fetchJson(['https://bir.example'], { ...options, fetcher })).rejects.toThrow();
  });

  it('zaman aşımında isteği iptal eder ve fırlatır', async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new DOMException('iptal', 'AbortError')));
        }),
    );
    const pending = fetchJson(['https://yavas.example'], { timeoutMs: 8000, retries: 0, fetcher });
    const assertion = expect(pending).rejects.toThrow();
    await vi.advanceTimersByTimeAsync(8000);
    await assertion;
    expect(fetcher.mock.calls[0]?.[1]?.signal?.aborted).toBe(true);
  });

  it('adres listesi boşsa fırlatır', async () => {
    await expect(fetchJson([], options)).rejects.toThrow();
  });
});
