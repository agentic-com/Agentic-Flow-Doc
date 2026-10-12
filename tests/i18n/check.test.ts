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

describe('R6 text/structural classification', () => {
	test('Badge text translated passes; changing variant fails', () => {
		const en = structureOf('<Badge text="Free" variant="neutral" />\n', EN_PATH);
		expect(compareStructures(en, structureOf('<Badge text="Gratuit" variant="neutral" />\n', FR_PATH))).toEqual([]);
		expect(compareStructures(en, structureOf('<Badge text="Gratuit" variant="new" />\n', FR_PATH))).toHaveLength(1);
	});

	test('steps text keys (when, example, note, meta, double/single/template quoted) may be translated', () => {
		const en = structureOf(
			'<Cards cards={[{ title: "Loop", icon: "loop", when: "Repeat.", example: `Click`, note: \'Hi\', meta: "A · B" }]} />\n',
			EN_PATH,
		);
		const ok = structureOf(
			'<Cards cards={[{ title: "Boucle", icon: "loop", when: "Répéter.", example: `Cliquer`, note: \'Salut\', meta: "A · B" }]} />\n',
			FR_PATH,
		);
		expect(compareStructures(en, ok)).toEqual([]);
	});

	test('a structural key changed inside steps fails', () => {
		const en = structureOf('<X steps={[{ spot: "a", title: "T", kind: "data" }]} />\n', EN_PATH);
		expect(compareStructures(en, structureOf('<X steps={[{ spot: "b", title: "U", kind: "data" }]} />\n', FR_PATH))).toHaveLength(1);
		expect(compareStructures(en, structureOf('<X steps={[{ spot: "a", title: "U", kind: "flow" }]} />\n', FR_PATH))).toHaveLength(1);
	});

	test('non-literal values under a text key are compared as written', () => {
		const en = structureOf('<X steps={[{ title: t1 }]} />\n', EN_PATH);
		expect(compareStructures(en, structureOf('<X steps={[{ title: t2 }]} />\n', FR_PATH))).toHaveLength(1);
	});

	test('esm mismatch names the differing specifier', () => {
		const en = structureOf("import a from '@components/awflow';\n", EN_PATH);
		const fr = structureOf("import a from '@components/other';\n", FR_PATH);
		expect(compareStructures(en, fr)[0].message).toContain('"@components/other"');
	});

	test('every attribute name and expression key in the English corpus is classified', async () => {
		const { Glob } = await import('bun');
		const { collectNames, TEXT_PROPS, STRUCTURAL_PROPS, TEXT_KEYS, STRUCTURAL_KEYS } = await import('../../scripts/i18n/structure');
		const attrOk = new Set([...TEXT_PROPS, ...STRUCTURAL_PROPS]);
		const keyOk = new Set([...TEXT_KEYS, ...STRUCTURAL_KEYS]);
		const missing: string[] = [];
		for await (const f of new Glob('src/content/docs/**/*.{md,mdx}').scan('.')) {
			if (/^src\/content\/docs\/(fr|de|zh-cn)\//.test(f)) continue;
			const { attrs, keys } = collectNames(readFileSync(f, 'utf8'));
			for (const a of attrs) if (!attrOk.has(a)) missing.push(`attribute "${a}" (${f})`);
			for (const k of keys) if (!keyOk.has(k)) missing.push(`key "${k}" (${f})`);
		}
		expect([...new Set(missing)].slice(0, 20)).toEqual([]);
	});
});
