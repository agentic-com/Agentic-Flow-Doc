import { describe, expect, test } from 'bun:test';
import { BROWSER_LOCALE, parseLocale, shotFileName, shotJsonName } from './args.ts';

describe('capture args', () => {
	test('parseLocale defaults to en and accepts the four locales', () => {
		expect(parseLocale(undefined)).toEqual({ locale: 'en' });
		for (const l of ['en', 'fr', 'de', 'zh']) expect(parseLocale(l)).toEqual({ locale: l as 'en' });
	});
	test('parseLocale rejects anything else', () => {
		expect('error' in parseLocale('es')).toBe(true);
		expect('error' in parseLocale('')).toBe(true);
	});
	test('browser locales', () => {
		expect(BROWSER_LOCALE).toEqual({ en: 'en-US', fr: 'fr-FR', de: 'de-DE', zh: 'zh-CN' });
	});
	test('file names keep the legacy form without an explicit locale', () => {
		expect(shotFileName('home', 'dark')).toBe('home.dark.webp');
		expect(shotJsonName('home')).toBe('home.json');
	});
	test('file names include the locale when explicit (even en)', () => {
		expect(shotFileName('home', 'dark', 'fr')).toBe('home.fr.dark.webp');
		expect(shotFileName('home', 'light', 'en')).toBe('home.en.light.webp');
		expect(shotJsonName('home', 'zh')).toBe('home.zh.json');
	});
});
