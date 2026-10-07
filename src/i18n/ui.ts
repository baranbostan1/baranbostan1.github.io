import type { UiStrings } from '../content/types';
import type { Locale } from './locales';
import { ui as en } from './ui.en';
import { ui as tr } from './ui.tr';

const UI: Record<Locale, UiStrings> = { tr, en };

export function getUi(locale: Locale): UiStrings {
  return UI[locale];
}
