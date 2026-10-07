import { describe, expect, it } from 'vitest';
import { getConceptProjects, getHome, getProject, getProjects } from '../src/content';
import { LOCALES } from '../src/i18n/locales';

describe.each(LOCALES)('içerik (%s)', (locale) => {
  it('gerçek projeler üçtür ve hepsi gerçek olarak işaretlidir', () => {
    expect(getProjects(locale).map((project) => project.id)).toEqual(['qr-menu', 'lobby', 'agency']);
    expect(getProjects(locale).every((project) => project.kind === 'real')).toBe(true);
  });

  it('konsept proje ayrı listededir', () => {
    expect(getConceptProjects(locale).map((project) => project.id)).toEqual(['helpdesk']);
    expect(getConceptProjects(locale).every((project) => project.kind === 'concept')).toBe(true);
  });

  it('getProject konsept projeyi de bulur', () => {
    expect(getProject('helpdesk', locale).kind).toBe('concept');
  });

  it('hero metni konsept projeyi saymaz: üç araçtan söz eder', () => {
    expect(getHome(locale).hero.lead).toMatch(locale === 'tr' ? /üç ara/ : /three tools/);
  });
});

describe('iki dilde aynı alanlar', () => {
  it('konsept projenin alanları iki dilde de doludur', () => {
    const tr = getProject('helpdesk', 'tr');
    const en = getProject('helpdesk', 'en');
    expect(Object.keys(tr).sort()).toEqual(Object.keys(en).sort());
    for (const project of [tr, en]) {
      for (const text of [project.title, project.summary, project.sceneProblem, project.sceneResult, project.problem, project.solution, project.outcome, project.demoNote, project.sceneAlt]) {
        expect(text.trim().length).toBeGreaterThan(10);
      }
    }
  });

  it('konsept projenin durum metni gerçek kullanım iddia etmez', () => {
    expect(getProject('helpdesk', 'tr').outcome).toMatch(/kullanılmadı/);
    expect(getProject('helpdesk', 'en').outcome).toMatch(/not used/);
  });
});
