// Lobi paneli demosunun ayar dosyası. Gerçek araçta da metinler, fiyatlar ve duyurular
// böyle ayrı bir dosyada durur; kod bilmeyen biri yalnızca burayı düzenler.
// Buradaki otel kurgusaldır; fiyatlar, saatler ve duyurular uydurmadır.
import type { Locale } from '../../i18n/locales';
import type { WeatherKind } from './weather';

type Text = Record<Locale, string>;

export const HOTEL_NAME = 'Otel Defne Koyu';

/** Hafta sonu fiyatının uygulandığı günler: 0 = Pazar … 6 = Cumartesi. */
export const WEEKEND_DAYS: readonly number[] = [5, 6];

export interface Room {
  name: Text;
  weekdayLira: number;
  weekendLira: number;
}

export const ROOMS: readonly Room[] = [
  { name: { tr: 'Standart Oda', en: 'Standard Room' }, weekdayLira: 3200, weekendLira: 3800 },
  { name: { tr: 'Deniz Manzaralı Oda', en: 'Sea View Room' }, weekdayLira: 4100, weekendLira: 4900 },
  { name: { tr: 'Aile Odası', en: 'Family Room' }, weekdayLira: 5400, weekendLira: 6300 },
];

export const HOURS: ReadonlyArray<{ label: Text; value: Text }> = [
  { label: { tr: 'Kahvaltı', en: 'Breakfast' }, value: { tr: '08:00 – 10:30', en: '08:00 – 10:30' } },
  { label: { tr: 'Odaya giriş', en: 'Check-in' }, value: { tr: '14:00', en: '14:00' } },
  { label: { tr: 'Odadan çıkış', en: 'Check-out' }, value: { tr: '12:00', en: '12:00' } },
  { label: { tr: 'Resepsiyon', en: 'Reception' }, value: { tr: '24 saat', en: '24 hours' } },
];

export const ANNOUNCEMENTS: readonly Text[] = [
  { tr: 'Kablosuz ağ şifresi için resepsiyona danışabilirsiniz.', en: 'Ask reception for the Wi-Fi password.' },
  { tr: 'Plaj havluları resepsiyondan alınabilir.', en: 'Beach towels are available at reception.' },
  { tr: 'Geç çıkış talepleri için lütfen bir gün önceden haber verin.', en: 'Please request late check-out one day in advance.' },
  { tr: 'Akşam yemeği servisi 19:00’da başlar.', en: 'Dinner service starts at 19:00.' },
];

export interface LobbyStrings {
  fictionalNote: string;
  roomsHeading: string;
  roomsNote: string;
  weekdayRate: string;
  weekendRate: string;
  hoursHeading: string;
  weatherHeading: string;
  weatherPlace: string;
  ratesHeading: string;
  loading: string;
  unavailable: string;
  /** {time} yer tutucusu son başarılı veri saatiyle değişir */
  offlineSince: string;
  updatedAt: string;
  announcementsLabel: string;
  controlsLabel: string;
  rateModeLabel: string;
  weekday: string;
  weekend: string;
  cutConnection: string;
  restoreConnection: string;
  pauseTicker: string;
  playTicker: string;
  fullscreen: string;
  closeFullscreen: string;
  smallScreenHint: string;
  weather: Record<WeatherKind, string>;
  tryHeading: string;
  tryItems: readonly string[];
}

export const LOBBY_STRINGS: Record<Locale, LobbyStrings> = {
  tr: {
    fictionalNote: 'Kurgusal otel · fiyatlar, saatler ve duyurular uydurmadır. Saat, döviz kuru ve hava durumu canlıdır.',
    roomsHeading: 'Oda fiyatları',
    roomsNote: 'Gecelik, iki kişi, kahvaltı dahil',
    weekdayRate: 'Hafta içi fiyatı',
    weekendRate: 'Hafta sonu fiyatı',
    hoursHeading: 'Saatler',
    weatherHeading: 'Hava',
    weatherPlace: 'Erdek',
    ratesHeading: 'Döviz',
    loading: 'Yükleniyor',
    unavailable: 'Veri alınamadı',
    offlineSince: 'Çevrimdışı · {time}',
    updatedAt: 'Güncellendi · {time}',
    announcementsLabel: 'Duyurular',
    controlsLabel: 'Panel denetimleri',
    rateModeLabel: 'Fiyat dönemi',
    weekday: 'Hafta içi',
    weekend: 'Hafta sonu',
    cutConnection: 'Bağlantıyı kes',
    restoreConnection: 'Bağlantıyı geri aç',
    pauseTicker: 'Duyuru bandını durdur',
    playTicker: 'Duyuru bandını oynat',
    fullscreen: 'Tam ekran',
    closeFullscreen: 'Tam ekrandan çık',
    smallScreenHint: 'Panel bir TV için tasarlandı; küçük ekranda “Tam ekran” ile yatay görüntüleyin.',
    weather: { clear: 'Açık', cloudy: 'Bulutlu', fog: 'Sisli', rain: 'Yağmurlu', snow: 'Karlı', storm: 'Fırtınalı' },
    tryHeading: 'Deneyin',
    tryItems: [
      'Hafta içi ve Hafta sonu arasında geçin: oda fiyatları değişir. Gerçek panelde bu, güne göre kendiliğinden olur.',
      '“Bağlantıyı kes”e basın: panel son aldığı veriyi “Çevrimdışı” etiketiyle göstermeye devam eder. Geri açınca veri tazelenir.',
      '“Tam ekran”a basın: 1920×1080 sahne ekranınıza orantılı sığar, tıpkı farklı TV’lerde olduğu gibi.',
    ],
  },
  en: {
    fictionalNote: 'Fictional hotel · prices, hours and announcements are made up. The clock, exchange rates and weather are live.',
    roomsHeading: 'Room rates',
    roomsNote: 'Per night, two guests, breakfast included',
    weekdayRate: 'Weekday rate',
    weekendRate: 'Weekend rate',
    hoursHeading: 'Hours',
    weatherHeading: 'Weather',
    weatherPlace: 'Erdek',
    ratesHeading: 'Exchange',
    loading: 'Loading',
    unavailable: 'Data unavailable',
    offlineSince: 'Offline · {time}',
    updatedAt: 'Updated · {time}',
    announcementsLabel: 'Announcements',
    controlsLabel: 'Panel controls',
    rateModeLabel: 'Rate period',
    weekday: 'Weekday',
    weekend: 'Weekend',
    cutConnection: 'Cut the connection',
    restoreConnection: 'Restore the connection',
    pauseTicker: 'Pause the announcement ticker',
    playTicker: 'Play the announcement ticker',
    fullscreen: 'Full screen',
    closeFullscreen: 'Exit full screen',
    smallScreenHint: 'The panel is designed for a TV; on a small screen, use “Full screen” and view it in landscape.',
    weather: { clear: 'Clear', cloudy: 'Cloudy', fog: 'Foggy', rain: 'Rainy', snow: 'Snowy', storm: 'Stormy' },
    tryHeading: 'Try it',
    tryItems: [
      'Switch between Weekday and Weekend: the room rates change. On the real panel this happens on its own, by the day.',
      'Press “Cut the connection”: the panel keeps showing the last data it received, labelled “Offline”. Restore it and the data refreshes.',
      'Press “Full screen”: the 1920×1080 stage scales to fit your display, just as it does on different TVs.',
    ],
  },
};
