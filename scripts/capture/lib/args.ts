/** Pure helpers for the capture CLI (locale + output naming), kept apart so they can be unit-tested. */
export const LOCALES = ['en', 'fr', 'de', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];

/** Playwright context locale for each app locale code. */
export const BROWSER_LOCALE: Record<Locale, string> = { en: 'en-US', fr: 'fr-FR', de: 'de-DE', zh: 'zh-CN' };

/** Validates --locale. Returns the code, or an error message. */
export function parseLocale(value: string | undefined): { locale: Locale } | { error: string } {
	const v = value ?? 'en';
	return (LOCALES as readonly string[]).includes(v) ? { locale: v as Locale } : { error: `--locale must be one of ${LOCALES.join(', ')}` };
}

/** `<shot>.<theme>.webp`, or `<shot>.<locale>.<theme>.webp` when --locale was passed explicitly. */
export function shotFileName(shot: string, theme: string, explicitLocale?: Locale): string {
	return explicitLocale ? `${shot}.${explicitLocale}.${theme}.webp` : `${shot}.${theme}.webp`;
}

/** `<shot>.json`, or `<shot>.<locale>.json` when --locale was passed explicitly (one JSON per locale). */
export function shotJsonName(shot: string, explicitLocale?: Locale): string {
	return explicitLocale ? `${shot}.${explicitLocale}.json` : `${shot}.json`;
}
