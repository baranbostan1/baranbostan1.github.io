import { describe, expect, it } from 'vitest';
// @ts-expect-error — düz .mjs betiği, tip bildirimi yok
import { sceneProblems } from '../scripts/check-build.mjs';

const scene = (name: string) => `<div class="scene-media" data-scene="${name}"><img src="/media/${name}-poster.webp"><video data-src-lg="/media/${name}-lg.mp4"></video></div>`;
const SCENES = ['hero', 'qr-menu', 'lobby', 'agency', 'closing'];

describe('sceneProblems', () => {
  it('beş sahnesi de görüntüsüyle çıkmış sayfada sorun bulmaz', () => {
    expect(sceneProblems(SCENES.map(scene).join(''), SCENES)).toEqual([]);
  });

  it('yer tutucuyla çıkmış sahneyi bildirir', () => {
    const html = SCENES.slice(1).map(scene).join('') + '<div class="scene-media" data-scene="hero"><div class="scene-placeholder"></div></div>';
    const problems: string[] = sceneProblems(html, SCENES);
    expect(problems.filter((problem) => problem.includes('"hero"'))).toHaveLength(1);
    expect(problems.some((problem) => problem.includes('"qr-menu"'))).toBe(false);
  });

  it('hiç çıkmamış sahneyi bildirir', () => {
    expect(sceneProblems(SCENES.slice(0, 4).map(scene).join(''), SCENES).join(' ')).toContain('closing');
  });

  it('sayfada yer tutucu kalmışsa bildirir', () => {
    expect(sceneProblems(SCENES.map(scene).join('') + '<div class="scene-placeholder"></div>', SCENES).length).toBeGreaterThan(0);
  });
});
