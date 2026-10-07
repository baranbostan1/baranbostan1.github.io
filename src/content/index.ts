import type { Locale } from '../i18n/locales';
import { cv as cvEn } from './cv.en';
import { cv as cvTr } from './cv.tr';
import { home as homeEn } from './home.en';
import { home as homeTr } from './home.tr';
import { projects as projectsEn } from './projects.en';
import { projects as projectsTr } from './projects.tr';
import type { CvContent, HomeContent, ProjectContent, ProjectId } from './types';

const HOME: Record<Locale, HomeContent> = { tr: homeTr, en: homeEn };
const PROJECTS: Record<Locale, readonly ProjectContent[]> = { tr: projectsTr, en: projectsEn };

const CV: Record<Locale, CvContent> = { tr: cvTr, en: cvEn };

export function getCv(locale: Locale): CvContent {
  return CV[locale];
}

export function getHome(locale: Locale): HomeContent {
  return HOME[locale];
}

export function getProjects(locale: Locale): readonly ProjectContent[] {
  return PROJECTS[locale];
}

export function getProject(id: ProjectId, locale: Locale): ProjectContent {
  const project = PROJECTS[locale].find((item) => item.id === id);
  if (!project) throw new Error(`İçerik bulunamadı: ${id} (${locale})`);
  return project;
}
