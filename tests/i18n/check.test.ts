import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { compareStructures, structureOf } from '../../scripts/i18n/structure';

// Fixture files live in tests/, but the paths passed to structureOf mimic the docs tree:
// a translated page sits one folder deeper than its English source (ruling R5).
const EN_PATH = 'src/content/docs/get-started/page.mdx';
const FR_PATH = 'src/content/docs/fr/get-started/page.mdx';
const read = (p: string, as: string) => structureOf(readFileSync(`tests/fixtures/i18n/${p}/page.mdx`, 'utf8'), as);

describe('i18n:check', () => {
	test('a faithful translation passes', () => {
		expect(compareStructures(read('en', EN_PATH), read('fr-ok', FR_PATH))).toEqual([]);
	});

	test('each structural change is reported with a line', () => {
		const diffs = compareStructures(read('en', EN_PATH), read('fr-bad', FR_PATH));
		const messages = diffs.map((d) => d.message).join('\n');
		expect(messages).toContain('heading');
		expect(messages).toContain('shot');
		expect(messages).toContain('/app/connections/slack/');
		expect(messages).toContain('recipe.minutes');
		expect(messages).toContain('$json.text');
		for (const d of diffs) expect(d.line).toBeGreaterThan(0);
	});

	test('reported lines are file lines (frontmatter offset applied)', () => {
		const src = readFileSync('tests/fixtures/i18n/fr-bad/page.mdx', 'utf8').split('\n');
		const diffs = compareStructures(read('en', EN_PATH), read('fr-bad', FR_PATH));
		const at = (needle: string) => src.findIndex((l) => l.includes(needle)) + 1;
		expect(diffs.find((d) => d.message.startsWith('heading'))?.line).toBe(at('### Avant'));
		expect(diffs.find((d) => d.message.startsWith('link'))?.line).toBe(at('/fr/app/connections'));
		expect(diffs.find((d) => d.message.startsWith('inlineCode'))?.line).toBe(at('json.texte'));
	});

	test('relative imports compare equal once resolved against each file directory (R5)', () => {
		const en = structureOf("import a from '../../data/stores';\n", EN_PATH);
		const fr = structureOf("import a from '../../../data/stores';\n", FR_PATH);
		expect(compareStructures(en, fr)).toEqual([]);
		const wrong = structureOf("import a from '../../data/stores';\n", FR_PATH);
		expect(compareStructures(en, wrong).map((d) => d.message).join()).toContain('esm');
	});

	test('alias imports compare as written', () => {
		const en = structureOf("import { A } from '@components/awflow';\n", EN_PATH);
		const fr = structureOf("import { A } from '@components/other';\n", FR_PATH);
		expect(compareStructures(en, fr)).toHaveLength(1);
	});

	test('text inside expression props may change; other keys may not', () => {
		const en = structureOf("<GuidedShot spots={[{ spot: 'save', label: 'Save' }]} />\n", EN_PATH);
		const ok = structureOf("<GuidedShot spots={[{ spot: 'save', label: 'Enregistrer' }]} />\n", FR_PATH);
		const bad = structureOf("<GuidedShot spots={[{ spot: 'enregistrer', label: 'Enregistrer' }]} />\n", FR_PATH);
		expect(compareStructures(en, ok)).toEqual([]);
		expect(compareStructures(en, bad)).toHaveLength(1);
	});
});
