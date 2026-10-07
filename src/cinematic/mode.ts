// Sinematik katmanın hangi modda çalışacağına karar verir. Tarayıcıya dokunmaz; test edilebilir saf mantık.
export interface Env {
  reducedMotion: boolean;
  saveData: boolean;
  finePointer: boolean;
  /** Görünüm genişliği ≥ 1024px */
  wide: boolean;
}

/**
 * static: yalnızca sabit kare.
 * play: sahne görünüme girince klip bir kez oynar, son karede kalır.
 * scrub: play + hero videosu kaydırmaya bağlanır, yumuşak kaydırma ve imleç efektleri açılır.
 */
export type Mode = 'static' | 'play' | 'scrub';

export const WIDE_MIN_WIDTH = 1024;

export function pickMode(env: Env): Mode {
  if (env.reducedMotion || env.saveData) return 'static';
  if (!env.wide || !env.finePointer) return 'play';
  return 'scrub';
}
