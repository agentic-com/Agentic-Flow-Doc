import { describe, expect, test } from 'bun:test';
import en from '../../src/i18n/ui/en';
import fr from '../../src/i18n/ui/fr';
import de from '../../src/i18n/ui/de';
import zh from '../../src/i18n/ui/zh-cn';
import { createT } from '../../src/i18n/ui';

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe('dictionary completeness', () => {
	for (const [name, dict] of [['fr', fr], ['de', de], ['zh-cn', zh]] as const) {
		test(`${name} has exactly the English keys`, () => {
			expect(Object.keys(dict).sort()).toEqual(Object.keys(en).sort());
		});
		test(`${name} keeps every placeholder`, () => {
			for (const key of Object.keys(en) as (keyof typeof en)[]) {
				expect({ key, p: placeholders(dict[key]) }).toEqual({ key, p: placeholders(en[key]) });
			}
		});
		test(`${name} has no empty strings`, () => {
			for (const [key, value] of Object.entries(dict)) expect({ key, empty: value.trim() === '' }).toEqual({ key, empty: false });
		});
	}
	test('French puts a non-breaking space before : ; ? !', () => {
		for (const [key, value] of Object.entries(fr)) {
			const bad = /[^  \s{}][:;?!](\s|$)/.test(value.replace(/https?:\/\/\S+/g, ''));
			expect({ key, bad }).toEqual({ key, bad: false });
		}
	});
});

describe('createT', () => {
	test('looks up, interpolates, falls back to English for unknown langs', () => {
		const t = createT('fr');
		expect(t.lang).toBe('fr');
		expect(t('common.minutes', { n: 5 })).toBe(fr['common.minutes'].replace('{n}', '5'));
		expect(createT('es')('common.minutes', { n: 5 })).toBe(en['common.minutes'].replace('{n}', '5'));
	});
	test('plural picks the CLDR category', () => {
		expect(createT('en').plural('common.lessons', 1)).toBe('1 lesson');
		expect(createT('en').plural('common.lessons', 3)).toBe('3 lessons');
		expect(createT('zh-CN').plural('common.lessons', 1)).toBe(zh['common.lessons_other'].replace('{count}', '1'));
	});
	test('date uses the page language', () => {
		expect(createT('en').date('2026-10-11')).toBe('11 October 2026');
		expect(createT('fr').date('2026-10-11')).toBe('11 octobre 2026');
		expect(createT('de').date('2026-10-11')).toBe('11. Oktober 2026');
		expect(createT('zh-CN').date('2026-10-11')).toBe('2026年10月11日');
	});
	test('href localizes', () => {
		expect(createT('de').href('/app/')).toBe('/de/app/');
	});
});
