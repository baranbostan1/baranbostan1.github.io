// Sayfa çizilmeden önce çalışan satır içi betik (Base.astro), mod kararını mode.ts'ten bağımsız bir kopyayla verir.
// Bu test iki kopyanın her koşulda aynı sonucu verdiğini doğrular; biri değişip diğeri unutulursa kırılır.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { pickMode, WIDE_MIN_WIDTH, type Env } from '../src/cinematic/mode';

const source = readFileSync(new URL('../src/layouts/Base.astro', import.meta.url), 'utf8');
const inlineScript = /<script is:inline>([\s\S]*?)<\/script>/.exec(source)?.[1];

function runInline(env: Env): string | undefined {
  if (!inlineScript) throw new Error('Base.astro içinde satır içi betik bulunamadı');
  const queries: Record<string, boolean> = {
    '(prefers-reduced-motion: reduce)': env.reducedMotion,
    [`(min-width: ${WIDE_MIN_WIDTH}px)`]: env.wide,
    '(hover: hover) and (pointer: fine)': env.finePointer,
  };
  const dataset: Record<string, string> = {};
  const fakeWindow = {
    matchMedia: (query: string) => {
      if (!(query in queries)) throw new Error(`beklenmeyen medya sorgusu: ${query}`);
      return { matches: queries[query] };
    },
    setTimeout: () => 0,
  };
  const fakeNavigator = { connection: { saveData: env.saveData } };
  const fakeDocument = { documentElement: { dataset, hasAttribute: () => false } };
  new Function('window', 'navigator', 'document', inlineScript)(fakeWindow, fakeNavigator, fakeDocument);
  return dataset.cine;
}

const bools = [false, true];
const ALL_ENVS: Env[] = bools.flatMap((reducedMotion) =>
  bools.flatMap((saveData) => bools.flatMap((finePointer) => bools.map((wide) => ({ reducedMotion, saveData, finePointer, wide })))),
);

describe('Base.astro satır içi mod betiği', () => {
  it.each(ALL_ENVS)('mode.ts ile aynı kararı verir: %o', (env) => {
    expect(runInline(env)).toBe(pickMode(env));
  });
});
