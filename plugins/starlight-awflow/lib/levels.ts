/**
 * Learning-path levels (awflow/Agentic-Flow#1341). Lessons opt in with
 * `kind: lesson` + `lesson: { level, order, minutes }` frontmatter; this file only names the levels
 * and points at each level's landing page, which the lesson rail links to as "next level".
 * Titles come from the UI dictionary (`level.<n>.title`) so they follow the page language.
 */
import { localizeHref, type Lang } from '../../../src/i18n/locales';
import { createT, type UIKey } from '../../../src/i18n/ui';

export interface LearningLevel {
	level: number;
	title: string;
	href: string;
}

const LEVELS: { level: number; href: string }[] = [
	{ level: 1, href: '/get-started/learning-path/' },
	{ level: 2, href: '/get-started/working-with-data/' },
	{ level: 3, href: '/get-started/agents-and-knowledge/' },
];

export const hasLevel = (n: number) => LEVELS.some((l) => l.level === n);

export const levelInfo = (level: number, lang: Lang = 'en'): LearningLevel => {
	const t = createT(lang);
	const found = LEVELS.find((l) => l.level === level);
	return {
		level,
		title: found ? t(`level.${level}.title` as UIKey) : t('level.fallback', { n: level }),
		href: localizeHref(found?.href ?? '/get-started/learning-path/', lang),
	};
};
