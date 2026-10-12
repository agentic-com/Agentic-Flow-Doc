import { describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { ogPageKey } from '../../src/i18n/og-key';
import { ogFamilies, ogFonts } from '../../src/i18n/og-fonts';

describe('ogFonts', () => {
	test('Latin pages only load Geist', () => {
		expect(ogFonts('fr').every((f) => f.includes('geist'))).toBe(true);
		expect(ogFamilies('de')).toEqual(['Geist']);
	});
	test('Chinese pages add Noto Sans SC files that exist', () => {
		const fonts = ogFonts('zh-CN');
		const cjk = fonts.filter((f) => f.includes('noto-sans-sc'));
		expect(cjk).toHaveLength(2);
		for (const f of fonts) expect(existsSync(f)).toBe(true);
		expect(ogFamilies('zh-CN')).toEqual(['Geist', 'Noto Sans SC Thin']);
	});
});

describe('ogPageKey', () => {
	test('maps route ids to image keys', () => {
		expect(ogPageKey('')).toBe('index');
		expect(ogPageKey('app/x/')).toBe('app/x');
		expect(ogPageKey('fr')).toBe('fr');
		expect(ogPageKey('zh-cn')).toBe('zh-cn');
		expect(ogPageKey('fr/app/x')).toBe('fr/app/x');
	});
});
