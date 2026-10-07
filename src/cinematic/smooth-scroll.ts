// Ağırlıklı yumuşak kaydırma (Lenis). Yalnızca `scrub` modunda, ihtiyaç anında yüklenir.
const SCROLL_LERP = 0.11;

export async function initSmoothScroll(): Promise<void> {
  const { default: Lenis } = await import('lenis');
  // Sayfa içi bağlantılar (#icerik, #projeler) Lenis üzerinden de çalışsın.
  new Lenis({ lerp: SCROLL_LERP, autoRaf: true, anchors: true });
}
