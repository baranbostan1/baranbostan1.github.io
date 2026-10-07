// İmleç etkileşimleri (yalnızca ince imleçli geniş ekranlarda): imleci izleyen ışık,
// imlece doğru hafifçe çekilen butonlar, imlece göre hafifçe eğilen proje görüntüleri.
const LIGHT_EASE = 0.12;
const MAGNET_MAX_PX = 6;
const TILT_MAX_DEG = 3;

function followLight(): void {
  const light = document.createElement('div');
  light.className = 'cursor-light';
  light.setAttribute('aria-hidden', 'true');
  document.body.append(light);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let x = targetX;
  let y = targetY;
  let frame = 0;

  const tick = (): void => {
    x += (targetX - x) * LIGHT_EASE;
    y += (targetY - y) * LIGHT_EASE;
    light.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    const settled = Math.abs(targetX - x) < 0.5 && Math.abs(targetY - y) < 0.5;
    frame = settled ? 0 : requestAnimationFrame(tick);
  };

  window.addEventListener(
    'pointermove',
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      light.setAttribute('data-active', '');
      if (frame === 0) frame = requestAnimationFrame(tick);
    },
    { passive: true },
  );
  document.documentElement.addEventListener('pointerleave', () => light.removeAttribute('data-active'));
}

// İmlecin öğenin merkezine göre konumu, -1…1 aralığında.
function relativePosition(event: PointerEvent, element: HTMLElement): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
    y: ((event.clientY - rect.top) / rect.height) * 2 - 1,
  };
}

function magnetize(element: HTMLElement): void {
  element.addEventListener('pointermove', (event) => {
    const { x, y } = relativePosition(event, element);
    element.style.transform = `translate(${x * MAGNET_MAX_PX}px, ${y * MAGNET_MAX_PX}px)`;
  });
  element.addEventListener('pointerleave', () => {
    element.style.transform = '';
  });
}

function tilt(element: HTMLElement): void {
  element.addEventListener('pointermove', (event) => {
    const { x, y } = relativePosition(event, element);
    element.style.transform = `perspective(1200px) rotateX(${-y * TILT_MAX_DEG}deg) rotateY(${x * TILT_MAX_DEG}deg)`;
  });
  element.addEventListener('pointerleave', () => {
    element.style.transform = '';
  });
}

export function initPointerEffects(): void {
  followLight();
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(magnetize);
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach(tilt);
}
