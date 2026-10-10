/**
 * Open Graph images, one per docs page, in brand style (awflow/Agentic-Flow#1330).
 * Served at /og/<page-id>.png; the starlight-awflow middleware adds the og:image meta tags.
 */
import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';
import awflow from 'virtual:starlight-awflow/config';

const hexToRgb = (hex: string): [number, number, number] => {
	const n = parseInt(hex.replace('#', ''), 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const trim = (s: string) => s.replace(/^\/+|\/+$/g, '');

const entries = await getCollection('docs');
const pages = Object.fromEntries(entries.map(({ id, data }) => [id === '' ? 'index' : id, data]));

const sectionFor = (id: string, section?: string) =>
	awflow.sections.find((s) => s.id === section) ??
	awflow.sections.find((s) => [s.link, s.topic ?? '', ...s.match].some((p) => trim(p) && id.startsWith(trim(p))));

export const { getStaticPaths, GET } = await OGImageRoute({
	pages,
	getImageOptions: (id, page: (typeof entries)[number]['data']) => {
		const accent = sectionFor(id, page.section)?.color ?? '#B45309';
		return {
			title: page.title,
			description: page.description,
			logo: { path: './src/assets/logo.png', size: [72] },
			bgGradient: [hexToRgb('#FFFBF5'), hexToRgb('#FFF3E3')],
			border: { color: hexToRgb(accent), width: 24, side: 'inline-start' },
			padding: 72,
			font: {
				title: { families: ['Geist'], weight: 'Bold', size: 68, lineHeight: 1.1, color: hexToRgb('#1C1917') },
				description: { families: ['Geist'], size: 34, lineHeight: 1.4, color: hexToRgb('#57534E') },
			},
			fonts: ['./node_modules/@fontsource/geist/files/geist-latin-700-normal.woff', './node_modules/@fontsource/geist/files/geist-latin-400-normal.woff'],
		};
	},
});
