// Sinematik katmanın girişi. Site bu katman olmadan da eksiksiz okunur;
// buradaki her şey bir geliştirmedir ve hata verirse sayfa sabit kareleriyle kalır.
import { pickMode, WIDE_MIN_WIDTH, type Env, type Mode } from './mode';
import { playOnceInView, scrubWithScroll } from './scenes';

const WORD_STAGGER_MS = 55;
const WORD_DURATION_MS = 800;
const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';

function readEnv(): Env {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: connection?.saveData === true,
    finePointer: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    wide: window.matchMedia(`(min-width: ${WIDE_MIN_WIDTH}px)`).matches,
  };
}

// Başlığı kelime kelime belirtir. Ekran okuyucu tam cümleyi `aria-label`dan okur.
function revealWords(heading: HTMLElement): void {
  const text = heading.textContent?.trim() ?? '';
  if (text === '') return;
  const words = text.split(/\s+/).map((word) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.setAttribute('aria-hidden', 'true');
    span.style.display = 'inline-block';
    return span;
  });
  heading.setAttribute('aria-label', text);
  heading.replaceChildren(...words.flatMap((span, index) => (index === 0 ? [span] : [' ', span])));
  words.forEach((span, index) => {
    span.animate(
      [
        { opacity: 0, transform: 'translateY(0.35em)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: WORD_DURATION_MS, delay: index * WORD_STAGGER_MS, easing: EASE_OUT_EXPO, fill: 'backwards' },
    );
  });
}

async function start(mode: Mode): Promise<void> {
  document.querySelectorAll<HTMLElement>('[data-reveal-words]').forEach(revealWords);

  const videos = [...document.querySelectorAll<HTMLVideoElement>('.scene-media video')];
  const heroTrack = document.querySelector<HTMLElement>('[data-hero-track]');
  const heroVideo = heroTrack?.querySelector<HTMLVideoElement>('.scene-media video') ?? null;
  const scrubHero = mode === 'scrub' && heroTrack !== null && heroVideo !== null;

  playOnceInView(scrubHero ? videos.filter((video) => video !== heroVideo) : videos);
  if (!scrubHero) return;

  scrubWithScroll(heroVideo, heroTrack).catch((error) => {
    console.error('[sinematik]', error);
    heroVideo.closest<HTMLElement>('.scene-media')?.setAttribute('data-failed', '');
  });
  const [{ initSmoothScroll }, { initPointerEffects }] = await Promise.all([import('./smooth-scroll'), import('./pointer')]);
  initPointerEffects();
  await initSmoothScroll();
}

export function initCinematic(): void {
  try {
    const mode = pickMode(readEnv());
    document.documentElement.dataset.cine = mode;
    if (mode === 'static') return;
    start(mode).catch((error) => console.error('[sinematik]', error));
  } catch (error) {
    console.error('[sinematik]', error);
    document.documentElement.dataset.cine = 'static';
  }
}
