/**
 * Interface strings for components (spec §1).
 *   .astro:  const t = useT(Astro);            t('header.install')
 *   Svelte:  let { lang = 'en' } = $props();  const t = $derived(createT(lang));
 */
import { localizeHref, toLang, type Lang } from './locales';
import en from './ui/en';
import fr from './ui/fr';
import de from './ui/de';
import zh from './ui/zh-cn';
import type { Dict, UIKey } from './ui/types';

export type { Dict, UIKey };
type Vars = Record<string, string | number>;

const DICTS: Record<Lang, Dict> = { en, fr, de, 'zh-CN': zh };

const fill = (s: string, vars?: Vars) => (vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s);

export interface T {
	(key: UIKey, vars?: Vars): string;
	lang: Lang;
	plural(base: string, n: number, vars?: Vars): string;
	date(iso: string, opts?: Intl.DateTimeFormatOptions): string;
	href(href: string): string;
}

export function createT(lang?: Lang | string | null): T {
	const l = toLang(lang);
	const dict = DICTS[l];
	const t = ((key: UIKey, vars?: Vars) => fill(dict[key] ?? en[key] ?? key, vars)) as T;
	t.lang = l;
	t.plural = (base, n, vars) => {
		const cat = new Intl.PluralRules(l).select(n);
		const key = (`${base}_${cat}` in dict ? `${base}_${cat}` : `${base}_other`) as UIKey;
		return t(key, { count: n, ...vars });
	};
	// English keeps the British date format the docs already use (11 October 2026).
	t.date = (iso, opts = { day: 'numeric', month: 'long', year: 'numeric' }) =>
		new Date(`${iso}T00:00:00Z`).toLocaleDateString(l === 'en' ? 'en-GB' : l, { timeZone: 'UTC', ...opts });
	t.href = (href) => localizeHref(href, l);
	return t;
}

/** Language of the page being rendered (Starlight route data; `en` outside Starlight routes). */
export function pageLang(astro: { locals: unknown }): Lang {
	const route = (astro.locals as { starlightRoute?: { lang?: string } }).starlightRoute;
	return toLang(route?.lang);
}

export const useT = (astro: { locals: unknown }) => createT(pageLang(astro));
