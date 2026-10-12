import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { Glob } from 'bun';
import { englishHeadings } from '../../src/i18n/markdown/english-headings';

const hasDist = existsSync('dist/index.html');

describe.skipIf(!hasDist)('English heading ids match the build', () => {
	test('every English page', async () => {
		const mismatches: string[] = [];
		for await (const file of new Glob('src/content/docs/**/*.{md,mdx}').scan('.')) {
			if (/^src\/content\/docs\/(fr|de|zh-cn)\//.test(file)) continue;
			const id = file.replace(/^src\/content\/docs\//, '').replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '');
			const html = `dist/${id ? id + '/' : ''}index.html`;
			if (!existsSync(html)) continue;
			const built = [...readFileSync(html, 'utf8').matchAll(/<h([1-6])[^>]*\sid="([^"]+)"/g)]
				.map((m) => m[2])
				.filter((x) => x !== '_top' && x !== 'starlight__on-this-page');
			const ours = (await englishHeadings(readFileSync(file, 'utf8'), file.endsWith('.mdx') ? 'mdx' : 'md')).map((h) => h.slug);
			const missing = ours.filter((s) => !built.includes(s));
			if (missing.length) mismatches.push(`${file}: ${missing.join(', ')}`);
		}
		expect(mismatches).toEqual([]);
	});
});
