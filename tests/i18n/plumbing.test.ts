import { describe, expect, test } from 'bun:test';
import { groupFor, SEARCH_GROUPS } from '../../plugins/starlight-awflow/lib/search';
import { levelInfo } from '../../plugins/starlight-awflow/lib/levels';
import { createT } from '../../src/i18n/ui';

describe('search groups', () => {
	test('match after the locale prefix', () => {
		expect(groupFor('/fr/recipes/monitor-pages/x/')).toBe('recipes');
		expect(groupFor('https://docs.awflow.io/zh-cn/app/troubleshooting/x/')).toBe('fix');
		expect(groupFor('/de/nodes/builtin/flow/if/')).toBe('nodes');
		expect(groupFor('/recipes/')).toBe('recipes');
	});
	test('labels come from the dictionary', () => {
		for (const g of SEARCH_GROUPS) expect(createT('fr')(g.labelKey)).not.toBe('');
	});
});

describe('levels', () => {
	test('localized title and href', () => {
		expect(levelInfo(2, 'fr').href).toBe('/fr/get-started/working-with-data/');
		expect(levelInfo(2, 'fr').title).toBe(createT('fr')('level.2.title'));
		expect(levelInfo(1).href).toBe('/get-started/learning-path/');
		expect(levelInfo(9, 'de').title).toBe(createT('de')('level.fallback', { n: 9 }));
	});
});
