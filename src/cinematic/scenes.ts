// Sahne videoları: görünüme girince bir kez oynatma ve hero'da kaydırmaya bağlı sarma.
// Her hata yolunda sahne sabit karesiyle kalır; metin hiçbir zaman videoya bağlı değildir.
import { WIDE_MIN_WIDTH } from './mode';

const NEAR_VIEWPORT_MARGIN = '200px';
const PLAY_VISIBLE_RATIO = 0.35;
// Kaydırma hedefine her karede bu oranda yaklaşılır (yumuşatma).
const SCRUB_EASE = 0.14;
// Bu farkın altındaki sarma istekleri atlanır; her istek bir kare çözümü demektir.
const SCRUB_MIN_STEP_SECONDS = 1 / 48;
// Tam sona sarmak bazı tarayıcılarda son kareyi boş gösterir; biraz önünde durulur.
const SCRUB_END_GUARD_SECONDS = 0.05;
// Video bu sürede ilk karesini veremezse sahne sabit karesine döner.
const LOAD_TIMEOUT_MS = 10_000;

const sourceFor = (video: HTMLVideoElement): string | undefined =>
  window.innerWidth >= WIDE_MIN_WIDTH ? video.dataset.srcLg : video.dataset.srcSm;

function markFailed(video: HTMLVideoElement): void {
  video.removeAttribute('data-ready');
  video.closest<HTMLElement>('.scene-media')?.setAttribute('data-failed', '');
}

// Videoyu yükler; ilk kare çözüldüğünde (ya da oynatma başladığında) görünür yapar.
// Yükleme takılırsa (yavaş ya da kopan bağlantı) süre dolunca hata verir; sahne o zaman son karesine döner.
function load(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve, reject) => {
    const source = sourceFor(video);
    if (!source) {
      reject(new Error('video kaynağı tanımlı değil'));
      return;
    }
    const timer = window.setTimeout(() => reject(new Error(`video zamanında yüklenmedi: ${source}`)), LOAD_TIMEOUT_MS);
    const ready = (): void => {
      window.clearTimeout(timer);
      video.setAttribute('data-ready', '');
      resolve();
    };
    // Bazı tarayıcılar (iOS Safari) oynatma istenene kadar `loadeddata` vermez; `playing` de hazır sayılır.
    video.addEventListener('loadeddata', ready, { once: true });
    video.addEventListener('playing', ready, { once: true });
    video.addEventListener(
      'error',
      () => {
        window.clearTimeout(timer);
        reject(new Error(`video yüklenemedi: ${source}`));
      },
      { once: true },
    );
    video.preload = 'auto';
    video.src = source;
    video.load();
  });
}

/** Sahne görünüme girince klibi bir kez oynatır; klip son karesinde kalır. */
export function playOnceInView(videos: readonly HTMLVideoElement[]): void {
  const started = new WeakSet<HTMLVideoElement>();
  const loading = new WeakMap<HTMLVideoElement, Promise<void>>();

  const ensureLoaded = (video: HTMLVideoElement): Promise<void> => {
    const existing = loading.get(video);
    if (existing) return existing;
    const promise = load(video);
    loading.set(video, promise);
    return promise;
  };

  const preloader = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const video = entry.target as HTMLVideoElement;
        preloader.unobserve(video);
        ensureLoaded(video).catch((error) => {
          console.error('[sinematik]', error);
          markFailed(video);
        });
      }
    },
    { rootMargin: NEAR_VIEWPORT_MARGIN },
  );

  const player = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (!entry.isIntersecting) continue;
        if (started.has(video)) {
          // Tarayıcı görünmeyen videoyu duraklatmış olabilir; sahne yarım kalmasın diye görünüme dönünce sürdürülür.
          if (video.paused && !video.ended && video.hasAttribute('data-ready')) video.play().catch(() => undefined);
          continue;
        }
        started.add(video);
        const fail = (error: unknown): void => {
          console.error('[sinematik]', error);
          markFailed(video);
        };
        // Oynatma, yüklemenin bitmesi beklenmeden istenir: iOS Safari veriyi ancak o zaman indirir.
        ensureLoaded(video).catch(fail);
        video.play().catch(fail);
      }
    },
    { threshold: PLAY_VISIBLE_RATIO },
  );

  for (const video of videos) {
    preloader.observe(video);
    player.observe(video);
  }
}

/**
 * Hero videosunu kaydırma ilerlemesine bağlar. `track`, hero'nun sabit kaldığı uzun kapsayıcıdır;
 * ilerleme, kapsayıcının ne kadarının kaydırıldığından hesaplanır.
 */
export async function scrubWithScroll(video: HTMLVideoElement, track: HTMLElement): Promise<void> {
  await load(video);
  video.pause();
  const duration = video.duration;
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('video süresi okunamadı');

  let current = 0;
  let frame = 0;

  const targetTime = (): number => {
    const scrollable = track.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    const progress = Math.min(1, Math.max(0, -track.getBoundingClientRect().top / scrollable));
    return progress * (duration - SCRUB_END_GUARD_SECONDS);
  };

  const tick = (): void => {
    const target = targetTime();
    current += (target - current) * SCRUB_EASE;
    if (Math.abs(target - current) < SCRUB_MIN_STEP_SECONDS) current = target;
    const behind = Math.abs(video.currentTime - current) >= SCRUB_MIN_STEP_SECONDS;
    if (behind && !video.seeking) video.currentTime = current;
    // Döngü, hem yumuşatma hem de videonun kendisi hedefe varana kadar sürer;
    // yoksa yavaş sarmada video son istenen karenin gerisinde kalır.
    const settled = current === target && !behind && !video.seeking;
    frame = settled ? 0 : requestAnimationFrame(tick);
  };

  const wake = (): void => {
    if (frame === 0) frame = requestAnimationFrame(tick);
  };

  window.addEventListener('scroll', wake, { passive: true });
  window.addEventListener('resize', wake, { passive: true });
  wake();
}
