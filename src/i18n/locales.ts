/**
 * Docs languages (spec 2026-10-11-docs-i18n-design.md §1). English is the root locale and keeps
 * today's URLs; translations live under /fr/, /de/ and /zh-cn/ with English slugs.
 * No Astro imports: used by astro.config.mjs, scripts, plugins and Svelte islands.
 */
export type Lang = 'en' | 'fr' | 'de' | 'zh-CN';
export type Prefix = '' | 'fr' | 'de' | 'zh-cn';

export const LOCALES = [
	{ lang: 'en', prefix: '', label: 'English' },
	{ lang: 'fr', prefix: 'fr', label: 'Français' },
	{ lang: 'de', prefix: 'de', label: 'Deutsch' },
	{ lang: 'zh-CN', prefix: 'zh-cn', label: '简体中文' },
] as const satisfies readonly { lang: Lang; prefix: Prefix; label: string }[];

export const TRANSLATED_PREFIXES = ['fr', 'de', 'zh-cn'] as const;
export const LANGS: readonly Lang[] = LOCALES.map((l) => l.lang);

/** Any language code (app `zh`, browser `fr-CA`, route `zh-CN`) → a docs language; unknown → English. */
export function toLang(value: string | undefined | null): Lang {
	const v = (value ?? '').toLowerCase();
	if (v === 'zh' || v.startsWith('zh-')) return 'zh-CN';
	const base = v.split('-')[0];
	return base === 'fr' || base === 'de' ? base : 'en';
}

export const prefixOf = (lang: Lang): Prefix => LOCALES.find((l) => l.lang === lang)?.prefix ?? '';

const PREFIX_RE = /^\/?(fr|de|zh-cn)(?=\/|$)/;

/** Language of a URL path or a content id (`fr/app/x`). */
export function langFromPath(path: string): Lang {
	const m = PREFIX_RE.exec(path);
	return m ? toLang(m[1]) : 'en';
}

/** Removes the locale segment, keeping the leading/trailing slash style of the input. */
export function stripLocale(path: string): string {
	const m = PREFIX_RE.exec(path);
	if (!m) return path;
	const rest = path.slice(m[0].length);
	if (path.startsWith('/')) return rest === '' ? '/' : rest;
	return rest.replace(/^\//, '');
}

/** Root paths that are files or machine endpoints, never pages: they exist once, unprefixed. */
const NOT_PAGES = /^\/(og|examples|_astro|pagefind)\/|^\/releases\/rss\.xml$|^\/recipes\/listings\.json$/;
const HAS_EXTENSION = /\/[^/]+\.[a-z0-9]+$/i;

/** Internal absolute page link → the same page in `lang`. Everything else is returned unchanged. */
export function localizeHref(href: string, lang: Lang): string {
	const prefix = prefixOf(lang);
	if (!prefix || !href.startsWith('/') || href.startsWith('//')) return href;
	const cut = href.search(/[?#]/);
	const path = cut === -1 ? href : href.slice(0, cut);
	const tail = cut === -1 ? '' : href.slice(cut);
	if (PREFIX_RE.test(path) || NOT_PAGES.test(path) || HAS_EXTENSION.test(path)) return href;
	return `/${prefix}${path}${tail}`;
}
