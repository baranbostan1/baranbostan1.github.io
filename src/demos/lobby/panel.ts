// Lobi paneli demosunun arayüzü: saat, canlı veri, fiyat dönemi, çevrimdışı durumu, ölçekleme, tam ekran.
// Ayrıştırma ve karar mantığı rates.ts, weather.ts, pricing.ts ve fetch-json.ts'tedir.
import type { Locale } from '../../i18n/locales';
import { LOBBY_STRINGS, ROOMS, WEEKEND_DAYS, type LobbyStrings } from './config';
import { fetchJson } from './fetch-json';
import { isWeekendRate } from './pricing';
import { parseRates, RATE_URLS, type Rates } from './rates';
import { parseWeather, roundTemperature, WEATHER_URLS, type Weather } from './weather';

const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;
// Sayfa içi tam ekranda çıkış düğmesi için sahnenin üstünde bırakılan boş şerit.
const EXPANDED_BAR_PX = 48;
const FETCH_TIMEOUT_MS = 8000;
const FETCH_RETRIES = 2;
const REFRESH_MS = 15 * 60 * 1000;
const CLOCK_TICK_MS = 1000;
const TIME_ZONE = 'Europe/Istanbul';
const NUMBER_LOCALES: Record<Locale, string> = { tr: 'tr-TR', en: 'en-GB' };

interface Feed<T> {
  data: T | null;
  /** Son başarılı verinin alındığı an */
  at: Date | null;
  /** Son deneme başarısız mı oldu */
  failed: boolean;
}

interface State {
  weekend: boolean;
  offline: boolean;
  tickerPaused: boolean;
  rates: Feed<Rates>;
  weather: Feed<Weather>;
}

const emptyFeed = <T>(): Feed<T> => ({ data: null, at: null, failed: false });

function required<T extends Element>(root: ParentNode, selector: string): T {
  const node = root.querySelector<T>(selector);
  if (!node) throw new Error(`Lobi demosu: ${selector} bulunamadı`);
  return node;
}

export function initLobbyPanel(root: HTMLElement): void {
  const locale: Locale = root.dataset.locale === 'en' ? 'en' : 'tr';
  const strings: LobbyStrings = LOBBY_STRINGS[locale];
  const numberLocale = NUMBER_LOCALES[locale];
  const timeFormat = new Intl.DateTimeFormat(numberLocale, { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const secondsFormat = new Intl.DateTimeFormat(numberLocale, { timeZone: TIME_ZONE, second: '2-digit' });
  const dateFormat = new Intl.DateTimeFormat(numberLocale, { timeZone: TIME_ZONE, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const rateFormat = new Intl.NumberFormat(numberLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const priceFormat = new Intl.NumberFormat(numberLocale, { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
  const degreeFormat = new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 0 });

  const frame = required<HTMLElement>(root, '[data-frame]');
  const stage = required<HTMLElement>(root, '[data-stage]');
  const clock = required<HTMLElement>(root, '[data-clock]');
  const seconds = required<HTMLElement>(root, '[data-seconds]');
  const dateLine = required<HTMLElement>(root, '[data-date]');
  const rateMode = required<HTMLElement>(root, '[data-rate-mode]');
  const prices = [...root.querySelectorAll<HTMLElement>('[data-price]')];
  const temperature = required<HTMLElement>(root, '[data-temperature]');
  const weatherKind = required<HTMLElement>(root, '[data-weather-kind]');
  const weatherStatus = required<HTMLElement>(root, '[data-weather-status]');
  const rateValues = {
    usd: required<HTMLElement>(root, '[data-rate="usd"]'),
    eur: required<HTMLElement>(root, '[data-rate="eur"]'),
    gbp: required<HTMLElement>(root, '[data-rate="gbp"]'),
  };
  const ratesStatus = required<HTMLElement>(root, '[data-rates-status]');
  const ticker = required<HTMLElement>(root, '[data-ticker]');
  const modeButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-mode]')];
  const offlineButton = required<HTMLButtonElement>(root, '[data-offline]');
  const tickerButton = required<HTMLButtonElement>(root, '[data-ticker-toggle]');
  const fullscreenButton = required<HTMLButtonElement>(root, '[data-fullscreen]');

  let state: State = {
    weekend: isWeekendRate(new Date(), WEEKEND_DAYS),
    offline: false,
    tickerPaused: false,
    rates: emptyFeed(),
    weather: emptyFeed(),
  };

  // Bir veri kaynağının durum satırı: çevrimdışıysa ya da son deneme başarısızsa eldeki verinin saati,
  // hiç veri yoksa "Veri alınamadı", her şey yolundaysa güncelleme saati.
  const statusFor = (feed: Feed<unknown>): { text: string; stale: boolean } => {
    if (feed.data === null || feed.at === null) {
      return feed.failed || state.offline ? { text: strings.unavailable, stale: true } : { text: strings.loading, stale: false };
    }
    const time = timeFormat.format(feed.at);
    const stale = state.offline || feed.failed;
    return { text: (stale ? strings.offlineSince : strings.updatedAt).replace('{time}', time), stale };
  };

  const paintStatus = (node: HTMLElement, feed: Feed<unknown>): void => {
    const { text, stale } = statusFor(feed);
    node.textContent = text;
    node.toggleAttribute('data-stale', stale);
  };

  const render = (): void => {
    rateMode.textContent = state.weekend ? strings.weekendRate : strings.weekdayRate;
    prices.forEach((node, index) => {
      const room = ROOMS[index];
      if (room) node.textContent = priceFormat.format(state.weekend ? room.weekendLira : room.weekdayLira);
    });
    modeButtons.forEach((button) => button.setAttribute('aria-pressed', String((button.dataset.mode === 'weekend') === state.weekend)));

    const weather = state.weather.data;
    temperature.textContent = weather ? `${degreeFormat.format(roundTemperature(weather.temperatureC))}°` : '—';
    weatherKind.textContent = weather ? strings.weather[weather.kind] : '';
    paintStatus(weatherStatus, state.weather);

    const rates = state.rates.data;
    (Object.keys(rateValues) as Array<keyof Rates>).forEach((code) => {
      rateValues[code].textContent = rates ? rateFormat.format(rates[code]) : '—';
    });
    paintStatus(ratesStatus, state.rates);

    offlineButton.setAttribute('aria-pressed', String(state.offline));
    offlineButton.textContent = state.offline ? strings.restoreConnection : strings.cutConnection;
    tickerButton.setAttribute('aria-pressed', String(state.tickerPaused));
    tickerButton.textContent = state.tickerPaused ? strings.playTicker : strings.pauseTicker;
    ticker.toggleAttribute('data-paused', state.tickerPaused);
  };

  const setState = (patch: Partial<State>): void => {
    state = { ...state, ...patch };
    render();
  };

  // Bir kaynağı tazeler. Başarısız olursa eldeki veri korunur ve "başarısız" olarak işaretlenir.
  async function load<T>(urls: readonly string[], parse: (json: unknown) => T | null, current: Feed<T>): Promise<Feed<T>> {
    try {
      const data = parse(await fetchJson(urls, { timeoutMs: FETCH_TIMEOUT_MS, retries: FETCH_RETRIES }));
      if (data === null) throw new Error('beklenmeyen yanıt biçimi');
      return { data, at: new Date(), failed: false };
    } catch (error) {
      console.warn('[lobi] veri alınamadı:', error);
      return { ...current, failed: true };
    }
  }

  const refresh = async (): Promise<void> => {
    if (state.offline) return;
    const [rates, weather] = await Promise.all([load(RATE_URLS, parseRates, state.rates), load(WEATHER_URLS, parseWeather, state.weather)]);
    // İstek sürerken bağlantı "kesildiyse" sonuç yok sayılır.
    if (state.offline) return;
    setState({ rates, weather });
  };

  const tick = (): void => {
    const now = new Date();
    clock.textContent = timeFormat.format(now);
    seconds.textContent = secondsFormat.format(now).padStart(2, '0');
    dateLine.textContent = dateFormat.format(now);
  };

  // 1920×1080 sahne, çerçeveye oranı bozulmadan tek bir ölçekle sığdırılır ve ortalanır
  // (tam ekranda ekran 16:9 değilse kenarlarda boşluk kalır).
  const fit = (): void => {
    const bar = frame.hasAttribute('data-expanded') ? EXPANDED_BAR_PX : 0;
    const available = frame.clientHeight - bar;
    const scale = Math.min(frame.clientWidth / STAGE_WIDTH, available / STAGE_HEIGHT);
    const offsetX = (frame.clientWidth - STAGE_WIDTH * scale) / 2;
    const offsetY = bar + (available - STAGE_HEIGHT * scale) / 2;
    stage.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  };

  modeButtons.forEach((button) => button.addEventListener('click', () => setState({ weekend: button.dataset.mode === 'weekend' })));
  tickerButton.addEventListener('click', () => setState({ tickerPaused: !state.tickerPaused }));
  offlineButton.addEventListener('click', () => {
    const offline = !state.offline;
    setState({ offline });
    if (!offline) void refresh();
  });

  let wakeLock: { release(): Promise<void> } | null = null;
  const requestWakeLock = async (): Promise<void> => {
    const api = (navigator as Navigator & { wakeLock?: { request(type: 'screen'): Promise<{ release(): Promise<void> }> } }).wakeLock;
    if (!api) return;
    try {
      wakeLock = await api.request('screen');
    } catch {
      // İzin verilmediyse ya da sekme görünür değilse ekran kilidi alınamaz; demo yine çalışır.
      wakeLock = null;
    }
  };

  const releaseWakeLock = (): void => {
    void wakeLock?.release().catch(() => undefined);
    wakeLock = null;
  };

  // Tam ekran API'si olmayan tarayıcılar (iPhone Safari) için: çerçeve sayfanın üstünde ekranı kaplar,
  // dik tutulan telefonda yan çevrilir. Küçük ekranda panel ancak böyle okunur.
  const closeButton = required<HTMLButtonElement>(root, '[data-expand-close]');
  const setExpanded = (expanded: boolean): void => {
    frame.toggleAttribute('data-expanded', expanded);
    document.documentElement.toggleAttribute('data-lobby-expanded', expanded);
    closeButton.hidden = !expanded;
    fit();
    if (expanded) {
      void requestWakeLock();
      closeButton.focus();
      return;
    }
    releaseWakeLock();
    fullscreenButton.focus();
  };
  closeButton.addEventListener('click', () => setExpanded(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && frame.hasAttribute('data-expanded')) setExpanded(false);
  });

  const lockLandscape = (): void => {
    const orientation = screen.orientation as ScreenOrientation & { lock?: (orientation: string) => Promise<void> };
    // Yalnızca bazı mobil tarayıcılar destekler; desteklenmiyorsa ekran olduğu gibi kalır.
    void orientation.lock?.('landscape').catch(() => undefined);
  };

  fullscreenButton.addEventListener('click', () => {
    if (typeof frame.requestFullscreen !== 'function') {
      setExpanded(true);
      return;
    }
    frame
      .requestFullscreen()
      .then(lockLandscape)
      .catch((error) => {
        console.warn('[lobi] tam ekran açılamadı, sayfa içi görünüme geçiliyor:', error);
        setExpanded(true);
      });
  });
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement === frame) void requestWakeLock();
    else releaseWakeLock();
  });

  new ResizeObserver(fit).observe(frame);
  fit();
  tick();
  window.setInterval(tick, CLOCK_TICK_MS);
  window.setInterval(() => void refresh(), REFRESH_MS);
  render();
  void refresh();
  root.setAttribute('data-ready', '');
}
