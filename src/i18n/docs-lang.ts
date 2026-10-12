/** The reader's docs language choice (header picker), remembered in this browser only. */
import { LANGS, type Lang } from './locales';

export const DOCS_LANG_KEY = 'awf:docs-lang';
type Store = { getItem(k: string): string | null; setItem?(k: string, v: string): void } | null | undefined;
const defaultStore = (): Store => {
	try {
		return globalThis.localStorage;
	} catch {
		return null;
	}
};

export function readDocsLang(storage: Store = defaultStore()): Lang | null {
	try {
		const v = storage?.getItem(DOCS_LANG_KEY);
		return v && (LANGS as readonly string[]).includes(v) ? (v as Lang) : null;
	} catch {
		return null;
	}
}

export function saveDocsLang(lang: Lang, storage: Store = defaultStore()): void {
	try {
		storage?.setItem?.(DOCS_LANG_KEY, lang);
	} catch {
		/* private mode or blocked storage: the choice just isn't remembered */
	}
}
