import { describe, expect, test } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { mdxToJs } from 'satteri';
import { englishHeadings, translatedInfo } from '../../src/i18n/markdown/english-headings';
import { i18nHeadingIds } from '../../src/i18n/markdown/heading-ids';
import { i18nLinks } from '../../src/i18n/markdown/links';

const root = mkdtempSync(join(tmpdir(), 'awf-i18n-'));
const docs = join(root, 'src/content/docs');
mkdirSync(join(docs, 'fr/app'), { recursive: true });
mkdirSync(join(docs, 'app'), { recursive: true });
writeFileSync(join(docs, 'app/page.mdx'), '# T\n\n## Before you start\n\n### Google\n\n## Use it\n');
writeFileSync(
	join(docs, 'fr/app/page.mdx'),
	'# T\n\n## Avant de commencer\n\n### Google\n\n## Utilisation\n\n[Slack](/app/connections/slack/) [fichier](/examples/a.awf) [ancre](/app/x/#google)\n',
);

const compile = async (file: string) =>
	String(
		(
			await mdxToJs(await Bun.file(file).text(), {
				fileURL: pathToFileURL(file),
				hastPlugins: [i18nLinks, i18nHeadingIds],
			})
		).code,
	);

describe('englishHeadings', () => {
	test('slugs in order', async () => {
		expect(await englishHeadings('# T\n\n## Before you start\n\n### Google\n\n## Use it\n', 'mdx')).toEqual([
			{ depth: 1, slug: 't' },
			{ depth: 2, slug: 'before-you-start' },
			{ depth: 3, slug: 'google' },
			{ depth: 2, slug: 'use-it' },
		]);
	});
	test('translatedInfo', () => {
		expect(translatedInfo(pathToFileURL(join(docs, 'app/page.mdx')))).toBeNull();
		expect(translatedInfo(pathToFileURL(join(docs, 'fr/app/page.mdx')))).toEqual({
			lang: 'fr',
			englishPath: join(docs, 'app/page.mdx'),
		});
	});
});

describe('plugins on a French page', () => {
	test('heading ids come from English by position', async () => {
		const code = await compile(join(docs, 'fr/app/page.mdx'));
		expect(code).toContain('before-you-start');
		expect(code).toContain('use-it');
		expect(code).not.toContain('avant-de-commencer');
	});
	test('English ids win over ids set by an earlier plugin (starlight-heading-badges runs first)', async () => {
		const file = join(docs, 'fr/app/page.mdx');
		const earlier = {
			name: 'translated-slugs',
			element: {
				filter: ['h1', 'h2', 'h3'],
				visit: (n: any, c: any) => c.setProperty(n, 'id', 'fr-' + c.textContent(n).toLowerCase().replaceAll(' ', '-')),
			},
		};
		const code = String(
			(await mdxToJs(await Bun.file(file).text(), { fileURL: pathToFileURL(file), hastPlugins: [earlier, i18nHeadingIds] } as any)).code,
		);
		expect(code).toContain('before-you-start');
		expect(code).toContain('use-it');
		expect(code).not.toContain('fr-avant-de-commencer');
	});
	test('internal page links are localized, files and anchors kept', async () => {
		const code = await compile(join(docs, 'fr/app/page.mdx'));
		expect(code).toContain('/fr/app/connections/slack/');
		expect(code).toContain('"/examples/a.awf"');
		expect(code).toContain('/fr/app/x/#google');
	});
	test('English pages are untouched', async () => {
		const code = await compile(join(docs, 'app/page.mdx'));
		// Satteri alone assigns no ids (Astro's built-in plugin does, later), so nothing is set here.
		expect(code).not.toContain('before-you-start');
		expect(code).not.toContain('id:');
	});
});

describe('englishHeadings parity with Astro heading ids', () => {
	test('mdx expression text is included like textContent', async () => {
		expect(await englishHeadings('## {1+1} x\n', 'mdx')).toEqual([{ depth: 2, slug: '11-x' }]);
	});
	test('smart punctuation and gfm are on', async () => {
		const [h] = await englishHeadings('## It\'s "quoted" ~~gone~~\n', 'mdx');
		// compare with Astro's own plugin
		const { satteriHeadingIdsPlugin } = await import('@astrojs/markdown-satteri');
		let id = '';
		const probe = { name: 'probe', element: { filter: ['h2'], visit: (n: any) => { id = n.properties.id; } } };
		await mdxToJs('## It\'s "quoted" ~~gone~~\n', {
			features: { gfm: true, smartPunctuation: true, rawHtml: true },
			hastPlugins: [satteriHeadingIdsPlugin(), probe],
		} as any);
		expect(h.slug).toBe(id);
	});
	test('expression heading equals Astro id', async () => {
		const { satteriHeadingIdsPlugin } = await import('@astrojs/markdown-satteri');
		let id = '';
		const probe = { name: 'probe', element: { filter: ['h2'], visit: (n: any) => { id = n.properties.id; } } };
		await mdxToJs('## {1+1} x\n', { hastPlugins: [satteriHeadingIdsPlugin(), probe] } as any);
		expect(id).toBe('11-x');
	});
});
