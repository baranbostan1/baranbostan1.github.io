import { describe, expect, it } from 'vitest';
import { pickMode, type Env } from '../src/cinematic/mode';

const base: Env = { reducedMotion: false, saveData: false, finePointer: true, wide: true };

describe('pickMode', () => {
  it('geniş ekran ve ince imleçte kaydırmaya bağlı videoyu seçer', () => {
    expect(pickMode(base)).toBe('scrub');
  });

  it('hareket azaltma açıkken sabit karede kalır', () => {
    expect(pickMode({ ...base, reducedMotion: true })).toBe('static');
  });

  it('veri tasarrufu açıkken sabit karede kalır', () => {
    expect(pickMode({ ...base, saveData: true })).toBe('static');
  });

  it('dar ekranda görünümde oynatmayı seçer', () => {
    expect(pickMode({ ...base, wide: false })).toBe('play');
  });

  it('dokunmatik cihazda görünümde oynatmayı seçer', () => {
    expect(pickMode({ ...base, finePointer: false })).toBe('play');
  });

  it('hareket azaltma, dar ekrandan önce gelir', () => {
    expect(pickMode({ ...base, reducedMotion: true, wide: false, finePointer: false })).toBe('static');
  });
});
