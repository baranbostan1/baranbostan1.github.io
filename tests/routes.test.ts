import { describe, expect, it } from 'vitest';
import { alternateFor, demoPageFor, pathFor, type PageId } from '../src/i18n/routes';
import type { Locale } from '../src/i18n/locales';

const EXPECTED: ReadonlyArray<[PageId, Locale, string]> = [
  ['home', 'tr', '/'],
  ['home', 'en', '/en/'],
  ['qr-menu', 'tr', '/projeler/qr-menu/'],
  ['qr-menu', 'en', '/en/projects/qr-menu/'],
  ['lobby', 'tr', '/projeler/lobi-ekrani/'],
  ['lobby', 'en', '/en/projects/lobby-display/'],
  ['agency', 'tr', '/projeler/acenta-takibi/'],
  ['agency', 'en', '/en/projects/agency-ledger/'],
  ['cv', 'tr', '/cv/'],
  ['cv', 'en', '/en/cv/'],
  ['demo-qr-menu', 'tr', '/demo/qr-menu/'],
  ['demo-qr-menu', 'en', '/en/demo/qr-menu/'],
  ['demo-lobby', 'tr', '/demo/lobi-ekrani/'],
  ['demo-lobby', 'en', '/en/demo/lobby-display/'],
  ['demo-agency', 'tr', '/demo/acenta-takibi/'],
  ['demo-agency', 'en', '/en/demo/agency-ledger/'],
];

describe('pathFor', () => {
  it.each(EXPECTED)('%s sayfası %s dilinde %s yolundadır', (page, locale, expected) => {
    expect(pathFor(page, locale)).toBe(expected);
  });
});

describe('demoPageFor', () => {
  it('her projenin tam ekran demo sayfasını verir', () => {
    expect(demoPageFor('qr-menu')).toBe('demo-qr-menu');
    expect(demoPageFor('lobby')).toBe('demo-lobby');
    expect(demoPageFor('agency')).toBe('demo-agency');
  });
});

describe('alternateFor', () => {
  it('tam ekran demodan diğer dildeki demoya gider', () => {
    expect(alternateFor('demo-lobby', 'en')).toEqual({ locale: 'tr', path: '/demo/lobi-ekrani/' });
  });

  it('Türkçe proje sayfasından İngilizce karşılığına gider', () => {
    expect(alternateFor('lobby', 'tr')).toEqual({ locale: 'en', path: '/en/projects/lobby-display/' });
  });

  it('İngilizce ana sayfadan Türkçe ana sayfaya gider', () => {
    expect(alternateFor('home', 'en')).toEqual({ locale: 'tr', path: '/' });
  });
});
