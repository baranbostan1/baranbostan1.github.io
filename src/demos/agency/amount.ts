// Tutar ayrıştırma ve biçimlendirme. Tüm tutarlar kuruş cinsinden tam sayıdır; kayan nokta kullanılmaz.
import type { Locale } from '../../i18n/locales';

/** Kabul edilen en büyük tutar: 999.999.999,99 ₺ */
export const MAX_AMOUNT_KURUS = 99_999_999_999;

const KURUS_PER_LIRA = 100;
const GROUP_SIZE = 3;
const ALLOWED = /^\d[\d.,]*$/;
const DIGITS_ONLY = /^\d+$/;

// Binlik gruplar: ilki 1–3 hane, sonrakiler tam 3 hane.
function isGrouped(groups: readonly string[]): boolean {
  const [first, ...rest] = groups;
  if (first === undefined || first.length === 0 || first.length > GROUP_SIZE) return false;
  return rest.every((group) => group.length === GROUP_SIZE);
}

// Girdiyi tam kısım ve (varsa) ondalık kısım olarak ayırır; biçim belirsiz ya da hatalıysa null.
function splitParts(text: string): { whole: string; fraction: string } | null {
  const separators = [...text].filter((char) => char === '.' || char === ',');
  if (separators.length === 0) return { whole: text, fraction: '' };

  const last = separators[separators.length - 1]!;
  const cut = text.lastIndexOf(last);
  const head = text.slice(0, cut);
  const tail = text.slice(cut + 1);
  const other = last === '.' ? ',' : '.';
  const lastIsUnique = separators.filter((char) => char === last).length === 1;

  // Son ayırıcıdan sonra 1–2 hane varsa ondalıktır; öncesi yalnızca diğer ayırıcıyla gruplanmış olabilir.
  if (lastIsUnique && (tail.length === 1 || tail.length === 2)) {
    const groups = head.split(other);
    const plain = groups.length === 1 && DIGITS_ONLY.test(head);
    return plain || isGrouped(groups) ? { whole: groups.join(''), fraction: tail } : null;
  }

  // Aksi halde tüm ayırıcılar aynı olmalı ve binlikleri ayırmalı ("1.250", "1.234.567").
  if (text.includes(other)) return null;
  const groups = text.split(last);
  return isGrouped(groups) ? { whole: groups.join(''), fraction: '' } : null;
}

/**
 * "1.250,50", "1250.5", "1.250" gibi yazımları kuruşa çevirir.
 * Geçersiz, sıfır, eksi ya da üst sınırı aşan tutarlar için null döner.
 */
export function parseAmountToKurus(input: string): number | null {
  const text = input.trim();
  if (!ALLOWED.test(text)) return null;
  const parts = splitParts(text);
  if (parts === null || !DIGITS_ONLY.test(parts.whole)) return null;
  // Başta fazladan sıfır ("007", "0.500") neredeyse her zaman yazım hatasıdır; sessizce yorumlanmaz.
  if (parts.whole.length > 1 && parts.whole.startsWith('0')) return null;
  const kurus = Number(parts.whole) * KURUS_PER_LIRA + Number(parts.fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(kurus) || kurus <= 0 || kurus > MAX_AMOUNT_KURUS) return null;
  return kurus;
}

const SEPARATORS: Record<Locale, { group: string; decimal: string }> = {
  tr: { group: '.', decimal: ',' },
  en: { group: ',', decimal: '.' },
};

/** Kuruşu para olarak yazar: tr "1.250,50 ₺", en "₺1,250.50". */
export function formatKurus(kurus: number, locale: Locale): string {
  const { group, decimal } = SEPARATORS[locale];
  const absolute = Math.abs(kurus);
  const whole = String(Math.floor(absolute / KURUS_PER_LIRA)).replace(/\B(?=(\d{3})+(?!\d))/g, group);
  const fraction = String(absolute % KURUS_PER_LIRA).padStart(2, '0');
  const sign = kurus < 0 ? '-' : '';
  const number = `${whole}${decimal}${fraction}`;
  return locale === 'tr' ? `${sign}${number} ₺` : `${sign}₺${number}`;
}
